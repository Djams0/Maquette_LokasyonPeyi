import {api} from '../http.js';
import {ownerRequestReturn} from './owner-state.js';
import {escape,icon,link,notice,empty,badge,statuses,money,date,field,select,kv,bindForm,flash,modal,errorSlot,shellLoading} from '/ui/components.js';
import {parseSearch} from './search-state.js';
import {bookingDraft,localRentalDate,requestVehicleURL,rentalNext,rentalProgress,rentalTitles,departureReady,returnReady} from './booking-state.js';
import {vehicleMedia,bindVehicleMedia} from './vehicle-media.js';
import {vehiclePresentation,vehicleEstimate} from './vehicle-presentation.js';

const storageRead=key=>{try{return sessionStorage.getItem(key);}catch{return null;}};
const knownMoney=(value,format=money)=>typeof value==='number'&&Number.isFinite(value)&&value>=0?format(value):'Montant non disponible';
function bookingPhoto(v,sizes,m=vehicleMedia(v)) {
 return `<img class="vehicle-image" data-vehicle-image data-photo="${m.photo}" data-vehicle-name="${escape(v.name)}" data-fallback="${m.fallback}" src="${m.src}" ${m.srcset?`srcset="${m.srcset}" sizes="${sizes}"`:''} width="${m.width}" height="${m.height}" alt="${escape(m.alt)}">`;
}
function vehicleSummary(v,href) {
 const m=vehicleMedia(v);
 return `<article class="card catalogue-media booking-vehicle">${bookingPhoto(v,'96px',m)}<div><h2>${escape(v.name)}</h2>${v.city?`<p>${escape(v.city)}</p>`:''}<span class="media-label">${m.photo?'Photo de démonstration':'Illustration fictive'}</span>${link(href,'Fiche véhicule','link-button')}</div></article>`;
}
function actionMarkup(action) {
 if(!action)return '';
 if(action.kind==='link')return link(action.path,action.label);
 const attrs=action.kind==='transition'?`data-transition="${action.key}"`:action.kind==='deposit'?`data-deposit="${action.key}"`:`id="${action.key}"`;
 return `<button type="button" ${attrs}>${escape(action.label)}</button>`;
}
const reauthenticate=path=>{location.href='/login?next='+encodeURIComponent(path);};

const rentalTabs = {
 upcoming: {label:'À venir', statuses:['requested','awaiting_payment','confirmed'], empty:'Aucune location à venir', hint:'Trouvez un véhicule pour préparer votre prochain trajet.'},
 active: {label:'En cours', statuses:['in_progress','return_reported','returned'], empty:'Aucune location en cours', hint:'Les locations en cours apparaissent ici après la remise du véhicule.'},
 history: {label:'Historique', statuses:['completed','declined','withdrawn'], empty:'Votre historique est vide', hint:'Les locations clôturées et les demandes refusées ou retirées apparaissent ici.'},
};
const rentalTab = value => Object.hasOwn(rentalTabs,value) ? value : 'upcoming';
const requestUncertain = 'Résultat non confirmé. Vérifiez vos locations ou réessayez avec la même période.';
const draftStorage = 'rental-draft';
const rentalMoney = new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',minimumFractionDigits:0,maximumFractionDigits:2}).format;

function rentalTime(value) {
 return `<time datetime="${escape(value)}">${escape(date(value))}</time>`;
}
function requestEstimate(estimate) {
 return `<h2>Estimation fictive</h2>
   ${estimate ? `<dl>${kv('Tarif journalier',rentalMoney(estimate.daily)+' / jour')}${kv('Durée',estimate.days+(estimate.days===1?' jour':' jours'))}${kv('Total estimé','<strong>'+rentalMoney(estimate.total)+'</strong>')}</dl>
     <p class="booking-meta">Durée calculée par tranches de 24 heures arrondies à l’unité supérieure.</p>` : '<p>Montant à confirmer.</p>'}
   <p class="booking-meta">Frais non définis, conditions d’assurance à valider. Caution séparée, montant non défini.</p>`;
}
function readRequestAttempt(storageKey,id) {
 const raw = sessionStorage.getItem(storageKey);
 if (!raw) return null;
 const attempt = JSON.parse(raw);
 const draft = bookingDraft(JSON.parse(attempt.signature),id,new Date(0));
 if (!draft.payload || JSON.stringify(draft.payload)!==attempt.signature ||
     typeof attempt.key!=='string' || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/.test(attempt.key)) {
   throw Error('La tentative enregistrée ne peut pas être vérifiée.');
 }
 return {...attempt, payload:draft.payload};
}
function clearRequestStorage(key) {
 try {sessionStorage.removeItem(key);} catch {/* Keep the stored key if removal is unavailable. */}
}

