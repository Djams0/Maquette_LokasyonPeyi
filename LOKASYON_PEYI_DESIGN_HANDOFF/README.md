# Lokasyon Péyi · Design Handoff Kit

**Péyi contemporain · 13 novembre 2026 · cible Maquette_LokasyonPeyi**

Les écrans validés sont fournis en PNG, avec les fichiers de tokens, les assets de démonstration et les prompts par lot. Les deux études et le prototype de finition accompagnent les captures.

## Démarrer avec Codex

1. Extraire le ZIP en gardant le dossier `LOKASYON_PEYI_DESIGN_HANDOFF`. Le placer à côté du checkout de la maquette ou lui donner un chemin accessible.
2. Ouvrir [LOT_00_BASELINE.md](05_CODEX_PROMPTS/LOT_00_BASELINE.md). Donner à Codex les chemins absolus du kit et du checkout. Demander ce seul lot sur `peyi/lot-00-baseline`, depuis `origin/main` actualisé de la maquette.
3. Transmettre l’archive entière ou son dossier extrait. Les deux PDF, la finition, les PNG avant/cible, la stratégie et le vérificateur sont référencés dans le premier prompt.
4. Examiner la baseline, puis envoyer [les lots dans l’ordre](05_CODEX_PROMPTS/00_README.md). Le lot 01 commence les changements visuels.

> Le dépôt cible est le checkout Maquette_LokasyonPeyi au chemin absolu que je joins. Le kit est extrait au second chemin indiqué. Lis le fichier 05_CODEX_PROMPTS/LOT_00_BASELINE.md et exécute ce seul lot sur peyi/lot-00-baseline depuis le dernier origin/main. L’application reste en lecture pendant cette baseline.

## Ressources

- [Direction](00_DECISIONS/DESIGN_DIRECTION.md) · [Périmètre](00_DECISIONS/PRODUCT_CONSTRAINTS.md) · [Arbitrages](00_DECISIONS/OPEN_DECISIONS.md).
- [Aperçu comparatif](01_REFERENCES/Comparatif_Apercu.png) · [Index des écrans](04_SCREEN_SPECS/README.md). PNG cibles 390 × 844 CSS exportés à 2×. [Finition](01_REFERENCES/finition/01_SPECIFICATION_CODEX.md) pour les comportements et [prototype](01_REFERENCES/finition/Prototype_Peyi_Contemporain.html) à ouvrir en local.
- [Design system](02_DESIGN_SYSTEM/DESIGN_SYSTEM.md) · [CSS](02_DESIGN_SYSTEM/tokens.css) · [JSON](02_DESIGN_SYSTEM/design-tokens.json) · [Composants](02_DESIGN_SYSTEM/COMPONENT_SPECS.md) · [Mesures V2](02_DESIGN_SYSTEM/GEOMETRIE_V2.md).
- [Manifeste assets](03_ASSETS/ASSET_MANIFEST.md) et [données machine](03_ASSETS/asset-manifest.json). Photographies synthétiques réservées à la démonstration. Rendu fixe optionnel.
- [Baseline observée](06_VALIDATION/BASELINE_OBSERVEE.md) · [Critères](06_VALIDATION/ACCEPTANCE_CRITERIA.md) · [Matrice](06_VALIDATION/VISUAL_TEST_MATRIX.md) · [Ordre](06_VALIDATION/IMPLEMENTATION_ORDER.md).

Les PNG V2 donnent la composition, la finition précise les interactions, et la maquette fournit ses données et transitions. Le PNG 14 archive l’autre direction.

## Vérifier le kit

Exécuter `python3 tools/verify_handoff.py` depuis le dossier extrait. Le script vérifie les fichiers, les liens locaux, les sections A à L des prompts, les tokens et les contraintes de base des SVG.
