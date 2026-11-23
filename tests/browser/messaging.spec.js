import {test, expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {createApi} from '../../api/server.mjs';
import {seed} from '../../api/seed.mjs';
let target, client, children = [];
const thread = '/messages?conversation=qa-chat-a';
function fixture() {
  const db = seed();
  db.conversations = ['a', 'b'].map((letter, index) => ({id: 'qa-chat-' + letter, vehicleId: 'v' + (index + 1), title: index ? 'Renault Clio' : 'Peugeot 208', participants: ['renter', 'owner'], messages: []}));
  return db;
}
test.beforeEach(async () => {
  const allowedOrigins = new Set(); target = createApi({initialize: fixture, allowedOrigins});
  await new Promise(r => target.server.listen(0, '127.0.0.1', r));
  const child = spawn(process.execPath, ['scripts/web.mjs', 'client'], {env: {...process.env, PORT: '0', API_URL: `http://127.0.0.1:${target.server.address().port}`, DEMO_LOOPBACK: '1'}, stdio: ['ignore', 'pipe', 'pipe']});
  children.push(child);
  client = await new Promise((resolve, reject) => { child.on('error', reject); child.stdout.on('data', data => { const m = String(data).match(/sur (\d+)/); if (m) resolve(`http://127.0.0.1:${m[1]}`); }); });
  allowedOrigins.add(client);
});
test.afterEach(async () => { children.forEach(c => c.kill()); children = []; await new Promise(r => target.server.close(r)); });
async function persona(page, id = 'renter') { expect((await page.request.post(client + '/api/v1/session', {data: {persona: id}})).ok()).toBe(true); }
async function open(page, id = 'renter', url = thread) { await persona(page, id); await page.goto(client + url); if (url === thread && id !== 'other') await expect(page.getByLabel('Votre message', {exact: true})).toBeEnabled(); }
const editor = page => page.getByLabel('Votre message', {exact: true});
const send = page => page.getByRole('button', {name: 'Envoyer', exact: true});
const posts = page => { const requests = []; page.on('request', r => { if (r.method() === 'POST' && new URL(r.url()).pathname === '/api/v1/conversations/qa-chat-a') requests.push({key: r.headers()['idempotency-key'], body: r.postDataJSON()}); }); return requests; };

for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440]) test(`Messagerie: liste et fil séparés, commandes à ${width}px`, async ({page}) => {
  await page.setViewportSize({width, height: 844}); await open(page, 'renter', '/messages');
  await expect(page.locator('.message-row')).toHaveCount(2); await expect(page.locator('.message-thread')).toBeHidden();
  await page.locator('.message-row').first().click(); await expect(editor(page)).toBeEnabled();
  if (width < 1024) await expect(page.locator('.message-inbox')).toBeHidden(); else await expect(page.locator('.message-inbox')).toBeVisible();
  await editor(page).fill('Clavier et écran étroit'); await editor(page).press('Tab'); await expect(send(page)).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.locator('.message-bubble')).toHaveCount(1); await expect(page.locator('#send-state')).toContainText('Message envoyé');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  expect((await send(page).boundingBox()).height).toBeGreaterThanOrEqual(48);
  expect(await page.locator('.message-context .message-thumbnail img').evaluate(e => e.getBoundingClientRect().width)).toBe(64);
});
test('Messagerie: deux sessions, tiers exclu, double clic et identité serveur', async ({browser}) => {
  const a = await browser.newContext(), b = await browser.newContext(), outsider = await browser.newContext();
  try {
    const pa = await a.newPage(), pb = await b.newPage(), pc = await outsider.newPage();
    await open(pa); await open(pb, 'owner'); await open(pc, 'other');
    await expect(pc.locator('#message-sync')).toContainText('introuvable'); await expect(editor(pc)).toBeDisabled();
    const sent = posts(pa); await editor(pa).fill('Message partagé fictif');
    await send(pa).evaluate(button => { button.click(); button.click(); });
    await expect(pa.locator('.message-bubble')).toHaveCount(1); expect(sent).toHaveLength(1); expect(sent[0].key).toBeTruthy();
    await pb.getByRole('button', {name: 'Actualiser', exact: true}).click(); await expect(pb.locator('.message-bubble')).toHaveText(/Message partagé fictif/);
    await editor(pb).fill('Réponse du propriétaire'); await send(pb).click();
    await expect(pa.locator('.message-bubble')).toHaveCount(2, {timeout: 10000});
    const db = target.store.db; expect(db.conversations[0].messages).toHaveLength(2); expect(db.conversations[0].messages.map(m => m.author)).toEqual(['renter', 'owner']);
    const deny = await pc.request.post(client + '/api/v1/conversations/qa-chat-a', {data: {text: 'Interdit'}}); expect(deny.status()).toBe(403);
  } finally { await a.close(); await b.close(); await outsider.close(); }
});
for (const afterWrite of [false, true]) test(`Messagerie: perte ${afterWrite ? 'après' : 'avant'} écriture, reload, même clé et même résultat`, async ({page}) => {
  await open(page); const sent = posts(page); let original;
  await page.route('**/api/v1/conversations/qa-chat-a', async route => { if (route.request().method() !== 'POST') return route.continue(); if (afterWrite) { const response = await route.fetch(); original = await response.json(); } await route.abort('failed'); });
  await editor(page).fill('  Corps figé de la tentative  '); await send(page).click(); await expect(page.locator('#send-state')).toContainText('Envoi à vérifier');
  await editor(page).fill('Un nouveau brouillon conservé'); await page.reload(); await expect(editor(page)).toHaveValue('Un nouveau brouillon conservé');
  await expect(page.locator('#send-state')).toContainText('Envoi à vérifier'); expect(sent).toHaveLength(1);
  await page.unroute('**/api/v1/conversations/qa-chat-a'); await page.getByRole('button', {name: 'Réessayer le même envoi', exact: true}).click();
  await expect(page.locator('#send-state')).toContainText('Message envoyé'); expect(sent).toHaveLength(2); expect(sent[1]).toEqual(sent[0]);
  expect(target.store.db.conversations[0].messages).toHaveLength(1); if (afterWrite) expect(target.store.db.conversations[0].messages[0]).toEqual(original);
  await expect(editor(page)).toHaveValue('Un nouveau brouillon conservé'); await expect(page.locator('.message-bubble')).toHaveCount(1);
  expect(target.store.db.notifications.filter(n => n.title === 'Nouveau message' && n.userId === 'owner')).toHaveLength(1);
});
test('Messagerie: panne avant POST et correction après refus définitif', async ({page}) => {
  await open(page); const sent = posts(page); await editor(page).fill('Texte à garder');
  await page.route('**/api/v1/me', route => route.abort('failed')); await send(page).click();
  await expect(page.locator('#send-state')).toContainText('échec avant envoi'); expect(sent).toHaveLength(0);
  await page.unroute('**/api/v1/me');
  await page.route('**/api/v1/conversations/qa-chat-a', route => route.fulfill({status: 422, contentType: 'application/json', body: JSON.stringify({error: 'Refus simulé définitif'})}));
  await page.getByRole('button', {name: 'Réessayer le même envoi', exact: true}).click(); await expect(page.locator('#send-state')).toContainText('Message refusé');
  await expect(page.getByRole('button', {name: 'Réessayer le même envoi', exact: true})).toHaveCount(0);
  await page.unroute('**/api/v1/conversations/qa-chat-a'); await page.getByRole('button', {name: 'Corriger le message', exact: true}).click();
  await expect(editor(page)).toBeFocused(); await editor(page).fill('Texte corrigé'); await send(page).click();
  await expect(page.locator('#send-state')).toContainText('Message envoyé'); expect(sent).toHaveLength(2); expect(sent[1].key).not.toBe(sent[0].key);
});
test('Messagerie: clé et corps incompatibles restent à vérifier sans réessai dangereux', async ({page}) => {
  await open(page); const key = 'qa-existing-key', data = {text: 'Premier corps'};
  const response = await page.request.post(client + '/api/v1/conversations/qa-chat-a', {headers: {'Idempotency-Key': key}, data}); expect(response.ok()).toBe(true);
  await page.addInitScript(({key}) => sessionStorage.setItem('peyi-message-v1:renter:qa-chat-a', JSON.stringify({version: 1, accountId: 'renter', conversationId: 'qa-chat-a', draft: 'Autre corps', attempt: {key, body: {text: 'Autre corps'}, signature: JSON.stringify({text: 'Autre corps'}), status: 'uncertain', retryAllowed: true}})), {key});
  await page.reload(); await page.getByRole('button', {name: 'Réessayer le même envoi', exact: true}).click(); await expect(page.locator('#send-state')).toContainText('La clé ne permet pas');
  await expect(page.getByRole('button', {name: 'Réessayer le même envoi', exact: true})).toHaveCount(0); expect(target.store.db.conversations[0].messages).toHaveLength(1);
});
test('Messagerie: appartenance perdue interdit le replay, même si le cache possède le résultat', async ({page}) => {
  await open(page); const sent = posts(page);
  await page.route('**/api/v1/conversations/qa-chat-a', async route => { await route.fetch(); await route.abort('failed'); });
  await editor(page).fill('Écrit avant révocation'); await send(page).click(); await expect(page.locator('#send-state')).toContainText('Envoi à vérifier');
  target.store.db.conversations[0].participants = ['owner']; await page.unroute('**/api/v1/conversations/qa-chat-a');
  await page.getByRole('button', {name: 'Réessayer le même envoi', exact: true}).click(); await expect(page.locator('#message-sync')).toContainText('plus accessible');
  expect(sent).toHaveLength(1); await expect(page.locator('.message-bubble')).toHaveCount(0); await expect(editor(page)).toHaveValue(''); await expect(editor(page)).toBeDisabled();
});
test('Messagerie: compte changé masque le privé, brouillon limité au compte et au fil', async ({page}) => {
  await open(page); await editor(page).fill('Brouillon privé A'); await persona(page, 'owner');
  await page.getByRole('button', {name: 'Actualiser', exact: true}).click(); await expect(page.locator('#message-sync')).toContainText('Compte changé'); await expect(editor(page)).toHaveValue('');
  await page.reload(); await expect(editor(page)).toHaveValue(''); await expect(editor(page)).toBeEnabled();
  await persona(page); await page.reload(); await expect(editor(page)).toHaveValue('Brouillon privé A');
  await page.goto(client + '/messages?conversation=qa-chat-b'); await expect(editor(page)).toHaveValue('');
  await page.goto(client + '/messages?conversation=missing'); await expect(page.locator('#message-sync')).toContainText('Aucun autre fil'); await expect(editor(page)).toBeDisabled();
});
test('Messagerie: actualiser préserve le nœud, la sélection, le texte et la lecture', async ({page}) => {
  target.store.db.conversations[0].messages = Array.from({length: 18}, (_, i) => ({id: 'm' + i, author: 'owner', text: 'Message de lecture ' + i, at: '2027-01-01T12:00:00Z'}));
  await open(page); await editor(page).fill('Saisie en cours'); await editor(page).focus();
  await editor(page).evaluate(e => { window.originalEditor = e; e.setSelectionRange(2, 6); document.getElementById('message-stream').scrollTop = 30; });
  target.store.db.conversations[0].messages.push({id: 'incoming', author: 'owner', text: 'Message reçu pendant la saisie', at: '2027-01-01T12:01:00Z'});
  await expect(page.locator('.message-bubble')).toHaveCount(19, {timeout: 10000});
  expect(await editor(page).evaluate(e => ({same: e === window.originalEditor, focus: e === document.activeElement, start: e.selectionStart, end: e.selectionEnd, scroll: document.getElementById('message-stream').scrollTop}))).toEqual({same: true, focus: true, start: 2, end: 6, scroll: 30});
  const pageScroll = await page.evaluate(() => scrollY);
  await page.reload(); await expect(editor(page)).toHaveValue('Saisie en cours'); await expect(editor(page)).toBeFocused();
  expect(await page.locator('#message-stream').evaluate(e => e.scrollTop)).toBe(30);
  expect(await page.evaluate(() => scrollY)).toBe(pageScroll);
});
test('Messagerie: recherche locale et retour, erreur de lecture récupérable', async ({page}) => {
  await persona(page); await page.route('**/api/v1/conversations', route => route.abort('failed')); await page.goto(client + '/messages');
  await expect(page.locator('#message-sync')).toContainText('indisponible'); await page.unroute('**/api/v1/conversations'); await page.getByRole('button', {name: 'Actualiser', exact: true}).click(); await expect(page.locator('.message-row')).toHaveCount(2);
  await page.getByLabel('Rechercher dans vos échanges', {exact: true}).fill('Peugeot'); await page.getByRole('button', {name: 'Rechercher les conversations', exact: true}).click();
  await expect(page.locator('.message-row')).toHaveCount(1); await page.locator('.message-row').click(); await expect(editor(page)).toBeEnabled();
  await page.getByRole('link', {name: 'Retour aux messages', exact: true}).click(); await expect(page.getByLabel('Rechercher dans vos échanges', {exact: true})).toHaveValue('Peugeot');
  await expect(page.getByText(/non lus/i)).toHaveCount(0); await expect(page.getByRole('link', {name: 'Contacter l’assistance', exact: true})).toHaveAttribute('href', '/assistance');
});

