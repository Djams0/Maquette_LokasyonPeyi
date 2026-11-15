# Matrice de recette visuelle

Dimensions CSS. Référence 390 × 844, exports PNG V2 à 2×. Enregistrer viewport, DPR, moteur, données et hauteur. Les PNG « avant » représentent le même SHA. Refaire la baseline si la fixture ou l’état diffère.

| Largeur | Hauteur proposée | Contrôles |
|---:|---:|---|
| 320 | 844 | Repli dates et boutons, calendrier liste, menu, fil, absence de scroll horizontal global. |
| 375 | 844 | Mono-colonne, erreurs et galerie. |
| 390 | 844 | Composition V2, CTA et amorce de carte. |
| 430 | 932 | Grille, barres fixes, texte et largeur du dialogue. |
| 768 | 1024 | Grille 8 colonnes, liste/détail si lisibles. |
| 1024 | 900 | Navigation large, panneaux et ordre de focus. |
| 1440 | 950 | Grille 12, max 1280, alignements, actions et contenu non étiré. |

Pour chaque largeur, capturer Explorer, résultats, filtres, fiche, récapitulatif, suivi, boîte, fil, propriétaire, parc et Admin. À 390 ajouter défaut, échec d’envoi, reprise propriétaire et décision obsolète. À 320 ajouter zoom, fil avec texte long, fiche sans photo et dossier Admin. Safari iOS et Chrome Android physiques vérifient clavier, zone sûre, zoom, rotation et dernière ligne visible.

1. Fixer fixture, Chromium et fr-FR. Stabiliser les dates sans contourner la disponibilité. Attendre `document.fonts.ready`, l’état visé et le décodage des images. Désactiver les animations en capture.
2. Nommer `lot-XX__page__etat__390x844__avant.png` et `…__apres.png`. Prendre viewport et plein écran si le scroll compte. Stabiliser uniquement les régions dynamiques qui ne portent pas l’assertion.
3. Vérifier hiérarchie, couleurs calculées, espaces, ratios photo, cibles et focus. Comparer composition au PNG et comportement à la finition. Un diff pixel ne compare que deux rendus web homogènes.
4. Consigner URL, état, taille, avant, après, cible, écart, priorité et décision. Motiver les différences de données ou d’accessibilité.
