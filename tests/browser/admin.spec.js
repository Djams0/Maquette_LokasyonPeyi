import {test,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {createApi} from '../../api/server.mjs';
import {auditFixture} from '../../api/audit-fixture.mjs';
let target,client,admin,children=[];
test.beforeEach(async()=>{
  const allowedOrigins=new Set();target=createApi({initialize:auditFixture,allowedOrigins});await new Promise(r=>target.server.listen(0,'127.0.0.1',r));
  async function web(app){const child=spawn(process.execPath,['scripts/web.mjs',app],{env:{...process.env,PORT:'0',API_URL:`http://127.0.0.1:${target.server.address().port}`,DEMO_LOOPBACK:'1'},stdio:['ignore','pipe','pipe']});children.push(child);return new Promise((resolve,reject)=>{child.on('error',reject);child.stdout.on('data',data=>{const m=String(data).match(/sur (\d+)/);if(m)resolve(`http://127.0.0.1:${m[1]}`);});});}
  client=await web('client');admin=await web('admin');allowedOrigins.add(client);allowedOrigins.add(admin);
});
test.afterEach(async()=>{children.forEach(c=>c.kill());children=[];if(target)await new Promise(r=>target.server.close(r));});
async function persona(page,id='audit-a05',internal=true){expect((await page.request.post((internal?admin:client)+'/api/v1/session',{data:{persona:id}})).ok()).toBe(true);}
async function open(page,path='/',id='audit-a05'){await persona(page,id);await page.goto(admin+path);await expect(page.locator('#main')).toHaveAttribute('data-admin-ready','true');}
const doc=()=>target.store.db.documents.find(d=>d.status==='pending'&&d.assignedTo?.includes('audit-a05'));
const dossier=()=>target.store.db.cases.find(c=>!c.sensitive&&c.assignedTo?.includes('audit-a05'));
const writes=(page,path)=>{const calls=[];page.on('request',r=>{if(r.method()==='POST'&&new URL(r.url()).pathname==='/api/v1'+path)calls.push(r.postDataJSON());});return calls;};
async function review(page,decision='verified'){for(let n=0;n<5;n++)await page.locator(`[name=check${n}][value=pass]`).check();await page.getByLabel('Décision',{exact:true}).selectOption(decision);await page.getByLabel('Motif de décision',{exact:true}).fill('Décision synthétique de recette Admin.');}
for(const width of [320,375,390,430,768,1024,1440])test(`Admin: files, détails et habilitations lisibles à ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:844});await persona(page);
  const db=target.store.db,v=db.vehicles.find(v=>v.assignedTo?.includes('audit-a05'));
  for(const path of ['/','/moderation','/moderation?tab=documents','/moderation/documents/'+doc().id,'/moderation/listings/'+v.id,'/users','/cases','/cases/'+dossier().id,'/payments']){
    await page.goto(admin+path);await expect(page.locator('#main')).toHaveAttribute('data-admin-ready','true');await page.evaluate(()=>document.fonts.ready);await expect(page.locator('#main h1')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),path).toBeLessThanOrEqual(1);
    if(path==='/moderation'){const row=page.locator('tbody tr').first();await expect(row).toContainText('v1');await expect(row).toContainText('audit-a05');await expect(row.getByRole('link',{name:'Examiner',exact:true})).toBeVisible();expect((await row.getByRole('link').boundingBox()).height).toBeGreaterThanOrEqual(48);expect(await row.getByRole('link').evaluate(el=>{const range=document.createRange();range.selectNodeContents(el);return range.getClientRects().length;})).toBe(1);}
  }
  await open(page,'/administration','super');expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
});

test('Admin: panneau nommé, focus contenu, Échap et redimensionnement',async({page})=>{
  await page.setViewportSize({width:320,height:844});await open(page,'/cases','audit-a04');const trigger=page.getByRole('button',{name:'Menu',exact:true});await trigger.click();
  const dialog=page.getByRole('dialog',{name:'Navigation administration',exact:true});await expect(dialog).toBeVisible();await expect(dialog.getByRole('link',{name:'Litiges & signalements',exact:true})).toHaveAttribute('aria-current','page');
  for(let n=0;n<10;n++){await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.getElementById('sidebar').contains(document.activeElement))).toBe(true);}
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(trigger).toHaveAttribute('aria-expanded','false');await trigger.click();await page.setViewportSize({width:1440,height:950});await expect(page.getByRole('navigation',{name:'Navigation administration'})).toBeVisible();await page.setViewportSize({width:320,height:844});await expect(trigger).toBeFocused();
});

test('Admin: profil limité, refus directs, suspendu et cookies distincts',async({page})=>{
  await persona(page,'audit-r02',false);await open(page,'/','audit-a04');await expect(page.getByRole('link',{name:'Ouvrir mon espace',exact:true})).toHaveAttribute('href','/cases');
  await page.goto(admin+'/payments');await expect(page.locator('#main h1')).toHaveText('Accès limité à votre périmètre');expect((await page.request.get(admin+'/api/v1/admin/payments')).status()).toBe(403);
  await page.goto(admin+'/moderation/documents/'+doc().id);await expect(page.locator('#main h1')).toHaveText('Accès limité à votre périmètre');
  expect((await (await page.request.get(client+'/api/v1/me')).json()).id).toBe('audit-r02');expect((await page.request.post(admin+'/api/v1/session',{data:{persona:'audit-a10'}})).status()).toBe(401);
});

test('Admin: filtres de file et retour local conservés, retour externe rejeté',async({page})=>{
  const d=doc();await open(page,'/moderation?tab=documents&state=pending&q='+encodeURIComponent(d.id));await expect(page.locator('tbody tr')).toHaveCount(1);await page.getByRole('link',{name:'Contrôler la pièce',exact:true}).click();
  const back=page.getByRole('link',{name:'Documents affectés',exact:true});expect(new URL(await back.getAttribute('href'),admin).searchParams.get('q')).toBe(d.id);await back.click();await expect(page.getByLabel('Rechercher',{exact:true})).toHaveValue(d.id);await expect(page.getByLabel('État',{exact:true})).toHaveValue('pending');
  await page.goto(admin+'/moderation/documents/'+d.id+'?return='+encodeURIComponent('//example.com/'));await expect(page.getByRole('link',{name:'Documents affectés',exact:true})).toHaveAttribute('href','/moderation?tab=documents');
});

test('Admin: pièce remplacée, ancienne saisie conservée sans décision ni report',async({page})=>{
  const d=doc(),path='/admin/documents/'+d.id;await open(page,'/moderation/documents/'+d.id);await review(page);const calls=writes(page,path);d.version++;d.status='pending';
  await page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true}).click();await expect(page.locator('[data-admin-stale]')).toContainText('version 2');await expect(page.getByLabel('Motif de décision',{exact:true})).toHaveValue('Décision synthétique de recette Admin.');await expect(page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true})).toBeDisabled();expect(calls).toHaveLength(0);
  await page.getByRole('link',{name:'Ouvrir la version courante',exact:true}).click();await expect(page.locator('#main .eyebrow')).toContainText('version 2');await expect(page.locator('[name=check0]:checked')).toHaveCount(0);await expect(page.getByLabel('Motif de décision',{exact:true})).toHaveValue('');
});

test('Admin: conflit serveur après relecture, aucune décision sur nouvelle version',async({page})=>{
  const d=doc();await open(page,'/moderation/documents/'+d.id);await review(page);await page.route('**/api/v1/admin/documents/'+d.id,async route=>{if(route.request().method()==='POST')d.version++;await route.continue();});
  await page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true}).click();await expect(page.locator('[data-admin-stale]')).toBeVisible();expect(d.status).toBe('pending');expect(d.reviews||[]).toHaveLength(0);
});

test('Admin: critères, justification non applicable, refus et nouvelle revue',async({page})=>{
  const d=doc();await open(page,'/moderation/documents/'+d.id);await review(page);await page.locator('[name=check0][value=fail]').check();await page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true}).click();await expect(page.locator('.form-error')).not.toBeEmpty();expect(d.status).toBe('pending');
  await page.locator('[name=check0][value=na]').check();await page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true}).click();await expect(page.locator('.form-error')).not.toBeEmpty();expect(d.status).toBe('pending');
  await page.getByLabel('Observation / justification si non applicable',{exact:true}).first().fill('Non applicable à cette simulation.');await page.getByLabel('Décision',{exact:true}).selectOption('rejected');await page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true}).click();await expect(page.locator('#main')).toContainText('Cette version a déjà une décision.');expect(target.store.db.documents.find(x=>x.id===d.id).status).toBe('rejected');const recorded=target.store.db.documentReviews.filter(x=>x.documentId===d.id).at(-1);expect(recorded.documentVersion).toBe(1);expect(recorded.agent).toBe('audit-a05');
});

test('Admin: annonce, trois pièces et couverture restent contrôlées par le serveur',async({page})=>{
  const v=target.store.db.vehicles.find(v=>v.status==='pending'&&v.assignedTo?.includes('audit-a05'));await open(page,'/moderation/listings/'+v.id);await page.getByLabel('Décision',{exact:true}).selectOption('published');await page.getByLabel('Motif communiqué au propriétaire',{exact:true}).fill('Recette publication fictive.');await page.getByRole('button',{name:'Enregistrer la décision',exact:true}).click();await expect(page.locator('.form-error')).not.toBeEmpty();expect(v.status).toBe('pending');
  const docs=target.store.db.documents.filter(d=>d.vehicleId===v.id);docs.forEach(d=>d.status='verified');await page.reload();await page.getByLabel('Décision',{exact:true}).selectOption('published');await page.getByLabel('Motif communiqué au propriétaire',{exact:true}).fill('Recette publication fictive.');await page.getByRole('button',{name:'Enregistrer la décision',exact:true}).click();await expect(page.locator('.form-error')).not.toBeEmpty();expect(v.status).toBe('pending');
  await page.getByLabel('Conditions fictives de location rémunérée contrôlées',{exact:true}).check();await page.getByRole('button',{name:'Enregistrer la décision',exact:true}).click();await page.waitForURL(u=>u.pathname==='/moderation');expect(target.store.db.vehicles.find(x=>x.id===v.id).status).toBe('published');expect(target.store.db.vehicles.find(x=>x.id===v.id).version).toBe(2);
});

test('Admin: remplacement de pièce sans changement de version annonce bloque la décision',async({page})=>{
  const db=target.store.db,v=db.vehicles.find(v=>v.status==='pending'&&v.assignedTo?.includes('audit-a05'));await open(page,'/moderation/listings/'+v.id);await page.getByLabel('Motif communiqué au propriétaire',{exact:true}).fill('Motif local à conserver.');const calls=writes(page,'/admin/listings/'+v.id);db.documents.find(d=>d.vehicleId===v.id).version++;
  await page.getByRole('button',{name:'Enregistrer la décision',exact:true}).click();await expect(page.locator('[data-admin-stale]')).toBeVisible();expect(calls).toHaveLength(0);expect(v.version).toBe(1);await expect(page.getByLabel('Motif communiqué au propriétaire',{exact:true})).toHaveValue('Motif local à conserver.');
});

test('Admin: notes privées séparées, lecture seule et progression du dossier',async({page})=>{
  const c=dossier();await open(page,'/cases/'+c.id,'audit-a04');await expect(page.getByLabel('État suivant',{exact:true})).toHaveCount(0);await expect(page.getByLabel('Nouvelle note interne',{exact:true})).toHaveCount(0);await expect(page.getByLabel('Message visible par les participants',{exact:true})).toBeVisible();
  expect((await page.request.post(admin+'/api/v1/admin/cases/'+c.id,{data:{action:'note',text:'Note interdite'}})).status()).toBe(403);
  await open(page,'/cases/'+c.id);await page.getByLabel('Nouvelle note interne',{exact:true}).fill('Note privée de recette Admin.');await page.getByRole('button',{name:'Ajouter la note',exact:true}).click();await expect(page.locator('.internal-note')).toContainText('Note privée');await persona(page,c.participants[0],false);const safe=await (await page.request.get(client+'/api/v1/cases/'+c.id)).json();expect(safe.notes).toBeUndefined();expect(safe.assignedTo).toBeUndefined();expect(JSON.stringify(safe)).not.toContain('Note privée');
  await page.getByLabel('État suivant',{exact:true}).selectOption('closed');await page.getByLabel('Motif communiqué',{exact:true}).fill('Saut interdit de recette.');await page.getByRole('button',{name:'Enregistrer cette étape',exact:true}).click();await expect(page.locator('#case-status .form-error')).toContainText('étapes');expect(c.status).toBe('received');
  await page.route('**/api/v1/admin/cases/'+c.id,async route=>{if(route.request().method()==='POST')await new Promise(r=>setTimeout(r,150));await route.continue();});const saved=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/v1/admin/cases/'+c.id&&r.request().method()==='POST');await page.getByLabel('État suivant',{exact:true}).selectOption('evidence_requested');await page.getByRole('button',{name:'Enregistrer cette étape',exact:true}).click();expect((await saved).status()).toBe(200);await expect(page.getByLabel('État suivant',{exact:true})).toHaveValue('evidence_requested');expect(target.store.db.cases.find(x=>x.id===c.id).status).toBe('evidence_requested');
});

test('Admin: dossier modifié avant décision, saisie préservée et version relue',async({page})=>{
  const c=dossier();await open(page,'/cases/'+c.id);await page.getByLabel('Motif communiqué',{exact:true}).fill('Décision locale avant nouveau message.');c.version++;c.messages.push({id:'new-message',author:c.participants[0],text:'Nouvel échange fictif.',at:new Date().toISOString()});const calls=writes(page,'/admin/cases/'+c.id);
  await page.getByRole('button',{name:'Enregistrer cette étape',exact:true}).click();await expect(page.locator('[data-admin-stale]')).toBeVisible();expect(calls).toHaveLength(0);await expect(page.getByLabel('Motif communiqué',{exact:true})).toHaveValue('Décision locale avant nouveau message.');
});

test('Admin: changement de compte masque le dossier et ne transmet pas la décision',async({page})=>{
  const d=doc();await open(page,'/moderation/documents/'+d.id);await review(page);const calls=writes(page,'/admin/documents/'+d.id);await persona(page,'admin');await page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true}).click();await expect(page.locator('#admin-session-warning')).toContainText('Session interne modifiée');await expect(page.locator('.admin-layout')).toBeHidden();expect(calls).toHaveLength(0);expect(d.status).toBe('pending');
});

test('Admin: double validation financière, version obsolète et dialogue nommé',async({page})=>{
  const f=target.store.db.financeActions[0];await open(page,'/payments','audit-a06');await expect(page.getByRole('button',{name:'Approuver cette version',exact:true})).toHaveCount(0);expect((await page.request.post(admin+'/api/v1/admin/payments/approve',{data:{id:f.id,version:f.version}})).status()).toBe(403);
  await open(page,'/payments','audit-a07');const trigger=page.getByRole('button',{name:'Approuver cette version',exact:true}).first();await trigger.click();const dialog=page.getByRole('dialog',{name:'Approuver cette version ?',exact:true});await expect(dialog).toBeVisible();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await trigger.click();target.store.db.financeActions.find(x=>x.id===f.id).version++;
  await dialog.getByRole('button',{name:'Confirmer',exact:true}).click();await expect(dialog.locator('.form-error')).toContainText('changé');expect(f.status).toBe('pending_approval');await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:'Approuver cette version',exact:true}).first().click();await page.getByRole('button',{name:'Confirmer',exact:true}).click();await expect(page.getByRole('button',{name:'Exécuter fictivement',exact:true})).toBeVisible();const approved=target.store.db.financeActions.find(x=>x.id===f.id);expect(approved.approval.version).toBe(approved.version);expect(approved.approval.actor).toBe('audit-a07');await page.getByRole('button',{name:'Exécuter fictivement',exact:true}).click();await page.getByRole('button',{name:'Confirmer',exact:true}).click();await expect(page.locator('#main')).toContainText('Exécuté fictivement');expect(target.store.db.financeActions.find(x=>x.id===f.id).status).toBe('simulated_executed');
});

test('Admin: habilitations avec seconde personne, refus hors périmètre et compte suspendu',async({page})=>{
  await open(page,'/administration','audit-a08');await expect(page.getByRole('button',{name:'Approuver avec mon habilitation',exact:true})).toHaveCount(0);const r=target.store.db.staffRequests.find(r=>r.id==='audit-permission-request');expect((await page.request.post(admin+'/api/v1/admin/staff/approve',{data:{id:r.id,version:r.version}})).status()).toBe(403);
  await open(page,'/administration','audit-a09');await page.route('**/api/v1/admin/staff/approve',async route=>{await new Promise(r=>setTimeout(r,150));await route.continue();});const approved=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/v1/admin/staff/approve'&&r.request().method()==='POST');await page.getByRole('button',{name:'Approuver avec mon habilitation',exact:true}).click();expect((await approved).status()).toBe(200);await expect(page.locator('#main .badge').filter({hasText:'Approuvé · simulation'})).toBeVisible();expect(target.store.db.users.find(u=>u.id==='audit-a04').permissions).toContain('finance.read');expect(target.store.db.staffRequests.find(x=>x.id===r.id).status).toBe('approved');
  await open(page,'/moderation/documents/'+doc().id,'audit-a04');await expect(page.locator('#main h1')).toHaveText('Accès limité à votre périmètre');
});

for(const afterWrite of [false,true])test(`Admin: erreur réseau ${afterWrite?'après écriture':'avant relecture'}, reprise sans décision dupliquée`,async({page})=>{
  const d=doc(),path='/admin/documents/'+d.id;await open(page,'/moderation/documents/'+d.id);await review(page);const calls=writes(page,path);
  await page.route('**/api/v1'+path,async route=>{if(afterWrite&&route.request().method()==='POST'){await route.fetch();return route.abort('failed');}if(!afterWrite&&route.request().method()==='GET')return route.abort('failed');await route.continue();});
  await page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true}).click();await expect(page.locator('.form-error')).toContainText('API injoignable');await expect(page.getByLabel('Motif de décision',{exact:true})).toHaveValue('Décision synthétique de recette Admin.');expect(calls).toHaveLength(afterWrite?1:0);await page.unroute('**/api/v1'+path);
  await page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true}).click();if(afterWrite){await expect(page.locator('[data-admin-stale]')).toBeVisible();}else{await expect(page.locator('#main')).toContainText('Cette version a déjà une décision.');}
  expect(calls).toHaveLength(1);expect(target.store.db.documentReviews.filter(r=>r.documentId===d.id)).toHaveLength(1);
});

test('Admin: retrait d’affectation après ouverture empêche toute décision',async({page})=>{
  const d=doc();await open(page,'/moderation/documents/'+d.id);await review(page);d.assignedTo=d.assignedTo.filter(id=>id!=='audit-a05');const calls=writes(page,'/admin/documents/'+d.id);await page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true}).click();await expect(page.locator('.form-error')).not.toBeEmpty();expect(calls).toHaveLength(0);expect(target.store.db.documents.find(x=>x.id===d.id).status).toBe('pending');
});

test('Admin: lecture sensible ne vaut pas permission de revue documentaire',async({page})=>{
  const actor=target.store.db.users.find(u=>u.id==='audit-a05');actor.permissions=actor.permissions.filter(p=>p!=='documents.review');const d=doc();await open(page,'/moderation/documents/'+d.id);await expect(page.locator('#main')).toContainText('Lecture autorisée');await expect(page.getByRole('button',{name:'Enregistrer la revue de cette version',exact:true})).toHaveCount(0);expect((await page.request.post(admin+'/api/v1/admin/documents/'+d.id,{data:{version:d.version,decision:'verified',reason:'Interdit sans habilitation'}})).status()).toBe(403);
});
