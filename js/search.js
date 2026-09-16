// =====================================================================
// Recherche d'un rayon à partir d'une phrase (voix ou texte).
// 1. Recherche exacte :
//    - mots entiers, sans accents ni majuscules, pluriels simples (s / x / es)
//    - les petits mots (d', de, pour, mon, the, para…) sont ignorés
//    - le mot-clé le plus long l'emporte (« casque gamer » avant « casque »)
//    - un rayon peut avoir un bonus "boost" (ex. Apple : tout ce qui cite
//      un produit Apple va au rayon Apple, même « chargeur d'iPhone »)
// 2. Si rien n'est trouvé, recherche tolérante aux fautes :
//    « aifone », « playstasion », « télévition », « trotinete »…
// =====================================================================
const { ZONES, INTENTS } = await import("./data.js" + new URL(import.meta.url).search);

const STOPWORDS = new Set([
  // français
  "d", "de", "du", "des", "l", "la", "le", "les", "un", "une", "pour", "a", "au", "aux", "mon", "ma", "mes", "en", "sur",
  // « est » : sans lui, « mon écran est noir » ne rejoignait pas « écran noir ».
  "est",
  // anglais
  "the", "an", "of", "for", "my", "some", "to",
  // espagnol
  "el", "los", "las", "del", "para", "una", "unos", "unas", "mi", "mis"
]);

export const normalize = (text) => text.toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, " ").trim();

const clean = (text) => normalize(text).split(" ").filter((w) => w && !STOPWORDS.has(w)).join(" ");
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const phraseRe = (phrase) => new RegExp(`(?:^| )${clean(phrase).split(" ").map(escapeRe).join(" ")}(?:s|x|es)?(?= |$)`);

// Écriture « à l'oreille » : rapproche les fautes courantes de la bonne orthographe.
const phonetic = (word) => word
  .replace(/^ai/, "i")
  .replace(/eau/g, "o").replace(/au/g, "o")
  .replace(/ph/g, "f").replace(/y/g, "i")
  .replace(/ck|k|q/g, "c").replace(/z/g, "s")
  .replace(/tion/g, "sion")
  .replace(/h/g, "")
  .replace(/(.)\1+/g, "$1")
  .replace(/[sx]$/, "");

const MATCHERS = Object.entries(ZONES).flatMap(([id, zone]) =>
  Object.entries(zone.keywords).flatMap(([lang, words]) =>
    words.map((word) => ({
      id, lang, word,
      re: phraseRe(word),
      weight: clean(word).length + (zone.boost || 0),
      sound: phonetic(clean(word).replace(/ /g, ""))
    }))));

const INTENT_MATCHERS = Object.fromEntries(
  Object.entries(INTENTS).map(([name, words]) => [name, words.map(phraseRe)]));

// Distance d'édition (nombre de lettres à changer), arrêtée dès qu'elle dépasse "max".
function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > max) return max + 1;
    previous = current;
  }
  return previous[b.length];
}

function exactMatch(query, lang) {
  return MATCHERS
    .filter((m) => (!lang || m.lang === lang) && m.re.test(query))
    .sort((a, b) => b.weight - a.weight)[0] || null;
}

function fuzzyMatch(query, lang) {
  const tokens = query.split(" ");
  const grams = new Set();
  for (let n = 1; n <= 3; n++) {
    for (let i = 0; i + n <= tokens.length; i++) grams.add(phonetic(tokens.slice(i, i + n).join("")));
  }
  let best = null;
  for (const m of MATCHERS) {
    if ((lang && m.lang !== lang) || m.sound.length < 5) continue;
    const max = m.sound.length >= 10 ? 2 : 1;
    for (const gram of grams) {
      // Même première lettre : évite « table » → « câble ».
      if (gram[0] !== m.sound[0]) continue;
      const distance = editDistance(gram, m.sound, max);
      if (distance > max) continue;
      // Une lettre de différence n'est acceptée que sur des mots d'au moins 6 lettres
      // (évite « table » → « tablet », « passer » → « payer »).
      if (distance > 0 && Math.min(gram.length, m.sound.length) < 6) continue;
      const score = distance * 100 - m.weight;
      if (!best || score < best.score) best = { matcher: m, score };
    }
  }
  return best ? best.matcher : null;
}

// Renvoie { id, keyword, fuzzy } ou null.
export function findZoneDetailed(text, lang) {
  const query = clean(text);
  if (!query) return null;
  const exact = exactMatch(query, lang) || exactMatch(query, null);
  if (exact) return { id: exact.id, keyword: exact.word, fuzzy: false };
  const fuzzy = fuzzyMatch(query, lang) || fuzzyMatch(query, null);
  return fuzzy ? { id: fuzzy.id, keyword: fuzzy.word, fuzzy: true } : null;
}

export function findZone(text, lang) {
  const match = findZoneDetailed(text, lang);
  return match ? match.id : null;
}

export function findIntent(text) {
  const query = clean(text);
  return ["human", "thanks", "hello"].find((name) => INTENT_MATCHERS[name].some((re) => re.test(query))) || null;
}

// Écriture soignée des marques pour l'affichage (« iphone » → « iPhone »).
const BRAND_CASE = {
  iphone: "iPhone", ipad: "iPad", ipod: "iPod", imac: "iMac", macbook: "MacBook", airpods: "AirPods", magsafe: "MagSafe",
  ps5: "PS5", ps4: "PS4", playstation: "PlayStation", xbox: "Xbox", nintendo: "Nintendo", switch: "Switch",
  tv: "TV", hdmi: "HDMI", usb: "USB", rj45: "RJ45", ssd: "SSD", sav: "SAV", pc: "PC", lego: "LEGO", pop: "POP",
  gopro: "GoPro", jbl: "JBL", bose: "Bose", samsung: "Samsung", apple: "Apple", sodastream: "SodaStream", oled: "OLED", qled: "QLED"
};
export const displayKeyword = (word) => word.split(" ").map((w) => BRAND_CASE[w] || w).join(" ");
