import {test, expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {createApi} from '../../api/server.mjs';

// Components use their own seed and proxies; they never mutate the historical target.
let target, client, admin, children = [];
test.beforeEach(async () => {
  const allowedOrigins = new Set();
  target = createApi({allowedOrigins});
  await new Promise(resolve => target.server.listen(0, '127.0.0.1', resolve));
  const api = `http://127.0.0.1:${target.server.address().port}`;
  async function web(app) {
    const child = spawn(process.execPath, ['scripts/web.mjs', app], {
      env: {...process.env, PORT: '0', API_URL: api, DEMO_LOOPBACK: '1'}, stdio: ['ignore','pipe','pipe'],
    });
    children.push(child);
    return new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('exit', code => reject(Error(`Proxy ${app} arrêté : ${code}`)));
      child.stdout.on('data', chunk => {
        const match = String(chunk).match(/sur (\d+)/);
        if (match) resolve(`http://127.0.0.1:${match[1]}`);
      });
    });
  }
  client = await web('client'); admin = await web('admin');
  allowedOrigins.add(client); allowedOrigins.add(admin);
});
test.afterEach(async () => {
  children.forEach(child => child.kill()); children = [];
  if (target) await new Promise(resolve => target.server.close(resolve));
});
async function ready(page) {
  await expect(page.locator('#main h1')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}
async function fits(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
}

test('fondations : couleurs source, contrôles 48 px et reflow Client/Admin', async ({page}) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({width, height: 844});
    await page.goto(client + '/design-system'); await ready(page); await fits(page);
    await expect(page.locator('.swatch-action')).toHaveCSS('background-color', 'rgb(20, 93, 76)');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(246, 244, 237)');
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(21, 44, 39)');
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(page.locator('.skeleton').first()).toHaveCSS('animation-name','none');
    await expect(page.locator('#sample-toast')).toHaveCSS('background-color', 'rgb(20, 93, 76)');
    await expect(page.locator('#sample-toast')).toHaveCSS('border-radius', '12px');
    await expect(page.locator('.component-samples>.card').first()).toHaveCSS('border-radius', '16px');
    await expect(page.getByLabel('Prénom fictif', {exact:true})).toHaveCSS('font-size', '16px');
    const controls = await page.locator('.component-samples button,.component-samples input:not([type=hidden]),.component-samples select,.component-samples textarea,.component-samples a.button').evaluateAll(elements => elements.filter(e => e.getClientRects().length).map(e => ({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})));
    expect(controls.length).toBeGreaterThan(8);
    for (const size of controls) { expect(size.width).toBeGreaterThanOrEqual(48); expect(size.height).toBeGreaterThanOrEqual(48); }
    await page.goto(client + '/vehicle/v1'); await ready(page); await fits(page);
    await page.goto(admin + '/login');
    await page.getByLabel('Profil et périmètre').selectOption('admin');
    await page.getByRole('button', {name:'Ouvrir cet espace',exact:true}).click();
    await page.waitForURL(u => u.pathname === '/'); await ready(page); await fits(page);
    await expect(page.locator('body')).toHaveCSS('background-color','rgb(246, 244, 237)');
    await expect(page.locator('#main h1')).toHaveCSS('font-family', /Nunito/);
  }
});

test('formulaire : erreurs liées, saisie conservée et attente stable', async ({page}) => {
  await page.setViewportSize({width:320,height:844});
  await page.goto(client + '/design-system'); await ready(page);
  const form = page.locator('#sample-form'), name = page.getByLabel('Prénom fictif',{exact:true});
  const submit = form.getByRole('button',{name:'Tester le formulaire'});
  await submit.click();
  await expect(name).toHaveAttribute('aria-invalid','true');
  const errorId = await form.locator('.form-error').getAttribute('id');
  await expect(name).toHaveAttribute('aria-describedby',errorId);
  await name.fill('erreur'); await expect(name).not.toHaveAttribute('aria-invalid','true');
  const before = await submit.boundingBox(); await submit.click();
  await expect(form).toHaveAttribute('aria-busy','true'); await expect(submit).toBeDisabled();
  const pending = await submit.boundingBox(); expect(pending.width).toBeCloseTo(before.width,1);
  await expect(form.getByRole('alert')).toContainText('Votre saisie est conservée');
  await expect(name).toHaveValue('erreur'); await expect(name).toHaveAttribute('aria-describedby',errorId);
  await expect(name).not.toHaveAttribute('aria-invalid','true');
  await expect(submit).toBeEnabled(); await expect(form.getByRole('alert')).toBeFocused();
  const focus = await form.getByRole('alert').evaluate(e => ({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,barTop:document.querySelector('.bottom-nav')?.getBoundingClientRect().top ?? innerHeight}));
  expect(focus.top).toBeGreaterThanOrEqual(0);
  expect(focus.bottom).toBeLessThanOrEqual(focus.barTop);
  await expect(page.getByRole('navigation',{name:'Navigation mobile',exact:true})).toHaveCount(0);
  await name.fill('Maya'); await expect(name).not.toHaveAttribute('aria-describedby',errorId);
  await submit.click(); await expect(page.getByRole('status').filter({hasText:'Formulaire fictif vérifié'})).toBeVisible();
});

