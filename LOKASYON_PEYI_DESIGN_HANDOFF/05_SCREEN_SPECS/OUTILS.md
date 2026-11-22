# Démonstration et composants

Préserver la navigation vers l’atelier et la bascule de profils fictifs. La récupération réseau prévue par client/app.js reste immédiatement utilisable. Étendre la présentation en gardant isolées les démos et le mode audit.

## `/demo`

**État de départ** · Hors écran cible. **Accès** · Public. **Planches** · [p. 10](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=10), [p. 44](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=44).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/demo.js` |
| API sous /api/v1 | GET /personas?app=client, POST/DELETE /session |
| Données et actions | Sélecteur, visiteur, réseau lent ou HS en sessionStorage |
| Desktop | Garder les points d’entrée de démonstration. Éventuelle harmonisation de surface seule au lot 10. |
| Mobile | Menu et champs accessibles, éviter d’enfouir la sortie de l’état réseau. |
| États et erreurs à vérifier | Blocages simulés récupérables sur cette route |
| Tests navigateur (noms de suites) | navigation,explorer,maquette |
| Nature de la modification | A |

## `/demo/audit`

**État de départ** · Hors écran cible. **Accès** · Public côté client, profils lorsque fixture audit active. **Planches** · [p. 10](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=10), [p. 44](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=44).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/audit.js` |
| API sous /api/v1 | GET /personas?app=client, POST /session |
| Données et actions | Sélection audit sans changer le seed; récupération réseau |
| Desktop | Respecter l’atelier et les profils de démonstration; ne jamais transformer ces comptes en accès réels. |
| Mobile | État vide utile et accès à /demo. |
| États et erreurs à vérifier | Pas de persona audit dans le seed historique, compte suspendu |
| Tests navigateur (noms de suites) | navigation; profiles.spec.js |
| Nature de la modification | A |

## `/design-system`

**État de départ** · Hors écran cible. **Accès** · Public de démonstration. **Planches** · [p. 10](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=10), [p. 11](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=11), [p. 12](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=12).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/demo.js` |
| API sous /api/v1 | Aucune API sur l’écran; shell lit /me |
| Données et actions | Échantillons UI et verre V3.2 |
| Desktop | Échantillon de nouveaux composants métier séparé si nécessaire. Préserver démo du verre. |
| Mobile | Contrôles lisibles et focus à 320 px. |
| États et erreurs à vérifier | Variantes préférences et contrôles du kit |
| Tests navigateur (noms de suites) | components,visual-qa |
| Nature de la modification | A |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).
