const categories = new Set(['', 'Citadine', 'SUV', 'Utilitaire']);
const dateIsValid = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;

export function searchError(params) {
  const from = params.get('from') || '', until = params.get('until') || '';
  if ((params.get('q') || '').length > 120) return 'Précisez une destination de 120 caractères maximum.';
  if (!categories.has(params.get('category') || '')) return 'Choisissez une catégorie du catalogue.';
  if (Boolean(from) !== Boolean(until)) return 'Indiquez le départ et le retour, ou laissez les deux dates vides.';
  if (from && (!dateIsValid(from) || !dateIsValid(until))) return 'Vérifiez les deux dates de votre recherche.';
  if (from && until <= from) return 'La date de retour doit suivre le départ.';
  return '';
}

// Keep the existing string storage format and every valid filter/view parameter.
// Only the search route may be resumed; malformed storage never becomes a link.
export function recentSearch(value) {
  if (typeof value !== 'string' || !value.startsWith('/search') || /[\\\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    const url = new URL(value, 'https://explorer.invalid');
    if (url.origin !== 'https://explorer.invalid' || url.pathname !== '/search' || searchError(url.searchParams)) return null;
    const p = url.searchParams;
    if (p.get('max') && (!Number.isFinite(Number(p.get('max'))) || Number(p.get('max')) < 1 || Number(p.get('max')) > 1000)) return null;
    if (p.get('seats') && (!Number.isInteger(Number(p.get('seats'))) || Number(p.get('seats')) < 1 || Number(p.get('seats')) > 9)) return null;
    for (const [key, allowed] of [['gearbox',['Manuelle','Automatique']],['fuel',['Essence','Diesel','Hybride','Électrique']],['sort',['price','rating']],['view',['list','map']],['filters',['open']],['state',['empty']]]) {
      if (p.get(key) && !allowed.includes(p.get(key))) return null;
    }
    return url.pathname + url.search + url.hash;
  } catch { return null; }
}

export function loadRecentSearch() {
  try { return recentSearch(localStorage.getItem('recent-search')); }
  catch { return null; }
}

export function saveRecentSearch(params) {
  const value = recentSearch('/search' + (params.toString() ? '?' + params : ''));
  if (value) { try { localStorage.setItem('recent-search', value); } catch { /* Search remains available without storage. */ } }
}
