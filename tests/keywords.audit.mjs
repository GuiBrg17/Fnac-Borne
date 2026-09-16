// Audit de la base de mots-clés.  node tests/keywords.audit.mjs
//
// Pour chaque mot-clé déclaré, on demande à la recherche où il mène :
// s'il ne ramène pas son propre rayon, c'est qu'un autre rayon le capte
// (mot présent deux fois, ou rayon prioritaire). C'est exactement ce qui
// envoie un client au mauvais endroit, donc on veut la liste.
import { ZONES } from "../js/data.js";
import { findZoneDetailed, normalize } from "../js/search.js";

const collisions = [];
const counts = [];
let total = 0;

for (const [id, zone] of Object.entries(ZONES)) {
  let perZone = 0;
  for (const [lang, words] of Object.entries(zone.keywords)) {
    perZone += words.length;
    total += words.length;
    for (const word of words) {
      const match = findZoneDetailed(word, lang);
      if (!match) collisions.push({ id, lang, word, got: "aucun rayon" });
      else if (match.id !== id) collisions.push({ id, lang, word, got: match.id, via: match.keyword });
    }
  }
  counts.push([id, perZone]);
}

const doubles = new Map();
for (const [id, zone] of Object.entries(ZONES)) {
  for (const [lang, words] of Object.entries(zone.keywords)) {
    for (const word of words) {
      const key = `${lang}:${normalize(word)}`;
      if (!doubles.has(key)) doubles.set(key, new Set());
      doubles.get(key).add(id);
    }
  }
}
const shared = [...doubles].filter(([, ids]) => ids.size > 1);

console.log("Mots-clés par rayon :");
for (const [id, n] of counts.sort((a, b) => b[1] - a[1])) console.log(`  ${id.padEnd(20)} ${String(n).padStart(4)}`);
console.log(`  ${"TOTAL".padEnd(20)} ${String(total).padStart(4)}\n`);

if (shared.length) {
  console.log(`Mots présents dans plusieurs rayons (${shared.length}) :`);
  for (const [key, ids] of shared) console.log(`  ${key}  →  ${[...ids].join(", ")}`);
  console.log("");
}

if (collisions.length) {
  console.log(`Mots-clés captés par un autre rayon (${collisions.length}) :`);
  for (const c of collisions) {
    console.log(`  [${c.lang}] ${c.word.padEnd(28)} déclaré ${c.id.padEnd(18)} → trouvé ${c.got}${c.via ? ` (via « ${c.via} »)` : ""}`);
  }
} else {
  console.log("Aucun mot-clé capté par un autre rayon.");
}
process.exit(0);
