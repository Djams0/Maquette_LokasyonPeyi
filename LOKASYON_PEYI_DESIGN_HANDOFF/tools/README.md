# Outils

Depuis la racine après installation du kit, utiliser Python 3 puis Node 24 et Playwright 1.56.1.

~~~text
python LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_v32.py
python LOKASYON_PEYI_DESIGN_HANDOFF/tools/verify_extension.py
node LOKASYON_PEYI_DESIGN_HANDOFF/tools/capture_extension.mjs http://127.0.0.1:8080 test-results/extension protected
~~~

Le capteur prend une instance locale et jetable, avec mode protected, client ou all. Les captures de premier écran fixent navigateur, viewport, heure, profil et DPR. Les cibles de B doivent être lues via le PDF ou ses rendus. Pour comparer deux captures PNG identiques en dimensions, installer Pillow pour compare_v32.py, puis exécuter ce script avec le PNG de référence, le PNG candidat et un répertoire de sortie. Produire une preuve par écran et taille. Le [guide d’installation](../INSTALLATION.md) explique les deux modes et le retour arrière.
