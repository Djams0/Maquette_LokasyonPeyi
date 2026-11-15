# Aujourd’hui, parc, annonce, calendrier et demandes

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [10_Dashboard_proprietaire](../01_REFERENCES/target_ui/10_Dashboard_proprietaire.png)
- [16_Parc_proprietaire](../01_REFERENCES/target_ui/16_Parc_proprietaire.png)
- [17_Gestion_annonce](../01_REFERENCES/target_ui/17_Gestion_annonce.png)
- [18_Calendrier](../01_REFERENCES/target_ui/18_Calendrier.png)
- [19_Demande_proprietaire](../01_REFERENCES/target_ui/19_Demande_proprietaire.png)
- [L17-proprietaire](../01_REFERENCES/current_ui/L17-proprietaire.png)
- [L18-calendrier](../01_REFERENCES/current_ui/L18-calendrier.png)

## Intégration

- Routes : `/owner`, `/owner/vehicles`, `/owner/vehicles/:id`, `/owner/requests`
- Fichiers maquette : client/pages/owner.js · client/shell.js
- État observé : Le parc, les actions de disponibilité et les demandes existent. Les liens et le parcours d’activation sont fonctionnels.

## Composition

Aujourd’hui, compteurs utiles, demandes et brouillons, cartes parc et raccourcis calendrier/annonce. Calendrier avec lecture en liste à 320 px.

## Comportements

Action prioritaire tirée de l’état et des droits. Conserver revenus, réputation, règles de blocage/libération et navigation propriétaire. Aucun accès au parc d’un autre compte.

## États

Parc vide, brouillon, revue, en ligne, modifications demandées, pause, demande en attente, conflit de dates et erreurs.

## Recette ciblée

Déposer puis reprendre un brouillon depuis le parc, passer au calendrier, bloquer/libérer, vérifier les demandes et un accès croisé refusé.
