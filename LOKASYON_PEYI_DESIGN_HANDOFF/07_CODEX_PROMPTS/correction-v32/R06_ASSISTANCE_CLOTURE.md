# R06 · Assistance, dossiers, avis et reçu

## Mission

Travaille dans `Djams0/Maquette_LokasyonPeyi`. Livrer assistance, dossiers, avis et reçu selon les zones indiquées ci-dessous. Utiliser la variante interne validée en R01. Les planches renseignent le visuel, le mock fournit les permissions, les données, les actions et les transitions. Les contrats API, l’administration et les pages publiques relèvent du protocole de préservation du dépôt.

## Point de départ Git

Le diagnostic de référence porte sur `8a6974e23aab14acbabcd82f21f2bfcd9c0498ce`. À cette exécution, vérifier la branche par défaut et le SHA courant via `git fetch origin`, `git remote show origin`, `git rev-parse origin/main` et `git status --short`. Vérifier l’ascendance du jalon avec `git merge-base --is-ancestor 8a6974e23aab14acbabcd82f21f2bfcd9c0498ce origin/main`. Vérifier le commit du handoff et les SHA de fusion des lots précédents dans [le suivi](../../09_IMPLEMENTATION/PROGRESS_TRACKER.md) ou via leurs PR. Entrée · [R05](R05_MESSAGERIE_NOTIFICATIONS.md) validé et intégré, avec tous ses prérequis transitifs. Partir du `main` réel propre, créer `correction-v32/r06-assistance-cloture` et consigner le point de départ et l’écart éventuel au jalon.

## Sources à ouvrir

[B-27](../../04_VISUAL_REFERENCES/extension/planches/B-27.jpg), [B-28](../../04_VISUAL_REFERENCES/extension/planches/B-28.jpg), [B-29](../../04_VISUAL_REFERENCES/extension/planches/B-29.jpg), [B-30](../../04_VISUAL_REFERENCES/extension/planches/B-30.jpg), [B-31](../../04_VISUAL_REFERENCES/extension/planches/B-31.jpg), [B-44](../../04_VISUAL_REFERENCES/extension/planches/B-44.jpg)

Ouvrir le [PDF B](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf) et [son index de pages](../../00_SOURCE_OF_TRUTH/INDEX_PDF.md), le [PDF A](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf) pour la direction générale et les [arbitrages de sources](../../00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md). Fiches de ce lot · [SUPPORT](../../05_SCREEN_SPECS/SUPPORT.md). Pour les ID et leur preuve initiale, ouvrir [l’audit](../../01_AUDIT/ECARTS_CORRECTION_V32.md). Pour les médias et les styles, lire [mappings et crédits](../../03_ASSETS/ASSET_MAPPING_EXTENSION.md) et le [design system](../../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md).

## Fichiers et scénarios

Examiner depuis la racine · `client/pages/support.js`, `client/pages/account.js`, `client/styles/client.css`. Ouvrir les fiches liées pour les composants et permissions détaillés.

- **SUP-01 · `/faq`** — Visiteur avec question caution puis terme sans résultat, locataire pour sortie assistance. Zone · Champ recherche, accordéons et aide visiteur puis connecté.
- **SUP-02 · `/assistance`** — renter connecté, location optionnelle, visiteur avec redirection next. Zone · Formulaire de motif et contexte clientèle.
- **SUP-03 · `/cases/new`** — Renter depuis Mes dossiers puis suivi d’une location. Zone · Formulaire et action ouvrir un dossier.
- **SUP-04 · `/cases`** — renter avec case-demo puis compte sans dossier. Zone · Carte dossier et CTA ouvrir.
- **SUP-05 · `/cases/:id`** — case-demo avec renter, participant puis audit-r02 tiers. Zone · Statut, échanges et aide rapide.
- **SUP-06 · `/profile/reviews`** — renter sur avis seed puis cas sans avis. Zone · Mes avis, statut de modération.
- **SUP-07 · `/review/:id`** — Location completed sans avis côté locataire, puis après soumission. Zone · Deux notes, commentaire et validation.
- **SUP-08 · `/receipt/:id`** — audit-LP-002 completed côté participant. Zone · En-tête fictif, détails et impression.

## Rendu et gestes à préserver

