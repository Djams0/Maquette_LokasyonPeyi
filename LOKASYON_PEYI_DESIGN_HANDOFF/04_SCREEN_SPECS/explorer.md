# Explorer

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [01_Explorer](../01_REFERENCES/target_ui/01_Explorer.png)
- [L01-accueil](../01_REFERENCES/current_ui/L01-accueil.png)
- [L23-accueil-ordinateur](../01_REFERENCES/current_ui/L23-accueil-ordinateur.png)

## Intégration

- Routes : `/`
- Fichiers maquette : client/pages/catalog.js · client/shell.js
- État observé : Le formulaire et l’accroche repoussent la première voiture. Le catalogue est déjà public.

## Composition

Entête compact, titre Lora, formulaire lieu puis période, action Recherche, une carte photo et la barre basse.

## Comportements

À 390 × 844, le bouton et l’amorce de la photo sont visibles avec la fixture de référence. À 320 px les champs se replient. Afficher l’entrée propriétaire dans Profil et garder FAQ, notifications et accès démo.

## États

Chargement avec géométrie réservée, aucun véhicule avec recherche toujours disponible, erreur récupérable et photo de repli.

## Recette ciblée

À 390 px, vérifier que le bouton et le haut de la première carte entrent dans le viewport. Soumettre au clavier et retrouver les dates dans l’URL de résultats.
