# Lot 00 · Baseline et protection des espaces client V3.2

Revue du 21 novembre 2026. Baseline de préservation des routes `/`, `/search` et `/vehicle/v3`, des parcours associés et des profils de la maquette. La branche livre le présent relevé de recette.

## Révisions Git

| Référence | Révision |
| --- | --- |
| `origin/main` après `git fetch origin` | `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` |
| Base de `client-v32/lot-00` et référence visuelle du kit | `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` |
| HEAD du checkout utilisateur au départ | `60ba85eb927901f20b334121f8af546084e7d364` |
| SHA final et PR | HEAD de la branche de revue et identifiant de la PR communiqués avec la livraison. |

Le checkout utilisateur était sur `v32/lot-09`, avec le kit d’extension présent sous forme de modifications locales. Le test d’ascendance du SHA audité y renvoie `1`. `60ba85e` est le parent intégré par la PR #22. Les deux révisions ont le même arbre `837d3e133a5d1e7ebebfbded098bd20a96af33b5` et le diff est vide. Dans le clone de revue, `git merge-base --is-ancestor 4338f5f7ca252f4d4f02021ec47a226d0d2d6064 HEAD` renvoie `0`.

Aucun commit d’installation de **l’extension** n’a été trouvé dans les références disponibles. La première direction V3.2 est déjà versionnée. La recette a repris la copie locale de l’extension, vérifiée sur le checkout LF. Le manifeste du handoff a pour SHA-256 `7abe00c72b7ecb3a06ffac14b0bc788ac694fa97d072cb02005fbf41d642d076` et celui des captures `1991bb00a0e9a2950bf15763136ad6867f41deeed6e4ae98529ed224e61a783c`. Le checkout de travail a conservé sa branche et ses modifications.

## Périmètre, fichiers et décisions

Le diff du lot porte sur `docs/audit/LOT_00_BASELINE_EXTENSION.md`. Contrôles externes à l’application dans `audit-results/client-v32-lot-00/`. Les deux validateurs ont été exécutés depuis le dossier du handoff. Dans le checkout initial, `core.autocrlf=true` produisait des empreintes différentes sur `ui/components.js` et `assets/illustrations/catalogue-vide.svg` (`i/lf`, `w/crlf`). Dans les clones de recette `core.autocrlf=false`, les empreintes attendues correspondent aux octets extraits de Git.

Le routage `client/app.js`, le shell et les destinations par rôle, la cascade `client/styles/client.css` et les primitives de `ui/{base.css,tokens.css,components.js}` ont été relus avec les spécifications du kit. Le lot relève de la classe **A**. La découverte suit son rendu réel. Les PDF renseignent la direction visuelle de l’extension. Le mock sous `/api/v1` donne les rôles, données, statuts, prix et périodes. Pour les routes privées, la session et les gardes d’acteur restent décisives. Aucun arbitrage B ou C n’a été pris.

| Planche | État observé et cible |
| --- | --- |
| B-13 · Connexion | Écran « Heureux de vous revoir », choix du compte de démonstration et reprise du `next` avec modèle et critères. Les personnes et le cadrage de la planche sont illustratifs. |
| B-16 · Locations | « À venir » est vide sur le seed historique. La fixture d’audit et les parcours existants démontrent demande, acceptation et paiement simulé sur d’autres données. |
| B-21 · Constats | Les scénarios de recette montrent les huit vues fictives, les champs kilométrage/charge et le verrou après finalisation. La planche montre deux phases et deux niveaux de progression différents. |
| B-33 · Propriétaire | « Aujourd’hui » et le parc reflètent les annonces de l’acteur. Les demandes et brouillons illustrés supposent un état métier spécifique. |
| B-43 · Responsive | Les huit largeurs ont été mesurées. Les seuils des pages protégées restent ceux du code audité. |

## Commandes et résultats