test('dialogue : nom, erreur récupérable, Échap et retour du focus', async ({page}) => {
  await page.setViewportSize({width:320,height:844});
  await page.goto(client + '/design-system'); await ready(page);
  const open = page.getByRole('button',{name:'Ouvrir le dialogue',exact:true});
  await open.focus(); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog',{name:'Un dialogue clair',exact:true});
  await expect(dialog).toBeVisible();
  const input = dialog.getByLabel('Votre prénom fictif');
  await input.fill('erreur'); await dialog.getByRole('button',{name:'Confirmer',exact:true}).click();
  await expect(dialog.getByRole('alert')).toContainText('Exemple d’erreur');
  await expect(input).toHaveValue('erreur');
  await expect(input).toHaveAttribute('aria-describedby',await dialog.getByRole('alert').getAttribute('id'));
  await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(open).toBeFocused();
  await open.click(); await dialog.getByLabel('Votre prénom fictif').fill('Maya');
  await dialog.getByRole('button',{name:'Confirmer',exact:true}).click();
  await expect(dialog).toHaveCount(0); await expect(open).toBeFocused();
  await page.goto(client + '/vehicle/v1'); await ready(page);
  const photo = page.getByRole('button',{name:'Ouvrir la photo 1 de Peugeot 208'});
  await photo.click(); await expect(page.getByRole('dialog',{name:'Galerie · Peugeot 208'})).toBeVisible();
  await fits(page); await page.keyboard.press('Escape'); await expect(photo).toBeFocused();
  await page.goto(client + '/login');
  await page.getByLabel('Compte de démonstration').selectOption('owner');
  await page.getByRole('button',{name:'Entrer dans la démo',exact:true}).click();
  await page.waitForURL(u => u.pathname === '/');
  await page.goto(client + '/owner/reputation'); await ready(page);
  const reply = page.getByRole('button',{name:'Répondre à cet avis'});
  await reply.click(); await expect(page.getByRole('dialog',{name:'Répondre à l’avis'})).toBeVisible();
  await page.keyboard.press('Escape'); await expect(reply).toBeFocused();
  await page.goto(client + '/profile/documents'); await ready(page);
  await page.route('**/api/v1/documents', route => route.abort());
  const replace = page.getByRole('button',{name:'Remplacer par une nouvelle version fictive'}).first();
  await replace.click(); await expect(page.getByRole('dialog',{name:'Action non réalisée'})).toBeVisible();
  await page.keyboard.press('Escape'); await expect(replace).toBeFocused();

});

