# Jeanne — Borne d'accueil de la Fnac Jeanne d'Arc (Toulouse)

Site statique (HTML, CSS, JavaScript) hébergé sur GitHub Pages : https://guibrg17.github.io/Fnac-Borne/

Conçu pour un **grand écran tactile en paysage** (PC portable Windows) placé à l'entrée du magasin.

## Parcours

1. **Écran de veille** : Jeanne, filmée, accueille les clients en grand (vidéo en boucle). Le texte d'accueil alterne entre français, anglais et espagnol, puis une actualité du magasin s'affiche.
2. **Au toucher**, Jeanne se range dans la colonne de gauche et la page principale s'ouvre :
   - discussion à la voix (bouton micro) ou par écrit, en FR / EN / ES ;
   - plan du magasin redessiné d'après les plans d'architecte (Étage 0 et Sous-sol), avec le rayon demandé mis en évidence ;
   - pour un rayon du sous-sol, le plan montre d'abord l'escalier à l'étage 0, puis descend au sous-sol, avec l'itinéraire « Entrée → Escalier → Rayon » ;
   - un **tracé animé** relie « Vous êtes ici » à l'escalier, puis l'escalier au rayon ;
   - recherches fréquentes, bouton « Appeler un vendeur », mode Accessibilité.
3. **Sans activité pendant 60 secondes**, une fenêtre « Vous êtes toujours là ? » s'affiche. Sans réponse sous 15 secondes, la borne revient à l'écran de veille et efface la conversation.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Structure des deux écrans, icônes, plan du magasin |
| `css/kiosk.css` | Mise en page et animations |
| `js/app.js` | Logique : recherche, voix, micro, plan, veille |
| `js/data.js` | **Contenus modifiables** : textes FR/EN/ES, rayons, mots-clés, recherches fréquentes |
| `js/news.js` | **Actualités du magasin** affichées sur l'écran de veille |
| `js/search.js` | Recherche d'un rayon à partir d'une phrase |
| `js/stats.js` | Statistiques anonymes enregistrées sur la borne |
| `js/voice.js` | Lecture des phrases enregistrées (`assets/voix/`) |
| `tests/search.test.mjs` | Vérifie que des phrases types mènent au bon rayon |
| `assets/fnac-logo.svg` | Logo Fnac |
| `assets/jeanne-portrait.jpg` | Portrait de Jeanne affiché dans le panneau |
| `assets/lsf/` | Clips en langue des signes (voir `assets/lsf/LISEZ-MOI.md`) |

## Modifier les rayons ou les mots-clés

Tout se trouve dans `js/data.js`, section `ZONES`. Chaque rayon a un nom, un détail et une liste de mots-clés par langue.

