import {spawn} from 'node:child_process';
import {createAuditEnvironment} from './audit-environment.mjs';
const target=createAuditEnvironment();
// Deliberately never accepts DATA_FILE or a user-supplied reset target.
console.log(`Instance fictive jetable : ${target.directory}\nClient : http://127.0.0.1:8080/demo/audit\nAdmin : http://127.0.0.1:8081/login\nArrêter puis relancer cette commande crée une campagne propre, sans suppression.`);
const child=spawn(process.execPath,['scripts/dev.mjs'],{stdio:'inherit',env:{...process.env,DATA_FILE:target.file,AUDIT_INSTANCE_NONCE:target.nonce,AUDIT_FIXTURE:'1',DEMO_LOOPBACK:'1'}});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exitCode=code||0);
