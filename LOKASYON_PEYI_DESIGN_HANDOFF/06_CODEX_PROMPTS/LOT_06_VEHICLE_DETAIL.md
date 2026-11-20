# Lot 06 · Fiche, galerie et demande

## 1. Mission
Reproduire la fiche du PDF page 8 dans le parcours existant.

## 2. Prérequis
Attendre la validation du kit et des lots 02, 05. Arbre propre, Node 24, Chromium Playwright 1.56.1, services jetables selon le README. Vérifier le kit avec python3 LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_v32.py.

## 3. Branche et SHA de référence
Audit sur origin/main à e42cc6ffa69bba6c1cc5c36333adede531d6d11f. Faire git fetch origin, relever le dernier SHA de la base de travail approuvée contenant le handoff et les lots requis, puis vérifier git merge-base --is-ancestor e42cc6ffa69bba6c1cc5c36333adede531d6d11f HEAD. Si la base a bougé, relever le diff et requalifier chemins, tests et preuves avant intervention.

## 4. Documents à lire depuis la racine
- LOKASYON_PEYI_DESIGN_HANDOFF/README.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/DECISIONS_ET_SOURCES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS_V3.2/FICHE.md
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS_V3.2/CATALOGUE.md
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/ASSET_MAPPING.md
- LOKASYON_PEYI_DESIGN_HANDOFF/07_VALIDATION/RECETTE.md

## 5. Références visuelles exactes
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Fiche_Desktop.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Fiche_Mobile.png
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/maquettes/Catalogue_Desktop.png

## 6. Code vérifié au SHA d’audit
- client/pages/vehicle-detail.js
- client/pages/vehicle-media.js
- client/pages/vehicle-presentation.js
- client/pages/search-state.js
- client/pages/booking-state.js
- client/styles/client.css

## 7. Fonctionnalités à conserver
Prix réel du mock, libellé démo, cohérence galerie par modèle, défauts déclarés, éligibilité et demande, dates et retour.

## 8. Modifications autorisées
Limiter le diff au code désigné, styles associés et tests directement touchés. Consigner toute extension nécessaire avant intervention.

## 9. Modifications interdites
Changer seed, API, logique métier, permissions, stack ou périmètre de la PR. Affaiblir une assertion de régression. Les tests d’identité de v1 restent applicables.

## 10. Résultat visuel
Galerie 1+2, devis 325 px bureau, état avant conditions, contexte, prix journalier, demande existante. Les données de comparaison peuvent être simulées uniquement par test.

## 11. Comportements
Jouer les actions des sections 7 et 10 sur le seed intact, puis les états d’erreur, vide, retour et reprise concernés. Si les données de référence natives sont différentes, documenter le montage visuel isolé et vérifier à nouveau les vrais flux.

## 12. Responsive
Grande photo + vignettes, état avant formulaire mobile et DOM. Aucune action fixe masquante, vérifier portrait et paysage.

## 13. Accessibilité
Contrôles nommés et tabulables, focus visible et non masqué, cibles 44 px, contraste WCAG 2.2 AA, reflow 320, erreurs annoncées et focus restauré à la fermeture des dialogues. Documenter les limites des essais.

## 14. Tests obligatoires
node --test tests/vehicle.test.mjs tests/booking.test.mjs et npx playwright test tests/browser/vehicle.spec.js tests/browser/booking.spec.js tests/browser/search.spec.js tests/browser/maquette.spec.js. Exécuter aussi npm run check, npm test et le vérificateur du kit. Adapter seulement les attentes visuelles que le lot modifie volontairement.

## 15. Critères d’acceptation
Preuves v3, v1 et véhicule sans photo. Demande selon profil, modal, focus, retour exact et aucun faux défaut. Aucun P0/P1 ouvert dans le lot. Attendre le feu vert avant le lot suivant.

## 16. Risques
Période perdue, photo composite, fausse preuve de dommage ou mauvais passage en mode propriétaire.

## 17. Git et PR
Créer v32/lot-06 sur la base vérifiée. Ouvrir une PR bornée avec cas de test et preuves fictives expurgées. Laisser la fusion au mainteneur.

## 18. Rapport de fin
Base SHA, branche, commit et PR, fichiers modifiés, décisions, commandes et résultats, paires de captures, écarts et priorités, points non vérifiés, verdict et dépendances.
