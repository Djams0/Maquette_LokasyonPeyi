# Fonctionnalités en place

La [matrice des routes](../01_AUDIT/MATRICE_ROUTES_COMPOSANTS_API.csv) est la correspondance de travail. Les fonctionnalités suivantes continuent à être exercées pendant les lots.

| Domaine | Contrat à conserver |
|---|---|
| Découverte | Dates couplées, heure Guadeloupe, URL des critères, tri, carte, photo/galerie, distinction état déclaré et photo de modèle. |
| Connexion et compte | Personas fictives, inscription mock, next interne, bfcache neutralisé, pièces versionnées, notifications au compte et avis modérés. |
| Réservation | Action selon statut et acteur; clés et brouillons en demande, refus de paiement récupérable; caution et paiement séparés; constat avant geste. |
| Constat | Huit vues simulées, versions, compteur, carburant, observation; dépôt final figé; réserve dans dossier. |
| Conversation | Participants, recherche q, fil par véhicule et par parties, rédaction isolée, reprise avant/après écriture, ID serveur. |
| Propriétaire | Activation, parc, calendrier, demandes, revenus bruts, réputation, quatre sections et neuf groupes, reprise et mise en revue. |
| Assistance | FAQ, dossier et échanges projetés, avis unique et reçu fictif. |
| Administration | Origine, cookies, rôle et périmètre distincts; notes privées et contrôle de version, modération et finance inchangées. |

Pour les règles complètes, lire [états](STATE_MACHINES.md), [rôles](ROLES_AND_PERMISSIONS.md), [règles métier](BUSINESS_RULES.md) et [reprises](ERROR_AND_RECOVERY_CASES.md).
