# Lot 09 · Recette finale et conformité

## 1. Mission
Comparer le rendu à la V3.2, rejouer les rôles et établir le verdict.

## 2. Prérequis
Attendre la validation du kit et des lots 08. Arbre propre, Node 24, Chromium Playwright 1.56.1, services jetables selon le README. Vérifier le kit avec python3 LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_v32.py.

## 3. Branche et SHA de référence
Audit sur origin/main à e42cc6ffa69bba6c1cc5c36333adede531d6d11f. Faire git fetch origin, relever le dernier SHA de la base de travail approuvée contenant le handoff et les lots requis, puis vérifier git merge-base --is-ancestor e42cc6ffa69bba6c1cc5c36333adede531d6d11f HEAD. Si la base a bougé, relever le diff et requalifier chemins, tests et preuves avant intervention.

## 4. Documents à lire depuis la racine
- LOKASYON_PEYI_DESIGN_HANDOFF/README.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/DECISIONS_ET_SOURCES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/07_VALIDATION/RECETTE.md
- LOKASYON_PEYI_DESIGN_HANDOFF/07_VALIDATION/MATRICE_VISUELLE.csv
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/ASSET_MAPPING.md
- LOKASYON_PEYI_DESIGN_HANDOFF/08_IMPLEMENTATION/PLAN.md

## 5. Références visuelles exactes
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Accueil_Desktop.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Accueil_Mobile.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Desktop.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Mobile_Tiroir_Filtres.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Fiche_Desktop.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Fiche_Mobile.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Verre_Fond_Opaque.png

## 6. Code vérifié au SHA d’audit
- .github/workflows/ci.yml
- playwright.config.js
- playwright.audit.config.js
- scripts/audit-evidence.mjs
- scripts/sanitize-evidence.py
- tests/browser/visual-qa.spec.js
- tests/audit-browser/profiles.spec.js

## 7. Fonctionnalités à conserver
Parcours de bout en bout, contrats, permissions et preuves expurgées.

## 8. Modifications autorisées
Limiter le diff au code désigné, styles associés et tests directement touchés. Consigner toute extension nécessaire avant intervention.

## 9. Modifications interdites
Changer seed, API, logique métier, permissions, stack ou périmètre de la PR. Affaiblir une assertion de régression. Les tests d’identité de v1 restent applicables.

## 10. Résultat visuel
Annoter les captures alignées, mesurer contraste, boîte, textes, interactions et score par viewport. Rapporter chaque non-vérification.

## 11. Comportements
Jouer les actions des sections 7 et 10 sur le seed intact, puis les états d’erreur, vide, retour et reprise concernés. Si les données de référence natives sont différentes, documenter le montage visuel isolé et vérifier à nouveau les vrais flux.

## 12. Responsive
320, 375, 390, 430, 768, 1024, 1280, 1440. Clavier et zoom, puis lecteur d’écran et appareils si accessibles.

## 13. Accessibilité
Contrôles nommés et tabulables, focus visible et non masqué, cibles 44 px, contraste WCAG 2.2 AA, reflow 320, erreurs annoncées et focus restauré à la fermeture des dialogues. Documenter les limites des essais.

## 14. Tests obligatoires
Smoke, Python, suites Playwright standard et audit 01–04, campagne étendue si possible, parcours de demande à clôture, permissions et revue manuelle. Exécuter aussi npm run check, npm test et le vérificateur du kit. Adapter seulement les attentes visuelles que le lot modifie volontairement.

## 15. Critères d’acceptation
Score cible ≥95/100 sur écrans approuvés, zéro P0/P1, différences mineures approuvées et état des points non vérifiés. Aucun P0/P1 ouvert dans le lot. Attendre le feu vert avant le lot suivant.

## 16. Risques
Diff calculé avec données divergentes, faux score de fidélité, régression multi-rôle, photo sans crédit.

## 17. Git et PR
Créer v32/lot-09 sur la base vérifiée. Ouvrir une PR bornée avec cas de test et preuves fictives expurgées. Laisser la fusion au mainteneur.

## 18. Rapport de fin
Base SHA, branche, commit et PR, fichiers modifiés, décisions, commandes et résultats, paires de captures, écarts et priorités, points non vérifiés, verdict et dépendances.
