# Langue des signes : les clips de Jeanne

La borne joue une courte vidéo à la place du portrait de Jeanne quand elle
salue ou remercie un client. Les gestes ne sont pas fabriqués par ordinateur :
ce sont des **vidéos tournées avec une personne qui pratique la langue des
signes**, la seule façon d'avoir des signes justes.

## Les trois signes en place

```
assets/lsf/fr/bonjour.mp4      « Bonjour »    │ à l'arrivée d'un client
assets/lsf/fr/merci.mp4        « Merci »      │ quand le client remercie
assets/lsf/fr/abientot.mp4     « À bientôt »  │ juste après
```

Le dossier porte le code de la langue : `fr` pour la LSF. Les dossiers `en`
(ASL) et `es` (LSE) peuvent être ajoutés plus tard ; chaque langue des signes
est une langue à part entière, on ne traduit pas la LSF en anglais.

Un fichier absent n'est pas un problème : la borne saute simplement ce signe et
garde le portrait. Le texte de Jeanne reste affiché dans tous les cas.

## Ce qui est déjà en place

Trois clips montrent **Jeanne** en train de signer. Ils viennent de **Lingua
Libre** (Wikimédia France), signés par **Laura Jauvert** sous licence **CC
BY**, puis repris avec **Viggle** pour que le geste soit exécuté par Jeanne —
avec l'accord de Laura Jauvert, donné le 24/09/2026. L'auteure a dispensé le magasin d'afficher
le crédit sur la borne (accord du 24/09/2026), ce que la licence permet quand
elle le demande : `SIGN_CREDIT` (js/news.js) est donc vide. L'origine reste
notée ici et dans les crédits du README. Remettre un texte dans `SIGN_CREDIT`
le fait réapparaître sous le clip.

| Fichier | Signe | Origine |
|---|---|---|
| `fr/bonjour.mp4` | Bonjour | Laura Jauvert (Lingua Libre, CC BY), animé sur Jeanne |
| `fr/merci.mp4` | Merci | Laura Jauvert (Lingua Libre, CC BY), animé sur Jeanne |
| `fr/abientot.mp4` | À bientôt | Laura Jauvert (Lingua Libre, CC BY), animé sur Jeanne |

Ces trois-là sont des **formules entières** : un seul signe suffit à les dire,
il n'y a donc rien à bricoler.

## Pourquoi on s'arrête là

Le magasin a décidé le 26/09/2026 de s'en tenir à ces trois formules. Les
autres (« bienvenue », « puis-je vous aider ? », « avez-vous besoin
d'assistance ? ») sont des **phrases** : les signer mot à mot donnerait du
français signé, pas de la LSF, et il n'existe ni « aider » ni « bienvenue »
dans les 637 vidéos LSF de Lingua Libre — vérifié ce jour-là chez les sept
signeurs. Il faudrait un tournage avec une personne qui pratique la langue.

Les appels correspondants ont été retirés du code : la borne ne demande plus
que les trois fichiers ci-dessus, et la console reste propre.

Le fond (et le filigrane de l'outil) a été retiré avec
`tools/images/detourer-video.py`, puis le
détourage a été **aplati sur le jaune de la borne** et enregistré en MP4
(960 × 540, ~50 Ko) : Safari ne sait pas afficher la transparence d'un WebM,
et la borne doit rester lisible partout. L'outil produit toujours un WebM
transparent, utile pour le montage.

Pour remplacer un signe, déposer un fichier du même nom (`.mp4`, sinon
`.webm`) : la borne prend le nouveau sans rien changer au code. Un clip
tourné sur fond uni peut être détouré de la même façon.

## Comment tourner les clips

- Téléphone à l'horizontale ou à la verticale, posé (pas à la main), à hauteur
  de poitrine, à 1,5 m environ : la tête, les deux mains et le buste doivent
  tenir dans l'image, mains comprises quand les bras s'écartent.
- Fond uni et clair, lumière de face, pas de contre-jour.
- Un geste par fichier, 2 à 4 secondes : commencer et finir bras au repos.
- Le visage fait partie du signe : sourire pour « bonjour » et « merci ».
- Enregistrer en `.mp4`. Le son n'est pas lu par la borne.
- Garder les fichiers légers (moins de 2 Mo) : la borne les charge par Internet.

## Vérifier sur la borne

Ouvrir la borne avec `?debug`, puis dans la console du navigateur :

```js
jeanne.sign("bonjour")
jeanne.sign(["merci", "abientot"])
```
