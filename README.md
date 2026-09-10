# Jeanne — Démo de borne d'accueil IA (Fnac Jeanne d'Arc, Toulouse)

Démo statique (HTML/CSS/JS, sans backend) illustrant l'idée d'une borne d'accueil vocale avec avatar, pour montrer le concept avant de passer à un vrai prototype.

## Ce que fait la démo

- Un avatar "Jeanne d'Arc" en 3D (Three.js), stylisé, en armure avec écusson Fnac, qui respire et parle
- Le micro est l'action principale (voix prioritaire) ; écrire reste possible via "Écrire plutôt que parler"
- Un sélecteur de langue pour la voix (FR / EN / ES) — voir la section langues ci-dessous
- Une base de connaissances multilingue (FR/EN/ES) : informatique, audio, jeux vidéo, livres, photo
- Un plan du magasin en 3D isométrique (Three.js) qui surligne et fait ressortir le bon rayon
- Un bouton "Être accompagné par un vendeur" qui simule l'envoi d'une notification Teams (phase 2 du projet réel)

## Gestion des langues (FR / EN / ES)

- **Texte tapé** : la démo détecte la langue par mots-clés simples et répond dans la même langue. En production, un vrai LLM (Claude...) fait cette détection nativement, sans configuration, et sur des questions ouvertes (pas juste des mots-clés).
- **Voix** : la reconnaissance vocale du navigateur ne détecte pas seule la langue parlée — elle doit savoir à l'avance dans quelle langue écouter. D'où le petit sélecteur FR/EN/ES à côté du micro. En production, un service de reconnaissance vocale multilingue (Azure/Google) peut détecter la langue automatiquement, sans que le client ait à la choisir.

## Ce qui est simulé vs ce qui serait réel en production

| Dans la démo | En production |
|---|---|
| Base de connaissances codée en dur dans `script.js` | Vrai catalogue produit + un LLM (ex: Claude) pour répondre à des questions ouvertes, dans n'importe quelle langue |
| Avatar 3D low-poly stylisé (Three.js, formes géométriques) | Avatar 3D réaliste (ex: ReadyPlayerMe, Unreal MetaHuman) ou avatar vidéo généré par IA (HeyGen, D-ID) |
| Synthèse vocale du navigateur (`SpeechSynthesisUtterance`) | Voix de synthèse dédiée, choisie pour l'avatar, dans les 3 langues |
| Reconnaissance vocale du navigateur + sélecteur de langue manuel | Service de reconnaissance vocale multilingue avec détection automatique de la langue parlée |
| Notification Teams simulée (toast visuel) | Vrai webhook Microsoft Graph vers le canal Teams du vendeur du rayon |
| Plan 3D en formes simples (Three.js) | Plan 3D fidèle au vrai magasin, éventuellement basé sur un relevé réel des rayons |

## Lancer la démo

Ouvrir simplement `index.html` dans un navigateur (Chrome recommandé pour la reconnaissance vocale), ou héberger le dossier sur GitHub Pages :

1. Créer un dépôt GitHub, y pousser ces fichiers
2. Dans les paramètres du dépôt → Pages → choisir la branche `main` et le dossier racine
3. Le site sera disponible à une URL du type `https://<utilisateur>.github.io/<depot>/`

## Questions à tester

- « Où puis-je trouver un disque dur ? »
- « Je cherche un casque audio »
- « Avez-vous des consoles de jeu ? »
- « Je voudrais un livre »
- « Where can I find a hard drive? » (pense à passer le sélecteur de voix sur EN pour tester au micro)
- « ¿Dónde puedo encontrar auriculares? » (sélecteur de voix sur ES pour le micro)
