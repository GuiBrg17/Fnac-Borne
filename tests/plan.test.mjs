// Cohérence du plan du sous-sol.  node tests/plan.test.mjs
import { ZONES } from "../js/data.js";
import { BASEMENT, routeTo } from "../js/plan.js";
import { findZoneDetailed } from "../js/search.js";

let failures = 0;
const check = (ok, message) => { console.log(`${ok ? "✓" : "✗"} ${message}`); if (!ok) failures++; };

const ids = new Set(BASEMENT.shapes.map((s) => s.id));
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
check([...ids].every((spot) => used.has(spot)), `les ${ids.size} meubles du plan appartiennent tous à un rayon`);

// 2. Aucun trajet ne traverse un meuble.
const crosses = (a, b, s) => {
  const [x1, x2] = [Math.min(a[0], b[0]), Math.max(a[0], b[0])];
  const [y1, y2] = [Math.min(a[1], b[1]), Math.max(a[1], b[1])];
  return x2 > s.x + 0.5 && x1 < s.x + s.w - 0.5 && y2 > s.y + 0.5 && y1 < s.y + s.h - 0.5;
};
let crossings = 0;
for (const target of BASEMENT.shapes) {
  const points = routeTo(target.id);
  for (let i = 1; i < points.length; i++) {
    for (const other of BASEMENT.shapes) {
      if (other.id !== target.id && crosses(points[i - 1], points[i], other)) {
        crossings++;
        console.log(`  trajet vers ${target.id} : traverse ${other.id}`);
      }
    }
  }
}
check(crossings === 0, "aucun trajet ne traverse un meuble");

// 3. Chaque étiquette désigne un rayon ou un emplacement qui existe.
const badLabels = Object.keys(BASEMENT.labels).filter((key) => {
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
