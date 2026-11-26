# Demandes propriétaire

Les filtres sont les valeurs réellement gérées dans owner-workspace. Conserver les liens vers /rental/:id et leur retour propriétaire. L’action de décision reste dans la fiche de suivi avec précondition actuelle. L’affichage n’étend jamais le périmètre du parc. Tester ouverture, acceptation, refus, passage en attente de paiement et états sans demande.

## `/owner/requests`

**État de départ** · Partiel. **Accès** · Propriétaire actif, demandes de son parc. **Planches** · [p. 37](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=37).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/owner-workspace.js`, `client/pages/booking-state.js` |
| API sous /api/v1 | GET /bootstrap, GET /me; actions dans /rental/:id |
| Données et actions | Filtres et états des demandes, ouvrir suivi avant décision |
| Desktop | Liste par statut, période et prochaine étape. Lien de suivi dominant au lieu d’une action concurrente dans la liste. |
| Mobile | Une action lisible par ligne; contexte de retour depuis dossier; filtre non perdu. |
| États et erreurs à vérifier | Vide, refus, dossier modifié entre liste et suivi |
| Tests navigateur (noms de suites) | owner,booking,navigation |
| Nature de la modification | A |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).

## Critères actifs · correction V3.2

### OWN-06 · `/owner/requests`

[B-37](../04_VISUAL_REFERENCES/extension/planches/B-37.jpg) · Filtres et carte examinable. [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md).

- **Scénario** · audit-o02 sur requested puis filtre vide.
- **Ordinateur** · État et contexte de chaque dossier, CTA à droite, choix de réponse dans le suivi.
- **Mobile** · Carte verticale claire avec statut et CTA, filtres et actualisation, aucun choix direct.
- **Écart de départ** · [Observation et preuve OWN-06](../01_AUDIT/ECARTS_CORRECTION_V32.md#own-06).
- **Comportements** · Acteur et transitions au suivi, onglet et actualisation, permissions de participant.
- **Vérification** · Captures état actif/vide et retour exact après décision. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
