# Catalogue de simulation

Généré par `npm run audit:docs` depuis [scenarios.mjs](scenarios.mjs). 108 scénarios ; une entrée manuelle reste à exécuter par Work. Les actions précisent le profil exact lorsqu’il diffère du groupe. Chaque scénario repart d’une instance propre ; les recettes longues composent les étapes dans un seul contexte.

## A-001 — Première visite

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir / en visiteur, parcourir les liens principaux.
- Résultat attendu : Comprendre la location fictive et rejoindre la recherche.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-002 — Recherche par ville

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Chercher Gosier puis Basse-Terre dans /search.
- Résultat attendu : Les résultats correspondent à la destination.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-003 — Budget

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Appliquer un plafond de prix puis le retirer.
- Résultat attendu : Résultats et filtre restent compréhensibles.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-004 — Catégorie et boîte

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Combiner SUV et automatique puis réinitialiser.
- Résultat attendu : Les filtres cumulent leurs effets sans bloquer la reprise.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-005 — Carte fictive

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Basculer liste/carte et ouvrir une fiche.
- Résultat attendu : La limite de la carte simulée reste visible.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-006 — Fiche et galerie

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir /vehicle/v1 puis la galerie et la fermer.
- Résultat attendu : Retour à la fiche sans perte du contexte.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-007 — Inscription fictive

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Créer un prénom synthétique via /register et confirmer la simulation.
- Résultat attendu : Compte public sans permissions internes.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-008 — Connexion débutant

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Choisir audit-r01 dans /login.
- Résultat attendu : Compte actif, documents manquants visibles.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-009 — Sélection filtrée

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Dans /demo/audit filtrer locataires puis choisir audit-r02.
- Résultat attendu : Dix locataires proposés et session audit-r02 ouverte.
- Contrôle : automatique ; test associé : UI-AUD-01.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-010 — Changer de personne

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Sélectionner audit-r03 puis audit-r04 via /demo.
- Résultat attendu : Les ressources personnelles changent avec le compte.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-011 — Passage visiteur

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Depuis /demo passer en visiteur puis ouvrir /profile.
- Résultat attendu : Session supprimée et connexion proposée.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-012 — Documents manquants

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Avec audit-r01 envoyer Permis puis Identité synthétiques.
- Résultat attendu : État pending, aucune validation automatique.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-013 — Document refusé

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Avec audit-o09 ouvrir les documents puis remplacer une pièce.
- Résultat attendu : Motif visible et nouvelle version en attente.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-014 — Activation propriétaire

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Avec audit-o01 confirmer /owner/start.
- Résultat attendu : Capacité propriétaire cumulative, sans permission interne.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-015 — Brouillon neuf étapes

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Avec audit-o01 ouvrir /owner/vehicles/new et reprendre les champs.
- Résultat attendu : Le brouillon reste propre au compte.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-016 — Publication complète

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Remplir les neuf étapes avec audit-o01 puis soumettre.
- Résultat attendu : Annonce pending et trois documents synthétiques.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-017 — Documents véhicule

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Agent audit-a03 inspecte les trois pièces d’une annonce pending.
- Résultat attendu : Critères et motif sont requis avant décision.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## A-018 — Relecture avant publication

