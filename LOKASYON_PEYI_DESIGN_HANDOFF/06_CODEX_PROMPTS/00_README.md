# Prompts Codex · V3.2

Commencer par [LOT_00_BASELINE.md](LOT_00_BASELINE.md) sur le dépôt Maquette_LokasyonPeyi avec le kit installé. Communiquer le SHA qui installe le kit. Le SHA d’audit figure dans chaque prompt. Vérifier le SHA courant et conserver les preuves.

| Lot | Mission | Dépendances | Priorité | Complexité |
|---|---|---|---|---|
| 00 | [Baseline applicative](LOT_00_BASELINE.md) | — | P0 | S |
| 01 | [Fondations et verre](LOT_01_DESIGN_FOUNDATIONS.md) | 00 | P1 | M |
| 02 | [Assets et crédits](LOT_02_ASSETS_AND_MEDIA.md) | 01 | P1 | M |
| 03 | [Accueil · premier écran](LOT_03_HOME_HERO.md) | 02 | P1 | L |
| 04 | [Accueil · sections](LOT_04_HOME_SECTIONS.md) | 03 | P1 | L |
| 05 | [Catalogue et filtres](LOT_05_CATALOG.md) | 02, 03 | P1 | L |
| 06 | [Fiche, galerie et demande](LOT_06_VEHICLE_DETAIL.md) | 02, 05 | P1 | L |
| 07 | [Navigation et rôles](LOT_07_NAVIGATION_AND_ROLES.md) | 03, 04, 05, 06 | P0 | M |
| 08 | [Cohérence des surfaces métier](LOT_08_COHERENCE_AND_POLISH.md) | 07 | P2 | M |
| 09 | [Recette finale et conformité](LOT_09_FINAL_QA.md) | 08 | P0 | L |

Ordre de revue 00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09. Les dépendances du tableau sont techniques. Chaque lot attend le feu vert de celui qui le précède. [Plan complet](../08_IMPLEMENTATION/PLAN.md).
