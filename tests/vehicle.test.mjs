import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {vehiclePresentation,vehicleEstimate} from '../client/pages/vehicle-presentation.js';
import {modelPhotoSeries,vehicleMedia} from '../client/pages/vehicle-media.js';
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

test('V3.2: model photography respects exact fixture identity and does not replace condition media', () => {
 const clio = {id:'v3', name:'Renault Clio', color:'blue'};
 const duster = {id:'v2', name:'Dacia Duster', color:'sand'};
 for (const [vehicle, ids] of [[clio, [4, 6, 5]], [duster, [11, 12]]]) {
  const p = vehiclePresentation(vehicle);
  assert.deepEqual(p.gallery.map(media => media.creditId), ids);
  assert.ok(p.gallery.every(media => media.modelPhoto && media.photo));
  assert.equal(p.condition, null);
  assert.equal(p.illustration, null);
  assert.equal(vehicleMedia(vehicle).photo, false);
 }
 for (const id of ['v1', 'v4', 'v5', 'v6', 'audit-v03-1', 'unknown', '__proto__']) {
  assert.deepEqual(modelPhotoSeries({...clio, id}), []);
 }
 assert.deepEqual(modelPhotoSeries({...clio, name:'Dacia Duster'}), []);
 assert.deepEqual(modelPhotoSeries({id:'v1', name:'Peugeot 208'}), []);
 assert.match(vehicleMedia({id:'v1'}).src, /citadine-verte-avant-420/);
});

test('V3.2: every approved runtime variant and its attribution match the handoff', () => {
 const root = new URL('../', import.meta.url);
 const kit = new URL('LOKASYON_PEYI_DESIGN_HANDOFF/', root);
 const source = JSON.parse(readFileSync(new URL('04_VISUAL_REFERENCES/asset-manifest.json', kit)));
 const runtime = JSON.parse(readFileSync(new URL('assets/v32/manifest.json', root)));
 const credits = readFileSync(new URL('assets/v32/credits.html', root), 'utf8');
 const approved = source.photos.flatMap(photo => photo.variants.filter(variant => variant.target));
 assert.equal(approved.length, 23);
 assert.equal(runtime.photos.length, 12);
 assert.deepEqual(runtime.photos.flatMap(photo => photo.variants), approved);
 for (const photo of runtime.photos) {
  const original = source.photos.find(item => item.id === photo.id);
  for (const field of ['title','source','author','license','license_url','transform','alt','fixtureId']) {
   assert.equal(photo[field], original[field]);
  }
  assert.ok(credits.includes(`id="photo-${photo.id}"`));
  assert.ok(credits.includes(photo.author) && credits.includes(photo.license_url));
  for (const variant of photo.variants) {
   const bytes = readFileSync(new URL(variant.target, root));
   assert.equal(bytes.length, variant.bytes);
   assert.equal(createHash('sha256').update(bytes).digest('hex'), variant.sha256);
   assert.deepEqual(bytes, readFileSync(new URL(variant.kit, kit)));
  }
 }
 assert.ok(!runtime.photos.some(photo => [3,16,25,31].includes(photo.id)));
});
