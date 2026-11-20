# Rapport de préparation · 19 novembre 2026

**GO AVEC RÉSERVES**. Le lot 00 peut démarrer dès que le kit complet a été installé et que son SHA est vérifié. L’étape GitHub reste bloquée par la revue automatique de publication. La recette du design sera exécutée dans les lots.

| Indicateur | Résultat |
|---|---|
| Base auditée | origin/main à e42cc6ffa69bba6c1cc5c36333adede531d6d11f, fusion de la PR #11 historique |
| Préparation Git | Branche locale design/v3.2-handoff. Le diff prévu est documentaire et restreint au handoff. Aucun ajout à main, aucune PR ouverte. |
| Ressources | 14 captures natives et revue HTML. 16 photos, 31 variantes WebP et 1 JPEG source hero. 16 sources et licences revérifiées; 0 photo de la sélection manquante. Le logo source natif manque, extrait de revue disponible. |
| Médias de démonstration | v1, v2 et v3 mappés à leurs séries de modèle. Polo, 2008 et Berlingo servent à la référence graphique. |
| Captures comparatives | 6 comparatifs à 1440 et 390. 18 repères dérivés aux 6 autres largeurs, avec métriques. |
| Handoff historique | 140 chemins audités. 9 conservés, README remplacé, 130 archivés dans Git. |
| Prompts | 10 complets, 00–09, chacun avec chemins vérifiés, dépendances, tests et critères de revue. |
| Syntaxe et documentation | npm run check réussi, 78 modules, 108 scénarios documentés dont 31 liés à une assertion automatisée. |
| Tests API/Node et Python | 48/48 Node et 2/2 Python (expurgation). |
| Démarrage local et smoke | Node v24.22.3, client 8080, admin 8081, API 3001. Routes, médias et API commune confirmés sur une base jetable. |
| Chromium | 150/150 dans la suite standard Playwright 1.56.1, 4/4 profils audit 01–04. |
| Limites | Docker/Compose indisponible dans cet environnement. Campagne audit approfondie, appareils physiques et lecteurs d’écran complets reportés à la recette. La conformité de l’interface à venir ne peut pas encore être mesurée. |

Le premier essai de smoke a démarré dans une session séparée et a reçu un refus de connexion. Le scénario à processus supervisés avec fichier jetable a réussi. Le capteur a été ajusté pour attendre la zone de résultats visible à mobile, après avoir rencontré un titre de filtre masqué.

Le test d’installation avec conversion CRLF a pu installer le kit et reconstituer le même arbre Git. Sur ce checkout, le vérificateur historique de documentation de la maquette attend LF et signale SCENARIOS.md. Le guide indique le réglage de clone pour Windows.

La revue automatique a refusé l’ajout d’une photo via une opération GitHub et également l’ajout d’une note textuelle de revue. Le dépôt GitHub étant public, une autorisation explicite de publier le kit et ses références est à fournir avant une nouvelle tentative. Aucune mutation distante n’a abouti. L’archive est utilisable pour une installation locale et fournit tous les fichiers du diff. Le dossier de production V3.2 et celui des 51 références restent distincts du code.

Les vérifications métier ne couvrent ni un paiement ou une assurance réels, ni la conformité d’une future diffusion commerciale. Reprendre les décisions de la charte, les fichiers d’usage et les crédits au lot 02. Les parcours actuels sur données fictives font autorité.
