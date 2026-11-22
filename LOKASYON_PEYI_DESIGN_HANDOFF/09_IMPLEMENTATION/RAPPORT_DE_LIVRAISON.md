# Rapport de livraison · V3.2 consolidée

## Audit

Le checkout correspond à 4338f5f7ca252f4d4f02021ec47a226d0d2d6064. Les 33 routes, 10 PR de la campagne 00–09, contrats Node, modules et workflow sont cartographiés dans [l’audit](../01_AUDIT/ETAT_REEL_DU_DEPOT.md). Les contrôles locaux ont donné 50/50 Node, 2/2 Python, smoke OK, 173/174 Playwright et 11/11 scénarios de profils. Le seul cas standard en échec est PUB-01, reproduit 4 fois sur 8 essais ciblés. La CI du merge a une conclusion verte, avec résultats UI souples par défaut. Docker local, lecteurs d’écran et appareils physiques restent non vérifiés.

## UX/UI et fonctionnel

Les deux PDF (12 et 49 pages) et leurs arbitrages sont inclus. Le kit comprend 24 PNG de référence de main à huit largeurs, 46 observations nominales à 390 et 1440, quatre extraits transactionnels provenant des scénarios existants, 39 rendus de planches B et 11 comparatifs de composition. L’accueil, le catalogue et la fiche restent sous le protocole de protection. Les fonctions sont classées entre présentation A, adaptation frontend B et backlog C. Le backlog couvre notamment défauts structurés, lien fil/location, préférences de notification et révisions serveur.

## Contenu et migration

L’[arborescence](../README.md) montre le contenu actif. Le manifeste d’intégrité inventorie les chemins et leurs octets. Les 137 chemins de l’ancien kit sont conservés au même endroit, dont 133 octet pour octet et quatre actualisés. Le nouveau [manifeste d’assets](../03_ASSETS/asset-manifest.json) documente 37 ressources d’exécution, dont 23 variantes photographiques V3.2. Les sources natives de B et du logo ne sont pas confirmées; le PDF exact, ses rendus et le logo raster versionné sont disponibles. Aucun nouveau média tiers nécessaire.

## Démarrage

Extraire le ZIP hors du dépôt et suivre [l’installation](../INSTALLATION.md), puis [le guide Codex](../CODEX_START_HERE.md). Les 12 prompts sont ordonnés 00 à 11 avec tests, dépendances et rapport. Commencer par [LOT_00_BASELINE.md](../07_CODEX_PROMPTS/LOT_00_BASELINE.md), puis demander la validation avant le lot 01.

**GO AVEC RÉSERVES.** Le lot 00 peut démarrer sur le kit vérifié. Les écarts publics historiques et contrôles manuels restent tracés. La conformité de l’extension se décide au lot 11.
