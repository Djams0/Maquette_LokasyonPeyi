import {api} from '../http.js';
import {ownerNav} from '../shell.js';
import {escape,icon,link,notice,empty,field,textarea,errorSlot,bindForm,bindActions,modal,flash,date,badge} from '/ui/components.js';
import {bindVehicleMedia} from './vehicle-media.js';
import {vehiclePresentation} from './vehicle-presentation.js';
import {rentalNext,localRentalDate} from './booking-state.js';
import {localDate} from './search-state.js';
import {ownerSections,ownerGroups,ownerBufferKey,restoreOwnerBuffer,cleanOwnerDraft,validOwnerStep,sectionForStep,ownerCalendarItems,ownerRequestTabs,ownerRequestReturn} from './owner-state.js';

const pathFor = id => '/owner/vehicles/'+encodeURIComponent(id);
const vehicleFilters = {all:'Tous',published:'Publiés',pending:'En revue',paused:'En pause',changes_requested:'À corriger',rejected:'Refusés',withdrawn:'Retirés',draft:'Brouillon'};
const amounts = new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',minimumFractionDigits:0,maximumFractionDigits:2});
const formatAmount = value => Number.isFinite(value) && value >= 0 ? amounts.format(value) : 'Montant non disponible';
const fleetReturn = value => '/owner/vehicles' + (value !== 'all' && Object.hasOwn(vehicleFilters,value) ? '?status='+value : '');
const safeDate = value => value && Number.isFinite(Date.parse(value)) ? date(value) : 'Date non renseignée';
const ownPresentation = v => vehiclePresentation(v.id==='v1' && v.name!=='Peugeot 208' ? {...v,id:''} : v);
function media(v, sizes='(min-width:1024px) 720px, 100vw') {
  const m=ownPresentation(v).gallery[0];
  return `<div class="catalogue-media owner-hero-media"><img data-vehicle-image data-photo="${m.photo}" data-fallback="${m.fallback}" data-vehicle-name="${escape(v.name)}" src="${m.src}" ${m.srcset?`srcset="${m.srcset}" sizes="${sizes}"`:''} alt="${escape(m.alt)}" width="${m.width}" height="${m.height}"><span class="media-label">${m.modelPhoto?'Illustration du modèle':m.photo?'Photo de démonstration':'Illustration fictive'}</span></div>`;
}
function vehicleList(vs, filter='all', emptyFleet=false) {
  const query = filter === 'all' ? '' : '?status='+encodeURIComponent(filter);
  return vs.length?`<div class="owner-vehicle-list">${vs.map(v=>`<article class="card owner-vehicle-row">${media(v,'(min-width:1024px) 360px, (min-width:768px) 46vw, 28vw')}<div>${v.status ? badge(v.status) : '<p class="owner-meta">État non renseigné</p>'}<h2>${escape(v.name)}</h2><p>${escape(v.city)} · ${Number.isFinite(v.price) ? formatAmount(v.price)+' / jour fictif' : 'Tarif non renseigné'}</p>${link(pathFor(v.id)+query,'Gérer le véhicule','secondary')}<a class="owner-text-link" href="${pathFor(v.id)+query}#owner-calendar">Voir le calendrier</a></div></article>`).join('')}</div>`:empty(emptyFleet ? 'Aucun véhicule dans votre parc' : 'Aucun véhicule dans cette vue',
    emptyFleet ? 'Préparez votre première annonce.' : 'Consultez les autres états du parc.',
    emptyFleet ? link('/owner/vehicles/new','Ajouter mon véhicule','secondary') : link('/owner/vehicles','Voir tout le parc','secondary'));
}
function rentalCard(r,me,tab) {
  const next=rentalNext(r,me.id);
  return `<article class="card owner-request"><div class="row between"><h2>${escape(r.vehicleName)}</h2>${badge(r.status)}</div><p class="owner-role">${escape(next.actor)}</p><p>${escape(r.renterName)} · ${safeDate(r.start)} → ${safeDate(r.end)}</p><p>${formatAmount(r.quote?.total)} · ${escape(r.id)}</p><p>${escape(next.description)}</p><div class="owner-card-actions">${link('/rental/'+encodeURIComponent(r.id)+(tab==='all'?'':'?ownerTab='+encodeURIComponent(tab)),'Examiner la demande')}</div></article>`;
}
function calendar(v, rentals, tab) {
  const items = ownerCalendarItems(v, rentals);
  const month = history.state?.ownerMonth || (localRentalDate(items[0]?.start) || localRentalDate(new Date().toISOString())).slice(0,7);
  return `<section class="card owner-calendar" id="owner-calendar" aria-labelledby="calendar-title">
    <h2 id="calendar-title" tabindex="-1">Calendrier de disponibilité</h2>
    <p>${v.availability?.start && v.availability?.end ? 'Ouvert du '+safeDate(v.availability.start)+' au '+safeDate(v.availability.end)+'.' : 'Disponibilité générale non renseignée.'}</p>
    <p class="owner-meta">Heure de Guadeloupe. La liste précise les heures de début et de fin.</p>
    <div class="owner-calendar-layout"><div>
      <div class="owner-calendar-desktop">
        <label for="owner-month">Mois à consulter</label>
        <div class="owner-month-controls">
          <button class="secondary" type="button" id="owner-prev-month" aria-label="Mois précédent">${icon('back')}</button>
          <input type="month" id="owner-month" value="${escape(month)}" min="1900-01" max="9999-12">
          <button class="secondary" type="button" id="owner-next-month" aria-label="Mois suivant">${icon('arrow')}</button>
        </div>
        <p id="owner-month-status" role="status"></p>
        <div id="owner-month-grid"></div>
        <p class="owner-meta">R · Créneau occupé, D · Demande non réservée, B · Blocage manuel.</p>
      </div>
      <h3>Liste des périodes</h3>
      <div class="owner-calendar-list">${items.length ? items.map(item=>`<article class="owner-period ${item.kind}">
        <strong>${escape(item.label)}</strong> ${item.status ? badge(item.status) : ''}
        <p>Du ${safeDate(item.start)} au ${safeDate(item.end)}</p>
        ${item.kind === 'blocked' ? `<button class="secondary" type="button" data-unblock="${escape(item.id)}">Libérer</button>`
          : link('/rental/'+encodeURIComponent(item.id)+(tab ? '?ownerTab='+tab : ''), item.kind === 'requested' ? 'Ouvrir la demande' : 'Consulter la location','secondary')}
      </article>`).join('') : '<p>Aucune période enregistrée.</p>'}</div>
      </div>
      <form id="block-dates"><h3>Bloquer un créneau</h3>
        ${field('Indisponible à partir du','start','','datetime-local','required')}
        ${field('Jusqu’au','end','','datetime-local','required')}
        ${errorSlot}<button type="submit">Bloquer ce créneau</button>
      </form>
    </div>
  </section>`;
}

