# Composants et réutilisation

Composer les exports existants sous un conteneur opérationnel. Le lot 01 fixe les classes et vérifie composants et focus via components.spec.js et visual-qa.spec.js.

| Composant | Source existante | Données | Variantes et contraintes |
| --- | --- | --- | --- |
| Navigation secondaire / retour | shell.js, navigation.js, ownerNav | Session, rôles, portée | Menu, barre basse, sous-nav et retours; focus restauré et mobile compact. |
| Carte location / action | rentals.js, rentalNext | Location, acteur, dates, quote, état | Résumé et CTA autorisé. Mobile CTA après badge, image et dates. |
| Carte véhicule propriétaire | owner-workspace.js, vehicleMedia | ID, état, média | Photo de modèle étiquetée et fallback. Une destination prioritaire. |
| Timeline | booking-state.js: rentalProgress | Statut et historique | Sept jalons, branche refus/retrait. Terminés repliables, étape nommée. |
| Stepper | owner-state.js: ownerSections | Section, step, erreurs | Quat­re sections, neuf groupes, reprise et incomplets. Mobile étape active en tête. |
| Badge et statut | ui/components.js: badge | Code supervision/contrat | Texte et couleur, état inconnu lisible. |
| Prix et récapitulatif | vehicleEstimate, rentals.js, money | Quote ou estimate du code | Estimation distincte du total fictif, rail puis pleine largeur. |
| Constat / galerie | inspection.js, modal | Phase, vues et versions | Vue manquante, accès aux vues et contrôles, blocage si finalisé. |
| Fil et composeur | messaging.js, message-state.js | Compte, fil, corps, état | Brouillon isolé, zone scroll nommée, envoi incertain verrouillé. |
| Notifications | account.js | Date, état, destination | Liste et action globale, vide et lues distincts. |
| Agenda / mois | owner-workspace.js, ownerCalendarItems | Bornes, items, type | Mois bureau, agenda mobile, demande/occupé/blocage distincts. |
| Demandes propriétaire | owner-workspace.js | Bootstrap filtré | État, période et lien de suivi. |
| Formulaire et reprise | field, bindForm, errorSlot, notice, flash | Payload, erreur, async | Labels et focus, saisie conservée, confirmation serveur. |
| Dialogue | ui/components.js: modal | Titre, choix, conséquence | ShowModal, Échap, focus retour, action visible au clavier. |
| Chargement / vide | shellLoading, empty | Liste, erreur ou attente | Annoncer l’état, proposer une destination utile lorsqu’elle existe. |
