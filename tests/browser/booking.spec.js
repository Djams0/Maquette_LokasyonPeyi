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
const dates={start:'2027-06-10T13:00:00.000Z',end:'2027-06-14T13:00:00.000Z'},query='?q=Gosier&from=2027-06-10&until=2027-06-14&sort=price&view=map&max=80';
async function persona(page,id='renter'){const response=await page.request.post(client+'/api/v1/session',{data:{persona:id}});expect(response.ok()).toBe(true);}
async function json(page,path,data){const response=await page.request.post(client+'/api/v1'+path,{data});expect(response.ok()).toBe(true);return response.json();}
async function record(page,id){return (await page.request.get(client+'/api/v1/rentals/'+id)).json();}
async function requestScreen(page){await persona(page);await page.goto(client+'/vehicle/v1'+query);await page.getByRole('button',{name:'Demander la location',exact:true}).click();await page.waitForURL(u=>u.pathname==='/request/v1');await expect(page.getByRole('heading',{name:'Votre demande de location',exact:true})).toBeVisible();}
async function create(page,status='requested'){
 await persona(page);const r=await json(page,'/rentals',{vehicleId:'v1',...dates});if(status!=='requested'){await persona(page,'owner');await json(page,'/rentals/'+r.id+'/accept',{});if(status==='confirmed'){await persona(page);await json(page,'/rentals/'+r.id+'/pay',{outcome:'success'});}}return r;
}
async function inspect(page,id,phase){for(const view of ['Avant','Arrière','Côté gauche','Côté droit','Intérieur','Compteur','Carburant / charge','Vue générale'])await json(page,'/rentals/'+id+'/inspection',{phase,action:'photo',view});await json(page,'/rentals/'+id+'/inspection',{phase,action:'finalize',km:phase==='departure'?10000:10100,fuel:80,confirm:true});}
for(const width of [320,375,390,430,768,1024,1280,1440])test(`Réservation: récapitulatif, action et reflow à ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:width===1440?950:844});
 await requestScreen(page);
 await page.evaluate(()=>document.fonts.ready);
 await expect(page.locator('.booking-vehicle')).toContainText('Peugeot 208');
 const period = page.locator('.booking-period');
 await expect(period).toContainText('Départ');
 await expect(period).toContainText('10 juin 2027');
 await expect(period).toContainText('Retour');
 await expect(period).toContainText('14 juin 2027');
 const rail = page.locator('.booking-aside');
 await expect(rail).toContainText('32');
 await expect(rail).toContainText('/ jour');
 await expect(rail).toContainText('4 jours');
 await expect(rail).toContainText('128');
 await expect(rail).toContainText('Aucun paiement ni blocage de caution');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 const submit = page.getByRole('button',{name:'Envoyer ma demande',exact:true});
 const box = await submit.boundingBox();
 expect(box.height).toBeGreaterThanOrEqual(48);
 if (width<1024) {
   const estimate = await rail.boundingBox();
   expect(estimate.y+estimate.height).toBeLessThan(box.y);
 }
 await submit.scrollIntoViewIfNeeded();
 await expect(submit).toBeInViewport();
 expect(await submit.evaluate(el=>{
   const r = el.getBoundingClientRect();
   return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
 })).toBe(true);
 await page.getByLabel('J’ai lu les règles').check();
 await expect(submit).toBeEnabled();
});
test('Réservation: modifier, annuler, revenir à la fiche et envoyer conservent le véhicule, la période et les critères',async({page})=>{
 await requestScreen(page);const original=await page.evaluate(()=>sessionStorage.getItem('rental-draft'));await page.getByRole('button',{name:'Modifier la période',exact:true}).click();let d=page.getByRole('dialog',{name:'Modifier la période',exact:true});await d.getByLabel('Départ · heure Guadeloupe').fill('2027-06-11T10:30');await d.getByRole('button',{name:'Annuler',exact:true}).click();expect(await page.evaluate(()=>sessionStorage.getItem('rental-draft'))).toBe(original);
 await page.getByRole('button',{name:'Modifier la période',exact:true}).click();d=page.getByRole('dialog',{name:'Modifier la période',exact:true});await d.getByLabel('Départ · heure Guadeloupe').fill('2027-06-11T10:30');await d.getByLabel('Retour · heure Guadeloupe').fill('2027-06-15T11:00');await d.getByRole('button',{name:'Appliquer la période',exact:true}).click();await expect(page.locator('.booking-period')).toContainText('11 juin 2027');
 const back=page.getByRole('link',{name:'Retour à la fiche',exact:true}),p=new URL(await back.getAttribute('href'),client).searchParams;expect(p.get('view')).toBe('map');expect(p.get('sort')).toBe('price');expect(p.get('max')).toBe('80');expect(p.get('from')).toBe('2027-06-11T10:30');await back.click();await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('2027-06-11T10:30');await page.getByRole('button',{name:'Demander la location',exact:true}).click();
 const posted=[];page.on('request',r=>{if(new URL(r.url()).pathname==='/api/v1/rentals'&&r.method()==='POST')posted.push(r.postDataJSON());});await page.getByLabel('J’ai lu les règles').check();await page.getByRole('button',{name:'Envoyer ma demande',exact:true}).click();await page.waitForURL(/\/rental\//);expect(posted).toEqual([{vehicleId:'v1',start:'2027-06-11T14:30:00.000Z',end:'2027-06-15T15:00:00.000Z'}]);const r=await record(page,new URL(page.url()).pathname.split('/').at(-1));expect(r.status).toBe('requested');expect(r.payment).toBe('not_started');expect(r.deposit).toBe('not_started');await expect(page.locator('.next-action')).toContainText('En attente du propriétaire');
});
test('Réservation: brouillon absent, corrompu, autre véhicule ou dates invalides ne produisent aucune demande implicite',async({page})=>{
 await persona(page);await page.goto(client);let posts=0;page.on('request',r=>{if(new URL(r.url()).pathname==='/api/v1/rentals'&&r.method()==='POST')posts++;});
 for(const raw of [null,'{',JSON.stringify({vehicleId:'v2',...dates}),JSON.stringify({vehicleId:'v1',start:'2027-02-31T13:00:00Z',end:dates.end})]){await page.evaluate(value=>value===null?sessionStorage.removeItem('rental-draft'):sessionStorage.setItem('rental-draft',value),raw);await page.goto(client+'/request/v1');await expect(page.getByRole('heading',{name:'Votre demande de location',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Envoyer ma demande',exact:true})).toHaveCount(0);await expect(page.locator('.booking-period')).toContainText(/brouillon/);}
 expect(posts).toBe(0);await page.getByRole('button',{name:'Modifier la période',exact:true}).click();const d=page.getByRole('dialog',{name:'Modifier la période',exact:true});await d.getByLabel('Départ · heure Guadeloupe').fill('2027-06-10T09:00');await d.getByLabel('Retour · heure Guadeloupe').fill('2027-06-14T09:00');await d.getByRole('button',{name:'Appliquer la période',exact:true}).click();await expect(page.getByRole('button',{name:'Envoyer ma demande',exact:true})).toBeVisible();expect(posts).toBe(0);
});
test('Réservation: réponse perdue, double validation et reload réutilisent la même clé sans seconde demande',async({page})=>{
 await requestScreen(page);let release,calls=0;const gate=new Promise(r=>release=r),keys=[];await page.route('**/api/v1/rentals',async route=>{if(route.request().method()!=='POST')return route.continue();calls++;keys.push(route.request().headers()['idempotency-key']);if(calls===1){await gate;await route.fetch();await route.abort();}else await route.continue();});
 await page.getByLabel('J’ai lu les règles').check();await page.getByRole('button',{name:'Envoyer ma demande',exact:true}).click();await expect(page.getByRole('button',{name:'Envoyer ma demande',exact:true})).toBeDisabled();await expect(page.locator('#request-status')).toBeVisible();await expect(page.locator('#request-status')).toHaveText('Envoi de la demande en cours.');await page.locator('#request-form').evaluate(f=>f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));try{await expect.poll(()=>calls).toBe(1);}finally{release();}await expect(page.locator('#request-form .form-error')).toContainText('Résultat non confirmé');await expect(page.locator('#request-uncertain')).toBeHidden();
 await page.reload();await expect(page.locator('#request-uncertain')).toBeVisible();await page.getByLabel('J’ai lu les règles').check();await page.getByRole('button',{name:'Envoyer ma demande',exact:true}).click();await page.waitForURL(/\/rental\//);await expect(page.getByRole('status').filter({hasText:'Demande envoyée au propriétaire.'})).toBeVisible();expect(keys.length).toBe(2);expect(keys[1]).toBe(keys[0]);const b=await (await page.request.get(client+'/api/v1/bootstrap')).json();expect(b.rentals.filter(r=>r.vehicleId==='v1'&&r.renterId==='renter')).toHaveLength(1);
});
test('Réservation: conflit serveur conserve le brouillon et permet une période corrigée',async({page})=>{
 await persona(page,'audit-r02');const other=await json(page,'/rentals',{vehicleId:'v1',...dates});await persona(page,'owner');await json(page,'/rentals/'+other.id+'/accept',{});await requestScreen(page);await page.getByLabel('J’ai lu les règles').check();await page.getByRole('button',{name:'Envoyer ma demande',exact:true}).click();await expect(page.locator('#request-form .form-error')).toContainText('Ce créneau est indisponible');expect(JSON.parse(await page.evaluate(()=>sessionStorage.getItem('rental-draft')))).toEqual({vehicleId:'v1',...dates});
 await page.getByRole('button',{name:'Modifier la période',exact:true}).click();const d=page.getByRole('dialog',{name:'Modifier la période',exact:true});await d.getByLabel('Départ · heure Guadeloupe').fill('2027-06-16T09:00');await d.getByLabel('Retour · heure Guadeloupe').fill('2027-06-18T09:00');await d.getByRole('button',{name:'Appliquer la période',exact:true}).click();
 await expect(page.locator('.booking-period')).toContainText('16 juin 2027');
 await expect(page.getByRole('button',{name:'Modifier la période',exact:true})).toBeFocused();
 const consent = page.getByLabel('J’ai lu les règles');
 await expect(consent).not.toBeChecked();
 await consent.check();
 await expect(consent).toBeChecked();
 await page.getByRole('button',{name:'Envoyer ma demande',exact:true}).click();await page.waitForURL(/\/rental\//);expect((await record(page,new URL(page.url()).pathname.split('/').at(-1))).start).toBe('2027-06-16T13:00:00.000Z');
});
test('Réservation: refus et retrait gardent une progression sans paiement',async({page})=>{
 let r=await create(page);await persona(page,'owner');await page.goto(client+'/rental/'+r.id);await page.getByRole('button',{name:'Refuser',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Confirmer',exact:true}).click();await expect(page.getByRole('heading',{name:'Demande non retenue',exact:true})).toBeVisible();await expect(page.locator('.timeline li')).toHaveCount(2);await expect(page.locator('.timeline [aria-current=step]')).toContainText('Parcours arrêté');expect((await record(page,r.id)).payment).toBe('not_started');
 r=await create(page);await page.goto(client+'/rental/'+r.id);await page.getByRole('button',{name:'Retirer ma demande',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Confirmer',exact:true}).click();await expect(page.getByRole('heading',{name:'Demande retirée',exact:true})).toBeVisible();await expect(page.locator('.timeline li')).toHaveCount(2);await expect(page.locator('.timeline [aria-current=step]')).toContainText('Parcours arrêté');expect((await record(page,r.id)).payment).toBe('not_started');
});
test('Réservation: paiement réservé au locataire, refus simulé puis récupération sans caution confondue',async({page})=>{
 const r=await create(page,'awaiting_payment');await page.goto(client+'/payment/'+r.id);await expect(page.getByRole('button',{name:'Simuler le paiement',exact:true})).toHaveCount(0);const denied=await page.request.post(client+'/api/v1/rentals/'+r.id+'/pay',{data:{outcome:'success'}});expect(denied.status()).toBe(409);
 await persona(page);await page.goto(client+'/payment/'+r.id);await page.getByLabel('Résultat à simuler').selectOption('failure');await page.getByLabel('J’ai compris que cette opération').check();await page.getByRole('button',{name:'Simuler le paiement',exact:true}).click();await expect(page.locator('.notice.error')).toContainText('Paiement refusé simulé');let state=await record(page,r.id);expect(state.status).toBe('awaiting_payment');expect(state.payment).toBe('failed');expect(state.deposit).toBe('not_started');
 await page.getByLabel('J’ai compris que cette opération').check();await page.getByRole('button',{name:'Simuler le paiement',exact:true}).click();await page.waitForURL(u=>u.pathname==='/rental/'+r.id);state=await record(page,r.id);expect(state.status).toBe('confirmed');expect(state.payment).toBe('simulated_paid');expect(state.deposit).toBe('not_started');await expect(page.locator('.next-action')).toContainText('À vous d’agir · Locataire');
});
test('Réservation: prérequis, retour déclaré, récupération et clôture restent séparés par rôle',async({page})=>{
 const r=await create(page,'confirmed');await persona(page,'owner');await page.goto(client+'/rental/'+r.id);await expect(page.getByRole('button',{name:'Remettre les clés',exact:true})).toHaveCount(0);expect((await page.request.post(client+'/api/v1/rentals/'+r.id+'/handover',{data:{controls:true}})).status()).toBe(422);
 await persona(page);await page.goto(client+'/rental/'+r.id);await page.getByRole('button',{name:'Simuler un échec de caution',exact:true}).click();await expect(page.locator('.next-action')).toContainText('a échoué');await page.getByRole('button',{name:'Simuler le contrôle de caution',exact:true}).click();await expect(page.getByRole('link',{name:'État des lieux de départ',exact:true})).toBeVisible();await inspect(page,r.id,'departure');await persona(page,'owner');await page.goto(client+'/rental/'+r.id);await page.getByRole('button',{name:'Remettre les clés',exact:true}).click();await page.getByLabel('Je confirme les contrôles').check();await page.getByRole('dialog').getByRole('button',{name:'Confirmer',exact:true}).click();await expect(page.getByRole('heading',{name:'Bonne route au Péyi',exact:true})).toBeVisible();
 await persona(page);await inspect(page,r.id,'return');await page.goto(client+'/rental/'+r.id);await page.getByRole('button',{name:'Déclarer le retour',exact:true}).click();await expect(page.getByRole('heading',{name:'Retour déclaré',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Clôturer la location',exact:true})).toHaveCount(0);await persona(page,'owner');await page.goto(client+'/rental/'+r.id);await page.getByRole('button',{name:'Confirmer la récupération des clés',exact:true}).click();await page.getByLabel('Clés et véhicule récupérés').check();await page.getByRole('dialog').getByRole('button',{name:'Confirmer',exact:true}).click();await expect(page.getByRole('heading',{name:'Récupération vérifiée',exact:true})).toBeVisible();expect((await record(page,r.id)).status).toBe('returned');await page.getByRole('button',{name:'Clôturer la location',exact:true}).click();await expect(page.getByRole('heading',{name:'Location clôturée',exact:true})).toBeVisible();expect((await record(page,r.id)).deposit).toBe('simulated_authorized');
});
test('Réservation: session expirée reprend le même brouillon après connexion, sans envoi automatique',async({page})=>{
 await requestScreen(page);await page.request.delete(client+'/api/v1/session');await page.getByLabel('J’ai lu les règles').check();await page.getByRole('button',{name:'Envoyer ma demande',exact:true}).click();await page.waitForURL(u=>u.pathname==='/login');expect(new URL(page.url()).searchParams.get('next')).toBe('/request/v1');await page.getByLabel('Compte de démonstration').selectOption('renter');await page.getByRole('button',{name:'Entrer dans la démo',exact:true}).click();await page.waitForURL(u=>u.pathname==='/request/v1');await expect(page.locator('.booking-period')).toContainText('10 juin 2027');await expect(page.getByLabel('J’ai lu les règles')).not.toBeChecked();const b=await (await page.request.get(client+'/api/v1/bootstrap')).json();expect(b.rentals.filter(r=>r.renterId==='renter'&&r.vehicleId==='v1')).toHaveLength(0);
});
test('Réservation: tiers refusé et conflit d’état ne donnent aucun droit ni confirmation optimiste',async({page})=>{
 const r=await create(page);await persona(page,'other');expect((await page.request.get(client+'/api/v1/rentals/'+r.id)).status()).toBe(403);await page.goto(client+'/rental/'+r.id);await expect(page.getByRole('heading',{name:'Accès non autorisé',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Accepter la demande',exact:true})).toHaveCount(0);
 await persona(page,'owner');await page.goto(client+'/rental/'+r.id);await json(page,'/rentals/'+r.id+'/accept',{});await page.getByRole('button',{name:'Accepter la demande',exact:true}).click();const d=page.getByRole('dialog',{name:'Action refusée',exact:true});await expect(d).toBeVisible();await d.getByRole('button',{name:'Actualiser le statut',exact:true}).click();await expect(page.locator('.next-action')).toContainText('En attente du locataire');await expect(page.getByRole('button',{name:'Accepter la demande',exact:true})).toHaveCount(0);
});
test('Réservation: conversation du bon véhicule et des bonnes parties, aide indépendante si lecture indisponible',async({page})=>{
 const r=await create(page);const c=await json(page,'/conversations',{vehicleId:'v1'});await page.goto(client+'/rental/'+r.id);await expect(page.getByRole('link',{name:'Ouvrir la conversation du véhicule',exact:true})).toHaveAttribute('href','/messages?conversation='+c.id);await expect(page.locator('#rental-conversation')).toContainText('aucun rattachement à une location précise');await page.route('**/api/v1/conversations',route=>route.abort());await page.reload();await expect(page.getByRole('heading',{name:'Demande envoyée',exact:true})).toBeVisible();await expect(page.locator('#rental-conversation').getByRole('link',{name:'Messagerie',exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'Assistance',exact:true})).toBeVisible();
});

test('Locations: onglets et retours gardent la période, la prochaine action et le bon participant',async({page})=>{
 const pending = await create(page);
 const accepted = await create(page,'awaiting_payment');
 await persona(page,'audit-r02');
 const other = await json(page,'/rentals',{vehicleId:'v1',start:'2027-06-16T13:00:00.000Z',end:'2027-06-18T13:00:00.000Z'});
 await persona(page);
 const withdrawn = await json(page,'/rentals',{vehicleId:'v1',start:'2027-06-19T13:00:00.000Z',end:'2027-06-22T13:00:00.000Z'});
 await json(page,'/rentals/'+withdrawn.id+'/withdraw',{});
 await page.goto(client+'/rentals?tab=upcoming');
 const cards = page.locator('.booking-list-card');
 const forRental = id => cards.filter({hasText:id});
 await expect(forRental(pending.id)).toContainText('En attente du propriétaire');
 await expect(forRental(pending.id).getByRole('link')).toHaveAttribute('href','/rental/'+pending.id+'?tab=upcoming');
 await expect(forRental(pending.id).locator('time').first()).toHaveAttribute('datetime',dates.start);
 await expect(forRental(accepted.id).getByRole('link')).toHaveAttribute('href','/payment/'+accepted.id);
 await expect(forRental(other.id)).toHaveCount(0);
 await expect(forRental(withdrawn.id)).toHaveCount(0);
 await page.getByRole('link',{name:'En cours',exact:true}).press('Enter');
 await expect(page.getByRole('heading',{name:'Aucune location en cours'})).toBeVisible();
 await expect(page.getByRole('link',{name:'En cours',exact:true})).toHaveAttribute('aria-current','page');
 await page.getByRole('link',{name:'Historique',exact:true}).press('Enter');
 await expect(forRental(withdrawn.id)).toContainText('Demande retirée par le locataire');
 await forRental(withdrawn.id).getByRole('link').press('Enter');
 await page.getByRole('link',{name:'Mes locations',exact:true}).press('Enter');
 await expect(page).toHaveURL(client+'/rentals?tab=history');
 await expect(forRental(withdrawn.id)).toBeVisible();
});

test('Locations: chargement, échec et reprise se distinguent de la liste vide',async({page})=>{
 await persona(page,'newcomer');
 let release;
 const gate = new Promise(done=>{release=done;});
 const bootstrap = '**/api/v1/bootstrap';
 await page.route(bootstrap,async route=>{await gate;await route.abort();});
 await page.goto(client+'/rentals?tab=history');
 await expect(page.getByRole('status',{name:'Chargement'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Votre historique est vide'})).toHaveCount(0);
 release();
 await expect(page.getByRole('heading',{name:'Locations indisponibles'})).toBeVisible();
 await expect(page.getByRole('alert')).toContainText('API injoignable');
 await page.unroute(bootstrap);
 await page.getByRole('button',{name:'Réessayer'}).press('Enter');
 await expect(page.getByRole('heading',{name:'Votre historique est vide'})).toBeFocused();
 await expect(page).toHaveURL(client+'/rentals?tab=history');
});

test('Demande: compte incomplet, véhicule propre et période passée empêchent l’envoi',async({page})=>{
 await requestScreen(page);
 const saved = await page.evaluate(()=>sessionStorage.getItem('rental-draft'));
 const attempts = [];
 page.on('request',r=>{if(new URL(r.url()).pathname==='/api/v1/rentals'&&r.method()==='POST')attempts.push(r);});
 await persona(page,'newcomer');
 await page.reload();
 await expect(page.getByRole('link',{name:'Voir mes documents'})).toHaveAttribute('href','/profile/documents');
 await expect(page.getByRole('button',{name:'Envoyer ma demande'})).toHaveCount(0);
 await expect(page.locator('.booking-period')).toContainText('10 juin 2027');
 await persona(page,'owner');
 await page.reload();
 await expect(page.getByRole('link',{name:'Gérer mon annonce'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Envoyer ma demande'})).toHaveCount(0);
 await persona(page);
 await page.clock.setFixedTime(new Date('2027-06-15T16:00:00Z'));
 await page.reload();
 await expect(page.locator('.booking-period')).toContainText('Cette période est passée');
 await expect(page.getByRole('button',{name:'Envoyer ma demande'})).toHaveCount(0);
 const back = new URL(await page.getByRole('link',{name:'Retour à la fiche'}).getAttribute('href'),client);
 expect(back.searchParams.get('view')).toBe('map');
 expect(back.searchParams.get('sort')).toBe('price');
 expect(back.searchParams.get('max')).toBe('80');
 const edit = page.getByRole('button',{name:'Modifier la période'});
 await edit.press('Enter');
 await expect(page.getByLabel('Départ · heure Guadeloupe')).toHaveValue('2027-06-10T09:00');
 await page.keyboard.press('Escape');
 await expect(edit).toBeFocused();
 expect(await page.evaluate(()=>sessionStorage.getItem('rental-draft'))).toBe(saved);
 expect(attempts).toHaveLength(0);
});

test('Demande: une coupure avant écriture conserve la clé et la période même après un retour fiche',async({page})=>{
 await requestScreen(page);
 const sent = [];
 await page.route('**/api/v1/rentals',async route=>{
   if (route.request().method()!=='POST') return route.continue();
   sent.push([route.request().headers()['idempotency-key'],route.request().postData()]);
   if (sent.length===1) await route.abort();
   else await route.continue();
 });
 await page.getByLabel('J’ai lu les règles').check();
 await page.getByRole('button',{name:'Envoyer ma demande'}).click();
 await expect(page.locator('#request-form .form-error')).toContainText('Résultat non confirmé');
 await expect(page.getByLabel('J’ai lu les règles')).toBeChecked();
 await expect(page.getByRole('button',{name:'Modifier la période'})).toBeDisabled();
 let data = await (await page.request.get(client+'/api/v1/bootstrap')).json();
 expect(data.rentals.filter(r=>r.vehicleId==='v1'&&r.renterId==='renter')).toHaveLength(0);
 await page.getByRole('link',{name:'Retour à la fiche'}).click();
 await page.goto(client+'/vehicle/v1?from=2027-06-16&until=2027-06-18');
 await page.getByRole('button',{name:'Demander la location',exact:true}).click();
 await expect(page.locator('#request-uncertain')).toBeVisible();
 await expect(page.locator('.booking-period')).toContainText('10 juin 2027');
 await expect(page.getByRole('button',{name:'Modifier la période'})).toHaveCount(0);
 const back = new URL(await page.getByRole('link',{name:'Retour à la fiche'}).getAttribute('href'),client);
 expect(back.searchParams.get('view')).toBe('map');
 expect(back.searchParams.get('max')).toBe('80');
 expect(back.searchParams.get('from')).toBe('2027-06-10');
 await page.getByLabel('J’ai lu les règles').check();
 await page.getByRole('button',{name:'Envoyer ma demande'}).click();
 await page.waitForURL(/\/rental\//);
 expect(sent).toHaveLength(2);
 expect(sent[1]).toEqual(sent[0]);
 data = await (await page.request.get(client+'/api/v1/bootstrap')).json();
 expect(data.rentals.filter(r=>r.vehicleId==='v1'&&r.renterId==='renter'&&r.start===dates.start)).toHaveLength(1);
 expect(JSON.parse(await page.evaluate(()=>sessionStorage.getItem('rental-draft'))).start).toBe('2027-06-16T13:00:00.000Z');
});

test('Demande: un formulaire ouvert sous un autre compte ne peut pas envoyer',async({page})=>{
 await requestScreen(page);
 await persona(page,'newcomer');
 await page.getByLabel('J’ai lu les règles').check();
 await page.getByRole('button',{name:'Envoyer ma demande'}).click();
 await expect(page.getByRole('link',{name:'Voir mes documents'})).toBeVisible();
 await expect(page.getByLabel('J’ai lu les règles')).toHaveCount(0);
 const data = await (await page.request.get(client+'/api/v1/bootstrap')).json();
 expect(data.rentals.filter(r=>r.vehicleId==='v1')).toHaveLength(0);
 await persona(page);
 await page.reload();
 await expect(page.locator('.booking-period')).toContainText('10 juin 2027');
 await expect(page.getByLabel('J’ai lu les règles')).not.toBeChecked();
});

test('Demande: le calcul conserve les centimes et un tarif absent bloque la confirmation',async({page})=>{
 await requestScreen(page);
 let price = 32.5;
 await page.route('**/api/v1/vehicles/v1',async route=>{
   const response = await route.fetch();
   await route.fulfill({response,json:{...await response.json(),price}});
 });
 await page.reload();
 const estimate = page.locator('.request-estimate');
 await expect(estimate).toContainText('32,5');
 await expect(estimate).toContainText('4 jours');
 await expect(estimate).toContainText('130');
 price = null;
 await page.reload();
 await expect(estimate).toContainText('Montant à confirmer');
 await expect(page.getByText('Tarif indisponible.',{exact:false})).toBeVisible();
 await expect(page.getByRole('button',{name:'Envoyer ma demande'})).toHaveCount(0);
 price = 32;
 await page.evaluate(()=>{
   const signature = sessionStorage.getItem('rental-draft');
   sessionStorage.setItem('rental-attempt:renter:v1',JSON.stringify({signature,key:'------------------------------------'}));
 });
 await page.reload();
 await expect(page.getByText('La tentative locale ne peut pas être vérifiée.',{exact:false})).toBeVisible();
 await expect(page.getByRole('button',{name:'Envoyer ma demande'})).toHaveCount(0);
});

test('Paiement: réponse perdue après écriture, statut relu sans double simulation',async({page})=>{
 const r = await create(page,'awaiting_payment');
 await persona(page);
 await page.goto(client+'/payment/'+r.id);
 let release, writes = 0;
 const gate = new Promise(done=>{release=done;});
 await page.route('**/api/v1/rentals/'+r.id+'/pay',async route=>{
   writes++;
   await gate;
   expect((await route.fetch()).ok()).toBe(true);
   await route.abort();
 });
 const outcome = page.getByLabel('Résultat à simuler');
 const consent = page.getByLabel('J’ai compris que cette opération');
 const submit = page.getByRole('button',{name:'Simuler le paiement'});
 await outcome.selectOption('failure');
 await consent.check();
 await submit.click();
 try {
   await expect(submit).toBeDisabled();
   await expect(page.locator('#payment-status')).toHaveText('Simulation de paiement en cours.');
   await expect(page.getByText('Paiement fictif confirmé.',{exact:false})).toHaveCount(0);
   await page.locator('#payment-form').evaluate(el=>el.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
   await expect.poll(()=>writes).toBe(1);
 } finally {release();}
 await expect(page.getByRole('alert')).toContainText('Résultat non confirmé');
 await expect(submit).toBeDisabled();
 await expect(outcome).toHaveValue('failure');
 await expect(consent).toBeChecked();
 await page.getByRole('button',{name:'Actualiser le statut'}).click();
 await expect(page.locator('.notice.error')).toContainText('La demande reste acceptée');
 await expect(page.getByRole('heading',{name:'État du paiement'})).toBeFocused();
 const latest = await record(page,r.id);
 expect(latest.status).toBe('awaiting_payment');
 expect(latest.payment).toBe('failed');
 expect(latest.deposit).toBe('not_started');
 expect(latest.history.filter(e=>e.action==='pay')).toHaveLength(1);
 expect(writes).toBe(1);
});

test('Paiement: après une coupure avant écriture, la relecture conserve la saisie et la clé',async({page})=>{
 const r = await create(page,'awaiting_payment');
 await persona(page);
 await page.goto(client+'/payment/'+r.id);
 const attempts = [];
 await page.route('**/api/v1/rentals/'+r.id+'/pay',async route=>{
   attempts.push({key:route.request().headers()['idempotency-key'],body:route.request().postDataJSON()});
   if (attempts.length===1) await route.abort();
   else await route.continue();
 });
 const outcome = page.getByLabel('Résultat à simuler');
 const consent = page.getByLabel('J’ai compris que cette opération');
 const submit = page.getByRole('button',{name:'Simuler le paiement'});
 await outcome.selectOption('failure');
 await consent.check();
 await submit.click();
 await expect(page.getByRole('alert')).toContainText('Résultat non confirmé');
 expect((await record(page,r.id)).history.filter(e=>e.action==='pay')).toHaveLength(0);
 await page.getByRole('button',{name:'Actualiser le statut'}).press('Enter');
 await expect(page.locator('#payment-status')).toContainText('Statut vérifié');
 await expect(outcome).toHaveValue('failure');
 await expect(consent).toBeChecked();
 await expect(submit).toBeFocused();
 await page.reload();
 await expect(outcome).toHaveValue('failure');
 await expect(consent).not.toBeChecked();
 await consent.check();
 await submit.press('Enter');
 await expect(page.locator('.notice.error')).toContainText('Paiement refusé simulé');
 expect((await record(page,r.id)).history.filter(e=>e.action==='pay')).toHaveLength(1);
 expect(attempts).toHaveLength(2);
 expect(attempts[0].key).toMatch(/^[a-f0-9-]{36}$/);
 expect(attempts[1]).toEqual(attempts[0]);
});

test('Suivi: une acceptation à réponse perdue impose une relecture et garde le rendez-vous masqué',async({page})=>{
 const r = await create(page);
 await persona(page,'owner');
 await page.goto(client+'/rental/'+r.id);
 await expect(page.getByText('Point de rendez-vous fictif',{exact:false})).toHaveCount(0);
 let writes = 0;
 await page.route('**/api/v1/rentals/'+r.id+'/accept',async route=>{
   writes++;
   expect((await route.fetch()).ok()).toBe(true);
   await route.abort();
 });
 await page.getByRole('button',{name:'Accepter la demande'}).click();
 const uncertain = page.getByRole('dialog',{name:'Résultat à vérifier'});
 await expect(uncertain).toBeVisible();
 await expect(page.getByRole('heading',{name:'Demande envoyée',exact:true})).toBeVisible();
 await uncertain.getByRole('button',{name:'Actualiser le statut'}).click();
 await expect(page.getByRole('heading',{name:'Votre demande a été acceptée'})).toBeVisible();
 await expect(page.getByText('Point de rendez-vous fictif',{exact:false})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Accepter la demande'})).toHaveCount(0);
 expect((await record(page,r.id)).history.filter(e=>e.action==='accept')).toHaveLength(1);
 expect(writes).toBe(1);
});

test('Suivi: à 320 px, sept jalons, étapes précédentes accessibles et statut inconnu sans action',async({page})=>{
 const r = await create(page,'confirmed');
 await page.setViewportSize({width:320,height:720});
 await page.goto(client+'/rental/'+r.id);
 const current = page.locator('[aria-current=step]');
 await expect(current).toContainText('Paiement et confirmation');
 await expect(page.locator('.timeline li')).toHaveCount(7);
 const previous = page.getByText('Étapes précédentes (2)',{exact:true});
 await expect(page.getByRole('list',{name:'Jalons précédents'})).toBeHidden();
 await previous.press('Enter');
 await expect(page.getByRole('list',{name:'Jalons précédents'})).toBeVisible();
 const deposit = page.getByRole('button',{name:'Simuler le contrôle de caution',exact:true});
 await deposit.press('Tab');
 await page.keyboard.press('Shift+Tab');
 await expect(deposit).toBeFocused();
 await page.evaluate(()=>document.fonts.ready);
 await deposit.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 await expect(deposit).toBeInViewport({ratio:.99});
 expect(await deposit.evaluate(el=>{
   const r = el.getBoundingClientRect();
   return r.height>=44 && el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
 })).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);
 await page.route('**/api/v1/rentals/'+r.id,async route=>{
   const response = await route.fetch();
   await route.fulfill({response,json:{...await response.json(),status:'futur',meeting:'Adresse de test confidentielle'}});
 });
 await page.reload();
 await expect(page.getByRole('heading',{name:'État à actualiser'})).toBeVisible();
 await expect(page.locator('.next-action')).toContainText('Statut à vérifier');
 await expect(current).toHaveCount(0);
 await expect(deposit).toHaveCount(0);
 await expect(page.getByText('Adresse de test confidentielle')).toHaveCount(0);
});

test('Paiement: session expirée rend la connexion puis le devis sans envoi automatique',async({page})=>{
 const r = await create(page,'awaiting_payment');
 await persona(page);
 const back = '/payment/'+r.id;
 await page.goto(client+back);
 await page.request.delete(client+'/api/v1/session');
 await page.getByLabel('J’ai compris que cette opération').check();
 await page.getByRole('button',{name:'Simuler le paiement'}).click();
 await page.waitForURL(u=>u.pathname==='/login');
 expect(new URL(page.url()).searchParams.get('next')).toBe(back);
 await page.getByLabel('Compte de démonstration').selectOption('renter');
 await page.getByRole('button',{name:'Entrer dans la démo',exact:true}).click();
 await expect(page).toHaveURL(client+back);
 await expect(page.getByLabel('J’ai compris que cette opération')).not.toBeChecked();
 expect((await record(page,r.id)).history.filter(e=>e.action==='pay')).toHaveLength(0);
});

test('Paiement: un 409 concurrent affiche le résultat relu et retire la commande',async({page})=>{
 const r = await create(page,'awaiting_payment');
 await persona(page);
 await page.goto(client+'/payment/'+r.id);
 await json(page,'/rentals/'+r.id+'/pay',{outcome:'success'});
 await page.getByLabel('J’ai compris que cette opération').check();
 await page.getByRole('button',{name:'Simuler le paiement'}).click();
 await expect(page.getByRole('alert')).toContainText('Cette transition n’est pas disponible');
 await expect(page.getByRole('button',{name:'Simuler le paiement'})).toBeDisabled();
 await page.getByRole('button',{name:'Actualiser le statut'}).click();
 await expect(page.getByText('Paiement fictif confirmé.',{exact:false})).toBeVisible();
 await expect(page.getByRole('button',{name:'Simuler le paiement'})).toHaveCount(0);
 const current = await record(page,r.id);
 expect(current.history.filter(e=>e.action==='pay')).toHaveLength(1);
 expect(current.deposit).toBe('not_started');
});

test('Suivi: un prérequis refusé par l’API garde la confirmation et le focus dans le dialogue',async({page})=>{
 const r = await create(page,'confirmed');
 await json(page,'/rentals/'+r.id+'/deposit',{outcome:'success'});
 await persona(page,'owner');
 await page.route('**/api/v1/rentals/'+r.id,async route=>{
   const response = await route.fetch();
   const rental = await response.json();
   await route.fulfill({response,json:{...rental,inspections:[{phase:'departure',finalized:true,photos:[]}]}});
 });
 await page.goto(client+'/rental/'+r.id);
 const trigger = page.getByRole('button',{name:'Remettre les clés'});
 await trigger.press('Enter');
 const dialog = page.getByRole('dialog',{name:'Remise du véhicule'});
 const confirm = dialog.getByLabel('Je confirme les contrôles');
 await confirm.check();
 await dialog.getByRole('button',{name:'Confirmer',exact:true}).click();
 const error = dialog.getByRole('alert');
 await expect(error).toContainText('L’état des lieux de départ doit être finalisé.');
 await expect(error).toBeFocused();
 await expect(confirm).toBeChecked();
 expect((await record(page,r.id)).status).toBe('confirmed');
 await page.keyboard.press('Escape');
 await expect(trigger).toBeFocused();
});
