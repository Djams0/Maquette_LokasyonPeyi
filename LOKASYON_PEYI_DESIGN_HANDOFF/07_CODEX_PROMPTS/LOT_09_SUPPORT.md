# Lot 09 · Assistance, dossiers, avis et reçus

## 1. Rôle et mission
Agis comme ingénieur frontend natif et QA orienté produit. Améliorer FAQ, assistance, dossier, avis et reçu sans toucher l’accordéon de / ou les notes internes.

## 2. Résultat attendu
Cas vide, motif et dossier créé, échanges partagés, accès tiers refusé, avis unique et reçu fictif de clôture; diff accueil nul.

## 3. Conditions d’entrée
Kit vérifié, arbre propre et lots requis intégrés ou disponibles dans la base de revue validée. Exiger le GO humain du lot précédent. Dépendances techniques · 04, 08.

## 4. SHA à vérifier
Référence auditée 4338f5f7ca252f4d4f02021ec47a226d0d2d6064. Faire git status et git fetch origin. Relever origin/main et le HEAD de la base de revue, puis git merge-base --is-ancestor 4338f5f7ca252f4d4f02021ec47a226d0d2d6064 HEAD. Si la branche de travail a avancé, examiner le diff depuis cette base et requalifier contrats et preuves avant d’agir.

## 5. Documents à ouvrir depuis la racine
- LOKASYON_PEYI_DESIGN_HANDOFF/CODEX_START_HERE.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf
- LOKASYON_PEYI_DESIGN_HANDOFF/08_VALIDATION/PROTECTED_PAGES_TESTS.md
- LOKASYON_PEYI_DESIGN_HANDOFF/09_IMPLEMENTATION/REVIEW_TEMPLATE.md
- LOKASYON_PEYI_DESIGN_HANDOFF/05_SCREEN_SPECS/SUPPORT.md
- LOKASYON_PEYI_DESIGN_HANDOFF/02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md
- LOKASYON_PEYI_DESIGN_HANDOFF/06_FONCTIONNEL/ERROR_AND_RECOVERY_CASES.md

## 6. Références visuelles
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-28.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-29.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-30.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/extension/planches/B-31.jpg
- LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES/protected_baseline/CAPTURE_MANIFEST.json

## 7. Fichiers du dépôt à examiner
- client/pages/support.js
- client/pages/account.js
- client/pages/catalog.js
- client/styles/client.css
- ui/components.js
- api/modules/cases.mjs
- api/modules/communication.mjs
Les fichiers API listés servent à vérifier le contrat. Les tests de ce lot sont listés en section 18.

## 8. Composants à réutiliser
Lire les modules désignés et 02_DESIGN_SYSTEM/COMPONENTS.md. Composer les variantes sous une portée opérationnelle. Réutiliser les contrôles documentés et conserver les helpers d’état, de focus et les dialogues existants selon la route.

## 9. Données et API
Préfixe /api/v1 pour les chemins d’API. Aucune vraie donnée financière, pièce ou identité.
- /profile/reviews · GET /bootstrap · Avis authorId=me.id, note et état de modération
- /faq · Aucune API FAQ; contenu local partagé · Recherche et accordéons; aide vers connexion si nécessaire
- /assistance · GET /bootstrap, POST /cases · Alias fonctionnel de cases(new), motif et location facultative
- /cases · GET /cases · Liste, état, motif, date et accès détail
- /cases/new · GET /bootstrap, POST /cases · Préremplissage kind/rental, motifs du mock et location du compte
- /cases/:id · GET /cases/:id, POST /cases/:id (action message) · Résumé, état, échanges partagés et demande de complément
- /review/:id · GET /rentals/:id, POST /rentals/:id/review · Notes véhicule et propriétaire 1–5, texte soumis à modération
- /receipt/:id · GET /rentals/:id · Reçu fictif, période, quote et impression

## 10. Comportements à préserver
/profile/reviews · Client actif, avis écrits par le compte. /faq · Public. /assistance · Client actif. /cases · Client actif, dossiers liés au compte. /cases/new · Client actif. /cases/:id · Partie au dossier; données client projetées. /review/:id · Locataire après clôture; règles serveur. /receipt/:id · Participants après completed. Respecter l’URL, les données, les filtres, les brouillons, les règles par acteur et l’intégrité des écritures.

