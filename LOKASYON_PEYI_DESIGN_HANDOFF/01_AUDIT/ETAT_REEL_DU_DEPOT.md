# État réel du dépôt · 21 novembre 2026

Le SHA courant vérifié de origin/main était **4338f5f7ca252f4d4f02021ec47a226d0d2d6064**, 302 fichiers versionnés. L’audit a été conduit en checkout isolé. Le seul AGENTS.md versionné était le fichier local au handoff. Lire la [matrice de 33 routes](MATRICE_ROUTES_COMPOSANTS_API.csv) et le [registre des écarts publics](HISTORIQUE_ECARTS_PUBLICS.md).

## Architecture et limites techniques

- Deux frontends sans framework, HTML/CSS, JS ESM. client/app.js fait le routage et la relecture de session. client/shell.js et navigation.js partagent la capsule, le menu et les retours. Chaque page appelle client/http.js. Le CSS client contient les médias de découverte et des styles compte/transaction/message/propriétaire qui demandent une portée stricte. ui/components.js, ui/tokens.css et ui/base.css sont partagés avec admin.
- API mock Node 24 dans api/server.mjs et api/router.mjs; les modules rentals, vehicles, documents, communication, cases, finance appliquent les gardes. Stockage JSON et profils fictifs, sessions et reprise. scripts/web.mjs sert chaque frontend et relaie l’API. scripts/dev.mjs démarre 8080, 8081 et 3001. compose.yaml orchestre les trois services pour la CI.
- api/access.mjs limite participants, ressources et habilitations. Les cookies et pages Admin restent distincts avec notes internes, modération assignée, gouvernance et droits finance spécifiques.
- L’audit a examiné reproductions publiques, compte, listes d’activité, actions de location et constats, brouillon et envoi, messagerie et reprise, parc/calendrier, assistance, permissions et workflows. Les captures d’exécution sur Chrome incluent trois pages publiques, puis 23 scènes par largeur (390 et 1440). Les cas transactionnels sont aussi couverts par les tests existants.

## Historique Git

| PR | SHA fusion | Portée observée |
| --- | --- | --- |
| [#12](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/12) | c46ba41 | Kit V3.2 initial et fichiers de provenance. |
| [#13](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/13) | ed79e3c | Baseline Git, captures, réglages CI et preuves. |
| [#14](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/14) | 6e2433e | Tokens et composants V3.2, page de verre, fallback opaque. |
| [#15](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/15) | f6e0d85 | Assets runtime autorisés, manifestes et crédits, identité de modèle. |
| [#16](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/16) | 12aca69 | Capsule publique et premier écran. |
| [#17](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/17) | f3918e8 | Sections d’accueil, recherche, cadran, liens et media. |
| [#18](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/18) | e6a16d1 | Catalogue, grille, résumé, tiroir et filtres. |
| [#19](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/19) | 39f2cdc | Fiche et galerie V3.2, retour exact, conditions. |
| [#20](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/20) | 9d8ab7a | Navigation par rôle, session et retours. |
| [#21](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/21) | 5876be8 | Couche opérationnelle V3.2 et isolation CSS. |
| [#22](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/22) | 4338f5f | Test clavier à 1280 et recette historique. |

## Contrôles réellement effectués

| Contrôle | Résultat |
|---|---|
| npm run check, npm test | 78 modules et documents d’audit cohérents, 50 tests Node passés. |
| Python / expurgation | 2 tests Python passés. |
| Démarrage Node local et npm run smoke | Client 8080, Admin 8081, API 3001, routes et assets OK sur fichier jetable. |
| Playwright 1.56.1, Chromium 141.0.7390.37 | Suite standard 173/174. Seul le tiroir catalogue 880 → 390 échoue. Répétition isolée 4 échecs sur 8, sans changement de code. |
| Audit des profils | 11/11, dont les quatre essentiels. Instances séparées. |
| Captures ciblées Chromium | 24 PNG protégés aux huit largeurs + 46 observations des espaces client. Aucun débordement sur ces 70 premiers écrans et aucune exception JS détectée dans cette capture. |
| GitHub Actions | Run 44790599088 sur main conclu success; la suite UI et l’audit essentiel ont un mode souple par défaut. Lire le bilan par étape. |
| Non vérifié localement | Docker/Compose récents, appareils physiques, lecteurs d’écran, zoom et contraste de l’extension future. Docker/Compose absent. |

Le Chromium système a échoué à s’initialiser dans ce conteneur (socket non autorisée). L’exécution utile s’est faite ensuite avec le Chromium headless épinglé par Playwright. Les données utilisées sont exclusivement les fixtures fictives du projet. Les deux documents comptent 12 et 49 pages; leurs références, limites et arbitrages sont détaillés dans [le registre PDF](../00_SOURCE_OF_TRUTH/INDEX_PDF.md).

[Run GitHub Actions](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/44790599088) · [PR #22](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/22)
