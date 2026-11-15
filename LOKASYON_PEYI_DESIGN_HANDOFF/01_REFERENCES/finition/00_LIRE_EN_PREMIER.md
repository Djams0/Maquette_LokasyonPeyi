# Péyi contemporain · Dossier de finition

**Direction de référence provisoire · 13 novembre 2026**

Le rapport haute fidélité conserve la référence graphique. Cette passe affine la lisibilité mobile, les états d’envoi, la provenance des informations sur l’état du véhicule et la reprise du brouillon. Le prototype est un fichier de conception autonome. La maquette principale et le dépôt produit conservent leurs versions.

## Ouvrir le prototype

Décompresser le dossier puis ouvrir `Prototype_Peyi_Contemporain.html` dans un navigateur. Le lien **Scénarios**, en haut, donne accès aux rôles de démonstration et aux incidents simulés. Les images et polices sont incluses. Les photos et les valeurs affichées sont fictives. Le navigateur conserve l’état de cette démo localement. Pour repartir avec des données vierges, ouvrir le fichier dans un profil de navigateur de test distinct. Si le navigateur isole le stockage des fichiers locaux, servir le dossier depuis localhost et ouvrir la même URL dans les deux onglets.

| Parcours | À essayer |
|---|---|
| Chercher et comparer | Explorer, changer les dates, filtrer et trier, ouvrir une fiche puis revenir. Refaire depuis la carte schématique. |
| Réserver et suivre | Envoyer une demande, passer par Scénarios → Propriétaire → Demandes pour l’accepter, revenir au suivi et simuler un paiement refusé puis confirmé. Exercer le départ et le retour. |
| Vérifier l’origine d’une information | Depuis la fiche Peugeot, ouvrir le défaut puis « Comprendre les trois niveaux ». La location donne accès aux constats à ses étapes respectives. |
| Réessayer un envoi | Scénarios → « Perdre la réponse après enregistrement » → « Ouvrir le fil Peugeot ». Envoyer, actualiser, puis réessayer. Refaire avec un refus réseau et un refus de saisie. |
| Recevoir pendant la saisie | Laisser le fil Peugeot ouvert dans un onglet, écrire un brouillon, puis déclencher « Simuler un message entrant dans le fil Peugeot » dans un second onglet. Revenir au fil. |
| Créer et reprendre une annonce | Espace propriétaire, créer, remplir puis « Enregistrer et quitter ». Reprendre depuis le parc. À l’étape État et photos, garder une saisie locale, simuler une version concurrente via Scénarios, comparer et choisir quelle saisie reprendre. Terminer avec « Soumettre pour revue ». |

## Résultats de cette passe

- **33 vues × 6 largeurs** dans Chromium émulé, à 320, 375, 390, 430, 768 et 1440 CSS px. Les vues mesurées n’ont pas débordé horizontalement. Les 1 212 contrôles actifs mesurés atteignent 48 × 48 CSS px dans la tolérance de mesure. Le petit carré d’une case est évalué avec son libellé cliquable. Les textes utiles mesurés commencent à 14 CSS px.
- **20 vues à 390 px** passées dans axe avec les règles WCAG configurées. Aucun échec remonté sur ce périmètre. Contrôles ciblés de la barre fixe, du retour du focus après fermeture de la galerie et du zoom texte à 200 % sur la fiche. Correction du débordement de l’en-tête et de la vignette du fil pendant la passe. Le tableau des écrans V2 figure dans la spécification.
- **9 scénarios fonctionnels** passés. Un message entrant a été affiché après environ 2,9 s dans la simulation à deux onglets. Les cas de réponse perdue et de reprise après actualisation ont conservé une seule copie. Le brouillon propriétaire a été retrouvé après sortie, actualisation et échec simulé. Le conflit permet de comparer les valeurs puis de recharger ou de reprendre sa saisie pour vérification.
- **Le parcours propriétaire de la maquette existante** a été rejoué dans son scénario à neuf étapes. La proposition en quatre étapes regroupe ces tâches. La matrice de correspondance est fournie. Le premier lot propriétaire doit éprouver la migration des étapes et chaque validation dans le dépôt cible.

Vérifications restantes sur l’intégration finale : iOS Safari et Android Chrome sur appareils, clavier natif, lecteurs d’écran et vraie API multi-utilisateur. La démonstration conserve une composition mobile centrée sur grand écran. La carte et les pièces sont schématiques. Le seuil p95 de réception est une cible de recette à mesurer sur le pilote.

## Passer le dossier à Codex

1. Donner le rapport V2 comme référence graphique, puis `01_SPECIFICATION_CODEX.md` pour les écarts de cette passe.
2. Joindre `02_PLAN_DE_RECETTE_ET_ARBITRAGES.md` et demander **un lot à la fois**. Pour les premiers lots sur maquette, commencer par la continuité de recherche et le socle mobile. Garder les flux métier fictifs dans ce dépôt.
3. Exiger une PR avec un lien vers le lot, le comportement exercé, les tests et les captures de non-régression. Les décisions ouvertes sont associées à leurs jalons dans le plan.

Le dossier `proofs/` contient les captures et les résultats de cette passe. Les scripts fournis dans `recette/` testent le prototype autonome. Les tests spécifiques à la maquette et au dépôt produit restent à exécuter dans ces dépôts.
