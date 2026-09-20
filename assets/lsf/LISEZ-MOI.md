# Langue des signes : les clips de Jeanne

La borne joue une courte vidéo à la place du portrait de Jeanne quand elle
salue ou remercie un client. Les gestes ne sont pas fabriqués par ordinateur :
ce sont des **vidéos tournées avec une personne qui pratique la langue des
signes**, la seule façon d'avoir des signes justes.

## Fichiers attendus

```
assets/lsf/fr/bonjour.mp4      « Bonjour »
assets/lsf/fr/bienvenue.mp4    « Bienvenue »
assets/lsf/fr/aider.mp4        « Puis-je vous aider ? »
assets/lsf/fr/merci.mp4        « Merci »
assets/lsf/fr/abientot.mp4     « À bientôt »
```

Le dossier porte le code de la langue : `fr` pour la LSF. Les dossiers `en`
(ASL) et `es` (LSE) peuvent être ajoutés plus tard ; chaque langue des signes
est une langue à part entière, on ne traduit pas la LSF en anglais.

Un fichier absent n'est pas un problème : la borne saute simplement ce signe et
garde le portrait. Le texte de Jeanne reste affiché dans tous les cas.

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
