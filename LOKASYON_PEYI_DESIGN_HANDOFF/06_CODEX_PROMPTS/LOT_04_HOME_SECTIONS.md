# Lot 04 · Accueil · sections

## 1. Mission
Restituer les huit sections de la page 6 et des PNG pleine page.

## 2. Prérequis
Attendre la validation du kit et des lots 03. Arbre propre, Node 24, Chromium Playwright 1.56.1, services jetables selon le README. Vérifier le kit avec python3 LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_v32.py.

## 3. Branche et SHA de référence
Audit sur origin/main à e42cc6ffa69bba6c1cc5c36333adede531d6d11f. Faire git fetch origin, relever le dernier SHA de la base de travail approuvée contenant le handoff et les lots requis, puis vérifier git merge-base --is-ancestor e42cc6ffa69bba6c1cc5c36333adede531d6d11f HEAD. Si la base a bougé, relever le diff et requalifier chemins, tests et preuves avant intervention.

## 4. Documents à lire depuis la racine
- LOKASYON_PEYI_DESIGN_HANDOFF/README.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/DECISIONS_ET_SOURCES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS_V3.2/ACCUEIL.md
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS_V3.2/NAVIGATION.md
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/ASSET_MAPPING.md
- LOKASYON_PEYI_DESIGN_HANDOFF/07_VALIDATION/RECETTE.md

## 5. Références visuelles exactes
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Accueil_Desktop.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Accueil_Mobile.png

## 6. Code vérifié au SHA d’audit
- client/pages/catalog.js
- client/pages/vehicle-card.js
- client/pages/search-state.js
- client/pages/support.js
- client/shell.js
- client/styles/client.css

## 7. Fonctionnalités à conserver
Routes et cartes existantes, recherche récente, retry, règles d’étapes et CTA propriétaire par capacité.

## 8. Modifications autorisées
Limiter le diff au code désigné, styles associés et tests directement touchés. Consigner toute extension nécessaire avant intervention.

## 9. Modifications interdites
Changer seed, API, logique métier, permissions, stack ou périmètre de la PR. Affaiblir une assertion de régression. Les tests d’identité de v1 restent applicables.

## 10. Résultat visuel
4 besoins, 3 cartes dynamiques, 5 étapes, panorama Deshaies et triptyque forêt/côte/bourg, transparence, propriétaire, FAQ, footer.

## 11. Comportements
Jouer les actions des sections 7 et 10 sur le seed intact, puis les états d’erreur, vide, retour et reprise concernés. Si les données de référence natives sont différentes, documenter le montage visuel isolé et vérifier à nouveau les vrais flux.

## 12. Responsive
4 raccourcis bureau, 2×2 mobile, cartes 3/1 colonnes. Les grilles éditoriales s’empilent. Les ancres ne sont pas recouvertes.

## 13. Accessibilité
Contrôles nommés et tabulables, focus visible et non masqué, cibles 44 px, contraste WCAG 2.2 AA, reflow 320, erreurs annoncées et focus restauré à la fermeture des dialogues. Documenter les limites des essais.

## 14. Tests obligatoires
npx playwright test tests/browser/explorer.spec.js tests/browser/search.spec.js tests/browser/navigation.spec.js tests/browser/maquette.spec.js. Exécuter aussi npm run check, npm test et le vérificateur du kit. Adapter seulement les attentes visuelles que le lot modifie volontairement.

## 15. Critères d’acceptation
Captures pleine page. Tous les liens ouvrent une destination réelle. Les états vide/erreur et le cas aéroport sont vérifiés. Aucun P0/P1 ouvert dans le lot. Attendre le feu vert avant le lot suivant.

## 16. Risques
FAQ contradictoire, pseudo-lien légal, faux service aéroport, chargement dégradé.

## 17. Git et PR
Créer v32/lot-04 sur la base vérifiée. Ouvrir une PR bornée avec cas de test et preuves fictives expurgées. Laisser la fusion au mainteneur.

## 18. Rapport de fin
Base SHA, branche, commit et PR, fichiers modifiés, décisions, commandes et résultats, paires de captures, écarts et priorités, points non vérifiés, verdict et dépendances.
