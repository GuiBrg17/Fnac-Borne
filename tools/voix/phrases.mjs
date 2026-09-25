// Liste toutes les phrases que Jeanne prononce, dans les trois langues.
// node tools/voix/phrases.mjs  →  tools/voix/phrases.json
// À relancer (avec tools/voix/generer.py) dès qu'un texte change dans js/data.js.
import { writeFileSync } from "node:fs";
import { UI, ZONES, INFO, CLARIFY } from "../../js/data.js";

const phrases = [];
for (const lang of Object.keys(UI)) {
  const t = UI[lang];
  const add = (text) => phrases.push({ lang, text });
  [t.greeting, t.switched, t.hello, t.thanks, t.human, t.notFound, t.otherStore,
   t.foundStairs, t.foundEntrance, t.micUnsupported, t.micDenied, t.micError].forEach(add);
  for (const entry of Object.values(INFO)) add(entry.answer[lang]);
  for (const entry of CLARIFY) add(entry.question[lang]);
  [t.surveyAsk, t.surveyThanksYes, t.surveyThanksNo, t.a11yOn, t.a11yOff].forEach(add);
  add(t.vendorConfirm(null));
  add(t.vendorUnavailable);
  add(t.orderConfirm);
  add(t.rude);
  for (const [id, zone] of Object.entries(ZONES)) {
    if (zone.external || id === "ascenseur") continue;
    const label = zone.label[lang];
    if (id !== "escalier" && id !== "entree") {
      // Les lieux qui ne sont pas des rayons (caisses, SAV…) ont leur propre
      // début de phrase, parfois suivi d'un rappel.
      const phrase = zone.intro ? t.foundPlace(zone.intro[lang], zone.floors[0]) : t.found(zone.produits[lang], label, zone.floors[0]);
      add(zone.note ? `${phrase} ${zone.note[lang]}` : phrase);
    }
    add(t.vendorConfirm(label));
  }
}
const unique = [...new Map(phrases.map((p) => [`${p.lang}|${p.text}`, p])).values()];
writeFileSync(new URL("./phrases.json", import.meta.url), JSON.stringify(unique, null, 1));
console.log(`${unique.length} phrases (${Object.keys(UI).map((l) => `${l} ${unique.filter((p) => p.lang === l).length}`).join(", ")})`);
