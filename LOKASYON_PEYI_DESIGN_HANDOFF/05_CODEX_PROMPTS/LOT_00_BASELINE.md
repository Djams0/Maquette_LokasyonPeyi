# Lot 00 · Audit technique et baseline

## A. Mission

Agis comme UX Engineer et Frontend Tech Lead de Lokasyon Péyi. Établir l’état reproductible de la maquette et les chemins d’intégration. Produire uniquement des notes et des preuves de recette. Exécute uniquement ce lot.

## B. Contexte

Cible : `Djams0/Maquette_LokasyonPeyi`. Entrée : origin/main de la maquette, après vérification de son dernier SHA. `Djams0/LokasyonPeyi` est la référence métier et technique en lecture. Le handoff a été établi sur maquette `d8ef845` et principal `78966c9`. Relis les instructions et compare tout écart de version avant d’agir. Lis les chemins ci-dessous depuis la racine du kit extrait, qui peut être placée à côté du dépôt. Respecte les données et parcours fictifs existants.

## C. Références visuelles et fichiers à ouvrir

- [00_DECISIONS/DESIGN_DIRECTION.md](../00_DECISIONS/DESIGN_DIRECTION.md)
- [00_DECISIONS/PRODUCT_CONSTRAINTS.md](../00_DECISIONS/PRODUCT_CONSTRAINTS.md)
- [00_DECISIONS/OPEN_DECISIONS.md](../00_DECISIONS/OPEN_DECISIONS.md)
- [02_DESIGN_SYSTEM/DESIGN_SYSTEM.md](../02_DESIGN_SYSTEM/DESIGN_SYSTEM.md)
- [02_DESIGN_SYSTEM/COMPONENT_SPECS.md](../02_DESIGN_SYSTEM/COMPONENT_SPECS.md)
- [02_DESIGN_SYSTEM/GEOMETRIE_V2.md](../02_DESIGN_SYSTEM/GEOMETRIE_V2.md)
- [02_DESIGN_SYSTEM/tokens.css](../02_DESIGN_SYSTEM/tokens.css)
- [06_VALIDATION/REGRESSION_STRATEGY.md](../06_VALIDATION/REGRESSION_STRATEGY.md)
- [06_VALIDATION/ACCEPTANCE_CRITERIA.md](../06_VALIDATION/ACCEPTANCE_CRITERIA.md)
- [01_REFERENCES/source_pdf/Refonte_Haute_Fidelite_Lokasyon_Peyi.pdf](../01_REFERENCES/source_pdf/Refonte_Haute_Fidelite_Lokasyon_Peyi.pdf)
- [01_REFERENCES/source_pdf/Refonte_Mobile_First_Lokasyon_Peyi.pdf](../01_REFERENCES/source_pdf/Refonte_Mobile_First_Lokasyon_Peyi.pdf)
- [01_REFERENCES/README.md](../01_REFERENCES/README.md)
- [01_REFERENCES/Comparatif_Apercu.png](../01_REFERENCES/Comparatif_Apercu.png)
- [01_REFERENCES/finition/01_SPECIFICATION_CODEX.md](../01_REFERENCES/finition/01_SPECIFICATION_CODEX.md)
- [06_VALIDATION/VISUAL_TEST_MATRIX.md](../06_VALIDATION/VISUAL_TEST_MATRIX.md)
- [06_VALIDATION/BASELINE_OBSERVEE.md](../06_VALIDATION/BASELINE_OBSERVEE.md)
- [tools/verify_handoff.py](../tools/verify_handoff.py)
- [04_SCREEN_SPECS/explorer.md](../04_SCREEN_SPECS/explorer.md)
- [01_REFERENCES/target_ui/01_Explorer.png](../01_REFERENCES/target_ui/01_Explorer.png)
- [01_REFERENCES/current_ui/L01-accueil.png](../01_REFERENCES/current_ui/L01-accueil.png)
- [01_REFERENCES/current_ui/L23-accueil-ordinateur.png](../01_REFERENCES/current_ui/L23-accueil-ordinateur.png)
- [04_SCREEN_SPECS/search_results.md](../04_SCREEN_SPECS/search_results.md)
- [01_REFERENCES/target_ui/02_Resultats.png](../01_REFERENCES/target_ui/02_Resultats.png)
- [01_REFERENCES/target_ui/15_Filtres.png](../01_REFERENCES/target_ui/15_Filtres.png)
- [01_REFERENCES/current_ui/L02-resultats.png](../01_REFERENCES/current_ui/L02-resultats.png)
- [01_REFERENCES/current_ui/L03-filtres.png](../01_REFERENCES/current_ui/L03-filtres.png)
- [04_SCREEN_SPECS/vehicle_detail.md](../04_SCREEN_SPECS/vehicle_detail.md)
- [01_REFERENCES/target_ui/03_Fiche_vehicule.png](../01_REFERENCES/target_ui/03_Fiche_vehicule.png)
- [01_REFERENCES/target_ui/13_Illustration_modele.png](../01_REFERENCES/target_ui/13_Illustration_modele.png)
- [01_REFERENCES/current_ui/L04-fiche.png](../01_REFERENCES/current_ui/L04-fiche.png)
- [01_REFERENCES/current_ui/L05-fiche-reserver.png](../01_REFERENCES/current_ui/L05-fiche-reserver.png)
- [04_SCREEN_SPECS/conversation.md](../04_SCREEN_SPECS/conversation.md)
- [01_REFERENCES/target_ui/08_Conversation_location.png](../01_REFERENCES/target_ui/08_Conversation_location.png)
- [01_REFERENCES/target_ui/09_Conversation_avant_demande.png](../01_REFERENCES/target_ui/09_Conversation_avant_demande.png)
- [01_REFERENCES/current_ui/L15-composition.png](../01_REFERENCES/current_ui/L15-composition.png)
- [01_REFERENCES/current_ui/L28-message-recu.png](../01_REFERENCES/current_ui/L28-message-recu.png)
- [04_SCREEN_SPECS/owner_publication.md](../04_SCREEN_SPECS/owner_publication.md)
- [01_REFERENCES/target_ui/11_Declaration_proprietaire.png](../01_REFERENCES/target_ui/11_Declaration_proprietaire.png)
- [01_REFERENCES/target_ui/16_Parc_proprietaire.png](../01_REFERENCES/target_ui/16_Parc_proprietaire.png)
- [01_REFERENCES/current_ui/L16-brouillon.png](../01_REFERENCES/current_ui/L16-brouillon.png)
- [04_SCREEN_SPECS/administration.md](../04_SCREEN_SPECS/administration.md)
- [01_REFERENCES/target_ui/12_File_admin.png](../01_REFERENCES/target_ui/12_File_admin.png)
- [01_REFERENCES/target_ui/20_Decision_admin.png](../01_REFERENCES/target_ui/20_Decision_admin.png)
- [01_REFERENCES/current_ui/L19-admin.png](../01_REFERENCES/current_ui/L19-admin.png)
- [01_REFERENCES/current_ui/L21-admin-moderation.png](../01_REFERENCES/current_ui/L21-admin-moderation.png)
- [01_REFERENCES/current_ui/L24-admin-320.png](../01_REFERENCES/current_ui/L24-admin-320.png)

