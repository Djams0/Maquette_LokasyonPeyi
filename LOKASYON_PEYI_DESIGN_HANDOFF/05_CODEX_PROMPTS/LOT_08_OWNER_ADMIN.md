# Lot 08 · Interfaces propriétaire et administration

## A. Mission

Agis comme UX Engineer et Frontend Tech Lead de Lokasyon Péyi. 08A refond l’espace propriétaire. 08B traite le shell et les files Admin. Exécute 08A lors du premier passage et arrête-toi à son rapport. Réutilise ce prompt en demandant explicitement 08B après revue de 08A. Pour chaque passage, limite les changements au sous-lot demandé.

## B. Contexte

Cible : `Djams0/Maquette_LokasyonPeyi`. Entrée : lot 07 intégré. Créer une sous-branche séparée pour Admin après revue du sous-lot propriétaire. `Djams0/LokasyonPeyi` est la référence métier et technique en lecture. Le handoff a été établi sur maquette `d8ef845` et principal `78966c9`. Relis les instructions et compare tout écart de version avant d’agir. Lis les chemins ci-dessous depuis la racine du kit extrait, qui peut être placée à côté du dépôt. Respecte les données et parcours fictifs existants.

## C. Références visuelles et fichiers à ouvrir

- [00_DECISIONS/DESIGN_DIRECTION.md](../00_DECISIONS/DESIGN_DIRECTION.md)
- [00_DECISIONS/PRODUCT_CONSTRAINTS.md](../00_DECISIONS/PRODUCT_CONSTRAINTS.md)
- [00_DECISIONS/OPEN_DECISIONS.md](../00_DECISIONS/OPEN_DECISIONS.md)
- [02_DESIGN_SYSTEM/DESIGN_SYSTEM.md](../02_DESIGN_SYSTEM/DESIGN_SYSTEM.md)
- [02_DESIGN_SYSTEM/COMPONENT_SPECS.md](../02_DESIGN_SYSTEM/COMPONENT_SPECS.md)
- [02_DESIGN_SYSTEM/GEOMETRIE_V2.md](../02_DESIGN_SYSTEM/GEOMETRIE_V2.md)
- [02_DESIGN_SYSTEM/tokens.css](../02_DESIGN_SYSTEM/tokens.css)
- [06_VALIDATION/REGRESSION_STRATEGY.md](../06_VALIDATION/REGRESSION_STRATEGY.md)
- [06_VALIDATION/ACCEPTANCE_CRITERIA.md](../06_VALIDATION/ACCEPTANCE_CRITERIA.md)
- [01_REFERENCES/finition/Brouillon_conflit_390.png](../01_REFERENCES/finition/Brouillon_conflit_390.png)
- [01_REFERENCES/finition/01_SPECIFICATION_CODEX.md](../01_REFERENCES/finition/01_SPECIFICATION_CODEX.md)
- [04_SCREEN_SPECS/owner_dashboard.md](../04_SCREEN_SPECS/owner_dashboard.md)
- [01_REFERENCES/target_ui/10_Dashboard_proprietaire.png](../01_REFERENCES/target_ui/10_Dashboard_proprietaire.png)
- [01_REFERENCES/target_ui/16_Parc_proprietaire.png](../01_REFERENCES/target_ui/16_Parc_proprietaire.png)
- [01_REFERENCES/target_ui/17_Gestion_annonce.png](../01_REFERENCES/target_ui/17_Gestion_annonce.png)
- [01_REFERENCES/target_ui/18_Calendrier.png](../01_REFERENCES/target_ui/18_Calendrier.png)
- [01_REFERENCES/target_ui/19_Demande_proprietaire.png](../01_REFERENCES/target_ui/19_Demande_proprietaire.png)
- [01_REFERENCES/current_ui/L17-proprietaire.png](../01_REFERENCES/current_ui/L17-proprietaire.png)
- [01_REFERENCES/current_ui/L18-calendrier.png](../01_REFERENCES/current_ui/L18-calendrier.png)
- [04_SCREEN_SPECS/owner_publication.md](../04_SCREEN_SPECS/owner_publication.md)
- [01_REFERENCES/target_ui/11_Declaration_proprietaire.png](../01_REFERENCES/target_ui/11_Declaration_proprietaire.png)
- [01_REFERENCES/current_ui/L16-brouillon.png](../01_REFERENCES/current_ui/L16-brouillon.png)
- [04_SCREEN_SPECS/administration.md](../04_SCREEN_SPECS/administration.md)
- [01_REFERENCES/target_ui/12_File_admin.png](../01_REFERENCES/target_ui/12_File_admin.png)
- [01_REFERENCES/target_ui/20_Decision_admin.png](../01_REFERENCES/target_ui/20_Decision_admin.png)
- [01_REFERENCES/current_ui/L19-admin.png](../01_REFERENCES/current_ui/L19-admin.png)
- [01_REFERENCES/current_ui/L21-admin-moderation.png](../01_REFERENCES/current_ui/L21-admin-moderation.png)
- [01_REFERENCES/current_ui/L24-admin-320.png](../01_REFERENCES/current_ui/L24-admin-320.png)
- [04_SCREEN_SPECS/vehicle_condition.md](../04_SCREEN_SPECS/vehicle_condition.md)
- [01_REFERENCES/target_ui/04_Defaut_detail.png](../01_REFERENCES/target_ui/04_Defaut_detail.png)
- [01_REFERENCES/current_ui/L04-fiche.png](../01_REFERENCES/current_ui/L04-fiche.png)

