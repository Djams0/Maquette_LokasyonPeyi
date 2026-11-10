import {test} from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync,readFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createApi} from '../api/server.mjs';
import {auditFixture,auditPersonas} from '../api/audit-fixture.mjs';
import {createAuditEnvironment,loadAuditEnvironment} from '../scripts/audit-environment.mjs';
import {scenarios} from '../docs/audit/scenarios.mjs';

async function instance(run){const {server,store}=createApi({initialize:auditFixture});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}/api/v1`;const sessions=new Map();
  async function call(who,path,body,status=200,extra={}){const app=who?.startsWith('audit-a')||['employee','admin','finance','super','super2'].includes(who)?'admin':'client';if(who&&!sessions.has(who)){const r=await fetch(base+'/session',{method:'POST',headers:{'Content-Type':'application/json','X-Demo-App':app},body:JSON.stringify({persona:who})});assert.equal(r.status,200);sessions.set(who,r.headers.get('set-cookie').split(';')[0]);}const r=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json','X-Demo-App':app,...(who?{Cookie:sessions.get(who)}:{}),...extra},body:body===undefined?undefined:JSON.stringify(body)});const data=await r.json();assert.equal(r.status,status,JSON.stringify(data));return data;}
  try{await run({call,store,base});}finally{await new Promise(r=>server.close(r));}}

test('AUD-01 population, deterministic snapshot, references and reachable rental states',()=>{
  const a=auditFixture();assert.deepEqual(a,auditFixture());assert.equal(a.users.length,39);
  for(const id of ['renter','owner','newcomer','other','employee','admin','finance','super','super2',...auditPersonas.map(p=>p.id)])assert.ok(a.users.some(u=>u.id===id));
  const users=new Set(a.users.map(u=>u.id)),vehicles=new Set(a.vehicles.map(v=>v.id));
  for(const collection of ['users','vehicles','documents','rentals','inspections','cases','reviews','conversations','notifications','financeActions','staffRequests'])assert.equal(new Set(a[collection].map(x=>x.id)).size,a[collection].length,collection);
  for(const v of a.vehicles)assert.ok(users.has(v.ownerId));for(const d of a.documents){assert.ok(users.has(d.userId));if(d.vehicleId)assert.ok(vehicles.has(d.vehicleId));}
  for(const r of a.rentals){assert.ok(users.has(r.renterId)&&users.has(r.ownerId)&&vehicles.has(r.vehicleId));assert.notEqual(r.renterId,r.ownerId);if(['in_progress','return_reported','returned','completed'].includes(r.status)){assert.equal(r.deposit,'simulated_authorized');assert.ok(a.inspections.some(i=>i.rentalId===r.id&&i.phase==='departure'&&i.finalized));}}
  for(const d of a.documents.filter(d=>d.status==='verified'&&d.userId.startsWith('audit-')))assert.ok(a.documentReviews.some(r=>r.documentId===d.id&&r.documentVersion===d.version));
  assert.equal(auditFixture({epoch:'2028-01-01T00:00:00Z'}).simulation.epoch,'2028-01-01T00:00:00.000Z');
});
test('AUD-02 every active persona connects only to its own application; suspended denied',()=>instance(async({base,call})=>{
  assert.equal((await call(null,'/personas?app=client')).filter(p=>p.auditProfile).length,20);assert.equal((await call(null,'/personas?app=admin')).filter(p=>p.auditProfile).length,10);
  for(const p of auditPersonas){const app=p.internal?'admin':'client';for(const target of [app,app==='admin'?'client':'admin']){const r=await fetch(base+'/session',{method:'POST',headers:{'Content-Type':'application/json','X-Demo-App':target},body:JSON.stringify({persona:p.id})});assert.equal(r.status,p.status==='active'&&target===app?200:401,p.id+' '+target);}if(p.status==='active')assert.equal((await call(p.id,'/me')).id,p.id);}
}));
test('AUD-03 owner, documents, cases, conversations and notifications remain isolated',()=>instance(async({call,store})=>{
  const a=await call('audit-o02','/bootstrap'),b=await call('audit-o03','/bootstrap');assert.ok(a.owned.length);assert.ok(a.owned.every(v=>v.ownerId==='audit-o02'));assert.ok(b.documents.every(d=>d.userId==='audit-o03'));
  const rental=store.db.rentals.find(r=>r.status==='confirmed');await call('audit-r03','/rentals/'+rental.id,undefined,403);
  await call('audit-o03','/owner/vehicles/audit-v02-1/edit',{name:'Tentative fictive',price:32,description:'Modification non autorisée.'},403);
  const chat=store.db.conversations[0];await call('audit-r03','/conversations/'+chat.id,{text:'Tentative fictive'},403);
  const support=store.db.cases.find(c=>c.userId==='audit-r02'&&c.id!=='case-demo');await call('audit-r03','/cases/'+support.id,undefined,403);assert.equal('notes' in await call('audit-r02','/cases/'+support.id),false);
  await call('audit-a04','/admin/documents/doc-audit-r02-0',undefined,403);await call('audit-a01','/admin/documents/doc3',undefined,403);assert.ok((await call('audit-a03','/admin/documents/doc-audit-r02-0')).synthetic);
  assert.ok((await call('audit-a01','/admin/users')).every(u=>['audit-r01','audit-o01'].includes(u.id)));await call('audit-a01','/admin/users/audit-r02',undefined,404);
  const sensitive=store.db.cases.find(c=>c.sensitive);await call('audit-a02','/admin/cases/'+sensitive.id,undefined,403);await call('audit-a05','/admin/cases/'+sensitive.id);
  assert.ok((await call('audit-r03','/bootstrap')).notifications.every(n=>n.userId==='audit-r03'));
}));
test('AUD-04 rental conflict, payment separation and idempotency with new accounts',()=>instance(async({call})=>{
  const body={vehicleId:'audit-v03-1',start:'2027-07-01T12:00:00Z',end:'2027-07-03T12:00:00Z'};
  await call('audit-r01','/rentals',body,422);const r=await call('audit-r03','/rentals',body,200,{'Idempotency-Key':'audit-request'});
  assert.equal((await call('audit-r03','/rentals',body,200,{'Idempotency-Key':'audit-request'})).id,r.id);await call('audit-r03','/rentals/'+r.id+'/pay',{outcome:'success'},409);await call('audit-o03','/rentals/'+r.id+'/accept',{});await call('audit-r04','/rentals',body,409);
  assert.equal((await call('audit-r03','/rentals/'+r.id+'/pay',{outcome:'success'})).deposit,'not_started');await call('audit-o03','/rentals/'+r.id+'/handover',{controls:true},422);
}));
test('AUD-05 financial permissions, other person, invalidated version, revoked approver, idempotency',()=>instance(async({call,store})=>{
  await call('audit-a08','/admin/payments',undefined,403);await call('audit-a08','/admin/documents/doc1',undefined,403);await call('audit-a04','/admin/payments',undefined,403);
  const f=store.db.financeActions[0];await call('audit-a06','/admin/payments/approve',{id:f.id,version:1},403);
  // An explicit second account for the same person cannot satisfy the separation rule.
  store.transact(db=>db.users.find(u=>u.id==='audit-a07').personId=f.authorPerson);await call('audit-a07','/admin/payments/approve',{id:f.id,version:1},403);
  store.transact(db=>db.users.find(u=>u.id==='audit-a07').personId='audit-person-a7');await call('audit-a07','/admin/payments/approve',{id:f.id,version:1});
  await call('audit-a06','/admin/payments/edit',{id:f.id,version:1,amount:2,reason:'Correction synthétique de proposition'});await call('audit-a07','/admin/payments/execute',{id:f.id,version:2},409);await call('audit-a07','/admin/payments/approve',{id:f.id,version:2});
  store.transact(db=>db.users.find(u=>u.id==='audit-a07').permissions=db.users.find(u=>u.id==='audit-a07').permissions.filter(p=>p!=='finance.approve'));
  await call('audit-a05','/admin/payments/execute',{id:f.id,version:2},403);store.transact(db=>db.users.find(u=>u.id==='audit-a07').permissions.push('finance.approve'));
  const body={id:f.id,version:2};const h={'Idempotency-Key':'audit-execute'};assert.equal((await call('audit-a07','/admin/payments/execute',body,200,h)).status,'simulated_executed');await call('audit-a07','/admin/payments/execute',body,200,h);assert.equal(store.db.financeActions.length,1);
}));
test('AUD-06 permission approval, self-beneficiary refusal, live suspension',()=>instance(async({call})=>{
  await call('audit-a08','/admin/documents/doc1',undefined,403);await call('audit-a08','/admin/staff/propose',{targetId:'audit-a08',permission:'finance.read',reason:'Auto-attribution fictive'},403);
  const r=await call('audit-a08','/admin/staff/propose',{targetId:'audit-a04',permission:'finance.read',reason:'Lecture synthétique à double validation'});await call('audit-a08','/admin/staff/approve',{id:r.id,version:1},403);await call('audit-a09','/admin/staff/approve',{id:r.id,version:1});await call('audit-a09','/admin/staff/approve',{id:r.id,version:1},409);await call('audit-a04','/admin/payments');
  await call('audit-a04','/admin/dashboard');await call('audit-a08','/admin/staff/status',{id:'audit-a04',status:'suspended',reason:'Suspension synthétique de campagne'});await call('audit-a04','/admin/dashboard',undefined,401);
  await call('audit-r03','/bootstrap');await call('audit-a05','/admin/users/audit-r03',{status:'suspended',reason:'Suspension synthétique'});await call('audit-r03','/bootstrap',undefined,401);
}));
test('AUD-07 disposable target validation and clean campaign restoration without deleting existing data',()=>{
  const target=createAuditEnvironment();const original=loadAuditEnvironment(target.file,target.nonce);assert.equal(original.users.length,39);assert.throws(()=>loadAuditEnvironment(target.file,'wrong'));assert.throws(()=>loadAuditEnvironment(join(tmpdir(),'mock.json'),target.nonce));
  writeFileSync(target.file,JSON.stringify({...original,financeActions:[]}));const next=createAuditEnvironment();assert.deepEqual(loadAuditEnvironment(next.file,next.nonce),original);assert.equal(JSON.parse(readFileSync(target.file)).financeActions.length,0);
  const unrelated=join(mkdtempSync(join(tmpdir(),'unrelated-')),'mock.json');writeFileSync(unrelated,'retained');assert.throws(()=>loadAuditEnvironment(unrelated,target.nonce));assert.equal(readFileSync(unrelated,'utf8'),'retained');
});
test('AUD-08 suspended session cannot replay a cached idempotent mutation',()=>instance(async({call})=>{
  const body={vehicleId:'audit-v03-1',start:'2027-08-01T12:00:00Z',end:'2027-08-02T12:00:00Z'},headers={'Idempotency-Key':'suspended-replay'};
  await call('audit-r03','/rentals',body,200,headers);await call('audit-a05','/admin/users/audit-r03',{status:'suspended',reason:'Suspension synthétique avant rejeu'});await call('audit-r03','/rentals',body,401,headers);
}));
test('AUD-09 catalog is complete and automated references exist',()=>{
  assert.equal(scenarios.length,108);assert.equal(new Set(scenarios.map(s=>s.id)).size,108);
  const sources=readFileSync(new URL('./audit.test.mjs',import.meta.url),'utf8')+readFileSync(new URL('./audit-browser/profiles.spec.js',import.meta.url),'utf8');
  for(const s of scenarios){for(const key of ['id','name','profile','preconditions','fixture','actions','expected','control','limits'])assert.ok(s[key],s.id+' '+key);if(s.automated)assert.ok(sources.includes(s.automated),s.id);}
});