Comparer B-28 gauche avec un dossier doté d’un échange et B-28 droite avec le formulaire, puis B-29 FAQ avec filtre, accordéon et sortie adaptée. Vérifier les deux points d’entrée du formulaire, Mes dossiers et le cas où une location est pré-sélectionnée. Dans le détail, priorité au statut et au prochain geste, rail d’aide seulement sur grand écran. Préparer un dossier tiers et des notes internes invisibles. Pour B-31, audit-LP-002 simule un reçu et un avis déjà envoyé. Pour le formulaire d’avis nominal, faire clôturer audit-LP-003 côté audit-o02 puis ouvrir l’avis côté audit-r02. Capturer formulaire, confirmation et état Mes avis, avec les deux notes, la modération puis la tentative en double. Exporter un PDF d’impression synthétique en Chromium ou vérifier la vue d’impression, et tracer l’essai d’impression physique. Préserver droits, copie de preuve et montant mock. Isoler les changements FAQ des helpers homeFaqItems et renderFaqItems consommés par l’accueil.

## Validation observable

- **SUP-01** · Comparer ordre B-29 et états résultat/vide. Vérifier Tab et destination de contact.
- **SUP-02** · Comparer formulaire à 390 et vérifier la même saisie à 1440. Soumettre une fois et retrouver le dossier.
- **SUP-03** · Mêmes critères SUP-02, essai entrée avec location et 403 tiers.
- **SUP-04** · Capturer liste et vide par largeur. Aucun dossier tiers rendu.
- **SUP-05** · Capture état équivalent avec échange, 403 sans données, une écriture confirmée.
- **SUP-06** · Capture, écran vide et projection des seuls avis applicables.
- **SUP-07** · Capturer le formulaire éligible et la confirmation. Aucun doublon ni notation propriétaire imitée.
- **SUP-08** · Capture des détails et PDF d’impression simulée. Tester 403, résultat imprimable sans chrome.

## Exécuter les vérifications

Utiliser Node 24, Playwright 1.56.1, Chromium 141, Python et une instance jetable. `npm run audit:start` charge audit-v1. Initialiser les données manquantes via le mock et les scénarios des tests, sans toucher aux jeux de travail de l’utilisateur. Le premier travail du lot est de relever **avant modification** les routes et états ci-dessus à **390 × 844** et **1440 × 960**. Garder rôle, état, heure, données de simulation, scroll, DPR, navigateur et taille identiques au rejeu.

```bash
npm run check
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
(cd LOKASYON_PEYI_DESIGN_HANDOFF && python3 tools/verify_v32.py && python3 tools/verify_extension.py)
npx playwright test tests/browser/support.spec.js tests/browser/account.spec.js tests/browser/booking.spec.js
```

Sur une instance démarrée, lancer `npm run smoke`. Appliquer la [protection publique](../../08_VALIDATION/PROTECTED_PAGES_TESTS.md) et les [commandes de capture/comparaison](../../tools/README.md) avec deux instances historiques jetables, successivement si elles partagent les ports. Exécuter aussi les essais de rôles et d’interactions concernés. Relever le résultat brut de chaque essai, avec l’impact d’un essai omis. Garder le test PUB-01 et qualifier ses résultats séparément.

## Preuves, PR et passage

Prendre les captures corrigées au SHA de la PR. Pour chacun des ID, fournir la zone de **la planche validée côte à côte avec le rendu corrigé**, l’avant/après du site et le diff Git. Quand B illustre une seule largeur ou un autre modèle, nom, prix ou date, nommer les différences, comparer les zones homologues et préciser les dimensions interprétées. Pour les gestes visibles sans défilement, mesurer les boîtes à scroll nul et vérifier les recouvrements. Joindre les états complémentaires, contrôles clavier et preuves protégées. Rendre les artefacts expurgés accessibles depuis la PR.

Ouvrir une PR `R06 · Assistance, dossiers, avis et reçu` ciblant `main`, avec les trois résultats du [modèle de revue](../../09_IMPLEMENTATION/REVIEW_TEMPLATE.md) pour chaque case de la [matrice](../../08_VALIDATION/CORRECTION_V32.csv). Consigner chaque écart visible, sa preuve, son impact et la décision attendue. Un écart majeur de marque, navigation ou geste garde la ligne ouverte. Si la taille du diff empêche une revue cohérente, proposer des PR de même lot et apporter la preuve complète avant de le déclarer fini. Mettre à jour le suivi et livrer le verdict. Suite · [R07](R07_ESPACE_PROPRIETAIRE.md) après intégration du GO.
