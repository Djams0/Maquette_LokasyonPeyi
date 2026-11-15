# État du véhicule et transparence

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [04_Defaut_detail](../01_REFERENCES/target_ui/04_Defaut_detail.png)
- [11_Declaration_proprietaire](../01_REFERENCES/target_ui/11_Declaration_proprietaire.png)
- [L04-fiche](../01_REFERENCES/current_ui/L04-fiche.png)
- [L16-brouillon](../01_REFERENCES/current_ui/L16-brouillon.png)

## Intégration

- Routes : `/vehicle/:id`, `/owner/vehicles/new`
- Fichiers maquette : client/pages/catalog.js · client/pages/wizard.js · client/pages/inspection.js
- État observé : Les pièces de vérification et les constats existent. L’annonce actuelle ne fournit pas un modèle métier complet de défaut déclaré.

## Composition

Bloc État, source « Déclaré par le propriétaire », date ou version disponible, zone et photo associée. Écran détail avec vue de situation si disponible puis gros plan. Section propriétaire distincte.

## Comportements

Afficher « État non renseigné » si la donnée manque. Déclaration, contrôle documentaire et constats sont présentés selon leur source. L’exemple déclaratif reste une fixture d’interface identifiée. Garder les contrôles et les pièces existantes. Un contrôle de document ne justifie aucune mention d’état physique.

## États

Absence de déclaration, déclaration vide confirmée, photo absente, défaut déclaré, version à revoir et accès limité aux constats. Suivre les décisions ouvertes pour toute action de modération.

## Recette ciblée

Lire la source et la zone au clavier. Vérifier une annonce sans donnée, une avec défaut démo, une pièce contrôlée et deux constats datés.
