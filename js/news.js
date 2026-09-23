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
//           Une photo (.jpg) a ses bords effacés en dégradé pour se fondre
//           dans le jaune : prévoir une marge autour des personnages et du
//           logo, sinon ils disparaissent sur les bords.
//           Un produit détouré (.png) s'affiche tel quel, sans dégradé.
// Laissez la liste vide ( [] ) pour ne rien afficher.
// =====================================================================
export const NEWS = [
  {
    title: "iPhone 18 Pro",
    text: "À partir de 859 € au lieu de 1 479 €, avec jusqu'à 620 € de valeur de rachat de votre ancien iPhone (exemple pour un iPhone 16 Pro 256 Go en état parfait). Rendez-vous au rayon Apple, au sous-sol.",
    date: "Disponible le 18 septembre",
    image: "assets/news/iphone-18.png"
  },
  {
    title: "Call of Duty : Modern Warfare 4",
    text: "Précommandez le prochain Call of Duty au rayon Jeux vidéo, au sous-sol. Nos vendeurs vous renseignent sur les éditions et les bonus de précommande.",
    date: "Précommande ouverte",
    image: "assets/news/call-of-duty-mw4.jpg"
  },
  {
    title: "iPhone Duo",
    text: "Renseignez-vous au rayon Apple, au sous-sol.",
    date: "Précommande dès le 16 octobre",
    image: null
  }
];

// =====================================================================
// Encart « notre histoire », affiché sur l'écran de veille entre deux
// actualités. Mettre image: null tant que la photo n'est pas prise.
// La date d'ouverture vient de l'annuaire des entreprises (établissement
// créé le 4 septembre 2000) : à confirmer auprès du magasin.
// =====================================================================
export const STORY = {
  button: "Notre histoire",
  title: "Pourquoi Jeanne d'Arc ?",
  text: "Notre magasin a ouvert en 2000 au 77 rue d'Alsace-Lorraine, sur plus de 1 700 m² consacrés à la technique. " +
        "Il doit son nom à la place Jeanne d'Arc toute proche, et à la statue de Jeanne d'Arc qui s'y dresse — " +
        "celle qui a donné son prénom à votre guide sur cette borne.",
  image: "assets/statue-jeanne-darc.jpg",
  caption: "La statue de Jeanne d'Arc, à deux pas du magasin"
};

// =====================================================================
// Encadré de droite sur l'écran de veille : la carte Fnac+.
// Prix et durée à vérifier en magasin avant la mise en service.
// =====================================================================
export const CARD = {
  tag: "Avez-vous la carte ?",
  title: "Carte Fnac+",
  price: "14,99 € pour 3 ans",
  points: [
    "Des réductions toute l'année sur vos achats",
    "Des offres et des ventes réservées aux adhérents",
    "Des avantages sur la billetterie et les services"
  ],
  foot: "Renseignez-vous à l'espace adhésion, au sous-sol, ou demandez-moi « carte Fnac »."
};
