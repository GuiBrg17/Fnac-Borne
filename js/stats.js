// =====================================================================
// Statistiques de la borne (anonymes, enregistrées uniquement sur la borne)
// - nombre de visites et de questions, par langue et par rayon
// - phrases restées sans réponse : pour compléter les mots-clés de data.js
// - sondage de fin de visite (trouvé / pas trouvé) et, pour les clients qui
//   n'ont pas trouvé, leur dernière demande
// =====================================================================
const KEY = "jeanne.stats";
const MAX_MISSES = 60;

const empty = () => ({ since: new Date().toISOString(), sessions: 0, questions: 0, byLang: {}, byZone: {}, bySource: {}, misses: {},
  feedback: { yes: 0, no: 0 }, unhappy: {} });

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (!data || typeof data !== "object") return empty();
    const base = empty();
    return { ...base, ...data, feedback: { ...base.feedback, ...data.feedback } };
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

// found : le client a trouvé ce qu'il cherchait. question : sa dernière demande.
export function recordFeedback({ found, question }) {
  const data = load();
  data.feedback[found ? "yes" : "no"] += 1;
  if (!found && question) {
    bump(data.unhappy, question.trim().toLowerCase().slice(0, 80));
    const entries = Object.entries(data.unhappy);
    if (entries.length > MAX_MISSES) {
      data.unhappy = Object.fromEntries(entries.sort((a, b) => b[1] - a[1]).slice(0, MAX_MISSES));
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
