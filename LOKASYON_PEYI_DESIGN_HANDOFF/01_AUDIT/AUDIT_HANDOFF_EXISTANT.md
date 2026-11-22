# Audit du handoff existant

Base 4338f5f. Le dossier contient 137 chemins versionnés. Le kit conserve 133 chemins octet pour octet et actualise le README, AGENTS.md, l’index des anciens lots et le manifeste. Aucun chemin historique n’est déplacé ou supprimé.

- Les 10 anciens prompts restent consultables dans 06_CODEX_PROMPTS. L’index les signale comme historique; la campagne actuelle commence dans 07_CODEX_PROMPTS.
- tests/vehicle.test.mjs demande les sources du défaut/détails v1 ainsi que le manifeste et les variantes exactes dans 04_VISUAL_REFERENCES. Ces objets ne bougent pas. Le lien de l’illustration de catalogue vide reste valide.
- La CI invoque tools/verify_v32.py. Le script conserve sa logique et valide le manifeste complet, les liens et les données d’origine. tools/verify_extension.py vérifie en plus routes, lots, planches, baseline et assets d’exécution.
- 01_AUDIT_EXISTANT, 02_FONDATIONS_V3.2, 05_SCREEN_SPECS_V3.2, 07_VALIDATION et 08_IMPLEMENTATION gardent les références de la campagne publique. Les références actives et les arbitrages figurent dans le README et 00_SOURCE_OF_TRUTH.

[Inventaire exhaustif CSV](INVENTAIRE_HANDOFF_EXISTANT.csv) · [Migration](PLAN_MIGRATION.md)
