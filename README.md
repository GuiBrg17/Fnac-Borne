# Jeanne — Démo de borne d'accueil IA (Fnac Jeanne d'Arc, Toulouse)

Démo statique (HTML/CSS/JS, sans backend) illustrant l'idée d'une borne d'accueil vocale avec avatar, pour montrer le concept avant de passer à un vrai prototype.

## Ce que fait la démo

- Un avatar "Jeanne d'Arc" stylisé (SVG), qui répond à voix haute
- Une zone de question, au clavier ou au micro (reconnaissance vocale du navigateur)
- Une base de connaissances simplifiée : quelques rayons (informatique, audio, jeux vidéo, livres, photo)
- Un plan du magasin qui surligne automatiquement le bon rayon
- Un bouton "Être accompagné par un vendeur" qui simule l'envoi d'une notification Teams (phase 2 du projet réel)

## Ce qui est simulé vs ce qui serait réel en production

| Dans la démo | En production |
|---|---|
| Base de connaissances codée en dur dans `script.js` | Vrai catalogue produit + un LLM (ex: Claude) pour répondre à des questions ouvertes |
| Synthèse vocale du navigateur (`SpeechSynthesisUtterance`) | Voix de synthèse dédiée, choisie pour l'avatar |
| Reconnaissance vocale du navigateur (`webkitSpeechRecognition`) | Service de reconnaissance vocale robuste au bruit ambiant d'un magasin |
| Notification Teams simulée (toast visuel) | Vrai webhook Microsoft Graph vers le canal Teams du vendeur du rayon |
| Avatar en SVG statique animé légèrement | Avatar 2D/3D animé, éventuellement vidéo générative |

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
