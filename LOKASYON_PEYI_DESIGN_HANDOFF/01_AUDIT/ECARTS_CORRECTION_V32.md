# Audit de correction V3.2 · après la PR #35

`origin/HEAD` et GitHub désignent `main`. Le 26 novembre 2026, sa tête est [`8a6974e23aab14acbabcd82f21f2bfcd9c0498ce`](https://github.com/Djams0/Maquette_LokasyonPeyi/commit/8a6974e23aab14acbabcd82f21f2bfcd9c0498ce), fusion de [la PR #35](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/35). L’historique de protection remonte à `4338f5f7ca252f4d4f02021ec47a226d0d2d6064`.

## Causes confirmées

1. **Périmètre du shell.** [Le rendu de `client/shell.js`](https://github.com/Djams0/Maquette_LokasyonPeyi/blob/8a6974e23aab14acbabcd82f21f2bfcd9c0498ce/client/shell.js#L78-L109) place le header avant `#main`. Seule la branche `discovery` de ce rendu utilise `header v32` et l’image de charte. Les autres routes reçoivent le bandeau de démo puis un header pleine largeur avec nom en texte. Plusieurs règles de reflow interne sélectionnent le header suivant ce qui est monté dans `#main`. La campagne interne n’a introduit aucun diff de `client/shell.js` depuis le SHA audité historique. [Captures de connexion, profil et tableau](../04_VISUAL_REFERENCES/extension/audit-8a6974e/header.webp)
2. **Portée du lot Fondations.** [Le lot 01](../../docs/audit/LOT_01_FONDATIONS_CLIENT.md) a livré l’échantillon de `/design-system` et des styles sous `#main .client-operational`. B p. 11–12 a guidé ses surfaces, cartes et formulaires; la capsule commune est hors du sélecteur. Le logo WebP officiel, les deux polices et les médias de Deshaies existaient et sont crédités. Les planches montrent l’ordre et la silhouette de la capsule à reprendre. La largeur et les espacements exacts restent à ajuster avec des mesures. [Ressources et crédits](../03_ASSETS/ASSET_MAPPING_EXTENSION.md)
3. **Critères de fermeture trop permissifs pour ces écarts.** La recette de la PR #35 annonce 52 scènes, 295 vues et **95/100** sur les axes pondérés de B-47 dont 5/10 en accessibilité. Elle établit des résultats fonctionnels et de protection publique. Ce score n’approuve ni la capsule ni chacune des compositions internes. L’ancienne série consacrait un lot de fondations au gabarit de contenu et un lot de cohérence à plusieurs surfaces; la fermeture ne rendait pas impérative la présence de la capsule et du logo sur chaque gabarit interne, le rang de l’action payable ni les coordonnées des gestes au premier écran. [Recette du lot 11](../../docs/audit/LOT_11_RECETTE_PREUVES_ARRET.md)
4. **Causes spécifiques au rendu.** La liste locations suit l’ordre renvoyé après filtrage, le fil place sa réponse après le flux et l’aide, et le dashboard propriétaire adapte les compteurs à un minimum de 7 rem. [Liste locations](https://github.com/Djams0/Maquette_LokasyonPeyi/blob/8a6974e23aab14acbabcd82f21f2bfcd9c0498ce/client/pages/rentals.js#L200-L225) · [Zone de réponse](https://github.com/Djams0/Maquette_LokasyonPeyi/blob/8a6974e23aab14acbabcd82f21f2bfcd9c0498ce/client/pages/messaging.js#L28-L38) · [Grille propriétaire](https://github.com/Djams0/Maquette_LokasyonPeyi/blob/8a6974e23aab14acbabcd82f21f2bfcd9c0498ce/client/styles/client.css#L2197). La même largeur mobile produit ainsi un paiement relégué, un bouton d’envoi hors de la vue initiale et un second rang de compteurs devant les deux gestes. Les styles communs doivent être corrigés en R01. Les critères du contenu restent attribués aux lots suivants, avec reprise de leurs mesures après intégration de R01.

## Protocole de comparaison et preuves

- Chromium 141.0.7390.37 et Playwright 1.56.1 sous Linux, Node 24, `fr-FR`, `America/Guadeloupe`, DPR 1, mouvement réduit et horloge navigateur `2026-11-21T16:00:00Z`. Instance `npm run audit:start` réinitialisée, comptes du mock uniquement, zéro erreur JavaScript sur les **80 captures** (40 scènes × 2 tailles). Les montages conservent des extraits redimensionnés. Les mesures ci-dessous sont en pixels CSS au viewport original, avec `x,y,largeur,hauteur`. Au calendrier, on s’est placé sur l’ancre; ailleurs, les mesures de premier écran sont au scroll initial.
- Pour comparer aux planches, lire l’état et la zone indiqués avec chaque ID. Pour B-16, la fixture affiche le même modèle fictif dans trois états et des dates/montants différents. Pour B-24, le fil court affiche trois échanges alternés sur v1 avec texte et horodatages différents; la conversation du véhicule reste identifiable. B-33 illustre Noa, une Peugeot et cinq véhicules. Le scénario d’audit est `audit-o02`, une demande, un véhicule et un brouillon étape 5. Comparer hiérarchie, rang, densité et disponibilité des actions, en ignorant les différences de valeur des données d’illustration.
- Demande v1 les 10–14 juin 2027, 09 h Guadeloupe, avec brouillon de location de ce véhicule. Le suivi confirmé de B-18 a été photographié avant la caution sur une instance fraîche. Le suivi de retour déclaré est montré côté propriétaire. Départ du constat à 5/8 (`audit-LP-006`, caution validée) et retour finalisé à 8/8 (`audit-LP-004`) chacun à deux largeurs. Le montage Assistance couvre le dossier nominal, l’avis du `audit-LP-003` clôturé pendant la préparation et le reçu du `audit-LP-002`. Le dossier de départ est reçu sans échange, tandis que B-28 inclut des échanges. Le récapitulatif de publication photographié à l’étape 9 part d’un brouillon incomplet. R06/R08 préparent les états complets avant leur comparaison. Les essais de refus de caméra, clavier virtuel, lecteur d’écran, appareil physique et impression physique restent à mener pendant les lots concernés.
- [Mesures des 80 vues](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Header](../04_VISUAL_REFERENCES/extension/audit-8a6974e/header.webp) · [Locations, suivi et constats](../04_VISUAL_REFERENCES/extension/audit-8a6974e/locations.webp) · [Messagerie](../04_VISUAL_REFERENCES/extension/audit-8a6974e/messagerie.webp) · [Assistance et clôture](../04_VISUAL_REFERENCES/extension/audit-8a6974e/assistance.webp) · [Propriétaire](../04_VISUAL_REFERENCES/extension/audit-8a6974e/proprietaire.webp) · [Compte et publication](../04_VISUAL_REFERENCES/extension/audit-8a6974e/publication.webp).

## Écarts mesurés à 390 × 844

| ID | Constat au chargement | Comparaison à effectuer après correction |
| --- | --- | --- |
| HDR-01 | Sur connexion, profil et tableau propriétaire, le bandeau occupe y=0–56, le header pleine largeur y=56–129, avec logo texte. À 1440, bandeau y=0–35 et header y=35–123. Le menu s’ouvre à Entrée, se ferme à Échap et rend le focus sur les deux largeurs. | B-13/15/33, bande supérieure uniquement · capsule blanche, logo officiel chargé et commandes par rôle. |
| LOC-01 | À venir sur audit-r02, « Voir le détail » de la réservation confirmée est à y=706. « Continuer vers le paiement simulé » est en deuxième carte à y=1197, sous un viewport utile arrêté à y=771 par la barre basse. | B-16, premier rang et carte mobile · remettre le paiement en première carte et rendre le geste visible. |
| MSG-02 | Fil court de trois échanges · le champ commence à y=821, hauteur 96, et le bouton Envoyer à y=998, hauteur 48. Le fil long mesuré produit les mêmes positions au chargement dans cette configuration. | B-24, zone de réponse · y compris saisie et envoi dans le premier écran du fil court. |
| OWN-02 | Deux compteurs à y=415 et le troisième à y=517. « Examiner la demande » commence à y=851, « Reprendre le brouillon » à y=1124. La barre basse commence à y=771. | B-33, compteurs et deux actions · trois compteurs sur une rangée et deux boutons entièrement au-dessus de la barre. |
| ACC-01 | La photo de Deshaies est effectivement chargée sur ordinateur, à droite du formulaire, et la figure y a un crédit. Sur mobile, la figure est masquée. | B-13, carte et panneau droit · préserver ce comportement, comparer le cartouche, l’espacement et le CTA après R01. |
| OWN-05 | Ancre de gestion confirmée. Sur ordinateur la grille a une surface mesurée, sur mobile elle est masquée et les périodes sont affichées. | B-36, agenda puis action · mesurer accès après ouverture de l’ancre, densité, ordre et visibilité du blocage. |

## Protection publique et limites

Avec le capteur natif et la graine historique dans les deux arbres, comparaison de `4338f5f` à `8a6974e` sur huit largeurs par route. **20/24 paires identiques**, quatre micro-diffs sur le catalogue (390, 430, 1280, 1440), chacun de 11 à 101 pixels et un écart maximal de canal de 4/255. Un témoin indépendant sur `8a6974e` présente aussi trois micro-diffs sur le catalogue (320, 1280, 1440, jusqu’à 106 pixels et 3/255). Aucun écart de contenu ou de géométrie n’a été observé sur ces paires. L’accueil et la fiche v3 sont identiques aux deux comparaisons. Respecter le même environnement pour évaluer une régression et refaire un témoin si nécessaire. [Relevé des paires](../04_VISUAL_REFERENCES/extension/audit-8a6974e/PUBLIC.csv) · [protocole R01–R09](../08_VALIDATION/PROTECTED_PAGES_TESTS.md).

Tests navigateur ciblés navigation **11/11** dont retour, changement de session, menu clavier et récupération. Contrôles de syntaxe, Node **50/50**, Python **2/2**, smoke des trois services. La PR #35 documente la dernière suite complète historique. La réserve du tiroir **PUB-01** est reprise dans la recette des lots avec répétitions de part et d’autre. Une mesure visuelle de départ établit ce qui est observé et laisse ouverts les états à rejouer ou à arbitrer.

## Écarts et vérifications par identifiant

### HDR-01

`[shell interne]` · B p. 11, 13, 15, 16, 24, 25, 33, 43, 44, 45 · Bande supérieure des cadres client et propriétaire. Shell monté avant #main, logo image et classe v32 réservés à discovery, bandeau au-dessus et logo texte ailleurs. Code et captures ciblées. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/header.webp) · [Lot R01](../07_CODEX_PROMPTS/correction-v32/R01_HEADER_NAVIGATION.md)

### HDR-02

`[barre basse et détail]` · B p. 15, 16, 17, 18, 24, 25, 27, 33, 43, 44 · Bas des vues racines et retour au-dessus du contenu. navigationState classe les racines et détail mais plusieurs routes ont des surcharges CSS de shell liées à leur contenu. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/header.webp) · [Lot R01](../07_CODEX_PROMPTS/correction-v32/R01_HEADER_NAVIGATION.md)

### ACC-01

`/login` · B p. 13 · Carte formulaire, panneau photo et bandeau de contexte. La photo et les modes existent déjà, le shell actuel et les espacements sont à comparer. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/header.webp) · [Lot R02](../07_CODEX_PROMPTS/correction-v32/R02_COMPTE.md)

### ACC-02

`/register` · B p. 13, 14 · Modes et carte de création. Mêmes modes et figure partagés dans account.js. B-14 donne une cible inscription mobile. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/publication.webp) · [Lot R02](../07_CODEX_PROMPTS/correction-v32/R02_COMPTE.md)

