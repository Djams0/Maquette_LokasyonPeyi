import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests/browser',timeout:60000,expect:{timeout:10000},workers:1,retries:0,reporter:[['list'],['html',{open:'never'}]],use:{browserName:'chromium',locale:'fr-FR',headless:true,viewport:{width:1440,height:1000},screenshot:'only-on-failure',trace:'retain-on-failure'},outputDir:'test-results'});
