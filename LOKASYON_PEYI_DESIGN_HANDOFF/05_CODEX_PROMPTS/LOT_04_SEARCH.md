# Lot 04 · Recherche et continuité du contexte

## A. Mission

Agis comme UX Engineer et Frontend Tech Lead de Lokasyon Péyi. Corriger la perte du contexte et implémenter résultats, carte, tri et filtres. Exécute uniquement ce lot.

## B. Contexte

Cible : `Djams0/Maquette_LokasyonPeyi`. Entrée : lot 03 intégré et points de bascule 02 stables. `Djams0/LokasyonPeyi` est la référence métier et technique en lecture. Le handoff a été établi sur maquette `d8ef845` et principal `78966c9`. Relis les instructions et compare tout écart de version avant d’agir. Lis les chemins ci-dessous depuis la racine du kit extrait, qui peut être placée à côté du dépôt. Respecte les données et parcours fictifs existants.

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
- [03_ASSETS/ASSET_MANIFEST.md](../03_ASSETS/ASSET_MANIFEST.md)
- [03_ASSETS/asset-manifest.json](../03_ASSETS/asset-manifest.json)
- [03_ASSETS/illustrations/catalogue-vide.svg](../03_ASSETS/illustrations/catalogue-vide.svg)
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

## D. État actuel et fichiers à examiner

Cartographier `q`, `from`, `until`, `category`, `max`, `gearbox`, `fuel`, `seats`, `equipment`, `sort`, `view` de `client/pages/catalog.js`. Distinguer état UI de panneau et paramètres API.

## E. Résultat attendu

URL canonique sur clés admises, résumé éditable, filtre appliqué, liste et carte schématique. Propager le contexte à chaque fiche et reconstruire Retour vers la recherche locale. Régler ici le préremplissage sur fiche avant le lot visuel 05.

## F. Règles UX

Conserver période, tri, filtre, mode et contexte de retour après navigation et reload. Distinguer annuler, réinitialiser filtres et modifier les dates. Traiter URL et date invalides sans remplacer silencieusement une période.

## G. Règles UI

Carte 16:9, filtre mobile nommable, panneau latéral sur large si lisible, prix et unité au même endroit et état sans résultat avec action de reprise.

## H. Contraintes techniques

Réutiliser paramètres serveur et mécanisme de date Guadeloupe. Ne pas envoyer de clés UI comme filtres métier. Aucun retour externe issu d’une URL utilisateur. Préserve les scénarios historiques et d’audit, la stack, les contrôles et sessions existants. Pour un changement de libellé volontaire, adapte le sélecteur historique correspondant sans affaiblir l’assertion. Toute décision ouverte reste identifiée dans le rapport.

## I. Tests

Automatiser recherche A→fiche→retour→fiche B, retour navigateur, actualisation, filtre, tri, carte, mauvais paramètre, date invalide et erreur API. Tester les sept largeurs. Rejoue au minimum les contrôles de la stratégie commune. Vérifie les suites concernées sur une instance neuve et note les commandes réellement exécutées.

## J. Critères d’acceptation

Les mêmes critères sont relus et appliqués de bout en bout, la fiche reçoit les bonnes dates, et le mode carte conserve une légende fictive. Documente chaque écart visuel et fonctionnel observé avec une preuve et son statut. Un test manquant reste signalé.

## K. Git

Branche dédiée `peyi/lot-04-search` depuis lot 03 intégré et points de bascule 02 stables. Contrôler `git status`, le SHA de base et les changements de l’utilisateur. Préserver `main` et les protections. Commits limités au lot et PR de revue si le mode Git de la mission l’autorise, sans fusion automatique. En mode local, fournir le diff ou le commit et le texte de PR.

## L. Livrable final

Remets le SHA de base et celui de travail si applicable, les chemins modifiés, le bilan des commandes avec résultats, des captures comparables, les écarts résiduels et les points à arbitrer. Donne le lien de PR seulement si elle existe. Arrête-toi à la livraison de ce lot.
