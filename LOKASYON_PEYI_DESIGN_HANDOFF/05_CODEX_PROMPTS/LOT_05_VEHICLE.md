# Lot 05 · Fiche, galerie et transparence

## A. Mission

Agis comme UX Engineer et Frontend Tech Lead de Lokasyon Péyi. Recomposer fiche, galerie, période, état du véhicule et barre d’action. Le rendu modèle est une option isolable. Exécute uniquement ce lot.

## B. Contexte

Cible : `Djams0/Maquette_LokasyonPeyi`. Entrée : lot 04 intégré avec continuité démontrée. `Djams0/LokasyonPeyi` est la référence métier et technique en lecture. Le handoff a été établi sur maquette `d8ef845` et principal `78966c9`. Relis les instructions et compare tout écart de version avant d’agir. Lis les chemins ci-dessous depuis la racine du kit extrait, qui peut être placée à côté du dépôt. Respecte les données et parcours fictifs existants.

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
- [03_ASSETS/vehicle_defects/citadine-verte-rayure-836.webp](../03_ASSETS/vehicle_defects/citadine-verte-rayure-836.webp)
- [03_ASSETS/optional_renders/citadine-verte-illustration-836.webp](../03_ASSETS/optional_renders/citadine-verte-illustration-836.webp)
- [04_SCREEN_SPECS/vehicle_detail.md](../04_SCREEN_SPECS/vehicle_detail.md)
- [01_REFERENCES/target_ui/03_Fiche_vehicule.png](../01_REFERENCES/target_ui/03_Fiche_vehicule.png)
- [01_REFERENCES/target_ui/13_Illustration_modele.png](../01_REFERENCES/target_ui/13_Illustration_modele.png)
- [01_REFERENCES/current_ui/L04-fiche.png](../01_REFERENCES/current_ui/L04-fiche.png)
- [01_REFERENCES/current_ui/L05-fiche-reserver.png](../01_REFERENCES/current_ui/L05-fiche-reserver.png)
- [04_SCREEN_SPECS/vehicle_condition.md](../04_SCREEN_SPECS/vehicle_condition.md)
- [01_REFERENCES/target_ui/04_Defaut_detail.png](../01_REFERENCES/target_ui/04_Defaut_detail.png)
- [01_REFERENCES/target_ui/11_Declaration_proprietaire.png](../01_REFERENCES/target_ui/11_Declaration_proprietaire.png)
- [01_REFERENCES/current_ui/L16-brouillon.png](../01_REFERENCES/current_ui/L16-brouillon.png)

## D. État actuel et fichiers à examiner

Examiner `vehicle()`, `modal()`, formulaire de disponibilité, images SVG et fixture `v1` dans `api/seed.mjs`. Vérifier les champs réellement fournis.

## E. Résultat attendu

Garder les photos pertinentes en tête. Rendre accessibles période, total quand fiable, état déclaré et CTA. Présenter une déclaration fictive associée explicitement à la fixture si le modèle de données ne la fournit pas, avec état non renseigné ailleurs.

## F. Règles UX

Galerie nommée, boutons, compteur, Échap, retour du focus et repli propre pour photo absente. Distinguer déclaration, contrôle et constat. Garder l’accès aux avis, règles, contact et zone autorisée.

## G. Règles UI

CTA sticky mobile qui se replie si focus masqué. Galerie 3:2, photo de défaut entière, vignette 64 si nécessaire. Option rendu fixe étiqueté hors galerie.

## H. Contraintes techniques

Préférer l’adaptateur de présentation ou fixture visuelle locale au changement d’API. Le mock ne certifie pas l’état physique. Préserver l’autorisation et les entrées en demande. Préserve les scénarios historiques et d’audit, la stack, les contrôles et sessions existants. Pour un changement de libellé volontaire, adapte le sélecteur historique correspondant sans affaiblir l’assertion. Toute décision ouverte reste identifiée dans le rapport.

## I. Tests

Tester galerie clavier, absence de photo, photo détaillée, état non renseigné, dates directes et issues des résultats, prix non calculable et zoom 200 %. Rejoue au minimum les contrôles de la stratégie commune. Vérifie les suites concernées sur une instance neuve et note les commandes réellement exécutées.

## J. Critères d’acceptation

Action visible dès le premier écran de référence, dates conservées, rôles des médias différenciés, aucune ressource de démonstration présentée comme preuve. Documente chaque écart visuel et fonctionnel observé avec une preuve et son statut. Un test manquant reste signalé.

## K. Git

Branche dédiée `peyi/lot-05-vehicle` depuis lot 04 intégré avec continuité démontrée. Contrôler `git status`, le SHA de base et les changements de l’utilisateur. Préserver `main` et les protections. Commits limités au lot et PR de revue si le mode Git de la mission l’autorise, sans fusion automatique. En mode local, fournir le diff ou le commit et le texte de PR.

## L. Livrable final

Remets le SHA de base et celui de travail si applicable, les chemins modifiés, le bilan des commandes avec résultats, des captures comparables, les écarts résiduels et les points à arbitrer. Donne le lien de PR seulement si elle existe. Arrête-toi à la livraison de ce lot.
