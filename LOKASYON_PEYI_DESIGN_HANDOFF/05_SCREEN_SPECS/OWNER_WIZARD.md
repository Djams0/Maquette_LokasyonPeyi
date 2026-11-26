# Assistant de publication

Ordre visuel exact des sections et groupes: Véhicule [1 identification,3 caractéristiques], État et photos [4 équipements,5 photos], Disponibilité et prix [7 prix/règles,8 disponibilité], Revue et envoi [2 documents,6 sécurité,9 récapitulatif]. Cinq prises fictives et trois justificatifs synthétiques. Conserver le tampon isolé par compte, le step historique 1–9, la reprise serveur et la validation de tous les groupes. Comparer champ par champ lors d’une divergence; le choix ne déclenche pas de sauvegarde. Gel du corps/clé lors d’une tentative incertaine; l’annonce passe en revue après confirmation de l’API. La comparaison de contenu n’est pas un verrou opposable à deux processus.

## `/owner/vehicles/new`

**État de départ** · Partiel. **Accès** · Propriétaire actif. **Planches** · [p. 23](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=23), [p. 39](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=39), [p. 40](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=40), [p. 41](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=41).

| Élément | Spécification |
| --- | --- |
| Code | `client/pages/wizard.js`, `client/pages/owner-state.js` |
| API sous /api/v1 | GET /me, GET/POST /owner/draft, POST /owner/vehicles |
| Données et actions | Quatre sections, neuf groupes, step historique; tampon local et envoi gelé |
| Desktop | Stepper 4 sections à gauche, formulaire à droite, statut de sauvegarde avant champs, résumé avant revue. |
| Mobile | Étape et reprise en tête, formulaire vertical, CTA hors clavier, retour groupe ciblé. |
| États et erreurs à vérifier | Divergence, brouillon vide, stockage indisponible, photo insuffisante, résultat incertain |
| Tests navigateur (noms de suites) | owner,maquette,navigation |
| Nature de la modification | B |

Voir [les fondations et gabarits](../02_DESIGN_SYSTEM/DESIGN_SYSTEM_V3.2.md) et [la recette](../08_VALIDATION/ACCEPTANCE_CRITERIA.md).

## Critères actifs · correction V3.2

### WIZ-01 · `/owner/vehicles/new`

[B-39](../04_VISUAL_REFERENCES/extension/planches/B-39.jpg), [B-41](../04_VISUAL_REFERENCES/extension/planches/B-41.jpg) · Quatre sections et neuf étapes, vues de photos. [Lot R08](../07_CODEX_PROMPTS/correction-v32/R08_PUBLICATION_BROUILLONS.md).

- **Scénario** · owner depuis le parc et audit-o02 reprenant step=5.
- **Ordinateur** · Navigation des étapes en rail, formulaire état/photos et actions sauvegarde/continuer, référence sous vrai état enregistré.
- **Mobile** · Retour, progression, statut du brouillon, vues en liste, commande persistante seulement si elle ne masque aucun champ.
- **Écart de départ** · [Observation et preuve WIZ-01](../01_AUDIT/ECARTS_CORRECTION_V32.md#wiz-01).
- **Comportements** · Validations des groupes, 5 vues fictives, 3 justificatifs, même step, aucune pièce réelle ni saisie de défaut nouvelle.
- **Vérification** · Comparer step=5 aux deux largeurs et rejouer liens step=1 à 9 avec saisie et reprise. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).

### WIZ-02 · `/owner/vehicles/new`

[B-23](../04_VISUAL_REFERENCES/extension/planches/B-23.jpg), [B-40](../04_VISUAL_REFERENCES/extension/planches/B-40.jpg), [B-41](../04_VISUAL_REFERENCES/extension/planches/B-41.jpg) · Récapitulatif, conflit et envoi. [Lot R08](../07_CODEX_PROMPTS/correction-v32/R08_PUBLICATION_BROUILLONS.md).

- **Scénario** · owner step=9 complet puis divergence locale/serveur et résultat inconnu.
- **Ordinateur** · Progression, récap par groupe puis conditions et actions. Alerte conflit avec valeurs et résolution explicite.
- **Mobile** · Récap condensé en sections; reprise d’envoi et autosaisie clairement identifiées, sans masquer CTA.
- **Écart de départ** · [Observation et preuve WIZ-02](../01_AUDIT/ECARTS_CORRECTION_V32.md#wiz-02).
- **Comportements** · Conserver valeurs locales, résolution par comparaison existante, une annonce pending malgré résultat perdu.
- **Vérification** · Comparer récap et divergence séparément, vérifier un seul POST effectif et tracer état après envoi. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
