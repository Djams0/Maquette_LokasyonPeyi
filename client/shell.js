import {icon,escape,showFlash} from '/ui/components.js';
import {currentDestination,navigationRole,navigationState,primaryDestinations} from './pages/navigation.js';
const primaryLinks = (role,path,mobile=false,{internal=false,thread=false}={}) => {
  const active=currentDestination(path,role);
  const current=path===active&&!thread?'page':'location';
  return primaryDestinations(role,{internal}).map(([href,symbol,label])=>`<a href="${href}"${active===href?` class="active" aria-current="${current}"`:''}>${mobile?navigationIcon(symbol):''}<span>${label}</span></a>`).join('');
};
const discoveryLinks = path => `<a href="/search"${path==='/'?'':` aria-current="${path==='/search'?'page':'location'}"`}>Explorer les voitures</a><a href="${path==='/'?'':'/'}#fonctionnement">Comment ça marche</a><a href="/faq">Aide</a>`;
const homeHelpIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></svg>';
const navigationIcon = symbol => symbol==='info' ? homeHelpIcon : icon(symbol);
const accountControls = me => me
  ? `<a class="link-button button" href="/notifications" aria-label="Notifications">${icon('bell')}</a><a class="avatar" href="/profile" aria-label="Mon profil">${escape(me.name[0])}</a>`
  : '<a class="button secondary" href="/login">Connexion</a>';
const brandImage = '<img src="/assets/v32/marque/logo-horizontal-charte.webp" width="683" height="122" alt="Lokasyon Péyi">';
const internalAccountControls = (me,path) => {
  const current = href => path === href ? ' aria-current="page"' : '';
  return me
    ? `<a class="link-button button" href="/notifications" aria-label="Notifications"${current('/notifications')}>${icon('bell')}</a><a class="internal-account button link-button" href="/profile"${current('/profile')}>${icon('user')}Compte</a>`
    : `<a class="button secondary" href="/login"${current('/login')}>Connexion</a>`;
};

const discoveryFooter = catalogue => `<footer class="explorer-footer v32">
  <div class="explorer-wrap">
    <div class="explorer-footer-grid">
      <div class="explorer-footer-brand">
        <a href="/" class="explorer-footer-logo"><img src="/assets/v32/marque/logo-horizontal-charte.webp" width="683" height="122" alt="Lokasyon Péyi"></a>
        <p>Location de voitures entre particuliers en Guadeloupe.</p>
      </div>
      <nav aria-label="Le service">
        <h2>Le service</h2>
        <a href="/search">Explorer les voitures</a>
        <a href="${catalogue ? '/' : ''}#fonctionnement">Fonctionnement</a>
        <a href="${catalogue ? '/faq' : '#aide'}">Questions fréquentes</a>
      </nav>
      <nav aria-label="Assistance et crédits">
        <h2>Assistance</h2>
        <a href="/faq" id="shell-footer-help">Aide et contact</a>
        <a href="/assets/v32/credits.html">Crédits des photos</a>
        <a href="/login" class="button warm" id="explorer-footer-account">Connexion</a>
      </nav>
    </div>
    <div class="explorer-footer-note"><p>Maquette de validation V3.2 · tarifs et annonces fictifs.</p><a href="/demo">Démo & comptes</a></div>
  </div>
</footer>`;
const menuLink = (href, symbol, label, internalState) => {
  const path = location.pathname.replace(/\/$/,'') || '/';
  const threadParent = href === '/messages' && internalState?.thread;
  const current = !threadParent && path === (internalState ? href.split('?')[0] : href);
  const parentLinks = internalState ? ['/owner/vehicles','/profile/documents','/cases'] : ['/owner','/cases'];
  const rentalParent = internalState && href === '/rentals' && currentDestination(path,'renter') === href;
  const parent = threadParent || rentalParent || (parentLinks.includes(href) && path.startsWith(href + '/'));
  return `<a class="menu-link ${current || parent ? 'active' : ''}" ${current || parent ? `aria-current="${current ? 'page' : 'location'}"` : ''} href="${href}">${navigationIcon(symbol)}<span>${label}</span>${icon('arrow')}</a>`;
};

