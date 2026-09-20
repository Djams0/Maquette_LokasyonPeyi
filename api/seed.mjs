export const permissions = {
  employee: ['dashboard.read', 'documents.review', 'documents.read_sensitive', 'listings.review', 'cases.read', 'cases.update', 'users.read', 'reviews.moderate'],
  admin: ['dashboard.read', 'documents.review', 'documents.read_sensitive', 'listings.review', 'cases.read', 'cases.update', 'cases.sensitive', 'users.read', 'users.suspend', 'reviews.moderate', 'finance.read', 'finance.propose', 'finance.approve', 'finance.execute'],
  finance: ['dashboard.read', 'finance.read', 'finance.propose', 'finance.approve', 'finance.execute'],
  super: ['dashboard.read', 'staff.manage', 'permissions.manage'],
  super2: ['dashboard.read', 'staff.manage', 'permissions.manage'],
};
export function seed() {
  const users = [
    { id: 'renter', name: 'Camille Démo', email: 'camille@example.test', owner: false, eligibility: 'verified', memberSince: '2025', completed: 3 },
    { id: 'owner', name: 'Noa Démo', email: 'noa@example.test', owner: true, eligibility: 'verified', memberSince: '2024', completed: 8, payoutProfile: 'simulated' },
    { id: 'newcomer', name: 'Alex Démo', email: 'alex@example.test', owner: false, eligibility: 'missing', memberSince: '2026', completed: 0 },
    { id: 'other', name: 'Lou Démo', email: 'lou@example.test', owner: true, eligibility: 'pending', memberSince: '2026', completed: 0 },
    ...Object.keys(permissions).map((id, i) => ({ id, name: ['Élie · employé', 'Ana · admin', 'Sam · finance', 'Jade · super-admin', 'Malo · super-admin'][i], email: `${id}@example.test`, internal: true, permissions: permissions[id], personId: `person-${id}` })),
  ].map(u => ({ status: 'active', ...u }));
  const specs = [
    ['v1', 'Peugeot 208', 'Citadine', 32, 'Le Gosier', 'Manuelle', 'Essence', 5, 4.8, 'sage'],
    ['v2', 'Dacia Duster', 'SUV', 48, 'Baie-Mahault', 'Manuelle', 'Diesel', 5, 4.6, 'sand'],
    ['v3', 'Renault Clio', 'Citadine', 29, 'Le Gosier', 'Automatique', 'Hybride', 5, 4.9, 'blue'],
    ['v4', 'Citroën C3', 'Citadine', 30, 'Sainte-Anne', 'Manuelle', 'Essence', 5, 4.7, 'coral'],
    ['v5', 'Renault Trafic', 'Utilitaire', 59, 'Pointe-à-Pitre', 'Manuelle', 'Diesel', 3, 4.5, 'sand'],
    ['v6', 'Renault Twingo', 'Citadine', 26, 'Le Gosier', 'Automatique', 'Électrique', 4, 4.6, 'blue'],
  ];
  const vehicles = specs.map(([id,name,category,price,city,gearbox,fuel,seats,rating,color],i) => ({ id,name,category,price,city,gearbox,fuel,seats,rating,color, ownerId: i===4?'other':'owner', year:2022+i%3, status:i===5?'pending':'published', description:'Une voiture agréable pour découvrir le Péyi à votre rythme. Exemple entièrement fictif, sans annonce commerciale.', equipment:['Climatisation','Bluetooth',...(i%2?['Caméra recul']:['Siège enfant'])], photos:5, rules:{smoking:false,pets:false}, availability:{start:'2026-01-01T00:00:00Z',end:'2030-01-01T00:00:00Z',blocked:[]}, plate:`DEMO-${i+1}`, version:1, assignedTo:['employee','admin'], checksPassed:i!==5 }));
  const documents = [
    {id:'doc1',userId:'newcomer',kind:'Permis',status:'pending',version:1,assignedTo:['employee','admin']},
    {id:'doc2',userId:'newcomer',kind:'Identité',status:'pending',version:1,assignedTo:['employee','admin']},
    {id:'doc3',userId:'other',kind:'Permis',status:'pending',version:1,assignedTo:['admin']},
    ...['Carte grise','Assurance','Contrôle technique'].map((kind,i)=>({id:`doc-v6-${i}`,userId:'owner',vehicleId:'v6',kind,status:'pending',version:1,assignedTo:['employee','admin']})),
  ];
  return { users,vehicles,documents,documentReviews:[],rentals:[],inspections:[],cases:[{id:'case-demo',kind:'Demande d’information',summary:'Exemple de dossier de démonstration. Vérifier les observations avant toute décision.',userId:'renter',participants:['renter','owner'],assignedTo:['employee','admin'],sensitive:false,status:'received',messages:[],notes:[],version:1,createdAt:new Date().toISOString()}],financeActions:[],staffRequests:[],reviews:[{id:'review-demo',vehicleId:'v1',authorId:'renter',ownerId:'owner',vehicleRating:5,ownerRating:5,comment:'Un exemple d’avis fictif : échange agréable et voiture propre.',status:'published'}],conversations:[],notifications:[],audit:[],drafts:{},receipts:[],idempotency:{},version:1 };
}
