# Fiche véhicule et galerie

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [03_Fiche_vehicule](../01_REFERENCES/target_ui/03_Fiche_vehicule.png)
- [13_Illustration_modele](../01_REFERENCES/target_ui/13_Illustration_modele.png)
- [L04-fiche](../01_REFERENCES/current_ui/L04-fiche.png)
- [L05-fiche-reserver](../01_REFERENCES/current_ui/L05-fiche-reserver.png)

## Intégration

- Routes : `/vehicle/:id`
- Fichiers maquette : client/pages/catalog.js · ui/components.js
- État observé : La fiche initialise ses propres dates et pousse la demande sous les détails. La galerie ouvre un dialogue dont le nom doit être vérifié.

## Composition

Grande photo avec compteur, modèle et zone, trois caractéristiques au plus, période éditable, état du véhicule puis caractéristiques et règles. Barre total/action fixe en mobile et résumé latéral si lisible en large.

## Comportements

Galerie nommée, bouton Fermer, navigation Précédente/Suivante, Échap et retour du focus. Le focus n’est jamais recouvert par la barre. Conserver les dates du contexte. Dégrader proprement si accès direct ou date expirée. Les images illustratives se chargent hors galerie, via une action secondaire.

## États

Photos manquantes, galerie à un élément, défaut non renseigné, devis indisponible et refus de chargement. Le recadrage de liste n’est pas utilisé pour l’examen du défaut.

## Recette ciblée

À 390 px, action de demande immédiatement visible avec fixture datée. À 320 px et 200 % de zoom, contrôles et contenu restent atteignables. La photo de détail reste entière.
