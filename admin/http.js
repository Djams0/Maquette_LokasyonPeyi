let actorId=null,sessionStale=false;
export function bindAdminSession(me){actorId=me?.id||null;sessionStale=false;document.documentElement.classList.remove('admin-session-stale');document.getElementById('admin-session-warning')?.remove();}
function changedSession(){
  sessionStale=true;document.documentElement.classList.add('admin-session-stale');
  document.querySelectorAll('dialog').forEach(dialog=>dialog.remove());
  if(!document.getElementById('admin-session-warning')){const warning=document.createElement('main');warning.id='admin-session-warning';warning.className='admin-login';warning.innerHTML='<h1 tabindex="-1">Session interne modifiée</h1><p>Le compte ou ses droits ont changé. Rechargez l’espace avec le profil courant avant de reprendre une décision.</p><a class="button" href="/login">Choisir le profil courant</a>';document.getElementById('shell').prepend(warning);warning.querySelector('h1').focus();}
  return Object.assign(new Error('Session interne modifiée. Réouvrez le dossier avec le profil courant.'),{status:403});
}
async function sameActor(){if(sessionStale)throw changedSession();const current=await api('/me');if(current?.id!==actorId||current?.status!=='active')throw changedSession();}
export async function api(path,body,method=body?'POST':'GET',key) {
  const guarded=actorId&&path.startsWith('/admin/');
  if(guarded&&method!=='GET')await sameActor();
  const mode=sessionStorage.getItem('network-demo');
  if(mode==='error')throw Error('Connexion simulée indisponible. Désactivez le scénario dans Démo pour réessayer.');
  if(mode==='slow')await new Promise(r=>setTimeout(r,1800));
  let response;try{response=await fetch('/api/v1'+path,{method,headers:{'Content-Type':'application/json',...(key?{'Idempotency-Key':key}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(10000)});}catch{throw Error('API injoignable. Vérifiez la connexion puis réessayez ; vos saisies restent affichées.');}
  const data=await response.json();if(guarded)await sameActor();if(!response.ok)throw Object.assign(new Error(data.error||'Une erreur est survenue.'),{status:response.status});return data;
}
