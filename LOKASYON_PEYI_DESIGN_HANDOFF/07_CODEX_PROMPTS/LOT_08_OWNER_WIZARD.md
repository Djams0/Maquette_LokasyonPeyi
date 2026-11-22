# Lot 08 · Assistant de publication et reprise

## 1. Rôle et mission
Agis comme ingénieur frontend natif et QA orienté produit. Présenter en quatre sections les neuf groupes existants. Garder les mécanismes locaux/serveur et préconditions de revue.

## 2. Résultat attendu
Neuf URL historiques, cinq vues et trois justificatifs, conflit explicite, sauvegarde après choix; une seule annonce pending malgré résultat perdu.

## 3. Conditions d’entrée
Kit vérifié, arbre propre et lots requis intégrés ou disponibles dans la base de revue validée. Exiger le GO humain du lot précédent. Dépendances techniques · 07.

## 4. SHA à vérifier
Référence auditée 4338f5f7ca252f4d4f02021ec47a226d0d2d6064. Faire git status et git fetch origin. Relever origin/main et le HEAD de la base de revue, puis git merge-base --is-ancestor 4338f5f7ca252f4d4f02021ec47a226d0d2d6064 HEAD. Si la branche de travail a avancé, examiner le diff depuis cette base et requalifier contrats et preuves avant d’agir.

## 5. Documents à ouvrir depuis la racine
- LOKASYON_PEYI_DESIGN_HANDOFF/CODEX_START_HERE.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/08_VALIDATION/PROTECTED_PAGES_TESTS.md
- LOKASYON_PEYI_DESIGN_HANDOFF/09_IMPLEMENTATION/REVIEW_TEMPLATE.md
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS/OWNER_WIZARD.md
- LOKASYON_PEYI_DESIGN_HANDOFF/02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md
- LOKASYON_PEYI_DESIGN_HANDOFF/06_FONCTIONNEL/ERROR_AND_RECOVERY_CASES.md

## 6. Références visuelles
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-23.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-39.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-40.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-41.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/protected_baseline/CAPTURE_MANIFEST.json

## 7. Fichiers du dépôt à examiner
- client/pages/wizard.js
- client/pages/owner-state.js
- client/pages/owner-workspace.js
- client/styles/client.css
- ui/components.js
- api/modules/vehicles.mjs
Les fichiers API listés servent à vérifier le contrat. Les tests de ce lot sont listés en section 18.

## 8. Composants à réutiliser
Lire les modules désignés et 02_DESIGN_SYSTEM/COMPONENTS.md. Composer les variantes sous une portée opérationnelle. Réutiliser les contrôles documentés et conserver les helpers d’état, de focus et les dialogues existants selon la route.

## 9. Données et API
Préfixe /api/v1 pour les chemins d’API. Aucune vraie donnée financière, pièce ou identité.
- /owner/vehicles/new · GET /me, GET/POST /owner/draft, POST /owner/vehicles · Quatre sections, neuf groupes, step historique; tampon local et envoi gelé

## 10. Comportements à préserver
/owner/vehicles/new · Propriétaire actif. Respecter l’URL, les données, les filtres, les brouillons, les règles par acteur et l’intégrité des écritures.

## 11. Modifications autorisées
Adapter visibilité, focus et hiérarchie. Laisser tampon, groupFields, ownerDraftErrors et corps/clé gelés au contrat courant.

## 12. Modifications interdites
Réécriture des trois routes protégées, des données de référence, de l’API, des rôles, des workflows et de l’administration. Aucune évolution C sans arbitrage.

## 13. Desktop
Stepper, statut de sauvegarde/dernière étape en tête, formulaire groupé et récap par secteur avant la soumission.

## 14. Mobile
Stepper lisible, liens vers incomplets, reprise/divergence au-dessus du formulaire, boutons accessibles au clavier et champs natifs.

## 15. États métier
Afficher les états observables du mock et l’acteur qui a le droit d’agir. Prévoir états vide, chargement, succès et attente séparés. Lire les spécifications de la route avant d’ajouter un libellé. Réutiliser l’action autorisée existante.

## 16. Erreurs et reprise
- /owner/vehicles/new · Divergence, brouillon vide, stockage indisponible, photo insuffisante, résultat incertain
Exercer la réponse tardive ou perdue quand elle s’applique. Préserver la saisie et ne reconnaître le succès qu’après réponse ou vérification autorisée.

## 17. Accessibilité
Vérifier labels et commandes au clavier, focus visible et restauré, statut annoncé, reflow 320, taille de texte 200 %, cibles de projet 44 px, contraste AA et absence de commande couverte. Noter si lecteur d’écran et clavier virtuel non vérifiés.

## 18. Tests
Depuis la racine, exécuter npm run check, npm test, python -m unittest discover -s tests -p "test_*.py" et npm run smoke après démarrage jetable. Valider le handoff avec tools/verify_v32.py et tools/verify_extension.py dans son dossier. Lancer npx playwright test tests/browser/owner.spec.js tests/browser/maquette.spec.js tests/browser/navigation.spec.js Comparer à la baseline et détailler chaque échec, y compris les contrôles du workflow à statut souple.

## 19. Critères d’acceptation
Neuf URL historiques, cinq vues et trois justificatifs, conflit explicite, sauvegarde après choix; une seule annonce pending malgré résultat perdu. Fournir les captures comparables et les assertions nouvelles ou étendues liées au lot. Décrire tout écart non vérifié avec son impact.

## 20. Pages protégées
À chaque branche comparer /, /search et /vehicle/v3 sur les 8 viewports avec la même fixture et le protocole du kit. Exécuter la navigation selon rôle, filtre/search/tri/retour, galerie et tests visuels. Aucun nouveau diff introduit, aucune correction opportuniste de PUB-01. L’essai ciblé du tiroir à 880→390 reste actif.

## 21. Git et PR
Créer client-v32/lot-08 sur la base vérifiée. Diff limité, aucun push forcé, aucun merge automatique. Ouvrir une PR de revue si l’environnement et l’autorisation le permettent, sinon livrer commit et rapport. Arrêter après ce lot et attendre validation.

## 22. Rapport
Utiliser REVIEW_TEMPLATE.md. Joindre SHA, fichiers et raison, test individuel, captures, scores par écran, limites, risques et décisions. Risque propre à ce lot · Sauvegarde implicite, second envoi, données écrasées, mauvaise photo, fausse version serveur, perte du groupe historique.

## 23. GO / NO-GO
GO après preuves et revue humaine du périmètre. NO-GO si P0/P1 nouveau, perte d’état, rôle altéré, régression protégée, échec inédit, ou absence de preuve essentielle. Noter la réserve du tiroir historique si reproduite à conditions comparables.
