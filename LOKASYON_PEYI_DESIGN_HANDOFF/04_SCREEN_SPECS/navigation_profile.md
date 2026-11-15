# Navigation, profil et accès démo

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [01_Explorer](../01_REFERENCES/target_ui/01_Explorer.png)
- [07_Boite_messages](../01_REFERENCES/target_ui/07_Boite_messages.png)
- [10_Dashboard_proprietaire](../01_REFERENCES/target_ui/10_Dashboard_proprietaire.png)
- [L12-profil](../01_REFERENCES/current_ui/L12-profil.png)
- [L13-notifications](../01_REFERENCES/current_ui/L13-notifications.png)

## Intégration

- Routes : `/profile`, `/notifications`, `/demo`, `/demo/audit`, `/login`
- Fichiers maquette : client/shell.js · client/app.js · client/pages/account.js · client/pages/audit.js
- État observé : Le shell a déjà une barre basse et d’autres entrées. Le changement de profil est un outil de simulation.

## Composition

Quatre destinations : Explorer, Locations, Messages, Profil. Notifications, Documents, Aide et Espace propriétaire restent accessibles depuis les surfaces pertinentes.

## Comportements

Les parcours dédiés utilisent retour contextuel et bandeau d’action. Garder tous les accès historiques par liens explicites. Les badges et états actifs sont nommés. Séparer Client et Admin. Préserver les liens directs vers démo et atelier même en panne simulée.

## États

Visiteur, locataire, propriétaire, compte changé, session expirée et URL 404.

## Recette ciblée

Depuis chaque rôle, parcourir quatre entrées puis récupérer un itinéraire historique. Tester séparément les cookies Admin.
