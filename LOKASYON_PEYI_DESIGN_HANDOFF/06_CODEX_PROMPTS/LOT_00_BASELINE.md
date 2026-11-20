# Lot 00 · Baseline applicative

## 1. Mission
Établir une référence reproductible pour la maquette actuelle.

## 2. Prérequis
Le kit complet est installé et validé. Relever le SHA qui l’installe. Arbre propre, Node 24, Chromium Playwright 1.56.1, services jetables selon le README. Vérifier le kit avec python3 LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_v32.py.

## 3. Branche et SHA de référence
Audit sur origin/main à e42cc6ffa69bba6c1cc5c36333adede531d6d11f. Faire git fetch origin, relever le dernier SHA de la base de travail approuvée contenant le handoff et les lots requis, puis vérifier git merge-base --is-ancestor e42cc6ffa69bba6c1cc5c36333adede531d6d11f HEAD. Si la base a bougé, relever le diff et requalifier chemins, tests et preuves avant intervention.

## 4. Documents à lire depuis la racine
- LOKASYON_PEYI_DESIGN_HANDOFF/README.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/DECISIONS_ET_SOURCES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/01_AUDIT_EXISTANT/ETAT_REEL_ET_ECARTS.md
- LOKASYON_PEYI_DESIGN_HANDOFF/01_AUDIT_EXISTANT/INVENTAIRE_FONCTIONNEL.md
- LOKASYON_PEYI_DESIGN_HANDOFF/07_VALIDATION/RECETTE.md

## 5. Références visuelles exactes
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Accueil_Desktop_Premier_Ecran.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Accueil_Mobile_Premier_Ecran.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Desktop.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Fiche_Mobile.png

## 6. Code vérifié au SHA d’audit
- README.md
- scripts/dev.mjs
- scripts/local-smoke.mjs
- scripts/audit-run.mjs
- playwright.config.js
- playwright.audit.config.js
- .github/workflows/ci.yml
- api/access.mjs

## 7. Fonctionnalités à conserver
Seed, habilitations et trois services. Photographier /, /search et /vehicle/v3. Vérifier v1, profils et accès admin refusé.

## 8. Modifications autorisées
Rapport de baseline et preuves dans un dossier de travail ignoré ou un artefact.

## 9. Modifications interdites
Tout changement applicatif, données, workflow ou handoff.

## 10. Résultat visuel
Journal, inventaire d’écarts, SHA et preuves. Aucune modification visuelle. Comparer le résultat aux cibles pour quantifier le départ.

## 11. Comportements
Jouer les actions des sections 7 et 10 sur le seed intact, puis les états d’erreur, vide, retour et reprise concernés. Si les données de référence natives sont différentes, documenter le montage visuel isolé et vérifier à nouveau les vrais flux.

## 12. Responsive
1440×900, 390×844, une preuve à 320 et inventaire des largeurs intermédiaires.

## 13. Accessibilité
Contrôles nommés et tabulables, focus visible et non masqué, cibles 44 px, contraste WCAG 2.2 AA, reflow 320, erreurs annoncées et focus restauré à la fermeture des dialogues. Documenter les limites des essais.

## 14. Tests obligatoires
npm run smoke et Python et npx playwright test et npx playwright test --config=playwright.audit.config.js --grep UI-AUD-0[1-4]. Exécuter aussi npm run check, npm test et le vérificateur du kit. Adapter seulement les attentes visuelles que le lot modifie volontairement.

## 15. Critères d’acceptation
Diff applicatif vide et tests de base passants. Baseline reproductible et permissions observées. Aucun P0/P1 ouvert dans le lot. Attendre le feu vert avant le lot suivant.

## 16. Risques
Seed persistant, service lancé sur le mauvais port, comparaison de deux datasets distincts.

## 17. Git et PR
Créer v32/lot-00 sur la base vérifiée. Ouvrir une PR bornée avec cas de test et preuves fictives expurgées. Laisser la fusion au mainteneur.

## 18. Rapport de fin
Base SHA, branche, commit et PR, fichiers modifiés, décisions, commandes et résultats, paires de captures, écarts et priorités, points non vérifiés, verdict et dépendances.
