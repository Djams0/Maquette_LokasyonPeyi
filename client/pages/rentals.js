import {api} from '../http.js';
import {escape,icon,link,notice,empty,badge,statuses,money,date,field,select,kv,bindForm,flash,modal,errorSlot,shellLoading} from '/ui/components.js';
import {parseSearch} from './search-state.js';
import {bookingDraft,localRentalDate,requestVehicleURL,rentalNext,rentalProgress} from './booking-state.js';
import {vehicleMedia,bindVehicleMedia} from './vehicle-media.js';
import {vehiclePresentation,vehicleEstimate} from './vehicle-presentation.js';

const storageRead=key=>{try{return sessionStorage.getItem(key);}catch{return null;}};
const knownMoney=(value,format=money)=>typeof value==='number'&&Number.isFinite(value)&&value>=0?format(value):'Montant non disponible';
const period=r=>`<strong>${date(r.start)} → ${date(r.end)}</strong><span class="booking-meta">Heure de Guadeloupe</span>`;
function bookingPhoto(v,sizes,m=vehicleMedia(v)) {
 return `<img class="vehicle-image" data-vehicle-image data-photo="${m.photo}" data-vehicle-name="${escape(v.name)}" data-fallback="${m.fallback}" src="${m.src}" ${m.srcset?`srcset="${m.srcset}" sizes="${sizes}"`:''} width="${m.width}" height="${m.height}" alt="${escape(m.alt)}">`;
}
function vehicleSummary(v,href) {
 const m=vehicleMedia(v);
 return `<article class="card catalogue-media booking-vehicle">${bookingPhoto(v,'96px',m)}<div><h2>${escape(v.name)}</h2>${v.city?`<p>${escape(v.city)}</p>`:''}<span class="media-label">${m.photo?'Photo de démonstration':'Illustration fictive'}</span>${link(href,'Fiche véhicule','link-button')}</div></article>`;
}
function amounts(quote,estimate=false) {
 return `<h2>${estimate?'Estimation fictive':'Montants de démonstration'}</h2><dl>${kv('Location',knownMoney(quote?.total))}${Number.isFinite(quote?.daily)&&Number.isFinite(quote?.days)?kv('Unité',escape(quote.days)+' jour(s) × '+money(quote.daily)+'/jour'):''}${kv('Frais / assurance',escape(quote?.fees||'Non définis')+' · '+escape(quote?.insurance||'Conditions à valider'))}${kv('Caution séparée',quote?.depositAmount==null?'Montant non défini':knownMoney(quote.depositAmount))}${!estimate&&quote?.version?kv('Devis simulé',escape(quote.version)):''}</dl><p class="booking-meta">${estimate?'Calcul illustratif par tranches de 24 heures arrondies. Unité commerciale à valider (D-03). Montant indicatif et disponibilité à confirmer avant le paiement.':'Devis simulé enregistré avec la demande. La clôture de la location ne résout pas automatiquement la caution.'}</p>`;
}
function actionMarkup(action) {
 if(!action)return '';
 if(action.kind==='link')return link(action.path,action.label);
 const attrs=action.kind==='transition'?`data-transition="${action.key}"`:action.kind==='deposit'?`data-deposit="${action.key}"`:`id="${action.key}"`;
 return `<button type="button" ${attrs}>${escape(action.label)}</button>`;
}
function configureBar(main) {
 const bar=main.querySelector('.booking-action');if(!bar)return;
 const update=()=>{const active=document.activeElement;if(bar.contains(active))return;const editing=main.contains(active)&&active.matches('input,select,textarea,[contenteditable]');const obscured=main.contains(active)&&active!==main&&active.getBoundingClientRect().bottom>innerHeight-bar.offsetHeight-8;main.classList.toggle('booking-action-in-flow',Boolean(editing||innerHeight<600||window.visualViewport?.scale>1||obscured));};
 document.addEventListener('focusin',update);document.addEventListener('focusout',()=>setTimeout(update,0));window.addEventListener('resize',update);window.visualViewport?.addEventListener('resize',update);
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
         <p class="request-links">${link('/rentals','Consulter mes demandes','link-button')}${link('/assistance','Besoin d’aide ?','link-button')}</p>
       </section>
       <details class="card request-rules"><summary>Annonce et règles du véhicule</summary>
         <p>Version de l’annonce ${escape(v.version??'non fournie')}.</p>
         ${condition ? `<p>${escape(condition.version)}. Exemple de démonstration.</p>${link(back+'#condition-title','Voir l’état déclaré fictif','link-button')}` : '<p>État non renseigné.</p>'}
         <p>${v.rules?.smoking?'Tabac admis':'Non-fumeur'} · ${v.rules?.pets?'Animaux admis':'Animaux non admis'}</p>
         ${link(back,'Relire les règles du véhicule','link-button')}
       </details>
     </div>
     <p id="request-status" class="sr-only" role="status" aria-atomic="true"></p>
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
       dialog.addEventListener('close',()=>{
         render();
         main.querySelector('#edit-booking')?.focus();
       },{once:true});
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
         uncertain.hidden = false;
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

export async function rental(id,me) {
 const r=await api('/rentals/'+encodeURIComponent(id)),owner=r.ownerId===me.id,next=rentalNext(r,me.id),main=document.getElementById('main'),urlId=encodeURIComponent(id),back=requestVehicleURL(r.vehicleId,r,null);let secondary='';
 if(r.status==='requested')secondary=owner?'<button type="button" class="danger" id="decline">Refuser</button>':'<button type="button" class="danger" id="withdraw">Retirer ma demande</button>';
 if(r.status==='confirmed')secondary=(next.primary?.path?.endsWith('/departure')?'':link('/inspection/'+urlId+'/departure','État des lieux de départ','secondary'))+(!owner?'<button type="button" class="secondary" data-deposit="failure">Simuler un échec de caution</button>':'');
 if(r.status==='in_progress')secondary=(next.primary?.path?.endsWith('/return')?'':link('/inspection/'+urlId+'/return','État des lieux de retour','secondary'))+link('/cases/new?rental='+urlId+'&kind=Prolongation','Demander une prolongation','secondary');
 if(r.status==='return_reported'&&!owner)secondary=link('/cases/new?rental='+urlId+'&kind='+encodeURIComponent('Retour non confirmé'),'Retour non confirmé ? Contacter le support','secondary');if(r.status==='completed'&&!owner)secondary=link('/review/'+urlId,'Laisser un avis','secondary');
 const fromTab = new URLSearchParams(location.search).get('tab');
 const listBack = Object.hasOwn(rentalTabs,fromTab) ? '/rentals?tab='+fromTab : '/rentals';
 main.classList.add('booking-main');
 main.innerHTML=`<div class="booking-page"><a class="booking-back" href="${owner?'/owner/requests':listBack}">${icon('back')} ${owner?'Mes demandes':'Mes locations'}</a><header class="booking-heading"><p class="eyebrow">${escape(r.id)} · Espace ${owner?'propriétaire':'locataire'}</p><h1>${escape(next.title)}</h1>${badge(r.status)}</header><div class="booking-layout"><section class="booking-content">${vehicleSummary({id:r.vehicleId,name:r.vehicleName},back)}<section class="next-action" aria-labelledby="next-action-title"><p class="next-action-actor">${escape(next.actor)}</p><h2 id="next-action-title">${next.primary?'Votre prochaine action':'Suivre la prochaine étape'}</h2><p>${escape(next.description)}</p>${next.primary?`<div class="booking-action"><div><strong>${knownMoney(r.quote?.total)}</strong><span class="booking-meta">Devis simulé · caution séparée</span></div>${actionMarkup(next.primary)}</div>`:''}</section><section class="card"><h2>Période et remise</h2>${period(r)}${r.meeting?notice('<strong>Lieu de remise fictif</strong><p>'+escape(r.meeting)+'</p>'):notice('L’adresse de remise sera visible après confirmation.')}${secondary?`<div class="form-actions section booking-secondary">${secondary}</div>`:''}</section><section class="card"><h2>Trois suivis distincts</h2><dl>${kv('Location',badge(r.status))}${kv('Paiement',badge(r.payment))}${kv('Caution',badge(r.deposit))}</dl><p class="booking-meta">Une autorisation fictive de caution n’est ni un débit ni une garantie réelle. Sa résolution reste distincte de la clôture.</p></section>${owner?`<section class="card"><h2>Profil public de la demande</h2><p>${escape(r.renterName)} · membre depuis ${escape(r.publicProfile.memberSince)} · ${escape(r.publicProfile.completed)} locations fictives terminées.</p>${badge(r.publicProfile.eligibility)}<p class="booking-meta section">Aucune pièce brute, naissance, adresse ou note interne n’est transmise au propriétaire.</p></section>`:''}<section class="card"><h2>Constats enregistrés</h2>${r.inspections.length?r.inspections.map(i=>`<article class="booking-inspection"><h3>${i.phase==='departure'?'Départ':'Retour'} · ${i.finalized?'Finalisé':'Brouillon'}</h3><p class="booking-meta">${i.photos.length}/8 vues · ${escape(i.km??'—')} km · ${escape(i.fuel??'—')} %${i.finalizedAt?' · '+date(i.finalizedAt):''}</p><p>${escape(i.observation||'Aucune observation')}</p>${link('/inspection/'+urlId+'/'+i.phase,'Consulter le constat '+(i.phase==='departure'?'de départ':'de retour'),'secondary')}</article>`).join(''):'<p class="muted">Aucun état des lieux pour le moment.</p>'}<p class="booking-meta">Les photos sont des éléments du dossier et ne déterminent pas automatiquement une responsabilité.</p></section><section class="card"><h2>Conversation et aide</h2><div id="rental-conversation">${link('/messages','Messagerie','secondary')}</div><div class="form-actions section">${link('/assistance?rental='+urlId,'Assistance','secondary')}${link('/cases/new?rental='+urlId,'Ouvrir une réclamation','secondary')}${['awaiting_payment','confirmed'].includes(r.status)?link('/cases/new?rental='+urlId+'&kind=Annulation','Demander une annulation','danger'):''}</div></section></section><aside class="booking-aside stack"><section class="card"><h2>Votre progression</h2><ol class="timeline" aria-label="Progression de la location">${rentalProgress(r.status).map(s=>`<li class="${s.done?'done':''} ${s.current?'current':''}" ${s.current?'aria-current="step"':''}>${escape(s.label)}<span class="booking-step-state">${s.current?'Étape actuelle':s.done?'Réalisé':'Non atteint'}</span></li>`).join('')}</ol></section><section class="card">${amounts(r.quote)}</section><button type="button" class="secondary" id="refresh">${icon('refresh')}Actualiser le statut</button><a href="/demo">Changer de persona pour continuer le parcours</a></aside></div></div>`;
 bindVehicleMedia(main);configureBar(main);
 const run=async(action,body={})=>{try{await api('/rentals/'+urlId+'/'+action,body);flash('Étape enregistrée par l’API.');location.reload();}catch(error){if(error.status===401){reauthenticate('/rental/'+urlId);return;}throw error;}};
 const bind=(selector,fn)=>main.querySelectorAll(selector).forEach(el=>{let pending=false;el.onclick=async()=>{if(pending)return;pending=true;el.disabled=true;el.setAttribute('aria-busy','true');try{await fn(el);}catch(error){el.disabled=false;el.focus({preventScroll:true});const d=modal(error.status?'Action refusée':'Résultat à vérifier',`<p>${escape(error.message)}</p><p>Le suivi n’a pas confirmé de nouvel état. Actualisez avant de reprendre une action.</p><button type="button" class="secondary full" data-reload>Actualiser le statut</button>`);d.querySelector('[data-reload]').onclick=()=>location.reload();}finally{pending=false;el.disabled=false;el.removeAttribute('aria-busy');}};});
 bind('[data-transition]',el=>run(el.dataset.transition));bind('[data-deposit]',el=>run('deposit',{outcome:el.dataset.deposit}));main.querySelector('#refresh').onclick=()=>location.reload();
 main.querySelector('#withdraw')?.addEventListener('click',()=>modal('Retirer la demande ?','<p>Aucun débit n’a été effectué. Le propriétaire verra le retrait.</p>',()=>run('withdraw')));
 main.querySelector('#decline')?.addEventListener('click',()=>modal('Refuser la demande ?',`${select('Motif opérationnel','reason',[['unavailable','Indisponibilité'],['maintenance','Entretien'],['other','Autre motif opérationnel']])}<p>Aucun remboursement : aucun débit n’a été initié.</p>`,values=>run('decline',values)));
 main.querySelector('#handover')?.addEventListener('click',()=>modal('Remise du véhicule','<p>Contrôle de caution et constat de départ sont vérifiés par l’API.</p><label class="check"><input name="controls" type="checkbox" required>Je confirme les contrôles pré-départ fictifs et la remise en présence.</label>',values=>run('handover',{controls:!!values.controls})));
 main.querySelector('#verify-return')?.addEventListener('click',()=>modal('Récupération du véhicule','<p>Cette confirmation reste distincte de l’examen d’un dommage et de la caution.</p><label class="check"><input name="keys" type="checkbox" required>Clés et véhicule récupérés dans la simulation.</label>',values=>run('verify_return',{keys:!!values.keys})));
 try{const conversations=await api('/conversations'),c=conversations.find(c=>c.vehicleId===r.vehicleId&&c.participants.includes(r.renterId)&&c.participants.includes(r.ownerId));if(c)main.querySelector('#rental-conversation').innerHTML=link('/messages?conversation='+encodeURIComponent(c.id),'Ouvrir la conversation du véhicule','secondary')+'<p class="booking-meta">Fil du véhicule renvoyé par l’API ; aucun rattachement à une location précise n’est fourni.</p>';}catch{/* Tracking stays usable if conversations are unavailable. */}
}

export async function payment(id,me) {
 const r=await api('/rentals/'+encodeURIComponent(id)),main=document.getElementById('main'),urlId=encodeURIComponent(id),allowed=r.status==='awaiting_payment'&&me.id===r.renterId;main.classList.add('booking-main');
 main.innerHTML=`<div class="booking-page"><a class="booking-back" href="/rental/${urlId}">${icon('back')} Retour au suivi</a><header class="booking-heading"><h1>Paiement de démonstration</h1><p>${escape(r.vehicleName)}</p></header>${notice('Aucune carte à saisir. Aucun prestataire ni fonds réels. Paiement possible uniquement après acceptation.','warning')}<div class="booking-layout section"><section class="booking-content"><article class="card"><h2>Votre période</h2>${period(r)}</article><article class="card"><h2>État du paiement</h2>${badge(r.payment)}${r.payment==='failed'?notice('Paiement refusé simulé. Aucun montant réel débité. Vous pouvez réessayer.','error'):''}<p class="booking-meta">Caution séparée : ${badge(r.deposit)}. Son montant et ses conditions restent distincts du paiement.</p></article></section><aside class="card booking-aside">${amounts(r.quote)}${allowed?`<form id="payment-form">${select('Résultat à simuler','outcome',[['success','Paiement réussi'],['failure','Paiement refusé']])}<label class="check"><input name="confirm" type="checkbox" required>J’ai compris que cette opération est entièrement fictive.</label>${errorSlot}<div class="booking-action"><div><strong>${knownMoney(r.quote?.total)}</strong><span class="booking-meta">Paiement fictif · caution séparée</span></div><button type="submit">Simuler le paiement</button></div></form>`:notice('Le paiement n’est pas disponible pour votre rôle ou dans l’état actuel. Consultez le suivi de la location.')}</aside></div></div>`;
 configureBar(main);bindForm('payment-form',async values=>{try{await api('/rentals/'+urlId+'/pay',{outcome:values.outcome});if(values.outcome==='failure'){flash('Paiement refusé simulé. Aucun montant réel débité. Réessayez.');location.reload();}else location.href='/rental/'+urlId;}catch(error){if(error.status===401){reauthenticate('/payment/'+urlId);return;}throw error;}});
}
