import {api} from '../http.js';
import {escape,icon,field,select,notice,modal,bindForm,errorSlot} from '/ui/components.js';
import {parseSearch,searchURL,vehicleURL,apiSearch,filterKeys,choices,resetFilters} from './search-state.js';
import {saveRecentSearch} from './explorer-state.js';
import {card} from './vehicle-card.js';
import {bindVehicleMedia} from './vehicle-media.js';

const periodLabel = state => {
  const from = state.params.get('from'), until = state.params.get('until');
  if (!from && !until) return 'Dates et heures à préciser · Heure de Guadeloupe';
  if (!state.period.startLocal || !state.period.endLocal) return 'Période reçue : '+(from || 'départ manquant')+' → '+(until || 'retour manquant');
  const format = value => new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'UTC'}).format(new Date(value+':00Z'));
  return format(state.period.startLocal)+' → '+format(state.period.endLocal)+' · Guadeloupe';
};

const filterLabels = {
  category: 'Catégorie', max: 'Budget maximum / jour fictif', gearbox: 'Transmission',
  fuel: 'Énergie', seats: 'Places minimum', equipment: 'Équipement',
};

function filterChips(params) {
  return filterKeys.filter(key => params.has(key)).map(key => {
    const value = params.get(key);
    const caption = key === 'max' ? value+' € max.' : key === 'seats' ? value+' places min.' : value;
    const next = new URLSearchParams(params);
    next.delete(key);
    next.delete('state');
    return `<a class="button secondary" href="${escape(searchURL(next))}" aria-label="${escape('Retirer le filtre '+filterLabels[key]+' : '+value)}">${escape(caption)} ${icon('close')}</a>`;
  }).join('');
}

const skeletons = '<div class="vehicle-grid results-cards" aria-hidden="true">'+
  '<div class="search-skeleton"><div></div></div>'.repeat(3)+'</div>';

