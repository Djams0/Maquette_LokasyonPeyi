# Lot 03 · Liste et demande de location

## Résultat et base de revue

- Lot 02 fusionné par la PR #26. Arbre de revue propre créé sur `origin/main` au SHA `1156c47069cc61a6e4821a61b37f3f1fa2865ebc`.
- La référence auditée `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` est ancêtre de la base. Le diff applicatif entre la référence et la base porte sur les fondations et le compte. Les modules de la fiche, le contrat API et le workflow CI sont identiques. Le contrôle primaire du lot compare les deux arbres sous Windows avec une fixture commune.
- Branche `client-v32/lot-03`. Le SHA final et les résultats de la CI figurent dans la PR de revue. Retour possible par réversion du commit du lot.

## Fichiers et décisions

| Fichier | Raison |
| --- | --- |
| `client/pages/rentals.js` | Cartes de liste, onglets dans l’URL, action selon `rentalNext`, retour au même onglet depuis le détail. Récapitulatif de la demande, états explicites et reprise sur la clé d’origine. |
| `client/pages/booking-state.js` | Valider le contexte de retour indépendamment de l’horloge actuelle pour conserver les filtres et le tri d’une période devenue passée. Le formulaire conserve la garde temporelle de `bookingDraft`. |
| `client/styles/client.css` | Variantes limitées aux deux surfaces, rail 320 px sur bureau, ordre période → prix → confirmation et action dans le flux sur mobile. |
| `tests/browser/booking.spec.js` | Huit largeurs, états d’onglets, garde compte/période/tarif, coupure avant/après écriture, double validation et changement de compte. |
| Rapport, suivi et manifeste kit | Traçabilité de la revue et empreinte du suivi mise à jour. |

Périmètre A des planches B 16, 17 et 27. Le catalogue de démo fournit les modèles, communes et tarifs fictifs. Les cartes utilisent la photographie du modèle lorsqu’elle est disponible et l’illustration de repli dans les autres cas. Les trois onglets gardent leurs ensembles de statuts. La liste garde le périmètre locataire de la route. Une action de paiement déjà autorisée ouvre le parcours existant, et les autres gestes métier restent accessibles dans le détail. L’acceptation, le paiement, le contrôle de caution et le suivi conservent leurs contrats.

La date et l’heure sont affichées en Guadeloupe. L’estimation reprend le prix par jour et les tranches arrondies de 24 h de l’API. La commune correspond à l’annonce. Le point de remise précis reste soumis au flux existant. La confirmation mentionne que l’envoi ne déclenche aucun paiement ni blocage de caution. Caution, frais et assurance gardent leur statut dans le mock.

Le brouillon et les critères restent présents après un conflit confirmé ou un retour fiche. La clé d’idempotence, la période et le contexte sont conservés en cas d’incertitude. La reprise relit la session via `GET /bootstrap` puis soumet exactement la même clé et le même corps. La liste ne donne aucune corrélation par clé et une ligne ayant les mêmes dates peut être une autre demande. L’accusé de réception repose donc sur la réponse de l’API à cette clé. Le code bloque la relance lorsque la période de la tentative est devenue passée ou lorsque la clé locale est invalide, avec accès à Mes locations pour vérifier. Une session différente constatée avant l’envoi impose d’afficher le formulaire de ce compte. Le cookie reste l’autorité de l’API en cas de changement concurrent après cette lecture.

## Recette locale

Node 24.22.2, Playwright 1.56.1, Chromium 141.0.7390.37, Python 3.13.5. Services HTTP loopback client, administration et API sur état mémoire jetable. L’état de comparaison commun est issu de la fixture synthétique du lot 02. Les captures des deux surfaces ajoutent, via les fonctions du mock, une demande envoyée, une acceptée et une retirée. La campagne protégée garde la fixture d’origine.

| Vérification | Résultat |
| --- | --- |
| `npm run check` | Passé, 80 modules et contrôle des liens documentaires. |
| `npm test` | 50/50. |
| `python -m unittest discover -s tests -p "test_*.py"` | 2/2. |
| `npm run smoke` | Passé sur services jetables. |
| `python tools/verify_v32.py`, `python tools/verify_extension.py` | Passés depuis le kit. |
| Playwright requis `booking`, `vehicle`, `search`, `maquette` | Candidat 75/75. Campagne comparative finale par cas jointe à la revue. |
| Réservation et demande | 24/24, dont la précision du tarif et l’absence de CTA sans tarif. Les cas critiques ont été rejoués après vérification stricte de la clé stockée. |
| Protections `home`, `navigation`, `search`, `vehicle`, `visual-qa`, `account` | 57/57, dont conservation de l’URL, rôle, retour de galerie et reprise après connexion. |
| Contrôles CI souples | Lire les résultats bruts des étapes UI, audit essentiel, audit étendu et expurgation dans la PR. Le statut global peut être vert avec une réserve UI. |

