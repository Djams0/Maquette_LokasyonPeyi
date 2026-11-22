# États et transitions

Sources api/modules/rentals.mjs et client/pages/booking-state.js. Les dates de rendez-vous relèvent de la projection de publicRental. Relire la fonction rentalNext sur la base de chaque lot.

| État | Acteur et action | Transition | Garde ou sens |
| --- | --- | --- | --- |
| requested | owner accepte/refuse; renter retire | accept → awaiting_payment; decline → declined; withdraw → withdrawn | Aucun paiement ni préautorisation. |
| awaiting_payment | renter pay | success → confirmed; failure → même statut, payment failed | Quote validée, état de paiement lisible. |
| confirmed | renter deposit; parties constat départ; owner handover | Caution change séparément; handover → in_progress | Caution simulée autorisée, 8 vues finalisées et confirmation de remise. |
| in_progress | parties constat retour; renter report_return | report_return → return_reported | Constat de retour finalisé. |
| return_reported | owner verify_return | → returned | Confirmer clés; état distinct de la clôture. |
| returned | owner complete | → completed | Action dédiée. Caution résolue indépendamment. |
| completed | parties reçu; renter avis unique | État terminal | Avis modéré, reçu fictif. |
| declined / withdrawn | aucune action de transaction | État terminal sans paiements | Progression arrêtée, sortir vers catalogue si rôle. |

- Le constat est une sous-ressource par phase. La mutation photo remet à jour une vue sans effacer l’historique. Save et finalize éditent les valeurs tant que statut et phase le permettent. L’original finalisé est figé.
- Annonce · soumission en pending; décisions modération published, changes_requested ou rejected après contrôles; pause/reprise/retrait selon statut et locations détenues. Une pièce remplacée relance le contrôle.
- Brouillon · local non enregistré, enregistrement demandé, serveur confirmé, divergence détectée, tentative de soumission incertaine, soumission confirmée. Aucune transition en simple changement de section.
- Conversation · rédaction, envoi, résultat confirmé, refus définitif ou résultat incertain. L’identité et l’ID du message server font foi.
