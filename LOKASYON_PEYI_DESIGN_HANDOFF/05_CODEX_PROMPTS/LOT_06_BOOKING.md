# Lot 06 · Demande, réservation et suivi

## A. Mission

Agis comme UX Engineer et Frontend Tech Lead de Lokasyon Péyi. Mettre en place récapitulatif, prochaine action et suivi à partir des états existants. Exécute uniquement ce lot.

## B. Contexte

Cible : `Djams0/Maquette_LokasyonPeyi`. Entrée : lot 05 intégré. `Djams0/LokasyonPeyi` est la référence métier et technique en lecture. Le handoff a été établi sur maquette `d8ef845` et principal `78966c9`. Relis les instructions et compare tout écart de version avant d’agir. Lis les chemins ci-dessous depuis la racine du kit extrait, qui peut être placée à côté du dépôt. Respecte les données et parcours fictifs existants.

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
- [01_REFERENCES/finition/01_SPECIFICATION_CODEX.md](../01_REFERENCES/finition/01_SPECIFICATION_CODEX.md)
- [04_SCREEN_SPECS/booking.md](../04_SCREEN_SPECS/booking.md)
- [01_REFERENCES/target_ui/05_Recapitulatif.png](../01_REFERENCES/target_ui/05_Recapitulatif.png)
- [01_REFERENCES/current_ui/L06-demande.png](../01_REFERENCES/current_ui/L06-demande.png)
- [01_REFERENCES/current_ui/L09-paiement.png](../01_REFERENCES/current_ui/L09-paiement.png)
- [04_SCREEN_SPECS/rental_tracking.md](../04_SCREEN_SPECS/rental_tracking.md)
- [01_REFERENCES/target_ui/06_Suivi_location.png](../01_REFERENCES/target_ui/06_Suivi_location.png)
- [01_REFERENCES/current_ui/L07-locations.png](../01_REFERENCES/current_ui/L07-locations.png)
- [01_REFERENCES/current_ui/L08-acceptee.png](../01_REFERENCES/current_ui/L08-acceptee.png)
- [01_REFERENCES/current_ui/L11-constat.png](../01_REFERENCES/current_ui/L11-constat.png)
- [01_REFERENCES/current_ui/L26-paiement-refuse.png](../01_REFERENCES/current_ui/L26-paiement-refuse.png)

## D. État actuel et fichiers à examiner

Inspecter `client/pages/rentals.js`, `inspection.js`, brouillon `rental-draft` et `api/modules/rentals.mjs` en lecture. Lister les statuts et actions par rôle.

## E. Résultat attendu

Récapitulatif éditable, devis ou indication conditionnelle, caution séparée, cartes de prochaine action, progression, accès conversation, constats et aide.

## F. Règles UX

Le rôle courant n’agit que sur la transition disponible. Expliquer l’attente de l’autre partie. Reprendre après erreur ou connexion. Maintenir l’ordre du parcours, y compris le retour déclaré puis confirmé.

## G. Règles UI

Section prioritaire vert profond, action unique visible et état indiqué en texte. Récapitulatif et panneau latéral en large sans masquer le focus.

## H. Contraintes techniques

Garder mutations, états et contrôles serveur. Aucune modification des règles d’engagement, PSP, prix, caution ou données réelles. Préserve les scénarios historiques et d’audit, la stack, les contrôles et sessions existants. Pour un changement de libellé volontaire, adapte le sélecteur historique correspondant sans affaiblir l’assertion. Toute décision ouverte reste identifiée dans le rapport.

## I. Tests

Rejouer le test historique complet et les cas de refus, retrait, conflit, absence de brouillon, paiement refusé et récupération. Couvrir les rôles et accès croisés. Rejoue au minimum les contrôles de la stratégie commune. Vérifie les suites concernées sur une instance neuve et note les commandes réellement exécutées.

## J. Critères d’acceptation

Même véhicule et même période de fiche à demande, aucune demande présentée comme payée avant état autorisé, chaque statut montre l’acteur ou l’attente. Documente chaque écart visuel et fonctionnel observé avec une preuve et son statut. Un test manquant reste signalé.

## K. Git

Branche dédiée `peyi/lot-06-booking` depuis lot 05 intégré. Contrôler `git status`, le SHA de base et les changements de l’utilisateur. Préserver `main` et les protections. Commits limités au lot et PR de revue si le mode Git de la mission l’autorise, sans fusion automatique. En mode local, fournir le diff ou le commit et le texte de PR.

## L. Livrable final

Remets le SHA de base et celui de travail si applicable, les chemins modifiés, le bilan des commandes avec résultats, des captures comparables, les écarts résiduels et les points à arbitrer. Donne le lien de PR seulement si elle existe. Arrête-toi à la livraison de ce lot.
