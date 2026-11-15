# Recherche, résultats, carte et filtres

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [02_Resultats](../01_REFERENCES/target_ui/02_Resultats.png)
- [15_Filtres](../01_REFERENCES/target_ui/15_Filtres.png)
- [L02-resultats](../01_REFERENCES/current_ui/L02-resultats.png)
- [L03-filtres](../01_REFERENCES/current_ui/L03-filtres.png)

## Intégration

- Routes : `/search`
- Fichiers maquette : client/pages/catalog.js · ui/components.js
- État observé : Le formulaire se répète, la fiche et le lien de retour font perdre la période ou des filtres. La carte est schématique.

## Composition

Résumé éditable lieu, dates et heures, barre de filtres/carte, tri, cartes homogènes avec photos et repère de prix.

## Comportements

Choisir URL canonique validée comme source d’état. Transmettre à la fiche les paramètres connus et à Retour le chemin interne `/search` reconstruit. Retour navigateur, retour explicite et rechargement restaurent l’état. Position de liste mémorisable par recherche dans la session. Bouton Annuler ne change rien. Appliquer actualise les résultats. Les sélecteurs restent nommés et utilisables au clavier.

## États

Dates invalides, zéro résultat, filtre actif, échec API et changement liste/carte. Pas de promesse de prise en charge ou de disponibilité non renvoyée. Afficher prix/jour si aucun devis daté fiable.

## Recette ciblée

Ouvrir A puis B depuis la même recherche. Dates, filtre, tri et mode sont identiques après retour explicite, retour navigateur et rechargement. Vérifier lien direct et URL malformée.
