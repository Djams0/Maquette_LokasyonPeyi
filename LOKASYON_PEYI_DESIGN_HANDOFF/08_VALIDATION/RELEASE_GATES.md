# Portes de validation

**Avant lot** · vérifier le SHA, les dépendances, les deux validateurs du kit, les captures de référence et un fichier de données isolé.

**Pendant revue** · les points suivants bloquent la validation: nouveau P0/P1, rôle contourné, transition incohérente, doublon, saisie perdue, action inaccessible, régression publique ou Admin, ressource obligatoire manquante sans solution acceptée. Garder visibles les résultats de chaque contrôle CI. Un défaut historique inchangé comme PUB-01 reste une réserve, y compris lorsque les suites souples colorent le run en vert.

**Sortie** · atteindre 95/100 sur les écrans approuvés concernés et joindre les preuves fonctionnelles, les limites et la décision humaine. Valider acquisition de données, droits et comportement avant tout lot C. Une branche terminée attend la revue du mainteneur.
