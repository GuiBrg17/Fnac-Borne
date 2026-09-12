# Jeanne — Démo de borne d'accueil IA (Fnac Jeanne d'Arc, Toulouse)

Démo statique (HTML/CSS/JS, sans backend) illustrant l'idée d'une borne d'accueil vocale avec avatar, pour montrer le concept avant de passer à un vrai prototype.

## Ce que fait la démo (version affiche Fnac / plan 2D)

- **Palette strictement jaune Fnac (#EBB300) / blanc / noir** (plus de rouge ni de néon)
- **Typographie proche de l'identité Fnac** : Archivo Black (grasse, carrée, sans fioritures) pour les titres, logos et boutons ; Poppins pour le texte courant
- **Une seule carte à gauche, pleine hauteur** : l'emplacement de l'avatar s'étire pour occuper tout l'espace vertical disponible, le reste (micro, langue, voix, chat) s'organise en dessous
- **La langue de réponse suit le sélecteur FR/EN/ES**, plutôt qu'une détection automatique du texte — plus fiable, surtout en vocal où la reconnaissance peut déformer les mots
- **Sélecteur de voix** : liste les voix réellement installées dans le navigateur pour la langue choisie, avec une présélection automatique d'une voix féminine si le nom le suggère — et tu peux la changer toi-même dans le menu déroulant
- **Plan du magasin en 2D vu du dessus** (SVG), toujours visible
- **Chemin animé** : un trait noir en pointillés qui défile va de l'entrée jusqu'au rayon demandé, avec un point jaune à l'arrivée
- **Avatar retiré**, encadré "Avatar 3D — bientôt disponible" en attendant
- Une base de connaissances multilingue (FR/EN/ES) : informatique, audio, jeux vidéo, livres, photo
- Un bouton "Être accompagné par un vendeur" qui simule l'envoi d'une notification Teams (phase 2 du projet réel)

## À propos de la langue et de la voix

- **Langue** : avant, la démo essayait de deviner la langue à partir du texte tapé ou reconnu — peu fiable, surtout au micro (si la reconnaissance vocale déforme un mot anglais en quelque chose qui ressemble à du français, la réponse partait dans la mauvaise langue). Maintenant, la langue de réponse suit directement le sélecteur FR/EN/ES : plus prévisible, et cohérent avec le fait que la reconnaissance vocale du navigateur a de toute façon besoin qu'on lui dise à l'avance dans quelle langue écouter.
- **Voix féminine** : la démo essaie de deviner une voix féminine parmi celles installées sur le navigateur/l'ordinateur, mais ça dépend entièrement de ce qui est disponible sur la machine qui ouvre la page — certains systèmes (notamment macOS/Safari) n'ont par défaut qu'une seule voix française, parfois masculine. D'où le nouveau sélecteur de voix : il liste les voix réellement disponibles pour choisir manuellement une voix féminine si l'auto-détection se trompe. Si aucune voix féminine française n'apparaît dans la liste, il faut en installer une côté système (Réglages/Paramètres → Accessibilité → Contenu énoncé, ou équivalent selon l'OS).

## Idées à explorer pour la suite

- **Chemins multi-étapes** : si le client demande plusieurs produits d'affilée, tracer un seul parcours optimisé qui passe par tous les rayons demandés, dans le bon ordre
- **Distance/temps estimé** affiché à côté du chemin ("environ 40 secondes de marche")
- **Historique de session** : petits badges cliquables des dernières recherches, pour y revenir sans reformuler
- **QR code "envoyer le chemin sur mon téléphone"** : pratique pour un grand magasin, évite de devoir mémoriser le trajet
- **Disponibilité en stock en temps réel** ("il en reste 3 en rayon" / "en rupture, mais disponible en 2h") si la borne est connectée au système de caisse/stock
- **Mode accessibilité** : texte plus grand, contraste renforcé, guidage vocal pas à pas pour les personnes malvoyantes
- **Tableau de bord pour les équipes magasin** : les questions les plus posées à la borne, pour ajuster le merchandising ou anticiper les ruptures
- **Suggestions croisées** : après une réponse, proposer un produit complémentaire ("un casque avec ce lecteur MP3 ?")

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
