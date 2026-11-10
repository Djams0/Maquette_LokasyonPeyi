import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import {scenarios} from '../docs/audit/scenarios.mjs';
let commit='unavailable',dirty=true;
try{commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();dirty=!!execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim();}catch{}
const results=['test-results/results.json','audit-results/results.json'].map(file=>({file,...(existsSync(file)?{stats:JSON.parse(readFileSync(file,'utf8')).stats}:{notExecuted:true})}));
mkdirSync('audit-results',{recursive:true});
writeFileSync('audit-results/manifest.json',JSON.stringify({commit,dirty,node:process.version,generatedAt:new Date().toISOString(),fixture:'audit-v1',reference:'78966c97a5e8f373c8e7eff6c26c7cd356ee7b29',results,scenarios:scenarios.map(({id,control,automated})=>({id,control,automated})),limits:'Manual cases are prepared only. See REGRESSION_REPORT.md for actual execution and Docker limits.'},null,2));
console.log('Inventaire : audit-results/manifest.json');