### ACC-03

`/profile` · B p. 15 · Bandeau menthe, liste « Votre compte », rail propriétaire/aide. Le code sépare les liens du compte et les liens complémentaires, leur ordre et densité se vérifient contre B-15. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/header.webp) · [Lot R02](../07_CODEX_PROMPTS/correction-v32/R02_COMPTE.md)

### ACC-04

`/profile/documents` · B p. 14 · Pile de pièces et motif d’état. Soumission, version et motifs existent. B-14 illustre permis et identité à comparer avec le même état. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/publication.webp) · [Lot R02](../07_CODEX_PROMPTS/correction-v32/R02_COMPTE.md)

### LOC-01

`/rentals` · B p. 16, 27 · Onglets et ordre des cartes, première action. Le tableau items est filtré puis parcouru dans l’ordre du mock. Pas de priorité dérivée du geste. La fixture de base contient les trois états. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/locations.webp) · [Lot R03](../07_CODEX_PROMPTS/correction-v32/R03_LOCATIONS_SUIVI_PAIEMENT.md)

### LOC-02

`/request/:id` · B p. 17 · Carte trajet, dates, estimation et formulaire. Récap, estimation et sauvegarde existent. Contrôler la densité et la place des explications à données appariées. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/locations.webp) · [Lot R03](../07_CODEX_PROMPTS/correction-v32/R03_LOCATIONS_SUIVI_PAIEMENT.md)

