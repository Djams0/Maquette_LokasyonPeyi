import {safeNext} from './navigation.js';
import {api} from '../http.js';
import {escape,icon,link,field,select,notice,empty,badge,bindForm,bindActions,flash,modal,errorSlot,date} from '/ui/components.js';

function confirmSession(register, target) {
  flash(register ? 'Compte fictif créé. Bienvenue !' : 'Vous êtes connecté à la démonstration.');
  location.href = target;
}

export async function login(register = false) {
  const target = safeNext(new URLSearchParams(location.search).get('next'));
  const next = encodeURIComponent(target);
  const personas = (await api('/personas?app=client')).filter(persona => persona.status === 'active');
  const formFields = register ? `
    ${field('Prénom fictif','name','','text','required minlength="2" maxlength="80" placeholder="Ex. Sasha"')}
    <label class="check"><input type="checkbox" name="confirm" required>Je crée uniquement un compte de démonstration.</label>`
    : select('Compte de démonstration','persona',personas.map(persona => [persona.id,persona.name]));

  document.getElementById('main').innerHTML = `
    <div class="client-operational account-surface">
      <section class="account-auth" aria-labelledby="auth-title">
        <div class="card account-auth-form">
          <h1 id="auth-title">${register ? 'Créer un compte démo' : 'Se connecter'}</h1>
          <p class="muted">Retrouvez vos locations et vos échanges.</p>
          <nav class="account-auth-tabs" aria-label="Accès au compte">
            <a href="/login?next=${next}" ${register ? '' : 'aria-current="page"'}>Connexion</a>
            <a href="/register?next=${next}" ${register ? 'aria-current="page"' : ''}>Inscription</a>
          </nav>
          ${notice('<strong>Mode démonstration</strong><br>Utilisez uniquement une identité fictive.')}
          ${register || personas.length ? `<form id="auth-form" aria-labelledby="auth-title">
            ${formFields}${errorSlot}
            <button type="submit" class="full">${register ? 'Créer mon compte fictif' : 'Entrer dans la démo'}</button>
          </form>` : `<div class="account-auth-empty">${notice('Aucun compte de démonstration disponible.','warning')}</div>`}
          <p id="auth-status" class="account-document-status" role="status"></p>
          <p id="auth-recovery" hidden>${link('/profile','Vérifier le compte courant','secondary')}</p>
          <a class="account-guest-link" href="/search">Continuer à explorer sans compte</a>
        </div>
        <figure class="account-auth-photo">
          <div class="account-auth-image">
            <img src="/assets/v32/editorial/bourg-deshaies-720.webp" width="720" height="453" loading="lazy" alt="Rue et voitures au pied des collines à Deshaies">
            <div class="account-auth-caption">
              <p>Un trajet au départ du Péyi.</p>
              <small>Vos demandes et vos échanges au même endroit.</small>
            </div>
          </div>
          <figcaption><a href="/assets/v32/credits.html#photo-53">Bourg de Deshaies · Tournasol7 · CC BY 4.0 · recadrage</a></figcaption>
        </figure>
      </section>
    </div>`;

  let creationUnconfirmed = false;
  const status = document.getElementById('auth-status');
  bindForm('auth-form',async values => {
    if (creationUnconfirmed) throw Error('Vérifiez le compte courant avant une nouvelle inscription.');
    status.textContent = register ? 'Création du compte fictif en cours…' : 'Connexion en cours…';
    try {
      await api(register ? '/register' : '/session',register ? {name:values.name,confirm:!!values.confirm} : values);
    } catch (error) {
      if ((error.status && error.status < 500) || sessionStorage.getItem('network-demo') === 'error') throw error;
      if (register) {
        creationUnconfirmed = true;
        document.getElementById('auth-recovery').hidden = false;
        throw Error('La création du compte n’a pas pu être confirmée. Vérifiez le compte courant.');
      }
      const current = await api('/me').catch(() => null);
      if (current?.id !== values.persona || current.status !== 'active') throw error;
    } finally {
      status.textContent = '';
    }
    confirmSession(register,target);
  });
}

const eligibilityLabels = {
  missing:'Profil à compléter',pending:'Vérification en cours',verified:'Profil vérifié',rejected:'Justificatif à remplacer',
};

