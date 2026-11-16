import test from 'node:test';import assert from 'node:assert/strict';
import {ownerSections,sectionForStep,validOwnerStep,cleanOwnerDraft,draftSignature,ownerBufferKey,restoreOwnerBuffer,overlayOwnerBuffer,ownerDraftDifferences,ownerDraftErrors,ownerCalendarItems} from '../client/pages/owner-state.js';
test('owner: nine legacy groups map once to four ordered sections',()=>{
  assert.deepEqual(ownerSections.map(s=>s.groups),[[1,3],[4,5],[7,8],[2,6,9]]);
  assert.deepEqual(ownerSections.flatMap(s=>s.groups).sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9]);
  for(const [n,section] of [[1,0],[3,0],[4,1],[5,1],[7,2],[8,2],[2,3],[6,3],[9,3]])assert.equal(sectionForStep(n),section);
  for(const value of ['',0,10,1.2,'01','../'])assert.equal(validOwnerStep(value),null);
});
test('owner: buffer is account-bound, field-limited, and reapplication preserves untouched server fields',()=>{
  const raw=JSON.stringify({version:1,accountId:'owner',base:{name:'Avant',price:32,version:100},groups:{1:{name:'Local',authorization:'secret'},5:{photos:2,selected:[1,4,8,1]}},step:5,documents:[{contents:'private'}]});
  assert.equal(restoreOwnerBuffer(raw,'other'),null);assert.equal(restoreOwnerBuffer('{','owner'),null);
  const buffer=restoreOwnerBuffer(raw,'owner');assert.deepEqual(buffer.groups[1],{name:'Local'});assert.deepEqual(buffer.groups[5].selected,[1,4]);assert.equal(buffer.base.version,undefined);
  assert.deepEqual(overlayOwnerBuffer({name:'Serveur',price:99},buffer),{name:'Local',price:99,photos:2});
  assert.notEqual(ownerBufferKey('owner'),ownerBufferKey('other'));
  assert.deepEqual(cleanOwnerDraft({documents:true,file:'private',token:'secret',version:3}),{documents:true});
});
test('owner: content comparison ignores global versions and detects a changed field or step',()=>{
  assert.equal(draftSignature({name:'Demo',version:1}),draftSignature({version:900,name:'Demo'}));
  assert.deepEqual(ownerDraftDifferences({name:'Demo',step:1},{name:'Autre',step:5}),['name','step']);
});
test('owner: full submission retains document, photo, safety, price and date guards',()=>{
  const d={name:'Demo',plate:'DEMO-001',year:2022,city:'Le Gosier',category:'Citadine',gearbox:'Manuelle',fuel:'Essence',seats:5,price:32,description:'Description fictive de recette.',photos:5,documents:true,safety:true,start:'2027-06-10T09:00',end:'2027-06-12T09:00'};
  assert.deepEqual(ownerDraftErrors(d),[]);
  for(const [key,value,group] of [['name','',1],['plate','',1],['year',1949,1],['category','Moto',3],['seats',1,3],['price','',7],['description','court',7],['photos',4,5],['documents',false,2],['safety',false,6],['start','2027-02-31T09:00',8],['end',d.start,8]])assert.ok(ownerDraftErrors({...d,[key]:value}).some(e=>e.group===group),key);
});
test('owner: calendar distinguishes requests, held periods and manual blocks without claiming availability',()=>{
  const v={id:'v1',availability:{blocked:[{id:'b1',start:'2027-07-01T13:00Z',end:'2027-07-02T13:00Z'}]}};
  const rs=['requested','awaiting_payment','confirmed','in_progress','return_reported','returned','completed','declined'].map((status,n)=>({id:'r'+n,vehicleId:'v1',start:'2027-06-10T13:00Z',end:'2027-06-11T13:00Z',status}));
  const result=ownerCalendarItems(v,[...rs,{...rs[0],vehicleId:'other'}]);assert.equal(result.length,6);assert.equal(result.filter(i=>i.kind==='held').length,4);assert.match(result[0].label,/non réservé/);
});
test('owner: an interrupted submission keeps the exact body/key; unreliable records permit checking only',()=>{
  const body=cleanOwnerDraft({name:'Demo',price:32,start:'2027-06-01T09:00:00-04:00'}),record={version:1,accountId:'owner',groups:{},base:body,attempt:{body,key:'stable-creation-key',signature:JSON.stringify(body),status:'sending',retryAllowed:true}};
  const a=restoreOwnerBuffer(JSON.stringify(record),'owner').attempt;assert.equal(a.status,'uncertain');assert.deepEqual(a.body,body);assert.equal(a.key,record.attempt.key);
  record.attempt.signature='different';assert.equal(restoreOwnerBuffer(JSON.stringify(record),'owner').attempt.retryAllowed,false);
});
