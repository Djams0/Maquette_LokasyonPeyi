const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const params = new URLSearchParams(location.search);
const page = params.get('page') || 'accueil';
const role = ['owner', 'renter'].includes(params.get('profil')) ? params.get('profil') : 'visitor';
const roleLabel = {owner:'Espace propriétaire', renter:'Mon compte', visitor:'Connexion'};
const media = '../ressources/';
const credit = '../ressources/Credits.html';
const filterKeys = ['max','category','gearbox','seats','fuel','equipment'];
const searchKeys = ['q','from','until',...filterKeys,'sort','view'];
const icons = {
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15"/>',
  pin:'<path d="M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4m8-4v4M3 10h18"/>',
  arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
  back:'<path d="M20 12H5m6-6-6 6 6 6"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  heart:'<path d="M20.5 5.2a5 5 0 0 0-7 0L12 6.6l-1.5-1.4a5 5 0 0 0-7 7L12 21l8.5-8.8a5 5 0 0 0 0-7Z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  car:'<path d="M5 10 7 5h10l2 5m-16 2 2-2h14l2 2v6H3v-6Zm2 6v2m14-2v2M7 14h1m8 0h1"/>',
  gear:'<path d="M6 4v16m6-16v16m6-16v8H6"/>',
  plane:'<path d="m2 15 9-3 6-8c3-3 5-1 3 2l-5 8v7l-2 1-2-6-6 1-3-2Z"/>',
  camera:'<path d="m9 6 1-2h4l1 2h4a2 2 0 0 1 2 2v11H3V8a2 2 0 0 1 2-2Z"/><circle cx="12" cy="12" r="3"/>',
  list:'<path d="M5 6h14M5 12h14M5 18h14"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  key:'<circle cx="8" cy="9" r="4"/><path d="m11 12 8 8m-4-4 3-3m-1 5 3-3"/>',
  filter:'<path d="M3 6h18M6 12h12m-9 6h6"/>',
  external:'<path d="M13 5h6v6m0-6-8 8m7 1v5H5V6h5"/>'
};
const icon = name => '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';
const esc = value => String(value ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const vehicleData = [
  {id:'clio', name:'Renault Clio V', city:'Les Abymes', category:'Citadine', gearbox:'Manuelle', seats:5, price:33, fuel:'Essence', equipment:'Climatisation', rating:4.8, image:'clio-avant', size:1050, gallery:[['clio-avant-1050','Vue avant de trois quarts'],['clio-arriere-900','Vue arrière de trois quarts'],['clio-face-900','Vue avant']]},
  {id:'duster', name:'Dacia Duster', city:'Baie-Mahault', category:'SUV', gearbox:'Manuelle', seats:5, price:46, fuel:'Essence', equipment:'Climatisation', rating:4.7, image:'duster-avant', size:1000, gallery:[['duster-avant-1000','Vue avant de trois quarts'],['duster-arriere-900','Vue arrière de trois quarts']]},
  {id:'208', name:'Peugeot 208', city:'Le Gosier', category:'Citadine', gearbox:'Automatique', seats:5, price:38, fuel:'Essence', equipment:'Climatisation', rating:4.9, image:'208-avant', size:1000, gallery:[['208-avant-1000','Vue avant de trois quarts'],['208-arriere-900','Vue arrière de trois quarts'],['208-habitacle-900','Habitacle de démonstration']]},
  {id:'polo', name:'Volkswagen Polo', city:'Les Abymes', category:'Citadine', gearbox:'Manuelle', seats:5, price:35, fuel:'Essence', equipment:'Bluetooth', rating:4.6, image:'polo-avant', size:1000},
  {id:'2008', name:'Peugeot 2008', city:'Sainte-Anne', category:'SUV', gearbox:'Automatique', seats:5, price:52, fuel:'Essence', equipment:'Climatisation', rating:4.9, image:'2008-avant', size:1000},
  {id:'berlingo', name:'Citroën Berlingo', city:'Petit-Bourg', category:'Utilitaire', gearbox:'Manuelle', seats:5, price:49, fuel:'Essence', equipment:'Climatisation', rating:4.7, image:'berlingo-avant', size:1000}
];
const search = new URLSearchParams();
for (const key of searchKeys) if (params.get(key)) search.set(key,params.get(key));
const url = (target, options = {}) => {
  const values = new URLSearchParams(options);
  if (target !== 'accueil') values.set('page',target);
  if (role !== 'visitor' && !values.has('profil')) values.set('profil',role);
  return 'index.html'+(values.size ? '?'+values.toString() : '');
};
const logo = () => '<a class="logo" href="'+url('accueil')+'"><img src="'+media+'marque/logo-horizontal-charte.png" width="342" height="63" alt="Lokasyon Péyi"></a>';
const buttonLink = (href, text, cls = '') => '<a class="btn '+cls+'" href="'+esc(href)+'">'+text+'</a>';
const action = (name, text, cls='secondary') => '<button type="button" class="btn '+cls+'" data-action="'+name+'">'+text+'</button>';
const editorial = (name, size) => media+'editorial/'+name+'-'+size+'.webp';
const carPhoto = (v, attrs = '') => '<img src="'+media+'demo/'+v.image+'-480.webp" srcset="'+media+'demo/'+v.image+'-480.webp 480w, '+media+'demo/'+v.image+'-'+v.size+'.webp '+v.size+'w" sizes="(max-width:599px) 90vw, 370px" width="480" height="340" alt="'+esc(v.name+' de démonstration, vue extérieure')+'" '+attrs+'>';
const prices = v => '<span class="price">'+v.price+' € <small>/ jour fictif</small></span>';
const formatDate = value => {
  const date = new Date(value+':00Z');
  return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'UTC'}).format(date);
};
const dateLabel = () => search.get('from') && search.get('until') ? formatDate(search.get('from'))+' → '+formatDate(search.get('until')) : 'Dates et heures à préciser';
const siteHeader = hero => {
 const explore = page==='catalogue' ? 'aria-current="page"' : page==='fiche' ? 'aria-current="location"' : '';
 return '<header class="site-header '+(hero?'in-hero':'')+'"><div class="nav-shell">'+logo()+'<nav aria-label="Navigation principale"><a href="'+url('catalogue')+'" '+explore+'>Explorer les voitures</a><a href="'+url('accueil')+'#fonctionnement">Comment ça marche</a><a href="'+url('accueil')+'#aide">Aide</a></nav><div class="nav-tools"><button type="button" class="btn secondary connect" data-action="account">'+roleLabel[role]+'</button><button type="button" class="icon-button" aria-label="Ouvrir le menu" aria-haspopup="dialog" data-action="menu">'+icon('menu')+'</button></div></div></header>';
};
const bottom = () => '<nav class="bottom-nav" aria-label="Navigation mobile"><a '+(page==='catalogue'?'aria-current="page"':'')+' href="'+url('catalogue')+'">'+icon('search')+'Explorer</a><a href="'+url('accueil')+'#aide">'+icon('info')+'Aide</a><button type="button" data-action="account" aria-haspopup="dialog">'+icon('user')+'Compte</button></nav>';
const footer = () => '<footer><div class="wrap"><div class="footer-grid"><div>'+logo()+'<p>Location de voitures entre particuliers en Guadeloupe.</p></div><div><h3>Le service</h3><a href="'+url('catalogue')+'">Explorer les voitures</a><br><a href="'+url('accueil')+'#fonctionnement">Fonctionnement</a><br><a href="'+url('accueil')+'#aide">Questions fréquentes</a></div><div><h3>Assistance</h3><a href="'+url('accueil')+'#aide">Aide et contact</a><br><a href="'+credit+'" target="_blank" rel="noopener">Crédits des photos</a><br><button class="btn warm" type="button" data-action="account">'+roleLabel[role]+'</button></div></div><p class="note footer-bottom">Maquette de validation V3.2 · tarifs et annonces fictifs.</p></div></footer>';
const makeSearch = (tag='hero', buttonLabel='Trouver une voiture') => '<form class="search-form glass" data-search aria-label="Rechercher un véhicule"><label class="search-field"><span>'+icon('pin')+'Lieu de remise</span><input name="q" list="communes" maxlength="120" placeholder="Commune ou aéroport" value="'+esc(search.get('q'))+'"></label><label class="search-field date-field"><span>'+icon('calendar')+'Départ</span><small class="date-hint" aria-hidden="true">Date et heure</small><input name="from" type="datetime-local" value="'+esc(search.get('from'))+'" aria-describedby="'+tag+'-timezone"></label><label class="search-field date-field"><span>'+icon('clock')+'Retour</span><small class="date-hint" aria-hidden="true">Date et heure</small><input name="until" type="datetime-local" value="'+esc(search.get('until'))+'" aria-describedby="'+tag+'-timezone"></label><button class="btn" type="submit">'+icon('search')+buttonLabel+'</button><span id="'+tag+'-timezone" class="local-time">Heure de Guadeloupe</span><p id="'+tag+'-error" class="feedback" role="alert" hidden></p></form>';
const places = '<datalist id="communes"><option value="Aéroport Guadeloupe Pôle Caraïbes"><option value="Les Abymes"><option value="Le Gosier"><option value="Baie-Mahault"><option value="Sainte-Anne"><option value="Petit-Bourg"></datalist>';
const quickLinks = [
 ['Citadines','car',{category:'Citadine'}],['SUV et famille','user',{category:'SUV',seats:'5'}],
 ['Boîte automatique','gear',{gearbox:'Automatique'}],['Près de l’aéroport','plane',{q:'Aéroport Guadeloupe Pôle Caraïbes'}]
];
const card = v => '<article class="vehicle-card"><a class="card-link" href="'+esc(url('fiche',{...Object.fromEntries(search),id:v.id}))+'"><div class="card-photo">'+carPhoto(v,'loading="lazy" decoding="async"')+'<span>Photo indisponible</span></div><div class="card-body"><p class="meta">'+esc(v.category)+' · '+esc(v.city)+'</p><h3>'+esc(v.name)+'</h3><p class="meta">'+esc(v.gearbox)+' · '+v.seats+' places</p><div class="row between">'+prices(v)+icon('arrow')+'</div></div></a></article>';
const grid = vehicles => '<div class="card-grid">'+vehicles.map(card).join('')+'</div>';
const chapter = (k,title,desc='') => '<div><p class="kicker">'+k+'</p><h2>'+title+'</h2>'+(desc?'<p class="secondary-text">'+desc+'</p>':'')+'</div>';
const qa = [
 ['Puis-je consulter les voitures sans compte ?', 'Oui. Vous pouvez explorer le catalogue et consulter les fiches. Un compte est nécessaire pour envoyer une demande.'],
 ['Quand faut-il payer ?', 'Dans cette maquette, le paiement est simulé après l’accord du propriétaire. L’envoi de la demande ne déclenche aucun paiement.'],
 ['Où récupérer la voiture ?', 'La fiche indique la commune ou une zone de remise. Les détails du rendez-vous se précisent selon la réservation.'],
 ['Où voir l’état du véhicule ?', 'Ouvrez la galerie et la rubrique « État du véhicule et défauts déclarés » avant de faire votre demande.']
];
const step = [
 ['Trouvez une voiture','Indiquez le lieu de remise et votre période.'],
 ['Consultez la fiche','Vérifiez les photos, les conditions et l’état déclaré.'],
 ['Envoyez une demande','Le propriétaire se prononce avant le paiement simulé.'],
 ['Récupérez les clés','Consultez les modalités et effectuez l’état des lieux de départ.'],
 ['Restituez la voiture','Effectuez le constat de retour et rendez les clés comme convenu.']
];
function home() {
 const featured = vehicleData[0];
 const quick = quickLinks.map(([label,glyph,values])=>'<a class="quick" href="'+esc(url('catalogue',values))+'"><span class="quick-icon">'+icon(glyph)+'</span><span>'+label+'</span>'+icon('arrow')+'</a>').join('');
 const storyTile = (name,label,alt,href,text) => '<figure class="story-tile"><img src="'+editorial(name,720)+'" alt="'+alt+'" loading="lazy" width="720" height="480"><figcaption class="row between"><strong>'+label+'</strong><a class="text-link" href="'+href+'">'+text+' '+icon('arrow')+'</a></figcaption></figure>';
 const feature = '<a class="feature-chip glass" href="'+url('fiche',{id:featured.id})+'"><img src="'+media+'demo/clio-avant-480.webp" width="70" height="52" alt=""><span><small class="note">Véhicule de démonstration</small><strong>'+featured.name+'</strong></span>'+icon('arrow')+'</a>';
 return siteHeader(true)+'<main id="main"><section class="hero" aria-labelledby="hero-title"><picture class="hero-photo"><source media="(max-width:599px)" srcset="'+editorial('route-guadeloupe',720)+'"><img src="'+editorial('route-guadeloupe',1440)+'" srcset="'+editorial('route-guadeloupe',1440)+' 1440w, '+editorial('route-guadeloupe',1920)+' 1920w" sizes="100vw" width="1440" height="960" alt="" fetchpriority="high"></picture><div class="hero-shade"></div><div class="wrap hero-inner"><div class="hero-head"><p class="kicker">Location entre particuliers en Guadeloupe</p><h1 id="hero-title">Roulez au rythme du Péyi.</h1><p>Trouvez une voiture près de chez vous, pour vos trajets du quotidien comme pour découvrir l’île.</p></div>'+makeSearch()+feature+'<a class="hero-credit" href="'+credit+'" target="_blank" rel="noopener">Photo · artificiality / CC BY-SA 2.0</a></div></section>'+
 '<section class="band-short"><div class="wrap"><h2>Votre trajet, votre façon de rouler.</h2><div class="quick-grid">'+quick+'</div></div></section>'+
 '<section class="band white"><div class="wrap"><div class="section-head">'+chapter('Le catalogue','Des voitures à découvrir','Exemples du catalogue de démonstration.')+'<a class="text-link" href="'+url('catalogue')+'">Voir toutes les voitures '+icon('arrow')+'</a></div>'+grid(vehicleData.slice(0,3))+'</div></section>'+
 '<section class="band mint" id="fonctionnement"><div class="wrap">'+chapter('La location entre particuliers','Comment se passe une location ?')+'<ol class="steps">'+step.map(([h,p],i)=>'<li><span aria-hidden="true">0'+(i+1)+'</span><h3>'+h+'</h3><p>'+p+'</p></li>').join('')+'</ol></div></section>'+
 '<section class="band" id="decouvrir"><div class="wrap"><div class="story-main"><figure><img src="'+editorial('deshaies-grande-anse',1440)+'" srcset="'+editorial('deshaies-grande-anse',720)+' 720w, '+editorial('deshaies-grande-anse',1440)+' 1440w" sizes="(min-width:600px) 62vw, 90vw" width="1440" height="553" alt="Grande Anse à Deshaies, vue depuis le rivage" loading="lazy"></figure><div class="story-copy"><p class="kicker">D’une commune à l’autre</p><h2>La Guadeloupe, à votre rythme.</h2><p>Retrouver des proches, traverser Basse-Terre ou passer l’après-midi à Sainte-Anne. Choisissez une remise qui vous arrange, puis prenez la route.</p><a class="text-link" href="'+url('catalogue')+'">Trouver un lieu de remise '+icon('arrow')+'</a></div></div><div class="story-grid">'+storyTile('route-de-la-traversee','La Route de la Traversée','Route bordée de forêt en Basse-Terre',esc(url('catalogue',{q:'Petit-Bourg'})),'Chercher à Petit-Bourg')+storyTile('sainte-anne-caravelle','La Caravelle, Sainte-Anne','Plage de la Caravelle et palmiers à Sainte-Anne',esc(url('catalogue',{q:'Sainte-Anne'})),'Chercher à Sainte-Anne')+storyTile('bourg-deshaies','Le bourg de Deshaies','Rue et voitures au pied des collines à Deshaies',esc(url('catalogue',{q:'Deshaies'})),'Chercher à Deshaies')+'</div></div></section>'+
 '<section class="band white"><div class="wrap trust-grid"><div class="trust-intro">'+chapter('Avant de réserver','Consultez les détails avant de choisir.')+'<p>La fiche rassemble les informations qui comptent pour votre trajet.</p></div><ul class="trust-list">'+[['camera','Photos et caractéristiques','Parcourez les vues disponibles et vérifiez les équipements.'],['info','État du véhicule','Lisez les défauts déclarés et consultez leurs photos quand elles sont fournies.'],['key','Conditions de remise','Prenez connaissance du lieu, des modalités de retour et des conditions de l’annonce.']].map(([i,h,p])=>'<li><span class="trust-icon">'+icon(i)+'</span><div><h3>'+h+'</h3><p class="meta">'+p+'</p></div></li>').join('')+'</ul></div></section>'+
 '<section class="band-short"><div class="wrap owner-panel"><div><h2>'+(role==='owner'?'Vos véhicules':'Vous avez une voiture à proposer ?')+'</h2><p>'+(role==='owner'?'Retrouvez votre parc et vos demandes dans votre espace.':'Découvrez les étapes pour publier une annonce et renseigner vos disponibilités.')+'</p></div><button class="btn warm" data-action="owner">'+(role==='owner'?'Gérer mes véhicules':'Proposer ma voiture')+' '+icon('arrow')+'</button></div></section>'+
 '<section class="band lighter" id="aide"><div class="wrap faq-grid"><div>'+chapter('Aide','Questions fréquentes')+'</div><div>'+qa.map(([q,a])=>'<details><summary>'+q+'</summary><p>'+a+'</p></details>').join('')+'</div></div></section></main>'+footer()+bottom();
}
const optionField = (label,key,options) => '<label class="form-field">'+label+'<select name="'+key+'"><option value="">Indifférent</option>'+options.map(v=>'<option '+(String(v)===search.get(key)?'selected':'')+' value="'+esc(v)+'">'+esc(v)+'</option>').join('')+'</select></label>';
const filterForm = () => '<form data-filters><label class="form-field">Budget maximum / jour<input type="number" min="1" max="1000" name="max" placeholder="Ex. 45 €" value="'+esc(search.get('max'))+'"></label>'+optionField('Catégorie','category',['Citadine','SUV','Utilitaire'])+optionField('Transmission','gearbox',['Manuelle','Automatique'])+optionField('Places minimum','seats',[2,4,5,6,7,8,9])+'<details '+(search.get('fuel')||search.get('equipment')?'open':'')+'><summary>Motorisation et équipements</summary>'+optionField('Motorisation','fuel',['Essence','Diesel','Hybride','Électrique'])+optionField('Équipement','equipment',['Climatisation','Bluetooth','Siège enfant','Caméra recul'])+'</details><button class="btn" type="submit">Appliquer les filtres</button><a class="text-link" href="'+esc(url('catalogue',Object.fromEntries([...search].filter(([key])=>!filterKeys.includes(key)))))+'">Réinitialiser les filtres</a></form>';
const stateBox = (title,body,text='',href='') => '<div class="state-box"><h3>'+title+'</h3><p class="meta">'+body+'</p>'+(text?buttonLink(href,text,'secondary'):'')+'</div>';
const normalize = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function catalog() {
 const where = search.get('q') || 'Toute la Guadeloupe';
 const alert = params.get('etat');
 const inAirport = normalize(where).includes('aeroport');
 const matching = vehicleData.filter(v => {
  const area = !search.has('q') || normalize(v.city).includes(normalize(where)) || (inAirport && v.city==='Les Abymes');
  return area && (!search.has('max') || v.price <= Number(search.get('max'))) &&
   (!search.has('seats') || v.seats >= Number(search.get('seats'))) &&
   ['category','gearbox','fuel','equipment'].every(k=>!search.has(k)||search.get(k)===v[k]);
 });
 if(search.get('sort')==='price') matching.sort((a,b)=>a.price-b.price);
 if(search.get('sort')==='rating') matching.sort((a,b)=>b.rating-a.rating);
 const chips = filterKeys.filter(k=>search.has(k)).map(k=> {
  const next = new URLSearchParams(search);
  const label = k==='max' ? search.get(k)+' € max.' : k==='seats' ? search.get(k)+' places min.' : search.get(k);
  next.delete(k);
  return '<a class="chip" aria-label="Retirer le filtre '+esc(label)+'" href="'+esc(url('catalogue',Object.fromEntries(next)))+'">'+esc(label)+' '+icon('close')+'</a>';
 }).join('');
 const res = alert==='api' ? stateBox('Catalogue indisponible','La recherche est conservée. Réessayez dans un instant.','Réessayer',url('catalogue',Object.fromEntries(search))) :
 alert==='chargement' ? '<div class="card-grid" aria-busy="true" aria-label="Chargement des véhicules"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>' :
 alert==='vide' || !matching.length ? stateBox('Aucun véhicule pour cette recherche','Modifiez un critère ou élargissez votre zone de remise.','Élargir la recherche',url('catalogue',{from:search.get('from')||'',until:search.get('until')||''})) :
 (search.get('view')==='map'?'<div class="map-demo"><strong>Carte schématique de démonstration</strong>'+matching.slice(0,3).map(v=>buttonLink(url('fiche',{...Object.fromEntries(search),id:v.id}),esc(v.city),'secondary')).join('')+'</div>':'')+grid(matching);
 const resetView={...Object.fromEntries(search)}; delete resetView.view;
 return siteHeader(false)+'<main class="wrap page-main" id="main"><p class="kicker">Location entre particuliers</p><h1 class="page-title">Trouvez votre prochaine voiture.</h1><div class="search-summary"><div><strong>'+icon('pin')+' '+esc(where)+'</strong><p class="meta">'+esc(dateLabel())+' · Heure de Guadeloupe</p></div>'+action('edit','Modifier')+'</div><div class="result-tools"><div class="row">'+action('filters',icon('filter')+' Filtres'+(chips?' ('+filterKeys.filter(k=>search.has(k)).length+')':''),'filter-trigger')+buttonLink(url('catalogue',resetView),icon('list')+' Liste','secondary')+buttonLink(url('catalogue',{...resetView,view:'map'}),icon('map')+' Carte','secondary')+'</div><label class="sort-field"><span>Trier par</span><select data-sort><option value="">Pertinence</option><option value="price" '+(search.get('sort')==='price'?'selected':'')+'>Prix croissant</option><option value="rating" '+(search.get('sort')==='rating'?'selected':'')+'>Meilleure note</option></select></label></div><div class="results-layout"><aside class="filters" aria-label="Filtres de recherche"><h2>Affinez la recherche</h2>'+filterForm()+'</aside><section class="results-items" aria-labelledby="result-count"><div class="results-head row between"><div><h2 id="result-count">'+(alert==='vide'?'0 véhicule':alert?'Résultats':matching.length+' véhicule'+(matching.length>1?'s':''))+'</h2><p class="note">Annonces et prix de démonstration'+(inAirport?' · véhicules à proximité':'')+'</p></div><div class="row results-chips">'+chips+'</div></div>'+res+'</section></div></main>'+footer()+bottom();
}
function detail() {
 const v = vehicleData.find(v=>v.id===params.get('id')) || vehicleData[0];
 const gallery = v.gallery || [[v.image+'-'+v.size, 'Vue extérieure']];
 const image = (file, label) => '<img src="'+media+'demo/'+file+'.webp" width="900" height="660" alt="'+esc(v.name+' de démonstration, '+label.toLowerCase())+'">';
 const known = v.id==='clio';
 return siteHeader(false)+'<main class="wrap page-main detail-main" id="main"><a class="text-link back" href="'+esc(url('catalogue',Object.fromEntries(search)))+'">'+icon('back')+' Retour aux résultats</a><div class="detail-title"><p class="kicker">Annonce de démonstration</p><h1 class="page-title">'+v.name+'</h1><p class="meta">'+icon('pin')+' '+v.city+' · '+v.category+'</p></div><div class="detail-layout"><div class="detail-content"><div class="gallery '+(gallery.length===1?'one-photo':'')+'" aria-label="Galerie du véhicule">'+gallery.map(([file,label],i)=>'<button type="button" aria-label="'+esc('Agrandir '+label.toLowerCase())+'" data-gallery="'+i+'">'+image(file,label)+(i===0?'<span class="gallery-count">'+icon('camera')+' '+gallery.length+' photo'+(gallery.length>1?'s':'')+'</span>':'')+'</button>').join('')+'</div><dl class="detail-details"><div><dt>Transmission</dt><dd>'+v.gearbox+'</dd></div><div><dt>Places</dt><dd>'+v.seats+' places</dd></div><div><dt>Énergie</dt><dd>'+v.fuel+'</dd></div></dl><section class="defect"><p class="kicker">Avant de faire une demande</p><h2>État du véhicule et défauts déclarés</h2>'+(known?'<div class="defect-example"><strong>Exemple fictif · rayure sur le pare-chocs arrière</strong><p class="meta">Rayure superficielle signalée lors de la mise en ligne. Aucune photo du défaut fournie dans cet exemple.</p></div>':'<p class="meta">Informations sur l’état non renseignées dans cet exemple.</p>')+'<p class="note">Les photos de la galerie illustrent le modèle. Le constat se fait lors de la remise et du retour.</p></section><section class="detail-copy"><h2>Remise et conditions</h2><p>Zone de remise indicative '+v.city+'. Le rendez-vous est précisé avec le propriétaire.</p><p class="meta">Équipement illustratif · '+v.equipment+'.</p></section></div><aside class="quote" aria-label="Préparer la demande"><div>'+prices(v)+'<p class="note">Prix indicatif de démonstration</p></div><div class="quote-line"><strong>Votre période</strong><p class="meta">'+esc(dateLabel())+'</p></div>'+action('edit',icon('calendar')+' Modifier les dates')+action('request','Préparer ma demande','')+'<p class="note">La demande précède l’accord du propriétaire et le paiement simulé.</p></aside></div></main>'+footer()+bottom();
}
function glasses() {
 const panel = (cls,title) => '<div class="glass-panel '+cls+'"><span class="label">'+title+'</span><div class="search-form glass"><div class="search-field"><span>'+icon('pin')+' Lieu de remise</span><small>Commune ou aéroport</small></div>'+buttonLink(url('catalogue'),'Trouver une voiture')+'</div></div>';
 return siteHeader(false)+'<main class="wrap page-main" id="main"><h1 class="page-title">La recherche sur la photo.</h1><p class="meta">Les libellés reposent sur une surface blanche. Le flou est réservé au conteneur.</p><div class="result-tools">'+action('solid','Basculer le fond opaque')+'</div><div class="glass-demos">'+panel('light','Photographie claire')+panel('dark','Photographie sombre')+'</div></main>'+footer();
}
app.innerHTML = (page==='catalogue'?catalog():page==='fiche'?detail():page==='verre'?glasses():home())+places;
document.documentElement.dataset.solid = String(params.has('opaque'));
let trigger;
function openDialog(title, contents, opener, type='') {
 trigger=opener;
 dialog.className=type;
 dialog.innerHTML='<div class="dialog-head row between"><h2 id="dialog-title">'+title+'</h2><button class="icon-button" type="button" aria-label="Fermer" data-action="close">'+icon('close')+'</button></div>'+contents;
 bindDates(dialog);
 dialog.showModal();
}
dialog.addEventListener('close',()=>trigger?.focus());
const routeLink = (title,target) => '<a class="dialog-link" href="'+esc(target)+'">'+title+icon('arrow')+'</a>';
const actionButtonCancel = '<button type="button" class="btn clear" data-action="close">Annuler</button>';
const panelLinks = {
 visitor:[['Explorer les voitures','catalogue'],['Aide','aide'],['Connexion démo','renter']],
 renter:[['Mon profil','renter'],['Mes réservations','renter'],['Messages','renter'],['Documents','renter'],['Déconnexion','visitor']],
 owner:[['Gérer mes véhicules','owner'],['Mes demandes','owner'],['Mes réservations','renter'],['Messages','owner'],['Déconnexion','visitor']]
};
const navTarget = label => ({catalogue:url('catalogue'),aide:url('accueil')+'#aide',renter:'index.html?profil=renter',owner:'index.html?profil=owner',visitor:'index.html'}[label]);
document.addEventListener('click',e=>{
 const target=e.target.closest('[data-action],[data-gallery]');
 if(!target)return;
 const action=target.dataset.action;
 if(action==='close')return dialog.close();
 if(action==='filters')return openDialog('Filtres',filterForm()+actionButtonCancel,target);
 if(action==='edit')return openDialog('Modifier la recherche',makeSearch('dialog',page==='fiche'?'Appliquer les dates':'Actualiser les résultats'),target);
 if(action==='solid'){
  const root=document.documentElement;
  root.dataset.solid=String(root.dataset.solid!=='true');
  target.setAttribute('aria-pressed',root.dataset.solid);
  return;
 }
 if(action==='owner')return openDialog(role==='owner'?'Mes véhicules':'Proposer ma voiture','<p>Destination représentée dans le menu de la maquette. Le parcours propriétaire reste celui du dépôt.</p>',target);
 if(action==='request')return openDialog(role==='visitor'?'Connexion requise':'Préparer ma demande','<p>Cette annonce est fictive. Le parcours de la maquette source choisit une période, puis ouvre le récapitulatif de la demande.</p>',target);
 if(action==='menu'||action==='account'){
  const extra=action==='menu'&&role!=='visitor'?routeLink('Explorer les voitures',url('catalogue')):'';
  return openDialog(action==='menu'?'Menu':roleLabel[role],'<div class="stack">'+extra+panelLinks[role].map(([title,dest])=>routeLink(title,navTarget(dest))).join('')+'</div>',target);
 }
 if(target.dataset.gallery!==undefined){
  const v=vehicleData.find(v=>v.id===params.get('id'))||vehicleData[0];
  const item=(v.gallery||[[v.image+'-'+v.size,'Vue extérieure']])[Number(target.dataset.gallery)];
  openDialog(item[1],'<img src="'+media+'demo/'+item[0]+'.webp" alt="'+esc(v.name+' de démonstration, '+item[1])+'">',target,'dialog-gallery');
 }
});
document.addEventListener('submit',e=>{
 const form=e.target;
 if(!form.matches('[data-search],[data-filters]'))return;
 e.preventDefault();
 const next=new URLSearchParams(search);
 const data=new FormData(form);
 if(form.matches('[data-search]')){
  const from=data.get('from'), until=data.get('until');
  const feedback=form.querySelector('.feedback');
  const error=Boolean(from)!==Boolean(until)?'Indiquez le départ et le retour, ou laissez les deux champs vides.':from&&until<=from?'Le retour doit suivre le départ.':from&&Date.parse(from+':00-04:00')<=Date.now()?'Cette période est passée. Indiquez une date de départ future.':'';
  if(error){
   feedback.textContent=error; feedback.hidden=false;
   const field=form.elements[!from||Date.parse(from+':00-04:00')<=Date.now()?'from':'until'];
   field.setAttribute('aria-invalid','true');
   field.setAttribute('aria-describedby',field.getAttribute('aria-describedby').split(' ')[0]+' '+feedback.id);
   field.focus();
   return;
  }
 }
 for(const [key,value] of data){
  const cleaned=String(value).trim();
  if(cleaned)next.set(key,cleaned);
  else next.delete(key);
 }
 const targetPage=page==='fiche'?'fiche':'catalogue';
 const values=Object.fromEntries(next);
 if(targetPage==='fiche')values.id=params.get('id')||'clio';
 location.href=url(targetPage,values);
});
document.querySelector('[data-sort]')?.addEventListener('change',e=>{
 if(e.target.value)search.set('sort',e.target.value); else search.delete('sort');
 location.href=url('catalogue',Object.fromEntries(search));
});
document.querySelectorAll('.card-photo img').forEach(img=>{
 const fallback=()=>{img.hidden=true;};
 img.addEventListener('error',fallback,{once:true});
 if(img.complete && !img.naturalWidth)fallback();
});

function bindDates(root){
 for(const field of root.querySelectorAll('input[type=datetime-local]')){
  const refresh=()=>{
   field.parentElement.dataset.empty=String(!field.value);
   field.removeAttribute('aria-invalid');
   field.setAttribute('aria-describedby',field.getAttribute('aria-describedby').split(' ')[0]);
  };
  field.addEventListener('input',refresh);
  refresh();
 }
}
bindDates(document);
