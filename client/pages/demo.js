import {api} from '../http.js';
import {escape,link,notice,select,errorSlot,bindForm,flash,badge,icon,field,textarea,modal,toast,empty,shellLoading,statuses} from '/ui/components.js';
import {operationalSamples,bindOperationalSamples} from './operational-samples.js';
export async function demo(me) {
  const personas = await api('/personas?app=client');
  const options = personas.map(p => [p.id,p.name+(p.status==='suspended' ? ' · suspendu' : '')]);
  document.getElementById('main').innerHTML = `<div class="narrow tool-surface">
    <h1>Démo et comptes fictifs</h1>
    ${notice('Toutes les personnes, demandes et opérations sont fictives. Le client et l’administration échangent via la même API de démonstration.')}
    <section class="card section tool-card" aria-labelledby="demo-session-title">
      <h2 id="demo-session-title">Changer de profil client</h2>
      <form id="persona-form">
        ${select('Profil de démonstration','persona',options,me?.id || 'renter')}
        ${errorSlot}<button type="submit">Ouvrir ce profil</button>
      </form>
      <form id="visitor-form">
        ${errorSlot}<button id="visitor" type="submit" class="secondary">Passer en visiteur</button>
      </form>
      <p id="demo-session-status" class="tool-feedback" role="status"></p>
      ${link('/demo/audit','Atelier des profils audit','secondary')}
    </section>
    <section class="card section tool-card" aria-labelledby="demo-network-title">
      <h2 id="demo-network-title">Tester les états de l’interface</h2>
      <form id="network-form">
        ${select('État réseau simulé','network',[['','Normal'],['slow','Chargement lent'],['error','API indisponible']],sessionStorage.getItem('network-demo') || '')}
        ${errorSlot}<button type="submit">Appliquer et ouvrir le catalogue</button>
      </form>
      <div class="form-actions">
        ${link('/search?state=empty','Résultat vide','secondary')}
        ${link('/route-inconnue','Écran 404','secondary')}
        ${link('/design-system','Composants visuels','secondary')}
      </div>
    </section>
    <section class="card section tool-card" aria-labelledby="demo-flow-title">
      <h2 id="demo-flow-title">Scénario complet</h2>
      <ol>
        <li>Camille recherche un véhicule et envoie une demande.</li>
        <li>Noa ouvre ses demandes et accepte.</li>
        <li>Camille simule le paiement puis le contrôle de caution.</li>
        <li>L’un des participants complète les huit vues du constat de départ.</li>
        <li>Noa confirme la remise des clés.</li>
        <li>Camille complète le constat de retour puis déclare le retour.</li>
        <li>Noa confirme la récupération et clôture la location.</li>
        <li>Camille peut laisser un avis et imprimer le reçu fictif.</li>
      </ol>
      <div class="form-actions">
        ${link('/search','Rechercher un véhicule')}
        ${link('/owner/requests','Demandes propriétaire','secondary')}
      </div>
    </section>
    <section class="card section tool-card" aria-labelledby="demo-admin-title">
      <h2 id="demo-admin-title">Administration de démonstration</h2>
      <p>Sur le port 8081, Élie contrôle les documents affectés, Ana traite les dossiers et Sam participe à la double validation financière. Jade et Malo administrent les habilitations.</p>
      <a class="button secondary" href="http://localhost:8081/" target="_blank" rel="noopener">Administration · localhost:8081</a>
    </section>
  </div>`;

  const status = document.getElementById('demo-session-status');
  let switching = false;
  async function changeSession(action, destination, successMessage) {
    if (switching) return;
    switching = true;
    status.textContent = 'Changement de profil en cours…';
    try {
      await action();
      if (successMessage) flash(successMessage);
      location.href = destination;
    } finally {
      status.textContent = '';
      switching = false;
    }
  }

  bindForm('persona-form', values => changeSession(async () => {
    sessionStorage.removeItem('network-demo');
    await api('/session',values);
  },values.persona === 'owner' ? '/owner' : '/','Profil de démonstration modifié.'));
  bindForm('visitor-form', () => changeSession(() => api('/session',undefined,'DELETE'),'/'));
  bindForm('network-form', values => {
    sessionStorage.setItem('network-demo',values.network);
    location.href = '/search';
  });
}