### LOC-03

`/rental/:id` · B p. 18, 19 · Carte d’action, étapes et panneau de contexte. Carte et progression déjà présentes selon rentals.js et rapport lot 04. Deux états distincts sur B-18. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/locations.webp) · [Lot R03](../07_CODEX_PROMPTS/correction-v32/R03_LOCATIONS_SUIVI_PAIEMENT.md)

### LOC-04

`/payment/:id` · B p. 20 · Contexte, avis, sélection du résultat, estimation. Avis, sélecteur, caution et reprise existent. Alignement à vérifier sur échec apparié. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/locations.webp) · [Lot R03](../07_CODEX_PROMPTS/correction-v32/R03_LOCATIONS_SUIVI_PAIEMENT.md)

### CON-01

`/inspection/:id/:phase` · B p. 21, 22 · Progression, vues, prochaine capture et observations. Vue guidée et 8 vues existent. CSS et captures à comparer pour ordre des cartes et lisibilité en état apparié. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/locations.webp) · [Lot R04](../07_CODEX_PROMPTS/correction-v32/R04_CONSTATS.md)

### CON-02

`/inspection/:id/:phase` · B p. 23 · Caméra simulée et refus de capture. Dialogues et reprise sont implémentés dans inspection.js et vérifiés en lot 05. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/locations.webp) · [Lot R04](../07_CODEX_PROMPTS/correction-v32/R04_CONSTATS.md)