export async function requestPage(id,me) {
 const main = document.getElementById('main'), route = '/request/'+encodeURIComponent(id);
 const v = await api('/vehicles/'+encodeURIComponent(id));
 const attemptName = 'rental-attempt:'+me.id+':'+id;
 const owned = me.id===v.ownerId, condition = vehiclePresentation(v).condition;

 function render() {
   let stored, attempt, storageUnavailable = false;
   try {stored = JSON.parse(storageRead(draftStorage));} catch {/* A malformed draft requires an explicit correction. */}
   try {attempt = readRequestAttempt(attemptName,id);} catch {storageUnavailable = true;}
   const draft = bookingDraft(attempt?.payload || stored,id);
   const displayedPeriod = attempt?.payload || draft.payload;
   const context = storageRead('rental-search-context');
   const back = requestVehicleURL(id,displayedPeriod,attempt?.context ?? context);
   const estimate = displayedPeriod ? vehicleEstimate(v.price,localRentalDate(displayedPeriod.start),localRentalDate(displayedPeriod.end)) : null;
   const blocked = owned
     ? notice('Vous êtes propriétaire de cette annonce. Les demandes concernent les véhicules d’un autre compte.','warning')+link('/owner/vehicles/'+encodeURIComponent(id),'Gérer mon annonce','secondary')
     : me.eligibility!=='verified'
       ? notice('Votre vérification fictive est à compléter avant l’envoi.','warning')+link('/profile/documents','Voir mes documents','secondary')
       : storageUnavailable
         ? notice('La tentative locale ne peut pas être vérifiée. Consultez vos locations avant de reprendre.','warning')
         : '';
   const canSend = draft.payload && estimate && !blocked;
   main.innerHTML = `<div class="client-operational rental-surface request-surface">
     <a class="booking-back" href="${escape(back)}">${icon('back')} Retour à la fiche</a>
     <header class="booking-heading"><h1>Votre demande de location</h1><p>Vérifiez le véhicule et la période avant d’envoyer la demande au propriétaire.</p></header>
     <div class="request-layout">
       <div class="request-summary stack">
         ${vehicleSummary(v,back)}
         <section class="card booking-period"><h2>Votre période</h2>
           ${displayedPeriod ? `<dl class="request-dates"><div><dt>Départ</dt><dd>${rentalTime(displayedPeriod.start)}</dd></div><div><dt>Retour</dt><dd>${rentalTime(displayedPeriod.end)}</dd></div></dl>
           <p class="booking-meta">Heure de Guadeloupe</p>` : ''}
           ${draft.error ? notice(escape(draft.error),'warning') : ''}
           ${attempt ? '' : '<button type="button" class="secondary" id="edit-booking">Modifier la période</button>'}
         </section>
         ${v.city ? notice('<strong>Commune de remise</strong><p>'+escape(v.city)+'</p>') : ''}
       </div>
       <aside class="card booking-aside request-estimate">${requestEstimate(estimate)}
         <h3>Après l’envoi</h3><p>Le propriétaire doit accepter la demande. Aucun paiement ni blocage de caution à cette étape.</p>
       </aside>
       <section class="card request-confirmation" aria-labelledby="request-confirmation-title">
         <h2 id="request-confirmation-title">Confirmation de la demande</h2>
         <p id="request-uncertain" role="status" ${attempt?'':'hidden'}>${requestUncertain}</p>
         ${blocked}
         ${draft.payload&&!estimate ? notice('Tarif indisponible. Vérifiez l’annonce avant de reprendre.','warning') : ''}
         ${canSend ? `<form id="request-form">
           <label class="check"><input type="checkbox" name="rules" required>J’ai lu les règles du véhicule et compris le caractère fictif de la demande.</label>
           ${errorSlot}
           <button type="submit">Envoyer ma demande</button>
         </form>` : !draft.payload&&!attempt ? link(back,'Choisir une période sur la fiche','secondary') : ''}
         <p id="request-status" class="booking-meta" role="status" aria-atomic="true"></p>
         <p class="request-links">${link('/rentals','Consulter mes demandes','link-button')}${link('/assistance','Besoin d’aide ?','link-button')}</p>
       </section>
       <details class="card request-rules"><summary>Annonce et règles du véhicule</summary>
         <p>Version de l’annonce ${escape(v.version??'non fournie')}.</p>
         ${condition ? `<p>${escape(condition.version)}. Exemple de démonstration.</p>${link(back+'#condition-title','Voir l’état déclaré fictif','link-button')}` : '<p>État non renseigné.</p>'}
         <p>${v.rules?.smoking?'Tabac admis':'Non-fumeur'} · ${v.rules?.pets?'Animaux admis':'Animaux non admis'}</p>
         ${link(back,'Relire les règles du véhicule','link-button')}
       </details>
     </div>
   </div>`;
   bindVehicleMedia(main);
   const edit = main.querySelector('#edit-booking');
   edit?.addEventListener('click',()=>{
     const rawDates = bookingDraft(stored,id,new Date(0)).payload;
     const dialog = modal('Modifier la période',
       field('Départ · heure Guadeloupe','start',localRentalDate(rawDates?.start),'datetime-local','required')+
       field('Retour · heure Guadeloupe','end',localRentalDate(rawDates?.end),'datetime-local','required')+
       '<p>Les dates restent dans le brouillon de ce véhicule.</p>',values=>{
       const state = parseSearch(new URLSearchParams({from:values.start,until:values.end}));
       if (state.errors.length) throw Error(state.errors[0]);
       const payload = {vehicleId:id,start:new Date(values.start+':00-04:00').toISOString(),end:new Date(values.end+':00-04:00').toISOString()};
       try {sessionStorage.setItem(draftStorage,JSON.stringify(payload));}
       catch {throw Error('Le brouillon local est indisponible. La période n’a pas été enregistrée.');}
       dialog.close();
       render();
       main.querySelector('#edit-booking')?.focus();
     });
     dialog.classList.add('request-period-dialog');
     dialog.querySelector('[type=submit]').textContent = 'Appliquer la période';
   });
   if (!canSend) return;
   const status = main.querySelector('#request-status'), uncertain = main.querySelector('#request-uncertain');
   bindForm('request-form',async()=>{
     const payload = bookingDraft(draft.payload,id).payload;
     if (!payload) throw Error('Cette période est passée. Modifiez explicitement les dates ou consultez vos demandes.');
     status.textContent = attempt ? 'Vérification de la tentative en cours.' : 'Envoi de la demande en cours.';
     if (edit) edit.disabled = true;
     try {
       const identity = attempt ? (await api('/bootstrap')).me : await api('/me');
       if (!identity) {reauthenticate(route);return;}
       if (identity.id!==me.id || identity.eligibility!==me.eligibility) {location.reload();return;}
       const signature = JSON.stringify(payload);
       if (!attempt) {
         const key = crypto.randomUUID();
         try {sessionStorage.setItem(attemptName,JSON.stringify({signature,key,context}));}
         catch {throw Error('Impossible d’enregistrer la tentative sur cet appareil. Réessayez après avoir rétabli le stockage local.');}
         attempt = {signature,key,context};
       }
       try {
         // The bootstrap has no idempotency key to correlate a row. Only the response to this key identifies the write.
         const r = await api('/rentals',payload,'POST',attempt.key);
         if (!r?.id || typeof r.id!=='string' || r.renterId!==me.id || r.vehicleId!==id ||
             r.start!==payload.start || r.end!==payload.end || r.status!=='requested') throw Error(requestUncertain);
         if (storageRead(draftStorage)===signature) clearRequestStorage(draftStorage);
         clearRequestStorage(attemptName);
         try {flash('Demande envoyée au propriétaire.');} catch {/* Confirmation comes from the API. */}
         location.replace('/rental/'+encodeURIComponent(r.id));
       } catch (error) {
         if ([403,404,409,422].includes(error.status) && !error.message.startsWith('Clé déjà utilisée')) {
           clearRequestStorage(attemptName);
           attempt = null;
           uncertain.hidden = true;
           throw Error(error.message+' Le brouillon reste disponible.');
         }
         if (error.status===401) throw error;
         uncertain.hidden = true;
         throw Error(requestUncertain);
       }
     } catch (error) {
       if (error.status===401) {reauthenticate(route);return;}
       throw error;
     } finally {
       status.textContent = '';
       if (edit) edit.disabled = Boolean(attempt);
     }
   });
 }
 render();
}

