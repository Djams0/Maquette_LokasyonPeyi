# Navigation et contexte

client/pages/navigation.js expose navigationRole, primaryDestinations, currentDestination, safeNext et navigationState. client/shell.js fabrique menu et barre basse. client/app.js relit /me et traite pageshow persisté.

- Visiteur · Explorer, Aide, Compte. Locataire · Explorer, Locations, Messages, Documents. Propriétaire · Explorer, Mon parc, Demandes, Profil. Conserver l’accès aux locations et messages via le menu. Admin sur une origine séparée.
- Conserver retour fiche, recherche q des messages, état de catalogue, période Guadeloupe, filtre de liste et step. Sur le fil, préserver la priorité au retour. Sur suivi, paiement et constat, garder l’action près du contenu.
- Pour une destination privée, next passe par safeNext. Revalider la session après restauration navigateur et retirer le contenu précédent pendant la vérification. Vérifier le focus de fermeture, l’orientation et le menu d’état actif.
- Exécuter navigation.spec.js, search.spec.js, messaging.spec.js, booking.spec.js et visual-qa.spec.js.
