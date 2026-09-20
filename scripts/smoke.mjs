import assert from 'node:assert/strict';
for(const port of [8080,8081,3001]){const r=await fetch(`http://127.0.0.1:${port}/health`);assert.equal(r.status,200);assert.equal((await r.json()).ok,true);console.log(`Service ${port} : OK`);}
for(const [port,paths] of [[8080,['/','/search','/vehicle/v1','/login','/owner/start','/app.js','/ui/base.css','/assets/fonts/Lora.ttf']],[8081,['/','/login','/moderation','/app.js']]])for(const p of paths){const r=await fetch(`http://127.0.0.1:${port}${p}`);assert.equal(r.status,200,p);}
const c=await fetch('http://127.0.0.1:8080/api/v1/vehicles'),a=await fetch('http://127.0.0.1:8081/api/v1/vehicles');assert.deepEqual(await c.json(),await a.json());console.log('Routes, assets et source API commune : OK');
