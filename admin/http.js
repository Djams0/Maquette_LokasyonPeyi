export async function api(path,body,method=body?'POST':'GET',key) {
  const mode=sessionStorage.getItem('network-demo');
  if(mode==='error')throw Error('Connexion simulée indisponible. Désactivez le scénario dans Démo pour réessayer.');
  if(mode==='slow')await new Promise(r=>setTimeout(r,1800));
  let response;try{response=await fetch('/api/v1'+path,{method,headers:{'Content-Type':'application/json',...(key?{'Idempotency-Key':key}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(10000)});}catch{throw Error('API injoignable. Vérifiez la connexion puis réessayez ; vos saisies restent affichées.');}
  const data=await response.json();if(!response.ok)throw Object.assign(new Error(data.error||'Une erreur est survenue.'),{status:response.status});return data;
}
