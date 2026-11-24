import {api} from '../http.js';
import {link, notice, field, errorSlot, bindForm, money} from '/ui/components.js';

const login = '/login?next=/owner/start';

export async function ownerStart(me) {
  const client = me && !me.internal && me.status === 'active';
  const owner = client && me.owner;
  const action = owner ? link('/owner', 'Ouvrir mon espace propriétaire', 'light')
    : link(client ? '#activate' : login, 'Commencer mon parcours', 'light');
  const main = document.getElementById('main');
  main.innerHTML = `<div class="client-operational owner-start-surface">
    <figure class="owner-intro">
      <img src="/assets/v32/editorial/deshaies-grande-anse-1440.webp" alt="Grande Anse à Deshaies, vue depuis le rivage" width="1440" height="553">
      <div class="owner-intro-copy"><h1>Proposez votre voiture au Péyi</h1><p>Découvrez le parcours de location entre particuliers en Guadeloupe.</p>${action}</div>
      <figcaption><a href="/assets/v32/credits.html">Grande Anse, Deshaies · crédit photo</a></figcaption>
    </figure>
    <div class="owner-start-layout">
      <section class="card"><h2>Estimer un revenu brut</h2><form id="estimate">
        ${field('Prix fictif par jour (€)','price',32,'number','min="1" max="1000" required')}
        ${field('Jours loués par mois','days',8,'number','min="1" max="31" required')}
        <button class="secondary" type="submit">Calculer</button>${errorSlot}</form>
        <p class="price" id="estimate-result" role="status">${money(32 * 8)} bruts illustratifs</p>
        <p>Le montant est un exemple de simulation. Les frais, le montant net et les conditions d’assurance restent indéfinis.</p>
      </section>
      <section class="card"><h2>Préparer votre dossier</h2><p>L’identité, les justificatifs du véhicule et les conditions d’assurance sont soumis à des contrôles humains simulés.</p>${link('/faq','Consulter les questions fréquentes','secondary')}</section>
      <section class="card"><h2>Traiter vos demandes</h2><p>Examinez les périodes demandées, puis acceptez ou refusez. Le paiement fictif devient possible après votre acceptation.</p><p>Les constats documentent le départ et le retour.</p></section>
    </div>
    <section id="activate" class="card owner-activation" aria-labelledby="owner-activation-title">
      <h2 id="owner-activation-title">Préparer votre espace propriétaire</h2>
      ${owner ? `<p>Votre espace propriétaire est déjà actif.</p><div class="row">${link('/owner','Voir le tableau de bord','secondary')}${link('/owner/vehicles/new','Préparer une annonce')}</div>`
        : client ? `<p>Les versements sont simulés avec un profil fictif.</p>${me.eligibility !== 'verified' ? notice('Vous pouvez préparer une annonce et compléter votre dossier personnel.') + link('/profile/documents','Mon dossier','secondary') : ''}
        <form id="onboard"><label class="check"><input name="confirm" type="checkbox" required>J’utilise uniquement des données fictives et comprends les limites de la simulation.</label>${errorSlot}<button type="submit">Activer mon espace propriétaire</button></form>`
        : link(login, 'Me connecter pour commencer')}
    </section>
  </div>`;

  bindForm('estimate', values => {
    document.getElementById('estimate-result').textContent = money(Number(values.price) * Number(values.days)) + ' bruts illustratifs';
  });

  async function currentAccount() {
    const actor = await api('/me');
    if (actor?.id === me.id && actor.status === 'active' && !actor.internal) return actor;
    document.getElementById('activate').innerHTML = `<h2 id="owner-activation-title" tabindex="-1">Compte changé</h2><p>Rouvrez le parcours avec le compte courant.</p>${link(actor ? '/owner/start' : login,'Reprendre le parcours','secondary')}`;
    document.getElementById('owner-activation-title').focus();
    throw Error('Le compte a changé.');
  }

  const key = client && !owner ? crypto.randomUUID() : null;
  bindForm('onboard', async () => {
    if (!(await currentAccount()).owner) {
      try {
        await api('/owner/onboarding', {confirm: true}, 'POST', key);
      } catch (error) {
        if (error.status || !(await currentAccount()).owner) throw error;
      }
    }
    if (!(await currentAccount()).owner) throw Error('L’activation reste à vérifier.');
    location.href = '/owner/vehicles/new';
  });
}

export {ownerPage} from './owner-workspace.js';
