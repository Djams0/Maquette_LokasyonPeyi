# Instructions Codex · extension des espaces client V3.2

Ce fichier s’applique au handoff. Lire CODEX_START_HERE.md, SOURCES_ET_ARBITRAGES.md et le prompt actif depuis la racine du dépôt. Pour le code applicatif, respecter aussi les instructions du dépôt et des dossiers associés si elles apparaissent sur un SHA ultérieur.

Protéger /, /search et /vehicle/:id ainsi que leur shell, données, interactions et navigation sur tous les rôles. Garder l’administration et les contrats API hors du diff graphique. Préférer un conteneur explicite de route opérationnelle, des variantes des composants réutilisés et des feuilles client ciblées. Toute variation partagée exige une analyse d’impact et une comparaison des pages protégées.

Les PDF fixent la direction graphique, le mock fixe les états, rôles, validations et données. Les fonctionnalités nécessitant un arbitrage produit restent au backlog. Les opérations de démonstration restent fictives. Conserver focus, droits, idempotence, formulaires, identité de session et reprise. Utiliser uniquement des données fictives et expurger les preuves.

Chaque lot part d’une base vérifiée et s’arrête après une branche dédiée, une revue, les preuves, le rapport et un GO/NO-GO. Aucune fusion automatique, push forcé ou lancement implicite du lot suivant. Les artefacts de test restent ignorés ou joints à une revue expurgée. Garder les tests qui caractérisent un défaut. Lire le résultat de chaque étape de CI.

Pour la correction après la PR #35, suivre la série R01–R09 indiquée dans CODEX_START_HERE.md. Le lot R01 traite le shell commun hors de #main et doit isoler sa variante interne des routes publiques protégées. La recette sépare fidélité, fonctionnement et protection.