- Catégorie : Découverte et onboarding ; priorité : P1.
- Profil : audit-r01.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Agent audit-a05 tente de publier audit-v09-1 sans contrôle.
- Résultat attendu : Publication refusée tant que les justificatifs ne sont pas vérifiés.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-001 — Demande sans paiement

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Demander audit-v03-1 en juillet avec audit-r03.
- Résultat attendu : requested sans paiement ni caution.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-002 — Compte non vérifié

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-r01 demande audit-v03-1.
- Résultat attendu : Refus 422 et invitation à compléter les documents.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-003 — Acceptation propriétaire

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-o02 accepte sa demande requested.
- Résultat attendu : awaiting_payment et contrôle de disponibilité.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-004 — Refus propriétaire

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Refuser une demande requested pour maintenance.
- Résultat attendu : declined sans paiement.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-005 — Retrait locataire

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Retirer une demande requested.
- Résultat attendu : withdrawn sans occupation exclusive.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-006 — Demandes concurrentes

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Deux locataires demandent les mêmes dates puis le propriétaire accepte une demande.
- Résultat attendu : La seconde acceptation entre en conflit.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-007 — Créneau bloqué

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Chercher audit-v04-1 du 1 au 3 mai 2027.
- Résultat attendu : Créneau indisponible sans nouvelle réservation.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-008 — Paiement prématuré

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Tenter pay sur une demande requested.
- Résultat attendu : 409 sans changement de paiement.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-009 — Paiement refusé

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Sur awaiting_payment simuler failure puis success.
- Résultat attendu : Échec récupérable puis confirmed.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-010 — Caution séparée

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir la réservation confirmed et simuler le contrôle de caution.
- Résultat attendu : Paiement et caution ont des états distincts.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-011 — Départ incomplet

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Finaliser un constat avec moins de huit vues.
- Résultat attendu : Refus sans finalisation.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-012 — Remplacement de vue

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Reprendre une vue de départ avant finalisation.
- Résultat attendu : Version précédente conservée.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-013 — Remise contrôlée

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Finaliser départ et caution puis audit-o02 confirme les contrôles.
- Résultat attendu : in_progress après remise.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-014 — Compteur incohérent

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Finaliser retour avec compteur inférieur au départ.
- Résultat attendu : Erreur 422 et correction possible.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-015 — Déclaration de retour

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Finaliser le retour puis le déclarer.
- Résultat attendu : return_reported sans clôture automatique.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-016 — Récupération des clés

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-o02 confirme les clés sur return_reported.
- Résultat attendu : returned sans remboursement automatique.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-017 — Clôture et avis

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Clôturer returned puis audit-r02 soumet son avis.
- Résultat attendu : completed et avis pending sans second avis possible.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## B-018 — Profil mixte

- Catégorie : Location ; priorité : P0.
- Profil : audit-r02 / audit-o02.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-o07 consulte sa demande de location sur audit-v03-1.
- Résultat attendu : Le même compte voit son parc et sa location comme locataire.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-001 — Agent limité

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a04 ouvre /cases puis /payments et /moderation.
- Résultat attendu : Dossier affecté visible, deux écrans refusés.
- Contrôle : automatique ; test associé : UI-AUD-03.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-002 — Admin opérationnel

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a05 ouvre /moderation et conserve une session client ouverte.
- Résultat attendu : Modération accessible et sessions distinctes.
- Contrôle : automatique ; test associé : UI-AUD-04.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-003 — Périmètre utilisateurs

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a01 lit /admin/users puis demande audit-r02.
- Résultat attendu : Seuls audit-r01 et audit-o01 sont listés, autre ID refusé.
- Contrôle : automatique ; test associé : AUD-03.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-004 — Document non affecté

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a01 demande doc3 par API.
- Résultat attendu : 403 sans pièce sensible.
- Contrôle : automatique ; test associé : AUD-03.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-005 — Document affecté

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a03 ouvre doc-audit-r02-0.
- Résultat attendu : Document synthétique et revues accessibles.
- Contrôle : automatique ; test associé : AUD-03.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-006 — Revue versionnée

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Remplacer une pièce puis soumettre une décision sur son ancienne version.
- Résultat attendu : 409, nouvelle revue requise.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-007 — Critères manquants

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Valider un document pending sans les cinq critères.
- Résultat attendu : 422 sans validation.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-008 — Annonce rejetée

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Consulter audit-v09-rejected comme propriétaire audit-o09.
- Résultat attendu : Motif visible, annonce absente du catalogue public.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-009 — Dossier sensible

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a02 puis audit-a05 ouvrent le dossier sensible.
- Résultat attendu : 403 pour le premier, accès explicite pour le second.
- Contrôle : automatique ; test associé : AUD-03.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-010 — Note interne

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a04 ajoute une note à son dossier puis audit-r02 le consulte.
- Résultat attendu : Note invisible dans la réponse client.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-011 — Étapes du dossier

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Tenter received vers closed puis avancer une étape.
- Résultat attendu : Saut interdit, transition adjacente acceptée.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-012 — Proposition financière

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a06 ouvre /payments et propose une opération synthétique.
- Résultat attendu : pending_approval, aucune exécution réelle.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-013 — Même personne finance

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Deux comptes de même personId tentent une approbation.
- Résultat attendu : 403 même avec permission explicite.
- Contrôle : automatique ; test associé : AUD-05.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-014 — Modification financière

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Approuver puis modifier le montant synthétique.
- Résultat attendu : Nouvelle version sans approbation valable.
- Contrôle : automatique ; test associé : AUD-05.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-015 — Permission du super-admin

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a08 ouvre documents et finance par URL directe.
- Résultat attendu : Aucun privilège universel.
- Contrôle : automatique ; test associé : AUD-05.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-016 — Double habilitation

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a08 propose finance.read à audit-a04 puis audit-a09 approuve.
- Résultat attendu : Auto-approbation refusée, seconde personne nécessaire.
- Contrôle : automatique ; test associé : AUD-06.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-017 — Suspension en session

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Suspendre audit-a04 après sa connexion puis réutiliser sa session.
- Résultat attendu : API privée refuse immédiatement.
- Contrôle : automatique ; test associé : AUD-06.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## C-018 — Agent déjà suspendu

