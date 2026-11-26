# R09 · Recette visuelle et fonctionnelle finale

## Mission

Travaille dans `Djams0/Maquette_LokasyonPeyi`. Livrer recette visuelle et fonctionnelle finale selon les zones indiquées ci-dessous. Appliquer les critères R01 à R08 et les contrôles transversaux de ce lot. Les planches renseignent le visuel, le mock fournit les permissions, les données, les actions et les transitions. Les contrats API, l’administration et les pages publiques relèvent du protocole de préservation du dépôt.

## Point de départ Git

Le diagnostic de référence porte sur `8a6974e23aab14acbabcd82f21f2bfcd9c0498ce`. À cette exécution, vérifier la branche par défaut et le SHA courant via `git fetch origin`, `git remote show origin`, `git rev-parse origin/main` et `git status --short`. Vérifier l’ascendance du jalon avec `git merge-base --is-ancestor 8a6974e23aab14acbabcd82f21f2bfcd9c0498ce origin/main`. Vérifier le commit du handoff et les SHA de fusion des lots précédents dans [le suivi](../../09_IMPLEMENTATION/PROGRESS_TRACKER.md) ou via leurs PR. Entrée · [R08](R08_PUBLICATION_BROUILLONS.md) validé et intégré, avec tous ses prérequis transitifs. Partir du `main` réel propre, créer `correction-v32/r09-recette-finale` et consigner le point de départ et l’écart éventuel au jalon.

## Sources à ouvrir

[B p. 3](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=3), [B p. 10](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=10), [B-11](../../04_VISUAL_REFERENCES/extension/planches/B-11.jpg), [B-12](../../04_VISUAL_REFERENCES/extension/planches/B-12.jpg), [B-27](../../04_VISUAL_REFERENCES/extension/planches/B-27.jpg), [B-43](../../04_VISUAL_REFERENCES/extension/planches/B-43.jpg), [B-44](../../04_VISUAL_REFERENCES/extension/planches/B-44.jpg), [B-45](../../04_VISUAL_REFERENCES/extension/planches/B-45.jpg), [B-46](../../04_VISUAL_REFERENCES/extension/planches/B-46.jpg), [B-47](../../04_VISUAL_REFERENCES/extension/planches/B-47.jpg), [B-48](../../04_VISUAL_REFERENCES/extension/planches/B-48.jpg)

Ouvrir le [PDF B](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf) et [son index de pages](../../00_SOURCE_OF_TRUTH/INDEX_PDF.md), le [PDF A](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf) pour la direction générale et les [arbitrages de sources](../../00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md). Fiches de ce lot · [OUTILS](../../05_SCREEN_SPECS/OUTILS.md) · [PROTECTION](../../05_SCREEN_SPECS/PROTECTION.md). Pour les ID et leur preuve initiale, ouvrir [l’audit](../../01_AUDIT/ECARTS_CORRECTION_V32.md). Pour les médias et les styles, lire [mappings et crédits](../../03_ASSETS/ASSET_MAPPING_EXTENSION.md) et le [design system](../../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md).

## Fichiers et scénarios

Examiner depuis la racine · `client/app.js`, `client/pages/demo.js`, `client/pages/audit.js`, `client/pages/operational-samples.js`, `playwright.config.js`, `playwright.audit.config.js`, `scripts/sanitize-evidence.py`. Ouvrir les fiches liées pour les composants et permissions détaillés.

- **OUT-01 · `/demo`** — Visiteur et locataire, y compris panne simulée. Zone · Entrée outils et identité fictive.
- **OUT-02 · `/demo/audit`** — Visiteur sur audit-v1 et instance seed séparée. Zone · Atelier d’audit et retour outils.
- **OUT-03 · `/design-system`** — Visiteur accédant depuis le menu, erreur et récupération fictives. Zone · Échantillons visuels opérationnels et interactions.
- **TRV-01 · `[états transversaux]`** — Latence et panne injectées en test sur les familles, échange de persona via bfcache, /hors-parcours et accès dossiers tiers. Zone · Chargement, erreur, vide, refus, 404 et changement de session.
- **PRG-01 · `/`** — Seed historique, visiteurs puis locataire/propriétaire à 390 et 1440. Zone · Capsule, recherche et parcours existants.
- **PRG-02 · `/search`** — Seed historique, filtres et budget, 390 → 880 → 390. Zone · Catalogue et tiroir.
- **PRG-03 · `/vehicle/:id`** — Seed historique, /vehicle/v3, galerie et retour exact depuis catalogue, demande suivie d’authentification. Zone · Fiche v3, média et retour.

## Rendu et gestes à préserver

