# Locations, suivi, remise et retour

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [06_Suivi_location](../01_REFERENCES/target_ui/06_Suivi_location.png)
- [L07-locations](../01_REFERENCES/current_ui/L07-locations.png)
- [L08-acceptee](../01_REFERENCES/current_ui/L08-acceptee.png)
- [L11-constat](../01_REFERENCES/current_ui/L11-constat.png)
- [L26-paiement-refuse](../01_REFERENCES/current_ui/L26-paiement-refuse.png)

## Intégration

- Routes : `/rentals`, `/rental/:id`, `/inspection/:id/:phase`
- Fichiers maquette : client/pages/rentals.js · client/pages/inspection.js
- État observé : Les transitions existent et sont séparées, les actions sont distribuées dans plusieurs sections.

## Composition

Carte prochaine action, statut, acteur attendu, progression, accès au constat, conversation et assistance.

## Comportements

Mapper les états serveur un par un. Si l’autre partie agit, l’interface indique l’attente. Départ, retour déclaré, récupération et clôture restent distincts. Reprendre les contrôles existants pour caution, photos, remises et réserves.

## États

En attente, accepté, confirmé, en cours, retour déclaré, récupéré, clôturé, refusé et retiré. Repli accessible si erreur de chargement.

## Recette ciblée

Le CTA affiché correspond au rôle et à la transition permise. Rejouer le cycle historique, des deux rôles, jusqu’à l’avis et au reçu.
