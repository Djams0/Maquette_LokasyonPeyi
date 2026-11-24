# Lot 10 · Cohérence opérationnelle

## Base et périmètre

- `origin/main` et base de revue · `91960ab728e147f4bfbad9c82c729762f517b18b`. Le lot 09 est intégré via la PR [#33](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/33). Son dernier commit et le commit de fusion ont le même arbre.
- Le SHA audité `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` est un ancêtre. Depuis cet audit, les écarts de la base concernent le rendu client opérationnel et les tests associés. Le diff du lot se lit depuis `91960ab`.
- Branche `client-v32/lot-10`. Le SHA final et la PR figurent dans le dossier de preuves. Travail réalisé dans deux arbres isolés.

## Corrections et décisions

| Fichiers | Raison et preuves attendues |
| --- | --- |
| `client/app.js`, `client/pages/navigation.js` | Donner un titre d’onglet distinct aux routes opérationnelles, y compris pendant la lecture de session. La page 404 a un titre de niveau 1 et deux destinations sûres. Les refus et erreurs de chargement des routes opérationnelles restent lisibles à 200 %. |
| `client/pages/demo.js` | Regrouper le changement de profil et rapprocher le réglage du réseau. La sortie vers le visiteur utilise le formulaire et le retour d’erreur existants. L’attente est annoncée. Les deux commandes de profil partagent une garde contre un second changement simultané. |
| `client/pages/audit.js` | Distinguer l’absence de fixture et un filtre sans aucun profil. Offrir une sortie directe vers les profils historiques ou la liste non filtrée selon l’état. |
| `client/styles/client.css` | Limiter les cibles et le reflow aux conteneurs des outils, de l’erreur opérationnelle et de la 404. Garder les contrôles natifs, le verre de l’échantillon et les règles d’impression du reçu. |
| `tests/browser/navigation.spec.js` | Exercer envoi refusé, attente, reprise, concurrence entre commandes de session, titres, reflow et sortie de l’atelier au clavier. |
| Rapport, suivi du kit et manifeste | Consigner la base, la recette et le statut de revue. Aligner l’empreinte sur le fichier de suivi. |

Classe A suivant les planches B-11, B-12 et B-43 à B-45. Les onglets nomment l’écran ou l’action existante. Le menu reste déterminé par le rôle. La bascule de démonstration effectue les mêmes appels sous `/api/v1`, quitte l’écran après réponse et rend l’erreur avec l’aide de `bindForm`. Le filtre d’audit conserve son paramètre d’URL. Le reçu, les CTA de transaction, les filtres, les rôles, les brouillons et les transitions restent aux contrats des lots précédents.

## Recette comparée

- Environnement local · Node 24.22.2, Playwright 1.56.1, Chromium 141.0.7390.37, instances en mémoire. Les deux arbres utilisent les blobs Git pour les documents générés et les deux ressources dont les vérificateurs contrôlent les octets. La conversion CRLF proposée par Git Windows faisait échouer ces contrôles.
- Commandes · `npm run check`, `npm test`, `python -m unittest discover -s tests -p "test_*.py"`, `npm run smoke`, puis `tools/verify_v32.py` et `tools/verify_extension.py` dans le kit. Les suites demandées sont `components`, `navigation`, `maquette`, `visual-qa` et `admin`. Le dossier liste chaque cas, les résultats avant/après, les relectures éventuelles et le statut brut de la CI.
- Comparaison protégée · mêmes données, DPR 1, français, heure figée du kit et heure de Guadeloupe. Trois routes sur les huit largeurs. Les interactions visiteur, locataire et propriétaire couvrent navigation, filtres, tri, retour et galerie. Le scénario PUB-01 reste en place.
- Comparaison opérationnelle · état et rôle explicites pour chaque scène. Connexion, compte, documents, avis, messages, notifications, réservation, paiement, constats, espace propriétaire, aide et outils. Les mesures couvrent 320 px, le texte à 200 %, le zoom Chromium, la réduction du mouvement, les cibles, le focus et le contraste. Vérification des états de retour avec les suites dédiées des lots précédents.

## Risques et décision de revue

Les contrôles ciblent le débordement et le recouvrement d’une commande, le maintien des erreurs après un appel refusé et l’accessibilité des liens vers l’atelier. Le dossier de preuves détaille les limites restantes, le classement de PUB-01 et les scores par écran.

Un retour au commit de base avant fusion, ou un revert du commit complet après fusion, restaure le rendu et le suivi du kit en bloc. Le verdict est joint au dossier de preuves. GO humain requis, après revue du périmètre.
