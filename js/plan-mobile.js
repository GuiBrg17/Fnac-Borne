// Page plan du téléphone. Lit le rayon dans l'adresse (?r=audio&l=fr),
// dessine le bon étage et trace le trajet. Rien d'autre.
import { dessiner, tracerTrajet, estLarge } from "./carte.js";

const params = new URLSearchParams(location.search);
const cible = params.get("r");
const place = params.get("p");
// Langue : celle passée par la borne si elle est là, sinon celle du téléphone.
const LANGUES = ["fr", "en", "es"];
const langueTelephone = (navigator.languages || [navigator.language || ""])
  .map((l) => String(l).slice(0, 2).toLowerCase()).find((l) => LANGUES.includes(l));
const langue = LANGUES.includes(params.get("l")) ? params.get("l") : (langueTelephone || "fr");

const svg = document.querySelector("#plan");
const etageEl = document.querySelector("#etage");
const aide = document.querySelector("#aide");

const AIDES = {
  fr: { depart: "Le trajet part de l'entrée du magasin.", sansRayon: "Plan du magasin.",
        etage0: "Étage 0", sousSol: "Sous-sol", inconnu: "Rayon inconnu : voici le plan du magasin." },
  en: { depart: "The route starts at the store entrance.", sansRayon: "Store map.",
        etage0: "Floor 0", sousSol: "Basement", inconnu: "Unknown department — here is the store map." },
  es: { depart: "El recorrido empieza en la entrada.", sansRayon: "Plano de la tienda.",
        etage0: "Planta 0", sousSol: "Sótano", inconnu: "Sección desconocida: aquí tiene el plano." }
};
const mots = AIDES[langue];
document.documentElement.lang = langue;

try {
  const data = await (await fetch(`assets/rayons.json?v=112`)).json();
  const rayons = data.rayons;
  const zone = cible ? rayons[cible] : null;
  // Un rayon du sous-sol : on y va directement, c'est là que le client doit descendre.
  const etage = zone ? (zone.floors.includes("-1") ? "-1" : "0") : "0";
  const textes = { ...data.textes[langue], lang: langue };

  // Plan large sur un écran haut : on le pose sur le côté pour qu'il remplisse.
  const pivoter = estLarge(etage) && innerHeight > innerWidth;
  const rendre = () => {
    const quart = estLarge(etage) && innerHeight > innerWidth;
    dessiner(svg, etage, { rayons, textes, cible: zone ? cible : null, place, pivoter: quart });
    return tracerTrajet(svg, etage, { rayons, cible: zone ? cible : null, place });
  };
  const trajet = rendre();
  // Le client tourne son téléphone : on redessine dans le bon sens.
  let attente = null;
  addEventListener("resize", () => { clearTimeout(attente); attente = setTimeout(rendre, 200); });

  if (zone) {
    etageEl.hidden = false;
    etageEl.textContent = etage === "-1" ? mots.sousSol : mots.etage0;
    etageEl.classList.toggle("est-sous-sol", etage === "-1");
  }
  aide.textContent = !cible ? mots.sansRayon : !zone ? mots.inconnu : trajet ? mots.depart : mots.sansRayon;
} catch (erreur) {
  aide.textContent = mots.sansRayon;
  console.warn("Plan indisponible :", erreur);
}
