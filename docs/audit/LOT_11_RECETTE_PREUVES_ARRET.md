# Lot 11 · Recette, preuves et arrêt

## Base et périmètre

- Base et `origin/main` au début de revue · `7b8f305caa2a50310da3d2a27a1e5d9837dae268`. La fusion du lot 10 via [PR #34](https://github.com/Djams0/Maquette_LokasyonPeyi/pull/34) confirme son GO. Le commit revu et le commit de fusion ont le même arbre.
- Référence auditée · `4338f5f7ca252f4d4f02021ec47a226d0d2d6064`, ancêtre vérifié. Entre la référence et la base, l’application client a reçu les lots précédents. Contrats API, administration et workflow vérifiés par le diff de ces chemins.
- Branche `client-v32/lot-11`. Cette branche livre la recette et le recueil de preuves. Le SHA final, le PR et le résultat de chaque campagne se trouvent dans le dossier de preuves.

## Fichiers et contrôle ajouté

| Fichier | Raison |
| --- | --- |
| `tests/browser/visual-qa.spec.js` | Vérifier la disponibilité de l’action de location avant les photos, le retour après connexion avec dates et critères, puis le refus d’un dossier après changement de compte. Le test confirme l’absence de création de demande ou de message. |
| Ce rapport et le suivi du kit | Fixer les références, les limites, les contrôles réalisés et le statut de revue final. |
| Manifeste du handoff | Recalculer l’empreinte du tableau de suivi. |

La vérification des routes protégées compare directement la référence auditée et la revue, sous Chromium 141.0.7390.37 et Playwright 1.56.1. Les deux chargent le même jeu historique, en français, en heure de Guadeloupe, à DPR 1 et horloge figée. Les scènes client utilisent la fixture native `audit-v1` et les mêmes profils que les parcours. Les dates, noms et montants des planches B sont illustratifs. Les interfaces sont comparées à leur composition et à l’état observable du mock.

## Recette et barème

- Syntaxe, suites Node et Python, smoke sur trois services jetables et deux vérificateurs du kit. Suite `npx playwright test`, puis audit complet `npx playwright test --config=playwright.audit.config.js`. Vérifier les statuts bruts de chaque étape du workflow, y compris UI, audit essentiel, preuves et handoff.
- Vérifications fonctionnelles F01 à F14 · retour et filtres, éligibilité, idempotence, acteur, paiement et caution, constats, clôture, messages, notifications et dossiers, parc, assistant, changement de session, permissions et zoom.
- Captures des trois pages protégées sur huit largeurs. Scènes client par écran, état, rôle et largeur selon la matrice visuelle. Mesures des boîtes et de la typographie, focus, cible, contraste, absence de commande couverte et stabilité de mise en page. Détail des délais, requêtes et octets pour des chargements appariés sous Chromium local, avec les limites de mesure indiquées.
- Barème B-47 · 15 cohérence, 12 hiérarchie, 10 composition, 12 compréhension, 9 navigation, 8 densité et lisibilité, 9 interaction et reprise, 10 responsive, 10 accessibilité et 5 faisabilité. Score plein si démontré, moitié si partiel, zéro en absence de preuve. Chaque ligne renvoie à sa capture et aux contrôles qui justifient les points. Les pages protégées sont évaluées par identité et servent de condition distincte.
- Preuves exportées depuis des instances exclusivement fictives. L’inventaire de campagne et le tableau par test sont produits depuis les résultats enregistrés. Les archives partageables passent par le script d’expurgation. Les traces brutes restent dans les répertoires ignorés de la recette.

## Réserves et clôture

PUB-01 conserve sa réserve distincte. Reporter la fréquence dans chaque arbre, la signature de l’assertion au retour de 880 à 390 px et l’issue brute de la CI. Les appareils physiques, lecteurs d’écran et clavier virtuel sont vérifiés uniquement s’ils sont accessibles. Les limites et leur impact sont inscrits dans le relevé.

La revue doit retenir toutes les preuves essentielles avant un GO. Une régression protégée, une permission altérée, une perte d’état ou un nouveau P0/P1 déclenche un NO-GO. Le lot s’arrête à la revue humaine. Le retour au SHA de base restaure le jeu de tests et les documents de suivi précédents.