export async function rentals(me) {
 const main = document.getElementById('main'), tab = rentalTab(new URLSearchParams(location.search).get('tab')), section = rentalTabs[tab];
 main.innerHTML = `<div class="client-operational rental-surface">
   <header class="booking-heading"><h1>Mes locations</h1><p>Les horaires sont affichés en heure de Guadeloupe.</p></header>
   <nav class="rental-tabs" aria-label="Rubriques des locations">${Object.entries(rentalTabs).map(([key,item])=>
     `<a class="button secondary" href="?tab=${key}" ${tab===key?'aria-current="page"':''}>${item.label}</a>`).join('')}</nav>
   <div id="rental-list">${shellLoading}</div>
 </div>`;
 const list = main.querySelector('#rental-list');
 async function load(focus) {
   list.innerHTML = shellLoading;
   try {
     const data = await api('/bootstrap');
     if (data.me?.id!==me.id) {location.reload();return;}
     const items = data.rentals.filter(r=>r.renterId===me.id&&section.statuses.includes(r.status));
     const vehicles = new Map(data.vehicles.map(v=>[v.id,v]));
     list.innerHTML = items.length ? `<ul class="rental-cards">${items.map(r=>{
       const vehicle = vehicles.get(r.vehicleId), next = rentalNext(r,me.id);
       const detail = '/rental/'+encodeURIComponent(r.id)+'?tab='+tab;
       const payment = next.primary?.kind==='link'&&next.primary.path.startsWith('/payment/');
       const label = payment ? next.primary.label : r.status==='requested' ? 'Suivre la demande' : 'Voir le détail';
       return `<li><article class="card booking-list-card">
         <div class="rental-card-trip">
           ${bookingPhoto(vehicle || {id:r.vehicleId,name:r.vehicleName},'112px')}
           <div><h2>${escape(r.vehicleName)}</h2>${vehicle?.city?'<p>'+escape(vehicle.city)+'</p>':''}
           <dl class="rental-card-dates"><div><dt>Départ</dt><dd>${rentalTime(r.start)}</dd></div><div><dt>Retour</dt><dd>${rentalTime(r.end)}</dd></div></dl></div>
         </div>
         <div class="rental-card-next">${badge(r.status)}
           ${next.actor===statuses[r.status] ? '' : `<p><strong>${escape(next.actor)}</strong></p>`}<p>${escape(next.description)}</p>
         </div>
         <div class="rental-card-action">
           <strong>${knownMoney(r.quote?.total,rentalMoney)}</strong><p class="booking-meta">Montant simulé · caution séparée</p>
           ${link(payment?next.primary.path:detail,label,payment?'':'secondary')}
           <span class="booking-meta">Réf. ${escape(r.id)}</span>
         </div>
       </article></li>`;
     }).join('')}</ul>` : empty(section.empty,section.hint,link('/search','Trouver une voiture'));
     bindVehicleMedia(list);
   } catch (error) {
     if (error.status===401) {reauthenticate(location.pathname+location.search);return;}
     list.innerHTML = `<div class="card rental-list-error"><h2>Locations indisponibles</h2>
       <div role="alert">${notice(escape(error.message),'error')}</div>
       <button type="button" class="secondary">Réessayer</button></div>`;
     const retry = list.querySelector('button');
     retry.onclick = ()=>load(true);
     if (focus) retry.focus();
   }
   list.querySelector('h2')?.setAttribute('tabindex','-1');
   if (focus&&!list.querySelector('.rental-list-error')) list.querySelector('h2')?.focus();
 }
 await load(false);
}

