# Stratégie de non-régression

Prendre des captures sur un état reproductible avant chaque lot et exécuter les suites de référence sur cible jetable. Le seed historique et la fixture audit ont des responsabilités distinctes. Utiliser Node 24 et Playwright 1.56.1, avec la configuration du dépôt. Relire `docs/audit/AUDIT_README.md` et le workflow.

```bash
npm run check
npm test
python -m unittest discover -s tests -p 'test_*.py'
node scripts/local-smoke.mjs
npm install --no-save --package-lock=false @playwright/test@1.56.1
npx playwright install chromium
```

Le smoke emploie les mêmes ports que la suite historique. Le terminer avant celle-ci. Dans un terminal, lancer `node scripts/historical-run.mjs` et vérifier les trois services. Dans un second, lancer `npm run test:browser`. Arrêter la cible historique après collecte. `npm run test:audit` crée ses propres instances sur ports libres. L’atelier manuel `npm run audit:start` requiert 8080/8081/3001 libres. Exécuter les contrôles Compose du workflow quand Docker est disponible sur cible de test. Préserver les volumes existants.

| Contrôle | À exercer |
|---|---|
| Accès | Visiteur, locataire, propriétaire et rôles Admin séparés. Agent limité et suspendu. URLs directes et accès croisés refusés. |
| Fonctionnel | Recherche, demande, paiement, caution, constats, remise, retour, avis, reçu, messages, brouillon, publication, calendrier, permissions financières. |
| Visuel | Paire de captures pour le même état, navigateur, viewport, locale, horloge et données. Mesures de géométrie. Zoom et focus non recouverts. |
| Sécurité des preuves | Avant partage, inventaire `node scripts/audit-evidence.mjs` puis `python scripts/sanitize-evidence.py`. Garder cookies, traces brutes et storageState hors du kit et des PR. |
| Livraison | Exécution consignée, cas non testés déclarés, patch restreint, PR de revue lorsque publiée, fusion manuelle. |

Préserver l’intention et les assertions historiques. Un sélecteur peut suivre un changement volontaire de libellé. Chaque écart sur un comportement modifié reçoit un scénario dédié. Consigner les causes d’échecs d’environnement et relancer sur une instance isolée. Un succès local ne vaut pas CI de la PR.