test('surfaces opérationnelles : gabarit à huit largeurs, contraste et texte à 200 %', async ({page}, info) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(client + '/design-system');
  await ready(page);
  const sample = page.getByRole('region',{name:'Surfaces opérationnelles',exact:true});
  const form = sample.getByRole('form',{name:'Vérifier une période',exact:true});
  const submit = form.getByRole('button',{name:'Vérifier la période',exact:true});
  const rail = sample.locator('.operational-rail');
  const firstCard = sample.locator('article').first();
  await expect(sample.getByRole('heading',{name:'Aucune demande à suivre'})).toBeVisible();
  await expect(sample.getByText('Le propriétaire peut répondre. Le locataire peut retirer sa demande.')).toBeVisible();
  await expect(submit).toHaveCSS('background-color','rgb(28, 98, 89)');
  await expect(firstCard).toHaveCSS('background-color','rgb(255, 255, 255)');
  await expect(firstCard).toHaveCSS('border-radius','20px');
  await expect(form.getByLabel('Date de retour',{exact:true})).toHaveCSS('border-radius','12px');
  await expect(form.getByLabel('Date de retour',{exact:true})).toHaveCSS('border-color','rgb(119, 139, 132)');
  await expect(form.getByLabel('Date de retour',{exact:true})).toHaveCSS('font-size','16px');
  await expect(sample.getByRole('heading',{name:'Vérifier une période'})).toHaveCSS('font-family',/Nunito/);
  await expect(sample.getByRole('heading',{name:'Vérifier une période'})).toHaveCSS('font-weight','800');

  const measurements = [];
  for (const width of [320,375,390,430,768,1024,1280,1440]) {
    await page.setViewportSize({width,height:844});
    await fits(page);
    const stage = await sample.boundingBox();
    const first = await firstCard.boundingBox();
    const summary = await rail.boundingBox();
    const controls = await sample.locator('button,input,select,.button').evaluateAll(nodes => nodes.map(node => {
      const rect = node.getBoundingClientRect();
      return {width:rect.width,height:rect.height};
    }));
    for (const control of controls) {
      expect(control.width, `${width}px`).toBeGreaterThanOrEqual(44);
      expect(control.height, `${width}px`).toBeGreaterThanOrEqual(44);
    }
    expect(stage.width).toBeLessThanOrEqual(1200);
    if (width < 1024) {
      expect(summary.y).toBeGreaterThan(first.y + first.height);
      expect(summary.x).toBe(first.x);
    } else {
      expect(summary.x).toBeGreaterThan(first.x + first.width);
      expect(summary.y).toBe(first.y);
      expect(summary.width).toBeGreaterThanOrEqual(280);
      expect(summary.width).toBeLessThanOrEqual(360);
    }
    if (width === 320) expect(stage.x).toBe(12);
    if ([375,390].includes(width)) expect(stage.x).toBe(16);
    if (width === 1440) expect(stage.width).toBe(1200);
    measurements.push({width,scene:stage.width,gutter:stage.x,rail:summary.width,controls});
    if ([320,390,1440].includes(width)) await info.attach(`Surfaces opérationnelles · ${width}px`,{
      body:await sample.screenshot(),contentType:'image/png',
    });
  }
  await info.attach('Mesures des huit largeurs',{body:JSON.stringify(measurements,null,2),contentType:'application/json'});
  await page.setViewportSize({width:320,height:430});
  await page.evaluate(() => document.documentElement.style.fontSize = '200%');
  await expect(form.getByLabel('Date de retour',{exact:true})).toHaveCSS('font-size','32px');
  expect(await sample.evaluate(e => e.scrollWidth - e.clientWidth)).toBeLessThanOrEqual(1);
  await submit.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(submit).toBeFocused();
  await expect(submit).toHaveCSS('outline-width','3px');
  expect(await submit.evaluate(button => {
    const rect = button.getBoundingClientRect();
    return button.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
  })).toBe(true);
  await info.attach('Texte à 200 % · 320px',{body:await form.screenshot(),contentType:'image/png'});
});

