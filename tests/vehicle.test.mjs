import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {vehiclePresentation,vehicleEstimate} from '../client/pages/vehicle-presentation.js';
test('vehicle: gallery, condition and optional rendering are associated only with fixture v1',()=>{
 const v=vehiclePresentation({id:'v1',name:'Peugeot 208',color:'sage',photos:99});assert.equal(v.gallery.length,5);assert.ok(v.gallery.every(m=>m.photo));assert.ok(!v.gallery.some(m=>/rayure|illustration-836/.test(m.src)));assert.equal(v.condition.fixtureId,'v1');assert.match(v.condition.version,/fictive/);assert.match(v.illustration.src,/illustration-836/);
 for(const id of ['v2','audit-v01-1','new']){const p=vehiclePresentation({id,name:'Démo',color:'sage',photos:5});assert.equal(p.gallery.length,1);assert.equal(p.gallery[0].photo,false);assert.equal(p.condition,null);assert.equal(p.illustration,null);}
});
test('vehicle: estimate follows existing day rounding without inventing a quote',()=>{
 assert.deepEqual(vehicleEstimate(32,'2027-06-10T09:00','2027-06-14T09:00'),{days:4,daily:32,total:128});assert.equal(vehicleEstimate(32,'2027-06-10T09:00','2027-06-11T09:01').days,2);
 for(const price of [null,undefined,'32',NaN,Infinity,-1,0])assert.equal(vehicleEstimate(price,'2027-06-10','2027-06-14'),null);
 for(const [from,until] of [['',''],['2027-02-31','2027-03-05'],['2027-06-14','2027-06-10'],['2027-06-10','2027-06-10']])assert.equal(vehicleEstimate(32,from,until),null);
});
test('vehicle: all six additional media exactly match their handoff provenance',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../assets/vehicles/detail-manifest.json',import.meta.url)));assert.equal(manifest.assets.length,6);
 for(const a of manifest.assets){const bytes=readFileSync(new URL('../'+a.chemin,import.meta.url));assert.equal(a.fixtureId,'v1');assert.equal(bytes.length,a.octets);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);assert.deepEqual(bytes,readFileSync(new URL('../LOKASYON_PEYI_DESIGN_HANDOFF/'+a.source,import.meta.url)));}
});
