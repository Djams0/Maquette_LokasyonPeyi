// Presentation state only. The server remains responsible for membership and writes.
export const messageStorageKey = (account, thread) => 'peyi-message-v1:' + encodeURIComponent(account) + ':' + encodeURIComponent(thread);
export function newMessageState(accountId, conversationId) {
  return {version: 1, accountId, conversationId, draft: '', attempt: null, reading: null, pageScroll: null, focus: false, selection: [0, 0]};
}
export function messageAttempt(text, key) {
  const body = {text};
  return {key, body, signature: JSON.stringify(body), status: 'sending', retryAllowed: true};
}
export function restoreMessageState(raw, accountId, conversationId) {
  const state = newMessageState(accountId, conversationId);
  try {
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || saved.accountId !== accountId || saved.conversationId !== conversationId) return state;
    state.draft = typeof saved.draft === 'string' ? saved.draft.slice(0, 1500) : '';
    state.reading = Number.isFinite(saved.reading) ? Math.max(0, saved.reading) : null;
    state.pageScroll = Number.isFinite(saved.pageScroll) ? Math.max(0, saved.pageScroll) : null;
    state.focus = saved.focus === true;
    state.selection = Array.isArray(saved.selection) && saved.selection.length === 2 && saved.selection.every(Number.isInteger) ? saved.selection : [0, 0];
    const a = saved.attempt;
    if (a && typeof a.body?.text === 'string' && a.body.text.length <= 1500) {
      const signature = JSON.stringify({text: a.body.text});
      const valid = typeof a.key === 'string' && /^[\w-]{8,160}$/.test(a.key) && a.signature === signature;
      state.attempt = {key: valid ? a.key : null, body: {text: a.body.text}, signature,
        status: valid && ['failed', 'refused', 'sent'].includes(a.status) ? a.status : 'uncertain',
        retryAllowed: valid && a.retryAllowed !== false, serverId: typeof a.serverId === 'string' ? a.serverId : null};
    }
  } catch { /* A broken storage record never authorizes a replay. */ }
  return state;
}
export function serverMessages(messages) {
  const unique = new Map();
  for (const m of Array.isArray(messages) ? messages : []) {
    if (typeof m?.id === 'string' && typeof m.author === 'string' && typeof m.text === 'string') unique.set(m.id, m);
  }
  return [...unique.values()];
}
