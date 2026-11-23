import {api} from '../http.js';
import {escape,icon,link,notice,field,textarea,select,errorSlot,bindForm,modal,flash,date} from '/ui/components.js';

const views = ['Avant','Arrière','Côté gauche','Côté droit','Intérieur','Compteur','Carburant / charge','Vue générale'];
const framing = [
 'Placez tout l’avant dans le cadre.',
 'Cadrez l’arrière en entier.',
 'Incluez les deux roues du côté gauche.',
 'Incluez les deux roues du côté droit.',
 'Cadrez les sièges et le tableau de bord.',
 'Centrez le kilométrage affiché.',
 'Cadrez la jauge ou le niveau de charge.',
 'Incluez le véhicule en entier.',
];
const retryMessage = 'Vérifiez le constat avant de reprendre une action.';
const unknownResult = 'Résultat non confirmé. '+retryMessage;
const currentInspection = (rental,phase) => rental.inspections.find(item=>item.phase===phase) || {photos:[]};
const capturedViews = item => views.filter(view=>item.photos.some(photo=>photo.view===view));
const cameraButton = (view,replace,featured=false) => `<button type="button" data-view="${escape(view)}"${featured?' data-next-view aria-describedby="inspection-framing"':' class="secondary" aria-label="'+escape((replace?'Remplacer':'Ouvrir la caméra')+' · '+view)+'"'}>${replace?'Remplacer':'Ouvrir la caméra'}</button>`;

function readAttempt(storage) {
 const saved = JSON.parse(sessionStorage.getItem(storage));
 if (saved && (typeof saved.base!=='string' || typeof saved.signature!=='string' ||
     typeof saved.key!=='string' || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/.test(saved.key))) {
   throw Error('La tentative enregistrée ne peut pas être vérifiée.');
 }
 return saved;
}

function clearAttempt(storage) {
 try {sessionStorage.removeItem(storage);} catch {/* The confirmed server state still applies. */}
}

function returnedInspection(result,id,body,actor,previous) {
 if (result?.rentalId!==id || result.phase!==body.phase || !Array.isArray(result.photos)) return false;
 if (body.action==='photo') {
   return result.photos.some(photo=>photo.view===body.view&&photo.origin==='simulated_camera'&&photo.actor===actor&&photo.id&&
     !previous.photos.some(old=>old.id===photo.id));
 }
 return result.km===body.km&&result.fuel===body.fuel&&result.observation===(body.observation||'')&&
   (body.action==='finalize'?result.finalized&&result.actor===actor:!result.finalized);
}

function photoSummary(item,view,editable,next) {
 const photo = item.photos.find(photo=>photo.view===view);
 const prior = item.versions?.filter(photo=>photo.view===view) || [];
 return `<li class="inspection-view">
   <span class="inspection-view-icon">${icon(photo?'check':'camera')}</span>
   <div><strong>${view}</strong>
     <p>${photo?'Version '+escape(photo.version)+' · capture simulée':next===view&&editable?'Prochaine vue':'Vue à capturer'}</p>
     ${photo?.at?`<time datetime="${escape(photo.at)}">${date(photo.at)}</time>`:''}
     ${prior.length?`<details><summary>Versions précédentes (${prior.length})</summary><ul>${prior.map(photo=>
       `<li>Version ${escape(photo.version)} · ${date(photo.at)}</li>`).join('')}</ul></details>`:''}
   </div>
   ${editable&&next!==view?cameraButton(view,Boolean(photo)):''}
 </li>`;
}

