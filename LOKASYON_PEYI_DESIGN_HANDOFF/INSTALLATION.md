# Installer le handoff dans Maquette_LokasyonPeyi

Extraire le ZIP en dehors du dépôt. Le dossier à intégrer est **LOKASYON_PEYI_DESIGN_HANDOFF/**. Le script prépare le diff en mode aperçu, puis exige explicitement --apply. Sur le SHA audité, les deux modes aboutissent au même contenu versionnable.

1. Ouvrir un PowerShell (ou Bash) dans le dépôt maquette. Exécuter git status, git fetch origin et git rev-parse origin/main. Le SHA audité est 4338f5f7ca252f4d4f02021ec47a226d0d2d6064. Si main a avancé, examiner les changements qui touchent le handoff et les routes avant de reprendre cette base. Le script refuse les collisions et les SHA différents.
2. Créer la branche dédiée. Aucun volume ni fichier métier n’est traité.

~~~powershell
git switch -c docs/v32-extension-client
$kit = "C:\Users\VotreNom\Downloads\Handoff\LOKASYON_PEYI_DESIGN_HANDOFF"
py -3 "$kit/tools/install_extension.py" . --mode overlay
~~~

3. **Mode B · mise à jour**. Choisir overlay pour superposer le contenu et conserver les documents existants. Le script classe ajout, remplacement et conservation par chemin. Appliquer le mode après lecture de l’aperçu.

~~~powershell
py -3 "$kit/tools/install_extension.py" . --mode overlay --apply
~~~

**Mode A · remplacement contrôlé**. Utiliser --mode replace (aperçu puis --apply). L’ancien dossier est déplacé vers une sauvegarde adjacente au dépôt, et le nouveau est installé intégralement. Dans les deux modes, l’emplacement de sauvegarde est affiché. Le script garde l’ancien dossier et restaure en cas d’échec de validation.

~~~bash
kit="$HOME/Downloads/Handoff/LOKASYON_PEYI_DESIGN_HANDOFF"
python3 "$kit/tools/install_extension.py" . --mode replace
python3 "$kit/tools/install_extension.py" . --mode replace --apply
~~~

4. Vérifier le diff et les chemins avant de committer. Après copie, git add -A -- LOKASYON_PEYI_DESIGN_HANDOFF/, git diff --cached --check et git diff --cached --stat montrent exactement la PR documentaire. Exécuter les vérificateurs et les tests décrits dans [outils](tools/README.md). Sur Windows, cloner une copie de revue avec git clone -c core.autocrlf=false : npm run check du dépôt compare les fichiers docs générés en LF. Le script d’installation fonctionne aussi avec retour Git et validation du manifeste.

5. Retour arrière avant le commit. Déplacer le nouveau dossier hors du dépôt et remettre le dossier de sauvegarde à sa place. Vérifier git status. Après un commit dédié, créer un revert de ce commit sous contrôle Git. Les chemins et conséquences sont dans [migration](01_AUDIT/PLAN_MIGRATION.md).

6. Après vérification, remettre à Codex [lot 00](07_CODEX_PROMPTS/LOT_00_BASELINE.md) et le SHA d’installation. Chaque lot ultérieur attend une validation humaine.

Le kit de correction est intégré au dépôt sur sa propre PR. Après son intégration dans `main`, commencer par [CODEX_START_HERE.md](CODEX_START_HERE.md) depuis le checkout du projet. Les commandes d’installation historique ci-dessus documentent les premières bases et campagnes.
