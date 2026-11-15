// Route classification changes navigation only; authorization stays in the API.
export const destinations = [
  ['/', 'search', 'Explorer'],
  ['/rentals', 'calendar', 'Locations'],
  ['/messages', 'message', 'Messages'],
  ['/profile', 'user', 'Profil'],
];
export function safeNext(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(value)) return '/';
  try {
    const base = 'https://navigation.invalid';
    const url = new URL(value, base);
    const target = url.pathname + url.search + url.hash;
    return url.origin === base && !target.startsWith('//') ? target : '/';
  } catch { return '/'; }
}
export function navigationState(path, search = '') {
  path = path.replace(/\/$/, '') || '/';
  const thread = path === '/messages' && !!new URLSearchParams(search).get('conversation');
  let active = null;
  if (path === '/' || /^\/(search|vehicle)(\/|$)/.test(path)) active = '/';
  else if (/^\/(rentals|rental|request|payment|inspection|review|receipt)(\/|$)/.test(path)) active = '/rentals';
  else if (path === '/messages') active = '/messages';
  else if (/^\/(profile|notifications|owner|cases|assistance|demo|design-system|faq|login|register)(\/|$)/.test(path)) active = '/profile';
  const root = ['/', '/search', '/rentals', '/messages', '/profile', '/owner'].includes(path) && !thread;
  let back = null;
  // Other detail pages already render a named, domain-specific return link.
  if (thread) back = ['/messages', 'Retour aux messages'];
  else if (path === '/notifications' || path === '/cases') back = ['/profile', 'Retour au profil'];
  else if (['/owner/vehicles', '/owner/requests', '/owner/revenue', '/owner/reputation'].includes(path)) back = ['/owner', 'Espace propriétaire'];
  else if (path === '/demo/audit') back = ['/demo', 'Retour à Démo & comptes'];
  else if (['/demo', '/design-system', '/faq', '/owner/start', '/login', '/register'].includes(path)) back = ['/', 'Retour à Explorer'];
  return {active, root, back};
}
