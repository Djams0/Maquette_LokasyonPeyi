# Recette de livraison et arbitrages

## Ordre proposé à Codex

| Lot | Dépôt et dépendance | Critères mesurables |
|---|---|---|
| 0 · Continuité | Maquette. Base du prototype et constats V2. | Aller à une fiche puis à une seconde depuis la liste. Dates, filtres, tri, mode et contexte de retour conservés après navigation et actualisation. Le bouton de galerie rend le focus à son déclencheur. Créneau invalide avec erreur et reprise. |
| 1 · Fondations et écrans Client | Maquette, après lot 0. Puis portage des composants côté principal lorsque le lot correspondant est ouvert. | 320, 375, 390, 430, 768 et 1440 px. Contrôles de 48 px visés, focus visible au clavier, galerie avec boutons et Échap, zoom texte 200 %, pas d’axe horizontal global. Tester iOS Safari et Android Chrome sur appareils. L’état de prix indisponible garde l’accès à la recherche. |
| 2 · Brouillon, état et photos | Maquette puis contrat et cas d’usage du principal après validation des règles de collecte et de revue. | Tester reprise avant et après enregistrement, sortie, erreur, réouverture du même compte et compte distinct. Deux versions concurrentes ne s’écrasent pas. Une soumission valide toutes les étapes existantes et reste unique lors d’un réessai. Le défaut et ses médias gardent leur version et leurs droits. |
| 3 · Demande et suivi | Maquette en simulation. Principal selon D-02/03/04/06/08/09. | Deux sessions, demande, retrait avant accord, acceptation, refus et conflit. Prix lié aux dates, caution distincte, prochaine action correcte. Statut inconnu réconcilié avant une nouvelle tentative. Départ, retour et réserves distincts. |
| 4 · Messagerie et signalement | Maquette en simulation. Principal lorsque références, accès et conservation sont validés. | Trois comptes, deux locations du même véhicule, un tiers hors périmètre. Message doublé côté réseau, réponse perdue après écriture, envois concurrents et refus définitif. Un seul message et un seul événement après réessai de la même clé. Même clé avec corps différent : conflit. Tester retour premier plan, perte réseau, brouillon, focus et non-lus. Vérifier la cible de réception p95 au pilote. |
| 5 · Admin et preuves | Principal selon D-05/09/10 et garde-fous documentés. | À 320 px, identifier version, motif et action. Refuser une décision sur une version obsolète ou hors affectation. Respecter double validation et séparation notes internes / échanges. |
| Option après base fonctionnelle | Pilote de rendu fixe sur des catégories et teintes couvertes. | Galerie publique avec les photos du propriétaire. Illustration étiquetée et indépendante. Disparition du lien si asset indisponible ou correspondance insuffisante. |

Le backlog V2 reste la référence pour l’effort relatif et le détail des lots graphiques. Chaque PR doit lier la page de référence, le scénario d’acceptation, les captures utiles et le test automatisé. Pour le dépôt maquette, relancer `npm run check`, `npm test`, les suites Playwright concernées et la recette isolée prévue par le dépôt. Pour le principal, utiliser les commandes et contrôles de la branche et documenter les effets sur les contrats, migrations et permissions.

## Cas à réexercer lors du portage

