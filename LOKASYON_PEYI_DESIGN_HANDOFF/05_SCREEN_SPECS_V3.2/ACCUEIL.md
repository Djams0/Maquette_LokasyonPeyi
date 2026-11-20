# Accueil · PDF pages 4 à 6

Fichiers `client/pages/catalog.js`, `explorer-state.js`, `search-state.js`, `vehicle-card.js`, `client/shell.js`, `client/styles/client.css`. Garder `home(loadIdentity)` et concurrence des lectures identité/catalogue.

## Premier écran

| Partie | Desktop 1440 | Mobile 390 et contraintes |
|---|---|---|
| Capsule | Largeur max 1280, hauteur 66, haut 18 px. Logo, Explorer les voitures, Comment ça marche, Aide, Connexion/compte et menu. | Bord 14 px, capsule min 57 px, haut 12 px. Logo env. 124 px, menu nommé, liens complémentaires dans menu. |
| Photo | Héro min 690 px. Photo 49, cadrage `60% 78%` avec dégradé local. Voiture et trajectoire lisibles sous le moteur. | Min 610 px, cadrage `64% center`, bloc qui grandit en présence d’erreur et de texte agrandi. |
| Titre | Centre, tête environ 150 px du haut, max 800 px, écart vertical 28 px vers la barre. | Haut interne 109 px, Lora proche 39 px à 390. Deux lignes de référence, lignes supplémentaires avec zoom. Corps 15 px. |
| Recherche | 1060 px max, 1.3/1.05/1.05/.85, gap 8, pad 10, rayon 23. Lieu, départ, retour, bouton et repère « Heure de Guadeloupe ». | Lieu pleine largeur, dates côte à côte, CTA pleine largeur. Pad 7, gap 6, rayon 19, champs min 58, CTA min 46. À 320, empiler au besoin. |
| Cadran | Largeur max 287, bas 23 px à droite dans le conteneur, vignette 70×52, flèche. | Max 227, vignette 46×40, dans une zone réservée sous le CTA à droite, sans chevauchement du crédit ou des erreurs. |
| Crédit | Bas du hero à gauche, contraste sur la photo et lien vers les crédits. | Lisible sous le moteur et le cadran. Quelle que soit la taille, basculer sous la photo si manque d’espace. |

Utiliser `searchError`, la période optionnelle par paire et `/search` comme destination canonique. Pour transmettre une heure, conserver le format de `search-state.js` et le fuseau UTC−04. Utiliser un libellé permanent par champ. Le repère donne le fuseau de remise et ne requiert aucune localisation. Le cadran pointe vers `/vehicle/v3` si la fixture est publiée et retrouvée. Si elle est indisponible, garder un lien public vers le catalogue ou une alternative explicitement annoncée au test visuel. Protéger le lien si un média échoue. Conserver la reprise de recherche et le focus sur feedback.

## Sections après le hero

| Ordre | Composition et texte | Réutilisation et action |
|---|---|---|
| Explorer par besoin | « Votre trajet, votre façon de rouler. » Quatre cartes bureau, 2×2 au mobile. Citadines, SUV et famille, Boîte automatique, Près de l’aéroport. Haut/bas env. 29 px mobile, 56–64 px cartes. | Paramètres `category=Citadine`, `category=SUV`, `gearbox=Automatique`, recherche de commune supportée. L’aéroport n’implique aucune garantie. Faire valider la destination du raccourci sur les données de démo. |
| Voitures à découvrir | Trois cartes sur fond blanc, grille 18 px bureau, une colonne mobile. | `card()`, jusqu’à trois véhicules publiés, prioriser v3/v2/v1 si disponibles. Sinon compléter avec la réponse actuelle sans doublons. État vide, chargement et retry distincts. |
| Fonctionnement | Fond menthe, cinq étapes, lignes numérotées sur mobile. | Rechercher, demander, confirmer après accord et paiement simulé, contrôler caution/constat/remise, restituer et clôturer. |
| La Guadeloupe, à votre rythme | Panorama Deshaies en tête, bloc photo/texte 1.55:1 sur fond profond, puis forêt, côte et bourg. Rayon panorama 24. Éditorial empilé en mobile. | IDs 46, 47, 48, 53. Filtres de communes agissant via moteur réel, destination testée. |
| Transparence | Introduction et liste photo/état/conditions, grille 1:1.36 bureau, file verticale mobile. | Expliquer photos propriétaire, défaut connu, lieu convenu, sans promettre l’assurance, le GPS ou une option non implémentée. |
| Propriétaire | Surface #103731, rayon 23, CTA doré. | Visiteur/sans capacité `/owner/start`, propriétaire `/owner/vehicles`. Session non résolue, proposer un point neutre. |
| FAQ | Split 1:1.4, 4 questions de la revue en accordéons et accès à `/faq`. | Réutiliser les réponses métier de `support.js`; `summary` clavier natif. |
| Footer | Fond profond, marque, service, aide. | Destinations réelles. Pour les liens légaux absents, relever l’écart et passer par une page existante adaptée après décision. Ne créer aucune destination factice. |

Lot 03 valide le premier écran, lot 04 les sections. Le lot 07 complète la variation par session. Exécuter `explorer.spec.js`, `navigation.spec.js` et le scénario public de `maquette.spec.js`.
