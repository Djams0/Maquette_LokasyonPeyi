# Pictogrammes

Réutiliser `icon(name)` de `ui/components.js` dans le dépôt maquette. Le pictogramme est à 20–24 CSS px dans une cible produit de 48 px. Le libellé textuel ou le nom accessible appartient au contrôle. La fonction native fournit notamment `home`, `car`, `message`, `user`, `search`, `calendar`, `pin`, `back`, `close`, `check`, `alert`, `camera`, `file`, `bell` et `menu`. Ils héritent de `currentColor`.

Le fichier `pictogrammes-maquette.svg` est un échantillon autonome des formes du dépôt d’origine, utilisable pour inspection hors ligne. L’intégration continue d’utiliser l’API native afin de conserver une seule source d’icônes. Le SVG décoratif `../illustrations/catalogue-vide.svg` peut être repris avec `alt=""` quand le texte explique déjà l’état vide.
