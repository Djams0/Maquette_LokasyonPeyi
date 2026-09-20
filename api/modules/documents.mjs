import { requireValue, text, choice, now } from '../errors.mjs';
import { authorize } from '../access.mjs';
import { id, audit, notify } from '../store.mjs';
export const criteria=['Lisibilité','Identité / rattachement','Validité','Expiration','Cohérence'];
export function submitDocument(db,actor,kind,vehicleId) {
  choice(kind,['Permis','Identité','Carte grise','Assurance','Contrôle technique']);
  let d=db.documents.find(x=>x.userId===actor.id&&x.kind===kind&&x.vehicleId===vehicleId);
  if(!d){d={id:id('doc'),userId:actor.id,kind,vehicleId,version:0,assignedTo:['employee','admin']};db.documents.push(d);}
  d.version++;d.status='pending';d.submittedAt=now();delete d.reason;
  if(!vehicleId)actor.eligibility='pending';
  else {const v=db.vehicles.find(v=>v.id===vehicleId);v.checksPassed=false;if(v.status==='published')v.status='pending';}
  audit(db,actor,'document.submit',d.id);return d;
}
export function reviewDocument(db,actor,d,b) {
  authorize(actor,'documents.review',d);requireValue(actor.id!==d.userId,403,'Vous ne pouvez pas vérifier votre propre dossier.');
  requireValue(b.version===d.version,409,'La pièce a été remplacée. Rouvrez sa nouvelle version.');
  requireValue(d.status==='pending',409,'Cette version a déjà une décision.');
  requireValue(Array.isArray(b.checks)&&b.checks.length===criteria.length,422,'Renseignez les cinq critères.');
  const checks=criteria.map(label=>{const c=b.checks.find(x=>x.label===label);requireValue(c,422,'Critère manquant.');choice(c.result,['pass','fail','na']);return{label,result:c.result,note:c.result==='na'?text(c.note,3,300):String(c.note||'').slice(0,300)};});
  choice(b.decision,['verified','rejected']);requireValue(b.decision!=='verified'||checks.every(c=>c.result!=='fail'),422,'Un critère non conforme empêche la validation.');
  const review={id:id('review'),documentId:d.id,documentVersion:d.version,checklistVersion:1,agent:actor.id,at:now(),checks,decision:b.decision,reason:text(b.reason,3,500)};
  db.documentReviews.push(review);d.status=b.decision;d.reason=review.reason;
  const user=db.users.find(u=>u.id===d.userId);
  if(!d.vehicleId)user.eligibility=['Permis','Identité'].every(k=>db.documents.some(x=>x.userId===user.id&&!x.vehicleId&&x.kind===k&&x.status==='verified'))?'verified':(b.decision==='rejected'?'rejected':'pending');
  audit(db,actor,'document.review',d.id,`v${d.version} ${b.decision}`);notify(db,d.userId,'Résultat de votre contrôle documentaire',d.vehicleId?`/owner/vehicles/${d.vehicleId}`:'/profile/documents');return review;
}
