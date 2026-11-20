import {escape,icon,money} from '/ui/components.js';
import {modelPhotoSeries,vehicleMedia} from './vehicle-media.js';
import {vehicleURL} from './search-state.js';

// Match the discovery and results grids without preloading the gallery.
const discoverySizes = '(min-width:1328px) 388px, (min-width:880px) calc(30.13vw - 12px), (min-width:600px) calc(45.2vw - 9px), calc(100vw - max(32px, 9.6vw))';
const resultsSizes = '(min-width:1280px) 456px, (min-width:1024px) calc(50vw - 184px), (min-width:768px) calc(50vw - 28px), (max-width:359px) calc(100vw - 24px), calc(100vw - 32px)';

export const card = (v, {discovery = false, priority = false, context = null} = {}) => {
  const media = modelPhotoSeries(v)[0] ?? vehicleMedia(v);
  const sizes = discovery ? discoverySizes
    : media.modelPhoto ? resultsSizes : '(min-width:1024px) 600px, (min-width:768px) 50vw, 100vw';
  const label = media.modelPhoto ? 'Photo illustrative du modèle' : media.photo ? 'Photos de démonstration' : 'Illustration fictive';
  return `<article class="vehicle-card catalogue-card" data-vehicle-id="${escape(v.id)}">
    <a href="${vehicleURL(v.id,context)}">
      <div class="catalogue-media">
        <img class="vehicle-image ${media.photo ? '' : 'is-illustration'}" data-vehicle-image
          data-photo="${media.photo}" data-vehicle-name="${escape(v.name)}" data-fallback="${media.fallback}"
          src="${media.src}" ${media.srcset ? `srcset="${media.srcset}" sizes="${sizes}"` : ''}
          alt="${escape(media.alt)}" width="${media.width}" height="${media.height}"
          loading="${priority ? 'eager' : 'lazy'}" fetchpriority="${priority ? 'high' : 'auto'}" decoding="async">
        <span class="media-label"${media.modelPhoto ? ' role="status"' : ''}>${label}</span>
      </div>
      <div class="vehicle-info">
        ${discovery ? `<p class="explorer-card-location">${escape(v.category)} · ${escape(v.city)}</p>` : ''}
        <div class="row between"><h3>${escape(v.name)}</h3>${discovery ? '' : `<span class="badge">${escape(v.category)}</span>`}</div>
        <p>${discovery ? `${escape(v.gearbox)} · ${escape(v.seats)} places` : `★ ${v.rating || 'Nouveau'} · ${escape(v.city)}`}</p>
        <div class="price">${discovery ? `<span>${money(v.price)} <small>/ jour fictif</small></span>${icon('arrow')}` : `${money(v.price)} <small>/ jour fictif</small>`}</div>
      </div>
    </a>
  </article>`;
};
