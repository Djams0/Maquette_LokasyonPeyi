import {test,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {createApi} from '../../api/server.mjs';
import {seed} from '../../api/seed.mjs';
import {criteria} from '../../api/modules/documents.mjs';

let target,client,admin,children = [];
test.beforeEach(async () => {
  const allowedOrigins = new Set();
  target = createApi({allowedOrigins,initialize:() => {
    const data = seed();
    data.users.find(user => user.id === 'other').status = 'suspended';
    return data;
  }});
  await new Promise(done => target.server.listen(0,'127.0.0.1',done));
  const api = `http://127.0.0.1:${target.server.address().port}`;
  async function web(app) {
    const child = spawn(process.execPath,['scripts/web.mjs',app],{stdio:['ignore','pipe','pipe'],env:{...process.env,PORT:'0',API_URL:api,DEMO_LOOPBACK:'1'}});
    children.push(child);
    const origin = await new Promise((done,reject) => {
      child.on('error',reject);
      child.on('exit',code => reject(Error(`Proxy ${app} arrêté (${code})`)));
      child.stdout.on('data',chunk => {
        const port = String(chunk).match(/sur (\d+)/);
        if (port) done(`http://127.0.0.1:${port[1]}`);
      });
    });
    allowedOrigins.add(origin);
    return origin;
  }
  [client,admin] = await Promise.all([web('client'),web('admin')]);
});
test.afterEach(async () => {
  children.forEach(child => child.kill());
  children = [];
  if (target) await new Promise(done => target.server.close(done));
});

const personaSelect = page => page.getByLabel('Compte de démonstration',{exact:true});
const loginSubmit = page => page.getByRole('button',{name:'Entrer dans la démo',exact:true});
const authNav = page => page.getByRole('navigation',{name:'Accès au compte',exact:true});
const documentCard = (page,title) => page.getByRole('article',{name:title,exact:true});
const form = page => page.locator('#auth-form');

test('compte : connexion et inscription conservent le retour à la fiche et à la demande datée', async ({page}) => {
  const query = '?q=Gosier&from=2027-06-10&until=2027-06-14&max=80&sort=price&view=map';
  const vehicle = '/vehicle/v3'+query;
  await page.goto(client+vehicle);
  await page.getByRole('button',{name:'Contacter le propriétaire',exact:true}).click();
  await expect(page).toHaveURL(client+'/login?next='+encodeURIComponent(vehicle));
  await authNav(page).getByRole('link',{name:'Inscription',exact:true}).click();
  await expect(page).toHaveURL(client+'/register?next='+encodeURIComponent(vehicle));
  await authNav(page).getByRole('link',{name:'Connexion',exact:true}).click();
  await personaSelect(page).selectOption('renter');
  await loginSubmit(page).click();
  await expect(page).toHaveURL(client+vehicle);
  await expect(page.getByRole('link',{name:'Retour aux résultats',exact:true})).toHaveAttribute('href','/search'+query);
  await page.request.delete(client+'/api/v1/session');
  await page.goto(client+vehicle);
  await page.getByRole('button',{name:'Demander la location',exact:true}).click();
  await expect(page).toHaveURL(/\/login\?next=%2Frequest%2Fv3$/);
  await personaSelect(page).selectOption('renter');
  await loginSubmit(page).click();
  await expect(page).toHaveURL(client+'/request/v3');
  await expect(page.locator('.booking-period')).toContainText('10 juin 2027');
  await expect(page.locator('.booking-period')).toContainText('14 juin 2027');
  expect(target.store.db.rentals).toHaveLength(0);
});

test('compte : persona suspendue masquée, refus après sélection et reprise sans contexte', async ({page}) => {
  await page.goto(client+'/login');
  await expect(personaSelect(page).locator('option[value="other"]')).toHaveCount(0);
  await personaSelect(page).selectOption('newcomer');
  await page.evaluate(() => sessionStorage.setItem('network-demo','error'));
  await loginSubmit(page).click();
  await expect(form(page).getByRole('alert')).toContainText('Connexion simulée indisponible.');
  await expect(personaSelect(page)).toHaveValue('newcomer');
  await page.evaluate(() => sessionStorage.removeItem('network-demo'));
  await page.route('**/api/v1/session',route => route.fulfill({status:401,json:{error:'Compte démo indisponible.'}}),{times:1});
  await loginSubmit(page).click();
  await expect(form(page).getByRole('alert')).toHaveText('Compte démo indisponible.');
  await expect(form(page).getByRole('alert')).toBeFocused();
  await expect(personaSelect(page)).toHaveValue('newcomer');
  await page.route('**/api/v1/session',async route => {
    expect((await page.request.post(client+'/api/v1/session',{data:route.request().postDataJSON()})).ok()).toBe(true);
    await route.abort();
  },{times:1});
  await loginSubmit(page).click();
  await expect(page).toHaveURL(client+'/');
  await page.goto(client+'/profile');
  await expect(page.getByText('Profil à compléter',{exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Devenir propriétaire',exact:true}).click();
  await expect(page).toHaveURL(client+'/owner/start');
});

test('compte : inscription valide requise, refus API et confirmation après réponse', async ({page},info) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto(client+'/register?next=%2Fprofile');
  const name = page.getByLabel('Prénom fictif',{exact:true});
  const consent = page.getByRole('checkbox',{name:'Je crée uniquement un compte de démonstration.'});
  const submit = page.getByRole('button',{name:'Créer mon compte fictif',exact:true});
  await submit.click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid','true');
  await name.fill('Sasha Test');
  await submit.click();
  await expect(consent).toBeFocused();
  await consent.check();
  await page.route('**/api/v1/register',route => route.fulfill({status:422,json:{error:'Prénom fictif requis.'}}),{times:1});
  await submit.click();
  await expect(form(page).getByRole('alert')).toHaveText('Prénom fictif requis.');
  await expect(name).toHaveValue('Sasha Test');
  await expect(consent).toBeChecked();
  await info.attach('Inscription refusée · 390px',{body:await page.screenshot(),contentType:'image/png'});
  let release;
  const gate = new Promise(done => {release = done;});
  await page.route('**/api/v1/register',async route => {await gate; await route.continue();},{times:1});
  try {
    await submit.click();
    await expect(submit).toBeDisabled();
    await expect(page.locator('#auth-status')).toHaveText('Création du compte fictif en cours…');
    await expect(page).toHaveURL(/\/register\?/);
  } finally { release(); }
  await expect(page).toHaveURL(client+'/profile');
  await expect(page.locator('#main').getByText('Sasha Test · démo',{exact:false})).toBeVisible();
  await expect(page.getByText('Profil à compléter',{exact:true})).toBeVisible();
  await expect(page.getByRole('link',{name:'Devenir propriétaire',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Se déconnecter',exact:true}).click();
  await expect(page).toHaveURL(client+'/');
  await page.goto(client+'/profile');
  await expect(page).toHaveURL(client+'/login?next=%2Fprofile');
});

test('compte : réponse d’inscription perdue, saisie conservée et aucune création en double', async ({page}) => {
  await page.goto(client+'/register?next=%2Fprofile');
  const name = page.getByLabel('Prénom fictif',{exact:true});
  const submit = page.getByRole('button',{name:'Créer mon compte fictif',exact:true});
  await name.fill('Inscription Synthétique');
  await page.getByRole('checkbox').check();
  await page.route('**/api/v1/register',async route => {
    expect((await route.fetch()).ok()).toBe(true);
    await route.abort();
  },{times:1});
  await submit.click();
  await expect(form(page).getByRole('alert')).toContainText('n’a pas pu être confirmée');
  await expect(name).toHaveValue('Inscription Synthétique');
  await expect(page.getByRole('link',{name:'Vérifier le compte courant'})).toBeVisible();
  await submit.click();
  await expect(form(page).getByRole('alert')).toContainText('avant une nouvelle inscription');
  expect(target.store.db.users.filter(user => user.name === 'Inscription Synthétique · démo')).toHaveLength(1);
  await expect(page).toHaveURL(/\/register\?/);
});

test('compte : pièces requises, contrôle, motif, et version retrouvée après perte de réponse', async ({page},info) => {
  await page.setViewportSize({width:390,height:844});
  const registered = await page.request.post(client+'/api/v1/register',{data:{name:'Justificatifs Démo',confirm:true}});
  expect(registered.ok()).toBe(true);
  const actor = await registered.json();
  await page.goto(client+'/profile/documents');
  const permit = documentCard(page,'Permis de conduire');
  const card = documentCard(page,'Pièce d’identité');
  await expect(permit).toContainText('À compléter');
  await expect(card).toContainText('À compléter');
  await permit.getByRole('button',{name:'Envoyer une pièce fictive',exact:true}).click();
  await expect(permit).toContainText('version 1');
  await expect(permit).toContainText('En attente de contrôle');
  const current = target.store.db.documents.find(doc => doc.userId === actor.id && doc.kind === 'Permis');
  expect((await page.request.post(admin+'/api/v1/session',{data:{persona:'admin'}})).ok()).toBe(true);
  const decide = (decision,version,reason) => page.request.post(admin+`/api/v1/admin/documents/${current.id}`,{data:{
    decision,version,reason,checks:criteria.map(label => ({label,result:'pass'})),
  }});
  expect((await decide('rejected',1,'Le justificatif synthétique est illisible.')).ok()).toBe(true);
  await page.reload();
  await expect(permit).toContainText('Refusé');
  await expect(permit).toContainText('Le justificatif synthétique est illisible.');
  await info.attach('Permis refusé et identité requise · 390px',{body:await page.screenshot(),contentType:'image/png'});
  let writes = 0;
  await page.route('**/api/v1/documents',async route => {
    writes++;
    expect((await route.fetch()).ok()).toBe(true);
    await route.abort();
  },{times:1});
  await permit.getByRole('button',{name:'Remplacer par une nouvelle version fictive'}).click();
  await expect(permit).toContainText('version 2');
  await expect(permit).toContainText('En attente de contrôle');
  await expect(permit).not.toContainText('Le justificatif synthétique est illisible.');
  expect(writes).toBe(1);
  expect((await decide('verified',2,'Lisibilité vérifiée sur la version synthétique.')).ok()).toBe(true);
  await page.reload();
  await expect(permit).toContainText('Vérifié · simulation');
  await expect(permit).toContainText('version 2');
});

test('compte : envoi interrompu avant écriture et reprise avec la même clé', async ({page}) => {
  expect((await page.request.post(client+'/api/v1/session',{data:{persona:'newcomer'}})).ok()).toBe(true);
  await page.goto(client+'/profile/documents');
  const permit = documentCard(page,'Permis de conduire');
  const submit = permit.getByRole('button',{name:'Remplacer par une nouvelle version fictive'});
  const keys = [];
  await page.route('**/api/v1/documents',async route => {
    keys.push(route.request().headers()['idempotency-key']);
    if (keys.length === 1) await route.abort();
    else await route.continue();
  });
  await submit.press('Enter');
  const dialog = page.getByRole('dialog',{name:'Action non réalisée',exact:true});
  await expect(dialog).toContainText('Le résultat de cet envoi est incertain.');
  await page.keyboard.press('Escape');
  await expect(submit).toBeFocused();
  await expect(permit).toContainText('version 1');
  await submit.press('Enter');
  await expect(permit).toContainText('version 2');
  expect(keys).toEqual([expect.any(String),keys[0]]);
});

test('compte : panneau Deshaies crédité, clavier mobile et texte agrandi à 320 px', async ({page},info) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:1440,height:960});
  await page.goto(client+'/login');
  const photo = page.getByRole('img',{name:'Rue et voitures au pied des collines à Deshaies'});
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole('link',{name:/Tournasol7/})).toHaveAttribute('href','/assets/v32/credits.html#photo-53');
  const composition = await page.locator('.account-auth').boundingBox();
  const panel = await page.locator('.account-auth-form').boundingBox();
  expect(panel.width / composition.width).toBeGreaterThanOrEqual(.55);
  expect(panel.width / composition.width).toBeLessThanOrEqual(.60);
  await info.attach('Connexion et crédit Deshaies · 1440px',{body:await page.screenshot(),contentType:'image/png'});
  await page.setViewportSize({width:320,height:430});
  await page.evaluate(() => document.documentElement.style.fontSize = '200%');
  await expect(photo).toBeHidden();
  await expect(personaSelect(page)).toHaveCSS('font-size','32px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
  await personaSelect(page).press('Tab');
  await expect(loginSubmit(page)).toBeFocused();
  await expect(loginSubmit(page)).toBeInViewport();
  await expect(loginSubmit(page)).toHaveCSS('outline-width','3px');
  await expect.poll(() => loginSubmit(page).evaluate(button => {
    const rect = button.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44 && button.contains(document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2));
  })).toBe(true);
  await info.attach('Connexion, clavier et texte à 200 % · 320px',{body:await page.screenshot(),contentType:'image/png'});
});
