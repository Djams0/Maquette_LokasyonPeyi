# Lot 04 · Suivi, paiement et caution

## Résultat et base de revue

Le suivi affiche l’acteur, sa prochaine action et les prérequis avant la progression. Le paiement simulé distingue demande acceptée, paiement confirmé et contrôle de caution. La recette couvre le parcours complet, le refus récupérable, les constats requis, la remise, la déclaration du retour, la récupération et la clôture.

- Base `origin/main` et HEAD de départ `a355918a6be3fc2086fd2b6a2be88055c5f0f55b`, lot 03 fusionné par la PR #27. La référence auditée `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` est ancêtre de la branche.
- Le diff depuis l’audit a été requalifié sur un arbre isolé. Il reprend les fondations, le compte et les surfaces de location des lots précédents. Les sources du catalogue, de la fiche, de l’API et des transitions sont identiques à la référence.
- Branche `client-v32/lot-04`. Le SHA final et les résultats bruts du workflow figurent dans la PR. Restauration par réversion du commit de ce lot.

## Fichiers et décisions

| Fichier | Raison |
| --- | --- |
| `client/pages/rentals.js` | Suivi et paiement dans des surfaces opérationnelles, carte d’action, jalons, historique, prérequis, devis et résultat vérifié. Les actions gardent `rentalNext`, `rentalProgress`, les routes et les corps du mock. |
| `client/styles/client.css` | Carte profonde, rail bureau, commandes en flux, détail passé repliable et accusé de confirmation sans superposition. Styles limités aux deux surfaces. |
| `tests/browser/booking.spec.js` | Sept scénarios supplémentaires de refus, réponse tardive ou perdue, relecture, reflow, 401, 409 et 422. Assertions de fin de parcours pour les branches refusée et retirée. |
| Rapport, suivi et manifeste kit | Traçabilité de la revue et empreinte du suivi mise à jour. |

Suivi classé B selon le kit, paiement classé A. Les planches B 18 à 20 fixent la composition. Les modèles, montants, dates et rôles affichés proviennent de la fixture. Le détail distingue le point de rendez-vous après confirmation, les constats et le lien de conversation réservé au véhicule et aux participants. L’état inconnu garde un chemin de relecture. Le refus et le retrait ferment leur branche au deuxième jalon.

Le devis enregistré renseigne jours, tarif par jour et total fictif. La caution conserve son statut séparé. Le formulaire demande le résultat de simulation et un consentement explicite. Un refus enregistré garde `awaiting_payment`, permet une autre simulation et conserve la caution. Après une réponse perdue, la relecture autorisée montre l’état réel. Si la version reste identique, l’action explicite peut reprendre avec la même clé et le même corps. La clé est conservée par compte, location et version dans le stockage de session et utilise l’en-tête déjà pris en charge par l’API. Un rechargement remet le consentement à zéro.

## Recette

Node 24.22.2, Playwright 1.56.1, Chromium 141.0.7390.37 et Python 3.13.5 sur Windows. Services API, client et administration sur loopback et état mémoire jetable. Les données de capture protégées reprennent le jeu du lot 03. Les captures des écrans du lot emploient la fixture d’audit synthétique sur les deux arbres.

| Commande ou vérification | Résultat |
| --- | --- |
| `npm run check` | Passé, contrôle de syntaxe et des parcours documentaires. |
| `npm test` | 50/50. |
| `python -m unittest discover -s tests -p "test_*.py"` | 2/2. |
| `npm run smoke` | Passé sur les trois services jetables. |
| `python tools/verify_v32.py` et `python tools/verify_extension.py` | Passés depuis le kit. |
| Playwright requis `booking`, `navigation`, `maquette`, `visual-qa` | Référence 49/49, candidat 56/56. Comparaison par cas dans les preuves. |
| Réservation | 31/31, dont sept nouveaux sur le suivi et le paiement. |
| Protections publiques | 72/72, dont navigation par rôle, filtre, tri, retour, galerie, comptes et contrôles visuels. |
| Workflow GitHub | Les résultats bruts de l’UI et de l’audit essentiel en mode souple, l’audit étendu et l’expurgation sont consignés dans la PR. |

