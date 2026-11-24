# Lot 07 · Espace propriétaire et calendrier

## Résultat et base de revue

L’introduction présente Grande Anse et l’estimation brute fictive. Le tableau montre le parc du compte, la première demande actionnable et la reprise du brouillon. Le parc conserve le filtre au retour de la gestion. Les demandes ouvrent le suivi avec le retour au filtre d’origine. Dans la fiche de gestion, le calendrier associe un mois et une liste chronologique au formulaire de blocage. Les revenus montrent les paiements bruts du mock, et les avis distinguent note, statut, commentaire et réponse.

- Base locale HEAD et `origin/main` au départ `5536a9722d85b184a76208b84d657c795864939b`, fusion du [lot 06](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/30). Le [lot 04](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/28) figure aussi dans l’ascendance. La soumission du lot 07 a servi de GO de démarrage.
- `git status`, `git fetch origin` et l’ascendance de `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` ont été vérifiés. Le diff des lots intégrés a été relu pour les contrats de location, de communication, le shell et les pages protégées. La revue utilise un arbre isolé propre.
- Branche `client-v32/lot-07`. Le SHA final et la CI brute sont dans la PR. Restauration par réversion du commit du lot.

## Fichiers, décisions et contrats

| Fichier | Raison |
| --- | --- |
| `client/pages/owner.js` | Introduction, panorama et crédit existants, estimateur annoncé, entrée visiteur, activation confirmée et reprise par relecture de la session. |
| `client/pages/owner-workspace.js` | Tableau, parc, demandes, gestion, mois et agenda, revenus et avis. Contrôle du compte et de la version avant écriture. Relecture autorisée et reprise de la période. |
| `client/pages/owner-state.js`, `client/pages/rentals.js` | Destination de retour du suivi propriétaire limitée aux filtres de statut du mock. |
| `client/styles/client.css` | Mise en page et reflow des surfaces propriétaire, avec les tokens et variantes existants. |
| `tests/browser/owner.spec.js`, `tests/browser/maquette.spec.js` | Neuf cas métier, une largeur supplémentaire (1280), confirmations de calendrier et parcours du compte déjà propriétaire. |
| Rapport, suivi et manifeste du kit | Traçabilité et empreinte de suivi. |

Planches B 32 à 38 et 42. La gestion et le calendrier correspondent à la recomposition B. Introduction, tableau, parc, demandes, revenus et réputation correspondent aux modifications A. Le calendrier reste à l’ancre `#owner-calendar` et conserve le mois au rechargement. Les bornes sont exprimées en heure de Guadeloupe. Une période qui s’achève à minuit laisse libre le jour où elle se termine, selon la règle de recouvrement du serveur. Les cellules indiquent une période avec des lettres et un libellé accessible. La liste donne les heures exactes. Les cartes réutilisent la photo existante de la fixture Peugeot 208 et les séries de modèle dont le nom et l’identifiant correspondent. L’autre cas utilise le repli fictif. Le défaut d’exemple reste lié à la fixture d’origine.

Les API restent sous `/api/v1`. Activation avec consentement, gardes propriétaires, état du parc, documents et actions conservent leurs endpoints et validations. Un compte déjà actif a accès direct au tableau et à la préparation d’une annonce. Le serveur reste l’autorité sur la participation à une location, le retrait, la vérification et les 409. Les brouillons local et distant gardent leurs états distincts. Les décisions de location restent dans le suivi. Les revenus agrègent les paiements simulés du compte et signalent les montants indisponibles.

Un envoi propriétaire utilise une clé enregistrée par compte et ressource dans l’onglet. Après une coupure, la vue relit la ressource autorisée. Un blocage avant écriture retrouve ses bornes et sa clé au rechargement. Après écriture, une nouvelle période identifiée par le serveur suffit à confirmer la réussite. Les mêmes contrôles empêchent de réappliquer une saisie à une annonce modifiée ou à un autre compte. La confirmation modale et la relecture restaurent le focus sur le déclencheur ou le titre utile.

## Recette

Node 24.22.2, Playwright 1.56.1, Chromium 141.0.7390.37 et Python 3.13.5. Services client, API et admin sur loopback avec données fictives jetables. Pour les pages protégées, le jeu public et l’horloge sont communs aux deux arbres. Pour le lot, la fixture d’audit ajoute sur le véhicule connu une demande, une location payée, un blocage, un brouillon et un avis renseigné. Ce jeu de capture est local.

