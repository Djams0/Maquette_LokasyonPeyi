import { randomUUID } from 'node:crypto';
import { requireValue, find, text, choice } from './errors.mjs';
import { signed,can,authorize,publicVehicle,publicRental,participant } from './access.mjs';
import { id,audit } from './store.mjs';
import { request,transition,inspection,available } from './modules/rentals.mjs';
import { submitDocument,reviewDocument } from './modules/documents.mjs';
import { createVehicle,manageVehicle,moderate } from './modules/vehicles.mjs';
import { createCase,visibleCase,updateCase } from './modules/cases.mjs';
import { finance } from './modules/finance.mjs';
import { conversation,message,review } from './modules/communication.mjs';
export function route({db,actor,path,method,body:b,query:q}) {
  const mut=method!=='GET';const parts=path.split('/').filter(Boolean);const [area,key,action,extra]=parts;
  if(path==='/personas'&&method==='GET')return db.users.filter(u=>q.get('app')==='admin'?u.internal:!u.internal).map(({id,name,internal,status})=>({id,name,internal,status}));
  if(path==='/me'&&method==='GET')return actor||null;
  if(path==='/vehicles'&&method==='GET')return db.vehicles.filter(v=>v.status==='published').filter(v=>(!q.get('q')||`${v.name} ${v.city}`.toLowerCase().includes(q.get('q').toLowerCase()))&&(!q.get('category')||v.category===q.get('category'))&&(!q.get('max')||v.price<=Number(q.get('max')))&&(!q.get('gearbox')||v.gearbox===q.get('gearbox'))&&(!q.get('fuel')||v.fuel===q.get('fuel'))&&(!q.get('seats')||v.seats>=Number(q.get('seats')))&&(!q.get('equipment')||v.equipment.includes(q.get('equipment')))&&(!q.get('start')||!q.get('end')||available(db,v,{start:q.get('start'),end:q.get('end')}))).sort((a,b)=>q.get('sort')==='price'?a.price-b.price:q.get('sort')==='rating'?b.rating-a.rating:0).map(publicVehicle);
  if(area==='vehicles'&&key&&method==='GET'){const v=find(db.vehicles,key);requireValue(v.status==='published'||actor?.id===v.ownerId,404,'Véhicule introuvable.');return {...publicVehicle(v),ownerName:find(db.users,v.ownerId).name,reviews:db.reviews.filter(r=>r.vehicleId===v.id&&r.status==='published')};}
  signed(actor);
  if(path==='/bootstrap'&&method==='GET')return {me:actor,vehicles:db.vehicles.filter(v=>v.status==='published').map(publicVehicle),rentals:db.rentals.filter(r=>[r.renterId,r.ownerId].includes(actor.id)).map(r=>publicRental(r,actor)),owned:db.vehicles.filter(v=>v.ownerId===actor.id),documents:db.documents.filter(d=>d.userId===actor.id),notifications:db.notifications.filter(n=>n.userId===actor.id),reviews:db.reviews.filter(r=>r.authorId===actor.id||r.ownerId===actor.id),version:db.version};
  if(path==='/owner/onboarding'&&mut){requireValue(!actor.internal,403,'Compte client requis.');requireValue(b.confirm===true,422,'Confirmez le scénario fictif.');actor.owner=true;actor.payoutProfile='simulated';return actor;}
  if(path==='/owner/draft'){if(!mut)return db.drafts[actor.id]||{};requireValue(!actor.internal,403,'Compte client requis.');db.drafts[actor.id]=b;return b;}
  if(path==='/owner/vehicles'&&mut)return createVehicle(db,actor,b);
  if(area==='owner'&&key==='vehicles'&&action&&mut)return manageVehicle(db,actor,find(db.vehicles,action),extra,b);
  if(path==='/documents'&&mut){if(b.vehicleId)requireValue(find(db.vehicles,b.vehicleId).ownerId===actor.id,403,'Véhicule privé.');return submitDocument(db,actor,b.kind,b.vehicleId);}
  if(path==='/rentals'&&mut)return request(db,actor,b);
  if(area==='rentals'&&key){const r=find(db.rentals,key);participant(actor,r);if(!mut)return{...publicRental(r,actor),inspections:db.inspections.filter(i=>i.rentalId===r.id)};if(action==='inspection')return inspection(db,actor,r,b.phase,b.action,b);if(action==='review')return review(db,actor,r,b);return transition(db,actor,r,action,b);}
  if(area==='conversations'){if(!key){if(!mut)return db.conversations.filter(c=>c.participants.includes(actor.id));return conversation(db,actor,b);}return message(db,actor,find(db.conversations,key),b);}
  if(area==='notifications'&&mut){for(const n of db.notifications.filter(n=>n.userId===actor.id))n.read=true;return {ok:true};}
  if(area==='reviews'&&key&&mut){const r=find(db.reviews,key);requireValue(r.ownerId===actor.id,403,'Avis privé.');r.reply=text(b.reply,3,1000);return r;}
  if(area==='cases'){if(!key){if(!mut)return db.cases.filter(c=>c.participants.includes(actor.id)).map(c=>visibleCase(c,actor));return createCase(db,actor,b);}const c=find(db.cases,key);return mut?updateCase(db,actor,c,b):visibleCase(c,actor);}
  if(area==='admin')return adminRoute(db,actor,key,action,extra,b,mut,q);
  requireValue(false,404,'Route API introuvable.');
}
function adminRoute(db,a,key,resource,action,b,mut,q) {
  requireValue(a.internal,403,'Compte interne requis.');
  const scoped=(items,p)=>can(a,p)?items.filter(x=>!x.assignedTo||x.assignedTo.includes(a.id)):[];
  if(key==='dashboard'){authorize(a,'dashboard.read');const docs=scoped(db.documents,'documents.review'),vs=scoped(db.vehicles,'listings.review'),cs=scoped(db.cases,'cases.read').filter(c=>!c.sensitive||can(a,'cases.sensitive'));return{pendingDocuments:docs.filter(d=>d.status==='pending').length,pendingListings:vs.filter(v=>v.status==='pending').length,openCases:cs.filter(c=>c.status!=='closed').length,financeActions:can(a,'finance.read')?db.financeActions.length:null,events:db.audit.filter(e=>e.actor===a.id).slice(-8).reverse(),version:db.version};}
  if(key==='moderation'){authorize(a,'listings.review');return{vehicles:scoped(db.vehicles,'listings.review'),documents:scoped(db.documents,'documents.review'),reviews:can(a,'reviews.moderate')?db.reviews:[]};}
  if(key==='documents'){const d=find(db.documents,resource);authorize(a,'documents.read_sensitive',d);requireValue(d.userId!==a.id,403,'Dossier personnel.');if(mut)return reviewDocument(db,a,d,b);audit(db,a,'document.read',d.id);return{...d,reviews:db.documentReviews.filter(r=>r.documentId===d.id),synthetic:true};}
  if(key==='listings'&&mut)return moderate(db,a,find(db.vehicles,resource),b);
  if(key==='reviews'&&mut){authorize(a,'reviews.moderate');const r=find(db.reviews,resource);r.status=choice(b.status,['published','rejected']);r.reason=text(b.reason,3,500);audit(db,a,'review.moderate',r.id);return r;}
  if(key==='users'){authorize(a,'users.read');const allowed=db.users.filter(u=>!u.internal&&(a.id==='admin'||['renter','newcomer','owner'].includes(u.id)));if(!resource)return allowed.map(({id,name,email,status,owner,eligibility})=>({id,name,email,status,owner,eligibility}));const u=find(allowed,resource);if(mut){authorize(a,'users.suspend');u.status=choice(b.status,['active','suspended']);audit(db,a,'user.status',u.id,text(b.reason,3,500));}return{id:u.id,name:u.name,email:u.email,status:u.status,owner:u.owner,eligibility:u.eligibility};}
  if(key==='cases'){authorize(a,'cases.read');if(!resource)return scoped(db.cases,'cases.read').filter(c=>!c.sensitive||can(a,'cases.sensitive'));const c=find(db.cases,resource);if(action==='inspections'&&!mut){visibleCase(c,a);return {inspections:db.inspections.filter(i=>i.rentalId===c.rentalId)};}return mut?updateCase(db,a,c,b):visibleCase(c,a);}
  if(key==='rentals'){authorize(a,'cases.read');return db.rentals.filter(r=>db.cases.some(c=>c.rentalId===r.id&&c.assignedTo.includes(a.id)&&(!c.sensitive||can(a,'cases.sensitive')))).map(r=>({id:r.id,vehicleName:r.vehicleName,status:r.status,start:r.start,end:r.end}));}
  if(key==='payments'){authorize(a,'finance.read');if(mut)return finance(db,a,resource,b);return{actions:db.financeActions,rentals:db.rentals.map(r=>({id:r.id,vehicleName:r.vehicleName,status:r.status,payment:r.payment,deposit:r.deposit,total:r.quote.total}))};}
  if(key==='staff'){
    authorize(a,'staff.manage');
    if(!mut)return{staff:db.users.filter(u=>u.internal).map(({id,name,status,permissions})=>({id,name,status,permissions})),requests:db.staffRequests};
    if(resource==='create'){const u={id:id('staff'),name:text(b.name,3,80),internal:true,status:'active',permissions:['dashboard.read'],personId:randomUUID()};db.users.push(u);audit(db,a,'staff.create',u.id);return u;}
    if(resource==='status'){const u=find(db.users,b.id);requireValue(u.internal&&u.id!==a.id,403,'Impossible de modifier votre propre accès.');requireValue(!['super','super2'].includes(u.id),403,'Les comptes de relève de la démo sont protégés.');u.status=choice(b.status,['active','suspended']);audit(db,a,'staff.status',u.id,text(b.reason,3,500));return u;}
    authorize(a,'permissions.manage');
    if(resource==='propose'){requireValue(b.targetId!==a.id,403,'Pas d’auto-attribution.');requireValue(find(db.users,b.targetId).internal,422,'Compte interne requis.');const r={id:id('permission'),targetId:b.targetId,permission:choice(b.permission,['finance.read','documents.review']),author:a.id,person:a.personId,status:'pending_approval',version:1,reason:text(b.reason,5,500)};db.staffRequests.push(r);audit(db,a,'permission.propose',r.id);return r;}
    if(resource==='approve'){const r=find(db.staffRequests,b.id);requireValue(r.person!==a.personId&&r.targetId!==a.id,403,'Une autre personne habilitée et non bénéficiaire doit approuver.');requireValue(r.version===b.version&&r.status==='pending_approval',409,'Proposition périmée.');const target=find(db.users,r.targetId);if(!target.permissions.includes(r.permission))target.permissions.push(r.permission);r.status='approved';r.approver=a.id;audit(db,a,'permission.approve',r.id);return r;}
  }
  requireValue(false,404,'Route admin introuvable.');
}
