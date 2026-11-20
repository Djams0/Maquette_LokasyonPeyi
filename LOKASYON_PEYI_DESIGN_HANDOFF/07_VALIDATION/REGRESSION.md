# Recette de non-régression

| Scénario | Vérification |
|---|---|
| Habitant | Recherche sans dates; filtre type, prix, places, équipement et tri; carte; retour fiche préservant état; recherche récente; état vide et reprise réseau. |
| Visiteur | Période facultative puis dates/horaires Guadeloupe; page publique, conditions, galerie, redirection connexion et retour fiche. Essais sur session lente et expirée. |
| Locataire + propriétaire | Demande → acceptation → paiement simulé → confirmation → caution → état des lieux → remise → constat de retour → retour déclaré → récupération des clés → clôture. Tester refus et conflit sans progression fictive. Avis, reçu et dossier après clôture. |
| Propriétaire | CTA adapté à capacité, 9 groupes / 4 sections, brouillon, reprise, conflits, photos et documents, modération, parc, calendrier et demandes. |
| Messagerie | Inbox et fil, recherche/retour, conservation du brouillon en cas de panne, idempotence après envoi incertain, aucun mélange de compte. Notifications et dossiers associés. |
| Admin | Agent affecté, admin, finance et super-admin. Notes internes séparées. Version documentaire et finance, approbateur distinct, permissions, refus hors périmètre. |
| États et appareils | Vide, loading, 401/403/404/409/422, réseau indisponible, fallback photo, champs date/heure, zoom, focus, tailles demandées. Continuité clavier en dialogue et navigation mobile. |

Base à rejouer · npm run check, npm test, Python preuves, smoke, Playwright standard et audit essentiel. La campagne audit approfondie peut être lancée si nécessaire. La [CI source](../../.github/workflows/ci.yml) précise les commandes et les artefacts. Utiliser les scénarios fictifs et la procédure d’expurgation. Aucun parcours n’a de carte, PSP ou notification réelle.
