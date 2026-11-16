import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSearch,apiSearch,searchURL,vehicleURL,resetFilters} from '../client/pages/search-state.js';
const now=new Date('2026-11-16T12:00:00Z');
const parse=q=>parseSearch(q,now);
test('search: canonical order, legacy UI flags, local-only return and API whitelist',()=>{
  const state=parse('view=map&sort=price&max=080&q= Gosier &from=2027-06-10&until=2027-06-14&filters=open&return=https://evil.invalid&state=empty');
  assert.deepEqual(state.errors,[]);assert.equal(state.ui.openFilters,true);assert.equal(state.warnings.length,1);
  assert.equal(searchURL(state.params),'/search?q=Gosier&from=2027-06-10&until=2027-06-14&max=80&sort=price&view=map&state=empty');
  assert.equal(vehicleURL('a/b',state.params),'/vehicle/a%2Fb'+searchURL(state.params).slice(7));
  assert.deepEqual(Object.fromEntries(apiSearch(state)),{q:'Gosier',max:'80',sort:'price',start:'2027-06-10T09:00:00-04:00',end:'2027-06-14T09:00:00-04:00'});
});
test('search: malformed and ambiguous URLs cannot reach the catalogue API',()=>{
  for(const q of ['q=A&q=B','from=2027-02-31&until=2027-03-02','from=2027-06-10','until=2027-06-10','from=2027-06-10&until=2027-06-10','from=2026-01-01&until=2026-01-04','from=2027-06-10T25:00&until=2027-06-14','max=Infinity','max=0','seats=2.5','category=Boat','gearbox=Other','fuel=Other','equipment=Other','sort=random','view=satellite','filters=closed','state=other']) {
    const state=parse(q);assert.ok(state.errors.length,q);assert.throws(()=>apiSearch(state),undefined,q);
  }
});
test('search: Guadeloupe hours and explicitly empty periods survive a round trip',()=>{
  const state=parse('from=2027-06-10T14:35&until=2027-06-14T10:15');
  assert.deepEqual(state.errors,[]);assert.equal(apiSearch(state).get('start'),'2027-06-10T14:35:00-04:00');
  assert.equal(parse(searchURL(state.params).split('?')[1]).period.startLocal,'2027-06-10T14:35');
  assert.equal(searchURL(parse('from=&until=').params),'/search?from=&until=');
  assert.equal(parse('from=&until=').period.provided,true);
});
test('search: filter reset preserves destination, period, ordering and map',()=>{
  const state=parse('q=Gosier&from=2027-06-10&until=2027-06-14&category=Citadine&max=80&gearbox=Manuelle&fuel=Essence&seats=4&equipment=Bluetooth&sort=rating&view=map&state=empty');
  assert.equal(searchURL(resetFilters(state.params)),'/search?q=Gosier&from=2027-06-10&until=2027-06-14&sort=rating&view=map');
});
