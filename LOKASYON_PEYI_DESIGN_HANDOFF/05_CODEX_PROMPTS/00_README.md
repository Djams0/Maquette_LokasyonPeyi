# Prompts Codex dans l’ordre

Extraire le kit dans un dossier accessible à Codex, de préférence à côté du dépôt. Envoyer un seul fichier à la fois avec le chemin absolu du kit et du dépôt. Les liens de chaque prompt s’ouvrent hors ligne. Les fichiers de code cités sont ceux du dépôt cible.

| Lot | Fichier | Branche | Entrée |
|---|---|---|---|
| 00 | [Audit technique et baseline](LOT_00_BASELINE.md) | `peyi/lot-00-baseline` | origin/main de la maquette, après vérification de son dernier SHA |
| 01 | [Fondations et composants](LOT_01_DESIGN_SYSTEM.md) | `peyi/lot-01-design-system` | baseline 00 relue, base applicative origin/main actualisée |
| 02 | [Navigation mobile-first](LOT_02_NAVIGATION.md) | `peyi/lot-02-navigation` | lot 01 intégré à la base approuvée |
| 03 | [Accueil et découverte](LOT_03_EXPLORER.md) | `peyi/lot-03-explorer` | lots 01 et 02 intégrés |
| 04 | [Recherche et continuité du contexte](LOT_04_SEARCH.md) | `peyi/lot-04-search` | lot 03 intégré et points de bascule 02 stables |
| 05 | [Fiche, galerie et transparence](LOT_05_VEHICLE.md) | `peyi/lot-05-vehicle` | lot 04 intégré avec continuité démontrée |
| 06 | [Demande, réservation et suivi](LOT_06_BOOKING.md) | `peyi/lot-06-booking` | lot 05 intégré |
| 07 | [Boîte de réception et conversations](LOT_07_MESSAGING.md) | `peyi/lot-07-messaging` | lot 06 intégré et lien de contexte disponible lorsque le mock le fournit |
| 08 | [Interfaces propriétaire et administration](LOT_08_OWNER_ADMIN.md) | `peyi/lot-08-owner` | lot 07 intégré. Créer une sous-branche séparée pour Admin après revue du sous-lot propriétaire |
| 09 | [Recette visuelle et UX/UI](LOT_09_VISUAL_QA.md) | `peyi/lot-09-visual-qa` | lots précédents intégrés, incluant 08A et 08B |

Pour le lot 08, envoyer le fichier une première fois pour 08A. Après revue, le renvoyer en précisant 08B.
