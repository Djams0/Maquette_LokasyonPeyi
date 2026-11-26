# Liste et demande

Réutiliser rentalNext et bookingDraft. En liste, upcoming = requested/awaiting_payment/confirmed, active = in_progress/return_reported/returned et history = completed/declined/withdrawn. Vérifier ces ensembles dans rentals.js au SHA de départ. En demande, garder le brouillon par véhicule, la période Guadeloupe, l’estimation calculée et les clés existantes. Conserver la requête active pendant un retour fiche et garder le choix de date explicite. Un résultat incertain n’autorise pas un nouveau POST avec une clé différente. Cas nominal avec l’un des véhicules publiés et périodes fictives; refus 409, 422, brouillon absent et déconnexion en navigation.

## `/rentals`

**État de départ** · Partiel. **Accès** · Client participant pour ses locations. **Planches** · [p. 16](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=16), [p. 27](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=27).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/rentals.js`, `client/pages/booking-state.js` |
| API sous /api/v1 | GET /bootstrap |
| Données et actions | Onglets upcoming/active/history, état réel et prochaine action |
| Desktop | Liste de cartes en lignes: image identifiante, dates/commune, badge et une action. Filtre dans URL. |
| Mobile | Empiler dates/état/CTA, onglets nommés, état vide adapté à l’onglet. |
| États et erreurs à vérifier | Pas de location, attente de l’autre rôle, API indisponible |
| Tests navigateur (noms de suites) | booking,maquette,visual-qa |
| Nature de la modification | A |

## `/request/:id`

**État de départ** · Partiel. **Accès** · Locataire authentifié; envoi conditionné par identité vérifiée et véhicule éligible. **Planches** · [p. 17](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=17).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/rentals.js`, `client/pages/booking-state.js`, `client/pages/search-state.js` |
| API sous /api/v1 | GET /vehicles/:id, POST /rentals |
| Données et actions | Brouillon par véhicule, période, confirmation, estimation, clé d’idempotence |
| Desktop | Récap véhicule et période avant confirmation, prix dans un rail de 300–325 px; dire qu’une demande ne paie rien. |
| Mobile | Récap en ligne, dates empilables, prix et effet avant CTA; préserver le retour exact à la fiche. |
| États et erreurs à vérifier | Pas de brouillon, période périmée, conflit, réponse perdue, double clic |
| Tests navigateur (noms de suites) | booking,vehicle,maquette |
| Nature de la modification | A |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).

## Critères actifs · correction V3.2

### LOC-01 · `/rentals`

[B-16](../04_VISUAL_REFERENCES/extension/planches/B-16.jpg), [B-27](../04_VISUAL_REFERENCES/extension/planches/B-27.jpg) · Onglets et ordre des cartes, première action. [Lot R03](../07_CODEX_PROMPTS/correction-v32/R03_LOCATIONS_SUIVI_PAIEMENT.md).

- **Scénario** · audit-r02 en upcoming avec requested, confirmed et awaiting_payment, newcomer en vide.
- **Ordinateur** · Lignes image/modèle/période/prix puis situation et CTA. Paiement à reprendre en premier.
- **Mobile** · Carte compacte, photo et dates au-dessus du statut et du prix, CTA principal pleine largeur visible au premier écran.
- **Écart de départ** · [Observation et preuve LOC-01](../01_AUDIT/ECARTS_CORRECTION_V32.md#loc-01).
- **Comportements** · Conserver onglet, date Guadeloupe, prix, statut, participant et retours. En cas d’égalité garder une règle stable documentée.
- **Vérification** · Payment en tête devant une demande en attente et la réservation confirmée du scénario B-16. CTA entièrement visible à 390 × 844, après fonts/images, sans défilement. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### LOC-02 · `/request/:id`

[B-17](../04_VISUAL_REFERENCES/extension/planches/B-17.jpg) · Carte trajet, dates, estimation et formulaire. [Lot R03](../07_CODEX_PROMPTS/correction-v32/R03_LOCATIONS_SUIVI_PAIEMENT.md).

- **Scénario** · renter, v1, 10–14 juin 2027 09 h Guadeloupe, brouillon issu de la fiche.
- **Ordinateur** · Récap et dates puis consentement/action à gauche, estimation dans rail droit, retour fiche au-dessus.
- **Mobile** · Retour, véhicule, période modifiable, estimation, consentement et CTA dans cet ordre.
- **Écart de départ** · [Observation et preuve LOC-02](../01_AUDIT/ECARTS_CORRECTION_V32.md#loc-02).
- **Comportements** · Prix à partir du mock, pas de paiement à l’envoi, idempotence, sortie 409 et retour exact.
- **Vérification** · Comparer premier écran plus défilement utile si nécessaire. Vérifier un seul enregistrement malgré double clic ou résultat perdu. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