const meetingStates = ['confirmed','in_progress','return_reported','returned','completed'];
const refusalReasons = [['unavailable','Indisponibilité'],['maintenance','Entretien'],['other','Autre motif opérationnel']];
const refreshMessage = 'Actualisez le statut avant de reprendre une action.';
const recoveryMessage = 'Résultat non confirmé. Vérifiez le statut de la location avant de réessayer.';
const statusLabel = value => Object.hasOwn(statuses,value) ? badge(value) : 'État à vérifier';

function quotePanel(quote) {
 return `<section class="card follow-quote">
   <h2>Devis simulé</h2>
   <dl>${kv('Tarif journalier',Number.isFinite(quote?.daily)?rentalMoney(quote.daily)+' / jour':'Montant non disponible')}
     ${kv('Durée',Number.isFinite(quote?.days)?escape(quote.days)+(quote.days===1?' jour':' jours'):'Durée non disponible')}
     ${kv('Total fictif','<strong>'+knownMoney(quote?.total,rentalMoney)+'</strong>')}
     ${kv('Caution séparée',quote?.depositAmount==null?'Montant non défini':knownMoney(quote.depositAmount,rentalMoney))}</dl>
   <p class="booking-meta">${escape(quote?.fees?'Frais · '+quote.fees:'Frais non définis')}. ${escape(quote?.insurance||'Conditions d’assurance à valider')}.</p>
 </section>`;
}

function progression(r) {
 const steps = rentalProgress(r.status);
 const past = steps.filter(step=>step.done&&!step.current);
 const remaining = steps.slice(past.length);
 const outcome = r.status==='completed'?'Parcours terminé':['declined','withdrawn'].includes(r.status)?'Parcours arrêté':'Étape actuelle';
 const item = step => `<li class="${step.done?'done':''} ${step.current?'current':''}"${step.current?' aria-current="step"':''}>${escape(step.label)}
   <span class="booking-step-state">${step.current?outcome:step.done?'Réalisé':'À venir'}</span></li>`;
 return `<section class="card follow-progress" aria-labelledby="follow-progress-title"><h2 id="follow-progress-title">Votre progression</h2>
   ${past.length?`<details class="follow-past" ${matchMedia('(min-width:768px)').matches?'open':''}>
     <summary>Étapes précédentes (${past.length})</summary>
     <ol class="timeline" aria-label="Jalons précédents">${past.map(item).join('')}</ol>
   </details>`:''}
   <ol class="timeline" aria-label="Jalons du suivi" start="${past.length+1}">${remaining.map(item).join('')}</ol>
 </section>`;
}

function rentalActivity(r) {
 const actions = {accept:'Acceptation de la demande',decline:'Refus de la demande',withdraw:'Retrait de la demande',
  pay:'Simulation du paiement',deposit:'Contrôle simulé de caution',handover:'Remise du véhicule',
  report_return:'Déclaration du retour',verify_return:'Confirmation de la récupération',complete:'Clôture'};
 if (!r.history?.length) return '';
 return `<details class="card follow-history"><summary>Historique des opérations</summary><ul>
   ${r.history.toReversed().map(event=>`<li><strong>${escape(actions[event.action]||'Mise à jour')}</strong> ·
     ${event.actor===r.ownerId?'Propriétaire':event.actor===r.renterId?'Locataire':'Acteur non renseigné'} · ${rentalTime(event.at)}</li>`).join('')}
 </ul></details>`;
}

