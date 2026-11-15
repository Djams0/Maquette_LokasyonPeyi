# Design system · Péyi contemporain 1.0

Les PNG V2 donnent la composition. [Mesures V2 et adaptation web](GEOMETRIE_V2.md). Les valeurs ci-dessous précisent les dimensions web. Les corrections de finition priment pour la lisibilité, l’ordre de focus et les états interactifs. Les valeurs sont dans [design-tokens.json](design-tokens.json) et [tokens.css](tokens.css). Reprendre les variables dans `ui/tokens.css`, puis raccorder les anciens noms réellement consommés par `ui/base.css`, `client/styles/client.css` et `admin/styles/admin.css`. Inventorier les consommateurs avant d’éliminer un ancien alias. Les variables de breakpoint servent à la documentation et aux outils. En CSS natif, les media queries utilisent les seuils littéraux.

| Rôle | Famille | Taille / interligne à 16 px racine | Graisse | Usage |
|---|---|---|---|---|
| Éditorial | Lora | 34/40 desktop, 28/34 mobile | 400–500 | Explorer, titre de découverte. |
| Titre de page | Nunito | 28/34 | 800 | Résultats, suivi, Messages, propriétaire et Admin. Lora possible pour le nom du véhicule dans la fiche. |
| Section | Nunito | 22/28 | 800 | État du véhicule, prochaine action, résultats. |
| Titre de carte | Nunito | 18/24 | 800 | Véhicule, action ou dossier. |
| Corps et boutons | Nunito | 16/24 | 400 à 800 selon rôle | Messages, formulaires, actions. |
| Libellés et métadonnées utiles | Nunito | 14/20 | 600–700 | Dates, légendes, prix secondaire et statut. |
| Mot-symbole existant | Lobster | 20/24 | 400 | Marque seule. |

Polices locales déjà intégrées à la maquette. Déclarations variables du dépôt à conserver. Le minimum de 14 px pour les métadonnées utiles met à jour les 12 px de la V2. Utiliser `rem` pour la taille des textes, des chiffres tabulaires pour prix et dates alignées et un retour à la ligne lisible pour les noms longs.

| Largeur CSS | Grille | Marges et comportement |
|---|---|---|
| 320–359 | 4 colonnes | 12 px en bord, contenu mono-colonne. Les dates et boutons passent à la ligne dès que nécessaire. |
| 360–767 | 4 colonnes | 16 px en bord et entre cartes. Photo dominante, barre basse sur les pages de premier niveau. |
| 768–1023 | 8 colonnes | 24 px en bord, liste et détail si les deux restent lisibles. Les actions mobiles restent accessibles si le changement de shell ne tient pas. |
| 1024+ | 12 colonnes | 32 px en bord, filtres ou détails latéraux selon le parcours. Conteneur max 1280 px, largeur de formulaire 640 px. |
| 1440+ | 12 colonnes | Conserver le conteneur max. Aligner les bords et les actions sans étirer les textes. |

Échelle 4, 8, 12, 16, 20, 24, 32, 40, 48 et 64 px. Bouton et champ rayonnés à 12, carte à 16 et grande image à 20. Panneau fixé avec bordure haute et espace pour `env(safe-area-inset-bottom)`. Réserver sa hauteur dans le flux. Si le clavier natif, le zoom ou une hauteur faible masque le contenu ou le focus, replacer la barre dans le flux. Une seule action primaire visible par zone de décision. Les couleurs d’état sont doublées d’un libellé ou d’un signe distinct.

## Contraste et accessibilité

| Combinaison | Ratio arrondi | Application |
|---|---:|---|
| Encre sur ivoire | 13,42:1 | Corps |
| Secondaire sur ivoire | 6,53:1 | Métadonnées |
| Blanc sur action | 7,78:1 | Bouton principal |
| Encre sur ocre | 8,99:1 | Accent |
| Texte erreur sur rose | 7,48:1 | Erreur |
| Contour sur blanc | 3,82:1 | Limite de contrôle |
| Focus bleu sur ivoire | 6,62:1 | Anneau extérieur |

Viser 48 × 48 CSS px pour les actions usuelles. WCAG 2.2 AA impose notamment un contraste de texte de 4,5:1 pour le texte courant et 3:1 pour le grand texte, le contraste des composants pertinent, un reflow à 320 CSS px avec exceptions, le focus visible et au moins partiellement non masqué, et 24 CSS px pour la taille minimale avec exceptions. L’objectif produit de 48 px reste applicable aux boutons et aux zones activables usuelles. Vérifier clavier, lecteur d’écran, zoom du navigateur, contraste calculé et texte sur aplat si placé sur image. La grille web est propre à ce projet. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [Apple HIG Accessibilité](https://developer.apple.com/design/human-interface-guidelines/accessibility/) · [Classes de taille Android](https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes)