function menuContent(me, internalState) {
  const role=navigationRole(me);
  const group=(id,title,links)=>`<section aria-labelledby="${id}"><h3 id="${id}">${title}</h3>${links.map(([href,symbol,label])=>menuLink(href,symbol,label,internalState)).join('')}</section>`;
  const ownerLinks=[
    ['/owner','home','Tableau de bord'],['/owner/vehicles','car','Mon parc'],['/owner/requests','file','Demandes'],
  ];
  if(internalState)ownerLinks.push(['/owner/revenue','file','Revenus'],['/owner/reputation','star','Réputation']);
  const travel=[['/search','car','Catalogue des véhicules'],['/#fonctionnement','info','Comment ça marche']];
  if(me)travel.push(['/rentals','calendar','Locations'],['/messages','message','Messages']);
  const account=me ? [
    ['/profile','user','Mon profil'],['/profile/documents','shield','Documents & vérification'],
    ['/notifications','bell','Notifications'],['/profile/reviews','star','Mes avis'],
  ] : [['/login?next=%2Fprofile','user','Connexion']];
  if(role!=='owner')account.push(['/owner/start','car','Devenir propriétaire']);
  const help=[['/faq','file','Questions fréquentes']];
  if(me)help.push(['/assistance','message','Contacter l’assistance'],['/cases','file','Mes dossiers']);
  return `<p class="muted" id="menu-identity">${me?escape(me.name)+' · compte de démonstration':'Explorez librement, connectez-vous pour poursuivre une location.'}</p>
    <nav aria-label="Accès complémentaires" class="menu-groups">
      ${role==='owner'?group('menu-owner','Espace propriétaire',ownerLinks):''}
      ${group('menu-destinations','Se déplacer',travel)}
      ${group('menu-account','Mon compte',account)}
      ${group('menu-help','Aide',help)}
      ${group('menu-demo','Démonstration',[['/demo','user','Démo & comptes'],['/demo/audit','grid','Atelier d’audit'],['/design-system','grid','Composants visuels']])}
    </nav>`;
}

function replaceLinks(slot,markup,fallback) {
  const focused=slot.contains(document.activeElement) ? document.activeElement : null;
  slot.innerHTML=markup;
  if(focused) {
    const links=[...slot.querySelectorAll('a[href]')].filter(link=>link.getClientRects().length);
    (links.find(link=>link.href===focused.href)||links[0]||fallback).focus({preventScroll:true});
  }
}

