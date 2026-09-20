import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve,extname,sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));const app=process.env.APP||process.argv[2]||'client';
if(!['client','admin'].includes(app))throw Error('APP invalide');
const port=Number(process.env.PORT||(app==='client'?8080:8081));const api=process.env.API_URL||'http://127.0.0.1:3001';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.json':'application/json'};
const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'");
  let path;try{path=decodeURIComponent(new URL(req.url,'http://web.local').pathname);}catch{res.writeHead(400);res.end('Requête invalide');return;}
  if(path==='/health'){res.setHeader('Content-Type','application/json');res.end('{"ok":true}');return;}
  if(path.startsWith('/api/')){
    const target=new URL(req.url,api);const proxy=http.request(target,{method:req.method,headers:{...req.headers,host:target.host,'x-demo-app':app}},up=>{res.writeHead(up.statusCode,up.headers);up.pipe(res);});proxy.on('error',()=>{res.writeHead(503,{'Content-Type':'application/json'});res.end('{"error":"API indisponible. Vos saisies sont conservées ; réessayez."}');});req.pipe(proxy);return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end('Méthode interdite');return;}
  let file;
  if(path.startsWith('/assets/')||path.startsWith('/ui/'))file=resolve(root,'.'+path);
  else if(path.startsWith('/pages/')||path.startsWith('/styles/')||['/app.js','/shell.js','/http.js'].includes(path))file=resolve(root,app,'.'+path);
  else if(extname(path)){res.writeHead(404);res.end('Fichier introuvable');return;}
  else file=resolve(root,app,'index.html');
  if(![resolve(root,app)+sep,resolve(root,'assets')+sep,resolve(root,'ui')+sep].some(base=>file.startsWith(base))){res.writeHead(403);res.end('Accès interdit');return;}
  try {const content=await readFile(file);res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-cache');res.end(req.method==='HEAD'?undefined:content);}catch{res.writeHead(404);res.end('Fichier introuvable');}
});
server.listen(port,'0.0.0.0',()=>console.log(`${app} prêt sur ${port}`));for(const s of ['SIGTERM','SIGINT'])process.on(s,()=>server.close(()=>process.exit(0)));
