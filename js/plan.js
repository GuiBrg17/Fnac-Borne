// =====================================================================
// Plan du sous-sol, relevé sur le plan de l'architecte (822 × 434).
// Les numéros sont ceux du plan annoté par le magasin :
//   M1…M8 : murales (étagères le long des murs), M5 coupée en deux ;
//   7…42  : meubles au sol ;
//   E1…E7 : gondoles du petit électroménager, d'après le plan « Espace PEM ».
// Ce fichier ne contient que des formes : les rayons qui les occupent sont
// dans js/data.js (propriété "spots").
// =====================================================================

export const BASEMENT = {
  width: 822,
  height: 434,

  // Contour de la surface de vente (dans le sens des aiguilles d'une montre).
  outline: "M40 432 L40 300 L8 300 L8 238 L36 238 L36 92 L92 12 L300 12 L300 32 L588 32 L588 4 L648 4 L648 36 " +
           "L690 4 L782 126 L782 150 Q 742 236 778 296 L820 296 L820 346 L772 346 Q 700 374 606 398 L606 432 Z",

  stairs: { x: 776, y: 292, w: 42, h: 54 },

  shapes: [
    // --- Murales ---
    { id: "M1", kind: "mural", x: 36, y: 92, w: 8, h: 72, access: [50, 128] },
    { id: "M2", kind: "mural", x: 36, y: 172, w: 8, h: 58, access: [50, 201] },
    { id: "M3", kind: "mural", x: 0, y: 238, w: 8, h: 62, access: [16, 269] },
    { id: "M4", kind: "mural", x: 145, y: 44, w: 150, h: 6, access: [220, 57] },
    { id: "M5a", kind: "mural", x: 305, y: 33, w: 135, h: 6, access: [372, 46] },
    { id: "M5b", kind: "mural", x: 445, y: 33, w: 135, h: 6, access: [512, 46] },
    { id: "M6", kind: "mural", x: 40, y: 424, w: 160, h: 7, access: [110, 416] },
    { id: "M7", kind: "mural", x: 205, y: 424, w: 200, h: 7, access: [282, 416] },
    { id: "M8", kind: "mural", x: 417, y: 352, w: 12, h: 44, access: [410, 374] },

    // --- Petit électroménager (plan « Espace PEM ») ---
    { id: "E1", kind: "gondola", x: 72, y: 117, w: 14, h: 50 },
    { id: "E2", kind: "gondola", x: 110, y: 117, w: 14, h: 50 },
    { id: "E3", kind: "gondola", x: 150, y: 117, w: 14, h: 50 },
    { id: "E4", kind: "gondola", x: 72, y: 247, w: 14, h: 49 },
    { id: "E5", kind: "gondola", x: 110, y: 247, w: 14, h: 49 },
    { id: "E6", kind: "gondola", x: 150, y: 247, w: 14, h: 49 },
    { id: "E7", kind: "gondola", x: 176, y: 247, w: 13, h: 49 },

    // --- Bloc du milieu ---
    { id: "7", kind: "gondola", x: 225, y: 122, w: 15, h: 46 },
    { id: "8", kind: "gondola", x: 277, y: 122, w: 15, h: 46 },
    { id: "9", kind: "gondola", x: 325, y: 122, w: 15, h: 46 },
    { id: "10", kind: "gondola", x: 375, y: 122, w: 15, h: 46 },
    { id: "11", kind: "gondola", x: 225, y: 235, w: 15, h: 46 },
    { id: "12", kind: "gondola", x: 277, y: 235, w: 15, h: 46 },
    { id: "13", kind: "gondola", x: 325, y: 235, w: 15, h: 46 },
    { id: "14", kind: "gondola", x: 375, y: 235, w: 15, h: 46 },

    // --- Bloc de droite ---
    { id: "15", kind: "gondola", x: 425, y: 122, w: 15, h: 46 },
    { id: "16", kind: "gondola", x: 475, y: 122, w: 15, h: 46 },
    { id: "17", kind: "gondola", x: 527, y: 122, w: 15, h: 46 },
    { id: "18", kind: "gondola", x: 585, y: 125, w: 12, h: 25 },
    { id: "19", kind: "gondola", x: 637, y: 127, w: 15, h: 65 },
    { id: "20", kind: "gondola", x: 427, y: 180, w: 13, h: 15 },
    { id: "21", kind: "gondola", x: 475, y: 180, w: 15, h: 15 },
    { id: "22", kind: "gondola", x: 427, y: 260, w: 13, h: 20 },
    { id: "23", kind: "gondola", x: 472, y: 257, w: 13, h: 25 },
    { id: "24", kind: "gondola", x: 530, y: 232, w: 30, h: 30 },
    { id: "25", kind: "gondola", x: 570, y: 235, w: 15, h: 25 },
    { id: "26", kind: "gondola", x: 607, y: 235, w: 15, h: 25 },
    { id: "27", kind: "gondola", x: 645, y: 235, w: 15, h: 25 },

    // --- Rangée du bas ---
    { id: "28", kind: "gondola", x: 75, y: 357, w: 13, h: 43 },
    { id: "29", kind: "gondola", x: 135, y: 345, w: 15, h: 70 },
    { id: "30", kind: "gondola", x: 225, y: 345, w: 15, h: 50 },
    { id: "31", kind: "gondola", x: 325, y: 350, w: 15, h: 45 },
    { id: "32", kind: "gondola", x: 375, y: 350, w: 15, h: 45 },
    { id: "33", kind: "gondola", x: 490, y: 360, w: 35, h: 18 },
    { id: "34", kind: "gondola", x: 540, y: 360, w: 35, h: 18 },

    // --- Côté droit : SAV, caisses, adhésion, jeux de société ---
    { id: "35", kind: "counter", x: 590, y: 5, w: 50, h: 27, access: [615, 42] },
    { id: "37", kind: "gondola", x: 730, y: 197, w: 15, h: 15 },
    { id: "38", kind: "gondola", x: 760, y: 185, w: 15, h: 15 },
    { id: "39", kind: "counter", x: 700, y: 28, w: 12, h: 10 },
    { id: "40", kind: "counter", x: 717, y: 50, w: 12, h: 10 },
    { id: "41", kind: "counter", x: 735, y: 72, w: 12, h: 10 },
    { id: "42", kind: "counter", x: 752, y: 94, w: 12, h: 10 }
  ],

  // Étiquettes posées dans les allées : [x, y, alignement, rotation].
  // Clé « rayon » ou « rayon.emplacement ».
  labels: {
    gaming: [220, 67],
    accessoiresGaming: [307, 206],
    "accessoiresGaming.accessoires": [372, 57],
    cartouches: [512, 57],
    electromenager: [118, 207],
    informatique: [482, 112],
    tablettes: [617, 116],
    liseuses: [495, 191, "start"],
    pcwindows: [565, 301],
    trottinettes: [56, 128, "middle", -90],
    photo: [56, 236, "middle", -90],
    tv: [112, 339],
    audio: [357, 342],
    apple: [532, 352],
    savRetrait: [600, 50],
    jeuxSociete: [752, 226],
    caisse: [688, 64, "end"],
    adhesion: [722, 97, "end"],
    escalier: [797, 285]
  },

  // Allées : la grande allée courbe devant la rangée du bas, l'allée du haut
  // sous les murales, et les allées verticales entre les meubles.
  aisles: {
    start: [772, 322],   // arrivée de l'escalier
    main: 322,
    top: 80,
    columns: [60, 97, 137, 170, 207, 258, 308, 357, 407, 455, 505, 565, 628, 690]
  }
};

