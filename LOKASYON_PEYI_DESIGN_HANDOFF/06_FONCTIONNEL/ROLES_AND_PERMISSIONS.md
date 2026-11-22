# Rôles, identité et portée

| Acteur | Portée |
|---|---|
| Visiteur | Exploration, FAQ et entrée propriétaire. Une action privée conduit vers connexion avec next local. |
| Locataire actif | Compte et pièces propres, réservations et fils où il participe; création de demande sous conditions. |
| Nouveau client fictif | Peut vérifier ou préparer ses pièces, sans obtenir l’éligibilité de location par une transformation visuelle. |
| Propriétaire actif | Son parc et ses demandes, ses contextes locataire compatibles. Une annonce d’un tiers demeure interdite. |
| Agent interne | Origine admin et droits explicites; employé affecté, admin, finance, super-admin. La navigation client ne confère aucun droit admin. |
| Session inconnue, changée ou suspendue | Etat neutre, lecture /me, purge ou masquage de contenu obsolète, reconnexion sûre. |

Sources api/access.mjs, api/router.mjs, api/server.mjs et tests/api.test.mjs, tests/audit.test.mjs, tests/audit-browser/profiles.spec.js. La portée API et les permissions ne sont pas décidées par le shell. Le cache idempotent ne dispense pas de recontrôler identité et accès. Utiliser deux contextes de navigateur et un tiers fictif en recette.
