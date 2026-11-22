# Assistance, FAQ, avis et reçus

Réutiliser support.js et le garde des participants. Présenter l’aide fictive, motif et location en option. Retrouver le dossier après réponse de création. Ne rendre que les échanges partagés. Pour la FAQ, sauvegarder homeFaqItems et renderFaqItems utilisés par l’accueil. Avis en deux notes distinctes et un seul envoi après clôture par le locataire; reçu partagé aux participants et impression sans valeur comptable. Les motifs « prolongation » et « annulation » ne changent pas la location.

## `/profile/reviews`

**État de départ** · À modifier. **Accès** · Client actif, avis écrits par le compte. **Planches** · [p. 30](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=30).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/account.js` |
| API sous /api/v1 | GET /bootstrap |
| Données et actions | Avis authorId=me.id, note et état de modération |
| Desktop | Entrée depuis profil, cartes repliables si longues, lien de retour clair; exposer statut effectivement fourni. |
| Mobile | Une carte par avis; note accessible et statut en texte. |
| États et erreurs à vérifier | Liste vide, pending/published/rejected, erreur API |
| Tests navigateur (noms de suites) | maquette |
| Nature de la modification | A |

## `/faq`

**État de départ** · À modifier. **Accès** · Public. **Planches** · [p. 29](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=29).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/support.js`, `client/pages/catalog.js` |
| API sous /api/v1 | Aucune API FAQ; contenu local partagé |
| Données et actions | Recherche et accordéons; aide vers connexion si nécessaire |
| Desktop | Recherche dans bloc opaque, accordéons natifs et lien d’aide contextualisé; préserver homeFaqItems. |
| Mobile | Marge 12–16 px, synopsis courts, focus visible sur summary et sortie si aucun résultat. |
| États et erreurs à vérifier | Aucun résultat, session non requise pour consulter |
| Tests navigateur (noms de suites) | maquette,explorer |
| Nature de la modification | A |

## `/assistance`

**État de départ** · À modifier. **Accès** · Client actif. **Planches** · [p. 28](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=28).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/support.js` |
| API sous /api/v1 | GET /bootstrap, POST /cases |
| Données et actions | Alias fonctionnel de cases(new), motif et location facultative |
| Desktop | Formulaire avec choix du motif, location accessible et texte; expliquer le canal fictif. |
| Mobile | Choix accessibles, texte non perdu lors d’erreur; état d’envoi annoncé. |
| États et erreurs à vérifier | 401 préserve next, 422 champs, échec envoi |
| Tests navigateur (noms de suites) | maquette,navigation |
| Nature de la modification | A |

## `/cases`

**État de départ** · À modifier. **Accès** · Client actif, dossiers liés au compte. **Planches** · [p. 30](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=30).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/support.js` |
| API sous /api/v1 | GET /cases |
| Données et actions | Liste, état, motif, date et accès détail |
| Desktop | Liste de dossiers et CTA d’ouverture; lignes actionnables semantic link. |
| Mobile | Cartes compactes en colonne, statut et horodatage restent proches. |
| États et erreurs à vérifier | Vide, accès expiré, erreur réseau |
| Tests navigateur (noms de suites) | maquette,navigation |
| Nature de la modification | A |

## `/cases/new`

**État de départ** · À modifier. **Accès** · Client actif. **Planches** · [p. 28](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=28).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/support.js` |
| API sous /api/v1 | GET /bootstrap, POST /cases |
| Données et actions | Préremplissage kind/rental, motifs du mock et location du compte |
| Desktop | Même gabarit qu’assistance. Un CTA effectue la création; destination après réponse confirmée. |
| Mobile | Afficher erreur au champ et conserver le texte. Motifs annulation/prolongation = dossier seulement. |
| États et erreurs à vérifier | Paramètres inconnus, résumé invalide, ressource inaccessible |
| Tests navigateur (noms de suites) | maquette |
| Nature de la modification | A |

## `/cases/:id`

**État de départ** · À modifier. **Accès** · Partie au dossier; données client projetées. **Planches** · [p. 28](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=28), [p. 30](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=30).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/support.js` |
| API sous /api/v1 | GET /cases/:id, POST /cases/:id (action message) |
| Données et actions | Résumé, état, échanges partagés et demande de complément |
| Desktop | Chronologie et échange dans colonne principale, aide rapide à droite; notes internes absentes. |
| Mobile | État puis échanges et formulaire; erreur générique sans détail d’un tiers. |
| États et erreurs à vérifier | Refus, introuvable, clôture, erreur réponse |
| Tests navigateur (noms de suites) | maquette |
| Nature de la modification | A |

## `/review/:id`

**État de départ** · À modifier. **Accès** · Locataire après clôture; règles serveur. **Planches** · [p. 31](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=31).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/support.js` |
| API sous /api/v1 | GET /rentals/:id, POST /rentals/:id/review |
| Données et actions | Notes véhicule et propriétaire 1–5, texte soumis à modération |
| Desktop | Deux groupes indépendants et commentaire. Mesurer l’autorisation déjà calculée au suivi, ajouter une présentation cohérente en accès direct sans changer le serveur. |
| Mobile | Groupes nommés, focus et nombre annoncé. Éviter interaction étoile seule sans équivalent clavier. |
| États et erreurs à vérifier | Avant clôture, second avis, validation ou mauvais rôle |
| Tests navigateur (noms de suites) | maquette,booking |
| Nature de la modification | B |

## `/receipt/:id`

**État de départ** · Partiel. **Accès** · Participants après completed. **Planches** · [p. 31](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=31).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/support.js` |
| API sous /api/v1 | GET /rentals/:id |
| Données et actions | Reçu fictif, période, quote et impression |
| Desktop | Document centré, total et statut séparés, impression navigateur avec mention sans valeur comptable. |
| Mobile | Lisible sans défilement horizontal; commande imprimer au-dessous du document. |
| États et erreurs à vérifier | Avant clôture, accès refusé, valeur manquante |
| Tests navigateur (noms de suites) | maquette,booking |
| Nature de la modification | A |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).
