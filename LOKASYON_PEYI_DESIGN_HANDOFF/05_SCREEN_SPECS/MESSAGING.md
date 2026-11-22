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
