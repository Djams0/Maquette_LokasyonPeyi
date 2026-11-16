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
const query='q=Gosier&from=2027-06-10&until=2027-06-14&max=80&sort=price&view=map';
async function settled(page){await expect(page.locator('#search-items')).toHaveAttribute('aria-busy','false');}
async function open(page,q=query){await page.goto(client+'/search?'+q);await settled(page);}
for(const width of [320,375,390,430,768,1024,1440])test(`Recherche: résultats et panneau sans débordement à ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:width===1440?950:844});await open(page);
  await expect(page.getByRole('heading',{name:'3 véhicules',exact:true})).toBeVisible();
  await expect(page.getByText('Carte schématique fictive · positions indicatives, sans géolocalisation',{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  const image=page.locator('.results-cards img').first();const box=await image.boundingBox();expect(box.width/box.height).toBeCloseTo(16/9,2);
  if(width<768)expect(await page.locator('.results-cards').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(1);
  const trigger=page.getByRole('button',{name:/^Filtres/});await trigger.click();const d=page.getByRole('dialog',{name:'Filtres',exact:true});await expect(d).toBeVisible();
  await expect(d.getByLabel('Prix maximum / jour fictif')).toHaveValue('80');await d.getByLabel('Prix maximum / jour fictif').fill('40');
  expect(await d.evaluate(e=>e.scrollWidth-e.clientWidth)).toBeLessThanOrEqual(1);await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  await trigger.click();await expect(d.getByLabel('Prix maximum / jour fictif')).toHaveValue('80');await d.getByRole('button',{name:'Annuler',exact:true}).click();await expect(trigger).toBeFocused();
});
test('Recherche: A → retour local → B, historique navigateur, reload et dates sur fiche',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await open(page);
  const cards=page.locator('.results-cards article');expect(await cards.count()).toBe(3);
  const a=await cards.nth(0).getAttribute('data-vehicle-id'),b=await cards.nth(1).getAttribute('data-vehicle-id');expect(a).not.toBe(b);
  const search=page.url();await cards.nth(0).getByRole('link').click();
  await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('2027-06-10T09:00');await expect(page.getByLabel('Retour · heure Guadeloupe')).toHaveValue('2027-06-14T09:00');
  await page.reload();await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('2027-06-10T09:00');
  await page.getByRole('link',{name:'Retour aux résultats',exact:true}).click();await settled(page);expect(page.url()).toBe(search);
  await page.locator('.results-cards article').nth(1).getByRole('link').click();expect(new URL(page.url()).pathname).toBe('/vehicle/'+b);
  await page.goBack();await settled(page);expect(page.url()).toBe(search);await page.goForward();await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('2027-06-10T09:00');
  await page.getByLabel('Départ · heure Guadeloupe').fill('2027-06-10T14:35');await page.getByLabel('Retour · heure Guadeloupe').focus();await page.reload();
  await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('2027-06-10T14:35');await page.getByRole('link',{name:'Retour aux résultats',exact:true}).click();await settled(page);expect(new URL(page.url()).searchParams.get('from')).toBe('2027-06-10T14:35');
  await page.locator('.results-cards article').first().getByRole('link').click();await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('2027-06-10T14:35');expect(errors).toEqual([]);
});
test('Recherche: filtre appliqué, annulation, reset, tri et carte préservent la période et les clés API',async({page})=>{
  const requests=[];page.on('request',r=>{if(new URL(r.url()).pathname==='/api/v1/vehicles')requests.push(new URL(r.url()));});
  await page.setViewportSize({width:390,height:844});await open(page);
  await page.getByRole('button',{name:/^Filtres/}).click();let d=page.getByRole('dialog',{name:'Filtres',exact:true});await d.getByLabel('Prix maximum / jour fictif').fill('40');await d.getByRole('button',{name:'Appliquer les filtres'}).click();await settled(page);
  expect(new URL(page.url()).searchParams.get('max')).toBe('40');expect(new URL(page.url()).searchParams.get('view')).toBe('map');expect(new URL(page.url()).searchParams.get('from')).toBe('2027-06-10');
  await page.getByLabel('Trier par').selectOption('rating');await settled(page);expect(new URL(page.url()).searchParams.get('sort')).toBe('rating');
  await page.getByRole('link',{name:'Liste',exact:true}).click();await settled(page);expect(new URL(page.url()).searchParams.has('view')).toBe(false);
  await page.getByRole('button',{name:/^Filtres/}).click();d=page.getByRole('dialog',{name:'Filtres',exact:true});await d.getByRole('button',{name:'Réinitialiser les filtres'}).click();await d.getByRole('button',{name:'Annuler',exact:true}).click();expect(new URL(page.url()).searchParams.get('max')).toBe('40');
  await page.getByRole('button',{name:/^Filtres/}).click();await d.getByRole('button',{name:'Réinitialiser les filtres'}).click();await d.getByRole('button',{name:'Appliquer les filtres'}).click();await settled(page);const p=new URL(page.url()).searchParams;expect(p.has('max')).toBe(false);expect(p.get('sort')).toBe('rating');expect(p.get('until')).toBe('2027-06-14');
  for(const request of requests){expect([...request.searchParams.keys()].every(k=>['q','category','max','gearbox','fuel','seats','equipment','sort','start','end'].includes(k))).toBe(true);expect(request.searchParams.get('start')).toBe('2027-06-10T09:00:00-04:00');}
});
test('Recherche: paramètres inconnus, période invalide et doublons restent explicites, sans requête métier',async({page})=>{
  let calls=0;page.on('request',r=>{if(new URL(r.url()).pathname==='/api/v1/vehicles')calls++;});
  for(const q of ['from=2027-02-31&until=2027-03-04','from=2027-06-10','from=2026-01-01&until=2026-01-05','q=A&q=B','view=satellite']){
    const before=calls;await open(page,q);await expect(page.locator('#search-validation')).toContainText('Recherche à corriger');expect(calls).toBe(before);expect(new URL(page.url()).search).toBe('?'+q);
  }
  await open(page,query+'&return=https://evil.invalid&bogus=1');await expect(page.locator('#search-validation')).toContainText('Paramètres non reconnus');expect(new URL(page.url()).searchParams.has('return')).toBe(false);
  await page.locator('.results-cards article').first().getByRole('link').click();const back=await page.getByRole('link',{name:'Retour aux résultats',exact:true}).getAttribute('href');expect(back).toMatch(/^\/search\?/);expect(back).not.toContain('evil');
  await page.goto(client+'/vehicle/v1?from=2027-02-31&until=2027-03-04');await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('');await expect(page.locator('#vehicle-period-note')).toContainText('Vérifiez');
});
test('Recherche: résumé éditable, dates corrigées explicitement et dates effacées sur fiche',async({page})=>{
  await open(page,'q=Gosier&from=2027-02-31&until=2027-03-04&sort=price&view=map');await page.getByRole('button',{name:'Modifier la recherche',exact:true}).click();const d=page.getByRole('dialog',{name:'Modifier la recherche',exact:true});
  await expect(d).toContainText('2027-02-31');await d.getByLabel('Départ · heure Guadeloupe').fill('2027-06-10T11:00');await d.getByLabel('Retour · heure Guadeloupe').fill('2027-06-14T15:00');await d.getByRole('button',{name:'Rechercher',exact:true}).click();await settled(page);
  expect(new URL(page.url()).searchParams.get('view')).toBe('map');await page.locator('.results-cards article').first().getByRole('link').click();await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('2027-06-10T11:00');
  await page.getByLabel('Départ · heure Guadeloupe').fill('');await page.getByLabel('Retour · heure Guadeloupe').fill('');await page.getByLabel('Départ · heure Guadeloupe').focus();await page.reload();await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('');await expect(page.getByLabel('Retour · heure Guadeloupe')).toHaveValue('');
});
test('Recherche: chargement lent, erreur API et état vide gardent les critères et les accès de reprise',async({page})=>{
  let release;const gate=new Promise(r=>release=r);await page.route('**/api/v1/vehicles?**',async r=>{await gate;await r.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Catalogue indisponible'})});});
  try{await page.goto(client+'/search?'+query,{waitUntil:'commit'});await expect(page.locator('#search-items')).toHaveAttribute('aria-busy','true');await expect(page.getByRole('button',{name:'Modifier la recherche',exact:true})).toBeEnabled();await page.getByRole('button',{name:/^Filtres/}).click();await expect(page.getByRole('dialog',{name:'Filtres',exact:true})).toBeVisible();await page.keyboard.press('Escape');release();await settled(page);await expect(page.getByRole('button',{name:'Réessayer la recherche'})).toBeVisible();}
  finally{release();}
  await page.unroute('**/api/v1/vehicles?**');await page.getByRole('button',{name:'Réessayer la recherche'}).click();await settled(page);await expect(page.getByRole('heading',{name:'3 véhicules',exact:true})).toBeFocused();
  await open(page,query+'&state=empty');await expect(page.getByRole('heading',{name:'Aucun véhicule ici',exact:true})).toBeVisible();await expect(page.getByRole('img')).toHaveCount(0); // the empty illustration is decorative
  const reset=page.getByRole('link',{name:'Élargir la recherche'});const p=new URL(await reset.getAttribute('href'),client).searchParams;expect(p.get('q')).toBe('Gosier');expect(p.get('from')).toBe('2027-06-10');expect(p.get('view')).toBe('map');expect(p.has('state')).toBe(false);await reset.click();await settled(page);await expect(page.getByRole('heading',{name:'3 véhicules',exact:true})).toBeVisible();
});
test('Recherche: compte fictif, tous les filtres et dates transmis à la demande existante',async({page})=>{
  await page.request.post(client+'/api/v1/session',{data:{persona:'audit-r02'}});
  const criteria=new URLSearchParams(query);for(const [key,value] of Object.entries({category:'Citadine',gearbox:'Manuelle',fuel:'Essence',seats:'4',equipment:'Bluetooth'}))criteria.set(key,value);
  await open(page,criteria.toString());const url=page.url();const link=page.locator('.results-cards article[data-vehicle-id="v1"]').getByRole('link');await expect(link).toBeVisible();await link.click();
  for(const [key,value] of criteria)expect(new URL(page.url()).searchParams.get(key)).toBe(value);
  await page.getByRole('link',{name:'Retour aux résultats',exact:true}).click();await settled(page);expect(page.url()).toBe(url);await page.locator('.results-cards article[data-vehicle-id="v1"]').getByRole('link').click();
  await page.getByRole('button',{name:'Demander la location',exact:true}).click();await page.waitForURL(u=>u.pathname==='/request/v1');
  expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('rental-draft')))).toEqual({vehicleId:'v1',start:'2027-06-10T13:00:00.000Z',end:'2027-06-14T13:00:00.000Z'});
});
