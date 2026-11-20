# Lot 00 — Baseline applicative V3.2

Campagne du 20 novembre 2026. Périmètre : constat de l'existant, sans modification visuelle, applicative, du seed livré, des habilitations, des workflows ou du handoff. Les seules pièces à versionner sont ce rapport et l'archive de preuves sélectionnées, comme artefacts du lot. Les outils de travail, dépendances et captures exhaustives restent ignorés.

## Base et provenance

- Audit initial : `e42cc6ffa69bba6c1cc5c36333adede531d6d11f`.
- `git fetch origin` exécuté avec succès. `origin/main` et HEAD de départ : `c46ba41d61b1674218aca99c9d2cae31ea5a8acb`, fusion de la PR #12.
- Installation du handoff V3.2 : `fd7dbcf9225068d2b6bec68612c27cf5e223b2e1`.
- `git merge-base --is-ancestor e42cc6ffa69bba6c1cc5c36333adede531d6d11f HEAD` : sortie 0.
- Arbre initial propre. Branche créée : `v32/lot-00`. Le commit de livraison est indiqué dans la PR et dans le compte rendu de livraison, sans auto-référence impossible dans son propre contenu.
- Base déplacée : 256 chemins, tous sous `LOKASYON_PEYI_DESIGN_HANDOFF/`, 7 599 insertions et 7 133 suppressions. Liste exhaustive : `base-diff.txt`. Aucun changement dans les chemins applicatifs ou les huit fichiers de code cités par la mission. Les chemins des tests et du code ont été relus ; le vérificateur contrôle aussi les pointeurs des dix lots.
- Documents obligatoires lus, y compris les 12 pages du PDF (texte extrait et rendu), la recette et la régression. Les quatre références exactes demandées ont été ouvertes. Aucune ressource du handoff n'a été modifiée.

## Environnement et isolation

Windows / PowerShell. Node **24.22.2** sélectionné explicitement (le Node par défaut est 22.17.0). Playwright **1.56.1**, Chromium **141.0.7390.37**, révision **1194**. Python **3.13.5** via `python` : l'alias Windows `python3` n'est pas exécutable. `npm.cmd` remplace `npm.ps1`, bloqué par la politique PowerShell. Ces adaptations ne changent pas les tests.

Captures : DPR 1, locale fr-FR, fuseau America/Guadeloupe, mouvement réduit, thème clair, zoom initial 100 %, visiteur sans dates. Les services 3001 / 8080 / 8081 étaient libres avant lancement. L'API utilise le seed historique `api/seed.mjs`, un `DATA_FILE` dans un répertoire temporaire neuf et `DEMO_LOOPBACK=1`. Les trois services répondent au smoke. Ni Docker ni `data/mock.json` ne sont utilisés par le lancement de campagne. Aucun volume existant n'est supprimé. Les mutations nécessaires aux tests métier restent dans cette instance jetable. Les captures de départ sont prises **avant** ces mutations.

Les profils audit UI-AUD-01 à 04 utilisent chacun leur API en mémoire et deux proxies sur ports aléatoires, avec `audit-v1`. Ce dataset différent n'est pas utilisé pour les comparaisons visuelles. L'inspection complémentaire démarre une autre API avec le seed historique intact. Aucun montage visuel, interception GET de données métier ou changement de fixture n'a été utilisé pour aligner les PNG.

## Commandes et résultats

Les journaux bruts figurent dans l'archive ; `commands.json` conserve les arguments, heures UTC et codes de sortie. Les commandes Playwright ont été exécutées par `node node_modules/@playwright/test/cli.js`, avec Node 24, équivalent local de `npx playwright` sans téléchargement implicite.

| Commande demandée | Résultat observé |
|---|---|
| `python3 LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_v32.py` (via `python`) | PASS : 136 fichiers, 68 liens, 16 photos, 32 fichiers photo, 10 prompts |
| `python -m unittest discover -s tests -p 'test_*.py'` | PASS : 2 tests d'expurgation |
| `npm run check` (via `npm.cmd`) | ÉCHEC dans le checkout Windows : comparaison documentaire sensible aux CRLF |
| Même `npm run check`, copie isolée des sources Git en LF | PASS : 78 modules ; 108 scénarios, 31 liés à une assertion |
| `npm test` (via `npm.cmd`) | PASS : 48 tests, aucun échec ni test ignoré |
| `npm run smoke` (via `npm.cmd`) | PASS : services, routes, assets et API commune |
| `npx playwright test` | PASS : 150 tests, un worker, sans retry |
| `npx playwright test --config=playwright.audit.config.js --grep 'UI-AUD-0[1-4]'` | PASS : 4 tests, aucun échec ni test ignoré |
| Capture kit `app` et `reference`, huit largeurs | PASS : 24 scènes par origine, viewport + pleine page ; aucune erreur JavaScript, aucune image applicative non décodée |
| Comparateur du kit | PASS : six paires natives et trois paires dérivées à 320 ; côte à côte, superposition 50 %, différence amplifiée |

