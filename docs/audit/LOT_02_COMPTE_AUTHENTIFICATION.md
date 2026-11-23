# Lot 02 · Compte et authentification simulée

Connexion, inscription, profil et justificatifs adoptent la portée opérationnelle du lot 01. Le retour `next`, les transitions de session et les versions du mock restent la référence.

## Base et périmètre

| Référence | Révision |
| --- | --- |
| SHA audité du kit | `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` |
| Installation du kit | `4fefaf4198a5adb8f7585dc60f07ce714261bc0c` |
| `origin/main` au démarrage | `006fdcacae4201d17184d855cf30ad3b9d9ff1fd` |
| Base testée au démarrage | `6fb418bf1a330cd4c5c7f075061b124d44bce379` · lot 01 |
| `origin/main` vérifié avant publication, base de `client-v32/lot-02` | `6221d2b1eb342be314b4806d2d9e4ecf27316e4c` · fusion du lot 01 |
| SHA final et PR | HEAD de `client-v32/lot-02` et PR de livraison |

Le contrôle d’ascendance passe sur le clone LF propre. L’envoi du lot 02 a été pris comme GO de démarrage sur le lot 01. La PR #25 a ensuite été fusionnée dans `main`. `6fb418b` et `6221d2b` ont le même arbre Git `8980a51843232a4f0e6bc9434f75bc0888e5ebdd`, et le diff est vide. La branche du lot 02 a avancé sur ce nouveau `main` avant publication, avec les preuves déjà acquises. Les suppressions locales d’anciens prompts dans le checkout utilisateur ont été préservées.

| Fichier | Raison |
| --- | --- |
| `client/pages/account.js` | Rendu des quatre écrans, conservation des destinations et confirmation des actions après réponse ou vérification du mock. |
| `client/styles/client.css` | Cartes et compositions sous `.account-surface`. Remise en ligne de l’en-tête et de la barre basse bornée à ce marqueur aux petits viewports. |
| `tests/browser/account.spec.js` | Sept assertions de parcours et de reprise, sur API et jeux synthétiques dédiés. |
| Rapport, suivi et manifeste du handoff | Décision d’entrée, preuves de revue et empreinte du suivi. |

Classe A. B p. 13–15 donne les compositions. Le bourg de Deshaies reprend le WebP existant et son crédit `photo-53`. La photo occupe le panneau droit au bureau et se masque sous 768 px. B p. 44 identifie les retours et les rôles. Les notifications et avis restent des raccourcis dans le profil. Leurs écrans et `client/app.js`, `navigation.js`, `ui/components.js`, l’API, Admin, les fixtures et le workflow conservent leurs comportements.

## États et intégrité

| Écran | Cas contrôlés |
| --- | --- |
| Connexion | Ouverture publique, liste de personas actives, refus si une persona devient indisponible, sélection conservée, reprise sans `next`. Après une réponse perdue, `/me` doit confirmer la persona active choisie. |
| Inscription | Consentement et prénom requis, nom et confirmation conservés après 422. Pendant une réponse tardive, le formulaire reste occupé et aucune confirmation n’est affichée. Une création incertaine renvoie vers la vérification du compte et bloque un deuxième envoi dans la page. |
| Profil | Bandeau identité, état réel d’éligibilité, aide et rail propriétaire selon le rôle. Les liens vers locations, avis et notifications et le dialogue de paiement fictif restent accessibles. La déconnexion demande le compte courant et attend la confirmation. |
| Justificatifs | Permis et identité de compte seulement, sans `vehicleId`. Requis, en attente, refusé, vérifié. La version et le motif retournés par le mock sont visibles. L’envoi confirmé ou retrouvé recharge le dossier. |

Le client relit les justificatifs de l’acteur avant un remplacement. Une version avancée provoque la relecture du dossier. La clé existante du mock est réutilisée pour reprendre un envoi de même type et de même version. Les tests coupent la réponse avant et après écriture. Ils vérifient le maintien de la version précédente, le réessai avec la même clé et l’absence de deuxième remplacement après l’écriture confirmée par relecture. La perte de réponse de `/register` reste ambiguë lorsque le navigateur n’a pas reçu le cookie. Il n’existe pas de réconciliation serveur de l’inscription dans le lot.

L’invité revient à `/vehicle/v3` avec les critères et le retour catalogue inchangés. Le parcours demande revient à `/request/v3` avec la période du 10 au 14 juin 2027, sans créer de réservation. Les suites existantes rejouent aussi `/owner/start`, la perte de session, le retour navigateur et le gel du contenu lors de `pageshow` avec `persisted`.

## Exécution locale et CI

Windows x64, Node 24.22.2, Python 3.13.5, Playwright 1.56.1, Chromium 141.0.7390.37. Services de smoke et maquette sur loopback, avec le seed historique en mémoire. Autres suites sur instances et contextes séparés.

