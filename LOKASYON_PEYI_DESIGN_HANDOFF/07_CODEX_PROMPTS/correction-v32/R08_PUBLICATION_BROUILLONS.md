# R08 · Publication, brouillons et états de revue

## Mission

Travaille dans `Djams0/Maquette_LokasyonPeyi`. Livrer publication, brouillons et états de revue selon les zones indiquées ci-dessous. Utiliser la variante interne validée en R01. Les planches renseignent le visuel, le mock fournit les permissions, les données, les actions et les transitions. Les contrats API, l’administration et les pages publiques relèvent du protocole de préservation du dépôt.

## Point de départ Git

Le diagnostic de référence porte sur `8a6974e23aab14acbabcd82f21f2bfcd9c0498ce`. À cette exécution, vérifier la branche par défaut et le SHA courant via `git fetch origin`, `git remote show origin`, `git rev-parse origin/main` et `git status --short`. Vérifier l’ascendance du jalon avec `git merge-base --is-ancestor 8a6974e23aab14acbabcd82f21f2bfcd9c0498ce origin/main`. Vérifier le commit du handoff et les SHA de fusion des lots précédents dans [le suivi](../../09_IMPLEMENTATION/PROGRESS_TRACKER.md) ou via leurs PR. Entrée · [R07](R07_ESPACE_PROPRIETAIRE.md) validé et intégré, avec tous ses prérequis transitifs. Partir du `main` réel propre, créer `correction-v32/r08-publication-brouillons` et consigner le point de départ et l’écart éventuel au jalon.

## Sources à ouvrir

[B-23](../../04_VISUAL_REFERENCES/extension/planches/B-23.jpg), [B-39](../../04_VISUAL_REFERENCES/extension/planches/B-39.jpg), [B-40](../../04_VISUAL_REFERENCES/extension/planches/B-40.jpg), [B-41](../../04_VISUAL_REFERENCES/extension/planches/B-41.jpg)

Ouvrir le [PDF B](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf) et [son index de pages](../../00_SOURCE_OF_TRUTH/INDEX_PDF.md), le [PDF A](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf) pour la direction générale et les [arbitrages de sources](../../00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md). Fiches de ce lot · [OWNER_WIZARD](../../05_SCREEN_SPECS/OWNER_WIZARD.md). Pour les ID et leur preuve initiale, ouvrir [l’audit](../../01_AUDIT/ECARTS_CORRECTION_V32.md). Pour les médias et les styles, lire [mappings et crédits](../../03_ASSETS/ASSET_MAPPING_EXTENSION.md) et le [design system](../../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md).

## Fichiers et scénarios

Examiner depuis la racine · `client/pages/wizard.js`, `client/pages/owner-state.js`, `client/pages/owner-workspace.js`, `client/styles/client.css`. Ouvrir les fiches liées pour les composants et permissions détaillés.

- **WIZ-01 · `/owner/vehicles/new`** — owner depuis le parc et audit-o02 reprenant step=5. Zone · Quatre sections et neuf étapes, vues de photos.
- **WIZ-02 · `/owner/vehicles/new`** — owner step=9 complet puis divergence locale/serveur et résultat inconnu. Zone · Récapitulatif, conflit et envoi.

## Rendu et gestes à préserver

Reprendre l’assistant aux neuf `?step=` et quatre sections. Capturer B-39 sur l’étape 5 avec brouillon sauvé, B-40 sur une revue complète puis sur une reprise après blocage, et B-23 droite sur conflit réel de contenu. Conserver les cinq vues et trois justificatifs fictifs, la confirmation de sauvegarde, les contrôles par groupe et les parcours en attente de revue ou à corriger dans le parc. Utiliser le jeu complet de owner.spec.js pour les données préremplies. À 390, priorité à la validation, à la reprise et au contrôle focalisé, garder le résumé accessible après redimensionnement. Exécuter choix local/serveur, changement de compte, réponse perdue, reprise du même POST et vérification d’une seule annonce pending. B-41 sert au regroupement; la saisie structurée de défaut et une nouvelle révision serveur attendent l’arbitrage existant.

## Validation observable

- **WIZ-01** · Comparer step=5 aux deux largeurs et rejouer liens step=1 à 9 avec saisie et reprise.
- **WIZ-02** · Comparer récap et divergence séparément, vérifier un seul POST effectif et tracer état après envoi.

## Exécuter les vérifications

Utiliser Node 24, Playwright 1.56.1, Chromium 141, Python et une instance jetable. `npm run audit:start` charge audit-v1. Initialiser les données manquantes via le mock et les scénarios des tests, sans toucher aux jeux de travail de l’utilisateur. Le premier travail du lot est de relever **avant modification** les routes et états ci-dessus à **390 × 844** et **1440 × 960**. Garder rôle, état, heure, données de simulation, scroll, DPR, navigateur et taille identiques au rejeu.

```bash
npm run check
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
(cd LOKASYON_PEYI_DESIGN_HANDOFF && python3 tools/verify_v32.py && python3 tools/verify_extension.py)
npx playwright test tests/browser/owner.spec.js tests/browser/maquette.spec.js
```

Sur une instance démarrée, lancer `npm run smoke`. Appliquer la [protection publique](../../08_VALIDATION/PROTECTED_PAGES_TESTS.md) et les [commandes de capture/comparaison](../../tools/README.md) avec deux instances historiques jetables, successivement si elles partagent les ports. Exécuter aussi les essais de rôles et d’interactions concernés. Relever le résultat brut de chaque essai, avec l’impact d’un essai omis. Garder le test PUB-01 et qualifier ses résultats séparément.

## Preuves, PR et passage

Prendre les captures corrigées au SHA de la PR. Pour chacun des ID, fournir la zone de **la planche validée côte à côte avec le rendu corrigé**, l’avant/après du site et le diff Git. Quand B illustre une seule largeur ou un autre modèle, nom, prix ou date, nommer les différences, comparer les zones homologues et préciser les dimensions interprétées. Pour les gestes visibles sans défilement, mesurer les boîtes à scroll nul et vérifier les recouvrements. Joindre les états complémentaires, contrôles clavier et preuves protégées. Rendre les artefacts expurgés accessibles depuis la PR.

Ouvrir une PR `R08 · Publication, brouillons et états de revue` ciblant `main`, avec les trois résultats du [modèle de revue](../../09_IMPLEMENTATION/REVIEW_TEMPLATE.md) pour chaque case de la [matrice](../../08_VALIDATION/CORRECTION_V32.csv). Consigner chaque écart visible, sa preuve, son impact et la décision attendue. Un écart majeur de marque, navigation ou geste garde la ligne ouverte. Si la taille du diff empêche une revue cohérente, proposer des PR de même lot et apporter la preuve complète avant de le déclarer fini. Mettre à jour le suivi et livrer le verdict. Suite · [R09](R09_RECETTE_FINALE.md) après intégration du GO.
