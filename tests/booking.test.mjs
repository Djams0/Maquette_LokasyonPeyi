import test from 'node:test';import assert from 'node:assert/strict';
import {bookingDraft,localRentalDate,requestVehicleURL,rentalNext,rentalProgress,rentalTitles} from '../client/pages/booking-state.js';
const now=new Date('2026-11-16T12:00:00Z'),draft={vehicleId:'v1',start:'2027-06-10T13:00:00.000Z',end:'2027-06-14T13:00:00.000Z'},base={id:'r1',ownerId:'owner',renterId:'renter',inspections:[],payment:'not_started',deposit:'not_started'};
test('booking: dates and vehicle are validated without implicit defaults or extra API keys',()=>{
 assert.deepEqual(bookingDraft({...draft,sort:'price',return:'https://bad.invalid'},'v1',now),{error:'',payload:draft});assert.equal(localRentalDate(draft.start),'2027-06-10T09:00');
 for(const value of [null,[],{...draft,vehicleId:'v2'},{...draft,start:'2027-02-31T13:00:00Z'},{...draft,end:draft.start},{...draft,start:'bad'},{...draft,start:'2026-01-01T13:00:00Z',end:'2026-01-05T13:00:00Z'}])assert.equal(bookingDraft(value,'v1',now).payload,null);
});
test('booking: edit return restores local search criteria with the actual draft period',()=>{
 const context=JSON.stringify({vehicleId:'v1',search:'/search?q=Gosier&from=2027-06-11&until=2027-06-15&sort=rating&view=map&max=80'});
 const url=new URL(requestVehicleURL('v1',draft,context),'https://test.invalid');assert.equal(url.pathname,'/vehicle/v1');assert.equal(url.searchParams.get('sort'),'rating');assert.equal(url.searchParams.get('from'),'2027-06-10');assert.equal(url.searchParams.get('until'),'2027-06-14');
 for(const search of ['https://evil.invalid','//evil.invalid','/search/../evil','/search?view=unknown'])assert.equal(requestVehicleURL('v1',draft,JSON.stringify({vehicleId:'v1',search})),'/vehicle/v1?from=2027-06-10&until=2027-06-14');
});
test('booking: every server status names its actor, outsiders and unknown states gain no action',()=>{
 for(const status of Object.keys(rentalTitles))for(const actor of ['owner','renter']){const state=rentalNext({...base,status},actor);assert.ok(state.actor);assert.ok(state.description);assert.equal(state.title,rentalTitles[status]);}
 for(const status of [...Object.keys(rentalTitles),'future'])assert.equal(rentalNext({...base,status},'other').primary,null);
 assert.equal(rentalNext({...base,status:'future'},'owner').primary,null);
 for(const status of ['confirmed','in_progress'])assert.equal(rentalNext({...base,status,deposit:'simulated_authorized',inspections:undefined},'owner').primary.path,'/rental/r1');
 assert.equal(rentalNext({...base,status:'awaiting_payment'},'owner').primary,null);assert.equal(rentalNext({...base,status:'awaiting_payment'},'renter').primary.path,'/payment/r1');
});
test('booking: handover and return declarations follow their existing prerequisites',()=>{
 assert.equal(rentalNext({...base,status:'confirmed'},'renter').primary.kind,'deposit');
 assert.notEqual(rentalNext({...base,status:'confirmed'},'owner').primary?.key,'handover');
 const ready={...base,status:'confirmed',deposit:'simulated_authorized',inspections:[{phase:'departure',finalized:true}]};assert.equal(rentalNext(ready,'owner').primary.key,'handover');assert.equal(rentalNext(ready,'renter').primary,null);
 assert.equal(rentalNext({...base,status:'in_progress'},'renter').primary.path,'/inspection/r1/return');assert.equal(rentalNext({...base,status:'in_progress',inspections:[{phase:'return',finalized:true}]},'renter').primary.key,'report_return');
 assert.equal(rentalNext({...base,status:'return_reported'},'renter').primary,null);assert.equal(rentalNext({...base,status:'return_reported'},'owner').primary.key,'verify-return');assert.equal(rentalNext({...base,status:'returned'},'owner').primary.key,'complete');
});
test('booking: refused and withdrawn timelines never claim acceptance or payment',()=>{
 for(const status of ['declined','withdrawn']){const steps=rentalProgress(status);assert.equal(steps.length,2);assert.ok(!steps.some(s=>s.key==='confirmed'||s.key==='awaiting_payment'));assert.equal(steps[1].current,true);}
 const pending=rentalProgress('requested');assert.equal(pending.find(s=>s.key==='confirmed').done,false);
});