- Les accents, majuscules et pluriels simples (s, x) sont gérés automatiquement.
- La recherche porte sur des **mots entiers** : « savoir » ne déclenche plus « SAV », ni « télécommande » le rayon « commande ».
- Les petits mots sont ignorés (d', de, pour, mon, the, para…) : « chargeur d'iPhone » équivaut à « chargeur iPhone ».
- Quand plusieurs mots-clés correspondent, **le plus long l'emporte** : « casque gamer » envoie vers PC gamer, et non vers Audio.
- Un rayon peut avoir un bonus `boost`. C'est le cas d'Apple : tout ce qui cite un produit Apple (iPhone, iPad, AirPods…) va au rayon Apple.
- **Fautes tolérées** : si rien n'est trouvé, Jeanne cherche un mot proche (« aifone », « playstasion », « télévition ») et répond « Vous voulez dire « iPhone » ? ». Une lettre de différence n'est acceptée que sur les mots d'au moins 6 lettres, pour éviter les confusions.

Après une modification, lancer les tests (Node.js requis) :

```
node tests/search.test.mjs
```

## Plan du magasin

Les deux niveaux sont redessinés d'après les plans d'architecte du magasin. Chaque case est positionnée **en pourcentage** dans `index.html` (`left`, `top`, `width`, `height`), à l'intérieur d'un plan qui garde les proportions du plan d'origine (`.plan-0` et `.plan-m1` dans `css/kiosk.css`).

| Étage 0 | Sous-sol |
|---|---|
| Téléphonie Android, Objets connectés, Escalier (LEGO, figurines POP, cartes Pokémon), Entrée / Sortie | Jeux vidéo, Accessoires gaming & cartouches (avec PC gamer), Petit électroménager, PC Windows & accessoires (tablettes, écrans, imprimantes, câbles, stockage), Mobilité urbaine, Photo & micros, TV, Audio, Apple, Jeux de société, SAV & retrait des colis, Caisses, Adhésion |

Pour déplacer un rayon, il suffit de changer ses pourcentages dans `index.html`.

## Mises à jour et cache

`index.html` charge la feuille de style et le script avec `?v=N`. Cette version est reportée automatiquement sur tous les fichiers du dossier `js/`. **À chaque mise en ligne, incrémentez ce numéro** (`css/kiosk.css?v=4`, `js/app.js?v=4`) : les bornes rechargeront les fichiers au lieu de garder leur copie en cache.

## Produits vendus à la Fnac Variétés

La Fnac Jeanne d'Arc est spécialisée dans la technique. Quand un client demande un produit éditorial (livres, BD, mangas, manuels scolaires, CD, vinyles, DVD…), Jeanne ne montre pas de rayon : elle renvoie vers la **Fnac Variétés** (9, allées du Président-Roosevelt, 31000 Toulouse), l'ancienne Fnac Wilson, et affiche une carte avec l'adresse et un QR d'itinéraire.

- Mots-clés : rayon `editorial` dans `js/data.js` (« Wilson » y reste : les clients garderont l'ancien nom longtemps).
- Adresse : constante `OTHER_STORE` dans `js/data.js`.
- Les platines vinyle restent au rayon Audio ; les disques vinyles renvoient vers la Fnac Variétés.
- Les statistiques comptent ces demandes, ce qui permet de mesurer combien de clients cherchent des produits éditoriaux.

## Actualités du magasin

Modifier `js/news.js`. Chaque actualité comporte un titre, un texte court, une date et une photo facultative (à placer dans `assets/news/`). Les exemples marqués `example: true` sont à supprimer. Avec une liste vide, l'écran de veille n'affiche que l'accueil.

## Avatar de Jeanne

Jeanne est **filmée, pas modélisée** :

- écran de veille : `assets/jeanne-accueil.mp4`, en boucle (la photo
  `assets/jeanne-accueil.png` prend le relais si la vidéo manque) ;
- page principale : le portrait `assets/jeanne-portrait.jpg`, fixe.

Sa bouche ne bouge pas quand elle parle : le magasin a choisi un portrait
réaliste plutôt qu'un personnage animé. L'ancien avatar 3D (three.js, fichiers
`.glb`/`.vrm`) a été retiré le 20/09/2026 ; il reste dans l'historique Git.

## Langue des signes française (LSF)

Jeanne signe **en vidéo** : un clip par signe, tourné avec une personne qui
pratique la langue des signes, dans `assets/lsf/<langue>/<signe>.mp4`.
Le mode d'emploi du tournage est dans **`assets/lsf/LISEZ-MOI.md`**.

| Signes enchaînés | Quand |
|---|---|
| `bonjour`, `bienvenue`, `aider` | à l'arrivée d'un client sur la page principale |
| `merci`, `abientot` | quand un client remercie Jeanne (FR, EN ou ES) |

- Le clip remplace le portrait et occupe la largeur du panneau ; la
  conversation reste lisible en dessous. Une réponse de Jeanne, ou un toucher
  du client, interrompt le signe.
- Tant qu'un clip n'existe pas, la borne ne montre rien de plus : le texte
  reste affiché, ce qui est déjà l'essentiel pour un client sourd.
- Mise au point : ouvrir la borne avec `?debug`, puis dans la console
  `jeanne.sign("bonjour")` ou `jeanne.sign(["merci", "abientot"])`.

## Installer la borne sur le PC Windows

1. Utiliser **Microsoft Edge**. Il propose des voix féminines naturelles (Denise, Sonia, Elvira…) et la reconnaissance vocale. Une connexion Internet est nécessaire.
2. Ouvrir une première fois le site dans Edge en mode normal, toucher le micro et **autoriser l'accès au micro**.
3. Lancer la borne en plein écran avec cette commande (raccourci ou démarrage automatique) :
   ```
   msedge.exe --kiosk https://guibrg17.github.io/Fnac-Borne/ --edge-kiosk-type=fullscreen --autoplay-policy=no-user-gesture-required
   ```
4. Dans les paramètres d'affichage de Windows, régler l'échelle à 100 %, 125 % ou 150 %. La mise en page s'adapte et tient sur un écran sans défilement.

## Réglages du personnel

Sur la page principale, **toucher 5 fois de suite le logo Fnac** (en haut à gauche) ouvre les réglages :

- choix de la voix du navigateur pour chaque langue (utilisée en secours) ;
- délai avant le retour à l'écran de veille ;
- **statistiques** : visites, questions par langue et par mode (micro, clavier, boutons, plan), rayons les plus demandés et **questions sans réponse**, à utiliser pour compléter les mots-clés. Un bouton permet de les remettre à zéro, avec confirmation.

Les réglages et les statistiques sont enregistrés uniquement sur la borne : rien n'est envoyé sur Internet.

## Ce qui est simulé

| Dans cette version | Pour une mise en service réelle |
|---|---|
| « Appeler un vendeur » prévient par ntfy et par e-mail (réglages sur la borne) | Canal Teams (Workflows), en attente de l'accès demandé au magasin |
| Compréhension par mots-clés | Possible évolution vers une IA (nécessite un serveur) |
| Micro du navigateur | Service de reconnaissance vocale dédié |
| Langue des signes : aucun clip tourné pour l'instant | Filmer les 5 signes avec une personne qui pratique la LSF (`assets/lsf/LISEZ-MOI.md`) |

## Tester en local

```
python3 -m http.server 8765
```

Puis ouvrir http://localhost:8765 dans le navigateur. Le site doit être servi par un serveur : l'ouverture directe du fichier `index.html` ne fonctionne pas, à cause des modules JavaScript.

## Crédits et licences

- Phrases enregistrées (`assets/voix/`) : deux moteurs, un par langue (`MOTEURS` dans `tools/voix/generer.py`).
  - **Français** : voix neuronale **Microsoft `fr-FR-VivienneMultilingualNeural`**, choisie par le magasin le 24/09/2026. Les moteurs libres (Chatterbox, Kokoro, Piper) sonnaient robotiques à l'écoute. ⚠️ Les fichiers sont fabriqués via `edge-tts`, qui passe par le canal gratuit de la fonction « Lire à voix haute » d'Edge : **ce canal n'est pas prévu pour un usage commercial**. Pour une mise en magasin propre, refabriquer les mêmes voix via **Azure Speech**, dont l'offre gratuite (500 000 caractères par mois) couvre très largement les 267 phrases (~18 000 caractères) et autorise l'usage commercial. Seul le compte change, pas la voix.
  - **Anglais et espagnol** : [Chatterbox Multilingual](https://github.com/resemble-ai/chatterbox) (MIT), qui imite une voix de démonstration de Resemble AI.
- Clips en langue des signes : signés par **Laura Jauvert** pour [Lingua Libre](https://lingualibre.org) (Wikimédia France), licence **CC BY**, repris sur le personnage de Jeanne avec son accord — crédit affiché sur la borne pendant le geste.
- Police [Archivo](https://fonts.google.com/specimen/Archivo) (SIL Open Font License), via Google Fonts.
- Logo Fnac : marque déposée de la Fnac.
