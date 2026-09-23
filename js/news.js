// =====================================================================
// Actualités du magasin affichées sur l'écran de veille (en français),
// entre deux messages d'accueil.
//
// Pour ajouter une actualité, copiez un bloc { ... } et remplissez :
//   title : titre court (1 ligne)
//   text  : une ou deux phrases
//   date  : date ou période, en toutes lettres (ex. « Samedi 18 octobre, 15 h »)
//   image : chemin d'une image dans assets/news/ (facultatif, sinon null).
//           Si le fichier est absent, l'actualité s'affiche sans image.
// Laissez la liste vide ( [] ) pour ne rien afficher.
// =====================================================================
export const NEWS = [
  {
    title: "iPhone 18 Pro",
    text: "À partir de 859 € au lieu de 1 479 €, avec jusqu'à 620 € de valeur de rachat de votre ancien iPhone (exemple pour un iPhone 16 Pro 256 Go en état parfait). Rendez-vous au rayon Apple, au sous-sol.",
    date: "Disponible le 18 septembre",
    image: null
  },
  {
    title: "Call of Duty : Modern Warfare 4",
    text: "Précommandez le prochain Call of Duty au rayon Jeux vidéo, au sous-sol. Nos vendeurs vous renseignent sur les éditions et les bonus de précommande.",
    date: "Précommande ouverte",
    image: null
  },
  {
    title: "iPhone Duo",
    text: "Renseignez-vous au rayon Apple, au sous-sol.",
    date: "Précommande dès le 16 octobre",
    image: null
  }
];
