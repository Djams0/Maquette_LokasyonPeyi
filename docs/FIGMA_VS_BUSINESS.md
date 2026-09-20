# Figma ↔ règles métier actuelles

Source Git : main `33bf766339de6745f82e7b51422c0eae59b1750f`. Les propositions restent proposées ; le présent simulateur n'approuve aucun contrat.

| Figma / PDF | Git actuel | Décision maquette | Justification |
|---|---|---|---|
| p.11/14 paiement validé avant accord ; p.22 après accord ; p.9 refus remboursé | BR-04 confirmé ; BR-05/16 proposés, D-02/06 | Demande sans débit → accord → paiement fictif → confirmation | Parcours unique ; refus n'affiche pas un remboursement inexistant |
| p.7/8/9/10/17 commission 25 %, 32×10×75 %=245 | D-06 ouvert, CON-03 | Simulateur de chiffre brut seulement ; pas de net ni commission arrêtée | Calcul historique incohérent (240 et non 245) |
| p.8/20 caution 600 €, montant libre, renforcé 900 € | BR-18/19 proposés, D-08 ouvert | Montant non défini ; scénario d'autorisation fictive séparé | Aucune règle libre par propriétaire ni fausse garantie carte |
| p.7 « jamais débitée sauf dommage » | BR-19/21 : dossier, contradictoire, permission | Pas de débit automatique au signalement | Dommage allégué ≠ responsabilité établie |
| p.4/5/10 Stripe définitif et versements mardi | ADR-007 BLOCKED, BR-17 proposé, D-07 | Pas de SDK/PSP ; suivi éligibilité/transfert/virement distinct sans délai chiffré | 72 h reste aussi une proposition |
| p.7/8 assurance incluse automatique ; p.14 assurance +18 € | BR-03 confirmé, D-04/06 ouverts, CON-02 | Conditions à valider ; contrôle fictif explicite | Pas de couverture contractuelle inventée |
| p.9/14 réponse 2 h ; p.8/12 validation 24 h | BR-06 proposé, D-02 ouvert | En attente sans SLA | Aucune constante commerciale depuis un exemple |
| p.4/7/10/16 médiation sous 48 h | BR-21, D-09 ouvert | Dossier reçu et suivi humain, pas de délai promis | Temps de traitement non approuvé |
| p.8 21 ans, véhicule <10 ans, CT <2 ans | D-04 éligibilité assureur ouverte | Pas de filtre d'âge ni validation automatique | Une maquette ne définit pas l'assurabilité |
| p.8/9 inter-îles à discrétion propriétaire | BR-02 proposé ; A-13/F report | Sélecteur désactivé, reprise après validation contractuelle | Pas d'accord maritime par bouton |
| p.2/8/9 tracker recommandé/actif | A-13, BR-02, F report | GPS/IoT reporté, aucune collecte | Équipement GPS navigation distinct du suivi du conducteur |
| p.8/13/15 200 km/j et 0,65 €/km | D-03/09 ouverts | Relevés/distance calculés, barème non défini, aucun frais | Mesure ≠ facturation |
| p.8 frais de nettoyage/retard via caution | BR-12/20, D-09 | Signalement au support et dossier contradictoire | Pas de prélèvement libre propriétaire |
| p.12/14/16/17 -5 %, points, palier fidélité | Non validé | Mention reportée dans profil, aucun rabais appliqué | Devis fictif cohérent sans promotion inventée |
| p.16 retour = clôture et recrédit 3–5 jours | BR-05/11/18 | Retour déclaré, récupération, clôture, caution séparés | Une libération d'autorisation n'est pas un remboursement |
| p.10/15 photo horodatée comme preuve forte | BR-10/11, ADR-009 | Huit vues guidées, origine simulée, versions, réserves | Photo/hash/date ne décident jamais seuls |
| p.2 contrôle document par bouton unique | BR-09 | Cinq critères non précochés, motif et version obligatoires | Revue humaine traçable, pas preuve d'authenticité |
| p.6 super-admin « Tout accès » | BR-23, PERMISSIONS D-10 proposé | Super-admin gestion personnel seulement par défaut | Refus API même par URL directe |
| p.4 retenir/rembourser immédiatement | PERMISSIONS séparation des tâches | Proposition puis autre personne approuve version exacte | Auteur ne s'approuve pas ; aucun fonds réel |
| p.21 téléphone/naissance obligatoires | UI_FOUNDATIONS, D-05 | Inscription minimale fictive ; pas de vraie pièce ni IBAN | Minimisation |
| p.13 NLP « couverture assurance » | TECH_STACK : moteur NLP hors phase 0 | Message encadré, avertissement simulé sans NLP ni garantie | Pas de promesse de protection contractuelle |
| p.11 blanc sur vert tropical/lagon/orange | UI_FOUNDATIONS ratios insuffisants | Vert profond pour boutons texte blanc ; orange avec encre | Cible WCAG 2.2 AA, sans certification globale |
| Architecture web unique Next du Git | Référence projet principal | Deux frontends vanilla / API commune, uniquement ici | Instruction explicite de cette mission indépendante |
