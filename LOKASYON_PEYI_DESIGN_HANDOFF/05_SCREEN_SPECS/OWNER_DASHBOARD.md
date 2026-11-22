# Tableau, introduction et activité propriétaire

Les compteurs doivent refléter bootstrap et les filtres réellement disponibles. Le tableau lie la première demande actionnable et la reprise du dernier brouillon serveur confirmé, avec état API indisponible distinct de l’absence de brouillon. Le propriétaire garde accès aux locations et messages permis. L’estimation brute de /owner/start est illustrative. Pour revenus, afficher les données réelles du mock, préciser brut simulé; aucun revenu net. Rejouer passage visiteur → connexion → activation et compte déjà propriétaire.

## `/owner/start`

**État de départ** · À modifier. **Accès** · Public; activation client actif. **Planches** · [p. 32](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=32).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/owner.js`, `client/pages/navigation.js` |
| API sous /api/v1 | POST /owner/onboarding |
| Données et actions | Découverte, estimateur brut local, redirection login si nécessaire, activation |
| Desktop | Panorama Grande Anse, panneau éditorial profond, estimation brute et CTA adapté. |
| Mobile | Panorama court avec texte lisible, estimation opaque, libellé démo et pas de promesse de revenu. |
| États et erreurs à vérifier | Non connecté, déjà propriétaire, confirmation absente |
| Tests navigateur (noms de suites) | owner,maquette,navigation |
| Nature de la modification | A |

## `/owner`

**État de départ** · Partiel. **Accès** · Propriétaire actif. **Planches** · [p. 33](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=33), [p. 42](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=42).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/owner-workspace.js`, `client/pages/owner-state.js` |
| API sous /api/v1 | GET /bootstrap, GET /owner/draft, GET /me |
| Données et actions | Compteurs, première demande, brouillon, gestion et accès aux sections |
| Desktop | Compteurs, demande prioritaire et zone reprise; « aujourd’hui » sans générer une fausse alerte. |
| Mobile | Compte, demande et reprise avant les liens secondaires; seuil 1024 pour deux zones. |
| États et erreurs à vérifier | Parc vide, draft API indisponible, changement de compte |
| Tests navigateur (noms de suites) | owner,navigation,maquette |
| Nature de la modification | A |

## `/owner/revenue`

**État de départ** · À modifier. **Accès** · Propriétaire actif. **Planches** · [p. 38](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=38).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/owner-workspace.js` |
| API sous /api/v1 | GET /bootstrap, GET /me |
| Données et actions | Montants bruts des paiements simulés issus des locations |
| Desktop | Synthèse brut, statut fictif et lignes datées. Frais et montant net sont indéfinis. |
| Mobile | Montant puis statut; pas de graphique inventé ni d’estimation présentée comme revenu net. |
| États et erreurs à vérifier | Aucune location payée, valeur non disponible |
| Tests navigateur (noms de suites) | owner,maquette |
| Nature de la modification | A |

## `/owner/reputation`

**État de départ** · À modifier. **Accès** · Propriétaire actif. **Planches** · [p. 38](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=38).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/owner-workspace.js` |
| API sous /api/v1 | GET /bootstrap, GET /me, POST /reviews/:id |
| Données et actions | Avis applicables, réponse propriétaire distincte, note et statut |
| Desktop | Cartes notes et texte, action de réponse avec dialogue stable. |
| Mobile | Une colonne; actions et focus visibles, statut lisible sans couleur. |
| États et erreurs à vérifier | Vide, longueur de réponse, avis tiers interdit |
| Tests navigateur (noms de suites) | owner,maquette |
| Nature de la modification | A |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).