### MSG-01

`/messages` · B p. 24, 25, 27 · Boîte de réception, filtre, sélection et vide. Liste et panneau existent. Vérifier densité, sélection et sortie à données comparables. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/messagerie.webp) · [Lot R05](../07_CODEX_PROMPTS/correction-v32/R05_MESSAGERIE_NOTIFICATIONS.md)

### MSG-02

`/messages?conversation=:id` · B p. 24, 25 · Carte contexte, historique et zone de réponse. Formulaire après le flux, aide et bouton empilé au mobile. Mesurer le champ et le bouton avant focus et sans défilement. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/messagerie.webp) · [Lot R05](../07_CODEX_PROMPTS/correction-v32/R05_MESSAGERIE_NOTIFICATIONS.md)

### MSG-03

`/notifications` · B p. 26, 27 · Liste lue/non lue et état vide. État vu et vide existent dans account.js. Déterminer les écarts par état. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/messagerie.webp) · [Lot R05](../07_CODEX_PROMPTS/correction-v32/R05_MESSAGERIE_NOTIFICATIONS.md)

### SUP-01

`/faq` · B p. 29 · Champ recherche, accordéons et aide visiteur puis connecté. Fonction locale déjà déployée dans support.js. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/assistance.webp) · [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md)

### SUP-02

`/assistance` · B p. 28, 44 · Formulaire de motif et contexte clientèle. /assistance appelle cases('new') comme /cases/new, sans nouvelles données. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/assistance.webp) · [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md)

### SUP-03

`/cases/new` · B p. 28 · Formulaire et action ouvrir un dossier. Alias du formulaire dans client/app.js. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/assistance.webp) · [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md)

### SUP-04

`/cases` · B p. 30, 27 · Carte dossier et CTA ouvrir. Liste, filtre de droits et lien ouvrir existent dans support.js. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/assistance.webp) · [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md)

### SUP-05

`/cases/:id` · B p. 28, 30 · Statut, échanges et aide rapide. Le détail est déjà rendu. B-28 illustre dossier avec échanges, ajouter un échange fictif pour le comparatif corrigé. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/assistance.webp) · [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md)

### SUP-06

`/profile/reviews` · B p. 30 · Mes avis, statut de modération. La graine initiale contient review-demo, vérifier différence publié/en revue. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/assistance.webp) · [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md)

### SUP-07

`/review/:id` · B p. 31 · Deux notes, commentaire et validation. La fixture audit-LP-002 contient déjà un avis, capture de cet état distinct du formulaire illustré. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/assistance.webp) · [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md)

### SUP-08

`/receipt/:id` · B p. 31 · En-tête fictif, détails et impression. Écran et CSS impression existent. Comparer le reçu PDF mobile avec le même état. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/assistance.webp) · [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md)

### OWN-01

`/owner/start` · B p. 32 · Bandeau littoral et estimation. Le panorama et l’estimateur existent. Vérifier rendu, point focal et densité en comparaison. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/proprietaire.webp) · [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md)

### OWN-02