La chaîne complète passe par les actes existants. Les refus 401 et 403 protègent les données de la location. Le conflit 409 impose la relecture de l’état et le refus 422 garde la saisie valide et porte le focus sur le message. Un test perd la réponse après une écriture de paiement refusé et vérifie qu’une seule opération existe dans l’historique. Un autre interrompt l’action avant écriture, relit le statut et rejoue la même clé avec le même résultat choisi après actualisation.

Un rejeu à 320 px a relevé le centre du bouton de caution alors que seul son bord supérieur entrait dans la fenêtre. La capture confirme l’absence de superposition. L’essai vérifie désormais le focus au clavier, centre le bouton et mesure sa taille et son recouvrement. Le seuil de visibilité de 99 % absorbe l’arrondi de sous-pixel observé lors de la première correction.

La CI 45265960567 a révélé une course dans le scénario 409. Le test pouvait exécuter le paiement concurrent avant le premier rendu du formulaire. Il attend maintenant l’affichage de l’action autorisée avant de changer l’état côté API, puis vérifie le refus et la relecture dans l’interface. L’expiration de session et le conflit sur l’acceptation suivent le même ordre explicite.

## Captures, mesures et scores

Les preuves locales sont dans `audit-results/client-v32-lot-04/`. `comparaison.html` présente les PNG avant/après, `comparaison.json` leurs mesures pixel, `tests-individuels.csv` le résultat de chaque test et `accessibilite/mesures.json` les mesures clavier et zoom.

- 24 paires protégées à 320, 375, 390, 430, 768, 1024, 1280 et 1440, en fr-FR, fuseau America/Guadeloupe, DPR 1 et horloge au 21 novembre 2026, 16 h UTC. 19 paires pixel-identiques. Les cinq autres varient de 6 niveaux par canal au maximum. Les essais de rôle, de retour, de filtre/tri, de galerie et d’accessibilité sont joints.
- 28 paires des écrans du lot, dont le suivi confirmé et le paiement attendu aux huit largeurs. Les états supplémentaires montrent le propriétaire, le refus et la clôture à 390 et 1440. Le compte, les médias et les tarifs des planches sont illustratifs. Les captures de recette reprennent le mock.
- Six paires à 390 et 1440 documentent le paiement en cours, la perte de réponse et le résultat relu. Le mock confirme une seule écriture par scénario.
- Neuf mesures de focus, taille et recouvrement sur les actions de suivi locataire, suivi propriétaire et paiement. Reflow à 320 px, texte 200 %, zoom natif 200 % et contrastes des échantillons analysés avec Axe. La commande mesurée est d’au moins 48 CSS px.

| Écran et états | Largeurs | Score provisoire |
| --- | --- | --- |
| Suivi · acteur, prérequis et sept jalons | 320, 375, 390, 430, 768, 1024, 1280, 1440 | 95/100 |
| Suivi · retour propriétaire, refus et clôture | 390, 1440 | 95/100 |
| Paiement · demande acceptée, prix, formulaire et consentement | 320, 375, 390, 430, 768, 1024, 1280, 1440 | 95/100 |
| Paiement · refus, confirmation et lecture propriétaire | 390, 1440 | 95/100 |

La grille du kit attribue la moitié des points d’accessibilité quand la preuve est partielle. Le lecteur d’écran et le clavier virtuel Android/iOS restent à vérifier. Le contrôle de session avant envoi et l’autorisation par cookie restent deux opérations. La déduplication couvre les reprises avec la clé conservée dans l’onglet. Un effacement du stockage de session retire ce lien et impose la lecture du statut réel.

## PUB-01 et décision

L’essai historique du tiroir 880 → 390 est conservé. Le candidat reproduit le défaut une fois sur huit et la référence passe ses huit essais de cette campagne. La signature de l’échec est celle des lots précédents. Le journal des répétitions sur les deux arbres est joint aux preuves. Lorsque le défaut se reproduit, le dialogue contient zéro occurrence de `#search-filters` au lieu d’une.

**En revue humaine.** Le verdict technique final et les résultats du workflow sont dans la PR. Le lot suivant attend le GO humain.