| Contrôle | Résultat |
| --- | --- |
| `npm run check`, `npm test`, Python unittest | Syntaxe et liens vérifiés. 50/50 Node, 2/2 Python. |
| `npm run smoke` | Trois services, routes et assets disponibles. |
| `python tools/verify_v32.py`, `python tools/verify_extension.py` | Deux validateurs exécutés depuis le kit. |
| Playwright requis `owner`, `booking`, `navigation`, `maquette` | 90/90 sur la référence. Résultat final candidat dans la table locale et la PR. |
| Scénarios métier ajoutés | Activation, changement de compte, photo du parc et filtre, pause/reprise/retrait, retour de demande, bornes calendaires, coupures avant/après écriture, revenus et avis. |
| Protections et profils d’audit | Résultats par cas dans `tests-individuels.csv`. |
| GitHub Actions | Résultats bruts du handoff, de l’UI, de l’audit essentiel, du contrôle étendu et des preuves dans la PR. L’UI et l’audit essentiel tournent en mode souple pour la PR. |

Le premier passage a relevé trois écarts d’assertion. Le test d’image attendait un nom de fichier contenant le modèle alors que le média de la fixture Peugeot est la citadine verte. Le tirage de statut utilisait « Retiré » alors que le badge est « Retirée ». Le test de réponse utilisait deux espaces, interceptés d’abord par la validation native de longueur. Ces assertions ont été corrigées pour vérifier l’asset, le statut et le rejet de la valeur après nettoyage.

## Captures, mesures et scores

Les preuves locales sont dans `audit-results/client-v32-lot-07/`. `comparaison.html` réunit les PNG, `comparaison.json` les mesures pixel, `tests-individuels.csv` les résultats et `accessibilite/mesures.json` les mesures détaillées.

- 24 paires protégées de `/`, `/search` et `/vehicle/v3` aux huit largeurs 320, 375, 390, 430, 768, 1024, 1280 et 1440. Langue fr-FR, fuseau America/Guadeloupe, DPR 1, horloge au 21 novembre 2026 à 16 h UTC. Les variations raster et le résultat final des interactions sont détaillés dans la galerie de preuves et la PR.
- 64 paires propriétaire. Une capture par écran aux huit largeurs, avec la gestion et le calendrier à son ancre.
- Mesures sur les huit écrans, en reflow à 320 CSS px et texte 200 %, puis en zoom natif Chromium à 100 % et 200 %. Les commandes principales mesurées font au moins 48 CSS px de côté. Les essais portent sur clavier, visibilité, recouvrement et contraste. Le contraste du texte des zones de saisie est mesuré à 15,50:1 sur blanc.

| Écran | Largeurs | Score provisoire |
| --- | --- | --- |
| Introduction et activation | 320 à 1440 | 95/100 |
| Tableau | 320 à 1440 | 95/100 |
| Parc | 320 à 1440 | 95/100 |
| Gestion | 320 à 1440 | 95/100 |
| Calendrier et agenda | 320 à 1440 | 95/100 |
| Demandes | 320 à 1440 | 95/100 |
| Revenus | 320 à 1440 | 95/100 |
| Réputation | 320 à 1440 | 95/100 |

Les scores utilisent la grille du kit avec preuve partielle d’accessibilité. Le lecteur d’écran et le clavier virtuel Android/iOS restent à vérifier. Les contrôles natifs de date et de mois sont ceux de Chromium dans cette campagne.

## PUB-01, risques et décision

Le scénario 880 → 390 reste actif. La signature historique est l’absence de `#search-filters` dans le dialogue « Filtres » au retour à 390. Les répétitions sur chaque arbre et les résultats CI bruts figurent dans les preuves.

La clé de reprise est liée au compte et à la page de l’onglet. Effacer le stockage de session fait perdre la reprise locale. Les lectures avant l’envoi réduisent la fenêtre de changement de cookie au départ de la requête. Les contrôles de session et d’appartenance du serveur restent nécessaires, et le contrat courant ne porte pas de précondition de compte dans le corps du POST. La preuve de recouvrement concerne le comportement du mock et les dates réellement exercées.

**En revue humaine.** Les résultats techniques complets sont consignés dans la PR. Le lot suivant attend la validation.
