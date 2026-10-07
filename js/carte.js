// =====================================================================
// Dessin du plan du magasin, pour la page emportée sur le téléphone.
//
// Les relevés viennent de js/plan.js, comme pour la borne : une seule
// source pour les deux écrans. Seul le code de tracé est propre à cette
// page — la borne a le sien dans js/app.js, avec ses animations et ses
// deux étages côte à côte, dont un téléphone n'a pas besoin.
// =====================================================================
import { GROUND, BASEMENT, box, stairsDrawing, routeTo, routeGround } from "./plan.js";

const SVG_NS = "http://www.w3.org/2000/svg";
export const PLANS = { "0": GROUND, "-1": BASEMENT };

function el(tag, attrs, parent) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  parent.append(node);
  return node;
}

// Quel rayon occupe quel meuble : sert à colorer les meubles du rayon cherché.
function proprietaires(rayons) {
  const map = new Map();
  for (const [id, z] of Object.entries(rayons)) {
    for (const s of z.spots || []) map.set(String(s), { zone: id });
    for (const [p, e] of Object.entries(z.places || {}))
      for (const s of e.spots || []) map.set(String(s), { zone: id, place: p });
  }
  return map;
}

// Meubles à mettre en évidence : ceux de l'emplacement précis, sinon tout le rayon.
export function meublesDe(rayons, id, place) {
  const z = rayons[id];
  if (!z) return [];
  return (place && z.places?.[place]?.spots) || z.spots || [];
}

// Un plan plus large que haut sur un écran portrait tiendrait dans une bande
// au milieu de l'écran : on le pose sur le côté, et il remplit la page.
export function estLarge(etage) {
  const p = PLANS[etage];
  const [, , l, h] = p.view || [0, 0, p.width, p.height];
  return l / h > 1.25;
}

export function dessiner(svg, etage, { rayons, textes, cible = null, place = null, pivoter = false }) {
  const plan = PLANS[etage];
  svg.textContent = "";
  // Le rez-de-chaussée a un cadrage resserré (plan.view) ; le sous-sol prend tout.
  const [vx, vy, vl, vh] = plan.view || [0, 0, plan.width, plan.height];
  svg.setAttribute("viewBox", pivoter ? `0 0 ${vh} ${vl}` : `${vx} ${vy} ${vl} ${vh}`);
  // Quart de tour : le contenu bascule, le repère reste celui du plan d'origine.
  const racine = pivoter
    ? el("g", { transform: `translate(${vh} 0) rotate(90) translate(${-vx} ${-vy})` }, svg)
    : svg;
  const occupe = proprietaires(rayons);

  el("path", { d: plan.outline, class: "bm-floor" }, racine);

  const escaliers = el("g", { class: "bm-stairs" }, racine);
  for (const piece of stairsDrawing(plan)) {
    el("path", { d: piece.band, class: "bm-stairs-band" }, escaliers);
    for (const [x1, y1, x2, y2] of piece.lines) el("line", { x1, y1, x2, y2 }, escaliers);
    if (piece.arrow) {
      const { x, y, heading } = piece.arrow;
      el("path", { d: "M-6 -5 L6 0 L-6 5 Z", class: "bm-stairs-arrow",
                   transform: `translate(${x} ${y}) rotate(${heading})` }, escaliers);
    }
  }

  const vises = new Set(meublesDe(rayons, cible, place).map(String));
  for (const forme of plan.shapes) {
    const { cx, cy, w, h, rot } = box(forme);
    const qui = occupe.get(String(forme.id));
    const attrs = {
      x: cx - w / 2, y: cy - h / 2, width: w, height: h,
      rx: forme.kind === "mural" ? 1 : 2,
      class: `bm-shape bm-${forme.kind}${vises.has(String(forme.id)) ? " is-hit" : ""}`
    };
    if (rot) attrs.transform = `rotate(${rot.toFixed(2)} ${cx} ${cy})`;
    if (qui) attrs["data-zone"] = qui.zone;
    el("rect", attrs, racine);
  }

  // Étiquettes des rayons : celle du rayon cherché est mise en avant.
  const couche = el("g", { class: "bm-labels" }, racine);
  for (const [cle, [x, y, anchor = "middle", rotate = 0, texte = "short"]] of Object.entries(plan.labels)) {
    const [zoneId, placeId] = cle.split(".");
    const entree = placeId ? rayons[zoneId]?.places?.[placeId] : rayons[zoneId];
    if (!entree) continue;
    const attrs = { x, y, "text-anchor": anchor, "data-zone": zoneId,
                    class: `bm-label${zoneId === cible ? " is-hit" : ""}` };
    // Plan basculé : on redresse le texte d'autant, sinon il se lit de travers.
    const angle = (rotate || 0) - (pivoter ? 90 : 0);
    if (angle) attrs.transform = `rotate(${angle} ${x} ${y})`;
    const noeud = el("text", attrs, couche);
    const source = texte === "full"
      ? entree.label[textes.lang].replace(" · ", "\n")
      : (entree.short || entree.label)[textes.lang];
    const lignes = source.split("\n");
    lignes.forEach((ligne, i) => {
      el("tspan", { x, dy: i === 0 ? `${-(lignes.length - 1) * 0.55}em` : "1.1em" }, noeud).textContent = ligne;
    });
  }

  el("g", { class: "route-layer" }, racine);

  if (plan.here) {
    const [x, y] = plan.here;
    const ici = el("g", { class: "bm-here", transform: `translate(${x} ${y})` }, racine);
    el("circle", { r: 9, class: "bm-here-pulse" }, ici);
    el("circle", { r: 5.5, class: "bm-here-dot" }, ici);
    const ouSuisJe = el("text", { x: 11, y: 4, class: "bm-here-text" }, ici);
    if (pivoter) ouSuisJe.setAttribute("transform", "rotate(-90 11 4)");
    ouSuisJe.textContent = textes.youAreHere;
  }
}

// Trajet depuis l'entrée (étage 0) ou depuis le bas de l'escalier (sous-sol).
export function tracerTrajet(svg, etage, { rayons, cible, place = null }) {
  const couche = svg.querySelector(".route-layer");
  if (!couche || !cible || cible === "entree") return false;
  const zone = rayons[cible];
  if (!zone) return false;

  let points = null;
  if (etage === "0") {
    points = routeGround(cible, zone.floors);
  } else if (cible !== "escalier" && zone.floors.includes("-1")) {
    const meubles = meublesDe(rayons, cible, place);
    points = meubles.length ? routeTo(meubles[0]) : null;
  }
  if (!points || points.length < 2) return false;

  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  el("path", { d, class: "route-casing" }, couche);
  el("path", { d, class: "route-line" }, couche);
  const [dx, dy] = points[0];
  const [ax, ay] = points[points.length - 1];
  el("circle", { cx: dx, cy: dy, r: 4.5, class: "route-start" }, couche);
  el("circle", { cx: ax, cy: ay, r: 5.5, class: "route-end" }, couche);
  return true;
}
