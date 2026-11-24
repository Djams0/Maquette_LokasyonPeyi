import {api} from '../http.js';
import {safeNext} from './navigation.js';
import {escape,icon,link,notice,empty,select,textarea,errorSlot,bindForm,flash,date,badge,kv} from '/ui/components.js';

const kinds = ['Dommage','Annulation','Prolongation','Retour non confirmé','Assistance','Demande d’information','Caution contestée'];
const main = () => document.getElementById('main');
const caseUrl = id => '/cases/'+encodeURIComponent(id);
const rentalUrl = id => '/rental/'+encodeURIComponent(id);
const back = (href,label) => link(href,icon('back')+label,'secondary support-back');
const heading = (title,description='') => `<header class="support-heading"><h1>${title}</h1>${description ? '<p>'+escape(description)+'</p>' : ''}</header>`;
const surface = content => `<div class="support-surface">${content}</div>`;
const euro = new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',minimumFractionDigits:0,maximumFractionDigits:2});
const dateValue = value => value && !Number.isNaN(Date.parse(value)) ? date(value) : 'Non renseignée';
const aid = () => `<aside class="card support-rail"><h2>Aide rapide</h2>${link('/faq','Questions fréquentes','secondary')}</aside>`;
const writeKey = (userId,path) => 'lp-support:'+userId+':'+path;
const writeStatus = () => '<p data-write-status role="status" class="support-status"></p>';

function loginHref() {
  return '/login?next='+encodeURIComponent(safeNext(location.pathname+location.search+location.hash));
}

async function assertAccount(userId) {
  const me = await api('/me');
  if (me?.id !== userId || me.status !== 'active') {
    throw Object.assign(new Error('La session a changé. Reconnectez-vous avec le compte utilisé pour cette saisie.'),{status:401});
  }
}

// Preserve the original body and key until the API resolves an uncertain write.
function bindSupportWrite({formId,path,userId,body,readResult,onSuccess}) {
  const form = document.getElementById(formId);
  if (!form) return;
  const status = form.parentElement.querySelector('[data-write-status]');
  const fields = form.querySelector('fieldset');
  const submit = form.querySelector('button[type="submit"]');
  const label = submit.textContent;
  const reconnect = form.querySelector('[data-reconnect]');
  const key = writeKey(userId,path);
  let pending;
  try {
    const saved = JSON.parse(sessionStorage.getItem(key));
    if (typeof saved?.key === 'string' && saved.body && typeof saved.body === 'object') pending = saved;
  } catch { /* Keep the live form usable. */ }

  function remember(intent) {
    pending = intent;
    try {
      if (intent) sessionStorage.setItem(key,JSON.stringify(intent));
      else sessionStorage.removeItem(key);
    } catch { /* The mounted form retains the intent. */ }
  }

  function restoreFields() {
    for (const [name,value] of Object.entries(pending.body)) {
      const control = form.elements.namedItem(name);
      if (!control) continue;
      if (control instanceof HTMLSelectElement && ![...control.options].some(option => option.value === String(value))) continue;
      control.value = value;
    }
  }

  function showRetry() {
    fields.inert = true;
    submit.textContent = 'Vérifier l’envoi';
    status.textContent = 'Le résultat de l’envoi est à vérifier. Réessayez avec la même saisie.';
  }

  if (pending) {
    restoreFields();
    showRetry();
  }
  bindForm(form,async values => {
    status.textContent = 'Envoi en cours…';
    reconnect.hidden = true;
    fields.inert = true;
    let written = false;
    try {
      if (!pending) remember({body:body(values),key:crypto.randomUUID()});
      await assertAccount(userId);
      const response = await api(path,pending.body,'POST',pending.key);
      written = true;
      const result = readResult ? await readResult() : response;
      await assertAccount(userId);
      remember(null);
      submit.textContent = label;
      status.textContent = '';
      onSuccess(result,status);
    } catch (error) {
      if (error.status === 401) reconnect.hidden = false;
      // A server validation error ends this attempt. Connectivity failures and
      // loss of session can occur after the write and keep its exact intent.
      if (!written && error.status >= 400 && error.status < 500 && error.status !== 401) remember(null);
      if (pending) showRetry();
      else {
        submit.textContent = label;
        status.textContent = '';
      }
      throw error;
    } finally {
      fields.inert = Boolean(pending);
    }
  });
}

