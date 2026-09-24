// Liste tout ce que la borne doit garder pour fonctionner sans réseau.
// node tools/hors-ligne.mjs  →  assets/hors-ligne.json
// À relancer avant chaque publication, comme tools/voix/phrases.mjs.
//
// Le socle (page, styles, modules, police) est déjà dans sw.js : ce fichier
// porte le reste, c'est-à-dire surtout les 267 phrases de Jeanne.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const suivis = execFileSync("git", ["ls-files"], { encoding: "utf8" }).trim().split("\n");
const garder = (f) =>
  f.startsWith("assets/") &&
  !f.endsWith(".md") &&
  f !== "assets/hors-ligne.json";

const liste = suivis.filter(garder).sort();
writeFileSync(new URL("../assets/hors-ligne.json", import.meta.url), JSON.stringify(liste));
const voix = liste.filter((f) => f.startsWith("assets/voix/")).length;
console.log(`${liste.length} fichiers à garder hors ligne (dont ${voix} de voix)`);
