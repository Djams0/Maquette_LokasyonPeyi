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
async function settled(page) {
  await expect(page.locator('#explorer-catalogue')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('.explorer-home')).not.toHaveAttribute('data-identity','loading');
  await page.evaluate(()=>document.fonts.ready);
}
for(const width of [320,390,1440])test(`Explorer: visiteur, photo locale et géométrie à ${width}px`,async({page})=>{
  const external=[],errors=[];page.on('request',r=>{if(new URL(r.url()).origin!==client)external.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:width===1440?950:844});await page.goto(client);await settled(page);
  const image=page.locator('#explorer-cards img'),form=page.getByRole('form',{name:'Rechercher un véhicule'});
  await expect.poll(()=>image.evaluate(i=>i.complete && i.naturalWidth>0)).toBe(true);await expect(image).toHaveJSProperty('currentSrc',client+'/assets/vehicles/citadine-verte-avant-'+(width===1440?'836':'420')+'.webp');
  await expect(image).toHaveAttribute('fetchpriority','high');await expect(page.getByText('Photos de démonstration',{exact:true})).toBeVisible();
  const geometry=await page.evaluate(()=>{const b=document.querySelector('#explorer-search button').getBoundingClientRect(),i=document.querySelector('#explorer-cards img').getBoundingClientRect();return{overflow:document.documentElement.scrollWidth-innerWidth,button:b.toJSON(),image:i.toJSON(),bar:document.querySelector('.bottom-nav').getBoundingClientRect().top,title:getComputedStyle(document.querySelector('h1')).fontFamily};});
  expect(geometry.overflow).toBeLessThanOrEqual(1);expect(geometry.button.height).toBeGreaterThanOrEqual(48);expect(geometry.title).toContain('Lora');
  expect(geometry.image.width/geometry.image.height).toBeCloseTo(16/9,2);
  if(width===390){expect(geometry.button.bottom).toBeLessThanOrEqual(geometry.bar);expect(geometry.bar-geometry.image.top).toBeGreaterThanOrEqual(64);}
  const apiVehicles=await (await page.request.get(client+'/api/v1/vehicles')).json(),v=apiVehicles[0];
  await expect(page.locator('#explorer-cards')).toContainText(v.name);await expect(page.locator('#explorer-cards')).toContainText(v.city);
  await expect(page.locator('#explorer-cards .price')).toContainText(new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v.price));
  const asset=await page.request.get(client+'/assets/vehicles/citadine-verte-avant-420.webp');expect(asset.headers()['content-type']).toContain('image/webp');
  await expect(form.getByRole('button',{name:'Trouver ma voiture',exact:true})).toBeEnabled();
  expect(external).toEqual([]);expect(errors).toEqual([]);
});

test('Explorer: clavier, dates conservées et reprise du format historique',async({page})=>{
  await page.goto(client);await settled(page);const form=page.getByRole('form',{name:'Rechercher un véhicule'}),q=form.getByLabel('Votre destination'),from=form.getByLabel('Départ'),until=form.getByLabel('Retour');
  await q.fill('Gosier');await from.fill('2027-06-10');await q.press('Enter');await expect(form.getByRole('alert')).toContainText('Indiquez le départ et le retour');await expect(q).toHaveValue('Gosier');await expect(from).toHaveValue('2027-06-10');await expect(from).toHaveAttribute('aria-describedby',await form.getByRole('alert').getAttribute('id'));
  await until.fill('2027-06-09');await q.press('Enter');await expect(form.getByRole('alert')).toContainText('doit suivre le départ');
  await until.fill('2027-06-14');await q.press('Enter');await page.waitForURL(/\/search\?/);await expect(page.getByRole('heading',{name:'Résultats',exact:true})).toBeVisible();
  const params=new URL(page.url()).searchParams;expect(params.get('from')).toBe('2027-06-10');expect(params.get('until')).toBe('2027-06-14');expect(params.get('q')).toBe('Gosier');
  const stored=await page.evaluate(()=>localStorage.getItem('recent-search'));expect(stored).toContain('from=2027-06-10');
  await page.goto(client);await settled(page);const resume=page.getByRole('link',{name:'Reprendre ma dernière recherche',exact:true});await expect(resume).toHaveAttribute('href',stored);await resume.click();await page.waitForURL(/\/search\?/);expect(new URL(page.url()).searchParams.get('until')).toBe('2027-06-14');
  await page.getByRole('link',{name:/Peugeot 208/}).click();await expect(page.getByRole('heading',{name:/Peugeot 208/})).toBeVisible();await page.goBack();await expect(page.getByRole('heading',{name:'Résultats',exact:true})).toBeVisible();expect(new URL(page.url()).searchParams.get('from')).toBe('2027-06-10');
});

