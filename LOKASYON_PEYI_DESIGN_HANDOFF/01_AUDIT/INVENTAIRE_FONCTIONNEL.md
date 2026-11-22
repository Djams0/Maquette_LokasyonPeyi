# Inventaire client par route

Les chemins API sont relatifs à /api/v1. Les routes et gardes sont dans client/app.js et api/router.mjs. Les fichiers de tests désignés sont dans tests/browser, sauf mention contraire. La matrice machine détaille données, incidents, rôle et code. La liste couvre les trois routes protégées et les destinations réellement routées; le calendrier est une ancre de la fiche de gestion.

| Route | Rôle | Fonction | PDF B et détail |
| --- | --- | --- | --- |
| `/` | Public | Recherche; vedettes; reprise récente | [3 · Références protégées](../05_SCREEN_SPECS/PROTECTION.md) |
| `/search` | Public | Recherche canonique, vue carte, filtres, tri, édition | [3 · Références protégées](../05_SCREEN_SPECS/PROTECTION.md) |
| `/vehicle/:id` | Public si publiée; propriétaire de son annonce hors publication | Galerie, état déclaré, estimation, reprise vers fiche et recherche | [3 · Références protégées](../05_SCREEN_SPECS/PROTECTION.md) |
| `/login` | Public | Choix de persona et next local validé | [13 · Compte et connexion](../05_SCREEN_SPECS/ACCOUNT.md) |
| `/register` | Public | Prénom fictif, consentement démo, cookie, retour next | [14 · Compte et connexion](../05_SCREEN_SPECS/ACCOUNT.md) |
| `/profile` | Client actif | Identité, éligibilité, raccourcis compte/location/aide, déconnexion | [15 · Compte et connexion](../05_SCREEN_SPECS/ACCOUNT.md) |
| `/profile/documents` | Client actif, pièces du compte | Documents sans vehicleId, type, statut, version, motif vérifié | [14 · Compte et connexion](../05_SCREEN_SPECS/ACCOUNT.md) |
| `/profile/reviews` | Client actif, avis écrits par le compte | Avis authorId=me.id, note et état de modération | [30 · Assistance, FAQ, avis et reçus](../05_SCREEN_SPECS/SUPPORT.md) |
| `/notifications` | Client actif | Liste du compte, cible existante, marquer tout comme lu | [26 · Notifications](../05_SCREEN_SPECS/NOTIFICATIONS.md) |
| `/rentals` | Client participant pour ses locations | Onglets upcoming/active/history, état réel et prochaine action | [16,27 · Liste et demande](../05_SCREEN_SPECS/RENTALS.md) |
| `/request/:id` | Locataire authentifié; envoi conditionné par identité vérifiée et véhicule éligible | Brouillon par véhicule, période, confirmation, estimation, clé d’idempotence | [17 · Liste et demande](../05_SCREEN_SPECS/RENTALS.md) |
| `/rental/:id` | Locataire ou propriétaire de la location | rentalNext, histoire, constat, rôle, remise, contexte du fil | [18,19 · Suivi de la location](../05_SCREEN_SPECS/RENTAL_DETAIL.md) |
| `/payment/:id` | Participants en lecture; locataire seul agit si awaiting_payment | quote, outcome success/failure, statut séparé de deposit | [20 · Paiement et caution](../05_SCREEN_SPECS/PAYMENT.md) |
| `/inspection/:id/:phase` | Participants; édition départ confirmed ou retour in_progress, si non finalisé | Huit vues, progression, versions, compteurs, observations, finalisation | [21,22,23 · États des lieux](../05_SCREEN_SPECS/INSPECTION.md) |
| `/messages` | Client actif inscrit au fil | q, conversation, historique, brouillon par compte/fil, corps/clé gelés | [24,25,27 · Messagerie](../05_SCREEN_SPECS/MESSAGING.md) |
| `/faq` | Public | Recherche et accordéons; aide vers connexion si nécessaire | [29 · Assistance, FAQ, avis et reçus](../05_SCREEN_SPECS/SUPPORT.md) |
| `/assistance` | Client actif | Alias fonctionnel de cases(new), motif et location facultative | [28 · Assistance, FAQ, avis et reçus](../05_SCREEN_SPECS/SUPPORT.md) |
| `/cases` | Client actif, dossiers liés au compte | Liste, état, motif, date et accès détail | [30 · Assistance, FAQ, avis et reçus](../05_SCREEN_SPECS/SUPPORT.md) |
| `/cases/new` | Client actif | Préremplissage kind/rental, motifs du mock et location du compte | [28 · Assistance, FAQ, avis et reçus](../05_SCREEN_SPECS/SUPPORT.md) |
| `/cases/:id` | Partie au dossier; données client projetées | Résumé, état, échanges partagés et demande de complément | [28,30 · Assistance, FAQ, avis et reçus](../05_SCREEN_SPECS/SUPPORT.md) |
| `/review/:id` | Locataire après clôture; règles serveur | Notes véhicule et propriétaire 1–5, texte soumis à modération | [31 · Assistance, FAQ, avis et reçus](../05_SCREEN_SPECS/SUPPORT.md) |
| `/receipt/:id` | Participants après completed | Reçu fictif, période, quote et impression | [31 · Assistance, FAQ, avis et reçus](../05_SCREEN_SPECS/SUPPORT.md) |
| `/owner/start` | Public; activation client actif | Découverte, estimateur brut local, redirection login si nécessaire, activation | [32 · Tableau, introduction et activité propriétaire](../05_SCREEN_SPECS/OWNER_DASHBOARD.md) |
| `/owner` | Propriétaire actif | Compteurs, première demande, brouillon, gestion et accès aux sections | [33,42 · Tableau, introduction et activité propriétaire](../05_SCREEN_SPECS/OWNER_DASHBOARD.md) |
| `/owner/vehicles` | Propriétaire actif | Parc, états, filtre URL actuel, ajout et gestion | [34 · Parc et gestion](../05_SCREEN_SPECS/OWNER_VEHICLES.md) |
| `/owner/vehicles/:id` | Propriétaire du véhicule | Statut, gestion, docs, état, calendrier et confirmations | [35,36 · Parc et gestion](../05_SCREEN_SPECS/OWNER_VEHICLES.md) |
| `/owner/requests` | Propriétaire actif, demandes de son parc | Filtres et états des demandes, ouvrir suivi avant décision | [37 · Demandes propriétaire](../05_SCREEN_SPECS/OWNER_REQUESTS.md) |
| `/owner/revenue` | Propriétaire actif | Montants bruts des paiements simulés issus des locations | [38 · Tableau, introduction et activité propriétaire](../05_SCREEN_SPECS/OWNER_DASHBOARD.md) |
| `/owner/reputation` | Propriétaire actif | Avis applicables, réponse propriétaire distincte, note et statut | [38 · Tableau, introduction et activité propriétaire](../05_SCREEN_SPECS/OWNER_DASHBOARD.md) |
| `/owner/vehicles/new` | Propriétaire actif | Quatre sections, neuf groupes, step historique; tampon local et envoi gelé | [23,39,40,41 · Assistant de publication](../05_SCREEN_SPECS/OWNER_WIZARD.md) |
| `/demo` | Public | Sélecteur, visiteur, réseau lent ou HS en sessionStorage | [10,44 · Démonstration et composants](../05_SCREEN_SPECS/OUTILS.md) |
| `/demo/audit` | Public côté client, profils lorsque fixture audit active | Sélection audit sans changer le seed; récupération réseau | [10,44 · Démonstration et composants](../05_SCREEN_SPECS/OUTILS.md) |
| `/design-system` | Public de démonstration | Échantillons UI et verre V3.2 | [10,11,12 · Démonstration et composants](../05_SCREEN_SPECS/OUTILS.md) |

Voir [matrice routes/API](MATRICE_ROUTES_COMPOSANTS_API.csv), [matrice visuelle](MATRICE_ECARTS_UXUI.csv) et [risques](RISQUES_ET_REGRESSIONS.md). L’administration reste une application séparée. La CI et les tests d’accès/finance/modération protègent les effets du client sur les dossiers et annonces.
