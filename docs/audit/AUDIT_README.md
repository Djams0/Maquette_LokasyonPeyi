# Démarrer l’audit avec Work

Cet environnement est une maquette fictive, sans authentification réelle. Ne pas l’exposer publiquement. Le lot prépare l’audit ; il ne constitue pas l’audit UX/UI définitif.

1. Utiliser Node 24. Arrêter les services locaux qui occupent 3001, 8080 et 8081. Si Docker tourne, `docker compose down` conserve son volume. Ne pas supprimer de volume.
2. Lancer `npm run audit:start`. Un nouveau dossier `lp-audit-*` sous le répertoire temporaire système contient la fixture `audit-v1`. Le chemin est annoncé ; aucun fichier existant n’est écrasé. Garder le terminal ouvert.
3. Client : <http://127.0.0.1:8080/demo/audit>. Filtrer locataires/propriétaires, lire leur état puis choisir un compte. `/demo` et `/login` conservent aussi les neuf profils historiques.
4. Admin : <http://127.0.0.1:8081/login>. Les dix agents sont sélectionnables ; `audit-a10`, suspendu, doit être refusé. Les cookies client/admin restent distincts.
5. Suivre [PERSONAS](PERSONAS.md), puis [SCENARIOS](SCENARIOS.md) et [TEST_MATRIX](TEST_MATRIX.md). Choisir le profil exact indiqué dans l’action. Les autres comptes ne donnent aucun droit implicite.
6. Pour recommencer, arrêter la campagne puis relancer `npm run audit:start` : nouvelle cible, sessions neuves, données initiales. Le dossier précédent reste intact. Aucun endpoint de reset n’existe. Ne pas lancer deux campagnes sur les mêmes ports.

Le seed historique reste celui de `npm start` et Docker. Il n’est pas enrichi silencieusement : ses tests supposent cinq annonces publiques. Les données persistantes historiques ne sont pas migrées ni réinitialisées. Le lancement audit ignore un éventuel `DATA_FILE` fourni par l’utilisateur et crée sa propre cible.

## Vérifications

Sous PowerShell dont la politique bloque `npm.ps1`, employer `npm.cmd` et `npx.cmd`.

```bash
npm run check
npm test
node scripts/local-smoke.mjs
docker compose config
# Seulement si le moteur Docker est disponible :
docker compose up --build -d --wait
npm run smoke
npm install --no-save --package-lock=false @playwright/test@1.56.1
npx playwright install chromium
npx playwright test
npm run test:audit
node scripts/audit-evidence.mjs
python scripts/sanitize-evidence.py
```

`npx playwright test` exige les services démarrés avec le seed historique **propre** ; il compose des scénarios séquentiels sur cette instance. Ne pas le lancer sur une campagne manuelle à préserver. `npm run test:audit` lance ses propres API en mémoire et proxys sur des ports libres, avec une fixture neuve par test ; aucun service préexistant n’est nécessaire.

Pour une recette historique jetable : arrêter les services, puis lancer `node scripts/historical-run.mjs`. Cette commande crée aussi une cible neuve sans effacer `data/mock.json`. Arrêter ce terminal après les tests.

## Preuves et suite approfondie

Rapport historique : `playwright-report/index.html` ; résultats JSON : `test-results/results.json`. Rapport audit : `audit-results/html/index.html` ; JSON : `audit-results/results.json` ; inventaire : `audit-results/manifest.json`. Les résultats réels et limites sont dans [REGRESSION_REPORT](REGRESSION_REPORT.md).

Captures, vidéos et traces sont retenues sur échec. Pour garder les traces d’une campagne audit réussie, définir `AUDIT_TRACE=1` avant `npm run test:audit` (PowerShell : `$env:AUDIT_TRACE='1'`). **Exécuter l’expurgation avant toute ouverture partagée ou publication** : Playwright enregistre normalement des cookies dans ses traces. Le workflow l’effectue avant l’upload. Ne pas partager les fichiers bruts, ni un état de connexion sauvegardé. Aucun storageState n’est exporté par les tests.

La CI PR garde tous les tests historiques et ajoute les quatre profils navigateur essentiels. `workflow_dispatch` avec `extended=true` ajoute les sept largeurs de l’atelier et conserve les traces. Firefox/WebKit : installer explicitement le navigateur avec la même version Playwright, puis définir `AUDIT_BROWSER=firefox` ou `webkit` ; ces moteurs ne sont pas requis par la CI principale et n’ont pas été validés ici.

Restrictions : aucune pièce réelle, aucun PSP, aucune assurance ou commission déduite des exemples. Les contrôles manuels de clavier, zoom, lecteur d’écran et fraude restent à exécuter. Les ressources créées pendant l’audit gardent les affectations historiques : Élie/Ana assurent leur contrôle, pas tous les nouveaux agents. Voir [environnement](TEST_ENVIRONMENT.md).
