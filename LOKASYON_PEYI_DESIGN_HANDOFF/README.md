# Lokasyon Péyi · Design handoff V3.2

**Péyi en mouvement** · Référence validée le 19 novembre 2026.

Le kit prépare l’évolution de la maquette existante. Commencer par le [PDF approuvé](00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf), puis ouvrir les [maquettes natives](04_VISUAL_REFERENCES/README.md). L’[index des lots](06_CODEX_PROMPTS/00_README.md) mène au [lot 00 — Baseline](06_CODEX_PROMPTS/LOT_00_BASELINE.md).

| Besoin | Fichier |
|---|---|
| Autorité, limites et arbitrages | [Décisions et sources](00_SOURCE_OF_TRUTH/DECISIONS_ET_SOURCES.md) |
| Dépôt, écrans actuels et écarts | [Audit](01_AUDIT_EXISTANT/ETAT_REEL_ET_ECARTS.md) · [Parcours](01_AUDIT_EXISTANT/INVENTAIRE_FONCTIONNEL.md) |
| Sort de chaque fichier V2 | [Audit des suppressions](01_AUDIT_EXISTANT/AUDIT_ANCIEN_HANDOFF_ET_SUPPRESSIONS.md) |
| Fondations et valeurs | [Design system](02_FONDATIONS_V3.2/DESIGN_SYSTEM.md) · [Tokens](02_FONDATIONS_V3.2/design-tokens.json) |
| Écrans et composants | [Spécifications](05_SCREEN_SPECS_V3.2/README.md) |
| Photos et fixtures | [Ressources](04_VISUAL_REFERENCES/ASSET_MAPPING.md) · [Manifeste](04_VISUAL_REFERENCES/asset-manifest.json) |
| Preuves et recette | [Protocole et grille](07_VALIDATION/RECETTE.md) · [Matrice](07_VALIDATION/MATRICE_VISUELLE.csv) |
| Mise en œuvre et portes de sortie | [Plan](08_IMPLEMENTATION/PLAN.md) · [Rapport de préparation](08_IMPLEMENTATION/RAPPORT.md) |

Depuis la racine du dépôt, vérifier le kit avec `python3 LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_v32.py`. Le plan d’intégration est incrémental. Chaque lot a une branche et une revue explicite. Référence de l’audit web et métier **e42cc6ffa69bba6c1cc5c36333adede531d6d11f**.