async function activeRentalIdentity(me) {
 const current = await api('/me');
 if (!current) {
   reauthenticate(location.pathname+location.search);
   return false;
 }
 if (current.id!==me.id) {
   location.reload();
   return false;
 }
 return true;
}

const rentalActionStorage = (r,me) => 'rental-transition:'+me.id+':'+r.id;

function readRentalAction(storage) {
 try {
   const saved = JSON.parse(sessionStorage.getItem(storage));
   if (saved && (!Number.isSafeInteger(saved.version) || typeof saved.match!=='string' ||
       typeof saved.key!=='string' || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/.test(saved.key))) throw Error();
   return saved;
 } catch {
   throw Error('La tentative enregistrée ne peut pas être vérifiée. Consultez le statut de la location.');
 }
}

function pendingRentalValues(r,me,action) {
 try {
   const saved = readRentalAction(rentalActionStorage(r,me));
   if (saved?.version===r.version) {
     const attempt = JSON.parse(saved.match);
     if (attempt.action===action) return attempt.body;
   }
 } catch {/* The submission handles invalid stored attempts. */}
 return null;
}

async function postRentalAction(r,me,action,body={}) {
 if (!await activeRentalIdentity(me)) return null;
 const storage = rentalActionStorage(r,me);
 const match = JSON.stringify({action,body});
 const saved = readRentalAction(storage);
 if (saved?.version>r.version || (saved?.version===r.version && saved.match!==match)) {
   throw Error('Une autre action reste à vérifier pour cette location. Actualisez le statut avant de reprendre.');
 }
 const key = saved?.version===r.version?saved.key:crypto.randomUUID();
 try {sessionStorage.setItem(storage,JSON.stringify({key,version:r.version,match}));}
 catch {throw Error('Le stockage local est indisponible. L’action n’a pas été envoyée.');}
 try {
   const result = await api('/rentals/'+encodeURIComponent(r.id)+'/'+action,body,'POST',key);
   const event = result?.history?.at(-1);
   if (result?.id!==r.id || !(result.version>r.version) || event?.action!==action || event.actor!==me.id) {
     throw Error(recoveryMessage);
   }
   clearRequestStorage(storage);
   return result;
 } catch (error) {
   if ([404,409,422].includes(error.status) && !error.message.startsWith('Clé déjà utilisée')) clearRequestStorage(storage);
   throw error;
 }
}

function exitOnRentalAccess(error) {
 if (error.status===401) {
   reauthenticate(location.pathname+location.search);
   return true;
 }
 if (error.status===403) {
   location.reload();
   return true;
 }
 return false;
}

