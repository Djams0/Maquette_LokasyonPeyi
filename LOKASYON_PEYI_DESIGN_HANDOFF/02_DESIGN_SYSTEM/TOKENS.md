# Tokens et portée

Les exports physiques sont dans ui/tokens.css. Activer les variantes sur un marqueur de route sous main. Éviter d’attacher des styles à html/body ou à .v32 utilisée par les écrans publics. Relever les styles calculés des trois pages protégées avant toute extension commune.

| Rôle | Source contrôlée | Règle |
|---|---|---|
| Éditorial | --lp-font-editorial, --lp-color-ivory, --lp-color-surface | Titres éditoriaux, fond et cartes |
| Interface | --lp-font-ui, --lp-space-*, --lp-radius-control, --lp-radius-card | Interface et espacement |
| V3.2 | --lp-color-v32-ink/action/deep/muted/line/outline | Réutiliser dans la portée métier sans réassigner les racines |
| Contrastes B p. 45 | Principal/crème 14,08:1, secondaire/crème 5,50:1, blanc/action 7,14:1, bordure/blanc 3,61:1 | Recalculer sur les vrais états |
| Focus B p. 45 | #1F5799 sur #F6F4ED · 6,62:1 | Tester sur fond clair, foncé et en couleurs forcées |
| Verre | .v32 et repli #E1EAE3 | Public et revue de démonstration. Formulaire et paiement opaques. |
