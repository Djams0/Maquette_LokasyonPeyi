# Fondations visuelles V3.2

Les valeurs **Charte/PDF** viennent des pages 3, 9 et 12. Les valeurs **Source native** sont des CSS en clair, vérifiables dans `04_VISUAL_REFERENCES/maquettes/maquette.css`. Les valeurs **Intégration** sont à confirmer par test et capture.

| Élément | Spécification et origine |
|---|---|
| Palette | Charte/PDF · #1C6259 action, #08A04F tropical, #04959C lagon, #84BCBA bleu, #FEA90E orange, #162728 encre. #F6F4ED page, #E1F1EB menthe, #EEC473 doré, #103731 profond, #526760 secondaire. Blanc #FFF. |
| Neutres de contrôle | Source native · ligne #DCE3DD, contrôle #778B84, erreur #A23524, hover #154D46. Vérifier 3:1 pour les limites qui identifient un contrôle. Si la teinte source échoue sur une surface donnée, assombrir la bordure sans modifier la palette de marque. |
| Polices | Charte/PDF · Lora titres éditoriaux, Nunito interface, Lobster identité. Source native · corps 16 px, line-height 1,55. Label champ 12 px gras (11 mobile), valeurs 13 px (12 mobile). H1 hero `clamp(51px,5.4vw,78px)`, mobile `clamp(37px,10vw,50px)`. Utiliser les polices locales déjà chargées et comparer leur métrique avec les WOFF du prototype. Textes d’action et listes métier gardent leurs usages Nunito. |
| Conteneurs | Source native · contenu max 1200 px, gouttière `clamp(16px,4.8vw,72px)`. Capsule 1280 px max, 66 px min, rayon 999 px. Boutons 48 px min, rayon 999 px, contrôle de formulaire 44 px min. |
| Cartes | Source native · rayon 20 px, ligne 1 px, ombre 0 5 px 20 px #1627280b, photo 16:10, grille 18 px (14 résultats, 13 mobile). Texte et prix restent lisibles à 200 %. |
| Verre | PDF et source native · #F5FAF6 à .58 clair, #F0F8F3 à .36 sombre, blanc à .72 en contour, `backdrop-filter:blur(14px)`, repli #E1EAE3. Reflet discret en dégradé (0x36), ombre externe 0 14 px 35 px #1228253b et trait intérieur blanc. |
| Focus et dialogues | Source native · anneau blanc 3 px et halo vert, focus intérieur pour cartes coupées. Intégration · choisir un anneau lisible sur chaque fond, `showModal()`, point d’entrée nommé, Échap, focus piégé puis rétabli, arrière-plan inerte, scroll interne si nécessaire. |
| Accessibilité | Projet/PDF · cibles 44×44 px sur commandes, focus visible et non masqué, contraste texte 4,5:1 ou 3:1 pour le grand texte, contraste non textuel 3:1. À 320 px l’ordre de lecture et les actions restent complets. Tester le lecteur d’écran et le clavier réel. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |

## Intégration CSS

Déclarer la surface opaque d’abord. Activer le verre dans `@supports (backdrop-filter: blur(1px))`. Le désactiver sur `prefers-reduced-transparency: reduce` quand pris en charge, en mode couleurs forcées et par déclencheur explicite utilisable dans la revue. Retirer les animations superflues si mouvement réduit. Les fonds des champs et du CTA sont solides. Appliquer la préférence au conteneur et la teinte selon le fond, sans contrôle dynamique coûteux à chaque image. Aucun flou sur la navigation mobile opaque. Ne pas appliquer un flou à chaque carte.

Scoper les règles publiques au contexte des trois écrans. Les tokens CSS runtime restent dans `ui/tokens.css` et les styles de composition dans `client/styles/client.css`. Le CSS de référence est un échantillon à transposer. Le fichier `tokens.reference.css` aligne les valeurs à relire et les noms sont des références pour choisir les tokens runtime compatibles.

## Ruptures de la source native

À 1120+ sidebar et 3 cartes. À 880–1119 sidebar et 2 cartes. De 600 à 879 menu condensé, recherche 2 colonnes de dates, catalogue à tiroir, 2 cartes. À 599 et moins la grille résultats passe à une colonne, la capsule mobile et le bas de navigation apparaissent. Le seuil d’affichage du formulaire de demande peut être avancé si le contenu force un reflow incohérent. À 320, conserver les dates côte à côte uniquement si affichées et opérables avec zoom/locale/heure, sinon les empiler. La barre basse réserve l’espace nécessaire et peut se retirer de la zone clavier, elle ne couvre aucun contrôle en focus.