| ID | Précondition | Action | Attendu |
|---|---|---|---|
| MSG-01 | Fil visible dans une autre session | Insérer 100 événements dans un environnement de recette instrumenté | p95 ≤ 5 s selon la charge convenue, aucune régression du focus et du brouillon. |
| MSG-02 | Écriture acceptée, réponse perdue | Réessayer depuis l’écran puis après actualisation | Même identifiant, même message, un événement et un seul effet de notification. |
| MSG-03 | Acteur différent, deux réservations du même véhicule | Ouvrir le fil, envoyer, signaler et lire les aperçus | Les droits sont contrôlés sur chaque route. Aucun aperçu, compteur ou média hors périmètre. |
| MSG-04 | Message définitivement refusé | Corriger puis renvoyer | Le texte est repris. La nouvelle validation crée une clé distincte. |
| MSG-05 | Panne réseau ou accès révoqué | Revenir au fil puis reconnecter un autre compte | La reprise se fait uniquement dans le périmètre d’origine, la session distincte ne récupère ni texte ni aperçu. |
| VEH-01 | Ancienne annonce sans déclaration structurée | Ouvrir la fiche et créer une demande | « État non renseigné » si applicable. La version vue est rattachée à la demande. |
| VEH-02 | Défaut déclaré puis modifié | Ouvrir la location après une mise à jour | Version présentée et nouvel état identifiables. Information et suspension suivent la politique validée. |
| VEH-03 | Contrôle documentaire terminé | Ouvrir la fiche et le constat | Portée explicite. Déclaration, contrôle et constats affichent auteur, date ou version selon droits. |
| OWN-01 | Brouillon partiellement rempli | Enregistrer et quitter, reprendre depuis le parc | Étape et champs récupérés, propriétaire autorisé uniquement. |
| OWN-02 | Deux onglets, versions différentes | Tenter de sauver l’ancienne version | Conflit explicite, saisie locale conservée, aucune mise à jour silencieuse. |
| OWN-04 | Ancien brouillon enregistré à chacune des neuf étapes | Ouvrir via « Reprendre » depuis le parc | Écran et section correspondants. Champs historiques, pièces, règles et étapes futures conservés. |
| OWN-03 | Données invalides, média en échec ou justificatif requis manquant | Tenter la soumission puis corriger | Erreur associée à l’étape, reprise conservée, une seule soumission pour revue. |
| A11Y-01 | 320 px et zoom texte 200 % | Tabuler et activer filtres, galerie, barre fixe et champ du fil | Aucun blocage clavier, focus visible, contrôle atteignable, contenu réorganisé. |
| A11Y-02 | Téléphone physique | Tester clavier natif, lecteur d’écran, rotation et boutons fixes | Le dernier message et la saisie restent atteignables. Vérifier la zone sûre et les annonces d’état. |

## Décisions métier à arbitrer

| Décision | Proposition à valider | Jalon concerné |
|---|---|---|
| **Défauts, sécurité et modification significative** | Déterminer quels défauts exigent une photo ou une revue, qui peut mettre l’annonce en pause, et comment informer une location déjà demandée. Définir le libellé exact et la visibilité du contrôle. | Avant publication réelle ou badges de contrôle · D-04/05/09/10. |
| **Données et accès** | Fixer durée et périmètre de conservation des déclarations, photos, constats, messages et brouillons. Définir visibilité des agents, motif, journal et restrictions de médias. | Avant collecte réelle et accès Admin · D-05/09/10. |
| **Contact, fil et assistance** | Valider le fil de renseignement lié au véhicule, un fil par location et le lien éventuel vers la question initiale. Définir quelles informations de remise sont visibles à quel état et à qui. Choisir les motifs, destinataires et délais de signalement. | Avant la messagerie réelle · D-05/09/10. |
| **Demande, paiement et lieu** | Valider fenêtre d’acceptation et paiement, engagement, tarification, caution, lieu et précision de remise. Confirmer portée territoriale et conditions d’assurance avec les partenaires concernés. | Avant les flux réels · D-01/02/03/04/06/08/09. |
| **Disponibilité opérationnelle** | Choisir la cible de réception, le profil de réseau et la charge à tester. Définir horaires et procédure support pour la remise, le retour et l’urgence. | Avant le pilote. Le seuil de 5 s est une proposition de recette. |
| **Jalon technique distinct** | Consigner la décision du mainteneur sur le risque S3Mock et la clôture de Phase 0 selon le plan du principal. | Avant démarrage métier du dépôt principal selon son bilan actuel. |

Les lots de correction et de conception sur maquette utilisent des données fictives. Les arbitrages de protection des données, de paiement et d’exploitation concernent la mise en œuvre réelle des flux.