## 11. Modifications autorisées
Adapter fonctions FAQ/cases/review/receipt et myReviews. Préserver homeFaqItems et renderFaqItems consommés par l’accueil.

## 12. Modifications interdites
Réécriture des trois routes protégées, des données de référence, de l’API, des rôles, des workflows et de l’administration. Aucune évolution C sans arbitrage.

## 13. Desktop
Formulaire par motif, liste/échange assistance, accordéon recherche, reçu imprimable et notes modérées. Aide secondaire en rail.

## 14. Mobile
Une colonne lisible, CTA après explication, note et formulaire accessibles et lien retour sûr, impression par navigateur.

## 15. États métier
Afficher les états observables du mock et l’acteur qui a le droit d’agir. Prévoir états vide, chargement, succès et attente séparés. Lire les spécifications de la route avant d’ajouter un libellé. Réutiliser l’action autorisée existante.

## 16. Erreurs et reprise
- /profile/reviews · Liste vide, pending/published/rejected, erreur API
- /faq · Aucun résultat, session non requise pour consulter
- /assistance · 401 préserve next, 422 champs, échec envoi
- /cases · Vide, accès expiré, erreur réseau
- /cases/new · Paramètres inconnus, résumé invalide, ressource inaccessible
- /cases/:id · Refus, introuvable, clôture, erreur réponse
- /review/:id · Avant clôture, second avis, validation ou mauvais rôle
- /receipt/:id · Avant clôture, accès refusé, valeur manquante
Exercer la réponse tardive ou perdue quand elle s’applique. Préserver la saisie et ne reconnaître le succès qu’après réponse ou vérification autorisée.

## 17. Accessibilité
Vérifier labels et commandes au clavier, focus visible et restauré, statut annoncé, reflow 320, taille de texte 200 %, cibles de projet 44 px, contraste AA et absence de commande couverte. Noter si lecteur d’écran et clavier virtuel non vérifiés.

## 18. Tests
Depuis la racine, exécuter npm run check, npm test, python -m unittest discover -s tests -p "test_*.py" et npm run smoke après démarrage jetable. Valider le handoff avec tools/verify_v32.py et tools/verify_extension.py dans son dossier. Lancer npx playwright test tests/browser/maquette.spec.js tests/browser/booking.spec.js tests/browser/explorer.spec.js tests/browser/navigation.spec.js Comparer à la baseline et détailler chaque échec, y compris les contrôles du workflow à statut souple.

## 19. Critères d’acceptation
Cas vide, motif et dossier créé, échanges partagés, accès tiers refusé, avis unique et reçu fictif de clôture; diff accueil nul. Fournir les captures comparables et les assertions nouvelles ou étendues liées au lot. Décrire tout écart non vérifié avec son impact.

## 20. Pages protégées
À chaque branche comparer /, /search et /vehicle/v3 sur les 8 viewports avec la même fixture et le protocole du kit. Exécuter la navigation selon rôle, filtre/search/tri/retour, galerie et tests visuels. Aucun nouveau diff introduit, aucune correction opportuniste de PUB-01. L’essai ciblé du tiroir à 880→390 reste actif.

## 21. Git et PR
Créer client-v32/lot-09 sur la base vérifiée. Diff limité, aucun push forcé, aucun merge automatique. Ouvrir une PR de revue si l’environnement et l’autorisation le permettent, sinon livrer commit et rapport. Arrêter après ce lot et attendre validation.

## 22. Rapport
Utiliser REVIEW_TEMPLATE.md. Joindre SHA, fichiers et raison, test individuel, captures, scores par écran, limites, risques et décisions. Risque propre à ce lot · Effet partagé FAQ sur /, affichage de note privée, motif pris pour action de réservation, reçu interprété comme pièce comptable.

## 23. GO / NO-GO
GO après preuves et revue humaine du périmètre. NO-GO si P0/P1 nouveau, perte d’état, rôle altéré, régression protégée, échec inédit, ou absence de preuve essentielle. Noter la réserve du tiroir historique si reproduite à conditions comparables.
