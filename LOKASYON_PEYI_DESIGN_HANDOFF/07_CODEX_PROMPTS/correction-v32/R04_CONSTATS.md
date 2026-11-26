# R04 · Constats de départ, retour et reprise

## Mission

Travaille dans `Djams0/Maquette_LokasyonPeyi`. Livrer constats de départ, retour et reprise selon les zones indiquées ci-dessous. Utiliser la variante interne validée en R01. Les planches renseignent le visuel, le mock fournit les permissions, les données, les actions et les transitions. Les contrats API, l’administration et les pages publiques relèvent du protocole de préservation du dépôt.

## Point de départ Git

Le diagnostic de référence porte sur `8a6974e23aab14acbabcd82f21f2bfcd9c0498ce`. À cette exécution, vérifier la branche par défaut et le SHA courant via `git fetch origin`, `git remote show origin`, `git rev-parse origin/main` et `git status --short`. Vérifier l’ascendance du jalon avec `git merge-base --is-ancestor 8a6974e23aab14acbabcd82f21f2bfcd9c0498ce origin/main`. Vérifier le commit du handoff et les SHA de fusion des lots précédents dans [le suivi](../../09_IMPLEMENTATION/PROGRESS_TRACKER.md) ou via leurs PR. Entrée · [R03](R03_LOCATIONS_SUIVI_PAIEMENT.md) validé et intégré, avec tous ses prérequis transitifs. Partir du `main` réel propre, créer `correction-v32/r04-constats` et consigner le point de départ et l’écart éventuel au jalon.

## Sources à ouvrir

[B-21](../../04_VISUAL_REFERENCES/extension/planches/B-21.jpg), [B-22](../../04_VISUAL_REFERENCES/extension/planches/B-22.jpg), [B-23](../../04_VISUAL_REFERENCES/extension/planches/B-23.jpg)

Ouvrir le [PDF B](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf) et [son index de pages](../../00_SOURCE_OF_TRUTH/INDEX_PDF.md), le [PDF A](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf) pour la direction générale et les [arbitrages de sources](../../00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md). Fiches de ce lot · [INSPECTION](../../05_SCREEN_SPECS/INSPECTION.md) · [Suivi de location](../../05_SCREEN_SPECS/RENTAL_DETAIL.md). Pour les ID et leur preuve initiale, ouvrir [l’audit](../../01_AUDIT/ECARTS_CORRECTION_V32.md). Pour les médias et les styles, lire [mappings et crédits](../../03_ASSETS/ASSET_MAPPING_EXTENSION.md) et le [design system](../../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md).

## Fichiers et scénarios

Examiner depuis la racine · `client/pages/inspection.js`, `client/pages/booking-state.js`, `client/styles/client.css`, `ui/components.js`. Ouvrir les fiches liées pour les composants et permissions détaillés.

- **CON-01 · `/inspection/:id/:phase`** — audit-LP-006 départ 5/8 avec caution validée et audit-LP-004 retour 8/8 finalisé. Zone · Progression, vues, prochaine capture et observations.
- **CON-02 · `/inspection/:id/:phase`** — renter en in_progress sur retour éditable, ouvrir la vue puis reproduire refus. Zone · Caméra simulée et refus de capture.

## Rendu et gestes à préserver

Distinguer B-21 bureau (retour finalisé) et mobile (départ en cours). Préparer départ éditable à cinq vues sur audit-LP-006 après caution simulée et retour en lecture seule à huit vues sur audit-LP-004. Refaire chaque état aux deux largeurs. Pour B-22, comparer la région de la prochaine vue sur un retour éditable (audit-LP-005 en cours) avec la progression correspondante, et compléter les premières vues via le mock si nécessaire. Pour B-23 gauche, capturer une caméra fictive refusée et la même vue après reprise. Maintenir tabulation, annulation, annonce, bouton de récupération et raisons de verrouillage. Tester photo remplacée, borne, validation partielle, km retour trop bas et double confirmation. Utiliser les vues locales synthétiques prévues par le mock.

## Validation observable

- **CON-01** · Capturer 5/8 départ et retour finalisé sur les deux largeurs. Relier B-22 zone « prochaine vue » à un retour éditable si testé.
- **CON-02** · Capturer erreur et reprise séparément, puis tester Échap, focus et refus sans perte des vues confirmées.

## Exécuter les vérifications

Utiliser Node 24, Playwright 1.56.1, Chromium 141, Python et une instance jetable. `npm run audit:start` charge audit-v1. Initialiser les données manquantes via le mock et les scénarios des tests, sans toucher aux jeux de travail de l’utilisateur. Le premier travail du lot est de relever **avant modification** les routes et états ci-dessus à **390 × 844** et **1440 × 960**. Garder rôle, état, heure, données de simulation, scroll, DPR, navigateur et taille identiques au rejeu.

```bash
npm run check
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
(cd LOKASYON_PEYI_DESIGN_HANDOFF && python3 tools/verify_v32.py && python3 tools/verify_extension.py)
npx playwright test tests/browser/booking.spec.js tests/browser/maquette.spec.js
```

Sur une instance démarrée, lancer `npm run smoke`. Appliquer la [protection publique](../../08_VALIDATION/PROTECTED_PAGES_TESTS.md) et les [commandes de capture/comparaison](../../tools/README.md) avec deux instances historiques jetables, successivement si elles partagent les ports. Exécuter aussi les essais de rôles et d’interactions concernés. Relever le résultat brut de chaque essai, avec l’impact d’un essai omis. Garder le test PUB-01 et qualifier ses résultats séparément.

## Preuves, PR et passage

Prendre les captures corrigées au SHA de la PR. Pour chacun des ID, fournir la zone de **la planche validée côte à côte avec le rendu corrigé**, l’avant/après du site et le diff Git. Quand B illustre une seule largeur ou un autre modèle, nom, prix ou date, nommer les différences, comparer les zones homologues et préciser les dimensions interprétées. Pour les gestes visibles sans défilement, mesurer les boîtes à scroll nul et vérifier les recouvrements. Joindre les états complémentaires, contrôles clavier et preuves protégées. Rendre les artefacts expurgés accessibles depuis la PR.

Ouvrir une PR `R04 · Constats de départ, retour et reprise` ciblant `main`, avec les trois résultats du [modèle de revue](../../09_IMPLEMENTATION/REVIEW_TEMPLATE.md) pour chaque case de la [matrice](../../08_VALIDATION/CORRECTION_V32.csv). Consigner chaque écart visible, sa preuve, son impact et la décision attendue. Un écart majeur de marque, navigation ou geste garde la ligne ouverte. Si la taille du diff empêche une revue cohérente, proposer des PR de même lot et apporter la preuve complète avant de le déclarer fini. Mettre à jour le suivi et livrer le verdict. Suite · [R05](R05_MESSAGERIE_NOTIFICATIONS.md) après intégration du GO.
