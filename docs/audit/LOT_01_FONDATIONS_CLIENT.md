# Lot 01 · Fondations des surfaces client

Recette du 23 novembre 2026. L’échantillon opérationnel est accessible sur `/design-system`, sous le titre « Surfaces opérationnelles ». Il réunit gabarit formulaire/rail, carte de suivi, état vide, formulaire de période avec reprises et dialogue critique.

## Base et périmètre

| Référence | Révision |
| --- | --- |
| Base auditée du kit | `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` |
| Installation du kit dans la PR #24 | `4fefaf4198a5adb8f7585dc60f07ce714261bc0c` |
| `origin/main` vérifié et base de `client-v32/lot-01` | `006fdcacae4201d17184d855cf30ad3b9d9ff1fd` |
| SHA final et PR | HEAD de la branche et PR communiqués avec la livraison. |

`git fetch origin` et le contrôle d’ascendance sur le checkout de recette passent. Depuis le SHA audité, `main` a reçu le kit et le rapport du lot 00. Les fichiers runtime, tests et CI étaient identiques. Le travail a été réalisé dans un clone LF propre. Le checkout utilisateur, qui contenait des suppressions locales dans les anciens prompts, a été laissé en l’état. L’envoi du lot 01 après confirmation de la fusion du lot 00 a été pris comme GO de démarrage avec les réserves déjà documentées.

| Fichier | Raison |
| --- | --- |
| `client/pages/demo.js` | Monte l’échantillon dans la page de composants, à la suite de la démo du verre. |
| `client/pages/operational-samples.js` | Compose l’exemple avec `field`, `select`, `bindForm`, `formValues`, `errorSlot`, `badge`, `empty`, `link` et `modal`. |
| `client/styles/client.css` | Utilise les tokens V3.2 existants sous `#main .client-operational`. Gabarit à 1200 px, rail responsive, cartes opaques et styles de retour. |
| `tests/browser/components.spec.js` | Ajoute les règles de gabarit, les états du formulaire et le dialogue au clavier. |
| `tests/browser/maquette.spec.js` | Attend le message confirmé dans le fil avant la bascule du locataire vers le propriétaire. |
| `docs/audit/LOT_01_FONDATIONS_CLIENT.md`, suivi et manifeste du handoff | Conservent la recette, ses limites et les décisions humaines attendues. Le manifeste actualise la taille et l’empreinte du suivi. |

Classe A. B p. 11–12 donne la palette, la structure des cartes/formulaires et la hiérarchie des actions. Le gabarit répond à B p. 43. Les contrôles à B p. 44–45 restent liés aux rôles et au focus. L’échantillon sélectionne un cas de validation de période et de retrait local. Les écrans métier seront traités par leurs lots. La démo du verre d’A p. 9 reste distincte. `ui/base.css`, `ui/tokens.css`, `ui/components.js`, le shell et les contrats `/api/v1` sont inchangés.

## États, erreurs et reprises

| État | Comportement vérifié |
| --- | --- |
| Vide | Carte « Aucune demande à suivre », accès au catalogue existant. |
| Attente métier | Badge « En attente du propriétaire ». Le propriétaire décide et le locataire peut retirer, selon le parcours du mock. |
| Format invalide | Date de retour antérieure ou égale, focus natif du champ et alerte reliée. L’aide permanente reste associée au champ après correction. |
| Chargement | Indication hors du formulaire occupé et contrôle de soumission bloqué par `bindForm`. Les dates restent visibles. |
| Refus ou panne | Alerte nommée, focus de reprise, valeurs conservées et nouvelle tentative disponible. |
| Réponse tardive | Une réponse pour la saisie précédente ne confirme pas les dates modifiées pendant l’attente. Vérification explicite de la nouvelle saisie. |
| Succès | Annoncé au terme de la vérification fictive. Le test valide zéro écriture réseau. |
| Retrait simulé | Dialogue natif nommé, conséquence décrite, action explicite. Échap conserve l’attente. Confirmation et réinitialisation modifient seulement l’échantillon et restaurent le focus. |

## Exécution locale et CI