function bindCalendar(v, rentals) {
  const input = document.getElementById('owner-month');
  const previous = document.getElementById('owner-prev-month');
  const next = document.getElementById('owner-next-month');
  const items = ownerCalendarItems(v,rentals).map(item => ({
    ...item, from: localRentalDate(item.start), until: localRentalDate(item.end)
  }));
  let current = input.value;
  function render(announce = false) {
    if (!/^\d{4}-\d{2}$/.test(input.value) || !localDate(input.value+'-01') || input.value < '1900-01') {
      input.value = current;
      return;
    }
    current = input.value;
    const [year,month] = current.split('-').map(Number);
    const start = new Date(current+'-01T12:00:00Z');
    const count = new Date(Date.UTC(year,month,0)).getUTCDate();
    const offset = (start.getUTCDay()+6)%7;
    const label = new Intl.DateTimeFormat('fr-FR',{month:'long',year:'numeric',timeZone:'UTC'}).format(start);
    const grid = document.getElementById('owner-month-grid');
    grid.innerHTML = `<div class="owner-month-grid" role="list" aria-label="${escape('Périodes · '+label)}">
      ${['Lu','Ma','Me','Je','Ve','Sa','Di'].map(day=>`<span aria-hidden="true" class="owner-weekday">${day}</span>`).join('')}
      ${'<span aria-hidden="true"></span>'.repeat(offset)}
      ${Array.from({length:count},(_,index)=>{
        const day = current+'-'+String(index+1).padStart(2,'0');
        // The interval ends before the following midnight, like the API overlap contract.
        const events = items.filter(item=>item.from && item.until &&
          item.from.slice(0,10) <= day && item.until > day+'T00:00');
        const labels = [...new Set(events.map(item=>item.label))];
        const marks = [...new Set(events.map(item=>({held:'R',requested:'D',blocked:'B'}[item.kind])))];
        return `<span role="listitem" class="owner-day ${events[0]?.kind || ''}" aria-label="${escape([day,...labels].join(' · '))}">${index+1}<small aria-hidden="true">${marks.join(' ')||'·'}</small></span>`;
      }).join('')}</div>`;
    previous.disabled = current === '1900-01';
    next.disabled = current === '9999-12';
    if (announce) {
      history.replaceState({...history.state,ownerMonth:current},'');
      document.getElementById('owner-month-status').textContent = 'Mois affiché : '+label;
    }
  }
  function shift(delta) {
    const [year,month] = current.split('-').map(Number);
    const index = year*12 + month-1 + delta;
    input.value = String(Math.floor(index/12)).padStart(4,'0')+'-'+String(index%12+1).padStart(2,'0');
    render(true);
  }
  previous.onclick = () => shift(-1);
  next.onclick = () => shift(1);
  input.onchange = () => render(true);
  render();
}
export async function ownerPage(section,me,id) {
  if(!me.owner){location.replace('/owner/start');return;}
  const main = document.getElementById('main');
  main.classList.add('owner-main','owner-review-main');
  main.innerHTML = '<p role="status">Chargement de l’espace propriétaire…</p>';
  const b = await api('/bootstrap');
  let draft=null,draftError=false,buffer=null;
  if(['dashboard','vehicles'].includes(section)) {
    try{draft=cleanOwnerDraft(await api('/owner/draft'));}catch{draftError=true;}
    try{buffer=restoreOwnerBuffer(sessionStorage.getItem(ownerBufferKey(me.id)),me.id);}catch{/* No browser storage is needed to read the parc. */}
  }
  const identity=await api('/me');if(b.me?.id!==me.id||identity?.id!==me.id||!identity.owner||identity.status!=='active')throw Error('Le compte propriétaire a changé. Rechargez avec le compte courant.');
  const owned = b.owned.filter(vehicle=>vehicle.ownerId===me.id);
  const rs = b.rentals.filter(r=>r.ownerId===me.id);
  const params = new URLSearchParams(location.search);
  const local=Object.values(buffer?.groups||{}).some(g=>Object.keys(g).length)>0,hasDraft=Boolean(local||buffer?.attempt||Object.keys(draft||{}).length),savedStep=(local||buffer?.attempt?buffer.step:validOwnerStep(draft?.step))||1;
  const draftCard=hasDraft?`<article class="card owner-draft-card"><p class="owner-role">${buffer?.attempt?'Envoi à vérifier':local?'Saisie locale à reprendre':'Brouillon enregistré dans l’API'}</p><h2>${escape(buffer?.attempt?.body.name||(local?Object.assign({},...Object.values(buffer.groups)).name:null)||draft?.name||'Votre annonce à préparer')}</h2><p>${ownerSections[sectionForStep(savedStep)].title} · ${ownerGroups[savedStep-1]}</p>${link('/owner/vehicles/new?step='+savedStep,buffer?.attempt?'Vérifier mon envoi':'Reprendre le brouillon','secondary')}</article>`:'';
  const draftWarning=draftError?notice('Le brouillon enregistré est indisponible. La saisie locale éventuelle reste séparée ; ouvrez l’assistant pour vérifier et reprendre.','warning'):'';
  let body='';
  if(section==='dashboard') {
    const actionable=rs.find(r=>r.status==='requested')||rs.find(r=>['return_reported','returned'].includes(r.status)),next=actionable&&rentalNext(actionable,me.id);
    body=`<header class="owner-heading"><p class="eyebrow">Bonjour ${escape(me.name.split(' ')[0])}</p><h1>Aujourd’hui</h1><p>${new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeZone:'America/Guadeloupe'}).format(new Date())} · Guadeloupe</p></header><div class="owner-counts"><a class="card" href="/owner/requests?tab=requested"><strong>${rs.filter(r=>r.status==='requested').length}</strong><span>Demandes à traiter</span></a><a class="card" href="/owner/vehicles"><strong>${owned.length}</strong><span>Véhicules</span></a><a class="card" href="/owner/vehicles/new"><strong>${draftError?'À vérifier':hasDraft?1:0}</strong><span>Brouillon ${local?'local':'à reprendre'}</span></a></div>
      <div class="owner-dashboard-layout"><div><section class="owner-priority"><p class="eyebrow">${actionable?escape(next.actor):'Votre prochaine annonce'}</p><h2>${actionable?escape(actionable.vehicleName):'Votre parc, à votre rythme'}</h2><p>${actionable?escape(next.description):'Ajoutez un véhicule ou vérifiez les disponibilités de vos annonces. La publication reste soumise aux contrôles.'}</p>${actionable?link('/rental/'+encodeURIComponent(actionable.id)+(actionable.status==='requested'?'?ownerTab=requested':''),actionable.status==='requested'?'Examiner la demande':'Consulter le suivi','light'):link('/owner/vehicles/new','Ajouter un véhicule','light')}</section>
      </div><aside>${draftWarning}${draftCard || (draftError ? '' : '<section class="card"><h2>Brouillon</h2><p>Aucun brouillon à reprendre.</p></section>')}
      <div class="owner-shortcuts">${link('/owner/revenue','Revenus fictifs','secondary')}${link('/owner/reputation','Réputation et avis','secondary')}${link('/rentals','Mes locations','secondary')}${link('/messages','Messages','secondary')}</div></aside></div>
      <div class="section-heading section"><h2>Mon parc</h2><a class="owner-text-link" href="/owner/vehicles">Voir tous mes véhicules</a></div>${vehicleList(owned.slice(0,3),'all',!owned.length)}`;
  }
  if(section==='vehicles') {
    const requested = params.get('status');
    const filter = Object.hasOwn(vehicleFilters,requested) ? requested : 'all';
    const list=filter==='all'?owned:filter==='draft'?[]:owned.filter(v=>v.status===filter);
    body=`<div class="section-heading owner-heading"><div><h1>Mes véhicules</h1><p>${owned.length} véhicule${owned.length===1?'':'s'} dans votre parc</p></div>${link('/owner/vehicles/new',icon('plus')+' Ajouter un véhicule')}</div><details id="fleet-filters" class="owner-fleet-filters" open><summary>Filtrer le parc · ${vehicleFilters[filter]}</summary><nav class="owner-filters" aria-label="États du parc">${Object.entries(vehicleFilters).map(([value,label])=>`<a href="/owner/vehicles${value==='all'?'':'?status='+value}" ${filter===value?'aria-current="page"':''}>${label}</a>`).join('')}</nav></details>${draftWarning}${filter==='draft'?(draftCard||(draftError?'':empty('Aucun brouillon à reprendre','Préparez une annonce en quatre sections.',link('/owner/vehicles/new','Ajouter mon véhicule','secondary')))):vehicleList(list,filter,!owned.length)+(filter==='all'?draftCard:'')}`;
  }
  if(section==='requests') {
    const requested = params.get('tab');
    const tab = requested || 'all';
    const list = rs.filter(r=>tab==='all'||r.status===tab);
    body=`<header class="owner-heading"><h1>Demandes et locations</h1><p>Décidez depuis le suivi de chaque demande, selon son état actuel.</p></header><nav class="owner-filters" aria-label="États des demandes">${Object.entries(ownerRequestTabs).map(([value,label])=>`<a href="${ownerRequestReturn(value)}" ${tab===value?'aria-current="page"':''}>${label}${value==='all'?' ('+rs.length+')':''}</a>`).join('')}</nav>${list.length?`<div class="owner-request-list">${list.map(r=>rentalCard(r,me,tab)).join('')}</div>`:empty('Aucune demande dans cette vue','Les nouvelles demandes apparaissent après actualisation.',tab==='all' ? '' : link('/owner/requests','Voir toutes les demandes','secondary'))}<button class="secondary section" id="refresh">${icon('refresh')}Actualiser</button>`;
  }
  if(section==='revenue') {
    const paid=rs.filter(r=>r.payment==='simulated_paid');
    const total = paid.every(r=>Number.isFinite(r.quote?.total) && r.quote.total >= 0) ? paid.reduce((n,r)=>n+r.quote.total,0) : null;
    body=`<header class="owner-heading"><h1>Mes revenus fictifs</h1></header>${notice('Les paiements simulés sont affichés en montant brut. Les frais et le montant net restent indéfinis.')}<div class="owner-counts section"><article class="card"><strong>${paid.length ? formatAmount(total) : 'Aucun paiement'}</strong><span>Brut simulé</span></article><article class="card"><strong>Fictif</strong><span>Profil de versement</span></article><article class="card"><strong>Non défini</strong><span>Net à verser</span></article></div>${paid.length?`<div class="owner-request-list section">${paid.map(r=>`<article class="card"><h2>${escape(r.vehicleName)}</h2><p><strong>${formatAmount(r.quote?.total)}</strong> · Paiement simulé</p><p>Location du ${safeDate(r.start)} au ${safeDate(r.end)}</p>${badge(r.status)}${link('/rental/'+encodeURIComponent(r.id),'Consulter','secondary')}</article>`).join('')}</div>`:empty('Aucun paiement simulé','Les locations payées alimenteront cette vue.')}`;
  }
  const reviews = b.reviews.filter(r=>r.ownerId===me.id);
  if(section==='reputation') {
    body=`<header class="owner-heading"><h1 id="owner-reputation-title" tabindex="-1">Réputation et avis</h1></header>${reviews.length?`<div class="owner-request-list">${reviews.map(r=>`<article class="card"><h2>${escape(owned.find(v=>v.id===r.vehicleId)?.name || 'Avis de location')}</h2><p>${icon('star')} Véhicule · ${Number.isFinite(r.vehicleRating ?? r.rating) ? (r.vehicleRating ?? r.rating)+' / 5' : 'Note non renseignée'}${Number.isFinite(r.ownerRating) ? ' · Propriétaire '+r.ownerRating+' / 5' : ''}</p>${badge(r.status)}<p class="owner-meta">${safeDate(r.at)}</p><p>${escape(r.comment)}</p>${r.reply?`<div class="owner-review-reply"><h3>Votre réponse</h3><p>${escape(r.reply)}</p></div>`:''}<button class="secondary" type="button" data-reply="${escape(r.id)}">${r.reply ? 'Modifier ma réponse' : 'Répondre à cet avis'}</button></article>`).join('')}</div>`:empty('Votre réputation se construit','Les avis des locations terminées apparaîtront ici.')}`;
  }
  const v=section==='vehicle'?owned.find(v=>v.id===id):null,docs=b.documents.filter(d=>d.vehicleId===id);
  if(section==='vehicle') {
    if(!v)throw Error('Véhicule introuvable dans votre espace.');
    const condition=ownPresentation(v).condition;
    body=`<a class="owner-back" href="${fleetReturn(params.get('status'))}">${icon('back')}Mon parc</a><header class="section-heading owner-heading"><div><h1 id="owner-vehicle-title" tabindex="-1">${escape(v.name)}</h1><p class="owner-meta">Version de l’annonce ${v.version} · ${escape(v.city)}</p></div>${badge(v.status)}</header><p id="owner-context" role="status"></p>${v.reason?notice(escape(v.reason),'warning'):''}<div class="owner-detail-layout"><div class="owner-detail-content">${media(v)}
      <nav class="owner-shortcuts" aria-label="Gérer cette annonce"><a class="card" href="#owner-calendar">${icon('calendar')}Calendrier</a><a class="card" href="#owner-condition">${icon('camera')}État et photos</a><a class="card" href="#owner-documents">${icon('file')}Documents</a><a class="card" href="/vehicle/${encodeURIComponent(v.id)}">${icon('car')}Aperçu de la fiche</a></nav>
      <section class="card" id="owner-condition"><h2>État et photos</h2>${condition?`<p>Exemple visuel fictif lié à la fixture v1 · ${escape(condition.date)}</p><p><strong>${escape(condition.zone)} · ${escape(condition.title)}</strong></p><p>${escape(condition.description)}</p>`:'<p>État non renseigné. Aucune déclaration physique structurée n’est fournie par l’API pour ce véhicule.</p>'}<p class="owner-meta">Les justificatifs et les constats ont leurs propres contrôles. L’édition structurée des défauts n’est pas disponible dans ce mock.</p></section>
      <section class="card"><h2>Modifier les informations</h2><form id="edit-vehicle">${field('Nom du véhicule','name',v.name,'text','required maxlength="80"')}${field('Prix journalier fictif (€)','price',v.price,'number','required min="1" max="1000"')}${textarea('Description','description',v.description,'required minlength="10" maxlength="1500"')}${errorSlot}<button type="submit" ${v.status==='withdrawn'?'disabled':''}>Enregistrer les modifications</button></form>${v.status==='withdrawn'?'<p>Une annonce retirée ne peut plus être modifiée.</p>':''}</section></div>
      <aside class="owner-detail-aside"><section class="card"><h2>Gérer l’annonce</h2><div class="stack">${v.status==='published'?'<button data-manage="pause" class="secondary">Mettre en pause</button>':''}${v.status==='paused'?`<button data-manage="resume" ${v.checksPassed?'':'disabled'}>Remettre en ligne</button>${v.checksPassed?'':'<p>Revue requise avant remise en ligne.</p>'}`:''}${v.status!=='withdrawn'?'<button data-manage="remove" class="danger-button">Retirer le véhicule</button>':''}</div></section><section class="card" id="owner-documents"><h2 id="owner-documents-title" tabindex="-1">Documents du véhicule</h2>${docs.map(d=>`<article class="owner-document"><h3>${escape(d.kind)}</h3><p>${badge(d.status)} · version ${d.version}</p>${d.reason?`<p>${escape(d.reason)}</p>`:''}<button class="secondary" data-document="${escape(d.kind)}">Soumettre une nouvelle version fictive</button></article>`).join('')||'<p>Aucun document disponible dans votre espace pour cette annonce.</p>'}${notice('Toute nouvelle version exige une revue. Une annonce publiée repasse en contrôle ; une annonce en pause ne peut pas reprendre sans contrôles valides.','warning')}</section></aside></div>${calendar(v,rs)}`;
  }
  main.innerHTML=ownerNav()+`<div class="client-operational owner-workspace owner-surface">${body}</div>`;bindVehicleMedia(main);
  document.getElementById('refresh')?.addEventListener('click',()=>location.reload());
  const filters = document.getElementById('fleet-filters');
  if (filters) {
    const wide = matchMedia('(min-width:768px)');
    filters.open = wide.matches;
    wide.addEventListener('change', () => { filters.open = wide.matches; });
  }

  let writing = false, pending = null, blocked = false;
  const storageKey = 'peyi-owner-write-v1:'+encodeURIComponent(me.id)+':'+location.pathname;
  function readAttempt() {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;
    const attempt = JSON.parse(raw);
    if (typeof attempt?.signature !== 'string' || !/^[a-f0-9-]{36}$/.test(attempt.key))
      throw Error('Les informations de reprise sont illisibles.');
    return attempt;
  }
  async function sameAccount() {
    const actor = await api('/me');
    if (!blocked && actor?.id === me.id && actor.owner && actor.status === 'active') return;
    blocked = true;
    document.querySelector('dialog[open]')?.close();
    main.innerHTML = `<h1 tabindex="-1">Compte propriétaire changé</h1>${notice('Rechargez avec le compte courant pour retrouver son espace.','warning')}${link('/owner','Recharger mon espace','secondary')}`;
    main.querySelector('h1').focus();
    throw Error('Le compte propriétaire a changé.');
  }

  async function currentData() {
    const data = await api('/bootstrap');
    await sameAccount();
    if (data.me?.id !== me.id) throw Error('Le compte propriétaire a changé. Rechargez la page.');
    return data;
  }

  const snapshot = (vehicle,documents) => JSON.stringify([vehicle,documents]);
  const original = v && snapshot(v,docs);
  const currentVehicle = data => data.owned.find(vehicle=>vehicle.id===id && vehicle.ownerId===me.id);
  const currentDocuments = data => data.documents.filter(doc=>doc.vehicleId===id);
  function verifyVehicle(fresh) {
    const actual = currentVehicle(fresh);
    if (actual && snapshot(actual,currentDocuments(fresh)) === original) return;
    const slot = document.getElementById('owner-context');
    slot.textContent = 'Annonce ou documents modifiés. Votre saisie reste ici. Actualisez et réexaminez avant d’agir. ';
    const reload = document.createElement('a');
    reload.href = location.pathname+location.search+location.hash;
    reload.textContent = 'Actualiser l’annonce';
    slot.append(reload);
    throw Error('Annonce ou documents modifiés : actualisez puis réexaminez la version courante.');
  }

  function finish(focus, message) {
    sessionStorage.removeItem(storageKey);
    pending = null;
    const url = location.pathname + location.search + (focus === 'calendar-title' ? '#owner-calendar' : location.hash);
    history.replaceState({...history.state,ownerFocus:focus},'',url);
    flash(message);
    location.reload();
  }

  async function submit(path, body, {matches, message, focus, verify = verifyVehicle}) {
    if (blocked || writing) throw Error('Une vérification est déjà en cours.');
    const signature = JSON.stringify([path,body]);
    if (pending && pending.signature !== signature)
      throw Error('Un envoi reste à vérifier. Reprenez la même action avec les mêmes valeurs.');
    writing = true;
    try {
      await sameAccount();
      const data = await currentData();
      if (pending && matches(data)) { finish(focus,message); return; }
      verify(data);
      const previous = readAttempt();
      pending ??= previous?.signature === signature ? previous : {signature,key:crypto.randomUUID()};
      sessionStorage.setItem(storageKey,JSON.stringify(pending));
      try {
        await api(path,body,'POST',pending.key);
      } catch (error) {
        if (error.status >= 400 && error.status < 500) {
          sessionStorage.removeItem(storageKey);
          pending = null;
          if ([401,403].includes(error.status)) await sameAccount();
          throw error;
        }
        const fresh = await currentData();
        if (!matches(fresh)) throw Error('Le résultat reste à vérifier. Votre saisie est conservée. Confirmez de nouveau les mêmes valeurs pour réessayer.');
      }
      await sameAccount();
      finish(focus,message);
    } finally {
      writing = false;
    }
  }

  const managePath = action => pathFor(id)+'/'+action;
  const windowDate = value => value+':00-04:00';
  bindActions('[data-reply]', el => {
    const review = reviews.find(item=>item.id===el.dataset.reply);
    const findReview = data => data.reviews.find(item=>item.id===review.id && item.ownerId===me.id);
    modal('Répondre à l’avis',textarea('Votre réponse publique','reply',review.reply || '','required minlength="3" maxlength="1000"'),values => {
      const reply = values.reply.trim();
      if (reply.length < 3) throw Error('La réponse doit comporter au moins trois caractères.');
      return submit('/reviews/'+encodeURIComponent(review.id),{reply},{
        verify: data => {
          const latest = findReview(data);
          if (!latest || latest.reply !== review.reply) throw Error('Cet avis a changé. Rouvrez-le avant de répondre.');
        },
        matches: data => findReview(data)?.reply === reply,
        focus:'owner-reputation-title',message:'Réponse enregistrée.'
      });
    });
  });
  bindForm('edit-vehicle', values => {
    const body = {name:values.name.trim(),price:Number(values.price),description:values.description.trim()};
    return submit(managePath('edit'),body,{
      matches: data => Object.entries(body).every(([key,value])=>currentVehicle(data)?.[key]===value),
      focus:'owner-vehicle-title',message:'Annonce mise à jour.'
    });
  });
  bindForm('block-dates', values => {
    if (!localDate(values.start) || !localDate(values.end) || values.end <= values.start)
      throw Error('La fin du blocage doit suivre son début · heure Guadeloupe.');
    const body = {start:windowDate(values.start),end:windowDate(values.end)};
    const knownBlocks = new Set((v.availability.blocked || []).map(block=>block.id));
    modal('Bloquer cette période ?',`<p>Du ${safeDate(body.start)} au ${safeDate(body.end)} · heure de Guadeloupe.</p>`,() =>
      submit(managePath('block'),body,{
        matches: data => !!currentVehicle(data)?.availability?.blocked.some(block=>!knownBlocks.has(block.id)
          && Date.parse(block.start)===Date.parse(body.start) && Date.parse(block.end)===Date.parse(body.end)),
        focus:'calendar-title',message:'Blocage manuel enregistré.'
      }));
  });
  bindActions('[data-unblock]', el => {
    const blockId = el.dataset.unblock;
    const block = (v.availability.blocked || []).find(item=>item.id===blockId);
    modal('Libérer ce blocage ?',`<p>Du ${safeDate(block.start)} au ${safeDate(block.end)} · heure de Guadeloupe.</p>`,() =>
      submit(managePath('unblock'),{id:blockId},{
        matches:data=>!!currentVehicle(data) && !currentVehicle(data).availability.blocked.some(item=>item.id===blockId),
        focus:'calendar-title',message:'Blocage manuel levé.'
      }));
  });
  bindActions('[data-document]', el => {
    const kind = el.dataset.document;
    const previous = docs.find(item=>item.kind===kind)?.version || 0;
    modal('Remplacer ce document ?',notice('Un justificatif synthétique sera créé pour '+escape(kind)+'. Sa nouvelle version devra être revue.'),() =>
      submit('/documents',{kind,vehicleId:id},{
        matches:data=>currentDocuments(data).some(item=>item.kind===kind && item.version>previous),
        focus:'owner-documents-title',message:'Nouvelle version soumise au contrôle.'
      }));
  });
  const transitions = {
    pause: ['Mettre cette annonce en pause ?','paused','Annonce mise en pause.'],
    resume: ['Remettre cette annonce en ligne ?','published','Annonce remise en ligne.'],
    remove: ['Retirer ce véhicule ?','withdrawn','Annonce retirée.']
  };
  bindActions('[data-manage]', el => {
    const action = el.dataset.manage;
    const [title,status,message] = transitions[action];
    modal(title,'<p>Les locations déjà acceptées restent à traiter. L’API vérifie les contrôles et les conflits.</p>',() =>
      submit(managePath(action),{},{
        matches:data=>currentVehicle(data)?.status===status,
        focus:'owner-vehicle-title',message
      }));
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !blocked) sameAccount().catch(() => {});
  });
  if (v) {
    bindCalendar(v,rs);
    try {
      const attempt = readAttempt();
      if (attempt) {
        const [path,body] = JSON.parse(attempt.signature);
        const form = document.getElementById('block-dates');
        if (path === managePath('block')) {
          form.elements.start.value = localRentalDate(body.start);
          form.elements.end.value = localRentalDate(body.end);
          document.getElementById('owner-context').textContent = 'Blocage à vérifier. Rouvrez le calendrier pour reprendre la période saisie.';
        }
      }
    } catch {
      document.getElementById('owner-context').textContent = 'La reprise est indisponible dans cet onglet. Vérifiez l’état de l’annonce.';
    }
  }
  const focus = history.state?.ownerFocus;
  if (focus) {
    const state = {...history.state};
    delete state.ownerFocus;
    history.replaceState(state,'');
    document.getElementById(focus)?.focus();
  } else if (location.hash) {
    document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'});
  }
}
