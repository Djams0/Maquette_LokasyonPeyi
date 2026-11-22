# Dépendances

| Lot | Prérequis techniques | Pourquoi |
| --- | --- | --- |
| 00 | — | Reproduire la baseline locale et préparer les preuves de comparaison. Comparer main avec le SHA verrouillé du kit sans changer le rendu. |
| 01 | 00 | Installer gabarits, contrôles, cartes et feedback avec une portée limitée. Réutiliser les helpers et mesurer leur impact sur les routes publiques et Admin. |
| 02 | 01 | Reprendre connexion, inscription, profil et pièces. Préserver bfcache, /me et retour next. Les notifications relèvent de 06 et les avis de 09. |
| 03 | 02 | Recomposer /rentals et /request/:id à partir des vrais états. Le suivi et le paiement restent au lot 04. |
| 04 | 03 | Faire ressortir action, acteur et prérequis, suivi à sept jalons et paiement fictif distinct de la caution. |
| 05 | 04 | Réorganiser la prise de vue guidée et le formulaire en conservant le contrat photo/save/finalize des deux phases. |
| 06 | 02, 05 | Moderniser la liste, le fil, les notifications et les états d’envoi/reprise; respecter participants et q. |
| 07 | 04, 06 | Améliorer introduction, tableau, parc, demandes, gestion calendrier, revenus et réputation. Séparer les commits tableau/parc/agenda si pertinent. |
| 08 | 07 | Présenter en quatre sections les neuf groupes existants. Garder les mécanismes locaux/serveur et préconditions de revue. |
| 09 | 04, 08 | Améliorer FAQ, assistance, dossier, avis et reçu sans toucher l’accordéon de / ou les notes internes. |
| 10 | 09 | Vérifier la cohérence de tous les écrans modifiés, titres d’action, textes de feedback et contrôles. Traiter les petits écarts dans leur portée locale. |
| 11 | 10 | Rejouer les cas bout en bout, classer chaque écart et rendre le score par écran et vue; contrôler le retour et les permissions. |

Garder l’ordre de revue 00→11 même si des prérequis techniques sont déjà disponibles; il réduit les conflits sur account.js, rentals.js, owner-workspace et le CSS client. Les branches de l’ancienne campagne v32/lot-NN sont historiques.
