import {test,expect} from '@playwright/test';import {spawn} from 'node:child_process';
import {createApi} from '../../api/server.mjs';import {auditFixture} from '../../api/audit-fixture.mjs';
let target,client,admin,children=[];
test.beforeEach(async()=>{const allowedOrigins=new Set();target=createApi({initialize:auditFixture,allowedOrigins});await new Promise(r=>target.server.listen(0,'127.0.0.1',r));
  async function web(app){const child=spawn(process.execPath,['scripts/web.mjs',app],{env:{...process.env,PORT:'0',API_URL:`http://127.0.0.1:${target.server.address().port}`,DEMO_LOOPBACK:'1'},stdio:['ignore','pipe','pipe']});children.push(child);return new Promise((resolve,reject)=>{child.on('error',reject);child.stdout.on('data',data=>{const m=String(data).match(/sur (\d+)/);if(m)resolve(`http://127.0.0.1:${m[1]}`);});});}
  client=await web('client');admin=await web('admin');allowedOrigins.add(client);allowedOrigins.add(admin);
});
test.afterEach(async()=>{children.forEach(c=>c.kill());children=[];await new Promise(r=>target.server.close(r));});

test('Recette visuelle: onglet Avis entièrement visible au clavier à 320px',async({page})=>{
  await page.setViewportSize({width:320,height:844});expect((await page.request.post(admin+'/api/v1/session',{data:{persona:'audit-a05'}})).ok()).toBe(true);await page.goto(admin+'/moderation?tab=documents');await expect(page.locator('#main')).toHaveAttribute('data-admin-ready','true');
  await page.getByRole('link',{name:'Aller au contenu',exact:true}).focus();await page.keyboard.press('Enter');for(let n=0;n<4;n++)await page.keyboard.press('Tab');
  const tab=page.getByRole('link',{name:'Avis',exact:true});await expect(tab).toBeFocused();const rect=await tab.boundingBox();expect(rect.x).toBeGreaterThanOrEqual(0);expect(rect.x+rect.width).toBeLessThanOrEqual(320);expect(rect.height).toBeGreaterThanOrEqual(48);expect(await tab.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})).toBe(true);
});

test('Recette visuelle: Nunito pour les titres opérationnels, Lora pour la découverte',async({page})=>{
  const check=async(path,family)=>{await page.goto(client+path);await expect(page.locator('#main h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);const style=await page.locator('#main h1').evaluate(el=>({family:getComputedStyle(el).fontFamily,weight:getComputedStyle(el).fontWeight}));expect(style.family).toContain(family);if(family==='Nunito')expect(style.weight).toBe('800');};
  await check('/','Lora');await check('/vehicle/v1?from=2027-06-10&until=2027-06-14','Lora');await check('/search?q=Gosier','Lora');
  expect((await page.request.post(client+'/api/v1/session',{data:{persona:'renter'}})).ok()).toBe(true);await check('/messages','Nunito');await page.evaluate(()=>sessionStorage.setItem('rental-draft',JSON.stringify({vehicleId:'v1',start:'2027-06-10T13:00:00.000Z',end:'2027-06-14T13:00:00.000Z'})));await check('/request/v1','Nunito');
  expect((await page.request.post(client+'/api/v1/session',{data:{persona:'audit-r02'}})).ok()).toBe(true);const rental=target.store.db.rentals.find(r=>r.renterId==='audit-r02'&&r.status==='confirmed');await check('/rental/'+rental.id,'Nunito');
});

test('Recette V3.2 à 1280 px: recherche et fiche utilisables au clavier', async ({page}) => {
  await page.setViewportSize({width:1280,height:760});
  await page.goto(client + '/');
  const submit = page.getByRole('button',{name:'Trouver une voiture',exact:true});
  await expect(submit).toBeVisible();
  const credit = page.getByRole('link',{name:/Photo · artificiality/});
  await expect(credit).toHaveAttribute('href','/assets/v32/credits.html#photo-49');
  await page.getByRole('searchbox',{name:'Lieu de remise'}).press('Enter');
  await expect(page).toHaveURL(/\/search(?:\?|$)/);
  await expect(page.locator('#search-items')).toHaveAttribute('aria-busy','false');
  await expect(page.locator('#filter-home #search-filters')).toBeVisible();
  const catalogueUrl = page.url();
  const vehicle = page.locator('#search-items a[href^="/vehicle/v3"]').first();
  await expect(vehicle).toBeVisible();
  await vehicle.press('Enter');
  await expect(page).toHaveURL(/\/vehicle\/v3(?:\?|$)/);
  await expect(page.getByRole('link',{name:'Retour aux résultats'})).toHaveAttribute(
    'href',new URL(catalogueUrl).pathname + new URL(catalogueUrl).search,
  );
  const request = page.getByRole('button',{name:'Demander la location',exact:true});
  await expect(request).toBeVisible();
  expect((await request.boundingBox()).height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
