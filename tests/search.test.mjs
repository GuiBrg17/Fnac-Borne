// Vérifie que les phrases des clients mènent au bon rayon.
// Lancer depuis le dossier du projet :  node tests/search.test.mjs
import { findZone, findInfo, findIntent } from "../js/search.js";

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
  ["fr", "une souris gaming", "accessoiresGaming"],
  ["fr", "je cherche une PS5", "gaming"],
  ["fr", "des LEGO", "escalier"],
  ["fr", "retirer ma commande", "savRetrait"],
  ["fr", "un câble HDMI", "pcwindows"],
  ["fr", "une clé USB", "pcwindows"],
  ["fr", "un PC portable", "pcwindows"],
  ["fr", "des écouteurs sans fil", "audio"],
  ["fr", "un appareil photo", "photo"],
  ["fr", "la carte de fidélité", "adhesion"],
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
  ["fr", "une souri", "accessoiresGaming"],
  ["fr", "un samsoung", "telephonie"],
  ["fr", "mon écran est cassé", "savRetrait"],
  ["fr", "un portable", "telephonie"],
  // Nouveaux rayons du plan réel
  ["fr", "une montre connectée", "objets"],
  ["fr", "un aspirateur balai", "electromenager"],
  ["fr", "une cartouche d'encre", "accessoiresGaming"],
  ["fr", "un PC gamer", "accessoiresGaming"],
  ["fr", "une tablette Android", "pcwindows"],
  ["fr", "une imprimante", "pcwindows"],
  ["fr", "un micro cravate", "photo"],
  ["fr", "une carte Pokémon", "escalier"],
  ["fr", "la carte adhérent", "adhesion"],
  ["fr", "où sont les caisses", "caisse"],
  ["fr", "retirer un colis", "savRetrait"],
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
  ["es", "el mando a distancia", "tv"],
  // --- Priorité du SAV : la panne passe avant le rayon du produit ---
  ["fr", "je viens faire réparer mon iPhone", "savRetrait"],
  ["fr", "mon iPhone est cassé", "savRetrait"],
  ["fr", "ma télé est cassée", "savRetrait"],
  ["fr", "je viens chercher ma commande", "savRetrait"],
  ["fr", "une extension de garantie", "savRetrait"],
  ["fr", "mon aspirateur ne fonctionne pas", "savRetrait"],
  ["en", "I want to pick up my order", "savRetrait"],
  ["es", "vengo a recoger mi pedido", "savRetrait"],
  // mais le produit seul reste dans son rayon
  ["fr", "un iPhone 17", "apple"],
  ["fr", "une télé 65 pouces", "tv"],

  // --- Vocabulaire ajouté : étage 0 ---
  ["fr", "une montre Garmin", "objets"],
  ["fr", "une ampoule connectée", "objets"],
  ["fr", "un babyphone", "objets"],
  ["fr", "une batterie externe", "telephonie"],
  ["fr", "un verre trempé pour Samsung", "telephonie"],
  ["fr", "une carte SIM", "telephonie"],
  ["fr", "des cartes Pokémon", "escalier"],
  ["fr", "un LEGO Technic", "escalier"],
  ["fr", "une figurine Funko Pop", "escalier"],

  // --- Vocabulaire ajouté : sous-sol ---
  ["fr", "un jeu Pokémon", "gaming"],
  ["fr", "une manette PS5", "gaming"],
  ["fr", "un casque VR", "gaming"],
  ["fr", "un clavier mécanique", "accessoiresGaming"],
  ["fr", "une cartouche d'encre HP", "accessoiresGaming"],
  ["fr", "une carte graphique RTX", "accessoiresGaming"],
  ["fr", "un airfryer", "electromenager"],
  ["fr", "une friteuse sans huile", "electromenager"],
  ["fr", "un robot pâtissier", "electromenager"],
  ["fr", "une brosse à dents électrique", "electromenager"],
  ["fr", "un disque dur externe", "pcwindows"],
  ["fr", "une imprimante laser", "pcwindows"],
  ["fr", "un répéteur wifi", "pcwindows"],
  ["fr", "une tablette Samsung", "pcwindows"],
  ["fr", "une trottinette électrique", "trottinettes"],
  ["fr", "un casque de vélo", "trottinettes"],
  ["fr", "un objectif pour mon appareil photo", "photo"],
  ["fr", "une carte SD", "photo"],
  ["fr", "un micro cravate", "photo"],
  ["fr", "un vidéoprojecteur", "tv"],
  ["fr", "une télécommande universelle", "tv"],
  ["fr", "des écouteurs sans fil", "audio"],
  ["fr", "une enceinte bluetooth", "audio"],
  ["fr", "un casque à réduction de bruit", "audio"],
  ["fr", "un AirTag", "apple"],
  ["fr", "un bracelet Apple Watch", "apple"],
  ["fr", "un dé à jouer", "jeuxSociete"],
  ["fr", "un puzzle 1000 pièces", "jeuxSociete"],
  ["fr", "un jeu de rôle", "jeuxSociete"],
  ["fr", "la carte Fnac", "adhesion"],
  ["fr", "où payer", "caisse"],
  ["fr", "un manuel scolaire", "editorial"],
  ["fr", "un magazine", "editorial"],

  // --- Fautes de frappe et d'oreille ---
  ["fr", "une trotinette", "trottinettes"],
  ["fr", "un aspirateur robo", "electromenager"],

  // --- Anglais et espagnol ajoutés ---
  ["en", "a gaming keyboard", "accessoiresGaming"],
  ["en", "a robot vacuum", "electromenager"],
  ["en", "an ink cartridge", "accessoiresGaming"],
  ["en", "wireless earbuds", "audio"],
  ["en", "a smart bulb", "objets"],
  ["es", "un cargador de móvil", "telephonie"],
  ["es", "auriculares inalámbricos", "audio"],
  ["es", "una freidora de aire", "electromenager"],
  ["es", "un disco duro externo", "pcwindows"],
  ["es", "cartas pokemon", "escalier"],
  // --- À l'oral : la reconnaissance vocale écrit les nombres en lettres
  //     et sépare les marques (« PS cinq », « air pods »). ---
  ["fr", "je veux une PS cinq", "gaming"],
  ["fr", "la Switch deux", "gaming"],
  ["fr", "une play station", "gaming"],
  ["fr", "Xbox Série X", "gaming"],
  ["fr", "un iPhone quinze", "apple"],
  ["fr", "un iPhone dix-sept", "apple"],
  ["fr", "des air pods", "apple"],
  ["fr", "un i phone", "apple"],
  ["fr", "une télé soixante-cinq pouces", "tv"],
  ["fr", "une télé de cinquante-cinq pouces", "tv"],
  ["fr", "un écran vingt-sept pouces", "pcwindows"],
  ["fr", "un puzzle mille pièces", "jeuxSociete"],
  ["fr", "un dé à jouer", "jeuxSociete"],
  ["fr", "un jeu de dés", "jeuxSociete"],
  ["fr", "un go pro", "photo"],
  // les mots qui ressemblent ne doivent pas être emportés
  ["fr", "un coffret de séries DVD", "editorial"],
  ["fr", "le jeu Uno", "jeuxSociete"],
  ["fr", "des capsules de café", "electromenager"],
  ["en", "a play station five", "gaming"],
  ["es", "una tele de sesenta y cinco pulgadas", "tv"],
  ["fr", "un écran de cent quarante-quatre hertz", "accessoiresGaming"],
  ["fr", "je cherche le rayon informatique", "pcwindows"],
  ["fr", "un casque anti bruit", "audio"],
  ["fr", "une carte mémoire pour ma switch", "gaming"],
  ["fr", "un iphone seize pro max", "apple"]
];

