# Portes de validation

**Avant lot** · vérifier le SHA, les dépendances, les deux validateurs du kit, les captures de référence et un fichier de données isolé.

**Pendant revue** · les points suivants bloquent la validation: nouveau P0/P1, rôle contourné, transition incohérente, doublon, saisie perdue, action inaccessible, régression publique ou Admin, ressource obligatoire manquante sans solution acceptée. Garder visibles les résultats de chaque contrôle CI. Un défaut historique inchangé comme PUB-01 reste une réserve, y compris lorsque les suites souples colorent le run en vert.

**Sortie** · renseigner les trois résultats par critère et produire les preuves, les limites et la décision humaine. La note B-47 reste disponible comme synthèse. Valider acquisition de données, droits et comportement avant tout lot C. Une branche terminée attend la revue du mainteneur.

Pour la correction R01–R09, appliquer les [trois résultats par écran et largeur](ACCEPTANCE_CRITERIA.md). La revue tranche chaque écart majeur. R01 exige une capsule avec logo chargé sur les routes internes, selon les exceptions explicitement acceptées. Conserver les contrôles métier et publics sous leurs critères propres.
