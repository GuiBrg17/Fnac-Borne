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
// Photo provisoire : le monument à Jeanne d'Arc, place Jeanne-d'Arc, par
// Patrice Bon (Wikimedia Commons, CC0 — libre de tout usage, sans crédit
// obligatoire). À remplacer par la photo du magasin quand elle sera prise.
export const STORY = {
  button: "Notre histoire",
  title: "Pourquoi Jeanne d'Arc ?",
  text: "Notre magasin a ouvert en 2000 au 77 rue d'Alsace-Lorraine, sur plus de 1 700 m² consacrés à la technique. " +
        "Il doit son nom à la place Jeanne d'Arc toute proche, et à la statue de Jeanne d'Arc qui s'y dresse — " +
        "celle qui a donné son prénom à votre guide sur cette borne.",
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

// =====================================================================
// Clips en langue des signes : crédit affiché pendant le geste, demandé
// par la licence des vidéos (CC BY). À vider si tous les clips sont
// remplacés par des vidéos tournées au magasin.
// =====================================================================
export const SIGN_CREDIT = "Signes : Laura Jauvert · Lingua Libre (CC BY)";
