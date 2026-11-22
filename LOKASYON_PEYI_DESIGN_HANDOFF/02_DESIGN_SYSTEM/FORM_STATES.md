# Champs, erreurs et feedback

Réutiliser field, select, textarea, bindForm, errorSlot, notice, modal et bindActions de ui/components.js. Étiquette avant contrôle, aide liée, erreur associée via aria-describedby, aria-invalid, texte utile et focus au premier champ ou au récapitulatif.

| État | Indication et comportement |
|---|---|
| Initial / vide | Expliquer le but, garder visible l’action autorisée. Identifier les champs optionnels. |
| Requête | Désactiver le geste soumis; garder le contenu, aria-busy/status selon sémantique. |
| Sauvegardé | Afficher la valeur serveur confirmée. La saisie plus récente reste locale. |
| Erreur 422 | Afficher la cause et garder les valeurs. Corriger le champ ciblé. |
| 401/403 | Reconnexion avec next sûr ou retour, sans afficher de ressources privées de tiers. |
| Réseau / résultat incertain | Conserver la saisie; vérifier l’état avant de rejouer et garder les mêmes clés/corps lorsqu’autorisés. |
| Conflit | Relire les données autorisées, présenter l’écart et la décision locale prévue. |
| Succès | Annoncer après confirmation seulement, restaurer ou déplacer le focus si la vue change. |
