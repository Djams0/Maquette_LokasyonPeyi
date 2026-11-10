// Simulation only: no behavioral label is used by authorization or business rules.
import {seed, permissions} from './seed.mjs';
import {request, transition, inspection, views} from './modules/rentals.mjs';
import {createCase, updateCase} from './modules/cases.mjs';
import {conversation, message, review} from './modules/communication.mjs';
import {finance} from './modules/finance.mjs';
import {moderate} from './modules/vehicles.mjs';
import {criteria, reviewDocument} from './modules/documents.mjs';

export const auditEpoch = '2027-01-01T12:00:00.000Z';
const renterBehaviors = ['Débutant absolu','Expérimenté','Très pressé','Méthodique et patient','Sensible au prix','Peu à l’aise avec le numérique','Touriste / réseau instable','Besoins d’accessibilité','Contact hors plateforme','Comportements abusifs'];
const ownerBehaviors = ['Nouveau propriétaire','Expérimenté','Pressé','Prudent','Peu à l’aise avec le numérique','Modifications fréquentes','Plusieurs véhicules','Échanges hors plateforme','Justificatifs incohérents','Litige complexe'];
const staffBehaviors = ['Employé débutant','Employé expérimenté','Modérateur documentaire','Périmètre limité','Administrateur opérationnel','Gestionnaire financier','Second approbateur financier','Gestionnaire des habilitations','Second approbateur des habilitations','Collaborateur suspendu'];
const staffPermissions = [permissions.employee, permissions.employee, ['dashboard.read','listings.review','documents.review','documents.read_sensitive'], ['dashboard.read','cases.read'], permissions.admin, ['dashboard.read','finance.read','finance.propose'], ['dashboard.read','finance.read','finance.approve','finance.execute'], permissions.super, permissions.super2, permissions.employee];
export const auditPersonas = [
  ...[['r',renterBehaviors],['o',ownerBehaviors],['a',staffBehaviors]].flatMap(([prefix,behaviors])=>behaviors.map((behavior,i)=>({
    id:`audit-${prefix}${String(i+1).padStart(2,'0')}`, name:`${prefix==='r'?'Locataire':prefix==='o'?'Propriétaire':'Agent'} fictif ${i+1}`,
    category:prefix==='r'?'renter':prefix==='o'?'owner':'staff', behavior,
    status:prefix==='a'&&i===9?'suspended':'active',
    eligibility:prefix==='a'?undefined:prefix==='o'&&i===8?'rejected':i===0?'missing':i===5?'pending':'verified',
    ...(prefix==='a'?{internal:true,permissions:[...staffPermissions[i]],personId:`audit-person-a${i+1}`}:{owner:prefix==='o',memberSince:i===0?'2027':'2025',completed:i===1?12:0,...(prefix==='o'?{payoutProfile:'simulated'}:{})}),
  }))),
];
export const abuseSamples = [
  ['phone','Numéro synthétique non attribué : +999 000 000 001'],
  ['spaced','Contact synthétique : + 9 9 9 / 0 0 0 / 0 0 0 / 0 0 1'],
  ['words','Numéro fictif : plus neuf neuf neuf, zéro zéro zéro, zéro zéro zéro, zéro zéro un'],
  ['email','Écrivez à contact-audit@example.test'],
  ['social','Compte fictif de réseau : @audit_exemple_inexistant'],
  ['direct','Proposition fictive : payons directement hors de la plateforme.'],
  ['link','Lien de test réservé : https://audit.invalid/contact'],
  ['description','Description suspecte fictive : contactez audit@example.test pour un accord direct.'],
  ['opportunistic','Message fictif : pouvons-nous éviter le parcours de paiement ?'],
  ['abuse','Message abusif synthétique : je refuse tous les contrôles et exige les clés.'],
];