Windows x64, Node **24.22.2**, Python **3.13.5**, Playwright **1.56.1**, Chromium **141.0.7390.37**. `npm.cmd` et `npx.cmd` permettent de lancer les commandes sous PowerShell avec la politique de scripts locale.

| Contrôle | Résultat local | Mode CI historique |
| --- | --- | --- |
| `npm run check` | 78 modules vérifiés, 108 scénarios documentés, dont 31 associés à une assertion. | Obligatoire, succès |
| `npm test` | 50/50 | Obligatoire, succès |
| `python -m unittest discover -s tests -p "test_*.py"` | 2/2 | Obligatoire, succès |
| `npm run smoke` | Santé Client 8080, Admin 8081 et API 3001, routes, assets et source API commune. | Obligatoire, succès |
| `python tools/verify_v32.py` | 343 fichiers, 388 liens, 16 photos, 32 fichiers photo, 10 prompts. | Informatif, succès |
| `python tools/verify_extension.py` | 33 routes, 12 prompts, 24 PNG protégés, 37 ressources runtime et 2 PDF. | Contrôle local |
| `npx playwright test` | 174/174 avec services jetables maintenus, code 0. | Souple, 173/174, `UI_RESULT=failure` |
| `npx playwright test --config=playwright.audit.config.js` | 11/11, dont quatre profils essentiels et sept largeurs d’atelier. | Souple, 4/4 essentiels, audit étendu ignoré |
| `docker compose config --quiet` | Compose v2.35.1, validation statique passée. Accès local au moteur refusé. | Compose, montée des services et nettoyage réussis |
| Essai ciblé `search.spec.js --grep 'tiroir unique' --repeat-each=8` | 7/8, PUB-01 reproduit. | Contrôle local |
| Expurgation des preuves | `scripts/sanitize-evidence.py` sur les sorties de recette avant partage. | Informatif, succès |

Le job historique a conclu `success`, avec un échec UI masqué par `continue-on-error`. Ses logs précisent le statut brut. `workflow_dispatch` avec `strict_ui` rend l’UI et les profils essentiels bloquants. L’audit étendu suppose `extended`. La CI historique n’exécutait que le validateur V3.2 initial. [Job historique](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/44790599088/job/136476908672)

Le relevé `tests-individuels.csv` contient le statut et la durée de chaque cas des suites standard et profils, ainsi que les huit répétitions ciblées. Les rapports détaillés expurgés et le journal de la campagne retenue figurent avec la galerie locale.

### Jeux jetables et incidents de recette

Le seed historique vierge sert aux comparaisons visuelles et à `maquette.spec.js`. La comparaison visuelle recharge les mêmes octets à partir de `disposable/seed.json`, généré par `api/seed.mjs`, SHA-256 `c600afb5f2f33177bc33acdd114e490856415729cd01b43a4e069c1ae36f4c85`. Les API en mémoire des suites isolées et des profils utilisent leur initialiseur existant, dont `audit-v1`. Les proxies sont sur loopback. Les données comportent uniquement des personas et transactions simulées. Les captures publiques historiques du kit sont côté visiteur, avec cinq annonces, sans période ou filtre imposé.

La première exécution de la suite complète a donné 168/174. Six cas `maquette.spec.js` ont reçu `ERR_CONNECTION_REFUSED` sur `/login`. À 375 px, le refus concernait Admin sur 8081. À 390, 430, 768, 1024 et 1440 px, le Client sur 8080. Ces cas dépendaient des services fixes, qui avaient été lancés pour la capture puis arrêtés pendant la suite. Les six cas passent dans la relance. La campagne retenue utilise son propre jeu `standard-suite.json` et démarre les trois services avant le smoke. Elle les maintient jusqu’à la fin des deux suites. Les journaux conservent les deux exécutions. Les scènes client du kit ont été reprises sur des ports éphémères et un seed vierge pour écarter les états mutés du premier passage.

