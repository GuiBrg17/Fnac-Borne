// Vérifie que les phrases des clients mènent au bon rayon.
// Lancer depuis le dossier du projet :  node tests/search.test.mjs
import { findZone } from "../js/search.js";

const cases = [
  // [langue, phrase, rayon attendu]
  ["fr", "je recherche un chargeur d'iPhone", "apple"],
  ["fr", "chargeur d'iPhone", "apple"],
  ["fr", "une coque pour iPhone 15", "apple"],
  ["fr", "un câble USB-C pour iPad", "apple"],
  ["fr", "des écouteurs Apple", "apple"],
  ["fr", "un chargeur Samsung", "telephonie"],
  ["fr", "un chargeur de téléphone", "telephonie"],
  ["fr", "je voudrais savoir où sont les casques", "audio"],
  ["fr", "où est la télécommande de la TV", "tv"],
  ["fr", "un micro-ondes", "electromenager"],
  ["fr", "une machine à café", "electromenager"],
  ["fr", "un casque de trottinette", "trottinettes"],
  ["fr", "un disque vinyle", "editorial"],
  ["fr", "une platine vinyle", "audio"],
  ["fr", "une souris gaming", "pcgamer"],
  ["fr", "je cherche une PS5", "gaming"],
  ["fr", "des LEGO", "escalier"],
  ["fr", "retirer ma commande", "retrait"],
  ["fr", "un câble HDMI", "cables"],
  ["fr", "une clé USB", "stockage"],
  ["fr", "un PC portable", "pcwindows"],
  ["fr", "des écouteurs sans fil", "audio"],
  ["fr", "un appareil photo", "photo"],
  ["fr", "la carte de fidélité", "caisse"],
  ["fr", "un jeu de société", "jeuxSociete"],
  ["fr", "des AirPods", "apple"],
  ["fr", "les toilettes", null],
  // Fautes d'orthographe et mauvaise reconnaissance vocale
  ["fr", "un aifone", "apple"],
  ["fr", "une playstasion 5", "gaming"],
  ["fr", "une play station", "gaming"],
  ["fr", "des écoutteurs", "audio"],
  ["fr", "une télévition", "tv"],
  ["fr", "une trotinete électrique", "trottinettes"],
  ["fr", "une souri", "cartouches"],
  ["fr", "un samsoung", "telephonie"],
  ["fr", "mon écran est cassé", "sav"],
  ["fr", "un portable", "telephonie"],
  // Produits éditoriaux → Fnac Wilson
  ["fr", "bonjour, où est-ce que je peux trouver des livres ?", "editorial"],
  ["fr", "un manuel scolaire", "editorial"],
  ["fr", "des mangas", "editorial"],
  ["fr", "le dernier album en CD", "editorial"],
  ["fr", "un DVD", "editorial"],
  ["fr", "des vinyles", "editorial"],
  ["en", "where can I find books", "editorial"],
  ["es", "busco un libro", "editorial"],
  // Ne doit rien trouver
  ["fr", "une table", null],
  ["fr", "passer un appel", null],
  ["fr", "je cherche mes clés", null],
  ["en", "an iPhone charger", "apple"],
  ["en", "a charger for my iPhone", "apple"],
  ["en", "where are the headphones", "audio"],
  ["es", "un cargador de iPhone", "apple"],
  ["es", "¿dónde están los auriculares?", "audio"],
  ["es", "el mando a distancia", "tv"]
];

let failures = 0;
for (const [lang, text, expected] of cases) {
  const got = findZone(text, lang);
  const ok = got === expected;
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} [${lang}] ${text} → ${got}${ok ? "" : `   (attendu : ${expected})`}`);
}
console.log(`\n${cases.length - failures}/${cases.length} réussis`);
process.exit(failures ? 1 : 0);