export async function profile(me) {
  const account = await api('/bootstrap');
  if (!account.me) throw Error('Impossible de retrouver les données du compte.');
  if (account.me.id !== me.id) { location.reload(); return; }
  const {name,memberSince,eligibility,owner} = account.me;
  const unread = account.notifications.filter(n => !n.read).length;
  const item = (href,symbol,label,extra = '') => `<a class="list-item" href="${href}"><span class="account-item-icon">${icon(symbol)}</span><div><strong>${label}</strong>${extra}</div>${icon('arrow')}</a>`;
  document.getElementById('main').innerHTML = `
    <div class="client-operational account-surface">
      <header class="card account-identity">
        <span class="avatar" aria-hidden="true">${escape(name?.[0] || '?')}</span>
        <div><h1>Mon profil</h1><p>${escape(name || 'Compte de démonstration')}${memberSince ? ' · membre depuis '+escape(memberSince) : ''}</p></div>
        <button type="button" class="secondary" id="logout">Se déconnecter</button>
      </header>
      <div class="operational-layout account-profile-layout">
        <section class="card profile-sections account-profile-links" aria-labelledby="account-links-title">
          <h2 id="account-links-title">Votre compte</h2>
          ${item('/profile/documents','shield','Documents & vérification',`<small>${eligibilityLabels[eligibility] || 'État de vérification non renseigné'}</small>`)}
          ${item('/rentals','calendar','Mes locations','<small>Demandes et réservations</small>')}
          ${item('/profile/reviews','star','Mes avis')}
          ${item('/notifications','bell','Notifications',unread ? `<small>${unread} non lue${unread > 1 ? 's' : ''}</small>` : '')}
          <button type="button" class="secondary" id="payment-info">Moyens de paiement</button>
        </section>
        <div class="operational-rail">
          <section class="card">
            <h2>Espace propriétaire</h2>
            <p class="muted">${owner ? 'Retrouvez vos véhicules et les demandes reçues.' : 'Découvrez comment proposer un véhicule dans la démonstration.'}</p>
            ${link(owner ? '/owner' : '/owner/start',owner ? 'Ouvrir mon espace propriétaire' : 'Devenir propriétaire','secondary full')}
            ${owner ? item('/owner/vehicles','car','Mon parc')+item('/owner/requests','file','Demandes propriétaire') : ''}
          </section>
          <section class="card">
            <h2>Aide</h2>
            ${item('/faq','info','Questions fréquentes')}${item('/assistance','message','Contacter l’assistance')}${item('/cases','file','Mes dossiers')}
          </section>
        </div>
      </div>
      <details class="card profile-tools account-tools"><summary>Outils de démonstration</summary>${item('/demo','user','Changer de compte fictif')}${item('/demo/audit','grid','Atelier d’audit')}${item('/design-system','grid','Composants visuels')}<p class="muted">Programme fidélité et réductions reportés. Les règles restent à valider.</p></details>
    </div>`;

  bindActions('#logout',async () => {
    const current = await api('/me');
    if (current?.id !== me.id) { location.reload(); return; }
    try { await api('/session',null,'DELETE'); }
    catch (error) {
      if (await api('/me').catch(() => undefined) !== null) throw error;
    }
    location.href = '/';
  });
  document.getElementById('payment-info').onclick = () => modal('Moyens de paiement', '<p>Aucune carte enregistrée. Les paiements sont simulés après acceptation propriétaire. Aucun prestataire n’est connecté.</p>');
}

const documentKinds = [['Permis','Permis de conduire'],['Identité','Pièce d’identité']];
const ownDocument = (account,kind) => account.documents.find(doc => !doc.vehicleId && doc.kind === kind);

function documentRequestKey(keys, slot) {
  if (keys.has(slot)) return keys.get(slot);
  let key = crypto.randomUUID();
  try {
    key = sessionStorage.getItem(slot) || key;
    sessionStorage.setItem(slot,key);
  } catch { /* The same page can still reconcile using its in-memory key. */ }
  keys.set(slot,key);
  return key;
}

