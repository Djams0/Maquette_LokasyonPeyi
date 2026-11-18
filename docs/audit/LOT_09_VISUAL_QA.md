# Lot 09 · Recette visuelle et UX/UI

Recette du 17 novembre 2026 sur la maquette uniquement. Base `86ebde01519c4d9f3615f0b04c392be9e89a8398`, intégrant 08A et 08B par les PR #9 et #10. Branche `peyi/lot-09-visual-qa`. Le principal reste une référence en lecture à `78966c97a5e8f373c8e7eff6c26c7cd356ee7b29`.

## Résultat et corrections bornées

Deux écarts CSS ont été corrigés, sans modification de routes, mutations, autorisations, sessions, fixtures ou règles métier :

- À 320 px, le focus clavier atteignait « Avis » dans la modération Admin, mais la partie droite de l’onglet restait coupée. Les onglets passent à la ligne sous 360 px. La cible reste entière, haute de 51 px, et son centre est atteignable. Le comportement aux autres largeurs est conservé.
- Les titres Résultats, Messagerie et Réservation utilisaient Lora contrairement au contrat de titres opérationnels. Ils utilisent désormais Nunito 800. Explorer et le nom du véhicule gardent Lora.

Fichiers : `admin/styles/admin.css`, `client/styles/client.css`, nouveau `tests/browser/visual-qa.spec.js`, et ce rapport. Les deux nouveaux tests vérifient le focus natif de l’onglet à 320 px et les familles/graisses calculées, y compris les exceptions éditoriales conservées. Les scénarios historiques et audit existants sont inchangés.

## Bases de comparaison et couverture

| Lot | SHA livré |
|---|---|
| 00 | `d8ef8450f762e3c8f14f15dcef6b5bc8d67cc4eb` |
| 01 | `5729bce7923520bfcc3d9caf65d101e3404892a1` |
| 02 | `25e04993176f69dd78320f88e42b7ec1fbf57ec7` |
| 03 | `0eec248ea546f49f03cc578b8de7b8d543247e64` |
| 04 | `c5b47657c76e96c5ff24170d4397f84fd193e19f` |
| 05 | `1e3382c70ef13bd8859633d35b4df603ff36b62d` |
| 06 | `2409f8d1c8ae366fd8cbcf4743977454bea6a1f4` |
| 07 | `fc0e0fbbfa6ad964fd2518420ee8021689d0a1a6` |
| 08A | `591cbdbe56ece1564930526fe8234119800dd36e` |
| 08B | `3081db1285c4495a3216270cb06dfe51d006a05b`, `cff971418956275aa8bf9f207462691531d2a07f` |

L’archive originale 00, ses 85 captures et le précontrôle 09 sont conservés. Pour obtenir des paires homogènes, le code `d8ef845` a également été extrait de Git dans le dossier de preuves, sans changer le checkout utilisateur. L’API est identique entre ce SHA et la base 09 : les deux fronts sont photographiés avec le même snapshot fictif, les mêmes origines de test isolées, dates, locale et navigateur. Les fonctions métier et fixtures versionnées ne sont pas modifiées.

La grille comprend **169 paires nominales** : 17 vues aux sept largeurs et 50 vues complémentaires à 390 px. Elle couvre les 46 contrats de routes Client/Admin inventoriés, les neuf groupes historiques du brouillon et les variantes départ/retour et 404. Les 18 états supplémentaires portent sur attente, vide, erreur, URL invalide, absence de photo, texte long, galerie, défaut illustratif, rendu facultatif, envoi incertain/hors ligne, reprise propriétaire, pièce obsolète, accès limité, suspendu, paiement refusé et brouillon absent.

Dimensions CSS : 320×844, 375×844, 390×844, 430×932, 768×1024, 1024×900 et 1440×950. Chromium 141.0.7390.37 / Playwright 1.56.1, fr-FR, Guadeloupe, DPR 1, mouvement réduit. Horloge navigateur : 1 janvier 2027 à 12:05 UTC. Chaque vue nominale reçoit une instance neuve du même snapshot. Les mutations des états complémentaires conservent leurs dates serveur réelles et ne sont pas présentées comme des comparaisons pixel homogènes de ces dates.

Les captures « avant/après » comparent le rendu du handoff à la refonte intégrée. Les quatre exemples propres aux corrections 09 conservent aussi leur image avant correction sur `86ebde0`. Les PNG cibles, les images `current_ui` du kit et la finition restent séparés ; aucune référence téléphone n’est présentée comme une baseline pixel du navigateur.

## Vérifications réelles

Les commandes utilisent Node 24.22.1 local, Python 3.13.5, Docker 28.1.1 et Compose 2.35.1-desktop.1. Les pilotes, arguments exacts, horodatages, sorties et données de recette sont conservés dans `.local-integration/lot-09-qa-20261117/`, dossier local ignoré par Git. `R` désigne ce dossier.

