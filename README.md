# Jeanne — borne d’assistance (maquette personnelle)

Prototype autonome d’une borne d’accueil pour une démonstration interne à la Fnac Jeanne d’Arc de Toulouse. Ce projet n’est pas une intégration officielle Fnac et ne doit pas être présenté comme telle.

## Ce qui fonctionne déjà

- Interface borne en français, anglais et espagnol (boutons à drapeaux).
- Réponses orales avec la synthèse vocale du navigateur, sans clé ni service payant.
- Bouton micro quand la reconnaissance vocale est disponible (Chrome/Edge sont les plus fiables). Le champ texte reste toujours utilisable.
- Recherche de cinq catégories fictives, avec rayon, étage et itinéraire visuel de démonstration.
- Bouton plein écran et affichage adaptable aux écrans plus petits.

## Lancer localement

1. Téléchargez ou clonez ce dossier.
2. Ouvrez `index.html` dans Chrome ou Edge. Pour tester le micro, accordez l’accès au microphone quand le navigateur le demande.
3. Pour une démonstration sur borne, cliquez sur `⛶` puis utilisez les questions suggérées ou le micro.

Il n’y a aucune installation, aucun serveur, aucune API ni donnée envoyée à un tiers par ce prototype.

## Publier avec GitHub Pages

1. Créez un dépôt GitHub personnel, par exemple `borne-jeanne-demo`.
2. Ajoutez-y tous les fichiers de ce dossier (`index.html`, `styles.css`, `app.js`, `products.js`, `README.md`) et poussez la branche `main`.
3. Dans GitHub, ouvrez **Settings → Pages**.
4. Dans **Build and deployment**, choisissez **Deploy from a branch**, puis `main` et `/ (root)`. Enregistrez.
5. GitHub fournit l’adresse publique dans cette même page après quelques instants.

Pour le micro, servez la démo depuis GitHub Pages (HTTPS) plutôt qu’en ouvrant simplement le fichier : les navigateurs autorisent alors plus facilement l’accès au microphone.

## Ajouter le vrai plan et les vrais emplacements

Les données de démonstration sont dans `products.js`. Chaque fiche comprend :

```js
{ keywords: ["mots de recherche"], zone: "A", aisle: { fr: "…" }, level: { fr: "…" }, detail: { fr: "…" } }
```

Quand le plan magasin sera disponible :

1. Remplacez les produits fictifs dans `products.js` par les libellés, rayons, étages et allées validés.
2. Remplacez le mini-plan CSS dans `app.js` (fonction `openRoute`) par une image/SVG du plan réel, en gardant des repères de zones.
3. Ajoutez des synonymes français/anglais/espagnols dans `keywords` pour que les touristes puissent chercher naturellement.
4. Faites valider les emplacements par l’équipe magasin avant toute démonstration publique.

## Limites assumées de cette première version

L’assistante est une identité graphique originale inspirée de l’imaginaire de Jeanne d’Arc ; elle ne représente pas une personne réelle. La logique de réponse est volontairement locale et déterministe : elle sert à prouver l’expérience de borne de manière fiable, même sans connexion ni abonnement. Une future étape peut connecter une base produits validée et un service d’IA avec une politique de confidentialité approuvée.