- Catégorie : Administration ; priorité : P0.
- Profil : audit-a01 à audit-a10 selon action.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Tenter de connecter audit-a10 aux deux applications.
- Résultat attendu : 401, aucun accès accordé.
- Contrôle : automatique ; test associé : AUD-02.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-001 — Double demande

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Répéter POST rentals avec même clé et même contenu.
- Résultat attendu : Même ID de location, un seul effet.
- Contrôle : automatique ; test associé : AUD-04.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-002 — Double exécution sensible

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Répéter execute avec la même clé après approbation.
- Résultat attendu : Une seule opération fictive exécutée.
- Contrôle : automatique ; test associé : AUD-05.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-003 — Clé réutilisée à tort

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Réutiliser la clé de demande avec des dates différentes.
- Résultat attendu : 409 et aucune nouvelle demande.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-004 — Actualiser demande

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Créer une demande puis actualiser sa fiche.
- Résultat attendu : Le même état est relu sans paiement ajouté.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-005 — Fermer le brouillon

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Sauvegarder étape propriétaire, fermer et rouvrir un contexte reconnecté.
- Résultat attendu : Brouillon conservé côté API pour ce compte.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-006 — Redémarrage API

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Redémarrer uniquement une instance jetable puis ouvrir une route privée.
- Résultat attendu : Session en mémoire perdue, reconnexion explicite.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-007 — Session déconnectée

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Déconnecter puis reprendre une URL /rentals.
- Résultat attendu : Connexion requise sans données privées.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-008 — Accès croisé refusé

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-r03 demande une location audit-r02 par ID.
- Résultat attendu : 403 sans données de la location.
- Contrôle : automatique ; test associé : AUD-03.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-009 — Route API absente

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Appeler /api/v1/absent.
- Résultat attendu : 404 structurée.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-010 — Route UI absente

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir /route-inconnue puis revenir au catalogue.
- Résultat attendu : 404 utile et navigation disponible.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-011 — API indisponible

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Simuler error via /demo puis ouvrir /search.
- Résultat attendu : Message d’erreur récupérable.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-012 — Reprise réseau

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Depuis une erreur revenir à /demo et ouvrir /search.
- Résultat attendu : Le réseau simulé est rétabli.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-013 — Réseau lent

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Appliquer slow depuis /demo et naviguer.
- Résultat attendu : Chargement visible, pas d’écran figé définitif.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-014 — Conflit de version

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Deux agents chargent une pièce puis décident sur la même version.
- Résultat attendu : La seconde décision obsolète est refusée.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-015 — État vide

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir /search?state=empty.
- Résultat attendu : Message sans résultat et liens de reprise.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-016 — Dates invalides

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Demander retour avant départ puis corriger.
- Résultat attendu : 422 puis demande possible avec dates cohérentes.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-017 — Campagne neuve

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Modifier la fixture jetable puis créer une nouvelle campagne.
- Résultat attendu : État initial restauré dans une nouvelle cible sans toucher à l’ancienne.
- Contrôle : automatique ; test associé : AUD-07.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## D-018 — Cible non autorisée

