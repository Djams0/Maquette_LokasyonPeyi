# Population fictive

Source exécutable : [audit-fixture.mjs](../../api/audit-fixture.mjs). 30 comptes supplémentaires, neuf historiques conservés. `npm run audit:start` charge les 39 comptes dans une cible neuve. Les métadonnées comportementales ne participent jamais à l’autorisation. Aucun identifiant n’est un mot de passe. `audit-a10` existe mais sa connexion doit être refusée.

| ID | Profil comportemental | État / documents | Capacités et périmètre |
|---|---|---|---|
| audit-r01 | Débutant absolu | active / missing | locataire ; ressources propres |
| audit-r02 | Expérimenté | active / verified | locataire ; ressources propres |
| audit-r03 | Très pressé | active / verified | locataire ; ressources propres |
| audit-r04 | Méthodique et patient | active / verified | locataire ; ressources propres |
| audit-r05 | Sensible au prix | active / verified | locataire ; ressources propres |
| audit-r06 | Peu à l’aise avec le numérique | active / pending | locataire ; ressources propres |
| audit-r07 | Touriste / réseau instable | active / verified | locataire ; ressources propres |
| audit-r08 | Besoins d’accessibilité | active / verified | locataire ; ressources propres |
| audit-r09 | Contact hors plateforme | active / verified | locataire ; ressources propres |
| audit-r10 | Comportements abusifs | active / verified | locataire ; ressources propres |
| audit-o01 | Nouveau propriétaire | active / missing | locataire et propriétaire ; ressources propres |
| audit-o02 | Expérimenté | active / verified | locataire et propriétaire ; ressources propres |
| audit-o03 | Pressé | active / verified | locataire et propriétaire ; ressources propres |
| audit-o04 | Prudent | active / verified | locataire et propriétaire ; ressources propres |
| audit-o05 | Peu à l’aise avec le numérique | active / verified | locataire et propriétaire ; ressources propres |
| audit-o06 | Modifications fréquentes | active / pending | locataire et propriétaire ; ressources propres |
| audit-o07 | Plusieurs véhicules | active / verified | locataire et propriétaire ; ressources propres |
| audit-o08 | Échanges hors plateforme | active / verified | locataire et propriétaire ; ressources propres |
| audit-o09 | Justificatifs incohérents | active / rejected | locataire et propriétaire ; ressources propres |
| audit-o10 | Litige complexe | active / verified | locataire et propriétaire ; ressources propres |
| audit-a01 | Employé débutant | active / sans pièces publiques | dashboard.read, documents.review, documents.read_sensitive, listings.review, cases.read, cases.update, users.read, reviews.moderate ; utilisateurs : ["audit-r01","audit-o01"] |
| audit-a02 | Employé expérimenté | active / sans pièces publiques | dashboard.read, documents.review, documents.read_sensitive, listings.review, cases.read, cases.update, users.read, reviews.moderate ; utilisateurs : ["audit-r02","audit-o02"] |
| audit-a03 | Modérateur documentaire | active / sans pièces publiques | dashboard.read, listings.review, documents.review, documents.read_sensitive ; utilisateurs : [] |
| audit-a04 | Périmètre limité | active / sans pièces publiques | dashboard.read, cases.read ; utilisateurs : [] |
| audit-a05 | Administrateur opérationnel | active / sans pièces publiques | dashboard.read, documents.review, documents.read_sensitive, listings.review, cases.read, cases.update, cases.sensitive, users.read, users.suspend, reviews.moderate, finance.read, finance.propose, finance.approve, finance.execute ; utilisateurs : "all-public" |
| audit-a06 | Gestionnaire financier | active / sans pièces publiques | dashboard.read, finance.read, finance.propose ; utilisateurs : [] |
| audit-a07 | Second approbateur financier | active / sans pièces publiques | dashboard.read, finance.read, finance.approve, finance.execute ; utilisateurs : [] |
| audit-a08 | Gestionnaire des habilitations | active / sans pièces publiques | dashboard.read, staff.manage, permissions.manage ; utilisateurs : [] |
| audit-a09 | Second approbateur des habilitations | active / sans pièces publiques | dashboard.read, staff.manage, permissions.manage ; utilisateurs : [] |
| audit-a10 | Collaborateur suspendu | suspended / sans pièces publiques | dashboard.read, documents.review, documents.read_sensitive, listings.review, cases.read, cases.update, users.read, reviews.moderate ; utilisateurs : [] |

Véhicules `audit-v02-1` à `audit-v10-1` (hors propriétaire 01 en brouillon) ; `audit-o07` possède trois véhicules et une demande comme locataire. `audit-o09` a des pièces refusées et annonces pending/rejected. `audit-o05` a une annonce paused. `audit-v04-1` est bloqué du 1 au 3 mai 2027. Les locations de `audit-r02` et `audit-o02` sont en mars 2027, une par état. IDs générés normalisés et stables : consulter le JSON de l’instance jetable ou `auditFixture()`.

Affectations documentaires audit : employee, admin, audit-a01, audit-a02, audit-a03, audit-a05. Dossier assistance : audit-a01/a04/a05 ; dossier sensible audit-o10 : audit-a02/a05 (permission sensible requise, donc a02 refusé). Finance : a06 propose, a07 approuve/exécute ; a05 possède les permissions opérationnelles historiques. Habilitations : a08 propose, a09 approuve. Les autres permissions ne sont jamais déduites du nom. Les ressources créées après le seed gardent les affectations historiques employee/admin : utiliser ces profils pour leur contrôle, sans élargissement implicite des droits audit.
