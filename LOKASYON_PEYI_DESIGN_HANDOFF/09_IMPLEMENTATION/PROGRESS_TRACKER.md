# Suivi de l’extension client

L’audit Work précède les lots Codex. Remplir la ligne du lot après sa recette, joindre les preuves et reporter la décision humaine.

| Lot | Objet | Statut | Branche | SHA départ | SHA final | PR | Fichiers | Tests | Captures | Score | Écarts | Risques / régressions | GO/NO-GO | Validation humaine |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 00 | Baseline et protection | Fusionné | `client-v32/lot-00` | `4338f5f` | `ad0b310` | [#23](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/23) | [Rapport](../../docs/audit/LOT_00_BASELINE_EXTENSION.md) | 174 UI, 11 profils | 24 protégées | Identité dans le rapport | PUB-01, texte agrandi sur connexion | Réserves historiques | Passage au lot 01 demandé | Fusion confirmée, lot 01 envoyé le 23/11 |
| 01 | Fondations des surfaces client | Fusionné | `client-v32/lot-01` | `006fdca` | `6fb418b` | [#25](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/25) | [Rapport](../../docs/audit/LOT_01_FONDATIONS_CLIENT.md) | 45 ciblés, 53 protégés | 24 protégées et échantillon | 95/100 provisoire | PUB-01 | Essais assistés à compléter | Passage au lot 02 demandé | Fusion confirmée |
| 02 | Compte et authentification simulée | Fusionné | `client-v32/lot-02` | `6221d2b` | `d3ef9f7` | [#26](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/26) | [Rapport](../../docs/audit/LOT_02_COMPTE_AUTHENTIFICATION.md) | 39 parcours, 7 compte, 56 protégés | 24 protégées, 16 compte | 95/100 provisoire | PUB-01 | Assistance et clavier virtuel à compléter | Passage au lot 03 demandé | Fusion confirmée |
| 03 | Liste et demande de location | Fusionné | `client-v32/lot-03` | `1156c47` | `4169497` | [#27](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/27) | [Rapport](../../docs/audit/LOT_03_LISTE_DEMANDE_LOCATION.md) | Parcours requis, 24 réservation, 57 protégés | 24 protégées et 26 location | 95/100 provisoire | PUB-01 | Lecteur d’écran et clavier virtuel à compléter | Passage au lot 04 demandé | Fusion confirmée |
| 04 | Suivi, paiement et caution | Fusionné | `client-v32/lot-04` | `a355918` | `f125bde` | [#28](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/28) | [Rapport](../../docs/audit/LOT_04_SUIVI_PAIEMENT_CAUTION.md) | Parcours requis et reprise des actions | 24 protégées et 28 suivi/paiement | 95/100 provisoire | PUB-01 | Lecteur d’écran et clavier virtuel à compléter | Passage au lot 05 demandé | Fusion confirmée |
| 05 | États des lieux | En revue | `client-v32/lot-05` | `545494a` | HEAD de revue | Branche de revue | [Rapport](../../docs/audit/LOT_05_ETATS_DES_LIEUX.md) | Recette requise et six cas dédiés | 24 protégées et 20 constats | 95/100 provisoire | PUB-01 | Lecteur d’écran et clavier virtuel à compléter | GO final en attente | À valider |
| 06 | Messagerie et notifications | À faire | — | — | — | — | — | — | — | — | — | — | — | — |
| 07 | Espace propriétaire et calendrier | À faire | — | — | — | — | — | — | — | — | — | — | — | — |
| 08 | Assistant de publication et reprise | À faire | — | — | — | — | — | — | — | — | — | — | — | — |
| 09 | Assistance, dossiers, avis et reçus | À faire | — | — | — | — | — | — | — | — | — | — | — | — |
| 10 | Cohérence opérationnelle | À faire | — | — | — | — | — | — | — | — | — | — | — | — |
| 11 | Recette, preuves et arrêt | À faire | — | — | — | — | — | — | — | — | — | — | — | — |
