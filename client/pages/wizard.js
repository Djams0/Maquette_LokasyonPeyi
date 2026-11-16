import {api} from '../http.js';
import {escape,icon,link,notice,field,select,errorSlot,flash,money} from '/ui/components.js';
import {ownerSections,ownerGroups,groupFields,ownerBufferKey,validOwnerStep,sectionForStep,cleanOwnerDraft,draftSignature,restoreOwnerBuffer,overlayOwnerBuffer,ownerDraftDifferences,ownerLocalDate,ownerDraftErrors} from './owner-state.js';

const entry = section => ownerSections[section].groups[0];
const stepURL = step => '/owner/vehicles/new?step=' + step;
const hasLocal = buffer => Object.values(buffer?.groups || {}).some(group => Object.keys(group).length);
const options = (values, current) => current && !values.includes(current) ? [[current,current+' · valeur enregistrée'],...values] : values;
export async function wizard(me) {
  if (!me.owner) { location.replace('/owner/start'); return; }
  const main = document.getElementById('main'), storageKey = ownerBufferKey(me.id);
  main.classList.add('owner-main');
  let buffer, storageAvailable = true, blocked = false, busy = false, remote, changedRemote = null;
  try { buffer = restoreOwnerBuffer(sessionStorage.getItem(storageKey),me.id); } catch { storageAvailable = false; }
  async function identity() {
    const actor = await api('/me');
    if (actor?.id !== me.id || !actor.owner || actor.status!=='active') {
      blocked = true;
      main.innerHTML = `<h1>Reprendre avec le compte courant</h1>${notice('Le compte ou son accès propriétaire a changé. La saisie précédente n’est pas affichée.','warning')}${link('/login?next=/owner/vehicles/new','Se connecter pour reprendre','secondary')}`;
      throw Error('Le compte propriétaire a changé.');
    }
  }
  await identity(); remote = cleanOwnerDraft(await api('/owner/draft')); await identity();
  buffer ||= {version:1,accountId:me.id,base:remote,groups:{},step:validOwnerStep(remote.step)||1};
  // A response may have been lost after a write. A fresh matching field is an observation, not a new write.
  if(!buffer.attempt)for(const [step,values] of Object.entries(buffer.groups)) {
    for(const key of groupFields[step])if(JSON.stringify(values[key])===JSON.stringify(remote[key])) {
      if(key==='photos'&&values.selected)buffer.photoSelection={selected:values.selected,count:Number(values.photos)};
      delete values[key];
    }
    if(step==='5'&&!('photos' in values))delete values.selected;
  }
  if (!hasLocal(buffer) && !buffer.attempt) buffer.base=remote;
  const query = new URLSearchParams(location.search), requested = validOwnerStep(query.get('step'));
  let active = requested || (hasLocal(buffer) ? buffer.step : validOwnerStep(remote.step)) || 1;
  const section = sectionForStep(active), final = section === 3;
  const localNow = new Date(Date.now()-4*3600000);
  const defaults = {name:'',plate:'DEMO-001',year:2022,city:'Le Gosier',category:'Citadine',gearbox:'Manuelle',fuel:'Essence',seats:5,price:32,description:'',equipment:[],photos:0,start:new Date(+localNow+86400000).toISOString().slice(0,16),end:new Date(+localNow+180*86400000).toISOString().slice(0,16)};
  // A pending submission may already have removed the server draft. Its frozen body remains separate.
  const d = {...defaults,...overlayOwnerBuffer(buffer.attempt ? buffer.base : remote,buffer)};
  const selected = buffer.groups[5]?.selected || (buffer.photoSelection?.count===Number(d.photos)?buffer.photoSelection.selected:null) || Array.from({length:Math.min(5,Number(d.photos)||0)},(_,n)=>n);
  const group = (n, content) => `<section class="owner-draft-group" id="owner-group-${n}" data-draft-group="${n}" aria-labelledby="owner-group-title-${n}"><h2 id="owner-group-title-${n}" tabindex="-1">${ownerGroups[n-1]}</h2>${content}</section>`;
  const groups = {
    1: () => field('Nom / modèle','name',d.name,'text','required minlength="2" maxlength="80"')+field('Plaque fictive uniquement','plate',d.plate,'text','required minlength="3" maxlength="20"')+field('Année','year',d.year,'number','required min="1950" max="2030"')+select('Commune','city',options(['Le Gosier','Sainte-Anne','Baie-Mahault','Pointe-à-Pitre','Basse-Terre'],d.city),d.city),
    3: () => select('Catégorie','category',options(['Citadine','SUV','Utilitaire'],d.category),d.category)+select('Boîte','gearbox',options(['Manuelle','Automatique'],d.gearbox),d.gearbox)+select('Énergie','fuel',options(['Essence','Diesel','Hybride','Électrique'],d.fuel),d.fuel)+field('Places','seats',d.seats,'number','required min="2" max="9"'),
    4: () => `<p>Choisissez les équipements présents dans votre annonce fictive.</p>${['Climatisation','Bluetooth','Siège enfant','Caméra recul'].map(e=>`<label class="check"><input type="checkbox" name="equipment" value="${e}" ${(Array.isArray(d.equipment)?d.equipment:[]).includes(e)?'checked':''}>${e}</label>`).join('')}`,
    5: () => `${notice('État physique non renseigné par le mock. Les vues ci-dessous sont des illustrations, pas un constat ni une preuve de sécurité.')}<p>Cinq vues fictives obligatoires. Aucun fichier personnel n’est demandé.</p><div class="owner-photo-grid">${['Avant','Arrière','Profil gauche','Profil droit','Habitacle'].map((label,n)=>`<div class="owner-photo-slot"><img src="/assets/car-sage.svg" alt="Illustration fictive · ${label}" width="640" height="400"><label class="check"><input name="photo${n}" type="checkbox" ${selected.includes(n)?'checked':''} required>Ajouter cette vue fictive · ${label}</label></div>`).join('')}</div>`,
    7: () => field('Prix journalier fictif (€)','price',d.price,'number','required min="1" max="1000"')+`<div class="field"><label for="owner-description">Présentation et règles du véhicule</label><textarea id="owner-description" name="description" required minlength="10" maxlength="1500">${escape(d.description)}</textarea></div>`+`<label class="check"><input name="pets" type="checkbox" ${d.pets?'checked':''}>Animaux acceptés</label><p>Véhicule non-fumeur. Commission, kilométrage et caution non définis ; aucun montant libre de caution n’est collecté.</p>`,
    8: () => field('Disponible du (heure Guadeloupe)','start',ownerLocalDate(d.start),'datetime-local','required')+field('Au','end',ownerLocalDate(d.end),'datetime-local','required')+notice('Guadeloupe continentale uniquement dans cette simulation. Les sorties inter-îles restent indisponibles.')+'<button type="button" disabled>Marie-Galante / Les Saintes / La Désirade</button>',
    2: () => notice('Les trois justificatifs synthétiques seront créés à l’envoi : carte grise, assurance et contrôle technique. Ils nécessiteront chacun une revue. Aucun vrai document n’est stocké dans la saisie locale.')+`<label class="check"><input type="checkbox" name="documents" ${d.documents===true?'checked':''} required>Ajouter les trois documents fictifs</label>`,
    6: () => notice('Aucun GPS ni assurance automatique. Les conditions de sécurité et de couverture doivent être contrôlées.')+`<label class="check"><input name="safety" type="checkbox" ${d.safety===true?'checked':''} required>J’ai compris que les conditions de sécurité et de couverture doivent être contrôlées.</label><button type="button" disabled>Traceur non disponible dans cette démo</button>`,
    9: () => `<h3>${escape(d.name||'Nom à compléter')}</h3><p>${escape(d.city)} · ${escape(d.category)} · ${escape(d.gearbox)} · ${escape(d.seats)} places</p><p>${money(Number(d.price))} / jour fictif · ${escape(d.photos)} vues sélectionnées</p><p>${escape(d.description)}</p><div id="owner-completeness"></div>${notice('L’envoi ne publie pas l’annonce. Les trois pièces et l’annonce attendront leur revue, avec une décision motivée.')}<label class="check"><input type="checkbox" name="finalConfirm" required>Soumettre cette annonce fictive à la revue.</label>`,
  };
  main.innerHTML = `<div class="owner-wizard"><a class="owner-back" href="/owner/vehicles">${icon('back')}Mon parc</a><header class="owner-heading"><p class="eyebrow">Nouvelle annonce · données fictives</p><h1>${ownerSections[section].title}</h1><p>Section ${section+1} sur 4 · les neuf groupes restent accessibles</p></header>
    <p id="draft-status" class="owner-save-status" role="status"></p><p class="owner-meta">Le mock ne fournit ni révision de brouillon ni verrou concurrent. Une sauvegarde confirmée reste distincte de votre saisie locale.</p>
    ${query.has('step')&&!requested?notice('Étape demandée invalide. La section de reprise est affichée ; aucune sauvegarde automatique.','warning'):''}
    <div id="draft-conflict" class="owner-conflict" hidden></div><div id="owner-submission" class="owner-submission" role="status"></div>
    <div class="owner-wizard-layout"><nav class="owner-sections" aria-label="Sections de l’annonce">${ownerSections.map((s,n)=>`<a href="${stepURL(entry(n))}" ${n===section?'aria-current="step"':''}><span>${n+1}</span>${s.title}</a>`).join('')}<details><summary>Accès aux neuf groupes</summary>${ownerGroups.map((label,n)=>`<a href="${stepURL(n+1)}" ${n+1===active?'aria-current="location"':''}>${n+1} · ${label}</a>`).join('')}</details></nav>
    <article class="card"><form id="wizard-form">${ownerSections[section].groups.map(n=>group(n,groups[n]())).join('')}${errorSlot}<div class="owner-wizard-actions">${section>0?link(stepURL(entry(section-1)),'Précédent','secondary'):''}<button type="button" id="save-draft" class="secondary">Sauvegarder et quitter</button><button type="submit">${final?'Envoyer pour validation':'Enregistrer et continuer'}</button></div></form></article></div></div>`;
  const form = document.getElementById('wizard-form'), status = document.getElementById('draft-status'), conflict = document.getElementById('draft-conflict');
  function persist() {
    if (blocked) return;
    buffer.step = active;
    try { sessionStorage.setItem(storageKey,JSON.stringify(buffer)); } catch { storageAvailable = false; }
  }
  function say(text) { if (!blocked) status.textContent = text + (!storageAvailable?' La reprise locale est indisponible ; gardez cette page ouverte.':''); }
  function collect() {
    const fd = new FormData(form), values = Object.fromEntries(fd);
    if (section===0) for (const k of ['year','seats']) values[k] = values[k]===''?'':Number(values[k]);
    if (section===1) { values.equipment=fd.getAll('equipment'); values.photos=[0,1,2,3,4].filter(n=>fd.has('photo'+n)).length; }
    if (section===2) { values.price=values.price===''?'':Number(values.price); values.pets=fd.has('pets'); }
    if (final) { values.documents=fd.has('documents'); values.safety=fd.has('safety'); }
    return {...d,...cleanOwnerDraft(values)};
  }
  function completeness() {
    const el = document.getElementById('owner-completeness'); if (!el) return;
    const errors = ownerDraftErrors(collect());
    el.innerHTML = errors.length ? `<p><strong>À compléter avant l’envoi</strong></p><ul>${errors.map(e=>`<li><a href="${stepURL(e.group)}">${escape(e.label)}</a></li>`).join('')}</ul>` : '<p>Tous les groupes sont renseignés. La revue reste obligatoire après envoi.</p>';
  }
  function controls() {
    form.querySelectorAll('input,select,textarea').forEach(control=>{control.disabled=blocked||Boolean(buffer.attempt)||Boolean(changedRemote);});
    form.querySelectorAll('button:not([data-unavailable])').forEach(button => { if (button.type==='submit'||button.id==='save-draft') button.disabled=busy||blocked||Boolean(buffer.attempt)||Boolean(changedRemote); });
    form.setAttribute('aria-busy',String(busy));
  }
  function capture(event) {
    if (blocked) return;
    const part = event.target.closest('[data-draft-group]'), step = Number(part?.dataset.draftGroup);
    if (!step || !event.target.name || event.target.name==='finalConfirm') return;
    const values=collect(), fieldName=event.target.name.startsWith('photo')?'photos':event.target.name;
    if (!groupFields[step].includes(fieldName)) return;
    active=step; buffer.groups[step] ||= {}; buffer.groups[step][fieldName]=values[fieldName];
    if (fieldName==='photos') buffer.groups[step].selected=[0,1,2,3,4].filter(n=>new FormData(form).has('photo'+n));
    persist(); completeness(); if (!busy&&!changedRemote&&!buffer.attempt) say('Saisie locale à reprendre · non encore enregistrée dans l’API.');
  }
  form.addEventListener('input',capture); form.addEventListener('change',capture);
  form.addEventListener('focusin',event=>{const step=Number(event.target.closest('[data-draft-group]')?.dataset.draftGroup);if(step){active=step;persist();}});
  document.querySelectorAll('.owner-wizard a').forEach(a=>a.addEventListener('click',persist));
  window.addEventListener('pagehide',persist);
  function showConflict(fresh) {
    changedRemote=fresh;
    const localFields=Object.assign({},...Object.values(buffer.groups));delete localFields.selected;
    const keys=[...new Set([...ownerDraftDifferences(buffer.base,fresh),...Object.keys(localFields)])], label=key=>ownerGroups[(Number(Object.keys(groupFields).find(n=>groupFields[n].includes(key)))||9)-1];
    conflict.hidden=false;
    conflict.innerHTML=`<h2 tabindex="-1">Brouillon modifié depuis votre lecture</h2><p>Votre saisie locale reste conservée. Aucun écrasement n’a été envoyé. Cette comparaison de contenu ne constitue pas un verrou de version.</p><dl>${keys.map(k=>`<div><dt>${k==='step'?'Groupe enregistré':escape(label(k)+' · '+k)}</dt><dd>Relu : ${escape(JSON.stringify(fresh[k])??'non renseigné')}<br>Votre lecture précédente : ${escape(JSON.stringify(buffer.base[k])??'non renseigné')}<br>Saisie locale : ${k in localFields?escape(JSON.stringify(localFields[k])):'aucune modification locale ; la valeur relue sera conservée'}</dd></div>`).join('')}</dl><div class="owner-wizard-actions"><button type="button" class="secondary" id="owner-use-remote">Utiliser le brouillon relu sans ma saisie locale</button><button type="button" id="owner-keep-local">Réappliquer mes champs locaux après comparaison</button></div><p>Le groupe enregistré ${validOwnerStep(fresh.step)||1} sera rouvert pour guider la reprise. Revérifiez les champs avant de sauvegarder.</p>`;
    document.getElementById('owner-use-remote').onclick=()=>{blocked=true;try{sessionStorage.removeItem(storageKey);}catch{}location.href=stepURL(validOwnerStep(fresh.step)||1);};
    document.getElementById('owner-keep-local').onclick=()=>{buffer.base=fresh;active=validOwnerStep(fresh.step)||1;persist();location.href=stepURL(active);};
    say('Changement de contenu observé · sauvegarde suspendue pour comparaison.'); controls();conflict.querySelector('h2').focus({preventScroll:true});conflict.scrollIntoView({block:'start'});
  }
  async function save(targetStep) {
    if (busy||blocked||changedRemote||buffer.attempt) return false;
    const payload=cleanOwnerDraft({...collect(),step:targetStep});
    busy=true;controls();say('Enregistrement en cours… La saisie locale reste disponible.');persist();
    try {
      await identity();const fresh=cleanOwnerDraft(await api('/owner/draft'));await identity();
      if (draftSignature(fresh)!==draftSignature(payload)&&draftSignature(fresh)!==draftSignature(buffer.base)) {showConflict(fresh);return false;}
      const result=draftSignature(fresh)===draftSignature(payload)?fresh:cleanOwnerDraft(await api('/owner/draft',payload));
      await identity();
      if(draftSignature(result)!==draftSignature(payload))throw Error('La sauvegarde ne correspond pas à la saisie envoyée. Vérifiez le brouillon avant de continuer.');
      // Keep edits made while the request was pending separate from this acknowledged snapshot.
      const latest=cleanOwnerDraft(collect());buffer.base=result;
      for(const [step,values] of Object.entries(buffer.groups))for(const key of groupFields[step])if(JSON.stringify(latest[key])===JSON.stringify(payload[key]))delete values[key];
      if(buffer.groups[5]&&!('photos' in buffer.groups[5])){if(buffer.groups[5].selected)buffer.photoSelection={selected:buffer.groups[5].selected,count:Number(payload.photos)};delete buffer.groups[5].selected;}
      remote=result;active=hasLocal(buffer)?active:targetStep;persist();say('Dernière étape enregistrée · '+ownerGroups[targetStep-1]+'.');return true;
    } catch(error) {if(!blocked)say('Échec de sauvegarde · '+error.message+' La saisie locale est conservée.');return false;}
    finally {busy=false;if(!blocked)controls();}
  }
  function submissionState() {
    const box=document.getElementById('owner-submission'),a=buffer.attempt;
    if(!a){box.replaceChildren();controls();return;}
    box.innerHTML=`<h2>${a.status==='sending'?'Envoi pour revue en cours…':'Envoi à vérifier'}</h2><p>${escape(a.body.name||'Annonce fictive')} · cette tentative conserve son corps et sa clé. Les champs sont figés jusqu’à vérification. L’envoi ne vaut jamais publication.</p>${a.status!=='sending'?`${a.retryAllowed?'<button class="secondary" type="button" id="retry-owner-submit">Réessayer le même envoi</button>':'<p>Clé non fiable : vérifiez votre parc sans réémettre.</p>'}${link('/owner/vehicles','Vérifier mon parc','secondary')}`:''}`;
    document.getElementById('retry-owner-submit')?.addEventListener('click',()=>submit(true));controls();
  }
  async function submit(retry=false) {
    if(busy||blocked||(retry&&!buffer.attempt?.retryAllowed))return;
    if(!retry){const {step,...body}=cleanOwnerDraft(collect());body.start=ownerLocalDate(body.start)+':00-04:00';body.end=ownerLocalDate(body.end)+':00-04:00';const frozen=cleanOwnerDraft(body);buffer.attempt={key:crypto.randomUUID(),body:frozen,signature:JSON.stringify(frozen),status:'sending',retryAllowed:true};}
    const attempt=buffer.attempt;busy=true;attempt.status='sending';persist();submissionState();
    try{await identity();const result=await api('/owner/vehicles',attempt.body,'POST',attempt.key);await identity();if(typeof result?.id!=='string'||result.ownerId!==me.id)throw Error('Résultat de soumission non vérifiable.');blocked=true;try{sessionStorage.removeItem(storageKey);}catch{}flash('Annonce envoyée. Les trois justificatifs et l’annonce attendent une revue.');location.href='/owner/vehicles/'+encodeURIComponent(result.id);}
    catch(error){if(blocked)return;if([401,403].includes(error.status)){try{await identity();}catch{}if(blocked)return;delete buffer.attempt;say('Accès refusé pour cet envoi. Vérifiez votre compte avant de reprendre.');}else if([400,422].includes(error.status)){delete buffer.attempt;say('Soumission refusée · '+error.message+' Corrigez le brouillon avant un nouvel envoi.');}else{attempt.status='uncertain';if(error.status===409)attempt.retryAllowed=false;say('Le résultat de soumission doit être vérifié avant tout nouvel envoi.');}persist();}
    finally{busy=false;if(!blocked)submissionState();}
  }
  document.getElementById('save-draft').onclick=async()=>{if(await save(active)){if(hasLocal(buffer)){say('Sauvegarde confirmée ; une saisie plus récente reste locale. Sauvegardez-la avant de quitter.');return;}flash('Brouillon enregistré. Reprenez depuis votre parc.');location.href='/owner/vehicles';}};
  const errorBox=form.querySelector('.form-error');errorBox.id='owner-form-error';errorBox.tabIndex=-1;
  function formError(message,invalid=[]) {
    errorBox.textContent=message;
    for(const control of form.querySelectorAll('input,select,textarea')){control.setAttribute('aria-describedby','owner-form-error');if(invalid.includes(control))control.setAttribute('aria-invalid','true');}
    errorBox.focus({preventScroll:true});errorBox.scrollIntoView({block:'center'});
  }
  form.addEventListener('input',()=>{errorBox.textContent='';for(const control of form.querySelectorAll('[aria-invalid]'))control.removeAttribute('aria-invalid');});
  form.addEventListener('invalid',()=>{const invalid=[...form.elements].filter(e=>e.willValidate&&!e.validity.valid);formError(invalid.map(e=>(e.labels?.[0]?.textContent.trim()||e.name)+' : '+e.validationMessage).join('\n'),invalid);},true);
  form.onsubmit=async event=>{
    event.preventDefault();if(busy||blocked||changedRemote||buffer.attempt||!form.reportValidity())return;
    errorBox.textContent='';
    try{
    const values=collect();if(section===2&&(!ownerLocalDate(values.start)||!ownerLocalDate(values.end)||ownerLocalDate(values.end)<=ownerLocalDate(values.start)))throw Error('Le retour doit suivre le début de disponibilité · heure Guadeloupe.');
    if(final){const errors=ownerDraftErrors(values);if(errors.length){completeness();throw Error('Complétez les groupes indiqués avant l’envoi : '+errors.map(e=>e.label).join(', ')+'.');}}
    if(!await save(final?9:entry(section+1)))return;
    if(hasLocal(buffer)){say('Une saisie plus récente reste locale. Enregistrez-la avant de continuer.');return;}
    if(final)await submit();else location.href=stepURL(entry(section+1));
    }catch(error){if(!blocked)formError(error.message);}finally{if(!blocked)controls();}
  };
  completeness();submissionState();
  if(hasLocal(buffer)&&draftSignature(buffer.base)!==draftSignature(remote)&&!buffer.attempt)showConflict(remote);
  else say(buffer.attempt?'Envoi à vérifier · aucun renvoi automatique.':hasLocal(buffer)?'Saisie locale à reprendre · non encore enregistrée dans l’API.':Object.keys(remote).length?'Dernière étape enregistrée · '+ownerGroups[(validOwnerStep(remote.step)||1)-1]+'.':'Nouveau brouillon · aucune sauvegarde serveur confirmée.');
  if(buffer.attempt){const title=document.querySelector('#owner-submission h2');title.tabIndex=-1;title.focus({preventScroll:true});title.scrollIntoView({block:'start'});}
  else if(active!==entry(section)&&!changedRemote){const target=document.getElementById('owner-group-'+active);target.querySelector('h2').focus({preventScroll:true});target.scrollIntoView({block:'start'});}
}
