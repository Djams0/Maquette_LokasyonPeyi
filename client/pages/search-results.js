import {api} from '../http.js';
import {escape,icon,field,select,notice,modal,bindForm,errorSlot} from '/ui/components.js';
import {parseSearch,searchURL,vehicleURL,apiSearch,filterKeys,choices,resetFilters} from './search-state.js';
import {saveRecentSearch} from './explorer-state.js';
import {card} from './vehicle-card.js';
import {bindVehicleMedia} from './vehicle-media.js';

const periodLabel = state => {
  const from = state.params.get('from'), until = state.params.get('until');
  if (!from && !until) return 'Dates à choisir · heure Guadeloupe';
  if (!state.period.startLocal || !state.period.endLocal) return 'Période reçue : '+(from || 'départ manquant')+' → '+(until || 'retour manquant');
  const format = value => new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'UTC'}).format(new Date(value+':00Z'));
  return format(state.period.startLocal)+' → '+format(state.period.endLocal)+' · Guadeloupe';
};
export async function search() {
  const state = parseSearch(location.search), p = state.params, main = document.getElementById('main');
  if (!state.errors.length) history.replaceState(null,'',searchURL(p));
  const count = filterKeys.filter(key=>p.get(key)).length;
  const option = (label,key,values=choices[key]) => {
    const options = [['','Indifférent'],...values];
    if (p.get(key) && !values.map(String).includes(p.get(key))) options.push([p.get(key),'Valeur non reconnue : '+p.get(key)]);
    return select(label,key,options,p.get(key)||'');
  };
  const viewLink = (view,label) => {const next=new URLSearchParams(p);if(view==='list')next.delete('view');else next.set('view',view);const active=(p.get('view')==='map'?'map':'list')===view;return `<a href="${escape(searchURL(next))}" ${active?'aria-current="page" class="active"':''}>${label}</a>`;};
  main.innerHTML = `<div class="results-page"><header class="results-heading"><p class="eyebrow">À votre rythme, au Péyi</p><h1>Résultats</h1><div class="search-summary card"><div><strong>${escape(p.get('q') || 'Toute la Guadeloupe')}</strong><p>${escape(periodLabel(state))}</p></div><button type="button" class="secondary" id="edit-search">${icon('search')}Modifier la recherche</button></div></header><div id="search-validation">${state.warnings.map(w=>notice(escape(w),'warning')).join('')}${state.errors.length?notice('<strong>Recherche à corriger</strong><ul>'+state.errors.map(e=>`<li>${escape(e)}</li>`).join('')+'</ul>','error'):''}</div><div class="results-toolbar"><button type="button" class="secondary" id="filter-toggle" aria-haspopup="dialog" aria-controls="search-filter-dialog">Filtres${count?' ('+count+')':''} ${icon('grid')}</button><nav class="tabs" aria-label="Affichage des résultats">${viewLink('list','Liste')}${viewLink('map','Carte simulée')}</nav><form id="sort-form">${option('Trier par','sort',choices.sort.map(v=>v))}</form></div><div class="results-layout"><aside class="card results-sidebar" id="filter-home" aria-labelledby="sidebar-filter-title"><h2 id="sidebar-filter-title">Filtres</h2><form id="search-filters">${field('Prix maximum / jour fictif','max',p.get('max')||'','number','min="1" max="1000" step="any"')}${option('Catégorie','category')}${option('Boîte','gearbox')}${option('Énergie','fuel')}${option('Places minimum','seats',[1,2,3,4,5,6,7,8,9])}${option('Équipement','equipment')}${errorSlot}<div class="filter-actions"><button type="button" class="secondary" id="reset-filters">Réinitialiser les filtres</button><button class="full" type="submit">Appliquer les filtres</button><button type="button" class="secondary filter-cancel" data-cancel-filters>Annuler</button></div><p class="filter-note">La destination, les dates, le tri et l’affichage sont conservés.</p></form></aside><section class="search-results" aria-labelledby="result-count"><h2 id="result-count" tabindex="-1">${state.errors.length?'Recherche à corriger':'Chargement des véhicules…'}</h2><div id="search-items" aria-busy="${!state.errors.length}">${state.errors.length?'':`<div class="vehicle-grid">${[1,2].map(()=>'<div class="card"><div class="explorer-image-placeholder"></div><p role="status">Recherche en cours…</p></div>').join('')}</div>`}</div></section></div><p class="explorer-disclaimer">Véhicules, positions et tarifs de démonstration, sans offre commerciale.</p></div><dialog id="search-filter-dialog" class="search-filter-dialog" aria-labelledby="filter-dialog-title"><div class="row between"><h2 id="filter-dialog-title">Filtres</h2><button type="button" class="secondary" data-close-filters aria-label="Fermer les filtres">${icon('close')}</button></div><div id="filter-dialog-content"></div></dialog>`;
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
  const resetDraft = () => {form.reset();form.querySelector('.form-error').replaceChildren();form.querySelectorAll('[aria-describedby]').forEach(el=>el.removeAttribute('aria-describedby'));};
  trigger.onclick=()=>{resetDraft();dialog.querySelector('#filter-dialog-content').append(form);dialog.showModal();trigger.setAttribute('aria-expanded','true');};
  dialog.addEventListener('close',()=>{home.append(form);resetDraft();trigger.setAttribute('aria-expanded','false');trigger.focus({preventScroll:true});});
  dialog.querySelector('[data-close-filters]').onclick=()=>dialog.close();
  form.querySelector('[data-cancel-filters]').onclick=()=>dialog.close();
  form.querySelector('#reset-filters').onclick=()=>{for(const key of filterKeys)form.elements[key].value='';};
  bindForm(form,values=>{
    const next=resetFilters(p);for(const key of filterKeys)if(values[key])next.set(key,values[key]);
    const edited=parseSearch(next);if(edited.errors.length)throw Error(edited.errors[0]);location.href=searchURL(edited.params);
  });
  if(state.ui.openFilters)trigger.click();
  if(state.errors.length)return;
  const items=main.querySelector('#search-items'), heading=main.querySelector('#result-count');
  async function load() {
    const retry=items.querySelector('#retry-search'), restoreFocus=retry===document.activeElement;
    items.setAttribute('aria-busy','true');if(retry)retry.disabled=true;
    try {
      let vehicles=await api('/vehicles?'+apiSearch(state));
      if(!Array.isArray(vehicles))throw Error('La réponse du catalogue est indisponible.');
      saveRecentSearch(p);if(state.ui.empty)vehicles=[];
      heading.textContent=vehicles.length+' véhicule'+(vehicles.length>1?'s':'');
      if(!vehicles.length) {
        items.innerHTML=`<div class="empty card search-empty"><img src="/assets/illustrations/catalogue-vide.svg" width="640" height="400" alt=""><h3>Aucun véhicule ici</h3><p>Essayez une autre destination, des dates différentes ou des filtres plus larges.</p><a class="button" href="${escape(searchURL(resetFilters(p)))}">Élargir la recherche</a><button type="button" class="secondary" id="empty-edit">Changer la destination ou les dates</button></div>`;
        items.querySelector('#empty-edit').onclick=editSearch;
      } else {
        items.innerHTML=(p.get('view')==='map'?`<div class="map search-map" role="region" aria-label="Carte schématique fictive"><div class="map-pins">${vehicles.map(v=>`<a href="${escape(vehicleURL(v.id,p))}" aria-label="${escape(v.name)} ${escape(String(v.price))} euros par jour fictif">${escape(String(v.price))} €</a>`).join('')}</div><p>Carte schématique fictive · positions indicatives, sans géolocalisation</p></div>`:'')+`<div class="vehicle-grid results-cards">${vehicles.map((v,i)=>card(v,{context:p,priority:i===0})).join('')}</div>`;
        bindVehicleMedia(items);
      }
      if(restoreFocus)heading.focus({preventScroll:true});
    } catch(error) {
      heading.textContent='Résultats indisponibles';
      items.innerHTML=`<div class="card">${notice(escape(error.message),'error')}<button type="button" id="retry-search">Réessayer la recherche</button><p><a href="/demo">Démo & comptes</a> · <a href="/demo/audit">Atelier d’audit</a></p></div>`;
      items.querySelector('#retry-search').onclick=load;
      if(restoreFocus)items.querySelector('#retry-search').focus({preventScroll:true});
    } finally {items.setAttribute('aria-busy','false');}
  }
  await load();
}