function writeActions(label) {
  return `${errorSlot}<div class="form-actions"><button type="submit">${label}</button>
    <a href="${loginHref()}" class="button secondary" data-reconnect hidden>Se reconnecter</a></div>`;
}

function caseHistory(c) {
  return (c.messages || []).map(m => `<li class="support-message">
    <div><strong>${escape(m.author)}</strong><time>${dateValue(m.at)}</time></div>
    <p>${escape(m.text)}</p></li>`).join('');
}

function openCase(c,userId) {
  main().innerHTML = surface(`${back('/cases','Mes dossiers')}
    ${heading(escape(c.kind))}
    <div class="support-layout">
      <div class="support-flow">
        <section class="card support-card" aria-label="Résumé du dossier">
          <div class="support-meta">${badge(c.status || 'Statut non renseigné')}<p>Ouvert le ${dateValue(c.createdAt)}</p></div>
          <h2>Votre demande</h2><p class="support-text">${escape(c.summary)}</p>
          ${c.status === 'evidence_requested' ? notice('Vous pouvez ajouter les précisions demandées dans les échanges partagés.') : ''}
          ${c.decision ? `<h3>Motif communiqué</h3><p class="support-text">${escape(c.decision)}</p>` : ''}
          ${c.rentalId ? link(rentalUrl(c.rentalId),'Location concernée','secondary') : ''}
        </section>
        <section class="card support-card" aria-labelledby="case-exchanges">
          <h2 id="case-exchanges" tabindex="-1">Échanges partagés</h2>
          <p>Les participants du dossier et les agents habilités peuvent lire ces messages.</p>
          <ul id="case-history" class="support-messages">${caseHistory(c)}</ul>
          <p id="case-messages-empty" ${c.messages?.length ? 'hidden' : ''}>Aucun message pour le moment.</p>
          <form id="case-message">
            <fieldset><legend class="sr-only">Ajouter un message au dossier</legend>
              ${textarea('Votre message','text','','required maxlength="2000"')}
            </fieldset>
            ${writeActions('Ajouter au dossier')}
          </form>
          ${writeStatus()}
        </section>
        ${notice('Le dossier ne déclenche aucun remboursement, frais ni décision automatique.')}
      </div>
      ${aid()}
    </div>`);
  bindSupportWrite({
    formId:'case-message',path:caseUrl(c.id),userId,
    body:values => ({text:values.text,action:'message'}),
    readResult:() => api(caseUrl(c.id)),
    onSuccess:(result,status) => {
      document.getElementById('case-history').innerHTML = caseHistory(result);
      document.getElementById('case-messages-empty').hidden = true;
      document.getElementById('case-message').reset();
      status.textContent = 'Message ajouté au dossier.';
      document.getElementById('case-exchanges').focus();
    },
  });
}

