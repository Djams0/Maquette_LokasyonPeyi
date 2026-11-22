# Notifications

Rendre la distinction lue/non lue avec texte et style. Le mock sait marquer l’ensemble comme lu, pas une notification isolée. Conserver la liste et liens vers les ressources réelles. Un clic navigue vers la cible et ses gardes usuelles. Les états « à jour », « aucune notification » et échec réseau doivent être explicites. Tester la différence entre liste vide et liste existante entièrement lue.

## `/notifications`

**État de départ** · À modifier. **Accès** · Client actif. **Planches** · [p. 26](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=26).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/account.js` |
| API sous /api/v1 | GET /bootstrap, POST /notifications/read |
| Données et actions | Liste du compte, cible existante, marquer tout comme lu |
| Desktop | Liste blanche avec information, date, état et destination, action globale dans entête. |
| Mobile | Regrouper cible et date, distinguer vide et lues; garder retour profil. |
| États et erreurs à vérifier | Vide, toutes lues, erreur de marquage |
| Tests navigateur (noms de suites) | navigation,maquette,messaging |
| Nature de la modification | A |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).
