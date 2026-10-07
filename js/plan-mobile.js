// Page plan du téléphone, ouverte depuis le QR code de la borne.
// Le rayon est dans l'adresse (?r=audio) ; ensuite le client se débrouille
// seul : il change de rayon ou d'étage sans retourner à la borne.
import { dessiner, tracerTrajet, estLarge } from "./carte.js";

const params = new URLSearchParams(location.search);
const LANGUES = ["fr", "en", "es"];
// Langue : celle passée par la borne si elle est là, sinon celle du téléphone.
const langueTelephone = (navigator.languages || [navigator.language || ""])
  .map((l) => String(l).slice(0, 2).toLowerCase()).find((l) => LANGUES.includes(l));
const langue = LANGUES.includes(params.get("l")) ? params.get("l") : (langueTelephone || "fr");

const MOTS = {
  fr: { depart: "Le trajet part de l'entrée du magasin.", simple: "Plan du magasin.",
        inconnu: "Rayon inconnu : voici le plan du magasin.",
        ailleurs: (e) => `Ce rayon est ${e === "-1" ? "au sous-sol" : "à l'étage 0"}.`,
        rayon: "Rayon", aucun: "Choisir un rayon" },
  en: { depart: "The route starts at the store entrance.", simple: "Store map.",
        inconnu: "Unknown department — here is the store map.",
        ailleurs: (e) => `That department is ${e === "-1" ? "in the basement" : "on floor 0"}.`,
        rayon: "Department", aucun: "Choose a department" },
  es: { depart: "El recorrido empieza en la entrada.", simple: "Plano de la tienda.",
        inconnu: "Sección desconocida: aquí tiene el plano.",
        ailleurs: (e) => `Esa sección está ${e === "-1" ? "en el sótano" : "en la planta 0"}.`,
        rayon: "Sección", aucun: "Elegir una sección" }
};
const mots = MOTS[langue];
document.documentElement.lang = langue;

// Horaires : le client vient de scanner dans le magasin, donc il est ouvert.
// On lui dit jusqu'à quand, et on le prévient si ça ferme bientôt.
function montrerHoraires(horaires, textes) {
  const el = document.querySelector("#horaires");
  const maintenant = new Date();
  const jour = horaires.days?.[maintenant.getDay()];
  if (!jour) return;
  const enMinutes = (h) => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
  const minute = maintenant.getHours() * 60 + maintenant.getMinutes();
  const [ouverture, fermeture] = jour.map(enMinutes);
  if (minute < ouverture || minute >= fermeture) return;   // fermé : on n'affiche rien
  const reste = fermeture - minute;
  const [h, m] = jour[1].split(":").map(Number);
  const heure = langue === "fr" ? (m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`)
    : langue === "en" ? `${h % 12 || 12}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "pm" : "am"}`
    : jour[1];
  const proche = reste <= (horaires.soonMinutes || 45);
  el.textContent = proche ? textes.fermetureDans.replace("{m}", reste) : textes.ouvertJusqua.replace("{h}", heure);
  el.classList.toggle("ferme-bientot", proche);
  el.hidden = false;
}

const svg = document.querySelector("#plan");
const aide = document.querySelector("#aide");
const etagesEl = document.querySelector("#etages");
const choix = document.querySelector("#choixRayon");
document.querySelector("#choixTitre").textContent = mots.rayon;

let rayons = {};
let textes = {};
let cible = params.get("r");
let place = params.get("p");
let etage = "0";

function etageDe(id) {
  const z = rayons[id];
  return z ? (z.floors.includes("-1") ? "-1" : "0") : "0";
}

function rendre() {
  const zone = rayons[cible];
  // Le rayon n'est pas sur l'étage affiché : on dessine l'étage, sans l'allumer.
  const surCetEtage = zone && etageDe(cible) === etage;
  const quart = estLarge(etage) && innerHeight > innerWidth;
  dessiner(svg, etage, { rayons, textes, cible: surCetEtage ? cible : null, place, pivoter: quart });
  const trajet = surCetEtage && tracerTrajet(svg, etage, { rayons, cible, place });

  svg.setAttribute("aria-label", zone ? `${textes.lang === "fr" ? "Plan" : "Map"} — ${zone.label[langue]}` : "Plan");
  aide.textContent = !cible ? mots.simple
    : !zone ? mots.inconnu
    : !surCetEtage ? mots.ailleurs(etageDe(cible))
    : trajet ? mots.depart : mots.simple;

  for (const b of etagesEl.children) {
    const actif = b.dataset.etage === etage;
    b.classList.toggle("est-actif", actif);
    b.setAttribute("aria-selected", String(actif));
  }
}

function choisir(id, { suivreEtage = true } = {}) {
  cible = id || null;
  place = null;
  if (suivreEtage && cible) etage = etageDe(cible);
  const url = new URL(location.href);
  if (cible) url.searchParams.set("r", cible); else url.searchParams.delete("r");
  url.searchParams.delete("p");
  history.replaceState(null, "", url);
  rendre();
}

try {
  const data = await (await fetch(`assets/rayons.json?v=114`)).json();
  rayons = data.rayons;
  textes = { ...data.textes[langue], lang: langue };
  etage = etageDe(cible);
  if (data.horaires) montrerHoraires(data.horaires, textes);

  // Les deux étages
  for (const [valeur, libelle] of [["0", textes.floor0], ["-1", textes.floorM1]]) {
    const b = document.createElement("button");
    b.type = "button";
    b.role = "tab";
    b.dataset.etage = valeur;
    b.textContent = libelle;
    b.addEventListener("click", () => { etage = valeur; rendre(); });
    etagesEl.append(b);
  }

  // La liste des rayons, par ordre alphabétique de leur nom
  const vide = document.createElement("option");
  vide.value = "";
  vide.textContent = mots.aucun;
  choix.append(vide);
  for (const [id, z] of Object.entries(rayons).sort((a, b) => a[1].label[langue].localeCompare(b[1].label[langue], langue))) {
    const o = document.createElement("option");
    o.value = id;
    o.textContent = z.label[langue];
    choix.append(o);
  }
  choix.value = rayons[cible] ? cible : "";
  choix.addEventListener("change", () => choisir(choix.value));

  rendre();
  // Le client tourne son téléphone : on redessine dans le bon sens.
  let attente = null;
  addEventListener("resize", () => { clearTimeout(attente); attente = setTimeout(rendre, 200); });
} catch (erreur) {
  aide.textContent = mots.simple;
  console.warn("Plan indisponible :", erreur);
}
