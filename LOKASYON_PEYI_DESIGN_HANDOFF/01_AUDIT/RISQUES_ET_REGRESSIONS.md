# Risques à vérifier avant chaque lot

| Risque | Priorité | Garde de sortie |
|---|---|---|
| Refonte des surfaces globales touche les trois routes publiques | P0 de périmètre | Scope ciblé, captures protégées avant/après, vérification entre rôles, crédit et filtre. |
| Accès participant/propriété, bfcache et switch de compte | P0 | Tests de rôles, route directe 401/403, ancien contenu masqué, état API. |
| Transition, double action, paiement ou caution confondus | P0 | Suite booking et smoke du cycle complet, replay incertain documenté. |
| Photos de modèle interprétées comme état | P1 | Afficher l’étiquette et alt, séparer séries et données de constat. |
| Brouillon altéré ou message dupliqué | P0 | Avant/après écriture, changement de compte, stockage absent, mêmes corps/clé. |
| Calendrier interprète demande comme blocage | P1 | Garder ownerCalendarItems et état de période testés. |
| FAQ partage son contenu avec l’accueil | P1 | Respecter homeFaqItems et les chemins fallback, capture et scénario accueil. |
| Barre sticky couvre les champs / focus | P1 | Portrait, clavier physique et virtuel, 320, paysage, zoom. |
| Refactor de compte déforme admin ou droits | P0 | Vérifier failles de portée via tests de permission et mêmes captures admin si CSS partagé. |
| Tiroir 880 → 390 intermittent | P1 historique | Comparer au [registre de référence](HISTORIQUE_ECARTS_PUBLICS.md), garder le test, aucune correction spontanée. |
| Ancien handoff déplacé ou effacé | P1 technique | Préserver chemins de provenance utilisés par vehicle.test.mjs, manifestes et vérificateur CI. |

Voir [règles métier](../06_FONCTIONNEL/BUSINESS_RULES.md) et [critères de validation](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).
