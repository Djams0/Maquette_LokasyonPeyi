# Lot 07 · Boîte de réception et conversations

## A. Mission

Agis comme UX Engineer et Frontend Tech Lead de Lokasyon Péyi. Refondre la messagerie et fiabiliser la reprise sur le contrat simulé existant. Exécute uniquement ce lot.

## B. Contexte

Cible : `Djams0/Maquette_LokasyonPeyi`. Entrée : lot 06 intégré et lien de contexte disponible lorsque le mock le fournit. `Djams0/LokasyonPeyi` est la référence métier et technique en lecture. Le handoff a été établi sur maquette `d8ef845` et principal `78966c9`. Relis les instructions et compare tout écart de version avant d’agir. Lis les chemins ci-dessous depuis la racine du kit extrait, qui peut être placée à côté du dépôt. Respecte les données et parcours fictifs existants.

## C. Références visuelles et fichiers à ouvrir

- [00_DECISIONS/DESIGN_DIRECTION.md](../00_DECISIONS/DESIGN_DIRECTION.md)
- [00_DECISIONS/PRODUCT_CONSTRAINTS.md](../00_DECISIONS/PRODUCT_CONSTRAINTS.md)
- [00_DECISIONS/OPEN_DECISIONS.md](../00_DECISIONS/OPEN_DECISIONS.md)
- [02_DESIGN_SYSTEM/DESIGN_SYSTEM.md](../02_DESIGN_SYSTEM/DESIGN_SYSTEM.md)
- [02_DESIGN_SYSTEM/COMPONENT_SPECS.md](../02_DESIGN_SYSTEM/COMPONENT_SPECS.md)
- [02_DESIGN_SYSTEM/GEOMETRIE_V2.md](../02_DESIGN_SYSTEM/GEOMETRIE_V2.md)
- [02_DESIGN_SYSTEM/tokens.css](../02_DESIGN_SYSTEM/tokens.css)
- [06_VALIDATION/REGRESSION_STRATEGY.md](../06_VALIDATION/REGRESSION_STRATEGY.md)
- [06_VALIDATION/ACCEPTANCE_CRITERIA.md](../06_VALIDATION/ACCEPTANCE_CRITERIA.md)
- [01_REFERENCES/finition/Prototype_Peyi_Contemporain.html](../01_REFERENCES/finition/Prototype_Peyi_Contemporain.html)
- [tools/verify_mock_message.mjs](../tools/verify_mock_message.mjs)
- [01_REFERENCES/finition/Message_echec_390.png](../01_REFERENCES/finition/Message_echec_390.png)
- [04_SCREEN_SPECS/inbox.md](../04_SCREEN_SPECS/inbox.md)
- [01_REFERENCES/target_ui/07_Boite_messages.png](../01_REFERENCES/target_ui/07_Boite_messages.png)
- [01_REFERENCES/current_ui/L14-messages.png](../01_REFERENCES/current_ui/L14-messages.png)
- [04_SCREEN_SPECS/conversation.md](../04_SCREEN_SPECS/conversation.md)
- [01_REFERENCES/target_ui/08_Conversation_location.png](../01_REFERENCES/target_ui/08_Conversation_location.png)
- [01_REFERENCES/target_ui/09_Conversation_avant_demande.png](../01_REFERENCES/target_ui/09_Conversation_avant_demande.png)
- [01_REFERENCES/current_ui/L15-composition.png](../01_REFERENCES/current_ui/L15-composition.png)
- [01_REFERENCES/current_ui/L28-message-recu.png](../01_REFERENCES/current_ui/L28-message-recu.png)

## D. État actuel et fichiers à examiner

Inspecter `messages(me)` dans `client/pages/account.js`, `client/http.js`, `api/server.mjs`, `api/router.mjs` et `api/modules/communication.mjs`. Le POST actuel omet la clé, le helper sait transmettre `Idempotency-Key`.

## E. Résultat attendu

Séparer liste et fil sur mobile. Afficher le contexte fourni. Préserver la saisie et ajouter état d’envoi et reprise. Réutiliser le paramètre clé de `api(path, body, method, key)` avec une clé stable par tentative et le même corps.

## F. Règles UX

Préserver texte, focus et lecture au rafraîchissement, insérer par ID serveur. Réseau avant envoi, refus définitif et résultat incertain ont chacun un chemin. Revalider l’appartenance via les données de fil avant un réessai si le contexte a changé. L’assistance existante reçoit uniquement le contexte autorisé.

## G. Règles UI

Vignette 64 × 64, bulles 16 px, métadonnées 14 px, bouton 48 et composer stable. Non-lus fiables ou indication absente si le mock ne les expose pas.

## H. Contraintes techniques

Aucun WebSocket, service externe ni évolution API. Si le contrat d’idempotence du mock a changé, garder « Envoi à vérifier » et l’actualisation sûre. La cible p95 est distincte. N’inférer aucun rattachement à une location ou droit de lecture. Préserve les scénarios historiques et d’audit, la stack, les contrôles et sessions existants. Pour un changement de libellé volontaire, adapte le sélecteur historique correspondant sans affaiblir l’assertion. Toute décision ouverte reste identifiée dans le rapport.

## I. Tests

Rejouer la sonde avec le checkout cible. Deux sessions plus un tiers. Simuler perte avant et après écriture, double clic, rechargement, refus corrigé, corps différent sous même clé, fil devenu inaccessible, conservation du focus et changements de compte. Rejoue au minimum les contrôles de la stratégie commune. Vérifie les suites concernées sur une instance neuve et note les commandes réellement exécutées.

## J. Critères d’acceptation

Un envoi incertain suivi d’un réessai autorisé aboutit à une seule copie et le même résultat mock. L’envoi actuel est identifiable et les boutons restent utilisables à 320 px. Documente chaque écart visuel et fonctionnel observé avec une preuve et son statut. Un test manquant reste signalé.

## K. Git

Branche dédiée `peyi/lot-07-messaging` depuis lot 06 intégré et lien de contexte disponible lorsque le mock le fournit. Contrôler `git status`, le SHA de base et les changements de l’utilisateur. Préserver `main` et les protections. Commits limités au lot et PR de revue si le mode Git de la mission l’autorise, sans fusion automatique. En mode local, fournir le diff ou le commit et le texte de PR.

## L. Livrable final

Remets le SHA de base et celui de travail si applicable, les chemins modifiés, le bilan des commandes avec résultats, des captures comparables, les écarts résiduels et les points à arbitrer. Donne le lien de PR seulement si elle existe. Arrête-toi à la livraison de ce lot.
