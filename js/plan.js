// =====================================================================
// Plans du magasin, relevés sur les plans de l'architecte.
//   GROUND   : rez-de-chaussée (396 × 567)
//   BASEMENT : sous-sol (822 × 434)
// Les formes peuvent être droites (x, y, w, h) ou en biais (from, to, t :
// les deux extrémités et l'épaisseur).
//
// Sous-sol :
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
  // À droite, le mur suit la courbe extérieure de l'escalier.
  outline: "M40 432 L40 300 L8 300 L8 238 L36 238 L36 92 L92 12 L300 12 L300 32 L588 32 L588 4 L648 4 L648 36 " +
           "L690 4 L782 126 L782 150 Q 742 236 781 297 L818 297 A 116 98 0 0 1 702 395 L606 400 L606 432 Z",

  // Escalier en courbe (« SS 4UP ») : un quart d'ellipse centré en (cx, cy).
  // On arrive de l'étage 0 en haut à droite (angle 0°), les marches descendent
  // jusqu'à 34°, puis le palier s'enroule jusqu'en bas à gauche (90°).
  stairs: [{ type: "arc", cx: 702, cy: 297, inner: [79, 60], outer: [116, 98], from: 0, to: 90,
              steps: [0, 34], treads: 12, arrow: 62 }],

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
    { id: "42", kind: "counter", x: 752, y: 94, w: 12, h: 10 },

    // --- Ascenseur PMR (8 personnes), porte côté gauche ---
    { id: "ASC", kind: "elevator", from: [759, 152.7], to: [789, 141.3], t: 30, access: [748, 162] }
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
    photo: [52, 235, "start"],
    tv: [112, 339],
    audio: [357, 342],
    apple: [532, 352],
    savRetrait: [600, 50],
    jeuxSociete: [752, 226],
    caisse: [688, 64, "end"],
    adhesion: [722, 97, "end"],
    escalier: [797, 285],
    ascenseur: [744, 128, "end"]
  },

  // Allées : la grande allée courbe devant la rangée du bas, l'allée du haut
  // sous les murales, et les allées verticales entre les meubles.
  aisles: {
    exit: [690, 376],    // sortie du palier, vers la grande allée
    main: 322,
    top: 80,
    columns: [60, 97, 137, 170, 207, 258, 308, 357, 407, 455, 505, 565, 628, 690]
  }
};

const byId = new Map(BASEMENT.shapes.map((shape) => [shape.id, shape]));
export const shape = (id) => byId.get(id);

export const centre = (s) => [s.x + s.w / 2, s.y + s.h / 2];

// Rectangle droit ou en biais → centre, dimensions et angle.
export function box(shape) {
  if (!shape.from) {
    return { cx: shape.x + shape.w / 2, cy: shape.y + shape.h / 2, w: shape.w, h: shape.h, rot: 0 };
  }
  const [x1, y1] = shape.from;
  const [x2, y2] = shape.to;
  return {
    cx: (x1 + x2) / 2, cy: (y1 + y2) / 2,
    w: Math.hypot(x2 - x1, y2 - y1), h: shape.t,
    rot: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  };
}

// Coins d'une forme (pour vérifier qu'un trajet ne la traverse pas).
export function corners(shape) {
  const { cx, cy, w, h, rot } = box(shape);
  const a = (rot * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]
    .map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
}

// Point d'un escalier en arc : angle en degrés, t de 0 (intérieur) à 1 (extérieur).
function arcPoint(piece, angle, t) {
  const a = (angle * Math.PI) / 180;
  const rx = piece.inner[0] + (piece.outer[0] - piece.inner[0]) * t;
  const ry = piece.inner[1] + (piece.outer[1] - piece.inner[1]) * t;
  return [piece.cx + rx * Math.cos(a), piece.cy + ry * Math.sin(a)];
}

// Point d'une volée droite : u de 0 (haut) à 1 (bas), v de -1 à 1 (d'un bord à l'autre).
function flightPoint(piece, u, v) {
  const [x1, y1] = piece.from, [x2, y2] = piece.to;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  return [x1 + dx * u + nx * v * piece.width / 2, y1 + dy * u + ny * v * piece.width / 2];
}

