import { requireValue,text,number,now } from '../errors.mjs';
import { participant,authorize } from '../access.mjs';
import { id,audit,notify } from '../store.mjs';
export function conversation(db,actor,b) {
  const v=db.vehicles.find(v=>v.id===b.vehicleId);requireValue(v,404,'Véhicule introuvable.');requireValue(v.ownerId!==actor.id,422,'Vous êtes propriétaire de ce véhicule.');let c=db.conversations.find(c=>c.vehicleId===v.id&&c.participants.includes(actor.id));
  if(!c){c={id:id('chat'),vehicleId:v.id,title:v.name,participants:[actor.id,v.ownerId],messages:[]};db.conversations.push(c);}return c;
}
export function message(db,actor,c,b) {requireValue(c.participants.includes(actor.id),403,'Conversation privée.');const m={id:id('msg'),author:actor.id,text:text(b.text,1,1500),at:now()};c.messages.push(m);for(const u of c.participants.filter(x=>x!==actor.id))notify(db,u,'Nouveau message',`/messages?conversation=${c.id}`);return m;}
export function review(db,actor,r,b) {participant(actor,r);requireValue(r.renterId===actor.id&&r.status==='completed',409,'L’avis est disponible après clôture.');requireValue(!db.reviews.some(x=>x.rentalId===r.id&&x.authorId===actor.id),409,'Votre avis a déjà été envoyé.');const item={id:id('rating'),rentalId:r.id,vehicleId:r.vehicleId,ownerId:r.ownerId,authorId:actor.id,vehicleRating:number(b.vehicleRating,1,5),ownerRating:number(b.ownerRating,1,5),comment:text(b.comment,3,1200),status:'pending',at:now()};db.reviews.push(item);audit(db,actor,'review.submit',item.id);return item;}
