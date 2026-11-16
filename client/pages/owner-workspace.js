import {api} from '../http.js';
import {ownerNav} from '../shell.js';
import {escape,icon,link,notice,empty,field,textarea,errorSlot,bindForm,bindActions,modal,flash,money,date,badge} from '/ui/components.js';
import {vehicleMedia,bindVehicleMedia} from './vehicle-media.js';
import {vehiclePresentation} from './vehicle-presentation.js';
import {rentalNext,localRentalDate} from './booking-state.js';
import {localDate} from './search-state.js';
import {ownerSections,ownerGroups,ownerBufferKey,restoreOwnerBuffer,cleanOwnerDraft,validOwnerStep,sectionForStep,ownerCalendarItems} from './owner-state.js';

const pathFor = id => '/owner/vehicles/'+encodeURIComponent(id);
const safeDate = value => value && Number.isFinite(Date.parse(value)) ? date(value) : 'Date non renseignée';
function media(v, hero=false) {
  const m=vehicleMedia(v);
  return `<div class="catalogue-media ${hero?'owner-hero-media':'owner-vehicle-thumb'}"><img data-vehicle-image data-photo="${m.photo}" data-fallback="${m.fallback}" data-vehicle-name="${escape(v.name)}" src="${m.src}" ${hero&&m.srcset?`srcset="${m.srcset}" sizes="(min-width:1024px) 720px, 100vw"`:''} alt="${escape(m.alt)}" width="${hero?m.width:64}" height="${hero?m.height:64}"><span class="media-label ${hero?'':'sr-only'}">${m.photo?'Photo de démonstration':'Illustration fictive'}</span></div>`;
}
function vehicleList(vs) {
  return vs.length?`<div class="owner-vehicle-list">${vs.map(v=>`<article class="card owner-vehicle-row">${media(v)}<div>${badge(v.status)}<h2>${escape(v.name)}</h2><p>${escape(v.city)} · ${money(v.price)} / jour fictif</p>${link(pathFor(v.id),'Gérer le véhicule','secondary')}<a class="owner-text-link" href="${pathFor(v.id)}#owner-calendar">Voir le calendrier</a></div></article>`).join('')}</div>`:empty('Aucun véhicule dans cette vue','Retrouvez les autres états dans votre parc ou préparez une annonce.',link('/owner/vehicles/new','Ajouter mon véhicule','secondary'));
}
function rentalCard(r,me) {
  const next=rentalNext(r,me.id);
  return `<article class="card owner-request"><div class="row between"><h2>${escape(r.vehicleName)}</h2>${badge(r.status)}</div><p class="owner-role">${escape(next.actor)}</p><p>${escape(r.renterName)} · ${safeDate(r.start)} → ${safeDate(r.end)}</p><p>${money(r.quote.total)} fictifs · ${escape(r.id)}</p><p>${escape(next.description)}</p><div class="owner-card-actions">${link('/rental/'+encodeURIComponent(r.id),'Examiner la demande','secondary')}<a class="owner-text-link" href="${pathFor(r.vehicleId)}#owner-calendar">Voir le calendrier</a></div></article>`;
}
function calendar(v,rs) {
  const items=ownerCalendarItems(v,rs);
  return `<section class="card owner-calendar" id="owner-calendar" aria-labelledby="calendar-title"><h2 id="calendar-title" tabindex="-1">Calendrier de disponibilité</h2><p>Ouvert du ${safeDate(v.availability.start)} au ${safeDate(v.availability.end)}.</p><p class="owner-meta">Heure de Guadeloupe · les horaires de chaque période font foi. Une demande seule ne réserve pas le créneau.</p>
    <div class="owner-calendar-desktop"><label for="owner-month">Mois à consulter</label><input type="month" id="owner-month" value="${(localRentalDate(items[0]?.start)||localRentalDate(new Date().toISOString())).slice(0,7)}"><div id="owner-month-grid"></div></div>
    <h3>Liste des périodes</h3><div class="owner-calendar-list">${items.map(item=>`<article class="owner-period ${item.kind}"><p><strong>${escape(item.label)}</strong></p>${item.status?badge(item.status):''}<p>${safeDate(item.start)} → ${safeDate(item.end)}</p>${item.kind==='blocked'?`<button class="secondary" data-unblock="${escape(item.id)}">Libérer</button>`:link('/rental/'+encodeURIComponent(item.id),item.kind==='requested'?'Ouvrir la demande':'Consulter la location','secondary')}</article>`).join('')||'<p>Aucun créneau bloqué manuellement ni location occupant la période.</p>'}</div>
    <form id="block-dates"><h3>Bloquer un créneau</h3>${field('Indisponible à partir du','start','','datetime-local','required')}${field('Jusqu’au','end','','datetime-local','required')}${errorSlot}<button type="submit">Bloquer ce créneau</button></form></section>`;
}
function bindCalendar(v,rs) {
  const input=document.getElementById('owner-month');if(!input)return;
  const items=ownerCalendarItems(v,rs);
  function render() {
    if(!/^\d{4}-\d{2}$/.test(input.value)||!localDate(input.value+'-01'))return;
    const [year,month]=input.value.split('-').map(Number),start=new Date(Date.UTC(year,month-1,1)),count=new Date(Date.UTC(year,month,0)).getUTCDate(),offset=(start.getUTCDay()+6)%7;
    document.getElementById('owner-month-grid').innerHTML=`<p class="owner-meta">Jours concernés : R = location occupant le créneau, D = demande non réservée, B = blocage manuel. Consulter les horaires dans la liste.</p><div class="owner-month-grid" role="list" aria-label="Lecture mensuelle des périodes">${['L','M','M','J','V','S','D'].map(d=>`<span aria-hidden="true" class="owner-weekday">${d}</span>`).join('')}${'<span aria-hidden="true"></span>'.repeat(offset)}${Array.from({length:count},(_,n)=>{const day=input.value+'-'+String(n+1).padStart(2,'0'),events=items.filter(i=>localRentalDate(i.start).slice(0,10)<=day&&localRentalDate(i.end).slice(0,10)>=day),marks=[...new Set(events.map(i=>i.kind==='held'?'R':i.kind==='requested'?'D':'B'))];return `<span role="listitem" class="owner-day ${events[0]?.kind||''}" aria-label="${escape(day+(events.length?' · '+events.map(e=>e.label).join(', '):' · aucune période affichée'))}">${n+1}<small>${marks.join(' ')||'·'}</small></span>`;}).join('')}</div>`;
  }
  input.onchange=render;render();
}
export async function ownerPage(section,me,id) {
  if(!me.owner){location.replace('/owner/start');return;}
  const b=await api('/bootstrap');
  let draft=null,draftError=false,buffer=null;
  if(['dashboard','vehicles'].includes(section)) {
    try{draft=cleanOwnerDraft(await api('/owner/draft'));}catch{draftError=true;}
    try{buffer=restoreOwnerBuffer(sessionStorage.getItem(ownerBufferKey(me.id)),me.id);}catch{/* No browser storage is needed to read the parc. */}
  }
  const identity=await api('/me');if(b.me.id!==me.id||identity?.id!==me.id||!identity.owner)throw Error('Le compte propriétaire a changé. Rechargez avec le compte courant.');
  const owned=b.owned,rs=b.rentals.filter(r=>r.ownerId===me.id),main=document.getElementById('main');main.classList.add('owner-main');
  const local=Object.values(buffer?.groups||{}).some(g=>Object.keys(g).length)>0,hasDraft=Boolean(local||buffer?.attempt||Object.keys(draft||{}).length),savedStep=(local?buffer.step:validOwnerStep(draft?.step))||1;
  const draftCard=hasDraft?`<article class="card owner-draft-card"><p class="owner-role">${buffer?.attempt?'Envoi à vérifier':local?'Saisie locale à reprendre':'Brouillon enregistré dans l’API'}</p><h2>${escape((local?Object.assign({},...Object.values(buffer.groups)).name:null)||draft?.name||'Votre annonce à préparer')}</h2><p>${ownerSections[sectionForStep(savedStep)].title} · ${ownerGroups[savedStep-1]}</p>${link('/owner/vehicles/new?step='+savedStep,buffer?.attempt?'Vérifier mon envoi':'Reprendre le brouillon','secondary')}</article>`:'';
  const draftWarning=draftError?notice('Le brouillon enregistré est indisponible. La saisie locale éventuelle reste séparée ; ouvrez l’assistant pour vérifier et reprendre.','warning'):'';
  let body='';
  if(section==='dashboard') {
    const actionable=rs.find(r=>r.status==='requested')||rs.find(r=>['return_reported','returned'].includes(r.status)),next=actionable&&rentalNext(actionable,me.id);
    body=`<header class="owner-heading"><p class="eyebrow">Bonjour ${escape(me.name.split(' ')[0])}</p><h1>Aujourd’hui</h1><p>${new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeZone:'America/Guadeloupe'}).format(new Date())} · Guadeloupe</p></header><div class="owner-counts"><a class="card" href="/owner/requests?tab=requested"><strong>${rs.filter(r=>r.status==='requested').length}</strong><span>Demandes à traiter</span></a><a class="card" href="/owner/vehicles"><strong>${owned.length}</strong><span>Véhicules</span></a><a class="card" href="/owner/vehicles/new"><strong>${draftError?'À vérifier':hasDraft?1:0}</strong><span>Brouillon ${local?'local':'à reprendre'}</span></a></div>
      <section class="owner-priority"><p class="eyebrow">${actionable?escape(next.actor):'Votre prochaine annonce'}</p><h2>${actionable?escape(actionable.vehicleName):'Votre parc, à votre rythme'}</h2><p>${actionable?escape(next.description):'Ajoutez un véhicule ou vérifiez les disponibilités de vos annonces. La publication reste soumise aux contrôles.'}</p>${actionable?link('/rental/'+encodeURIComponent(actionable.id),actionable.status==='requested'?'Examiner la demande':'Consulter le suivi','light'):link('/owner/vehicles/new','Ajouter un véhicule','light')}</section>
      ${draftWarning}${draftCard}<div class="section-heading section"><h2>Mon parc</h2><a class="owner-text-link" href="/owner/vehicles">Voir tous mes véhicules</a></div>${vehicleList(owned.slice(0,3))}<div class="owner-shortcuts section">${link('/owner/revenue','Revenus fictifs','secondary')}${link('/owner/reputation','Réputation et avis','secondary')}</div>`;
  }
  if(section==='vehicles') {
    const requested=new URLSearchParams(location.search).get('status')||'all',allowed=['all','published','pending','paused','changes_requested','rejected','withdrawn','draft'],filter=allowed.includes(requested)?requested:'all';
    const list=filter==='all'?owned:filter==='draft'?[]:owned.filter(v=>v.status===filter);
    body=`<div class="section-heading owner-heading"><div><h1>Mes véhicules</h1><p>Votre parc · ${owned.length} véhicule(s) dans l’API</p></div>${link('/owner/vehicles/new',icon('plus')+' Ajouter un véhicule')}</div><nav class="owner-filters" aria-label="États du parc">${[['all','Tous'],['published','Publiés'],['pending','En revue'],['paused','En pause'],['changes_requested','À corriger'],['rejected','Refusés'],['withdrawn','Retirés'],['draft','Brouillon']].map(([value,label])=>`<a href="/owner/vehicles${value==='all'?'':'?status='+value}" ${filter===value?'aria-current="page"':''}>${label}</a>`).join('')}</nav>${draftWarning}${['all','draft'].includes(filter)?draftCard:''}${filter==='draft'?(hasDraft?'':empty('Aucun brouillon à reprendre','Préparez une annonce en quatre sections.',link('/owner/vehicles/new','Ajouter mon véhicule','secondary'))):vehicleList(list)}`;
  }
  if(section==='requests') {
    const tab=new URLSearchParams(location.search).get('tab')||'all',list=rs.filter(r=>tab==='all'||r.status===tab);
    body=`<header class="owner-heading"><h1>Demandes et locations</h1><p>Décidez depuis le suivi de chaque demande, selon son état actuel.</p></header><nav class="owner-filters" aria-label="États des demandes">${[['all','Toutes ('+rs.length+')'],['requested','À traiter'],['in_progress','En cours'],['return_reported','Retours'],['completed','Clôturées']].map(([value,label])=>`<a href="/owner/requests${value==='all'?'':'?tab='+value}" ${tab===value?'aria-current="page"':''}>${label}</a>`).join('')}</nav>${list.length?`<div class="owner-request-list">${list.map(r=>rentalCard(r,me)).join('')}</div>`:empty('Aucune demande dans cette vue','Les nouvelles demandes apparaissent après actualisation.',link('/demo','Créer un scénario','secondary'))}<button class="secondary section" id="refresh">${icon('refresh')}Actualiser</button>`;
  }
  if(section==='revenue') {
    const paid=rs.filter(r=>r.payment==='simulated_paid');
    body=`<header class="owner-heading"><h1>Mes revenus fictifs</h1></header>${notice('Montants bruts illustratifs. Aucun versement, délai ni commission de 25 % n’est appliqué.')}<div class="owner-counts section"><article class="card"><strong>${money(paid.reduce((n,r)=>n+r.quote.total,0))}</strong><span>Volume simulé</span></article><article class="card"><strong>Fictif</strong><span>Profil de versement</span></article><article class="card"><strong>Non défini</strong><span>Net à verser</span></article></div>${paid.length?`<div class="owner-request-list section">${paid.map(r=>`<article class="card"><h2>${escape(r.vehicleName)}</h2><p>${money(r.quote.total)} bruts fictifs</p>${badge(r.status)}${link('/rental/'+encodeURIComponent(r.id),'Consulter','secondary')}</article>`).join('')}</div>`:empty('Aucun paiement simulé','Les locations payées alimenteront cette vue.')}<p class="section">Les ajustements et retenues ne sont jamais automatiques.</p>${link('/cases/new?kind=Caution%20contestée','Contacter le support','secondary')}`;
  }
  if(section==='reputation') {
    const reviews=b.reviews.filter(r=>r.ownerId===me.id);
    body=`<header class="owner-heading"><h1>Réputation et avis</h1></header>${reviews.length?`<div class="owner-request-list">${reviews.map(r=>`<article class="card"><h2>${r.vehicleRating??r.rating} / 5 ${icon('star')}</h2>${badge(r.status)}<p>${escape(r.comment)}</p>${r.reply?notice('Votre réponse : '+escape(r.reply)):''}<button class="secondary" data-reply="${escape(r.id)}">Répondre à cet avis</button></article>`).join('')}</div>`:empty('Votre réputation se construit','Les avis des locations terminées apparaîtront ici.')}`;
  }
  const v=section==='vehicle'?owned.find(v=>v.id===id):null,docs=b.documents.filter(d=>d.vehicleId===id);
  if(section==='vehicle') {
    if(!v)throw Error('Véhicule introuvable dans votre espace.');
    const condition=vehiclePresentation(v).condition;
    body=`<a class="owner-back" href="/owner/vehicles">${icon('back')}Mon parc</a><header class="section-heading owner-heading"><div><h1>${escape(v.name)}</h1><p class="owner-meta">Version de l’annonce ${v.version} · ${escape(v.city)}</p></div>${badge(v.status)}</header><p id="owner-context" role="status"></p>${v.reason?notice(escape(v.reason),'warning'):''}<div class="owner-detail-layout"><div class="owner-detail-content">${media(v,true)}
      <nav class="owner-shortcuts" aria-label="Gérer cette annonce"><a class="card" href="#owner-calendar">${icon('calendar')}Calendrier</a><a class="card" href="#owner-condition">${icon('camera')}État et photos</a><a class="card" href="#owner-documents">${icon('file')}Documents</a><a class="card" href="/vehicle/${encodeURIComponent(v.id)}">${icon('car')}Aperçu de la fiche</a></nav>
      <section class="card" id="owner-condition"><h2>État et photos</h2>${condition?`<p>Exemple visuel fictif lié à la fixture v1 · ${escape(condition.date)}</p><p><strong>${escape(condition.zone)} · ${escape(condition.title)}</strong></p><p>${escape(condition.description)}</p>`:'<p>État non renseigné. Aucune déclaration physique structurée n’est fournie par l’API pour ce véhicule.</p>'}<p class="owner-meta">Les justificatifs et les constats ont leurs propres contrôles. L’édition structurée des défauts n’est pas disponible dans ce mock.</p></section>
      ${calendar(v,rs)}<section class="card"><h2>Modifier les informations</h2><form id="edit-vehicle">${field('Nom du véhicule','name',v.name,'text','required maxlength="80"')}${field('Prix journalier fictif (€)','price',v.price,'number','required min="1" max="1000"')}${textarea('Description','description',v.description,'required minlength="10" maxlength="1500"')}${errorSlot}<button type="submit" ${v.status==='withdrawn'?'disabled':''}>Enregistrer les modifications</button></form>${v.status==='withdrawn'?'<p>Une annonce retirée ne peut plus être modifiée.</p>':''}</section></div>
      <aside class="owner-detail-aside"><section class="card"><h2>Gérer l’annonce</h2><div class="stack">${v.status==='published'?'<button data-manage="pause" class="secondary">Mettre en pause</button>':''}${v.status==='paused'?`<button data-manage="resume" ${v.checksPassed?'':'disabled'}>Remettre en ligne</button>${v.checksPassed?'':'<p>Revue requise avant remise en ligne.</p>'}`:''}${v.status!=='withdrawn'?'<button data-manage="remove" class="danger-button">Retirer le véhicule</button>':''}</div></section><section class="card" id="owner-documents"><h2>Documents du véhicule</h2>${docs.map(d=>`<article class="owner-document"><h3>${escape(d.kind)}</h3><p>${badge(d.status)} · version ${d.version}</p>${d.reason?`<p>${escape(d.reason)}</p>`:''}<button class="secondary" data-document="${escape(d.kind)}">Soumettre une nouvelle version fictive</button></article>`).join('')||'<p>Aucun document disponible dans votre espace pour cette annonce.</p>'}${notice('Toute nouvelle version exige une revue. Une annonce publiée repasse en contrôle ; une annonce en pause ne peut pas reprendre sans contrôles valides.','warning')}</section><section class="card"><h2>Territoire</h2><p>Guadeloupe continentale dans la simulation.</p><button disabled>Sorties inter-îles indisponibles</button></section></aside></div>`;
  }
  main.innerHTML=ownerNav()+`<div class="owner-workspace">${body}</div>`;bindVehicleMedia(main);
  document.getElementById('refresh')?.addEventListener('click',()=>location.reload());
  async function sameAccount() {const actor=await api('/me');if(actor?.id!==me.id||!actor.owner){main.innerHTML=`<h1>Compte propriétaire changé</h1>${notice('Les données précédentes ont été masquées. Rechargez avec le compte courant.','warning')}${link('/owner','Recharger mon espace','secondary')}`;throw Error('Le compte propriétaire a changé. Rechargez avec le compte courant.');}}
  const snapshot = (vehicle,documents) => JSON.stringify([vehicle,documents]);
  const original=v&&snapshot(v,docs);
  async function verifyVehicle() {
    await sameAccount();const fresh=await api('/bootstrap');await sameAccount();const actual=fresh.owned.find(x=>x.id===id);
    if(!actual||snapshot(actual,fresh.documents.filter(d=>d.vehicleId===id))!==original) {
      const slot=document.getElementById('owner-context');slot.textContent='Annonce ou documents modifiés. Votre saisie reste ici. Actualisez et réexaminez avant d’agir. ';const reload=document.createElement('a');reload.href=pathFor(id);reload.textContent='Actualiser l’annonce';slot.append(reload);
      main.querySelectorAll('[data-manage],[data-document],[data-unblock],form button[type=submit]').forEach(button=>button.disabled=true);
      throw Error('Annonce ou documents modifiés : actualisez puis réexaminez la version courante.');
    }
  }
  bindActions('[data-reply]',el=>modal('Répondre à l’avis',textarea('Votre réponse publique','reply','','required minlength="3" maxlength="1000"'),async values=>{await sameAccount();await api('/reviews/'+encodeURIComponent(el.dataset.reply),values);location.reload();}));
  bindForm('edit-vehicle',async values=>{await verifyVehicle();await api('/owner/vehicles/'+encodeURIComponent(id)+'/edit',{...values,price:Number(values.price)});flash('Annonce mise à jour.');location.reload();});
  bindForm('block-dates',async values=>{if(!localDate(values.start)||!localDate(values.end)||values.end<=values.start)throw Error('La fin du blocage doit suivre son début · heure Guadeloupe.');await verifyVehicle();await api('/owner/vehicles/'+encodeURIComponent(id)+'/block',{start:values.start+':00-04:00',end:values.end+':00-04:00'});location.hash='owner-calendar';location.reload();});
  bindActions('[data-unblock]',async el=>{await verifyVehicle();await api('/owner/vehicles/'+encodeURIComponent(id)+'/unblock',{id:el.dataset.unblock});location.hash='owner-calendar';location.reload();});
  bindActions('[data-document]',el=>modal('Remplacer ce document ?',notice('Un justificatif synthétique sera créé pour '+escape(el.dataset.document)+'. Sa nouvelle version devra être revue. N’envoyez aucun vrai document.'),async()=>{await verifyVehicle();await api('/documents',{kind:el.dataset.document,vehicleId:id});location.reload();}));
  bindActions('[data-manage]',el=>modal({pause:'Mettre cette annonce en pause ?',resume:'Remettre cette annonce en ligne ?',remove:'Retirer ce véhicule ?'}[el.dataset.manage],'<p>Les locations déjà acceptées restent à traiter. Les contrôles et conflits restent vérifiés par l’API.</p>',async()=>{await verifyVehicle();await api('/owner/vehicles/'+encodeURIComponent(id)+'/'+el.dataset.manage,{});location.reload();}));
  if(v)bindCalendar(v,rs);
  if(location.hash){const target=document.getElementById(location.hash.slice(1));target?.scrollIntoView({block:'start'});}
}
