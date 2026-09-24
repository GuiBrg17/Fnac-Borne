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
// « Notre histoire », derrière le bouton en bas à droite de l'écran d'accueil.
// Trois volets : le magasin, la place et sa statue, puis ce que la Fnac et
// Jeanne d'Arc ont en commun. Le rapprochement est présenté pour ce qu'il
// est — une façon de raconter le magasin, pas un fait historique.
// Dates vérifiées : magasin créé en 2000 (annuaire des entreprises),
// Fnac fondée en 1954 par André Essel et Max Théret, laboratoire d'essais
// ouvert en 1972. La photo est à remplacer par celle du magasin.
// =====================================================================
export const STORY = {
  button: "Notre histoire",
  title: "Jeanne d'Arc et la Fnac",
  parts: [
    {
      title: "Un magasin du centre-ville",
      text: "La Fnac Jeanne d'Arc a ouvert en 2000 au 77 rue d'Alsace-Lorraine, sur plus de 1 700 m² " +
            "entièrement consacrés à la technique : téléphonie, son, image, jeux vidéo, informatique et photo."
    },
    {
      title: "La place et sa statue",
      text: "Le magasin doit son nom à la place Jeanne d'Arc, à deux pas d'ici, et à la statue équestre " +
            "d'Antonin Mercié qui s'y dresse depuis 1922. C'est elle qui a donné son prénom à votre guide sur cette borne."
    },
    {
      title: "Deux histoires qui se ressemblent",
      text: "Jeanne d'Arc avait dix-sept ans, aucun titre, et l'audace de suivre sa propre voix. " +
            "La Fnac est née en 1954 de la même liberté de ton : André Essel et Max Théret ont créé une " +
            "coopérative d'achat pour que la culture et la technique coûtent moins cher, et ont ouvert en 1972 " +
            "un laboratoire d'essais qui notait les produits sans ménager les marques. Défendre ceux qui achètent, " +
            "dire ce qu'on pense, rendre la culture accessible : c'est encore ce qui se joue dans ce magasin."
    }
  ],
  image: "assets/statue-jeanne-darc.jpg",
  caption: "Le monument à Jeanne d'Arc, place Jeanne-d'Arc, à deux pas du magasin"
};

// =====================================================================
// Encadré de droite sur l'écran de veille : la carte Fnac+, et le détail
// qui s'ouvre quand on touche « Plus d'informations ».
// Avantages relevés sur fnac.com/choisir-carte le 23/09/2026 : à revérifier
// avant la mise en service, les offres changent.
// =====================================================================
export const CARD = {
  tag: "Avez-vous la carte ?",
  title: "Carte Fnac+",
  price: "14,99 € pour 3 ans",
  image: "assets/news/fnac-plus.png",
  points: [
    "5 % de remise en magasin : livres, high-tech, jeux, photo, papeterie",
    "Livraison express gratuite et illimitée, Fnac et Darty",
    "Des tarifs réduits sur les spectacles et la billetterie"
  ],
  foot: "Renseignez-vous à l'espace adhésion, au sous-sol.",
  button: "Plus d'informations",
  // Fenêtre de détail
  detailTitle: "La carte Fnac+, en détail",
  detailPrice: "14,99 € pour 3 ans",
  sections: [
    {
      title: "Vos avantages d'adhérent",
      points: [
        "5 % de remise immédiate en magasin sur les livres, le high-tech, les jeux et jouets, la photo et la papeterie",
        "Livraison express gratuite et illimitée à la Fnac et chez Darty (hors livres, billetterie et marketplace)",
        "Des tarifs réduits sur les spectacles, concerts et parcs",
        "Week-end adhérent : 10 € offerts sur votre cagnotte tous les 100 € d'achat",
        "Des offres et des ventes privées réservées aux adhérents"
      ]
    },
    {
      title: "Gardé même après la carte",
      points: [
        "La cagnotte fidélité, à utiliser à la Fnac comme chez Darty",
        "Le Pass Partenaires : jusqu'à 42 % de remise dans plus de 500 enseignes"
      ]
    },
    {
      title: "Bon à savoir",
      points: [
        "La carte est gratuite pour les 18-20 ans avec le Pass Culture",
        "Adhésion et renseignements à l'espace adhésion, au sous-sol"
      ]
    }
  ],
  qr: "assets/qr-carte-fnac.svg",
  qrLabel: "Tous les détails sur votre téléphone"
};
