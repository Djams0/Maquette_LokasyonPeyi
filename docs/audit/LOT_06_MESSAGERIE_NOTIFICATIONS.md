# Lot 06 · Messagerie et notifications

## Résultat et base de revue

La boîte de réception présente les conversations du compte, leur dernier message et la recherche. Sur ordinateur, une colonne de 320 px laisse le fil à côté de la liste. Sur mobile, le fil garde son retour à la recherche et le formulaire reste dans le flux. Le bandeau du fil identifie le véhicule. La liste des notifications distingue vide, tout lu et non lu, et ouvre les ressources indiquées par le serveur.

- Base de revue et `origin/main` au départ `8dcd9dd401f426b67debf7213257c8680b32ba12`, fusion du [lot 05](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/29). La soumission du lot 06 exprimait le GO de démarrage. La validation de ce lot reste humaine.
- `git fetch origin` et `git merge-base --is-ancestor 4338f5f7ca252f4d4f02021ec47a226d0d2d6064 HEAD` vérifiés sur la base propre. Le diff depuis le SHA audité a été relu sur les contrats de communication, de navigation et des pages protégées.
- Branche `client-v32/lot-06`. Le SHA du candidat et les contrôles GitHub sont dans la PR de revue. Restauration possible par réversion du commit du lot.

## Fichiers, contrats et décisions

| Fichier | Raison |
| --- | --- |
| `client/pages/messaging.js` | En-tête véhicule, filtre, liste, fil et reprise. Conserve `q`, l’ID du fil, la sélection, le défilement, le brouillon et les deux lectures d’identité autour de la liste. Le POST garde le corps et la clé gelés et le rendu déduplique selon l’ID serveur. |
| `client/pages/message-state.js` | Un état illisible passe en vérification seule. Un échec de lecture lors d’un réessai laisse une tentative incertaine. |
| `client/pages/account.js`, `client/app.js` | La notification garde sa cible locale et son état serveur. Le marquage est global, vérifie l’identité et relit le compte via `GET /bootstrap`. Si la confirmation se perd, le bouton d’actualisation déclenche uniquement une lecture. |
| `client/styles/client.css` | Grille, hiérarchie typographique et focus des deux surfaces, avec reflow des contrôles sur petit écran. |
| `tests/browser/messaging.spec.js`, `tests/message-state.test.mjs` | Sept cas navigateur ajoutés et assertion unitaire étendue sur l’état illisible. |
| Rapport, suivi et manifeste kit | Références de recette et empreinte du suivi V3.2. |

Planches B 24 à 27. Recomposition B pour la messagerie et A pour les notifications. Le jeu d’audit donne un véhicule au fil et deux participants. Les libellés restent « Vous » et « Votre interlocuteur ». L’action liée au fil ouvre la fiche véhicule. Les mentions d’état d’envoi décrivent uniquement des faits confirmés par le serveur simulé. Le bouton « Tout marquer comme lu » reste une action séparée de l’ouverture d’une cible. Une tentative ne part qu’après persistance de sa clé dans l’onglet. Si cette clé devient incomplète, la vérification du fil et le brouillon restent accessibles.

Les endpoints restent `GET /me`, `GET /conversations`, `POST /conversations/:id`, `GET /bootstrap` et `POST /notifications/read` sous `/api/v1`. Les sessions expirées, comptes différents et fils non autorisés sont traités avant réaffichage ou reprise. Les contrôles serveur de session et de participation restent l’autorité pour chaque requête.

## Recette

Node 24.22.2, Playwright 1.56.1, Chromium 141.0.7390.37 et Python 3.13.5. L’API, le client et l’administration utilisent des services loopback et des bases mémoire jetables. Pour les captures publiques, même seed sur les deux arbres. Les scènes de communication utilisent la fixture d’audit avec contenu synthétique, horloge fixe et aucune donnée réelle.

