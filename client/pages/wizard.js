import {api} from '../http.js';
import {escape,icon,link,notice,field,select,errorSlot,flash,money,date} from '/ui/components.js';
import {ownerSections,ownerGroups,groupFields,ownerBufferKey,validOwnerStep,sectionForStep,cleanOwnerDraft,draftSignature,restoreOwnerBuffer,overlayOwnerBuffer,ownerDraftDifferences,ownerLocalDate,ownerDraftErrors} from './owner-state.js';

const entry = section => ownerSections[section].groups[0];
const stepURL = step => '/owner/vehicles/new?step=' + step;
const groupURL = step => stepURL(step)+'#owner-group-'+step;
const hasLocal = buffer => Object.values(buffer?.groups || {}).some(group => Object.keys(group).length);
const options = (values, current) => current && !values.includes(current) ? [[current,current+' · valeur enregistrée'],...values] : values;
const views = ['Avant','Arrière','Profil gauche','Profil droit','Habitacle'];
const fieldLabels = {
  name:'Nom / modèle',plate:'Plaque fictive',year:'Année',city:'Commune',category:'Catégorie',
  gearbox:'Boîte',fuel:'Énergie',seats:'Places',equipment:'Équipements',photos:'Vues fictives',
  price:'Prix journalier fictif',description:'Présentation et règles',pets:'Animaux acceptés',
  start:'Début de disponibilité',end:'Fin de disponibilité',documents:'Justificatifs fictifs',
  safety:'Confirmation des contrôles',step:'Groupe enregistré'
};

function draftValue(key, value) {
  if (value == null || value === '') return 'Non renseigné';
  if (key === 'step') return ownerGroups[validOwnerStep(value)-1] || 'Non renseigné';
  if (key === 'price' && Number.isFinite(Number(value))) return money(Number(value))+' / jour';
  if (key === 'start' || key === 'end') {
    const local = ownerLocalDate(value);
    return local ? date(local+':00-04:00') : 'Date non valide';
  }
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (Array.isArray(value)) return value.join(', ') || 'Aucun';
  return String(value);
}

