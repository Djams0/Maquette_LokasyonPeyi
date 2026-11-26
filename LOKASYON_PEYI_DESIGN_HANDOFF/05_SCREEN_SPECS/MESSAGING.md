# Messagerie

Conserver le même identifiant de conversation et le retour q. Le fil se rattache à un véhicule et aux participants, selon le contrat actuel. La rédaction reprend texte et tentative par compte/fil. Simuler la perte d’une réponse avant et après écriture; même corps et même clé quand rejouable, sinon relecture seule. Dédupliquer selon ID serveur. Aucun indicateur de présence, lecture par message ou pièce jointe réelle. Verrouiller l’affichage privé au changement de compte, garder l’espace de composition et le retour focus.

## `/messages`

**État de départ** · Partiel. **Accès** · Client actif inscrit au fil. **Planches** · [p. 24](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=24), [p. 25](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=25), [p. 27](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=27).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/messaging.js`, `client/pages/message-state.js`, `client/pages/account.js` |
| API sous /api/v1 | GET /me, GET /conversations, POST /conversations/:id |
| Données et actions | q, conversation, historique, brouillon par compte/fil, corps/clé gelés |
| Desktop | Liste 300–340 px, fil fluide, en-tête contexte véhicule + retour fiche si autorisé. |
| Mobile | Liste puis fil; préserver q au retour, envoyer sans couvrir la saisie ou masquer les erreurs. |
| États et erreurs à vérifier | Fil absent, vide, indisponible, envoi incertain, compte changé |
| Tests navigateur (noms de suites) | messaging,navigation,maquette |
| Nature de la modification | B |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).

## Critères actifs · correction V3.2

### MSG-01 · `/messages`

[B-24](../04_VISUAL_REFERENCES/extension/planches/B-24.jpg), [B-25](../04_VISUAL_REFERENCES/extension/planches/B-25.jpg), [B-27](../04_VISUAL_REFERENCES/extension/planches/B-27.jpg) · Boîte de réception, filtre, sélection et vide. [Lot R05](../07_CODEX_PROMPTS/correction-v32/R05_MESSAGERIE_NOTIFICATIONS.md).

- **Scénario** · renter avec fil court v1 et fil long v3, newcomer sans échange.
- **Ordinateur** · Recherche et liste à gauche, fil ou état d’attente à droite. Fil sélectionné identifiable et contexte véhicule.
- **Mobile** · La liste seule s’ouvre avec le filtre, puis le fil sans liste concurrente. Barre basse sur liste. Vide utile selon B-27.
- **Écart de départ** · [Observation et preuve MSG-01](../01_AUDIT/ECARTS_CORRECTION_V32.md#msg-01).
- **Comportements** · Filtre q, résultat neutre si vide et pas d’accès aux conversations tierces.
- **Vérification** · Compare liste B-25 aux deux largeurs. Après ouverture et retour, q et ciblage restent exacts. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### MSG-02 · `/messages?conversation=:id`

[B-24](../04_VISUAL_REFERENCES/extension/planches/B-24.jpg), [B-25](../04_VISUAL_REFERENCES/extension/planches/B-25.jpg) · Carte contexte, historique et zone de réponse. [Lot R05](../07_CODEX_PROMPTS/correction-v32/R05_MESSAGERIE_NOTIFICATIONS.md).

- **Scénario** · renter, trois échanges sur v1 puis un fil de 14 messages v3, q non vide pour le retour.
- **Ordinateur** · Deux panneaux, contexte et lien fiche dans le bandeau, fil et réponse délimités.
- **Mobile** · Retour au-dessus du fil, contexte véhicule compact, saisie et envoi entièrement accessibles au premier écran 390 × 844 du fil court. Fil long défile sans recouvrir les commandes.
- **Écart de départ** · [Observation et preuve MSG-02](../01_AUDIT/ECARTS_CORRECTION_V32.md#msg-02).
- **Comportements** · Fil isolé par compte, saisie/position/sélection, calcul de l’état d’envoi, nouvelle tentative idempotente et retour filtré.
- **Vérification** · Comparatif B-24 court avec mesure textarea et bouton visibles. Captures long avant et pendant saisie si clavier disponible, essai retour et changement de compte. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
