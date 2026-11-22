# Erreurs, reprise et doubles actions

| Situation | Décision et preuve à demander |
|---|---|
| 401 ou compte différent | Garder uniquement le contexte autorisé, relire /me et obtenir session avant de rendre la zone. Test retour bfcache et comptes distincts. |
| 403 / 404 | Cause générique et retour utile, aucune donnée du tiers. Lire la session, pas la ressource privée en clair. |
| 409 | Signaler l’état concurrent et utiliser la relecture prévue. Présenter valeur serveur; conserver saisie distincte. |
| 422 | Indiquer champ/précondition. Ne pas effacer la saisie valide ni rejouer une mutation. |
| Réseau lent ou coupé | Laisser l’utilisateur se repérer. Contrôler l’échec confirmé vs résultat inconnu. /demo et /demo/audit restent des points de récupération. |
| Réponse de demande, envoi de message ou soumission perdue | Même clé/corps si jugés sûrs et même identité. Relire d’abord. Recommandé de tester avant et après écriture, double clic et refresh. |
| Tentative invalide ou clé absente | Vérification seulement, pas de nouvelle clé implicite. Journaliser décision et résultat. |
| Sauvegarde brouillon autre version | Garder les champs locaux sans écraser; comparer, choisir puis action explicite. |
| Paiement refusé | Demande toujours acceptée. Message fictif, retry disponible au locataire. Caution non modifiée. |
| Capture simulée refusée | Nom de vue, cause, possibilité de recadrer, version précédente toujours présente. |
| Perte de stockage | Etat explicite; empêcher que la perte déclenche écriture ou duplication. |

Sources client/pages/message-state.js, booking-state.js, owner-state.js, wizard.js et api/store.mjs. Ne pas étendre la garantie des opérations existantes à des mutations qui n’ont pas de mécanisme de reprise.
