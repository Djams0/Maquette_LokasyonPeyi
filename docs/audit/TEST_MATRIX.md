# Matrice de couverture

« automatique » signifie assertion présente dans un test, pas preuve de réussite de toute la catégorie. Résultats réels : [rapport](REGRESSION_REPORT.md). Les scénarios manuels doivent être joués par Work. Tests AUD : [API](../../tests/audit.test.mjs) ; UI-AUD : [navigateur](../../tests/audit-browser/profiles.spec.js).

| ID | Priorité | Scénario | Contrôle | Test |
|---|---|---|---|---|
| A-001 | P1 | Première visite | manuel | — |
| A-002 | P1 | Recherche par ville | manuel | — |
| A-003 | P1 | Budget | manuel | — |
| A-004 | P1 | Catégorie et boîte | manuel | — |
| A-005 | P1 | Carte fictive | manuel | — |
| A-006 | P1 | Fiche et galerie | manuel | — |
| A-007 | P1 | Inscription fictive | manuel | — |
| A-008 | P1 | Connexion débutant | manuel | — |
| A-009 | P1 | Sélection filtrée | automatique | UI-AUD-01 |
| A-010 | P1 | Changer de personne | manuel | — |
| A-011 | P1 | Passage visiteur | manuel | — |
| A-012 | P1 | Documents manquants | manuel | — |
| A-013 | P1 | Document refusé | manuel | — |
| A-014 | P1 | Activation propriétaire | manuel | — |
| A-015 | P1 | Brouillon neuf étapes | manuel | — |
| A-016 | P1 | Publication complète | manuel | — |
| A-017 | P1 | Documents véhicule | manuel | — |
| A-018 | P1 | Relecture avant publication | manuel | — |
| B-001 | P0 | Demande sans paiement | manuel | — |
| B-002 | P0 | Compte non vérifié | manuel | — |
| B-003 | P0 | Acceptation propriétaire | manuel | — |
| B-004 | P0 | Refus propriétaire | manuel | — |
| B-005 | P0 | Retrait locataire | manuel | — |
| B-006 | P0 | Demandes concurrentes | manuel | — |
| B-007 | P0 | Créneau bloqué | manuel | — |
| B-008 | P0 | Paiement prématuré | manuel | — |
| B-009 | P0 | Paiement refusé | manuel | — |
| B-010 | P0 | Caution séparée | manuel | — |
| B-011 | P0 | Départ incomplet | manuel | — |
| B-012 | P0 | Remplacement de vue | manuel | — |
| B-013 | P0 | Remise contrôlée | manuel | — |
| B-014 | P0 | Compteur incohérent | manuel | — |
| B-015 | P0 | Déclaration de retour | manuel | — |
| B-016 | P0 | Récupération des clés | manuel | — |
| B-017 | P0 | Clôture et avis | manuel | — |
| B-018 | P0 | Profil mixte | manuel | — |
| C-001 | P0 | Agent limité | automatique | UI-AUD-03 |
| C-002 | P0 | Admin opérationnel | automatique | UI-AUD-04 |
| C-003 | P0 | Périmètre utilisateurs | automatique | AUD-03 |
| C-004 | P0 | Document non affecté | automatique | AUD-03 |
| C-005 | P0 | Document affecté | automatique | AUD-03 |
| C-006 | P0 | Revue versionnée | manuel | — |
| C-007 | P0 | Critères manquants | manuel | — |
| C-008 | P0 | Annonce rejetée | manuel | — |
| C-009 | P0 | Dossier sensible | automatique | AUD-03 |
| C-010 | P0 | Note interne | manuel | — |
| C-011 | P0 | Étapes du dossier | manuel | — |
| C-012 | P0 | Proposition financière | manuel | — |
| C-013 | P0 | Même personne finance | automatique | AUD-05 |
| C-014 | P0 | Modification financière | automatique | AUD-05 |
| C-015 | P0 | Permission du super-admin | automatique | AUD-05 |
| C-016 | P0 | Double habilitation | automatique | AUD-06 |
| C-017 | P0 | Suspension en session | automatique | AUD-06 |
| C-018 | P0 | Agent déjà suspendu | automatique | AUD-02 |
| D-001 | P1 | Double demande | automatique | AUD-04 |
| D-002 | P1 | Double exécution sensible | automatique | AUD-05 |
| D-003 | P1 | Clé réutilisée à tort | manuel | — |
| D-004 | P1 | Actualiser demande | manuel | — |
| D-005 | P1 | Fermer le brouillon | manuel | — |
| D-006 | P1 | Redémarrage API | manuel | — |
| D-007 | P1 | Session déconnectée | manuel | — |
| D-008 | P1 | Accès croisé refusé | automatique | AUD-03 |
| D-009 | P1 | Route API absente | manuel | — |
| D-010 | P1 | Route UI absente | manuel | — |
| D-011 | P1 | API indisponible | manuel | — |
| D-012 | P1 | Reprise réseau | manuel | — |
| D-013 | P1 | Réseau lent | manuel | — |
| D-014 | P1 | Conflit de version | manuel | — |
| D-015 | P1 | État vide | manuel | — |
| D-016 | P1 | Dates invalides | manuel | — |
| D-017 | P1 | Campagne neuve | automatique | AUD-07 |
| D-018 | P1 | Cible non autorisée | automatique | AUD-07 |
| E-001 | P0 | Téléphone en clair | manuel | — |
| E-002 | P0 | Téléphone espacé | manuel | — |
| E-003 | P0 | Téléphone en lettres | manuel | — |
| E-004 | P0 | E-mail réservé | manuel | — |
| E-005 | P0 | Identifiant social fictif | manuel | — |
| E-006 | P0 | Paiement direct | manuel | — |
| E-007 | P0 | Lien réservé | manuel | — |
| E-008 | P0 | Description suspecte | manuel | — |
| E-009 | P0 | Message opportuniste | manuel | — |
| E-010 | P0 | Message abusif | manuel | — |
| E-011 | P0 | Location d’un tiers | automatique | AUD-03 |
| E-012 | P0 | Document d’un tiers | automatique | AUD-03 |
| E-013 | P0 | Modification du parc tiers | automatique | AUD-03 |
| E-014 | P0 | Action interne publique | manuel | — |
| E-015 | P0 | Auto-attribution | automatique | AUD-06 |
| E-016 | P0 | Approbation propre | automatique | AUD-05 |
| E-017 | P0 | Message hors conversation | automatique | AUD-03 |
| E-018 | P0 | Origine étrangère | manuel | — |
| F-001 | P1 | Clavier accueil | manuel | — |
| F-002 | P1 | Focus visible | manuel | — |
| F-003 | P1 | Formulaire erreurs | manuel | — |
| F-004 | P1 | Modale galerie | manuel | — |
| F-005 | P1 | Modale sensible | manuel | — |
| F-006 | P1 | Zoom 200 pour cent | manuel | — |
| F-007 | P1 | Zoom 400 pour cent | manuel | — |
| F-008 | P1 | Atelier 320 | automatique | UI-AUD-05 |
| F-009 | P1 | Atelier 375 | automatique | UI-AUD-05 |
| F-010 | P1 | Atelier 390 | automatique | UI-AUD-05 |
| F-011 | P1 | Atelier 430 | automatique | UI-AUD-05 |
| F-012 | P1 | Atelier 768 | automatique | UI-AUD-05 |
| F-013 | P1 | Atelier 1024 | automatique | UI-AUD-05 |
| F-014 | P1 | Atelier 1440 | automatique | UI-AUD-05 |
| F-015 | P1 | Table utilisateurs | manuel | — |
| F-016 | P1 | Table modération | manuel | — |
| F-017 | P1 | Contrastes et badges | manuel | — |
| F-018 | P1 | Lecture assistée | manuel | — |

Tests historiques conservés : neuf tests API et treize tests Chromium (sept largeurs comprises). Neuf tests API audit supplémentaires et onze tests navigateur audit. Aucun scénario manuel n’est présenté comme exécuté.