export async function rental(id,me) {
 const urlId = encodeURIComponent(id), r = await api('/rentals/'+urlId), main = document.getElementById('main');
 const owner = r.ownerId===me.id, known = Object.hasOwn(rentalTitles,r.status);
 const next = rentalNext(known?r:{...r,status:''},me.id);
 const vehicleBack = requestVehicleURL(r.vehicleId,r,null);
 const params = new URLSearchParams(location.search);
 const fromTab = params.get('tab');
 const listBack = Object.hasOwn(rentalTabs,fromTab) ? '/rentals?tab='+fromTab : '/rentals';
 const paid = r.payment==='simulated_paid';
 let decision = '', secondary = '';
 if (r.status==='requested') decision = owner?'<button type="button" class="secondary" id="decline">Refuser</button>':'<button type="button" class="secondary" id="withdraw">Retirer ma demande</button>';
 if (r.status==='confirmed') {
   if (!next.primary?.path?.endsWith('/departure')) secondary += link('/inspection/'+urlId+'/departure','État des lieux de départ','secondary');
   if (!owner) secondary += '<button type="button" class="secondary" data-deposit="failure">Simuler un échec de caution</button>';
 }
 if (r.status==='in_progress') {
   if (!next.primary?.path?.endsWith('/return')) secondary += link('/inspection/'+urlId+'/return','État des lieux de retour','secondary');
   secondary += link('/cases/new?rental='+urlId+'&kind=Prolongation','Demander une prolongation','secondary');
 }
 if (r.status==='return_reported'&&!owner) secondary += link('/cases/new?rental='+urlId+'&kind='+encodeURIComponent('Retour non confirmé'),'Retour non confirmé ? Contacter le support','secondary');
 if (r.status==='completed'&&!owner) secondary += link('/review/'+urlId,'Laisser un avis','secondary');
 const conditions = r.status==='confirmed'?kv('Paiement fictif',paid?'Confirmé':'À vérifier')+
   kv('Caution',statusLabel(r.deposit))+kv('Constat de départ',departureReady(r)?'Finalisé':'À finaliser'):
   r.status==='in_progress'?kv('Constat de retour',returnReady(r)?'Finalisé':'À finaliser'):'';
 const reason = r.status==='declined'?refusalReasons.find(([value])=>value===r.reason)?.[1]:'';
 main.innerHTML = `<div class="client-operational rental-surface follow-surface">
   <a class="booking-back" href="${owner?ownerRequestReturn(params.get('ownerTab')):listBack}">${icon('back')} ${owner?'Mes demandes':'Mes locations'}</a>
   <header class="booking-heading"><h1>${escape(next.title)}</h1>
     <p>${escape(r.vehicleName)} · ${escape(r.id)} · Espace ${owner?'propriétaire':'locataire'}</p>${statuses[r.status]!==next.title?statusLabel(r.status):''}</header>
   <div class="follow-layout">
     <div class="follow-column">
       <section class="next-action" aria-labelledby="next-action-title">
         <p class="next-action-actor">${escape(next.actor)}</p>
         <h2 id="next-action-title">${next.primary?'Votre prochaine action':'La suite du parcours'}</h2>
         <p>${escape(next.description)}</p>
         ${reason?`<p>Motif · ${escape(reason)}</p>`:''}
         ${conditions?`<dl class="follow-prerequisites">${conditions}</dl>`:''}
         ${next.primary||decision?`<div class="follow-actions">${actionMarkup(next.primary)}${decision}</div>`:''}
         <p id="rental-status" class="follow-live" role="status" aria-atomic="true"></p>
       </section>
       ${progression(r)}
     </div>
     <aside class="follow-column follow-rail" aria-label="Véhicule et conditions">
       ${vehicleSummary({id:r.vehicleId,name:r.vehicleName},vehicleBack)}
       <section class="card"><h2>Période et remise</h2>
         <dl class="request-dates"><div><dt>Départ</dt><dd>${rentalTime(r.start)}</dd></div><div><dt>Retour</dt><dd>${rentalTime(r.end)}</dd></div></dl>
         <p class="booking-meta">Heure de Guadeloupe</p>
         ${r.meeting&&meetingStates.includes(r.status)?notice('<strong>Lieu de remise fictif</strong><p>'+escape(r.meeting)+'</p>'):
         '<p>Le lieu de remise s’affiche après confirmation.</p>'}
         ${secondary?`<div class="follow-actions">${secondary}</div>`:''}
       </section>
       ${quotePanel(r.quote)}
       <section class="card"><h2>Trois suivis distincts</h2>
         <dl>${kv('Location',statusLabel(r.status))}${kv('Paiement fictif',statusLabel(r.payment))}${kv('Caution',statusLabel(r.deposit))}</dl>
         <p class="booking-meta">La caution suit son propre contrôle. La clôture ne règle pas la caution.</p>
       </section>
       ${owner&&r.publicProfile?`<section class="card"><h2>Profil public de la demande</h2>
         <p>${escape(r.renterName)} · membre depuis ${escape(r.publicProfile.memberSince)} · ${escape(r.publicProfile.completed)} locations fictives terminées.</p>
         ${statusLabel(r.publicProfile.eligibility)}
       </section>`:''}
       <section class="card"><h2>Conversation et aide</h2>
         <div id="rental-conversation">${link('/messages','Messagerie','secondary')}</div>
         <div class="follow-actions">${link('/assistance?rental='+urlId,'Assistance','secondary')}${link('/cases/new?rental='+urlId,'Ouvrir une réclamation','secondary')}
           ${['awaiting_payment','confirmed'].includes(r.status)?link('/cases/new?rental='+urlId+'&kind=Annulation','Demander une annulation','danger'):''}</div>
       </section>
       <button type="button" class="secondary" id="refresh">${icon('refresh')}Actualiser le statut</button>
       ${link('/demo','Changer de persona','link-button')}
     </aside>
     <div class="follow-column follow-records">
       ${rentalActivity(r)}
       <section class="card"><h2>Constats enregistrés</h2>
         ${r.inspections?.length?r.inspections.map(i=>`<article class="booking-inspection">
           <h3>${i.phase==='departure'?'Départ':'Retour'} · ${i.finalized?'Finalisé':'Brouillon'}</h3>
           <p class="booking-meta">${i.photos.length}/8 vues · ${escape(i.km??'—')} km · ${escape(i.fuel??'—')} %${i.finalizedAt?' · '+date(i.finalizedAt):''}</p>
           <p>${escape(i.observation||'Aucune observation')}</p>
           ${link('/inspection/'+urlId+'/'+i.phase,'Consulter le constat '+(i.phase==='departure'?'de départ':'de retour'),'secondary')}
         </article>`).join(''):'<p class="muted">Aucun état des lieux pour le moment.</p>'}
         <p class="booking-meta">Les photos sont des éléments du dossier. L’examen d’une réserve relève du dossier d’assistance.</p>
       </section>
     </div>
   </div>
 </div>`;

 const acknowledgement = document.body.querySelector(':scope > .toast');
 if (acknowledgement) main.querySelector('.booking-heading').after(acknowledgement);
 bindVehicleMedia(main);
 const status = main.querySelector('#rental-status');
 const transitions = main.querySelectorAll('[data-transition],[data-deposit],#decline,#withdraw,#handover,#verify-return');
 let pending = false, needsRefresh = false, leaving = false;
 const run = async(action,body)=>{
   if (pending || needsRefresh || leaving) return;
   pending = true;
   status.textContent = 'Action en cours de vérification.';
   transitions.forEach(control=>{control.disabled=true;});
   try {
     const result = await postRentalAction(r,me,action,body);
     leaving = true;
     if (result) {
       flash('Étape enregistrée par l’API.');
       location.reload();
     }
   } catch (error) {
     if (exitOnRentalAccess(error)) {leaving=true;return;}
     needsRefresh = !error.status || error.status===409 || error.status>=500;
     throw error;
   } finally {
     pending = false;
     status.textContent = needsRefresh?'Actualisez le statut pour poursuivre.':'';
     transitions.forEach(control=>{control.disabled=needsRefresh||leaving;});
   }
 };
 const refresh = ()=>location.reload();
 main.querySelector('#refresh').onclick = refresh;
 const recover = dialog => {dialog.querySelector('[data-reread]').onclick=refresh;};
 const recoveryButton = '<button type="button" class="secondary full" data-reread>Actualiser le statut</button>';
 for (const button of main.querySelectorAll('[data-transition],[data-deposit]')) {
   button.onclick = async()=>{
     try {
       if (button.dataset.deposit) await run('deposit',{outcome:button.dataset.deposit});
       else await run(button.dataset.transition);
     } catch (error) {
       const message = error.status&&error.status<500?escape(error.message):recoveryMessage;
       if (!button.disabled) button.focus({preventScroll:true});
       const dialog = modal(error.status&&error.status<500?'Action refusée':'Résultat à vérifier',
         `<p>${message}</p>${needsRefresh?`<p>${refreshMessage}</p>`+recoveryButton:''}`);
       dialog.classList.add('rental-transition-dialog');
       if (needsRefresh) {
         recover(dialog);
         dialog.addEventListener('close',()=>main.querySelector('#refresh').focus(),{once:true});
       }
     }
   };
 }
 function confirm(buttonId,title,content,action,body) {
   main.querySelector('#'+buttonId)?.addEventListener('click',()=>{
     const dialog = modal(title,content+'<p class="follow-live" role="status"></p>'+ `<div hidden data-recovery>${recoveryButton}</div>`,async values=>{
       if (needsRefresh) throw Error(refreshMessage);
       const live = dialog.querySelector('[role=status]');
       live.textContent = 'Action en cours de vérification.';
       dialog.querySelectorAll('[data-close]').forEach(button=>{button.disabled=true;});
       const fields = dialog.querySelectorAll('input, select');
       fields.forEach(field=>{field.disabled=true;});
       try {await run(action,body?.(values));}
       catch (error) {
         if (needsRefresh) dialog.querySelector('[data-recovery]').hidden=false;
         if (!error.status || error.status>=500) throw Error(recoveryMessage);
         throw error;
       } finally {
         live.textContent = '';
         fields.forEach(field=>{field.disabled=false;});
         dialog.querySelectorAll('[data-close]').forEach(button=>{button.disabled=false;});
       }
     });
     dialog.classList.add('rental-transition-dialog');
     dialog.addEventListener('cancel',event=>{if (pending) event.preventDefault();});
     dialog.addEventListener('close',()=>{if (needsRefresh) main.querySelector('#refresh').focus();},{once:true});
     recover(dialog);
   });
 }
 confirm('withdraw','Retirer la demande ?','<p>Aucun débit n’a été effectué. Le propriétaire verra le retrait.</p>','withdraw');
 confirm('decline','Refuser la demande ?',select('Motif opérationnel','reason',refusalReasons,pendingRentalValues(r,me,'decline')?.reason)+'<p>Le refus met fin à cette demande. Aucun débit n’a été effectué.</p>','decline',values=>values);
 confirm('handover','Remise du véhicule','<p>Le contrôle de caution et le constat de départ doivent être finalisés.</p><label class="check"><input name="controls" type="checkbox" required>Je confirme les contrôles pré-départ fictifs et la remise en présence.</label>','handover',values=>({controls:!!values.controls}));
 confirm('verify-return','Récupération du véhicule','<p>Cette confirmation enregistre la récupération des clés. La clôture suit une action distincte.</p><label class="check"><input name="keys" type="checkbox" required>Clés et véhicule récupérés dans la simulation.</label>','verify_return',values=>({keys:!!values.keys}));

 try {
   const conversations = await api('/conversations');
   const c = conversations.find(c=>c.vehicleId===r.vehicleId&&c.participants.includes(r.renterId)&&c.participants.includes(r.ownerId));
   if (c) main.querySelector('#rental-conversation').innerHTML =
     link('/messages?conversation='+encodeURIComponent(c.id),'Ouvrir la conversation du véhicule','secondary')+
     '<p class="booking-meta">Fil du véhicule renvoyé par l’API. L’API ne fournit aucun rattachement à une location précise.</p>';
 } catch {/* Tracking remains available while messages are unavailable. */}
}

