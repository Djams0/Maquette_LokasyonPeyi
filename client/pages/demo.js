import {api} from '../http.js';
import {escape,link,notice,select,errorSlot,bindForm,flash,badge,icon,field,textarea,modal,toast,empty,shellLoading,statuses} from '/ui/components.js';
export async function demo(me){const personas=await api('/personas?app=client');document.getElementById('main').innerHTML=`<div class="narrow"><p class="eyebrow">Atelier de démonstration</p><h1>Explorez chaque point de vue.</h1>${notice('Toutes les personnes, demandes et opérations sont fictives. Le client et l’administration échangent uniquement avec une API commune.')}<article class="card section"><h2>Changer de profil client</h2>${link('/demo/audit','Atelier des profils audit','secondary')}<form id="persona-form">${select('Profil de démonstration','persona',personas.map(p=>[p.id,p.name+(p.status==='suspended'?' · suspendu':'')]),me?.id||'renter')}${errorSlot}<button type="submit">Ouvrir ce profil</button><button id="visitor" type="button" class="secondary">Passer en visiteur</button></form></article><article class="card section"><h2>Scénario complet</h2><ol><li>Camille : rechercher, puis envoyer une demande.</li><li>Noa : ouvrir « Demandes », puis accepter.</li><li>Camille : simuler le paiement, puis le contrôle de caution.</li><li>Remplir les huit vues du constat de départ.</li><li>Noa : confirmer la remise des clés.</li><li>Camille : constat de retour, puis retour déclaré.</li><li>Noa : confirmer la récupération et clôturer.</li><li>Camille : laisser un avis et imprimer le reçu fictif.</li></ol><div class="form-actions">${link('/search','Rechercher un véhicule')}${link('/owner/requests','Demandes propriétaire','secondary')}</div></article><article class="card section"><h2>Ouvrir le back-office indépendant</h2><p>Sur le port 8081 : Élie contrôle les documents affectés ; Ana gère les dossiers ; Sam participe à la double validation financière ; Jade et Malo administrent les habilitations.</p><a class="button secondary" href="http://localhost:8081/" target="_blank" rel="noopener">Administration · localhost:8081</a></article><article class="card section"><h2>Tester les états de l’interface</h2><form id="network-form">${select('État réseau simulé','network',[['','Normal'],['slow','Chargement lent'],['error','API indisponible']],sessionStorage.getItem('network-demo')||'')}${errorSlot}<button type="submit">Appliquer et ouvrir le catalogue</button></form><div class="form-actions">${link('/search?state=empty','Résultat vide','secondary')}${link('/route-inconnue','Écran 404','secondary')}${link('/design-system','Composants visuels','secondary')}</div></article></div>`;bindForm('persona-form',async b=>{sessionStorage.removeItem('network-demo');await api('/session',b);flash('Profil de démonstration modifié.');location.href=b.persona==='owner'?'/owner':'/';});document.getElementById('visitor').onclick=async()=>{await api('/session',undefined,'DELETE');location.href='/';};bindForm('network-form',b=>{sessionStorage.setItem('network-demo',b.network);location.href='/search';});}
export function designSystem() {
  const palette = [['Action','action'],['Ivoire','ivory'],['Encre','ink'],['Ocre','ochre'],['Information','info-bg'],['Succès','success-bg'],['Attention','warning-bg'],['Erreur','error-bg']];
  document.getElementById('main').innerHTML = `
    <p class="eyebrow">Fondations visuelles</p>
    <h1>Les fondations de Péyi contemporain.</h1>
    <p>Nunito accompagne les actions et les informations. Lora donne le ton des pages de découverte. Lobster reste réservé à la marque.</p>
    <p>Ces exemples locaux ne créent aucune donnée et n’envoient aucun message.</p>
    <div class="palette section" role="group" aria-label="Palette Péyi contemporain">${palette.map(([label,color]) => `<div class="swatch"><span class="swatch-color swatch-${color}" aria-hidden="true"></span><strong>${label}</strong></div>`).join('')}</div>
    <div class="grid section component-samples">
      <article class="card"><h2>Actions</h2><div class="stack">
        <button id="sample-toast">Afficher une notification</button>
        ${link('/','Action secondaire','secondary')}
        <button class="quiet" type="button" id="sample-modal">Ouvrir le dialogue</button>
        <button class="warm" type="button" id="sample-warm">Action mise en avant</button>
        <button class="danger" type="button" id="sample-danger">Action à confirmer</button>
        <button disabled>Indisponible</button>
      </div></article>
      <article class="card"><h2>Champs et reprise</h2>
        <form id="sample-form">${field('Prénom fictif','name','','text','required minlength="2" autocomplete="off"')}${select('Préférence','preference',[['','Choisir'],['short','Réponse courte'],['detailed','Réponse détaillée']])}${textarea('Note fictive','note')}${field('Champ indisponible','unavailable','Indisponible','text','disabled')}${errorSlot}<button type="submit">Tester le formulaire</button></form>
        <p class="section muted">Saisissez « erreur » pour essayer une erreur récupérable. La saisie reste affichée.</p><p id="sample-form-result" role="status"></p>
      </article>
      <article class="card"><h2>États explicites</h2><div class="stack">${badge('confirmed')}${badge('pending')}${badge('rejected')}</div><details class="section"><summary>Tous les états existants</summary><div class="stack">${Object.keys(statuses).map(badge).join('')}</div></details></article>
      <article class="card"><h2>Informations et retours</h2><div class="stack">
        ${notice('Texte et couleur se complètent.')}${notice('Une opération fictive est terminée.','success')}${notice('Une attention est nécessaire.','warning')}${notice('L’opération fictive a échoué. Vous pouvez réessayer.','error')}
      </div></article>
      <article class="card"><h2>État vide</h2>${empty('Aucun élément ici','Changez les critères pour poursuivre.',link('/search','Explorer les véhicules','secondary'))}</article>
      <article class="card"><h2>Chargement</h2><p>Une place réservée garde la page stable pendant le chargement.</p>${shellLoading}</article>
    </div>
    <section class="card section"><h2>Une typographie lisible</h2><p class="editorial-type">Une voiture, à votre rythme.</p><p>Le corps reste à 16 px, avec un interligne de 24 px. Les informations secondaires utilisent au moins 14 px.</p><small>Une information secondaire reste lisible et conserve son contexte.</small></section>`;
  document.getElementById('sample-toast').onclick = () => toast('Notification de démonstration.');
  const open = () => modal('Un dialogue clair', `<p>Les exemples sont fictifs. Fermer ou Échap vous ramène au bouton d’origine.</p>${field('Votre prénom fictif','firstName','','text','required minlength="2"')}<p>Saisissez « erreur » pour tester la reprise.</p>`, async b => {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (b.firstName.trim().toLowerCase() === 'erreur') throw Error('Exemple d’erreur. Corrigez votre prénom fictif puis réessayez.');
    toast('Exemple confirmé.');
  });
  document.getElementById('sample-modal').onclick = open;
  document.getElementById('sample-danger').onclick = open;
  document.getElementById('sample-warm').onclick = () => toast('Action fictive sélectionnée.');
  bindForm('sample-form', async b => {
    document.getElementById('sample-form-result').textContent = '';
    await new Promise(resolve => setTimeout(resolve, 400));
    if (b.name.trim().toLowerCase() === 'erreur') throw Error('Exemple d’erreur. Votre saisie est conservée ; corrigez le prénom fictif.');
    document.getElementById('sample-form-result').textContent = 'Formulaire fictif vérifié, aucune donnée envoyée.';
  });
}
