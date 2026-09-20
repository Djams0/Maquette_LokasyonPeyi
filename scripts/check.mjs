import {readdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const dirs=['client','admin','api','ui','scripts','tests'];let count=0;
async function scan(dir){for(const e of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+e.name;if(e.isDirectory())await scan(path);else if(/\.(m?js)$/.test(path)){const r=spawnSync(process.execPath,['--check',path],{encoding:'utf8'});if(r.status)throw Error(r.stderr);const s=await readFile(path,'utf8');if((dir.startsWith('client')&&/from\s*['"][^'"]*admin/.test(s))||(dir.startsWith('admin')&&/from\s*['"][^'"]*client/.test(s)))throw Error('Couplage interdit '+path);count++;}}}for(const d of dirs)await scan(d);console.log(`${count} modules : syntaxe et indépendance des imports vérifiées.`);
