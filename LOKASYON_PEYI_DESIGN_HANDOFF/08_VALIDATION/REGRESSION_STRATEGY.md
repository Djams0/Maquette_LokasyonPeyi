# Commandes et non-régression

~~~text
npm run check
npm test
python -m unittest discover -s tests -p "test_*.py"
npm run smoke
npm install --no-save --package-lock=false --no-audit --no-fund @playwright/test@1.56.1
npx playwright install chromium
npx playwright test
npx playwright test --config=playwright.audit.config.js --grep "UI-AUD-0[1-4]"
npx playwright test --config=playwright.audit.config.js
~~~

Le smoke et la suite standard utilisent les services client/admin/API en cours. Les profils audit contrôlent leurs instances. Sous PowerShell, définir DATA_FILE vers un nouveau chemin temporaire avant npm start. Garder cette instance et le repo de revue séparés des données de travail. Le cycle complet vaut demande → acceptation → paiement fictif → caution → constats/remise → retour → récupération → clôture. Vérifier explicitement échec, double action, réseau, URL et tiers. Consulter .github/workflows/ci.yml pour Compose et les étapes en mode strict ou souple.
