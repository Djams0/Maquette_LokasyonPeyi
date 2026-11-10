# Recette de préparation — 10 novembre 2026

Base maquette : `f513989e1e9b318e895b140c3dc1499725c12d48`. Référence métier lue : `78966c97a5e8f373c8e7eff6c26c7cd356ee7b29`. Le manifeste d’une campagne enregistre le commit réellement testé et indique si le checkout contient des changements non commités.

| Contrôle | État initial | Après préparation |
|---|---|---|
| Syntaxe et indépendance | 38 modules réussis | 47 modules réussis, catalogue vérifié |
| Tests Node HTTP | 9/9 réussis, aucun ignoré | 18/18 réussis sous Node 22 puis Node 24.22.2, aucun ignoré |
| Smoke local trois services | réussi | réussi ; campagne audit démarrée et 24 comptes publics / 15 internes retrouvés |
| `npm run smoke` | réussi après lancement Node | réussi |
| `docker compose config` | réussi, avertissement accès au config Docker utilisateur | réussi, mêmes avertissements |
| `docker compose up --build -d --wait` | échec environnement : moteur Docker introuvable | non validé localement ; aucune suppression de volume |
| Chromium historique | 13/13 lors de la première passe de compatibilité | 13/13 sous Node 24, 54,7 s |
| Chromium audit | absent | 11/11 sous Node 24, 25,5 s, rejoué depuis fixtures neuves |
| Expurgation preuves | absente | 2/2 tests Python ; 11 traces relues sans UUID de session |
| Firefox/WebKit | non exécutés | configurables, non exécutés |
| Audit humain WCAG/fraude | hors baseline | préparé, non exécuté |

La baseline syntaxe/API/smoke a précédé les modifications fonctionnelles. L’installation Chromium a été terminée ensuite : la première passe navigateur a donc été effectuée après l’ajout minimal des points d’extension, sur le seed historique inchangé. Ce n’est pas présenté comme une exécution navigateur du checkout initial immuable.

Le PowerShell initial bloquait `npm.ps1` ; utilisation de `npm.cmd` sans modifier la politique du système. Les premières tentatives réseau étaient bloquées dans le sandbox ; Git, Playwright et Node 24 ont été récupérés avec les autorisations requises. Docker est installé mais aucun moteur joignable, même hors sandbox. La vérification Docker complète doit donc être fournie par la CI, sans assimiler un démarrage Node réussi à un build Docker.

## Scénarios réellement vérifiés

Les neuf tests historiques restent intacts et couvrent notamment Camille/Noa de la demande à l’avis, constats symétriques, contrôle documentaire, publication, disponibilité, droits et doubles validations. Les treize tests Chromium historiques rejouent le cycle complet, les neuf étapes propriétaire, l’administration, les messages, la finance, l’erreur réseau et les sept largeurs 320/375/390/430/768/1024/1440.

Les neuf tests Node ajoutés couvrent les 39 comptes, le déterminisme, les références des fixtures, la connexion des 29 profils audit actifs et le refus du trentième suspendu, la séparation interne/public, les périmètres utilisateurs/documents/dossiers/conversations, les conflits et l’idempotence, la séparation des personnes et versions financières, la révocation de l’approbateur, les habilitations, les suspensions, l’isolation des campagnes et l’intégrité du catalogue. Les onze tests Chromium audit couvrent locataire, propriétaire, agent limité, admin opérationnel, cookies séparés et les sept largeurs de l’atelier.

Le catalogue comprend 108 scénarios : 31 reliés à une assertion automatisée, 77 préparés manuellement. Une correspondance avec un test ne prouve pas tout un parcours métier. Les résultats JSON inventorient les tests effectivement exécutés ; les scénarios manuels ne sont jamais comptés comme réussis.

Les lanceurs jetables et les proxys navigateur ont ensuite été limités à la boucle locale. Vérification réelle des sockets Windows : les ports 8080, 8081 et 3001 écoutent chacun sur `127.0.0.1`, puis smoke et onze tests audit réussis. Les images Docker conservent leur écoute interne et leurs ports hôtes loopback.

## Échecs rencontrés et corrections

- Un nouveau test de suspension essayait de se connecter après suspension au lieu de réutiliser une session déjà ouverte. Test corrigé pour exercer la révocation en session, sans changer la règle métier.
- Un nouveau test UI attendait le résumé d’assistance dans une liste qui n’affiche que l’objet. Il ouvre maintenant « Examiner » avant de vérifier le résumé. Aucun écran modifié pour satisfaire le test.
- Défaut préexistant confirmé dans le cache d’idempotence : une réponse de mutation pouvait être relue après suspension sans repasser par `signed`. Vérification du compte actif ajoutée avant cette réponse, couverte par AUD-08. Aucun effet financier supplémentaire ni droit nouveau.

Aucune nouvelle régression connue dans les contrôles exécutés. Cette phrase ne vaut pas validation des builds Docker, moteurs Firefox/WebKit ou contrôles humains absents.

## Preuves et livraison

Sources des tests et catalogue versionnés. Les fichiers générés sont ignorés par Git : `test-results/results.json`, `audit-results/node-tests.tap`, `playwright-report/index.html`, `audit-results/html/index.html`, `audit-results/results.json`, `audit-results/manifest.json` et les onze traces dans `audit-results/browser/`. L’expurgation est exécutée avant partage ; la CI bloque l’upload si cette étape échoue. Les captures seules ne prouvent jamais le parcours entier.

Livraison : [PR #1 en brouillon](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/1). La [première CI du lot](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/42894674608), sur `e2a2b3d`, valide syntaxe, 18 tests Node, deux tests Python, Compose, build et santé des trois conteneurs puis smoke. Elle échoue à l’installation Chromium : `ubuntu-latest` pointe désormais vers Ubuntu 26.04, non pris en charge par Playwright 1.56.1. Le runner est fixé à `ubuntu-24.04`, pris en charge par cette version, sans changer Playwright ni ignorer de test. Les tests navigateur ignorés lors de ce premier run ne sont pas présentés comme réussis.

La [CI suivante, réussie](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/42894888152), sur la branche à `af7b3afb7aa649ff5cfc694491db5da5d590d9a3`, valide réellement tous les contrôles : syntaxe/catalogue, 18 tests Node, deux tests Python, trois images Docker saines, smoke, **13 parcours Chromium historiques en 42,7 s et quatre profils audit essentiels en 6,1 s**, expurgation et upload. [Preuves de cette exécution](https://github.com/Djams0/Maquette_LokasyonPeyi/actions/runs/42894888152/artifacts/13799777841), rétention 14 jours. La campagne étendue n’a pas été déclenchée sur GitHub : ses onze tests restent prouvés localement sous Node 24. La présente mise à jour documentaire et la précision des profils du catalogue suivent cette exécution ; vérifier aussi le dernier statut de la PR.

Recommandation : **GO CONDITIONNEL** pour démarrer l’audit UX/UI. Work peut utiliser une campagne jetable locale ; utiliser employee/admin pour contrôler les ressources créées après le seed, conserver une nouvelle campagne par scénario indépendant, rester sous Chromium pour les parcours vérifiés. Firefox/WebKit, appareils physiques, lecteur d’écran et scénarios manuels restent à examiner pendant l’audit. Aucune règle commerciale ouverte n’est validée par cette recette.
