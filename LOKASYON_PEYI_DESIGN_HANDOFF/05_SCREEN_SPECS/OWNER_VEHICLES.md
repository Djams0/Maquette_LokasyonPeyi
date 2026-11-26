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

## Critères actifs · correction V3.2

### OWN-03 · `/owner/vehicles`

[B-34](../04_VISUAL_REFERENCES/extension/planches/B-34.jpg) · Filtres, ajout et cartes du parc. [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md).

- **Scénario** · owner avec publié/en revue puis audit-o01 sans véhicule ou brouillon.
- **Ordinateur** · Contrôle d’ajout explicite, filtres, grille photo avec badge et action.
- **Mobile** · Ajout avant filtres compactés, cartes média/détails, liens de gestion et calendrier atteignables.
- **Écart de départ** · [Observation et preuve OWN-03](../01_AUDIT/ECARTS_CORRECTION_V32.md#own-03).
- **Comportements** · Filtres URL et droit sur véhicules, statut publié/en revue/retrait, repli image fidèle au modèle.
- **Vérification** · Capturer parc mixte/filtre actif/vide avec nom/statut/action. Retour exact après gestion. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### OWN-04 · `/owner/vehicles/:id`

[B-35](../04_VISUAL_REFERENCES/extension/planches/B-35.jpg) · Photo, statut et opérations. [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md).

- **Scénario** · owner sur v1 et audit-o02 sur son véhicule, tester autre compte.
- **Ordinateur** · Photo et contexte puis rail opérations et contraintes, ancrages liés au même véhicule.
- **Mobile** · Retour au parc filtré, titre, statut, photo, liens de gestion dont calendrier puis contenu.
- **Écart de départ** · [Observation et preuve OWN-04](../01_AUDIT/ECARTS_CORRECTION_V32.md#own-04).
- **Comportements** · Droits, pause/reprise/retrait et confirmation, garde 409, état déclaré fidèle.
- **Vérification** · Comparatif B-35 et test de 403/retour/filtre, état du média et déclenchement d’ancre. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### OWN-05 · `/owner/vehicles/:id#owner-calendar`

[B-36](../04_VISUAL_REFERENCES/extension/planches/B-36.jpg) · Calendrier et formulaire de blocage. [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md).

- **Scénario** · owner audit-o02 sur audit-v02-1 en mars 2027, avec demande/occupé et blocage de test.
- **Ordinateur** · Grille du mois et formulaire côte à côte, raison lisible, liens vers détail.
- **Mobile** · Agenda des périodes ordonné et libellé avant action de blocage. Grille cachée si largeur insuffisante.
- **Écart de départ** · [Observation et preuve OWN-05](../01_AUDIT/ECARTS_CORRECTION_V32.md#own-05).
- **Comportements** · Blocage/déblocage, refus chevauchement, mappage demande non réservée, hash et focus.
- **Vérification** · Comparer depuis l’ancre aux deux largeurs. Bloquer puis libérer, vérifier 409 et rang agenda. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