const byId = new Map(BASEMENT.shapes.map((shape) => [shape.id, shape]));
export const shape = (id) => byId.get(id);

export const centre = (s) => [s.x + s.w / 2, s.y + s.h / 2];

// Trajet depuis l'escalier jusqu'à un meuble, en suivant les allées.
export function routeTo(id) {
  const s = byId.get(id);
  if (!s) return null;
  const { start, main, top, columns } = BASEMENT.aisles;
  const [cx, cy] = centre(s);
  const nearest = (x) => columns.reduce((best, c) => (Math.abs(c - x) < Math.abs(best - x) ? c : best), columns[0]);
  const [ax, ay] = s.access || [null, null];

  // Rangée du bas : on quitte la grande allée juste en face.
  if (s.y > main) {
    const x = ax ?? cx;
    const y = ay ?? s.y - 4;
    return [start, [x, main], [x, y]];
  }
  // Murales et comptoirs du haut : par l'allée du haut.
  if (ay !== null && ay < top) {
    const column = nearest(ax);
    return [start, [column, main], [column, top], [ax, top], [ax, ay]];
  }
  // Meuble au sol ou murale de côté : allée verticale la plus proche, puis on le longe.
  const column = nearest(ax ?? cx);
  if (ax !== null) return [start, [column, main], [column, ay], [ax, ay]];
  const edge = column < cx ? s.x - 3 : s.x + s.w + 3;
  return [start, [column, main], [column, cy], [edge, cy]];
}