Rejouer chaque ligne de CORRECTION_V32.csv, les scénarios et la grille B-43 à B-48. Confirmer les écarts résolus avec des comparatifs source, avant et après pour chaque écran et largeur. Vérifier les trois résultats indépendamment et consigner les décisions, séances manquantes et stabilité des preuves R01 à R08. Recapturer les écrans touchés par des éléments partagés depuis leur lot, même si le comparatif précédent avait été accepté. Pour les outils, vérifier /demo, /demo/audit et /design-system, leurs accès sans bandeau global, la sortie du mode réseau et le retour utile. Ajouter 403/404, compte suspendu, session en relecture, chargement, vide et erreur d’au moins un cas par famille pertinente; reflow à 320 et zoom 200 %, contraste/focus et clavier jusqu’au geste. Distinctement, tester les assistances disponibles et répertorier les limites sur lecteur d’écran, vrai clavier virtuel, appareils et impression. Exécuter Playwright complet puis profil audit essentiel et audit étendu. Vérifier la référence publique et PUB-01 aux mêmes largeurs et conditions que la base, et consulter les statuts bruts de CI. Remettre un dossier de preuves expurgées consultable depuis la PR, une conclusion par ligne et une décision GO/NO-GO. Toute correction substantielle apparue ici attend la reprise de son lot ou une PR ciblée en revue.

## Validation observable

- **OUT-01** · Vérifier navigation à 390 et 1440 et retour au scénario.
- **OUT-02** · Vérifier les deux démarrages et lien retour. Statut documenté faute de maquette dédiée.
- **OUT-03** · Comparer composants à B-11/12, tester focus/fermeture et reflow.
- **TRV-01** · Comparer états partagés par largeur et clavier, relever aides techniques/appareils non essayés et impact.
- **PRG-01** · PNG et diff aux 8 largeurs, contrôles connectés et contexte préservés à chaque lot.
- **PRG-02** · 8 paires, et résultat du test partagé avec répétitions identiques.
- **PRG-03** · 8 paires et parcours connexion/retour à 390 et 1440 sur les mêmes données.

## Exécuter les vérifications

Utiliser Node 24, Playwright 1.56.1, Chromium 141, Python et une instance jetable. `npm run audit:start` charge audit-v1. Initialiser les données manquantes via le mock et les scénarios des tests, sans toucher aux jeux de travail de l’utilisateur. Le premier travail du lot est de relever **avant modification** les routes et états ci-dessus à **390 × 844** et **1440 × 960**. Garder rôle, état, heure, données de simulation, scroll, DPR, navigateur et taille identiques au rejeu.

```bash
npm run check
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
(cd LOKASYON_PEYI_DESIGN_HANDOFF && python3 tools/verify_v32.py && python3 tools/verify_extension.py)
npx playwright test
npx playwright test --config=playwright.audit.config.js --grep 'UI-AUD-0[1-4]'
npm run test:audit
```

Sur une instance démarrée, lancer `npm run smoke`. Appliquer la [protection publique](../../08_VALIDATION/PROTECTED_PAGES_TESTS.md) et les [commandes de capture/comparaison](../../tools/README.md) avec deux instances historiques jetables, successivement si elles partagent les ports. Exécuter aussi les essais de rôles et d’interactions concernés. Relever le résultat brut de chaque essai, avec l’impact d’un essai omis. Garder le test PUB-01 et qualifier ses résultats séparément.

## Preuves, PR et passage

Prendre les captures corrigées au SHA de la PR. Pour chacun des ID, fournir la zone de **la planche validée côte à côte avec le rendu corrigé**, l’avant/après du site et le diff Git. Quand B illustre une seule largeur ou un autre modèle, nom, prix ou date, nommer les différences, comparer les zones homologues et préciser les dimensions interprétées. Pour les gestes visibles sans défilement, mesurer les boîtes à scroll nul et vérifier les recouvrements. Joindre les états complémentaires, contrôles clavier et preuves protégées. Rendre les artefacts expurgés accessibles depuis la PR.

Ouvrir une PR `R09 · Recette visuelle et fonctionnelle finale` ciblant `main`, avec les trois résultats du [modèle de revue](../../09_IMPLEMENTATION/REVIEW_TEMPLATE.md) pour chaque case de la [matrice](../../08_VALIDATION/CORRECTION_V32.csv). Consigner chaque écart visible, sa preuve, son impact et la décision attendue. Un écart majeur de marque, navigation ou geste garde la ligne ouverte. Si la taille du diff empêche une revue cohérente, proposer des PR de même lot et apporter la preuve complète avant de le déclarer fini. Mettre à jour le suivi et livrer le verdict. Suite · Fin de la campagne après décision humaine et archivage des preuves.
