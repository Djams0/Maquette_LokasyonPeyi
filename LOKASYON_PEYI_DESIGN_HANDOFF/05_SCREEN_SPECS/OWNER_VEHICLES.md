# Parc et gestion

Garder l’identité de véhicule et les gardes de owner-workspace. Les actions pause/reprise/retrait/édition sont contraintes par le statut et les locations. Superposer les photos de modèle uniquement à l’ID et au nom mappés ou utiliser le visuel actuel. Le calendrier est une section #owner-calendar (aucune nouvelle route). Distinguer demande non réservée, période occupée et blocage manuel. Nommer la période en heure de Guadeloupe, confirmer blocage et libération, gérer recouvrement en 409. Le remplacement de justificatif démarre une nouvelle version de contrôle.

## `/owner/vehicles`

**État de départ** · Partiel. **Accès** · Propriétaire actif. **Planches** · [p. 34](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=34).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/owner-workspace.js`, `client/pages/vehicle-media.js` |
| API sous /api/v1 | GET /bootstrap, GET /me |
| Données et actions | Parc, états, filtre URL actuel, ajout et gestion |
| Desktop | Cartes et filtre d’état, photo issue du mapping explicite ou repli; trois cartes si lisibles. |
| Mobile | Une colonne, filtres repliables sans supprimer l’accès, statut avant action. |
| États et erreurs à vérifier | Aucune annonce ou filtre vide, état absent |
| Tests navigateur (noms de suites) | owner,maquette |
| Nature de la modification | A |

## `/owner/vehicles/:id`

**État de départ** · Partiel. **Accès** · Propriétaire du véhicule. **Planches** · [p. 35](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=35), [p. 36](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=36).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/owner-workspace.js`, `client/pages/owner-state.js`, `client/pages/vehicle-presentation.js` |
| API sous /api/v1 | GET /bootstrap, GET /me, POST /owner/vehicles/:id/{edit,block,unblock,pause,resume,remove}, POST /documents |
| Données et actions | Statut, gestion, docs, état, calendrier et confirmations |
| Desktop | Visuel de modèle + carte gestion; sections réelles, calendrier à l’ancre #owner-calendar, mois et formulaire de blocage. |
| Mobile | Ancres compactes; agenda ordonné et formulaire dessous. Mettre l’état explicitement non renseigné quand absent. |
| États et erreurs à vérifier | 403/404, conflit période, contrôle requis, suppressions interdites si location |
| Tests navigateur (noms de suites) | owner,maquette |
| Nature de la modification | B |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).
