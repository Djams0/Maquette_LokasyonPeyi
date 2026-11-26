import {test,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {createApi} from '../../api/server.mjs';
import {auditFixture} from '../../api/audit-fixture.mjs';
let target,client,admin,children=[];
test.beforeEach(async()=>{
  const allowedOrigins=new Set();target=createApi({initialize:auditFixture,allowedOrigins});await new Promise(r=>target.server.listen(0,'127.0.0.1',r));const api=`http://127.0.0.1:${target.server.address().port}`;
  async function web(app){const c=spawn(process.execPath,['scripts/web.mjs',app],{env:{...process.env,PORT:'0',API_URL:api,DEMO_LOOPBACK:'1'},stdio:['ignore','pipe','pipe']});children.push(c);return new Promise((resolve,reject)=>{c.on('error',reject);c.on('exit',code=>reject(Error(`Proxy ${app} arrêté ${code}`)));c.stdout.on('data',data=>{const m=String(data).match(/sur (\d+)/);if(m)resolve(`http://127.0.0.1:${m[1]}`);});});}
  client=await web('client');admin=await web('admin');allowedOrigins.add(client);allowedOrigins.add(admin);
});
test.afterEach(async()=>{children.forEach(c=>c.kill());children=[];if(target)await new Promise(r=>target.server.close(r));});
async function ready(page){await expect(page.locator('#main h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);}
async function login(page,id,internal=false){await page.goto((internal?admin:client)+'/login');await page.getByLabel(internal?'Profil et périmètre':'Compte de démonstration').selectOption(id);await page.getByRole('button',{name:internal?'Ouvrir cet espace':'Entrer dans la démo',exact:true}).click();await page.waitForURL(u=>u.pathname==='/');await ready(page);}
async function fits(page){expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
const visitor=['/search','/faq','/login?next=%2Fprofile'];
const renter=['/search','/rentals','/messages','/profile/documents'];
const owner=['/search','/owner/vehicles','/owner/requests','/profile'];
const mobile=page=>page.getByRole('navigation',{name:'Navigation mobile',exact:true});
const menu=page=>page.getByRole('dialog',{name:'Menu',exact:true});
const trigger=page=>page.getByRole('button',{name:'Ouvrir le menu',exact:true});
async function links(nav,expected,current,min=44) {
  await expect(nav.getByRole('link')).toHaveCount(expected.length);
  const all=await nav.getByRole('link').all();
  for(const a of all){
    const box=await a.boundingBox();
    expect(Math.min(box.width,box.height)).toBeGreaterThanOrEqual(min);
  }
  expect(await nav.getByRole('link').evaluateAll(es=>es.map(e=>e.getAttribute('href')))).toEqual(expected);
  if(current) {
    await expect(nav.locator('[aria-current]')).toHaveCount(1);
    await expect(nav.locator('[aria-current]')).toHaveAttribute('href',current);
  }
}

test('navigation visiteur : trois destinations publiques et next conservé après connexion',async({page},info)=>{
  await page.setViewportSize({width:320,height:844});await page.goto(client);await ready(page);
  const bar=mobile(page);await links(bar,visitor,'/search');
  await bar.getByRole('link',{name:'Compte',exact:true}).click();await page.waitForURL(/login\?next=/);expect(new URL(page.url()).searchParams.get('next')).toBe('/profile');
  await page.goto(client+'/search?q=Gosier');await ready(page);await links(bar,visitor,'/search');
  await trigger(page).click();
  await expect(menu(page).locator('a[href="/rentals"],a[href="/messages"],a[href="/profile/documents"],a[href="/owner/vehicles"],a[href="/cases"]')).toHaveCount(0);
  await info.attach('Visiteur · menu public',{body:await page.screenshot(),contentType:'image/png'});
  await page.keyboard.press('Escape');
  await page.goto(client+'/vehicle/v1?q=Gosier');await ready(page);await links(bar,visitor,'/search');
  await expect(bar).toHaveCSS('position','static');await expect(page.locator('#return-search')).toHaveAttribute('href','/search?q=Gosier');
  await expect(page.locator('#main a[href="/rentals"]')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Contacter le propriétaire',exact:true})).toBeVisible();
  await page.goto(client+'/rentals');await page.waitForURL(/login\?next=/);expect(new URL(page.url()).searchParams.get('next')).toBe('/rentals');await expect(bar).toHaveCount(0);
  await page.getByLabel('Compte de démonstration').selectOption('audit-r02');await page.getByRole('button',{name:'Entrer dans la démo',exact:true}).click();await page.waitForURL(client+'/rentals');await ready(page);await links(bar,renter,'/rentals',56);
  await page.goto(client+'/login?next='+encodeURIComponent('/messages?conversation=audit-chat-001'));await page.getByLabel('Compte de démonstration').selectOption('audit-r09');await page.getByRole('button',{name:'Entrer dans la démo',exact:true}).click();await page.waitForURL(/messages\?conversation=audit-chat-001$/);await ready(page);await expect(bar).toHaveCount(0);await page.getByRole('link',{name:'Retour aux messages',exact:true}).click();await ready(page);await links(bar,renter,'/messages',56);
  await page.goBack();await ready(page);expect(new URL(page.url()).searchParams.get('conversation')).toBe('audit-chat-001');
});

test('navigation responsive : panneau nommé, clavier, focus et changements de largeur',async({page})=>{
  await login(page,'audit-r02');
  for(const width of [320,768,1024,1440]){
    await page.setViewportSize({width,height:844});await page.goto(client);await ready(page);
    const primary=page.getByRole('navigation',{name:width<880?'Navigation mobile':'Navigation principale',exact:true});await links(primary,renter,'/search',width<880?56:44);await fits(page);
    const trigger=page.getByRole('button',{name:'Ouvrir le menu',exact:true});await trigger.focus();await page.keyboard.press('Enter');
    const panel=page.getByRole('dialog',{name:'Menu',exact:true});await expect(panel).toBeVisible();await expect(trigger).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('html')).toHaveCSS('overflow','hidden');
    expect((await panel.boundingBox()).width).toBeLessThanOrEqual(width-20);
    for(const href of ['/search','/profile/documents','/notifications','/profile/reviews','/owner/start','/faq','/assistance','/cases','/demo','/demo/audit','/design-system'])await expect(panel.locator(`a[href="${href}"]`)).toHaveCount(1);
    await panel.getByRole('link').last().focus();await page.keyboard.press('Tab');await expect(panel.getByRole('button',{name:'Fermer le menu',exact:true})).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(panel.getByRole('link').last()).toBeFocused();await page.keyboard.press('Tab');await expect(panel.getByRole('button',{name:'Fermer le menu',exact:true})).toBeFocused();expect(await panel.evaluate(d=>d.contains(document.activeElement))).toBe(true);await page.keyboard.press('Escape');await expect(panel).not.toBeVisible();await expect(trigger).toBeFocused();await expect(trigger).toHaveAttribute('aria-expanded','false');
  }
  await page.setViewportSize({width:320,height:844});await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).click();await page.setViewportSize({width:1440,height:950});await expect(page.getByRole('dialog',{name:'Menu',exact:true})).not.toBeVisible();
  await page.setViewportSize({width:768,height:430});await expect(page.getByRole('navigation',{name:'Navigation mobile',exact:true})).toHaveCSS('position','static');await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).click();expect((await page.getByRole('dialog',{name:'Menu',exact:true}).boundingBox()).height).toBeLessThanOrEqual(406);await page.keyboard.press('Escape');
});

test('navigation propriétaire : profil, parc, sous-navigation et retours dédiés',async({page},info)=>{
  await page.setViewportSize({width:390,height:844});await login(page,'audit-o07');await page.goto(client+'/profile');await ready(page);const bar=mobile(page);await links(bar,owner,'/profile',56);
  await expect(page.locator('#main a[href="/owner/start"]')).toHaveCount(0);
  await page.getByRole('link',{name:'Ouvrir mon espace propriétaire',exact:true}).click();await ready(page);await links(bar,owner,'/owner/vehicles',56);
  await trigger(page).click();const panel=menu(page);
  await expect(panel.locator('a[href="/owner/start"]')).toHaveCount(0);
  for(const href of ['/owner/vehicles','/owner/requests','/rentals','/messages','/profile/documents']) await expect(panel.locator(`a[href="${href}"]`)).toHaveCount(1);
  await info.attach('Propriétaire · menu et parcours locataire',{body:await page.screenshot(),contentType:'image/png'});
  await page.keyboard.press('Escape');
  await bar.getByRole('link',{name:'Demandes',exact:true}).click();await ready(page);
  await expect(page).toHaveURL(client+'/owner/requests');
  await expect(bar).toHaveCount(0);
  await page.getByRole('navigation',{name:'Retour',exact:true}).getByRole('link',{name:'Espace propriétaire',exact:true}).click();await ready(page);
  await bar.getByRole('link',{name:'Mon parc',exact:true}).click();await ready(page);await expect(bar).toHaveCount(0);await expect(page.getByRole('navigation',{name:'Retour',exact:true}).getByRole('link',{name:'Espace propriétaire',exact:true})).toHaveAttribute('href','/owner');
  await page.getByRole('link',{name:'Gérer le véhicule',exact:true}).first().click();await ready(page);await expect(page.getByRole('navigation',{name:'Espace propriétaire',exact:true}).getByRole('link',{name:'Véhicules',exact:true})).toHaveAttribute('aria-current','location');await expect(page.locator('#main').getByRole('link',{name:'Mon parc',exact:false})).toHaveAttribute('href','/owner/vehicles');
  const denied=await page.request.post(client+'/api/v1/owner/vehicles/audit-v02-1/edit',{data:{name:'Autre véhicule fictif',price:20,description:'Modification croisée fictive.'}});expect(denied.status()).toBe(403);
  await page.goto(client+'/notifications');await ready(page);await expect(bar).toHaveCount(0);await page.getByRole('link',{name:'Retour au profil',exact:true}).click();await ready(page);await expect(page.getByRole('heading',{name:'Mon profil',exact:true})).toBeVisible();
  await page.setViewportSize({width:1440,height:900});
  await links(page.getByRole('navigation',{name:'Navigation principale',exact:true}),owner,'/profile');
  await page.goto(client+'/vehicle/audit-v07-1');await ready(page);
  await expect(page.getByRole('link',{name:'Gérer mon annonce',exact:true})).toHaveAttribute('href','/owner/vehicles/audit-v07-1');
  await expect(page.getByRole('button',{name:'Contacter le propriétaire',exact:true})).toHaveCount(0);
  await expect(page.locator('#main a[href="/rentals"]')).toBeVisible();
});

test('navigation de secours : Démo et atelier restaurent la panne simulée',async({page})=>{
  await page.setViewportSize({width:320,height:844});await login(page,'audit-r02');
  for(const path of ['/demo','/demo/audit']){
    await page.evaluate(()=>sessionStorage.setItem('network-demo','error'));await page.goto(client+'/rentals');await expect(page.getByRole('heading',{name:'Impossible de charger cette page',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).click();await page.getByRole('dialog',{name:'Menu',exact:true}).locator(`a[href="${path}"]`).click();await ready(page);expect(new URL(page.url()).pathname).toBe(path);expect(await page.evaluate(()=>sessionStorage.getItem('network-demo'))).toBeNull();
  }
  await page.route('**/api/v1/**',route=>route.abort());await page.goto(client+'/profile');await expect(page.getByRole('heading',{name:'Impossible de charger cette page'})).toBeVisible();await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).click();await expect(page.getByRole('dialog',{name:'Menu',exact:true}).locator('a[href="/demo/audit"]')).toBeVisible();await page.keyboard.press('Escape');await page.unroute('**/api/v1/**');await page.getByRole('button',{name:'Réessayer',exact:true}).click();await ready(page);await expect(page.getByRole('heading',{name:'Mon profil',exact:true})).toBeVisible();
});

test('navigation Admin : périmètre, Échap, suspendu et cookies séparés',async({page})=>{
  await page.setViewportSize({width:320,height:844});await login(page,'audit-r02');await login(page,'audit-a04',true);
  const trigger=page.getByRole('button',{name:'Menu',exact:true});await trigger.click();const nav=page.getByRole('navigation',{name:'Navigation administration',exact:true});await expect(nav.getByRole('link',{name:'Litiges & signalements',exact:true})).toBeVisible();await expect(nav.getByRole('link',{name:'Paiements fictifs',exact:true})).toHaveCount(0);await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(trigger).toHaveAttribute('aria-expanded','false');
  await trigger.click();await page.setViewportSize({width:1440,height:950});await expect(nav).toBeVisible();await page.setViewportSize({width:320,height:844});await expect(trigger).toBeFocused();
  await page.goto(admin+'/payments');await expect(page.getByRole('heading',{name:'Accès limité à votre périmètre'})).toBeVisible();
  expect((await (await page.request.get(client+'/api/v1/me')).json()).id).toBe('audit-r02');
  await page.goto(admin+'/login');await page.getByLabel('Profil et périmètre').selectOption('audit-a10');await page.getByRole('button',{name:'Ouvrir cet espace',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Compte démo indisponible');expect(new URL(page.url()).pathname).toBe('/login');
  await page.setViewportSize({width:1440,height:950});await login(page,'super',true);await expect(page.getByRole('navigation',{name:'Navigation administration',exact:true}).getByRole('link',{name:'Administration',exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'Modération',exact:true})).toHaveCount(0);await fits(page);
});

test('navigation : next externe refusé et accès visiteur aux liens directs protégé',async({page})=>{
  await page.goto(client+'/owner/vehicles?state=demo');await page.waitForURL(/login/);expect(new URL(page.url()).searchParams.get('next')).toBe('/owner/vehicles?state=demo');
  await page.goto(client+'/login?next='+encodeURIComponent(String.raw`/\example.invalid`));await page.getByLabel('Compte de démonstration').selectOption('renter');await page.getByRole('button',{name:'Entrer dans la démo',exact:true}).click();await page.waitForURL(client+'/');await ready(page);
  expect((await (await page.request.get(client+'/api/v1/me')).json()).id).toBe('renter');
  await page.request.delete(client+'/api/v1/session');await page.goto(client+'/profile/documents?state=demo#equipement');await page.waitForURL(/login/);expect(new URL(page.url()).searchParams.get('next')).toBe('/profile/documents?state=demo#equipement');
});

test('navigation : identité tardive ou inconnue préserve le menu public et le catalogue',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.request.post(client+'/api/v1/session',{data:{persona:'audit-o07'}});
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  await page.route('**/api/v1/me',async route=>{await gate;await route.continue().catch(()=>{});});
  try {
    await page.goto(client+'/search',{waitUntil:'commit'});
    await links(mobile(page),visitor,'/search');
    await trigger(page).click();
    const publicLink=menu(page).getByRole('link',{name:'Catalogue des véhicules',exact:true});
    await publicLink.focus();
    release();
    await expect(page.locator('#shell')).toHaveAttribute('data-role','owner');
    await expect(menu(page)).toBeVisible();
    await expect(publicLink).toBeFocused();
    await expect(menu(page).locator('a[href="/owner/vehicles"]')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(trigger(page)).toBeFocused();
    await links(mobile(page),owner,'/search',56);
    await trigger(page).click();
    await expect(menu(page).locator('a[href="/owner/vehicles"]')).toBeVisible();
  } finally {release();}
  await page.unroute('**/api/v1/me');
  await page.route('**/api/v1/me',route=>route.abort());
  await page.goto(client+'/search?q=Gosier');await ready(page);
  await expect(page.locator('#search-items .catalogue-card').first()).toBeVisible();
  await links(mobile(page),visitor,'/search');
  await mobile(page).getByRole('link',{name:'Aide',exact:true}).click();await ready(page);
  await expect(page).toHaveURL(client+'/faq');
  await trigger(page).click();
  await expect(menu(page).locator('a[href="/owner/vehicles"], a[href="/messages"]')).toHaveCount(0);
  await expect(menu(page).locator('a[href="/demo"]')).toBeVisible();
});

test('navigation : bascule Démo, récupération des documents et nouvelle vérification au retour',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  async function change(persona) {
    await page.goto(client+'/demo');
    await page.getByLabel('Profil de démonstration').selectOption(persona);
    await page.getByRole('button',{name:'Ouvrir ce profil',exact:true}).click();
    await page.waitForURL(client+'/');
    await ready(page);
  }
  await change('audit-o07');await links(mobile(page),owner,'/search',56);
  await change('audit-r02');await links(mobile(page),renter,'/search',56);
  await mobile(page).getByRole('link',{name:'Documents',exact:true}).click();await ready(page);
  await expect(page.getByRole('heading',{name:'Vos documents',exact:true})).toBeVisible();
  await expect(mobile(page)).toHaveCount(0);
  await page.goto(client+'/profile');await ready(page);
  await page.request.delete(client+'/api/v1/session');
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  await page.route('**/api/v1/me',async route=>{await gate;await route.continue().catch(()=>{});});
  try {
    await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
    await expect(page.locator('#main')).toBeHidden();
    await expect(mobile(page)).toHaveCount(0);
    release();
    await page.waitForURL(/\/login\?next=/);
    expect(new URL(page.url()).searchParams.get('next')).toBe('/profile');
  } finally {release();}
});

test('navigation : l’ancre publique ferme le menu et place le focus sur la destination',async({page})=>{
  await page.setViewportSize({width:320,height:844});
  await page.goto(client);await ready(page);
  await trigger(page).click();
  await menu(page).getByRole('link',{name:'Comment ça marche',exact:true}).press('Enter');
  await expect(menu(page)).toBeHidden();
  await expect(page).toHaveURL(/#fonctionnement$/);
  await expect(page.locator('#fonctionnement')).toBeFocused();
  await expect(page.locator('#explorer-steps-title')).toBeInViewport();
});

for (const [width,height] of [[390,844],[1440,960]]) {
  test(`R01 à ${width} px : marque, commandes par rôle, racines et retours`,async({page})=>{
    test.setTimeout(120000);
    await page.setViewportSize({width,height});
    const desktop=width===1440;
    const header=page.locator('#shell > header');
    const primary=header.getByRole('navigation',{name:'Navigation principale',exact:true});
    const box=(locator)=>locator.boundingBox();
    const scenarios=[
      ['/login',null,null,null],
      ['/profile','audit-r02',null,null],
      ['/notifications','audit-r02',null,null],
      ['/rentals','audit-r02','/rentals','page'],
      ['/messages','audit-r09','/messages','page'],
      ['/messages?conversation=audit-chat-001&q=V%C3%A9hicule','audit-r09','/messages','location'],
      ['/owner','audit-o02','/owner/vehicles','location'],
      ['/rental/audit-LP-006','audit-r02','/rentals','location'],
      ['/demo',null,null,null],
      ['/demo/audit',null,null,null],
      ['/design-system',null,null,null],
      ['/route-inconnue',null,null,null],
    ];
    for(const [route,persona,active,current] of scenarios) {
      if(persona)expect((await page.request.post(client+'/api/v1/session',{data:{persona}})).ok()).toBe(true);
      else await page.request.delete(client+'/api/v1/session');
      await page.goto(client+route);
      await ready(page);
      await expect(header).toHaveCount(1);
      await expect(header).toHaveClass('header internal-header');
      await expect(header).toHaveCSS('border-radius','999px');
      await expect(header).toHaveCSS('background-color','rgb(255, 255, 255)');
      await expect(page.locator('#shell > .demo-banner')).toHaveCount(0);
      const logo=header.getByRole('img',{name:'Lokasyon Péyi'});
      await expect(logo).toBeVisible();
      await expect.poll(()=>logo.evaluate(el=>[new URL(el.currentSrc).pathname,el.naturalWidth]))
        .toEqual(['/assets/v32/marque/logo-horizontal-charte.webp',683]);
      const controls=header.locator('.tools');
      const buttons=await controls.locator('a:visible,button:visible').all();
      const names=await Promise.all(buttons.map(control=>control.evaluate(el=>el.getAttribute('aria-label')||el.innerText.trim())));
      expect(names).toEqual(persona?['Notifications',...(desktop?['Compte']:[]),'Ouvrir le menu']:['Connexion','Ouvrir le menu']);
      const [capsule,mark,tools]=await Promise.all([box(header),box(logo),box(controls)]);
      expect(mark.x+mark.width).toBeLessThanOrEqual(tools.x);
      expect(tools.x+tools.width).toBeLessThan(capsule.x+capsule.width);
      for(const button of buttons) {
        const target=await box(button);
        expect(target.width).toBeGreaterThanOrEqual(44);
        expect(target.height).toBeGreaterThanOrEqual(44);
        expect(target.y+target.height).toBeLessThan(capsule.y+capsule.height);
      }
      const destinations=persona==='audit-o02'?owner:persona?renter:visitor.slice(0,2);
      if(desktop)await links(primary,destinations,active);
      else await expect(primary).toHaveCount(0);
      const root=['/profile','/rentals','/messages','/owner'].includes(route);
      if(!desktop&&root)await links(mobile(page),destinations,active,56);
      else await expect(mobile(page)).toHaveCount(0);
      if(active&&(desktop||root))await expect((desktop?primary:mobile(page)).locator('[aria-current]')).toHaveAttribute('aria-current',current);
      if(route==='/login')await expect(header.getByRole('link',{name:'Connexion'})).toHaveAttribute('aria-current','page');
      if(route==='/profile') {
        await expect((desktop?primary:mobile(page)).locator('[aria-current]')).toHaveCount(0);
        if(desktop)await expect(header.getByRole('link',{name:'Compte'})).toHaveAttribute('aria-current','page');
      }
      if(route==='/notifications')await expect(header.getByRole('link',{name:'Notifications'})).toHaveAttribute('aria-current','page');
      if(desktop&&route==='/owner')await expect(page.getByRole('navigation',{name:'Espace propriétaire',exact:true}).getByRole('link',{name:'Aujourd’hui'})).toHaveAttribute('aria-current','page');
      if(route.includes('conversation=')) {
        const back=page.getByRole('link',{name:'Retour aux messages',exact:true});
        await expect(back).toHaveAttribute('href','/messages?q=V%C3%A9hicule');
        expect((await box(back)).y).toBeGreaterThanOrEqual(capsule.y+capsule.height);
        expect((await box(back)).y+(await box(back)).height).toBeLessThanOrEqual((await box(page.locator('#main h1'))).y);
      }
      await fits(page);
    }

    const toggle=trigger(page), panel=menu(page);
    for(const key of ['Enter','Space']) {
      await toggle.focus();
      await page.keyboard.press(key);
      await expect(toggle).toHaveAttribute('aria-expanded','true');
      const close=panel.getByRole('button',{name:'Fermer le menu',exact:true});
      await expect(close).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(panel.getByRole('link').last()).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(close).toBeFocused();
      if(key==='Space')await close.click();
      else await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
      await expect(toggle).toBeFocused();
      await expect(toggle).toHaveAttribute('aria-expanded','false');
    }
  });
}

test('R01 : capsule stable pendant /me et navigation basse en retrait pendant la saisie',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  expect((await page.request.post(client+'/api/v1/session',{data:{persona:'audit-r09'}})).ok()).toBe(true);
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  await page.route('**/api/v1/me',async route=>{await gate;await route.continue();},{times:1});
  const header=page.locator('#shell > .internal-header');
  const toggle=trigger(page);
  try {
    await page.goto(client+'/messages');
    await expect(header).toBeVisible();
    const pendingBox=await header.boundingBox();
    await expect(header.getByRole('link',{name:'Notifications'})).toHaveCount(0);
    await expect(mobile(page)).toHaveCount(0);
    await toggle.press('Space');
    await expect(menu(page).getByRole('link',{name:'Mon profil',exact:true})).toHaveCount(0);
    release();
    await ready(page);
    await expect(menu(page).getByRole('link',{name:'Mon profil',exact:true})).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    expect(await header.boundingBox()).toEqual(pendingBox);
    await expect(header.getByRole('link',{name:'Notifications'})).toBeVisible();
    const search=page.locator('#main input[type=search]');
    await expect(mobile(page)).toBeVisible();
    await search.fill('Véhicule');
    await expect(search).toBeFocused();
    await expect(mobile(page)).toBeHidden();
    await fits(page);
    await search.blur();
    await expect(mobile(page)).toBeVisible();
    await page.setViewportSize({width:320,height:844});
    await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    await fits(page);
    await expect(toggle).toBeVisible();
  } finally {release();}
});

test('Démo : sortie refusée annoncée, attente distincte et un seul changement de session',async({page})=>{
  await login(page,'renter');
  await page.goto(client+'/demo');
  await ready(page);
  const exit=page.getByRole('button',{name:'Passer en visiteur',exact:true});
  const error=page.locator('#visitor-form [role="alert"]');
  const status=page.locator('#demo-session-status');
  let writes=0;
  let release;
  const wait=new Promise(resolve=>{release=resolve;});
  await page.route('**/api/v1/session',async route=>{
    if(route.request().method()==='GET') return route.continue();
    writes++;
    if(writes===1) return route.abort();
    await wait;
    return route.continue();
  });
  await exit.click();
  await expect(error).toContainText('API injoignable');
  await expect(error).toBeFocused();
  await expect(status).toBeEmpty();
  await expect(page).toHaveURL(client+'/demo');
  expect((await (await page.request.get(client+'/api/v1/me')).json()).id).toBe('renter');

  await exit.press('Enter');
  await expect(status).toHaveText('Changement de profil en cours…');
  await expect(exit).toBeDisabled();
  await page.locator('#persona-form').evaluate(form=>form.requestSubmit());
  await expect.poll(()=>writes).toBe(2);
  release();
  await page.waitForURL(client+'/');
  expect(writes).toBe(2);
  expect(await (await page.request.get(client+'/api/v1/me')).json()).toBeNull();
});

test('Cohérence opérationnelle : titres, reflow à 200 % et retour d’atelier utilisable au clavier',async({page})=>{
  await login(page,'renter');
  for(const [path,title] of [
    ['/profile','Mon profil'],
    ['/profile/documents','Mes documents'],
    ['/profile/reviews','Mes avis'],
    ['/notifications','Notifications'],
  ]){
    await page.goto(client+path);
    await ready(page);
    await expect(page).toHaveTitle(title+' · Lokasyon Péyi');
  }

  await page.setViewportSize({width:390,height:844});
  const privateCase=target.store.db.cases.find(item=>!item.participants.includes('renter'));
  await page.goto(client+'/cases/'+privateCase.id);
  await expect(page.getByRole('heading',{name:'Accès non autorisé',exact:true})).toBeVisible();
  const retry=await page.getByRole('button',{name:'Réessayer',exact:true}).boundingBox();
  const audit=await page.locator('#main').getByRole('link',{name:'Atelier d’audit',exact:true}).boundingBox();
  expect(audit.x).toBeCloseTo(retry.x);
  expect(audit.width).toBeCloseTo(retry.width);
  expect(audit.y).toBeGreaterThanOrEqual(retry.y+retry.height);

  await page.request.delete(client+'/api/v1/session');
  await page.setViewportSize({width:320,height:720});
  await page.goto(client+'/demo/audit?category=inconnue');
  await ready(page);
  await expect(page).toHaveTitle('Atelier d’audit · Lokasyon Péyi');
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  await fits(page);
  await expect(page.getByRole('heading',{name:'Aucun profil dans cette catégorie'})).toBeVisible();
  const reset=page.getByRole('link',{name:'Afficher tous les profils',exact:true});
  await reset.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(reset).toBeFocused();
  expect(await reset.evaluate(el=>el.matches(':focus-visible'))).toBe(true);
  expect((await reset.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press('Enter');
  await page.waitForURL(client+'/demo/audit');
  await expect(page.getByRole('button',{name:'Choisir audit-r01',exact:true})).toBeVisible();
  await page.goto(client+'/route-inconnue');
  await expect(page.getByRole('heading',{name:/404/,level:1})).toBeVisible();
  await expect(page).toHaveTitle('Page introuvable · Lokasyon Péyi');
});
