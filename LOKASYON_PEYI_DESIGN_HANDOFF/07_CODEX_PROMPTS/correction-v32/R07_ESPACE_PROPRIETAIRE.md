# R07 · Espace propriétaire et calendrier

## Mission

Travaille dans `Djams0/Maquette_LokasyonPeyi`. Livrer espace propriétaire et calendrier selon les zones indiquées ci-dessous. Utiliser la variante interne validée en R01. Les planches renseignent le visuel, le mock fournit les permissions, les données, les actions et les transitions. Les contrats API, l’administration et les pages publiques relèvent du protocole de préservation du dépôt.

## Point de départ Git

Le diagnostic de référence porte sur `8a6974e23aab14acbabcd82f21f2bfcd9c0498ce`. À cette exécution, vérifier la branche par défaut et le SHA courant via `git fetch origin`, `git remote show origin`, `git rev-parse origin/main` et `git status --short`. Vérifier l’ascendance du jalon avec `git merge-base --is-ancestor 8a6974e23aab14acbabcd82f21f2bfcd9c0498ce origin/main`. Vérifier le commit du handoff et les SHA de fusion des lots précédents dans [le suivi](../../09_IMPLEMENTATION/PROGRESS_TRACKER.md) ou via leurs PR. Entrée · [R06](R06_ASSISTANCE_CLOTURE.md) validé et intégré, avec tous ses prérequis transitifs. Partir du `main` réel propre, créer `correction-v32/r07-espace-proprietaire` et consigner le point de départ et l’écart éventuel au jalon.

## Sources à ouvrir

[B-32](../../04_VISUAL_REFERENCES/extension/planches/B-32.jpg), [B-33](../../04_VISUAL_REFERENCES/extension/planches/B-33.jpg), [B-34](../../04_VISUAL_REFERENCES/extension/planches/B-34.jpg), [B-35](../../04_VISUAL_REFERENCES/extension/planches/B-35.jpg), [B-36](../../04_VISUAL_REFERENCES/extension/planches/B-36.jpg), [B-37](../../04_VISUAL_REFERENCES/extension/planches/B-37.jpg), [B-38](../../04_VISUAL_REFERENCES/extension/planches/B-38.jpg), [B-42](../../04_VISUAL_REFERENCES/extension/planches/B-42.jpg)

Ouvrir le [PDF B](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf) et [son index de pages](../../00_SOURCE_OF_TRUTH/INDEX_PDF.md), le [PDF A](../../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf) pour la direction générale et les [arbitrages de sources](../../00_SOURCE_OF_TRUTH/SOURCES_ET_ARBITRAGES.md). Fiches de ce lot · [OWNER_DASHBOARD](../../05_SCREEN_SPECS/OWNER_DASHBOARD.md) · [OWNER_REQUESTS](../../05_SCREEN_SPECS/OWNER_REQUESTS.md) · [OWNER_VEHICLES](../../05_SCREEN_SPECS/OWNER_VEHICLES.md). Pour les ID et leur preuve initiale, ouvrir [l’audit](../../01_AUDIT/ECARTS_CORRECTION_V32.md). Pour les médias et les styles, lire [mappings et crédits](../../03_ASSETS/ASSET_MAPPING_EXTENSION.md) et le [design system](../../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md).

## Fichiers et scénarios

Examiner depuis la racine · `client/pages/owner.js`, `client/pages/owner-workspace.js`, `client/pages/owner-state.js`, `client/pages/vehicle-presentation.js`, `client/styles/client.css`. Ouvrir les fiches liées pour les composants et permissions détaillés.

- **OWN-01 · `/owner/start`** — Visiteur puis locataire éligible et propriétaire déjà activé. Zone · Bandeau littoral et estimation.
- **OWN-02 · `/owner`** — audit-o02, demande audit-LP-009 et brouillon sauvegardé step=5, un véhicule. Zone · Trois compteurs, demande, brouillon et aperçu du parc.
- **OWN-03 · `/owner/vehicles`** — owner avec publié/en revue puis audit-o01 sans véhicule ou brouillon. Zone · Filtres, ajout et cartes du parc.
- **OWN-04 · `/owner/vehicles/:id`** — owner sur v1 et audit-o02 sur son véhicule, tester autre compte. Zone · Photo, statut et opérations.
- **OWN-05 · `/owner/vehicles/:id#owner-calendar`** — owner audit-o02 sur audit-v02-1 en mars 2027, avec demande/occupé et blocage de test. Zone · Calendrier et formulaire de blocage.
- **OWN-06 · `/owner/requests`** — audit-o02 sur requested puis filtre vide. Zone · Filtres et carte examinable.
- **OWN-07 · `/owner/revenue`** — audit-o02 avec payé simulé puis audit-o01 sans données. Zone · Indicateurs et paiements simulés.
- **OWN-08 · `/owner/reputation`** — owner avec review-demo, audit-o01 vide. Zone · Avis, statut et réponse du propriétaire.

## Rendu et gestes à préserver

