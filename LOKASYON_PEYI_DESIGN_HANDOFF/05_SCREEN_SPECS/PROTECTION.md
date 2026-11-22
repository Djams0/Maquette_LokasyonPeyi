# Références protégées

Prendre comme base le rendu réel de main. L’objectif de cette campagne est zéro régression, indépendamment des écarts historiques aux planches de la découverte. Vérifier le parcours entre ces trois routes, les captures et l’identité de session.

## `/`

**État de départ** · Protégée. **Accès** · Public. **Planches** · [p. 03](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=3).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/catalog.js`, `client/pages/explorer-state.js` |
| API sous /api/v1 | GET /vehicles, GET /me |
| Données et actions | Recherche; vedettes; reprise récente |
| Desktop | Capsule, hero, moteur, cadran et sections tels que rendus à 4338f5f. |
| Mobile | Même composition, champs et retours; vérifier aussi session lente. |
| États et erreurs à vérifier | Date invalide, vide, erreur, identité lente |
| Tests navigateur (noms de suites) | explorer,search,navigation,visual-qa |
| Nature de la modification | A |

## `/search`

**État de départ** · Protégée. **Accès** · Public. **Planches** · [p. 03](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=3).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/search-results.js`, `client/pages/search-state.js`, `client/pages/vehicle-card.js` |
| API sous /api/v1 | GET /vehicles, GET /me |
| Données et actions | Recherche canonique, vue carte, filtres, tri, édition |
| Desktop | Garder résumé, sidebar, grille, carte et critères appliqués. |
| Mobile | Tiroir et focus existants, état de resize historique à mesurer. |
| États et erreurs à vérifier | Vide, chargement, panne, redimensionnement tiroir |
| Tests navigateur (noms de suites) | search,explorer,visual-qa |
| Nature de la modification | A |

## `/vehicle/:id`

**État de départ** · Protégée. **Accès** · Public si publiée; propriétaire de son annonce hors publication. **Planches** · [p. 03](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=3).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/vehicle-detail.js`, `client/pages/vehicle-media.js`, `client/pages/vehicle-presentation.js` |
| API sous /api/v1 | GET /vehicles/:id, POST /conversations, GET /me |
| Données et actions | Galerie, état déclaré, estimation, reprise vers fiche et recherche |
| Desktop | Conserver galerie, conditions, médias de modèle et défaut fictif distinct. |
| Mobile | Conserver focus et contexte, y compris action privée après connexion. |
| États et erreurs à vérifier | 404, période invalide, media absent, retour contexte |
| Tests navigateur (noms de suites) | vehicle,booking,search,visual-qa |
| Nature de la modification | A |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).
