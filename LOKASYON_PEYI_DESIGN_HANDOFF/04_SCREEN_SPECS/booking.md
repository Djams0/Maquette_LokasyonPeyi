# Demande et récapitulatif

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [05_Recapitulatif](../01_REFERENCES/target_ui/05_Recapitulatif.png)
- [L06-demande](../01_REFERENCES/current_ui/L06-demande.png)
- [L09-paiement](../01_REFERENCES/current_ui/L09-paiement.png)

## Intégration

- Routes : `/request/:id`, `/payment/:id`
- Fichiers maquette : client/pages/rentals.js · client/pages/catalog.js
- État observé : Le mock sépare la demande, l’accord et le paiement. Le récapitulatif s’appuie sur un brouillon de réservation.

## Composition

Rappel véhicule, période modifiable, déclaration s’il y en a une, prix avec unité et caution distincte. Un CTA principal et un résumé d’engagement.

## Comportements

Garder le véhicule et le brouillon en retour depuis la modification. Vérifier la cohérence des dates au submit selon contrat. Un prix incertain reste indiqué comme tel. Garder le parcours de connexion et le retour. Activer une seule fois le bouton pendant l’appel.

## États

Conflit d’intervalle, brouillon absent, accès interdit, demande en attente, refus, paiement simulé refusé et reprise.

## Recette ciblée

Comparer les données de fiche, récapitulatif et demande. Vérifier absence de débit à la demande dans le scénario, puis paiement post-accord et refus rejouable.
