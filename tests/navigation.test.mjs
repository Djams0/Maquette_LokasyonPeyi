import test from 'node:test';
import assert from 'node:assert/strict';
import {destinations,navigationState,safeNext} from '../client/pages/navigation.js';

test('navigation: four stable unique primary destinations', () => {
  assert.deepEqual(destinations.map(([href,,label]) => [href,label]), [['/','Explorer'],['/rentals','Locations'],['/messages','Messages'],['/profile','Profil']]);
  assert.equal(new Set(destinations.map(([href]) => href)).size,4);
});
test('navigation: current section follows nested routes without granting access', () => {
  for (const path of ['/','/search','/vehicle/v1']) assert.equal(navigationState(path).active,'/');
  for (const path of ['/rentals','/rental/a','/request/v1','/payment/a','/inspection/a/return','/review/a','/receipt/a']) assert.equal(navigationState(path).active,'/rentals');
  for (const path of ['/profile','/profile/documents','/notifications','/owner','/owner/vehicles/a','/cases/a','/assistance','/demo/audit']) assert.equal(navigationState(path).active,'/profile');
  assert.equal(navigationState('/messages').active,'/messages');
  for (const path of ['/messages-other','/owner-other','/unknown']) assert.equal(navigationState(path).active,null);
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
