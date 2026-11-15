# Lot 01 · Fondations et composants

## A. Mission

Agis comme UX Engineer et Frontend Tech Lead de Lokasyon Péyi. Installer tokens, typographie et contrats de composants en réutilisant les points d’entrée existants. Exécute uniquement ce lot.

## B. Contexte

Cible : `Djams0/Maquette_LokasyonPeyi`. Entrée : baseline 00 relue, base applicative origin/main actualisée. `Djams0/LokasyonPeyi` est la référence métier et technique en lecture. Le handoff a été établi sur maquette `d8ef845` et principal `78966c9`. Relis les instructions et compare tout écart de version avant d’agir. Lis les chemins ci-dessous depuis la racine du kit extrait, qui peut être placée à côté du dépôt. Respecte les données et parcours fictifs existants.

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
- [02_DESIGN_SYSTEM/design-tokens.json](../02_DESIGN_SYSTEM/design-tokens.json)
- [03_ASSETS/icons/README.md](../03_ASSETS/icons/README.md)
- [03_ASSETS/fonts/Nunito-OFL.txt](../03_ASSETS/fonts/Nunito-OFL.txt)
- [03_ASSETS/fonts/Lora-OFL.txt](../03_ASSETS/fonts/Lora-OFL.txt)
- [04_SCREEN_SPECS/explorer.md](../04_SCREEN_SPECS/explorer.md)
- [01_REFERENCES/target_ui/01_Explorer.png](../01_REFERENCES/target_ui/01_Explorer.png)
- [01_REFERENCES/current_ui/L01-accueil.png](../01_REFERENCES/current_ui/L01-accueil.png)
- [01_REFERENCES/current_ui/L23-accueil-ordinateur.png](../01_REFERENCES/current_ui/L23-accueil-ordinateur.png)
- [04_SCREEN_SPECS/vehicle_detail.md](../04_SCREEN_SPECS/vehicle_detail.md)
- [01_REFERENCES/target_ui/03_Fiche_vehicule.png](../01_REFERENCES/target_ui/03_Fiche_vehicule.png)
- [01_REFERENCES/target_ui/13_Illustration_modele.png](../01_REFERENCES/target_ui/13_Illustration_modele.png)
- [01_REFERENCES/current_ui/L04-fiche.png](../01_REFERENCES/current_ui/L04-fiche.png)
- [01_REFERENCES/current_ui/L05-fiche-reserver.png](../01_REFERENCES/current_ui/L05-fiche-reserver.png)
- [04_SCREEN_SPECS/administration.md](../04_SCREEN_SPECS/administration.md)
- [01_REFERENCES/target_ui/12_File_admin.png](../01_REFERENCES/target_ui/12_File_admin.png)
- [01_REFERENCES/target_ui/20_Decision_admin.png](../01_REFERENCES/target_ui/20_Decision_admin.png)
- [01_REFERENCES/current_ui/L19-admin.png](../01_REFERENCES/current_ui/L19-admin.png)
- [01_REFERENCES/current_ui/L21-admin-moderation.png](../01_REFERENCES/current_ui/L21-admin-moderation.png)
- [01_REFERENCES/current_ui/L24-admin-320.png](../01_REFERENCES/current_ui/L24-admin-320.png)

## D. État actuel et fichiers à examiner

Relever les consommateurs de `ui/tokens.css`, `ui/base.css`, `ui/components.js`, `client/styles/client.css`, `admin/styles/admin.css` et de la galerie locale `/design-system`.

## E. Résultat attendu

Intégrer tokens et alias compatibles. Appliquer aux boutons, champs, badges, cartes, dialogues et états. Si utile, utiliser le catalogue existant pour vérifier les variantes. Nommer le dialogue par son titre et préserver le focus au retour.

## F. Règles UX

Actions sémantiques, focus, champs avec erreurs associées, animations réduites, chargement stable et retour de focus.

## G. Règles UI

Cible 48, métadonnées 14, type 16/24, rayons 12/16/20, focus tokenisé et surfaces de statut. Réutiliser les fonts locales et les icônes du dépôt.

## H. Contraintes techniques

Pas de dépendance UI ni de changement de stack. Les alias nécessaires restent disponibles pour les pages qui migreront ensuite. Préserve les scénarios historiques et d’audit, la stack, les contrôles et sessions existants. Pour un changement de libellé volontaire, adapte le sélecteur historique correspondant sans affaiblir l’assertion. Toute décision ouverte reste identifiée dans le rapport.

## I. Tests

Recette des composants sur `/design-system` et un écran de chaque front. Tests API et sélections historique et audit, axe local si disponible. Rejoue au minimum les contrôles de la stratégie commune. Vérifie les suites concernées sur une instance neuve et note les commandes réellement exécutées.

## J. Critères d’acceptation

Couleurs source calculées égales aux tokens, composants sans débordement à 320 px, nom de dialogue et retour du focus vérifiés. Aucun état historique retiré. Documente chaque écart visuel et fonctionnel observé avec une preuve et son statut. Un test manquant reste signalé.

## K. Git

Branche dédiée `peyi/lot-01-design-system` depuis baseline 00 relue, base applicative origin/main actualisée. Contrôler `git status`, le SHA de base et les changements de l’utilisateur. Préserver `main` et les protections. Commits limités au lot et PR de revue si le mode Git de la mission l’autorise, sans fusion automatique. En mode local, fournir le diff ou le commit et le texte de PR.

## L. Livrable final

Remets le SHA de base et celui de travail si applicable, les chemins modifiés, le bilan des commandes avec résultats, des captures comparables, les écarts résiduels et les points à arbitrer. Donne le lien de PR seulement si elle existe. Arrête-toi à la livraison de ce lot.
