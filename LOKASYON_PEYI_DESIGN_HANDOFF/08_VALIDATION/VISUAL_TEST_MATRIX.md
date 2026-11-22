# Matrice visuelle et méthode

1. Geler Chromium 141 / Playwright 1.56.1, DPR 1, fr-FR, America/Guadeloupe, mouvement réduit, heure fixe, mêmes dates et fixture. Réutiliser les outils.
2. Prendre le premier écran et le rendu complet selon la composition. Les PNG protégés sont des captures d’exécution. Les JPEG cibles B proviennent de planches PDF. À 390 et desktop les gabarits sont illustrés, les largeurs intermédiaires suivent B p. 43 et les [règles d’intégration](../02_DESIGN_SYSTEM/RESPONSIVE.md).
3. Pour chaque zone, comparer bounding boxes, marges/padding, tailles de type, couleurs calculées, bordures et textes. Lorsque les données et l’échelle sont identiques, joindre superposition et différence via compare_v32.py. Pour un extrait de composition B, noter la région et le facteur de mise à l’échelle; aucune tolérance pixel n’est déduite d’une planche composite. Vérifier d’abord la sémantique, l’état et les actions.
4. Rejouer le flux sur fixture non substituée. Évaluer le score via [acceptation](ACCEPTANCE_CRITERIA.md) et journal de chaque branche.

| Famille | Références B | États à capturer / contrôler | Largeurs |
|---|---|---|---|
| Compte | 13–15, 30 | Connexion, inscription, identité, incomplet/refusé, profil, avis | 320, 390, 768, 1440 |
| Locations | 16–20, 27 | Onglets vides, demande, acceptation, paiement refusé, suivi par acteur | 320, 390, 430, 1024, 1440 |
| Constats | 21–23 | 0/8, première manquante, capture refusée, verrou finalisé | 320, 390, 768, 1440 |
| Messages et notifications | 24–27 | Vide, recherche, fil, envoi, résultat inconnu, notification lue/non lue | 320, 375, 390, 768, 1024, 1440 |
| Assistance | 28–31 | FAQ recherchée/vide, dossier, échanges, avis, reçu impression | 320, 390, 768, 1280, 1440 |
| Propriétaire | 32–42 | Tableau, blocage, demande, parc, gestion, revenus, divergence, revue | 320, 390, 430, 768, 1024, 1280, 1440 |
| Protégées | Captures réelles | Nominal aux huit largeurs, galerie/tunnel/retours à 390 et 1440, 880↔390 | Huit largeurs à chaque lot |
| Accessibilité et performance | 43–48 | Zoom, focus/défilement, contraste, poids images, erreurs et lenteur | Huit largeurs sur campagne finale |

Comparer performance au même scénario (poids transféré, requêtes, métriques de chargement si disponibles, et stabilité de mise en page). Signaler les écarts environnementaux et vérifier qu’aucune photo n’est requise pour rendre l’action interactive.
