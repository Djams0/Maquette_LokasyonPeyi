# Prompts Codex · correction de fidélité V3.2

Copier le fichier du lot dans Codex depuis la racine du dépôt. Suivre [CODEX_START_HERE.md](../../CODEX_START_HERE.md). Le [diagnostic](../../01_AUDIT/ECARTS_CORRECTION_V32.md) part de la PR #35. Les [lots 00–11](../README.md) constituent l’historique.

| Ordre | Prompt | Prérequis | Critères de la matrice |
| --- | --- | --- | --- |
| R01 | [Header interne et navigation](R01_HEADER_NAVIGATION.md) | Handoff intégré | HDR-01, HDR-02 |
| R02 | [Connexion, profil et documents](R02_COMPTE.md) | [R01](R01_HEADER_NAVIGATION.md) validé et intégré | ACC-01, ACC-02, ACC-03, ACC-04 |
| R03 | [Locations, demande, suivi et paiement](R03_LOCATIONS_SUIVI_PAIEMENT.md) | [R02](R02_COMPTE.md) validé et intégré | LOC-01, LOC-02, LOC-03, LOC-04 |
| R04 | [Constats de départ, retour et reprise](R04_CONSTATS.md) | [R03](R03_LOCATIONS_SUIVI_PAIEMENT.md) validé et intégré | CON-01, CON-02 |
| R05 | [Messagerie et notifications](R05_MESSAGERIE_NOTIFICATIONS.md) | [R04](R04_CONSTATS.md) validé et intégré | MSG-01, MSG-02, MSG-03 |
| R06 | [Assistance, dossiers, avis et reçu](R06_ASSISTANCE_CLOTURE.md) | [R05](R05_MESSAGERIE_NOTIFICATIONS.md) validé et intégré | SUP-01, SUP-02, SUP-03, SUP-04, SUP-05, SUP-06, SUP-07, SUP-08 |
| R07 | [Espace propriétaire et calendrier](R07_ESPACE_PROPRIETAIRE.md) | [R06](R06_ASSISTANCE_CLOTURE.md) validé et intégré | OWN-01, OWN-02, OWN-03, OWN-04, OWN-05, OWN-06, OWN-07, OWN-08 |
| R08 | [Publication, brouillons et états de revue](R08_PUBLICATION_BROUILLONS.md) | [R07](R07_ESPACE_PROPRIETAIRE.md) validé et intégré | WIZ-01, WIZ-02 |
| R09 | [Recette visuelle et fonctionnelle finale](R09_RECETTE_FINALE.md) | [R08](R08_PUBLICATION_BROUILLONS.md) validé et intégré | OUT-01, OUT-02, OUT-03, TRV-01, PRG-01, PRG-02, PRG-03 |
