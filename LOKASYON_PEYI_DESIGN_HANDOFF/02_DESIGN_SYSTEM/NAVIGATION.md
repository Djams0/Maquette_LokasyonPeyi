# Navigation et contexte

client/pages/navigation.js expose navigationRole, primaryDestinations, currentDestination, safeNext et navigationState. client/shell.js fabrique menu et barre basse. client/app.js relit /me et traite pageshow persisté.

- Visiteur · Explorer, Aide, Compte. Locataire · Explorer, Locations, Messages, Documents. Propriétaire · Explorer, Mon parc, Demandes, Profil. Conserver l’accès aux locations et messages via le menu. Admin sur une origine séparée.
- Conserver retour fiche, recherche q des messages, état de catalogue, période Guadeloupe, filtre de liste et step. Sur le fil, préserver la priorité au retour. Sur suivi, paiement et constat, garder l’action près du contenu.
- Pour une destination privée, next passe par safeNext. Revalider la session après restauration navigateur et retirer le contenu précédent pendant la vérification. Vérifier le focus de fermeture, l’orientation et le menu d’état actif.
- Exécuter navigation.spec.js, search.spec.js, messaging.spec.js, booking.spec.js et visual-qa.spec.js.

## Capsule interne V3.2 · R01

**Références** · B-11 fondations, B-13 connexion, B-15 profil, B-16 locations, B-24/25 messagerie, B-33 Aujourd’hui et B-43/44/45. Voir le [registre](../00_SOURCE_OF_TRUTH/INDEX_PDF.md) et les écarts [HDR-01 et HDR-02](../01_AUDIT/ECARTS_CORRECTION_V32.md).

| Surface | À 1440 × 960 | À 390 × 844 |
|---|---|---|
| Visiteur | Logo horizontal bicolore à gauche; Explorer et Aide au centre, Connexion et Menu à droite. Le bouton Connexion représente l’accès Compte dans B-13. | Logo, Connexion puis Menu, sur une rangée; retour sous la capsule sur les écrans d’authentification, d’aide et d’introduction. |
| Locataire | Logo, Explorer / Locations / Messages / Documents; cloche, accès Compte puis Menu. | Logo, cloche, Menu; Compte accessible via Menu. Barre basse sur Locations, liste Messages et Profil; quatre destinations selon le rôle. |
| Propriétaire | Logo, Explorer / Mon parc / Demandes / Profil; cloche, Compte, Menu. Sur Aujourd’hui, Mon parc actif en navigation principale et Aujourd’hui actif en sous-navigation. | Logo, cloche, Menu; Compte via Menu. Barre basse sur Aujourd’hui; contrôle propriétaire contextuel selon la planche du gabarit et espace disponible. |
| Tunnel, détail, outils et erreurs | Variante commune avec accès par rôle, retour métier nommé avant le titre s’il est prévu. Sur une route sans destination primaire, marquer le lien contextuel approprié dans le menu. | Retour près du contenu pour demande, suivi, paiement, constats, fil ouvert, documents, gestion, calendrier, avis et reçu; pas de barre globale qui concurrence leur action. |

La variante interne vient du shell commun. Elle couvre les routes de la cartographie hors découverte publique, y compris `/owner/start`, FAQ, outils et erreurs client. Conserver la classification publique des trois routes validées et la variante de pied existante de la fiche. `navigationState`, `currentDestination`, `primaryDestinations` et `navigationRole` restent les sources de navigation. Pour toute divergence entre une route et sa planche, joindre la planche, l’état et la décision de revue. Dans le menu, conserver les destinations de second rang, dont Messages/Locations pour le propriétaire, les destinations de récupération et les liens actuels par rôle.

Mettre l’identité et la capsule sur une seule rangée au scénario nominal à 390. Contrôler la hauteur, les insets et l’alignement avec le contenu en boîte CSS. B-13/15/16/24/33 fixe l’ordre, la silhouette, la bordure douce, les marges et la répartition des zones. La largeur exacte du logo, l’espacement et les seuils intermédiaires se règlent avec les tokens et se justifient par des captures, car les planches composées sont à échelle réduite. Le [fichier officiel](../../assets/v32/marque/logo-horizontal-charte.webp) doit être visible et décodé, dans ses proportions natives. Conserver le nom accessible « Lokasyon Péyi » et le lien vers l’accueil.

Réserver la mention de démonstration au Menu → Démonstration et au pied de page dans les surfaces internes, ainsi qu’au contexte des actions fictives qui le demandent. Garder `/demo`, `/demo/audit` et `/design-system` atteignables. Le formulaire de connexion et les paiements conservent leurs consignes de simulation. Vérifier que l’accès de récupération fonctionne pendant une panne simulée.

Marquer la destination exacte avec `aria-current="page"` et son parent avec `location`. Préserver le focus et les groupes au changement de session, la neutralité pendant la relecture de `/me`, la boucle de tabulation et le retour du focus après fermeture. Garder la barre basse en retrait du clavier ou du contrôle focalisé, avec les zones sûres, une réserve de défilement et des cibles suffisantes. Vérifier le reflow à 320 px et à 200 % de zoom sans couper les libellés ni rendre les commandes inaccessibles.
