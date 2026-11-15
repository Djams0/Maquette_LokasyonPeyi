# Conversation, contexte et reprise

Référence V2 du 13 novembre 2026 et finition. Viewport de conception 390 × 844 CSS px. Les PNG cibles originaux mesurent 780 × 1688 px à 2×. Adapter à la grille web et aux données de la maquette.

## Références locales

- [08_Conversation_location](../01_REFERENCES/target_ui/08_Conversation_location.png)
- [09_Conversation_avant_demande](../01_REFERENCES/target_ui/09_Conversation_avant_demande.png)
- [L15-composition](../01_REFERENCES/current_ui/L15-composition.png)
- [L28-message-recu](../01_REFERENCES/current_ui/L28-message-recu.png)

## Intégration

- Routes : `/messages?conversation=:id`, `/assistance`
- Fichiers maquette : client/pages/account.js · client/http.js · api/modules/communication.mjs en lecture
- État observé : Les fils réels de la maquette sont privés et peuvent être liés au véhicule. Le formulaire actuel envoie sans clé. Le client HTTP et le serveur mock disposent déjà de `Idempotency-Key`. Le test ciblé de préparation confirme qu’un même acteur, chemin, clé et corps renvoient le même résultat et gardent une seule copie.

## Composition

En-tête interlocuteur, carte véhicule ou location selon données réelles du mock, bulles, composer, événements confirmés et aide.

## Comportements

Préserver texte et focus lors d’un retour ou d’une lecture incrémentale sûre. Différencier rejet définitif, échec démontré avant envoi et résultat incertain. Pour résultat incertain avec clé mémorisée, rejouer exactement la même clé et le même corps via le contrat mock. Sans clé fiable, garder le texte et offrir « Vérifier le fil ». Utiliser les IDs serveur pour le rendu incrémental. Le délai de polling du prototype constitue une proposition à mesurer, distincte des garanties du mock.

## États

En cours, envoyé, refusé, échec, envoi à vérifier, fil vide et accès perdu. Le signalement passe par l’assistance existante, avec référence autorisée.

## Recette ciblée

Forcer panne et timeout après écriture. Vérifier que le texte demeure, que le clic multiple ne rejoue pas et que le rafraîchissement ne duplique pas l’affichage. Tester les fils des deux acteurs et un tiers.