## Captures et mesures

Protocole du kit. DPR 1, `fr-FR`, `America/Guadeloupe`, mouvement réduit, thème clair et horloge navigateur fixée à `2026-11-21T16:00:00Z`. Premier écran visiteur sur les trois routes aux 8 largeurs, scènes client à 390 et 1440, preuves connectées locataire/propriétaire et filtre/galerie à 390 et 1440. Les paires de contrôle enrichies fixent le même seed, attendent les polices et le décodage des images visibles, et imposent deux captures successives stables.

Part de pixels RGB identiques entre les paires Windows. Le score de préservation mesure l’identité pixel. Il est exprimé sur 100.

| Largeur CSS | Accueil | Catalogue | Fiche v3 |
| ---: | ---: | ---: | ---: |
| 320 | 100,0000 | 100,0000 | 100,0000 |
| 375 | 99,9972 | 100,0000 | 100,0000 |
| 390 | 100,0000 | 100,0000 | 100,0000 |
| 430 | 99,9973 | 99,9973 | 100,0000 |
| 768 | 99,9995 | 99,9883 | 99,9944 |
| 1024 | 100,0000 | 99,9716 | 100,0000 |
| 1280 | 100,0000 | 100,0000 | 100,0000 |
| 1440 | 99,9998 | 99,9826 | 100,0000 |

Sur les 24 paires protégées, 15 sont pixel-identiques. Les neuf autres diffèrent sur 3 à 262 pixels par image et l’écart par canal est au plus de 6 sur 255. Les mesures DOM de la collecte du kit sont identiques, avec zéro débordement et zéro exception JS. Les témoins répétés sur le même SHA reproduisent ces variations de rasterisation sur certains catalogues. Une variation du texte peint des sélecteurs natifs dans le premier tirage du catalogue locataire à 1440 disparaît après stabilisation. Aucune modification géométrique, éditoriale ou de média imputable au lot n’a été identifiée.

La campagne enrichie contient 42 paires, dont les 24 protégées, six pages complètes, dix captures d’états et deux scènes de filtres/locataire. Le relevé complémentaire contient 18/18 contrôles réussis pour chaque checkout et les captures de navigation, de galerie et de focus. Les 46 scènes client sur seed vierge retrouvent les mêmes titres et sous-titres que le manifeste du kit, avec zéro débordement et zéro exception JS. La galerie locale `comparaison.html`, les mesures `comparaison.json` et `scenes-client.csv` se trouvent dans `audit-results/client-v32-lot-00/`.

Les PNG historiques présentent des écarts de rasterisation avec Windows. Le cas le plus visible est le catalogue à 320, où « Carte » occupe deux lignes dans le PNG du kit et une sur les deux récaptures Windows. Le décalage vertical qui en découle fait varier environ 34 % des pixels. Le contrôle de protection se lit sur les paires Windows et les mesures DOM. Les JPEG des 46 scènes actuelles et les planches B étant des supports de référence, leurs données ou leur échelle diffèrent suivant la scène. La grille UX /100 du kit s’applique aux futurs écrans implémentés. PUB-02 conserve les minimums historiques de 76,5/100 sur le trio catalogue/tiroir à 390 et de 71,5/100 sur le catalogue dérivé à 320.

## Parcours, droits, erreurs et reprise

| Matrice | Preuve exercée par les suites |
| --- | --- |
| F01 et F12 | Identité tardive et retour navigateur, `next` et critères conservés, données de l’ancien compte masquées. Recherche, tri, filtres, carte et retour fiche. |
| F02, F09 et F13 | Locataire incomplet, pièces synthétiques, dossiers/notifications, confidentialité des notes internes, profils et cookies Client/Admin distincts. |
| F03 à F07 | Demande unique après perte de réponse, retenue du brouillon, refus/retrait par le bon acteur, paiement et caution distincts, huit vues des constats, remise, retour, clôture et avis. |
| F08 | Messagerie réservée aux participants, réponse perdue avant ou après écriture, même clé et aucun doublon. |
| F10 et F11 | Parc et annonces de l’acteur, calendrier/blocages, neuf groupes, divergence du brouillon, soumission et contrôles de version. |
| F14 | Focus natif, dialogues, bascule de présentation, cibles et reflow au clavier. |

