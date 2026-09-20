import {spawn} from 'node:child_process';
const children=[['api/server.mjs'],['scripts/web.mjs','client'],['scripts/web.mjs','admin']].map(args=>spawn(process.execPath,args,{stdio:'inherit'}));
let closing=false;function stop(code=0){if(closing)return;closing=true;for(const c of children)c.kill('SIGTERM');setTimeout(()=>process.exit(code),200).unref();}
for(const c of children)c.on('exit',code=>{if(!closing)stop(code||1);});for(const s of ['SIGINT','SIGTERM'])process.on(s,()=>stop());
