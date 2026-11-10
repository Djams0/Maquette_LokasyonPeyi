import {defineConfig} from '@playwright/test';
const browser=process.env.AUDIT_BROWSER||'chromium';
if(!['chromium','firefox','webkit'].includes(browser))throw Error('Navigateur audit inconnu');
export default defineConfig({
  testDir:'tests/audit-browser',workers:1,retries:0,timeout:60000,
  reporter:[['list'],['html',{open:'never',outputFolder:'audit-results/html'}],['json',{outputFile:'audit-results/results.json'}]],
  use:{browserName:browser,locale:'fr-FR',headless:true,viewport:{width:1440,height:1000},screenshot:'only-on-failure',trace:process.env.AUDIT_TRACE==='1'?'on':'retain-on-failure',video:'retain-on-failure'},
  outputDir:'audit-results/browser',
});