function glassExample(tone, title) {
  return `
    <article class="v32-glass-scene v32-glass-scene--${tone}" aria-labelledby="glass-${tone}">
      <h3 id="glass-${tone}">${title}</h3>
      <form class="v32-glass v32-glass--${tone} v32-glass-search" aria-labelledby="glass-${tone}">
        <label class="v32-glass-field">
          <span>${icon('pin')} Lieu de remise</span>
          <input name="destination" type="text" placeholder="Commune ou aéroport" autocomplete="off" required>
        </label>
        <button type="submit">Trouver une voiture</button>
        ${errorSlot}
        <p class="v32-glass-result" role="status"></p>
      </form>
    </article>`;
}

function bindGlassDemo() {
  const demo = document.getElementById('glass-demo');
  const forms = [...demo.querySelectorAll('form')];
  const opaque = document.getElementById('glass-opaque');
  const unavailable = document.getElementById('glass-unavailable');

  opaque.onclick = () => {
    const active = opaque.getAttribute('aria-pressed') !== 'true';
    opaque.setAttribute('aria-pressed', String(active));
    demo.toggleAttribute('data-v32-opaque', active);
  };
  unavailable.onclick = () => {
    const active = unavailable.getAttribute('aria-pressed') !== 'true';
    unavailable.setAttribute('aria-pressed', String(active));
    for (const form of forms) {
      const input = form.elements.destination;
      // Clear any validation feedback before switching the controls off.
      input.dispatchEvent(new Event('input', {bubbles: true}));
      input.disabled = active;
      form.querySelector('button').disabled = active;
    }
  };
  for (const form of forms) {
    const input = form.elements.destination;
    const result = form.querySelector('[role="status"]');
    const updateValidation = () => {
      input.setCustomValidity(input.value.trim() ? '' : 'Indiquez une commune ou un aéroport.');
    };
    updateValidation();
    form.addEventListener('input', () => {
      updateValidation();
      result.textContent = '';
    });
    bindForm(form, () => { result.textContent = 'Recherche fictive prête.'; });
    input.addEventListener('invalid', event => {
      // The shared error slot supplies the feedback in French.
      event.preventDefault();
      input.focus();
    });
  }
}

