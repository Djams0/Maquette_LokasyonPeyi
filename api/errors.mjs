export function requireValue(condition, status, message) {
  if (!condition) throw Object.assign(new Error(message), { status });
}
export const find = (items, id) => {
  const item = items.find(x => x.id === id);
  requireValue(item, 404, 'Élément introuvable.');
  return item;
};
export const text = (value, min = 1, max = 1000) => {
  requireValue(typeof value === 'string' && value.trim().length >= min && value.length <= max, 422, `Texte requis (${min} à ${max} caractères).`);
  return value.trim();
};
export const number = (value, min, max) => {
  const n = Number(value);
  requireValue(value !== '' && Number.isFinite(n) && n >= min && n <= max, 422, `Valeur attendue entre ${min} et ${max}.`);
  return n;
};
export const choice = (value, choices) => { requireValue(choices.includes(value), 422, 'Choix invalide.'); return value; };
export const now = () => new Date().toISOString();