## D. État actuel et fichiers à examiner

Inspecter `package.json`, `.github/workflows/ci.yml`, `compose.yaml`, `scripts/historical-run.mjs`, `tests/`, `client/app.js`, `admin/app.js`, `api/router.mjs`, `api/server.mjs`, `ui/components.js` et `docs/audit/`. Identifier les changements en cours via Git, le shell, les routes, les composants, les gardes et les données de chaque scénario.

## E. Résultat attendu

Cartographier les fichiers et les routes pour chaque écran. Relever les sélecteurs sémantiques, tailles, dates de fixture, retours, états et dépendances. Générer une baseline des sept largeurs et documenter les écarts connus. Faire relire tout échec après une relance ciblée sur environnement isolé.

## F. Règles UX

Jouer visiteur, locataire, propriétaire et agents. Réexercer le parcours depuis la recherche jusqu’au retour, les deux sessions de messagerie et les chemins de refus.

## G. Règles UI

Photographier état et taille du viewport, garder le même moteur et distinguer images du dépôt, sources cibles et référence de finition.

## H. Contraintes techniques

Aucune modification d’application ou de fixtures. Rapport local hors dépôt par défaut. Si un commit documentaire est prévu, limiter le diff à la documentation autorisée. Préserve les scénarios historiques et d’audit, la stack, les contrôles et sessions existants. Pour un changement de libellé volontaire, adapte le sélecteur historique correspondant sans affaiblir l’assertion. Toute décision ouverte reste identifiée dans le rapport.

## I. Tests

Exécuter tous les contrôles de la stratégie. Consigner Docker/Compose indisponible le cas échéant. Couvrir les neuf profils historiques et les trente profils audit via les tests ou préciser le périmètre vérifié. Rejoue au minimum les contrôles de la stratégie commune. Vérifie les suites concernées sur une instance neuve et note les commandes réellement exécutées.

## J. Critères d’acceptation

SHA et version Node/Chromium, inventaire de routes et captures sept largeurs, résultats réels et échecs préexistants datés. `git diff --exit-code` sur application et tests. Documente chaque écart visuel et fonctionnel observé avec une preuve et son statut. Un test manquant reste signalé.

## K. Git

Branche dédiée `peyi/lot-00-baseline` depuis origin/main de la maquette, après vérification de son dernier SHA. Contrôler `git status`, le SHA de base et les changements de l’utilisateur. Préserver `main` et les protections. Commits limités au lot et PR de revue si le mode Git de la mission l’autorise, sans fusion automatique. En mode local, fournir le diff ou le commit et le texte de PR. Le lot peut rester sans commit et sans PR si les preuves sont hors dépôt. Le lot 01 pourra alors repartir directement de la base observée.

## L. Livrable final

Remets le SHA de base et celui de travail si applicable, les chemins modifiés, le bilan des commandes avec résultats, des captures comparables, les écarts résiduels et les points à arbitrer. Donne le lien de PR seulement si elle existe. Arrête-toi à la livraison de ce lot.
