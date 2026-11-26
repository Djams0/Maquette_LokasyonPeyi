# R02 · Connexion, profil et documents

## Mission

Travaille dans `Djams0/Maquette_LokasyonPeyi`. Livrer connexion, profil et documents selon les zones indiquées ci-dessous. Utiliser la variante interne validée en R01. Les planches renseignent le visuel, le mock fournit les permissions, les données, les actions et les transitions. Les contrats API, l’administration et les pages publiques relèvent du protocole de préservation du dépôt.

## Point de départ Git

Le diagnostic de référence porte sur `8a6974e23aab14acbabcd82f21f2bfcd9c0498ce`. À cette exécution, vérifier la branche par défaut et le SHA courant via `git fetch origin`, `git remote show origin`, `git rev-parse origin/main` et `git status --short`. Vérifier l’ascendance du jalon avec `git merge-base --is-ancestor 8a6974e23aab14acbabcd82f21f2bfcd9c0498ce origin/main`. Vérifier le commit du handoff et les SHA de fusion des lots précédents dans [le suivi](../../09_IMPLEMENTATION/PROGRESS_TRACKER.md) ou via leurs PR. Entrée · [R01](R01_HEADER_NAVIGATION.md) validé et intégré, avec tous ses prérequis transitifs. Partir du `main` réel propre, créer `correction-v32/r02-compte` et consigner le point de départ et l’écart éventuel au jalon.

## Sources à ouvrir

[B-13](../../04_VISUAL_REFERENCES/extension/planches/B-13.jpg), [B-14](../../04_VISUAL_REFERENCES/extension/planches/B-14.jpg), [B-15](../../04_VISUAL_REFERENCES/extension/planches/B-15.jpg)

Ouvrir le [PDF B](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf) et [son index de pages](../../00_SOURCE_OF_TRUTH/INDEX_PDF.md), le [PDF A](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf) pour la direction générale et les [arbitrages de sources](../../00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md). Fiches de ce lot · [ACCOUNT](../../05_SCREEN_SPECS/ACCOUNT.md). Pour les ID et leur preuve initiale, ouvrir [l’audit](../../01_AUDIT/ECARTS_CORRECTION_V32.md). Pour les médias et les styles, lire [mappings et crédits](../../03_ASSETS/ASSET_MAPPING_EXTENSION.md) et le [design system](../../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md).

## Fichiers et scénarios

Examiner depuis la racine · `client/pages/account.js`, `client/pages/navigation.js`, `client/app.js`, `client/styles/client.css`. Ouvrir les fiches liées pour les composants et permissions détaillés.

- **ACC-01 · `/login`** — Visiteur, next=/request/v1 depuis la fiche avec dates, persona renter. Zone · Carte formulaire, panneau photo et bandeau de contexte.
- **ACC-02 · `/register`** — Visiteur, next local, champ vide puis invalide. Zone · Modes et carte de création.
- **ACC-03 · `/profile`** — renter puis owner, compte incomplet en contrôle. Zone · Bandeau menthe, liste « Votre compte », rail propriétaire/aide.
- **ACC-04 · `/profile/documents`** — newcomer, puis audit-o09 refusé et audit-r02 vérifié. Zone · Pile de pièces et motif d’état.

## Rendu et gestes à préserver

Sur une visite depuis /vehicle/v1 avec dates, suivre le test browser de réservation puis protéger le retour en session expirée. Ouvrir /login et /register avec le même next. Vérifier absence de POST de demande implicite. Utiliser le panneau de Deshaies seulement là où le gabarit le rend visible, avec crédit, recadrage et cartouche de B-13. À 390, placer le bouton d’authentification avant le visuel, et reprendre la mise en forme B-14 pour l’inscription, les documents en attente et le motif refusé. Pour le profil B-15, comparer le bandeau d’identité et l’ordre des destinations. Utiliser renter, newcomer, audit-o09 puis owner sur leurs données fictives. Les liens vers moyen de paiement ou tout élément de la planche sans destination implémentée restent à l’arbitrage. Capturer login/register, profil locataire/propriétaire et documents vérifiés, en attente et refusés. Tester reprise du contexte, faux next externe sans navigation externe, déconnexion, refus documentaire et changement de session au retour navigateur.

## Validation observable

- **ACC-01** · Comparer panneau photo à droite et crédit à 1440. À 390, contrôle de compte et CTA visibles avant tout visuel.
- **ACC-02** · Capture mobile B-14 et bureau avec extrapolation signalée. Tester validation, changement de mode et reprise.
- **ACC-03** · Vérifier ordre, action déconnexion et aucun CTA d’activation redondant pour owner. Comparer les libellés métier disponibles.
- **ACC-04** · Comparatifs pending et refusé à 390, version et retour vérifiés aux deux largeurs.

## Exécuter les vérifications

Utiliser Node 24, Playwright 1.56.1, Chromium 141, Python et une instance jetable. `npm run audit:start` charge audit-v1. Initialiser les données manquantes via le mock et les scénarios des tests, sans toucher aux jeux de travail de l’utilisateur. Le premier travail du lot est de relever **avant modification** les routes et états ci-dessus à **390 × 844** et **1440 × 960**. Garder rôle, état, heure, données de simulation, scroll, DPR, navigateur et taille identiques au rejeu.

```bash
npm run check
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
(cd LOKASYON_PEYI_DESIGN_HANDOFF && python3 tools/verify_v32.py && python3 tools/verify_extension.py)
npx playwright test tests/browser/account.spec.js tests/browser/navigation.spec.js tests/browser/booking.spec.js
```

Sur une instance démarrée, lancer `npm run smoke`. Appliquer la [protection publique](../../08_VALIDATION/PROTECTED_PAGES_TESTS.md) et les [commandes de capture/comparaison](../../tools/README.md) avec deux instances historiques jetables, successivement si elles partagent les ports. Exécuter aussi les essais de rôles et d’interactions concernés. Relever le résultat brut de chaque essai, avec l’impact d’un essai omis. Garder le test PUB-01 et qualifier ses résultats séparément.

## Preuves, PR et passage

Prendre les captures corrigées au SHA de la PR. Pour chacun des ID, fournir la zone de **la planche validée côte à côte avec le rendu corrigé**, l’avant/après du site et le diff Git. Quand B illustre une seule largeur ou un autre modèle, nom, prix ou date, nommer les différences, comparer les zones homologues et préciser les dimensions interprétées. Pour les gestes visibles sans défilement, mesurer les boîtes à scroll nul et vérifier les recouvrements. Joindre les états complémentaires, contrôles clavier et preuves protégées. Rendre les artefacts expurgés accessibles depuis la PR.

Ouvrir une PR `R02 · Connexion, profil et documents` ciblant `main`, avec les trois résultats du [modèle de revue](../../09_IMPLEMENTATION/REVIEW_TEMPLATE.md) pour chaque case de la [matrice](../../08_VALIDATION/CORRECTION_V32.csv). Consigner chaque écart visible, sa preuve, son impact et la décision attendue. Un écart majeur de marque, navigation ou geste garde la ligne ouverte. Si la taille du diff empêche une revue cohérente, proposer des PR de même lot et apporter la preuve complète avant de le déclarer fini. Mettre à jour le suivi et livrer le verdict. Suite · [R03](R03_LOCATIONS_SUIVI_PAIEMENT.md) après intégration du GO.
