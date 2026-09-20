import { requireValue,text,number,choice,now } from '../errors.mjs';
import { authorize } from '../access.mjs';
import { id,audit,notify } from '../store.mjs';
import { dates,overlap,heldStates } from './rentals.mjs';
import { submitDocument } from './documents.mjs';
export function createVehicle(db,actor,b) {
  requireValue(actor.owner,403,'Activez d’abord votre capacité propriétaire.');
  const name=text(b.name,2,80),city=text(b.city,2,80);dates(b.start,b.end);
  requireValue(Number(b.photos)>=5,422,'Ajoutez les cinq vues fictives.');
  requireValue(b.documents===true,422,'Ajoutez les documents synthétiques.');
  const v={id:id('v'),ownerId:actor.id,name,city,plate:text(b.plate,3,20),year:number(b.year,1950,2030),category:choice(b.category,['Citadine','SUV','Utilitaire']),gearbox:choice(b.gearbox,['Manuelle','Automatique']),fuel:choice(b.fuel,['Essence','Diesel','Hybride','Électrique']),seats:number(b.seats,2,9),price:number(b.price,1,1000),description:text(b.description,10,1500),equipment:Array.isArray(b.equipment)?b.equipment.filter(x=>['Climatisation','Bluetooth','Siège enfant','Caméra recul'].includes(x)):[],photos:Number(b.photos),color:'sage',rating:null,rules:{smoking:false,pets:b.pets===true},availability:{start:b.start,end:b.end,blocked:[]},status:'pending',checksPassed:false,assignedTo:['employee','admin'],version:1,submittedAt:now()};
  db.vehicles.push(v);for(const kind of ['Carte grise','Assurance','Contrôle technique'])submitDocument(db,actor,kind,v.id);
  delete db.drafts[actor.id];audit(db,actor,'vehicle.submit',v.id);return v;
}
export function manageVehicle(db,actor,v,action,b) {
  requireValue(v.ownerId===actor.id,403,'Ce véhicule ne vous appartient pas.');
  if(action==='pause'){requireValue(v.status==='published',409,'Seule une annonce publiée peut être mise en pause.');v.status='paused';}
  else if(action==='resume'){requireValue(v.status==='paused'&&v.checksPassed,409,'Revue requise avant remise en ligne.');v.status='published';}
  else if(action==='remove'){requireValue(!db.rentals.some(r=>r.vehicleId===v.id&&heldStates.includes(r.status)),409,'Une location active empêche le retrait.');v.status='withdrawn';}
  else if(action==='edit'){requireValue(v.status!=='withdrawn',409,'Véhicule retiré.');v.description=text(b.description,10,1500);v.price=number(b.price,1,1000);v.name=text(b.name,2,80);}
  else if(action==='block'){dates(b.start,b.end);requireValue(!db.rentals.some(r=>r.vehicleId===v.id&&heldStates.includes(r.status)&&overlap(r,b)),409,'Une location occupe déjà cette période.');v.availability.blocked.push({id:id('block'),start:b.start,end:b.end});}
  else if(action==='unblock'){v.availability.blocked=v.availability.blocked.filter(x=>x.id!==b.id);}
  else requireValue(false,404,'Action inconnue.');v.version++;audit(db,actor,`vehicle.${action}`,v.id);return v;
}
export function moderate(db,actor,v,b) {
  authorize(actor,'listings.review',v);requireValue(actor.id!==v.ownerId,403,'Vous ne pouvez pas modérer votre propre annonce.');requireValue(b.version===v.version,409,'Annonce modifiée : rouvrez le dossier.');
  choice(b.decision,['published','changes_requested','rejected']);v.reason=text(b.reason,3,500);
  if(b.decision==='published'){requireValue(['Carte grise','Assurance','Contrôle technique'].every(kind=>db.documents.some(d=>d.vehicleId===v.id&&d.kind===kind&&d.status==='verified')),422,'Vérifiez les trois justificatifs véhicule.');requireValue(b.coverage===true,422,'Confirmez le contrôle fictif des conditions de location rémunérée.');v.checksPassed=true;}
  v.status=b.decision;v.version++;audit(db,actor,'listing.review',v.id,b.decision);notify(db,v.ownerId,'Décision sur votre annonce',`/owner/vehicles/${v.id}`);return v;
}