function reviewSummary(draft) {
  const row = (label, description) => `<div><dt>${label}</dt><dd>${escape(description)}</dd></div>`;
  const card = (title, rows) => `<section><h3>${title}</h3><dl>${rows.join('')}</dl></section>`;
  return `<aside class="wizard-review" aria-labelledby="wizard-review-title">
    <h2 id="wizard-review-title">Aperçu du dossier</h2>
    <div class="wizard-review-grid">
      ${card('Véhicule', [row('Modèle', draftValue('name',draft.name)), row('Commune', draftValue('city',draft.city)),
        row('Caractéristiques', [draft.category,draft.gearbox,draft.fuel,draft.seats ? draft.seats+' places' : ''].filter(Boolean).join(' · '))])}
      ${card('État et photos', [row('Vues fictives', (Number(draft.photos)||0)+' sur '+views.length),
        row('Équipements', draftValue('equipment',draft.equipment))])}
      ${card('Disponibilité et prix', [row('Tarif fictif', draftValue('price',draft.price)),
        row('Du', draftValue('start',draft.start)), row('Au', draftValue('end',draft.end)),
        row('Animaux acceptés', draftValue('pets',draft.pets)), row('Présentation et règles', draftValue('description',draft.description))])}
      ${card('Revue', [row('Justificatifs', 'Carte grise, assurance et contrôle technique'),
        row('Suite après envoi', 'Annonce et pièces en attente de contrôle')])}
    </div>
  </aside>`;
}
export async function wizard(me) {
  if (!me.owner) { location.replace('/owner/start'); return; }
  const main = document.getElementById('main'), storageKey = ownerBufferKey(me.id);
  main.classList.add('owner-main');
  let buffer, storageAvailable = true, blocked = false, busy = false, remote, changedRemote = null;
  try {
    const record = sessionStorage.getItem(storageKey);
    buffer = restoreOwnerBuffer(record,me.id);
    if (record !== null && !buffer) storageAvailable = false;
  } catch { storageAvailable = false; }
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
  let active = requested || (hasLocal(buffer) || buffer.attempt ? buffer.step : validOwnerStep(remote.step)) || 1;
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
    5: () => `<p>Choisissez les cinq angles demandés. Ces vues fictives sont des illustrations de l’assistant. L’état physique du véhicule reste non renseigné.</p>
      <p id="wizard-photo-count" class="wizard-photo-count" role="status"></p>
      <div class="owner-photo-grid">${views.map((label,n)=>`<label class="owner-photo-slot">
        <input name="photo${n}" type="checkbox" aria-label="Ajouter cette vue fictive · ${label}" ${selected.includes(n)?'checked':''} required>
        <span class="wizard-photo-icon">${icon('camera')}</span>
        <span><strong>${label}</strong>
          <span class="wizard-photo-state" aria-hidden="true"><span>À sélectionner</span><span>Sélectionnée</span></span>
        </span>
      </label>`).join('')}</div>`,
    7: () => field('Prix journalier fictif (€)','price',d.price,'number','required min="1" max="1000"')+`<div class="field"><label for="owner-description">Présentation et règles du véhicule</label><textarea id="owner-description" name="description" required minlength="10" maxlength="1500">${escape(d.description)}</textarea></div>`+`<label class="check"><input name="pets" type="checkbox" ${d.pets?'checked':''}>Animaux acceptés</label><p>Véhicule non-fumeur. Commission, kilométrage et caution non définis ; aucun montant libre de caution n’est collecté.</p>`,
    8: () => field('Disponible du (heure Guadeloupe)','start',ownerLocalDate(d.start),'datetime-local','required')+field('Au','end',ownerLocalDate(d.end),'datetime-local','required')+notice('Guadeloupe continentale uniquement dans cette simulation. Les sorties inter-îles restent indisponibles.')+'<button type="button" disabled>Marie-Galante / Les Saintes / La Désirade</button>',
    2: () => notice('Les trois justificatifs synthétiques seront créés à l’envoi : carte grise, assurance et contrôle technique. Ils nécessiteront chacun une revue. Aucun vrai document n’est stocké dans la saisie locale.')+`<label class="check"><input type="checkbox" name="documents" ${d.documents===true?'checked':''} required>Ajouter les trois documents fictifs</label>`,
    6: () => notice('Aucun GPS ni assurance automatique. Les conditions de sécurité et de couverture doivent être contrôlées.')+`<label class="check"><input name="safety" type="checkbox" ${d.safety===true?'checked':''} required>J’ai compris que les conditions de sécurité et de couverture doivent être contrôlées.</label><button type="button" disabled>Traceur non disponible dans cette démo</button>`,
    9: () => `<div id="owner-completeness"></div>${notice('L’envoi ne publie pas l’annonce. Les trois pièces et l’annonce attendront leur revue, avec une décision motivée.')}<label class="check"><input type="checkbox" name="finalConfirm" required>Soumettre cette annonce fictive à la revue.</label>`,
  };
  main.innerHTML = `<div class="client-operational owner-wizard"><a class="owner-back" href="/owner/vehicles">${icon('back')}Mon parc</a><header class="owner-heading"><h1>${ownerSections[section].title}</h1><p>Nouvelle annonce · section ${section+1} sur ${ownerSections.length}</p></header>
    <div class="owner-save-status wizard-draft-banner">
      ${icon('file')}<div><p id="draft-last-saved"></p><p id="draft-status" role="status"></p></div>
    </div>
    ${query.has('step')&&!requested?notice('Étape demandée invalide. La section de reprise est affichée ; aucune sauvegarde automatique.','warning'):''}
    <div id="draft-conflict" class="owner-conflict" hidden></div><div id="owner-submission" class="owner-submission" role="status"></div>
    <div class="owner-wizard-layout"><nav class="owner-sections" aria-label="Sections de l’annonce">${ownerSections.map((s,n)=>`<a href="${stepURL(entry(n))}" ${n===section?'aria-current="step"':''}><span aria-hidden="true">${n+1}</span><strong class="wizard-step-label">${s.title}</strong></a>`).join('')}<details><summary>Groupes de l’annonce <span id="wizard-current-group">${ownerGroups[active-1]}</span></summary>${ownerGroups.map((label,n)=>`<a href="${stepURL(n+1)}" ${n+1===active?'aria-current="location"':''}>${n+1} · ${label}</a>`).join('')}</details></nav>
    <article class="card wizard-form-card">${final ? reviewSummary(d) : ''}<form id="wizard-form">${ownerSections[section].groups.map(n=>group(n,groups[n]())).join('')}${errorSlot}<div class="owner-wizard-actions">${section>0?link(stepURL(entry(section-1)),'Précédent','secondary'):''}<button type="button" id="save-draft" class="secondary">Sauvegarder et quitter</button><button type="submit">${final?'Envoyer pour validation':'Enregistrer et continuer'}</button></div></form></article></div></div>`;
  const form = document.getElementById('wizard-form'), status = document.getElementById('draft-status'), conflict = document.getElementById('draft-conflict');
  function persist() {
    if (blocked || !storageAvailable) return false;
    buffer.step = active;
    try {
      sessionStorage.setItem(storageKey,JSON.stringify(buffer));
      return true;
    } catch {
      storageAvailable = false;
      return false;
    }
  }
  function say(text, kind = 'info') {
    if (blocked) return;
    const lastSaved = buffer.attempt ? buffer.base : remote;
    document.getElementById('draft-last-saved').textContent = Object.keys(lastSaved).length
      ? 'Dernier groupe enregistré : '+ownerGroups[(validOwnerStep(lastSaved.step)||1)-1] : 'Aucune sauvegarde serveur confirmée';
    status.closest('.wizard-draft-banner').dataset.kind = !storageAvailable ? 'warning' : kind;
    status.textContent = text + (!storageAvailable ? ' La reprise locale est indisponible. Gardez cette page ouverte pour conserver la saisie.' : '');
  }
  function collect() {
    const fd = new FormData(form), values = Object.fromEntries(fd);
    if (section===0) for (const k of ['year','seats']) values[k] = values[k]===''?'':Number(values[k]);
    if (section===1) { values.equipment=fd.getAll('equipment'); values.photos=[0,1,2,3,4].filter(n=>fd.has('photo'+n)).length; }
    if (section===2) { values.price=values.price===''?'':Number(values.price); values.pets=fd.has('pets'); }
    if (final) { values.documents=fd.has('documents'); values.safety=fd.has('safety'); }
    return {...d,...cleanOwnerDraft(values)};
  }
  function updatePhotoStatus() {
    const count = document.getElementById('wizard-photo-count');
    if (!count) return;
    const checked = views.filter((_,index)=>form.elements.namedItem('photo'+index).checked).length;
    const text = checked+' sur '+views.length+' vues sélectionnées';
    if (count.textContent !== text) count.textContent = text;
  }
  function completeness() {
    const el = document.getElementById('owner-completeness'); if (!el) return;
    const errors = ownerDraftErrors(collect());
    el.innerHTML = errors.length ? `<p><strong>À compléter avant l’envoi</strong></p><ul>${errors.map(e=>`<li><a href="${groupURL(e.group)}">${escape(e.label)}</a></li>`).join('')}</ul>` : '<p>Tous les groupes sont renseignés. La revue reste obligatoire après envoi.</p>';
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
    persist(); completeness(); updatePhotoStatus(); if (!busy&&!changedRemote&&!buffer.attempt) say('Saisie locale à reprendre · non encore enregistrée dans l’API.');
  }
  form.addEventListener('input',capture); form.addEventListener('change',capture);
  form.addEventListener('focusin',event=>{const step=Number(event.target.closest('[data-draft-group]')?.dataset.draftGroup);if(step){active=step;document.getElementById('wizard-current-group').textContent=ownerGroups[step-1];persist();}});
  document.querySelectorAll('.owner-wizard a').forEach(a=>a.addEventListener('click',persist));
  window.addEventListener('pagehide',persist);
  function showConflict(fresh) {
    changedRemote=fresh;
    const localFields=Object.assign({},...Object.values(buffer.groups));delete localFields.selected;
    const keys = [...new Set([...ownerDraftDifferences(buffer.base,fresh),...Object.keys(localFields)])];
    conflict.hidden=false;
    conflict.innerHTML=`<h2 tabindex="-1">Brouillon modifié depuis votre lecture</h2><p>Comparez les champs avant de choisir. Votre choix rouvre le groupe indiqué pour une relecture, puis vous pourrez enregistrer.</p>
      <div class="wizard-conflict-values">${keys.map(k=>`<section><h3>${fieldLabels[k]}</h3><dl>
        <div><dt>Brouillon relu</dt><dd>${escape(draftValue(k,fresh[k]))}</dd></div>
        <div><dt>Lecture précédente</dt><dd>${escape(draftValue(k,buffer.base[k]))}</dd></div>
        <div><dt>Votre saisie locale</dt><dd>${k in localFields?escape(draftValue(k,localFields[k])):'Aucune modification locale'}</dd></div>
      </dl></section>`).join('')}</div><div class="owner-wizard-actions"><button type="button" class="secondary" id="owner-use-remote">Utiliser le brouillon relu sans ma saisie locale</button><button type="button" id="owner-keep-local">Réappliquer mes champs locaux après comparaison</button></div><p>Le groupe enregistré ${validOwnerStep(fresh.step)||1} sera rouvert pour guider la reprise. Revérifiez les champs avant de sauvegarder.</p>`;
    const resumeStep = validOwnerStep(fresh.step)||1;
    document.getElementById('owner-use-remote').onclick = () => {
      try { sessionStorage.removeItem(storageKey); }
      catch {
        say('Le navigateur n’a pas pu effacer le tampon local. La comparaison reste ouverte.','warning');
        return;
      }
      blocked = true;
      location.href = stepURL(resumeStep);
    };
    document.getElementById('owner-keep-local').onclick = () => {
      const previous = buffer.base, previousStep = active;
      buffer.base = fresh;
      active = resumeStep;
      if (!persist()) {
        buffer.base = previous;
        active = previousStep;
        say('Impossible de rouvrir le groupe sans perdre votre saisie. La comparaison reste ouverte.','warning');
        return;
      }
      location.href = stepURL(active);
    };
    say('Changement de contenu observé · sauvegarde suspendue pour comparaison.','warning'); controls();conflict.querySelector('h2').focus({preventScroll:true});conflict.scrollIntoView({block:'start'});
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
      remote=result;active=hasLocal(buffer)?active:targetStep;persist();say('Sauvegarde confirmée.');return true;
    } catch(error) {if(!blocked)say('Échec de sauvegarde · '+error.message+' La saisie locale est conservée.','warning');return false;}
    finally {busy=false;if(!blocked)controls();}
  }
  function submissionState(focus = false) {
    const box=document.getElementById('owner-submission'),a=buffer.attempt;
    if(!a){box.replaceChildren();controls();return;}
    box.innerHTML=`<h2 tabindex="-1">${a.status==='sending'?'Envoi pour revue en cours…':'Envoi à vérifier'}</h2><p><strong>${escape(a.body.name||'Annonce fictive')}</strong></p><p>Les champs restent figés pendant la vérification. Après confirmation, l’annonce et ses justificatifs attendent leur revue.</p>${a.status!=='sending'?`${a.retryAllowed?'<button class="secondary" type="button" id="retry-owner-submit">Réessayer le même envoi</button>':'<p>Clé non fiable : vérifiez votre parc sans réémettre.</p>'}${link('/owner/vehicles','Vérifier mon parc','secondary')}`:''}`;
    document.getElementById('retry-owner-submit')?.addEventListener('click',()=>submit(true));controls();
    if (focus) {
      box.querySelector('h2').focus({preventScroll:true});
      box.scrollIntoView({block:'start'});
    }
  }
  async function submit(retry=false) {
    if(busy||blocked||(retry&&!buffer.attempt?.retryAllowed))return;
    if(!retry){const {step,...body}=cleanOwnerDraft(collect());body.start=ownerLocalDate(body.start)+':00-04:00';body.end=ownerLocalDate(body.end)+':00-04:00';const frozen=cleanOwnerDraft(body);buffer.attempt={key:crypto.randomUUID(),body:frozen,signature:JSON.stringify(frozen),status:'sending',retryAllowed:true};}
    const attempt = buffer.attempt;
    attempt.status = 'sending';
    if (!persist()) {
      if (retry) {
        attempt.status = 'uncertain';
        attempt.retryAllowed = false;
      } else delete buffer.attempt;
      say('Envoi suspendu. La tentative ne peut pas être conservée dans cet onglet.','warning');
      submissionState(retry);
      status.tabIndex = -1;
      status.focus();
      return;
    }
    busy=true;submissionState(true);
    try{await identity();const result=await api('/owner/vehicles',attempt.body,'POST',attempt.key);await identity();if(typeof result?.id!=='string'||result.ownerId!==me.id)throw Error('Résultat de soumission non vérifiable.');blocked=true;try{sessionStorage.removeItem(storageKey);}catch{}flash('Annonce envoyée. Les trois justificatifs et l’annonce attendent une revue.');location.href='/owner/vehicles/'+encodeURIComponent(result.id);}
    catch(error){if(blocked)return;if([401,403].includes(error.status)){try{await identity();}catch{}if(blocked)return;delete buffer.attempt;say('Accès refusé pour cet envoi. Vérifiez votre compte avant de reprendre.');}else if([400,422].includes(error.status)){delete buffer.attempt;say('Soumission refusée · '+error.message+' Corrigez le brouillon avant un nouvel envoi.');}else{attempt.status='uncertain';if(error.status===409)attempt.retryAllowed=false;say('Le résultat de soumission doit être vérifié avant tout nouvel envoi.','warning');}persist();}
    finally{busy=false;if(!blocked)submissionState(Boolean(buffer.attempt));}
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
    if (final && !storageAvailable) {
      say('Envoi suspendu. Vous pouvez enregistrer le brouillon et le reprendre dans un onglet où le stockage est disponible.','warning');
      status.tabIndex = -1;
      status.focus();
      return;
    }
    try{
    const values=collect();if(section===2&&(!ownerLocalDate(values.start)||!ownerLocalDate(values.end)||ownerLocalDate(values.end)<=ownerLocalDate(values.start)))throw Error('Le retour doit suivre le début de disponibilité · heure Guadeloupe.');
    if(final){const errors=ownerDraftErrors(values);if(errors.length){completeness();throw Error('Complétez les groupes indiqués avant l’envoi : '+errors.map(e=>e.label).join(', ')+'.');}}
    if(!await save(final?9:entry(section+1)))return;
    if(hasLocal(buffer)){say('Une saisie plus récente reste locale. Enregistrez-la avant de continuer.');return;}
    if(final)await submit();else location.href=stepURL(entry(section+1));
    }catch(error){if(!blocked)formError(error.message);}finally{if(!blocked)controls();}
  };
  completeness();updatePhotoStatus();submissionState(Boolean(buffer.attempt));
  if(hasLocal(buffer)&&draftSignature(buffer.base)!==draftSignature(remote)&&!buffer.attempt)showConflict(remote);
  else say(buffer.attempt?'Envoi à vérifier · aucun renvoi automatique.':hasLocal(buffer)?'Saisie locale à reprendre · non encore enregistrée dans l’API.':Object.keys(remote).length?'Le brouillon serveur a été chargé.':'Renseignez les groupes et sauvegardez le brouillon pour le reprendre.');
  if(!buffer.attempt&&!changedRemote&&(active!==entry(section)||location.hash==='#owner-group-'+active)){const target=document.getElementById('owner-group-'+active);target.querySelector('h2').focus({preventScroll:true});target.scrollIntoView({block:'start'});}
}