L'échec de `check` est conservé, pas masqué. `core.autocrlf=true` produit 1 191 / 116 / 40 CRLF dans SCENARIOS.md / TEST_MATRIX.md / PERSONAS.md. Les trois contenus, après normalisation CRLF→LF, sont identiques aux blobs Git. Une copie `git archive HEAD` a été extraite dans le travail ignoré puis ses fichiers texte normalisés en LF ; `npm run check` y passe. Aucun fichier du checkout n'a été réécrit. Le générateur de documentation n'a pas été exécuté sur le dépôt de travail.

## Comportements conservés

Les tests standard couvrent recherche sans dates et datée, filtres, tri, carte simulée, contexte URL et retour fiche, galerie v1, dates de réservation, authentification et retours sûrs. Le parcours complet client/propriétaire a été joué : demande, acceptation, paiement fictif, caution séparée, huit vues des constats, remise, retour déclaré, récupération, clôture, avis et reçu. Les tests couvrent également brouillons et reprise, refus/conflits, réseau lent ou coupé, état vide, 404, chargement, fallback média, formulaire invalide, messagerie incertaine et idempotence, décisions documentaires et financières avec seconde personne.

Inspection complémentaire : v1 photographié à 1440 / 390 / 320 ; galerie à 320 fermée par Échap avec focus restauré ; recherche réellement vide `q=zzzzbaseline` ; panne réseau par interception de transport, puis suppression de l'interception et « Réessayer » avec retour aux vrais résultats. Les preuves d'erreur et de vide sont distinctes des captures natives de départ.

| Profil historique | Dashboard admin | Paiements admin | Habilitations admin |
|---|---:|---:|---:|
| Visiteur | 401 | 401 | 401 |
| renter / owner / newcomer / other | 403 | 403 | 403 |
| employee | 200 | 403 | 403 |
| admin / finance | 200 | 200 | 403 |
| super / super2 | 200 | 403 | 200 |

Toutes ces réponses ont été observées via HTTP, pas déduites des libellés. Les tests navigateur vérifient aussi les refus directs, l'affectation, les comptes suspendus et l'indépendance des cookies client/admin. Ne pas interpréter les profils fictifs comme une authentification de production.

## Paires de captures et quantification

Les PNG natifs sont pris directement dans `04_VISUAL_REFERENCES/maquettes`. Aucune déformation d'image ni égalisation du dataset. Le comparateur découpe uniquement une région commune de 1440×900 ou 390×844. Le pourcentage ci-dessous compte **toute** différence de pixel, sans tolérance : typographie, antialiasing, contenu, photos et dataset sont inclus. Ce n'est ni un score de qualité ni une mesure de régression.

| Paire native / capture seed | Pixels différents | Hauteur pleine page actuelle / cible native complète |
|---|---:|---:|
| Accueil 1440 | 87,81 % | 1 227 / 4 317 px |
| Accueil 390 | 83,32 % | 1 777 / 5 670 px |
| Catalogue 1440 | 50,89 % | 1 976 / 1 532 px |
| Catalogue 390 | 68,24 % | 2 760 / 3 310 px |
| Fiche v3 1440 | 60,81 % | 2 890 / 1 517 px |
| Fiche v3 390 | 74,13 % | 3 394 / 1 997 px |

Les captures premier écran de l'accueil restent les fichiers exacts demandés. Pour les hauteurs complètes, les cibles sont Accueil_Desktop.png / Accueil_Mobile.png. Les paires et leurs sources/cadrages sont décrites dans `comparison-metrics.json`. Une sélection de preuves lisibles est incluse dans l'archive ; les 96 PNG initiaux et leurs métriques restent disponibles localement dans le dossier ignoré `captures/`.

