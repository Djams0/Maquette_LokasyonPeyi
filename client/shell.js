import {icon,escape,showFlash} from '/ui/components.js';
import {destinations,navigationState} from './pages/navigation.js';
let dispose = () => {};
const primaryLinks = (active, mobile = false) => destinations.map(([href, symbol, label]) => `<a href="${href}" class="${active === href ? 'active' : ''}" ${active === href ? 'aria-current="page"' : ''}>${mobile ? icon(symbol) : ''}<span>${label}</span></a>`).join('');
const menuLink = (href, symbol, label) => {
  const path = location.pathname.replace(/\/$/,'') || '/';
  const current = path === href;
  const parent = ['/owner','/cases'].includes(href) && path.startsWith(href + '/');
  return `<a class="menu-link ${current || parent ? 'active' : ''}" ${current || parent ? `aria-current="${current ? 'page' : 'location'}"` : ''} href="${href}">${icon(symbol)}<span>${label}</span>${icon('arrow')}</a>`;
};

export function shell(me) {
  dispose();
  const state = navigationState(location.pathname, location.search);
  const host = document.getElementById('shell');
  host.className = 'client-shell' + (state.root ? ' has-bottom-nav' : '');
  host.innerHTML = `
    <div class="demo-banner">Maquette interactive · données fictives · aucun paiement réel <a href="/demo">Démo & comptes</a></div>
    <header class="header">
      <a class="logo" href="/">Lokasyon <span>Péyi</span></a>
      <nav aria-label="Navigation principale" id="header-nav">${primaryLinks(state.active)}</nav>
      <div class="tools">
        ${me ? `<a class="link-button button" href="/notifications" aria-label="Notifications">${icon('bell')}</a><a class="avatar" href="/profile" aria-label="Mon profil">${escape(me.name[0])}</a>` : '<a class="button secondary" href="/login">Connexion</a>'}
        <button type="button" class="secondary navigation-toggle" id="menu-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-haspopup="dialog" aria-controls="navigation-panel">${icon('menu')}<span class="menu-label">Menu</span></button>
      </div>
    </header>
    <dialog id="navigation-panel" class="navigation-panel" aria-labelledby="navigation-title">
      <div class="navigation-panel-heading"><h2 id="navigation-title">Menu</h2><button type="button" class="link-button" id="menu-close" aria-label="Fermer le menu">${icon('close')}</button></div>
      <p class="muted">${me ? escape(me.name) + ' · compte de démonstration' : 'Explorez librement, connectez-vous pour poursuivre une location.'}</p>
      <nav aria-label="Accès complémentaires" class="menu-groups">
        <section aria-labelledby="menu-destinations"><h3 id="menu-destinations">Se déplacer</h3>${destinations.map(([h,i,t]) => menuLink(h,i,t)).join('')}${menuLink('/search','car','Catalogue des véhicules')}</section>
        <section aria-labelledby="menu-account"><h3 id="menu-account">Mon compte</h3>${me ? '' : menuLink('/login','user','Connexion')}${menuLink('/profile/documents','shield','Documents & vérification')}${menuLink('/notifications','bell','Notifications')}${menuLink('/profile/reviews','star','Mes avis')}${menuLink(me?.owner ? '/owner' : '/owner/start','car',me?.owner ? 'Espace propriétaire' : 'Devenir propriétaire')}</section>
        <section aria-labelledby="menu-help"><h3 id="menu-help">Aide</h3>${menuLink('/faq','file','Questions fréquentes')}${menuLink('/assistance','message','Contacter l’assistance')}${menuLink('/cases','file','Mes dossiers')}</section>
        <section aria-labelledby="menu-demo"><h3 id="menu-demo">Démonstration</h3>${menuLink('/demo','user','Démo & comptes')}${menuLink('/demo/audit','grid','Atelier d’audit')}${menuLink('/design-system','grid','Composants visuels')}</section>
      </nav>
    </dialog>
    ${state.back ? `<nav class="context-nav" aria-label="Retour"><a href="${state.back[0]}">${icon('back')}${state.back[1]}</a></nav>` : ''}
    <main class="client-main" id="main" tabindex="-1"></main>
    <footer class="footer"><div><a class="logo" href="/">Lokasyon <span>Péyi</span></a><p>Un autre chemin pour découvrir le Péyi.</p><small>Prototype indépendant · Guadeloupe</small></div><nav aria-label="Aide et démonstration" class="row"><a href="/faq">FAQ</a><a href="/assistance">Nous contacter</a><a href="/design-system">Design system</a><a href="/demo">Guide de démonstration</a><a href="/demo/audit">Atelier d’audit</a></nav></footer>
    ${state.root ? `<nav class="bottom-nav" aria-label="Navigation mobile">${primaryLinks(state.active,true)}</nav>` : ''}`;
  const trigger = document.getElementById('menu-toggle'), panel = document.getElementById('navigation-panel');
  trigger.onclick = () => { panel.showModal(); trigger.setAttribute('aria-expanded','true'); };
  document.getElementById('menu-close').onclick = () => panel.close();
  panel.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded','false');
    if (trigger.isConnected) trigger.focus({preventScroll:true});
  });
  panel.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const controls = [...panel.querySelectorAll('a[href],button:not([disabled])')].filter(el => el.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  const desktop = matchMedia('(min-width:1024px)');
  const resized = () => { if (panel.open) panel.close(); };
  desktop.addEventListener('change',resized);
  dispose = () => desktop.removeEventListener('change',resized);
  showFlash();
}
export function ownerNav() {
  const path = location.pathname.replace(/\/$/,'');
  return `<nav class="subnav" aria-label="Espace propriétaire">${[['/owner','Vue d’ensemble'],['/owner/vehicles','Véhicules'],['/owner/requests','Demandes'],['/owner/revenue','Revenus'],['/owner/reputation','Réputation']].map(([href,label]) => {
    const active = href === '/owner' ? path === href : path === href || path.startsWith(href + '/');
    return `<a class="${active ? 'active' : ''}" href="${href}" ${active ? 'aria-current="page"' : ''}>${label}</a>`;
  }).join('')}</nav>`;
}
