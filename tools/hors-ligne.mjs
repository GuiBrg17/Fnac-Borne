// Liste tout ce que la borne doit garder pour fonctionner sans réseau.
// node tools/hors-ligne.mjs  →  assets/hors-ligne.json
// À relancer avant chaque publication, comme tools/voix/phrases.mjs.
//
// Le socle (page, styles, modules, police) est déjà dans sw.js : ce fichier
// porte le reste, c'est-à-dire surtout les 267 phrases de Jeanne.
//
// « --cached --others --exclude-standard » et pas « git ls-files » tout court :
// les voix qui viennent d'être fabriquées ne sont pas encore ajoutées à git, et
// celles qu'elles remplacent y sont encore. Le 26/09/2026, la liste publiée
// désignait 48 fichiers effacés et en oubliait 48 autres — la copie hors-ligne
// n'arrivait jamais à se terminer. On vérifie aussi que chaque fichier existe
// vraiment avant d'écrire la liste.
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";

const suivis = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .trim().split("\n");

const garder = (f) => f.startsWith("assets/") && !f.endsWith(".md") && f !== "assets/hors-ligne.json";
const liste = [...new Set(suivis.filter(garder))].filter(existsSync).sort();

const oublies = suivis.filter(garder).filter((f) => !existsSync(f));
if (oublies.length) console.log(`(${oublies.length} fichiers effacés, écartés de la liste)`);

writeFileSync(new URL("../assets/hors-ligne.json", import.meta.url), JSON.stringify(liste));
const voix = liste.filter((f) => f.startsWith("assets/voix/")).length;
console.log(`${liste.length} fichiers à garder hors ligne (dont ${voix} de voix)`);
