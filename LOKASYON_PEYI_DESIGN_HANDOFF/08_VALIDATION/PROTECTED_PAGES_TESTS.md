# Test des trois pages protégées

[Captures](../04_VISUAL_REFERENCES/protected_baseline/README.md) · [cas antérieurs](../01_AUDIT/HISTORIQUE_ECARTS_PUBLICS.md) · [outil](../tools/README.md)

| Parcours | Assertion |
|---|---|
| Accueil visiteur | Logo, photo/credit et cadrage, commande de recherche, dates et heure de Guadeloupe, raccourcis, destinations, vidéo/motion sans impact. |
| Accueil connectés | Liens actuels locataire et propriétaire, menu et session lente, pas d’invitation incohérente; CTA et route conservent critères. |
| Catalogue | Toutes valeurs utilisées, tri, carte, édition, tags/clavier, état vide et erreur, conservation exacte de l’URL et de son contexte. |
| Tiroir 390 → 880 → 390 | Même test de mutation de largeur et valeur budget. PUB-01 est traçable; toute aggravation, perte de valeur ou autre diff est à analyser. |
| Fiche v3 / v1 | Photos/alt/crédit, ouverture et sortie de galerie, état déclaré v1 distinct, estimation et retour exact (vue, tri, période et filtres). |
| Visiteur → connexion → fiche | next sûr, contexte modèle/dates conservé, accès visibles conformes; compte précédent masqué après pageshow. |

Capturer avant/après à 320, 375, 390, 430, 768, 1024, 1280 et 1440, même état, profil, navigateur, DPR et horloge. Les PNG fournis prennent le premier écran visiteur. Ajouter aux preuves du lot les états connectés et interactions à 390 et 1440, et les états affectés au même viewport. Comparer largeur, hauteur, typographie, photos, structure, éléments et action. Un diff pixel dans un environnement stable demande explication. Reprendre l’outil et les tests existants si l’affichage de capture diffère entre OS; utiliser alors un avant/après sur le même OS.
