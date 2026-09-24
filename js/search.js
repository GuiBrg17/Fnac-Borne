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
const { ZONES, INTENTS, INFO, CLARIFY, RUDE } = await import("./data.js" + new URL(import.meta.url).search);

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
  // « Fnac+ » : sans cela le « + » disparaît et le mot-clé devient « fnac », qui
  // captait toutes les phrases où l'on dit « Fnac ».
  .replace(/\+/g, " plus ")
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  // « Wi-Fi », « wi fi » et « wifi » : une seule écriture
  .replace(/\bwi fi\b/g, "wifi")
  .trim()
  // Sigles épelés par la reconnaissance vocale : « u s b », « p s 5 », « h d m i »
  // redeviennent « usb », « ps 5 », « hdmi ». « a » et « y » n'en font jamais partie :
  // « tombé à l'eau » (a l) et « il y a » restent des mots.
  .replace(/\b(?:[b-xz] ){1,}[b-xz]\b/g, (letters) => letters.replace(/ /g, ""));

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

// Chaque mot-clé retient son rayon et, s'il y en a un, son emplacement précis
// dans le rayon (« aspirateur balai » → rayon électroménager, gondole E2).
// Un mot-clé fait uniquement de petits mots ignorés (« dèl » → « del ») serait vide
// et correspondrait à n'importe quelle phrase : on l'écarte.
const matchersFor = (id, zone, place, keywords) =>
  Object.entries(keywords).flatMap(([lang, words]) =>
    words.filter((word) => clean(word)).map((word) => ({
      id, place, lang, word,
      re: phraseRe(word),
      weight: clean(word).length + (zone.boost || 0),
      sound: phonetic(clean(word).replace(/ /g, ""))
    })));

// Mots vagues qui déclenchent une question (CLARIFY, data.js).
const VAGUE = new Set(CLARIFY.flatMap((entry) => Object.values(entry.words).flat()).map((w) => clean(w)));

const MATCHERS = Object.entries(ZONES).flatMap(([id, zone]) => [
  ...matchersFor(id, zone, null, zone.keywords),
  ...Object.entries(zone.places || {}).flatMap(([place, entry]) => matchersFor(id, zone, place, entry.keywords))
]);

const INTENT_MATCHERS = Object.fromEntries(
  Object.entries(INTENTS).map(([name, words]) => [name, words.filter((word) => clean(word)).map(phraseRe)]));

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

function exactMatches(query, lang) {
  const forms = variants(query);
  return MATCHERS
    .filter((m) => (!lang || m.lang === lang) && forms.some((form) => m.re.test(form)))
    .sort((a, b) => b.weight - a.weight);
}

// Le mot-clé retenu. Si c'est un mot vague (« casque », « câble »), le reste
// de la phrase peut suffire à choisir :
//  1. la phrase désigne un des choix de la question (« câble pour la télé »,
//     « chargeur Samsung ») ;
//  2. sinon, un mot précis de la phrase (« un casque JBL ») l'emporte, à
//     condition que tous les mots précis désignent le même rayon (les mots
//     contenus dans le mot vague, « portable » dans « ordinateur portable »,
//     ne comptent pas).
// Sinon on garde le mot vague, et Jeanne posera la question.
function bestMatch(text, query, lang) {
  const found = exactMatches(query, lang);
  const top = found[0];
  if (!top || !VAGUE.has(clean(top.word))) return top || null;
  const entry = clarifyFor(top.word);
  const option = entry && pickClarifyOption(text, entry);
  if (option) return { ...top, id: option.zone, place: option.place || null };
  const vague = clean(top.word);
  const precise = found.filter((m) => !VAGUE.has(clean(m.word)) && !vague.includes(clean(m.word)));
  if (precise.length && precise.every((m) => m.id === precise[0].id)) return precise[0];
  return { ...top, vague: true };
}

