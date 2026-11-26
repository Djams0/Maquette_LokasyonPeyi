# R05 · Messagerie et notifications

## Mission

Travaille dans `Djams0/Maquette_LokasyonPeyi`. Livrer messagerie et notifications selon les zones indiquées ci-dessous. Utiliser la variante interne validée en R01. Les planches renseignent le visuel, le mock fournit les permissions, les données, les actions et les transitions. Les contrats API, l’administration et les pages publiques relèvent du protocole de préservation du dépôt.

## Point de départ Git

Le diagnostic de référence porte sur `8a6974e23aab14acbabcd82f21f2bfcd9c0498ce`. À cette exécution, vérifier la branche par défaut et le SHA courant via `git fetch origin`, `git remote show origin`, `git rev-parse origin/main` et `git status --short`. Vérifier l’ascendance du jalon avec `git merge-base --is-ancestor 8a6974e23aab14acbabcd82f21f2bfcd9c0498ce origin/main`. Vérifier le commit du handoff et les SHA de fusion des lots précédents dans [le suivi](../../09_IMPLEMENTATION/PROGRESS_TRACKER.md) ou via leurs PR. Entrée · [R04](R04_CONSTATS.md) validé et intégré, avec tous ses prérequis transitifs. Partir du `main` réel propre, créer `correction-v32/r05-messagerie-notifications` et consigner le point de départ et l’écart éventuel au jalon.

## Sources à ouvrir

[B-24](../../04_VISUAL_REFERENCES/extension/planches/B-24.jpg), [B-25](../../04_VISUAL_REFERENCES/extension/planches/B-25.jpg), [B-26](../../04_VISUAL_REFERENCES/extension/planches/B-26.jpg), [B-27](../../04_VISUAL_REFERENCES/extension/planches/B-27.jpg)

Ouvrir le [PDF B](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf) et [son index de pages](../../00_SOURCE_OF_TRUTH/INDEX_PDF.md), le [PDF A](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf) pour la direction générale et les [arbitrages de sources](../../00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md). Fiches de ce lot · [MESSAGING](../../05_SCREEN_SPECS/MESSAGING.md) · [NOTIFICATIONS](../../05_SCREEN_SPECS/NOTIFICATIONS.md). Pour les ID et leur preuve initiale, ouvrir [l’audit](../../01_AUDIT/ECARTS_CORRECTION_V32.md). Pour les médias et les styles, lire [mappings et crédits](../../03_ASSETS/ASSET_MAPPING_EXTENSION.md) et le [design system](../../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md).

## Fichiers et scénarios

Examiner depuis la racine · `client/pages/messaging.js`, `client/pages/message-state.js`, `client/pages/account.js`, `client/pages/navigation.js`, `client/styles/client.css`. Ouvrir les fiches liées pour les composants et permissions détaillés.

- **MSG-01 · `/messages`** — renter avec fil court v1 et fil long v3, newcomer sans échange. Zone · Boîte de réception, filtre, sélection et vide.
- **MSG-02 · `/messages?conversation=:id`** — renter, trois échanges sur v1 puis un fil de 14 messages v3, q non vide pour le retour. Zone · Carte contexte, historique et zone de réponse.
- **MSG-03 · `/notifications`** — audit-r02 notifié, newcomer vide. Zone · Liste lue/non lue et état vide.

## Rendu et gestes à préserver

Créer deux fils avec le locataire renter sur v1/v3 et le propriétaire correspondant. Mettre trois messages alternés sur v1 et un échange long sur v3. Ouvrir /messages avec un filtre conservé, puis /messages?conversation=… avec q non vide. Sur bureau comparer B-24 zones liste/fil et contexte; sur mobile comparer B-25 liste seule puis B-24 fil. Après chargement du fil court, scroll=0 à 390 × 844, contrôler que la saisie et le bouton Envoyer tiennent en entier dans la zone visible. Garder un moyen de défiler le fil long et revenir à la liste filtrée. Mesurer pendant focus et, si disponible, clavier mobile réel. Consigner un essai avec clavier physique de poste ou émulation et tracer séparément l’impact du clavier virtuel si non vérifié. Préserver la saisie, le focus, la sélection, les positions, la reprise d’envoi et la validation de session. Comparer les états envoi/refus/résultat inconnu de B-25 et le vide B-27. Rendre aussi notifications nominales et vides B-26, destinataire, marquage et destination. Rejouer une coupure avant/après écriture, permissions et changement de compte.

## Validation observable

- **MSG-01** · Compare liste B-25 aux deux largeurs. Après ouverture et retour, q et ciblage restent exacts.
- **MSG-02** · Comparatif B-24 court avec mesure textarea et bouton visibles. Captures long avant et pendant saisie si clavier disponible, essai retour et changement de compte.
- **MSG-03** · Comparer liste et vide aux deux largeurs. Tester marquage en échec puis reprise.

## Exécuter les vérifications

Utiliser Node 24, Playwright 1.56.1, Chromium 141, Python et une instance jetable. `npm run audit:start` charge audit-v1. Initialiser les données manquantes via le mock et les scénarios des tests, sans toucher aux jeux de travail de l’utilisateur. Le premier travail du lot est de relever **avant modification** les routes et états ci-dessus à **390 × 844** et **1440 × 960**. Garder rôle, état, heure, données de simulation, scroll, DPR, navigateur et taille identiques au rejeu.

```bash
npm run check
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
(cd LOKASYON_PEYI_DESIGN_HANDOFF && python3 tools/verify_v32.py && python3 tools/verify_extension.py)
npx playwright test tests/browser/messaging.spec.js tests/browser/account.spec.js tests/browser/navigation.spec.js
```

Sur une instance démarrée, lancer `npm run smoke`. Appliquer la [protection publique](../../08_VALIDATION/PROTECTED_PAGES_TESTS.md) et les [commandes de capture/comparaison](../../tools/README.md) avec deux instances historiques jetables, successivement si elles partagent les ports. Exécuter aussi les essais de rôles et d’interactions concernés. Relever le résultat brut de chaque essai, avec l’impact d’un essai omis. Garder le test PUB-01 et qualifier ses résultats séparément.

## Preuves, PR et passage

Prendre les captures corrigées au SHA de la PR. Pour chacun des ID, fournir la zone de **la planche validée côte à côte avec le rendu corrigé**, l’avant/après du site et le diff Git. Quand B illustre une seule largeur ou un autre modèle, nom, prix ou date, nommer les différences, comparer les zones homologues et préciser les dimensions interprétées. Pour les gestes visibles sans défilement, mesurer les boîtes à scroll nul et vérifier les recouvrements. Joindre les états complémentaires, contrôles clavier et preuves protégées. Rendre les artefacts expurgés accessibles depuis la PR.

Ouvrir une PR `R05 · Messagerie et notifications` ciblant `main`, avec les trois résultats du [modèle de revue](../../09_IMPLEMENTATION/REVIEW_TEMPLATE.md) pour chaque case de la [matrice](../../08_VALIDATION/CORRECTION_V32.csv). Consigner chaque écart visible, sa preuve, son impact et la décision attendue. Un écart majeur de marque, navigation ou geste garde la ligne ouverte. Si la taille du diff empêche une revue cohérente, proposer des PR de même lot et apporter la preuve complète avant de le déclarer fini. Mettre à jour le suivi et livrer le verdict. Suite · [R06](R06_ASSISTANCE_CLOTURE.md) après intégration du GO.