// Domain functions build reachable states; normalization removes random IDs and wall-clock
// event dates from the resulting snapshot without changing runtime clocks globally.
export function auditFixture({epoch=auditEpoch}={}) {
  if(!Number.isFinite(Date.parse(epoch)))throw Error('Horloge de fixture invalide');
  const db=seed();
  db.simulation={fixture:'audit-v1',epoch:new Date(epoch).toISOString(),fictitious:true};
  db.users.push(...auditPersonas.map(p=>({...structuredClone(p),email:`${p.id}@example.test`,auditProfile:{category:p.category,behavior:p.behavior,syntheticHistory:p.completed?'Historique synthétique déclaré, sans valeur comptable.':'Compte de simulation initial.'}})));
  // Explicit user scope replaces the historical ID condition; no permission is inferred.
  db.users.find(u=>u.id==='admin').userScope='all-public';
  db.users.find(u=>u.id==='employee').userScope=['renter','newcomer','owner'];
  for(const a of db.users.filter(u=>u.id.startsWith('audit-a')))a.userScope=a.id==='audit-a05'?'all-public':a.id==='audit-a01'?['audit-r01','audit-o01']:a.id==='audit-a02'?['audit-r02','audit-o02']:[];
  const assignees=['employee','admin','audit-a01','audit-a02','audit-a03','audit-a05'];
  for(const u of db.users.filter(u=>/^audit-[ro]/.test(u.id))) {
    if(u.eligibility==='missing')continue;
    for(const [i,kind] of ['Permis','Identité'].entries())db.documents.push({id:`doc-${u.id}-${i}`,userId:u.id,kind,status:'pending',version:1,assignedTo:[...assignees]});
  }
  const agent=db.users.find(u=>u.id==='audit-a03');
  const checks=criteria.map(label=>({label,result:'pass'}));
  for(const d of db.documents.filter(d=>d.userId.startsWith('audit-'))) {
    const u=db.users.find(u=>u.id===d.userId);
    // Consult descriptor, since reviewDocument updates the user's eligibility incrementally.
    const desired=auditPersonas.find(p=>p.id===u.id).eligibility;
    if(desired!=='pending')reviewDocument(db,agent,d,{version:1,decision:desired==='rejected'?'rejected':'verified',reason:'Revue synthétique initiale de la fixture audit.',checks});
  }
  const cities=['Le Gosier','Baie-Mahault','Sainte-Anne','Pointe-à-Pitre','Basse-Terre'];
  for(let n=1;n<=10;n++) {
    const ownerId=`audit-o${String(n).padStart(2,'0')}`;
    if(n===1){db.drafts[ownerId]={name:'Citadine brouillon fictif',city:cities[0]};continue;}
    for(let k=1;k<=(n===7?3:1);k++) {
      const vehicle=structuredClone(db.vehicles[(n+k)%5]);
      Object.assign(vehicle,{id:`audit-v${String(n).padStart(2,'0')}-${k}`,ownerId,name:`Véhicule fictif ${n}.${k}`,city:cities[n%5],price:22+n*4+k,plate:`AUDIT-${n}-${k}`,assignedTo:[...assignees],availability:{start:'2027-01-01T00:00:00Z',end:'2029-01-01T00:00:00Z',blocked:[]},status:n===9?'pending':n===5?'paused':'published',checksPassed:n!==9,version:1});
      db.vehicles.push(vehicle);
      for(const [i,kind] of ['Carte grise','Assurance','Contrôle technique'].entries()) {
        const d={id:`doc-${vehicle.id}-${i}`,userId:ownerId,vehicleId:vehicle.id,kind,status:'pending',version:1,assignedTo:[...assignees]};db.documents.push(d);
        if(n!==9)reviewDocument(db,agent,d,{version:1,decision:'verified',reason:'Justificatif véhicule synthétique contrôlé.',checks});
      }
    }
  }
  // One rejected listing, one blocked interval, and a mixed owner/renter capability.
  const rejected=structuredClone(db.vehicles.find(v=>v.id==='audit-v09-1'));
  Object.assign(rejected,{id:'audit-v09-rejected'});db.vehicles.push(rejected);
  for(const d of db.documents.filter(d=>d.vehicleId==='audit-v09-1'))db.documents.push({...structuredClone(d),id:d.id+'-rejected',vehicleId:rejected.id});
  moderate(db,agent,rejected,{version:1,decision:'rejected',reason:'Incohérence synthétique à corriger.'});
  db.vehicles.find(v=>v.id==='audit-v04-1').availability.blocked.push({id:'audit-block',start:'2027-05-01T12:00:00Z',end:'2027-05-03T12:00:00Z'});
  const renter=db.users.find(u=>u.id==='audit-r02'),owner=db.users.find(u=>u.id==='audit-o02');
  const states=['requested','declined','awaiting_payment','confirmed','in_progress','return_reported','returned','completed'];
  for(const [i,state] of states.entries()) {
    const day=String(2+i*3).padStart(2,'0');
    const r=request(db,renter,{vehicleId:'audit-v02-1',start:`2027-03-${day}T12:00:00Z`,end:`2027-03-${String(3+i*3).padStart(2,'0')}T12:00:00Z`});
    if(state==='declined'){transition(db,owner,r,'decline',{reason:'maintenance'});continue;}
    if(state==='requested')continue;
    transition(db,owner,r,'accept');if(state==='awaiting_payment')continue;
    transition(db,renter,r,'pay',{outcome:'success'});if(state==='confirmed')continue;
    transition(db,renter,r,'deposit',{outcome:'success'});
    const capture=phase=>{for(const view of views)inspection(db,renter,r,phase,'photo',{view});inspection(db,renter,r,phase,'finalize',{km:phase==='departure'?10000:10100,fuel:80,confirm:true});};
    capture('departure');transition(db,owner,r,'handover',{controls:true});if(state==='in_progress')continue;
    capture('return');transition(db,renter,r,'report_return');if(state==='return_reported')continue;
    transition(db,owner,r,'verify_return',{keys:true});if(state==='returned')continue;
    transition(db,owner,r,'complete');review(db,renter,r,{vehicleRating:4,ownerRating:5,comment:'Avis intégralement fictif pour audit.'});
  }
  // Owner accounts can rent another owner's car using the existing cumulative model.
  request(db,db.users.find(u=>u.id==='audit-o07'),{vehicleId:'audit-v03-1',start:'2027-06-01T12:00:00Z',end:'2027-06-02T12:00:00Z'});
  const support=createCase(db,renter,{kind:'Assistance',summary:'Demande fictive de reprise après interruption.'});
  support.assignedTo=['audit-a01','audit-a04','audit-a05'];
  const disputed=db.users.find(u=>u.id==='audit-o10');
  const dispute=createCase(db,disputed,{kind:'Dommage',summary:'Désaccord synthétique complexe, sans décision financière automatique.'});
  dispute.assignedTo=['audit-a02','audit-a05'];dispute.sensitive=true;
  updateCase(db,db.users.find(u=>u.id==='audit-a05'),dispute,{action:'status',status:'evidence_requested',reason:'Recueillir les observations fictives des parties.'});
  const chat=conversation(db,db.users.find(u=>u.id==='audit-r09'),{vehicleId:'audit-v08-1'});
  for(const [,text] of abuseSamples)message(db,db.users.find(u=>u.id==='audit-r09'),chat,{text});
  const completed=db.rentals.find(r=>r.status==='completed');
  finance(db,db.users.find(u=>u.id==='audit-a06'),'propose',{rentalId:completed.id,kind:'refund',amount:1,reason:'Unité monétaire fictive de test, aucune règle de remboursement.'});
  db.staffRequests.push({id:'audit-permission-request',targetId:'audit-a04',permission:'finance.read',author:'audit-a08',person:'audit-person-a8',status:'pending_approval',version:1,reason:'Demande synthétique de permission, non accordée au départ.'});
  return normalize(db,new Date(epoch).toISOString());
}

function normalize(db,epoch) {
  const replacements=new Map();const counters=new Map();
  // Runtime generated IDs contain a UUID fragment; fixture reference IDs never do.
  const collect=value=>{if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object'){if(typeof value.id==='string'&&/-[a-f0-9]{8}$/.test(value.id)){const prefix=value.id.slice(0,-9);const n=(counters.get(prefix)||0)+1;counters.set(prefix,n);replacements.set(value.id,`audit-${prefix}-${String(n).padStart(3,'0')}`);}Object.values(value).forEach(collect);}};
  collect(db);
  const dates=new Set(['at','createdAt','submittedAt','finalizedAt','handoverAt','returnReportedAt','returnVerifiedAt','completedAt','executedAt']);
  const visit=(value,key)=>typeof value==='string'?(dates.has(key)?epoch:replacements.get(value)||[...replacements].reduce((s,[a,b])=>s.replaceAll(a,b),value)):Array.isArray(value)?value.map(v=>visit(v)):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,visit(v,k)])):value;
  return visit(db);
}
