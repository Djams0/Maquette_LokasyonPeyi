# Règles métier du mock

| Règle | Source à relire |
|---|---|
| Recherche, période et commune | client/pages/search-state.js, api/router.mjs. Conserver UTC−04 local, deux dates ou aucune, filtre et retour. Les jours d’estimation suivent le code. |
| Réservation et montant | api/modules/rentals.mjs, vehicle-presentation.js. Disponible, publié, acteur éligible et différent du propriétaire, jours et quote du mock. |
| Identité et documents | api/server.mjs, api/modules/documents.mjs, account.js. Persona active et type d’application. Pièce de démonstration, remplacement versionné. |
| Paiement / caution / remises | api/modules/rentals.mjs. États distincts, garde au serveur. Aucune promesse de fonds, assurance ou KYC réels. |
| Publication et parc | api/modules/vehicles.mjs. Cinq vues, trois justificatifs, contrôles et état pending; propriété sur chaque mutation. |
| Assistance et pièces | api/modules/cases.mjs, api/modules/communication.mjs. Echanger dans le périmètre, avis après clôture, notes internes non projetées. |

Tout prix et état provient du mock de la route. Un échantillon de capture n’introduit ni montant, ni SLA, ni règle d’annulation ou de couverture.
