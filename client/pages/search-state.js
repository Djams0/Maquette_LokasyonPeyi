// The URL is the shared state of results and vehicle pages. UI flags never reach the API.
export const searchKeys = ['q','from','until','category','max','gearbox','fuel','seats','equipment','sort','view'];
export const filterKeys = ['category','max','gearbox','fuel','seats','equipment'];
export const choices = {
  category:['Citadine','SUV','Utilitaire'], gearbox:['Manuelle','Automatique'],
  fuel:['Essence','Diesel','Hybride','Électrique'],
  equipment:['Climatisation','Bluetooth','Siège enfant','Caméra recul'],
  sort:['price','rating'], view:['list','map']
};
export function localDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2})?$/.test(value || '')) return '';
  const local = value.length === 10 ? value+'T09:00' : value;
  const timestamp = Date.parse(local+':00Z');
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0,16) === local ? local : '';
}
export const dateParam = local => local?.endsWith('T09:00') ? local.slice(0,10) : local || '';
export function parseSearch(input = '', now = new Date()) {
  const source = new URLSearchParams(input), params = new URLSearchParams(), errors = [], warnings = [];
  for (const key of searchKeys) {
    const values = source.getAll(key);
    if (values.length > 1) errors.push('Le paramètre '+key+' est répété. Corrigez cette valeur.');
    for (const raw of values) {
      const value = raw.trim();
      if (value || ['from','until'].includes(key)) params.append(key,value);
    }
  }
  const unknown = [...new Set([...source.keys()].filter(k => !searchKeys.includes(k) && !['filters','state'].includes(k)))];
  if (unknown.length) warnings.push('Paramètres non reconnus ignorés : '+unknown.join(', ')+'.');
  if (source.has('filters') && (source.getAll('filters').length !== 1 || source.get('filters') !== 'open')) errors.push('État du panneau de filtres non reconnu.');
  if (source.has('state')) {
    if (source.getAll('state').length !== 1 || source.get('state') !== 'empty') errors.push('État de démonstration non reconnu.');
    else params.set('state','empty');
  }
  if ((params.get('q') || '').length > 120) errors.push('Précisez une destination de 120 caractères maximum.');
  for (const [key, allowed] of Object.entries(choices)) if (params.get(key) && !allowed.includes(params.get(key))) errors.push('Choisissez une valeur reconnue pour '+key+'.');
  for (const [key, limit] of [['max',1000],['seats',9]]) {
    const value = params.get(key);
    if (value && (!/^\d+(?:\.\d+)?$/.test(value) || !Number.isFinite(Number(value)) || Number(value)<1 || Number(value)>limit || (key==='seats' && !Number.isInteger(Number(value))))) errors.push('Vérifiez '+(key==='max'?'le prix maximum (1 à 1000).':'le nombre de places (1 à 9).'));
    else if (value) params.set(key,String(Number(value)));
  }
  const from = params.get('from') || '', until = params.get('until') || '';
  const startLocal = localDate(from), endLocal = localDate(until);
  if (Boolean(from) !== Boolean(until)) errors.push('Indiquez le départ et le retour, ou laissez les deux dates vides.');
  else if (from && (!startLocal || !endLocal)) errors.push('Vérifiez les deux dates de votre recherche.');
  else if (from && endLocal <= startLocal) errors.push('La date de retour doit suivre le départ.');
  else if (from && Date.parse(startLocal+':00-04:00') <= now.getTime()) errors.push('Cette période est passée. Modifiez explicitement les dates.');
  if (!errors.length) {
    if (startLocal) params.set('from',dateParam(startLocal));
    if (endLocal) params.set('until',dateParam(endLocal));
    if (params.get('view') === 'list') params.delete('view');
  }
  return {params,errors,warnings,ui:{openFilters:source.get('filters')==='open',empty:params.get('state')==='empty'},period:{provided:source.has('from')||source.has('until'),startLocal,endLocal}};
}
export const searchError = params => parseSearch(params).errors[0] || '';
export function searchURL(input) {
  const source = new URLSearchParams(input), params = new URLSearchParams();
  for (const key of [...searchKeys,'state']) for (const value of source.getAll(key)) params.append(key,value);
  return '/search'+(params.size?'?'+params:'');
}
export const vehicleURL = (id,params) => '/vehicle/'+encodeURIComponent(id)+searchURL(params).slice('/search'.length);
export function apiSearch(state) {
  if (state.errors.length) throw Error(state.errors[0]);
  const params = new URLSearchParams();
  for (const key of ['q',...filterKeys,'sort']) if (state.params.get(key)) params.set(key,state.params.get(key));
  if (state.period.startLocal) {
    params.set('start',state.period.startLocal+':00-04:00');
    params.set('end',state.period.endLocal+':00-04:00');
  }
  return params;
}
export function resetFilters(input) {
  const params = new URLSearchParams(input);
  for (const key of [...filterKeys,'state']) params.delete(key);
  return params;
}
