// =====================================================================
// Statistiques de la borne (anonymes, enregistrées uniquement sur la borne)
// - nombre de visites et de questions, par langue et par rayon
// - phrases restées sans réponse : pour compléter les mots-clés de data.js
// - sondage de fin de visite (trouvé / pas trouvé) et, pour les clients qui
//   n'ont pas trouvé, leur dernière demande
// Tout est compté deux fois : au total (depuis la dernière remise à zéro) et
// jour par jour, pour pouvoir envoyer le rapport d'une période (js/report.js).
// =====================================================================
const KEY = "jeanne.stats";
const MAX_MISSES = 60;
const MAX_MISSES_PER_DAY = 30;
// Jours gardés : de quoi couvrir le mois précédent même si la borne a été éteinte.
const KEEP_DAYS = 70;

const counters = () => ({ sessions: 0, questions: 0, byLang: {}, byZone: {}, bySource: {}, misses: {},
  feedback: { yes: 0, no: 0 }, unhappy: {}, rude: 0 });
const empty = () => ({ since: new Date().toISOString(), ...counters(), days: {} });

// Date locale de la borne, « 2026-09-17 ».
export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function withDefaults(counts) {
  const base = counters();
  return { ...base, ...counts, feedback: { ...base.feedback, ...(counts && counts.feedback) } };
}

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (!data || typeof data !== "object") return empty();
    return { ...empty(), ...withDefaults(data), since: data.since || new Date().toISOString(), days: data.days || {} };
  } catch { return empty(); }
}

function save(data) {
  const keys = Object.keys(data.days).sort();
  for (const old of keys.slice(0, Math.max(0, keys.length - KEEP_DAYS))) delete data.days[old];
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* stockage indisponible */ }
}

const bump = (obj, key, by = 1) => { obj[key] = (obj[key] || 0) + by; };

function bumpCapped(obj, key, max) {
  bump(obj, key);
  const entries = Object.entries(obj);
  if (entries.length <= max) return obj;
  return Object.fromEntries(entries.sort((a, b) => b[1] - a[1]).slice(0, max));
}

// Applique un enregistrement au total et au compteur du jour.
function record(apply) {
  const data = load();
  const key = dayKey();
  const day = withDefaults(data.days[key]);
  apply(data, MAX_MISSES);
  apply(day, MAX_MISSES_PER_DAY);
  data.days[key] = day;
  save(data);
}

export function recordSession() {
  record((c) => { c.sessions += 1; });
}

// source : "voice" (micro), "text" (clavier), "chip" (recherche fréquente), "map" (case du plan)
// Propos déplacés : on compte, on ne garde pas la phrase.
export function recordRude() {
  record((c) => { c.rude = (c.rude || 0) + 1; });
}

export function recordQuestion({ text, zone, lang, source }) {
  const phrase = text ? text.trim().toLowerCase().slice(0, 80) : "";
  record((c, max) => {
    c.questions += 1;
    bump(c.byLang, lang);
    bump(c.bySource, source);
    if (zone) bump(c.byZone, zone);
    else if (phrase) c.misses = bumpCapped(c.misses, phrase, max);
  });
}

// found : le client a trouvé ce qu'il cherchait. question : sa dernière demande.
export function recordFeedback({ found, question }) {
  const phrase = question ? question.trim().toLowerCase().slice(0, 80) : "";
  record((c, max) => {
    c.feedback[found ? "yes" : "no"] += 1;
    if (!found && phrase) c.unhappy = bumpCapped(c.unhappy, phrase, max);
  });
}

export function readStats() {
  return load();
}

// Statistiques d'une période, jours "from" à "to" inclus (clés « 2026-09-17 »).
export function readPeriod(from, to) {
  const days = load().days;
  const total = counters();
  for (const [key, day] of Object.entries(days)) {
    if (key < from || key > to) continue;
    const d = withDefaults(day);
    total.sessions += d.sessions;
    total.questions += d.questions;
    total.feedback.yes += d.feedback.yes;
    total.feedback.no += d.feedback.no;
    for (const field of ["byLang", "byZone", "bySource", "misses", "unhappy"]) {
      for (const [name, count] of Object.entries(d[field])) bump(total[field], name, count);
    }
  }
  return total;
}

export function resetStats() {
  save(empty());
}