async function caseForm(me) {
  const b = await api('/bootstrap');
  await assertAccount(me.id);
  const q = new URLSearchParams(location.search);
  const kind = q.get('kind');
  const rental = q.get('rental');
  const rentals = b.rentals.map(r => [r.id,r.vehicleName+' · '+dateValue(r.start)]);
  const unknownKind = kind && !kinds.includes(kind);
  const unavailableRental = rental && !rentals.some(([id]) => id === rental);
  const notices = [
    unknownKind && 'Le motif indiqué dans le lien est inconnu. Sélectionnez un motif.',
    unavailableRental && 'La location indiquée dans le lien est indisponible pour ce compte.',
  ].filter(Boolean);
  main().innerHTML = surface(`${back('/cases','Mes dossiers')}
    ${heading('Contacter l’assistance','Choisissez un motif et décrivez la situation pour ouvrir un dossier.')}
    <div class="support-layout">
      <div class="support-flow">
        <section class="card support-card" aria-label="Nouveau dossier">
          ${notices.length ? notice(notices.join(' '),'error') : ''}
          <form id="case-create">
            <fieldset><legend class="sr-only">Informations du dossier</legend>
              ${select('Motif','kind',kinds,unknownKind ? 'Assistance' : kind || 'Assistance')}
              ${select('Location concernée','rentalId',[['','Sans location'],...rentals],unavailableRental ? '' : rental || '')}
              <p id="case-effect" class="support-note" hidden>Ce motif ouvre un dossier. La période et le statut de la location restent inchangés.</p>
              ${textarea('Décrivez les faits fictifs','summary','','required minlength="10" maxlength="2000" aria-describedby="case-summary-help"')}
              <p id="case-summary-help" class="support-note">Utilisez uniquement des informations fictives. 10 caractères au minimum.</p>
            </fieldset>
            ${writeActions('Ouvrir un dossier fictif')}
          </form>
          ${writeStatus()}
        </section>
      </div>
      <aside class="card support-rail">
        <h2>Assistance de démonstration</h2>
        <p>Ce formulaire ne contacte aucun service réel. En cas de danger réel, utilisez les services d’urgence habituels.</p>
        ${link('/faq','Questions fréquentes','secondary')}
      </aside>
    </div>`);
  bindSupportWrite({
    formId:'case-create',path:'/cases',userId:me.id,
    body:values => ({kind:values.kind,rentalId:values.rentalId,summary:values.summary}),
    onSuccess:c => {
      flash('Dossier fictif créé.');
      location.href = caseUrl(c.id);
    },
  });
  const selectKind = document.querySelector('#case-create select[name="kind"]');
  const describeEffect = () => {
    document.getElementById('case-effect').hidden = !['Annulation','Prolongation'].includes(selectKind.value);
  };
  selectKind.addEventListener('change',describeEffect);
  describeEffect();
}

export async function cases(id,me) {
  if (id === 'new') return caseForm(me);
  if (id) {
    const c = await api(caseUrl(id));
    await assertAccount(me.id);
    return openCase(c,me.id);
  }
  const cs = await api('/cases');
  await assertAccount(me.id);
  const entries = cs.map(c => `<article class="card support-card">
    <div class="support-meta">${badge(c.status || 'Statut non renseigné')}<p>Ouvert le ${dateValue(c.createdAt)}</p></div>
    <h2>${escape(c.kind)}</h2>
    <p class="support-text">${escape(c.summary)}</p>
    ${link(caseUrl(c.id),'Consulter le dossier','secondary')}
  </article>`).join('');
  main().innerHTML = surface(`${heading('Mes dossiers','Suivez vos échanges avec l’assistance.')}
    <div class="support-layout">
      <div class="support-flow">${entries || empty('Aucun dossier ouvert','Vous pouvez demander de l’aide depuis une location ou ouvrir un dossier.')}
        <div class="form-actions">${link('/cases/new','Ouvrir un dossier')}</div>
      </div>${aid()}
    </div>`);
}