// Dessin des escaliers d'un plan : contour, marches et flèche de descente.
export function stairsDrawing(plan) {
  const r = (n) => n.toFixed(1);
  const pts = (list) => list.map(([x, y], i) => `${i ? "L" : "M"}${r(x)} ${r(y)}`).join(" ");
  return plan.stairs.map((piece) => {
    const lines = [];
    let band, arrowFrom, arrowTo;
    if (piece.type === "arc") {
      const [ox0, oy0] = arcPoint(piece, piece.from, 1), [ox1, oy1] = arcPoint(piece, piece.to, 1);
      const [ix0, iy0] = arcPoint(piece, piece.from, 0), [ix1, iy1] = arcPoint(piece, piece.to, 0);
      const large = Math.abs(piece.to - piece.from) > 180 ? 1 : 0;
      band = `M${r(ix0)} ${r(iy0)} L${r(ox0)} ${r(oy0)} A ${piece.outer[0]} ${piece.outer[1]} 0 ${large} 1 ${r(ox1)} ${r(oy1)} ` +
             `L${r(ix1)} ${r(iy1)} A ${piece.inner[0]} ${piece.inner[1]} 0 ${large} 0 ${r(ix0)} ${r(iy0)} Z`;
      const [s0, s1] = piece.steps;
      for (let i = 1; i <= piece.treads; i++) {
        const angle = s0 + ((s1 - s0) * i) / (piece.treads + 1);
        lines.push([...arcPoint(piece, angle, 0), ...arcPoint(piece, angle, 1)]);
      }
      if (piece.arrow !== undefined) {
        arrowFrom = arcPoint(piece, piece.arrow - 4, 0.5);
        arrowTo = arcPoint(piece, piece.arrow + 4, 0.5);
      }
    } else if (piece.type === "flight") {
      band = pts([flightPoint(piece, 0, -1), flightPoint(piece, 1, -1), flightPoint(piece, 1, 1), flightPoint(piece, 0, 1)]) + " Z";
      for (let i = 1; i <= piece.treads; i++) {
        const u = i / (piece.treads + 1);
        lines.push([...flightPoint(piece, u, -1), ...flightPoint(piece, u, 1)]);
      }
      if (piece.arrow !== undefined) {
        arrowFrom = flightPoint(piece, piece.arrow - 0.06, 0);
        arrowTo = flightPoint(piece, piece.arrow + 0.06, 0);
      }
    }
    if (piece.type === "drawn") {
      band = piece.outline;
      lines.push(...piece.treads);
      if (piece.arrow) [arrowFrom, arrowTo] = piece.arrow;
    }
    const arrow = arrowFrom && {
      x: arrowFrom[0], y: arrowFrom[1],
      heading: (Math.atan2(arrowTo[1] - arrowFrom[1], arrowTo[0] - arrowFrom[0]) * 180) / Math.PI
    };
    return { band, lines, arrow };
  });
}

// Descente d'un escalier en arc, point par point.
function arcRoute(piece) {
  const points = [];
  const step = (piece.to - piece.from) / 15;
  for (let i = 0; i <= 15; i++) points.push(arcPoint(piece, piece.from + step * i, 0.5));
  return points;
}

export function routeTo(id) {
  const s = byId.get(id);
  if (!s) return null;
  const { exit, main, top, columns } = BASEMENT.aisles;
  // Le trajet descend l'escalier, sort du palier et rejoint la grande allée.
  const start = [...arcRoute(BASEMENT.stairs[0]), exit, [exit[0], main]];
  const [cx, cy] = centre(s);
  const nearest = (x) => columns.reduce((best, c) => (Math.abs(c - x) < Math.abs(best - x) ? c : best), columns[0]);
  const [ax, ay] = s.access || [null, null];

  // Rangée du bas : on quitte la grande allée juste en face.
  if (s.y > main) {
    const x = ax ?? cx;
    const y = ay ?? s.y - 4;
    return [...start, [x, main], [x, y]];
  }
  // Murales et comptoirs du haut : par l'allée du haut.
  if (ay !== null && ay < top) {
    const column = nearest(ax);
    return [...start, [column, main], [column, top], [ax, top], [ax, ay]];
  }
  // Meuble au sol ou murale de côté : allée verticale la plus proche, puis on le longe.
  const column = nearest(ax ?? cx);
  if (ax !== null) return [...start, [column, main], [column, ay], [ax, ay]];
  const edge = column < cx ? s.x - 3 : s.x + s.w + 3;
  return [...start, [column, main], [column, cy], [edge, cy]];
}