Le premier essai de développement signalait huit assertions devenues inadaptées avec la suppression de la barre fixe, dont cinq sur la position dans le premier écran et trois sur la classe activée à la prise de focus. Les assertions vérifient désormais la présence du prix avant la commande mobile, une hauteur d’au moins 48 px et l’absence d’obstacle au point d’interaction après défilement. Les essais suivants ont passé ces huit cas.

## Captures, mesures et scores

Les preuves locales sont dans `audit-results/client-v32-lot-03/`. La galerie `comparaison.html` associe chaque PNG de référence et de revue. `comparaison.json` contient les mesures pixel. `tests-individuels.csv` donne le statut et la durée par scénario. `accessibilite/mesures.json` documente focus, contrôles et couverture ainsi que les rapports Axe échantillonnés.

- 24 paires protégées aux largeurs 320, 375, 390, 430, 768, 1024, 1280 et 1440, en `fr-FR`, fuseau `America/Guadeloupe`, DPR 1 et horloge 21 novembre 2026 à 16 h UTC. 14 sont strictement identiques. Neuf variations restent à 5 niveaux ou moins par canal. Au catalogue 1440, les variations fortes se concentrent sur le texte des sélecteurs natifs. Deux captures du candidat seul reproduisent 2 206 px variables et une répétition de la branche revient à 148 px au plus face à la référence. Les valeurs, dimensions, polices et styles des contrôles sont égaux dans les quatre répétitions.
- 18 scénarios d’interaction par arbre, tous réussis. La variation initiale de 200 px sur le sélecteur « Tous » en modération à 320 est absente des deux répétitions du candidat, pixel à pixel. Les sélecteurs de lot ne s’appliquent qu’aux deux surfaces client.
- 26 paires sur les surfaces du lot. Liste et demande aux huit largeurs, dialogue, historique, liste vide, indisponibilité et garde compte incomplet à 390 et 1440. Le contexte et les prix proviennent des mêmes données sur chaque arbre.
- Neuf mesures d’accessibilité sur la liste, la demande et le compte bloqué. Zéro débordement ou cible masquée, focus visible, 48 CSS px au minimum pour les actions mesurées, zéro violation Axe sur les échantillons. Reflow et texte agrandi à 320 px, zoom Chromium natif 200 % mesuré à 307 CSS px, clavier et retour de focus du dialogue vérifiés.

| Écran et états | Largeurs | Score provisoire |
| --- | --- | --- |
| `/rentals` · À venir, action de paiement et attente propriétaire | 320, 375, 390, 430, 768, 1024, 1280, 1440 | 95/100 à chaque largeur |
| `/rentals` · En cours vide, historique et reprise après échec | 390, 1440 | 95/100 |
| `/request/v1` · Période, prix, confirmation | 320, 375, 390, 430, 768, 1024, 1280, 1440 | 95/100 à chaque largeur |
| `/request/v1` · Édition, compte incomplet, tentative incertaine | 390, 1440 pour les captures d’édition et de garde. Parcours incertain exercé au viewport de la suite. | 95/100 sur les états vérifiés |

Le score suit la grille du kit avec 5 points sur 10 pour l’accessibilité. Restent à vérifier avec équipement le lecteur d’écran et le clavier virtuel sur Android/iOS. Les annonces et l’absence de recouvrement sont vérifiées dans Chromium au clavier physique. Un effacement du stockage de session supprime la capacité de rejouer une ancienne clé. Un basculement simultané entre deux onglets et deux comptes dans l’intervalle lecture de session → envoi reste une limite du contrat par cookie.

## PUB-01 et décision

Le scénario du tiroir 880 → 390 reste inchangé. La réserve historique apparaît 1 fois sur 8 côté candidat et 6 fois sur 8 côté référence, avec `#search-filters` absent du dialogue au retour à 390 alors que l’assertion en attend un. Le journal des répétitions de la référence et du candidat est dans l’index des preuves. Les trois pages publiques font partie de la campagne obligatoire de chaque lot.

**En revue humaine.** GO technique soumis aux preuves finales de la PR et à l’acceptation de la réserve PUB-01. Le lot suivant attend cette validation.

