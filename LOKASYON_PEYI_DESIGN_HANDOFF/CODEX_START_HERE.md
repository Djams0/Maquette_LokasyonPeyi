# Démarrer Codex · extension des espaces client

1. Dans le dépôt **Djams0/Maquette_LokasyonPeyi**, utiliser Node 24, Python 3, Git et Playwright 1.56.1. Vérifier la base auditée **4338f5f7ca252f4d4f02021ec47a226d0d2d6064**, les instructions AGENTS applicables et l’arbre de travail. Installer le kit selon [INSTALLATION.md](INSTALLATION.md).
2. Exécuter les deux contrôles sous tools, puis lire [arbitrages et PDF](00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md), [risques](01_AUDIT/RISQUES_ET_REGRESSIONS.md), [protection](08_VALIDATION/PROTECTED_PAGES_TESTS.md) et [rapport de revue](09_IMPLEMENTATION/REVIEW_TEMPLATE.md).
3. Donner à Codex le fichier [07_CODEX_PROMPTS/LOT_00_BASELINE.md](07_CODEX_PROMPTS/LOT_00_BASELINE.md) et le SHA contenant ce handoff. Le lot 00 examine la base, les 24 captures publiques, les résultats et PUB-01. La maquette est démarrée sur données fictives jetables.
4. Passer au lot 01 uniquement après revue/validation du lot 00. Utiliser une branche par lot, exécuter tests ciblés, contrôle public et relecture des contrats. Le résultat d’un lot ne déclenche pas automatiquement le suivant.
5. Suivre [les 12 lots](07_CODEX_PROMPTS/README.md) et remplir [le suivi](09_IMPLEMENTATION/PROGRESS_TRACKER.md). Avant le lot 11, rejouer le cycle complet, comparer les vues protégées et faire relire les points non vérifiés. La décision finale suit [les critères de recette](08_VALIDATION/ACCEPTANCE_CRITERIA.md).

**Périmètre** · /, /search et /vehicle/:id sont protégés. Administration et contrats API conservent leurs responsabilités. Le [backlog C](06_FONCTIONNEL/EVOLUTIONS_A_VALIDER.md) attend une décision explicite.
