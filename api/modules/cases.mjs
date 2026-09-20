import { requireValue,text,choice,now } from '../errors.mjs';
import { signed,authorize,participant } from '../access.mjs';
import { id,audit,notify } from '../store.mjs';
export const caseStates=['received','evidence_requested','contradictory','reviewing','decision','closed'];
export function visibleCase(c,actor) {
  if(actor.internal){authorize(actor,'cases.read',c);if(c.sensitive)authorize(actor,'cases.sensitive');return c;}
  requireValue(c.participants.includes(actor.id),403,'Ce dossier ne vous appartient pas.');const {notes,assignedTo,...safe}=c;return safe;
}
export function createCase(db,actor,b) {
  signed(actor);let r=b.rentalId?db.rentals.find(x=>x.id===b.rentalId):null;if(b.rentalId){requireValue(r,404,'Location introuvable.');participant(actor,r);}
  const c={id:id('case'),userId:actor.id,rentalId:r?.id,participants:r?[r.renterId,r.ownerId]:[actor.id],kind:choice(b.kind,['Dommage','Annulation','Prolongation','Retour non confirmé','Assistance','Demande d’information','Caution contestée']),summary:text(b.summary,10,2000),status:'received',assignedTo:['employee','admin'],sensitive:false,messages:[],notes:[],version:1,createdAt:now()};db.cases.unshift(c);audit(db,actor,'case.create',c.id);return c;
}
export function updateCase(db,actor,c,b) {
  visibleCase(c,actor);
  if(b.action==='message'){c.messages.push({id:id('message'),author:actor.id,text:text(b.text,1,2000),at:now()});for(const u of c.participants)notify(db,u,'Nouveau message dans votre dossier',`/cases/${c.id}`);}
  else {authorize(actor,'cases.update',c);if(b.action==='note')c.notes.push({author:actor.id,text:text(b.text,3,2000),at:now()});else if(b.action==='status'){choice(b.status,caseStates);requireValue(Math.abs(caseStates.indexOf(b.status)-caseStates.indexOf(c.status))<=1,409,'Suivez les étapes de revue du dossier.');c.status=b.status;c.decision=text(b.reason,3,1000);}else requireValue(false,404,'Action inconnue.');}
  c.version++;audit(db,actor,`case.${b.action}`,c.id);return visibleCase(c,actor);
}
