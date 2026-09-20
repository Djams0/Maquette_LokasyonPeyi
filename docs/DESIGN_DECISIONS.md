# Sources et décisions avant implémentation

Analyse du 20 septembre 2026. Référence métier : `Djams0/LokasyonPeyi`, branche main, commit `33bf766339de6745f82e7b51422c0eae59b1750f`. Lecture via connecteur GitHub, aucune mutation du dépôt source. README, AGENTS, ARCHITECTURE, TECH_STACK, UI_FOUNDATIONS, PERMISSIONS, SECURITY, BUSINESS_RULES, REGISTER, neuf ADR, PHASE0_PLAN et CODEX_PROMPTS inspectés. L'historique inclut la fusion #4 du lot 03, `b92fdd4` (prompts), `e8c617f` (qualité), puis #2 `d021b75` (fondations). Les descriptions historiques de phase 0 ne sont pas prises pour du code applicatif livré.

Cette commande utilisateur autorise une maquette indépendante : elle ne réalise ni le lot 04 du dépôt métier ni son MVP commercial. Vanilla et trois processus remplacent volontairement Next/Nest/PostgreSQL uniquement dans ce dépôt de démonstration. Aucun statut ADR n'est modifié. ADR-007 reste BLOCKED ; D-01 à D-10 restent ouverts/partiels.

## Lecture réelle du Figma

`Untitled(1).fig` : SHA-256 `91af9ec2d2848a9f51474afb64f626455ff478ff4878d4e52bcaa7d0c156c83e`, export du 17 septembre 2026. Archive ZIP ; canvas fig-kiwi version 106, schéma deflate et données zstd, décodés avec le code Kiwi officiel evanw/kiwi. 9 592 nœuds : 4 599 frames, 2 801 textes, 151 instances, 123 SYMBOL (composants), 671 variables, 6 ensembles de variables. Un canevas visible Page 1 et un canevas interne masqué. Les 22 frames racines visibles correspondent aux 22 pages du PDF ; inventaire des IDs/dimensions dans FIGMA_INVENTORY.json.

Styles : Nunito 2 313 textes, Lora 183, Lobster 48 ; restes Inter/Arial/Public Sans dans les composants importés. 2 885 auto-layouts verticaux, 1 153 horizontaux, 48 grilles. Espacements observés notamment 4/8/10/12, rayons 10/12/14/16 et pills 999 ; normalisation responsive sur grille 4/8. Dix nœuds possèdent une grille de mise en page souvent masquée. Instances dans des frames imbriquées, pas d'instance directement enfant d'une instance/SYMBOL dans l'export décodé. Variants numérotés et variantes hover, plutôt qu'un système sémantique prêt à être réutilisé.

16 nœuds avec prototypeInteractions : principalement ON_HOVER/SWAP_STATE ; deux liens ON_CLICK vers une ancienne URL localhost d'import. Aucun graphe complet de navigation opérationnel à reprendre. Le flow textuel doit être reconstruit.

`Untitled(1).pdf` : SHA-256 `6d491983c597bcf3b5a3ef38979e66d4660537eede5be2c0cea9279b530cc2d8`, 22 pages extraites ET rendues/examinées. Planche 11 : design system. Les écrans sont représentés à 375/1440 dans des planches plus larges ; leur fond sombre n'est pas le fond de l'application. La maquette conserve surfaces claires, cartes blanches, palette, hiérarchie, galerie et navigation ; les photos sable deviennent des illustrations SVG locales explicitement fictives.

## Architecture arrêtée

Client :8080 et admin :8081, chacun son HTML, ses pages, son état et ses modules. Un serveur statique transporte /api vers :3001 par HTTP. API Node native, stockage JSON atomique, sessions démo en mémoire. Partage limité à tokens et primitives UI sans état métier, et assets. Aucune application n'importe l'autre. Permissions, filtrage de données, transitions et devis dans API. Réseau Compose dédié, volume JSON, healthchecks, accès hôte loopback.

## Machines d'états de démonstration

Demande `requested` → `awaiting_payment` par propriétaire → `confirmed` par paiement simulé → caution séparée `simulated_authorized` et inspection → `in_progress` par remise propriétaire → `return_reported` par locataire → `returned` par récupération propriétaire → `completed` par clôture. Refus/retrait avant acceptation ; demande d'annulation après acceptation examinée via dossier support. Aucun remboursement automatique. Une demande n'occupe pas le créneau ; une acceptation oui. Conflits vérifiés côté API, sans prétention de garantie PostgreSQL multi-processus.

Dossier : reçu → pièces demandées → contradictoire → examen → décision → clos. Finance : proposition versionnée → approbation par une autre persona nominative → effet fictif uniquement. Document : soumis vN → checklist complète sur vN → décision/motif/agent/date/checklist v1 ; remplacement vN+1 invalide le statut actuel.

## Stratégie de recette

Tests Node HTTP : parcours complet, droits croisés, conflits et versions, auto-approbation refusée, inspections, données partagées. Tests navigateur : parcours visiteurs/locataire/propriétaire/employé/admin/super-admin, erreurs réseau, modales, formulaires, responsive aux sept largeurs. Docker config/build/up/smoke en CI ; l'environnement initial ne possède pas Docker. Ne jamais annoncer ces commandes réussies avant preuve.