export function designSystem() {
  const palette = [['Action','action'],['Ivoire','ivory'],['Encre','ink'],['Ocre','ochre'],['Information','info-bg'],['Succès','success-bg'],['Attention','warning-bg'],['Erreur','error-bg']];
  document.getElementById('main').innerHTML = `
    <div class="tool-surface tool-system">
    <p class="eyebrow">Fondations visuelles</p>
    <h1>Les fondations de Péyi contemporain.</h1>
    <p>Nunito accompagne les actions et les informations. Lora donne le ton des pages de découverte. Lobster reste réservé à la marque.</p>
    <p>Ces exemples locaux ne créent aucune donnée et n’envoient aucun message.</p>
    <section class="v32 v32-glass-demo section" id="glass-demo" aria-labelledby="glass-demo-title">
      <h2 id="glass-demo-title">La recherche sur fond clair ou sombre</h2>
      <p>Laissez le lieu vide pour essayer la validation du formulaire.</p>
      <div class="v32-glass-options">
        <button id="glass-opaque" type="button" aria-pressed="false">Fond opaque</button>
        <button id="glass-unavailable" type="button" aria-pressed="false">Simuler l’indisponibilité</button>
      </div>
      <div class="v32-glass-scenes">
        ${glassExample('light', 'Fond clair')}
        ${glassExample('dark', 'Fond sombre')}
      </div>
    </section>
    ${operationalSamples()}
    <div class="palette section" role="group" aria-label="Palette Péyi contemporain">${palette.map(([label,color]) => `<div class="swatch"><span class="swatch-color swatch-${color}" aria-hidden="true"></span><strong>${label}</strong></div>`).join('')}</div>
    <div class="grid section component-samples">
      <article class="card"><h2>Actions</h2><div class="stack">
        <button id="sample-toast">Afficher une notification</button>
        ${link('/','Action secondaire','secondary')}
        <button class="quiet" type="button" id="sample-modal">Ouvrir le dialogue</button>
        <button class="warm" type="button" id="sample-warm">Action mise en avant</button>
        <button class="danger" type="button" id="sample-danger">Action à confirmer</button>
        <button disabled>Indisponible</button>
      </div></article>
      <article class="card"><h2>Champs et reprise</h2>
        <form id="sample-form">${field('Prénom fictif','name','','text','required minlength="2" autocomplete="off"')}${select('Préférence','preference',[['','Choisir'],['short','Réponse courte'],['detailed','Réponse détaillée']])}${textarea('Note fictive','note')}${field('Champ indisponible','unavailable','Indisponible','text','disabled')}${errorSlot}<button type="submit">Tester le formulaire</button></form>
        <p class="section muted">Saisissez « erreur » pour essayer une erreur récupérable. La saisie reste affichée.</p><p id="sample-form-result" role="status"></p>
      </article>
      <article class="card"><h2>États explicites</h2><div class="stack">${badge('confirmed')}${badge('pending')}${badge('rejected')}</div><details class="section"><summary>Tous les états existants</summary><div class="stack">${Object.keys(statuses).map(badge).join('')}</div></details></article>
      <article class="card"><h2>Informations et retours</h2><div class="stack">
        ${notice('Texte et couleur se complètent.')}${notice('Une opération fictive est terminée.','success')}${notice('Une attention est nécessaire.','warning')}${notice('L’opération fictive a échoué. Vous pouvez réessayer.','error')}
      </div></article>
      <article class="card"><h2>État vide</h2>${empty('Aucun élément ici','Changez les critères pour poursuivre.',link('/search','Explorer les véhicules','secondary'))}</article>
      <article class="card"><h2>Chargement</h2><p>Une place réservée garde la page stable pendant le chargement.</p>${shellLoading}</article>
    </div>
    <section class="card section"><h2>Une typographie lisible</h2><p class="editorial-type">Une voiture, à votre rythme.</p><p>Le corps reste à 16 px, avec un interligne de 24 px. Les informations secondaires utilisent au moins 14 px.</p><small>Une information secondaire reste lisible et conserve son contexte.</small></section>
    </div>`;
  bindGlassDemo();
  bindOperationalSamples(document.getElementById('surfaces-operationnelles'));
  document.getElementById('sample-toast').onclick = () => toast('Notification de démonstration.');
  const open = () => modal('Un dialogue clair', `<p>Les exemples sont fictifs. Fermer ou Échap vous ramène au bouton d’origine.</p>${field('Votre prénom fictif','firstName','','text','required minlength="2"')}<p>Saisissez « erreur » pour tester la reprise.</p>`, async b => {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (b.firstName.trim().toLowerCase() === 'erreur') throw Error('Exemple d’erreur. Corrigez votre prénom fictif puis réessayez.');
    toast('Exemple confirmé.');
  });
  document.getElementById('sample-modal').onclick = open;
  document.getElementById('sample-danger').onclick = open;
  document.getElementById('sample-warm').onclick = () => toast('Action fictive sélectionnée.');
  bindForm('sample-form', async b => {
    document.getElementById('sample-form-result').textContent = '';
    await new Promise(resolve => setTimeout(resolve, 400));
    if (b.name.trim().toLowerCase() === 'erreur') throw Error('Exemple d’erreur. Votre saisie est conservée ; corrigez le prénom fictif.');
    document.getElementById('sample-form-result').textContent = 'Formulaire fictif vérifié, aucune donnée envoyée.';
  });
}