| Contrôle | Résultat local |
|---|---|
| `npm run check` | Syntaxe, indépendance des imports et documentation passantes. |
| `npm test` | 48/48. |
| `python -X utf8 -m unittest discover -s tests -p 'test_*.py'` | 2/2. |
| `node R/tools/run-browser.mjs browser-first client` | 135/135 sur la base intégrée, avant corrections. |
| `node R/tools/run-browser.mjs visual-targeted client visual-qa.spec.js --repeat-each=3` | 6/6 sur les deux corrections. |
| `node R/tools/run-browser.mjs browser-delivery client` | 137/137 sur le dernier état. |
| `node R/tools/run-browser.mjs historical-first history` | 13/13, seed historique neuf et assertions inchangées ; seules origines, sorties et résolution du même Playwright sont adaptées au transport isolé. |
| `node R/tools/run-browser.mjs audit-first audit` | 11/11, dont UI-AUD-01 à 04, sur instances neuves. |
| `node R/tools/profile-boundaries.mjs` | 9 profils historiques + 30 audit, 78 frontières de connexion conformes. Les autres parcours sont exercés par les acteurs des suites, pas chaque combinaison des 39 profils. |
| `node R/tools/capture.mjs avant`, `apres` ; `node R/tools/states.mjs avant`, `apres` | Paires, viewport et page complète ; aucune erreur de rendu nominale ni débordement global final. Axe local 4.10.3, règles WCAG 2 A/AA, 2.1 et 2.2 AA : aucune violation détectée sur les 187 vues/états après. |
| `node R/tools/keyboard.mjs` | 168 points de focus natif, sans recentrage artificiel, à 320 et 1440 px : visibilité, hit-test et absence de recouvrement. |
| `node R/tools/browser-zoom.mjs` | Zoom natif Chromium 100/200 %, sept écrans, champ et action : 28 mesures ; cibles, focus, bornes, DPR et absence de débordement. |
| `docker compose -p lp-lot09-20261117 -f compose.yaml -f R/tools/compose.ports.yaml config` et `up --build -d --wait` ; `node R/tools/smoke-compose.mjs` | Trois services sains, routes/assets/source API commune passants. Projet, volume et ports 33020/38108/38109 distincts. |
| Smoke local standard en conteneur neuf, réseau coupé, dépôt monté en lecture seule, tmpfs, `PORT=`, `NODE_ENV=test`, `DATA_FILE=/tmp/mock.json` | Course préexistante reproduite : attente du seul client puis connexion API refusée. |
| Même isolation → `node R/tools/container-historical.mjs` | Smoke original passant après attente explicite de santé API. Aucun correctif de stack hors lot. |

L’inventaire `scripts/audit-evidence.mjs` et `scripts/sanitize-evidence.py` s’appliquent uniquement aux sorties locales de ce lot avant partage. Les profils Chromium jetables sont supprimés après fermeture. Les fichiers et résultats utilisateur antérieurs ne sont pas nettoyés.

## Écarts, différences légitimes et limites

| Priorité | Observation | Statut |
|---|---|---|
| P2 | Onglet Avis partiellement coupé au clavier à 320 px. | Corrigé, paire avant/après spécifique et test de non-régression. |
| P3 | Lora sur trois familles de titres opérationnels. | Corrigé selon le kit ; exceptions Explorer/fiche conservées et testées. |
| P3 | Les 404 logiques Client et Admin utilisent un titre `h2`, sans `h1`. | Préexistant, signalé ; correction sémantique hors des seuls changements CSS autorisés ici. Captures des deux routes conservées. |
| Information | Plus de champs, critères, explications et pièces que dans certains PNG. | Différence motivée par les contrôles existants, textes de 14 px minimum et cibles 48 px ; aucun état ni champ retiré pour reproduire une image. |
| Information | Couleur/photo, nombres d’annonces, périodes, prix et état de suivi différents des exemples V2. | Données réelles du mock conservées. Photo associée seulement à l’identité v1 ; SVG local ailleurs ; carte explicitement schématique. |
| Information | Un fil peut décrire un véhicule sans rattachement précis à une location. | Aucun rattachement ni non-lu inventé lorsque l’API ne le fournit pas. |
| Limite | Relecture avant mutation sans nouveau verrou atomique. | Les garanties documentaires, d’annonce, de session, de brouillon et de dossier restent celles du mock et des lots 07/08. |
| Limite | Axe présente des contrôles incomplets de contraste et `aria-controls` sur menus fermés. | Incomplets distincts des violations ; revue visuelle, clavier et géométrie effectuées. Pas de certification exhaustive revendiquée. |

Les échecs de collecte initiaux sont conservés : attente d’une ligne volontairement masquée dans le fil mobile, attente d’un `h1` sur une ancienne 404, recherche d’un texte transitoire de paiement dans le mauvais conteneur et casse du libellé hors ligne. Ils ont été relus puis rejoués sur instances neuves, sans changement applicatif pour ces points. Le premier contrôle de zoom était pris pendant le chargement/défilement ; après stabilisation, les 28 mesures passent. Le défaut clavier Admin a, lui, été reproduit avant sa correction CSS.

Non exécutés : appareils iOS/Android physiques, clavier virtuel, lecteur d’écran, p95 et homologation inter-navigateurs. Les captures comparables gardent le même Chromium. Les décisions ouvertes du kit sur conservation, contact, preuve, assurance, tarification, délais et concurrence restent ouvertes. La maquette n’atteste aucune identité ni aucun état physique réel.

La livraison est une PR de revue distincte vers `main`, sans fusion automatique. Consulter son dernier SHA et sa CI ; les succès locaux ci-dessus ne sont pas présentés comme une CI non exécutée. Le rapport détaillé, la galerie interactive, les résultats expurgés, le patch et les commandes reproductibles restent dans `R`. L’aperçu persistant est reconstruit avec son volume conservé ; seul le projet Docker de recette est arrêté, sans suppression de volume.
