import { requireValue } from './errors.mjs';
export const can = (actor, permission) => actor?.status === 'active' && actor.permissions?.includes(permission);
export function authorize(actor, permission, resource) {
  requireValue(can(actor, permission), 403, 'Cette action nécessite une habilitation explicite.');
  if (resource?.assignedTo) requireValue(resource.assignedTo.includes(actor.id),403,'Ce dossier ne vous est pas assigné.');
}
export function signed(actor) { requireValue(actor?.status === 'active',401,'Connectez-vous avec un compte de démonstration actif.'); }
export function participant(actor, rental) { signed(actor);requireValue([rental.renterId,rental.ownerId].includes(actor.id),403,'Cette location ne vous appartient pas.'); }
export function publicVehicle(v) { const {plate,assignedTo,checksPassed,...safe}=v;return safe; }
export function publicRental(r, actor) {
  participant(actor,r);
  const safe=structuredClone(r);
  if(!['confirmed','in_progress','return_reported','returned','completed'].includes(r.status))delete safe.meeting;
  return safe;
}
