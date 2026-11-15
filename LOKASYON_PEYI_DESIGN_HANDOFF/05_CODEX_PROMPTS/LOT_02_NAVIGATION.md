# Lot 02 · Navigation mobile-first

## A. Mission

Agis comme UX Engineer et Frontend Tech Lead de Lokasyon Péyi. Faire évoluer les shells et les retours en conservant chaque destination et la séparation des rôles. Exécute uniquement ce lot.

## B. Contexte

Cible : `Djams0/Maquette_LokasyonPeyi`. Entrée : lot 01 intégré à la base approuvée. `Djams0/LokasyonPeyi` est la référence métier et technique en lecture. Le handoff a été établi sur maquette `d8ef845` et principal `78966c9`. Relis les instructions et compare tout écart de version avant d’agir. Lis les chemins ci-dessous depuis la racine du kit extrait, qui peut être placée à côté du dépôt. Respecte les données et parcours fictifs existants.

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
- [04_SCREEN_SPECS/navigation_profile.md](../04_SCREEN_SPECS/navigation_profile.md)
- [01_REFERENCES/target_ui/01_Explorer.png](../01_REFERENCES/target_ui/01_Explorer.png)
- [01_REFERENCES/target_ui/07_Boite_messages.png](../01_REFERENCES/target_ui/07_Boite_messages.png)
- [01_REFERENCES/target_ui/10_Dashboard_proprietaire.png](../01_REFERENCES/target_ui/10_Dashboard_proprietaire.png)
- [01_REFERENCES/current_ui/L12-profil.png](../01_REFERENCES/current_ui/L12-profil.png)
- [01_REFERENCES/current_ui/L13-notifications.png](../01_REFERENCES/current_ui/L13-notifications.png)
- [04_SCREEN_SPECS/explorer.md](../04_SCREEN_SPECS/explorer.md)
- [01_REFERENCES/current_ui/L01-accueil.png](../01_REFERENCES/current_ui/L01-accueil.png)
- [01_REFERENCES/current_ui/L23-accueil-ordinateur.png](../01_REFERENCES/current_ui/L23-accueil-ordinateur.png)
- [04_SCREEN_SPECS/inbox.md](../04_SCREEN_SPECS/inbox.md)
- [01_REFERENCES/current_ui/L14-messages.png](../01_REFERENCES/current_ui/L14-messages.png)
- [04_SCREEN_SPECS/owner_dashboard.md](../04_SCREEN_SPECS/owner_dashboard.md)
- [01_REFERENCES/target_ui/16_Parc_proprietaire.png](../01_REFERENCES/target_ui/16_Parc_proprietaire.png)
- [01_REFERENCES/target_ui/17_Gestion_annonce.png](../01_REFERENCES/target_ui/17_Gestion_annonce.png)
- [01_REFERENCES/target_ui/18_Calendrier.png](../01_REFERENCES/target_ui/18_Calendrier.png)
- [01_REFERENCES/target_ui/19_Demande_proprietaire.png](../01_REFERENCES/target_ui/19_Demande_proprietaire.png)
- [01_REFERENCES/current_ui/L17-proprietaire.png](../01_REFERENCES/current_ui/L17-proprietaire.png)
- [01_REFERENCES/current_ui/L18-calendrier.png](../01_REFERENCES/current_ui/L18-calendrier.png)

## D. État actuel et fichiers à examiner

Examiner `client/shell.js`, `client/app.js`, `admin/shell.js`, `client/pages/audit.js`, `client/pages/demo.js` et les styles. Inventorier entrées historiques et accès en cas de panne.

## E. Résultat attendu

Quatre entrées mobiles et nav adaptée tablette/desktop. Hiérarchiser aide, notifications, documents, espace propriétaire et atelier. Conserver la navigation Admin indépendante.

## F. Règles UX

Garder les liens directs, le retour navigateur, le `next` validé et les chemins visiteurs. Le shell n’octroie aucun droit. Les parcours dédiés ont un retour nommé et une action cohérente.

## G. Règles UI

Barre basse sur surfaces racines, 56 px minimum, libellés visibles, zone sûre et état actif. Le panneau et son déclencheur sont accessibles à 320 px.

## H. Contraintes techniques

Garder routes, sessions et cookies distincts. Conserver les scénarios d’audit et le contournement prévu pour récupérer d’une panne simulée dans Démo. Préserve les scénarios historiques et d’audit, la stack, les contrôles et sessions existants. Pour un changement de libellé volontaire, adapte le sélecteur historique correspondant sans affaiblir l’assertion. Toute décision ouverte reste identifiée dans le rapport.

## I. Tests

Jouer visiteur, locataire, propriétaire, agent et suspendu. Couvrir mobile/desktop, accès directs, clavier et états actifs. Rejoue au minimum les contrôles de la stratégie commune. Vérifie les suites concernées sur une instance neuve et note les commandes réellement exécutées.

## J. Critères d’acceptation

Quatre destinations uniques et actives au bon endroit, chemins de secours atteignables, suites UI-AUD-01 à 04 passantes. Documente chaque écart visuel et fonctionnel observé avec une preuve et son statut. Un test manquant reste signalé.

## K. Git

Branche dédiée `peyi/lot-02-navigation` depuis lot 01 intégré à la base approuvée. Contrôler `git status`, le SHA de base et les changements de l’utilisateur. Préserver `main` et les protections. Commits limités au lot et PR de revue si le mode Git de la mission l’autorise, sans fusion automatique. En mode local, fournir le diff ou le commit et le texte de PR.

## L. Livrable final

Remets le SHA de base et celui de travail si applicable, les chemins modifiés, le bilan des commandes avec résultats, des captures comparables, les écarts résiduels et les points à arbitrer. Donne le lien de PR seulement si elle existe. Arrête-toi à la livraison de ce lot.