// =====================================================================
// Rez-de-chaussée (plan de l'architecte, 396 × 567).
// La borne est à l'entrée ; l'escalier « accès sous-sol » est une volée
// droite qui tourne ensuite vers la droite.
// =====================================================================
export const GROUND = {
  width: 396,
  height: 567,
  view: [14, 30, 344, 426],   // cadrage sur le magasin (le reste du plan est hors surface de vente)

  outline: "M27 133 L195 57 L204 41 L256 41 L262 92 L231 108 L264 174 L302 160 L345 330 L243 368 L237 405 " +
           "L147 425 L133 390 Q 108 352 77 348 L34 352 Z",

  // Escalier relevé tel qu'il est dessiné sur le plan (contours et marches) :
  // en haut à gauche la volée en biais « accès sous-sol », en dessous à droite
  // la partie courbe qui longe le mur du poste sécu.
  stairs: [
    {
      type: "drawn",
      outline: "M186.9 239.3 L217.9 227.4 L240.0 275.4 L207.9 289.7 Z",
      treads: [
        [189.7, 238.2, 210.8, 288.4],
        [192.5, 237.1, 213.7, 287.1],
        [195.4, 236.1, 216.7, 285.8],
        [198.2, 235.0, 219.6, 284.5],
        [201.0, 233.9, 222.5, 283.2],
        [203.8, 232.8, 225.4, 281.9],
        [206.6, 231.7, 228.3, 280.6],
        [209.4, 230.6, 231.2, 279.3],
        [212.3, 229.6, 234.2, 278.0],
        [215.1, 228.5, 237.1, 276.7],
        [197.4, 264.5, 229.0, 251.4]
      ]
    },
    {
      type: "drawn",
      // La partie courbe part du bas de la volée (elles se touchent sur toute la
      // largeur : sans cela, un trou apparaissait entre les deux morceaux).
      outline: "M231 273 L293 273 L293 301 Q 290 330 275 357 L240 362 L227 330 Q 230 315 231 273 Z",
      treads: [
        [231.4, 279.5, 292.6, 280.3],
        [231.8, 286.0, 292.1, 287.6],
        [232.2, 292.5, 291.4, 294.8],
        [232.5, 299.0, 290.6, 302.0],
        [232.0, 305.5, 289.5, 309.1],
        [231.2, 312.0, 288.2, 316.1],
        [230.3, 318.5, 286.6, 323.0],
        [229.3, 325.0, 284.7, 329.7],
        [228.6, 331.5, 282.5, 336.2],
        [229.5, 338.0, 280.1, 342.4],
        [231.5, 344.5, 277.4, 348.3],
        [234.0, 351.0, 274.5, 353.9]
      ],
      arrow: [[266, 292], [262, 312]]
    }
  ],

  shapes: [
    // --- Téléphonie : murales du mur en biais et du mur de gauche, tables, postes de démo ---
    { id: "T1", kind: "mural", from: [42, 138], to: [163, 85], t: 9 },
    { id: "T2", kind: "mural", x: 32, y: 146, w: 10, h: 86 },
    { id: "T3", kind: "mural", from: [40, 250], to: [60, 342], t: 9 },
    { id: "T4", kind: "gondola", from: [82, 196], to: [172, 161], t: 20 },
    { id: "T5", kind: "gondola", from: [90, 252], to: [101, 338], t: 22 },
    { id: "T6", kind: "gondola", x: 133, y: 222, w: 30, h: 20 },
    // --- Objets connectés ---
    { id: "O1", kind: "mural", from: [224, 112], to: [258, 172], t: 9 },
    { id: "O2", kind: "mural", from: [211, 198], to: [252, 180], t: 9 },
    { id: "O3", kind: "gondola", x: 175, y: 117, w: 16, h: 15 },
    // --- Le long de l'escalier : LEGO, POP, Pokémon ---
    { id: "L1", kind: "mural", from: [292, 196], to: [313, 258], t: 9 },
    // --- Ascenseur PMR (8 personnes), porte côté gauche ---
    { id: "ASC", kind: "elevator", from: [208.5, 73.2], to: [241.5, 58.8], t: 34 },
    // --- Entrée et poste de sécurité ---
    { id: "ENTREE", kind: "entrance", from: [150, 421], to: [235, 403], t: 7 },
    { id: "SECU", kind: "neutral", x: 157, y: 310, w: 40, h: 15 }
  ],

  labels: {
    telephonie: [80, 232],
    objets: [214, 150],
    // Étiquette posée dans le creux entre la volée et le mur des LEGO : le nom
    // complet débordait du magasin et recouvrait les marches.
    escalier: [262, 250],
    ascenseur: [186, 64, "end"],
    entree: [192, 440]
  },

  here: [192, 380],

  // Trajets depuis la borne (à l'entrée), en contournant tables et poste sécu.
  routes: {
    stairs: [[150, 352], [145, 300], [168, 262], [192, 264]],
    telephonie: [[150, 352], [124, 300]],
    objets: [[150, 352], [145, 300], [168, 262], [172, 215], [200, 160]],
    ascenseur: [[150, 352], [145, 300], [168, 262], [172, 215], [200, 160], [196, 92]]
  }
};

const groundById = new Map(GROUND.shapes.map((shape) => [shape.id, shape]));

// Trajet au rez-de-chaussée : de la borne au rayon, ou jusqu'en haut de
// l'escalier pour un rayon du sous-sol.
export function routeGround(zoneId, floors) {
  if (zoneId === "entree") return null;
  const way = floors.includes("0") && GROUND.routes[zoneId] ? GROUND.routes[zoneId] : GROUND.routes.stairs;
  return [GROUND.here, ...way];
}
export const groundShape = (id) => groundById.get(id);
