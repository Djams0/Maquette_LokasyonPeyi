# Matrice fonctionnelle

| ID | Profil / scénario | Résultat attendu | Suites existantes |
|---|---|---|---|
| F01 | Visiteur recherche, dates, tri puis v3 et connexion | Retour fiche et période, aucune permission accordée par URL | explorer, search, vehicle, navigation |
| F02 | Locataire incomplet et documents | Demande conditionnée, type/statut/raison visibles, nouvelles pièces synthétiques | api, maquette, navigation |
| F03 | Locataire demande et double clic/réponse perdue | Une demande, clé stable, validation et 409 récupérables | booking, api |
| F04 | Propriétaire accepte/refuse, locataire retire avant décision | Bon acteur et état; refus/retrait sans progression imaginaire | booking, maquette, api |
| F05 | Paiement refusé puis réussite et caution distincte | Résultat refusé sans confirmation, reprise, garde de remise | booking, maquette, api |
| F06 | Deux constats, remise puis restitution | Huit vues, km/fuel, échecs simulés, verrou et ordre correct | maquette, booking, api |
| F07 | Déclare le retour, confirme récupération, clôture | Acteurs respectés, reçu des parties et avis unique | maquette, booking, api |
| F08 | Messagerie avec profil tiers et réseau | Visibilité par participant, réponse perdue avant/après écriture, même clé, aucun doublon | messaging et message-state |
| F09 | Notifications et assistance | Destinations autorisées, tout marquer lu, dossier et échanges, notes internes privées | maquette, navigation, api |
| F10 | Gestion propriétaire | Parc propre, calendrier, créneau occupé et garde retrait, raison modération | owner, maquette, admin |
| F11 | Assistant et brouillon concurrent | Neuf groupes, reprise, validation, divergence, soumission unique et revue | owner et owner-state, maquette, admin |
| F12 | Session expirée ou switch retour navigateur | Neutraliser contenu précédent et garder contexte autorisé | navigation, messaging, owner |
| F13 | Gouvernance et sécurité de la démo | Client/Admin séparés, rôles/assignations, contrôle de version admin | admin, api, audit, profils |
| F14 | UI à faible hauteur et zoom | Aucune action critique inaccessible, erreurs et dialogues au clavier | visual-qa, components et contrôles manuels |

Suites UI dans tests/browser. Node et Python dans tests à la racine; profils dans tests/audit-browser/profiles.spec.js. Rejouer avec un fichier JSON jetable. Les contrôles d’accès sont des tests de non-régression défensifs avec les personas existantes.
