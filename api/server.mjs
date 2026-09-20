import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { createStore } from './store.mjs';
import { route } from './router.mjs';
import { requireValue } from './errors.mjs';
export function createApi({file,delay=0}={}) {
  const store=createStore(file),sessions=new Map();
  const server=http.createServer(async(req,res)=>{
    const requestId=randomUUID();res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Request-Id',requestId);
    try {
      const url=new URL(req.url,'http://mock.local');
      if(url.pathname==='/health'){res.end(JSON.stringify({ok:true,mode:'demo',version:store.db.version}));return;}
      const app=req.headers['x-demo-app']==='admin'?'admin':'client';const cookieName=`lp_${app}`;
      const token=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);
      let actor=store.db.users.find(u=>u.id===sessions.get(token));let raw='';
      for await(const chunk of req){raw+=chunk;requireValue(Buffer.byteLength(raw)<=65536,413,'Requête trop volumineuse.');}
      let body={};if(raw){try{body=JSON.parse(raw);}catch{requireValue(false,400,'JSON invalide.');}}
      requireValue(body&&typeof body==='object'&&!Array.isArray(body),400,'Objet JSON attendu.');
      const path=url.pathname.replace(/^\/api\/v1/,'');const mut=req.method!=='GET';
      if(mut){requireValue(['POST','PATCH','DELETE'].includes(req.method),405,'Méthode non prise en charge.');const origin=req.headers.origin;requireValue(!origin||/^http:\/\/(localhost|127\.0\.0\.1):(8080|8081|3001)$/.test(origin),403,'Origine non autorisée.');}
      if(path==='/session'&&req.method==='POST') {
        actor=store.db.users.find(u=>u.id===body.persona&&u.status==='active');requireValue(actor&&(app==='admin'?actor.internal:!actor.internal),401,'Compte démo indisponible.');const t=randomUUID();sessions.set(t,actor.id);res.setHeader('Set-Cookie',`${cookieName}=${t}; HttpOnly; SameSite=Strict; Path=/`);res.end(JSON.stringify(actor));return;
      }
      if(path==='/session'&&req.method==='DELETE'){sessions.delete(token);res.setHeader('Set-Cookie',`${cookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);res.end('{"ok":true}');return;}
      if(path==='/register'&&req.method==='POST') {
        requireValue(typeof body.name==='string'&&body.name.trim().length>=2&&body.name.length<=80,422,'Prénom fictif requis.');requireValue(body.confirm===true,422,'Utilisez exclusivement des données fictives.');
        const u=store.transact(db=>{const u={id:`demo-${randomUUID().slice(0,8)}`,name:body.name.trim()+' · démo',email:'compte@example.test',status:'active',owner:false,eligibility:'missing',memberSince:'2026',completed:0};db.users.push(u);return u;});const t=randomUUID();sessions.set(t,u.id);res.setHeader('Set-Cookie',`${cookieName}=${t}; HttpOnly; SameSite=Strict; Path=/`);res.end(JSON.stringify(u));return;
      }
      if(delay)await new Promise(r=>setTimeout(r,delay));
      const input={actor,path,method:req.method,body,query:url.searchParams};
      let output;
      if(mut){output=store.transact(db=>{
        const idem=req.headers['idempotency-key'];const key=idem?`${actor?.id}:${path}:${idem}`:null;const signature=JSON.stringify(body);
        if(key&&db.idempotency[key]){requireValue(db.idempotency[key].signature===signature,409,'Clé déjà utilisée pour une autre requête.');return db.idempotency[key].output;}
        const result=route({...input,db});if(key)db.idempotency[key]={signature,output:structuredClone(result)};return result;
      });}else output=route({...input,db:store.db});
      res.end(JSON.stringify(output));
    }catch(e){res.statusCode=e.status||500;res.end(JSON.stringify({error:e.status?e.message:'Erreur interne de la démonstration.',requestId}));}
  });
  return {server,store};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const {server}=createApi({file:process.env.DATA_FILE||'data/mock.json',delay:Number(process.env.MOCK_DELAY||0)});server.listen(Number(process.env.PORT||3001),'0.0.0.0',()=>console.log('API mock prête'));for(const s of ['SIGTERM','SIGINT'])process.on(s,()=>server.close(()=>process.exit(0)));}
