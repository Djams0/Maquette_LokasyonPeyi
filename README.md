# R01 · Preuves de recette

- PR [#37](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/37), base distante `f74a4fffd025518479685334763f226f827e503a`, candidat `2865d3157141705dfb5ec91e8f2f27407ffb72c7`.
- La PR #36 a intégré le handoff `c8a342aad9dd94befea1c3649d92d4008083d4d1`. Le jalon de diagnostic `8a6974e23aab14acbabcd82f21f2bfcd9c0498ce` est son premier parent. L’écart du jalon à la base est documentaire. Le checkout initial était sur une ancienne branche et portait onze suppressions locales du handoff historique. R01 est parti d’un arbre dédié propre après `fetch`, `remote show`, `rev-parse`, `status` et contrôle d’ascendance.
- Ascendance vérifiée sur le premier parent de main. Lot 00 `1fb9b15` (#23), intégration publique `006fdca` (#24), lots 01 à 11 `6221d2b`, `1156c47`, `a355918`, `545494a`, `8dcd9dd`, `5536a97`, `82be4b2`, `6241952`, `91960ab`, `7b8f305`, `8a6974e` (#25 à #35).

## Comparatifs

| Critère | 390 × 844 | 1440 × 960 |
| --- | --- | --- |
| HDR-01 · Capsule et commandes par rôle | [Planche, avant et après](planches/HDR-01-390.webp) | [Planche, avant et après](planches/HDR-01-1440.webp) |
| HDR-02 · Barre basse, actifs et retours | [Planche, avant et après](planches/HDR-02-390.webp) | [Planche, avant et après](planches/HDR-02-1440.webp) |

- [Captures internes originales et boîtes DOM](captures-internes.zip) · [Contrôles DOM](CONTROLES_DOM.csv) · [Boîtes des retours](RETOURS.csv).
- [Réouverture, boucle Tab et focus rendu](clavier) · [assertions clavier et zones sûres](clavier/essais.json).
- [24 comparaisons publiques visiteur](public/visiteur) · [pixels et boîtes](PUBLIC.csv) · [diffs produits par compare_v32](public-diffs.zip).
- [12 comparaisons publiques connectées](public/connecte) · [pixels et boîtes](PUBLIC_CONNECTE.csv) · [captures publiques originales et témoin](public-captures-originales.zip).
- [Diff applicatif et tests](diff-r01.patch) · [Sorties des commandes](resultats).

## Dimensions et lecture des planches

Les extraits B montrent la zone homologue à échelle réduite. L’échelle mobile du cadre se déduit de son indication 390 px. La capsule couvre environ 91–93 % du cadre sur B-13/15/16/24/33, soit 355–363 px. Elle représente environ 55–60 px de hauteur. Le logo illustré mesure environ 116–125 px en largeur. Sur ordinateur, le cadre de la planche couvre un espace de contenu représenté en coupe. B-43 guide son étendue vers 1 200 px. Les proportions de B suggèrent 60–68 px pour la hauteur de capsule et environ 135–155 px pour le logo.

| Mesure CSS à scroll nul | 390 × 844 | 1440 × 960 |
| --- | --- | --- |
| Capsule | x 16, y 12, 358 × 56 | x 112, y 16, 1 216 × 64 |
| Logo | 124 × 22,2 | 154 × 27,5 |
| Contrôles de droite | 44 px minimum, intervalle 4 px | 44 px minimum, intervalle 4 px |
| Barres racines | 65 px, y 779, quatre cibles d’au moins 56 px | Navigation haute |
| Alignement | Retour et contenu principal à 16 px dans le gabarit courant | Bord de capsule à 112 px, contenu opérationnel plafonné à 1 200 px à 120 px du bord |
| Ressource | `/assets/v32/marque/logo-horizontal-charte.webp`, 683 × 122 intrinsèques | Même ressource et proportions |

Le bandeau de démonstration occupait le sommet de l’écran initial. La variante actuelle garde sa mention globale dans le pied et donne accès aux outils depuis le menu. Les mentions fictives dans les actions métier sont présentes.

## Scènes et données

- Windows, Node 24.22.3, Playwright 1.56.1, Chromium 141.0.7390.37, `fr-FR`, `America/Guadeloupe`, DPR 1, mouvement réduit, couleurs claires, heure navigateur fixe `2026-11-21T16:00:00Z`. Les captures de comparaison sont prises dans les deux révisions au scroll initial.
- Deux jeux jetables de la graine historique servent aux vues publiques. Les vues internes avant et après utilisent audit-v1 via `npm run audit:start`. Des instances mémoire isolées ajoutent le fil court de trois messages alternés sur v1 et un brouillon étape 5 à audit-o02. Les scénarios complémentaires gardent les mêmes données des deux côtés.
- B-13 affiche Camille Démo et Deshaies. B-15 montre Noa propriétaire sur ordinateur, puis Camille locataire sur mobile. Le test demandé emploie audit-r02 aux deux largeurs. Sur ce profil, Compte est exact sur ordinateur. La barre reprend les quatre destinations locataires de B-15 sans sélection de Documents.
- B-16/17/18 illustrent Peugeot, Clio, Duster et des périodes ou prix différents. La fixture rend les véhicules de démonstration et des états cohérents avec le mock. Le suivi confirmé locataire tient lieu de comparaison desktop. Le retour déclaré propriétaire correspond à l’exemple mobile. B-20 illustre un paiement refusé tandis que la capture présente le paiement attendu. B-21 montre cinq vues enregistrées et la capture documente le début du constat. B-24 illustre Peugeot 208 et des textes et heures différents. Le fil apparié reprend v1, trois messages alternés et le retour avec `q=remise`. B-25 fournit une référence mobile pour la boîte. B-24 sert d’appui desktop.
- B-33 montre Noa, cinq véhicules et un brouillon de Clio. Le scénario apparié emploie audit-o02, un véhicule, une demande et un brouillon étape 5. B-33 montre la sous-navigation sur ordinateur et la barre à quatre liens sur mobile. L’actif du parcours est Mon parc (parent), avec Aujourd’hui exact dans la sous-navigation desktop.
- Pour les outils, B-44 fixe l’accès transverse et B-13 sert de référence pour la capsule visiteur. Les erreurs 403/404 prennent la même variante. Pour la consultation du fil desktop, le retour explicite déjà présent est conservé au-dessus du contenu afin de garder le filtre. Les contenus de compte, ordre des cartes, premier écran de réponse et densité du tableau restent documentés par R02, R03, R05 et R07 dans la matrice.

## Inventaire du montage

Le client monte un seul header du shell avant `#main`. Le rôle se détermine avec `/me`. Lors d’une restauration de page privée, le contenu et les commandes de la session précédente sont masqués pendant la revalidation. Le header est monté selon la route dès l’entrée.

| Surfaces | Routes et variantes |
| --- | --- |
| Découverte protégée | `/`, `/search`, `/vehicle/:id`. Shell public et pied propre à la fiche. |
| Visiteur | `/login`, `/register`, `/faq`, `/owner/start`. Connexion et Menu sur mobile. |
| Racines de compte | `/profile`, `/rentals`, liste de `/messages`. Barre mobile pour une session active. |
| Documents et activité | `/profile/documents`, `/profile/reviews`, `/notifications`. Retour contextuel et barre globale absente. |
| Réservation | `/request/:id`, `/rental/:id`, `/payment/:id`, `/inspection/:id/:phase`. Retours métier avec période, filtre ou contexte préservés. |
| Conversation | `/messages?conversation=…`. Retour à la boîte avec q, Messages est un parent dans la navigation disponible. |
| Assistance et clôture | `/assistance`, `/cases`, `/cases/new`, `/cases/:id`, `/review/:id`, `/receipt/:id`. |
| Propriétaire | `/owner` avec barre mobile, `/owner/vehicles`, `/owner/vehicles/:id` et son calendrier, `/owner/requests`, `/owner/revenue`, `/owner/reputation`, `/owner/vehicles/new`. |
| Outils et erreurs | `/demo`, `/demo/audit`, `/design-system`, refus d’accès et route inconnue. Reprise par Menu ou pied, avec connexion et récupération selon le contexte. |

Le clavier virtuel d’un appareil physique et le lecteur d’écran n’ont pas été utilisés. La preuve couvre le focus réel dans Chromium, le reflow à 320 px, les tests de texte à 200 % et les insets émulés à 24/34 px. Ces essais ne mesurent pas le redimensionnement propre au clavier d’un téléphone.

Les sorties conservent les résultats des premiers essais et des rejeux. Les chemins personnels et jetons sont expurgés. Les preuves publiées comprennent les captures, les mesures et les sorties expurgées.

## Résultats de la recette

| Commande ou essai | Résultat brut | Preuve |
| --- | --- | --- |
| npm run check | 81 modules valides, 108 scénarios documentés | [Sortie](resultats/check-final.txt) |
| npm test | 50 réussites, 0 échec | [Sortie](resultats/node-final-corrige.txt) |
| Python unittest | 2 réussites, 0 échec | [Sortie](resultats/python-final.txt) |
| verify_v32.py et verify_extension.py | Deux succès, 364 fichiers et 955 liens vérifiés, 37 ressources runtime | [Sortie](resultats/manifest-final.txt) |
| navigation, account, messaging, owner, visual-qa | 94 réussites, 0 échec, 0 omis | [Sortie](resultats/browser-final.txt) |
| booking | 37 réussites, 0 échec | [Sortie](resultats/booking.txt) |
| Explorer, catalogue et fiche hors répétitions PUB-01 | 52 réussites à la base et 52 sur le candidat | [Base](resultats/interactions-public-avant.txt) · [candidat](resultats/interactions-public-apres.txt) |
| Smoke | Client 8080, administration 8081 et API 3001 disponibles | [Sortie](resultats/smoke-final.txt) |
| DOM et focus | 80 vues internes, 56 retours mesurés au scroll initial. 54 arrêts de tabulation observés à 390 px et à 320 px avec texte 200 %, aucun recouvrement | [DOM](CONTROLES_DOM.csv) · [retours](RETOURS.csv) · [focus](clavier/tab-sans-recouvrement.json) |

Le premier contrôle Windows a relevé des fins de ligne de l’arbre de travail différentes des objets Git. Les vérifications sont passées après rétablissement des octets d’origine pour les fichiers concernés. Le premier run CI de R01 a échoué sur une ancienne assertion de navigation qui attendait Documents actif sur le profil locataire. Le dernier commit aligne le test unitaire sur la variante validée, avec 50/50 en local et le socle CI de nouveau réussi. Le code livré au navigateur est identique entre les deux dernières révisions.

### Protection publique

Au SHA de la PR, les 24 comparaisons visiteur ont donné 20 paires identiques et quatre variations d’anticrénelage sur le seul catalogue, de 11 à 106 pixels et jusqu’à 2/255 par canal. Les 12 paires connectées ont donné 10 identités et deux variations de 106 pixels à 2/255 sur le catalogue 1440. L’ensemble est dans les CSV. Une première série visiteur a donné 24 identités. Deux passes du candidat à contenu applicatif identique ont également varié, et le témoin connecté a varié jusqu’à 4/255. Les boîtes, les destinations, l’état et les interactions hors PUB-01 correspondent entre les révisions. Les ressources de catalogue et de fiche, l’API et l’administration donnent un diff vide dans la comparaison Git.

### PUB-01 · Résultat séparé

| Série | Base | Candidat |
| --- | --- | --- |
| Initiale | 1 échec sur 8 | 4 échecs sur 8 |
| Rejeu séquentiel | 0 sur 8 | 2 sur 8 |
| Rejeu isolé, candidat en premier | 0 sur 8 | 2 sur 8 |
| Sonde alternée avec journal d’événements | 1 sur 8 | 1 sur 8 |

Les échecs du test inchangé concernent l’absence du formulaire dans le dialogue après 390 → 880 → 390. La sonde montre dans les deux arbres la sortie de focus vers BODY avant l’événement de seuil à 390. Le formulaire reste unique avec une valeur de 40 et une réouverture manuelle conserve la valeur. La sonde explique la signature historique. Les séries du test inchangé restent plus défavorables au candidat dans cet environnement. La protection reste ouverte jusqu’à attribution de cette différence de fréquence ou décision de périmètre distincte pour corriger PUB-01.

[Rejeu isolé base](resultats/pub-01-isole-avant.txt) · [rejeu isolé candidat](resultats/pub-01-isole-apres.txt) · [journal de la sonde](resultats/PUB01-event-order.json) · [historique public](https://github.com/Djams0/Maquette_LokasyonPeyi/blob/f74a4fffd025518479685334763f226f827e503a/LOKASYON_PEYI_DESIGN_HANDOFF/01_AUDIT/HISTORIQUE_ECARTS_PUBLICS.md).

**Verdict · NO-GO pour la fusion.** HDR-01 et HDR-02 satisfont leurs contrôles internes aux deux largeurs. La protection partagée reste ouverte en raison de PUB-01. La PR conserve le verdict, la décision de revue et le lien vers R02.

### CI sur le SHA de la PR

Le [run #92](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/45871006396) conclut success. Le détail confirme syntaxe et documentation, 50 tests API/Node, 2 tests d’expurgation, handoff, Compose, démarrage, smoke et publication des preuves. Le navigateur est une étape souple et a donné 239 réussites, avec le seul échec PUB-01. Les quatre profils d’audit essentiels ont réussi. L’audit approfondi est omis dans ce déclenchement de PR et n’apporte donc pas ses scénarios supplémentaires.
