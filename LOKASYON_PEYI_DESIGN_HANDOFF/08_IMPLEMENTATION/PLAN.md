# Mise en œuvre et points de contrôle

Complexité relative S, M, L. Partir d’une base contenant le kit. Prévoir une PR et une branche v32/lot-NN par lot. Vérifier le SHA, le périmètre, la dépendance précédente et les portes de sortie sur des données jetables. Les fichiers, résultats et tests détaillés sont dans [les prompts](../06_CODEX_PROMPTS/00_README.md).

| Lot | Dépendances | Priorité / complexité | Point d’entrée | Risque | Porte de sortie |
|---|---|---|---|---|---|
| 00 · Baseline applicative | — | P0 / S | README.md | Seed persistant, service lancé sur le mauvais port, comparaison de deux datasets distincts. | Diff applicatif vide et tests de base passants. Baseline reproductible et permissions observées. |
| 01 · Fondations et verre | 00 | P1 / M | ui/tokens.css | Impact des tokens partagés, titre métier modifié, bordure de champ invisible. | Trois fonds lisibles, contraste mesuré, pas de différence involontaire admin. Opaque même sans blur. |
| 02 · Assets et crédits | 01 | P1 / M | assets/README.md | Photo amalgamée à un défaut, mauvaise fixture, duplication, attribution manquante. | Variantes et cibles vérifiées, manifeste et crédits complets, octets locaux, aucune photo d’un autre exemplaire présentée comme preuve. |
| 03 · Accueil · premier écran | 02 | P1 / L | client/pages/catalog.js | Période désynchronisée, reflow autour du cadran, consultation perdue si session indisponible. | Cadrage et actions conformes en 1440 et 390. Crédit, cadran et titre lisibles. Recherche vers /search et voie de secours si v3 absent. |
| 04 · Accueil · sections | 03 | P1 / L | client/pages/catalog.js | FAQ contradictoire, pseudo-lien légal, faux service aéroport, chargement dégradé. | Captures pleine page. Tous les liens ouvrent une destination réelle. Les états vide/erreur et le cas aéroport sont vérifiés. |
| 05 · Catalogue et filtres | 02, 03 | P1 / L | client/pages/search-results.js | Flags UI transmis à l’API, données effacées, double formulaire, titre métier touché. | Restitution exacte de l’URL après filtre/vue/tri/période. Captures nominales, tiroir et états distincts. |
| 06 · Fiche, galerie et demande | 02, 05 | P1 / L | client/pages/vehicle-detail.js | Période perdue, photo composite, fausse preuve de dommage ou mauvais passage en mode propriétaire. | Preuves v3, v1 et véhicule sans photo. Demande selon profil, modal, focus, retour exact et aucun faux défaut. |
| 07 · Navigation et rôles | 03, 04, 05, 06 | P0 / M | client/shell.js | Menu incomplet, mauvais rôle, fuite de chemin privé, mauvaise redirection ou changement côté serveur. | Liens et accès directs vérifiés par rôle, validation après reconnexion et séparation avec Admin. |
| 08 · Cohérence des surfaces métier | 07 | P2 / M | ui/base.css | Verre appliqué au métier, actions sensibles déplacées, reprise perdue, titres opérationnels écrasés. | Comparaisons avant/après par surface, zéro changement d’action ou de règle. Diff borné dans la cascade. |
| 09 · Recette finale et conformité | 08 | P0 / L | .github/workflows/ci.yml | Diff calculé avec données divergentes, faux score de fidélité, régression multi-rôle, photo sans crédit. | Score cible ≥95/100 sur écrans approuvés, zéro P0/P1, différences mineures approuvées et état des points non vérifiés. |

Le lot 00 photographie l’état de départ. 01 fixe le style partagé, 02 installe les ressources. 03 et 04 construisent l’accueil. 05 et 06 relient recherche et fiche. 07 adapte la navigation. 08 harmonise les surfaces métier existantes. 09 décide du GO avec les preuves visuelles et fonctionnelles.

| Contrôle | État initial |
|---|---|
| Maquette auditée et testée | Fait |
| Références et médias vérifiés | Fait |
| Kit intégré dans la branche de revue | À faire |
| Lots 00 à 09 | À exécuter après installation |

En cas de retour sur la livraison, utiliser Git et le registre des suppressions. Un revert du commit de livraison restaure les ressources V2 et retire le point d’entrée V3.2 après revue. Avant de restaurer à la carte, résoudre les éventuels conflits de chemins dus aux lots déjà intégrés.
