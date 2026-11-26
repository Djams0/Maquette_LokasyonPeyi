# R03 · Locations, demande, suivi et paiement

## Mission

Travaille dans `Djams0/Maquette_LokasyonPeyi`. Livrer locations, demande, suivi et paiement selon les zones indiquées ci-dessous. Utiliser la variante interne validée en R01. Les planches renseignent le visuel, le mock fournit les permissions, les données, les actions et les transitions. Les contrats API, l’administration et les pages publiques relèvent du protocole de préservation du dépôt.

## Point de départ Git

Le diagnostic de référence porte sur `8a6974e23aab14acbabcd82f21f2bfcd9c0498ce`. À cette exécution, vérifier la branche par défaut et le SHA courant via `git fetch origin`, `git remote show origin`, `git rev-parse origin/main` et `git status --short`. Vérifier l’ascendance du jalon avec `git merge-base --is-ancestor 8a6974e23aab14acbabcd82f21f2bfcd9c0498ce origin/main`. Vérifier le commit du handoff et les SHA de fusion des lots précédents dans [le suivi](../../09_IMPLEMENTATION/PROGRESS_TRACKER.md) ou via leurs PR. Entrée · [R02](R02_COMPTE.md) validé et intégré, avec tous ses prérequis transitifs. Partir du `main` réel propre, créer `correction-v32/r03-locations-suivi-paiement` et consigner le point de départ et l’écart éventuel au jalon.

## Sources à ouvrir

[B-16](../../04_VISUAL_REFERENCES/extension/planches/B-16.jpg), [B-17](../../04_VISUAL_REFERENCES/extension/planches/B-17.jpg), [B-18](../../04_VISUAL_REFERENCES/extension/planches/B-18.jpg), [B-19](../../04_VISUAL_REFERENCES/extension/planches/B-19.jpg), [B-20](../../04_VISUAL_REFERENCES/extension/planches/B-20.jpg), [B-27](../../04_VISUAL_REFERENCES/extension/planches/B-27.jpg)

Ouvrir le [PDF B](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf) et [son index de pages](../../00_SOURCE_OF_TRUTH/INDEX_PDF.md), le [PDF A](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf) pour la direction générale et les [arbitrages de sources](../../00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md). Fiches de ce lot · [PAYMENT](../../05_SCREEN_SPECS/PAYMENT.md) · [RENTALS](../../05_SCREEN_SPECS/RENTALS.md) · [RENTAL_DETAIL](../../05_SCREEN_SPECS/RENTAL_DETAIL.md). Pour les ID et leur preuve initiale, ouvrir [l’audit](../../01_AUDIT/ECARTS_CORRECTION_V32.md). Pour les médias et les styles, lire [mappings et crédits](../../03_ASSETS/ASSET_MAPPING_EXTENSION.md) et le [design system](../../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md).

## Fichiers et scénarios

Examiner depuis la racine · `client/pages/rentals.js`, `client/pages/booking-state.js`, `client/pages/search-state.js`, `client/styles/client.css`. Ouvrir les fiches liées pour les composants et permissions détaillés.

- **LOC-01 · `/rentals`** — audit-r02 en upcoming avec requested, confirmed et awaiting_payment, newcomer en vide. Zone · Onglets et ordre des cartes, première action.
- **LOC-02 · `/request/:id`** — renter, v1, 10–14 juin 2027 09 h Guadeloupe, brouillon issu de la fiche. Zone · Carte trajet, dates, estimation et formulaire.
- **LOC-03 · `/rental/:id`** — audit-LP-006 confirmé côté locataire avant caution, audit-LP-004 retour déclaré côté propriétaire. Zone · Carte d’action, étapes et panneau de contexte.
- **LOC-04 · `/payment/:id`** — audit-r02 avec audit-LP-007 accepté puis paiement simulé refusé. Zone · Contexte, avis, sélection du résultat, estimation.

## Rendu et gestes à préserver

