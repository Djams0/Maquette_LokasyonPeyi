# Lot 07 · Espace propriétaire et calendrier

## 1. Rôle et mission
Agis comme ingénieur frontend natif et QA orienté produit. Améliorer introduction, tableau, parc, demandes, gestion calendrier, revenus et réputation. Séparer les commits tableau/parc/agenda si pertinent.

## 2. Résultat attendu
Vue limitée au bon parc, filtre et retour; tests pause/reprise/retrait, conflit 409, calendrier et brut illustratif, avis et compte changé.

## 3. Conditions d’entrée
Kit vérifié, arbre propre et lots requis intégrés ou disponibles dans la base de revue validée. Exiger le GO humain du lot précédent. Dépendances techniques · 04, 06.

## 4. SHA à vérifier
Référence auditée 4338f5f7ca252f4d4f02021ec47a226d0d2d6064. Faire git status et git fetch origin. Relever origin/main et le HEAD de la base de revue, puis git merge-base --is-ancestor 4338f5f7ca252f4d4f02021ec47a226d0d2d6064 HEAD. Si la branche de travail a avancé, examiner le diff depuis cette base et requalifier contrats et preuves avant d’agir.

## 5. Documents à ouvrir depuis la racine
- LOKASYON_PEYI_DESIGN_HANDOFF/CODEX_START_HERE.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/08_VALIDATION/PROTECTED_PAGES_TESTS.md
- LOKASYON_PEYI_DESIGN_HANDOFF/09_IMPLEMENTATION/REVIEW_TEMPLATE.md
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS/OWNER_DASHBOARD.md
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS/OWNER_VEHICLES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS/OWNER_REQUESTS.md
- LOKASYON_PEYI_DESIGN_HANDOFF/02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md
- LOKASYON_PEYI_DESIGN_HANDOFF/06_FONCTIONNEL/ERROR_AND_RECOVERY_CASES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS/OWNER_CALENDAR.md

## 6. Références visuelles
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-32.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-33.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-34.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-35.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-36.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-37.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-38.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-42.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/protected_baseline/CAPTURE_MANIFEST.json

## 7. Fichiers du dépôt à examiner
- client/pages/owner.js
- client/pages/owner-workspace.js
- client/pages/owner-state.js
- client/pages/vehicle-media.js
- client/pages/vehicle-presentation.js
- client/styles/client.css
- ui/components.js
- api/modules/vehicles.mjs
Les fichiers API listés servent à vérifier le contrat. Les tests de ce lot sont listés en section 18.

## 8. Composants à réutiliser
Lire les modules désignés et 02_DESIGN_SYSTEM/COMPONENTS.md. Composer les variantes sous une portée opérationnelle. Réutiliser les contrôles documentés et conserver les helpers d’état, de focus et les dialogues existants selon la route.

## 9. Données et API
Préfixe /api/v1 pour les chemins d’API. Aucune vraie donnée financière, pièce ou identité.
- /owner/start · POST /owner/onboarding · Découverte, estimateur brut local, redirection login si nécessaire, activation
- /owner · GET /bootstrap, GET /owner/draft, GET /me · Compteurs, première demande, brouillon, gestion et accès aux sections
- /owner/revenue · GET /bootstrap, GET /me · Montants bruts des paiements simulés issus des locations
- /owner/reputation · GET /bootstrap, GET /me, POST /reviews/:id · Avis applicables, réponse propriétaire distincte, note et statut
- /owner/vehicles · GET /bootstrap, GET /me · Parc, états, filtre URL actuel, ajout et gestion
- /owner/vehicles/:id · GET /bootstrap, GET /me, POST /owner/vehicles/:id/{edit,block,unblock,pause,resume,remove}, POST /documents · Statut, gestion, docs, état, calendrier et confirmations
- /owner/requests · GET /bootstrap, GET /me; actions dans /rental/:id · Filtres et états des demandes, ouvrir suivi avant décision

## 10. Comportements à préserver
/owner/start · Public; activation client actif. /owner · Propriétaire actif. /owner/revenue · Propriétaire actif. /owner/reputation · Propriétaire actif. /owner/vehicles · Propriétaire actif. /owner/vehicles/:id · Propriétaire du véhicule. /owner/requests · Propriétaire actif, demandes de son parc. Respecter l’URL, les données, les filtres, les brouillons, les règles par acteur et l’intégrité des écritures.

