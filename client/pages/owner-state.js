import {localDate} from './search-state.js';
import {localRentalDate, rentalTitles} from './booking-state.js';

export const ownerSections = [
  {title: 'Véhicule', groups: [1, 3]},
  {title: 'État et photos', groups: [4, 5]},
  {title: 'Disponibilité et prix', groups: [7, 8]},
  {title: 'Revue et envoi', groups: [2, 6, 9]},
];
export const ownerGroups = ['Identification', 'Documents', 'Caractéristiques', 'Équipements', 'Photos', 'Sécurité', 'Prix et règles', 'Disponibilités', 'Récapitulatif'];
export const groupFields = {1: ['name','plate','year','city'], 2: ['documents'], 3: ['category','gearbox','fuel','seats'], 4: ['equipment'], 5: ['photos'], 6: ['safety'], 7: ['price','description','pets'], 8: ['start','end'], 9: []};
export const ownerBufferKey = account => 'peyi-owner-draft-v1:' + encodeURIComponent(account);
export const validOwnerStep = value => /^[1-9]$/.test(String(value)) ? Number(value) : null;
export const sectionForStep = step => ownerSections.findIndex(s => s.groups.includes(Number(step)));
export function cleanOwnerDraft(value) {
  const result = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
  for (const key of [...Object.values(groupFields).flat(), 'step']) {
    const v = value[key];
    if (key === 'equipment' && Array.isArray(v)) result[key] = v.filter(x => typeof x === 'string').slice(0, 4).map(x => x.slice(0, 80));
    else if (typeof v === 'string') result[key] = v.slice(0, key === 'description' ? 1500 : 120);
    else if (typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v))) result[key] = v;
  }
  return result;
}
export const draftSignature = value => JSON.stringify(cleanOwnerDraft(value));
export function restoreOwnerBuffer(raw, accountId) {
  try {
    const s = JSON.parse(raw);
    if (s.version !== 1 || s.accountId !== accountId || !s.groups || typeof s.groups !== 'object') return null;
    const groups = {};
    for (const step of Object.keys(groupFields)) if (s.groups[step]) {
      const values = cleanOwnerDraft(s.groups[step]);
      groups[step] = Object.fromEntries(groupFields[step].filter(k => k in values).map(k => [k, values[k]]));
      if (step === '5' && Array.isArray(s.groups[step].selected)) groups[step].selected = [...new Set(s.groups[step].selected.filter(n => Number.isInteger(n) && n >= 0 && n < 5))];
    }
    const result = {version: 1, accountId, base: cleanOwnerDraft(s.base), groups, step: validOwnerStep(s.step) || 1};
    if (Array.isArray(s.photoSelection?.selected)) {
      const selected=[...new Set(s.photoSelection.selected.filter(n=>Number.isInteger(n)&&n>=0&&n<5))];
      if(selected.length===s.photoSelection.count)result.photoSelection={selected,count:selected.length};
    }
    if (s.attempt && typeof s.attempt === 'object') {
      const body = cleanOwnerDraft(s.attempt.body), signature = JSON.stringify(body);
      const safe = typeof s.attempt.key === 'string' && /^[\w-]{8,160}$/.test(s.attempt.key) && s.attempt.signature === signature;
      result.attempt = {body, signature, key: safe ? s.attempt.key : null, retryAllowed: safe && s.attempt.retryAllowed !== false, status: 'uncertain'};
    }
    return result;
  } catch { return null; }
}
export function overlayOwnerBuffer(server, buffer) {
  const result = {...cleanOwnerDraft(server)};
  for (const values of Object.values(buffer?.groups || {})) Object.assign(result, cleanOwnerDraft(values));
  return result;
}
export function ownerDraftDifferences(before, after) {
  const a = cleanOwnerDraft(before), b = cleanOwnerDraft(after);
  return [...Object.values(groupFields).flat(), 'step'].filter(key => JSON.stringify(a[key]) !== JSON.stringify(b[key]));
}
export const ownerLocalDate = value => localDate(value) || (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:[0-5]\d(?:\.\d{3})?(?:Z|-04:00)$/.test(value || '') && localDate(value.slice(0,16)) ? localRentalDate(value) : '');
export function ownerDraftErrors(value) {
  const d = cleanOwnerDraft(value), errors = [];
  const text = (key, min, max, group, label) => { if (typeof d[key] !== 'string' || d[key].trim().length < min || d[key].length > max) errors.push({group, label}); };
  const number = (key, min, max, group, label) => { if (d[key] === '' || d[key] == null || !Number.isFinite(Number(d[key])) || Number(d[key]) < min || Number(d[key]) > max) errors.push({group, label}); };
  text('name',2,80,1,'Nom / modèle'); text('plate',3,20,1,'Plaque fictive'); text('city',2,80,1,'Commune'); number('year',1950,2030,1,'Année');
  for (const [key, values, label] of [['category',['Citadine','SUV','Utilitaire'],'Catégorie'],['gearbox',['Manuelle','Automatique'],'Boîte'],['fuel',['Essence','Diesel','Hybride','Électrique'],'Énergie']]) if (!values.includes(d[key])) errors.push({group: 3, label});
  number('seats',2,9,3,'Places'); number('price',1,1000,7,'Prix journalier fictif'); text('description',10,1500,7,'Présentation et règles');
  if (!(Number(d.photos) >= 5)) errors.push({group: 5, label: 'Cinq vues fictives'});
  if (d.documents !== true) errors.push({group: 2, label: 'Trois documents synthétiques'});
  if (d.safety !== true) errors.push({group: 6, label: 'Confirmation de sécurité et couverture'});
  const start = ownerLocalDate(d.start), end = ownerLocalDate(d.end);
  if (!start || !end || end <= start) errors.push({group: 8, label: 'Période de disponibilité valide · heure Guadeloupe'});
  return errors;
}
export const ownerRequestTabs = {all: 'Toutes', requested: 'À traiter', in_progress: 'En cours', return_reported: 'Retours', completed: 'Clôturées'};
export const ownerRequestReturn = tab => '/owner/requests' + (tab !== 'all' && Object.hasOwn(rentalTitles, tab) ? '?tab=' + tab : '');

export function ownerCalendarItems(vehicle, rentals) {
  const held = ['awaiting_payment','confirmed','in_progress','return_reported'];
  return [
    ...(vehicle.availability?.blocked || []).map(b => ({...b, kind: 'blocked', label: 'Indisponible · blocage manuel'})),
    ...rentals.filter(r => r.vehicleId === vehicle.id && (r.status === 'requested' || held.includes(r.status))).map(r => ({id: r.id, start: r.start, end: r.end, kind: r.status === 'requested' ? 'requested' : 'held', status: r.status, label: r.status === 'requested' ? 'Demande · créneau non réservé' : 'Créneau occupé par la location'})),
  ].sort((a,b) => Date.parse(a.start) - Date.parse(b.start));
}