// Questions pratiques : elles doivent passer avant les rayons.
const infoCases = [
  ["fr", "vous êtes ouvert jusqu'à quelle heure", "hours"],
  ["fr", "quels sont vos horaires", "hours"],
  ["fr", "vous êtes ouvert le dimanche", "hours"],
  ["fr", "où sont les toilettes", "toilets"],
  ["fr", "je peux me garer où", "parking"],
  ["en", "what time do you close", "hours"],
  ["en", "where is the restroom", "toilets"],
  ["es", "dónde están los baños", "toilets"],
  ["es", "a qué hora cierran", "hours"],
  // Pas de gros électroménager ici : le plus grand appareil est l'aspirateur balai.
  ["fr", "un lave-linge", "largeAppliances"],
  ["fr", "un frigo", "largeAppliances"],
  ["fr", "une machine à laver", "largeAppliances"],
  ["en", "a washing machine", "largeAppliances"],
  ["es", "una lavadora", "largeAppliances"]
];
// Demandes sans produit précis : un vendeur conseillera mieux.
const intentCases = [
  ["fr", "un cadeau pour mon fils de 10 ans", "human"],
  ["fr", "je cherche une idée cadeau", "human"],
  ["fr", "bonjour", "hello"],
  ["fr", "merci beaucoup", "thanks"],
  ["en", "a gift idea", "human"]
];

let failures = 0;
for (const [lang, text, expected] of infoCases) {
  const got = findInfo(text);
  const ok = got === expected;
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} [${lang}] ${text} → ${got}${ok ? "" : `   (attendu : ${expected})`}`);
}
for (const [lang, text, expected] of intentCases) {
  const got = findZone(text, lang) ? "rayon " + findZone(text, lang) : findIntent(text);
  const ok = got === expected;
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} [${lang}] ${text} → ${got}${ok ? "" : `   (attendu : ${expected})`}`);
}
for (const [lang, text, expected] of cases) {
  const got = findZone(text, lang);
  const ok = got === expected;
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} [${lang}] ${text} → ${got}${ok ? "" : `   (attendu : ${expected})`}`);
}
const total = cases.length + infoCases.length + intentCases.length;
console.log(`\n${total - failures}/${total} réussis`);
process.exit(failures ? 1 : 0);