Écarts de données à ne pas transformer en changements du seed : cinq véhicules publics actuels contre six sur la cible catalogue ; v3 = « Renault Clio (2024) », Le Gosier, automatique, hybride, 29 €/jour, illustration locale unique. Cible = « Renault Clio V », Les Abymes, manuelle, essence, 33 €/jour, trois photos de modèle. v1 conserve ses photos synthétiques et son statut explicite de démonstration. Aucun pixel diff ne doit justifier de changer ces règles ou d'associer une photo de défaut à une autre annonce.

Mesures DOM complémentaires : titre accueil actuel 34 px à 1440, 28 px à 390 ; titre catalogue actuel 28 px aux deux largeurs ; titre de la fiche après la galerie, y=748,75 px à 1440 et y=536,70 px à 390. Les valeurs de la revue HTML dérivée sont consignées séparément dans `reference-metrics.json` et ne remplacent pas les cibles PNG approuvées.

## Inventaire des écarts et priorité

| ID | Priorité / provenance | Constat et dépendance |
|---|---|---|
| VIS-01 | P1 préexistant | Accueil : absence du hero routier, titre/signature V3.2, cadran et moteur central. Travail des lots médias et hero. |
| VIS-02 | P1 préexistant | Accueil : page beaucoup plus courte ; une carte au lieu de la sélection et des huit blocs éditoriaux. Lot sections. |
| VIS-03 | P1 préexistant | Catalogue : deux colonnes à 1440 contre trois, sidebar 260 px contre 242, hiérarchie et photos différentes. Lot catalogue. Dataset à conserver. |
| VIS-04 | P1 préexistant | Fiche v3 : illustration de secours unique, ordre galerie/titre et panneau prix/état différent. Lot fiche, mapping explicite des médias et état déclaré à préserver. |
| VIS-05 | P1 préexistant | Navigation visiteur : destinations privées Locations / Messages / Profil visibles avec protection effective. Lot navigation et rôles. Aucun contournement API observé. |
| A11Y-01 | P2 observé | Liens de logo et footer de 19–25 px de haut ; lien Démo parfois 40 px. Écart à la règle projet 44 px. Une cible <44 ne suffit pas seule à conclure à une violation WCAG 2.2 AA (exceptions/espacement non audités). |
| ENV-01 | P2 environnement | `npm run check` échoue en CRLF, passe en copie LF. Dépendance de reproductibilité documentée, aucune correction workflow/code dans ce lot. |
| QA-01 | P2 non vérifié | Lecteurs d'écran, appareils physiques, clavier virtuel, zoom navigateur réel et audit exhaustif des contrastes : à planifier/faire accepter avant conformité. |

Aucun P0 ni P1 **introduit** par le lot ; les P1 hérités ci-dessus restent ouverts. Ils ne sont pas tacitement acceptés ni déclarés résolus par la baseline.

Grille de recette, notation conservatrice et provisoire pour chacun des six écrans/largeurs natifs :

| Axe (poids) | Accueil 1440 et 390 | Catalogue 1440 et 390 | Fiche v3 1440 et 390 |
|---|---:|---:|---:|
| Composition (20) | 0, à corriger | 10, partiel | 10, partiel |
| Typographie (10) | 5, partiel | 0, à corriger | 5, partiel |
| Couleurs/surfaces (10) | 5, partiel | 5, partiel | 5, partiel |
| Médias/cadrages (15) | 0, à corriger | 0, à corriger | 0, à corriger |
| Composants (10) | 5, partiel | 5, partiel | 5, partiel |
| Responsive (10) | 5, partiel | 5, partiel | 5, partiel |
| États (8) | 4, partiel | 8, contrôles couverts | 4, partiel |
| Continuité UX (8) | 8, flux couverts | 8, flux couverts | 8, flux couverts |
| Accessibilité (9) | 4,5, partiel | 4,5, partiel | 4,5, partiel |
| **Total /100** | **36,5** | **45,5** | **46,5** |

Minimum natif : **36,5/100**, très inférieur au seuil proposé de 95. La même note pour deux largeurs signifie la même classe qualitative observée, pas une identité de pixels. Responsive partiel : reflow passant, mais composition cible différente. Le détail des preuves est celui des captures, métriques et tests ci-dessus. Les largeurs dérivées ne reçoivent pas de score de fidélité : elles restent non évaluées sur ce point (0 pour un score global exhaustif), avec inventaire de reflow uniquement. Aucun écart n'est marqué « mineur accepté » sans arbitrage.

