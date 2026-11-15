# Périmètre et sources d’autorité

| Source | Révision consultée le 13 novembre 2026 | Utilisation |
|---|---|---|
| Maquette | `d8ef8450f762e3c8f14f15dcef6b5bc8d67cc4eb`, PR #1 audit | Cible unique des lots. HTML/CSS/ESM vanilla, Client et Admin séparés, UI commune, API Node simulée, JSON jetable. `npm run check`, tests Node, suites Playwright et expurgation des preuves. |
| Principal | `78966c97a5e8f373c8e7eff6c26c7cd356ee7b29`, PR #26 bilan Phase 0 | Référence en lecture. Fronts Next séparés, API Nest, cas d’usage serveur, PostgreSQL privé et worker. Le plan consulté laisse Phase 0 ouverte avec décision S3Mock. Aucun portage dans ce dépôt dans cette campagne. |

Dépôt maquette à consulter : `README.md`, `docs/DESIGN_DECISIONS.md`, `docs/FIGMA_VS_BUSINESS.md`, `docs/TESTING.md`, `docs/audit/AUDIT_README.md`, `docs/audit/PERSONAS.md`, `docs/audit/SCENARIOS.md`, `.github/workflows/ci.yml`. [Maquette au commit](https://github.com/Djams0/Maquette_LokasyonPeyi/tree/d8ef8450f762e3c8f14f15dcef6b5bc8d67cc4eb)

Dépôt principal à consulter en lecture : `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/requirements/BUSINESS_RULES.md`, `docs/requirements/REGISTER.md`, `docs/PERMISSIONS.md`, `docs/PHASE0_PLAN.md` et `.github/workflows/ci.yml`. L’architecture et la CI du principal sont distinctes. Les décisions du registre s’appliquent à leur portée, avec distinction CONFIRMÉ, PROPOSÉ et OUVERT. [Principal au commit](https://github.com/Djams0/LokasyonPeyi/tree/78966c97a5e8f373c8e7eff6c26c7cd356ee7b29)

Conserver les neuf profils historiques, les trente profils de l’atelier, les cookies distincts Client/Admin, les contrôles serveur, les scénarios de reprise réseau, le cycle historique, les permissions, les pièces synthétiques et les validations secondaires. Les tests historiques utilisent leur seed propre. Les campagnes audit utilisent la fixture isolée, sans réinitialiser des données persistantes. Aucun PSP, envoi réel, pièce réelle ni fournisseur distant.

**Frontières du design.** Demande puis décision propriétaire, paiement simulé selon le scénario existant. Prix, caution et actions se lisent depuis l’état de l’API. Aucune garantie déduite d’une capture. Horaires présentés en Guadeloupe. Les règles d’adresse, de contact, de preuve et d’assurance restent au registre. Les médias de démo illustrent une scène fictive. Le protocole de constat confirmé au retour et la proposition de symétrie au départ gardent leurs statuts dans le principal.

**Reprises ciblées.** Conserver le contexte URL de recherche et les brouillons de formulaire dans la maquette. Utiliser l’API de brouillon existante pour l’état enregistré. Toute persistance locale doit être limitée au périmètre du compte, de l’annonce ou du fil, et exclure secrets et justificatifs. L’UI n’atteste une écriture, une lecture, un contrôle ou un paiement qu’après réponse ou état confirmé.
