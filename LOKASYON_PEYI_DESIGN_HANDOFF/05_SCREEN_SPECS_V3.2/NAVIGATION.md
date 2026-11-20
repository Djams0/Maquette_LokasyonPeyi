# Navigation · PDF pages 4, 5 et 10

| Profil | Accès et gestion |
|---|---|
| Visiteur | Explorer, aide, compte/connexion et menu. La V3.2 supprime les entrées privées dans la navigation visiteur. Un accès direct à une route privée reste géré par le routeur existant. |
| Locataire | Explorer, locations, messages, profil/documents selon compte. Les actions liées à une réservation conservent les règles de l’API et le retour vers la fiche après connexion. |
| Propriétaire | Conserver les fonctions locataire compatibles. Accès « Espace propriétaire » vers le parc et les demandes; aucun CTA d’activation si la capacité est déjà acquise. |
| Agent interne | Façade admin indépendante, menus calculés sur les permissions. Les actions finance/documents/gouvernance ne changent pas. |

`client/shell.js` possède la capsule, les liens par session, le skip link, la position de barre basse, le dialogue et la réconciliation tardive de session. `client/pages/navigation.js` possède destinations et sélection active, liens contextuels, `safeNext`. `client/app.js` et `api/access.mjs` font autorité sur les accès. Conserver la barre basse sur les surfaces racines et les liens de retour contextuels sur les écrans dédiés.

Sur une session lente ou en échec, garder les accès publics et un menu stable sans restauration de liens privés implicite. Tester changement de compte, Échap, Tab, retour, navigation ouverte au redimensionnement, désactivation de scroll et cookie admin indépendant. Le lot 07 introduit la variation par rôle après le lot 03 qui installe la géométrie publique.