export async function payment(id,me) {
 const main = document.getElementById('main'), urlId = encodeURIComponent(id), route = '/rentals/'+urlId;
 function render(r,focus=false) {
   const awaiting = r.status==='awaiting_payment', paid = r.payment==='simulated_paid';
   const refused = awaiting&&r.payment==='failed';
   const allowed = awaiting&&me.id===r.renterId;
   const amount = knownMoney(r.quote?.total,rentalMoney);
   const amountAvailable = Number.isFinite(r.quote?.total)&&r.quote.total>=0;
   main.innerHTML = `<div class="client-operational rental-surface follow-surface payment-surface">
     <a class="booking-back" href="/rental/${urlId}">${icon('back')} Retour au suivi</a>
     <header class="booking-heading"><h1>Paiement de démonstration</h1><p>${escape(r.vehicleName)}</p>${statusLabel(r.status)}</header>
     <div class="follow-layout">
       <section class="card payment-panel">
         <h2 id="payment-state" tabindex="-1">État du paiement</h2>
         ${refused||paid?'':statusLabel(r.payment)}
         ${refused?`<div role="status">${notice('Paiement refusé simulé. La demande reste acceptée. Aucun montant réel débité.','error')}</div>`:''}
         ${paid?`<div role="status">${notice('Paiement fictif confirmé. Le suivi indique la prochaine étape.')}</div>`:''}
         <p>${refused?'':'Aucun montant réel n’est débité. '}Le contrôle de caution reste séparé du paiement.</p>
         ${allowed&&amountAvailable?`<form id="payment-form">
           <fieldset aria-label="Simulation de paiement">
           ${select('Résultat à simuler','outcome',[['success','Paiement réussi'],['failure','Paiement refusé']],pendingRentalValues(r,me,'pay')?.outcome)}
           <label class="check"><input name="confirm" type="checkbox" required>J’ai compris que cette opération est entièrement fictive.</label>
           <p class="payment-total"><strong>${amount}</strong> · paiement fictif</p>
           <button type="submit">Simuler le paiement</button></fieldset>
           ${errorSlot}
         </form>`:allowed?notice('Montant indisponible. Actualisez le statut avant de poursuivre.','warning'):
           '<p>Le locataire peut simuler le paiement lorsque la demande est acceptée et en attente de paiement.</p>'}
         <p class="follow-live" id="payment-status" role="status" aria-atomic="true"></p>
         <button type="button" class="secondary" id="payment-refresh" ${allowed&&amountAvailable?'hidden':''}>Actualiser le statut</button>
       </section>
       <aside class="follow-column follow-rail" aria-label="Devis et période">
         ${quotePanel(r.quote)}
         <section class="card"><h2>Votre période</h2>
           <dl class="request-dates"><div><dt>Départ</dt><dd>${rentalTime(r.start)}</dd></div><div><dt>Retour</dt><dd>${rentalTime(r.end)}</dd></div></dl>
           <p class="booking-meta">Heure de Guadeloupe</p><p>Caution · ${statusLabel(r.deposit)}</p>
         </section>
       </aside>
     </div>
   </div>`;
   if (focus) main.querySelector('#payment-state').focus();
   const status = main.querySelector('#payment-status'), refresh = main.querySelector('#payment-refresh');
   const form = main.querySelector('#payment-form'), fields = form?.querySelector('fieldset');
   let needsRefresh = false, leaving = false;
   refresh.onclick = async()=>{
     refresh.disabled = true;
     status.textContent = 'Lecture du statut en cours.';
     try {
       if (!await activeRentalIdentity(me)) return;
       const current = await api(route);
       if (current.version!==r.version || !form) {render(current,true);return;}
       needsRefresh = false;
       fields.disabled = false;
       form.querySelector('.form-error').replaceChildren();
       refresh.hidden = true;
       status.textContent = 'Statut vérifié. Vous pouvez reprendre la simulation.';
       form.querySelector('[type=submit]').focus();
     } catch (error) {
       if (!exitOnRentalAccess(error)) status.textContent = error.message;
     } finally {refresh.disabled=false;}
   };
   bindForm(form,async values=>{
     if (needsRefresh || leaving) throw Error(refreshMessage);
     fields.disabled = true;
     status.textContent = 'Simulation de paiement en cours.';
     refresh.disabled = true;
     try {
       const result = await postRentalAction(r,me,'pay',{outcome:values.outcome});
       if (!result) {leaving=true;return;}
       if (result.payment==='failed'&&result.status==='awaiting_payment') render(result,true);
       else if (result.payment==='simulated_paid'&&result.status==='confirmed') {
         leaving = true;
         flash('Paiement fictif confirmé.');
         location.href = '/rental/'+urlId;
       } else throw Error(recoveryMessage);
     } catch (error) {
       if (exitOnRentalAccess(error)) {leaving=true;return;}
       needsRefresh = !error.status || error.status===409 || error.status>=500;
       refresh.hidden = !needsRefresh;
       if (!error.status || error.status>=500) throw Error(recoveryMessage+' '+error.message);
       throw error;
     } finally {
       fields.disabled = needsRefresh||leaving;
       status.textContent = '';
       refresh.disabled = false;
     }
   });
 }
 render(await api(route));
}