Windows x64, Node 24.22.2, Python 3.13.5, Playwright 1.56.1, Chromium 141.0.7390.37. Les tests ont utilisé les fixtures du dépôt et des services sur loopback. Le smoke a disposé de son fichier synthétique et des trois ports 8080, 8081 et 3001. Les opérations transactionnelles existantes restent simulées dans leurs propres API en mémoire.

| Commande | Bilan |
| --- | --- |
| `npm run check` | 79 modules vérifiés. 108 scénarios documentés, 31 reliés à une assertion. |
| `npm test` | 50/50. |
| `python -m unittest discover -s tests -p "test_*.py"` | 2/2. |
| `npm run smoke` | Santé des trois services, chargement des routes et assets, API commune. |
| `python tools/verify_v32.py` et `python tools/verify_extension.py` | Deux succès depuis le dossier du handoff. 33 routes, 24 PNG protégés et 37 ressources runtime vérifiés par l’extension. |
| `npx playwright test tests/browser/components.spec.js tests/browser/visual-qa.spec.js tests/browser/admin.spec.js tests/browser/navigation.spec.js` | 45/45. Neuf composants, trois recettes visuelles, 24 Admin, neuf navigations. |
| `npx playwright test tests/browser/explorer.spec.js tests/browser/search.spec.js tests/browser/vehicle.spec.js` | 53/53. Recherche, filtres, tri, galerie et contexte de retour. |
| Trois tests de l’échantillon final | 3/3. Ils produisent les preuves d’état et la capture du dialogue au niveau viewport. |
| Rejeu ciblé du tiroir `--grep 'tiroir unique' --repeat-each=8` | Branche 5/8. Référence 4/8. |

Les tests visuels vérifient aussi les H1 de demande et du catalogue, respectivement Nunito et Lora, et le parcours clavier à 1280 px. Les preuves sont expurgées avec `scripts/sanitize-evidence.py`. Le bilan CI détaillé est joint à la PR après vérification de ses résultats bruts. Les étapes UI et profils essentiels sont souples par défaut. L’audit étendu est déclenché à la demande.

### Diagnostic de la suite complète

Les deux premières tentatives de la CI de branche donnent 176/177 puis 175/177. Les 4 profils essentiels passent dans les deux cas. La première tentative échoue sur `maquette.spec.js`, pendant l’assertion de réception du message côté propriétaire. La deuxième reproduit cet échec et PUB-01. [Journal de la première tentative](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/45134930152/job/137558840876) · [Journal de la deuxième tentative](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/45134930152/job/137561707619)

