# Lot 05 · Catalogue et filtres

## 1. Mission
Reproduire la page 7 et ses états en gardant la logique de recherche et l’URL.

## 2. Prérequis
Attendre la validation du kit et des lots 02, 03. Arbre propre, Node 24, Chromium Playwright 1.56.1, services jetables selon le README. Vérifier le kit avec python3 LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_v32.py.

## 3. Branche et SHA de référence
Audit sur origin/main à e42cc6ffa69bba6c1cc5c36333adede531d6d11f. Faire git fetch origin, relever le dernier SHA de la base de travail approuvée contenant le handoff et les lots requis, puis vérifier git merge-base --is-ancestor e42cc6ffa69bba6c1cc5c36333adede531d6d11f HEAD. Si la base a bougé, relever le diff et requalifier chemins, tests et preuves avant intervention.

## 4. Documents à lire depuis la racine
- LOKASYON_PEYI_DESIGN_HANDOFF/README.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/DECISIONS_ET_SOURCES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS_V3.2/CATALOGUE.md
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/asset-manifest.json
- LOKASYON_PEYI_DESIGN_HANDOFF/07_VALIDATION/RECETTE.md

## 5. Références visuelles exactes
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Desktop.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Mobile.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Mobile_Tiroir_Filtres.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Chargement.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Sans_Resultat.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Indisponible.png

## 6. Code vérifié au SHA d’audit
- client/pages/search-results.js
- client/pages/search-state.js
- client/pages/vehicle-card.js
- client/pages/vehicle-media.js
- client/styles/client.css

## 7. Fonctionnalités à conserver
Édition du bandeau, carte simulée, tri prix/note, tags, dates et horaires, réinitialisation et retour fiche.

## 8. Modifications autorisées
Limiter le diff au code désigné, styles associés et tests directement touchés. Consigner toute extension nécessaire avant intervention.

## 9. Modifications interdites
Changer seed, API, logique métier, permissions, stack ou périmètre de la PR. Affaiblir une assertion de régression. Les tests d’identité de v1 restent applicables.

## 10. Résultat visuel
Titre Lora public, sidebar 242 px, synthèse, 3 cartes par ligne en desktop, une colonne mobile, états et tiroir avec un formulaire.

## 11. Comportements
Jouer les actions des sections 7 et 10 sur le seed intact, puis les états d’erreur, vide, retour et reprise concernés. Si les données de référence natives sont différentes, documenter le montage visuel isolé et vérifier à nouveau les vrais flux.

## 12. Responsive
1120+ 3 colonnes, 880–1119 2 colonnes et sidebar, tiroir sous 880, 1 colonne sous 600. Focus et responsive du tiroir.

## 13. Accessibilité
Contrôles nommés et tabulables, focus visible et non masqué, cibles 44 px, contraste WCAG 2.2 AA, reflow 320, erreurs annoncées et focus restauré à la fermeture des dialogues. Documenter les limites des essais.

## 14. Tests obligatoires
node --test tests/search.test.mjs et npx playwright test tests/browser/search.spec.js tests/browser/explorer.spec.js tests/browser/vehicle.spec.js tests/browser/visual-qa.spec.js. Exécuter aussi npm run check, npm test et le vérificateur du kit. Adapter seulement les attentes visuelles que le lot modifie volontairement.

## 15. Critères d’acceptation
Restitution exacte de l’URL après filtre/vue/tri/période. Captures nominales, tiroir et états distincts. Aucun P0/P1 ouvert dans le lot. Attendre le feu vert avant le lot suivant.

## 16. Risques
Flags UI transmis à l’API, données effacées, double formulaire, titre métier touché.

## 17. Git et PR
Créer v32/lot-05 sur la base vérifiée. Ouvrir une PR bornée avec cas de test et preuves fictives expurgées. Laisser la fusion au mainteneur.

## 18. Rapport de fin
Base SHA, branche, commit et PR, fichiers modifiés, décisions, commandes et résultats, paires de captures, écarts et priorités, points non vérifiés, verdict et dépendances.
