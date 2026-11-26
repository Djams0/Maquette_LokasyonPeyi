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

## Critères actifs · correction V3.2

### PRG-01 · `/`

[B p. 3](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=3), [B-43](../04_VISUAL_REFERENCES/extension/planches/B-43.jpg), [B-44](../04_VISUAL_REFERENCES/extension/planches/B-44.jpg) · Capsule, recherche et parcours existants. [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md).

- **Scénario** · Seed historique, visiteurs puis locataire/propriétaire à 390 et 1440.
- **Ordinateur** · Identité d’interface avec main de départ et parcours actuels.
- **Mobile** · Identité d’interface et barre basse publique selon le protocole.
- **Écart de départ** · [Observation et preuve PRG-01](../01_AUDIT/ECARTS_CORRECTION_V32.md#prg-01).
- **Comportements** · Critères, médias, menu/rôles et états de session publique.
- **Vérification** · PNG et diff aux 8 largeurs, contrôles connectés et contexte préservés à chaque lot. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### PRG-02 · `/search`

[B p. 3](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=3), [B-43](../04_VISUAL_REFERENCES/extension/planches/B-43.jpg), [B-44](../04_VISUAL_REFERENCES/extension/planches/B-44.jpg) · Catalogue et tiroir. [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md).

- **Scénario** · Seed historique, filtres et budget, 390 → 880 → 390.
- **Ordinateur** · Identité composition, filtres, carte et tri.
- **Mobile** · Identité tiroir, reflow et focus. Rejouer la réserve historique PUB-01 et préciser sa signature.
- **Écart de départ** · [Observation et preuve PRG-02](../01_AUDIT/ECARTS_CORRECTION_V32.md#prg-02).
- **Comportements** · Conserver critères, valeur, URL et retour. Toute nouvelle divergence attend une résolution.
- **Vérification** · 8 paires, et résultat du test partagé avec répétitions identiques. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### PRG-03 · `/vehicle/:id`

[B p. 3](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=3), [B-43](../04_VISUAL_REFERENCES/extension/planches/B-43.jpg), [B-44](../04_VISUAL_REFERENCES/extension/planches/B-44.jpg) · Fiche v3, média et retour. [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md).

- **Scénario** · Seed historique, /vehicle/v3, galerie et retour exact depuis catalogue, demande suivie d’authentification.
- **Ordinateur** · Identité du rendu, galerie et CTA sur les scénarios protégés.
- **Mobile** · Identité, action au premier écran, retour et barre de pied selon fiche.
- **Écart de départ** · [Observation et preuve PRG-03](../01_AUDIT/ECARTS_CORRECTION_V32.md#prg-03).
- **Comportements** · Préserver média, estimation, prix et contexte de retour v1/v3.
- **Vérification** · 8 paires et parcours connexion/retour à 390 et 1440 sur les mêmes données. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
