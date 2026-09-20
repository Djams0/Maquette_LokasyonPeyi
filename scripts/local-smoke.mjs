import {spawn} from 'node:child_process';
import {setTimeout} from 'node:timers/promises';
const dev=spawn(process.execPath,['scripts/dev.mjs'],{stdio:'inherit'});
try{for(let i=0;i<30;i++){try{await fetch('http://127.0.0.1:8080/health');break;}catch{await setTimeout(100);}}await import('./smoke.mjs');}finally{dev.kill('SIGTERM');}