export async function review(id,me) {
  const path = '/rentals/'+encodeURIComponent(id);
  const r = await api(path);
  await assertAccount(me.id);
  const returnLink = back(rentalUrl(id),'Ma location');
  if (r.status !== 'completed' || r.renterId !== me.id) {
    main().innerHTML = surface(`${returnLink}${heading('Avis indisponible')}
      ${notice('Le locataire peut laisser un avis après la clôture de la location.') }`);
    return;
  }
  const b = await api('/bootstrap');
  await assertAccount(me.id);
  if (b.reviews.some(item => item.authorId === me.id && item.rentalId === id)) {
    try { sessionStorage.removeItem(writeKey(me.id,path+'/review')); } catch { /* The API already confirmed the review. */ }
    main().innerHTML = surface(`${returnLink}${heading('Avis déjà envoyé')}
      <div class="card support-card"><p>Suivez le statut de votre avis depuis votre compte.</p>
      ${link('/profile/reviews','Mes avis')}</div>`);
    return;
  }
  const ratings = ['5','4','3','2','1'].map(n => [n,n+' sur 5']);
  main().innerHTML = surface(`${returnLink}${heading('Donner un avis',r.vehicleName)}
    <div class="support-layout">
      <section class="card support-card" aria-label="Avis sur la location">
        <form id="review-form">
          <fieldset><legend>Évaluation de la location</legend>
            <div class="support-rating">${select('Le véhicule','vehicleRating',ratings)}${select('Le propriétaire','ownerRating',ratings)}</div>
            ${textarea('Votre avis public','comment','','required minlength="3" maxlength="1200" aria-describedby="review-help"')}
            <p id="review-help" class="support-note">L’avis sera soumis à modération. Utilisez uniquement des informations fictives.</p>
          </fieldset>
          ${writeActions('Envoyer mon avis')}
        </form>
        ${writeStatus()}
      </section>
      <aside class="card support-rail"><h2>Après l’envoi</h2><p>Consultez le statut de modération depuis votre compte.</p>${link('/profile/reviews','Mes avis','secondary')}</aside>
    </div>`);
  bindSupportWrite({
    formId:'review-form',path:path+'/review',userId:me.id,
    body:values => ({
      vehicleRating:Number(values.vehicleRating),ownerRating:Number(values.ownerRating),comment:values.comment,
    }),
    onSuccess:() => {
      flash('Avis envoyé pour modération.');
      location.href = rentalUrl(id);
    },
  });
}

export async function receipt(id,me) {
  const r = await api('/rentals/'+encodeURIComponent(id));
  await assertAccount(me.id);
  const returnLink = back(rentalUrl(id),'Ma location');
  if (r.status !== 'completed') {
    main().innerHTML = surface(`${returnLink}${heading('Reçu indisponible')}
      ${notice('Le reçu fictif sera disponible après la clôture de la location.')}`);
    return;
  }
  const fmtMoney = value => Number.isFinite(value) ? euro.format(value)+' fictifs' : 'Non renseigné';
  main().innerHTML = surface(`<div class="support-receipt">
    <div class="no-print">${returnLink}</div>
    <article class="receipt card">
      <p class="eyebrow">Démonstration · sans valeur comptable</p>
      <h1>Reçu fictif de clôture</h1>
      <p>Référence ${escape(id)}</p>
      <dl class="support-receipt-details">
        ${kv('Véhicule',escape(r.vehicleName || 'Non renseigné'))}
        ${kv('Début',dateValue(r.start))}
        ${kv('Fin',dateValue(r.end))}
        ${kv('Location',badge(r.status))}
        ${kv('Paiement',r.payment ? badge(r.payment) : 'Non renseigné')}
        ${kv('Jours illustratifs',Number.isFinite(r.quote?.days) ? r.quote.days : 'Non renseigné')}
        ${kv('Tarif par jour',fmtMoney(r.quote?.daily))}
        ${kv('Total illustratif','<strong>'+fmtMoney(r.quote?.total)+'</strong>')}
        ${kv('Caution, frais et fiscalité','Non compris')}
      </dl>
      <p>Ce document de démonstration ne constitue ni une facture ni une preuve de transfert financier.</p>
    </article>
    <div class="form-actions no-print"><button id="print" type="button">Imprimer / enregistrer en PDF</button></div>
  </div>`);
  document.getElementById('print').onclick = () => window.print();
}

const paymentQuestion = ['Quand dois-je payer ?','Après l’acceptation du propriétaire, une étape distincte simule le paiement. La demande seule ne confirme pas la réservation. Aucune carte ni somme réelle n’est utilisée.'];
export const homeFaqItems = [
  ['Puis-je consulter les voitures sans compte ?', 'Oui. Le catalogue et les fiches sont accessibles sans compte. Connectez-vous pour envoyer une demande.'],
  paymentQuestion,
  ['Où récupérer la voiture ?', 'La fiche indique la commune ou la zone approximative de remise. Le rendez-vous se précise après confirmation de la location.'],
  ['Où voir l’état du véhicule ?', 'Consultez la rubrique « État du véhicule » de la fiche. Si aucun état n’est renseigné, cela ne signifie pas que le véhicule est sans défaut. Les photos de modèle ne documentent pas son état.'],
];

