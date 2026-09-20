# Matrice des 22 pages → maquette

Routes client sur :8080 ; routes admin sur :8081. Chaque route privée sans session propose la connexion ; le client conserve la destination. Toute page distante passe par chargement, succès, vide ou erreur avec reprise ; le labo `/demo` permet d'observer ces états. Les modifications métier sont justifiées dans FIGMA_VS_BUSINESS.md. IDs de frames dans FIGMA_INVENTORY.json.

| PDF / Figma | Route | Écran et actions → destination / état | Adaptation |
|---|---|---|---|
| 1 / 351:222 | admin `/` | Dashboard, priorités → modération/dossiers ; actualiser → mêmes données API | KPI réels du jeu fictif et périmètre autorisé |
| 2 / 352:896 | admin `/moderation`, `/moderation/listings/:id`, `/moderation/documents/:id` | Onglets annonces/documents/avis ; ouvrir → détail ; checklist → décision ; refus/modifications motivés | GPS reporté ; aucune validation automatique |
| 3 / 352:1570 | admin `/users`, `/users/:id` | Recherche/statut ; détail → suspension/rétablissement confirmé | Données assignées ; motif et audit |
| 4 / 352:2244 | admin `/cases`, `/cases/:id` | Liste → dossier ; départ/retour ; observations publiques/notes internes ; étapes → suivi | Pas de SLA, responsabilité ou retenue automatique |
| 5 / 352:2918 | admin `/payments` | Proposition → attente secondaire ; autre agent → approbation ; action fictive | Auteur distinct, version, permissions financières |
| 6 / 353:3592 | admin `/administration` | Personnel → ajout/suspension ; demande permission critique → attente secondaire | Super-admin sans droit documents/finance par défaut |
| 7 / 269:960 | `/owner/start` (incitation, protection, activation regroupées) | Incitation → simulateur brut → protection → compte propriétaire → véhicule | Pas de RIB réel, assurance ni revenu net garanti |
| 8 / 269:1408 | `/owner/vehicles/new?step=1…9` | Identification ; pièces ; caractéristiques ; équipements ; photos ; sécurité ; prix/règles ; disponibilité ; récapitulatif → validation admin | Brouillon API ; erreur/reprise ; GPS/inter-îles/caution désactivés |
| 9 / 269:2411 | `/owner`, `/owner/requests`, `/owner/vehicles`, `/owner/vehicles/:id` | Dashboard/vide ; demande → accepter/refuser (modale) ; véhicule → édition/calendrier/pause/retrait | Profil minimal, pas de 2 h ni net fixé |
| 10 / 269:3208 | `/rental/:id`, `/inspection/:id/:phase`, `/owner/reputation`, `/owner/revenue`, `/cases/new` | Remise → active ; récupération → returned → completed ; avis/réponse ; dommage ; tableau des revenus | Retour et caution séparés ; revenu brut fictif |
| 11 / 139:2 | `/design-system`, `/demo` + toutes routes | Tokens, boutons, badges, champs, modale, toast et états ; carte des parcours | Contrastes corrigés ; flow reconstruit |
| 12 / 306:293 | `/`, `/profile/documents` | Connecté : recommandations/recherches récentes ; documents manquants → soumission ; attente/refus → remplacer | Pièces synthétiques seulement, pas de délai ni vrai KYC |
| 13 / 139:2261 | `/search`, `/vehicle/:id`, `/messages` | Filtres/tri/liste/carte → fiche ; galerie ; disponibilité → demande ; contact → conversation | Carte schématique ; statut d'éligibilité simulé |
| 14 / 139:2262 | `/request/:id`, `/rental/:id`, `/payment/:id` | Récapitulatif → requested ; propriétaire → awaiting_payment ; paiement refusé/reprise → confirmed | Ordre corrigé, sans carte/PSP ; caution à part |
| 15 / 139:2263 | `/rental/:id`, `/inspection/:id/departure`, `/inspection/:id/return`, `/assistance` | Compte à rebours ; inspection huit vues/reprises/relevés ; remise ; prolongation support ; retour déclaré | Pas de vidéo obligatoire ni frais kilométriques |
| 16 / 141:163 | `/rental/:id`, `/review/:id`, `/receipt/:id`, `/cases/new`, `/cases/:id` | Récupération → clôture → reçu imprimable ; avis véhicule/propriétaire → modération ; réclamation → suivi | Pas de libération automatique ni points |
| 17 / 141:164 | `/rentals`, `/messages`, `/profile`, `/notifications`, `/owner/start` | Onglets à venir/active/historique ; conversations ; profil ; notifications lues ; propriétaire | Capacités cumulables, fidélité reportée |
| 18 / 182:880 | `/` | Recherche → `/search` ; vedettes → fiche ; comment ça marche ; propriétaire → incitation | Visite libre, CTA demande explicite |
| 19 / 182:4729 | `/search` | Filtres ville/dates/prix/catégorie/boîte + plus ; réinitialiser ; liste/carte ; aucun résultat → élargir | Même catalogue API pour connecté/visiteur |
| 20 / 182:5331 | `/vehicle/:id` | Galerie → modale ; règles/disponibilité/propriétaire/avis ; demander → connexion puis récapitulatif | Zone approximative, caution non chiffrée |
| 21 / 182:5933 | `/login`, `/register` | Onglets ; choix compte démo/inscription ; erreurs ; retour destination préservé | Sans mots de passe réels ni naissance obligatoire |
| 22 / 182:6535 | `/faq`, `/assistance` | Recherche FAQ ; accordéons ; aucun résultat → réinitialiser ; contact → demande support | Contenu réécrit selon Git, sans SLA/couverture promis |

## Navigation et récupération

- Logo → accueil. Navigation client : accueil, locations, voiture, messages, profil ; mobile barre basse, desktop header. Sous-pages : lien parent explicite. Admin : sidebar distincte, menu mobile repliable.
- Formulaires : validations HTML et API ; conserver saisie et message d'erreur, bouton réessayer. Aucune réussite annoncée avant réponse API. Modales : Échap/annuler, focus rendu au déclencheur.
- Demande : dates obligatoires et croissantes ; disponibilité recontrôlée à acceptation ; conflit 409 laisse la demande en attente. Refus/retrait → état terminal et alternatives catalogue.
- Document : cinq critères indépendants, non applicable motivé, refus motivé, version périmée 409 → rouvrir. Ni auto-validation ni accès par ID hors périmètre.
- Photos : cartes huit vues ; capture fictive, reprise/remplacement versionné avant finalisation ; erreur caméra simulée → conserver progression/support. Finalisation sans toutes les vues/relevés/confirmation refusée. Constat finalisé consultable, pas écrasable.
- Location : annulation après acceptation ouvre un dossier, n'invente aucun remboursement ; récupération non confirmée → recours support, aucun compteur de frais automatique.
- Dossiers : sortie vers location/centre de suivi ; notes internes jamais sérialisées au client. Écrans inconnus → 404 avec retour accueil.
- Actions financières : brouillon → proposé → approuvé par autre persona → exécuté fictivement. Une modification invalide l'approbation. Les droits viennent de l'API, aucun « super-admin = tout ».
