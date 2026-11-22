# Migration et restauration

Le kit intègre tous les chemins du SHA audité. Le mode remplacement garde le dossier original dans une sauvegarde adjacente. Le mode mise à jour n’écrit que les chemins ajoutés et actualisés, depuis une copie du dossier courant. Les deux commencent par un aperçu et vérifient l’intégrité du kit. Les fichiers applicatifs, tests, workflows, fixtures et assets runtime restent hors installation.

Le [CSV historique](INVENTAIRE_HANDOFF_EXISTANT.csv) répertorie les 137 décisions et les empreintes de départ. Les nouveaux chemins se trouvent dans [le manifeste](../HANDOFF_MANIFEST.json) en soustrayant les chemins du CSV. L’installateur énumère exactement les ajouts et actualisations avant application. Les quatre actualisations ne déplacent aucune donnée. Les nouveaux dossiers concernent audit, extensions visuelles, système, fonctions, prompts et validation.

Restaurer le dossier de sauvegarde ou effectuer un revert du commit documentaire, sur une branche. Consulter [le guide](../INSTALLATION.md) pour les commandes. Aucun fichier historique n’est supprimé. En cas de variante de main plus récente, vérifier les dépendances, le diff de fichiers et le manifeste avant une éventuelle intégration manuelle.
