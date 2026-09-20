import { requireValue,text,number,choice,now } from '../errors.mjs';
import { authorize } from '../access.mjs';
import { id,audit } from '../store.mjs';
export function finance(db,actor,action,b) {
  if(action==='propose'){authorize(actor,'finance.propose');requireValue(db.rentals.some(r=>r.id===b.rentalId),422,'Choisissez une location existante.');const f={id:id('financial'),rentalId:b.rentalId,kind:choice(b.kind,['refund','deposit_review','payout_hold']),amount:number(b.amount,0,10000),reason:text(b.reason,5,1000),authorId:actor.id,authorPerson:actor.personId,version:1,status:'pending_approval',at:now(),fictitious:true};db.financeActions.push(f);audit(db,actor,'finance.propose',f.id);return f;}
  const f=db.financeActions.find(x=>x.id===b.id);requireValue(f,404,'Proposition introuvable.');requireValue(f.version===b.version,409,'La proposition a changé. Rechargez-la.');
  if(action==='edit'){authorize(actor,'finance.propose');requireValue(f.authorId===actor.id&&f.status!=='simulated_executed',403,'Seul l’auteur peut modifier avant exécution.');f.amount=number(b.amount,0,10000);f.reason=text(b.reason,5,1000);f.version++;f.status='pending_approval';delete f.approval;}
  else if(action==='approve'){authorize(actor,'finance.approve');requireValue(actor.personId!==f.authorPerson,403,'Une autre personne doit approuver cette version.');requireValue(f.status==='pending_approval',409,'Cette proposition n’attend pas d’approbation.');f.approval={actor:actor.id,person:actor.personId,version:f.version,at:now()};f.status='approved';}
  else if(action==='execute'){authorize(actor,'finance.execute');requireValue(f.status==='approved'&&f.approval?.version===f.version,409,'Validation secondaire requise sur la version actuelle.');const approver=db.users.find(u=>u.id===f.approval.actor);requireValue(approver?.status==='active'&&approver.permissions.includes('finance.approve')&&f.approval.person!==f.authorPerson,403,'Approbation invalide ou habilitation révoquée.');f.status='simulated_executed';f.executor=actor.id;f.executedAt=now();}
  else requireValue(false,404,'Action inconnue.');audit(db,actor,`finance.${action}`,f.id);return f;
}
