import {escape,icon,showFlash} from '/ui/components.js';
export const can=(me,p)=>me?.permissions?.includes(p)&&me.status==='active';
export const menus=[['/','Dashboard','grid','dashboard.read'],['/moderation','Modération','shield','listings.review'],['/users','Utilisateurs','user','users.read'],['/cases','Litiges & signalements','file','cases.read'],['/payments','Paiements fictifs','wallet','finance.read'],['/administration','Administration','lock','staff.manage']];
let dispose = () => {};
export function shell(me) {
  dispose();
  const path = location.pathname;
  const label = me?.id === 'employee' ? 'Employé' : me?.id === 'admin' ? 'Admin' : me?.id?.startsWith('super') ? 'Super Admin' : me?.id === 'finance' ? 'Agent finance' : 'Compte interne';
  document.getElementById('shell').innerHTML = me ? `
    <div class="admin-layout"><aside class="sidebar" id="sidebar">
      <div class="sidebar-heading"><div><a class="logo" href="/">Lokasyon <span>Péyi</span></a><p><small>BACK-OFFICE · DÉMONSTRATION</small></p></div><button type="button" class="light sidebar-close" id="admin-menu-close" aria-label="Fermer la navigation administration">${icon('close')}</button></div>
      <nav aria-label="Navigation administration">${menus.filter(x => can(me,x[3])).map(([href,title,symbol]) => {
        const active = href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
        return `<a href="${href}" class="${active ? 'active' : ''}" ${active ? 'aria-current="page"' : ''}>${icon(symbol)}${title}</a>`;
      }).join('')}</nav>
      <div class="sidebar-bottom"><p><small>Données fictives. Permissions explicites, dossiers affectés.</small></p><a class="button light" href="/login">${icon('user')} Changer de profil</a></div>
    </aside><div><header class="admin-header"><button type="button" class="secondary admin-menu" id="admin-menu" aria-controls="sidebar" aria-expanded="false">${icon('menu')} Menu</button><p class="admin-banner">Espace interne indépendant</p><div class="identity"><div class="avatar">${escape(me.name[0])}</div><div><strong>${escape(me.name)}</strong><p><small>${label}</small></p></div><a href="/login" class="button secondary" aria-label="Changer de profil">Changer</a></div></header><main class="admin-main" id="main" tabindex="-1"></main></div></div>` : '<main id="main" class="admin-login" tabindex="-1"></main>';
  if (me) {
    const trigger = document.getElementById('admin-menu'), sidebar = document.getElementById('sidebar');
    const close = (restore = true) => {
      sidebar.classList.remove('open'); trigger.setAttribute('aria-expanded','false');
      if (restore && trigger.getClientRects().length) { trigger.focus({preventScroll:true}); trigger.scrollIntoView({block:'nearest',behavior:'instant'}); }
    };
    trigger.onclick = () => {
      if (sidebar.classList.contains('open')) close();
      else { sidebar.classList.add('open'); trigger.setAttribute('aria-expanded','true'); (sidebar.querySelector('nav a') || document.getElementById('admin-menu-close')).focus(); }
    };
    document.getElementById('admin-menu-close').onclick = () => close();
    const onEscape = e => { if (e.key === 'Escape' && sidebar.classList.contains('open')) { e.preventDefault(); close(); } };
    document.addEventListener('keydown',onEscape);
    let sidebarFocus = null;
    const rememberFocus = e => { sidebarFocus = sidebar.contains(e.target) ? e.target : null; };
    document.addEventListener('focusin',rememberFocus);
    const desktop = matchMedia('(min-width:768px)');
    const resized = () => {
      const focused = sidebar.contains(document.activeElement) ? document.activeElement : sidebarFocus;
      close(false);
      if (focused && !focused.getClientRects().length) {
        const next = desktop.matches ? sidebar.querySelector('[aria-current]') || sidebar.querySelector('nav a') : trigger;
        next?.focus({preventScroll:true});
      }
    };
    desktop.addEventListener('change',resized);
    dispose = () => { document.removeEventListener('keydown',onEscape); document.removeEventListener('focusin',rememberFocus); desktop.removeEventListener('change',resized); };
  }
  showFlash();
}
