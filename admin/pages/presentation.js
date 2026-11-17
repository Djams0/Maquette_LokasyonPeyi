import {escape,icon} from '/ui/components.js';
// Served through the existing /pages entry point of the independent Admin front.

export function queueReturn(value,path,fallback=path) {
  try {
    if(typeof value!=='string'||!value.startsWith('/')||value.startsWith('//')||/[\\\u0000-\u001f\u007f]/.test(value))return fallback;
    const url=new URL(value,'https://admin.invalid');
    if(url.origin!=='https://admin.invalid'||url.pathname!==path||url.hash)return fallback;
    const params=new URLSearchParams();
    for(const key of path==='/moderation'?['tab','state','q']:['state','q']) {
      if(url.searchParams.getAll(key).length>1)return fallback;
      if(url.searchParams.has(key))params.set(key,url.searchParams.get(key));
    }
    return path+(params.size?'?'+params:'');
  }catch{return fallback;}
}
export const detailURL=(path,back)=>path+'?'+new URLSearchParams({return:back});
export const assignment=(record,actorId)=>Array.isArray(record.assignedTo)?(record.assignedTo.includes(actorId)?'Votre compte · ':'')+record.assignedTo.join(', '):'Non précisée par le mock';
export function observedRecord(record,documents=[]) {
  if(!record)return null;
  return JSON.stringify({id:record.id,version:record.version,status:record.status,checksPassed:record.checksPassed,assignedTo:record.assignedTo?.slice().sort(),documents:documents.map(d=>({id:d.id,version:d.version,status:d.status})).sort((a,b)=>a.id.localeCompare(b.id))});
}
export function enhanceAdmin(root) {
  let n=0;
  root.querySelectorAll('table').forEach(table=>{
    table.classList.add('admin-queue');table.setAttribute('role','table');table.closest('.table-wrap')?.classList.add('admin-queue-wrap');
    const headers=[...table.querySelectorAll('thead th')];
    headers.forEach((th,i)=>{th.scope='col';th.id||='admin-column-'+n+'-'+i;th.setAttribute('role','columnheader');});
    table.querySelectorAll('thead,tbody').forEach(section=>section.setAttribute('role','rowgroup'));
    table.querySelectorAll('tr').forEach(tr=>tr.setAttribute('role','row'));
    table.querySelectorAll('tbody tr').forEach(tr=>[...tr.cells].forEach((td,i)=>{td.dataset.label=headers[i]?.textContent.trim()||'';td.setAttribute('role','cell');if(headers[i])td.setAttribute('headers',headers[i].id);if(i===0)td.dataset.primary='true';}));n++;
  });
  root.dataset.adminReady='true';
}
export function stalePanel(root,message,current,href) {
  let panel=root.querySelector('[data-admin-stale]');
  if(!panel){panel=document.createElement('section');panel.className='admin-stale';panel.dataset.adminStale='true';root.prepend(panel);}
  panel.innerHTML=`<h2 tabindex="-1">Réexaminer l’état courant</h2><p>${escape(message)}</p><p>${escape(current)}</p><p>Votre saisie sur l’état affiché est conservée ici. Elle ne sera pas reportée automatiquement sur la nouvelle version.</p><a class="button secondary" href="${escape(href)}">${icon('refresh')}Ouvrir la version courante</a>`;
  root.querySelectorAll('form').forEach(form=>{form.dataset.obsolete='true';let fields=form.querySelector(':scope > fieldset');if(!fields){fields=document.createElement('fieldset');fields.className='admin-decision-fields';fields.append(...form.childNodes);form.append(fields);}fields.disabled=true;});
  panel.querySelector('h2').focus({preventScroll:true});panel.scrollIntoView({block:'start'});
}
