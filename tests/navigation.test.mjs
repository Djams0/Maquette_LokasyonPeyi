import test from 'node:test';
import assert from 'node:assert/strict';
import {currentDestination,navigationRole,navigationState,primaryDestinations,safeNext} from '../client/pages/navigation.js';

test('navigation: each session has its own stable primary destinations', () => {
  const links=role=>primaryDestinations(role).map(([href,,label])=>[href,label]);
  assert.deepEqual(links('visitor'),[['/search','Explorer'],['/faq','Aide'],['/login?next=%2Fprofile','Compte']]);
  assert.deepEqual(links('renter'),[['/search','Explorer'],['/rentals','Locations'],['/messages','Messages'],['/profile/documents','Documents']]);
  assert.deepEqual(links('owner'),[['/search','Explorer'],['/owner/vehicles','Mon parc'],['/owner/requests','Demandes'],['/profile','Profil']]);
  assert.equal(navigationRole(null),'visitor');
  assert.equal(navigationRole({internal:true,owner:true}),'visitor');
  assert.equal(navigationRole({status:'suspended',owner:true}),'visitor');
  assert.equal(navigationRole({owner:false}),'renter');
  assert.equal(navigationRole({owner:true}),'owner');
});
test('navigation: current section follows nested routes without granting access', () => {
  for(const role of ['visitor','renter','owner']) {
    for(const path of ['/','/search','/vehicle/v1'])assert.equal(currentDestination(path,role),'/search');
    for(const path of ['/messages-other','/owner-other','/unknown'])assert.equal(currentDestination(path,role),null);
  }
  for(const path of ['/rentals','/rental/a','/request/v1','/payment/a','/inspection/a/return','/review/a','/receipt/a']) {
    assert.equal(currentDestination(path,'renter'),'/rentals');
    assert.equal(currentDestination(path,'visitor'),null);
  }
  assert.equal(currentDestination('/profile/documents','renter'),'/profile/documents');
  for(const path of ['/profile','/profile/reviews','/notifications']) {
    assert.equal(currentDestination(path,'renter'),null);
  }
  for(const path of ['/profile','/profile/documents','/profile/reviews']) {
    assert.equal(currentDestination(path,'owner'),'/profile');
  }
  assert.equal(currentDestination('/notifications','owner'),null);
  assert.equal(currentDestination('/messages','renter'),'/messages');
  assert.equal(currentDestination('/owner/vehicles/a','owner'),'/owner/vehicles');
  assert.equal(currentDestination('/owner/requests','owner'),'/owner/requests');
  assert.equal(currentDestination('/owner/requests','renter'),null);
  assert.equal(currentDestination('/faq','visitor'),'/faq');
  assert.equal(currentDestination('/login','visitor'),'/login?next=%2Fprofile');
});
test('navigation: bottom bar only on root surfaces and dedicated returns stay named', () => {
  for (const path of ['/','/search','/rentals','/messages','/profile/','/owner']) assert.equal(navigationState(path).root,true,path);
  for (const path of ['/vehicle/v1','/profile/documents','/notifications','/owner/vehicles','/owner/vehicles/new','/request/v1','/payment/r','/demo/audit']) assert.equal(navigationState(path).root,false,path);
  assert.equal(navigationState('/messages','?conversation=chat').root,false);
  assert.deepEqual(navigationState('/messages','?conversation=chat').back,['/messages','Retour aux messages']);
  assert.deepEqual(navigationState('/notifications').back,['/profile','Retour au profil']);
  assert.deepEqual(navigationState('/owner/vehicles').back,['/owner','Espace propriétaire']);
  assert.deepEqual(navigationState('/demo/audit').back,['/demo','Retour à Démo & comptes']);
});
test('navigation: next preserves internal context and refuses external or malformed targets', () => {
  const path='/messages?conversation=chat-1#composer'; assert.equal(safeNext(path),path);
  assert.equal(safeNext('/search?q=Le%20Gosier&view=map'),'/search?q=Le%20Gosier&view=map');
  assert.equal(safeNext('/profile/../notifications'),'/notifications');
  for (const value of [null,undefined,'','https://example.invalid','//example.invalid','/profile/..//example.invalid','/.//example.invalid',String.raw`/\example.invalid`,'/\t/other','/\nother','javascript:alert(1)']) assert.equal(safeNext(value),'/',String(value));
});