test('Messagerie: clé absente ne permet que la vérification, et retour navigateur garde le brouillon', async ({page}) => {
  await open(page); const sent = posts(page);
  await page.addInitScript(() => sessionStorage.setItem('peyi-message-v1:renter:qa-chat-a', JSON.stringify({version: 1, accountId: 'renter', conversationId: 'qa-chat-a', draft: 'Brouillon sauvegardé', attempt: {body: {text: 'Résultat inconnu'}, status: 'sending'}})));
  await page.reload(); await expect(page.locator('#send-state')).toContainText('La clé ne permet pas');
  await expect(page.getByRole('button', {name: 'Réessayer le même envoi', exact: true})).toHaveCount(0);
  await page.getByRole('button', {name: 'Vérifier le fil', exact: true}).click(); await expect(page.locator('#message-sync')).toContainText('sans renvoi'); expect(sent).toHaveLength(0);
});
test('Messagerie: historique navigateur reprend le bon fil et son texte sans envoi implicite', async ({page}) => {
  await open(page); const sent = posts(page); await editor(page).fill('Brouillon du fil A');
  await page.getByRole('link', {name: 'Retour aux messages', exact: true}).click(); await expect(page.locator('.message-row')).toHaveCount(2);
  await page.locator('[data-conversation="qa-chat-b"]').click(); await expect(editor(page)).toHaveValue(''); await editor(page).fill('Brouillon du fil B');
  await page.goBack(); await page.goBack(); await expect(editor(page)).toHaveValue('Brouillon du fil A');
  await expect(page.locator('.message-context')).toContainText('Peugeot 208'); expect(sent).toHaveLength(0);
});