## D. État actuel et fichiers à examiner

Inspecter `client/pages/owner.js`, `client/pages/wizard.js`, `api/router.mjs`, `api/modules/vehicles.mjs`, `admin/shell.js` et `admin/pages/`. L’API de brouillon est indexée par compte et stocke step, sans verrou de version garanti.

## E. Résultat attendu

08A rend les quatre sections et mappe les neuf étapes en conservant les validations. 08B présente file, affectation, dossier, version et décisions. Préserver les routes et états actuels des deux espaces.

## F. Règles UX

Préserver l’étape enregistrée et la saisie locale au rechargement. Comparer la version uniquement si elle est observable. Conserver contrôles de publication, pièces, calendrier, rôles, versions, notes privées et validation secondaire.

## G. Règles UI

Dashboard à actions claires, calendriers avec liste mobile, cartes Admin à 320 px et détails lisibles. Label explicite pour chaque action sensible.

## H. Contraintes techniques

Maintenir `/owner/draft`, profils d’audit et permissions serveur. Ni réécriture de modèle ni garantie concurrente sans preuve. Sous-branche Admin `peyi/lot-08-admin`. Préserve les scénarios historiques et d’audit, la stack, les contrôles et sessions existants. Pour un changement de libellé volontaire, adapte le sélecteur historique correspondant sans affaiblir l’assertion. Toute décision ouverte reste identifiée dans le rapport.

## I. Tests

Tester migration des neuf étapes, panne, compte distinct, reprise, contrôles de soumission, publication, calendrier. Admin : accès limité, suspendu, document remplacé, refus, seconde validation et cookies. Rejoue au minimum les contrôles de la stratégie commune. Vérifie les suites concernées sur une instance neuve et note les commandes réellement exécutées.

## J. Critères d’acceptation

Les scénarios historiques et audit restent passants. Reprise à la bonne étape, aucune fuite entre comptes ni action obsolète. Un rapport avec captures pour chaque sous-lot exécuté. Documente chaque écart visuel et fonctionnel observé avec une preuve et son statut. Un test manquant reste signalé.

## K. Git

Branche dédiée `peyi/lot-08-owner` depuis lot 07 intégré. Créer une sous-branche séparée pour Admin après revue du sous-lot propriétaire. Contrôler `git status`, le SHA de base et les changements de l’utilisateur. Préserver `main` et les protections. Commits limités au lot et PR de revue si le mode Git de la mission l’autorise, sans fusion automatique. En mode local, fournir le diff ou le commit et le texte de PR. Sous-lot 08B sur `peyi/lot-08-admin` depuis la base incluant 08A revu. Demander une revue distincte par sous-lot.

## L. Livrable final

Remets le SHA de base et celui de travail si applicable, les chemins modifiés, le bilan des commandes avec résultats, des captures comparables, les écarts résiduels et les points à arbitrer. Donne le lien de PR seulement si elle existe. Arrête-toi à la livraison de ce lot.
