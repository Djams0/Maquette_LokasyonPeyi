import {api} from './http.js';
import {shell} from './shell.js';
import {escape,link,notice,empty,shellLoading} from '/ui/components.js';
import {home,search,vehicle} from './pages/catalog.js';
import {login,profile,documents,notifications,messages} from './pages/account.js';
import {requestPage,rentals,rental,payment} from './pages/rentals.js';
import {inspection} from './pages/inspection.js';
import {ownerStart,ownerPage} from './pages/owner.js';
import {wizard} from './pages/wizard.js';
import {cases,review,receipt,faq} from './pages/support.js';
import {demo,designSystem} from './pages/demo.js';
const path=location.pathname.replace(/\/$/,'')||'/';
// Recovery must work even while the intentionally simulated network is down.
if(path==='/demo')sessionStorage.removeItem('network-demo');
shell(null);document.getElementById('main').innerHTML=shellLoading;
try{const me=await api('/me');shell(me);document.getElementById('main').innerHTML=shellLoading;
 const publicPath=['/','/search','/login','/register','/faq','/owner/start','/demo','/design-system'].includes(path)||path.startsWith('/vehicle/');
 if(!publicPath&&!me&&/^\/(rentals|rental|request|payment|inspection|messages|profile|notifications|owner|cases|assistance|review|receipt)(\/|$)/.test(path)){location.replace('/login?next='+encodeURIComponent(path+location.search));}else{
 const parts=path.split('/').filter(Boolean),[a,b,c]=parts;
 document.title=({search:'Nos véhicules',rentals:'Mes locations',owner:'Espace propriétaire',profile:'Mon profil',faq:'Questions fréquentes'}[a]||'Bienvenue')+' · Lokasyon Péyi';
 if(path==='/')await home(me);
 else if(path==='/search')await search();
 else if(a==='vehicle'&&b)await vehicle(b,me);
 else if(path==='/login'||path==='/register')await login(path==='/register');
 else if(path==='/profile')await profile(me);
 else if(path==='/profile/documents')await documents();
 else if(path==='/notifications')await notifications();
 else if(path==='/messages')await messages(me);
 else if(path==='/rentals')await rentals(me);
 else if(a==='request'&&b)await requestPage(b,me);
 else if(a==='rental'&&b)await rental(b,me);
 else if(a==='payment'&&b)await payment(b);
 else if(a==='inspection'&&b&&c)await inspection(b,c);
 else if(path==='/owner/start')await ownerStart(me);
 else if(path==='/owner/vehicles/new')await wizard(me);
 else if(path==='/owner')await ownerPage('dashboard',me);
 else if(a==='owner'&&['vehicles','requests','revenue','reputation'].includes(b))await ownerPage(c?'vehicle':b,me,c);
 else if(a==='cases')await cases(b);
 else if(path==='/assistance')await cases('new');
 else if(a==='review'&&b)await review(b);
 else if(a==='receipt'&&b)await receipt(b);
 else if(path==='/faq')faq();
 else if(path==='/demo')await demo(me);
 else if(path==='/design-system')designSystem();
 else document.getElementById('main').innerHTML=empty('404 · Ce chemin n’existe pas','Revenez à l’accueil ou explorez le catalogue.',link('/','Accueil')+' '+link('/search','Catalogue','secondary'));
 }
}catch(e){document.getElementById('main').innerHTML=`<div class="narrow section"><h1>${e.status===403?'Accès non autorisé':e.status===404?'Élément introuvable':'Impossible de charger cette page'}</h1>${notice(escape(e.message),'error')}<div class="form-actions"><button id="retry">Réessayer</button>${link('/demo','Réparer le scénario / changer de profil','secondary')}${link('/','Accueil','secondary')}</div></div>`;document.getElementById('retry').onclick=()=>location.reload();}
