# Lot 09 · Assistance, dossiers, avis et reçus

## Résultat et base de revue

- `origin/main` et base de la branche au départ · `62419526602b82374050b50ed825cd260eef7e76`. Le lot 08 est intégré par la PR [#32](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/32). Le lot 04 est également présent.
- Le SHA audité `4338f5f7ca252f4d4f02021ec47a226d0d2d6064` est un ancêtre vérifié. Depuis cet audit, les lots précédents ont modifié le client. Les fichiers API, administration, fixtures et CI restent identiques à la base de revue.
- Branche `client-v32/lot-09`. Le SHA final et la PR sont relevés avec les preuves d’exécution. La revue humaine du lot 09 reste requise.

## Fichiers et contrats

| Fichier | Raison |
| --- | --- |
| `client/pages/support.js` | FAQ autonome, formulaires d’assistance, statut et échanges partagés, avis de clôture et reçu imprimable. Les exports `homeFaqItems` et `renderFaqItems` restent à l’identique. |
| `client/pages/account.js` | Mes avis est limité à l’auteur et affiche les deux notes, le statut observable et la réponse propriétaire présente. |
| `client/app.js` | Fournit l’identité déjà lue aux écrans concernés et renseigne leur titre. Les gardes de navigation, le retour `next` et la vérification au retour arrière sont réutilisés. |
| `client/styles/client.css` | Gabarits sous `.support-surface`. Le reçu a des règles d’impression dédiées. |
| `tests/browser/support.spec.js`, `tests/browser/maquette.spec.js` | Dix scénarios reproductibles sur API jetable en mémoire. La chaîne de clôture vérifie le titre et la mention comptable du reçu. |
| Rapport, suivi du kit et manifeste | Preuves et état de revue. L’empreinte du manifeste suit la mise à jour du tableau de suivi. |

Le lot utilise les routes existantes sous `/api/v1`. Une création, un message ou un avis passe par l’écriture déjà prévue. Si le résultat est incertain, la reprise conserve le corps et la clé d’idempotence dans l’onglet pour le compte concerné. L’interface annonce le succès après confirmation par l’API. Les motifs Annulation et Prolongation créent un dossier. Une demande de complément reste un échange partagé. Le client ne lit que le résumé, le motif communiqué et les messages projetés.

## Décisions par écran

| Écrans | Planches | Décision |
| --- | --- | --- |
| Assistance, nouveau dossier, détail | B-28 | A. Formulaire principal et aide secondaire. Location facultative parmi celles de la session, reprise visible, résumé et échanges distincts. |
| FAQ | B-29 | A. Recherche locale insensible à la casse et aux accents. Accordéons natifs et lien d’aide. |
| Dossiers, Mes avis | B-30 | A. Cartes alignées sur les états du mock. Dates et notes absentes restent signalées comme telles. |
| Avis | B-31 | B. Deux sélecteurs natifs pour la notation, avec libellés et valeurs sur cinq. Le retour après soumission rejoint la location. Un avis existant mène à Mes avis en accès direct. |
| Reçu | B-31 | A. Période, état de location, paiement et devis à leur place. Les montants fictifs conservent les centimes du devis. Impression navigateur avec mention sans valeur comptable. |

## Recette, captures et limites

La recette utilise Node 24.22.2, Playwright 1.56.1, Chromium 141.0.7390.37 et des instances locales jetables. Se reporter au relevé individuel pour les résultats de tests et le bilan brut de la CI à statut souple.

- `npm run check` réussit. `npm test` réussit 50/50, l’exécution Python 2/2 et `npm run smoke` valide les trois services, les routes et les ressources. Les deux vérificateurs du kit passent.
- La base de revue réussit les 74 cas de `maquette`, `booking`, `explorer` et `navigation`.
- La comparaison protégée est conduite au même DPR, avec l’heure du kit figée, en français et en heure de Guadeloupe. Les 24 paires du premier écran sont identiques pixel à pixel. Les 18 scénarios d’interaction réussissent sur chaque arbre.
- Les scènes du lot sont capturées à 320, 390 et 1440 px. Le focus clavier, la présence de cibles de 44 px, l’absence de commandes couvertes et l’absence de débordement sont vérifiés. L’agrandissement du texte à 200 % et le zoom Chromium à 200 % ont été exercés. L’impression du reçu est aussi exportée en PDF depuis Chromium.
- Lecteur d’écran, clavier virtuel et sortie sur imprimante physique restent à vérifier. L’état de recherche et la reprise utilisent des régions de statut. L’impression a été exercée avec le média d’impression et l’export Chromium.
- PUB-01 est suivi séparément sur le test existant du tiroir à 880 → 390 px. Voir le relevé pour la reproduction et la fréquence de chaque branche.

## Restauration et verdict

Risques vérifiés en priorité dans la recette · effet partagé de la FAQ, fuite d’une note interne, doublon après perte de réponse, changement de compte, mutation de location par un motif d’assistance et confusion du reçu avec un document comptable.

Avant fusion, abandonner la branche de revue restaure la base `6241952`. Après fusion, revenir sur le commit du lot en bloc conserve l’association du suivi avec son manifeste. Les résultats détaillés, les scores par écran et le statut brut de la CI figurent dans le dossier de preuves livré avec la PR. Le GO final et la fusion relèvent de la revue humaine.
