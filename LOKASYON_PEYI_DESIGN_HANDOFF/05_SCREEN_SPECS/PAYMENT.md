# Paiement et caution

Distinguer les trois informations: demande acceptée, paiement fictif confirmé et contrôle fictif de caution. Les seuls outcomes existants sont success/failure. Rendre le refus lisible sans retirer la demande acceptée et réessayer avec le contrôle standard. Présenter quote.days/daily/total et le résultat réellement fourni. Caution du suivi après confirmation et résolution indépendante, aucun débours réel, frais, dépôt ou couverture affirmés. Rejouer refus puis récupération; vérifier accès du propriétaire sans action et remise refusée avant prérequis.

## `/payment/:id`

**État de départ** · Partiel. **Accès** · Participants en lecture; locataire seul agit si awaiting_payment. **Planches** · [p. 20](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=20).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/rentals.js`, `client/pages/booking-state.js` |
| API sous /api/v1 | GET /rentals/:id, POST /rentals/:id/pay |
| Données et actions | quote, outcome success/failure, statut séparé de deposit |
| Desktop | Formulaire de simulation opaque et détail du prix à droite; aucun champ bancaire. |
| Mobile | Expliquer refus/absence de débit près du CTA; total et mention fictive visibles. |
| États et erreurs à vérifier | Refus laisse awaiting_payment, non éligible, 401/409 |
| Tests navigateur (noms de suites) | booking,maquette |
| Nature de la modification | A |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).
