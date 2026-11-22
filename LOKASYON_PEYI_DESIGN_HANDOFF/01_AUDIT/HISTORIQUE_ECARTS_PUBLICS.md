# Écarts publics antérieurs à l’extension

| ID | Source | Observation et statut |
|---|---|---|
| PUB-01 | PR #22 + tests locaux 4338f5f | P1 historique. Après 390 avec tiroir puis 880 et retour à 390, le formulaire unique n’est pas toujours remonté dans le dialogue. Assertion de compte à 0 au lieu de 1. Suite locale 173/174, répétition 4/8 en échec. Lors de la PR #22, le budget restait saisi après réouverture; distinguer l’absence de retour de focus ou du formulaire d’une perte des données. Garder l’assertion active et signaler séparément en recette. |
| PUB-02 | PR #22, comparaison visuelle | Minimum natif 76,5/100 catalogue/tiroir à 390, minimum dérivé 71,5/100 catalogue à 320, seuil historique 95. Le statut de conformité historique reste NO-GO selon sa propre grille. |
| PUB-03 | PR #22 et B p. 5–6 | Hauteur du moteur sur 320, grille accueil à 768, densité du catalogue et composition de fiche. Écarts historiques à la proposition, rendu actuel approuvé comme baseline de préservation. |
| PUB-04 | PR #22 | Lecteurs d’écran et appareils physiques non vérifiés. Cette réserve n’autorise pas de changement public. |
| PUB-05 | CI merge | Run 44790599088 conclu success. Le workflow tolère l’échec UI/audit par défaut, sauf workflow_dispatch strict. Un run vert ne résout pas PUB-01. |

La nouvelle campagne prend les captures réelles comme baseline et conserve les anciennes planches à titre de provenance. Toute augmentation d’échecs, perte de critères, changement visuel ou nouveau défaut sur une page protégée demande correction dans le lot qui l’a introduit. Un correctif de PUB-01 relève d’une décision de périmètre distincte.

[PR #22](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/22) · [Run du merge](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/44790599088)
