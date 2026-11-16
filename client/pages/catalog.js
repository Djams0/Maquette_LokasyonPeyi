import {api} from '../http.js';
import {searchError,loadRecentSearch,saveRecentSearch} from './explorer-state.js';
import {bindVehicleMedia} from './vehicle-media.js';
import {escape,icon,link,field,select,notice,empty,money,modal,bindForm,toast,errorSlot} from '/ui/components.js';
import {card} from './vehicle-card.js';
export {card} from './vehicle-card.js';
export {search} from './search-results.js';
export function dateDefaults(){const d=new Date();d.setUTCDate(d.getUTCDate()+2);const start=d.toISOString().slice(0,10)+'T09:00';d.setUTCDate(d.getUTCDate()+3);return{start,end:d.toISOString().slice(0,10)+'T09:00'};}
export const toUTC=v=>new Date(v+'-04:00').toISOString();
export function searchBox(params = new URLSearchParams(), {compact = false} = {}) {
  return `<form class="search-box ${compact ? 'explorer-search' : ''}" ${compact ? 'id="explorer-search" aria-label="Rechercher un véhicule"' : ''} action="/search" method="get">${field('Votre destination','q',params.get('q') || '','search','placeholder="Ville, aéroport…" maxlength="120"')}${compact ? '<div class="explorer-dates">' : ''}${field('Départ','from',params.get('from') || '','date') }${field('Retour','until',params.get('until') || '','date')}${compact ? '</div><p class="explorer-timezone">Dates et remise · heure Guadeloupe</p>' : select('Catégorie','category',[['','Tous les véhicules'],'Citadine','SUV','Utilitaire'],params.get('category') || '')}<button type="submit">${icon('search')}Trouver ma voiture</button>${compact ? errorSlot : ''}</form>`;
}
const explorerSkeleton = `<div class="vehicle-card explorer-placeholder"><div class="explorer-image-placeholder"></div><div class="vehicle-info"><p role="status">Chargement des véhicules…</p><div class="skeleton explorer-skeleton-line"></div><div class="skeleton explorer-skeleton-line"></div></div></div>`;

export async function home(loadIdentity = async () => null) {
  const main = document.getElementById('main'), recent = loadRecentSearch();
  main.classList.add('explorer-main');
  main.innerHTML = `<div class="explorer-home" data-identity="loading"><div class="explorer-discovery"><section class="hero explorer-hero" aria-labelledby="explorer-title"><h1 id="explorer-title">Une voiture, à votre rythme.</h1><p>Location entre particuliers en Guadeloupe</p>${searchBox(new URLSearchParams(),{compact:true})}${recent ? `<a class="explorer-recent" href="${escape(recent)}">${icon('clock')}Reprendre ma dernière recherche</a>` : ''}</section><section class="explorer-catalogue" id="explorer-catalogue" aria-labelledby="explorer-featured-title" aria-busy="true"><div class="section-heading"><h2 id="explorer-featured-title" tabindex="-1">À découvrir</h2><a href="/search">Voir tous les véhicules ${icon('arrow')}</a></div><div id="explorer-cards" class="explorer-vehicles">${explorerSkeleton}</div><p class="explorer-disclaimer">Véhicules et tarifs de démonstration, sans offre commerciale.</p></section></div><div id="explorer-account" class="section" aria-live="polite"></div><details class="section how explorer-how"><summary>Comment se déroule une location ?</summary><div class="how-list">${[['Trouvez votre voiture','Explorez les véhicules et choisissez vos dates.'],['Envoyez votre demande','Le propriétaire répond. Le paiement simulé vient après son accord.'],['Prenez la route','Effectuez les contrôles, l’état des lieux et la remise des clés.']].map(([t,p],i)=>`<div class="how-item"><span class="number">${i+1}</span><div><h3>${t}</h3><p>${p}</p></div></div>`).join('')}</div></details><section class="section owner-banner"><div><h2>Votre voiture aussi a du potentiel.</h2><p>Proposez-la quand vous ne l’utilisez pas. Vous gardez la main sur vos disponibilités.</p></div>${link('/owner/start','Louer ma voiture '+icon('arrow'),'warm')}</section></div>`;
  bindForm('explorer-search', values => {
    const params = new URLSearchParams({q:values.q.trim(),from:values.from,until:values.until});
    const error = searchError(params);
    if (error) throw Error(error);
    location.href = '/search?' + params;
  });
  const account = main.querySelector('#explorer-account'), catalogue = main.querySelector('#explorer-catalogue'), cards = main.querySelector('#explorer-cards');
  async function identity() {
    try {
      const me = await loadIdentity();
      account.innerHTML = me ? notice(`Bonjour ${escape(me.name.split(' ')[0])}. Vos documents : <strong>${me.eligibility === 'verified' ? 'vérification simulée complète' : 'à compléter'}</strong> · <a href="/profile/documents">Consulter</a>`) : '';
      main.querySelector('.explorer-home').dataset.identity = me ? 'ready' : 'anonymous';
    } catch {
      account.innerHTML = notice('Session non vérifiée. Le catalogue reste public ; vos accès personnels seront vérifiés à la prochaine navigation.','warning');
      main.querySelector('.explorer-home').dataset.identity = 'unavailable';
    }
  }
  async function catalogueLoad() {
    const retry = cards.querySelector('#retry-catalogue');
    const restoreRetryFocus = retry && document.activeElement === retry;
    catalogue.setAttribute('aria-busy','true');
    if (retry) { retry.disabled = true; retry.setAttribute('aria-busy','true'); }
    try {
      const vehicles = await api('/vehicles');
      if (!Array.isArray(vehicles)) throw Error('La réponse du catalogue est indisponible.');
      cards.innerHTML = vehicles.length ? card(vehicles[0],{discovery:true,priority:true}) : empty('Aucun véhicule ici','Le catalogue ne propose aucun véhicule pour le moment. Vous pouvez rechercher une autre destination.',link('/search','Explorer le catalogue','secondary'));
      bindVehicleMedia(cards);
      if (restoreRetryFocus && [document.body,retry].includes(document.activeElement)) main.querySelector('#explorer-featured-title').focus({preventScroll:true});
    } catch (error) {
      cards.innerHTML = `<div class="card explorer-error"><h3>Impossible de charger le catalogue</h3>${notice(escape(error.message),'error')}<button type="button" class="secondary" id="retry-catalogue">Réessayer le catalogue</button><p><a href="/demo">Démo & comptes</a> · <a href="/demo/audit">Atelier d’audit</a></p></div>`;
      cards.querySelector('#retry-catalogue').onclick = () => { void Promise.all([catalogueLoad(),identity()]); };
      if (restoreRetryFocus && [document.body,retry].includes(document.activeElement)) cards.querySelector('#retry-catalogue').focus({preventScroll:true});
    } finally { catalogue.setAttribute('aria-busy','false'); }
  }
  await Promise.all([identity(),catalogueLoad()]);
}
export async function vehicle(id,me){const {renderVehicle}=await import('./vehicle-detail.js');return renderVehicle(id,me,{dateDefaults,toUTC});}
