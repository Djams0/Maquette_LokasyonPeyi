import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { seed } from './seed.mjs';
export const id = prefix => `${prefix}-${randomUUID().slice(0,8)}`;
export function createStore(file) {
  let db = file && existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : seed();
  return {
    get db() { return db; },
    transact(fn) {
      const previous = structuredClone(db);
      try {
        const result = fn(db);
        db.version++;
        if (file) { mkdirSync(dirname(file),{recursive:true});writeFileSync(`${file}.tmp`, JSON.stringify(db));renameSync(`${file}.tmp`,file); }
        return result;
      } catch(error) { db = previous; throw error; }
    },
  };
}
export function audit(db, actor, action, resource, detail = '') {
  db.audit.push({ id:id('audit'), actor:actor.id, action, resource, detail, at:new Date().toISOString() });
}
export function notify(db, userId, title, href) {
  db.notifications.unshift({id:id('note'),userId,title,href,read:false,at:new Date().toISOString()});
}
