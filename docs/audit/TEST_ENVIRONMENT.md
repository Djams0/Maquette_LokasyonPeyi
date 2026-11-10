# Environnement reproductible

Références récupérées le 10 novembre 2026 :

- Maquette `main` : `f513989e1e9b318e895b140c3dc1499725c12d48`.
- Projet principal `main`, en lecture seule : `78966c97a5e8f373c8e7eff6c26c7cd356ee7b29`.
- Le dossier initial provenait d’une archive sans `.git`. Après rattachement au clone sans checkout et initialisation de l’index, aucun fichier suivi ne différait de ce HEAD. Branche dédiée : `test/prepare-comprehensive-ux-audit`.

Sources consultées dans le principal : README, AGENTS, architecture, stack, permissions, règles et registre, ADR auth et paiement. La phase 0 technique ne valide pas les règles commerciales. BR-01/04 expriment l’intention de capacités cumulables et de demande/acceptation ; BR-05 et D-10 restent proposés/ouverts ; ADR-007 paiement demeure bloqué. Aucun délai de caution, commission, assurance, âge, remboursement ou pénalité supplémentaire n’est introduit. La stack principale n’est pas copiée.

## Chargement et stockage

`api/audit-fixture.mjs` étend `seed()` explicitement. `createStore(file, initialize)` et `createApi({initialize})` conservent le seed historique par défaut. Les tests API audit emploient une API neuve par test ; les tests historiques conservent leur séquence existante. Les tests navigateur audit ajoutent deux proxys éphémères et un contexte Playwright neuf. Pas de workers concurrents sur un même JSON.

Les noms, e-mails `.test`, liens `.invalid` et numéros synthétiques sont fictifs. Le comportement est une métadonnée descriptive sans effet sur les décisions. L’horloge de fixture est fixée au 1er janvier 2027 ; `auditFixture({epoch})` peut changer les dates des événements, sans déplacer les intervalles de location du catalogue, ni changer l’horloge globale du runtime. Les événements ne constituent pas une preuve chronologique réelle.

Les fonctions existantes construisent demandes, transitions, constats, avis, conversations, dossiers et finance. Une normalisation déterministe remplace les UUID courts générés et les dates d’événements ; les références croisées sont remappées. Les mutations interactives gardent leurs IDs et dates runtime normaux, récupérables dans les réponses API. Les tests ne comparent pas ces IDs aléatoires. Le catalogue fixe les dates métier de 2027 et les disponibilités 2027–2029, sans dépendance au jour courant.

Population : 39 utilisateurs, 18 véhicules dont cinq historiques publiés, neuf locations, documents et revues synthétiques, annonces pending/rejected/paused, brouillon, blocage de disponibilité, support et litige sensible, conversation d’échantillons d’abus, notifications, avis pending et publié, proposition financière d’une unité fictive, demande d’habilitation pending. Aucun montant de fixture ne définit une politique tarifaire.

## Isolation sans suppression

`scripts/audit-environment.mjs` crée un dossier temporaire unique et un marqueur exclusif. Le lanceur n’accepte pas de cible utilisateur. Le chargement vérifie parent temporaire réel, préfixe, nom exact, absence de lien symbolique, marqueur et nonce en mémoire. Une variable d’environnement seule `AUDIT_FIXTURE=1` ne suffit pas. Le mode refuse `NODE_ENV=production` et écoute l’API sur loopback. Le nonce n’est ni affiché ni versé aux preuves ; c’est une preuve de ciblage local, pas une authentification réelle.

La remise à zéro consiste à créer une nouvelle instance. Aucun DELETE/reset HTTP, suppression automatique de JSON, de dossier ou de volume. Les anciennes cibles restent pour inspection locale ; leur nettoyage éventuel sort de ces scripts. Les sessions mémoire de l’ancien processus ne sont jamais restaurées. Le runtime Docker historique est inchangé.

La CI utilise `COMPOSE_PROJECT_NAME=lp-ci-<run>-<attempt>` ; son `down -v` cible exclusivement les ressources créées par ce job sur runner éphémère. Les campagnes locales ne doivent pas utiliser cette commande.

## Adaptations de permissions et limites connues

Avant : `/admin/users` utilisait `a.id === 'admin'` pour tout voir, et une liste fixe renter/newcomer/owner pour tout autre agent doté de `users.read`. Cela aurait exposé ces trois comptes à chaque nouveau profil. Maintenant : `userScope` explicite pour les agents audit, refus par défaut pour un agent inconnu ; fallback limité aux IDs historiques admin/employee pour les anciens JSON. La permission `users.read` reste obligatoire. Aucun titre ne confère un droit. Les affectations documentaires, financières, les `personId` et les permissions API restent indépendants.

Les comptes historiques super/super2 restent protégés de suspension par ID pour assurer la relève de la démo. Cette protection n’est pas étendue aux nouveaux agents : ils servent notamment à tester suspension/révocation. Les nouvelles ressources créées par les modules existants restent affectées à employee/admin ; le seed audit affecte explicitement ses propres ressources. Aucun mécanisme d’affectation universelle n’a été ajouté.

La politique d’origine HTTP conserve ses valeurs par défaut. Les tests aux ports éphémères passent un ensemble exact d’origines à `createApi`, uniquement par injection programmatique ; aucune variable ou route HTTP n’ouvre ce réglage. Les contrôles d’autorisation restent dans l’API.

Limites préexistantes : stockage mono-processus, écritures JSON atomiques mais pas garanties SQL concurrentes, authentification de démonstration, pas d’expiration temporelle des sessions, pas de MFA réel, cartographie/caméra/notifications/paiements simulés. La suite rapide ne certifie ni conformité WCAG ni antifraude. Les parcours manuels réutilisant une campagne doivent repartir d’une instance propre entre scénarios indépendants.