// Mots courants qui ressemblent à un produit sans en être : jamais de rapprochement
// approximatif (« magasin » → « magazine », « vendeur » → « vendeuse »…).
const NO_FUZZY = new Set(["magasin", "magasins", "vendeur", "vendeuse", "bonjour", "madame", "monsieur", "merci",
  "cherche", "voudrais", "voulais", "besoin", "comment", "combien", "pourquoi", "quelque", "aujourd", "demain"]);

function fuzzyMatch(query, lang) {
  const tokens = query.split(" ").filter((word) => !NO_FUZZY.has(word));
  const grams = new Set();
  for (let n = 1; n <= 3; n++) {
    for (let i = 0; i + n <= tokens.length; i++) {
      const part = tokens.slice(i, i + n);
      // Des petits mots collés ne font pas un produit : « est-ce que » ressemblait à « chèque ».
      if (n > 1 && part.every((word) => word.length <= 3)) continue;
      grams.add(phonetic(part.join("")));
    }
  }
  let best = null;
  for (const m of MATCHERS) {
    if ((lang && m.lang !== lang) || m.sound.length < 5) continue;
    // Mot d'une autre langue (lang = null) : même son exact, sans faute tolérée
    // (« compter » ressemblait à l'anglais « computer »).
    const max = !lang ? 0 : m.sound.length >= 10 ? 2 : 1;
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

// ---------------------------------------------------------------------
// Pannes, retours et colis : le SAV passe avant le produit cité.
// « mon iPhone ne marche plus » parle d'un iPhone, mais le client doit aller
// au SAV, pas au rayon Apple. Les mots-clés seuls ne suffisent pas (le client
// dit « il marche plus », « l'écran est fissuré », « je veux le rapporter »),
// donc on reconnaît la tournure de la phrase. On travaille sur le texte avec
// ses petits mots (mon, ma, est…), qui disent si l'objet est déjà à lui.
// ---------------------------------------------------------------------
const OBJECT = "(?:mon|ma|mes|ce|cet|cette|ces|le|la|les|l|un|une|des|son|sa|ses|notre|nos|votre|vos|article|produit|achat|cadeau|appareil)";
const PROBLEM_PATTERNS = [
  // « il marche plus », « ne s'allume pas », « ne charge toujours pas »
  // (mais pas « charge plus vite », « tient plus longtemps », « pas cher »)
  /\b(?:marche|marchent|marchait|fonctionne|fonctionnent|fonctionnait|allume|allument|allumait|charge|chargent|recharge|demarre|demarrent|connecte|connectent|affiche|repond|lit|lisent|capte|detecte|reconnait|synchronise|imprime|aspire|chauffe|sonne|seche|souffle|rase|lave|refroidit|coule|ouvre|eteint|tient|tourne|lance|s allume|s eteint|s ouvre|s affiche|se connecte|se charge|se lance)(?: [a-z]+)? (?:pas|plus)\b(?! (?:vite|rapide|rapidement|longtemps|fort|puissant|de|d|que|grand|cher|chere|mal|trop|beaucoup|chaud|lourd|leger|petit|gros|loin|facilement|bien|longue)\b)/,
  /\b(?:(?:pas|plus|aucun|aucune) (?:de |d )?(?:son|image|signal|reseau|connexion|wifi|bluetooth|lumiere|affichage)\b(?! (?:pour|de qualite))|ne fait plus|fait plus rien|n a plus|n y a plus|n ai plus|plus aucun|plus aucune|plus rien|rien ne marche|rien ne fonctionne|a plus de (?:son|image|reseau|connexion|wifi|bluetooth|signal))\b/,
  // état de l'appareil
  /\b(?:casse|cassee|casses|cassees|pete|petee|brise|brisee|fissure|fissuree|fele|felee|raye|rayee|rayure|rayures|abime|abimee|abimes|endommage|endommagee|defectueux|defectueuse|hs|bloque|bloquee|fige|figee|gele|oxyde|oxydee|gonfle|gonflee|foutu|foutue|bousille|bousillee|flingue|flinguee|explose|explosee|crame|cramee|mouille|mouillee|noye|noyee|panne|pannes|bug|bugue|beug|beugue|freeze|drift|fuit|fuite|gresille|gresillent|gresillement|crepite|surchauffe|pixel mort|pixels morts)\b/,
  /\b(?:(?:est|sont|s est) grill(?:e|ee|es)|(?:est|suis|a|ai|fait|faire|fais) tomb(?:e|ee|es|er)|tombe (?:par terre|dans|a l eau))\b/,
  /\b(?:ca|il|elle|ils|elles|tout) (?:rame|plante|bug|bugue|beugue|freeze|lag|lague|saute|coupe|redemarre)\b/,
  /\b(?:il manque|manque une piece|manque des pieces|piece manquante|trompe de|erreur de modele|pas le bon modele|mauvais produit|mauvais article|n arrive plus a|arrive plus a|n arrive pas a (?:allumer|charger|connecter|demarrer|installer|configurer)|perdu mes (?:photos|donnees|contacts|fichiers|messages)|efface mes|supprime mes (?:photos|donnees)|bruit bizarre|bruit anormal|fait du bruit|fait un bruit|chauffe trop|chauffe beaucoup|des lignes|une ligne|ecran noir|ecran blanc|ecran bleu|ecran fissure|dans l eau|probleme avec|souci avec|un probleme|un souci|code oublie|mot de passe oublie|oublie (?:mon|le|ma) (?:code|mot de passe|schema|identifiant)|code pin|code puk|compte bloque|icloud bloque)\b/,
  // retours, échanges, remboursements
  /\b(?:sav|service apres vente|apres vente|reparation|reparations|reparer|repare|reparee|rembourse|remboursement|garantie|pour un retour|faire un retour|retour (?:de|d|du|pour|sur)|s eteint tout|s allume tout|s eteint (?:sans arret|tout le temps)|se coupe|s arrete tout|redemarre tout)\b(?! (?:5|2|3|ans?)\b)/,
  new RegExp(`\\b(?:rendre|rapporter|ramener|retourner|renvoyer|echanger|deposer|recuperer|reprendre|reparer|rembourser)(?: [a-z]+)? ${OBJECT}\\b(?! monnaie)`),
  /\b(?:le rapporter|la rapporter|les rapporter|le rendre|la rendre|les rendre|l echanger|les echanger|me faire rembourser|se faire rembourser|faire reparer|remboursement|reparation|pas satisfait|pas satisfaite|pas content|pas contente|me plait pas|ne convient pas|convient pas|mauvais modele|mauvaise taille|pas compatible|en double|sous garantie)\b/,
  // commandes et colis
  /\b(?:viens|venu|venue|venus|passe|suis la pour|je dois) (?:chercher|recuperer|retirer|prendre) (?:mon|ma|mes|notre|nos)\b/,
  /\b(?:ma commande|mon colis|mes colis|mon paquet|j ai commande|a commande|commande sur|commande en ligne|commande internet|achete sur internet|achete sur le site|fnac com|recu un sms|recu un mail|recu un email|recu un message|code de retrait|numero de commande|bon de retrait|retrait 1h|click and collect|click collect)\b/,
  // anglais
  /\b(?:doesn t|does not|don t|do not|won t|will not|isn t|is not|stopped|can t|cannot|not)(?: [a-z]+)? (?:work|working|turn on|turning on|switch on|charge|charging|connect|connecting|start|starting|boot|power on|respond|responding|load|loading)\b/,
  /\b(?:broken|cracked|damaged|faulty|defective|smashed|shattered|stuck|frozen|overheating|water damage|out of order|dropped (?:it|my))\b/,
  /\b(?:return|exchange|refund|repair|fix|pick up|collect|drop off)(?: [a-z]+)? (?:my|this|these|those|it|them)\b/,
  /\b(?:my order|my parcel|my package|ordered online|bought online)\b/,
  // espagnol
  /\bno (?:me |se |le )?(?:funciona|funcionan|enciende|encienden|carga|cargan|arranca|conecta|responde|va|sirve|suena|lee|enciende)\b/,
  /\b(?:roto|rota|rotos|rotas|estropeado|estropeada|averiado|averiada|danado|danada|defectuoso|defectuosa|bloqueado|bloqueada|se ha caido|se me cayo|se cayo|mojado|mojada|pantalla rota)\b/,
  /\b(?:devolver|cambiar|reparar|arreglar|recoger|reembolsar)(?: [a-z]+)? (?:mi|mis|este|esta|estos|estas|esto|eso|lo|la|el)\b|\b(?:devolverlo|devolverla|devolucion)\b/,
  /\b(?:mi pedido|mi paquete|pedido online|pedi por internet|compre por internet)\b/
];
// Mots composés qui contiennent un mot de panne sans en être une.
// « recoger mis entradas » (retirer ses billets) : c'est la billetterie, pas le SAV.
const NOT_PROBLEMS = /\b(?:casse tete|casse tetes|grille pain|tombe pile|rendre la monnaie|rendre service|(?:recoger|retirer|retrait de|collect|pick up) (?:my |mis |mes |les |des )?(?:entradas|billets|tickets)|rendre (?:\w+ ){0,2}(?:connecte|connectee|intelligent|intelligente|compatible|smart|sans fil))\b/g;

export function findProblem(text) {
  const plain = normalize(text).replace(NOT_PROBLEMS, " ");
  for (const re of PROBLEM_PATTERNS) {
    const m = plain.match(re);
    if (m) return m[0].trim();
  }
  return null;
}

// Renvoie { id, place, keyword, fuzzy, vague } ou null (place : emplacement précis, ou null ;
// vague : mot vague gardé, voir findClarify).
// « pas un iPhone, un Samsung » : le produit refusé ne doit pas l'emporter.
const NEGATED = /\b(?:pas|plutot que|au lieu d|au lieu de|not|instead of) (?:un |une |des |de |d |le |la |les |l |a |an )?[a-z0-9]+(?: [0-9]+)?/g;

export function findZoneDetailed(text, lang) {
  if (!clean(text)) return null;
  const problem = findProblem(text);
  if (problem) return { id: "savRetrait", place: null, keyword: problem, fuzzy: false };
  const positive = normalize(text).replace(NEGATED, " ");
  if (clean(positive) && clean(positive) !== clean(text)) text = positive;
  const query = clean(text);
  const exact = bestMatch(text, query, lang) || bestMatch(text, query, null);
  if (exact) return { id: exact.id, place: exact.place, keyword: exact.word, fuzzy: false, vague: Boolean(exact.vague) };
  const fuzzy = fuzzyMatch(query, lang) || fuzzyMatch(query, null);
  return fuzzy ? { id: fuzzy.id, place: fuzzy.place, keyword: fuzzy.word, fuzzy: true } : null;
}

export function findZone(text, lang) {
  const match = findZoneDetailed(text, lang);
  return match ? match.id : null;
}

// Questions pratiques (horaires, toilettes, parking) : ni produit, ni rayon.
const INFO_MATCHERS = Object.entries(INFO).flatMap(([name, entry]) =>
  Object.values(entry.keywords).flat().filter((word) => clean(word)).map((word) => ({ name, re: phraseRe(word), length: clean(word).length })));

// Mots qui font d'un retrait une affaire de SAV, pas un retrait de commande.
const REPAIR = /\b(?:reparation|reparations|reparer|repare|reparee|sav|garantie|panne|casse|cassee|abime|abimee|ecran casse)\b/;

export function findInfo(text) {
  const query = clean(text);
  if (!query) return null;
  const hits = INFO_MATCHERS.filter((m) => m.re.test(query)).sort((a, b) => b.length - a.length);
  // « mon colis est ouvert » ou « l'appli s'est fermée » : c'est un souci, pas
  // les horaires. Sauf le retrait d'un téléphone, qui est bien une question
  // pratique même si la phrase parle d'une commande — mais « je viens chercher
  // mon téléphone en réparation », lui, reste une affaire de SAV.
  const pickup = hits[0] && hits[0].name === "phonePickup" && !REPAIR.test(query);
  if (findProblem(text) && !pickup) return null;
  if (!hits.length) return null;
  // Un produit plus précis dans la même phrase l'emporte : « un support pour la
  // voiture » n'est pas une question de parking, « un casque ouvert » pas d'horaires.
  const product = exactMatches(query, null)[0];
  if (product && clean(product.word).length > hits[0].length) return null;
  return hits[0].name;
}

// Propos déplacés (voir RUDE dans js/data.js). Renvoie « dirigés », « jurons »
// ou null. Mots entiers seulement, via les mêmes règles que la recherche.
const RUDE_MATCHERS = Object.fromEntries(
  Object.entries(RUDE).map(([genre, mots]) => [genre, mots.filter((mot) => clean(mot)).map(phraseRe)]));

export function findRude(text) {
  const query = clean(text);
  if (!query) return null;
  if (RUDE_MATCHERS["dirigés"].some((re) => re.test(query))) return "dirigés";
  if (RUDE_MATCHERS.jurons.some((re) => re.test(query))) return "jurons";
  return null;
}

export function findIntent(text) {
  const query = clean(text);
  return ["human", "thanks", "hello"].find((name) => INTENT_MATCHERS[name].some((re) => re.test(query))) || null;
}

// ---------------------------------------------------------------------
// Demandes vagues (« un casque », « un chargeur ») : voir CLARIFY dans data.js.
// On pose la question seulement si le mot vague est tout ce qui a été reconnu :
// si la recherche a trouvé un mot-clé plus précis (« casque gamer »,
// « chargeur d'iPhone ») ou une panne, le client va directement au bon rayon.
// ---------------------------------------------------------------------
const CLARIFY_WORDS = CLARIFY.map((entry) => ({
  entry,
  forms: new Set(Object.values(entry.words).flat().map(clean)),
  res: Object.values(entry.words).flat().filter((word) => clean(word)).map(phraseRe)
}));

const clarifyFor = (word) => (CLARIFY_WORDS.find(({ forms }) => forms.has(clean(word))) || {}).entry || null;

// La question à poser, ou null. "match" : le résultat de findZoneDetailed.
export function findClarify(text, match) {
  const query = clean(text);
  if (!query) return null;
  // Mot vague reconnu et gardé par bestMatch : la question. Mot précis : pas de question.
  if (match && !match.fuzzy) return match.vague ? clarifyFor(match.keyword) : null;
  const hit = CLARIFY_WORDS.find(({ res }) => res.some((re) => re.test(query)));
  return hit ? hit.entry : null;
}

// Réponse du client à la question : « pour jouer », « Samsung », « l'iPad »…
// Renvoie l'option choisie, ou null si la phrase ne désigne aucun choix.
export function pickClarifyOption(text, entry) {
  const words = ` ${normalize(text)} `;
  const scores = entry.options.map((option) =>
    Object.values(option.say).flat().filter((word) => words.includes(` ${normalize(word)} `)).length);
  const best = Math.max(...scores);
  if (!best || scores.filter((score) => score === best).length > 1) return null;
  return entry.options[scores.indexOf(best)];
}

// Écriture soignée des marques pour l'affichage (« iphone » → « iPhone »).
const BRAND_CASE = {
  iphone: "iPhone", ipad: "iPad", ipod: "iPod", imac: "iMac", macbook: "MacBook", airpods: "AirPods", magsafe: "MagSafe",
  ps5: "PS5", ps4: "PS4", playstation: "PlayStation", xbox: "Xbox", nintendo: "Nintendo", switch: "Switch",
  tv: "TV", hdmi: "HDMI", usb: "USB", rj45: "RJ45", ssd: "SSD", sav: "SAV", pc: "PC", lego: "LEGO", pop: "POP",
  gopro: "GoPro", jbl: "JBL", bose: "Bose", samsung: "Samsung", apple: "Apple", sodastream: "SodaStream", oled: "OLED", qled: "QLED"
};
export const displayKeyword = (word) => word.split(" ").map((w) => BRAND_CASE[w] || w).join(" ");
