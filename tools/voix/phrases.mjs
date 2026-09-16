// Liste toutes les phrases que Jeanne prononce, dans les trois langues.
// node tools/voix/phrases.mjs  →  tools/voix/phrases.json
// À relancer (avec tools/voix/generer.py) dès qu'un texte change dans js/data.js.
import { writeFileSync } from "node:fs";
import { UI, ZONES, INFO } from "../../js/data.js";

const phrases = [];
for (const lang of Object.keys(UI)) {
  const t = UI[lang];
  const add = (text) => phrases.push({ lang, text });
  [t.greeting, t.switched, t.hello, t.thanks, t.human, t.notFound, t.otherStore,
   t.foundStairs, t.foundEntrance, t.micUnsupported, t.micDenied, t.micError].forEach(add);
  for (const entry of Object.values(INFO)) add(entry.answer[lang]);
  add(t.vendorConfirm(null));
  for (const [id, zone] of Object.entries(ZONES)) {
    if (zone.external) continue;
    const label = zone.label[lang];
    if (id !== "escalier" && id !== "entree") add(t.found(label, zone.floors[0]));
    add(t.vendorConfirm(label));
  }
}
const unique = [...new Map(phrases.map((p) => [`${p.lang}|${p.text}`, p])).values()];
writeFileSync(new URL("./phrases.json", import.meta.url), JSON.stringify(unique, null, 1));
console.log(`${unique.length} phrases (${Object.keys(UI).map((l) => `${l} ${unique.filter((p) => p.lang === l).length}`).join(", ")})`);
