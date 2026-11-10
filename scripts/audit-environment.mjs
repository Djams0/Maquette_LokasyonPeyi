import {mkdtempSync,writeFileSync,readFileSync,lstatSync,realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {randomUUID} from 'node:crypto';
import {auditFixture} from '../api/audit-fixture.mjs';

// No arbitrary path, delete, volume operation, or HTTP reset endpoint.
export function createAuditEnvironment() {
  const directory=mkdtempSync(join(tmpdir(),'lp-audit-'));
  const marker={kind:'lp-audit-disposable-v1',directory:realpathSync(directory),nonce:randomUUID()};
  writeFileSync(join(directory,'.lp-audit.json'),JSON.stringify(marker),{flag:'wx'});
  const file=join(directory,'mock.json');
  writeFileSync(file,JSON.stringify(auditFixture()),{flag:'wx'});
  return {directory,file,nonce:marker.nonce};
}

export function loadAuditEnvironment(file,nonce) {
  if(process.env.NODE_ENV==='production')throw Error('Simulation audit interdite en production.');
  if(!file||!nonce)throw Error('Une instance jetable explicitement identifiée est requise.');
  const directory=dirname(resolve(file));
  if(dirname(directory)!==realpathSync(tmpdir())||!directory.split(/[\\/]/).at(-1).startsWith('lp-audit-'))throw Error('Chemin audit non autorisé.');
  for(const p of [directory,join(directory,'.lp-audit.json'),file])if(lstatSync(p).isSymbolicLink())throw Error('Lien symbolique interdit.');
  const marker=JSON.parse(readFileSync(join(directory,'.lp-audit.json'),'utf8'));
  if(marker.kind!=='lp-audit-disposable-v1'||marker.directory!==realpathSync(directory)||marker.nonce!==nonce||resolve(file)!==join(directory,'mock.json'))throw Error('Cible audit non vérifiée.');
  const db=JSON.parse(readFileSync(file,'utf8'));
  if(db.simulation?.fixture!=='audit-v1')throw Error('Fixture audit requise.');
  return db;
}
