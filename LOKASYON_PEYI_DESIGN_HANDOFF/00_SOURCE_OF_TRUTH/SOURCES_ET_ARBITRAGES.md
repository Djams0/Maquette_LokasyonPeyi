# Autorité des références et arbitrages

- [PDF A · direction initiale](Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf) · 12 pages. Identité, accès publics, photothèque et verre.
- [PDF B · extension des espaces client](Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf) · 49 pages. La version fournie et son autre exemplaire connu ont la même empreinte. Cibles visuelles pour les routes client restantes.
- [Code et données de la maquette](https://github.com/Djams0/Maquette_LokasyonPeyi/tree/4338f5f7ca252f4d4f02021ec47a226d0d2d6064) · gardes, API, statuts, prix, dates, médias et autorisations de la démo.
- L’accueil, le catalogue et la fiche ont comme baseline le **rendu du SHA audité**. Les écarts de la recette précédente restent tracés. B p. 44 explicite la navigation par rôle déjà déployée.

| Divergence | Décision d’intégration |
|---|---|
| Planches à prix, noms, dates et scénarios illustratifs | Alimenter l’UI depuis le mock. Pour un comparatif, harmoniser les données par fixture de test ou documenter les zones qui diffèrent. |
| B, p. 41 « état et défauts déclarés » | Montrer l’état existant ou « non renseigné ». La saisie structurée et la preuve sont des choix produit. |
| B, contexte conversation/location | Lier le contexte véhicule et les participants. Une relation explicite à une location exige modèle et API. |
| B, p. 23 et 40, brouillon surveillé | Réutiliser comparaison de contenu et choix existants. Éviter de présenter un verrou ou une révision serveur. |
| B, calendrier comme écran | En code, ancre de la fiche de gestion. Une autre composition partage la même route et les mêmes actions. |
| B, galerie véhicule et visuels client | Cartes illustratives, état déclaré à sa source. Conserver médias publics, droits, crédits et repli. |
| B, 404 lisible en h1 | Admissible dans une surface client et un cas documenté. Préserver le traitement des erreurs publiques. |
| Sources graphiques | Aucun fichier natif de B retrouvé. Utiliser planches PDF et rendus documentaires. Les références natives d’A restent disponibles dans le kit initial. |

Le [backlog](../06_FONCTIONNEL/EVOLUTIONS_A_VALIDER.md) regroupe les arbitrages fonctionnels. Pour un nouveau conflit, noter la route, la page, le contrat, l’option retenue et son test dans la PR.

## Correction de fidélité après la PR #35

- Le [main vérifié pour l’audit](https://github.com/Djams0/Maquette_LokasyonPeyi/tree/8a6974e23aab14acbabcd82f21f2bfcd9c0498ce) est la référence d’exécution pour l’accueil, le catalogue et la fiche protégée. `4338f5f` documente l’origine des PNG et la recette historique.
- B fixe la composition visuelle de l’extension, notamment capsule et marque, ordre des zones, gestes et variantes par rôle. A fixe la direction générale. Le code fournit les droits, états et données de simulation. Une reproduction d’un état illustré passe par les préconditions du mock.
- Les planches suffisent pour décider structure et hiérarchie. Consigner en revue les dimensions déduites, l’extrapolation d’un écran montré à une seule largeur et les différences de données. Réutiliser le [logo, les polices et les médias crédités](../03_ASSETS/ASSET_MAPPING_EXTENSION.md).
- Les choix du [backlog produit](../06_FONCTIONNEL/EVOLUTIONS_A_VALIDER.md) restent soumis à décision. La [correction](../07_CODEX_PROMPTS/correction-v32/README.md) suit les arbitrages du tableau ci-dessus.
