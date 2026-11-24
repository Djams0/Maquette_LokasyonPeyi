# Lot 08 · Assistant de publication et reprise

## Résultat et base de revue

L’assistant garde les neuf liens `?step=1` à `?step=9`. Les groupes se retrouvent dans quatre sections, dans l’ordre [1, 3], [4, 5], [7, 8], [2, 6, 9]. Le dernier groupe enregistré et l’état de la saisie locale sont visibles ensemble. Les cinq angles ont chacun une sélection et un compteur annoncé. L’aperçu de revue regroupe le véhicule, les vues, la période, le tarif et les trois justificatifs. Les liens des éléments incomplets placent le focus sur le titre du groupe.

- Base `origin/main` et HEAD de départ `82be4b2cfe973c7206f5ea190be53a01ed4111f5`, fusion du [lot 07](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/31). L’envoi du lot 08 a servi de GO de démarrage.
- `git status`, `git fetch origin` et l’ascendance de `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` ont été vérifiés. Le diff depuis l’audit a été relu pour le parc, la reprise et le shell. Le candidat et la référence sont deux arbres isolés propres.
- Branche `client-v32/lot-08`. Le SHA final, les comptages CI et les contrôles souples figurent dans la PR. Restauration par réversion du commit du lot.

## Fichiers, décisions et contrats

| Fichier | Raison |
| --- | --- |
| `client/pages/wizard.js` | Statut du brouillon, progression, cinq angles, aperçu, comparaison lisible et focus. La tentative doit être conservée dans l’onglet avant son envoi. |
| `client/pages/owner-workspace.js` | « Vérifier mon envoi » reprend le groupe et le nom de la tentative même après la suppression du brouillon serveur. |
| `client/styles/client.css` | Gabarit, reflow et feedback sous la portée de l’assistant. |
| `tests/browser/owner.spec.js`, `tests/browser/maquette.spec.js` | Trois cas ajoutés et assertions étendues sur le choix, le focus, la reprise par le parc, la clé d’envoi et les justificatifs. |
| Rapport, suivi, manifeste du kit | Traçabilité du lot et empreinte du suivi. |

Recomposition B selon les planches B 23, B 39 à 41. Les emplacements de vues utilisent les icônes existantes et gardent un nom d’angle distinct. L’assistant demande une sélection fictive. L’état physique reste non renseigné. Les justificatifs sont créés lors de l’envoi avec un état initial en attente de contrôle.

La divergence compare les champs de l’ancienne lecture, de la relecture et de la saisie locale. Les deux choix ouvrent le groupe mémorisé pour vérification. Une sauvegarde exige ensuite une action explicite. La comparaison porte sur le contenu observé du brouillon. Le service ne fournit aucun verrou atomique de révision. Si le navigateur refuse de conserver la saisie après un choix, la comparaison reste sur place et la saisie est conservée en mémoire dans l’onglet.

Les contrats `GET /me`, `GET/POST /owner/draft` et `POST /owner/vehicles` restent sous `/api/v1`. La structure locale, les champs et validations de chaque groupe, et le corps et la clé gelés restent compatibles. L’envoi pour revue vérifie le compte et attend une réponse attribuable au propriétaire. Après écriture, le serveur peut retirer le brouillon avant que la réponse arrive. La tentative conservée garde le groupe de revue et les boutons de vérification. Le réessai réutilise le corps et la clé, et les essais avant et après écriture retrouvent une annonce `pending` et ses trois pièces. Un stockage indisponible suspend l’envoi. Une saisie non sauvegardée reste dépendante de la vie de l’onglet.

## Recette

Node 24.22.2, Playwright 1.56.1, Chromium 141.0.7390.37 et Python 3.13.5. API, client et administration sur ports loopback avec des données fictives en mémoire. La fixture publique est identique sur les deux arbres. Les scènes de l’assistant utilisent un brouillon synthétique et des états locaux synthétiques fixes.

| Contrôle | Résultat |
| --- | --- |
| `npm run check`, `npm test`, Python unittest | Syntaxe, imports et liens validés. 50/50 Node, 2/2 Python. |
| `npm run smoke` | Trois services, routes et assets disponibles. |
| `python tools/verify_v32.py`, `python tools/verify_extension.py` | Deux validateurs exécutés depuis le kit. |
| Playwright requis `owner`, `maquette`, `navigation` | Référence 63/63. Résultats par cas du candidat dans la table locale et la PR. |
| Vérifications de l’assistant | Cinq angles et clavier, aperçu et lien incomplet, stockage indisponible, comparaison sans écriture, reprise avant et après écriture. |
| GitHub Actions | États bruts du handoff, de l’UI, de l’audit essentiel, de l’audit étendu et des preuves expurgées dans la PR. L’UI et l’audit essentiel tournent en mode souple sur cette PR. |

Le premier essai après écriture a confirmé que la disparition du brouillon serveur ramenait l’URL sans paramètre au groupe 1. Le test vérifie désormais la revue verrouillée et le retour par le parc avant le même réessai. La comparaison après un refus du stockage vérifie que les valeurs locales restent disponibles et qu’aucun POST de brouillon ne part. Le premier passage de la maquette utilisait l’ancien texte de progression. L’assertion contrôle désormais le nouveau libellé, l’URL et la section active.

## Captures, mesures et scores

Preuves locales dans `audit-results/client-v32-lot-08/`. `comparaison.html` regroupe les images avant/après, `comparaison.json` les écarts pixel, `tests-individuels.csv` les résultats par test et `accessibilite/mesures.json` les contrôles clavier et zoom.

- 24 paires protégées de `/`, `/search` et `/vehicle/v3` à 320, 375, 390, 430, 768, 1024, 1280 et 1440. Langue fr-FR, DPR 1, horloge au 21 novembre 2026 16 h UTC, fuseau America/Guadeloupe. Interactions pour les rôles, critères et retour, et galerie contrôlées séparément.
- 48 paires de l’assistant. Brouillon vierge, photos, aperçu de revue, divergence et envoi à vérifier aux huit largeurs, avec détails à 390 et 1440.
- Les mesures Chromium couvrent le texte à 200 % sur 320 CSS px et le zoom natif à 100 % et 200 %. La recette vérifie les commandes au clavier, leur focus, les cibles et la visibilité. Le lecteur d’écran et le clavier virtuel Android/iOS restent à vérifier.

| Écran ou état | Largeurs | Score provisoire |
| --- | --- | --- |
| Véhicule, état et photos | 320 à 1440 | 95/100 |
| Disponibilité et prix | 320 à 1440 | 95/100 |
| Revue et envoi | 320 à 1440 | 95/100 |
| Divergence et vérification d’envoi | 320 à 1440 | 95/100 |

Scores selon la grille du kit avec mesure partielle d’accessibilité. Chromium et le jeu de données influent sur les résultats. Le test du tiroir 880 → 390 reste actif. La signature PUB-01 est l’absence de `#search-filters` dans le dialogue au retour à 390. Les répétitions et la classification CI figurent dans les preuves.

**En revue humaine.** La décision technique et les résultats bruts sont consignés dans la PR. Le lot suivant attend le GO humain.
