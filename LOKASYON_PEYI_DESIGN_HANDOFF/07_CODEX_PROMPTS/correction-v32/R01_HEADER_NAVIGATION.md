# R01 · Header interne et navigation

## Mission

Travaille dans `Djams0/Maquette_LokasyonPeyi`. Livrer header interne et navigation selon les zones indiquées ci-dessous. Corriger le composant partagé et ses variantes, puis faire l’inventaire des surfaces qui le montent. Les planches renseignent le visuel, le mock fournit les permissions, les données, les actions et les transitions. Les contrats API, l’administration et les pages publiques relèvent du protocole de préservation du dépôt.

## Point de départ Git

Le diagnostic de référence porte sur `8a6974e23aab14acbabcd82f21f2bfcd9c0498ce`. À cette exécution, vérifier la branche par défaut et le SHA courant via `git fetch origin`, `git remote show origin`, `git rev-parse origin/main` et `git status --short`. Vérifier l’ascendance du jalon avec `git merge-base --is-ancestor 8a6974e23aab14acbabcd82f21f2bfcd9c0498ce origin/main`. Vérifier le commit du handoff et les SHA de fusion des lots précédents dans [le suivi](../../09_IMPLEMENTATION/PROGRESS_TRACKER.md) ou via leurs PR. Entrée · Handoff intégré, avec tous ses prérequis transitifs. Partir du `main` réel propre, créer `correction-v32/r01-header-navigation` et consigner le point de départ et l’écart éventuel au jalon.

## Sources à ouvrir

[B-11](../../04_VISUAL_REFERENCES/extension/planches/B-11.jpg), [B-13](../../04_VISUAL_REFERENCES/extension/planches/B-13.jpg), [B-15](../../04_VISUAL_REFERENCES/extension/planches/B-15.jpg), [B-16](../../04_VISUAL_REFERENCES/extension/planches/B-16.jpg), [B-17](../../04_VISUAL_REFERENCES/extension/planches/B-17.jpg), [B-18](../../04_VISUAL_REFERENCES/extension/planches/B-18.jpg), [B-24](../../04_VISUAL_REFERENCES/extension/planches/B-24.jpg), [B-25](../../04_VISUAL_REFERENCES/extension/planches/B-25.jpg), [B-27](../../04_VISUAL_REFERENCES/extension/planches/B-27.jpg), [B-33](../../04_VISUAL_REFERENCES/extension/planches/B-33.jpg), [B-43](../../04_VISUAL_REFERENCES/extension/planches/B-43.jpg), [B-44](../../04_VISUAL_REFERENCES/extension/planches/B-44.jpg), [B-45](../../04_VISUAL_REFERENCES/extension/planches/B-45.jpg)

Ouvrir le [PDF B](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf) et [son index de pages](../../00_SOURCE_OF_TRUTH/INDEX_PDF.md), le [PDF A](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf) pour la direction générale et les [arbitrages de sources](../../00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md). Fiches de ce lot · [Navigation](../../02_DESIGN_SYSTEM/NAVIGATION.md) · [Fiches écran](../../05_SCREEN_SPECS/README.md). Pour les ID et leur preuve initiale, ouvrir [l’audit](../../01_AUDIT/ECARTS_CORRECTION_V32.md). Pour les médias et les styles, lire [mappings et crédits](../../03_ASSETS/ASSET_MAPPING_EXTENSION.md) et le [design system](../../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md).

## Fichiers et scénarios

Examiner depuis la racine · `client/shell.js`, `client/pages/navigation.js`, `client/app.js`, `client/styles/client.css`, `ui/tokens.css`, `ui/components.js`. Ouvrir les fiches liées pour les composants et permissions détaillés.

- **HDR-01 · `[shell interne]`** — Visiteur /login, locataire /profile, /rentals, /messages, propriétaire /owner, plus fil et détail. Zone · Bande supérieure des cadres client et propriétaire.
- **HDR-02 · `[barre basse et détail]`** — Racines profil, locations, liste messages, tableau propriétaire puis fil, demande, suivi, paiement et constat. Zone · Bas des vues racines et retour au-dessus du contenu.

## Rendu et gestes à préserver

Prendre `client/shell.js` comme entrée et `client/pages/navigation.js` comme source des destinations, du contexte et de la barre basse. Vérifier `client/app.js` pour /me et pageshow. Le shell monte le header avant #main. Introduire une variante interne explicite, définie avant le montage du contenu et cohérente pour toutes les routes hors découverte publique, y compris outils et erreurs client. Examiner les surcharges par route dans `client/styles/client.css` pour que la variante ne change pas lors de l’arrivée des données. Réutiliser les primitives et tokens existants. Garder un seul header par page et le DOM public intact sur /, /search et /vehicle/:id.

