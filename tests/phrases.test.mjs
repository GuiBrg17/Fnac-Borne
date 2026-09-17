// Vérifie les phrases de clients de tests/phrases-clients.txt.
// Lancer depuis le dossier du projet :  node tests/phrases.test.mjs
import { readFileSync } from "node:fs";
import { findZone, findIntent, findInfo } from "../js/search.js";

const lines = readFileSync(new URL("./phrases-clients.txt", import.meta.url), "utf8")
  .split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
// Langue devinée par les premiers mots (les phrases sont surtout en français).
const langOf = (text) => /^(a|an|my|i|where|what|is|headphones)\b/i.test(text) ? "en"
  : /^(un|una|unos|mi|el|la)\b.*\b(móvil|mando|funda|cafetera|tele|cargador|auriculares)\b/i.test(text) && !/[èàù]/.test(text) ? "es" : "fr";

let failures = 0;
for (const line of lines) {
  const [expected, text] = line.split("|");
  const lang = langOf(text);
  const got = findInfo(text) || findZone(text, lang) || findIntent(text) || "null";
  if (got !== expected) {
    failures++;
    console.log(`✗ [${lang}] ${text} → ${got}   (attendu : ${expected})`);
  }
}
console.log(`${lines.length - failures}/${lines.length} phrases de clients réussies`);
process.exit(failures ? 1 : 0);
