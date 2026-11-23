# Lot 05 · États des lieux

## Résultat et base de revue

L’écran guide vers la première vue manquante, affiche les huit positions dans leur ordre et garde le formulaire atteignable sur mobile. Le compteur, la charge, les observations et la confirmation restent les données du constat. La finalisation exige huit vues distinctes et le consentement. Le suivi sur l’autre route autorise la remise ou la déclaration de retour après vérification du constat correspondant.

- Base `origin/main` et HEAD de départ `545494a390ece034517d10e6a4cb54988268ec59`, lot 04 fusionné par la PR #28. La référence auditée `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` est ancêtre de la base.
- Travail dans un arbre de revue isolé. Le diff depuis l’audit correspond aux surfaces livrées lors des lots précédents. Les règles de remise et de déclaration de retour sont celles de `departureReady`, `returnReady` et des transitions API.
- Branche `client-v32/lot-05`. Le SHA final et les résultats bruts de CI figurent dans la PR. Restauration par réversion des commits du lot.

## Fichiers et décisions

| Fichier | Raison |
| --- | --- |
| `client/pages/inspection.js` | Mise en page des deux phases, progression et version des métadonnées, dialogue simulé, focus, formulaire et reprise. Conserve `photo`, `save` et `finalize` sur le POST existant. |
| `client/app.js` | Transmet à cette route l’identité déjà lue, pour vérifier le compte avant l’écriture de démonstration. |
| `client/styles/client.css` | Grille en bureau, vues compactes, progression, formulaire et dialogue rangés sous la portée du constat. |
| `tests/browser/booking.spec.js`, `tests/browser/maquette.spec.js` | Six nouveaux cas, plus la progression après chaque vue durant le parcours complet départ/retour. |
| Rapport, suivi et manifeste kit | Traçabilité et empreinte du suivi mise à jour. |

Périmètre B selon les planches B 21 à 23. Les tuiles contiennent des métadonnées de capture simulée et le cadrage illustratif. Le test intercepte `getUserMedia` et confirme zéro appel. Les refus de caméra simulée et de cadrage flou gardent la version courante. Le remplacement confirmé affiche la nouvelle version et permet de consulter l’historique. En lecture seule, une réserve ouvre le dossier existant.

Les valeurs sont préservées pendant les captures et les lectures de reprise. Le compteur est entier et la borne du retour vient du départ finalisé. Le contrôle de charge accepte les valeurs comprises entre 0 et 100 %, y compris les décimales prises en charge par l’API. Le navigateur et l’API contrôlent les prérequis. La finalisation confirmée revient au suivi. Une finalisation vérifiée après perte de réponse rend l’original en lecture seule.

La tentative mémorise l’identité, la phase, l’état observé, le corps et la clé d’idempotence existante dans l’onglet. L’interface relit le constat après une réponse perdue. Sans confirmation de l’opération, la reprise explicite garde la même clé et le même corps. Si l’autre participant a ajouté une vue, une lecture supplémentaire ramène le constat courant et conserve les deux captures. Les observations saisies mais jamais soumises restent en mémoire sur la page. Leur conservation après navigation repose sur « Sauvegarder et reprendre ». Le stockage effacé retire la clé de reprise de l’onglet.

## Recette

Node 24.22.2, Playwright 1.56.1, Chromium 141.0.7390.37 et Python 3.13.5. Services API, client et administration sur loopback avec état mémoire jetable. La fixture publique du lot 04 est identique entre référence et candidat. Les scènes du constat utilisent la fixture d’audit et cinq vues préparées par les fonctions du mock, avec une version remplacée et des dates fixes. Ces données servent uniquement aux captures locales.

| Vérification | Résultat |
| --- | --- |
| `npm run check`, `npm test` | Contrôle de syntaxe et de liens passé. 50/50 tests Node. |
| `python -m unittest discover -s tests -p "test_*.py"` | 2/2. |
| `npm run smoke` | Passé sur services jetables. |
| `python tools/verify_v32.py`, `python tools/verify_extension.py` | Passés depuis le kit. |
| Playwright requis `maquette`, `booking`, `components` | Référence 53/53 et candidat 59/59. Les résultats par cas figurent dans la galerie et la PR. |
| États des lieux | 6/6 sur les essais spécifiques. |
| Protections | 72/72. Rôle, retour, filtre/tri, galerie, compte et recette visuelle. |
| Workflow GitHub | Résultats bruts de l’UI et de l’audit essentiel en mode souple, audit étendu et preuves expurgées dans la PR. |

Le premier essai du retour finalisé trouvait deux occurrences du texte « Original conservé » dans le statut et le résumé. Le statut annonce maintenant la vérification et le résumé porte la mention de conservation. Le test contrôle chacun dans son emplacement.

## Captures, mesures et scores

Les preuves locales sont dans `audit-results/client-v32-lot-05/`. `comparaison.html` associe les PNG avant/après, `comparaison.json` contient les mesures pixel, `tests-individuels.csv` donne le résultat par cas et `accessibilite/mesures.json` détaille le clavier et le zoom.

- 24 paires protégées à 320, 375, 390, 430, 768, 1024, 1280 et 1440, en fr-FR, fuseau America/Guadeloupe, DPR 1 et horloge au 21 novembre 2026, 16 h UTC. 21 sont pixel-identiques. Les trois autres varient de quatre niveaux par canal au maximum. Les 18 scénarios d’interaction passent sur chaque arbre.
- La capture interactive du catalogue locataire à 1440 varie sur le texte des sélecteurs natifs. Une répétition du candidat correspond à la référence pixel à pixel. Les valeurs et les styles des sélecteurs sont dans `temoins.json`.
- 20 paires du constat. Départ partiel et retour finalisé aux huit largeurs. Retour sans vue et dialogue de capture floue à 390 et 1440.
- Neuf mesures sur capture, sauvegarde et ouverture d’une réserve. Aucun débordement ou recouvrement, focus visible et cibles mesurées d’au moins 48 CSS px. Reflow à 320 px, texte 200 % et zoom natif 200 %. Axe ne signale aucune violation sur les échantillons. Il demande une mesure manuelle sur la zone d’observations, dont le texte calculé `#162728` sur blanc donne 15,50:1.

| Écran et états | Largeurs | Score provisoire |
| --- | --- | --- |
| Départ · vue suivante, formulaire et liste | 320, 375, 390, 430, 768, 1024, 1280, 1440 | 95/100 |
| Retour · original finalisé et accès à la réserve | 320, 375, 390, 430, 768, 1024, 1280, 1440 | 95/100 |
| Retour · vide ou capture floue | 390, 1440 | 95/100 |

La grille du kit attribue la moitié des points d’accessibilité quand la preuve est partielle. La relecture du dialogue à 320 px et texte 200 % a conduit à empiler ses deux boutons, ainsi que ceux du formulaire, pour garder les libellés lisibles. Les trois mesures du dialogue vérifient aussi l’erreur annoncée, Échap et le retour au déclencheur. Le lecteur d’écran et le clavier virtuel Android/iOS restent à vérifier. Aucune permission de caméra réelle n’est exercée par ce scénario simulé.

## PUB-01 et décision

Le test historique du tiroir 880 → 390 est maintenu. Le candidat passe 8/8 et la référence reproduit le défaut quatre fois sur huit. Le résultat de chaque répétition figure dans le tableau des preuves. La signature connue est l’absence de `#search-filters` dans le dialogue au retour à 390.

**En revue humaine.** Les résultats bruts de la campagne et le verdict technique figurent dans la PR. Le lot suivant attend le GO humain.
