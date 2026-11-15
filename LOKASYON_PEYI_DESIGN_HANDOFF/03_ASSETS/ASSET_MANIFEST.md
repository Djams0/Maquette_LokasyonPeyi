# Manifeste des ressources

Le [manifeste machine](asset-manifest.json) fournit chemin, nom, fonction, écran, dimensions, format, taille, SHA-256, source, auteur, usage, attribution et alt. [Index d’écrans](../04_SCREEN_SPECS/README.md) · [Inventaire complet du kit](../FILE_MANIFEST.json).

## Associer les photos aux fixtures

- **Citadine verte** : la famille synthétique reprend l’intention du PNG V2. L’association à la Peugeot 208 fictive `v1` est une convention de la démo. Le contrôle visuel porte sur la cohérence de silhouette, couleur et habitacle. La génération ne garantit ni une finition automobile exacte ni une preuve d’état. Utiliser la couverture avant, puis arrière, profil, habitacle et banquette. La rayure a son image dédiée dans État du véhicule. Étiqueter ces images « Photos de démonstration » et utiliser un alt qui décrit la vue. Garder les vues liées au même véhicule.
- **Citadine argentée** : le visuel ne permet pas de garantir la correspondance avec la Clio du seed. Il reste une référence de composition. Pour `v3` et les autres véhicules, conserver le SVG fictif du dépôt ou un repli neutre jusqu’à disponibilité d’une photo cohérente. Ne pas associer un média par couleur seule.
- **Illustration fixe** : visuel optionnel en dehors de la galerie, étiqueté « Représentation illustrative ». Aucun chargement obligatoire. Ne pas l’utiliser comme photo d’annonce, de défaut ou de constat.
- **Photographies du produit** : les photos fournies par le propriétaire priment et leur périmètre d’accès reste applicable. La bibliothèque du kit n’alimente ni pièces, ni constats, ni dossiers réels.

Variantes WebP 420 et 836 px pour les couvertures. Réserver la place avec dimensions intrinsèques, utiliser `srcset` et `sizes` sur les surfaces courantes. La couverture visible peut être chargée en priorité. Les vues secondaires se chargent à l’ouverture ou à l’approche de la galerie. Les fichiers individuels sont sous 120 Kio. La production réelle choisira ses variantes sur mesure selon les téléversements.

Les pictogrammes existants sont échantillonnés dans le kit. La nouvelle illustration d’état vide est décorative, avec `alt=""` à l’intégration. Les polices restent sous leurs notices OFL locales. Les études et captures sont documentaires. Les références concurrentes figurent dans leurs pages de benchmark et ne font pas partie des médias intégrables.

## Ressources d’interface et de démonstration

| Fichier | Usage | Dimensions | Octets | Statut |
|---|---|---:|---:|---|
| [Lobster.ttf](fonts/Lobster.ttf) | Police locale | — | 406076 | réutilisable |
| [Lora.ttf](fonts/Lora.ttf) | Police locale | — | 212196 | réutilisable |
| [Nunito.ttf](fonts/Nunito.ttf) | Police locale | — | 276932 | réutilisable |
| [pictogrammes-maquette.svg](icons/pictogrammes-maquette.svg) | Échantillon de pictogrammes | 24×24 | 3129 | référence seulement |
| [catalogue-vide.svg](illustrations/catalogue-vide.svg) | Illustration décorative | 128×96 | 564 | réutilisable |
| [citadine-verte-illustration-836.webp](optional_renders/citadine-verte-illustration-836.webp) | Rendu fixe générique | 836×470 | 24490 | maquette |
| [citadine-verte-rayure-836.webp](vehicle_defects/citadine-verte-rayure-836.webp) | Défaut cosmétique fictif | 836×471 | 40812 | maquette |
| [citadine-argent-avant-420.webp](vehicles/citadine-argent-avant-420.webp) | Exemple générique distinct | 420×237 | 30080 | référence seulement |
| [citadine-argent-avant-836.webp](vehicles/citadine-argent-avant-836.webp) | Exemple générique distinct | 836×471 | 92298 | référence seulement |
| [citadine-verte-arriere-768.webp](vehicles/citadine-verte-arriere-768.webp) | Vue arrière | 768×512 | 117640 | maquette |
| [citadine-verte-avant-420.webp](vehicles/citadine-verte-avant-420.webp) | Image principale | 420×236 | 32450 | maquette |
| [citadine-verte-avant-836.webp](vehicles/citadine-verte-avant-836.webp) | Image principale | 836×470 | 108516 | maquette |
| [citadine-verte-banquette-768.webp](vehicles/citadine-verte-banquette-768.webp) | Détail de la banquette | 768×512 | 49394 | maquette |
| [citadine-verte-habitacle-768.webp](vehicles/citadine-verte-habitacle-768.webp) | Vue du poste de conduite | 768×512 | 72746 | maquette |
| [citadine-verte-profil-768.webp](vehicles/citadine-verte-profil-768.webp) | Vue de profil | 768×512 | 115586 | maquette |


## Provenance de la série verte

Images de couverture, défaut et rendu repris de la V2. Les vues supplémentaires ont été générées avec ImageGen à partir de la couverture et du gros plan de la V2, puis découpées et compressées en WebP. Le prompt demandait une planche 2 × 2 du même véhicule, avec arrière trois quarts, profil, habitacle avant et banquette, même vert profond et mêmes matériaux, dans une lumière naturelle de bord de mer, sans texte, logo, plaque ni personne. Les crédits de la planche de référence tiers restent dans le PDF.
