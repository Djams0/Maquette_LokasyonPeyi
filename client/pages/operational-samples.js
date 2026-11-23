import {badge,bindForm,empty,errorSlot,field,formValues,link,modal,select} from '/ui/components.js';

export function operationalSamples() {
  return `
    <section id="surfaces-operationnelles" class="client-operational section" aria-labelledby="operational-title">
      <h2 id="operational-title">Surfaces opérationnelles</h2>
      <p>Essayez les états d’une demande fictive et la reprise du formulaire.</p>
      <div class="operational-layout">
        <article class="card">
          <h3 id="operational-period-title">Vérifier une période</h3>
          <p id="operational-period-help" class="muted">Les deux dates sont requises. Le retour doit suivre le départ.</p>
          <form aria-labelledby="operational-period-title" id="operational-period-form">
            ${field('Date de départ','departure','2027-06-10','date','required aria-describedby="operational-period-help"')}
            ${field('Date de retour','returnDate','2027-06-14','date','required aria-describedby="operational-period-help"')}
            ${select('Réponse simulée','outcome',[
              ['accepted','Période disponible'],
              ['refused','Période indisponible'],
              ['network','Vérification indisponible'],
            ],'accepted')}
            ${errorSlot}
            <button type="submit">Vérifier la période</button>
          </form>
          <p class="operational-feedback" id="operational-period-status" role="status">En attente d’une vérification.</p>
        </article>
        <div class="operational-rail">
          <article class="card" aria-labelledby="operational-request-title">
            <h3 id="operational-request-title">Demande fictive</h3>
            <div id="operational-request-status" role="status">${badge('requested')}</div>
            <p id="operational-request-actor">Le propriétaire peut répondre. Le locataire peut retirer sa demande.</p>
            <button type="button" class="danger" id="operational-withdraw">Simuler un retrait</button>
          </article>
          ${empty('Aucune demande à suivre','Explorez les véhicules pour trouver une période.',link('/search','Explorer les véhicules','secondary'))}
        </div>
      </div>
    </section>`;
}

export function bindOperationalSamples(section) {
  const form = section.querySelector('#operational-period-form');
  const status = section.querySelector('#operational-period-status');
  const {departure,returnDate} = form.elements;

  function showPeriodStatus(message, state = 'idle') {
    status.textContent = message;
    status.dataset.state = state;
  }

  function updatePeriod() {
    const reversed = departure.value && returnDate.value && returnDate.valueAsNumber <= departure.valueAsNumber;
    returnDate.setCustomValidity(reversed ? 'La date de retour doit suivre la date de départ.' : '');
    if (!form.hasAttribute('aria-busy')) showPeriodStatus('En attente d’une vérification.');
  }

  form.addEventListener('input', updatePeriod);
  form.addEventListener('change', updatePeriod);
  updatePeriod();
  bindForm(form, async (submitted) => {
    showPeriodStatus('Vérification de la période en cours…', 'loading');
    await new Promise(resolve => setTimeout(resolve, 600));
    const current = formValues(form);
    if (Object.keys(submitted).some(name => submitted[name] !== current[name])) {
      showPeriodStatus('La saisie a changé. Vérifiez de nouveau la période.');
      return;
    }
    if (submitted.outcome === 'accepted') {
      showPeriodStatus('Période disponible dans cet exemple.', 'success');
      return;
    }
    showPeriodStatus('Vérification terminée avec une erreur.');
    throw Error(submitted.outcome === 'refused'
      ? 'Cette période est indisponible. Modifiez vos dates puis réessayez.'
      : 'La vérification est indisponible. Vos dates sont conservées. Réessayez.');
  });

  const requestStatus = section.querySelector('#operational-request-status');
  const actor = section.querySelector('#operational-request-actor');
  const withdraw = section.querySelector('#operational-withdraw');
  let withdrawn = false;

  function showRequestState() {
    requestStatus.innerHTML = badge(withdrawn ? 'withdrawn' : 'requested');
    actor.textContent = withdrawn
      ? 'Cette demande fictive est terminée.'
      : 'Le propriétaire peut répondre. Le locataire peut retirer sa demande.';
    withdraw.textContent = withdrawn ? 'Réinitialiser l’exemple' : 'Simuler un retrait';
    withdraw.className = withdrawn ? 'secondary' : 'danger';
  }

  withdraw.onclick = () => {
    if (withdrawn) {
      withdrawn = false;
      showRequestState();
      return;
    }
    const dialog = modal('Retirer la demande ?', '<p id="operational-withdraw-consequence">La demande de démonstration passe à l’état « Retirée ».</p>', () => {
      withdrawn = true;
      showRequestState();
    });
    dialog.setAttribute('aria-describedby','operational-withdraw-consequence');
    const confirm = dialog.querySelector('[type="submit"]');
    confirm.classList.add('danger');
    confirm.textContent = 'Retirer la demande';
  };
}
