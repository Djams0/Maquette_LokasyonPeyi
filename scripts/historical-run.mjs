// A fresh temporary historical store for the unchanged sequential browser suite.
import {mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {seed} from '../api/seed.mjs';
const directory=mkdtempSync(join(tmpdir(),'lp-historical-'));
const file=join(directory,'mock.json');writeFileSync(file,JSON.stringify(seed()),{flag:'wx'});
console.log(`Instance historique jetable : ${directory}`);
const env={...process.env,DATA_FILE:file};delete env.AUDIT_FIXTURE;delete env.AUDIT_INSTANCE_NONCE;
const child=spawn(process.execPath,['scripts/dev.mjs'],{stdio:'inherit',env});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exitCode=code||0);
