# Compte et connexion

Réutiliser safeNext, le query next, le mécanisme de session de client/app.js et les champs/retours de ui/components.js. Après sélection d’un compte, n’afficher une confirmation qu’après réponse du mock. Lors du retour bfcache, conserver le gel temporaire et la relecture de /me. Le formulaire de connexion liste des personas, celui d’inscription utilise la création fictive. Les documents restent des entrées synthétiques. Si la pièce est refusée, afficher le motif renvoyé et garder l’action de génération du mock. Garder la copie de l’aide et de la reprise près de l’action. Vérifier invité, compte éligible, compte incomplet, compte propriétaire et compte suspendu.

## `/login`

**État de départ** · À modifier. **Accès** · Public. **Planches** · [p. 13](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=13).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/account.js`, `client/pages/navigation.js` |
| API sous /api/v1 | GET /personas?app=client, POST /session |
| Données et actions | Choix de persona et next local validé |
| Desktop | Carte connexion deux zones, formulaire 55–60%, bourg Deshaies en panneau droit. Label mode démo avant le formulaire. |
| Mobile | Une zone, panneau image masqué par présentation; retour et formulaire restent visibles. |
| États et erreurs à vérifier | Persona indisponible, mode réseau, retour sans contexte |
| Tests navigateur (noms de suites) | navigation,booking,maquette |
| Nature de la modification | A |

## `/register`

**État de départ** · À modifier. **Accès** · Public. **Planches** · [p. 14](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=14).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/account.js`, `client/pages/navigation.js` |
| API sous /api/v1 | GET /personas?app=client, POST /register |
| Données et actions | Prénom fictif, consentement démo, cookie, retour next |
| Desktop | Même enveloppe d’authentification. Lien vers connexion conserve next. Carte courte et information de vérification. |
| Mobile | Empiler les choix; clavier natif et focus sur premier champ en erreur. |
| États et erreurs à vérifier | Nom invalide, consentement absent, erreur API |
| Tests navigateur (noms de suites) | navigation,explorer,maquette |
| Nature de la modification | A |

## `/profile`

**État de départ** · Partiel. **Accès** · Client actif. **Planches** · [p. 15](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=15).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/account.js` |
| API sous /api/v1 | GET /bootstrap, DELETE /session |
| Données et actions | Identité, éligibilité, raccourcis compte/location/aide, déconnexion |
| Desktop | Bandeau menthe identité puis colonne compte et rail rôles/aide; Démo et audit dans un détail. |
| Mobile | Identité compacte puis sections verticales; pas de bouton propriétaire redondant pour un propriétaire. |
| États et erreurs à vérifier | Session perdue, données absentes, distinction propriétaire |
| Tests navigateur (noms de suites) | navigation,maquette |
| Nature de la modification | A |

## `/profile/documents`

**État de départ** · À modifier. **Accès** · Client actif, pièces du compte. **Planches** · [p. 14](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=14).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/account.js` |
| API sous /api/v1 | GET /bootstrap, POST /documents |
| Données et actions | Documents sans vehicleId, type, statut, version, motif vérifié |
| Desktop | Liste de cartes par type, statut texte, raison et action au bord de la carte. |
| Mobile | Statut près du nom, action pleine largeur si nécessaire. Confirmation unique et état annoncé. |
| États et erreurs à vérifier | Requis, pending, verified, rejected; échec de création fictive |
| Tests navigateur (noms de suites) | navigation,maquette |
| Nature de la modification | A |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).

## Critères actifs · correction V3.2

### ACC-01 · `/login`

[B-13](../04_VISUAL_REFERENCES/extension/planches/B-13.jpg) · Carte formulaire, panneau photo et bandeau de contexte. [Lot R02](../07_CODEX_PROMPTS/correction-v32/R02_COMPTE.md).

- **Scénario** · Visiteur, next=/request/v1 depuis la fiche avec dates, persona renter.
- **Ordinateur** · Formulaire à gauche avec avis démo avant le sélecteur et CTA, bourg de Deshaies recadré à droite avec cartouche et crédit.
- **Mobile** · Retour, titre, modes, avis, sélecteur, CTA puis exploration dans une carte. Photo écartée du premier écran comme en B-13.
- **Écart de départ** · [Observation et preuve ACC-01](../01_AUDIT/ECARTS_CORRECTION_V32.md#acc-01).
- **Comportements** · Connexion fictive, safeNext et reprise des dates sans POST de demande.
- **Vérification** · Comparer panneau photo à droite et crédit à 1440. À 390, contrôle de compte et CTA visibles avant tout visuel. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### ACC-02 · `/register`

[B-13](../04_VISUAL_REFERENCES/extension/planches/B-13.jpg), [B-14](../04_VISUAL_REFERENCES/extension/planches/B-14.jpg) · Modes et carte de création. [Lot R02](../07_CODEX_PROMPTS/correction-v32/R02_COMPTE.md).

- **Scénario** · Visiteur, next local, champ vide puis invalide.
- **Ordinateur** · Enveloppe commune et consentement fictif près du champ. Utiliser la composition B-13 comme extrapolation pour le bureau, seul le mobile inscription est dessiné.
- **Mobile** · Retour, titre, modes, avis, prénom, confirmation et CTA visibles dans cet ordre.
- **Écart de départ** · [Observation et preuve ACC-02](../01_AUDIT/ECARTS_CORRECTION_V32.md#acc-02).
- **Comportements** · Création fictive confirmée par serveur, erreur et reprise cohérentes, données réelles exclues.
- **Vérification** · Capture mobile B-14 et bureau avec extrapolation signalée. Tester validation, changement de mode et reprise. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### ACC-03 · `/profile`

[B-15](../04_VISUAL_REFERENCES/extension/planches/B-15.jpg) · Bandeau menthe, liste « Votre compte », rail propriétaire/aide. [Lot R02](../07_CODEX_PROMPTS/correction-v32/R02_COMPTE.md).

- **Scénario** · renter puis owner, compte incomplet en contrôle.
- **Ordinateur** · Identité et session dans un bandeau, raccourcis compte en premier, panneau propriétaire/aide secondaire.
- **Mobile** · Identité compacte puis compte puis aide/espace propriétaire. Barre basse avec contexte actif.
- **Écart de départ** · [Observation et preuve ACC-03](../01_AUDIT/ECARTS_CORRECTION_V32.md#acc-03).
- **Comportements** · Actions par rôle, documents, déconnexion confirmée, session revalidée au retour.
- **Vérification** · Vérifier ordre, action déconnexion et aucun CTA d’activation redondant pour owner. Comparer les libellés métier disponibles. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### ACC-04 · `/profile/documents`

[B-14](../04_VISUAL_REFERENCES/extension/planches/B-14.jpg) · Pile de pièces et motif d’état. [Lot R02](../07_CODEX_PROMPTS/correction-v32/R02_COMPTE.md).

- **Scénario** · newcomer, puis audit-o09 refusé et audit-r02 vérifié.
- **Ordinateur** · Statut et version par type, motif et action alignés. Largeur bureau dérivée du gabarit B-43.
- **Mobile** · Retour utile, avis de vérification, piles compactes avec état textuel et CTA près de la pièce.
- **Écart de départ** · [Observation et preuve ACC-04](../01_AUDIT/ECARTS_CORRECTION_V32.md#acc-04).
- **Comportements** · Aucune vraie pièce, état confirmé, relance ordonnée et motif serveur.
- **Vérification** · Comparatifs pending et refusé à 390, version et retour vérifiés aux deux largeurs. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
