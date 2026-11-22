# États des lieux

Ordre exact: Avant, Arrière, Côté gauche, Côté droit, Intérieur, Compteur, Carburant / charge, Vue générale. Une vue enregistrée est une métadonnée de caméra simulée. Afficher sa version et conserver l’ancienne si remplacement refusé avant confirmation. La progression compte les vues effectivement enregistrées. Rapprocher la prochaine manquante et le formulaire. Les champs et sauvegarde restent ceux du POST inspection; km entier 0–2 000 000, charge 0–100, observation 1500, retour ≥ départ, confirmation + huit vues avant finalisation. Le constat finalisé est visible et verrouillé. Une réserve passe par le dossier existant.

## `/inspection/:id/:phase`

**État de départ** · À modifier. **Accès** · Participants; édition départ confirmed ou retour in_progress, si non finalisé. **Planches** · [p. 21](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=21), [p. 22](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=22), [p. 23](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=23).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/inspection.js`, `client/pages/booking-state.js` |
| API sous /api/v1 | GET /rentals/:id, POST /rentals/:id/inspection |
| Données et actions | Huit vues, progression, versions, compteurs, observations, finalisation |
| Desktop | Vues en grille à gauche, compteur/charge/observations à droite et état verrouillé lisible. |
| Mobile | Première vue manquante et groupe de vues accessible; formulaire atteignable sans traverser huit grandes cartes. |
| États et erreurs à vérifier | Phase inconnue, photo refusée/floue, km retour trop bas, constat verrouillé |
| Tests navigateur (noms de suites) | maquette,booking |
| Nature de la modification | B |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).
