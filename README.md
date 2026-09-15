# Jeanne — Borne d'accueil de la Fnac Jeanne d'Arc (Toulouse)

Site statique (HTML, CSS, JavaScript) hébergé sur GitHub Pages : https://guibrg17.github.io/Fnac-Borne/

Conçu pour un **grand écran tactile en paysage** (PC portable Windows) placé à l'entrée du magasin.

## Parcours

1. **Écran de veille** : Jeanne, avatar 3D, accueille les clients en grand. Le texte d'accueil alterne entre français, anglais et espagnol, puis une actualité du magasin s'affiche. Jeanne salue régulièrement, une fois sur deux d'un signe de la main, une fois sur deux en **langue des signes française**.
2. **Au toucher**, Jeanne se range dans la colonne de gauche et la page principale s'ouvre :
   - discussion à la voix (bouton micro) ou par écrit, en FR / EN / ES ;
   - plan du magasin redessiné d'après les plans d'architecte (Étage 0 et Sous-sol), avec le rayon demandé mis en évidence ;
   - pour un rayon du sous-sol, le plan montre d'abord l'escalier à l'étage 0, puis descend au sous-sol, avec l'itinéraire « Entrée → Escalier → Rayon » ;
   - un **tracé animé** relie « Vous êtes ici » à l'escalier, puis l'escalier au rayon, et Jeanne tourne la tête vers le plan ;
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
| `js/voice.js` et `js/voice-worker.js` | Voix neuronale Piper (hors ligne) et lecture du son |
| `tests/search.test.mjs` | Vérifie que des phrases types mènent au bon rayon |
| `js/avatar.js` | Avatar 3D (three.js + three-vrm) : animations, couleurs, logo sur le T-shirt |
| `assets/fnac-logo.svg` | Logo Fnac |
| `assets/avatar/` | Fichiers de l'avatar (`placeholder.vrm` en attendant `Jeanne.vrm`) |

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

## Produits vendus à la Fnac Wilson

La Fnac Jeanne d'Arc est spécialisée dans la technique. Quand un client demande un produit éditorial (livres, BD, mangas, manuels scolaires, CD, vinyles, DVD…), Jeanne ne montre pas de rayon : elle affiche une carte avec l'adresse de la **Fnac Wilson** (16, allées Franklin-Roosevelt, 31000 Toulouse) et la lit à voix haute.

- Mots-clés : rayon `editorial` dans `js/data.js`.
- Adresse : constante `OTHER_STORE` dans `js/data.js`.
- Les platines vinyle restent au rayon Audio ; les disques vinyles renvoient vers la Fnac Wilson.
- Les statistiques comptent ces demandes, ce qui permet de mesurer combien de clients cherchent des produits éditoriaux.

## Actualités du magasin

Modifier `js/news.js`. Chaque actualité comporte un titre, un texte court, une date et une photo facultative (à placer dans `assets/news/`). Les exemples marqués `example: true` sont à supprimer. Avec une liste vide, l'écran de veille n'affiche que l'accueil.

## Avatar de Jeanne

**En attendant la version définitive**, la borne utilise l'avatar d'essai `placeholder.vrm`, retouché automatiquement : cheveux blond doré, yeux bleus et logo Fnac sur le T-shirt (réglage `PLACEHOLDER_LOOK` dans `js/app.js`).

**Version définitive, avec VRoid Studio** (gratuit, sans photo, tous droits) :

1. Créer une femme au visage adulte et européen : yeux plus petits, visage ovale, cheveux blond doré, iris bleus, T-shirt uni.
2. Exporter en **VRM 1.0** en autorisant l'usage commercial par les entreprises.
3. Nommer le fichier `Jeanne.vrm` et le placer dans `assets/avatar/`.
4. Pour le tester, ouvrir la borne avec `?avatar=Jeanne.vrm` à la fin de l'adresse.
5. Pour l'adopter, dans `js/app.js`, remplacer `const AVATAR_FILE = "assets/avatar/placeholder.vrm";` par `"assets/avatar/Jeanne.vrm"`.

Le logo Fnac est ajouté automatiquement sur la poitrine de tout avatar. Les avatars `.glb` à squelette Mixamo (Avaturn, MetaPerson…) sont aussi acceptés. Si l'avatar ne peut pas se charger, la borne revient à l'avatar d'essai. Si la 3D elle-même est indisponible, un médaillon « J » s'affiche et le reste de la borne fonctionne normalement.

## Voix de Jeanne

La borne utilise en priorité une **voix neuronale Piper**, bien plus naturelle que les voix classiques du navigateur :

| Langue | Voix | Taille | Remarque |
|---|---|---|---|
| Français | `fr_FR-upmc-medium` (Jessica) | ≈ 77 Mo | téléchargée automatiquement au premier lancement |
| Anglais | `en_GB-jenny_dioco-medium` (Jenny) | ≈ 63 Mo | téléchargée au premier passage en anglais |
| Espagnol | voix du navigateur | — | les voix espagnoles de Piper sont masculines ou de genre incertain |

