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

## Critères actifs · correction V3.2

### CON-01 · `/inspection/:id/:phase`

[B-21](../04_VISUAL_REFERENCES/extension/planches/B-21.jpg), [B-22](../04_VISUAL_REFERENCES/extension/planches/B-22.jpg) · Progression, vues, prochaine capture et observations. [Lot R04](../07_CODEX_PROMPTS/correction-v32/R04_CONSTATS.md).

- **Scénario** · audit-LP-006 départ 5/8 avec caution validée et audit-LP-004 retour 8/8 finalisé.
- **Ordinateur** · B-21 retour finalisé, vues regroupées et compteur/observations adjacents. Pour un départ, conserver hiérarchie avec la prochaine vue éditable.
- **Mobile** · B-21 départ en cours, barre de progression puis prochaine vue et caméra fictive, vues secondaires et reprise. Pour retour finalisé, consultation seule.
- **Écart de départ** · [Observation et preuve CON-01](../01_AUDIT/ECARTS_CORRECTION_V32.md#con-01).
- **Comportements** · 8 vues distinctes, bornes, kilométrage retour ≥ départ, verrou finalisé côté mock, aucune vraie photo.
- **Vérification** · Capturer 5/8 départ et retour finalisé sur les deux largeurs. Relier B-22 zone « prochaine vue » à un retour éditable si testé. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### CON-02 · `/inspection/:id/:phase`

[B-23](../04_VISUAL_REFERENCES/extension/planches/B-23.jpg) · Caméra simulée et refus de capture. [Lot R04](../07_CODEX_PROMPTS/correction-v32/R04_CONSTATS.md).

- **Scénario** · renter en in_progress sur retour éditable, ouvrir la vue puis reproduire refus.
- **Ordinateur** · Dialogue nommé avec retour à la capture et message proche de la commande.
- **Mobile** · Dialogue dans la largeur avec reprise ou annulation et focus rendu à la vue.
- **Écart de départ** · [Observation et preuve CON-02](../01_AUDIT/ECARTS_CORRECTION_V32.md#con-02).
- **Comportements** · Respecter la tentative existante, reprise sans duplication et progression gardée.
- **Vérification** · Capturer erreur et reprise séparément, puis tester Échap, focus et refus sans perte des vues confirmées. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
