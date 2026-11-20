import {api} from '../http.js';
import {searchError,loadRecentSearch} from './explorer-state.js';
import {dateParam,searchURL} from './search-state.js';
import {bindVehicleMedia,modelPhotoSeries} from './vehicle-media.js';
import {escape,icon,link,notice,empty,bindForm,errorSlot} from '/ui/components.js';
import {card} from './vehicle-card.js';
export {card} from './vehicle-card.js';
export {search} from './search-results.js';
export function dateDefaults(){const d=new Date();d.setUTCDate(d.getUTCDate()+2);const start=d.toISOString().slice(0,10)+'T09:00';d.setUTCDate(d.getUTCDate()+3);return{start,end:d.toISOString().slice(0,10)+'T09:00'};}
export const toUTC=v=>new Date(v+'-04:00').toISOString();
function dateField(name, label, symbol) {
  return `<label class="explorer-field explorer-date" data-empty="true">
    <span id="explorer-label-${name}">${icon(symbol)}${label}</span>
    <input name="${name}" type="datetime-local" aria-labelledby="explorer-label-${name}" aria-describedby="explorer-timezone">
    <small aria-hidden="true" class="explorer-date-hint">Date et heure</small>
  </label>`;
}

function heroSearch() {
  return `<form class="explorer-search v32-glass" id="explorer-search" aria-label="Rechercher un véhicule" action="/search" method="get">
    <label class="explorer-field explorer-place">
      <span>${icon('pin')}Lieu de remise</span>
      <input name="q" type="search" placeholder="Commune ou aéroport" maxlength="120">
    </label>
    ${dateField('from','Départ','calendar')}
    ${dateField('until','Retour','clock')}
    <button type="submit">${icon('search')}Trouver une voiture</button>
    <p class="explorer-timezone" id="explorer-timezone">Heure de Guadeloupe</p>
    ${errorSlot}
  </form>`;
}

const dialPlaceholder = `<span class="explorer-dial-media" aria-hidden="true">${icon('car')}</span><span><small>Catalogue public</small><strong>Explorer les véhicules</strong></span>${icon('arrow')}`;

function updateDial(dial, vehicles) {
  const featured = vehicles.find(vehicle => vehicle.id === 'v3' && vehicle.status === 'published');
  const media = featured && modelPhotoSeries(featured)[0];
  dial.href = media ? '/vehicle/v3' : '/search';
  dial.innerHTML = media ? `<span class="explorer-dial-media" aria-hidden="true">${icon('car')}
      <img src="${escape(media.src)}" alt="" width="480" height="360" loading="lazy" decoding="async">
    </span><span><small>Modèle de démonstration</small><strong>${escape(featured.name)}</strong></span>${icon('arrow')}`
    : dialPlaceholder;
  const thumbnail = dial.querySelector('img');
  if (thumbnail) hideFailedPhoto(thumbnail);
}

function hideFailedPhoto(image) {
  const hide = () => { image.hidden = true; };
  image.addEventListener('error', hide);
  if (image.complete && !image.naturalWidth) hide();
}

function homeHero(recent) {
  return `<section class="explorer-hero v32" aria-labelledby="explorer-title">
    <picture class="explorer-hero-photo" aria-hidden="true">
      <source media="(max-width:599px)" srcset="/assets/v32/editorial/route-guadeloupe-720.webp" width="720" height="480">
      <img src="/assets/v32/editorial/route-guadeloupe-1440.webp"
        srcset="/assets/v32/editorial/route-guadeloupe-1440.webp 1440w, /assets/v32/editorial/route-guadeloupe-1920.webp 1920w"
        sizes="100vw" width="1440" height="960" alt="" fetchpriority="high" decoding="async">
    </picture>
    <div class="explorer-hero-inner explorer-wrap">
      <div class="explorer-hero-head">
        <p class="explorer-kicker">Location entre particuliers en Guadeloupe</p>
        <h1 id="explorer-title">Roulez au rythme du Péyi.</h1>
        <p class="explorer-hero-description">Trouvez une voiture près de chez vous, pour vos trajets du quotidien comme pour découvrir l’île.</p>
      </div>
      ${heroSearch()}
      ${recent ? `<a class="explorer-recent" href="${escape(recent)}">${icon('clock')}Reprendre ma dernière recherche</a>` : ''}
      <div class="explorer-hero-foot">
        <a href="/search" class="explorer-dial" id="explorer-dial">${dialPlaceholder}</a>
        <a class="explorer-credit" href="/assets/v32/credits.html#photo-49">Photo · artificiality / CC BY-SA 2.0</a>
      </div>
    </div>
  </section>`;
}

const shortcuts = [
  ['Citadines','car',{category:'Citadine'}],
  ['SUV et famille','user',{category:'SUV'}],
  ['Boîte automatique','gear',{gearbox:'Automatique'}],
  ['Près de l’aéroport','plane',{q:'Les Abymes'},'Les Abymes'],
];
const shortcutPaths = {
  gear: 'M6 4v16m6-16v16m6-16v8H6',
  plane: 'm2 15 9-3 6-8c3-3 5-1 3 2l-5 8v7l-2 1-2-6-6 1-3-2Z',
};
const shortcutIcon = name => shortcutPaths[name] ? `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${shortcutPaths[name]}"/></svg>` : icon(name);

