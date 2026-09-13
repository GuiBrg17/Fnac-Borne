# Jeanne — Démo de borne d'accueil IA (Fnac Jeanne d'Arc, Toulouse)

Démo statique (HTML/CSS/JS, sans backend), version 4.

## Ce que fait cette version

- **Disposition reprise de ton croquis** : bandeau noir vertical "Avatar Jeanne" en pleine hauteur à gauche, drapeaux FR/UK/ES en haut de la colonne de contrôle, un bloc noir pour le tchat (avec le texte d'accueil qui explique la borne), un bloc noir pour le micro/le texte, et le plan du magasin en grand à droite
- **Plan basé sur tes deux documents** (`Plan_FNAC_Micro.pdf` et le plan général) : Caisse/Adhésion, Jeux de société, Escalier vers l'étage (Lego/figurines POP), SAV/Retrait commandes, Tablettes Android, PC Windows, Apple, Stockage/Câbles/Imprimantes, Audio, PC Gamer, Électroménager, TV, Cartouches imprimantes, Écrans PC, Autre électroménager, Gaming, Photo/Drones/Micro, Téléphonie Android, Trottinettes/figurines POP, Escalier vers le sous-sol, Entrée/Sortie
- **Traduction complète de l'interface** : cliquer sur un drapeau change la langue de TOUT le site (titres, boutons, placeholder du champ texte, boutons rapides, libellés des rayons sur le plan, message d'accueil), pas seulement les réponses de Jeanne
- **Voix féminines uniquement** : le sélecteur de voix ne liste que les voix dont le nom correspond à une voix féminine connue pour la langue choisie. S'il n'y en a aucune sur ta machine pour une langue donnée, le menu l'indique clairement plutôt que d'afficher une voix masculine par défaut
- Le chemin vers le rayon demandé se trace dynamiquement sur la grille du plan (calculé à partir de la position réelle des blocs à l'écran, donc il s'adapte si tu modifies la taille du plan)
- Un bouton "Être accompagné par un vendeur" qui simule l'envoi d'une notification Teams

## Important à savoir sur le plan

Le plan que tu m'as envoyé a des blocs de tailles très irrégulières (bento box). Je l'ai reproduit avec une grille CSS qui capture l'agencement général et les tailles relatives, mais ce n'est **pas un calque pixel-perfect** de ton PDF — les proportions exactes de chaque bloc sont approximatives.

Les deux niveaux sont maintenant **séparés et empilés verticalement** : le rez-de-chaussée (Téléphonie, Escalier vers le sous-sol, Entrée/Sortie) en haut, le sous-sol (tous les autres rayons) juste en dessous, reliés par une flèche. Le chemin tracé quand on cherche un produit traverse les deux niveaux automatiquement si besoin (il part de l'entrée, descend visuellement vers le sous-sol, puis rejoint le rayon).

Le sous-sol a lui-même un "⬆ Escalier vers l'étage" qui suggère un troisième niveau (avec les Lego et figurines POP) que je n'ai pas modélisé avec son propre plan — pour l'instant c'est juste une zone cliquable sans plan associé, comme la borne ne desservirait que le rez-de-chaussée et le sous-sol.

## À propos des voix féminines

Le navigateur ne fournit pas d'information fiable sur le genre d'une voix — la démo se base sur une liste de noms de voix connus pour être féminins (Amélie, Audrey, Samantha, Google français, etc.). Si aucune voix de ta liste système ne correspond à ces noms, le menu affichera "Aucune voix féminine trouvée" pour cette langue. Dans ce cas, il faut ajouter une voix féminine côté système (Réglages → Accessibilité → Contenu énoncé sur Mac, ou Paramètres → Heure et langue → Voix sur Windows).

## Ce qui est simulé vs ce qui serait réel en production

| Dans la démo | En production |
|---|---|
| Base de connaissances par mots-clés, codée en dur | Vrai catalogue produit + un LLM (ex: Claude) pour des questions ouvertes, dans n'importe quelle langue |
| Plan en grille CSS approximative | Plan vectoriel fidèle au vrai magasin (import du relevé réel) |
| Chemin en ligne brisée simple (un coude) | Vrai algorithme de pathfinding avec obstacles (murs, rayons) |
| Voix du navigateur, filtrées par nom | Voix de synthèse dédiée et calibrée pour Jeanne (ElevenLabs, Azure/Google Neural TTS) |
| Reconnaissance vocale du navigateur, langue choisie manuellement | Service de reconnaissance vocale multilingue avec détection automatique |
| Notification Teams simulée (toast visuel) | Vrai webhook Microsoft Graph vers le canal Teams du vendeur du rayon |
| Un seul niveau de magasin affiché | Plusieurs plans (rez-de-chaussée, étage, sous-sol) avec bascule |

## Idées à explorer pour la suite

- Bouton pour changer d'étage (rez-de-chaussée / étage / sous-sol) avec un plan différent par niveau
- Chemins multi-étapes si plusieurs produits demandés d'affilée
- Distance/temps de marche estimé affiché à côté du chemin
- QR code pour envoyer le chemin sur son téléphone
- Disponibilité en stock en temps réel si connecté à la caisse
- Mode accessibilité (texte agrandi, guidage vocal pas à pas)
- Tableau de bord équipe magasin : questions les plus posées
