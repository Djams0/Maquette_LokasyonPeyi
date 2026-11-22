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
