import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [mode, origin, output, sizes = '1440,1280,1024,768,430,390,375,320'] = process.argv.slice(2);
if (!['app', 'reference'].includes(mode) || !origin || !output) {
  throw new Error('Usage: node capture-v32.mjs app|reference URL dossier [1440,390,...]');
}
const viewports = {'1440':900,'1280':760,'1024':900,'768':950,'430':932,'390':844,'375':812,'320':844};
const widths = sizes.split(',');
if (widths.some(width => !viewports[width])) throw new Error('Largeur sans viewport défini');
const scenarios = mode === 'app'
  ? [['accueil','/','#explorer-catalogue[aria-busy="false"]'], ['catalogue','/search','#search-items[aria-busy="false"]'], ['fiche','/vehicle/v3','.vehicle-detail-layout']]
  : [['accueil','?page=accueil','.hero'], ['catalogue','?page=catalogue','.results-layout'], ['fiche','?page=fiche&id=clio','.gallery']];
const browser = await chromium.launch();
const report = [];
await mkdir(output, { recursive:true });
try {
  for (const width of widths) {
    const viewport = { width:Number(width), height:viewports[width] };
    const context = await browser.newContext({
      viewport, deviceScaleFactor:1, locale:'fr-FR', timezoneId:'America/Guadeloupe',
      reducedMotion:'reduce', colorScheme:'light',
    });
    try {
      for (const [name, path, ready] of scenarios) {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const target = new URL(path, origin).href;
        await page.goto(target, { waitUntil:'load' });
        await page.locator(ready).first().waitFor({timeout:15000});
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(Array.from(document.images, img => {
            if (img.loading === 'lazy') img.loading = 'eager';
            return img.currentSrc ? img.decode().catch(() => {}) : Promise.resolve();
          }));
        });
        const metrics = await page.evaluate(() => {
          const title = document.querySelector('main h1');
          const style = getComputedStyle(title);
          const rect = title.getBoundingClientRect();
          return {
            title:title.textContent.trim(), fontFamily:style.fontFamily, fontSize:style.fontSize,
            titleBox:[rect.x,rect.y,rect.width,rect.height], scrollWidth:document.documentElement.scrollWidth,
            images:Array.from(document.images, image => ({
              src:image.getAttribute('src'), width:image.naturalWidth, height:image.naturalHeight,
            })),
          };
        });
        const key = [mode, name, width].join('-');
        await page.screenshot({path:join(output,key+'-viewport.png'),animations:'disabled'});
        await page.screenshot({path:join(output,key+'-full.png'),animations:'disabled',fullPage:true});
        report.push({key,viewport,metrics,errors});
        await page.close();
      }
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
await writeFile(join(output,mode+'-metrics.json'), JSON.stringify(report,null,2)+'\n');
if (report.some(entry => entry.errors.length)) process.exitCode = 1;
