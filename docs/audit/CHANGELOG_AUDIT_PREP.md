# Changements de préparation

| Fichiers | Justification |
|---|---|
| `api/audit-fixture.mjs` | 30 comptes additionnels, ressources et états atteignables, dates/IDs déterministes, abus synthétiques réservés |
| `api/store.mjs` | Injection facultative du seed, défaut historique conservé |
| `api/server.mjs` | Injection fixture/origines exactes pour tests locaux, validation de cible jetable au lancement audit, refus en production, compte actif avant réponse idempotente cachée |
| `api/router.mjs` | Métadonnées descriptives de profils ; périmètre utilisateurs explicite et fallback historique limité |
| `scripts/audit-environment.mjs`, `scripts/audit-run.mjs` | Création et vérification de cibles jetables sans opération de suppression |
| `scripts/historical-run.mjs` | Campagne historique propre pour les tests séquentiels sans toucher au JSON existant |
| `scripts/web.mjs` | Journal du port réellement choisi, permet les proxys de test éphémères |
| `client/pages/audit.js`, `client/app.js`, `client/pages/demo.js` | Atelier optionnel /demo/audit et lien depuis /demo, sélection par catégorie sans refonte |
| `admin/pages/dashboard.js` | Description du périmètre des profils ajoutés et indication suspendu dans le sélecteur existant |
| `tests/audit.test.mjs` | Neuf contrôles supplémentaires de population, cohérence, autorisations, séparation, suspension, isolation et catalogue |
| `tests/audit-browser/profiles.spec.js` | API neuve et proxys propres par test ; quatre profils représentatifs et sept largeurs |
| `tests/test_evidence.py` | Deux tests d’expurgation des cookies, en-têtes et archives imbriquées |
| `playwright.config.js` | Ajout JSON et vidéo sur échec ; tests et largeurs historiques intacts |
| `playwright.audit.config.js` | Configuration de campagne audit réutilisant Playwright, un worker et moteurs optionnels explicites |
| `scripts/audit-evidence.mjs`, `scripts/sanitize-evidence.py` | Manifeste commit/résultats et expurgation avant partage des preuves natives |
| `.github/workflows/ci.yml` | Quatre profils essentiels par PR, campagne complète à la demande, projet Compose unique par job, upload seulement après expurgation |
| `package.json` | Commandes de campagne, navigateur et génération documentaire ; contrôle des docs dans check |
| `docs/audit/scenarios.mjs`, `scripts/audit-docs.mjs` | Catalogue structuré de 108 scénarios et génération vérifiable des personas/matrice/guide de scénarios |
| `docs/audit/*.md`, `README.md` | Guides Work, couverture, limites et comparaison avant/après ; suppression des conseils de reset destructif local |
| `.gitignore`, `.dockerignore` | Exclure clones de lecture, preuves et caches Python ; éviter leur inclusion dans les images |

Les tests historiques, la stack, les ports usuels, les écrans métier, les règles de location et le dépôt principal ne sont pas réécrits. Les valeurs des simulations ne constituent aucune décision produit.