Construire /rentals?tab=upcoming avec audit-r02, qui reçoit audit-LP-006 (confirmée), 007 (à payer), 009 (en attente de décision). En prenant cette liste, le paiement doit prendre la première place quelles que soient les dates ou l’ordre API. Dériver la priorité de l’action réellement disponible et du rôle côté présentation. Documenter l’ordre choisi pour les autres actions et les égalités, conserver une règle stable et tester une permutation de la réponse. Mesurer les boîtes du paiement et de la barre basse à 390 × 844 sans défilement. En demande v1, prendre les dates B-17 au calendrier de la fixture et garder le geste près du récapitulatif. Dans B-18, comparer « confirmée, contrôle caution » côté locataire et « retour déclaré, récupération » côté propriétaire séparément, à chaque largeur. Conserver la progression existante et classer étapes réalisées, courante et à venir selon B-19 et le mock. En B-20, capturer accepté puis refus simulé et vérifier récupération. Capturer également l’onglet vide B-27. Rejouer double clic, refus, confirmation, garde tiers, dates et poste de paiement. La simulation et la caution restent distinctes.

## Validation observable

- **LOC-01** · Payment en tête devant une demande en attente et la réservation confirmée du scénario B-16. CTA entièrement visible à 390 × 844, après fonts/images, sans défilement.
- **LOC-02** · Comparer premier écran plus défilement utile si nécessaire. Vérifier un seul enregistrement malgré double clic ou résultat perdu.
- **LOC-03** · Comparer confirmé et retour déclaré aux deux largeurs sans mélanger leurs CTA. Étapes terminées, courante et attente visibles.
- **LOC-04** · Comparatif B-20 accepté et refusé. Échec laisse awaiting_payment puis succès fait avancer une seule fois.

## Exécuter les vérifications

Utiliser Node 24, Playwright 1.56.1, Chromium 141, Python et une instance jetable. `npm run audit:start` charge audit-v1. Initialiser les données manquantes via le mock et les scénarios des tests, sans toucher aux jeux de travail de l’utilisateur. Le premier travail du lot est de relever **avant modification** les routes et états ci-dessus à **390 × 844** et **1440 × 960**. Garder rôle, état, heure, données de simulation, scroll, DPR, navigateur et taille identiques au rejeu.

```bash
npm run check
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
(cd LOKASYON_PEYI_DESIGN_HANDOFF && python3 tools/verify_v32.py && python3 tools/verify_extension.py)
npx playwright test tests/browser/booking.spec.js tests/browser/maquette.spec.js tests/browser/visual-qa.spec.js
```

Sur une instance démarrée, lancer `npm run smoke`. Appliquer la [protection publique](../../08_VALIDATION/PROTECTED_PAGES_TESTS.md) et les [commandes de capture/comparaison](../../tools/README.md) avec deux instances historiques jetables, successivement si elles partagent les ports. Exécuter aussi les essais de rôles et d’interactions concernés. Relever le résultat brut de chaque essai, avec l’impact d’un essai omis. Garder le test PUB-01 et qualifier ses résultats séparément.

## Preuves, PR et passage

Prendre les captures corrigées au SHA de la PR. Pour chacun des ID, fournir la zone de **la planche validée côte à côte avec le rendu corrigé**, l’avant/après du site et le diff Git. Quand B illustre une seule largeur ou un autre modèle, nom, prix ou date, nommer les différences, comparer les zones homologues et préciser les dimensions interprétées. Pour les gestes visibles sans défilement, mesurer les boîtes à scroll nul et vérifier les recouvrements. Joindre les états complémentaires, contrôles clavier et preuves protégées. Rendre les artefacts expurgés accessibles depuis la PR.

Ouvrir une PR `R03 · Locations, demande, suivi et paiement` ciblant `main`, avec les trois résultats du [modèle de revue](../../09_IMPLEMENTATION/REVIEW_TEMPLATE.md) pour chaque case de la [matrice](../../08_VALIDATION/CORRECTION_V32.csv). Consigner chaque écart visible, sa preuve, son impact et la décision attendue. Un écart majeur de marque, navigation ou geste garde la ligne ouverte. Si la taille du diff empêche une revue cohérente, proposer des PR de même lot et apporter la preuve complète avant de le déclarer fini. Mettre à jour le suivi et livrer le verdict. Suite · [R04](R04_CONSTATS.md) après intégration du GO.
