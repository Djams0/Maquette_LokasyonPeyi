# Boîte de réception

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [07_Boite_messages](../01_REFERENCES/target_ui/07_Boite_messages.png)
- [L14-messages](../01_REFERENCES/current_ui/L14-messages.png)

## Intégration

- Routes : `/messages`
- Fichiers maquette : client/pages/account.js · client/shell.js
- État observé : La liste et le fil sont dans la même vue et s’empilent sur mobile.

## Composition

Lignes ouvrables, interlocuteur et contexte, aperçu, date si disponible, non-lu textuel. Colonne gauche et fil à partir du seuil où chacun reste lisible.

## Comportements

Mobile : liste puis fil via le paramètre de conversation existant. Retour conserve l’entrée et les filtres. Le fil d’assistance est identifiable. Activer les filtres uniquement si la donnée nécessaire est disponible. Aucun compteur fictif de non-lus.

## États

Aucun fil, aucun résultat après filtre, session expirée et conversation devenue inaccessible.

## Recette ciblée

Ouvrir deux fils et revenir par l’interface et l’historique. Vérifier état actif, perte d’accès, aperçus et absence de débordement.