export function shell() {
  const state = navigationState(location.pathname, location.search);
  const path=location.pathname.replace(/\/$/,'') || '/';
  const explorer = path === '/';
  const catalogue = path === '/search';
  const vehicle = /^\/vehicle\/[^/]+$/.test(path);
  const discovery = explorer || catalogue || vehicle;
  const internalState = discovery ? undefined : {internal: true, thread: state.thread};
  const accountMarkup = discovery ? accountControls : me => internalAccountControls(me,path);
  const returnHref=state.back?.[0];
  const privateReturn=returnHref && returnHref!=='/' && returnHref!=='/demo';
  const returnLink=state.back ? `<a href="${escape(returnHref)}">${icon('back')}${state.back[1]}</a>` : '';
  const host = document.getElementById('shell');
  const variant = explorer ? 'is-explorer' : catalogue ? 'is-catalogue' : vehicle ? 'is-vehicle-detail' : 'is-internal';
  host.className = 'client-shell' + (state.root ? ' has-bottom-nav' : vehicle ? ' has-footer-nav' : '') + ' ' + variant;
  host.dataset.role='visitor';
  host.innerHTML = `
    <header class="header${discovery ? ' v32' : ' internal-header'}">
      <a class="logo" href="/">${brandImage}</a>
      <nav aria-label="Navigation principale" id="header-nav">${discovery ? discoveryLinks(path) : primaryLinks('visitor',path,false,internalState)}</nav>
      <div class="tools">
        <span id="shell-account">${accountMarkup(null)}</span>
        <button type="button" class="secondary navigation-toggle" id="menu-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-haspopup="dialog" aria-controls="navigation-panel">${icon('menu')}<span class="menu-label">Menu</span></button>
      </div>
    </header>
    <dialog id="navigation-panel" class="navigation-panel" aria-labelledby="navigation-title">
      <div class="navigation-panel-heading"><h2 id="navigation-title">Menu</h2><button type="button" class="link-button" id="menu-close" aria-label="Fermer le menu">${icon('close')}</button></div>
      <div id="menu-content">${menuContent(null,internalState)}</div>
    </dialog>
    ${state.back ? `<nav class="context-nav" aria-label="Retour"${privateReturn?' hidden':''}>${privateReturn?'':returnLink}</nav>` : ''}
    <main class="client-main" id="main" tabindex="-1"></main>
    ${discovery ? discoveryFooter(!explorer) : `<footer class="footer"><div><a class="logo" href="/">Lokasyon <span>Péyi</span></a><p>Un autre chemin pour découvrir le Péyi.</p><small>Maquette interactive · données fictives · aucun paiement réel</small></div><nav aria-label="Aide et démonstration" class="row"><a href="/faq">FAQ</a><a href="/faq" id="shell-footer-help">Nous contacter</a><a href="/design-system">Design system</a><a href="/demo">Guide de démonstration</a><a href="/demo/audit">Atelier d’audit</a><a class="photo-credit-link" href="/assets/v32/credits.html">Crédits des photos</a></nav></footer>`}
    ${state.root || vehicle ? `<nav class="bottom-nav" aria-label="Navigation mobile">${discovery?primaryLinks('visitor',path,true):''}</nav>` : ''}`;
  const trigger = document.getElementById('menu-toggle'), panel = document.getElementById('navigation-panel');
  const close = document.getElementById('menu-close'), content = document.getElementById('menu-content');
  const header = document.getElementById('header-nav'), account = document.getElementById('shell-account');
  const bottom = host.querySelector('.bottom-nav'), footerAccount = document.getElementById('explorer-footer-account');
  const footerHelp = document.getElementById('shell-footer-help'), contextNav=host.querySelector('.context-nav');
  let identity=null, menuIdentity=null, anchor;
  function syncMenu() {
    if (identity===menuIdentity) return;
    replaceLinks(content,menuContent(identity,internalState),close);
    menuIdentity=identity;
  }
  trigger.onclick = () => { panel.showModal(); trigger.setAttribute('aria-expanded','true'); };
  close.onclick = () => panel.close();
  panel.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded','false');
    syncMenu();
    if(anchor) {
      location.hash=anchor;
      document.getElementById(anchor.slice(1))?.focus();
      anchor=null;
    } else trigger.focus({preventScroll:true});
  });
  content.addEventListener('click', event=>{
    const link=event.target.closest('a[href]');
    if(!link || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)return;
    const url=new URL(link.href);
    if(url.hash && url.pathname===location.pathname && url.search===location.search) {
      event.preventDefault();
      anchor=url.hash;
      panel.close();
    }
  });
  panel.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const controls = [...panel.querySelectorAll('a[href],button:not([disabled])')].filter(el => el.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  const desktop = matchMedia(discovery ? '(min-width:880px)' : '(min-width:1024px)');
  const resized = () => { if (panel.open) panel.close(); };
  desktop.addEventListener('change',resized);
  showFlash();
  return me=>{
    const role=navigationRole(me);
    const previous=navigationRole(identity);
    identity=role==='visitor' ? null : me;
    if(role!==previous) {
      host.dataset.role=role;
      replaceLinks(header,role==='visitor'&&discovery?discoveryLinks(path):primaryLinks(role,path,false,internalState),trigger);
      if(bottom)replaceLinks(bottom,!discovery&&role==='visitor'?'':primaryLinks(role,path,true,internalState),trigger);
    }
    replaceLinks(account,accountMarkup(identity),trigger);
    if(footerAccount) {
      footerAccount.href=identity?'/profile':'/login';
      footerAccount.textContent=identity?'Mon compte':'Connexion';
    }
    if(footerHelp) footerHelp.href=identity?'/assistance':'/faq';
    if(privateReturn) {
      const allowed=identity && (returnHref!=='/owner' || role==='owner');
      if(contextNav.hidden===Boolean(allowed)) {
        contextNav.hidden=!allowed;
        replaceLinks(contextNav,allowed?returnLink:'',trigger);
      }
    }
    // Keep the discovery menu stable when its visitor links were already in use.
    if(!discovery || !panel.open || (menuIdentity && (menuIdentity.id!==identity?.id || navigationRole(menuIdentity)!==role)))syncMenu();
  };
}
export function ownerNav() {
  const path = location.pathname.replace(/\/$/,'');
  return `<nav class="subnav${path==='/owner'?' owner-dashboard-nav':''}" aria-label="Espace propriétaire">${[['/owner','Aujourd’hui'],['/owner/vehicles','Véhicules'],['/owner/requests','Demandes'],['/owner/revenue','Revenus'],['/owner/reputation','Réputation']].map(([href,label]) => {
    const active = href === '/owner' ? path === href : path === href || path.startsWith(href + '/');
    return `<a class="${active ? 'active' : ''}" href="${href}" ${active ? `aria-current="${path===href?'page':'location'}"` : ''}>${label}</a>`;
  }).join('')}</nav>`;
}
