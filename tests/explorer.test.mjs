import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {searchError,recentSearch,loadRecentSearch,saveRecentSearch} from '../client/pages/explorer-state.js';
import {vehicleMedia} from '../client/pages/vehicle-media.js';

test('Explorer: optional dates are paired, real calendar dates and increasing', () => {
  for (const q of ['q=Gosier','from=2027-06-10&until=2027-06-14']) assert.equal(searchError(new URLSearchParams(q)),'');
  for (const q of ['from=2027-06-10','until=2027-06-14','from=2027-02-31&until=2027-03-10','from=2027-06-10&until=2027-06-10','from=2027-06-10&until=2027-06-09']) assert.notEqual(searchError(new URLSearchParams(q)),'',q);
});
test('Explorer: legacy recent-search keeps valid dates, filters and map/sort but rejects unsafe targets', () => {
  const path='/search?q=Gosier&from=2027-06-10&until=2027-06-14&category=Citadine&max=80&gearbox=Manuelle&fuel=Essence&seats=4&sort=price&view=map';
  assert.equal(recentSearch(path),path);
  for (const value of [null,'','javascript:alert(1)','https://example.invalid','//example.invalid','/search/../login','/search-other',String.raw`/search\example.invalid`,'/search?from=2027-06-10','/search?max=NaN','/search?seats=-2','/search?view=unknown','/search?category=unknown']) assert.equal(recentSearch(value),null,String(value));
});
test('Explorer: refused local storage cannot interrupt search or fabricate a recent link', () => {
  const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw Error('Storage unavailable');}});
  try { assert.equal(loadRecentSearch(),null); assert.doesNotThrow(()=>saveRecentSearch(new URLSearchParams('q=Gosier'))); }
  finally { if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);else delete globalThis.localStorage; }
});
test('Explorer: photographs belong only to fixture v1 and match the shipped manifest bytes', () => {
  const photo=vehicleMedia({id:'v1',name:'Peugeot 208',color:'sage'});
  assert.equal(photo.photo,true);assert.match(photo.srcset,/420w.*836w/);
  for(const id of ['v3','audit-v01-1']) { const media=vehicleMedia({id,name:'Véhicule fictif',color:'sage'});assert.equal(media.photo,false);assert.equal(media.src,'/assets/car-sage.svg'); }
  assert.equal(vehicleMedia({id:'unknown',name:'Démo',color:'../other'}).src,'/assets/car-sage.svg');
  const manifest=JSON.parse(readFileSync(new URL('../assets/vehicles/manifest.json',import.meta.url)));
  assert.equal(manifest.assets.length,2);
  for(const asset of manifest.assets){const bytes=readFileSync(new URL('../'+asset.chemin,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);assert.equal(bytes.length,asset.octets);assert.equal(asset.fixtureId,'v1');}
});