test('surfaces opérationnelles : format, refus, panne, réponse tardive et confirmation locale', async ({page}, info) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto(client + '/design-system');
  const sample = page.getByRole('region',{name:'Surfaces opérationnelles',exact:true});
  const form = sample.getByRole('form',{name:'Vérifier une période',exact:true});
  const departure = form.getByLabel('Date de départ',{exact:true});
  const returned = form.getByLabel('Date de retour',{exact:true});
  const outcome = form.getByLabel('Réponse simulée',{exact:true});
  const submit = form.getByRole('button',{name:'Vérifier la période',exact:true});
  const alert = form.getByRole('alert');
  const status = sample.locator('#operational-period-status');
  const mutations = [];
  page.on('request',request => {
    if (request.url().includes('/api/v1/') && request.method() !== 'GET') mutations.push(request.method());
  });
  await expect(status).toHaveText('En attente d’une vérification.');
  await returned.fill('2027-06-09');
  await submit.click();
  await expect(alert).toContainText('La date de retour doit suivre la date de départ.');
  await expect(returned).toBeFocused();
  await expect(returned).toHaveAttribute('aria-invalid','true');
  await expect(returned).toHaveAttribute('aria-describedby',`operational-period-help ${await alert.getAttribute('id')}`);
  await info.attach('Format invalide · 390px',{body:await form.screenshot(),contentType:'image/png'});

  await returned.fill('2027-06-14');
  await expect(returned).toHaveAttribute('aria-describedby','operational-period-help');
  await page.clock.install({time:new Date('2026-11-21T16:00:00Z')});
  await page.clock.pauseAt(new Date('2026-11-21T16:01:00Z'));
  for (const [mode,message] of [['refused','Cette période est indisponible'],['network','Vos dates sont conservées']]) {
    await outcome.selectOption(mode);
    await submit.press('Enter');
    await expect(form).toHaveAttribute('aria-busy','true');
    await expect(submit).toBeDisabled();
    await expect(status).toHaveText('Vérification de la période en cours…');
    if (mode === 'refused') await info.attach('Chargement · 390px',{body:await sample.screenshot(),contentType:'image/png'});
    await page.clock.runFor(600);
    await expect(alert).toContainText(message);
    await expect(alert).toBeFocused();
    await expect(returned).not.toHaveAttribute('aria-invalid','true');
    await expect(returned).toHaveValue('2027-06-14');
    await expect(submit).toBeEnabled();
    await info.attach(mode === 'refused' ? 'Refus · 390px' : 'Panne · 390px',{body:await sample.screenshot(),contentType:'image/png'});
  }

  await outcome.selectOption('accepted');
  await submit.press('Enter');
  await expect(form).toHaveAttribute('aria-busy','true');
  await departure.fill('2027-06-11');
  await page.clock.runFor(600);
  await expect(status).toHaveText('La saisie a changé. Vérifiez de nouveau la période.');
  await expect(departure).toHaveValue('2027-06-11');
  await info.attach('Réponse tardive · 390px',{body:await sample.screenshot(),contentType:'image/png'});
  await submit.press('Enter');
  await page.clock.runFor(600);
  await expect(status).toHaveText('Période disponible dans cet exemple.');
  await expect(status).toHaveCSS('background-color','rgb(225, 241, 235)');
  await expect(form).not.toHaveAttribute('aria-busy','true');
  await info.attach('Succès confirmé · 390px',{body:await sample.screenshot(),contentType:'image/png'});
  expect(mutations).toEqual([]);
  await expect(page).toHaveURL(client + '/design-system');
});

test('surfaces opérationnelles : dialogue natif, annulation et restauration du focus', async ({page}, info) => {
  await page.setViewportSize({width:320,height:430});
  await page.goto(client + '/design-system');
  const sample = page.getByRole('region',{name:'Surfaces opérationnelles',exact:true});
  const trigger = sample.getByRole('button',{name:'Simuler un retrait',exact:true});
  const request = sample.getByRole('article',{name:'Demande fictive'});
  const dialog = page.getByRole('dialog',{name:'Retirer la demande ?',exact:true});
  await expect(request.getByRole('status')).toHaveText('En attente du propriétaire');
  await trigger.press('Enter');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription('La demande de démonstration passe à l’état « Retirée ».');
  await expect(dialog.getByRole('button',{name:'Fermer',exact:true})).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button',{name:'Annuler',exact:true})).toBeFocused();
  await page.keyboard.press('Tab');
  const confirm = dialog.getByRole('button',{name:'Retirer la demande',exact:true});
  await expect(confirm).toBeFocused();
  await expect(confirm).toHaveCSS('outline-width','3px');
  expect(await confirm.evaluate(button => {
    const rect = button.getBoundingClientRect();
    return rect.height >= 48 && button.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
  })).toBe(true);
  await info.attach('Dialogue critique · 320px',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(request.getByRole('status')).toHaveText('En attente du propriétaire');
  await trigger.press('Enter');
  await confirm.press('Enter');
  await expect(dialog).toHaveCount(0);
  const reset = sample.getByRole('button',{name:'Réinitialiser l’exemple',exact:true});
  await expect(reset).toBeFocused();
  await expect(request.getByRole('status')).toHaveText('Retirée');
  await reset.press('Enter');
  await expect(trigger).toBeFocused();
  await expect(request.getByRole('status')).toHaveText('En attente du propriétaire');
});

test('verre V3.2 : deux teintes, contrôles lisibles et reflow', async ({page}, info) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(client + '/design-system');
  const demo = page.getByRole('region', {name:'La recherche sur fond clair ou sombre'});
  const light = demo.getByRole('form', {name:'Fond clair'});
  const dark = demo.getByRole('form', {name:'Fond sombre'});
  await expect(light).toHaveCSS('background-color', 'rgba(245, 250, 246, 0.58)');
  await expect(dark).toHaveCSS('background-color', 'rgba(240, 248, 243, 0.36)');
  for (const surface of [light, dark]) {
    await expect(surface).toHaveCSS('backdrop-filter', 'blur(14px)');
    await expect(surface.locator('label')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(surface.getByRole('button')).toHaveCSS('background-color', 'rgb(28, 98, 89)');
  }
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({width, height:844});
    await fits(page);
    for (const control of await demo.getByRole('button').or(demo.getByRole('textbox')).all()) {
      const box = await control.boundingBox();
      expect(box.width, `${width}px`).toBeGreaterThanOrEqual(44);
      expect(box.height, `${width}px`).toBeGreaterThanOrEqual(44);
    }
  }
  await info.attach('Verre clair et sombre · 1440 px', {
    body:await demo.screenshot(), contentType:'image/png',
  });
});

