# Suivi de la location

La prochaine action, son acteur et ses préconditions précèdent une timeline de sept jalons. rentalProgress et rentalNext restent les sources de ces états. Le locataire retire seulement avant acceptation, le propriétaire peut refuser à ce moment, avec le motif existant. La donnée précise de rendez-vous n’apparait qu’après confirmation. Pour une réserve ou un litige, rejoindre le parcours de dossier. Garder le lien de fil limité au véhicule et aux participants; le libellé ne prétend pas associer explicitement le fil à une location. Les notifications et l’actualisation n’anticipent jamais une transition.

## `/rental/:id`

**État de départ** · Partiel. **Accès** · Locataire ou propriétaire de la location. **Planches** · [p. 18](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=18), [p. 19](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=19).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/rentals.js`, `client/pages/booking-state.js` |
| API sous /api/v1 | GET /rentals/:id, POST /rentals/:id/{accept,decline,withdraw,deposit,handover,report_return,verify_return,complete}, GET /conversations |
| Données et actions | rentalNext, histoire, constat, rôle, remise, contexte du fil |
| Desktop | Carte action #103731 avant progression, rail véhicule/conditions. Garder refus et retrait accessibles selon contrat. |
| Mobile | Action et acteur avant historique, étapes terminées repliables, retour par rôle, pas de barre couvrant le focus. |
| États et erreurs à vérifier | 401/403/409/422, attente, refus, retrait, état inconnu |
| Tests navigateur (noms de suites) | booking,maquette,navigation |
| Nature de la modification | B |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).