La trace de la première tentative montre que l’assertion locataire trouve le texte dans `.message-attempt-text`, pendant « Envoi en cours ». Aucun POST de message ne précède la bascule. Le propriétaire charge alors le fil créé, encore vide. Le protocole contrôlé reproduit cette séquence sur `006fdca` et sur la version initiale du lot. Sur les deux révisions, l’attente du message confirmé dans « Messages du fil » mène à un POST unique et à la réception côté propriétaire. Le diff de recette borne la première assertion à ce fil. L’assertion de réception et le scénario financier restent en place. [Version initiale du lot](https://github.com/Djams0/Maquette_LokasyonPeyi/commit/28fbcd418560688632af58126201c1502afb4712)

Un rejeu local complémentaire en parallèle de `maquette.spec.js` donne 12/13 sur chaque checkout. Le parcours long atteint la limite globale de 60 secondes, au reçu sur la référence et au constat sur la branche. Il passe dans les deux jobs CI ci-dessus. Le diagnostic expurgé et le rejeu ciblé sont conservés dans le dossier de preuves du lot.

## Comparaisons et scores

Simulations à graine identique, `fr-FR`, America/Guadeloupe, DPR 1 et horloge navigateur `2026-11-21T16:00:00Z`, mouvement réduit. Les deux clones ont donné 44 captures stables chacun, dont 24 premiers écrans protégés, six pages complètes, dix captures d’états/retours, deux variantes de filtres et deux vues Admin. Deux extraits de la démo du verre complètent les paires. Les témoins reprennent le même SHA et la même graine.

Score d’identité pixel sur 100, sans arrondir les valeurs à 100 lorsqu’un différentiel subsiste.

| Largeur CSS | Accueil | Catalogue | Fiche v3 |
| ---: | ---: | ---: | ---: |
| 320 | 100,0000 | 99,9622 | 99,9704 |
| 375 | 99,9972 | 99,9596 | 100,0000 |
| 390 | 99,9964 | 100,0000 | 100,0000 |
| 430 | 99,9973 | 99,9973 | 100,0000 |
| 768 | 100,0000 | 99,9883 | 100,0000 |
| 1024 | 100,0000 | 99,9906 | 100,0000 |
| 1280 | 100,0000 | 99,9746 | 100,0000 |
| 1440 | 100,0000 | 99,9925 | 100,0000 |

Treize des 24 premiers écrans sont pixel-identiques. Sur les onze autres, moins de 0,041 % des pixels diffèrent et l’écart maximal de canal est de 6/255. Le témoin sur le même SHA reproduit des différences de rasterisation du catalogue à 768 et 1024. Les six pages complètes, le verre à 320 et 1440 et Admin à 320 sont identiques au pixel près. À 1440, la différence Admin se limite à 201 pixels du mot « Tous » dans un sélecteur natif. Le libellé et la géométrie observés sont conservés. Les 18 contrôles complémentaires d’interaction réussissent sur chaque checkout, avec des relevés identiques. Ils couvrent rôles connectés, galerie, filtre, tri et navigation à 390 et 1440.

L’échantillon est pré-évalué à **95/100** sur les huit largeurs testées, selon la grille du kit appliquée au périmètre du lot. Les critères de cohérence, hiérarchie, composition, compréhension, navigation, lisibilité, interactions, responsive et faisabilité sont démontrés pour l’échantillon. L’accessibilité reçoit 5/10 en attente des essais d’assistance sur appareil. Les états interactifs sont photographiés à 390 et le dialogue à 320. Les autres largeurs ont des mesures nominales de gabarit, de cibles et de reflow.

Galerie, mesures, PNG et résultats individuels dans `audit-results/client-v32-lot-01/`, avec `comparaison.html`, `comparaison.json` et `tests-individuels.csv`.

## Accessibilité

Gouttières de 12 px à 320 puis 16 px à 375/390. Une colonne jusqu’à 768 et deux à partir de 1024 avec rail de 280 à 360 px. Les contrôles échantillonnés atteignent 44 × 44 px, le geste critique atteint 48 px. À 320 et texte racine à 200 %, l’échantillon reste dans sa largeur, avec focus visible et commande atteignable. Le zoom natif à 200 % donne 307 px CSS et aucun débordement. Le dialogue reste utilisable au clavier et en couleurs forcées. Les dates utilisent les champs natifs.

Sur les couleurs calculées, le bouton principal atteint 7,14:1, l’attente 7,47:1, le libellé d’aide 6,06:1, la bordure de champ 3,61:1 et le focus sur blanc 7,29:1. Axe 4.10.3 donne 19 règles passantes et aucune violation ou vérification incomplète sur l’échantillon à 100 et 200 % de zoom. Le lecteur d’écran, le clavier virtuel et les appareils physiques restent non vérifiés. Les annonces ont été contrôlées par leur sémantique DOM. Le débordement historique de `/login` avec texte racine doublé reste tracé au lot 00.

## PUB-01 et restauration

PUB-01 reste le P1 historique du tiroir. La branche reproduit trois échecs sur huit essais en `390 → 880 → 390`, la référence `006fdca` en reproduit quatre sur huit avec le même navigateur. Le test confirme le budget `40` et le focus à 880. L’échec se manifeste au retour à 390 sur le nombre de formulaires dans le dialogue, zéro au lieu de un. Les assertions de valeur et de focus à 390 suivent ce point. Ces échecs n’établissent pas de perte de valeur. Les petits échantillons ne permettent pas d’estimer une variation de fréquence. Le tiroir et ses assertions sont inchangés.

Le retrait du commit de lot enlève le point de montage, la feuille locale et les assertions d’échantillon. Les services de test sont arrêtés après la recette. Les jeux et preuves restent dans le dossier ignoré de la campagne.

## Verdict

**Prêt pour revue humaine, GO final en attente.** Les variantes de l’échantillon et les preuves sont à valider avec les réserves d’accessibilité et PUB-01. Le lot 02 attend cette décision.