| Vérification | Résultat |
| --- | --- |
| `npm run check`, `npm test` | Syntaxe, imports et documentation vérifiés. 50/50 tests Node. |
| `python -m unittest discover -s tests -p "test_*.py"` | 2/2. |
| `npm run smoke` | Les trois services, les routes et la source API commune répondent. |
| `python tools/verify_v32.py`, `python tools/verify_extension.py` | Validateurs du kit exécutés depuis sa racine. |
| Playwright requis `messaging`, `navigation`, `maquette` | Référence 40/40. Le résultat final du candidat et les assertions par cas figurent dans la table de recette locale et la PR. |
| Messagerie et notifications | 25/25. Double clic, tiers exclu, perte avant et après écriture, corps et clé identiques au réessai, ID serveur, changement de compte, stockage illisible, recherche, focus, destination et marquage global. |
| Scénarios protégés | 72 cas sur chaque arbre. Navigation par rôle, catalogue, recherche, galerie, compte et recette visuelle. Résultats par cas dans la table de recette et la PR. |
| Audit local essentiel | Quatre profils essentiels sur données jetables. Résultats local et CI dans la PR. |
| Workflow GitHub | États bruts du handoff, de l’UI, de l’audit essentiel et des preuves expurgées dans la PR. Les contrôles souples peuvent produire un workflow vert avec un échec brut. L’audit approfondi dépend du déclenchement du workflow. |

Au premier passage, le test de stockage illisible injectait un état avant la navigation. Le gestionnaire normal `pagehide` le remplaçait par le dernier brouillon valide. Le test injecte désormais l’état une fois au chargement. La suite dédiée confirme l’absence de POST, le maintien du brouillon et la vérification seule après rechargement.

## Captures, mesures et scores

Les preuves locales sont dans `audit-results/client-v32-lot-06/`. `comparaison.html` réunit les PNG, `comparaison.json` les mesures pixel, `tests-individuels.csv` les résultats et `accessibilite/mesures.json` les mesures détaillées.

- 24 paires protégées de `/`, `/search` et `/vehicle/v3`, aux largeurs 320, 375, 390, 430, 768, 1024, 1280 et 1440. Langue fr-FR, fuseau America/Guadeloupe, DPR 1, horloge au 21 novembre 2026, 16 h UTC. Les 18 scénarios d’interaction passent sur chacun des deux arbres. 18 paires sont pixel-identiques. Les six autres comportent 9 à 272 pixels variables, avec un écart de 1 à 6 niveaux par canal. Les variations sont limitées à la rasterisation autour des champs et à quelques contours. Les répétitions et la géométrie des sélecteurs natifs sont dans `temoins.json`.
- 30 paires de communication. Liste filtrée, fil et notifications présentes aux huit largeurs. Liste et notifications vides, ainsi que reprise d’envoi incertain à 390 et 1440.
- Neuf mesures sur la recherche de conversations, l’envoi et le marquage global. Aucun débordement ni recouvrement, focus visible de 3 CSS px et cibles d’au moins 48 CSS px. Texte à 200 % sur 320 CSS px et zoom natif 200 % à 307 CSS px utiles. Axe 4.10.3 signale zéro violation. Pour son contrôle manuel, le texte saisi `#162728` sur `#ffffff` donne 15,50:1.

| Écran et largeur | Score provisoire |
| --- | --- |
| Messagerie, liste · 320 à 1440 | 95/100 |
| Messagerie, fil · 320 à 1440 | 95/100 |
| Notifications · 320 à 1440 | 95/100 |

Les scores utilisent la grille du kit et accordent une partie des points d’accessibilité à la preuve partielle. Le lecteur d’écran et le clavier virtuel Android/iOS restent à vérifier. Les mesures navigateur concernent Chromium.

## PUB-01, risques et décision

L’essai historique sur le tiroir 880 → 390 reste actif. Sa signature est l’absence de `#search-filters` dans le dialogue « Filtres ». Les huit répétitions sur chaque arbre et les résultats bruts de l’UI GitHub sont détaillés dans les preuves et la PR.

La récupération d’un message dépend de la clé et du brouillon conservés dans l’onglet. Un effacement complet de ce stockage retire le contexte local. La lecture seule reste la voie sûre face à une tentative illisible. Les deux comptes de test et les destinations sont ceux du mock. Les gardes sont appliquées par l’API. Le comportement exact en cas de changement de cookie entre la dernière lecture d’identité et le départ de la requête reste tributaire de cette API et n’a pas de précondition de compte dans le contrat existant.

**En revue humaine.** Le verdict technique détaillé et la CI brute figurent dans la PR. Le lot suivant attend la validation.
