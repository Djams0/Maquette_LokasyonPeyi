import { requireValue, find, choice, now, number } from '../errors.mjs';
import { signed, participant } from '../access.mjs';
import { id, audit, notify } from '../store.mjs';
export const heldStates=['awaiting_payment','confirmed','in_progress','return_reported'];
export function dates(start,end) {
  requireValue(typeof start==='string'&&typeof end==='string'&&Number.isFinite(Date.parse(start))&&Number.isFinite(Date.parse(end))&&Date.parse(end)>Date.parse(start),422,'Les dates et heures doivent être valides ; le retour doit suivre le départ.');
}
export const overlap=(a,b)=>Date.parse(a.start)<Date.parse(b.end)&&Date.parse(b.start)<Date.parse(a.end);
export function available(db,v,period,exclude) {
  dates(period.start,period.end);
  return v.status==='published'&&Date.parse(period.start)>=Date.parse(v.availability.start)&&Date.parse(period.end)<=Date.parse(v.availability.end)&&!v.availability.blocked.some(b=>overlap(b,period))&&!db.rentals.some(r=>r.id!==exclude&&r.vehicleId===v.id&&heldStates.includes(r.status)&&overlap(r,period));
}
export function request(db, actor, body) {
  signed(actor);const v=find(db.vehicles,body.vehicleId);dates(body.start,body.end);
  requireValue(actor.id!==v.ownerId,422,'Vous ne pouvez pas demander votre propre véhicule.');
  requireValue(actor.eligibility==='verified',422,'Complétez la vérification fictive de vos documents avant la demande.');
  requireValue(available(db,v,body),409,'Ce créneau est indisponible. Choisissez d’autres dates.');
  const days=Math.ceil((Date.parse(body.end)-Date.parse(body.start))/86400000);
  const r={id:id('LP'),vehicleId:v.id,vehicleName:v.name,ownerId:v.ownerId,renterId:actor.id,renterName:actor.name,publicProfile:{memberSince:actor.memberSince,completed:actor.completed,eligibility:actor.eligibility},start:new Date(body.start).toISOString(),end:new Date(body.end).toISOString(),status:'requested',payment:'not_started',deposit:'not_started',quote:{version:'demo-1',daily:v.price,days,total:v.price*days,currency:'EUR',commercial:false,fees:'Non définis',insurance:'Conditions à valider',depositAmount:null},meeting:'Point de rendez-vous fictif · place Démo, '+v.city,history:[],version:1,createdAt:now()};
  db.rentals.unshift(r);audit(db,actor,'rental.request',r.id);notify(db,v.ownerId,'Nouvelle demande de location','/owner/requests');return r;
}
export function transition(db,actor,r,action,body={}) {
  participant(actor,r);const owner=actor.id===r.ownerId;const renter=actor.id===r.renterId;
  const rule=(state,who)=>requireValue(r.status===state&&who,409,'Cette transition n’est pas disponible pour cet acteur et cet état.');
  if(action==='accept') { rule('requested',owner);requireValue(available(db,find(db.vehicles,r.vehicleId),r,r.id),409,'Un autre créneau accepté entre en conflit.');r.status='awaiting_payment'; }
  else if(action==='decline') {rule('requested',owner);r.reason=choice(body.reason,['unavailable','maintenance','other']);r.status='declined';}
  else if(action==='withdraw') {rule('requested',renter);r.status='withdrawn';}
  else if(action==='pay') {rule('awaiting_payment',renter);choice(body.outcome,['success','failure']);r.payment=body.outcome==='failure'?'failed':'simulated_paid';if(body.outcome==='success')r.status='confirmed';}
  else if(action==='deposit') {rule('confirmed',renter);choice(body.outcome,['success','failure']);r.deposit=body.outcome==='failure'?'simulated_failed':'simulated_authorized';}
  else if(action==='handover') {rule('confirmed',owner);requireValue(r.deposit==='simulated_authorized',422,'Simulez séparément le contrôle de caution avant la remise.');requireValue(db.inspections.some(i=>i.rentalId===r.id&&i.phase==='departure'&&i.finalized),422,'L’état des lieux de départ doit être finalisé.');requireValue(body.controls===true,422,'Confirmez les contrôles pré-départ fictifs.');r.status='in_progress';r.handoverAt=now();}
  else if(action==='report_return') {rule('in_progress',renter);requireValue(db.inspections.some(i=>i.rentalId===r.id&&i.phase==='return'&&i.finalized),422,'Finalisez l’état des lieux de retour.');r.status='return_reported';r.returnReportedAt=now();}
  else if(action==='verify_return') {rule('return_reported',owner);requireValue(body.keys===true,422,'Confirmez la récupération effective des clés.');r.status='returned';r.returnVerifiedAt=now();}
  else if(action==='complete') {rule('returned',owner);r.status='completed';r.completedAt=now();}
  else requireValue(false,404,'Action inconnue.');
  r.version++;r.history.push({action,actor:actor.id,at:now(),status:r.status});audit(db,actor,`rental.${action}`,r.id);notify(db,owner?r.renterId:r.ownerId,'Mise à jour de votre location',`/rental/${r.id}`);return r;
}
export const views=['Avant','Arrière','Côté gauche','Côté droit','Intérieur','Compteur','Carburant / charge','Vue générale'];
export function inspection(db,actor,r,phase,action,body) {
  participant(actor,r);choice(phase,['departure','return']);
  requireValue(r.status===(phase==='departure'?'confirmed':'in_progress'),409,'L’inspection n’est plus modifiable à cette étape.');
  let i=db.inspections.find(x=>x.rentalId===r.id&&x.phase===phase);
  if(!i){i={id:id('inspection'),rentalId:r.id,phase,photos:[],versions:[],reservations:[],finalized:false};db.inspections.push(i);}
  requireValue(!i.finalized,409,'Constat finalisé : ajoutez une réserve au dossier, sans modifier l’original.');
  if(action==='photo') {
    const view=choice(body.view,views);const previous=i.photos.find(x=>x.view===view);if(previous)i.versions.push({...previous});
    const photo={id:id('photo'),view,version:(previous?.version||0)+1,origin:'simulated_camera',at:now(),actor:actor.id};i.photos=i.photos.filter(x=>x.view!==view);i.photos.push(photo);
  } else if(action==='save'||action==='finalize') {
    i.km=number(body.km,0,2000000);i.fuel=number(body.fuel,0,100);i.observation=String(body.observation||'').slice(0,1500);
    if(phase==='return'){const dep=db.inspections.find(x=>x.rentalId===r.id&&x.phase==='departure');requireValue(i.km>=dep.km,422,'Le compteur de retour doit être supérieur ou égal au départ.');i.distance=i.km-dep.km;}
    if(action==='finalize'){requireValue(views.every(v=>i.photos.some(p=>p.view===v))&&body.confirm===true,422,'Les huit vues et votre confirmation sont nécessaires.');i.finalized=true;i.finalizedAt=now();i.actor=actor.id;}
  }else requireValue(false,404,'Action inconnue.');
  audit(db,actor,`inspection.${action}`,i.id);return i;
}
