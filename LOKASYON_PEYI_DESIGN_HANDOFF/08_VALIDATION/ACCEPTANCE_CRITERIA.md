# Critères de clôture · correction V3.2

Attribuer trois résultats indépendants à chaque ligne de la [matrice active](VISUAL_TEST_MATRIX.md). Tenir le détail par écran, état et largeur.

| Résultat | Preuve et critère de sortie |
|---|---|
| Fidélité aux planches | Comparatif côte à côte avec vignette de la zone B exacte et viewport réel au SHA final. À 390 × 844 et 1440 × 960 noter le rôle, l’état, les données et le zoom. Vérifier marque/capsule, alignements, ordre de lecture, densité, retour et visibilité entière de l’action prioritaire. Donner les coordonnées mesurées lorsqu’un geste doit être visible sans défilement. |
| Fonctionnement | Pour chaque action, nommer les tests et essais réalisés, les résultats et les échecs. Couvrir la reprise, les droits et l’accessibilité affectés. Indiquer les essais non réalisés et leur impact, par exemple clavier virtuel, lecteur d’écran, appareil ou impression physique. |
| Protection de l’existant | Fournir le relevé des 24 paires avant/après du [protocole protégé](PROTECTED_PAGES_TESTS.md), les contrôles connectés et la vérification des comportements partagés touchés. Identifier les divergences, refaire un témoin sur un SHA unique si le rendu varie par environnement, puis documenter et résoudre toute divergence bloquante avant le passage. |

Statuts possibles par résultat et par ligne · **Conforme**, **Ouvert**, **Non vérifié**, **Accepté en revue**. Un écart majeur sur le header, la navigation ou l’action principale maintient la ligne **Ouverte** jusqu’à correction ou acceptation explicite et liée à la preuve. Pour R01, la capsule et le logo officiel effectivement chargé sont obligatoires sur les routes internes cibles. Toute exception demande route, page/zone, justification et décision explicite en revue. Toute permission altérée, perte de données ou régression protégée non résolue empêche la clôture. Consigner la réserve historique PUB-01 indépendamment avec sa signature et ses répétitions sur les deux révisions.

Les scores de synthèse reprennent B-47 · cohérence 15, hiérarchie 12, composition 10, compréhension 12, navigation 9, densité 8, interaction 9, responsive 10, accessibilité 10 et faisabilité 5. Le score et la CI accompagnent la décision individuelle. La [recette fonctionnelle](FUNCTIONAL_TEST_MATRIX.md) et les [portes](RELEASE_GATES.md) complètent les preuves.
