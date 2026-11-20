// Route classification changes navigation only; authorization stays in the API.
const catalogue = ['/search','search','Explorer'];
const help = ['/faq','info','Aide'];
const visitorAccount = ['/login?next=%2Fprofile','user','Compte'];
const rentals = ['/rentals','calendar','Locations'];
const messages = ['/messages','message','Messages'];
const documents = ['/profile/documents','shield','Documents'];
const profile = ['/profile','user','Profil'];
const park = ['/owner/vehicles','car','Mon parc'];
const requests = ['/owner/requests','file','Demandes'];
const visitorDestinations = [catalogue, help, visitorAccount];
const renterDestinations = [catalogue, rentals, messages, documents];
const ownerDestinations = [catalogue, park, requests, profile];

export function navigationRole(me) {
  return me && !me.internal && (!me.status || me.status === 'active')
    ? me.owner === true ? 'owner' : 'renter'
    : 'visitor';
}

export function primaryDestinations(role) {
  if (role === 'owner') return ownerDestinations;
  if (role === 'renter') return renterDestinations;
  return visitorDestinations;
}

export function currentDestination(path, role) {
  const under = prefix => path === prefix || path.startsWith(prefix+'/');
  if (path === '/' || under('/search') || under('/vehicle')) return catalogue[0];
  if (role === 'visitor') {
    if (path === '/faq') return help[0];
    if (path === '/login' || path === '/register') return visitorAccount[0];
    return null;
  }
  if (role === 'owner') {
    if (under('/owner/requests')) return requests[0];
    if (under('/owner') && path !== '/owner/start') return park[0];
    if (under('/profile') || under('/notifications')) return profile[0];
    return null;
  }
  if (/^\/(rentals|rental|request|payment|inspection|review|receipt)(\/|$)/.test(path)) return rentals[0];
  if (under('/messages')) return messages[0];
  if (under('/profile') || under('/notifications')) return documents[0];
  return null;
}
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
  const root = ['/', '/search', '/rentals', '/messages', '/profile', '/owner'].includes(path) && !thread;
  let back = null;
  // Other detail pages already render a named, domain-specific return link.
  if (thread) {
    const query = (new URLSearchParams(search).get('q') || '').slice(0, 100);
    back = ['/messages' + (query ? '?' + new URLSearchParams({q: query}) : ''), 'Retour aux messages'];
  }
  else if (path === '/notifications' || path === '/cases') back = ['/profile', 'Retour au profil'];
  else if (['/owner/vehicles', '/owner/requests', '/owner/revenue', '/owner/reputation'].includes(path)) back = ['/owner', 'Espace propriétaire'];
  else if (path === '/demo/audit') back = ['/demo', 'Retour à Démo & comptes'];
  else if (['/demo', '/design-system', '/faq', '/owner/start', '/login', '/register'].includes(path)) back = ['/', 'Retour à Explorer'];
  return {root, back};
}
