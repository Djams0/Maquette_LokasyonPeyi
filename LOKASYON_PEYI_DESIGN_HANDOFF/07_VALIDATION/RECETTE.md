# Recette visuelle et fonctionnelle

## Capturer la même scène

1. Relever SHA, navigateur Playwright 1.56.1, DPR 1, locale fr-FR, fuseau America/Guadeloupe, mouvement réduit, zoom 100 %, seed et profil. Démarrer les services sur une base fraîche. Le script capture visiteurs, sans dates, avec route de fiche v3.
2. Utiliser les PNG natifs à 1440 et 390. À 1280, les états catalogue ont des PNG natifs; le reste est dérivé de la revue HTML. 1024, 768, 430, 375 et 320 utilisent également la revue HTML responsive. Consigner pour chacun si la cible est native ou dérivée.
3. Attendre l’interface prête, les polices et le décodage d’images. Examiner les captures premier écran et pleine page. Pour un diff strict de vue pleine page, comparer d’abord la hauteur, puis découper des régions de même taille sur les deux copies, sans déformer les images. Pour la référence 1440/390, cadrer les captures natives pleine page sur le même viewport (900/844). Pour les états 1280 utiliser 760 px de haut.
4. Comparer d’abord avec les données existantes. Pour un diff de détails, monter une fixture visuelle isolée avec les mêmes textes, photos et état que la référence, ou comparer les régions stables en indiquant les masques. La fixture isolée peut intercepter une réponse GET de lecture pour égaliser noms, prix et données. Aucun changement du seed, aucun usage du score pixel pour certifier les parcours.
5. Relever côte à côte composition, hauteur de sections, position du moteur, géométrie des champs, taille et casse du texte, alignements, photos et focus. Superposer à 50 % les zones comparables. Une différence de texte testée et approuvée est documentée séparément. Dans les régions homogènes, utiliser comme seuil d’investigation >4 px sur le premier écran ou >8 px sur une grande section. Reporter la mesure brute avant arbitrage. Le score est une grille de contrôle.
6. Renouer avec les données réelles du mock. Rejouer les scénarios de [régression](REGRESSION.md). Conserver les résultats et la charge mesurée du hero, réseau mobile simulé et échec photo inclus. Regarder les variantes de contraste sans filtre et les saccades de scroll sur appareil réel si possible.

## Commandes

Après installation de Playwright déterminée par la CI et lancement du mock via README, depuis la racine du dépôt.

~~~bash
node LOKASYON_PEYI_DESIGN_HANDOFF/tools/capture-v32.mjs app http://127.0.0.1:8080 test-results/v32 1440,1280,1024,768,430,390,375,320
python3 -m http.server 4173 --bind 127.0.0.1 --directory LOKASYON_PEYI_DESIGN_HANDOFF/04_VISUAL_REFERENCES
~~~

Depuis un second terminal pendant le service de référence.

~~~bash
node LOKASYON_PEYI_DESIGN_HANDOFF/tools/capture-v32.mjs reference http://127.0.0.1:4173/maquettes/index.html test-results/v32 1440,1280,1024,768,430,390,375,320
python3 LOKASYON_PEYI_DESIGN_HANDOFF/tools/compare_v32.py test-results/v32/reference-accueil-1440-viewport.png test-results/v32/app-accueil-1440-viewport.png test-results/v32/diff-accueil-1440
~~~

Le comparateur requiert Pillow et produit côte à côte, superposition et différence amplifiée. Contextes identiques pour chaque capture. Pour filtres, galerie, verre et rôles, jouer les interactions listées dans la [matrice](MATRICE_VISUELLE.csv). Adapter le sélecteur d’attente du script après un changement volontaire de DOM et consigner la version. Une capture initiale n’est pas une référence de conformité pixel à la V3.2.

## Grille sur 100

| Axe | Points | Indices |
|---|---:|---|
| Composition | 20 | Ordre, conteneur, positions, densité, alignements |
| Typographie | 10 | Familles, tailles, graisses, césures, interlignes |
| Couleurs et surfaces | 10 | Palette, verre, contraste de fond, bordures |
| Médias et cadrages | 15 | Fichiers exacts, crop, priorité, crédits, fallback |
| Composants | 10 | Carte, CTA, filtre, gallery, menu, gabarits |
| Responsive | 10 | Reflow, colonnes, champs, no overflow |
| États interactifs | 8 | Vide, lenteur, erreur, commandes, focus de retour |
| Continuité UX | 8 | Recherche → fiche → demande, URL et sessions |
| Accessibilité | 9 | Clavier, zoom, texte, contraste, lecteur d’écran |
| **Total** | **100** | |

Pour chaque axe utiliser la moitié du poids si partiellement conforme, le poids plein si conforme ou différence mineure explicitement acceptée, zéro si à corriger ou non vérifié. Renseigner l’axe, l’état parmi ces quatre, les preuves, le poids et les réserves. Calculer par écran et largeur, puis présenter le plus faible des écrans principaux et le détail global. Le seuil proposé est ≥95 par écran approuvé. Chaque P0/P1 ouvert impose NO-GO, même au-dessus du seuil. Les points non vérifiés ne deviennent jamais acceptés tacitement. À chaque PR, noter le score et la différence par rapport à la baseline, sans déduire une promesse de fidélité à 100 %.

## Accessibilité et critères de sortie

Clavier Tab/Maj+Tab, Entrée, Espace, Échap et flèches. Contrôler skip link, focus dissimulé sous sticky, dialogue et retour focus, erreurs associées aux champs, repères/ordre et feedback sans annoncer deux fois le même message. Vérifier contraste AA sur les photos à plusieurs cadrages, thème opaque, réduction de mouvement, reflow 320 et zoom 200 %. Effectuer un parcours lecteur d’écran sur NVDA/Chromium et VoiceOver/Safari si disponibles, puis tester les sélecteurs date/heure au clavier réel. La matrice retient 44 px comme règle de projet et [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) comme norme de recette.

P0 · accès, intégrité des réservations, publication média, blocage d’un parcours essentiel. P1 · composition majeure, texte ou action inaccessible, contexte perdu, photo incorrecte, défaillance mobile. Les P2/P3 doivent être corrigés ou acceptés avec mesure et responsable. Les sept largeurs V3.2 sont vérifiées, et 1024 est conservé pour la non-régression du dépôt.