- Les modèles sont gardés dans le stockage privé du site : **après le premier téléchargement, la voix fonctionne hors ligne**.
- La synthèse tourne dans un fil séparé, donc l'avatar continue de bouger. Comptez environ **1 seconde avant que Jeanne commence à parler**.
- Le volume du son pilote l'ouverture de la bouche de Jeanne, ce qui donne un mouvement des lèvres fidèle à la parole.
- Si la voix neuronale est absente ou coupée, la borne repasse sur la voix du navigateur (sous Windows, Edge propose les voix « Natural » Denise ou Vivienne).
- Dans les réglages du personnel : case pour activer ou couper la voix neuronale, état des téléchargements et bouton pour les lancer.
- Pour changer de voix, modifier `PIPER_VOICES` dans `js/voice.js`. La liste complète est sur [huggingface.co/diffusionstudio/piper-voices](https://huggingface.co/diffusionstudio/piper-voices) (par exemple `fr_FR-siwis-medium` en français).

## Langue des signes française (LSF)

Deux signes sont animés :

| Signe | Quand | Geste |
|---|---|---|
| **Bonjour** | écran de veille, un tour sur deux (sinon signe de la main) | main plate près du menton, paume vers le visage, puis vers l'avant et le bas |
| **Merci** | quand un client remercie Jeanne (FR, EN ou ES) | main plate qui part des lèvres et avance vers l'interlocuteur, paume vers le haut, avec un hochement de tête |

Un sourire accompagne les deux gestes : en LSF, l'expression du visage fait partie du signe.

- Chaque geste dure environ 3,4 s. La caméra recule pendant le signe pour que la main soit visible. Sur la page principale, la scène 3D s'agrandit et le nom de Jeanne s'efface le temps du geste.
- Réglages dans `js/avatar.js`, table `SIGNS` (valeurs mises au point à l'écran).
- Disponible avec les avatars **VRM**. Les avatars `.glb` (squelette Mixamo) font le signe de la main à la place.
- ⚠️ **Les gestes sont des approximations à faire valider par une personne qui pratique la LSF.** Ils ont été réglés d'après des descriptions écrites. La forme de la main reste celle du modèle 3D (main détendue, pas parfaitement plate). « Bonjour » et « merci » se ressemblent beaucoup dans les descriptions consultées : c'est le premier point à vérifier.
- Pour ajouter un signe, il faut une **référence fiable** (vidéo ou personne signant) : les descriptions écrites ne suffisent pas. C'est pourquoi « bienvenue » n'est pas encore animé.
- Mise au point : ouvrir la borne avec `?debug`, puis dans la console du navigateur `jeanne.sign("bonjour")`, `jeanne.sign("merci")`, `jeanne.wave()`, `jeanne.glance()`, `jeanne.pose({upperZ, upperX, upperY, lowerZ, lowerY})` et `jeanne.state()`.

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

- voix neuronale Piper : activation, état et téléchargement ;
- choix de la voix du navigateur pour chaque langue (utilisée en secours) ;
- délai avant le retour à l'écran de veille ;
- **statistiques** : visites, questions par langue et par mode (micro, clavier, boutons, plan), rayons les plus demandés et **questions sans réponse**, à utiliser pour compléter les mots-clés. Un bouton permet de les remettre à zéro, avec confirmation.

Les réglages et les statistiques sont enregistrés uniquement sur la borne : rien n'est envoyé sur Internet.

## Ce qui est simulé

| Dans cette version | Pour une mise en service réelle |
|---|---|
| « Appeler un vendeur » affiche une confirmation, mais **aucune notification n'est réellement envoyée** | Brancher un vrai webhook Microsoft Teams ou Graph vers l'équipe du rayon |
| Compréhension par mots-clés | Possible évolution vers une IA (nécessite un serveur) |
| Micro du navigateur | Service de reconnaissance vocale dédié |
| Avatar d'essai retouché (blonde, logo Fnac) | Avatar « Jeanne » créé dans VRoid Studio |

## Tester en local

```
python3 -m http.server 8765
```

Puis ouvrir http://localhost:8765 dans le navigateur. Le site doit être servi par un serveur : l'ouverture directe du fichier `index.html` ne fonctionne pas, à cause des modules JavaScript.

## Crédits et licences

- [three.js](https://threejs.org/) (MIT) et [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) (MIT), chargés depuis jsDelivr.
- Avatar d'essai : `VRM1_Constraint_Twist_Sample` © pixiv Inc., licence VRM 1.0 : usage commercial et redistribution autorisés.
- Voix neuronales [Piper](https://github.com/rhasspy/piper) (MIT) via [@diffusionstudio/vits-web](https://www.npmjs.com/package/@diffusionstudio/vits-web) (MIT).
- Police [Archivo](https://fonts.google.com/specimen/Archivo) (SIL Open Font License), via Google Fonts.
- Logo Fnac : marque déposée de la Fnac.