test('Messagerie: une reprise sans prévol réussi conserve le résultat incertain', async ({page}) => {
  await open(page);
  const sent = posts(page), sendState = page.locator('#send-state');
  await page.route('**/api/v1/conversations/qa-chat-a', async route => { await route.fetch(); await route.abort(); });
  await editor(page).fill('Un seul exemplaire');
  await send(page).click();
  await expect(sendState).toContainText('Envoi à vérifier');
  await page.unroute('**/api/v1/conversations/qa-chat-a');
  await page.route('**/api/v1/me', route => route.abort());
  const retry = page.getByRole('button', {name: 'Réessayer le même envoi', exact: true});
  await retry.click();
  await expect(page.locator('#message-sync')).toContainText('Impossible de vérifier');
  await expect(sendState).toContainText('Envoi à vérifier');
  expect(sent).toHaveLength(1);
  await page.unroute('**/api/v1/me');
  await retry.click();
  await expect(sendState).toContainText('Message envoyé');
  expect(sent).toHaveLength(2);
  expect(sent[1]).toEqual(sent[0]);
  expect(target.store.db.conversations[0].messages).toHaveLength(1);
});

test('Messagerie: une sauvegarde illisible laisse consulter le fil sans créer de clé', async ({page}) => {
  await open(page);
  const sent = posts(page);
  await page.addInitScript(() => {
    if (sessionStorage.getItem('qa-broken-message-state')) return;
    sessionStorage.setItem('qa-broken-message-state', 'true');
    sessionStorage.setItem('peyi-message-v1:renter:qa-chat-a', '{');
  });
  await page.reload();
  await expect(page.locator('#send-state')).toContainText('Envoi à vérifier');
  await editor(page).fill('Une saisie conservée');
  await expect(send(page)).toBeDisabled();
  await page.getByRole('button', {name: 'Vérifier le fil', exact: true}).click();
  await expect(page.locator('#message-sync')).toContainText('sans renvoi');
  expect(sent).toHaveLength(0);
  await page.reload();
  await expect(editor(page)).toHaveValue('Une saisie conservée');
  await expect(send(page)).toBeDisabled();
});

