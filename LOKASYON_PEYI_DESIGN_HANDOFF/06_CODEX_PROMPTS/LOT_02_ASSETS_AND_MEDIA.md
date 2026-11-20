# Lot 02 · Assets et crédits

## 1. Mission
Installer les dérivés V3.2 runtime et le mapping explicite par véhicule.

## 2. Prérequis
Attendre la validation du kit et des lots 01. Arbre propre, Node 24, Chromium Playwright 1.56.1, services jetables selon le README. Vérifier le kit avec python3 LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_v32.py.

## 3. Branche et SHA de référence
Audit sur origin/main à e42cc6ffa69bba6c1cc5c36333adede531d6d11f. Faire git fetch origin, relever le dernier SHA de la base de travail approuvée contenant le handoff et les lots requis, puis vérifier git merge-base --is-ancestor e42cc6ffa69bba6c1cc5c36333adede531d6d11f HEAD. Si la base a bougé, relever le diff et requalifier chemins, tests et preuves avant intervention.

## 4. Documents à lire depuis la racine
- LOKASYON_PEYI_DESIGN_HANDOFF/README.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/DECISIONS_ET_SOURCES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/ASSET_MAPPING.md
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/asset-manifest.json
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/LICENSES_AND_CREDITS.md

## 5. Références visuelles exactes
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Accueil_Desktop_Premier_Ecran.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Desktop.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Fiche_Desktop.png

## 6. Code vérifié au SHA d’audit
- assets/README.md
- assets/vehicles/manifest.json
- assets/vehicles/detail-manifest.json
- client/pages/vehicle-media.js
- client/pages/vehicle-card.js
- tests/vehicle.test.mjs

## 7. Fonctionnalités à conserver
Huit médias historiques de v1 et leurs sources, photos propres aux annonces, défauts déclarés et fallbacks.

## 8. Modifications autorisées
Limiter le diff au code désigné, styles associés et tests directement touchés. Consigner toute extension nécessaire avant intervention.

## 9. Modifications interdites
Changer seed, API, logique métier, permissions, stack ou périmètre de la PR. Affaiblir une assertion de régression. Les tests d’identité de v1 restent applicables.

## 10. Résultat visuel
Copier les variantes avec cible dans assets/v32, ajouter les crédits accessibles, affecter par fixture/usage. Garder les séries indépendantes. Écarter habitacle 208 de la galerie nominale.

## 11. Comportements
Jouer les actions des sections 7 et 10 sur le seed intact, puis les états d’erreur, vide, retour et reprise concernés. Si les données de référence natives sont différentes, documenter le montage visuel isolé et vérifier à nouveau les vrais flux.

## 12. Responsive
Hero 720/1440/1920, cartes 480/1000 ou 1050 et galerie 420/900. Tester fallback, dimensions et ratios sur les largeurs cibles.

## 13. Accessibilité
Contrôles nommés et tabulables, focus visible et non masqué, cibles 44 px, contraste WCAG 2.2 AA, reflow 320, erreurs annoncées et focus restauré à la fermeture des dialogues. Documenter les limites des essais.

## 14. Tests obligatoires
node --test tests/explorer.test.mjs tests/vehicle.test.mjs et npx playwright test tests/browser/vehicle.spec.js tests/browser/explorer.spec.js. Exécuter aussi npm run check, npm test et le vérificateur du kit. Adapter seulement les attentes visuelles que le lot modifie volontairement.

## 15. Critères d’acceptation
Variantes et cibles vérifiées, manifeste et crédits complets, octets locaux, aucune photo d’un autre exemplaire présentée comme preuve. Aucun P0/P1 ouvert dans le lot. Attendre le feu vert avant le lot suivant.

## 16. Risques
Photo amalgamée à un défaut, mauvaise fixture, duplication, attribution manquante.

## 17. Git et PR
Créer v32/lot-02 sur la base vérifiée. Ouvrir une PR bornée avec cas de test et preuves fictives expurgées. Laisser la fusion au mainteneur.

## 18. Rapport de fin
Base SHA, branche, commit et PR, fichiers modifiés, décisions, commandes et résultats, paires de captures, écarts et priorités, points non vérifiés, verdict et dépendances.
