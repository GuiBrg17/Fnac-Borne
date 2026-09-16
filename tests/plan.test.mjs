// Cohérence des plans du magasin.  node tests/plan.test.mjs
import { ZONES } from "../js/data.js";
import { BASEMENT, GROUND, corners, routeGround, routeTo } from "../js/plan.js";
import { findZoneDetailed } from "../js/search.js";

let failures = 0;
const check = (ok, message) => { console.log(`${ok ? "✓" : "✗"} ${message}`); if (!ok) failures++; };

const ALL = [...GROUND.shapes, ...BASEMENT.shapes];
const ids = new Set(ALL.map((s) => s.id));
const used = new Set();

// 1. Chaque meuble cité par un rayon existe sur le plan, et chaque emplacement
//    précis reste à l'intérieur de son rayon.
for (const [id, zone] of Object.entries(ZONES)) {
  for (const spot of zone.spots || []) {
    used.add(spot);
    if (!ids.has(spot)) check(false, `${id} : meuble ${spot} absent du plan`);
  }
  for (const [place, entry] of Object.entries(zone.places || {})) {
    for (const spot of entry.spots) {
      if (!(zone.spots || []).includes(spot)) check(false, `${id} › ${place} : ${spot} n'est pas dans le rayon`);
    }
  }
}
const orphans = ALL.filter((s) => s.kind !== "neutral" && !used.has(s.id)).map((s) => s.id);
check(orphans.length === 0, `les meubles des deux plans appartiennent tous à un rayon${orphans.length ? " — sans rayon : " + orphans.join(", ") : ""}`);

// 2. Aucun trajet ne traverse un meuble (formes droites ou en biais).
const cross = (a, b, c, d) => {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
};
const inside = (p, poly) => {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};
const traverses = (a, b, shape) => {
  // on réduit la forme d'un demi-point : longer un meuble n'est pas le traverser
  const poly = corners(shape);
  const [cx, cy] = [poly.reduce((s, p) => s + p[0], 0) / 4, poly.reduce((s, p) => s + p[1], 0) / 4];
  const shrunk = poly.map(([x, y]) => [x + Math.sign(cx - x) * 0.5, y + Math.sign(cy - y) * 0.5]);
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return shrunk.some((p, i) => cross(a, b, p, shrunk[(i + 1) % 4])) || inside(mid, shrunk);
};
function checkRoutes(label, routes, shapes) {
  let crossings = 0;
  for (const [target, points] of routes) {
    for (let i = 1; i < points.length; i++) {
      for (const other of shapes) {
        if (other.id !== target && traverses(points[i - 1], points[i], other)) {
          crossings++;
          console.log(`  ${label} : trajet vers ${target} traverse ${other.id}`);
        }
      }
    }
  }
  check(crossings === 0, `${label} : aucun trajet ne traverse un meuble`);
}
checkRoutes("sous-sol", BASEMENT.shapes.map((s) => [s.id, routeTo(s.id)]), BASEMENT.shapes);
checkRoutes("rez-de-chaussée",
  ["telephonie", "objets", "escalier", "apple"].map((id) => [id, routeGround(id, ZONES[id].floors)]),
  GROUND.shapes.filter((s) => s.kind !== "entrance"));

// 3. Chaque étiquette désigne un rayon ou un emplacement qui existe.
const badLabels = [...Object.keys(GROUND.labels), ...Object.keys(BASEMENT.labels)].filter((key) => {
  const [zone, place] = key.split(".");
  return !ZONES[zone] || (place && !ZONES[zone].places?.[place]);
});
check(badLabels.length === 0, `étiquettes valides${badLabels.length ? " — inconnues : " + badLabels.join(", ") : ""}`);

// 4. Les emplacements précis répondent juste.
const places = [
  ["fr", "un aspirateur balai", "electromenager", "aspirateurs"],
  ["fr", "une Nespresso", "electromenager", "capsules"],
  ["fr", "une machine à café", "electromenager", "machinesCafe"],
  ["fr", "un sèche-cheveux", "electromenager", "cheveux"],
  ["fr", "une centrale vapeur", "electromenager", "linge"],
  ["fr", "un nettoyeur vapeur", "electromenager", "sols"],
  ["fr", "un blender", "electromenager", "preparation"],
  ["fr", "un robot pâtissier", "electromenager", "cafe"],
  ["fr", "un micro-ondes", "electromenager", null],
  ["fr", "une souris gamer", "accessoiresGaming", "accessoires"],
  ["fr", "une carte graphique", "accessoiresGaming", "pc"],
  ["fr", "un écran d'ordinateur", "accessoiresGaming", "pc"],
  ["fr", "un adaptateur USB-C vers jack", "audio", "adaptateurs"],
  ["fr", "un casque bluetooth", "audio", null],
  ["fr", "des cartouches d'encre", "cartouches", null],
  ["fr", "une imprimante", "informatique", null],
  ["fr", "une liseuse Kobo", "liseuses", null],
  ["fr", "une tablette Android", "tablettes", null],
  ["fr", "un PC portable", "pcwindows", null],
  ["fr", "paiement en trois fois", "adhesion", null],
  ["fr", "des piles", "caisse", null],
  ["en", "a robot vacuum", "electromenager", "aspirateurs"],
  ["es", "una freidora de aire", "electromenager", "capsules"]
];
for (const [lang, text, zone, place] of places) {
  const m = findZoneDetailed(text, lang);
  const got = m ? `${m.id}${m.place ? " › " + m.place : ""}` : "aucun";
  const want = `${zone}${place ? " › " + place : ""}`;
  check(got === want, `[${lang}] ${text} → ${got}${got === want ? "" : `   (attendu : ${want})`}`);
}

console.log(failures ? `\n${failures} échec(s)` : "\nPlan cohérent");
process.exit(failures ? 1 : 0);