test('Explorer: session et catalogue lents ne remplacent ni saisie ni menu',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.request.post(client+'/api/v1/session',{data:{persona:'audit-r02'}});
  let releaseMe,releaseVehicles;const meGate=new Promise(r=>releaseMe=r),vehiclesGate=new Promise(r=>releaseVehicles=r);
  await page.route('**/api/v1/me',async route=>{await meGate;await route.continue().catch(()=>{});});
  await page.route('**/api/v1/vehicles',async route=>{await vehiclesGate;await route.continue().catch(()=>{});});
  try{
    await page.goto(client,{waitUntil:'commit'});const form=page.getByRole('form',{name:'Rechercher un véhicule'});await expect(form).toBeVisible();await expect(page.locator('#explorer-catalogue')).toHaveAttribute('aria-busy','true');
    await form.getByLabel('Votre destination').fill('Gosier');const before=(await page.locator('#explorer-cards').boundingBox()).height;
    await page.getByRole('button',{name:'Ouvrir le menu',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Menu',exact:true});await expect(dialog).toBeVisible();
    releaseMe();await expect(page.locator('.explorer-home')).toHaveAttribute('data-identity','ready');await expect(dialog).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Ouvrir le menu',exact:true})).toBeFocused();await expect(form.getByLabel('Votre destination')).toHaveValue('Gosier');
    releaseVehicles();await settled(page);await expect(form.getByLabel('Votre destination')).toHaveValue('Gosier');const after=(await page.locator('#explorer-cards').boundingBox()).height;expect(Math.abs(after-before)).toBeLessThanOrEqual(2);
  }finally{releaseMe();releaseVehicles();}
});

test('Explorer: recherche utilisable avant la fin du chargement du catalogue',async({page})=>{
  let release;const gate=new Promise(r=>release=r);await page.route('**/api/v1/vehicles',async route=>{await gate;await route.continue().catch(()=>{});});
  try{await page.goto(client,{waitUntil:'commit'});const q=page.getByLabel('Votre destination');await q.fill('Gosier');await q.press('Enter');await page.waitForURL(/\/search\?/);await expect(page.getByRole('heading',{name:'Résultats',exact:true})).toBeVisible();expect(new URL(page.url()).searchParams.get('q')).toBe('Gosier');}
  finally{release();}
});

test('Explorer: vide et erreur gardent recherche, liens et reprise sans perte de saisie',async({page})=>{
  let mode='empty';await page.route('**/api/v1/vehicles',async route=>{if(mode==='empty')await route.fulfill({json:[]});else if(mode==='error')await route.fulfill({status:503,json:{error:'Réseau de recette indisponible.'}});else await route.continue();});
  await page.goto(client);await settled(page);await expect(page.getByRole('heading',{name:'Aucun véhicule ici',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Trouver ma voiture',exact:true})).toBeEnabled();
  mode='error';await page.route('**/api/v1/me',route=>route.abort());await page.reload();await settled(page);await expect(page.getByRole('heading',{name:'Impossible de charger le catalogue',exact:true})).toBeVisible();await page.getByLabel('Votre destination').fill('Gosier');await expect(page.locator('.explorer-error a[href="/demo"]')).toBeVisible();
  await expect(page.locator('.explorer-home')).toHaveAttribute('data-identity','unavailable');mode='ready';await page.unroute('**/api/v1/me');await page.getByRole('button',{name:'Réessayer le catalogue',exact:true}).click();await settled(page);await expect(page.getByLabel('Votre destination')).toHaveValue('Gosier');await expect(page.getByRole('heading',{name:'Peugeot 208',exact:true})).toBeVisible();await expect(page.locator('#explorer-featured-title')).toBeFocused();await expect(page.locator('.explorer-home')).toHaveAttribute('data-identity','anonymous');
});

test('Explorer: stockage refusé et photo en erreur utilisent un repli local',async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('Storage unavailable','SecurityError');}}));
  await page.route('**/assets/vehicles/*.webp',route=>route.abort());await page.goto(client);await settled(page);
  const image=page.locator('#explorer-cards img');await expect(image).toHaveAttribute('src','/assets/car-sage.svg');await expect(image).not.toHaveAttribute('srcset',/.+/);await expect.poll(()=>image.evaluate(i=>i.complete && i.naturalWidth>0)).toBe(true);await expect(image).toHaveJSProperty('currentSrc',client+'/assets/car-sage.svg');await expect(page.getByText('Photo indisponible · illustration fictive',{exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'Reprendre ma dernière recherche',exact:true})).toHaveCount(0);
  await page.route('**/assets/v32/demo/clio-avant-*.webp',route=>route.fulfill({status:404}));
  await page.getByLabel('Votre destination').fill('Gosier');await page.getByLabel('Votre destination').press('Enter');await page.waitForURL(/\/search\?/);await expect(page.getByRole('heading',{name:'Résultats',exact:true})).toBeVisible();await expect(page.locator('.catalogue-card[data-vehicle-id="v3"] img')).toHaveAttribute('src','/assets/car-blue.svg');
  await expect(page.locator('.catalogue-card[data-vehicle-id="v3"]').getByRole('status')).toHaveText('Photo indisponible · illustration fictive');
});

