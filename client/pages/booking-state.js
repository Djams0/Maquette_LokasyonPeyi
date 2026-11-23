import {parseSearch,localDate,dateParam,vehicleURL} from './search-state.js';

export const rentalTitles={requested:'Demande envoyée',awaiting_payment:'Votre demande a été acceptée',confirmed:'Votre réservation est confirmée',in_progress:'Bonne route au Péyi',return_reported:'Retour déclaré',returned:'Récupération vérifiée',completed:'Location clôturée',declined:'Demande non retenue',withdrawn:'Demande retirée'};
export const localRentalDate=value=>typeof value==='string'&&Number.isFinite(Date.parse(value))?new Date(Date.parse(value)-4*3600000).toISOString().slice(0,16):'';
export function bookingDraft(value,vehicleId,now=new Date()) {
 if(!value||typeof value!=='object'||Array.isArray(value)||value.vehicleId!==vehicleId)return {error:'Aucun brouillon de période pour ce véhicule. Choisissez vos dates sur la fiche.',payload:null};
 const stamp=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00(?:\.000)?(?:Z|-04:00)$/.test(v)&&Boolean(localDate(v.slice(0,16)))&&Number.isFinite(Date.parse(v));
 if(!stamp(value.start)||!stamp(value.end))return {error:'La période du brouillon est invalide. Modifiez explicitement les dates.',payload:null};
 const state=parseSearch(new URLSearchParams({from:localRentalDate(value.start),until:localRentalDate(value.end)}),now);
 if(state.errors.length)return {error:state.errors[0],payload:null};
 return {error:'',payload:{vehicleId,start:new Date(value.start).toISOString(),end:new Date(value.end).toISOString()}};
}
export function requestVehicleURL(id,payload,storedContext) {
 let params=new URLSearchParams();
 try{const record=JSON.parse(storedContext);if(record.vehicleId===id&&typeof record.search==='string'&&record.search.startsWith('/search?')&&!/[\\\u0000-\u001f]/.test(record.search)){const url=new URL(record.search,'https://booking.invalid');const state=parseSearch(url.searchParams,new Date(0));if(url.origin==='https://booking.invalid'&&url.pathname==='/search'&&!state.errors.length)params=state.params;}}catch{/* Invalid local context never becomes a return target. */}
 if(payload){params.set('from',dateParam(localRentalDate(payload.start)));params.set('until',dateParam(localRentalDate(payload.end)));}
 return vehicleURL(id,params);
}
export const departureReady=r=>Boolean(r.inspections?.some(i=>i.phase==='departure'&&i.finalized));
export const returnReady=r=>Boolean(r.inspections?.some(i=>i.phase==='return'&&i.finalized));
export function rentalNext(r,actorId) {
 const owner=actorId===r.ownerId,renter=actorId===r.renterId,role=owner?'Propriétaire':renter?'Locataire':'Accès non autorisé';
 const result={role,title:rentalTitles[r.status]||'État à actualiser',actor:'Statut à vérifier',description:'Actualisez le suivi pour connaître la prochaine action.',primary:null};
 if(!owner&&!renter)return {...result,description:'Seules les parties autorisées peuvent agir sur cette location.'};
 const link=(path,label)=>({kind:'link',path,label}),action=(key,label,kind='transition')=>({kind,key,label});
 switch(r.status){
  case 'requested':return {...result,actor:owner?'À vous d’agir · Propriétaire':'En attente du propriétaire',description:'Le propriétaire peut accepter ou refuser. Aucun paiement ni blocage de caution à ce stade.',primary:owner?action('accept','Accepter la demande'):null};
  case 'awaiting_payment':return {...result,actor:owner?'En attente du locataire':'À vous d’agir · Locataire',description:r.payment==='failed'?'Le paiement simulé a été refusé. La demande reste acceptée, sans confirmation de paiement ; le locataire peut réessayer.':'Le locataire doit simuler le paiement. L’acceptation seule ne confirme pas la réservation.',primary:renter?link('/payment/'+encodeURIComponent(r.id),'Continuer vers le paiement simulé'):null};
  case 'confirmed':
   if(renter&&r.deposit!=='simulated_authorized')return {...result,actor:'À vous d’agir · Locataire',description:r.deposit==='simulated_failed'?'Le contrôle fictif de caution a échoué. Réessayez avant la remise des clés.':'Le paiement est distinct de la caution. Simulez son contrôle avant la remise des clés.',primary:action('success','Simuler le contrôle de caution','deposit')};
   if(!Array.isArray(r.inspections))return {...result,actor:'Parties · Consulter le suivi',description:'Vérifiez les constats et les contrôles dans le suivi avant la remise des clés.',primary:link('/rental/'+encodeURIComponent(r.id),'Consulter le suivi')};
   if(!departureReady(r))return {...result,actor:'Constat de départ à préparer · Parties',description:owner&&r.deposit!=='simulated_authorized'?'Le locataire doit encore contrôler la caution. Vous pouvez préparer le constat de départ.':'Le constat de départ doit être finalisé avant la remise des clés.',primary:link('/inspection/'+encodeURIComponent(r.id)+'/departure','État des lieux de départ')};
   if(owner&&r.deposit==='simulated_authorized')return {...result,actor:'À vous d’agir · Propriétaire',description:'Caution fictive autorisée et constat de départ finalisé. Confirmez les contrôles et la remise en présence.',primary:action('handover','Remettre les clés','dialog')};
   return {...result,actor:owner?'En attente du locataire':'En attente du propriétaire',description:owner?'Le locataire doit terminer le contrôle de caution. La remise reste indisponible.':'Le propriétaire doit confirmer les contrôles et la remise des clés.'};
  case 'in_progress':
   if(!Array.isArray(r.inspections))return {...result,actor:'Parties · Consulter le suivi',description:'Consultez le suivi pour vérifier le constat et la prochaine étape du retour.',primary:link('/rental/'+encodeURIComponent(r.id),'Consulter le suivi')};
   if(!returnReady(r))return {...result,actor:'Constat de retour à préparer · Parties',description:'Préparez et finalisez le constat de retour. La déclaration de retour du locataire vient ensuite.',primary:link('/inspection/'+encodeURIComponent(r.id)+'/return','État des lieux de retour')};
   return {...result,actor:owner?'En attente du locataire':'À vous d’agir · Locataire',description:'Le constat est finalisé. Le locataire peut déclarer le retour ; la récupération des clés devra ensuite être confirmée par le propriétaire.',primary:renter?action('report_return','Déclarer le retour'):null};
  case 'return_reported':return {...result,actor:owner?'À vous d’agir · Propriétaire':'En attente du propriétaire',description:'Le retour a été déclaré. Le propriétaire doit vérifier la récupération effective des clés, distincte de la clôture et de la caution.',primary:owner?action('verify-return','Confirmer la récupération des clés','dialog'):null};
  case 'returned':return {...result,actor:owner?'À vous d’agir · Propriétaire':'En attente du propriétaire',description:'La récupération des clés est confirmée. Le propriétaire doit encore clôturer la location ; la résolution de la caution reste indépendante.',primary:owner?action('complete','Clôturer la location'):null};
  case 'completed':return {...result,actor:'Parcours clôturé · Parties',description:'La location est clôturée. Le reçu fictif, les avis et le suivi d’un éventuel dossier restent accessibles séparément.',primary:link('/receipt/'+encodeURIComponent(r.id),'Reçu fictif / impression PDF')};
  case 'declined':return {...result,actor:'Demande refusée par le propriétaire',description:'Aucun paiement n’a été initié. Le locataire peut chercher un autre véhicule.',primary:renter?link('/search','Trouver une autre voiture'):null};
  case 'withdrawn':return {...result,actor:'Demande retirée par le locataire',description:'Le retrait est enregistré avant acceptation. Aucun paiement n’a été initié.',primary:renter?link('/search','Trouver une autre voiture'):null};
  default:return result;
 }
}
export function rentalProgress(status) {
 if(['declined','withdrawn'].includes(status))return [{key:'requested',label:'Demande envoyée',done:true,current:false},{key:status,label:status==='declined'?'Demande refusée':'Demande retirée',done:true,current:true}];
 const keys=['requested','awaiting_payment','confirmed','in_progress','return_reported','returned','completed'],labels=['Demande envoyée','Acceptation propriétaire','Paiement et confirmation','Remise du véhicule','Retour déclaré','Récupération vérifiée','Clôture'],index=keys.indexOf(status);
 return keys.map((key,i)=>({key,label:labels[i],done:index>=i,current:status===key}));
}
