# Calendrier de gestion propriétaire · p. 36

Ancre réelle `/owner/vehicles/:id#owner-calendar`; le module est `client/pages/owner-workspace.js`. Utiliser `ownerCalendarItems` de `owner-state.js`. Sur bureau le mois et le formulaire de blocage sont des zones adjacentes, formulaire d’environ 300 px, navigation de mois nommée. Sur mobile l’agenda affiche des lignes chronologiques, dates en heure Guadeloupe et statut textuel, puis le formulaire. Le mois reste disponible si ses contrôles tiennent et que le zoom n’impose aucun geste horizontal. Distinguer « demande · créneau non réservé », « créneau occupé » et « blocage manuel ». Les bornes et libérations passent par les endpoints `block` et `unblock` validés par le serveur. Les demandes n’octroient pas de disponibilité garantie.

Aux limites de mois, couvrir le même intervalle des deux côtés. Conserver le hash après mutation et rétablir le focus à la confirmation. Tester une période occupée en 409, début/fin invalides, retrait de blocage et véhicule non possédé. Voir [gestion du parc](OWNER_VEHICLES.md) et [planche](../00_SOURCE_OF_TRUTH/Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf#page=36).

## Critères actifs · correction V3.2

### OWN-05 · `/owner/vehicles/:id#owner-calendar`

[B-36](../04_VISUAL_REFERENCES/extension/planches/B-36.jpg) · Calendrier et formulaire de blocage. [Lot R07](../07_CODEX_PROMPTS/correction-v32/R07_ESPACE_PROPRIETAIRE.md).

- **Scénario** · owner audit-o02 sur audit-v02-1 en mars 2027, avec demande/occupé et blocage de test.
- **Ordinateur** · Grille du mois et formulaire côte à côte, raison lisible, liens vers détail.
- **Mobile** · Agenda des périodes ordonné et libellé avant action de blocage. Grille cachée si largeur insuffisante.
- **Écart de départ** · [Observation et preuve OWN-05](../01_AUDIT/ECARTS_CORRECTION_V32.md#own-05).
- **Comportements** · Blocage/déblocage, refus chevauchement, mappage demande non réservée, hash et focus.
- **Vérification** · Comparer depuis l’ancre aux deux largeurs. Bloquer puis libérer, vérifier 409 et rang agenda. [Statut initial et résultats](../08_VALIDATION/CORRECTION_V32.csv).
