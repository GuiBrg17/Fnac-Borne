# Jeanne — Démo de borne d'accueil IA (Fnac Jeanne d'Arc, Toulouse)

Démo statique (HTML/CSS/JS, sans backend) illustrant l'idée d'une borne d'accueil vocale avec avatar, pour montrer le concept avant de passer à un vrai prototype.

## Ce que fait la démo (version affiche Fnac / plan 2D)

- **Style repris de l'affiche Black Friday Fnac** : jaune Fnac, noir, blanc, typographie très grasse (Poppins), cartes avec bordure noire épaisse et ombre portée "sticker" façon affiche
- **Plan du magasin en 2D vu du dessus** (SVG), toujours visible, plus lisible et plus rapide à styliser qu'une vue 3D
- **Chemin animé** : un trait noir en pointillés qui défile va de l'entrée jusqu'au rayon demandé, avec un point rouge à l'arrivée
- **Avatar retiré**, encadré "Avatar 3D — bientôt disponible" en attendant
- Le micro reste l'action principale (voix prioritaire) ; écrire reste possible via "Écrire plutôt que parler"
- Une voix de synthèse plus naturelle : sélection automatique d'une voix féminine disponible dans le navigateur pour chaque langue
- Un sélecteur de langue pour la voix (FR / EN / ES)
- Une base de connaissances multilingue (FR/EN/ES) : informatique, audio, jeux vidéo, livres, photo
- Un bouton "Être accompagné par un vendeur" qui simule l'envoi d'une notification Teams (phase 2 du projet réel)

## Idées à explorer pour la suite

- **Chemins multi-étapes** : si le client demande plusieurs produits d'affilée, tracer un seul parcours optimisé qui passe par tous les rayons demandés, dans le bon ordre
- **Distance/temps estimé** affiché à côté du chemin ("environ 40 secondes de marche")
- **Historique de session** : petits badges cliquables des dernières recherches, pour y revenir sans reformuler
- **QR code "envoyer le chemin sur mon téléphone"** : pratique pour un grand magasin, évite de devoir mémoriser le trajet
- **Disponibilité en stock en temps réel** ("il en reste 3 en rayon" / "en rupture, mais disponible en 2h") si la borne est connectée au système de caisse/stock
- **Mode accessibilité** : texte plus grand, contraste renforcé, guidage vocal pas à pas pour les personnes malvoyantes
- **Tableau de bord pour les équipes magasin** : les questions les plus posées à la borne, pour ajuster le merchandising ou anticiper les ruptures
- **Suggestions croisées** : après une réponse, proposer un produit complémentaire ("un casque avec ce lecteur MP3 ?")

## À propos de la voix

Le rendu dépend des voix installées sur l'ordinateur/le navigateur qui ouvre la page (Chrome sur Windows ou Mac propose en général plusieurs voix françaises, dont des voix féminines type "Google français" ou une voix système). La démo choisit automatiquement la meilleure voix féminine disponible. En production, pour une voix vraiment sur-mesure et homogène sur toutes les bornes (au lieu de dépendre du navigateur), il faudrait un vrai service de synthèse vocale (ElevenLabs, Azure Neural TTS, Google Cloud TTS) avec une voix choisie et calibrée une fois pour toutes pour Jeanne.

## Gestion des langues (FR / EN / ES)

- **Texte tapé** : la démo détecte la langue par mots-clés simples et répond dans la même langue. En production, un vrai LLM (Claude...) fait cette détection nativement, sans configuration, et sur des questions ouvertes (pas juste des mots-clés).
- **Voix** : la reconnaissance vocale du navigateur ne détecte pas seule la langue parlée — elle doit savoir à l'avance dans quelle langue écouter. D'où le petit sélecteur FR/EN/ES à côté du micro. En production, un service de reconnaissance vocale multilingue (Azure/Google) peut détecter la langue automatiquement, sans que le client ait à la choisir.

## Ce qui est simulé vs ce qui serait réel en production

| Dans la démo | En production |
|---|---|
| Base de connaissances codée en dur dans `script.js` | Vrai catalogue produit + un LLM (ex: Claude) pour répondre à des questions ouvertes, dans n'importe quelle langue |
| Pas d'avatar (emplacement réservé) | Avatar 3D réaliste (ex: ReadyPlayerMe, Unreal MetaHuman) ou avatar vidéo généré par IA (HeyGen, D-ID), à ajouter dans l'emplacement prévu |
| Chemin calculé en dur (ligne droite + un coude) | Vrai algorithme de recherche de chemin (pathfinding) basé sur un plan réel du magasin avec obstacles |
| Plan 2D dessiné à la main en SVG | Plan fidèle au vrai magasin (import du relevé réel des rayons) |
| Synthèse vocale du navigateur, voix choisie parmi celles installées sur la machine | Voix de synthèse dédiée et calibrée pour Jeanne (ElevenLabs, Azure/Google Neural TTS), identique sur toutes les bornes |
| Reconnaissance vocale du navigateur + sélecteur de langue manuel | Service de reconnaissance vocale multilingue avec détection automatique de la langue parlée |
| Notification Teams simulée (toast visuel) | Vrai webhook Microsoft Graph vers le canal Teams du vendeur du rayon |

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
