# Outils

Depuis la racine après installation du kit, utiliser Python 3 puis Node 24 et Playwright 1.56.1.

~~~text
python LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_v32.py
python LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_extension.py
node LOKASYON_PEYI_DESIGN_HANDOFF/tools/capture_extension.mjs http://127.0.0.1:8080 test-results/extension protected
~~~

Le capteur prend une instance locale et jetable, avec mode protected, client ou all. Les captures de premier écran fixent navigateur, viewport, heure, profil et DPR. Les cibles de B doivent être lues via le PDF ou ses rendus. Pour comparer deux captures PNG identiques en dimensions, installer Pillow pour compare_v32.py, puis exécuter ce script avec le PNG de référence, le PNG candidat et un répertoire de sortie. Produire une preuve par écran et taille. Le [guide d’installation](../INSTALLATION.md) explique les deux modes et le retour arrière.

## Correction V3.2 · contrôles reproductibles

Depuis la racine du handoff, `python3 tools/verify_v32.py` vérifie aussi la série active. `python3 tools/verify_extension.py` vérifie les ressources et référentiels historiques de l’extension. `python3 tools/verify_correction.py` contrôle séparément la complétude des lots, des routes, des planches et des résultats attendus. Après modification du kit, recalculer tailles et SHA-256 du manifeste avant de relancer les vérificateurs.

Depuis la racine du dépôt, installer si nécessaire `npm install --no-save --package-lock=false @playwright/test@1.56.1` puis `npx playwright install chromium`. Pour chaque comparaison publique, lancer `node scripts/historical-run.mjs` dans le checkout du SHA à capturer. Le script crée des données jetables. Utiliser le même capteur aux deux SHA et capturer successivement si les services partagent leur port.

```bash
kit=LOKASYON_PEYI_DESIGN_HANDOFF
node "$kit/tools/capture_extension.mjs" http://127.0.0.1:8080 test-results/protection-avant protected
# Arrêter la première instance et démarrer le candidat avec la même commande historique.
node "$kit/tools/capture_extension.mjs" http://127.0.0.1:8080 test-results/protection-apres protected
for source in test-results/protection-avant/protected-*.png; do
  file=${source##*/}
  python3 "$kit/tools/compare_v32.py" "$source" "test-results/protection-apres/$file" "test-results/protection-diffs/${file%.png}"
done
npx playwright test tests/browser/search.spec.js --grep 'tiroir unique' --repeat-each=8
```

Rejouer le test du tiroir sur chaque SHA; examiner aussi `navigation.spec.js`, `vehicle.spec.js` et `visual-qa.spec.js` pour les variantes et interactions protégées. Pour les états internes du lot, lancer `npm run audit:start`. Le mode `client` de `capture_extension.mjs` facilite les vues nominales. Compléter ses scènes avec les états et les préconditions du prompt, les vérifications de clavier et les variantes à rôle. Les pages des PDF et les vignettes B-XX sont des références de composition. Comparer leurs zones homologues, en précisant toute adaptation d’échelle ou différence de données.

Pour la revue, exporter les captures, mesures, résultats et notes utiles après expurgation avec `scripts/sanitize-evidence.py`. Dans la PR, vérifier les liens du dossier et des preuves individuelles. Utiliser [le modèle de revue](../09_IMPLEMENTATION/REVIEW_TEMPLATE.md).
