# Lot 03 · Accueil et découverte

## A. Mission

Agis comme UX Engineer et Frontend Tech Lead de Lokasyon Péyi. Recomposer Explorer autour de la recherche et des véhicules à partir de la référence PNG 01. Exécute uniquement ce lot.

## B. Contexte

Cible : `Djams0/Maquette_LokasyonPeyi`. Entrée : lots 01 et 02 intégrés. `Djams0/LokasyonPeyi` est la référence métier et technique en lecture. Le handoff a été établi sur maquette `d8ef845` et principal `78966c9`. Relis les instructions et compare tout écart de version avant d’agir. Lis les chemins ci-dessous depuis la racine du kit extrait, qui peut être placée à côté du dépôt. Respecte les données et parcours fictifs existants.

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
- [03_ASSETS/vehicles/citadine-verte-avant-420.webp](../03_ASSETS/vehicles/citadine-verte-avant-420.webp)
- [03_ASSETS/vehicles/citadine-verte-avant-836.webp](../03_ASSETS/vehicles/citadine-verte-avant-836.webp)
- [04_SCREEN_SPECS/explorer.md](../04_SCREEN_SPECS/explorer.md)
- [01_REFERENCES/target_ui/01_Explorer.png](../01_REFERENCES/target_ui/01_Explorer.png)
- [01_REFERENCES/current_ui/L01-accueil.png](../01_REFERENCES/current_ui/L01-accueil.png)
- [01_REFERENCES/current_ui/L23-accueil-ordinateur.png](../01_REFERENCES/current_ui/L23-accueil-ordinateur.png)

## D. État actuel et fichiers à examiner

Reprendre `home()`, `searchBox()` et le rendu carte dans `client/pages/catalog.js`. Inventorier l’usage de `recent-search`, les liens et le catalogue public.

## E. Résultat attendu

En-tête court, titre éditorial, lieu et dates avec action, première carte, puis accès secondaire à la procédure et au parcours propriétaire. Charger des photos sélectionnées par identité de fixture.

## F. Règles UX

Lancer la recherche au clavier, reprendre une recherche validée, traiter chargement, vide et erreur sans bloquer les liens et l’action principale.

## G. Règles UI

Photo responsive 16:9, dimensions réservées, une seule image dominante. Première carte amorcée à 390 × 844. Lora sur le titre, Nunito pour actions et métadonnées.

## H. Contraintes techniques

Utiliser le catalogue existant. Garder les prix et lieux de l’API. Si un véhicule ne correspond à aucun média du manifeste, utiliser son SVG de maquette existant. Préserve les scénarios historiques et d’audit, la stack, les contrôles et sessions existants. Pour un changement de libellé volontaire, adapte le sélecteur historique correspondant sans affaiblir l’assertion. Toute décision ouverte reste identifiée dans le rapport.

## I. Tests

Capturer visiteur et compte fictif, réseau lent et zéro véhicule. Vérifier à 320, 390 et 1440, puis recherche et navigation. Rejoue au minimum les contrôles de la stratégie commune. Vérifie les suites concernées sur une instance neuve et note les commandes réellement exécutées.

## J. Critères d’acceptation

Premier bouton et haut de la première photo visibles à 390 × 844 avec fixture, recherche ouverte aux visiteurs, reprise compatible et aucun asset externe. Documente chaque écart visuel et fonctionnel observé avec une preuve et son statut. Un test manquant reste signalé.

## K. Git

Branche dédiée `peyi/lot-03-explorer` depuis lots 01 et 02 intégrés. Contrôler `git status`, le SHA de base et les changements de l’utilisateur. Préserver `main` et les protections. Commits limités au lot et PR de revue si le mode Git de la mission l’autorise, sans fusion automatique. En mode local, fournir le diff ou le commit et le texte de PR.

## L. Livrable final

Remets le SHA de base et celui de travail si applicable, les chemins modifiés, le bilan des commandes avec résultats, des captures comparables, les écarts résiduels et les points à arbitrer. Donne le lien de PR seulement si elle existe. Arrête-toi à la livraison de ce lot.
