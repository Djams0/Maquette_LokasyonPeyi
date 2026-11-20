import {api} from '../http.js';
import {searchError,loadRecentSearch} from './explorer-state.js';
import {dateParam,searchURL} from './search-state.js';
import {bindVehicleMedia,modelPhotoSeries} from './vehicle-media.js';
import {escape,icon,link,notice,empty,bindForm,errorSlot} from '/ui/components.js';
import {card} from './vehicle-card.js';
import {homeFaqItems,renderFaqItems} from './support.js';
import mediaManifest from '../../assets/v32/manifest.json' with {type:'json'};
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

function hideFailedPhoto(image, fallback = null) {
  const hide = () => {
    image.hidden = true;
    if (fallback) fallback.hidden = false;
  };
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
      <a class="explorer-recent" href="${escape(recent || '/search')}"${recent ? '' : ' hidden'}>${icon('clock')}Reprendre ma dernière recherche</a>
      <div class="explorer-hero-foot">
        <a href="/search" class="explorer-dial" id="explorer-dial">${dialPlaceholder}</a>
        <a class="explorer-credit" href="/assets/v32/credits.html#photo-49">Photo · artificiality / CC BY-SA 2.0</a>
      </div>
    </div>
  </section>`;
}

const shortcuts = [
  ['Citadines','car',{category:'Citadine'}],
  ['SUV et famille','user',{category:'SUV',seats:'5'}],
  ['Boîte automatique','gear',{gearbox:'Automatique'}],
  ['Près de l’aéroport','plane',{q:'Les Abymes'},'Les Abymes'],
];
const shortcutPaths = {
  gear: 'M6 4v16m6-16v16m6-16v8H6',
  plane: 'm2 15 9-3 6-8c3-3 5-1 3 2l-5 8v7l-2 1-2-6-6 1-3-2Z',
};
const shortcutIcon = name => shortcutPaths[name] ? `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${shortcutPaths[name]}"/></svg>` : icon(name);

function quickSearch() {
  return `<section class="explorer-shortcuts explorer-wrap" aria-labelledby="explorer-shortcuts-title">
    <h2 id="explorer-shortcuts-title">Votre trajet, votre façon de rouler.</h2>
    <div class="explorer-shortcuts-grid">${shortcuts.map(([title,symbol,params,detail]) => `<a href="${escape(searchURL(new URLSearchParams(params)))}">
      <span class="explorer-shortcut-icon">${shortcutIcon(symbol)}</span><span>${title}${detail ? `<small>${detail}</small>` : ''}</span>${icon('arrow')}
    </a>`).join('')}</div>
  </section>`;
}

const explorerSkeleton = [true,false,false].map(first => `<div class="vehicle-card explorer-placeholder"${first?'':' aria-hidden="true"'}>
  <div class="explorer-image-placeholder"></div><div class="vehicle-info">${first?'<p role="status">Chargement des véhicules…</p>':''}
    <div class="skeleton explorer-skeleton-line"></div><div class="skeleton explorer-skeleton-line"></div>
  </div></div>`).join('');

function featuredVehicles(vehicles) {
  const published = new Map(vehicles.filter(vehicle => vehicle.status === 'published').map(vehicle => [vehicle.id,vehicle]));
  const featured = ['v3','v2','v1'].map(id => published.get(id)).filter(Boolean);
  for (const {id} of featured) published.delete(id);
  return [...featured,...published.values()].slice(0,3);
}

const steps = [
  ['Trouvez une voiture','Indiquez le lieu de remise et, si vous les connaissez, vos dates.'],
  ['Consultez la fiche','Vérifiez les photos, les conditions et l’état déclaré.'],
  ['Envoyez une demande','Le propriétaire doit l’accepter avant le paiement simulé.'],
  ['Récupérez les clés','Vérifiez la caution, puis faites le constat de départ avant la remise.'],
  ['Restituez la voiture','Faites le constat et déclarez le retour. Le propriétaire confirme la récupération puis clôture.'],
];

function howItWorks() {
  return `<section class="explorer-band explorer-steps-band" id="fonctionnement" tabindex="-1" aria-labelledby="explorer-steps-title">
    <div class="explorer-wrap">
      <p class="eyebrow">La location entre particuliers</p>
      <h2 id="explorer-steps-title" tabindex="-1">Comment se passe une location ?</h2>
      <ol class="explorer-steps" role="list">${steps.map(([title,description],index) => `<li>
        <span class="explorer-step-number" aria-hidden="true">0${index+1}</span>
        <div><h3>${title}</h3><p>${description}</p></div>
      </li>`).join('')}</ol>
    </div>
  </section>`;
}

function editorialPhoto(usage,sizes) {
  const photo = mediaManifest.photos.find(item => item.id === mediaManifest.editorial[usage]);
  const variants = [...photo.variants].sort((a,b) => a.size[0]-b.size[0]);
  const [width,height] = variants.at(-1).size;
  const srcset = variants.map(({target,size:[w]}) => `/${target} ${w}w`).join(', ');
  return `<div class="explorer-editorial-image">
    <img src="/${variants[0].target}" ${variants.length>1?`srcset="${srcset}" sizes="${sizes}"`:''}
      alt="${escape(photo.alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">
    <span class="explorer-editorial-fallback" role="status" hidden>Photo indisponible</span>
  </div>`;
}

function islandStory() {
  const places = [
    ['foret','La Route de la Traversée','Petit-Bourg','à Petit-Bourg'],
    ['littoral','La Caravelle, Sainte-Anne','Sainte-Anne','à Sainte-Anne'],
    ['bourg','Le bourg de Deshaies','Deshaies','à Deshaies'],
  ];
  return `<section class="explorer-band" id="decouvrir" aria-labelledby="explorer-story-title">
    <div class="explorer-wrap">
      <div class="explorer-story">
        ${editorialPhoto('panorama','(min-width:1328px) 730px, (min-width:768px) 56vw, 91vw')}
        <div class="explorer-story-copy">
          <p class="eyebrow">D’une commune à l’autre</p>
          <h2 id="explorer-story-title">La Guadeloupe, à votre rythme.</h2>
          <p>Retrouver des proches, traverser Basse-Terre ou passer l’après-midi à Sainte-Anne. Choisissez une remise qui vous arrange, puis prenez la route.</p>
          <a class="explorer-text-link" href="/search">Trouver un lieu de remise ${icon('arrow')}</a>
        </div>
      </div>
      <div class="explorer-story-grid">${places.map(([usage,title,commune,destination]) => `<figure class="explorer-story-tile">
        ${editorialPhoto(usage,'(min-width:1328px) 390px, (min-width:768px) 30vw, 91vw')}
        <figcaption><strong>${title}</strong><a class="explorer-text-link" href="${escape(searchURL({q:commune}))}">Chercher ${destination} ${icon('arrow')}</a></figcaption>
      </figure>`).join('')}</div>
    </div>
  </section>`;
}

function transparency() {
  const facts = [
    ['camera','Photos et caractéristiques','Parcourez les vues disponibles et vérifiez les équipements dans l’annonce.'],
    ['shield','État du véhicule','Lisez les défauts déclarés et consultez les photos qui les documentent lorsqu’elles sont fournies.'],
    ['pin','Conditions de remise','Vérifiez le lieu, les modalités de retour et les conditions de l’annonce.'],
  ];
  return `<section class="explorer-band explorer-band-white" aria-labelledby="explorer-trust-title">
    <div class="explorer-wrap explorer-trust">
      <div><p class="eyebrow">Avant de réserver</p><h2 id="explorer-trust-title">Consultez les détails avant de choisir.</h2>
        <p class="muted">La fiche rassemble les informations qui comptent pour votre trajet.</p></div>
      <ul class="explorer-trust-list" role="list">${facts.map(([symbol,title,description]) => `<li>
        <span class="explorer-shortcut-icon">${icon(symbol)}</span><div><h3>${title}</h3><p>${description}</p></div>
      </li>`).join('')}</ul>
    </div>
  </section>`;
}

const ownerPanelStates = {
  neutral: ['Vous avez une voiture à proposer ?', 'Découvrez le parcours de publication dans la maquette.', '/faq','Voir les questions fréquentes'],
  visitor: ['Vous avez une voiture à proposer ?', 'Découvrez les étapes pour publier une annonce et renseigner vos disponibilités.', '/owner/start','Proposer ma voiture'],
  owner: ['Vos véhicules', 'Retrouvez votre parc et vos disponibilités dans votre espace.', '/owner/vehicles','Gérer mes véhicules'],
};

function ownerPanel() {
  const [title,description,href,label] = ownerPanelStates.neutral;
  return `<section class="explorer-wrap explorer-owner-section" aria-labelledby="explorer-owner-title">
    <div class="explorer-owner-panel" id="explorer-owner">
      <div><h2 id="explorer-owner-title">${title}</h2><p>${description}</p></div>
      <a class="button warm" href="${href}"><span>${label}</span>${icon('arrow')}</a>
    </div>
  </section>`;
}

function updateOwnerPanel(panel,state) {
  const [title,description,href,label] = ownerPanelStates[state];
  panel.querySelector('h2').textContent = title;
  panel.querySelector('p').textContent = description;
  const action = panel.querySelector('a');
  action.href = href;
  action.querySelector('span').textContent = label;
}

function homeFaq() {
  return `<section class="explorer-band explorer-faq-band" id="aide" tabindex="-1" aria-labelledby="explorer-faq-title">
    <div class="explorer-wrap explorer-faq">
      <div><p class="eyebrow">Aide</p><h2 id="explorer-faq-title" tabindex="-1">Questions fréquentes</h2>
        <a class="explorer-text-link" href="/faq">Voir toutes les questions ${icon('arrow')}</a></div>
      <div>${renderFaqItems(homeFaqItems)}</div>
    </div>
  </section>`;
}

export async function home(loadIdentity = async () => null) {
  const main = document.getElementById('main'), recent = loadRecentSearch();
  main.classList.add('explorer-main');
  main.innerHTML = `<div class="explorer-home v32" data-identity="loading">
    ${homeHero(recent)}
    ${quickSearch()}
    <section class="explorer-band explorer-band-white" aria-labelledby="explorer-featured-title">
      <div class="explorer-wrap explorer-catalogue" id="explorer-catalogue" aria-busy="true">
        <div class="explorer-catalogue-heading">
          <div><p class="eyebrow">Le catalogue</p><h2 id="explorer-featured-title" tabindex="-1">Des voitures à découvrir</h2>
            <p class="explorer-disclaimer">Véhicules et tarifs de démonstration, sans offre commerciale.</p></div>
          <a class="explorer-text-link" href="/search">Voir toutes les voitures ${icon('arrow')}</a>
        </div>
        <div id="explorer-cards" class="explorer-vehicles">${explorerSkeleton}</div>
        <div id="explorer-account" aria-live="polite"></div>
      </div>
    </section>
    ${howItWorks()}
    ${islandStory()}
    ${transparency()}
    ${ownerPanel()}
    ${homeFaq()}
  </div>`;
  hideFailedPhoto(main.querySelector('.explorer-hero-photo img'));
  for (const image of main.querySelectorAll('.explorer-editorial-image img')) {
    hideFailedPhoto(image, image.nextElementSibling);
  }
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
  window.addEventListener('pageshow', () => {
    updateDates();
    const resume = main.querySelector('.explorer-recent'), saved = loadRecentSearch();
    resume.hidden = !saved;
    resume.href = saved || '/search';
  });
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
  const owner = main.querySelector('#explorer-owner');
  async function identity() {
    try {
      const me = await loadIdentity();
      updateOwnerPanel(owner,me?.owner ? 'owner' : 'visitor');
      account.innerHTML = me ? notice(`Bonjour ${escape(me.name.split(' ')[0])}. Vos documents : <strong>${me.eligibility === 'verified' ? 'vérification simulée complète' : 'à compléter'}</strong> · <a href="/profile/documents">Consulter</a>`) : '';
      main.querySelector('.explorer-home').dataset.identity = me ? 'ready' : 'anonymous';
    } catch {
      updateOwnerPanel(owner,'neutral');
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
      const selection = featuredVehicles(vehicles);
      cards.innerHTML = selection.length ? selection.map(vehicle => card(vehicle,{discovery:true})).join('') : empty('Aucun véhicule ici','Le catalogue ne propose aucun véhicule pour le moment. Vous pouvez rechercher une autre destination.',link('/search','Explorer le catalogue','secondary'));
      bindVehicleMedia(cards);
      if (restoreRetryFocus && [document.body,retry].includes(document.activeElement)) main.querySelector('#explorer-featured-title').focus();
    } catch (error) {
      updateDial(dial, []);
      cards.innerHTML = `<div class="card explorer-error"><h3>Impossible de charger le catalogue</h3><div role="alert">${notice(escape(error.message),'error')}</div><button type="button" class="secondary" id="retry-catalogue">Réessayer le catalogue</button><p><a href="/demo">Démo & comptes</a> · <a href="/demo/audit">Atelier d’audit</a></p></div>`;
      cards.querySelector('#retry-catalogue').onclick = () => { void Promise.all([catalogueLoad(),identity()]); };
      if (restoreRetryFocus && [document.body,retry].includes(document.activeElement)) cards.querySelector('#retry-catalogue').focus({preventScroll:true});
    } finally { catalogue.setAttribute('aria-busy','false'); }
  }
  await Promise.all([identity(),catalogueLoad()]);
}
export async function vehicle(id,me){const {renderVehicle}=await import('./vehicle-detail.js');return renderVehicle(id,me,{dateDefaults,toUTC});}