export async function search() {
  const state = parseSearch(location.search), p = state.params, main = document.getElementById('main');
  if (!state.errors.length) history.replaceState(null,'',searchURL(p));
  const count = filterKeys.filter(key=>p.get(key)).length;
  const option = (label,key,values=choices[key]) => {
    const options = [['','Indifférent'],...values];
    if (p.get(key) && !values.map(String).includes(p.get(key))) options.push([p.get(key),'Valeur non reconnue : '+p.get(key)]);
    return select(label,key,options,p.get(key)||'');
  };
  const viewLink = view => {
    const map = view === 'map', next = new URLSearchParams(p);
    if (map) next.set('view','map');
    else next.delete('view');
    const active = (p.get('view') === 'map') === map;
    return `<a class="button secondary" href="${escape(searchURL(next))}" ${map?'aria-label="Carte simulée"':''} ${active?'aria-current="page"':''}>${icon(map?'pin':'menu')} ${map?'Carte':'Liste'}</a>`;
  };
  const advanced = p.has('fuel') || p.has('equipment');
  main.innerHTML = `<div class="results-page v32">
    <header class="results-heading">
      <p class="eyebrow">Location entre particuliers</p>
      <h1>Trouvez votre prochaine voiture.</h1>
      <div class="search-summary">
        <div><strong>${icon('pin')} ${escape(p.get('q') || 'Toute la Guadeloupe')}</strong><p>${escape(periodLabel(state))}</p></div>
        <button type="button" class="secondary" id="edit-search" aria-label="Modifier la recherche">Modifier</button>
      </div>
    </header>
    <div id="search-validation">
      ${state.warnings.map(w=>notice(escape(w),'warning')).join('')}
      ${state.errors.length?`<div role="alert">${notice('<strong>Recherche à corriger</strong><ul>'+state.errors.map(e=>`<li>${escape(e)}</li>`).join('')+'</ul>','error')}</div>`:''}
    </div>
    <div class="results-toolbar">
      <button type="button" id="filter-toggle" aria-haspopup="dialog" aria-controls="search-filter-dialog" aria-expanded="false">${icon('grid')} Filtres${count?' ('+count+')':''}</button>
      <nav aria-label="Affichage des résultats">${viewLink('list')}${viewLink('map')}</nav>
      <form id="sort-form">${option('Trier par','sort',choices.sort)}</form>
    </div>
    <div class="results-layout">
      <aside class="results-sidebar" id="filter-home" aria-labelledby="sidebar-filter-title">
        <h2 id="sidebar-filter-title">Affinez la recherche</h2>
        <form id="search-filters">
          ${field(filterLabels.max,'max',p.get('max')||'','number','min="1" max="1000" step="any" placeholder="Ex. 45 €"')}
          ${option(filterLabels.category,'category')}
          ${option(filterLabels.gearbox,'gearbox')}
          ${option(filterLabels.seats,'seats',[1,2,3,4,5,6,7,8,9])}
          <details${advanced?' open':''}>
            <summary>Motorisation et équipements</summary>
            ${option(filterLabels.fuel,'fuel')}
            ${option(filterLabels.equipment,'equipment')}
          </details>
          ${errorSlot}
          <div class="filter-actions">
            <button type="submit">Appliquer les filtres</button>
            <button type="button" class="link-button" id="reset-filters">Réinitialiser les filtres</button>
            <button type="button" class="link-button filter-cancel" data-cancel-filters>Annuler</button>
          </div>
        </form>
      </aside>
      <section class="search-results" aria-labelledby="result-count">
        <div class="results-head">
          <div><h2 id="result-count" tabindex="-1">${state.errors.length?'Recherche à corriger':'Résultats'}</h2><p>Annonces et prix de démonstration</p></div>
          ${count?`<nav class="results-chips" aria-label="Filtres appliqués">${filterChips(p)}</nav>`:''}
        </div>
        <span class="search-announcement" role="status"></span>
        <span class="search-announcement" role="alert" id="search-alert"></span>
        <div id="search-items" aria-busy="${!state.errors.length}">${state.errors.length?'':skeletons}</div>
      </section>
    </div>
    <dialog id="search-filter-dialog" class="search-filter-dialog v32" aria-labelledby="filter-dialog-title">
      <div class="row between"><h2 id="filter-dialog-title">Filtres</h2><button type="button" class="secondary" data-close-filters aria-label="Fermer les filtres">${icon('close')}</button></div>
      <div id="filter-dialog-content"></div>
    </dialog>
  </div>`;
  // Replace technical sort values with stable human labels, preserving unknown values for correction.
  const sort = main.querySelector('#sort-form select');
  for (const option of sort.options) if (['','price','rating'].includes(option.value)) option.textContent = {'':'Pertinence',price:'Prix croissant',rating:'Meilleure note'}[option.value];
  sort.onchange = () => {const next=new URLSearchParams(p);next.delete('sort');if(sort.value)next.set('sort',sort.value);location.href=searchURL(next);};
  main.querySelector('#sort-form').onsubmit = e => e.preventDefault();
  function editSearch() {
    const d=modal('Modifier la recherche',`${field('Votre destination','q',p.get('q')||'','search','maxlength="120"')}${field('Départ · heure Guadeloupe','from',state.period.startLocal,'datetime-local')}${field('Retour · heure Guadeloupe','until',state.period.endLocal,'datetime-local')}<p>Heure de Guadeloupe. Les filtres et le mode d’affichage restent appliqués.</p>${state.errors.length?notice(escape(periodLabel(state)),'warning'):''}`, values => {
      const next=new URLSearchParams(p);for(const key of ['q','from','until']){next.delete(key);next.set(key,values[key]);}next.delete('state');
      const edited=parseSearch(next);if(edited.errors.length)throw Error(edited.errors[0]);location.href=searchURL(edited.params);
    });
    d.querySelector('[type=submit]').textContent='Rechercher';
  }
  main.querySelector('#edit-search').onclick=editSearch;
  const form=main.querySelector('#search-filters'), home=main.querySelector('#filter-home'), dialog=main.querySelector('#search-filter-dialog'), trigger=main.querySelector('#filter-toggle');
  const desktop = matchMedia('(min-width:880px)');
  const moreFilters = form.querySelector('details');
  const clearDraftError = () => {
    form.querySelector('.form-error').replaceChildren();
    form.querySelectorAll('[data-lp-invalid]').forEach(control => {
      control.removeAttribute('aria-invalid');
      delete control.dataset.lpInvalid;
    });
    form.querySelectorAll('[aria-describedby]').forEach(control => control.removeAttribute('aria-describedby'));
  };
  let resizeFocus;
  function openFilters(focus) {
    if (dialog.open) return;
    dialog.querySelector('#filter-dialog-content').append(form);
    trigger.setAttribute('aria-expanded','true');
    dialog.showModal();
    (focus || dialog.querySelector('[data-close-filters]')).focus();
  }
  trigger.onclick=()=>openFilters();
  dialog.addEventListener('close',()=>{
    home.append(form);
    trigger.setAttribute('aria-expanded','false');
    if (resizeFocus) {
      const focus = resizeFocus;
      resizeFocus = null;
      if (desktop.matches) focus.focus();
      else openFilters(focus);
      return;
    }
    form.reset();
    moreFilters.open = advanced;
    clearDraftError();
    (desktop.matches ? form.elements.max : trigger).focus();
  });
  desktop.addEventListener('change',()=>{
    if (desktop.matches && dialog.open) {
      resizeFocus = form.contains(document.activeElement) ? document.activeElement : form.elements.max;
      dialog.close();
    } else if (!desktop.matches && form.contains(document.activeElement)) {
      openFilters(document.activeElement);
    }
  });
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const controls=[...dialog.querySelectorAll('button:not(:disabled), input, select, summary')].filter(control=>
      control.getClientRects().length && (control.matches('summary') || !control.closest('details:not([open])')));
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey && document.activeElement===first) {
      event.preventDefault();
      last.focus();
    } else if(!event.shiftKey && document.activeElement===last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.querySelector('[data-close-filters]').onclick=()=>dialog.close();
  form.querySelector('[data-cancel-filters]').onclick=()=>dialog.close();
  form.querySelector('#reset-filters').onclick=()=>{
    for(const key of filterKeys)form.elements[key].value='';
    clearDraftError();
  };
  bindForm(form,values=>{
    const next=resetFilters(p);for(const key of filterKeys)if(values[key])next.set(key,values[key]);
    const edited=parseSearch(next);if(edited.errors.length)throw Error(edited.errors[0]);location.href=searchURL(edited.params);
  });
  if(state.ui.openFilters) {
    if(desktop.matches) form.elements.max.focus();
    else openFilters();
  }
  if(state.errors.length)return;
  const items=main.querySelector('#search-items'), heading=main.querySelector('#result-count');
  const status = main.querySelector('.search-announcement[role="status"]'), alert = main.querySelector('#search-alert');
  async function load() {
    const retry=items.querySelector('#retry-search');
    const restoreFocus=retry===document.activeElement;
    alert.textContent='';
    status.textContent='Recherche en cours…';
    items.setAttribute('aria-busy','true');
    if(retry) {
      retry.disabled=true;
      retry.textContent='Nouvel essai en cours…';
    }
    try {
      let vehicles=await api('/vehicles?'+apiSearch(state));
      if(!Array.isArray(vehicles))throw Error('La réponse du catalogue est indisponible.');
      saveRecentSearch(p);if(state.ui.empty)vehicles=[];
      heading.textContent=vehicles.length+' véhicule'+(vehicles.length>1?'s':'');
      if(!vehicles.length) {
        items.innerHTML=`<div class="search-state search-empty"><h3>Aucun véhicule ici</h3><p>Essayez des filtres plus larges ou d’autres critères de remise.</p><div class="row"><a class="button secondary" href="${escape(searchURL(resetFilters(p)))}">Élargir la recherche</a><button type="button" class="link-button" id="empty-edit">Changer la destination ou les dates</button></div></div>`;
        items.querySelector('#empty-edit').onclick=editSearch;
      } else {
        items.innerHTML=(p.get('view')==='map'?`<div class="map search-map" role="region" aria-label="Carte schématique fictive"><div class="map-pins">${vehicles.map(v=>`<a href="${escape(vehicleURL(v.id,p))}" aria-label="${escape(v.name)} ${escape(String(v.price))} euros par jour fictif">${escape(String(v.price))} €</a>`).join('')}</div><p>Carte schématique fictive · positions indicatives, sans géolocalisation</p></div>`:'')+`<div class="vehicle-grid results-cards">${vehicles.map((v,i)=>card(v,{context:p,priority:i===0})).join('')}</div>`;
        bindVehicleMedia(items);
      }
      if(restoreFocus)heading.focus();
      status.textContent=restoreFocus?'':heading.textContent;
    } catch(error) {
      heading.textContent='Résultats indisponibles';
      items.innerHTML=`<div class="search-state"><h3>Catalogue indisponible</h3><p>${escape(error.message)} Vos critères sont conservés.</p><div class="row"><button class="secondary" type="button" id="retry-search" aria-label="Réessayer la recherche">Réessayer</button><a class="button link-button" href="/demo">Démo & comptes</a><a class="button link-button" href="/demo/audit">Atelier d’audit</a></div></div>`;
      status.textContent='';
      alert.textContent=heading.textContent+'. '+error.message;
      items.querySelector('#retry-search').onclick=load;
      if(restoreFocus)items.querySelector('#retry-search').focus();
    } finally {items.setAttribute('aria-busy','false');}
  }
  await load();
}
