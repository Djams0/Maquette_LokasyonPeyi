import {api} from '../http.js';
import {escape, icon, date} from '/ui/components.js';
import {vehicleMedia, bindVehicleMedia} from './vehicle-media.js';
import {messageStorageKey, newMessageState, restoreMessageState, messageAttempt, serverMessages} from './message-state.js';

const textDate = value => value && Number.isFinite(Date.parse(value)) ? date(value) : 'Date non renseignée';
const own = (c, id) => Array.isArray(c?.participants) && c.participants.includes(id);
const unresolved = a => a && a.status !== 'sent';
const localVehicle = id => '/vehicle/' + encodeURIComponent(id);

export async function messages(me) {
  const params = new URLSearchParams(location.search), wanted = params.get('conversation'), query = (params.get('q') || '').slice(0, 100);
  const main = document.getElementById('main');
  main.classList.add('messaging-main');
  const key = messageStorageKey(me.id, wanted || ''), emptyState = () => newMessageState(me.id, wanted || '');
  let state = emptyState(), storageAvailable = true;
  try { state = restoreMessageState(sessionStorage.getItem(key), me.id, wanted || ''); } catch { storageAvailable = false; }
  let blocked = false, busy = false, valid = false, current = null, chats = [], timer, readPromise, delay = 3000, restored = false;
  const threadURL = id => '/messages?' + new URLSearchParams({...query ? {q: query} : {}, conversation: id});
  main.innerHTML = `<div class="messaging-heading"><div><p class="eyebrow">Vos échanges · démonstration</p><h1>${wanted ? 'Conversation' : 'Messagerie'}</h1></div><button class="secondary" id="reload-messages">${icon('refresh')}Actualiser</button></div>
    <p id="message-sync" class="message-meta" role="status">Chargement des échanges…</p>
    <div class="messaging-layout ${wanted ? 'has-thread' : ''}">
      <aside class="message-inbox card" aria-label="Boîte de réception"><h2>Vos conversations</h2>
        <form id="message-search" role="search"><label for="message-query">Rechercher dans vos échanges</label><div class="message-search-row"><input id="message-query" name="q" type="search" maxlength="100" value="${escape(query)}"><button class="secondary" type="submit" aria-label="Rechercher les conversations">${icon('search')}</button></div></form>
        <div id="conversation-list"></div><p id="inbox-empty" hidden>Aucun échange ici. <a href="/search">Trouver une voiture</a> pour contacter son propriétaire.</p>
      </aside>
      <section class="message-thread card" aria-label="Fil de conversation" ${!wanted ? 'hidden' : ''}>
        <div id="thread-context"></div><p class="message-disclaimer">Échanges fictifs. Ne partagez ni coordonnées réelles ni moyen de paiement. Aucun contrôle automatique du contenu n’est garanti.</p>
        <div id="message-stream" class="message-stream" role="region" aria-label="Messages du fil" tabindex="0"></div>
        <button id="new-messages" class="secondary" type="button" hidden>Voir les nouveaux messages</button>
        <div id="send-state" class="message-send-state" aria-live="polite" aria-atomic="true"></div>
        <form id="message-form" class="message-composer"><label for="message-text">Votre message</label><textarea id="message-text" name="text" required maxlength="1500" rows="3" aria-describedby="message-help send-state" disabled></textarea>
          <div class="message-composer-actions"><small id="message-help">1 500 caractères maximum · aucun envoi automatique</small><button type="submit" disabled>Envoyer ${icon('arrow')}</button></div>
        </form>
      </section>
    </div><p class="message-meta"><a href="/assistance">Contacter l’assistance</a> · Aucun texte de conversation n’est transmis par ce lien.</p>`;
  const $ = id => document.getElementById(id), editor = $('message-text'), form = $('message-form'), send = form.querySelector('button'), stream = $('message-stream');
  editor.value = state.draft;
  function persist() {
    if (!wanted || blocked) return;
    state.draft = editor.value;
    state.reading = stream.scrollTop;
    state.pageScroll = window.scrollY;
    state.focus = document.activeElement === editor;
    state.selection = [editor.selectionStart, editor.selectionEnd];
    try { sessionStorage.setItem(key, JSON.stringify(state)); } catch { storageAvailable = false; }
  }
  function sync(message) { $('message-sync').textContent = message + (!storageAvailable ? ' La sauvegarde dans cet onglet est indisponible ; gardez cette page ouverte.' : ''); }
  function controls() {
    editor.disabled = blocked || !valid || !wanted;
    send.disabled = blocked || !valid || busy || !!unresolved(state.attempt);
    $('reload-messages').disabled = busy;
    $('retry-message')?.toggleAttribute('disabled', busy || blocked || !valid);
    $('check-message')?.toggleAttribute('disabled', busy || blocked);
  }
  function sendingState() {
    const a = state.attempt, slot = $('send-state'), focused = slot.contains(document.activeElement) ? document.activeElement.id : null;
    if (!a) { slot.replaceChildren(); controls(); return; }
    const labels = {sending: 'Envoi en cours…', failed: 'Non envoyé · échec avant envoi', uncertain: 'Envoi à vérifier', refused: 'Message refusé · corrigez avant un nouvel envoi', sent: 'Message envoyé · confirmé par le serveur simulé'};
    slot.className = 'message-send-state ' + a.status;
    slot.innerHTML = `<p><strong>${labels[a.status]}</strong></p>${a.status !== 'sent' ? `<p class="message-attempt-text">${escape(a.body.text)}</p>` : ''}
      ${a.status === 'uncertain' ? '<p>Le serveur a peut-être enregistré ce message. Actualiser ne le renvoie pas. Un réessai autorisé conserve exactement le même texte et la même clé.</p>' : ''}
      ${['failed', 'uncertain'].includes(a.status) ? `<div class="message-recovery">${a.retryAllowed ? '<button class="secondary" type="button" id="retry-message">Réessayer le même envoi</button>' : '<p>La clé ne permet pas une reprise sûre. Vérifiez le fil et contactez l’assistance si nécessaire.</p>'}<button class="quiet" type="button" id="check-message">Vérifier le fil</button></div>` : ''}
      ${a.status === 'refused' ? '<p>Ce refus n’a pas enregistré de message. La correction utilisera une nouvelle clé.</p><button class="secondary" type="button" id="correct-message">Corriger le message</button>' : ''}`;
    $('retry-message')?.addEventListener('click', () => transmit(true));
    $('check-message')?.addEventListener('click', () => refresh(true));
    $('correct-message')?.addEventListener('click', () => { state.attempt = null; persist(); sendingState(); editor.focus(); });
    controls();
    if (focused) ($(focused) || editor).focus({preventScroll: true});
  }
  function block(reason, login = false) {
    persist(); blocked = true; valid = false; clearTimeout(timer);
    // Never show an earlier account's list, draft or messages under a new session.
    chats = []; current = null; editor.value = ''; stream.replaceChildren(); $('conversation-list').replaceChildren(); $('thread-context').replaceChildren(); $('send-state').replaceChildren();
    $('inbox-empty').hidden = true;
    sync(reason);
    const a = document.createElement('a');
    a.href = login ? '/login?next=' + encodeURIComponent(location.pathname + location.search) : location.pathname + location.search;
    a.textContent = login ? 'Se connecter pour reprendre' : 'Recharger avec le compte courant';
    $('message-sync').append(' ', a); controls();
  }
  async function loadContext() {
    const first = await api('/me');
    if (first?.id !== me.id) { block(first ? 'Compte changé. Les échanges précédents ont été masqués.' : 'Votre session a expiré.', !first); return null; }
    const list = await api('/conversations');
    const last = await api('/me');
    if (last?.id !== me.id) { block(last ? 'Compte changé. Les échanges précédents ont été masqués.' : 'Votre session a expiré.', !last); return null; }
    const authorized = list.filter(c => own(c, me.id));
    if (wanted && !authorized.some(c => c.id === wanted)) { block('Ce fil est introuvable ou ne vous est plus accessible. Aucun autre fil n’a été ouvert.'); return null; }
    return authorized;
  }
  function thumbnail(c) {
    const media = vehicleMedia({id: c.vehicleId, name: c.title});
    return `<span class="catalogue-media message-thumbnail"><img data-vehicle-image data-photo="${media.photo}" data-fallback="${media.fallback}" data-vehicle-name="${escape(c.title)}" src="${media.src}" alt="${escape(media.alt)}" width="64" height="64"><span class="media-label sr-only">${media.photo ? 'Photo de démonstration' : 'Illustration fictive'}</span></span>`;
  }
  function paintList() {
    const list = $('conversation-list'), existing = new Map([...list.children].map(el => [el.dataset.conversation, el]));
    const filtered = chats.filter(c => (c.title + ' ' + serverMessages(c.messages).map(m => m.text).join(' ')).toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')));
    for (const c of filtered) {
      let row = existing.get(c.id); const last = serverMessages(c.messages).at(-1);
      const content = `${thumbnail(c)}<span class="message-row-copy"><strong>${escape(c.title)}</strong><span class="message-meta">Échange à propos du véhicule</span><span class="message-preview">${escape(last ? (wanted ? 'Dernier message : ' : '') + last.text : 'Aucun message pour le moment')}</span><span class="message-meta">${last ? textDate(last.at) : 'Vous pouvez écrire le premier message'}</span></span>${icon('arrow')}`;
      if (!row) { row = document.createElement('a'); row.className = 'message-row'; row.dataset.conversation = c.id; row.href = threadURL(c.id); list.append(row); }
      if (row.dataset.content !== content) { row.innerHTML = content; row.dataset.content = content; bindVehicleMedia(row); }
      if (c.id === wanted) row.setAttribute('aria-current', 'page'); else row.removeAttribute('aria-current');
      existing.delete(c.id);
    }
    existing.forEach(el => el.remove()); $('inbox-empty').hidden = filtered.length > 0;
    if (!filtered.length && query) $('inbox-empty').innerHTML = 'Aucune conversation ne correspond. <a href="/messages">Effacer la recherche</a>.';
  }
  function paintThread() {
    if (!current) return;
    const context = $('thread-context');
    const content = `<div class="message-context">${thumbnail(current)}<div><h2>${escape(current.title)}</h2><p class="message-meta">Conversation de véhicule · aucune location précisée par le mock</p>${current.vehicleId ? `<a href="${escape(localVehicle(current.vehicleId))}">Voir le véhicule</a>` : ''}</div></div>`;
    if (context.dataset.content !== content) { context.innerHTML = content; context.dataset.content = content; bindVehicleMedia(context); }
    const atEnd = stream.scrollHeight - stream.scrollTop - stream.clientHeight < 40, top = stream.scrollTop;
    const existing = new Map([...stream.querySelectorAll('[data-message-id]')].map(el => [el.dataset.messageId, el]));
    let added = 0;
    for (const [index, m] of serverMessages(current.messages).entries()) {
      let bubble = existing.get(m.id);
      if (!bubble) { bubble = document.createElement('article'); bubble.dataset.messageId = m.id; added++; }
      bubble.className = 'message-bubble' + (m.author === me.id ? ' mine' : '');
      const content = `<p>${escape(m.text)}</p><small>${m.author === me.id ? 'Vous' : 'Votre interlocuteur'} · ${textDate(m.at)}${state.attempt?.serverId === m.id ? ' · Votre dernier envoi confirmé' : ''}</small>`;
      if (bubble.dataset.content !== content) { bubble.innerHTML = content; bubble.dataset.content = content; }
      if (stream.children[index] !== bubble) stream.insertBefore(bubble, stream.children[index] || null);
      existing.delete(m.id);
    }
    existing.forEach(el => el.remove());
    if (!stream.children.length) { const p = document.createElement('p'); p.className = 'message-empty'; p.textContent = 'Votre premier message peut commencer ici.'; stream.append(p); }
    else if (stream.querySelector('[data-message-id]')) stream.querySelectorAll('.message-empty').forEach(el => el.remove());
    if (!restored) {
      stream.scrollTop = state.reading ?? stream.scrollHeight;
      if (state.focus) { editor.focus({preventScroll: true}); editor.setSelectionRange(...state.selection); }
      if (state.pageScroll !== null) window.scrollTo(0, state.pageScroll);
      restored = true;
    } else if (atEnd) stream.scrollTop = stream.scrollHeight;
    else { stream.scrollTop = top; if (added) $('new-messages').hidden = false; }
  }
  function apply(list) {
    chats = list; current = chats.find(c => c.id === wanted); valid = true; controls(); paintList(); paintThread();
  }
  async function refresh(manual = false) {
    if (blocked || busy) return;
    if (readPromise) return readPromise;
    readPromise = (async () => {
      try {
        const list = await loadContext(); if (!list || blocked) return;
        apply(list); delay = 3000;
        sync(manual ? 'Fil actualisé sans renvoi de message.' : 'Échanges actualisés · les statuts de lecture ne sont pas fournis par le mock.');
      } catch (error) {
        if ([401, 403].includes(error.status)) block('Votre session ne permet plus de lire ces échanges.', error.status === 401);
        else { delay = Math.min(delay * 2, 30000); sync('Actualisation indisponible. Votre saisie reste ici. Utilisez Actualiser pour reprendre.'); }
      } finally { readPromise = null; controls(); schedule(); }
    })();
    return readPromise;
  }
  function schedule() {
    clearTimeout(timer);
    if (!blocked && !document.hidden) timer = setTimeout(() => refresh(), delay);
  }
  async function transmit(retry = false) {
    if (blocked || busy || !valid) return;
    if (retry && (!unresolved(state.attempt) || !state.attempt.retryAllowed)) return;
    if (!retry && (unresolved(state.attempt) || !editor.value.trim() || !form.reportValidity())) return;
    if (!retry) state.attempt = messageAttempt(editor.value, crypto.randomUUID());
    const attempt = state.attempt;
    busy = true; clearTimeout(timer); attempt.status = 'sending'; persist(); sendingState();
    let posted = false;
    try {
      if (readPromise) await readPromise;
      const list = await loadContext(); if (!list || blocked) return;
      apply(list);
      // The mock cache does not re-check membership on replay: the fresh list above is mandatory.
      posted = true;
      const result = await api('/conversations/' + encodeURIComponent(wanted), attempt.body, 'POST', attempt.key);
      const identity = await api('/me');
      if (identity?.id !== me.id) { block('Compte changé pendant l’envoi. Vérifiez le fil avec le compte d’origine.', !identity); return; }
      if (typeof result?.id !== 'string' || result.author !== me.id || typeof result.text !== 'string') throw Error('Résultat non vérifiable');
      attempt.status = 'sent'; attempt.serverId = result.id;
      current.messages = serverMessages([...current.messages, result]);
      if (editor.value === attempt.body.text) editor.value = '';
      paintThread(); paintList(); sync('Message confirmé par le serveur simulé.');
    } catch (error) {
      if ([401, 403, 404].includes(error.status)) { block('Ce compte ne peut plus envoyer dans ce fil.', error.status === 401); return; }
      attempt.status = !posted ? 'failed' : [400, 422].includes(error.status) ? 'refused' : 'uncertain';
      if (error.status === 409) attempt.retryAllowed = false;
      sync(!posted ? 'La vérification a échoué avant l’envoi. Aucun POST de message n’a été effectué.' : 'Le résultat de cet envoi est indiqué sous le fil. Votre saisie est conservée.');
    } finally {
      busy = false;
      if (!blocked) { persist(); sendingState(); }
      controls(); schedule();
    }
  }
  editor.addEventListener('input', persist);
  stream.addEventListener('scroll', () => { if (stream.scrollHeight - stream.scrollTop - stream.clientHeight < 40) $('new-messages').hidden = true; persist(); });
  $('new-messages').onclick = () => { stream.scrollTop = stream.scrollHeight; $('new-messages').hidden = true; };
  form.onsubmit = event => { event.preventDefault(); transmit(); };
  $('reload-messages').onclick = () => refresh(true);
  window.addEventListener('pagehide', () => { persist(); clearTimeout(timer); });
  window.addEventListener('pageshow', event => { if (event.persisted) refresh(); });
  for (const event of ['focus', 'online']) window.addEventListener(event, () => refresh());
  document.addEventListener('visibilitychange', () => { if (document.hidden) { persist(); clearTimeout(timer); } else refresh(); });
  sendingState(); await refresh();
}
