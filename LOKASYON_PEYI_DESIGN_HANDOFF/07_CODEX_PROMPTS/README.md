# Historique · prompts Codex 00–11 de l’extension client

Pour les prochaines corrections, commencer par [R01 · Header interne et navigation](correction-v32/R01_HEADER_NAVIGATION.md) et suivre la [série active](correction-v32/README.md). Le tableau ci-dessous conserve la séquence 00–11 intégrée avec la PR #35.

| Lot | Dépendances | Priorité / effort | Porte de sortie |
| --- | --- | --- | --- |
| [00 · Baseline et protection](LOT_00_BASELINE.md) | — | P0/S | Un SHA, des jeux jetables et le résultat des 174 cas et des profils. Zéro autre échec inexpliqué; reproduire et classer la réserve historique. |
| [01 · Fondations des surfaces client](LOT_01_FOUNDATIONS.md) | 00 | P1/M | Chaque variante est approuvée par état; rendu protégé identique et admin comparé si shared. Préserver verre public et modal natif. |
| [02 · Compte et authentification simulée](LOT_02_ACCOUNT.md) | 01 | P1/M | Invité revient à la fiche et à la période. Profil incomplet, documents versionnés, raison de refus et déconnexion cohérents. |
| [03 · Liste et demande de location](LOT_03_RENTALS.md) | 02 | P1/M | Dates explicites, estimation unité/jour, retours exacts, une demande avec double clic ou réponse perdue, garde compte incomplet. |
| [04 · Suivi, paiement et caution](LOT_04_RENTAL_DETAIL_PAYMENT.md) | 03 | P0/L | Toute la chaîne demande→clôture par les bons rôles. Refus récupérable et retour, actes et prérequis bien séparés; paiement fictif uniquement. |
| [05 · États des lieux](LOT_05_INSPECTION.md) | 04 | P1/L | Huit vues distinctes, impossibilité de finaliser incomplète, charge bornée, km retour ≥ départ; prérequis de remise et retour vrais. |
| [06 · Messagerie et notifications](LOT_06_MESSAGING_NOTIFICATIONS.md) | 02, 05 | P0/L | Aucun double envoi avant/après écriture, aucune reprise de fil d’un autre compte, destinations coordonnées avec la notification. |
| [07 · Espace propriétaire et calendrier](LOT_07_OWNER_DASHBOARD.md) | 04, 06 | P1/L | Vue limitée au bon parc, filtre et retour; tests pause/reprise/retrait, conflit 409, calendrier et brut illustratif, avis et compte changé. |
| [08 · Assistant de publication et reprise](LOT_08_OWNER_WIZARD.md) | 07 | P0/L | Neuf URL historiques, cinq vues et trois justificatifs, conflit explicite, sauvegarde après choix; une seule annonce pending malgré résultat perdu. |
| [09 · Assistance, dossiers, avis et reçus](LOT_09_SUPPORT.md) | 04, 08 | P1/M | Cas vide, motif et dossier créé, échanges partagés, accès tiers refusé, avis unique et reçu fictif de clôture; diff accueil nul. |
| [10 · Cohérence opérationnelle](LOT_10_POLISH.md) | 09 | P2/M | Cohérence démontrée avec captations par route et rôles; aucune correction des pages protégées, aucun contrat changé. |
| [11 · Recette, preuves et arrêt](LOT_11_FINAL_QA.md) | 10 | P0/L | ≥95/100 par cible principale, aucun nouveau P0/P1 et aucun diff sur pages protégées. Consigner PUB-01 séparément et tout essai non réalisé. |
