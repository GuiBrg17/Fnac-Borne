# Langue des signes : les clips de Jeanne

La borne joue une courte vidéo à la place du portrait de Jeanne quand elle
salue ou remercie un client. Les gestes ne sont pas fabriqués par ordinateur :
ce sont des **vidéos tournées avec une personne qui pratique la langue des
signes**, la seule façon d'avoir des signes justes.

## Fichiers attendus

```
assets/lsf/fr/bonjour.mp4      « Bonjour »               │ à l'arrivée
assets/lsf/fr/bienvenue.mp4    « Bienvenue »             │ d'un client
assets/lsf/fr/aider.mp4        « Puis-je vous aider ? »  │
assets/lsf/fr/merci.mp4        « Merci »                 │ quand le client
assets/lsf/fr/abientot.mp4     « À bientôt »             │ remercie
assets/lsf/fr/assistance.mp4   « Avez-vous besoin d'assistance ? »      │ quand Jeanne
assets/lsf/fr/accompagner.mp4  « Souhaitez-vous qu'un vendeur           │ oriente vers
                                 vous accompagne ? »                    │ un vendeur
```

Une autre vidéo, à part, complète l'ensemble :

```
assets/jeanne-plan.mp4         Jeanne se tourne vers le plan et le montre
```

Elle est jouée dans le cadre du portrait, à la place de la photo, chaque fois
que Jeanne indique un rayon. Les lèvres n'ont pas besoin de bouger : la vidéo
dure le temps du geste (2 à 4 secondes), puis le portrait revient.

Le dossier porte le code de la langue : `fr` pour la LSF. Les dossiers `en`
(ASL) et `es` (LSE) peuvent être ajoutés plus tard ; chaque langue des signes
est une langue à part entière, on ne traduit pas la LSF en anglais.

Un fichier absent n'est pas un problème : la borne saute simplement ce signe et
garde le portrait. Le texte de Jeanne reste affiché dans tous les cas.

## Ce qui est déjà en place

Trois clips viennent de **Lingua Libre** (Wikimédia France), signés par
**Laura Jauvert**, sous licence **CC BY** : usage commercial autorisé, à
condition de citer l'auteure — ce que la borne fait, en petit, pendant le
geste (texte dans `SIGN_CREDIT`, js/news.js).

| Fichier | Signe | Origine |
|---|---|---|
| `fr/bonjour.webm` | Bonjour | Lingua Libre, CC BY |
| `fr/merci.webm` | Merci | Lingua Libre, CC BY |
| `fr/abientot.webm` | À bientôt | Lingua Libre, CC BY |

Ces trois-là sont des **formules entières** : un seul signe suffit à les dire,
il n'y a donc rien à bricoler. Les autres (`bienvenue`, `aider`, `assistance`,
`accompagner`) sont des **phrases** : les mettre bout à bout à partir de mots
isolés donnerait du français signé approximatif, pas de la LSF. Elles
attendent un tournage avec une personne qui pratique la langue.

Un clip tourné au magasin (`.mp4`) remplace automatiquement celui de Lingua
Libre (`.webm`) : la borne prend le `.webm` seulement si le `.mp4` manque.

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
