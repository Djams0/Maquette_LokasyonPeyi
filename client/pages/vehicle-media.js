const colors = new Set(['sage', 'sand', 'blue', 'coral']);

// Explicit fixture identity from the handoff manifest; never infer a model from color.
export function vehicleMedia(vehicle) {
  const fallback = '/assets/car-' + (colors.has(vehicle.color) ? vehicle.color : 'sage') + '.svg';
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