Prendre B-32 à B-38 et B-42. Pour /owner, utiliser audit-o02 et la demande audit-LP-009, préparer son brouillon enregistré avec `step=5` via le chemin du mock dans une instance jetable. À 390 × 844 et scroll=0 rapprocher la densité de B-33. Les trois compteurs sont sur la même rangée et « Examiner la demande » puis « Reprendre le brouillon » sont chacun entièrement visibles au-dessus de la barre basse. Mesurer x/y/largeur/hauteur et vérifier que les liens rejoignent le dossier et l’étape. Sur ordinateur, retrouver le rail brouillon à droite. Le nombre de voitures et les titres sont ceux de la fixture, documenter la différence avec Noa/Peugeot/5 de B-33.

Sur /owner/start, comparer le panorama crédité et l’estimateur; sur parc et gestion, conserver les filtres et la photo de modèle appropriée. Accéder au calendrier depuis le raccourci d’une annonce et à `/owner/vehicles/:id#owner-calendar`. Grille mensuelle et formulaire de blocage alignés au bureau. Agenda chronologique avec états distingués, puis commande de blocage sur mobile. Garder le focus au retour de mutation et le refus conflit vérifié avec test 409. Les demandes pointent vers la décision dans le suivi, le revenu est brut simulé et la réputation garde les droits actuels. Capturer introduction/activation, tableau mixte, parc mixte, gestion/agenda, demande/vide, revenus/vide, réputation/réponse.

## Validation observable

- **OWN-01** · CTA et hiérarchie au premier écran. Rendu synthétique et crédit aux deux largeurs.
- **OWN-02** · Prendre les boîtes des trois compteurs et des deux boutons au chargement. Même y pour compteurs, boutons entiers au-dessus de barre et sans défilement.
- **OWN-03** · Capturer parc mixte/filtre actif/vide avec nom/statut/action. Retour exact après gestion.
- **OWN-04** · Comparatif B-35 et test de 403/retour/filtre, état du média et déclenchement d’ancre.
- **OWN-05** · Comparer depuis l’ancre aux deux largeurs. Bloquer puis libérer, vérifier 409 et rang agenda.
- **OWN-06** · Captures état actif/vide et retour exact après décision.
- **OWN-07** · Capture payé et vide aux deux largeurs, total recalculé sur données du compte.
- **OWN-08** · Comparer vue mobile B-38 puis tester réponse personnelle/tiers et cas vide.

## Exécuter les vérifications

Utiliser Node 24, Playwright 1.56.1, Chromium 141, Python et une instance jetable. `npm run audit:start` charge audit-v1. Initialiser les données manquantes via le mock et les scénarios des tests, sans toucher aux jeux de travail de l’utilisateur. Le premier travail du lot est de relever **avant modification** les routes et états ci-dessus à **390 × 844** et **1440 × 960**. Garder rôle, état, heure, données de simulation, scroll, DPR, navigateur et taille identiques au rejeu.

```bash
npm run check
npm test
python3 -m unittest discover -s tests -p 'test_*.py'
(cd LOKASYON_PEYI_DESIGN_HANDOFF && python3 tools/verify_v32.py && python3 tools/verify_extension.py)
npx playwright test tests/browser/owner.spec.js tests/browser/booking.spec.js tests/browser/navigation.spec.js
```

Sur une instance démarrée, lancer `npm run smoke`. Appliquer la [protection publique](../../08_VALIDATION/PROTECTED_PAGES_TESTS.md) et les [commandes de capture/comparaison](../../tools/README.md) avec deux instances historiques jetables, successivement si elles partagent les ports. Exécuter aussi les essais de rôles et d’interactions concernés. Relever le résultat brut de chaque essai, avec l’impact d’un essai omis. Garder le test PUB-01 et qualifier ses résultats séparément.

## Preuves, PR et passage

Prendre les captures corrigées au SHA de la PR. Pour chacun des ID, fournir la zone de **la planche validée côte à côte avec le rendu corrigé**, l’avant/après du site et le diff Git. Quand B illustre une seule largeur ou un autre modèle, nom, prix ou date, nommer les différences, comparer les zones homologues et préciser les dimensions interprétées. Pour les gestes visibles sans défilement, mesurer les boîtes à scroll nul et vérifier les recouvrements. Joindre les états complémentaires, contrôles clavier et preuves protégées. Rendre les artefacts expurgés accessibles depuis la PR.

Ouvrir une PR `R07 · Espace propriétaire et calendrier` ciblant `main`, avec les trois résultats du [modèle de revue](../../09_IMPLEMENTATION/REVIEW_TEMPLATE.md) pour chaque case de la [matrice](../../08_VALIDATION/CORRECTION_V32.csv). Consigner chaque écart visible, sa preuve, son impact et la décision attendue. Un écart majeur de marque, navigation ou geste garde la ligne ouverte. Si la taille du diff empêche une revue cohérente, proposer des PR de même lot et apporter la preuve complète avant de le déclarer fini. Mettre à jour le suivi et livrer le verdict. Suite · [R08](R08_PUBLICATION_BROUILLONS.md) après intégration du GO.
