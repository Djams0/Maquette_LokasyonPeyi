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

## Critères actifs · correction V3.2

### SUP-06 · `/profile/reviews`

[B-30](../04_VISUAL_REFERENCES/extension/planches/B-30.jpg) · Mes avis, statut de modération. [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md).

- **Scénario** · renter sur avis seed puis cas sans avis.
- **Ordinateur** · Trace des avis et véhicule avec détenteur du compte, liste sobre.
- **Mobile** · Retour, titres et statut avant commentaire.
- **Écart de départ** · [Observation et preuve SUP-06](../01_AUDIT/ECARTS_CORRECTION_V32.md#sup-06).
- **Comportements** · Contenu et état du mock, aucune édition ou permission supplémentaire.
- **Vérification** · Capture, écran vide et projection des seuls avis applicables. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### SUP-01 · `/faq`

[B-29](../04_VISUAL_REFERENCES/extension/planches/B-29.jpg) · Champ recherche, accordéons et aide visiteur puis connecté. [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md).

- **Scénario** · Visiteur avec question caution puis terme sans résultat, locataire pour sortie assistance.
- **Ordinateur** · Retour, titre, recherche puis accordéons et aide contexte.
- **Mobile** · Recherche et résultat sans scroll horizontal, contrôle accordéon atteignable au clavier.
- **Écart de départ** · [Observation et preuve SUP-01](../01_AUDIT/ECARTS_CORRECTION_V32.md#sup-01).
- **Comportements** · Recherche filtre, accordéons, sortie adaptée à la session.
- **Vérification** · Comparer ordre B-29 et états résultat/vide. Vérifier Tab et destination de contact. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### SUP-02 · `/assistance`

[B-28](../04_VISUAL_REFERENCES/extension/planches/B-28.jpg), [B-44](../04_VISUAL_REFERENCES/extension/planches/B-44.jpg) · Formulaire de motif et contexte clientèle. [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md).

- **Scénario** · renter connecté, location optionnelle, visiteur avec redirection next.
- **Ordinateur** · Titre et carte formulaire avant aide, si rail nécessaire utiliser B-28 gauche comme principe.
- **Mobile** · B-28 droite, motif puis réservation applicable puis description, bouton ouvrir visible et défauts annoncés.
- **Écart de départ** · [Observation et preuve SUP-02](../01_AUDIT/ECARTS_CORRECTION_V32.md#sup-02).
- **Comportements** · Aide et dossier fictifs, cas/lien filtrés, anti-doublon, validation serveur.
- **Vérification** · Comparer formulaire à 390 et vérifier la même saisie à 1440. Soumettre une fois et retrouver le dossier. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### SUP-04 · `/cases`

[B-30](../04_VISUAL_REFERENCES/extension/planches/B-30.jpg), [B-27](../04_VISUAL_REFERENCES/extension/planches/B-27.jpg) · Carte dossier et CTA ouvrir. [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md).

- **Scénario** · renter avec case-demo puis compte sans dossier.
- **Ordinateur** · Cartes par dossier, état en texte et action consulter. CTA ouvrir au niveau de la liste.
- **Mobile** · Retour profil, titre, dossier puis ouvrir. Vide avec sortie utile.
- **Écart de départ** · [Observation et preuve SUP-04](../01_AUDIT/ECARTS_CORRECTION_V32.md#sup-04).
- **Comportements** · Conserver le contrôle de visibilité et la continuité du retour.
- **Vérification** · Capturer liste et vide par largeur. Aucun dossier tiers rendu. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### SUP-03 · `/cases/new`

[B-28](../04_VISUAL_REFERENCES/extension/planches/B-28.jpg) · Formulaire et action ouvrir un dossier. [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md).

- **Scénario** · Renter depuis Mes dossiers puis suivi d’une location.
- **Ordinateur** · Réutiliser le même gabarit que /assistance avec retour du parcours valide.
- **Mobile** · Formulaire avant l’aide, retour lisible et bouton découvert sans éléments dupliqués.
- **Écart de départ** · [Observation et preuve SUP-03](../01_AUDIT/ECARTS_CORRECTION_V32.md#sup-03).
- **Comportements** · Rattachement uniquement si participant, sortie vers dossier créé.
- **Vérification** · Mêmes critères SUP-02, essai entrée avec location et 403 tiers. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### SUP-05 · `/cases/:id`

[B-28](../04_VISUAL_REFERENCES/extension/planches/B-28.jpg), [B-30](../04_VISUAL_REFERENCES/extension/planches/B-30.jpg) · Statut, échanges et aide rapide. [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md).

- **Scénario** · case-demo avec renter, participant puis audit-r02 tiers.
- **Ordinateur** · Statut et étapes/consigne avant les échanges, rail aide à droite. Réponse près du fil.
- **Mobile** · Retour à la liste, état, prochaine action et échanges avant aide secondaire. Composer sans recouvrement.
- **Écart de départ** · [Observation et preuve SUP-05](../01_AUDIT/ECARTS_CORRECTION_V32.md#sup-05).
- **Comportements** · Permissions, messages partagés éligibles, notes internes invisibles, résultat d’envoi inconnu récupérable.
- **Vérification** · Capture état équivalent avec échange, 403 sans données, une écriture confirmée. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### SUP-07 · `/review/:id`

[B-31](../04_VISUAL_REFERENCES/extension/planches/B-31.jpg) · Deux notes, commentaire et validation. [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md).

- **Scénario** · Location completed sans avis côté locataire, puis après soumission.
- **Ordinateur** · Saisie de deux notes nommées, commentaire et action dans la carte, extrapolation bureau selon B-43.
- **Mobile** · Retour suivi, carte notes et commentaire avec CTA « Envoyer pour modération ».
- **Écart de départ** · [Observation et preuve SUP-07](../01_AUDIT/ECARTS_CORRECTION_V32.md#sup-07).
- **Comportements** · Un avis, location clôturée et auteur admissible, confirmation serveur.
- **Vérification** · Capturer le formulaire éligible et la confirmation. Aucun doublon ni notation propriétaire imitée. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### SUP-08 · `/receipt/:id`

[B-31](../04_VISUAL_REFERENCES/extension/planches/B-31.jpg) · En-tête fictif, détails et impression. [Lot R06](../07_CODEX_PROMPTS/correction-v32/R06_ASSISTANCE_CLOTURE.md).

- **Scénario** · audit-LP-002 completed côté participant.
- **Ordinateur** · Reçu avec identité fictive, dates, total, action impression, version bureau dérivée de B-31.
- **Mobile** · Retour suivi, pièce compacte, action impression sans recouvrement.
- **Écart de départ** · [Observation et preuve SUP-08](../01_AUDIT/ECARTS_CORRECTION_V32.md#sup-08).
- **Comportements** · Clôture requise, profils participants seuls, montants mock et impression fictive.
- **Vérification** · Capture des détails et PDF d’impression simulée. Tester 403, résultat imprimable sans chrome. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