- Catégorie : Erreurs et résilience ; priorité : P1.
- Profil : audit-r03 sauf indication.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Charger un fichier hors lp-audit-* ou une mauvaise preuve de cible.
- Résultat attendu : Refus sans écriture ni suppression.
- Contrôle : automatique ; test associé : AUD-07.
- Limites : Simulation JSON, sessions sans mot de passe, paiements et documents fictifs ; aucune décision commerciale validée.

## E-001 — Téléphone en clair

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Lire puis envoyer abuseSamples.phone dans la conversation audit.
- Résultat attendu : Texte observable, aucune règle antifraude inventée.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-002 — Téléphone espacé

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Envoyer abuseSamples.spaced.
- Résultat attendu : Texte conservé pour observation manuelle.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-003 — Téléphone en lettres

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Envoyer abuseSamples.words.
- Résultat attendu : Texte observable sans vraie coordonnée.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-004 — E-mail réservé

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Envoyer contact-audit@example.test.
- Résultat attendu : Aucune notification externe réelle.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-005 — Identifiant social fictif

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Envoyer @audit_exemple_inexistant.
- Résultat attendu : Observer l’aide et le traitement existant.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-006 — Paiement direct

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Envoyer abuseSamples.direct.
- Résultat attendu : Aucun paiement réel déclenché.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-007 — Lien réservé

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Envoyer https://audit.invalid/contact.
- Résultat attendu : Observer la présentation sans visiter un domaine réel.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-008 — Description suspecte

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-o08 insère abuseSamples.description dans sa propre annonce.
- Résultat attendu : Texte observable, aucune décision automatique de fraude.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-009 — Message opportuniste

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Envoyer abuseSamples.opportunistic.
- Résultat attendu : Conversation reste isolée entre participants.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-010 — Message abusif

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-r10 envoie abuseSamples.abuse dans sa propre conversation.
- Résultat attendu : Observer le support existant sans accusation automatique.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-011 — Location d’un tiers

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-r03 demande une location de audit-r02 par ID.
- Résultat attendu : 403 sans fuite.
- Contrôle : automatique ; test associé : AUD-03.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-012 — Document d’un tiers

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a04 demande doc-audit-r02-0.
- Résultat attendu : 403 sans contenu documentaire.
- Contrôle : automatique ; test associé : AUD-03.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-013 — Modification du parc tiers

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-o03 tente edit sur audit-v02-1.
- Résultat attendu : 403, véhicule inchangé.
- Contrôle : automatique ; test associé : AUD-03.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-014 — Action interne publique

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-r02 tente /admin/users.
- Résultat attendu : 403 compte interne requis.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-015 — Auto-attribution

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a08 propose une permission pour lui-même.
- Résultat attendu : 403 pas d’auto-attribution.
- Contrôle : automatique ; test associé : AUD-06.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-016 — Approbation propre

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a06 tente approuver sa proposition.
- Résultat attendu : 403 séparation des personnes.
- Contrôle : automatique ; test associé : AUD-05.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-017 — Message hors conversation

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-r03 poste dans la conversation audit-r09 / audit-o08.
- Résultat attendu : 403 sans nouvel échange.
- Contrôle : automatique ; test associé : AUD-03.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## E-018 — Origine étrangère