## 11. Modifications autorisées
Composer les vues owner avec services et helpers existants. Activation, édition et blocage conditionnels aux droits vérifiés.

## 12. Modifications interdites
Réécriture des trois routes protégées, des données de référence, de l’API, des rôles, des workflows et de l’administration. Aucune évolution C sans arbitrage.

## 13. Desktop
Compteurs, carte prioritaire, reprise, galerie informée, calendrier mois et blocage; panorama sur introduction et revenus bruts.

## 14. Mobile
Filtre parc simple, demande et reprise avant liens; agenda, dates et actions sous la liste. Pas de barre si détail.

## 15. États métier
Afficher les états observables du mock et l’acteur qui a le droit d’agir. Prévoir états vide, chargement, succès et attente séparés. Lire les spécifications de la route avant d’ajouter un libellé. Réutiliser l’action autorisée existante.

## 16. Erreurs et reprise
- /owner/start · Non connecté, déjà propriétaire, confirmation absente
- /owner · Parc vide, draft API indisponible, changement de compte
- /owner/revenue · Aucune location payée, valeur non disponible
- /owner/reputation · Vide, longueur de réponse, avis tiers interdit
- /owner/vehicles · Aucune annonce ou filtre vide, état absent
- /owner/vehicles/:id · 403/404, conflit période, contrôle requis, suppressions interdites si location
- /owner/requests · Vide, refus, dossier modifié entre liste et suivi
Exercer la réponse tardive ou perdue quand elle s’applique. Préserver la saisie et ne reconnaître le succès qu’après réponse ou vérification autorisée.

## 17. Accessibilité
Vérifier labels et commandes au clavier, focus visible et restauré, statut annoncé, reflow 320, taille de texte 200 %, cibles de projet 44 px, contraste AA et absence de commande couverte. Noter si lecteur d’écran et clavier virtuel non vérifiés.

## 18. Tests
Depuis la racine, exécuter npm run check, npm test, python -m unittest discover -s tests -p "test_*.py" et npm run smoke après démarrage jetable. Valider le handoff avec tools/verify_v32.py et tools/verify_extension.py dans son dossier. Lancer npx playwright test tests/browser/owner.spec.js tests/browser/booking.spec.js tests/browser/navigation.spec.js tests/browser/maquette.spec.js Comparer à la baseline et détailler chaque échec, y compris les contrôles du workflow à statut souple.

## 19. Critères d’acceptation
Vue limitée au bon parc, filtre et retour; tests pause/reprise/retrait, conflit 409, calendrier et brut illustratif, avis et compte changé. Fournir les captures comparables et les assertions nouvelles ou étendues liées au lot. Décrire tout écart non vérifié avec son impact.

## 20. Pages protégées
À chaque branche comparer /, /search et /vehicle/v3 sur les 8 viewports avec la même fixture et le protocole du kit. Exécuter la navigation selon rôle, filtre/search/tri/retour, galerie et tests visuels. Aucun nouveau diff introduit, aucune correction opportuniste de PUB-01. L’essai ciblé du tiroir à 880→390 reste actif.

## 21. Git et PR
Créer client-v32/lot-07 sur la base vérifiée. Diff limité, aucun push forcé, aucun merge automatique. Ouvrir une PR de revue si l’environnement et l’autorisation le permettent, sinon livrer commit et rapport. Arrêter après ce lot et attendre validation.

## 22. Rapport
Utiliser REVIEW_TEMPLATE.md. Joindre SHA, fichiers et raison, test individuel, captures, scores par écran, limites, risques et décisions. Risque propre à ce lot · Image incorrecte en plus du statut, demande prise pour blocage, intermédiaires temporels, mutation sur ressource d’un autre compte.

## 23. GO / NO-GO
GO après preuves et revue humaine du périmètre. NO-GO si P0/P1 nouveau, perte d’état, rôle altéré, régression protégée, échec inédit, ou absence de preuve essentielle. Noter la réserve du tiroir historique si reproduite à conditions comparables.
