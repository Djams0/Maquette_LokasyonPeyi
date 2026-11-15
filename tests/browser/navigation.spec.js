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
async function four(nav,current){await expect(nav.getByRole('link')).toHaveCount(4);for(const a of await nav.getByRole('link').all()){const rect=await a.boundingBox();expect(rect.height).toBeGreaterThanOrEqual((await nav.getAttribute('aria-label'))==='Navigation mobile'?56:48);}expect(await nav.getByRole('link').evaluateAll(es=>es.map(e=>e.getAttribute('href')))).toEqual(['/','/rentals','/messages','/profile']);await expect(nav.locator('[aria-current=page]')).toHaveCount(1);await expect(nav.locator('[aria-current=page]')).toHaveAttribute('href',current);}

test('navigation visiteur : quatre destinations et next conservé après connexion',async({page})=>{
  await page.setViewportSize({width:320,height:844});await page.goto(client);await ready(page);
  const bar=page.getByRole('navigation',{name:'Navigation mobile',exact:true});await four(bar,'/');
  await page.goto(client+'/search?q=Gosier');await ready(page);await four(bar,'/');
  await bar.getByRole('link',{name:'Locations',exact:true}).click();await page.waitForURL(/login\?next=/);expect(new URL(page.url()).searchParams.get('next')).toBe('/rentals');await expect(bar).toHaveCount(0);
  await page.getByLabel('Compte de démonstration').selectOption('audit-r02');await page.getByRole('button',{name:'Entrer dans la démo',exact:true}).click();await page.waitForURL(client+'/rentals');await ready(page);await four(bar,'/rentals');
  await page.goto(client+'/login?next='+encodeURIComponent('/messages?conversation=audit-chat-001'));await page.getByLabel('Compte de démonstration').selectOption('audit-r09');await page.getByRole('button',{name:'Entrer dans la démo',exact:true}).click();await page.waitForURL(/messages\?conversation=audit-chat-001$/);await ready(page);await expect(bar).toHaveCount(0);await page.getByRole('link',{name:'Retour aux messages',exact:true}).click();await ready(page);await four(bar,'/messages');
  await page.goBack();await ready(page);expect(new URL(page.url()).searchParams.get('conversation')).toBe('audit-chat-001');
});

test('navigation responsive : panneau nommé, clavier, focus et changements de largeur',async({page})=>{
  await login(page,'audit-r02');
  for(const width of [320,768,1024,1440]){
    await page.setViewportSize({width,height:844});await page.goto(client);await ready(page);
    const primary=page.getByRole('navigation',{name:width<1024?'Navigation mobile':'Navigation principale',exact:true});await four(primary,'/');await fits(page);
    const trigger=page.getByRole('button',{name:'Ouvrir le menu',exact:true});await trigger.focus();await page.keyboard.press('Enter');
    const panel=page.getByRole('dialog',{name:'Menu',exact:true});await expect(panel).toBeVisible();await expect(trigger).toHaveAttribute('aria-expanded','true');
    expect((await panel.boundingBox()).width).toBeLessThanOrEqual(width-20);
    for(const href of ['/search','/profile/documents','/notifications','/profile/reviews','/owner/start','/faq','/assistance','/cases','/demo','/demo/audit','/design-system'])await expect(panel.locator(`a[href="${href}"]`)).toHaveCount(1);
    await panel.getByRole('link').last().focus();await page.keyboard.press('Tab');await expect(panel.getByRole('button',{name:'Fermer le menu',exact:true})).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(panel.getByRole('link').last()).toBeFocused();await page.keyboard.press('Tab');await expect(panel.getByRole('button',{name:'Fermer le menu',exact:true})).toBeFocused();expect(await panel.evaluate(d=>d.contains(document.activeElement))).toBe(true);await page.keyboard.press('Escape');await expect(panel).not.toBeVisible();await expect(trigger).toBeFocused();await expect(trigger).toHaveAttribute('aria-expanded','false');
  }
  await page.setViewportSize({width:320,height:844});await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).click();await page.setViewportSize({width:1440,height:950});await expect(page.getByRole('dialog',{name:'Menu',exact:true})).not.toBeVisible();
  await page.setViewportSize({width:768,height:430});await expect(page.getByRole('navigation',{name:'Navigation mobile',exact:true})).toHaveCSS('position','static');await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).click();expect((await page.getByRole('dialog',{name:'Menu',exact:true}).boundingBox()).height).toBeLessThanOrEqual(406);await page.keyboard.press('Escape');
});

test('navigation propriétaire : profil, parc, sous-navigation et retours dédiés',async({page})=>{
  await page.setViewportSize({width:390,height:844});await login(page,'audit-o07');await page.goto(client+'/profile');await ready(page);const bar=page.getByRole('navigation',{name:'Navigation mobile',exact:true});await four(bar,'/profile');
  await page.getByRole('link',{name:'Ouvrir mon espace propriétaire',exact:true}).click();await ready(page);await four(bar,'/profile');await page.goto(client+'/owner/vehicles');await ready(page);await expect(bar).toHaveCount(0);await expect(page.getByRole('navigation',{name:'Retour',exact:true}).getByRole('link',{name:'Espace propriétaire',exact:true})).toHaveAttribute('href','/owner');
  await page.getByRole('link',{name:'Gérer le véhicule',exact:true}).first().click();await ready(page);await expect(page.getByRole('navigation',{name:'Espace propriétaire',exact:true}).getByRole('link',{name:'Véhicules',exact:true})).toHaveAttribute('aria-current','page');await expect(page.getByRole('link',{name:'Mon parc',exact:false})).toHaveAttribute('href','/owner/vehicles');
  const denied=await page.request.post(client+'/api/v1/owner/vehicles/audit-v02-1/edit',{data:{name:'Autre véhicule fictif',price:20,description:'Modification croisée fictive.'}});expect(denied.status()).toBe(403);
  await page.goto(client+'/notifications');await ready(page);await expect(bar).toHaveCount(0);await page.getByRole('link',{name:'Retour au profil',exact:true}).click();await ready(page);await expect(page.getByRole('heading',{name:'Mon profil',exact:true})).toBeVisible();
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
  await page.request.delete(client+'/api/v1/session');await page.goto(client+'/profile/documents?state=demo');await page.waitForURL(/login/);expect(new URL(page.url()).searchParams.get('next')).toBe('/profile/documents?state=demo');
});
