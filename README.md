# Jeanne — Démo de borne d'accueil IA (Fnac Jeanne d'Arc, Toulouse)

Démo statique (HTML/CSS/JS, sans backend) illustrant l'idée d'une borne d'accueil vocale avec avatar, pour montrer le concept avant de passer à un vrai prototype.

## Ce que fait la démo (version néon / HUD futuriste)

- Une grille de sol animée façon HUD, en perspective, sous toute l'interface
- Un fond 3D animé en pleine page (Three.js) : formes flottantes en fil de fer et solides sombres, néon cyan/rouge en écho au logo
- Des panneaux "flottants" en verre dépoli (glassmorphism), bordure dégradée cyan → rouge, légèrement inclinés en 3D, qui se redressent au survol
- Un léger effet scanlines + vignette pour l'ambiance écran holographique
- Le logo Fnac × Jeanne en néon lumineux qui pulse doucement
- Une police technique (Orbitron pour les titres, Rajdhani pour le texte courant)
- Un avatar "Jeanne d'Arc" en 3D (Three.js), stylisé, en armure avec écusson Fnac, qui respire et parle
- Des transitions douces partout : apparition des messages, changement de rayon sur le plan (couleur et hauteur interpolées, pas de saut brusque), légende qui fond en fondu
- Le micro est l'action principale (voix prioritaire) ; écrire reste possible via "Écrire plutôt que parler"
- Une voix de synthèse plus naturelle : sélection automatique d'une voix féminine disponible dans le navigateur pour chaque langue, avec un réglage de hauteur et de débit pensé pour sonner moins robotique
- Un sélecteur de langue pour la voix (FR / EN / ES) — voir la section langues ci-dessous
- Une base de connaissances multilingue (FR/EN/ES) : informatique, audio, jeux vidéo, livres, photo
- Un plan du magasin en 3D isométrique (Three.js), grille néon au sol, rayons aux contours lumineux qui s'illuminent en rouge quand ils sont désignés
- Un bouton "Être accompagné par un vendeur" qui simule l'envoi d'une notification Teams (phase 2 du projet réel)

## À propos de la voix

Le rendu dépend des voix installées sur l'ordinateur/le navigateur qui ouvre la page (Chrome sur Windows ou Mac propose en général plusieurs voix françaises, dont des voix féminines type "Google français" ou une voix système). La démo choisit automatiquement la meilleure voix féminine disponible. En production, pour une voix vraiment sur-mesure et homogène sur toutes les bornes (au lieu de dépendre du navigateur), il faudrait un vrai service de synthèse vocale (ElevenLabs, Azure Neural TTS, Google Cloud TTS) avec une voix choisie et calibrée une fois pour toutes pour Jeanne.

## Gestion des langues (FR / EN / ES)

- **Texte tapé** : la démo détecte la langue par mots-clés simples et répond dans la même langue. En production, un vrai LLM (Claude...) fait cette détection nativement, sans configuration, et sur des questions ouvertes (pas juste des mots-clés).
- **Voix** : la reconnaissance vocale du navigateur ne détecte pas seule la langue parlée — elle doit savoir à l'avance dans quelle langue écouter. D'où le petit sélecteur FR/EN/ES à côté du micro. En production, un service de reconnaissance vocale multilingue (Azure/Google) peut détecter la langue automatiquement, sans que le client ait à la choisir.

## Ce qui est simulé vs ce qui serait réel en production

| Dans la démo | En production |
|---|---|
| Base de connaissances codée en dur dans `script.js` | Vrai catalogue produit + un LLM (ex: Claude) pour répondre à des questions ouvertes, dans n'importe quelle langue |
| Avatar 3D low-poly stylisé (Three.js, formes géométriques) | Avatar 3D réaliste (ex: ReadyPlayerMe, Unreal MetaHuman) ou avatar vidéo généré par IA (HeyGen, D-ID) |
| Synthèse vocale du navigateur, voix choisie parmi celles installées sur la machine | Voix de synthèse dédiée et calibrée pour Jeanne (ElevenLabs, Azure/Google Neural TTS), identique sur toutes les bornes |
| Reconnaissance vocale du navigateur + sélecteur de langue manuel | Service de reconnaissance vocale multilingue avec détection automatique de la langue parlée |
| Notification Teams simulée (toast visuel) | Vrai webhook Microsoft Graph vers le canal Teams du vendeur du rayon |
| Plan 3D en formes simples (Three.js) | Plan 3D fidèle au vrai magasin, éventuellement basé sur un relevé réel des rayons |
| Fond 3D avec formes génériques flottantes | Fond personnalisé avec des visuels/produits réels de la Fnac, en accord avec la charte graphique |

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