export function renderFaqItems(items, className = '') {
  return items.map(([question,answer]) => `<details class="${className}"><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join('');
}

const faqItems=[...homeFaqItems.filter(item => item !== paymentQuestion),['Comment demander une voiture ?','Explorez le catalogue sans compte, choisissez vos dates puis connectez-vous. Un dossier fictif vérifié permet d’envoyer une demande au propriétaire.'],paymentQuestion,['Comment fonctionne la caution ?','La caution est un contrôle séparé avant le départ. Son montant et son mécanisme restent à valider ; cette maquette ne bloque aucun fonds et ne promet pas qu’elle ne sera jamais débitée.'],['Suis-je automatiquement assuré ?','Non. Le contrôle documentaire et les conditions de couverture restent nécessaires. Aucun contrat ni protection réelle n’est activé par cette démonstration.'],['Puis-je aller sur une autre île ?','Les sorties inter-îles sont indisponibles dans la maquette. Leur éventuelle ouverture dépend de décisions et de conditions de couverture à confirmer.'],['Quel est l’âge minimum ?','La maquette ne fixe pas un minimum de 21 ans. Les critères contractuels d’éligibilité restent à valider.'],['Comment se passe le retour ?','Complétez le constat de retour puis déclarez le retour. Le propriétaire confirme séparément la récupération effective, puis clôture la location. Une contestation reste un dossier distinct.'],['Comment annuler ou prolonger ?','Ouvrez un dossier depuis la location. Il n’y a ni remboursement automatique, ni prolongation immédiate, ni pénalité inventée dans cette démonstration.'],['Quelle commission et quel calendrier de versement ?','Les montants affichés sont bruts et fictifs. Aucune commission de 25 % ni fréquence hebdomadaire n’est appliquée comme règle validée.'],['Les photos déterminent-elles qui est responsable ?','Non. Les captures simulées, leurs versions et leurs dates documentent le dossier. Elles ne prouvent pas automatiquement l’authenticité ni la responsabilité.'],['Puis-je utiliser mes vrais documents ?','Non. Utilisez uniquement les documents synthétiques fournis par la maquette. N’entrez jamais de pièce d’identité, permis, IBAN ou coordonnées bancaires réels.']];
export function faq() {
  main().innerHTML = surface(`${heading('Questions fréquentes','Réservation, caution et assistance dans la démonstration.')}
    <div class="support-layout">
      <div class="support-flow">
        <div class="card support-card">
          <label class="field"><span>Rechercher une question</span>
            <input id="faq-search" type="search" placeholder="Paiement, caution, retour…" aria-controls="faq-list">
          </label>
          <p id="faq-result" class="support-status" role="status"></p>
        </div>
        <div id="faq-list" class="support-faq">${renderFaqItems(faqItems,'faq-item card')}</div>
      </div>
      <aside class="card support-rail"><h2>Besoin d’aide ?</h2>${link('/assistance','Contacter l’assistance','secondary')}</aside>
    </div>`);
  const normalize = value => value.toLocaleLowerCase('fr-FR').normalize('NFD').replace(/\p{M}/gu,'').trim();
  const items = [...document.querySelectorAll('#faq-list .faq-item')];
  document.getElementById('faq-search').oninput = event => {
    const query = normalize(event.target.value);
    let count = 0;
    for (const item of items) {
      item.hidden = !normalize(item.textContent).includes(query);
      if (!item.hidden) count++;
    }
    document.getElementById('faq-result').textContent = !query ? '' : count
      ? count === 1 ? '1 question trouvée.' : count+' questions trouvées.'
      : 'Aucune question trouvée. Essayez un autre terme.';
  };
}
