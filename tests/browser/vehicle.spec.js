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
const dated='?q=Gosier&from=2027-06-10&until=2027-06-14&max=80&sort=price&view=map';
async function open(page,id='v1',query=dated){await page.goto(client+'/vehicle/'+id+query);await expect(page.locator('#vehicle-title')).toBeVisible();await page.evaluate(()=>document.fonts.ready);}
for(const width of [320,375,390,430,768,1024,1440])test(`Fiche: reflow, galerie 3:2 et action à ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:width===1440?950:844});await open(page);
 const cover=page.locator('#open-vehicle-gallery');await expect(cover).toContainText('1 / 5');const box=await cover.boundingBox();expect(box.width/box.height).toBeCloseTo(3/2,2);
 await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('2027-06-10T09:00');await expect(page.locator('#vehicle-estimate')).toContainText('128');await expect(page.locator('#vehicle-estimate')).toContainText('estimation fictive');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 const action=page.getByRole('button',{name:'Demander la location',exact:true}),b=await action.boundingBox();expect(b.height).toBeGreaterThanOrEqual(48);if(width<1024){expect(b.y).toBeGreaterThanOrEqual(0);expect(b.y+b.height).toBeLessThanOrEqual(844);}
 await page.getByLabel('Départ · heure Guadeloupe').focus();await expect(page.locator('#main')).toHaveClass(/vehicle-action-in-flow/);expect(await page.locator('.vehicle-action-bar').evaluate(e=>getComputedStyle(e).position)).toBe('static');
});
test('Fiche: galerie clavier nommée, compteur réel, cinq vues, Échap et retour du focus',async({page})=>{
 await page.setViewportSize({width:390,height:844});await open(page);const cover=page.getByRole('button',{name:'Ouvrir la photo 1 de Peugeot 208',exact:true});await cover.focus();await page.keyboard.press('Enter');const d=page.getByRole('dialog',{name:'Galerie · Peugeot 208',exact:true});await expect(d).toBeVisible();await expect(d.locator('#gallery-count')).toHaveText('1 / 5');
 await page.keyboard.press('ArrowRight');await expect(d.locator('#gallery-count')).toHaveText('2 / 5');await expect(d.locator('#gallery-view img')).toHaveAttribute('src',/arriere/);await d.getByRole('button',{name:'Suivante',exact:true}).click();await expect(d.locator('#gallery-count')).toHaveText('3 / 5');await expect(d.locator('#gallery-view img')).toHaveAttribute('src',/profil/);await page.keyboard.press('ArrowLeft');await expect(d.locator('#gallery-count')).toHaveText('2 / 5');
 await page.keyboard.press('Escape');await expect(d).toHaveCount(0);await expect(cover).toBeFocused();await cover.click();await page.getByRole('dialog').getByRole('button',{name:'Fermer',exact:true}).click();await expect(cover).toBeFocused();
});
test('Fiche: défaut entier et provenance, rendu optionnel hors galerie chargé sur demande',async({page})=>{
 const images=[];page.on('request',r=>{if(r.resourceType()==='image')images.push(r.url());});await open(page);
 expect(images.some(u=>u.includes('illustration-836'))).toBe(false);await expect(page.getByText('Exemple d’interface fictif · fixture v1 · déclaration visuelle fictive 1',{exact:true})).toBeVisible();
 const trigger=page.getByRole('button',{name:/Rayure superficielle/});await trigger.click();const d=page.getByRole('dialog',{name:'État du véhicule · déclaration fictive',exact:true});await expect(d).toContainText('Aucun média n’est ajouté aux pièces ou aux constats');await expect(d).toContainText('date fictive');const image=d.locator('.detail-media img');await expect(image).toHaveAttribute('src',/rayure/);expect(await image.evaluate(i=>getComputedStyle(i).objectFit)).toBe('contain');await expect.poll(()=>image.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
 await page.keyboard.press('Escape');await expect(trigger).toBeFocused();const model=page.getByRole('button',{name:'Voir l’illustration du modèle',exact:true});await model.click();const render=page.getByRole('dialog',{name:'Illustration du modèle',exact:true});await expect(render.getByText('Représentation illustrative',{exact:true})).toBeVisible();expect(images.some(u=>u.includes('illustration-836'))).toBe(true);await render.getByRole('button',{name:'Revenir aux photos de l’annonce',exact:true}).click();await expect(page.locator('#open-vehicle-gallery')).toBeFocused();
});
test('Fiche: galerie à une illustration et état non renseigné ne deviennent pas une déclaration v1',async({page})=>{
 await open(page,'v4');await expect(page.getByText('État non renseigné',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Voir l’illustration du modèle',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:/Rayure superficielle/})).toHaveCount(0);
 await page.getByRole('button',{name:'Ouvrir l’illustration 1 de Citroën C3',exact:true}).click();const d=page.getByRole('dialog',{name:'Galerie · Citroën C3',exact:true});await expect(d.locator('#gallery-count')).toHaveText('1 / 1');await expect(d.getByRole('button',{name:'Précédente',exact:true})).toBeDisabled();await expect(d.getByRole('button',{name:'Suivante',exact:true})).toBeDisabled();await expect(d).toContainText('Illustration fictive');
});
test('Fiche: absence de photo, SVG et photo de défaut se dégradent sans preuve substituée',async({page})=>{
 await page.route('**/assets/vehicles/*.webp',r=>r.abort());await open(page);await expect(page.locator('#open-vehicle-gallery .detail-media-status')).toHaveText('Photo indisponible · illustration fictive de remplacement');await expect(page.locator('#open-vehicle-gallery img')).toHaveAttribute('src','/assets/car-sage.svg');await expect(page.locator('#open-vehicle-gallery img')).not.toHaveAttribute('srcset',/.+/);
 await page.getByRole('button',{name:/Rayure superficielle/}).click();const d=page.getByRole('dialog',{name:'État du véhicule · déclaration fictive',exact:true});await expect(d.locator('img')).toBeHidden();await expect(d).toContainText('Image indisponible · la description reste consultable');await expect(d.locator('img')).toHaveAttribute('src',/rayure/);await page.keyboard.press('Escape');
 await page.route('**/assets/v32/demo/duster-avant-*.webp',r=>r.fulfill({status:404}));
 await page.route('**/assets/car-*.svg',r=>r.abort());await open(page,'v2');await expect(page.locator('#open-vehicle-gallery img')).toBeHidden();await expect(page.locator('#open-vehicle-gallery')).toContainText('Visuel indisponible');
});

test('V3.2: galeries Clio et Duster séparées, formats à la demande et retour clavier', async ({page}, info) => {
 await page.setViewportSize({width:1440,height:900});
 const images = [];
 page.on('request', request => {
  if (request.resourceType() === 'image') images.push(new URL(request.url()).pathname);
 });
 await open(page,'v3');
 const cover = page.getByRole('button',{name:'Ouvrir les photos du modèle Renault Clio'});
 const coverImage = cover.locator('img');
 await expect(coverImage).toHaveJSProperty('currentSrc',client+'/assets/v32/demo/clio-avant-1050.webp');
 await expect(coverImage).toHaveAttribute('width','1050');
 await expect(coverImage).toHaveAttribute('height','787');
 await expect(page.getByText('État non renseigné',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:/Rayure superficielle/})).toHaveCount(0);
 expect(images.filter(url => url.includes('/v32/demo/'))).toEqual(['/assets/v32/demo/clio-avant-1050.webp']);
 await cover.focus();
 await page.keyboard.press('Enter');
 const gallery = page.getByRole('dialog',{name:'Galerie · Renault Clio'});
 await expect(gallery).toContainText('Elles ne montrent ni le véhicule proposé, ni ses équipements, ni son état.');
 await expect(gallery.locator('#gallery-count')).toHaveText('1 / 3');
 await page.keyboard.press('ArrowRight');
 await expect(gallery.locator('#gallery-view img')).toHaveJSProperty('currentSrc',client+'/assets/v32/demo/clio-arriere-900.webp');
 await expect(gallery.locator('#gallery-count')).toHaveText('2 / 3');
 await page.keyboard.press('ArrowRight');
 await expect(gallery.locator('#gallery-view img')).toHaveJSProperty('currentSrc',client+'/assets/v32/demo/clio-face-900.webp');
 await expect(gallery.locator('#gallery-count')).toHaveText('3 / 3');
 await info.attach('Clio · vue de modèle et provenance', {body:await gallery.screenshot(),contentType:'image/png'});
 await page.keyboard.press('Escape');
 await expect(cover).toBeFocused();
 await expect(page.locator('#return-search')).toHaveAttribute('href','/search'+dated);

 await page.setViewportSize({width:320,height:844});
 await open(page,'v2');
 const duster = page.getByRole('button',{name:'Ouvrir les photos du modèle Dacia Duster'});
 await expect(duster.locator('img')).toHaveJSProperty('currentSrc',client+'/assets/v32/demo/duster-avant-480.webp');
 await expect(page.getByText('État non renseigné',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:/Rayure superficielle/})).toHaveCount(0);
 await duster.click();
 const otherGallery = page.getByRole('dialog',{name:'Galerie · Dacia Duster'});
 await expect(otherGallery.locator('#gallery-count')).toHaveText('1 / 2');
 const next = otherGallery.getByRole('button',{name:'Suivante'});
 await next.click();
 await expect(otherGallery.locator('#gallery-view img')).toHaveJSProperty('currentSrc',client+'/assets/v32/demo/duster-arriere-420.webp');
 await expect(next).toBeFocused();
 const box = await next.boundingBox();
 expect(Math.min(box.width,box.height)).toBeGreaterThanOrEqual(44);
 expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
 await page.keyboard.press('Escape');
 await expect(duster).toBeFocused();
});
test('Fiche: prix non calculable, période invalide et dates proposées sont explicites',async({page})=>{
 await page.route('**/api/v1/vehicles/v1',async r=>{const res=await r.fetch(),v=await res.json();await r.fulfill({json:{...v,price:null}});});await open(page);await expect(page.locator('#vehicle-estimate')).toContainText('Prix non calculable');await expect(page.locator('#vehicle-estimate')).not.toContainText('NaN');await page.unroute('**/api/v1/vehicles/v1');
 await open(page,'v1','?from=2027-02-31&until=2027-03-04');await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('');await expect(page.locator('#vehicle-period-note')).toContainText('2027-02-31');await expect(page.locator('#vehicle-estimate')).toContainText('Total indisponible');
 await open(page,'v1','');await expect(page.locator('#vehicle-period-note')).toContainText('Dates proposées à confirmer');await expect(page.getByLabel('Départ · heure Guadeloupe')).not.toHaveValue('');
});
test('Fiche: propriétaire garde la gestion, visiteur garde la demande et son brouillon daté',async({page})=>{
 await page.request.post(client+'/api/v1/session',{data:{persona:'owner'}});await open(page);await expect(page.getByRole('link',{name:'Gérer mon annonce',exact:true})).toHaveAttribute('href','/owner/vehicles/v1');await expect(page.getByRole('button',{name:'Demander la location',exact:true})).toHaveCount(0);
 await page.request.delete(client+'/api/v1/session');await open(page);await page.getByRole('button',{name:'Demander la location',exact:true}).click();await page.waitForURL(u=>u.pathname==='/login');expect(new URL(page.url()).searchParams.get('next')).toBe('/request/v1');expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('rental-draft')))).toEqual({vehicleId:'v1',start:'2027-06-10T13:00:00.000Z',end:'2027-06-14T13:00:00.000Z'});
});
test('Fiche: texte à 200 %, hauteur courte et focus en saisie gardent les contrôles atteignables',async({page})=>{
 await page.route('**/ui/base.css',async r=>{const response=await r.fetch();await r.fulfill({response,body:await response.text()+'\nhtml {font-size:200%}'});});
 await page.setViewportSize({width:390,height:422});await open(page);expect(await page.locator('html').evaluate(e=>getComputedStyle(e).fontSize)).toBe('32px');expect(await page.locator('.vehicle-action-bar').evaluate(e=>getComputedStyle(e).position)).toBe('static');expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await page.getByLabel('Départ · heure Guadeloupe').fill('2027-06-11T10:00');await page.getByLabel('Retour · heure Guadeloupe').fill('2027-06-15T11:00');await page.getByRole('button',{name:'Demander la location',exact:true}).scrollIntoViewIfNeeded();await expect(page.getByRole('button',{name:'Demander la location',exact:true})).toBeInViewport();
});
test('Fiche: erreur API récupérable conserve le contexte et les dates au rechargement',async({page})=>{
 await page.route('**/api/v1/vehicles/v1',r=>r.abort());await page.goto(client+'/vehicle/v1'+dated);await expect(page.getByRole('heading',{name:'Impossible de charger cette page',exact:true})).toBeVisible();await expect(page.locator('#main').getByRole('link',{name:'Atelier d’audit',exact:true})).toBeVisible();await page.unroute('**/api/v1/vehicles/v1');await page.getByRole('button',{name:'Réessayer',exact:true}).click();await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('2027-06-10T09:00');expect(new URL(page.url()).searchParams.get('view')).toBe('map');await expect(page.locator('#return-search')).toHaveAttribute('href','/search'+dated);
});
