# Journal de vérification

## Exécuté dans l’environnement de réalisation

- Analyse syntaxique de tous les modules JS/MJS : réussie.
- Neuf tests HTTP de bout en bout et de permissions : réussis (`npm test`).
- Démarrage des trois processus Node et vérification des ports 8080, 8081, 3001 : réussi.
- Vérification de la santé, routes, assets locaux et égalité du catalogue via les deux proxies : réussie.
- `docker compose config` et `docker compose up --build -d` : **tentés, non exécutables ici**, binaire Docker absent.
- Navigation avec le navigateur distant : **tentée, accès à localhost bloqué** (`ERR_BLOCKED_BY_CLIENT`). Aucun résultat visuel local n’est présenté comme validé à ce stade.

## Vérification reproductible sur GitHub Actions

Le workflow `ci.yml` construit réellement les conteneurs, attend leurs healthchecks, exécute les tests UI avec Chromium, vérifie les débordements horizontaux aux sept largeurs demandées et capture les principaux écrans. Les résultats d’une exécution donnée font foi ; un fichier de test n’est pas à lui seul une preuve de réussite.

Scénarios navigateur : visiteur/recherche/carte/galerie/FAQ/404 ; demande/paiement/caution/constats/retour/clôture/avis/reçu ; propriétaire neuf étapes/calendrier ; employé/documents/dossier ; admin/utilisateur ; Super Admin/habilitations ; réseau indisponible/reprise ; sept largeurs client et admin.

Scénarios API : filtrage, identité requise, paiement interdit avant acceptation, idempotence, conflit de disponibilité, constats incomplets, remplacement versionné, finalisation, compteur retour, notes internes, permissions et affectations, revues documentaires, double validation financière, invalidation après modification, publication contrôlée, calendrier, double validation des habilitations, entrées invalides et 404.

## Refaire une passe UX manuelle

1. Suivre les scénarios du README avec Camille, Noa, Élie, Ana, Jade puis Malo.
2. Naviguer au clavier : menu, formulaires, galerie, modales, FAQ et retours.
3. Vérifier le client à 320/375/390/430/768/1024/1440 px ; contrôler aussi les tables et le menu admin.
4. Simuler une erreur via `/demo`, réessayer, revenir au guide ; tester un filtre sans résultat.
5. Arrêter l’API : les fronts doivent rester servis et afficher une erreur récupérable.
6. Vérifier que le Super Admin n’obtient pas les pièces/finances par accès direct à une URL.

Les mécanismes financiers, l’authentification et l’expertise documentaire restent des simulations, indépendamment du résultat des tests.
