# Branches et revue

Un lot par branche client-v32/lot-NN à partir de la base de revue qui contient le kit. Relever origin/main et les ancêtres, ne reprendre aucun travail local d’un autre contexte. Limiter les changements aux chemins justifiés, conserver l’API et les garde-fous. Si la PR modifie un shared helper, joindre les comparaisons des routes protégées et de l’admin. Les captures et artefacts mettent en scène uniquement des fixtures expurgées.

Le workflow courant a trois contrôles souples (handoff, UI et audit essentiels) selon le mode. Inclure le résultat brut de chaque étape dans la PR et utiliser le mode strict_ui sur demande lors de la validation finale si approprié. Prioriser la visibilité des assertions par rapport au résultat global.

Revue sur la checklist et rapport. Arrêt de chaque prompt au commit/rapport; le mainteneur valide, merge et autorise le suivant.