export async function documents() {
  const account = await api('/bootstrap');
  if (!account.me) throw Error('Impossible de retrouver le compte des justificatifs.');
  document.getElementById('main').innerHTML = `
    <div class="client-operational account-surface account-document-page">
      <a class="account-back" href="/profile">${icon('back')} Retour au profil</a>
      <h1>Vos documents</h1>
      <p class="muted">Permis et pièce d’identité</p>
      ${notice('<strong>Vérification de démonstration</strong><br>Utilisez les justificatifs synthétiques intégrés.')}
      <p class="account-document-status" role="status" id="account-document-status"></p>
      <div class="account-document-list">
        ${documentKinds.map(([kind,title],index) => {
          const doc = ownDocument(account,kind);
          return `<article class="card account-document" aria-labelledby="account-doc-${index}">
            <div><div class="row"><h2 id="account-doc-${index}">${title}</h2>${badge(doc?.status || 'missing')}</div>
            <p class="muted">${doc ? `Justificatif synthétique · version ${escape(doc.version)}` : 'Aucun justificatif synthétique ajouté.'}</p>
            ${doc?.reason ? `<p><strong>${doc.status === 'rejected' ? 'Motif du refus' : 'Motif du contrôle'}</strong><br>${escape(doc.reason)}</p>` : ''}</div>
            <button type="button" class="secondary" data-document="${kind}" aria-describedby="account-doc-${index}">${doc ? 'Remplacer par une nouvelle version fictive' : 'Envoyer une pièce fictive'}</button>
          </article>`;
        }).join('')}
      </div>
      <div class="row account-document-actions">${link('/search','Explorer en attendant','secondary')}${link('/demo','Passer à l’agent de contrôle','quiet')}</div>
    </div>`;

  const keys = new Map();
  const state = document.getElementById('account-document-status');
  const buttons = [...document.querySelectorAll('#main [data-document]')];
  bindActions('#main [data-document]', async el => {
    const kind = el.dataset.document, version = ownDocument(account,kind)?.version || 0;
    const slot = `lp-document:${account.me.id}:${kind}:${version}`;
    const complete = message => {
      keys.delete(slot);
      try { sessionStorage.removeItem(slot); } catch { /* Nothing to remove when storage is unavailable. */ }
      flash(message);
      location.reload();
    };
    buttons.forEach(button => { if (button !== el) button.disabled = true; });
    state.textContent = 'Vérification du justificatif en cours…';
    try {
      const current = await api('/bootstrap');
      if (current.me?.id !== account.me.id) { location.reload(); return; }
      if ((ownDocument(current,kind)?.version || 0) !== version) { complete('La dernière version du justificatif est affichée.'); return; }
      try {
        const saved = await api('/documents',{kind},'POST',documentRequestKey(keys,slot));
        if (saved?.userId && saved.userId !== account.me.id) { location.reload(); return; }
        if (saved?.userId !== account.me.id || saved.kind !== kind || !Number.isInteger(saved.version) || saved.version <= version) throw Error('Réponse documentaire indéterminée.');
      } catch (error) {
        if (error.status && error.status < 500) throw error;
        const latest = await api('/bootstrap').catch(() => null);
        if (latest && latest.me?.id !== account.me.id) { location.reload(); return; }
        if (latest && (ownDocument(latest,kind)?.version || 0) > version) { complete('La nouvelle version a été retrouvée dans votre compte.'); return; }
        throw Error('Le résultat de cet envoi est incertain. Vous pouvez réessayer le même envoi.');
      }
      complete('Pièce fictive envoyée. Le contrôle est en attente.');
    } finally {
      state.textContent = '';
      buttons.forEach(button => { if (button !== el) button.disabled = false; });
    }
  });
}

