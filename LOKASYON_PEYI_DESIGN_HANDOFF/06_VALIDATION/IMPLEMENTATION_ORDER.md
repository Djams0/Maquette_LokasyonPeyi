# Ordre et frontières des lots

| Ordre | Lot | Valeur | Effort relatif | Risque |
|---|---|---|---|---|
| 00 | Baseline | Point de comparaison commun | S | Bonne cible, routes et profils |
| 01 | Fondations | Tokens et composants communs | M | Cascade, contrastes |
| 02 | Navigation | Entrées et rôles | M | Liens secondaires |
| 03 | Explorer | Découverte et recherche | M | Photos, chargement, parcours public |
| 04 | Recherche | Corriger la perte de contexte | M/L | URL et heure de Guadeloupe |
| 05 | Fiche et transparence | Décider sur données attribuées | M/L | Galerie, focus et photos |
| 06 | Demande et suivi | Comprendre la prochaine étape | L | Rôles et transitions |
| 07 | Messagerie | Reprise et déduplication mock | L | Clé stable, accès et focus |
| 08A | Propriétaire | Publication et reprise | L | Neuf groupes et validations |
| 08B | Administration | Décision lisible et versionnée | M/L | Permissions et affectation |
| 09 | Recette | Comparaison de bout en bout | M | Comparabilité des preuves |

Chaque lot part d’une base qui contient les lots dont il dépend. Après intégration manuelle, utiliser le nouveau `origin/main`. Pour des PR empilées, baser le lot suivant sur la branche validée et indiquer explicitement la branche cible. Le lot 00 peut rester local et documentaire. Les arbitrages réels et le déploiement sont hors campagne.
