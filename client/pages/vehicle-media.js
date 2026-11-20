import manifest from '../../assets/v32/manifest.json' with {type: 'json'};

const colors = new Set(['sage', 'sand', 'blue', 'coral']);
const photos = new Map(manifest.photos.map(photo => [photo.id, photo]));
const fallbackFor = vehicle => '/assets/car-' + (colors.has(vehicle.color) ? vehicle.color : 'sage') + '.svg';

export function modelPhotoSeries(vehicle) {
  const mapping = Object.hasOwn(manifest.vehicles, vehicle.id) && manifest.vehicles[vehicle.id];
  if (mapping?.usage !== 'model' || mapping.name !== vehicle.name) return [];
  return mapping.series.map(id => {
    const photo = photos.get(id);
    const variants = [...photo.variants].sort((a, b) => a.size[0] - b.size[0]);
    const {size: [width, height]} = variants.at(-1);
    return {
      photo: true,
      modelPhoto: true,
      creditId: id,
      src: '/' + variants[0].target,
      srcset: variants.map(({target, size: [w]}) => `/${target} ${w}w`).join(', '),
      alt: photo.alt,
      width,
      height,
      fallback: fallbackFor(vehicle),
    };
  });
}

// Explicit fixture identity from the handoff manifest; never infer a model from color.
export function vehicleMedia(vehicle) {
  const fallback = fallbackFor(vehicle);
  if (vehicle.id === 'v1') return {
    photo: true,
    src: '/assets/vehicles/citadine-verte-avant-420.webp',
    srcset: '/assets/vehicles/citadine-verte-avant-420.webp 420w, /assets/vehicles/citadine-verte-avant-836.webp 836w',
    alt: 'Citadine verte, vue avant de trois quarts au bord de mer. Photo de démonstration.',
    width: 836, height: 470, fallback,
  };
  return {photo: false, src: fallback, alt: 'Illustration fictive ' + vehicle.name, width: 640, height: 400, fallback};
}

export function bindVehicleMedia(root) {
  root.querySelectorAll('img[data-vehicle-image]').forEach(img => {
    const failed = () => {
      const media = img.closest('.catalogue-media'), caption = media.querySelector('.media-label');
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      if (img.dataset.photo === 'true') {
        img.dataset.photo = 'false';
        img.alt = 'Illustration fictive ' + img.dataset.vehicleName;
        img.classList.add('is-illustration');
        img.width = 640;
        img.height = 400;
        caption.textContent = 'Photo indisponible · illustration fictive';
        img.src = img.dataset.fallback;
      } else {
        img.hidden = true;
        caption.textContent = 'Visuel indisponible';
        media.setAttribute('role', 'img');
        media.setAttribute('aria-label', 'Visuel indisponible pour ' + img.dataset.vehicleName);
      }
    };
    img.addEventListener('error', failed);
    if (img.complete && img.naturalWidth === 0) failed();
  });
}
