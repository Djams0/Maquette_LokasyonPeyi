import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const checkout=process.argv[2];
if (!checkout) {
  throw new Error('Usage: node verify_mock_message.mjs /absolute/path/to/Maquette_LokasyonPeyi');
}
const moduleUrl=pathToFileURL(resolve(checkout,'api/server.mjs')).href;
const {createApi}=await import(moduleUrl);
const {server}=createApi({});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port+'/api/v1';
const call=async(path,body,cookie,key)=>{
 const response=await fetch(origin+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...(key?{'Idempotency-Key':key}:{})},body:body?JSON.stringify(body):undefined});
 return {status:response.status,data:await response.json(),cookie:response.headers.get('Set-Cookie')?.split(';')[0]};
};
try {
 const {cookie}=await call('/session',{persona:'renter'});
 const c=await call('/conversations',{vehicleId:'v1'},cookie);
 assert.equal(c.status,200);
 const p='/conversations/'+c.data.id;
 const first=await call(p,{text:'Recette · réponse ignorée'},cookie,'handoff-msg-01');
 const retry=await call(p,{text:'Recette · réponse ignorée'},cookie,'handoff-msg-01');
 assert.equal(first.status,200);assert.deepEqual(retry.data,first.data);
 assert.equal((await call(p,{text:'Corps différent'},cookie,'handoff-msg-01')).status,409);
 const list=await call('/conversations',undefined,cookie);
 assert.equal(list.data.find(x=>x.id===c.data.id).messages.filter(x=>x.text==='Recette · réponse ignorée').length,1);
 const third=(await call('/session',{persona:'other'})).cookie;
 assert.equal((await call(p,{text:'Accès croisé'},third,'handoff-msg-01')).status,403);
 console.log('Mock idempotency proof: same actor/path/key/body returns same reply; 1 message; changed body 409; outsider 403.');
}finally{await new Promise(resolve=>server.close(resolve));}