test('verre V3.2 : clavier, erreur associée, indisponibilité et reprise locale', async ({page}, info) => {
  await page.setViewportSize({width:320, height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(client + '/design-system');
  const opaque = page.getByRole('button', {name:'Fond opaque'});
  const unavailable = page.getByRole('button', {name:'Simuler l’indisponibilité'});
  const form = page.getByRole('form', {name:'Fond clair'});
  const field = form.getByRole('textbox', {name:'Lieu de remise'});
  const submit = form.getByRole('button', {name:'Trouver une voiture'});
  await opaque.focus();
  await page.keyboard.press('Space');
  await expect(opaque).toHaveAttribute('aria-pressed', 'true');
  await expect(form).toHaveCSS('background-color', 'rgb(225, 234, 227)');
  await expect(form).toHaveCSS('backdrop-filter', 'none');
  await page.keyboard.press('Tab');
  await expect(unavailable).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(field).toBeFocused();
  await expect(form.locator('label')).toHaveCSS('outline-width', '3px');
  expect(await field.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return el === document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
  })).toBe(true);
  await page.keyboard.press('Tab');
  await expect(submit).toBeFocused();
  await page.keyboard.press('Enter');
  const error = form.getByRole('alert');
  await expect(error).toContainText('Indiquez une commune ou un aéroport.');
  await expect(field).toBeFocused();
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await expect(field).toHaveAttribute('aria-describedby', await error.getAttribute('id'));
  await info.attach('Repli opaque et validation · 320 px', {
    body:await form.screenshot(), contentType:'image/png',
  });
  await field.fill('Le Gosier');
  await expect(error).toBeHidden();
  await expect(field).not.toHaveAttribute('aria-invalid', 'true');
  await unavailable.click();
  await expect(unavailable).toHaveAttribute('aria-pressed', 'true');
  await expect(field).toBeDisabled();
  await expect(submit).toBeDisabled();
  await info.attach('Contrôles désactivés · 320 px', {
    body:await form.screenshot(), contentType:'image/png',
  });
  await unavailable.click();
  await expect(field).toBeEnabled();
  await expect(field).toHaveValue('Le Gosier');
  await submit.click();
  await expect(form.getByRole('status')).toHaveText('Recherche fictive prête.');
  await expect(page).toHaveURL(client + '/design-system');
});

test('verre V3.2 : repli pour préférences système et navigateur sans flou', async ({page}) => {
  await page.goto(client + '/design-system');
  const dark = page.getByRole('form', {name:'Fond sombre'});
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setEmulatedMedia', {
    features:[{name:'prefers-reduced-transparency', value:'reduce'}],
  });
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches)).toBe(true);
  await expect(dark).toHaveCSS('background-color', 'rgb(225, 234, 227)');
  await expect(dark).toHaveCSS('backdrop-filter', 'none');
  await page.emulateMedia({forcedColors:'active', reducedMotion:'reduce'});
  await expect(dark).toHaveCSS('backdrop-filter', 'none');
  await expect(dark).toHaveCSS('background-image', 'none');
  await expect(dark).toHaveCSS('border-top-style', 'solid');
  await expect(dark.getByRole('button')).toHaveCSS('transition-duration', '0s');
  await page.emulateMedia({forcedColors:'none', reducedMotion:'no-preference'});
  await cdp.detach();

  await page.route('**/styles/client.css', async route => {
    const response = await route.fetch();
    const css = await response.text();
    // Emulate a parser that rejects the enhancement query, leaving the base rule intact.
    await route.fulfill({response, body:css.replace(
      '@supports (backdrop-filter: blur(1px))', '@supports (display: unsupported)',
    )});
  });
  await page.reload();
  await expect(dark).toHaveCSS('background-color', 'rgb(225, 234, 227)');
  await expect(dark).toHaveCSS('backdrop-filter', 'none');
});