- **Ordinateur** · Sur fond crème, capsule blanche à bords très arrondis, bordure douce et insets alignés sur le contenu. Logo officiel bicolore horizontal à gauche, destinations centrées, cloche/compte/menu dans la zone droite pour les comptes actifs. Visiteur · Explorer/Aide au centre puis Connexion/Menu. Locataire · Explorer/Locations/Messages/Documents. Propriétaire · Explorer/Mon parc/Demandes/Profil. En /owner, Mon parc est le parent actif sur B-33, Aujourd’hui est actif dans la sous-navigation. Garder le bouton Menu distinct et cohérent avec les planches.
- **À 390 px** · Une rangée dans la capsule, logo à gauche et Connexion/Menu pour le visiteur, cloche/Menu pour un compte actif. Accès Compte dans le menu en mobile. Vérifier profil, locations, boîte Messages et Aujourd’hui avec la barre basse. Sur fil ouvert, demande, suivi, paiement, constat, documents, gestion et assistant, préserver le retour ou l’action métier là où la planche le prévoit et laisser la barre basse hors des tunnels. Pour les autres routes utiliser la [règle du gabarit](../../02_DESIGN_SYSTEM/NAVIGATION.md). Vérifier focus non couvert, zones sûres et reflow à 320 px ou 200 %.
- **Démonstration** · Déplacer l’information globale du bandeau hors de la zone de tête interne. Conserver Menu → Démonstration et accès au pied de page, y compris /demo, /demo/audit et /design-system. Garder les mentions fictives dans les formulaires concernés et la reprise réseau via les outils.
- **Session et clavier** · Ouvrir avec Entrée et Espace, vérifier aria-expanded, fermeture par bouton ou Échap, boucle Tab/Shift+Tab et retour de focus. Vérifier liens de compte et notifications, actif exact/parent, retour q, changement de persona et navigation restaurée. Les commandes et contenus d’une autre session ne paraissent pas pendant /me. Les destinations secondaires du propriétaire restent au menu.
- **Vérification obligatoire** · Capturer /login visiteur, /profile et /rentals locataires, /messages liste et fil, /owner propriétaire, plus un détail de location et l’accès aux outils, à 390 et 1440. Pour tous les gabarits ciblés, contrôler au DOM une capsule unique et le chargement de `/assets/v32/marque/logo-horizontal-charte.webp` (URL résolue et `naturalWidth > 0`), les cibles visibles, l’actif et l’ordre. Estimer les dimensions de la capsule, du logo et des espaces à partir des planches, mesurer les boîtes obtenues, puis préciser cette interprétation. L’image officielle et la capsule sont des conditions de fermeture. Toute exception requiert la planche, la route/variante, la justification et une décision explicite. Pour /, /search et /vehicle/v3, rendre les 24 comparaisons et les essais connectés. Une divergence reste bloquante jusqu’à résolution.

## Validation observable

- **HDR-01** · Capsule et image chargée sur toutes les routes cibles aux deux largeurs, sans débordement. Échap, bouton fermer, boucle Tab, focus et aria-current démontrés.
- **HDR-02** · Barre et retour conformes à la variante, aucun chevauchement au chargement, au reflow et pendant la saisie.

## Exécuter les vérifications

Utiliser Node 24, Playwright 1.56.1, Chromium 141, Python et une instance jetable. `npm run audit:start` charge audit-v1. Initialiser les données manquantes via le mock et les scénarios des tests, sans toucher aux jeux de travail de l’utilisateur. Le premier travail du lot est de relever **avant modification** les routes et états ci-dessus à **390 × 844** et **1440 × 960**. Garder rôle, état, heure, données de simulation, scroll, DPR, navigateur et taille identiques au rejeu.

```bash
npm run check
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
(cd LOKASYON_PEYI_DESIGN_HANDOFF && python3 tools/verify_v32.py && python3 tools/verify_extension.py)
npx playwright test tests/browser/navigation.spec.js tests/browser/account.spec.js tests/browser/messaging.spec.js tests/browser/owner.spec.js tests/browser/visual-qa.spec.js
```

Sur une instance démarrée, lancer `npm run smoke`. Appliquer la [protection publique](../../08_VALIDATION/PROTECTED_PAGES_TESTS.md) et les [commandes de capture/comparaison](../../tools/README.md) avec deux instances historiques jetables, successivement si elles partagent les ports. Exécuter aussi les essais de rôles et d’interactions concernés. Relever le résultat brut de chaque essai, avec l’impact d’un essai omis. Garder le test PUB-01 et qualifier ses résultats séparément.

## Preuves, PR et passage

Prendre les captures corrigées au SHA de la PR. Pour chacun des ID, fournir la zone de **la planche validée côte à côte avec le rendu corrigé**, l’avant/après du site et le diff Git. Quand B illustre une seule largeur ou un autre modèle, nom, prix ou date, nommer les différences, comparer les zones homologues et préciser les dimensions interprétées. Pour les gestes visibles sans défilement, mesurer les boîtes à scroll nul et vérifier les recouvrements. Joindre les états complémentaires, contrôles clavier et preuves protégées. Rendre les artefacts expurgés accessibles depuis la PR.

Ouvrir une PR `R01 · Header interne et navigation` ciblant `main`, avec les trois résultats du [modèle de revue](../../09_IMPLEMENTATION/REVIEW_TEMPLATE.md) pour chaque case de la [matrice](../../08_VALIDATION/CORRECTION_V32.csv). Consigner chaque écart visible, sa preuve, son impact et la décision attendue. Un écart majeur de marque, navigation ou geste garde la ligne ouverte. Si la taille du diff empêche une revue cohérente, proposer des PR de même lot et apporter la preuve complète avant de le déclarer fini. Mettre à jour le suivi et livrer le verdict. Suite · [R02](R02_COMPTE.md) après intégration du GO.
