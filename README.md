# Lokasyon Péyi — maquette web indépendante

Maquette **fonctionnelle**, entièrement fictive, du parcours client (visiteur, locataire et propriétaire) et du back-office. HTML, CSS et JavaScript natifs ; API mock Node ; stockage JSON. **Aucun framework frontend, aucune base de données, aucun PSP.**

Ce dépôt est indépendant de [Djams0/LokasyonPeyi](https://github.com/Djams0/LokasyonPeyi), consulté uniquement en lecture. Il ne constitue pas l’application de production ni une validation des règles encore proposées ou bloquées.

## Lancer en une commande

Pré-requis : Docker avec Docker Compose v2.

```bash
git clone https://github.com/Djams0/Maquette_LokasyonPeyi.git
cd Maquette_LokasyonPeyi
docker compose up --build
```

| Service | Adresse |
|---|---|
| Client | http://localhost:8080 |
| Administration | http://localhost:8081 |
| API mock / santé | http://localhost:3001/health |

Les interfaces attendent la santé de l’API. Les ports sont exposés sur la boucle locale uniquement. Le volume `mock-data` conserve les données entre deux démarrages. Les sessions de démonstration sont en mémoire : reconnectez un profil après un redémarrage de l’API.

```bash
docker compose config                 # valider la configuration
docker compose up --build -d --wait    # démarrer en arrière-plan
docker compose logs -f                # journaux
docker compose down                   # arrêter, conserver les données
```

Pour **réinitialiser les données fictives uniquement**, arrêter puis exécuter `docker compose down -v` avant de relancer. Cette commande supprime le volume de cette maquette.

### Sans Docker

Node.js 24 est suffisant. Aucune installation npm n’est nécessaire pour exécuter l’application.

```bash
npm start
```

Les mêmes trois ports sont utilisés. Le JSON local est créé dans `data/mock.json` (ignoré par Git). Pour réinitialiser, arrêter les services puis supprimer ce fichier.

## Visiter la maquette

Commencer par `/` en visiteur ou `/demo` pour le guide et les profils. Les profils sont sélectionnables sans mot de passe ; **ce mécanisme ne doit pas être utilisé en production**. N’entrer aucune donnée personnelle réelle.

| Interface | Profil fictif | Usage |
|---|---|---|
| Client | Camille Démo (`renter`) | Locataire pré-vérifié, parcours complet |
| Client | Noa Démo (`owner`) | Propriétaire des véhicules principaux |
| Client | Alex Démo (`newcomer`) | Documents à compléter / contrôler |
| Client | Lou Démo (`other`) | Autre propriétaire, périmètre distinct |
| Admin | Élie (`employee`) | Annonces, pièces et dossiers affectés |
| Admin | Ana (`admin`) | Opérations, utilisateurs et propositions financières |
| Admin | Sam (`finance`) | Seconde personne pour les validations financières |
| Admin | Jade (`super`) | Comptes internes et habilitations |
| Admin | Malo (`super2`) | Seconde personne pour approuver les habilitations |

Le Super Admin ne voit **pas** automatiquement les documents, les utilisateurs, les litiges ou les finances. Les cookies client et admin sont distincts : les deux interfaces peuvent rester ouvertes simultanément sur le même ordinateur.

### Démonstration de bout en bout

1. Visiteur : rechercher, filtrer, trier, passer en carte, ouvrir un véhicule. Les illustrations et positions sont fictives.
2. Camille : choisir les dates, envoyer la demande. Aucun paiement à cette étape.
3. Noa : `/owner/requests`, ouvrir la demande et accepter.
4. Camille : ouvrir `/rentals`, simuler le paiement après acceptation. Tester aussi le résultat « refusé » si souhaité.
5. Camille : contrôler séparément la caution fictive, puis compléter les huit vues du constat de départ, compteur et carburant.
6. Noa : confirmer les contrôles pré-départ et remettre les clés.
7. Camille : constat de retour, puis déclaration de retour.
8. Noa : confirmer la récupération des clés puis clôturer.
9. Camille : laisser un avis, imprimer le reçu fictif ou ouvrir un dossier.

Changer de profil client via `/demo`. Actualiser les listes déjà ouvertes pour lire les nouvelles données de l’API. Aucun frontend n’importe l’autre.

### Propriétaire et contrôle documentaire

`/owner/start` → activation fictive → `/owner/vehicles/new` : **neuf étapes** avec brouillon sauvegardé dans l’API. L’envoi crée une annonce en attente et trois pièces synthétiques. Élie ou Ana vérifie chaque pièce dans `/moderation?tab=documents`, renseigne les cinq critères sans précochage, puis décide de l’annonce dans l’onglet Annonces. Le propriétaire retrouve la même décision dans son parc. Nouvelle pièce = nouvelle version et nouvelle revue.

Le propriétaire peut modifier le prix fictif et la description, bloquer un créneau, mettre en pause, reprendre ou retirer une annonce (sauf locations engagées), lire ses demandes, revenus bruts illustratifs et avis.

### Dossiers et opérations sensibles

Le client ouvre un dossier depuis `/cases` ou une location. Un agent affecté retrouve ce dossier dans l’autre application, ajoute une note interne ou un message partagé, puis suit les étapes de traitement. Les notes internes ne sont pas renvoyées au client. Les constats liés restent consultables dans le dossier.

Ana peut proposer une opération fictive dans `/payments`. Sam approuve la version ; une personne habilitée peut ensuite simuler l’exécution. Modifier la proposition invalide l’approbation. Jade peut proposer une habilitation pour un autre agent ; Malo l’approuve. Aucune opération réelle n’est déclenchée.

## Écrans et interactions

- Public : accueil, catalogue, filtres, tri, liste/carte, galerie, fiche véhicule, connexion, inscription, FAQ avec recherche.
- Locataire : accueil connecté, documents, demande et suivi, paiement/caution séparés, constats caméra simulée, retour, avis, reçu imprimable, assistance et litiges.
- Propriétaire : présentation, estimation brute, onboarding, neuf étapes, dashboard, parc, calendrier, demandes, retours, revenus, réputation.
- Compte : profil, messagerie partagée, notifications, déconnexion, changement de profil fictif.
- Administration : dashboard, annonces/documents/avis, utilisateurs, dossiers, paiements fictifs, comptes et permissions.
- États : chargement, vide, erreur, refus, succès, modal, toast, reprise, 404. `/demo` permet de simuler réseau lent ou indisponible ; revenir à `/demo` rétablit le réseau simulé.

## Sources et décisions visuelles

Les fichiers fournis étaient `Untitled(1).fig` et `Untitled(1).pdf`. **Le `.fig` a réellement été décodé** (conteneur fig-kiwi, schéma Kiwi et données compressées), et les **22 pages du PDF ont été rendues et inspectées**. Les originaux ne sont pas redistribués dans ce dépôt.

- 22 planches visibles, 9 592 nœuds, 123 composants, 151 instances ; styles, variables, dispositions et interactions inspectés.
- Planche 11 : design system ; pages 1–6 admin, 7–10 propriétaire, 12–17 locataire, 18–22 public.
- Lora pour les titres, Nunito pour l’interface, Lobster pour le logo ; polices locales sous SIL OFL.
- Palette Figma conservée, avec variantes plus sombres pour les petits textes et liens. Focus visible, cibles tactiles, texte associé aux badges, dispositions fluides.
- Les images sont des **illustrations SVG originales locales** ; aucune image distante aléatoire ni donnée personnelle issue du Figma n’est reprise.

Référence métier : `main` de LokasyonPeyi au commit **`33bf766339de6745f82e7b51422c0eae59b1750f`**, avec historique récent et documents demandés (README, AGENTS, architecture, stack, UI foundations, permissions, sécurité, règles, registre, ADR, plan Phase 0, prompts).

Voir :

- [Figma → routes, les 22 pages](docs/FIGMA_MAPPING.md)
- [Contradictions Figma ↔ règles actuelles](docs/FIGMA_VS_BUSINESS.md)
- [Analyse et décisions de conception](docs/DESIGN_DECISIONS.md)
- [Inventaire des planches Figma](docs/FIGMA_INVENTORY.json)
- [Tests et limites de vérification](docs/TESTING.md)

La correction centrale est : **demande → acceptation → paiement simulé → confirmation → contrôle de caution → constat → remise**, puis **retour déclaré → récupération vérifiée → clôture**. Le déroulement après acceptation reste une proposition simulée, pas une règle contractuelle validée.

Aucune commission de 25 %, caution de 600 €, limite de 21 ans, promesse d’assurance, remboursement automatique ou échéance 2 h / 24 h / 48 h n’est transformée en règle confirmée. Inter-îles, GPS et fidélité sont explicitement indisponibles/reportés.

## Architecture et arborescence

```text
client/       pages, routage et styles client ; Dockerfile propre
admin/        pages, routage et styles admin ; Dockerfile propre
api/          serveur HTTP Node, JSON de démonstration et scénarios
ui/           composants de présentation et tokens sans état métier
assets/       illustrations SVG, polices et licences locales
scripts/      serveurs web, lancement et vérifications
tests/        scénarios API et tests UI/responsive
docs/         analyse, matrices, instructions et limites
compose.yaml  trois services, réseau et volume JSON
```

Chaque serveur web sert uniquement ses pages, les composants visuels communs et les assets. Il relaie `/api/v1/*` vers l’API par HTTP. Le client et l’admin n’ont aucun accès direct à leur état respectif. Le routage utilise de vraies URL et charge l’écran correspondant, sans empiler quarante écrans cachés.

Le stockage est volontairement simple : un processus API, un fichier JSON écrit atomiquement. Pas de PostgreSQL, Redis, file de tâches ni microservices. Il ne convient pas à des écritures multi-processus ni à un déploiement public de production.

## Vérifier

```bash
npm run check                # syntaxe et indépendance des imports
npm test                     # parcours et permissions via HTTP
node scripts/local-smoke.mjs # démarrage local, santé, routes et assets
npm run smoke                # vérifier des services déjà démarrés
```

Tests navigateur (uniquement dépendance de développement) après lancement des services :

```bash
npm install --no-save --package-lock=false @playwright/test@1.56.1
npx playwright install chromium
npx playwright test
```

Le workflow GitHub Actions exécute les tests, `docker compose config`, `docker compose up --build -d --wait`, puis Chromium. Les captures et traces sont disponibles dans l’artefact `preuves-maquette`. Les sept largeurs sont 320, 375, 390, 430, 768, 1024 et 1440 px.

## Limites assumées

Maquette de démonstration : pas d’authentification réelle, KYC réel, caméra réelle, paiement, contrat, police d’assurance, cartographie réelle, géolocalisation ou notification externe. Les captures sont des métadonnées fictives, remplaçables avant finalisation. Aucun hash ou timestamp n’est présenté comme preuve infalsifiable. Le reçu est sans valeur comptable. L’estimation est brute ; la fiscalité, les frais, la caution et les conditions commerciales restent ouverts.

Les décisions utilisateur sont visibles entre interfaces après actualisation, sans WebSocket. L’accessibilité vise WCAG 2.2 AA, sans revendiquer un audit de conformité exhaustif. Voir le journal de vérification pour distinguer tests exécutés et limites de l’environnement.
