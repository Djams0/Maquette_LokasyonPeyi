# Création, déclaration et reprise propriétaire

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [11_Declaration_proprietaire](../01_REFERENCES/target_ui/11_Declaration_proprietaire.png)
- [16_Parc_proprietaire](../01_REFERENCES/target_ui/16_Parc_proprietaire.png)
- [L16-brouillon](../01_REFERENCES/current_ui/L16-brouillon.png)

## Intégration

- Routes : `/owner/start`, `/owner/vehicles/new`
- Fichiers maquette : client/pages/wizard.js · client/pages/owner.js · /owner/draft
- État observé : Le mock a neuf étapes et sauvegarde un champ step. Sans ?step, l’assistant ouvre l’étape 1. Les nouvelles saisies non enregistrées disparaissent au rechargement.

## Composition

Quatre sections visuelles : Véhicule, État et photos, Disponibilité et prix, Revue et envoi. Conserver les neuf groupes et le niveau de granularité de sauvegarde nécessaire.

## Comportements

Mapper 1/3, 4/5, 7/8, 2/6/9 dans cet ordre de sections. Garder les anciennes URL et réouvrir au bon groupe de travail. Distinguer saisie locale et sauvegarde confirmée. Brouillon local par compte et étape, sans documents. Une version affichée doit venir de l’API. Si le mock ne fournit pas de version fiable, prévenir de la limite et éviter d’annoncer une résolution concurrente atomique.

## États

Saisie locale, dernière étape enregistrée, échec de sauvegarde, conflit si observable, sous revue et rejet. Les trois pièces et les validations de sécurité restent obligatoires dans le scénario existant.

## Recette ciblée

Reprendre aux neuf étapes historiques et exercer perte réseau, actualisation, retour parc, changement de compte et soumission avec étapes incomplètes.
