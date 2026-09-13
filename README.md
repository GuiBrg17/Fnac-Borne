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

Cette version reprend fidèlement ton plan détaillé (`Plan___version_portrait.png`) : SAV et Retrait de commandes sont bien deux zones distinctes, le stockage est éclaté en trois (clés USB/disque dur, câbles, imprimantes), et les étiquettes "Haut des escaliers" / "Bas des escaliers" apparaissent sur les escaliers correspondants.

**Changement technique important** : le plan n'utilise plus de zones nommées (`grid-template-areas`) mais un placement par coordonnées numériques (`grid-column` / `grid-row`). C'est le format le plus robuste en CSS Grid — impossible d'avoir une "forme non rectangulaire invalide" qui casse toute la grille, contrairement à ce qui s'est passé avec la version précédente. Chaque bloc a sa position et sa taille définies indépendamment des autres.

Les deux niveaux sont empilés verticalement : Étage 0 (Téléphonie, Escalier vers Sous-Sol, Entrée/Sortie) en haut, Étage -1 (tous les autres rayons) en dessous, reliés par une flèche. Le chemin tracé vers un rayon traverse les deux niveaux automatiquement si besoin.

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
