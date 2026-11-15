# Baseline consultée et rejouée

13 novembre 2026. Maquette main `d8ef8450f762e3c8f14f15dcef6b5bc8d67cc4eb` (PR #1 audit), principal main `78966c97a5e8f373c8e7eff6c26c7cd356ee7b29` (PR #26 bilan de Phase 0). Le checkout de maquette correspond au SHA. Les workflows des deux dépôts ont été relus. Le workflow du principal comporte Phase 0 quality et Four local images and Compose smoke. Les tests du principal sont hors de cette baseline. Le moteur Docker est absent de cet environnement.

| Commande | Résultat observé sur la maquette |
|---|---|
| `npm run check` | Succès, 47 modules et 108 scénarios documentés dont 31 reliés à une assertion. |
| `npm test` | 18 succès. |
| `python -m unittest discover -s tests -p 'test_*.py'` | 2 succès. |
| `node scripts/local-smoke.mjs` | Client 8080, Admin 8081, API 3001, routes et assets OK. |
| `npm run test:browser` | 13 succès sur cible historique jetable, dont sept largeurs. Le premier essai a perdu les services locaux au démarrage du smoke sur les mêmes ports. Relance seule, services attachés au même processus parent. |
| `npm run test:audit` | 11 succès sur contextes audit isolés. |
| Test ciblé du POST message mock | Même acteur/chemin/clé/corps : même réponse et une seule copie. Même clé et corps différent : 409. Tiers hors fil : 403. Le formulaire actuel ne fournit pas cette clé. [Sonde reproductible](../tools/verify_mock_message.mjs), à lancer avec le chemin absolu du dépôt maquette. |

Node 24.22.1, Playwright 1.56.1, Chromium. Aucun diff applicatif. Smartphones physiques, lecteurs d’écran et campagne visuelle après implémentation restent à vérifier. Les captures de l’audit précédent représentent le même SHA avec des scènes fictives.

| Sujet | Preuve et traitement |
|---|---|
| Continuité | La V1 a observé le remplacement de période et la perte de filtres. La fiche reconstruit ses dates et retourne à `/search` nu. Lot 04. |
| Densité | Le bloc réservation observé commençait à 1 907 px à 390 × 844. Lot 05. |
| Brouillon | L’API garde les champs et `step`, mais l’entrée sans paramètre ouvre l’étape 1. La saisie nouvelle disparaît à l’actualisation. Lot 08A. |
| Messagerie | Liste et fil s’empilent, le formulaire envoie sans clé, actualiser recharge la page. Lot 07. |
| Permissions | Garder contrôles serveur, comptes limités et suspendus, pièces et validations secondaires. Lot 08B. |
