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

## Critères actifs · correction V3.2

### OUT-01 · `/demo`

[B p. 10](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=10), [B-44](../04_VISUAL_REFERENCES/extension/planches/B-44.jpg) · Entrée outils et identité fictive. [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md).

- **Scénario** · Visiteur et locataire, y compris panne simulée.
- **Ordinateur** · Accès depuis Menu → Démonstration et pied de page, mention fictive sur page.
- **Mobile** · Mêmes accès dans menu, contrôle des personas sans gêner premier écran métier.
- **Écart de départ** · [Observation et preuve OUT-01](../01_AUDIT/ECARTS_CORRECTION_V32.md#out-01).
- **Comportements** · Changement de compte et sortie réseau, aucune donnée personnelle.
- **Vérification** · Vérifier navigation à 390 et 1440 et retour au scénario. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### OUT-02 · `/demo/audit`

[B p. 10](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=10), [B-44](../04_VISUAL_REFERENCES/extension/planches/B-44.jpg) · Atelier d’audit et retour outils. [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md).

- **Scénario** · Visiteur sur audit-v1 et instance seed séparée.
- **Ordinateur** · Maintenir le choix du scénario et retour à /demo.
- **Mobile** · Maintenir retour visible et actions accessibles.
- **Écart de départ** · [Observation et preuve OUT-02](../01_AUDIT/ECARTS_CORRECTION_V32.md#out-02).
- **Comportements** · Comptes synthétiques explicites et pas de réinitialisation de données réelles.
- **Vérification** · Vérifier les deux démarrages et lien retour. Statut documenté faute de maquette dédiée. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### OUT-03 · `/design-system`

[B p. 10](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=10), [B-11](../04_VISUAL_REFERENCES/extension/planches/B-11.jpg), [B-12](../04_VISUAL_REFERENCES/extension/planches/B-12.jpg) · Échantillons visuels opérationnels et interactions. [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md).

- **Scénario** · Visiteur accédant depuis le menu, erreur et récupération fictives.
- **Ordinateur** · Réutiliser les exemples existants, variantes cohérentes avec tokens.
- **Mobile** · Retour, navigation aux exemples, dialogue maniable au clavier.
- **Écart de départ** · [Observation et preuve OUT-03](../01_AUDIT/ECARTS_CORRECTION_V32.md#out-03).
- **Comportements** · Garder le verre public et les exemples sans écriture métier.
- **Vérification** · Comparer composants à B-11/12, tester focus/fermeture et reflow. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