function quickSearch() {
  return `<section class="explorer-shortcuts v32" aria-labelledby="explorer-shortcuts-title">
    <h2 id="explorer-shortcuts-title">Votre trajet, votre façon de rouler.</h2>
    <div class="explorer-shortcuts-grid">${shortcuts.map(([title,symbol,params,detail]) => `<a href="${escape(searchURL(new URLSearchParams(params)))}">
      <span class="explorer-shortcut-icon">${shortcutIcon(symbol)}</span><span>${title}${detail ? `<small>${detail}</small>` : ''}</span>${icon('arrow')}
    </a>`).join('')}</div>
  </section>`;
}
const explorerSkeleton = `<div class="vehicle-card explorer-placeholder"><div class="explorer-image-placeholder"></div><div class="vehicle-info"><p role="status">Chargement des véhicules…</p><div class="skeleton explorer-skeleton-line"></div><div class="skeleton explorer-skeleton-line"></div></div></div>`;

export async function home(loadIdentity = async () => null) {
  const main = document.getElementById('main'), recent = loadRecentSearch();
  main.classList.add('explorer-main');
  main.innerHTML = `<div class="explorer-home v32" data-identity="loading">
    ${homeHero(recent)}
    <div class="explorer-wrap explorer-below">
      ${quickSearch()}
      <section class="explorer-catalogue section" id="explorer-catalogue" aria-labelledby="explorer-featured-title" aria-busy="true">
        <div class="section-heading"><h2 id="explorer-featured-title" tabindex="-1">À découvrir</h2><a href="/search">Voir tous les véhicules ${icon('arrow')}</a></div>
        <div id="explorer-cards" class="explorer-vehicles">${explorerSkeleton}</div>
        <p class="explorer-disclaimer">Véhicules et tarifs de démonstration, sans offre commerciale.</p>
      </section>
      <div id="explorer-account" class="section" aria-live="polite"></div>
      <details class="section how explorer-how" id="fonctionnement"><summary>Comment se déroule une location ?</summary>
        <div class="how-list">${[['Trouvez votre voiture','Explorez les véhicules et choisissez vos dates.'],['Envoyez votre demande','Le propriétaire répond. Le paiement simulé vient après son accord.'],['Prenez la route','Effectuez les contrôles, l’état des lieux et la remise des clés.']].map(([t,p],i)=>`<div class="how-item"><span class="number">${i+1}</span><div><h3>${t}</h3><p>${p}</p></div></div>`).join('')}</div>
      </details>
      <section class="section owner-banner"><div><h2>Votre voiture aussi a du potentiel.</h2><p>Proposez-la quand vous ne l’utilisez pas. Vous gardez la main sur vos disponibilités.</p></div>${link('/owner/start','Louer ma voiture '+icon('arrow'),'warm')}</section>
      <p class="muted explorer-demo-note">Données fictives · aucun paiement réel. <a href="/demo">Démo & comptes</a></p>
    </div>
  </div>`;
  hideFailedPhoto(main.querySelector('.explorer-hero-photo img'));
  const dates = [...main.querySelectorAll('.explorer-date input')];
  const updateDates = () => dates.forEach(input => {
    input.closest('label').dataset.empty = String(!input.value && !input.validity.badInput);
  });
  for (const input of dates) {
    input.addEventListener('input', updateDates);
    input.addEventListener('change', updateDates);
    // The linked form error supplies the feedback without a tooltip over the inputs.
    input.addEventListener('invalid', event => { event.preventDefault(); input.focus(); });
  }
  updateDates();
  window.addEventListener('pageshow', updateDates);
  bindForm('explorer-search', values => {
    const params = new URLSearchParams({q:values.q.trim(),from:values.from,until:values.until});
    const error = searchError(params);
    if (error) throw Error(error);
    params.set('from', dateParam(values.from));
    params.set('until', dateParam(values.until));
    location.href = searchURL(params);
  });
  const account = main.querySelector('#explorer-account'), catalogue = main.querySelector('#explorer-catalogue'), cards = main.querySelector('#explorer-cards');
  const dial = main.querySelector('#explorer-dial');
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
      updateDial(dial, vehicles);
      cards.innerHTML = vehicles.length ? card(vehicles[0],{discovery:true}) : empty('Aucun véhicule ici','Le catalogue ne propose aucun véhicule pour le moment. Vous pouvez rechercher une autre destination.',link('/search','Explorer le catalogue','secondary'));
      bindVehicleMedia(cards);
      if (restoreRetryFocus && [document.body,retry].includes(document.activeElement)) main.querySelector('#explorer-featured-title').focus({preventScroll:true});
    } catch (error) {
      updateDial(dial, []);
      cards.innerHTML = `<div class="card explorer-error"><h3>Impossible de charger le catalogue</h3>${notice(escape(error.message),'error')}<button type="button" class="secondary" id="retry-catalogue">Réessayer le catalogue</button><p><a href="/demo">Démo & comptes</a> · <a href="/demo/audit">Atelier d’audit</a></p></div>`;
      cards.querySelector('#retry-catalogue').onclick = () => { void Promise.all([catalogueLoad(),identity()]); };
      if (restoreRetryFocus && [document.body,retry].includes(document.activeElement)) cards.querySelector('#retry-catalogue').focus({preventScroll:true});
    } finally { catalogue.setAttribute('aria-busy','false'); }
  }
  await Promise.all([identity(),catalogueLoad()]);
}
export async function vehicle(id,me){const {renderVehicle}=await import('./vehicle-detail.js');return renderVehicle(id,me,{dateDefaults,toUTC});}