| Commande | Bilan |
| --- | --- |
| `npm run check` | 79 modules, 108 scénarios documentés et 31 liés à une assertion. |
| `npm test` | 50/50. |
| `python -m unittest discover -s tests -p "test_*.py"` | 2/2. |
| `npm run smoke` | Trois services, routes, assets et API commune vérifiés. |
| `python tools/verify_v32.py` et `python tools/verify_extension.py` | Deux succès. Kit contrôlé depuis son dossier. |
| `npx playwright test tests/browser/navigation.spec.js tests/browser/booking.spec.js tests/browser/maquette.spec.js` | 39/39, dont neuf navigations, 17 réservations et 13 maquette. |
| `npx playwright test tests/browser/account.spec.js` | 7/7 sur le dernier état. Le premier passage avait révélé un sélecteur de test ambigu et le reflow historique de l’en-tête. Ils ont été corrigés. Le test de focus attend le résultat du défilement avant la mesure de recouvrement. |
| Protection `explorer.spec.js`, `search.spec.js`, `vehicle.spec.js`, `visual-qa.spec.js` | 56/56. |
| `search.spec.js --grep 'tiroir unique' --repeat-each=8` | 6/8. Seul PUB-01 est reproduit. |

Le workflow conserve son mode souple pour l’UI et les profils essentiels. Le résultat brut de la CI et ses éventuels échecs sont joints à la PR. Le rapport individuel et les preuves locales sont expurgés.

## Captures, mesures et scores

Avant/après avec la même graine, locale `fr-FR`, Guadeloupe, DPR 1, Chromium épinglé, mouvement réduit et horloge navigateur `2026-11-21T16:00:00Z`. Seize paires du compte couvrent les quatre écrans à 320, 390, 768 et 1440. Les états refus et reprise sont joints aux résultats des tests.

Identité pixel sur 100 pour les premiers écrans protégés.

| Largeur CSS | Accueil | Catalogue | Fiche v3 |
| ---: | ---: | ---: | ---: |
| 320 | 100,0000 | 100,0000 | 100,0000 |
| 375 | 99,9972 | 100,0000 | 100,0000 |
| 390 | 100,0000 | 100,0000 | 100,0000 |
| 430 | 100,0000 | 99,9973 | 100,0000 |
| 768 | 100,0000 | 99,9929 | 100,0000 |
| 1024 | 100,0000 | 100,0000 | 100,0000 |
| 1280 | 100,0000 | 100,0000 | 99,9918 |
| 1440 | 100,0000 | 99,9923 | 100,0000 |

Dix-neuf paires sur 24 sont identiques. Les cinq autres varient de moins de 0,009 % des pixels et de 4/255 au plus par canal. Les contrôles de navigation et de galerie en rôles connectés passent à 390 et 1440. Les deux paires Admin et les deux paires du verre sont pixel-identiques.

| Écran | Largeurs de comparaison | Score provisoire |
| --- | --- | ---: |
| Connexion | 320, 390, 768, 1440 | 95/100 |
| Inscription | 320, 390, 768, 1440 | 95/100 |
| Profil | 320, 390, 768, 1440 | 95/100 |
| Justificatifs | 320, 390, 768, 1440 | 95/100 |

Grille du kit appliquée au périmètre livré. L’accessibilité reçoit 5/10 par prudence pour les essais assistés sur appareil encore ouverts. La galerie établit les paires, les scores pixel, les états et les mesures de zoom. Les preuves locales sont sous `audit-results/client-v32-lot-02/`.

## Limites, PUB-01 et restauration

Le reflow à 320 avec taille du texte doublée passe sur les quatre écrans. Au zoom natif de Chromium à 200 %, les mesures couvrent 307 px CSS. Les actions échantillonnées ont un focus visible, des cibles d’au moins 44 px et aucun recouvrement au point mesuré. Axe 4.10.3 ne relève aucune violation sur la portée compte lors des 12 mesures. Le clavier virtuel et le lecteur d’écran restent à essayer. Le retour bfcache est caractérisé par réexécution de `pageshow` avec `persisted` dans la suite, avec contrôle du contenu masqué pendant la revalidation.

PUB-01 reste le P1 historique du tiroir. Deux répétitions sur huit échouent au retour à 390 px sur le formulaire attendu dans le dialogue, zéro au lieu de un. Le budget et le focus sont confirmés à 880 avant le retour. Le test et la route sont inchangés. Les seuils et replays n’indiquent aucune régression imputable au lot.

Le retrait du commit de lot restitue la présentation et les gestionnaires antérieurs. Les services jetables sont arrêtés après la vérification.

**Prêt pour revue humaine.** Le lot 03 attend le GO final.