const notifications = page => page.locator('#notifications-status');
const readAll = page => page.getByRole('button', {name: 'Tout marquer comme lu', exact: true});
const reloadNotifications = page => page.getByRole('button', {name: 'Actualiser les notifications', exact: true});
const readEndpoint = '**/api/v1/notifications/read';

async function messageForOwner(page) {
  await persona(page);
  const response = await page.request.post(client + '/api/v1/conversations/qa-chat-a', {data: {text: 'Une notification liée au fil'}});
  expect(response.ok()).toBe(true);
}

test('Notifications: vide, cible du message, lecture globale et retour clavier', async ({page}) => {
  await page.setViewportSize({width: 320, height: 844});
  await open(page, 'owner', '/notifications');
  await expect(page.getByRole('heading', {name: 'Aucune notification'})).toBeVisible();
  await expect(readAll(page)).toHaveCount(0);
  await messageForOwner(page);
  await open(page, 'owner', '/notifications');
  const notice = page.getByRole('link', {name: /Nouveau message/});
  await expect(notice).toContainText('Non lue');
  await expect(notice).toHaveAttribute('href', thread);
  await notice.press('Enter');
  await expect(page.locator('#message-stream')).toContainText('Une notification liée au fil');
  await page.goBack();
  await expect(notice).toContainText('Non lue');
  await readAll(page).focus();
  await page.keyboard.press('Enter');
  await expect(notifications(page)).toContainText('Tout est à jour');
  await expect(notice).toContainText('Lue');
  await expect(notice).not.toContainText('Non lue');
  await expect(page.getByRole('heading', {name: 'Notifications', exact: true})).toBeFocused();
  await expect(readAll(page)).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

for (const afterWrite of [false, true]) test(`Notifications: réponse perdue ${afterWrite ? 'après' : 'avant'} le marquage, relecture seule`, async ({page}) => {
  await messageForOwner(page);
  await open(page, 'owner', '/notifications');
  let requests = 0, release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route(readEndpoint, async route => {
    requests++;
    if (afterWrite) await route.fetch();
    await gate;
    await route.abort();
  });
  try {
    await readAll(page).evaluate(button => { button.focus(); button.click(); button.click(); });
    await expect(notifications(page)).toContainText('en cours');
    await expect(page.getByText('Non lue', {exact: true})).toBeVisible();
  } finally {
    release();
  }
  await expect(notifications(page)).toContainText('n’a pas pu être vérifié');
  await expect(reloadNotifications(page)).toBeFocused();
  await expect(page.getByText('Non lue', {exact: true})).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(notifications(page)).toHaveText(afterWrite ? 'Tout est à jour.' : '1 notification non lue.');
  expect(requests).toBe(1);
  expect(target.store.db.notifications[0].read).toBe(afterWrite);
});

test('Notifications: une session changée efface la liste et empêche le marquage', async ({page}) => {
  await messageForOwner(page);
  await open(page, 'owner', '/notifications');
  await expect(readAll(page)).toBeVisible();
  await persona(page);
  await readAll(page).click();
  await expect(notifications(page)).toContainText('Ce compte ne peut plus');
  await expect(page.getByText('Nouveau message', {exact: true})).toHaveCount(0);
  await expect(page.getByRole('link', {name: 'Recharger avec le compte courant'})).toBeFocused();
  expect(target.store.db.notifications[0].read).toBe(false);
});
