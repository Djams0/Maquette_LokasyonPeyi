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

## Critères actifs · correction V3.2

### OWN-01 · `/owner/start`

[B-32](../04_VISUAL_REFERENCES/extension/planches/B-32.jpg) · Bandeau littoral et estimation. [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md).

- **Scénario** · Visiteur puis locataire éligible et propriétaire déjà activé.
- **Ordinateur** · Panorama Grande Anse et cartouche avant estimation/étapes. Crédit associé.
- **Mobile** · Retour, introduction compacte puis estimation brute et prérequis.
- **Écart de départ** · [Observation et preuve OWN-01](../01_AUDIT/ECARTS_CORRECTION_V32.md#own-01).
- **Comportements** · Reprise après login, onboarding confirmé, chiffres fictifs, pas de nouveau droit implicite.
- **Vérification** · CTA et hiérarchie au premier écran. Rendu synthétique et crédit aux deux largeurs. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### OWN-02 · `/owner`

[B-33](../04_VISUAL_REFERENCES/extension/planches/B-33.jpg), [B-42](../04_VISUAL_REFERENCES/extension/planches/B-42.jpg) · Trois compteurs, demande, brouillon et aperçu du parc. [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md).

- **Scénario** · audit-o02, demande audit-LP-009 et brouillon sauvegardé step=5, un véhicule.
- **Ordinateur** · Navigation propriétaire, trois compteurs dans une ligne, action demande à gauche, brouillon dans un rail, parc secondaire.
- **Mobile** · À 390 × 844, trois compteurs compacts sur la même ligne, carte demande suivie du brouillon et des deux CTA entièrement visibles. Barre basse.
- **Écart de départ** · [Observation et preuve OWN-02](../01_AUDIT/ECARTS_CORRECTION_V32.md#own-02).
- **Comportements** · Compteurs avec périmètre du compte et destinations, actions via la demande et étape effective du brouillon.
- **Vérification** · Prendre les boîtes des trois compteurs et des deux boutons au chargement. Même y pour compteurs, boutons entiers au-dessus de barre et sans défilement. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### OWN-07 · `/owner/revenue`

[B-38](../04_VISUAL_REFERENCES/extension/planches/B-38.jpg) · Indicateurs et paiements simulés. [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md).

- **Scénario** · audit-o02 avec payé simulé puis audit-o01 sans données.
- **Ordinateur** · Signalement démo, brut puis profil et net indéfini, liste des paiements secondaires.
- **Mobile** · Garder montants et simulations proches des libellés, ordre de lecture naturel, vide utile.
- **Écart de départ** · [Observation et preuve OWN-07](../01_AUDIT/ECARTS_CORRECTION_V32.md#own-07).
- **Comportements** · Montant du mock, aucune commission ou versement créé, confidentialité du compte.
- **Vérification** · Capture payé et vide aux deux largeurs, total recalculé sur données du compte. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### OWN-08 · `/owner/reputation`

[B-38](../04_VISUAL_REFERENCES/extension/planches/B-38.jpg) · Avis, statut et réponse du propriétaire. [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md).

- **Scénario** · owner avec review-demo, audit-o01 vide.
- **Ordinateur** · Une liste hiérarchisée véhicule, note, statut puis réponse. Extrapolation depuis la vue mobile B-38.
- **Mobile** · Retour, véhicule et note, état et action répondre proche de l’avis.
- **Écart de départ** · [Observation et preuve OWN-08](../01_AUDIT/ECARTS_CORRECTION_V32.md#own-08).
- **Comportements** · Seulement avis applicables et réponse du propriétaire autorisé, validation et erreurs.
- **Vérification** · Comparer vue mobile B-38 puis tester réponse personnelle/tiers et cas vide. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