`/owner` · B p. 33, 42 · Trois compteurs, demande, brouillon et aperçu du parc. Deux actions existent dans le DOM. Sur mobile la CSS de la grille utilise auto-fit avec minimum 7rem et la sous-navigation consomme de la hauteur. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/proprietaire.webp) · [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md)

### OWN-03

`/owner/vehicles` · B p. 34 · Filtres, ajout et cartes du parc. Liste/grille et filtres existent, mobile utilise details ouvert dans owner-workspace.js. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/proprietaire.webp) · [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md)

### OWN-04

`/owner/vehicles/:id` · B p. 35 · Photo, statut et opérations. Ancres et contrôle de gestion existent, mesurer leur ordre et densité de rendu. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/proprietaire.webp) · [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md)

### OWN-05

`/owner/vehicles/:id#owner-calendar` · B p. 36 · Calendrier et formulaire de blocage. Grille et liste existent déjà via calendrier intégré, top du viewport doit être positionné sur l’ancre. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/proprietaire.webp) · [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md)

### OWN-06

`/owner/requests` · B p. 37 · Filtres et carte examinable. Les cartes ouvrent déjà le suivi, vérifier regroupement et place des états. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/proprietaire.webp) · [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md)

### OWN-07

`/owner/revenue` · B p. 38 · Indicateurs et paiements simulés. Le brut, le fictif et le net non défini sont implémentés. B-38 bureau sert de cible pour les revenus. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/proprietaire.webp) · [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md)

### OWN-08

`/owner/reputation` · B p. 38 · Avis, statut et réponse du propriétaire. Réputation et réponse existent dans owner-workspace.js. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/proprietaire.webp) · [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md)

### WIZ-01

`/owner/vehicles/new` · B p. 39, 41 · Quatre sections et neuf étapes, vues de photos. Le code implémente les neuf groupes. Comparer présentation B-39 et état remanent de la saisie. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/publication.webp) · [Lot R08](../07_CODEX_PROMPTS/correction-v32/R08_PUBLICATION_BROUILLONS.md)

### WIZ-02

`/owner/vehicles/new` · B p. 23, 40, 41 · Récapitulatif, conflit et envoi. Conflits et envoi sont déjà traités, la preuve doit montrer le même état que les panneaux B-23 et B-40. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Captures de la famille](../04_VISUAL_REFERENCES/extension/audit-8a6974e/publication.webp) · [Lot R08](../07_CODEX_PROMPTS/correction-v32/R08_PUBLICATION_BROUILLONS.md)

### OUT-01

`/demo` · B p. 10, 44 · Entrée outils et identité fictive. Accès menu/pied présents, récupération réseau défendue dans app.js. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md)

### OUT-02

`/demo/audit` · B p. 10, 44 · Atelier d’audit et retour outils. Atelier distingue la fixture et route de récupération dans app.js. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md)

### OUT-03

`/design-system` · B p. 10, 11, 12 · Échantillons visuels opérationnels et interactions. Les fondations ont surtout été livrées sur cette page selon le rapport Lot 01. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md)

### TRV-01

`[états transversaux]` · B p. 12, 27, 43, 44, 45, 46, 47, 48 · Chargement, erreur, vide, refus, 404 et changement de session. Code prévoit le gel de l’identité, erreurs et reprise par page. Vérifier leur cohérence et les cas sans preuve. [Mesures](../04_VISUAL_REFERENCES/extension/audit-8a6974e/MESURES.csv) · [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md)

### PRG-01

`/` · B p. 3, 43, 44 · Capsule, recherche et parcours existants. PR #35 a comparé 24 paires au total, sans preuve visuelle interne individuelle. [Mesures des paires](../04_VISUAL_REFERENCES/extension/audit-8a6974e/PUBLIC.csv) · [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md)

### PRG-02

`/search` · B p. 3, 43, 44 · Catalogue et tiroir. Le tiroir a une réserve historique nommée PUB-01. Cette ligne décrit la couverture de la route pour la correction. [Mesures des paires](../04_VISUAL_REFERENCES/extension/audit-8a6974e/PUBLIC.csv) · [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md)

### PRG-03

`/vehicle/:id` · B p. 3, 43, 44 · Fiche v3, média et retour. Les comparatifs publics du lot 11 donnent les références complémentaires confirmées. [Mesures des paires](../04_VISUAL_REFERENCES/extension/audit-8a6974e/PUBLIC.csv) · [Lot R09](../07_CODEX_PROMPTS/correction-v32/R09_RECETTE_FINALE.md)
