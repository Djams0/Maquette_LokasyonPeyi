# Péyi contemporain · Spécification de finition

Validation graphique provisoire · 13 novembre 2026. Ce document complète les 20 écrans de référence du [rapport haute fidélité](https://chatgpt.com/library?file_id=libfile_35221b04ce5c81918636a2361b98f8b0&account_id=personal). Les décisions de cette passe priment pour les interactions et les états documentés. Le prototype sert à exercer ces décisions sur des données fictives.

## Références de dépôt et limites de portage

- Maquette `Djams0/Maquette_LokasyonPeyi`, main observé `d8ef845`. Le scénario historique à neuf étapes a été rejoué sur cible jetable. La proposition regroupe ces tâches en quatre écrans. Les champs, contrôles et conditions de soumission existants doivent être cartographiés, conservés et recettés.
- Principal `Djams0/LokasyonPeyi`, main observé `78966c9`. Deux fronts Next, API Nest, cas d’usage serveur, PostgreSQL privé et worker Graphile pour les tâches différées. Client et Admin utilisent des routes API autorisées et des sessions distinctes. Une séparation Client/Admin reste nécessaire en production. Le prototype HTML utilise un stockage fictif par navigateur, sans authentification réelle.
- Le bilan Phase 0 au commit observé reste ouvert et en GO CONDITIONNEL, limité à la revue technique et documentaire. La clôture est un jalon séparé du travail sur la maquette. Relire les statuts et les décisions avant de lancer un lot métier du principal. [Bilan Phase 0](https://github.com/Djams0/LokasyonPeyi/blob/78966c97a5e8f373c8e7eff6c26c7cd356ee7b29/docs/PHASE0_PLAN.md) · [Règles et registre](https://github.com/Djams0/LokasyonPeyi/tree/78966c97a5e8f373c8e7eff6c26c7cd356ee7b29/docs/requirements) · [Permissions](https://github.com/Djams0/LokasyonPeyi/blob/78966c97a5e8f373c8e7eff6c26c7cd356ee7b29/docs/PERMISSIONS.md)

## Ajustements à appliquer aux 20 écrans

Le vert profond, l’ivoire, l’ocre, les photos de l’annonce, la hiérarchie de la fiche et la navigation Explorer / Locations / Messages / Profil sont conservés. Pour l’interface intégrée, texte d’action à 16 px, métadonnées utiles à 14 px, titre de section à partir de 18 px. Cible produit de 48 × 48 CSS px pour les actions usuelles. Les éléments cochables peuvent garder leur petit pictogramme dans une zone étiquetée plus grande. Les tarifs et les états critiques restent lisibles en texte. Les WCAG 2.2 distinguent les exigences de contraste, de reflow, de focus et la taille minimale avec exceptions. Les valeurs ci-dessus sont les objectifs produit. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)

| Écrans V2 | Finition retenue |
|---|---|
| 01 Explorer, 14 Mobilité locale | Conserver Péyi contemporain comme référence. L’écran 14 reste archivé pour comparaison. Libellés et dates lisibles, possibilité d’empiler les champs à 320 px, première voiture atteignable sans longue introduction. |
| 02 Résultats, 15 Filtres | Augmenter les petits libellés du tri, du résumé et des filtres. Une zone tactile entière pour chaque choix. Conserver période, lieu, tri, filtres et retour de fiche. À petit écran, commandes sur plusieurs lignes. |
| 03 Fiche, 04 Défaut, 13 Illustration | Total, dates et défaut restent prioritaires. Agrandir compteur et contrôles de galerie. Libellé d’origine de la photo sur aplat. Illustration optionnelle, étiquetée, hors galerie réelle. |
| 05 Récapitulatif, 06 Suivi | Afficher l’unité de prix, la caution séparée et la prochaine action. Permettre à la barre d’action de revenir dans le flux si hauteur/zoom/clavier l’exigent. |
| 07 Boîte, 08 Fil de location, 09 Avant demande | Lignes entières activables. Corps de message 16 px, heure et statut 14 px. Accès à l’aide et au signalement. Échec annoncé sans dépendre du rouge. Clavier et arrivée d’un message préservent le brouillon et le focus. |
| 10 Aujourd’hui, 11 Déclaration | Cartes ouvrables et boutons explicites. Libellés d’état de sauvegarde distincts. Fichiers et pièces ont leur propre statut. |
| 16 Parc, 17 Gestion, 18 Calendrier, 19 Demande | Les cartes exposent une action claire et une indication de rôle. À 320 px, calendrier synthétique avec vue liste pour choisir un créneau. Dates en heure de Guadeloupe, affichage et disponibilité vérifiés côté serveur. |
| 12 File Admin, 20 Décision Admin | Carte ouvrable avec version et état, alternative mobile à un tableau large. La nouvelle version est proposée avant une décision. Le focus atteint les actions visibles et les motifs. |

Contrastes d’aplats issus des tokens retenus, ratios sRGB arrondis : blanc sur vert d’action 7,78:1, encre sur ivoire 13,42:1, secondaire sur ivoire 6,53:1, bordure fonctionnelle sur blanc 3,82:1, erreur sur rose 7,48:1, focus bleu sur ivoire 6,62:1. Vérifier les survols, focus, états désactivés et photos sur l’interface finale. Pas de montant, d’adresse précise ou de permission déduits des valeurs illustratives.

## Messagerie · Contrat et reprise proposés

### Modèle d’accès et contexte

- Fil de renseignement lié au véhicule et aux participants. Un fil de location à la création de la demande et pour chaque référence distincte. Un lien vers la question précédente peut être proposé quand la correspondance et les droits sont établis. Chaque fil a son propre curseur et ses non-lus. Assistance séparée.
- L’API déduit l’acteur de la session, vérifie participation, rôle et périmètre sur chaque lecture, écriture et signalement. Le contenu ou identifiant d’une autre location ne fuit ni dans un aperçu, ni dans un compteur, ni dans une réponse d’erreur. L’Admin consulte seulement le contexte autorisé d’un dossier. Les justificatifs et médias de constat restent dans les flux dédiés.
- Créer les routes dans le contrat OpenAPI au lot concerné. Réutiliser les conventions existantes. Périmètre proposé : liste des fils paginée, détail et événements depuis un curseur opaque, création de message, marquage de lecture et signalement. Les chemins précis et la convention 403/404 suivent le dépôt cible. Utiliser les proxys ciblés existants si adaptés et conserver la séparation de session.

### Réception et qualité de service

- Charger le fil à son ouverture et refaire une lecture incrémentale au retour au premier plan ou au rétablissement du réseau. Hypothèse de départ du pilote : **3 s entre lectures pendant que le fil est visible**, un seul appel en vol, repli progressif sur erreur ou 429 avec délai indiqué par le serveur lorsqu’il existe. Suspendre en arrière-plan et éviter une file de requêtes concurrentes après reprise. Ne pas écraser la saisie ni déplacer le focus.
- Un curseur reprend les événements selon une séquence serveur stable. Le client déduplique par identifiant. Événement de location produit à partir d’une transition confirmée. Les événements métier et le compteur de non-lus restent cohérents lors d’un retour après une longue absence. Les règles de notification externe et de conservation sont encore à valider.
- **Cible de recette proposée** : sur fil au premier plan, p95 ≤ 5 s entre l’écriture serveur confirmée et l’affichage, sur un scénario de réseau et de charge convenus, hors panne. Tester au moins 100 événements, plusieurs fils et deux sessions, en précisant débit, RTT et population. Mesurer aussi le taux d’erreur et les requêtes par fil. Le prototype illustre le rafraîchissement local. Sa mesure n’est pas un engagement de service.

### Envoi et idempotence

1. Le client génère un identifiant d’envoi stable à la première validation. Le même envoi garde le même identifiant et le même contenu à chaque réessai. Les états UI sont **En cours**, **Envoyé**, **Envoi à vérifier**, **Échec · Réessayer** et **Refusé · Corriger**. Les erreurs sont annoncées via un statut accessible.
2. À la création côté serveur, vérifier l’acteur et le fil, normaliser le corps, puis réserver une unicité durable du type `(threadId, senderId, clientMessageId)`. Écriture du message et de l’événement durable dans la transaction. Même clé et même corps donnent la même réponse métier et le même identifiant. Même clé avec corps différent donne un conflit. Les effets secondaires et les notifications doivent aussi dédupliquer.
3. Si délai dépassé ou réponse perdue, réconcilier par le retour serveur ou en rejouant **la même clé**. Un message confirmé est affiché une fois. Un refus métier définitif se corrige dans le champ, puis crée une nouvelle tentative. Une réponse d’authentification, un accès révoqué et une erreur de validation ont des chemins explicites. Le traitement des 5xx reste réessayable.
4. La reprise locale doit rester limitée au compte et au fil. Aucune clé de session ni justificatif en stockage navigateur. Définir la conservation éventuelle des brouillons et contenus de messages avant le portage réel. Déconnexion et changement de compte cloisonnent la file d’envoi, les brouillons et les aperçus. Les outils d’observabilité enregistrent des IDs et délais, sans texte de message.
5. Signalement depuis le fil, motif, référence et message ciblé si nécessaire. Montrer le destinataire et le retour d’état. L’assistance reste distincte de l’échange entre particuliers. Alerte sur les paiements hors plateforme au moment pertinent. Les coordonnées de remise et les règles de modération exigent un arbitrage.

## État du véhicule · Trois sources, trois périmètres

| Source | Présentation | Version, accès et conséquence |
|---|---|---|
| Déclaration du propriétaire | « Déclaré par Noa le … », zone, description et photo si disponible. « Aucun défaut déclaré » qualifie la déclaration. | Version de l’annonce liée à la demande. Les modifications ultérieures gardent la trace et sont traitées selon la politique de changement significatif. Pour une ancienne annonce, indiquer « État non renseigné » lorsque pertinent. |
| Contrôle de la plateforme | « Contrôle documentaire · pièce X · [statut] ». Un contrôle physique éventuel précise son objet, son auteur et sa date. | Montrer le périmètre exact autorisé. Une pièce revue ne produit pas de badge d’état physique. La revue sécurité/usage et la visibilité de son résultat dépendent de la politique. |
| Constat de départ ou de retour | « Constat de départ » ou « Constat de retour », date, observations, photos et réserves. Le retour guidé est confirmé en BR-10. La symétrie au départ est proposée. | Rattaché à la location, à l’étape et à une version. Accessible aux parties et agents habilités selon règles. Les preuves de la remise et le traitement d’un litige gardent des traces séparées. |

Le récapitulatif référence la version présentée. Le propriétaire indique le défaut, son impact observé et la photo pertinente. Une donnée révisée garde son origine et son auteur. Un changement significatif déclenche le traitement validé. Au premier doute lié à l’usage ou à la sécurité, la stratégie proposée est une revue manuelle. Les conditions précises de suspension, d’information et de reprise restent ouvertes.

## Propriétaire · Création et reprise

| Étape de finition | Étapes de la maquette | Champs et garde-fous à préserver au portage |
|---|---|---|
| 1 · Véhicule | 1 Identification, 3 Caractéristiques | Nom/modèle, plaque fictive, année, commune, catégorie, boîte, énergie et places. Conserver bornes et listes du dépôt. L’immatriculation réelle relève de D-05. |
| 2 · État et photos | 4 Équipements, 5 Photos, déclaration nouvelle | Équipements, vues avant, arrière, profils gauche/droit et habitacle. Couverture et galerie, statuts par média. Le défaut a sa propre zone, description et photo éventuelle. Son état ne dispense d’aucun contrôle. |
| 3 · Disponibilité et prix | 7 Prix et règles, 8 Disponibilités | Tarif, description et règles, animaux et non-fumeur selon le dépôt. Créneaux datés et horodatés en Guadeloupe, ordre début/fin et conflits côté serveur. Limites de territoire, caution et tarification suivent les règles et décisions du produit. |
| 4 · Revue et envoi | 2 Documents, 6 Sécurité, 9 Récapitulatif | Préserver la collecte fictive des trois pièces, le contrôle individuel, la confirmation de sécurité et de couverture et la confirmation d’envoi. Montrer la complétude par section. Soumission pour revue puis publication selon les contrôles. Garder brouillon, sous revue, publié, à corriger et autres états actuels pertinents. |

La maquette enregistre un champ `step`. Son assistant choisit l’écran d’ouverture à partir de `?step=` et démarre sur l’étape 1 si ce paramètre est absent. C’est une observation du code au commit indiqué, distincte du test historique de soumission. Pendant le portage, mapper les anciennes étapes sauvegardées vers les quatre nouvelles et ouvrir la bonne étape depuis le parc. Pour les documents ou la sécurité anciens, ouvrir la section correspondante dans Revue et envoi. Vérifier l’activation du rôle propriétaire et l’isolation de ses brouillons. [Assistant de la maquette](https://github.com/Djams0/Maquette_LokasyonPeyi/blob/d8ef8450f762e3c8f14f15dcef6b5bc8d67cc4eb/client/pages/wizard.js)

Proposition de contrat : identifiant brouillon stable, compte propriétaire, version optimiste, dernière étape enregistrée, état et date serveur. Toute mise à jour exige la version lue. Un conflit garde le tampon local et compare les valeurs par champ. Si l’étape est identique, le propriétaire peut réappliquer sa saisie à l’écran puis enregistrer explicitement sur la version relue. Si l’étape a changé, proposer la récupération des valeurs avec un parcours guidé avant de les réappliquer. Les étapes sont relisibles, avec règle claire lorsqu’une modification invalide une donnée ultérieure. La soumission valide tout le brouillon de façon atomique et renvoie le même résultat lors d’un réessai autorisé. Les médias sont référencés côté serveur et restent privés tant que leur contrôle et la règle de visibilité ne sont pas satisfaits.

États à afficher : **Saisie locale à reprendre**, **Enregistrement en cours**, **Dernière étape enregistrée**, **Échec de sauvegarde**, **Version plus récente**. Le tampon récupère une interruption sans annoncer une sauvegarde serveur. Le rafraîchissement après validation retrouve l’étape persistée. L’action « Enregistrer et quitter » fonctionne sur un brouillon incomplet. L’action « Soumettre » exige les données et pièces applicables.
