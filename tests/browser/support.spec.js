import {test,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {createApi} from '../../api/server.mjs';
import {seed} from '../../api/seed.mjs';

const rental = {
  id:'support-demo', vehicleId:'v1', vehicleName:'Véhicule fictif de recette',
  renterId:'renter', ownerId:'owner', status:'completed', payment:'simulated_paid',
  start:'2027-06-10T12:00:00Z',end:'2027-06-14T12:00:00Z',quote:{days:4,daily:32,total:128},
};
let target, client, proxy;

test.beforeEach(async () => {
  const allowedOrigins = new Set();
  target = createApi({initialize:seed,allowedOrigins});
  target.store.db.rentals.push(structuredClone(rental));
  await new Promise(resolve => target.server.listen(0,'127.0.0.1',resolve));
  proxy = spawn(process.execPath,['scripts/web.mjs','client'],{
    env:{...process.env,PORT:'0',API_URL:'http://127.0.0.1:'+target.server.address().port,DEMO_LOOPBACK:'1'},
    stdio:['ignore','pipe','inherit'],
  });
  client = await new Promise((resolve,reject) => {
    proxy.once('error',reject);
    proxy.once('exit',code => reject(Error('Proxy interrompu ('+code+')')));
    proxy.stdout.on('data',data => {
      const port = String(data).match(/sur (\d+)/);
      if (port) resolve('http://127.0.0.1:'+port[1]);
    });
  });
  allowedOrigins.add(client);
});

test.afterEach(async () => {
  proxy?.kill();
  if (target) await new Promise(resolve => target.server.close(resolve));
});

async function persona(page,id) {
  expect((await page.request.post(client+'/api/v1/session',{data:{persona:id}})).ok()).toBe(true);
}

async function open(page,path,id='renter') {
  await persona(page,id);
  await page.goto(client+path);
  await expect(page.locator('#main h1')).toBeVisible();
}

function interceptWrites(page,path,firstAttempt) {
  const calls = [];
  let release;
  const barrier = new Promise(resolve => { release=resolve; });
  const registered = page.route('**/api/v1'+path,async route => {
    const request = route.request();
    if (request.method() !== 'POST') return route.continue();
    calls.push({body:request.postDataJSON(),key:request.headers()['idempotency-key']});
    if (calls.length > 1) return route.continue();
    if (firstAttempt === 'late') {
      await barrier;
      return route.continue();
    }
    if (firstAttempt === 'after') await route.fetch();
    return route.abort();
  });
  return {calls,release,registered};
}

test('FAQ publique : recherche sans accent, état vide annoncé et accordéon clavier',async ({page}) => {
  await page.goto(client+'/faq');
  const search = page.getByRole('searchbox',{name:'Rechercher une question'});
  await search.fill('désactivé-abc');
  await expect(page.locator('#faq-result')).toHaveText('Aucune question trouvée. Essayez un autre terme.');
  await expect(page.locator('#faq-list details:visible')).toHaveCount(0);
  await search.fill('assure');
  await expect(page.locator('#faq-result')).toHaveText('1 question trouvée.');
  await page.keyboard.press('Tab');
  const question = page.locator('#faq-list details:visible summary');
  await expect(question).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(question.locator('..')).toHaveJSProperty('open',true);
  await page.getByRole('link',{name:'Contacter l’assistance',exact:true}).click();
  await expect(page).toHaveURL(/\/login\?next=%2Fassistance$/);
});

test('Assistance : motif et location préremplis, chargement, double clic et création tardive',async ({page}) => {
  await open(page,'/assistance?rental=support-demo&kind=Prolongation');
  await expect(page.getByLabel('Motif',{exact:true})).toHaveValue('Prolongation');
  await expect(page.getByLabel('Location concernée')).toHaveValue('support-demo');
  await expect(page.locator('#case-effect')).toBeVisible();
  const write = interceptWrites(page,'/cases','late');
  await write.registered;
  await page.getByLabel('Décrivez les faits fictifs').fill('Demande fictive concernant la période.');
  await page.getByRole('button',{name:'Ouvrir un dossier fictif'}).evaluate(el => {el.click();el.click();});
  await expect(page.locator('[data-write-status]')).toHaveText('Envoi en cours…');
  await expect(page.getByRole('button',{name:'Ouvrir un dossier fictif'})).toBeDisabled();
  await expect(page).toHaveURL(/\/assistance\?/);
  expect(target.store.db.cases).toHaveLength(1);
  write.release();
  await expect(page).toHaveURL(/\/cases\/case-/);
  expect(target.store.db.cases).toHaveLength(2);
  expect(target.store.db.cases[0]).toMatchObject({rentalId:rental.id,kind:'Prolongation',status:'received'});
  expect(target.store.db.rentals.find(r => r.id === rental.id)).toEqual(rental);
  expect(write.calls).toHaveLength(1);
  expect(write.calls[0].key).toBeTruthy();
});

for (const timing of ['before','after']) {
  test('Dossier : reprise après réponse perdue '+(timing === 'before' ? 'avant' : 'après')+' écriture',async ({page}) => {
    await open(page,'/cases/new?kind=Annulation&rental=support-demo');
    const {calls,registered} = interceptWrites(page,'/cases',timing);
    await registered;
    const summary = 'Observation fictive conservée à la reprise.';
    await page.getByLabel('Décrivez les faits fictifs').fill(summary);
    await page.getByRole('button',{name:'Ouvrir un dossier fictif'}).click();
    await expect(page.locator('.form-error')).toBeFocused();
    await expect(page.locator('[data-write-status]')).toContainText('à vérifier');
    expect(target.store.db.cases).toHaveLength(timing === 'before' ? 1 : 2);
    await page.reload();
    await expect(page.getByLabel('Décrivez les faits fictifs')).toHaveValue(summary);
    await page.getByRole('button',{name:'Vérifier l’envoi'}).click();
    await expect(page).toHaveURL(/\/cases\/case-/);
    expect(calls).toHaveLength(2);
    expect(calls[0].key).toBeTruthy();
    expect(calls[1]).toEqual(calls[0]);
    expect(target.store.db.cases).toHaveLength(2);
    expect(target.store.db.rentals.find(r => r.id === rental.id)).toEqual(rental);
  });
}

test('Dossiers : vide, contexte inaccessible, 422, puis reprise sous le bon compte seulement',async ({page}) => {
  await open(page,'/cases','newcomer');
  await expect(page.getByRole('heading',{name:'Aucun dossier ouvert'})).toBeVisible();
  await page.goto(client+'/cases/new?kind=autre&rental=support-demo');
  await expect(page.locator('#main')).toContainText('Le motif indiqué dans le lien est inconnu.');
  await expect(page.locator('#main')).toContainText('La location indiquée dans le lien est indisponible');
  await expect(page.getByLabel('Location concernée')).toHaveValue('');
  await page.getByLabel('Décrivez les faits fictifs').fill('           ');
  await page.getByRole('button',{name:'Ouvrir un dossier fictif'}).click();
  await expect(page.locator('.form-error')).not.toBeEmpty();
  const draft = 'Deuxième saisie fictive réservée au compte initial.';
  await page.getByLabel('Décrivez les faits fictifs').fill(draft);
  await persona(page,'renter');
  await page.getByRole('button',{name:'Ouvrir un dossier fictif'}).click();
  await expect(page.locator('.form-error')).toContainText('La session a changé');
  await expect(page.locator('[data-reconnect]')).toHaveAttribute('href',/next=%2Fcases%2Fnew%3Fkind%3Dautre/);
  expect(target.store.db.cases).toHaveLength(1);
  await page.reload();
  await expect(page.getByLabel('Décrivez les faits fictifs')).toBeEmpty();
  await persona(page,'newcomer');
  await page.reload();
  await expect(page.getByLabel('Décrivez les faits fictifs')).toHaveValue(draft);
  await page.getByRole('button',{name:'Vérifier l’envoi'}).click();
  await expect(page).toHaveURL(/\/cases\/case-/);
  expect(target.store.db.cases[0].participants).toEqual(['newcomer']);
});

test('Dossier : échanges partagés et ciblés, note interne absente, accès tiers et dossier inconnu',async ({page}) => {
  const c = target.store.db.cases[0];
  c.status = 'evidence_requested';
  c.decision = 'Complément fictif demandé pour la recette.';
  c.notes.push({author:'employee',text:'Observation privée de recette V32.',at:'2027-06-11T12:00:00Z'});
  await open(page,'/cases/case-demo');
  await expect(page.getByText('Complément fictif demandé pour la recette.')).toBeVisible();
  await expect(page.getByText('Aucun message pour le moment.')).toBeVisible();
  expect(await (await page.request.get(client+'/api/v1/cases/case-demo')).json()).not.toHaveProperty('notes');
  const {calls,registered} = interceptWrites(page,'/cases/case-demo','after');
  await registered;
  const message = 'Complément fictif visible aux participants.';
  await page.getByLabel('Votre message').fill(message);
  await page.getByRole('button',{name:'Ajouter au dossier'}).click();
  await expect(page.locator('.form-error')).toBeFocused();
  expect(target.store.db.cases[0].messages).toHaveLength(1);
  await page.getByRole('button',{name:'Vérifier l’envoi'}).click();
  await expect(page.getByRole('heading',{name:'Échanges partagés'})).toBeFocused();
  await expect(page.locator('#case-history')).toContainText(message);
  await expect(page.getByLabel('Votre message')).toBeEmpty();
  expect(calls).toHaveLength(2);
  expect(calls[0]).toEqual(calls[1]);
  expect(target.store.db.cases[0].messages).toHaveLength(1);
  await open(page,'/cases/case-demo','owner');
  await expect(page.locator('#case-history')).toContainText(message);
  await expect(page.locator('#main')).not.toContainText('Observation privée');
  await open(page,'/cases/case-demo','newcomer');
  await expect(page.getByRole('heading',{name:'Accès non autorisé'})).toBeVisible();
  await expect(page.locator('#main')).not.toContainText(message);
  await page.goto(client+'/cases/introuvable');
  await expect(page.getByRole('heading',{name:'Élément introuvable'})).toBeVisible();
});

test('Dossiers : erreur réseau, relance et dossier clos affiché selon le mock',async ({page}) => {
  target.store.db.cases[0].status = 'closed';
  await persona(page,'renter');
  await page.route('**/api/v1/cases',route => route.abort(),{times:1});
  await page.goto(client+'/cases');
  await expect(page.getByRole('heading',{name:'Impossible de charger cette page'})).toBeVisible();
  await page.getByRole('button',{name:'Réessayer'}).click();
  await expect(page.getByText('Clos',{exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Consulter le dossier'}).click();
  await expect(page.getByText('Clos',{exact:true})).toBeVisible();
});

test('Avis : bon rôle, deux notes, réponse perdue et avis unique en modération',async ({page}) => {
  await open(page,'/review/support-demo','owner');
  await expect(page.getByRole('heading',{name:'Avis indisponible'})).toBeVisible();
  await expect(page.locator('#review-form')).toHaveCount(0);
  await open(page,'/review/support-demo');
  await page.getByLabel('Le véhicule',{exact:true}).selectOption('4');
  await page.getByLabel('Le propriétaire',{exact:true}).selectOption('3');
  await page.getByLabel('Votre avis public').fill('Échange fictif, commentaires de recette.');
  const {calls,registered} = interceptWrites(page,'/rentals/support-demo/review','after');
  await registered;
  await page.getByRole('button',{name:'Envoyer mon avis'}).click();
  await expect(page.locator('.form-error')).toBeFocused();
  await page.getByRole('button',{name:'Vérifier l’envoi'}).click();
  await expect(page).toHaveURL(/\/rental\/support-demo$/);
  expect(calls).toHaveLength(2);
  expect(calls[0]).toEqual(calls[1]);
  const reviews = target.store.db.reviews.filter(item => item.rentalId === rental.id);
  expect(reviews).toHaveLength(1);
  expect(reviews[0]).toMatchObject({authorId:'renter',vehicleRating:4,ownerRating:3,status:'pending'});
  await page.goto(client+'/review/support-demo');
  await expect(page.getByRole('heading',{name:'Avis déjà envoyé'})).toBeVisible();
  await page.getByRole('link',{name:'Mes avis',exact:true}).last().click();
  await expect(page.getByText('En modération')).toBeVisible();
  await expect(page.getByText('4 sur 5')).toBeVisible();
  await expect(page.getByText('3 sur 5')).toBeVisible();
  await open(page,'/profile/reviews','owner');
  await expect(page.getByRole('heading',{name:'Aucun avis envoyé'})).toBeVisible();
});

test('Mes avis : affichage auteur seul des trois statuts et erreur récupérable',async ({page}) => {
  const base = target.store.db.reviews[0];
  target.store.db.reviews.push(
    {...base,id:'review-rejected',status:'rejected',comment:'Avis fictif refusé.'},
    {...base,id:'review-pending',status:'pending',comment:'Avis fictif en modération.'},
    {...base,id:'review-owner',authorId:'owner',ownerId:'renter',comment:'Avis fictif d’une autre personne.'},
  );
  await persona(page,'renter');
  await page.route('**/api/v1/bootstrap',route => route.abort(),{times:1});
  await page.goto(client+'/profile/reviews');
  await expect(page.getByRole('heading',{name:'Impossible de charger cette page'})).toBeVisible();
  await page.getByRole('button',{name:'Réessayer'}).click();
  for (const status of ['Publié','Refusé','En modération']) await expect(page.getByText(status,{exact:true})).toBeVisible();
  await expect(page.locator('#main')).not.toContainText('Avis fictif d’une autre personne.');
});

test('Reçu : clôture, refus, absence de devis, impression des données fictives',async ({page}) => {
  await open(page,'/receipt/support-demo','owner');
  await expect(page.getByText(/sans valeur comptable/i)).toBeVisible();
  await expect(page.getByText('128 € fictifs')).toBeVisible();
  await expect(page.getByText('Paiement simulé réussi')).toBeVisible();
  await page.evaluate(() => {window.print = () => {document.documentElement.dataset.printed = 'yes';};});
  await page.getByRole('button',{name:'Imprimer / enregistrer en PDF'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-printed','yes');
  await page.emulateMedia({media:'print'});
  await expect(page.getByRole('button',{name:'Imprimer / enregistrer en PDF'})).toBeHidden();
  await expect(page.locator('#shell > .header')).toBeHidden();
  await expect(page.getByRole('heading',{name:'Reçu fictif de clôture'})).toBeVisible();
  await page.emulateMedia({media:'screen'});
  target.store.db.rentals[0].quote.total = 128.52;
  await page.reload();
  await expect(page.getByText('128,52 € fictifs')).toBeVisible();
  delete target.store.db.rentals[0].quote;
  await open(page,'/receipt/support-demo');
  await expect(page.getByText('Non renseigné',{exact:true})).toHaveCount(3);
  await expect(page.getByText('0 € fictifs')).toHaveCount(0);
  await open(page,'/receipt/support-demo','newcomer');
  await expect(page.getByRole('heading',{name:'Accès non autorisé'})).toBeVisible();
  target.store.db.rentals[0].status = 'returned';
  await open(page,'/receipt/support-demo');
  await expect(page.getByRole('heading',{name:'Reçu indisponible'})).toBeVisible();
  await page.goto(client+'/review/support-demo');
  await expect(page.getByRole('heading',{name:'Avis indisponible'})).toBeVisible();
});