export async function inspection(id,phase,me) {
 const main = document.getElementById('main'), urlId = encodeURIComponent(id);
 const back = '/rental/'+urlId;
 if (!['departure','return'].includes(phase)) {
   main.innerHTML = `<div class="client-operational inspection-surface"><section class="card">
     <h1>Phase inconnue</h1><p>Choisissez le constat de départ ou de retour depuis le suivi.</p>${link(back,'Revenir à la location')}
   </section></div>`;
   return;
 }
 const route = '/rentals/'+urlId, storage = 'inspection-attempt:'+me.id+':'+id+':'+phase;
 let rental = await api(route);
 let item = currentInspection(rental,phase), pending = false, needsRefresh = false, leaving = false;
 const title = 'État des lieux '+(phase==='departure'?'de départ':'de retour');
 const editable = () => !item.finalized&&rental.status===(phase==='departure'?'confirmed':'in_progress');
 const readDepartureKm = () => rental.inspections.find(inspection=>inspection.phase==='departure'&&inspection.finalized)?.km;

 function settleAfterRead() {
   try {
     const saved = readAttempt(storage);
     if (!saved || saved.base===JSON.stringify(item)) return;
     const body = JSON.parse(saved.signature), previous = JSON.parse(saved.base);
     if (body.action==='save'&&!['km','fuel','observation'].some(field=>previous[field]!==item[field])) return;
     if (returnedInspection(item,id,body,me.id,previous)) clearAttempt(storage);
   } catch {/* An invalid local record must never authorize a retry. */}
 }

 function updateControls() {
   const blocked = pending||needsRefresh||leaving;
   main.querySelectorAll('[data-view]').forEach(button=>{button.disabled=blocked;});
   const fields = main.querySelector('#inspection-form fieldset');
   if (fields) fields.disabled = blocked;
   const finalize = main.querySelector('#inspection-finalize');
   if (finalize) finalize.disabled = capturedViews(item).length!==views.length;
   const refresh = main.querySelector('#inspection-refresh');
   refresh.hidden = !needsRefresh;
   refresh.disabled = pending;
 }

 function renderViews(focusView) {
   const count = capturedViews(item).length, next = views.find(view=>!item.photos.some(photo=>photo.view===view));
   main.querySelector('#inspection-progress').innerHTML = `<h2 id="inspection-views-title">Vues guidées</h2>
     <p><strong>${count} sur ${views.length}</strong> vues enregistrées</p>
     <progress value="${count}" max="${views.length}" aria-label="Progression des photos"></progress>
     ${editable()&&next?`<div class="inspection-next">
       <h3>Prochaine vue · ${next}</h3>
       <div class="inspection-frame">${icon('camera')}<p id="inspection-framing">${framing[views.indexOf(next)]}</p></div>
       ${cameraButton(next,false,true)}
     </div>`:''}`;
   main.querySelector('#inspection-list').innerHTML = `<h2 id="inspection-list-title">Toutes les vues</h2>
     <ol class="inspection-view-list">${views.map(view=>photoSummary(item,view,editable(),next)).join('')}</ol>`;
   updateControls();
   if (focusView) focusCamera(focusView);
 }

 function focusCamera(focusView) {
   const preferred = focusView==='next'?main.querySelector('[data-next-view]'):
     [...main.querySelectorAll('[data-view]')].find(button=>button.dataset.view===focusView);
   (preferred||main.querySelector('#inspection-form [name=km]')||main.querySelector('#inspection-details-title')).focus();
 }

 function announce(message) {
   main.querySelector('#inspection-status').textContent = message;
 }

 function handleAccess(error) {
   if (error.status===401) {
     leaving = true;
     location.href = '/login?next='+encodeURIComponent(location.pathname+location.search);
     return true;
   }
   if (error.status===403) {
     leaving = true;
     location.reload();
     return true;
   }
   return false;
 }

 async function checkIdentity() {
   const actor = await api('/me');
   if (!actor) {
     handleAccess({status:401});
     return false;
   }
   if (actor.id!==me.id) {
     leaving = true;
     location.reload();
     return false;
   }
   return true;
 }

 async function mutate(values) {
   if (pending||leaving||!editable()) return null;
   if (needsRefresh) throw Error(retryMessage);
   const body = {phase,...values};
   const base = JSON.stringify(item), signature = JSON.stringify(body);
   pending = true;
   updateControls();
   try {
     if (!await checkIdentity()) return null;
     let saved;
     try {saved=readAttempt(storage);} catch {throw Error('La tentative locale ne peut pas être vérifiée.');}
     if (saved && saved.signature!==signature) {
       throw Error('Reprenez la tentative précédente avec la même vue ou la même saisie.');
     }
     const key = saved?saved.key:crypto.randomUUID();
     const previous = saved?JSON.parse(saved.base):item;
     try {sessionStorage.setItem(storage,JSON.stringify({base:saved?.base??base,signature,key}));}
     catch {throw Error('Le stockage local est indisponible. Aucune action envoyée.');}
     let result;
     try {
       result = await api(route+'/inspection',body,'POST',key);
       if (!returnedInspection(result,id,body,me.id,previous)) throw Error(unknownResult);
       if (saved&&saved.base!==base) {
         const wasEditable = editable();
         rental = await api(route);
         item = currentInspection(rental,phase);
         if (wasEditable!==editable()) renderDetails();
       } else item = result;
     } catch (error) {
       if ([404,409,422].includes(error.status)&&!error.message.startsWith('Clé déjà utilisée')) clearAttempt(storage);
       if (handleAccess(error)) return null;
       needsRefresh = !error.status||error.status===409||error.status>=500;
       if (!error.status||error.status>=500) throw Error(unknownResult);
       throw error;
     }
     clearAttempt(storage);
     return result;
   } finally {
     pending = false;
     updateControls();
   }
 }

 async function reread(report=announce) {
   if (pending||leaving) return false;
   pending = true;
   updateControls();
   report('Lecture du constat en cours.');
   try {
     if (!await checkIdentity()) return false;
     const before = JSON.stringify(item);
     const wasEditable = editable();
     rental = await api(route);
     item = currentInspection(rental,phase);
     settleAfterRead();
     needsRefresh = false;
     if (wasEditable!==editable()) renderDetails();
     main.querySelector('#inspection-form .form-error')?.replaceChildren();
     const changed = before!==JSON.stringify(item)||wasEditable!==editable();
     if (changed) renderViews();
     announce(item.finalized?'Finalisation vérifiée.':'Statut du constat relu.');
     return changed;
   } catch (error) {
     if (!handleAccess(error)) report(error.message);
     return false;
   } finally {
     pending = false;
     updateControls();
   }
 }

 main.innerHTML = `<div class="client-operational inspection-surface">
   <a class="booking-back" href="${back}">${icon('back')} Retour à la location</a>
   <header class="inspection-heading">
     <h1>${title}</h1><p>${escape(rental.vehicleName)} · caméra simulée</p>
   </header>
   <p class="inspection-status" id="inspection-status" role="status" aria-atomic="true"></p>
   <button type="button" class="secondary" id="inspection-refresh" hidden>Actualiser le constat</button>
   <div class="inspection-layout">
     <section class="card inspection-progress" id="inspection-progress" aria-labelledby="inspection-views-title"></section>
     <section class="card inspection-form-panel" id="inspection-details" aria-labelledby="inspection-details-title"></section>
     <section class="card inspection-list" id="inspection-list" aria-labelledby="inspection-list-title"></section>
   </div>
 </div>`;

 function renderDetails() {
   const panel = main.querySelector('#inspection-details');
   const departureKm = readDepartureKm();
   const heading = '<h2 id="inspection-details-title" tabindex="-1">Compteur et observations</h2>';
   if (!editable()) {
     panel.innerHTML = heading+`<dl>
       <div><dt>Kilométrage</dt><dd>${item.km==null?'—':escape(item.km)+' km'}</dd></div>
       <div><dt>Carburant ou charge</dt><dd>${item.fuel==null?'—':escape(item.fuel)+' %'}</dd></div></dl>
       <p>${escape(item.observation||'Aucune observation enregistrée.')}</p>
       ${item.finalized?notice('<strong>Constat finalisé</strong><p>Le '+date(item.finalizedAt)+'. Original conservé.</p>'):
         notice('Lecture seule dans l’état actuel de la location.')}
       <div class="form-actions">${link(back,'Revenir à la location')}${link('/cases/new?rental='+urlId+'&kind=Dommage','Ajouter une réserve','secondary')}</div>`;
     return;
   }
   let values = item;
   try {
     const saved = readAttempt(storage);
     if (saved) {
       const previous = JSON.parse(saved.signature);
       if (previous.action==='save'||previous.action==='finalize') values = previous;
     }
   } catch {/* Submission checks invalid stored attempts. */}
   const kmHelp = phase==='return'&&Number.isFinite(departureKm)?'Compteur de départ enregistré · '+departureKm.toLocaleString('fr-FR')+' km.':
     'Kilométrage entier compris entre 0 et 2 000 000 km.';
   panel.innerHTML = heading+`<form id="inspection-form">
     <fieldset aria-label="Données du constat">
       ${field('Kilométrage au compteur','km',values.km??'','number','required min="'+(departureKm&&phase==='return'?escape(departureKm):0)+'" max="2000000" step="1" aria-describedby="inspection-km-help"')}
       <p id="inspection-km-help" class="inspection-help">${kmHelp}</p>
       ${field('Carburant ou charge (%)','fuel',values.fuel??'','number','required min="0" max="100" step="any"')}
       ${textarea('Observations contradictoires / dommages observés','observation',values.observation||'','maxlength="1500"')}
       <label class="check"><input type="checkbox" name="confirm">Je confirme les informations du constat fictif.</label>
       <p id="inspection-finalize-help" class="inspection-help">La finalisation exige les huit vues et votre confirmation. Elle verrouille le constat.</p>
       <div class="form-actions">
         <button type="submit" name="action" value="save" class="secondary">Sauvegarder et reprendre</button>
         <button type="submit" name="action" value="finalize" id="inspection-finalize" aria-describedby="inspection-finalize-help">Finaliser le constat</button>
       </div>
     </fieldset>
     ${errorSlot}
   </form>`;
   const form = panel.querySelector('form');
   let submittedAction;
   form.addEventListener('submit',event=>{submittedAction=event.submitter?.value==='finalize'?'finalize':'save';});
   bindForm(form,async values=>{
     const action = submittedAction;
     if (action==='finalize'&&(capturedViews(item).length!==views.length||!values.confirm)) {
       throw Error('Enregistrez les huit vues puis cochez la confirmation du constat.');
     }
     const km = Number(values.km), fuel = Number(values.fuel);
     if (!Number.isInteger(km)||km<0||km>2000000) throw Error('Saisissez un kilométrage entier valide.');
     if (phase==='return'&&km<departureKm) throw Error('Le compteur de retour doit être supérieur ou égal au départ.');
     if (!Number.isFinite(fuel)||fuel<0||fuel>100) throw Error('Saisissez un niveau de carburant ou de charge entre 0 et 100 %.');

     announce(action==='finalize'?'Finalisation en cours.':'Sauvegarde en cours.');
     try {
       const result = await mutate({action,km,fuel,observation:values.observation,confirm:Boolean(values.confirm)});
       if (!result) return;
       if (action==='finalize') {
         leaving = true;
         updateControls();
         flash('Constat finalisé.');
         location.href = back;
       } else {
         renderViews();
         announce('Brouillon enregistré. Vous pouvez reprendre plus tard.');
       }
     } catch (error) {
       announce('');
       throw error;
     }
   });
 }

 const surface = main.querySelector('.inspection-surface');
 surface.addEventListener('click',event=>{
   const button = event.target.closest('button[data-view]');
   if (!button||button.disabled) return;
   const view = button.dataset.view;
   const replace = item.photos.some(photo=>photo.view===view);
   const dialog = modal('Caméra simulée · '+view,
     `<div class="inspection-frame">${icon('camera')}<p>${framing[views.indexOf(view)]}</p></div>
       <p>Aucune caméra réelle n’est activée.</p>
       ${select('Scénario','outcome',[['success','Capture réussie'],['denied','Accès caméra refusé'],['blur','Photo floue']])}
       <button type="button" class="secondary" data-reread hidden>Actualiser le constat</button>`,async values=>{
     if (values.outcome==='denied') throw Error('Accès caméra refusé dans la simulation. Choisissez « Capture réussie » pour réessayer.');
     if (values.outcome==='blur') throw Error('Photo floue dans la simulation. Recadrez puis reprenez la capture.');
     live.textContent = 'Capture simulée en cours.';
     dialog.querySelector('select').disabled = true;
     dialog.querySelectorAll('[data-close]').forEach(control=>{control.disabled=true;});
     try {
       const result = await mutate({action:'photo',view});
       if (!result) return;
       dialog.close();
       renderViews(replace?view:'next');
       announce(view+' · '+(replace?'version remplacée.':'vue enregistrée.'));
     } catch (error) {
       refresh.hidden = !needsRefresh;
       throw error;
     } finally {
       live.textContent = '';
       dialog.querySelector('select').disabled = false;
       dialog.querySelectorAll('[data-close]').forEach(control=>{control.disabled=false;});
     }
   });
   dialog.classList.add('inspection-camera');
   const live = document.createElement('p');
   live.className = 'inspection-status';
   live.setAttribute('role','status');
   dialog.append(live);
   dialog.addEventListener('cancel',event=>{if (pending) event.preventDefault();});
   const refresh = dialog.querySelector('[data-reread]');
   refresh.onclick = async()=>{
     refresh.disabled = true;
     live.textContent = 'Lecture du constat en cours.';
     try {
       const changed = await reread(message=>{live.textContent=message;});
       if (changed) {
         dialog.close();
         focusCamera(replace?view:'next');
       } else if (!needsRefresh) {
         dialog.querySelector('.form-error').replaceChildren();
         refresh.hidden = true;
         dialog.querySelector('button[type=submit]').focus();
       }
     } finally {
       if (!needsRefresh) live.textContent = '';
       refresh.disabled = false;
     }
   };
   dialog.addEventListener('close',()=>{
     if (needsRefresh) main.querySelector('#inspection-refresh').focus();
   },{once:true});
 });
 main.querySelector('#inspection-refresh').onclick = async()=>{
   await reread();
   if (needsRefresh) main.querySelector('#inspection-refresh').focus();
   else main.querySelector('#inspection-details-title').focus();
 };
 settleAfterRead();
 renderDetails();
 renderViews();
}