## Responsive et accessibilité : portée exacte

| Largeur | Viewport du kit | Source cible | Contrôle |
|---|---|---|---|
| 1440 | 1440×900 | PNG natifs | Trois routes + v1, captures, comparaison native |
| 1280 | 1280×760 | Revue HTML dérivée pour ces scènes | Trois routes + v1, captures et reflow ; pas d'interaction certifiée spécifique à cette largeur |
| 1024 | 1024×900 | Revue HTML dérivée | Captures, reflow et tests existants |
| 768 | 768×950 | Revue HTML dérivée | Idem |
| 430 | 430×932 | Revue HTML dérivée | Idem |
| 390 | 390×844 | PNG natifs | Trois routes + v1, captures, comparaison native |
| 375 | 375×812 | Revue HTML dérivée | Captures, reflow et tests existants |
| 320 | 320×844 | Revue HTML dérivée | Trois paires dérivées, captures v1, galerie, erreur et vide |

Inspection géométrique de 32 combinaisons (quatre routes × huit largeurs) : aucun débordement horizontal >1 px. Aucun contrôle visible sans libellé trouvé par l'heuristique DOM ; ce relevé n'est pas un audit complet du nom accessible. Les tests utilisant les rôles/noms vérifient les contrôles des flux. Les échantillons Tab à 320 et la capture du skip link montrent le focus ; les tests existants vérifient confinement, Échap, restauration de focus et absence de masque sur les cas couverts. Le centre du lien multiligne « Démo & comptes » n'est pas hit-testable dans un échantillon : la mesure au centre peut tomber entre deux lignes ; ne pas le classer comme focus masqué sans examen complémentaire.

Contraste : 29 / 28 / 44 échantillons de texte direct sur accueil / recherche / fiche v3 à 390, couleurs CSS compositées. Minimum 6,53 / 6,53 / 7,07:1 pour les échantillons sans fond complexe ; aucun de ces échantillons sous son seuil AA. Limites : pas de certification des images, dégradés, états hover/disabled, du focus ni de tous les cadrages. Les tests formulaires couvrent `aria-invalid`, `aria-describedby`, `role=alert`, conservation de saisie et focus sur erreur. Leur annonce réelle au lecteur d'écran n'est pas vérifiée.

Le test existant fiche à texte 200 % passe. La capture complémentaire `pinch-scale-2.png` est un agrandissement CDP, **pas** un test du zoom navigateur 200 %. NVDA/Chromium, VoiceOver/Safari, clavier natif date/heure, clavier virtuel, contraste renforcé et appareil physique n'ont pas été validés. Pas de conclusion de conformité WCAG globale ni de performance mobile réelle.

## Reproduction et livraison

Sur une copie propre à la base indiquée : utiliser Node 24 et Playwright 1.56.1 avec Chromium 1194 ; garder les trois ports libres ; exécuter le vérificateur Python et les tests ci-dessus. Le script d'artefact `run-baseline.mjs` orchestre le seed jetable, les services et les captures avant les mutations. `inspect.mjs` démarre son propre seed en mémoire. Pour les références : `python -m http.server 4173 --bind 127.0.0.1 --directory LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES`, puis le script `capture-v32.mjs reference` avec l'URL `/maquettes/index.html`. `compare.py` utilise le comparateur fourni, sans modifier le handoff.

Les services de campagne sont arrêtés à la fin ; aucun service permanent n'est installé. Rapports et preuves ne contiennent que des données de démonstration. L'expurgation du dépôt est appliquée aux éléments sélectionnés avant archive ; un manifeste SHA-256 permet de contrôler chaque entrée. Aucun cookie, session, fichier de données ou dépendance installée n'est inclus dans la livraison. Les vidéos/traces locales éventuelles restent hors de cette archive bornée.

**Verdict : baseline documentée et reproductible en LF, non-conformité V3.2 mesurée. Pas de GO de conformité ni d'acceptation sans réserve : `check` échoue dans le checkout Windows et les P1 hérités restent ouverts.** PR bornée en brouillon pour revue ; fusion laissée au mainteneur. Aucun lot suivant lancé. Le feu vert explicite du mainteneur et l'arbitrage de ces réserves restent nécessaires.