test('V3.2: catalogue responsive avec médias locaux et crédits accessibles', async ({page,browser}, info) => {
 await page.setViewportSize({width:320,height:844});
 await page.goto(client+'/search');
 const modelCard = page.locator('.catalogue-card[data-vehicle-id="v3"]');
 const image = modelCard.locator('img');
 await modelCard.scrollIntoViewIfNeeded();
 await expect(image).toHaveJSProperty('currentSrc',client+'/assets/v32/demo/clio-avant-480.webp');
 await expect(image).toHaveCSS('object-fit','cover');
 const bounds = await image.boundingBox();
 expect(bounds.width / bounds.height).toBeCloseTo(16/9,2);
 await expect(image).toHaveAttribute('loading','lazy');
 await expect(modelCard.getByRole('status')).toHaveText('Photo illustrative du modèle');
 await expect(page.locator('.catalogue-card[data-vehicle-id="v1"] img')).toHaveAttribute('src', /citadine-verte/);
 await expect(page.locator('.catalogue-card[data-vehicle-id="v4"] img')).toHaveAttribute('src','/assets/car-coral.svg');
 const credit = page.getByRole('link',{name:'Crédits des photos',exact:true});
 await credit.focus();
 await expect(credit).toBeFocused();
 expect((await credit.boundingBox()).height).toBeGreaterThanOrEqual(44);
 await credit.press('Enter');
 await expect(page.getByRole('heading',{name:'Crédits des photos',exact:true})).toBeVisible();
 const hero = page.locator('#photo-49');
 await expect(hero).toContainText('artificiality');
 await expect(hero.getByRole('link',{name:/Licence CC BY-SA 2.0/})).toHaveAttribute('href','https://creativecommons.org/licenses/by-sa/2.0/');
 await expect(hero.getByRole('link',{name:/Publication originale/})).toHaveAttribute('href','https://www.flickr.com/photos/artificiality/23995408895/');
 expect(await page.evaluate(() => document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.getByRole('link',{name:'Retour à l’accueil'}).click();
 await settled(page);
 await page.setViewportSize({width:1440,height:900});
 await page.goto(client+'/search');
 await modelCard.scrollIntoViewIfNeeded();
 await expect(image).toHaveJSProperty('currentSrc',client+'/assets/v32/demo/clio-avant-480.webp');
 await info.attach('Catalogue · photos de modèles et série historique', {body:await page.screenshot(),contentType:'image/png'});

 const retina = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
 try {
  await retina.goto(client+'/search');
  for (const [id,file] of [['v2','duster-avant-1000.webp'],['v3','clio-avant-1050.webp']]) {
   const cover = retina.locator(`.catalogue-card[data-vehicle-id="${id}"] img`);
   await cover.scrollIntoViewIfNeeded();
   await expect(cover).toHaveJSProperty('currentSrc',client+'/assets/v32/demo/'+file);
  }
 } finally {
  await retina.close();
 }
});

test('V3.2: les trois tailles du hero sont servies localement dans un montage isolé', async ({page}) => {
 const paths = [720,1440,1920].map(width => '/assets/v32/editorial/route-guadeloupe-'+width+'.webp');
 const fixture = '/assets/v32/hero-recette.html';
 await page.route(client+fixture, route => route.fulfill({contentType:'text/html;charset=utf-8', body:`
  <!doctype html><html lang="fr"><meta name="viewport" content="width=device-width, initial-scale=1">
  <picture>
    <source media="(max-width:599px)" srcset="${paths[0]}" width="720" height="480">
    <img src="${paths[1]}" srcset="${paths[1]} 1440w, ${paths[2]} 1920w" sizes="100vw"
      width="1440" height="960" fetchpriority="high" decoding="async" alt="Route en Guadeloupe au coucher du soleil">
  </picture>`}));
 for (const [index,width] of [390,1280,1920].entries()) {
  await page.setViewportSize({width,height:900});
  await page.goto(client+fixture);
  const hero = page.getByRole('img',{name:/au coucher du soleil/});
  await expect(hero).toHaveJSProperty('currentSrc',client+paths[index]);
  expect(await hero.evaluate(async img => { await img.decode(); return img.naturalWidth/img.naturalHeight; })).toBeCloseTo(1.5,2);
 }
});
