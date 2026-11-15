# File et décision Admin

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [12_File_admin](../01_REFERENCES/target_ui/12_File_admin.png)
- [20_Decision_admin](../01_REFERENCES/target_ui/20_Decision_admin.png)
- [L19-admin](../01_REFERENCES/current_ui/L19-admin.png)
- [L21-admin-moderation](../01_REFERENCES/current_ui/L21-admin-moderation.png)
- [L24-admin-320](../01_REFERENCES/current_ui/L24-admin-320.png)

## Intégration

- Routes : `Admin /`, `Admin /moderation`, `Admin /moderation/documents/:id`, `Admin /cases`, `Admin /payments`
- Fichiers maquette : admin/pages/dashboard.js · admin/pages/moderation.js · admin/pages/operations.js · admin/pages/governance.js · admin/shell.js
- État observé : Files et validations documentaires, financières et habilitations existent sous un shell distinct.

## Composition

Priorité et motif en tête, identité du dossier et version. Cartes mobiles. Tableau ou grille lisible sur large, détails et décision explicitement séparés.

## Comportements

Filtrer sur états réellement fournis. Une action sensible reste soumise aux permissions serveur, affectation, version et deuxième validation. En cas de version obsolète, recharger puis réexaminer. Garder les notes internes hors du fil utilisateur.

## États

Dossier affecté/hors périmètre, suspendu, version courante/remplacée, revue requise, refus et seconde validation.

## Recette ciblée

Rejouer les contrôles agent limité, Admin, Super Admin et agent suspendu. Vérifier ordre de lecture à 320 px et absence de décision sur version obsolète.
