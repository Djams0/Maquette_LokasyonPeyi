import test from 'node:test';
import assert from 'node:assert/strict';
import {messageStorageKey, messageAttempt, restoreMessageState, newMessageState, serverMessages} from '../client/pages/message-state.js';
import {navigationState} from '../client/pages/navigation.js';

test('message recovery: account and thread isolate drafts; invalid storage cannot replay', () => {
  const s = newMessageState('renter', 'a'); s.draft = 'Texte fictif';
  assert.equal(restoreMessageState(JSON.stringify(s), 'owner', 'a').draft, '');
  assert.equal(restoreMessageState(JSON.stringify(s), 'renter', 'b').draft, '');
  assert.equal(restoreMessageState('{', 'renter', 'a').verificationOnly, true);
  assert.equal(restoreMessageState(null, 'renter', 'a').verificationOnly, undefined);
  assert.notEqual(messageStorageKey('a:b', 'c'), messageStorageKey('a', 'b:c'));
});
test('message recovery: reload preserves the frozen body and key, never assumes a pending write failed', () => {
  const s = newMessageState('renter', 'a'); s.draft = 'Une autre saisie';
  s.attempt = messageAttempt('  Message original\n ', 'stable-key-123');
  const restored = restoreMessageState(JSON.stringify(s), 'renter', 'a');
  assert.equal(restored.attempt.status, 'uncertain');
  assert.deepEqual(restored.attempt.body, {text: '  Message original\n '});
  assert.equal(restored.attempt.key, 'stable-key-123');
  assert.equal(restored.draft, 'Une autre saisie');
  s.attempt.signature = 'corrupt';
  const corrupt = restoreMessageState(JSON.stringify(s), 'renter', 'a').attempt;
  assert.equal(corrupt.retryAllowed, false); assert.equal(corrupt.key, null); assert.equal(corrupt.status, 'uncertain');
});
test('message recovery: server IDs deduplicate without guessing from text', () => {
  const m = {id: 'm1', author: 'renter', text: 'Identique'};
  assert.deepEqual(serverMessages([m, {...m}, {...m, id: 'm2'}, {text: 'Sans ID'}]).map(m => m.id), ['m1', 'm2']);
});
test('message return: preserve only the local inbox query', () => {
  assert.deepEqual(navigationState('/messages', '?conversation=a&q=Peugeot&next=https://evil.test').back, ['/messages?q=Peugeot', 'Retour aux messages']);
});