export async function notifications(me) {
  const main = document.getElementById('main');
  main.innerHTML = `<section class="notifications-surface">
    <header class="notifications-heading"><h1 id="notifications-title" tabindex="-1">Notifications</h1>
      <button type="button" class="secondary" id="read-all" hidden aria-disabled="false">${icon('check')} Tout marquer comme lu</button>
    </header>
    <div class="notifications-feedback"><p id="notifications-status" role="status">Chargement des notifications…</p>
      <button type="button" class="secondary" id="refresh-notifications" hidden aria-disabled="false">${icon('refresh')} Actualiser les notifications</button></div>
    <div id="notifications-list"></div>
  </section>`;
  const section = main.querySelector('.notifications-surface');
  const title = section.querySelector('#notifications-title'), status = section.querySelector('#notifications-status');
  const read = section.querySelector('#read-all'), refresh = section.querySelector('#refresh-notifications');
  const list = section.querySelector('#notifications-list');
  let busy = false, blocked = false;

  function block(current) {
    const restoreFocus = section.contains(document.activeElement);
    blocked = true;
    read.hidden = refresh.hidden = true;
    list.replaceChildren();
    const resume = document.createElement('a');
    resume.className = 'button secondary';
    resume.href = current ? '/notifications' : '/login?next=%2Fnotifications';
    resume.textContent = current ? 'Recharger avec le compte courant' : 'Se connecter';
    status.textContent = current ? 'Ce compte ne peut plus consulter les notifications affichées.' : 'Votre session a expiré.';
    status.after(resume);
    if (restoreFocus) resume.focus({preventScroll: true});
  }

  function isCurrent(current) {
    if (current?.id === me.id && current.status === 'active' && !current.internal) return true;
    block(current);
    return false;
  }

  function render(items) {
    const unread = items.filter(item => !item.read).length;
    read.hidden = unread === 0;
    list.innerHTML = items.length ? `<ul class="notification-list card">${items.map(item => {
      const href = safeNext(item.href);
      const contents = `<span class="notification-icon">${icon(item.read ? 'check' : 'bell')}</span>
        <span class="notification-copy"><strong>${escape(item.title)}</strong><small>${date(item.at)}</small></span>
        <span class="notification-state">${item.read ? 'Lue' : 'Non lue'}</span>`;
      return `<li class="${item.read ? '' : 'unread'}">${href !== '/'
        ? `<a class="notification-row" href="${escape(href)}">${contents}${icon('arrow')}</a>`
        : `<div class="notification-row">${contents}</div>`}</li>`;
    }).join('')}</ul>` : empty('Aucune notification', 'Vos notifications de location, de compte et de messagerie apparaîtront ici.');
    return unread;
  }

  async function update(mark = false) {
    if (busy || blocked) return;
    const action = document.activeElement;
    busy = true;
    read.setAttribute('aria-disabled', 'true');
    refresh.setAttribute('aria-disabled', 'true');
    status.textContent = mark ? 'Marquage des notifications en cours…' : 'Chargement des notifications…';
    let writeAttempted = false;
    try {
      if (mark) {
        if (!isCurrent(await api('/me'))) return;
        writeAttempted = true;
        await api('/notifications/read', {});
      }
      const data = await api('/bootstrap');
      if (!isCurrent(data.me) || !isCurrent(await api('/me'))) return;
      const unread = render(data.notifications);
      refresh.hidden = true;
      status.textContent = !data.notifications.length ? '' : unread
        ? `${unread} notification${unread > 1 ? 's non lues' : ' non lue'}.`
        : mark ? 'Notifications marquées comme lues. Tout est à jour.' : 'Tout est à jour.';
    } catch (error) {
      if (error.status === 401 || error.status === 403) { block(error.status === 403); return; }
      read.hidden = true;
      refresh.hidden = false;
      status.textContent = writeAttempted
        ? 'Le marquage n’a pas pu être vérifié. Actualisez les notifications pour connaître leur état.'
        : 'Les notifications sont indisponibles. Actualisez pour réessayer.';
    } finally {
      busy = false;
      read.setAttribute('aria-disabled', 'false');
      refresh.setAttribute('aria-disabled', 'false');
      if (!blocked && (action === read || action === refresh) && action.hidden && [action, document.body].includes(document.activeElement)) {
        (refresh.hidden ? title : refresh).focus({preventScroll: true});
      }
    }
  }

  read.onclick = () => update(true);
  refresh.onclick = () => update();
  await update();
}
export {messages} from './messaging.js';

export async function myReviews(){const b=await api('/bootstrap');const reviews=b.reviews.filter(r=>r.authorId===b.me.id);document.getElementById('main').innerHTML=`<div class="narrow"><a href="/profile">${icon('back')} Mon profil</a><h1 class="section">Mes avis</h1>${reviews.length?reviews.map(r=>`<article class="card section"><h2>${r.vehicleRating??r.rating} / 5</h2>${badge(r.status)}<p>${escape(r.comment)}</p>${r.reply?notice('Réponse du propriétaire : '+escape(r.reply)):''}${link('/vehicle/'+r.vehicleId,'Voir le véhicule','secondary')}</article>`).join(''):empty('Aucun avis envoyé','Vous pourrez laisser un avis après la clôture d’une location.',link('/rentals?tab=history','Mes locations terminées','secondary'))}</div>`;}
