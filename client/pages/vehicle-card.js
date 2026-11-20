import {escape,money} from '/ui/components.js';
import {modelPhotoSeries,vehicleMedia} from './vehicle-media.js';
import {vehicleURL} from './search-state.js';

// Match the existing discovery column, catalogue grid and sidebar.
const discoverySizes = '(min-width:1280px) 608px, (min-width:1024px) calc(53vw - 68px), (max-width:359px) calc(100vw - 24px), calc(100vw - 32px)';
const resultsSizes = '(min-width:1280px) 456px, (min-width:1024px) calc(50vw - 184px), (min-width:768px) calc(50vw - 28px), (max-width:359px) calc(100vw - 24px), calc(100vw - 32px)';

export const card = (v, {discovery = false, priority = false, context = null} = {}) => {
  const media = modelPhotoSeries(v)[0] ?? vehicleMedia(v);
  const sizes = media.modelPhoto
    ? (discovery ? discoverySizes : resultsSizes)
    : '(min-width:1024px) 600px, (min-width:768px) 50vw, 100vw';
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
        <div class="row between"><h3>${escape(v.name)}</h3>${discovery ? '' : `<span class="badge">${escape(v.category)}</span>`}</div>
        <p>${discovery ? `${escape(v.city)} · ${escape(v.gearbox)} · ${escape(v.seats)} places` : `★ ${v.rating || 'Nouveau'} · ${escape(v.city)}`}</p>
        <div class="price">${money(v.price)} <small>/ jour fictif</small></div>
      </div>
    </a>
  </article>`;
};