Les assertions additionnelles de recette couvrent les destinations par rôle, le focus de fermeture, la galerie v3 et l’URL canonique après filtre, tri, retour et historique navigateur à 390 et 1440. Les états de catalogue contrôlent séparément `aria-busy`, le statut de chargement, le message d’indisponibilité, la reprise et le vide. La connexion conserve le `next` vers la fiche et ses critères. Les preuves techniques comprennent `interactions.mjs`, `captures-stables.mjs`, `zoom-native.mjs` et leurs relevés JSON. Ces pilotes n’ajoutent aucune mutation métier au lot.

### Accessibilité

À 320, les commandes échantillonnées font au moins 44 × 44 px, portent un nom utilisable et passent le test de recouvrement au centre. Le clavier physique atteint la recherche, le budget, le `datetime-local` et le sélecteur de persona. Le tiroir et la galerie rendent le focus au déclencheur à leur fermeture nominale. Les statuts de chargement et d’erreur sont mesurés dans le DOM. Sur les surfaces opaques échantillonnées, le contraste texte/fond va de 7,14:1 à 14,77:1.

Zoom natif Chromium à 100 % puis 200 % (614 puis 307 px CSS mesurés, DPR 1 puis 2). Les quatre écrans testés, accueil, catalogue, fiche et connexion, restent sans débordement global. La commande de navigation reçoit un focus visible et reste cliquable dans chaque état. Axe 4.10.3 ne signale aucune violation sur ces huit observations. Le contraste sur certains fonds et la résolution de références ARIA dynamiques restent à vérifier manuellement. Le clavier virtuel, le lecteur d’écran et les appareils physiques restent hors de la preuve.

Le doublement de la taille de texte racine à 320 px laisse les trois pages protégées sans débordement et révèle un débordement de 171 px sur `/login`, dans la référence et la revue. Cet écart de baseline affecte la lecture sur une vue étroite à texte agrandi. Le zoom navigateur et le réglage de la taille du texte sont mesurés séparément.

## PUB-01, limites et restauration

PUB-01 est un **P1 historique** du catalogue. En `390 → 880 → 390`, le budget est modifié à `40` et confirmé à 880 avec focus. Au retour à 390, le test attend un formulaire unique dans le dialogue et en trouve zéro lors de l’échec reproduit. Le focus du champ et la valeur à 390 se trouvent après cette assertion, et ne sont donc établis que dans les répétitions réussies. Le parcours de fermeture nominal reste couvert. La PR #22 décrivait la saisie encore présente à la réouverture. Sur la campagne historique locale, 4/8 répétitions échouaient. Ici, 1/8 a échoué, sur la même assertion, avec le même Chromium mais un hôte Windows. Les preuves expurgées de l’échec sont sous `pub-01-artifacts/`. Ces petits échantillons ne permettent pas de conclure à un changement de fréquence. [PR #22](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/22)

Le plan de retour se limite au retrait du commit documentaire de revue. Les services et les jeux jetables sont dédiés à la recette. La divergence de plate-forme des PNG, l’accessibilité manuelle restante et l’absence de SHA d’installation bornent la portée de cette preuve.

## Verdict

**Prêt pour revue humaine, GO final en attente.** La campagne retenue ne présente aucun échec inexpliqué ni aucune régression de protection identifiée. PUB-01 reste une réserve historique. La revue doit reconnaître cette réserve, l’écart de texte agrandi sur la connexion et la provenance locale du kit d’extension. Le démarrage du lot 01 attend cette validation.
