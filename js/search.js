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
const { ZONES, INTENTS, INFO } = await import("./data.js" + new URL(import.meta.url).search);

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
  // « dés » perdrait son accent et deviendrait « des », un mot ignoré :
  // on lui donne un mot bien à lui avant de retirer les accents.
  // (\b ne marche pas après « é », qui n'est pas une lettre pour les regex)
  .replace(/\bdés?(?![a-zà-ÿ])/g, "dice")
  // « cent quarante-quatre hertz » doit rejoindre « écran 144 hz »
  .replace(/\bhertz\b/g, "hz")
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, " ").trim();

// À l'oral, la reconnaissance vocale écrit les nombres en lettres :
// « je veux une PS cinq », « une télé soixante-cinq pouces », « la Switch deux ».
// On les repasse en chiffres, des deux côtés (question et mots-clés), donc
// « PS cinq » et « PS5 » finissent identiques.
const UNITS = {
  zero: 0, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10,
  onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16,
  // « one » et « uno » restent des mots : aucun produit ne s'appelle « 1 », et
  // sinon le jeu UNO et le manga One Piece captaient tous les « 1 ».
  two: 2, three: 3, four: 4, five: 5, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19,
  cero: 0, dos: 2, tres: 3, cuatro: 4, cinco: 5, siete: 7, ocho: 8, nueve: 9, diez: 10,
  once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16, diecisiete: 17,
  dieciocho: 18, diecinueve: 19
};
const TENS = {
  vingt: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  veinte: 20, treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90
};
const HUNDREDS = { cent: 100, cents: 100, hundred: 100, cien: 100, ciento: 100, mille: 1000, thousand: 1000, mil: 1000 };

function toDigits(words) {
  const out = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const next = words[i + 1];
    // « quatre vingt dix » = 90, « quatre vingt » = 80
    if (w === "quatre" && (next === "vingt" || next === "vingts")) {
      let value = 80;
      const after = words[i + 2];
      if (after !== undefined && UNITS[after] !== undefined) { value += UNITS[after]; i += 2; }
      else i += 1;
      out.push(String(value));
      continue;
    }
    if (TENS[w] !== undefined) {
      // « soixante cinq » = 65, « soixante quinze » = 75, « vingt sept » = 27,
      // et la forme espagnole « sesenta y cinco ».
      const liaison = next === "y" || next === "and";
      const unit = liaison ? words[i + 2] : next;
      if (unit !== undefined && UNITS[unit] !== undefined && UNITS[unit] < 20) {
        out.push(String(TENS[w] + UNITS[unit]));
        i += liaison ? 2 : 1;
      } else out.push(String(TENS[w]));
      continue;
    }
    if (w === "dix" && next !== undefined && UNITS[next] >= 7 && UNITS[next] <= 9) {
      out.push(String(10 + UNITS[next]));
      i += 1;
      continue;
    }
    if (HUNDREDS[w] !== undefined) {
      // « cent quarante-quatre hertz » = 144 Hz, « cent » seul = 100
      if (HUNDREDS[w] === 100) {
        let j = i + 1;
        let extra = 0;
        if (words[j] !== undefined && TENS[words[j]] !== undefined) {
          extra = TENS[words[j]];
          j += 1;
          const liaison = words[j] === "y" || words[j] === "and";
          const unit = liaison ? words[j + 1] : words[j];
          if (unit !== undefined && UNITS[unit] !== undefined && UNITS[unit] < 20) {
            extra += UNITS[unit];
            j += liaison ? 2 : 1;
          }
        } else if (words[j] !== undefined && UNITS[words[j]] !== undefined) {
          extra = UNITS[words[j]];
          j += 1;
        }
        out.push(String(100 + extra));
        i = j - 1;
        continue;
      }
      out.push(String(HUNDREDS[w]));
      continue;
    }
    if (UNITS[w] !== undefined) { out.push(String(UNITS[w])); continue; }
    out.push(w);
  }
  return out;
}

const clean = (text) => toDigits(normalize(text).split(" ").filter((w) => w && !STOPWORDS.has(w))).join(" ");

// La voix sépare la marque du chiffre (« ps 5 »), le clavier les colle
// (« ps5 ») : on essaie les deux écritures.
function variants(query) {
  const forms = new Set([query]);
  forms.add(query.replace(/\b([a-z]{1,5}) (\d{1,4})\b/g, "$1$2"));
  forms.add(query.replace(/\b(\d{1,4}) ([a-z])\b/g, "$1$2"));
  forms.add(query.replace(/\b([a-z]{2,6})(\d{1,4})\b/g, "$1 $2"));
  return [...forms];
}
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
  const forms = variants(query);
  return MATCHERS
    .filter((m) => (!lang || m.lang === lang) && forms.some((form) => m.re.test(form)))
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

// Questions pratiques (horaires, toilettes, parking) : ni produit, ni rayon.
const INFO_MATCHERS = Object.fromEntries(
  Object.entries(INFO).map(([name, entry]) => [
    name,
    Object.values(entry.keywords).flat().map(phraseRe)
  ]));

export function findInfo(text) {
  const query = clean(text);
  if (!query) return null;
  return Object.keys(INFO_MATCHERS).find((name) => INFO_MATCHERS[name].some((re) => re.test(query))) || null;
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
