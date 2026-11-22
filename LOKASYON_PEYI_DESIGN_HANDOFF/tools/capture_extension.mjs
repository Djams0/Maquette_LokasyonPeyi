import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const [base,output,group='protected']=process.argv.slice(2);
if(!base || !output || !['protected','client','all'].includes(group)) {
  throw new Error('Usage: node capture_extension.mjs http://127.0.0.1:8080 dossier protected|client|all');
}
const origin=new URL(base);
if(!['localhost','127.0.0.1','[::1]'].includes(origin.hostname)) throw new Error('Utiliser une instance locale et jetable.');
const sizes={320:844,375:844,390:844,430:932,768:950,1024:900,1280:760,1440:960};
const protectedScenes=[
  ['accueil','/','#explorer-catalogue[aria-busy="false"]'],
  ['catalogue','/search','#search-items[aria-busy="false"]'],
  ['fiche','/vehicle/v3','.vehicle-detail-layout']
];
const clientScenes=[
  ['connexion','/login',null],['inscription','/register',null],
  ['faq','/faq',null],['proprietaire-intro','/owner/start',null],
  ['profil','/profile','renter'],['documents','/profile/documents','newcomer'],
  ['notifications','/notifications','renter'],['avis','/profile/reviews','renter'],
  ['locations','/rentals','renter'],['messages','/messages','renter'],
  ['assistance','/assistance','renter'],['dossiers','/cases','renter'],
  ['dossier','/cases/case-demo','renter'],
  ['owner','/owner','owner'],['parc','/owner/vehicles','owner'],
  ['gestion','/owner/vehicles/v1','owner'],['demandes','/owner/requests','owner'],
  ['revenus','/owner/revenue','owner'],['reputation','/owner/reputation','owner'],
  ['assistant','/owner/vehicles/new?step=5','owner'],
  ['demo','/demo',null],['audit','/demo/audit',null],['composants','/design-system',null]
];
const browser=await chromium.launch();
const result=[];
await mkdir(output,{recursive:true});

async function capture(width, scene, type){
  const [name, route, special]=scene;
  const role=type==='client'?special:null;
  const ready=type==='protected'?special:'#main h1';
  const viewport={width,height:sizes[width]};
  const context=await browser.newContext({viewport,locale:'fr-FR',timezoneId:'America/Guadeloupe',deviceScaleFactor:1,reducedMotion:'reduce',colorScheme:'light'});
  try{
    if(role){
      const session=await context.request.post(new URL('/api/v1/session',origin).href,{data:{persona:role}});
      if(!session.ok()) throw new Error('Connexion de démonstration impossible : '+role);
    }
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.clock.setFixedTime(new Date('2026-11-21T16:00:00.000Z'));
    const response=await page.goto(new URL(route,origin).href);
    if(!response?.ok()) throw new Error('Navigation refusée : '+route);
    await page.locator(ready).first().waitFor({state:'visible',timeout:18000});
    await page.evaluate(async()=>{
      await document.fonts.ready;
      await Promise.all([...document.images].filter(img=>img.loading!=='lazy').map(img=>img.decode().catch(()=>{})));
    });
    const info=await page.evaluate(()=>{
      const main=document.querySelector('main'), heading=main?.querySelector('h1');
      return {h1:heading?.textContent.trim(),scrollWidth:document.documentElement.scrollWidth,headings:[...main.querySelectorAll('h2')].filter(x=>x.getClientRects().length).map(x=>x.textContent.trim()),errorsVisible:[...main.querySelectorAll('[role="alert"]')].filter(x=>x.getClientRects().length&&x.textContent.trim()).map(x=>x.textContent.trim())};
    });
    const filename=type+'-'+name+'-'+width+'.png';
    await page.screenshot({path:join(output,filename),animations:'disabled'});
    result.push({type,route,role,viewport,filename,url:new URL(page.url()).pathname,...info,errors});
  }finally{
    await context.close();
  }
}

try{
  if(group!=='client')for(const width of Object.keys(sizes).map(Number))for(const scene of protectedScenes)await capture(width,scene,'protected');
  if(group!=='protected')for(const width of [390,1440])for(const scene of clientScenes)await capture(width,scene,'client');
}finally{
  await browser.close();
  await writeFile(join(output,'captures-'+group+'.json'),JSON.stringify({browser:browser.version(),fixedTime:'2026-11-21T16:00:00Z',locale:'fr-FR',timezone:'America/Guadeloupe',result},null,2)+'\n');
}
if(result.some(x=>x.errors.length))process.exitCode=1;
