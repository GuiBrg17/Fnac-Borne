// Extrait de js/data.js ce dont la page plan du téléphone a besoin : le nom des
// rayons et les meubles qu'ils occupent. data.js fait 400 Ko à cause des milliers
// de mots-clés ; un téléphone n'a pas à les télécharger.
//   node tools/plan-mobile.mjs
import { writeFileSync } from "node:fs";
import { ZONES, UI } from "../js/data.js";

const rayons = {};
for (const [id, z] of Object.entries(ZONES)) {
  if (!z.floors?.length) continue;                    // l'autre magasin n'est pas sur le plan
  const entree = { label: z.label, floors: z.floors };
  if (z.spots?.length) entree.spots = z.spots;
  if (z.short) entree.short = z.short;
  const places = {};
  for (const [p, e] of Object.entries(z.places || {})) {
    if (e.spots?.length) places[p] = { label: e.label, spots: e.spots, ...(e.short ? { short: e.short } : {}) };
  }
  if (Object.keys(places).length) entree.places = places;
  rayons[id] = entree;
}

const textes = Object.fromEntries(["fr", "en", "es"].map((l) => [l, {
  youAreHere: UI[l].youAreHere, floor0: UI[l].floor0, floorM1: UI[l].floorM1
}]));

const sortie = { rayons, textes };
writeFileSync(new URL("../assets/rayons.json", import.meta.url), JSON.stringify(sortie) + "\n");
const poids = JSON.stringify(sortie).length / 1024;
console.log(`${Object.keys(rayons).length} rayons → assets/rayons.json (${poids.toFixed(1)} Ko)`);