- Catégorie : Fraude et abus fictifs ; priorité : P0.
- Profil : audit-r09 / audit-o08, audit-r10.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : POST owner/draft avec Origin https://audit.invalid.
- Résultat attendu : 403, aucun contournement CSRF.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Échantillons réservés et synthétiques ; observation seulement, aucun filtre antifraude ajouté.

## F-001 — Clavier accueil

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Parcourir accueil, recherche et menu uniquement au clavier.
- Résultat attendu : Ordre compréhensible, actions atteignables.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-002 — Focus visible

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Tabuler sur liens, filtres et boutons.
- Résultat attendu : Focus repérable sur toutes les surfaces.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-003 — Formulaire erreurs

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Soumettre un formulaire incomplet puis corriger au clavier.
- Résultat attendu : Libellés et erreurs compréhensibles sans couleur seule.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-004 — Modale galerie

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir et fermer la galerie au clavier.
- Résultat attendu : Focus cohérent à l’entrée et au retour.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-005 — Modale sensible

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir confirmation financière et annuler au clavier.
- Résultat attendu : Aucune exécution à l’annulation.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-006 — Zoom 200 pour cent

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Zoomer client et administration à 200 %.
- Résultat attendu : Texte lisible et commandes atteignables.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-007 — Zoom 400 pour cent

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Examiner formulaires à 400 %.
- Résultat attendu : Identifier les pertes de contenu sans prétendre à une certification.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-008 — Atelier 320

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir /demo/audit en 320px.
- Résultat attendu : Pas de débordement horizontal.
- Contrôle : automatique ; test associé : UI-AUD-05.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-009 — Atelier 375

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir /demo/audit en 375px.
- Résultat attendu : Pas de débordement horizontal.
- Contrôle : automatique ; test associé : UI-AUD-05.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-010 — Atelier 390

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir /demo/audit en 390px.
- Résultat attendu : Pas de débordement horizontal.
- Contrôle : automatique ; test associé : UI-AUD-05.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-011 — Atelier 430

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir /demo/audit en 430px.
- Résultat attendu : Pas de débordement horizontal.
- Contrôle : automatique ; test associé : UI-AUD-05.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-012 — Atelier 768

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir /demo/audit en 768px.
- Résultat attendu : Pas de débordement horizontal.
- Contrôle : automatique ; test associé : UI-AUD-05.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-013 — Atelier 1024

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir /demo/audit en 1024px.
- Résultat attendu : Pas de débordement horizontal.
- Contrôle : automatique ; test associé : UI-AUD-05.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-014 — Atelier 1440

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Ouvrir /demo/audit en 1440px.
- Résultat attendu : Pas de débordement horizontal.
- Contrôle : automatique ; test associé : UI-AUD-05.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-015 — Table utilisateurs

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a05 parcourt /users à 320px au clavier.
- Résultat attendu : Colonnes et actions essentielles accessibles.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-016 — Table modération

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : audit-a05 parcourt /moderation à 375px.
- Résultat attendu : Pas de commande essentielle masquée.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-017 — Contrastes et badges

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Comparer pending/rejected/verified sur les documents.
- Résultat attendu : État identifiable par texte, contraste à mesurer manuellement.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

## F-018 — Lecture assistée

- Catégorie : Accessibilité et responsive ; priorité : P1.
- Profil : audit-r08 / audit-a04 / audit-a05.
- Préconditions : Nouvelle campagne isolée ; sélectionner le profil indiqué dans l’action (sinon celui du groupe). Dates de location : 2027, hors créneaux déjà occupés.
- Fixture : audit-v1.
- Actions : Parcourir atelier et formulaire avec lecteur d’écran réel.
- Résultat attendu : Noms et regroupements compréhensibles, contrôle manuel requis.
- Contrôle : manuel ; test associé : aucun — préparé seulement.
- Limites : Dimensions simulées ; clavier, zoom et lecteur d’écran nécessitent une vérification humaine.

