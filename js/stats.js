// =====================================================================
// Statistiques de la borne (anonymes, enregistrées uniquement sur la borne)
// - nombre de visites et de questions, par langue et par rayon
// - phrases restées sans réponse : pour compléter les mots-clés de data.js
// =====================================================================
const KEY = "jeanne.stats";
const MAX_MISSES = 60;

const empty = () => ({ since: new Date().toISOString(), sessions: 0, questions: 0, byLang: {}, byZone: {}, bySource: {}, misses: {} });

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return data && typeof data === "object" ? { ...empty(), ...data } : empty();
  } catch { return empty(); }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* stockage indisponible */ }
}

const bump = (obj, key) => { obj[key] = (obj[key] || 0) + 1; };

export function recordSession() {
  const data = load();
  data.sessions += 1;
  save(data);
}

// source : "voice" (micro), "text" (clavier), "chip" (recherche fréquente), "map" (case du plan)
export function recordQuestion({ text, zone, lang, source }) {
  const data = load();
  data.questions += 1;
  bump(data.byLang, lang);
  bump(data.bySource, source);
  if (zone) {
    bump(data.byZone, zone);
  } else if (text) {
    const phrase = text.trim().toLowerCase().slice(0, 80);
    if (phrase) bump(data.misses, phrase);
    const entries = Object.entries(data.misses);
    if (entries.length > MAX_MISSES) {
      data.misses = Object.fromEntries(entries.sort((a, b) => b[1] - a[1]).slice(0, MAX_MISSES));
    }
  }
  save(data);
}

export function readStats() {
  return load();
}

export function resetStats() {
  save(empty());
}
