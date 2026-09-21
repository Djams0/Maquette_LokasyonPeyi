# Journal de vérification

## Résultat final vérifié

**Réussite complète** de [l’exécution GitHub Actions 35533008036](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/35533008036), sur le commit `7ce893ed056db9a00dbc074955ecf6e8fc3d58d8`, le 20 septembre 2026 à 19:40 UTC.

| Vérification exécutée | Résultat |
|---|---|
| Syntaxe et indépendance des 38 modules JS/MJS | Réussie |
| Neuf scénarios HTTP / API / permissions | 9 réussis |
| `docker compose config` | Réussie dans GitHub Actions |
| `docker compose up --build -d --wait` | Trois conteneurs construits et sains |
| Santé des ports 8080 / 8081 / 3001, routes et assets | Réussie |
| Scénarios Chromium | **13 réussis en 35,4 secondes** |
| Largeurs 320, 375, 390, 430, 768, 1024, 1440 px | Aucun débordement horizontal sur les routes contrôlées |
| Exceptions JavaScript non gérées dans les scénarios | Aucune |
| États vide, API indisponible simulée, reprise et 404 | Réussis |
| Messagerie entre locataire et propriétaire | Réussie |
| Proposition financière puis approbation par une autre personne | Réussie, opération entièrement fictive |

Le parcours navigateur couvre demande, acceptation propriétaire, paiement, caution distincte, huit vues du constat de départ, remise, huit vues du retour, déclaration de retour, récupération, clôture, avis et reçu. Le tunnel propriétaire de neuf étapes et le contrôle documentaire admin sont également parcourus.

Les captures finales ont été récupérées et examinées : accueil client desktop/mobile, récapitulatif propriétaire, administration et opération financière. Les captures de la première passe ont permis de corriger la hauteur des illustrations des cartes. Les associations des libellés de listes déroulantes ont été rendues explicites. Les tests attendent désormais les changements d’écran avant de poursuivre, ce qui évite les courses entre navigations.

Les 28 captures de l’exécution finale sont disponibles dans l’artefact `preuves-maquette` du workflow, conservé 14 jours. Les sources, matrices et commandes restent dans le dépôt indépendamment de cet artefact. La livraison principale est le code Git, pas l’archive de captures.

La [première exécution](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/35532448336) avait validé Docker, l’API et les sept largeurs, mais trois tests UI s’arrêtaient sur des synchronisations ou un ciblage de formulaire. Ils sont tous réussis dans l’exécution finale ci-dessus.

## Limites de la vérification

Tests navigateur réalisés sous Chromium, avec dimensions simulées : pas de certification sur appareils physiques, Safari ou Firefox. Les contrôles d’accessibilité intégrés (libellés, focus, tailles tactiles, contrastes adaptés) ne remplacent pas un audit WCAG exhaustif. Les données, contrôles documentaires, captures et opérations financières restent fictifs.


## Exécuté dans l’environnement de réalisation

- Analyse syntaxique de tous les modules JS/MJS : réussie.
- Neuf tests HTTP de bout en bout et de permissions : réussis (`npm test`).
- Démarrage des trois processus Node et vérification des ports 8080, 8081, 3001 : réussi.
- Vérification de la santé, routes, assets locaux et égalité du catalogue via les deux proxies : réussie.
- `docker compose config` et `docker compose up --build -d` : **tentés, non exécutables ici**, binaire Docker absent.
- Navigation avec le navigateur distant : **tentée, accès à localhost bloqué** (`ERR_BLOCKED_BY_CLIENT`). Cette limite a été compensée par les tests Chromium dans GitHub Actions et l’examen des captures produites.

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
