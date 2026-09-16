// =====================================================================
// Borne Jeanne — logique de l'interface
// =====================================================================
// La version (?v=N de index.html) est reportée sur chaque fichier :
// une mise en ligne remplace donc bien toutes les copies en cache.
const VERSION = new URL(import.meta.url).search;
const { LANGS, UI, ZONES, SUGGESTIONS, OTHER_STORE, INFO } = await import("./data.js" + VERSION);
const { findZoneDetailed, findIntent, findInfo, findClarify, pickClarifyOption, normalize, displayKeyword } = await import("./search.js" + VERSION);
const { NEWS } = await import("./news.js" + VERSION);
const { recordSession, recordQuestion, recordFeedback, readStats, resetStats } = await import("./stats.js" + VERSION);
const voice = await import("./voice.js" + VERSION);
const { BASEMENT, GROUND, box, routeTo, routeGround, stairsDrawing } = await import("./plan.js" + VERSION);

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Avatar de la borne. Quand Jeanne est prête, remplacer par "assets/avatar/Jeanne.vrm".
const AVATAR_FILE = "assets/avatar/Jeanne.glb";
const FALLBACK_AVATAR = "assets/avatar/placeholder.vrm";
// Retouches de l'avatar d'essai : cheveux blond doré et yeux bleus (non appliquées aux autres avatars).
const PLACEHOLDER_LOOK = { hair: "golden", eyes: "blue" };
// Test sans modifier le code : ajouter ?avatar=Jeanne.glb à l'adresse de la borne.
function avatarFile() {
  const requested = new URLSearchParams(location.search).get("avatar");
  return requested && /^[\w-]+(\/[\w-]+)*\.(glb|vrm)$/i.test(requested) ? "assets/avatar/" + requested : AVATAR_FILE;
}
const WARNING_SECONDS = 15;
// Visuel de l'écran de veille :
//   "3d"    → l'avatar animé (il respire, cligne des yeux, salue, signe)
//   "photo" → assets/jeanne-accueil.png
//   "video" → assets/jeanne-accueil.mp4, avec la photo en secours
const IDLE_VISUAL = "video";

// --- Réglages enregistrés sur la borne ---------------------------------
const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem("jeanne." + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("jeanne." + key, JSON.stringify(value)); } catch { /* stockage indisponible */ }
  }
};
const settings = {
  voices: store.get("voices", {}),
  idleSeconds: store.get("idleSeconds", 60),
  neuralVoice: store.get("neuralVoice", true)
};

const state = { screen: "idle", lang: "fr", floor: "0", zone: null, place: null, a11y: false, listening: false, speaking: false,
  // clarify : question en attente (« Quel genre de casque ? »), avec la source de la demande
  clarify: null, clarifySource: null,
  // visite en cours : nombre de demandes, dernière demande, sondage déjà répondu
  visit: { count: 0, last: null, surveyed: false } };
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const motionReduced = () => prefersReduced || state.a11y;
const t = () => UI[state.lang];

const els = {
  idle: $("#idleScreen"), idleCopy: $("#idleCopy"), bubble: $(".idle-bubble"),
  idleGreet: $("#idleGreet"), idleNews: $("#idleNews"), idleNewsTitle: $("#idleNewsTitle"), idleNewsText: $("#idleNewsText"),
  idleNewsDate: $("#idleNewsDate"), idleNewsExample: $("#idleNewsExample"), idleNewsImage: $("#idleNewsImage"),
  statsSummary: $("#statsSummary"), statsZones: $("#statsZones"), statsMisses: $("#statsMisses"), statsReset: $("#statsReset"),
  idleSlot: $("#idleAvatarSlot"), dockSlot: $("#dockAvatarSlot"),
  app: $("#appScreen"), stageEl: $("#avatarStage"), canvas: $("#avatarCanvas"),
  chat: $("#chatLog"), chips: $("#suggestions"), status: $("#status"), statusText: $("#statusText"),
  mic: $("#micButton"), micLabel: $("#micLabel"), form: $("#askForm"), input: $("#askInput"), send: $("#askSend"),
  vendor: $("#vendorButton"), a11y: $("#a11yButton"), end: $("#endButton"), logo: $("#logoButton"),
  mapStage: $("#mapStage"), route: $("#route"), routeHint: $("#routeHint"), routeStairs: $("#routeStairs"),
  routeTarget: $("#routeTarget"), routeIcon: $("#routeIcon use"),
  warning: $("#idleWarning"), warningBody: $("#idleWarningBody"), warningButton: $("#idleWarningButton"),
  survey: $("#survey"), surveyTitle: $("#surveyTitle"), surveyButtons: $("#surveyButtons"),
  statsSatisfaction: $("#statsSatisfaction"), statsUnhappy: $("#statsUnhappy"),
  settings: $("#settings"), idleSeconds: $("#idleSeconds"), testVoice: $("#testVoice"),
  neuralToggle: $("#neuralToggle"), voiceStatus: $("#voiceStatus"), voiceDownload: $("#voiceDownload"),
  toast: $("#toast"),
  otherStore: $("#otherStore"), otherStoreClose: $("#otherStoreClose"), otherStoreAddress: $("#otherStoreAddress"),
  idlePhoto: $("#idlePhoto"), idleVideo: $("#idleVideo")
};

// =====================================================================
// Voix de Jeanne (synthèse vocale du navigateur, voix féminines d'abord)
// =====================================================================
const FEMALE_VOICES = {
  fr: ["denise", "vivienne", "eloise", "brigitte", "celeste", "coralie", "jacqueline", "josephine", "yvette", "julie", "hortense", "amelie", "audrey", "aurelie", "marie", "virginie", "google francais", "flo", "sandy", "shelley"],
  en: ["sonia", "libby", "maisie", "hollie", "jenny", "aria", "michelle", "ava", "emma", "hazel", "susan", "zira", "serena", "kate", "karen", "moira", "samantha", "tessa", "victoria", "allison", "fiona", "zoe", "google uk english female", "google us english", "flo", "sandy", "shelley"],
  es: ["elvira", "abril", "ximena", "helena", "laura", "monica", "paulina", "lucia", "conchita", "marisol", "google espanol", "flo", "sandy", "shelley"]
};
const MALE_VOICES = ["paul", "henri", "claude", "guy", "remy", "alain", "jerome", "yves", "antoine", "david", "mark", "george", "ryan", "thomas", "daniel", "oliver", "alvaro", "pablo", "jorge", "diego", "raul", "arthur", "fred", "alex", "tom", "male",
  "eddy", "reed", "rocko", "grandpa", "albert", "ralph", "junior", "jacques", "nicolas", "gordon", "aaron", "rishi", "juan", "carlos", "jorge"];

let voices = [];
let currentUtterance = null;

function refreshVoices() {
  if (!("speechSynthesis" in window)) return;
  voices = window.speechSynthesis.getVoices();
  fillVoiceSettings();
}

// Voix de femme reconnue pour cette langue (les voix inconnues ou d'homme sont exclues).
function isFemaleVoice(voiceItem, lang) {
  const name = normalize(voiceItem.name);
  const matches = (n) => new RegExp(`(^| )${n}( |$)`).test(name);
  return FEMALE_VOICES[lang].some(matches) && !MALE_VOICES.some(matches);
}

function pickVoice(lang) {
  const saved = settings.voices[lang] && voices.find((v) => v.voiceURI === settings.voices[lang]);
  if (saved && isFemaleVoice(saved, lang)) return saved;
  const wanted = LANGS[lang].speech.toLowerCase();
  let best = null;
  let bestScore = -Infinity;
  for (const candidate of voices) {
    const voiceLang = (candidate.lang || "").replace("_", "-").toLowerCase();
    if (!voiceLang.startsWith(wanted.slice(0, 2))) continue;
    const name = normalize(candidate.name);
    let score = voiceLang === wanted ? 4 : 0;
    const rank = FEMALE_VOICES[lang].findIndex((n) => new RegExp(`(^| )${n}( |$)`).test(name));
    // Jeanne ne parle qu'avec une voix de femme : une voix inconnue ou d'homme est écartée.
    if (rank < 0 || MALE_VOICES.some((n) => new RegExp(`(^| )${n}( |$)`).test(name))) continue;
    score += 20 - rank * 0.2;
    if (/natural|online|neural|premium|enhanced/.test(name)) score += 3;
    if (score > bestScore) { bestScore = score; best = candidate; }
  }
  return best;
}

// Voix neuronale Piper si elle est prête, sinon voix du navigateur.
let lastEngine = "aucune lecture pour l'instant";

// Phrases enregistrées d'avance : texte → fichier, par langue (assets/voix/manifest.json).
let clipManifest = {};
const clipUrl = (text, lang) => clipManifest[lang]?.[text] && `assets/voix/${clipManifest[lang][text]}${VERSION}`;

async function loadClipManifest() {
  try {
    const response = await fetch(`assets/voix/manifest.json${VERSION}`);
    if (response.ok) clipManifest = await response.json();
  } catch { /* pas de phrases enregistrées : voix de synthèse */ }
  preloadLanguage(state.lang);
}

function preloadLanguage(lang) {
  const files = Object.keys(clipManifest[lang] || {}).map((text) => clipUrl(text, lang));
  if (files.length) voice.preloadClips(files);
}

function speak(text, lang = state.lang) {
  stopSpeaking();
  const url = clipUrl(text, lang);
  if (url) {
    lastEngine = `phrase enregistrée (${lang})`;
    updateVoiceStatus();
    voice.playClip(url, {
      onStart: () => setSpeaking(true),
      onLevel: (level) => { if (avatar) avatar.setLevel(level); },
      onEnd: () => {
        setSpeaking(false);
        if (avatar) avatar.setLevel(null);
      }
    }).then((handled) => {
      if (!handled) speakSynthesized(text, lang);
    });
    return;
  }
  speakSynthesized(text, lang);
}

// Voix de synthèse, pour une phrase qui n'a pas été enregistrée.
// La voix de femme de l'appareil passe en premier : elle démarre tout de suite.
// Piper, plus naturelle mais qui calcule toute la phrase avant de parler
// (1 à 3 s d'attente), ne sert que si l'appareil n'a aucune voix de femme.
function speakSynthesized(text, lang = state.lang) {
  const browserVoice = "speechSynthesis" in window && pickVoice(lang);
  if (!browserVoice && settings.neuralVoice && voice.isReady(lang)) {
    lastEngine = `voix neuronale Piper (${lang})`;
    updateVoiceStatus();
    voice.speak(text, lang, {
      rate: state.a11y ? 0.88 : 1,
      onStart: () => setSpeaking(true),
      onLevel: (level) => { if (avatar) avatar.setLevel(level); },
      onEnd: () => {
        setSpeaking(false);
        if (avatar) avatar.setLevel(null);
      }
    }).then((handled) => {
      if (!handled) speakWithBrowser(text, lang);
    });
    return;
  }
  speakWithBrowser(text, lang);
}

function speakWithBrowser(text, lang = state.lang) {
  if (!("speechSynthesis" in window)) {
    lastEngine = "aucune voix disponible sur cet appareil";
    updateVoiceStatus();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGS[lang].speech;
  const chosen = pickVoice(lang);
  if (!chosen) {
    // Aucune voix de femme sur cet appareil : la réponse reste affichée, sans voix d'homme.
    lastEngine = `aucune voix féminine disponible sur cet appareil (${lang}) — réponse affichée seulement`;
    updateVoiceStatus();
    return;
  }
  utterance.voice = chosen;
  lastEngine = `voix du navigateur : ${chosen.name} (${lang})`;
  updateVoiceStatus();
  utterance.rate = state.a11y ? 0.86 : 1;
  utterance.pitch = 1.05;
  utterance.onstart = () => setSpeaking(true);
  utterance.onend = () => setSpeaking(false);
  utterance.onerror = () => setSpeaking(false);
  utterance.onboundary = () => avatar && avatar.pulse();
  currentUtterance = utterance; // garde une référence : évite un arrêt prématuré sous Chrome
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  voice.stop();
  if (avatar) avatar.setLevel(null);
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  setSpeaking(false);
}

// --- Voix neuronale : téléchargement et état ------------------------------
const VOICE_LANG_NAMES = { fr: "Français", en: "Anglais", es: "Espagnol" };

function updateVoiceStatus() {
  if (!els.voiceStatus) return;
  const lines = ["fr", "en", "es"].map((lang) => {
    const name = VOICE_LANG_NAMES[lang];
    if (!voice.supports(lang)) return `${name} : voix du navigateur (pas de voix Piper féminine disponible)`;
    if (voice.isReady(lang)) return `${name} : voix neuronale prête`;
    if (voice.isDownloading(lang)) return `${name} : téléchargement en cours…`;
    return `${name} : voix neuronale non téléchargée`;
  });
  els.voiceStatus.textContent = lines.join(" · ") + ` — Dernière lecture : ${lastEngine}.`;
  els.voiceDownload.disabled = ["fr", "en"].every((lang) => voice.isReady(lang) || voice.isDownloading(lang));
}

async function downloadVoices(langs = ["fr", "en"]) {
  for (const lang of langs) {
    if (!settings.neuralVoice || !voice.supports(lang) || voice.isReady(lang)) continue;
    updateVoiceStatus();
    await voice.ensure(lang, () => updateVoiceStatus());
    updateVoiceStatus();
  }
}

async function initVoice() {
  try {
    await voice.init();
    updateVoiceStatus();
    // La voix Piper (≈ 70 Mo) ne sert plus que de secours : on ne la télécharge
    // d'office que si le site n'a pas de phrases enregistrées.
    await clipManifestReady;
    if (settings.neuralVoice && !Object.keys(clipManifest).length) await downloadVoices(["fr"]);
  } catch (error) {
    console.info("Voix neuronale indisponible :", error && error.message ? error.message : error);
    updateVoiceStatus();
  }
}

// À faire quand Jeanne a fini de parler (ex. ouvrir le micro après le bonjour).
// Annulé dès que le client touche l'écran : il a pris la main.
let afterSpeaking = null;

function setSpeaking(on) {
  state.speaking = on;
  if (avatar) avatar.setSpeaking(on);
  updateStatus();
  if (!on && afterSpeaking) {
    const next = afterSpeaking;
    afterSpeaking = null;
    next();
  }
}

// =====================================================================
// Micro (reconnaissance vocale du navigateur)
// =====================================================================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

// auto : micro ouvert par la borne (après le bonjour), pas par le client.
// Dans ce cas, un silence n'est pas une erreur : le micro se referme sans rien dire.
function toggleMic({ auto = false } = {}) {
  if (!SpeechRecognition) { if (!auto) reply(t().micUnsupported); return; }
  if (state.listening) { recognition && recognition.stop(); return; }

  afterSpeaking = null;
  stopSpeaking();
  const rec = new SpeechRecognition();
  rec.lang = LANGS[state.lang].speech;
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  let finalText = "";
  let interimText = "";
  let error = null;
  let settleTimer = null;

  // Répondre dès que la phrase est connue, sans attendre que le navigateur
  // ferme le micro (il ajoute souvent une demi-seconde, parfois plus).
  const finish = (text) => {
    clearTimeout(settleTimer);
    if (recognition !== rec) return;
    recognition = null;
    rec.abort();
    setListening(false);
    els.input.value = "";
    if (text) ask(text, "voice");
  };

  rec.onresult = (event) => {
    interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) finalText += result[0].transcript;
      else interimText += result[0].transcript;
    }
    els.input.value = (finalText + " " + interimText).trim();
    bump();
    if (finalText.trim() && !interimText.trim()) { finish(finalText.trim()); return; }
    // Certains navigateurs tardent à valider la phrase : si le texte ne bouge
    // plus pendant une seconde, le client a fini de parler.
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => finish((finalText + " " + interimText).trim()), 1000);
  };
  rec.onerror = (event) => { error = event.error; };
  rec.onend = () => {
    clearTimeout(settleTimer);
    if (recognition !== rec) return;
    recognition = null;
    setListening(false);
    const text = (finalText + " " + interimText).trim();
    els.input.value = "";
    if (text) ask(text, "voice");
    // Micro ouvert tout seul : en cas de silence ou de micro bloqué, on n'affiche rien.
    else if (auto) return;
    else if (error === "not-allowed" || error === "service-not-allowed") reply(t().micDenied);
    else if (error && error !== "aborted") reply(t().micError);
  };

  recognition = rec;
  setListening(true);
  try { rec.start(); } catch { recognition = null; setListening(false); if (!auto) reply(t().micError); }
}

function abortMic() {
  if (!recognition) return;
  const rec = recognition;
  recognition = null;
  rec.abort();
  setListening(false);
}

function setListening(on) {
  state.listening = on;
  els.mic.classList.toggle("is-listening", on);
  els.mic.setAttribute("aria-pressed", String(on));
  updateMic();
  updateStatus();
}

function updateMic() {
  els.micLabel.textContent = state.listening ? t().micListening : t().micIdle;
}

function updateStatus() {
  const key = state.listening ? "listening" : state.speaking ? "speaking" : "ready";
  els.status.dataset.state = key;
  els.statusText.textContent = t()["status" + key[0].toUpperCase() + key.slice(1)];
}

// =====================================================================
// Conversation
// =====================================================================
function appendToChat(node) {
  els.chat.append(node);
  while (els.chat.children.length > 40) els.chat.firstElementChild.remove();
  els.chat.scrollTo({ top: els.chat.scrollHeight, behavior: motionReduced() ? "auto" : "smooth" });
}

function addMessage(role, text) {
  const message = document.createElement("p");
  message.className = `msg msg-${role}`;
  message.textContent = text;
  appendToChat(message);
}

// Boutons de réponse dans la conversation (choix d'une question, sondage).
// choices : [{ label, onChoose }]. Un seul choix possible, ensuite les boutons se figent.
function addChoices(choices, { className = "", ariaLabel = "" } = {}) {
  const group = document.createElement("div");
  group.className = `msg-choices ${className}`.trim();
  group.setAttribute("role", "group");
  if (ariaLabel) group.setAttribute("aria-label", ariaLabel);
  for (const choice of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.textContent = choice.label;
    button.addEventListener("click", () => {
      if (group.classList.contains("is-done")) return;
      closeChoices();
      button.classList.add("is-chosen");
      choice.onChoose();
    });
    group.append(button);
  }
  appendToChat(group);
  return group;
}

function closeChoices() {
  state.clarify = null;
  $$(".msg-choices:not(.is-done)", els.chat).forEach((group) => {
    group.classList.add("is-done");
    group.querySelectorAll("button").forEach((b) => { b.disabled = true; });
  });
}

function noteVisit(text) {
  state.visit.count += 1;
  state.visit.last = text;
}

function reply(text, prefix = "") {
  addMessage("jeanne", prefix + text);
  speak(text);
}

function ask(text, source = "text") {
  afterSpeaking = null;
  abortMic();
  addMessage("user", text);
  bump();
  hideOtherStore();
  // Réponse à la question de Jeanne : « pour jouer », « Samsung », « l'iPad »…
  if (state.clarify) {
    const entry = state.clarify;
    const pending = state.clarifySource;
    closeChoices();
    const option = pickClarifyOption(text, entry);
    if (option) { chooseOption(option, pending); return; }
  }
  // Les questions pratiques passent avant les rayons : « les horaires » ou
  // « les toilettes » ne sont pas des produits.
  const info = findInfo(text);
  if (info) {
    noteVisit(text);
    recordQuestion({ text: null, zone: null, lang: state.lang, source });
    clearZone();
    reply(INFO[info].answer[state.lang]);
    return;
  }
  const match = findZoneDetailed(text, state.lang);
  // Demande vague (« un casque ») : Jeanne demande lequel au lieu de deviner.
  const clarify = findClarify(text, match);
  if (clarify) { noteVisit(text); askClarify(clarify, source); return; }
  const zone = match ? match.id : null;
  const intent = zone ? null : findIntent(text);
  // « bonjour » et « merci » ne sont pas des demandes : ils ne comptent pas pour le sondage.
  if (!intent) noteVisit(text);
  // Les « bonjour » / « merci » comptent comme questions, pas comme questions sans réponse.
  recordQuestion({ text: intent ? null : text, zone, lang: state.lang, source });
  if (zone) { answerZone(zone, match.fuzzy ? t().didYouMean(displayKeyword(match.keyword)) : "", match.place); return; }
  if (intent) {
    reply(t()[intent]);
    if (intent === "thanks") {
      signLSF("merci");
      // « Merci » arrive souvent en fin de visite : c'est le moment du sondage.
      offerSurvey();
    }
    return;
  }
  clearZone();
  reply(t().notFound);
}

const zoneLabel = (id) => ZONES[id].label[state.lang];

function askClarify(entry, source) {
  clearZone();
  reply(entry.question[state.lang]);
  addChoices(entry.options.map((option) => ({
    label: option.label[state.lang],
    onChoose: () => {
      addMessage("user", option.label[state.lang]);
      chooseOption(option, source);
    }
  })), { className: "is-options", ariaLabel: t().choose });
  // Posé après addChoices, qui remet la question en attente à zéro.
  state.clarify = entry;
  state.clarifySource = source;
}

function chooseOption(option, source) {
  recordQuestion({ zone: option.zone, lang: state.lang, source });
  answerZone(option.zone, "", option.place || null);
}

// =====================================================================
// Sondage de fin de visite : « Avez-vous trouvé ce que vous cherchiez ? »
// Dans la conversation après un « merci », ou en fenêtre quand on touche
// « Terminer ». Une seule réponse par visite, et seulement si le client
// a demandé quelque chose. Résultats : réglages du personnel (5 touches sur le logo).
// =====================================================================
function answerSurvey(found) {
  state.visit.surveyed = true;
  recordFeedback({ found, question: state.visit.last, zone: state.zone });
}

function offerSurvey() {
  if (!state.visit.count || state.visit.surveyed) return;
  addMessage("jeanne", t().surveyAsk);
  addChoices([
    { label: "👍 " + t().surveyYes, onChoose: () => { answerSurvey(true); reply(t().surveyThanksYes); } },
    { label: "👎 " + t().surveyNo, onChoose: () => { answerSurvey(false); reply(t().surveyThanksNo); } }
  ], { className: "is-survey", ariaLabel: t().surveyAsk });
}

let surveyTimer = null;
function endVisit() {
  if (!state.visit.count || state.visit.surveyed) { exitToIdle(); return; }
  closeWarning();
  clearTimeout(inactivityTimer);
  els.surveyTitle.textContent = t().surveyAsk;
  els.surveyButtons.hidden = false;
  els.survey.showModal();
  speak(t().surveyAsk);
  // Personne ne répond : retour à l'accueil sans rien compter.
  clearTimeout(surveyTimer);
  surveyTimer = setTimeout(exitToIdle, 20000);
}

function closeSurvey() {
  clearTimeout(surveyTimer);
  if (els.survey.open) els.survey.close();
}

function handleSurveyChoice(choice) {
  clearTimeout(surveyTimer);
  if (choice === "skip") { exitToIdle(); return; }
  answerSurvey(choice === "yes");
  if (choice === "yes") {
    els.surveyTitle.textContent = t().surveyThanksYes;
    els.surveyButtons.hidden = true;
    speak(t().surveyThanksYes);
    surveyTimer = setTimeout(exitToIdle, 3200);
  } else {
    // Pas trouvé : on reste sur la page, Jeanne propose un vendeur.
    closeSurvey();
    reply(t().surveyThanksNo);
    bump();
  }
}

function answerZone(id, prefix = "", place = null) {
  if (ZONES[id].external) {
    showOtherStore();
    reply(t().otherStore, prefix);
    return;
  }
  showZone(id, place);
  if (id === "escalier") reply(t().foundStairs, prefix);
  else if (id === "entree") reply(t().foundEntrance, prefix);
  else reply(t().found(zoneLabel(id), ZONES[id].floors[0]), prefix);
}

// =====================================================================
// Plan du magasin
// =====================================================================
const SVG_NS = "http://www.w3.org/2000/svg";
let floorTimer = null;

// --- Plan du sous-sol : les vraies gondoles (js/plan.js) -------------------
// Chaque meuble appartient à un rayon, et parfois à un emplacement précis
// du rayon ; le plus précis (le moins de meubles) l'emporte.
const SPOT_OWNER = new Map();
for (const [id, zone] of Object.entries(ZONES)) {
  for (const spot of zone.spots || []) SPOT_OWNER.set(spot, { zone: id, place: null, size: Infinity });
  for (const [place, entry] of Object.entries(zone.places || {})) {
    for (const spot of entry.spots) {
      const current = SPOT_OWNER.get(spot);
      if (!current || entry.spots.length < current.size) SPOT_OWNER.set(spot, { zone: id, place, size: entry.spots.length });
    }
  }
}

function svgEl(tag, attrs, parent) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  parent.append(el);
  return el;
}

// Les deux plans : identifiant du SVG → géométrie.
const PLANS = [["#groundPlan", GROUND], ["#basementPlan", BASEMENT]];

function buildPlan(svg, plan) {
  svg.textContent = "";
  svgEl("path", { d: plan.outline, class: "bm-floor" }, svg);
  // Escaliers : volée droite et/ou courbe, avec les marches et la flèche de descente.
  const stairs = svgEl("g", { class: "bm-stairs", "data-zone": "escalier" }, svg);
  for (const piece of stairsDrawing(plan)) {
    svgEl("path", { d: piece.band, class: "bm-stairs-band" }, stairs);
    for (const [x1, y1, x2, y2] of piece.lines) svgEl("line", { x1, y1, x2, y2 }, stairs);
    if (piece.arrow) {
      const { x, y, heading } = piece.arrow;
      svgEl("path", { d: "M-6 -5 L6 0 L-6 5 Z", class: "bm-stairs-arrow", transform: `translate(${x} ${y}) rotate(${heading})` }, stairs);
    }
  }
  for (const shape of plan.shapes) {
    const { cx, cy, w, h, rot } = box(shape);
    const owner = SPOT_OWNER.get(shape.id);
    const attrs = {
      x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: shape.kind === "mural" ? 1 : 2,
      class: `bm-shape bm-${shape.kind}`, "data-spot": shape.id
    };
    if (rot) attrs.transform = `rotate(${rot.toFixed(2)} ${cx} ${cy})`;
    if (owner) {
      attrs["data-zone"] = owner.zone;
      if (owner.place) attrs["data-place"] = owner.place;
    }
    svgEl("rect", attrs, svg);
  }
  svgEl("g", { class: "bm-labels" }, svg);
  svgEl("g", { class: "route-layer" }, svg);
  if (plan.here) {
    const [x, y] = plan.here;
    const here = svgEl("g", { class: "bm-here", transform: `translate(${x} ${y})` }, svg);
    svgEl("circle", { r: 9, class: "bm-here-pulse" }, here);
    svgEl("circle", { r: 5.5, class: "bm-here-dot" }, here);
    svgEl("text", { x: 11, y: 4, class: "bm-here-text" }, here);
  }
}

function buildPlans() {
  for (const [selector, plan] of PLANS) {
    const svg = $(selector);
    if (svg) buildPlan(svg, plan);
  }
}

function renderPlanLabels() {
  for (const [selector, plan] of PLANS) {
    const layer = $(`${selector} .bm-labels`);
    if (!layer) continue;
    layer.textContent = "";
    for (const [key, [x, y, anchor = "middle", rotate = 0, text = "short"]] of Object.entries(plan.labels)) {
      const [zoneId, placeId] = key.split(".");
      const entry = placeId ? ZONES[zoneId]?.places?.[placeId] : ZONES[zoneId];
      if (!entry) continue;
      const attrs = { x, y, "text-anchor": anchor, class: "bm-label", "data-zone": zoneId };
      if (placeId) attrs["data-place"] = placeId;
      if (rotate) attrs.transform = `rotate(${rotate} ${x} ${y})`;
      const label = svgEl("text", attrs, layer);
      // "full" : nom complet, « · » devient un retour à la ligne (escalier du rez-de-chaussée).
      const source = text === "full" ? entry.label[state.lang].replace(" · ", "\n") : (entry.short || entry.label)[state.lang];
      const lines = source.split("\n");
      lines.forEach((line, i) => {
        svgEl("tspan", { x, dy: i === 0 ? `${-(lines.length - 1) * 0.55}em` : "1.1em" }, label).textContent = line;
      });
    }
    const hereText = $(`${selector} .bm-here-text`);
    if (hereText) hereText.textContent = t().youAreHere;
  }
}

// Meubles à allumer : ceux de l'emplacement précis, sinon tout le rayon.
function targetSpots(id, place) {
  const zone = ZONES[id];
  if (!zone) return [];
  return (place && zone.places?.[place]?.spots) || zone.spots || [];
}

function renderTiles() {
  renderPlanLabels();
  $$(".tile").forEach((tile) => {
    const zone = ZONES[tile.dataset.zone];
    // Sécurité : une case sans rayon connu (fichiers dépareillés) est ignorée
    // au lieu de bloquer toute la borne.
    if (!zone) {
      console.warn("Rayon inconnu sur le plan :", tile.dataset.zone);
      tile.hidden = true;
      return;
    }
    tile.hidden = false;
    const detail = zone.detail[state.lang];
    tile.innerHTML = `<svg class="tile-icon" aria-hidden="true"><use href="#i-${zone.icon}"/></svg><span class="tile-text"><span class="tile-name"></span>${detail ? '<span class="tile-detail"></span>' : ""}</span>`;
    tile.querySelector(".tile-name").textContent = zone.label[state.lang];
    if (detail) tile.querySelector(".tile-detail").textContent = detail;
  });
}

function setFloor(floor) {
  if (floor === state.floor) return;
  els.mapStage.dataset.dir = floor === "-1" ? "down" : "up";
  state.floor = floor;
  $$(".floor").forEach((el) => {
    const active = el.dataset.floor === floor;
    el.classList.toggle("is-active", active);
    el.inert = !active;
  });
  $$("#floorTabs [role=tab]").forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.floor === floor)));
  if (state.zone) scheduleRouteDraw(true);
}

// --- Tracé animé : Vous êtes ici → escalier → rayon ---------------------
let routeDrawTimer = null;
let routeAnimation = null;

function routePoints(floor, id) {
  const zone = ZONES[id];
  if (!zone || id === "entree") return null;
  // Les deux plans sont en coordonnées d'architecte : le tracé est dessiné dans le même SVG.
  if (floor === "0") {
    const points = routeGround(id, zone.floors);
    return points ? points.map(([x, y]) => ({ x, y })) : null;
  }
  if (id === "escalier" || !zone.floors.includes("-1")) return null;
  const spots = targetSpots(id, state.place);
  const points = spots.length ? routeTo(spots[0]) : null;
  return points ? points.map(([x, y]) => ({ x, y })) : null;
}

function clearRoutes() {
  clearTimeout(routeDrawTimer);
  if (routeAnimation) cancelAnimationFrame(routeAnimation);
  routeAnimation = null;
  $$(".route-layer").forEach((layer) => { layer.textContent = ""; });
}

function scheduleRouteDraw(animate) {
  clearTimeout(routeDrawTimer);
  routeDrawTimer = setTimeout(() => drawRoute(animate), 380);
}

function drawRoute(animate) {
  clearRoutes();
  if (!state.zone) return;
  const points = routePoints(state.floor, state.zone);
  if (!points) return;
  const layer = $(`.floor[data-floor="${state.floor}"] .route-layer`);
  const d = points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const make = (tag, attrs) => {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    layer.append(el);
    return el;
  };
  const casing = make("path", { d, class: "route-casing" });
  const line = make("path", { d, class: "route-line" });
  const start = points[0];
  const end = points[points.length - 1];
  const unit = state.floor === "-1" ? 0.6 : 0.42;
  make("circle", { cx: start.x, cy: start.y, r: 7 * unit, class: "route-start" });
  const endDot = make("circle", { cx: end.x, cy: end.y, r: 11 * unit, class: "route-end" });

  const length = line.getTotalLength();
  const animated = animate && !motionReduced();
  if (animated) {
    for (const path of [casing, line]) {
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    }
    endDot.style.opacity = "0";
    layer.getBoundingClientRect();
    for (const path of [casing, line]) {
      path.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
      path.style.strokeDashoffset = "0";
    }
    setTimeout(() => { endDot.style.transition = "opacity 0.3s ease"; endDot.style.opacity = "1"; }, 900);
  }
  if (motionReduced()) return;

  // Petit point jaune qui parcourt l'itinéraire en boucle.
  const walker = make("circle", { r: 6 * unit, class: "route-walker" });
  const t0 = performance.now() + (animated ? 1200 : 0);
  const tick = (now) => {
    const progress = Math.max(0, now - t0) % 2400 / 2400;
    const p = line.getPointAtLength(progress * length);
    walker.setAttribute("cx", p.x);
    walker.setAttribute("cy", p.y);
    routeAnimation = requestAnimationFrame(tick);
  };
  routeAnimation = requestAnimationFrame(tick);
}

// Produit vendu dans l'autre Fnac : carte avec l'adresse par-dessus le plan.
function showOtherStore() {
  clearZone();
  els.otherStoreAddress.textContent = "";
  OTHER_STORE.address.forEach((line, i) => {
    if (i) els.otherStoreAddress.append(document.createElement("br"));
    els.otherStoreAddress.append(line);
  });
  els.otherStore.hidden = false;
  els.mapStage.classList.add("is-elsewhere");
}

function hideOtherStore() {
  els.otherStore.hidden = true;
  els.mapStage.classList.remove("is-elsewhere");
}

function showZone(id, place = null) {
  hideOtherStore();
  clearTimeout(floorTimer);
  state.zone = id;
  state.place = place && ZONES[id]?.places?.[place] ? place : null;
  const zone = ZONES[id];
  const basementOnly = !zone.floors.includes("0");

  $$(".tile").forEach((tile) => tile.classList.toggle("is-hit", tile.dataset.zone === id));
  const zoneSpots = new Set(zone.spots || []);
  const hitSpots = new Set(targetSpots(id, state.place));
  $$(".plan-svg .bm-shape").forEach((el) => {
    const spot = el.dataset.spot;
    el.classList.toggle("is-hit", hitSpots.has(spot));
    el.classList.toggle("is-zone", zoneSpots.has(spot) && !hitSpots.has(spot));
  });
  $$(".plan-svg .bm-label").forEach((el) => el.classList.toggle("is-hit",
    el.dataset.zone === id && (!el.dataset.place || el.dataset.place === state.place)));
  $$(".plan-svg .bm-stairs").forEach((el) => el.classList.toggle("is-hit", id === "escalier"));
  // Rayon du sous-sol : à l'étage 0, c'est l'escalier qui s'allume.
  $$("#groundPlan .bm-stairs").forEach((el) => el.classList.toggle("is-route", basementOnly));
  $$('.plan-0 .tile[data-zone="escalier"]').forEach((tile) => tile.classList.toggle("is-route", basementOnly));
  els.mapStage.classList.add("has-focus");
  renderRoute();
  scheduleRouteDraw(true);
  if (avatar && state.screen === "app") avatar.glance();

  if (basementOnly) {
    // Parcours guidé : on montre d'abord l'escalier à l'étage 0, puis le rayon au sous-sol.
    if (state.floor === "0") floorTimer = setTimeout(() => setFloor("-1"), motionReduced() ? 400 : 1600);
  } else if (!zone.floors.includes(state.floor)) {
    setFloor(zone.floors[0]);
  }
}

function clearZone() {
  clearTimeout(floorTimer);
  state.zone = null;
  state.place = null;
  $$(".tile").forEach((tile) => tile.classList.remove("is-hit", "is-route"));
  $$(".plan-svg .is-hit, .plan-svg .is-zone, .plan-svg .is-route").forEach((el) => el.classList.remove("is-hit", "is-zone", "is-route"));
  els.mapStage.classList.remove("has-focus");
  renderRoute();
  clearRoutes();
}

function renderRoute() {
  const id = state.zone;
  const showRoute = id && id !== "entree";
  els.route.hidden = !showRoute;
  els.routeHint.hidden = !!showRoute;
  if (!showRoute) return;
  const zone = ZONES[id];
  els.routeStairs.hidden = zone.floors.includes("0");
  const place = state.place && zone.places?.[state.place];
  els.routeTarget.textContent = (place || zone).label[state.lang];
  els.routeIcon.setAttribute("href", `#i-${zone.icon}`);
}

// =====================================================================
// Suggestions, langue, accessibilité, vendeur
// =====================================================================
function renderSuggestions() {
  els.chips.textContent = "";
  for (const suggestion of SUGGESTIONS) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.innerHTML = `<svg aria-hidden="true"><use href="#i-${suggestion.icon}"/></svg><span></span>`;
    chip.querySelector("span").textContent = suggestion.label[state.lang];
    chip.addEventListener("click", () => {
      closeChoices();
      noteVisit(suggestion.label[state.lang]);
      addMessage("user", suggestion.label[state.lang]);
      recordQuestion({ zone: suggestion.zone, lang: state.lang, source: "chip" });
      answerZone(suggestion.zone);
    });
    els.chips.append(chip);
  }
}

function applyLang() {
  const d = t();
  document.documentElement.lang = state.lang;
  $$("#appScreen [data-i18n], dialog [data-i18n]").forEach((el) => {
    const value = d[el.dataset.i18n];
    if (typeof value === "string") el.textContent = value;
  });
  els.input.placeholder = d.placeholder;
  els.send.setAttribute("aria-label", d.send);
  $$("#langSwitch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));
  renderTiles();
  renderSuggestions();
  renderRoute();
  updateMic();
  updateStatus();
}

function setLang(lang) {
  if (lang === state.lang) return;
  abortMic();
  state.lang = lang;
  closeChoices();
  applyLang();
  preloadLanguage(lang);
  if (settings.neuralVoice && !clipManifest[lang] && voice.supports(lang) && !voice.isReady(lang)) downloadVoices([lang]);
  reply(t().switched);
}

function toggleA11y(force) {
  state.a11y = typeof force === "boolean" ? force : !state.a11y;
  document.documentElement.classList.toggle("a11y", state.a11y);
  els.a11y.setAttribute("aria-pressed", String(state.a11y));
  if (avatar) avatar.setReducedMotion(motionReduced());
  requestAnimationFrame(() => placeAvatar());
}

function callVendor() {
  const label = state.zone && !["entree", "escalier"].includes(state.zone) ? zoneLabel(state.zone) : null;
  reply(t().vendorConfirm(label));
  showToast(t().vendorToast(label));
}

let toastTimer = null;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("is-on"), 4200);
}

// =====================================================================
// Écran de veille ⇄ page principale
// =====================================================================
// Déroulé de l'écran de veille : accueil FR → EN → ES → une actualité → accueil FR…
const IDLE_ORDER = ["fr", "en", "es"];
const GREETING_MS = 5200;
const NEWS_MS = 8500;
let idleStep = 0;
let newsIndex = 0;
let greetings = 0;
let idleCycle = null;

function setIdleLang(lang) {
  const d = UI[lang];
  $$("#idleScreen [data-i18n]").forEach((el) => { el.textContent = d[el.dataset.i18n]; });
  $$(".idle-langs li").forEach((li) => li.classList.toggle("is-on", li.dataset.lang === lang));
}

function showGreeting(lang) {
  els.idleNews.hidden = true;
  els.idleGreet.hidden = false;
  setIdleLang(lang);
}

function showNews(item) {
  setIdleLang("fr");
  els.idleNewsTitle.textContent = item.title;
  els.idleNewsText.textContent = item.text;
  els.idleNewsDate.textContent = item.date;
  els.idleNewsExample.hidden = !item.example;
  els.idleNewsImage.hidden = !item.image;
  if (item.image) {
    els.idleNewsImage.onerror = () => { els.idleNewsImage.hidden = true; };
    els.idleNewsImage.src = item.image;
  } else {
    els.idleNewsImage.removeAttribute("src");
  }
  els.idleGreet.hidden = true;
  els.idleNews.hidden = false;
}

function startIdleCycle() {
  clearTimeout(idleCycle);
  idleStep = 0;
  showGreeting("fr");
  const steps = IDLE_ORDER.length + (NEWS.length ? 1 : 0);
  const next = () => {
    idleStep = (idleStep + 1) % steps;
    els.idle.classList.add("is-swapping");
    setTimeout(() => {
      const isNews = idleStep === IDLE_ORDER.length;
      if (isNews) showNews(NEWS[newsIndex++ % NEWS.length]);
      else showGreeting(IDLE_ORDER[idleStep]);
      els.idle.classList.remove("is-swapping");
      // Un tour sur deux : « Bonjour » en langue des signes plutôt qu'un signe de la main.
      if (idleStep === 0 && avatar) {
        greetings += 1;
        if (greetings % 2 !== 0 || !signLSF("bonjour")) avatar.wave();
      }
      idleCycle = setTimeout(next, isNews ? NEWS_MS : GREETING_MS);
    }, 420);
  };
  idleCycle = setTimeout(next, GREETING_MS);
}

// expand > 1 : agrandit temporairement la scène 3D autour de son emplacement
// (utile pour qu'un signe en LSF reste visible sur la page principale).
function placeAvatar(expand = 1) {
  const slot = state.screen === "app" ? els.dockSlot : els.idleSlot;
  const r = slot.getBoundingClientRect();
  const width = r.width * expand;
  const height = r.height * expand;
  const margin = 8;
  // La scène grandit vers le bas et la droite pour ne pas sortir du panneau.
  const left = Math.max(margin, Math.min(window.innerWidth - width - margin, r.left));
  const top = Math.max(margin, Math.min(window.innerHeight - height - margin, r.top));
  const s = els.stageEl.style;
  s.left = left + "px";
  s.top = top + "px";
  s.width = width + "px";
  s.height = height + "px";
}

// Signe en langue des signes. Sur la page principale, la scène s'agrandit
// le temps du geste pour que la main soit visible.
let signTimer = null;
function signLSF(name) {
  if (!avatar) return false;
  const duration = avatar.sign(name);
  if (!duration) return false;
  if (state.screen === "app") {
    clearTimeout(signTimer);
    document.body.classList.add("is-signing");
    placeAvatar(1.95);
    signTimer = setTimeout(() => {
      document.body.classList.remove("is-signing");
      placeAvatar();
    }, duration);
  }
  return true;
}

function enterApp() {
  if (state.screen === "app") return;
  state.screen = "app";
  clearTimeout(idleCycle);
  recordSession();
  document.body.classList.replace("is-idle", "is-app");
  els.idle.inert = true;
  els.app.inert = false;
  if (els.idleVideo && els.idleVideo.isConnected && !els.idleVideo.hidden) els.idleVideo.pause();
  state.lang = "fr";
  state.visit = { count: 0, last: null, surveyed: false };
  applyLang();
  placeAvatar();
  if (avatar) avatar.setFraming("docked");
  els.chat.textContent = "";
  setTimeout(() => {
    // Le message complet s'affiche, mais Jeanne dit seulement « Bonjour ! Quel
    // produit cherchez-vous ? », puis ouvre le micro : le client n'a pas besoin
    // de toucher « Appuyez pour parler ».
    addMessage("jeanne", t().greeting);
    speak(t().hello);
    if (avatar) avatar.wave();
    if (state.screen !== "app") return;
    let opened = false;
    const listen = () => {
      if (opened || state.screen !== "app" || state.listening || state.speaking) return;
      opened = true;
      toggleMic({ auto: true });
    };
    afterSpeaking = listen;
    // Si aucune voix ne se lance (appareil sans son), le micro s'ouvre quand même.
    setTimeout(() => { if (!state.speaking && afterSpeaking === listen) { afterSpeaking = null; listen(); } }, 2500);
  }, 450);
  bump();
}

function exitToIdle() {
  afterSpeaking = null;
  closeWarning();
  closeSurvey();
  closeChoices();
  clearTimeout(inactivityTimer);
  abortMic();
  stopSpeaking();
  state.screen = "idle";
  document.body.classList.replace("is-app", "is-idle");
  els.app.inert = true;
  els.idle.inert = false;
  els.input.value = "";
  clearZone();
  hideOtherStore();
  setFloor("0");
  if (state.a11y) toggleA11y(false);
  placeAvatar();
  if (avatar) avatar.setFraming("hero");
  if (els.idleVideo && els.idleVideo.isConnected && !els.idleVideo.hidden) els.idleVideo.play().catch(() => {});
  startIdleCycle();
  setTimeout(() => { els.chat.textContent = ""; }, 600);
}

// --- Inactivité ----------------------------------------------------------
let inactivityTimer = null;
let warningTimer = null;

function bump() {
  if (state.screen !== "app") return;
  clearTimeout(inactivityTimer);
  if (els.warning.open) closeWarning();
  inactivityTimer = setTimeout(checkInactivity, settings.idleSeconds * 1000);
}

function checkInactivity() {
  if (state.speaking || state.listening) { bump(); return; }
  if (els.survey.open) return;
  let left = WARNING_SECONDS;
  const render = () => { els.warningBody.textContent = t().idleWarnBody(left); };
  render();
  els.warning.showModal();
  warningTimer = setInterval(() => {
    left -= 1;
    if (left <= 0) exitToIdle();
    else render();
  }, 1000);
}

function closeWarning() {
  clearInterval(warningTimer);
  if (els.warning.open) els.warning.close();
}

// --- Réglages du personnel -----------------------------------------------
let logoTaps = [];

function fillVoiceSettings() {
  $$("select[data-voice]").forEach((select) => {
    const lang = select.dataset.voice;
    const prefix = LANGS[lang].speech.slice(0, 2).toLowerCase();
    select.textContent = "";
    select.append(new Option("Automatique (voix féminine)", ""));
    // Le personnel ne peut choisir qu'une voix de femme.
    voices
      .filter((v) => (v.lang || "").toLowerCase().startsWith(prefix) && isFemaleVoice(v, lang))
      .forEach((v) => select.append(new Option(`${v.name} (${v.lang})`, v.voiceURI)));
    select.value = settings.voices[lang] || "";
  });
}

// --- Statistiques (réglages du personnel) ---------------------------------
let resetArmed = null;

function fillStatsList(list, rows, emptyText) {
  list.textContent = "";
  if (!rows.length) {
    const li = document.createElement("li");
    li.className = "is-empty";
    li.textContent = emptyText;
    list.append(li);
    return;
  }
  for (const [label, count] of rows) {
    const li = document.createElement("li");
    const name = document.createElement("span");
    const value = document.createElement("b");
    name.textContent = label;
    value.textContent = count;
    li.append(name, value);
    list.append(li);
  }
}

function renderStats() {
  const s = readStats();
  const n = (obj, key) => obj[key] || 0;
  const since = new Date(s.since).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  els.statsSummary.textContent =
    `Depuis le ${since} : ${s.sessions} visite${s.sessions > 1 ? "s" : ""}, ${s.questions} question${s.questions > 1 ? "s" : ""}. ` +
    `Langues : FR ${n(s.byLang, "fr")} · EN ${n(s.byLang, "en")} · ES ${n(s.byLang, "es")}. ` +
    `Par : micro ${n(s.bySource, "voice")} · clavier ${n(s.bySource, "text")} · recherches fréquentes ${n(s.bySource, "chip")} · plan ${n(s.bySource, "map")}.`;
  const zones = Object.entries(s.byZone).sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([id, count]) => [ZONES[id] ? ZONES[id].label.fr : id, count]);
  const misses = Object.entries(s.misses).sort((a, b) => b[1] - a[1]).slice(0, 15);
  fillStatsList(els.statsZones, zones, "Aucune recherche pour l'instant");
  fillStatsList(els.statsMisses, misses, "Aucune question sans réponse");
  // Sondage de fin de visite
  const yes = s.feedback.yes;
  const no = s.feedback.no;
  const answers = yes + no;
  els.statsSatisfaction.textContent = answers
    ? `${Math.round((yes / answers) * 100)} % de clients satisfaits : ${yes} ont trouvé 👍, ${no} n'ont pas trouvé 👎 (${answers} réponse${answers > 1 ? "s" : ""} au sondage).`
    : "Personne n'a encore répondu au sondage de fin de visite.";
  const unhappy = Object.entries(s.unhappy).sort((a, b) => b[1] - a[1]).slice(0, 15);
  fillStatsList(els.statsUnhappy, unhappy, "Aucun client mécontent pour l'instant");
}

function handleStatsReset() {
  if (!resetArmed) {
    els.statsReset.textContent = "Toucher encore pour confirmer";
    els.statsReset.classList.add("is-armed");
    resetArmed = setTimeout(disarmReset, 4000);
    return;
  }
  resetStats();
  disarmReset();
  renderStats();
}

function disarmReset() {
  clearTimeout(resetArmed);
  resetArmed = null;
  els.statsReset.textContent = "Remettre les statistiques à zéro";
  els.statsReset.classList.remove("is-armed");
}

// =====================================================================
// Avatar 3D (chargé à part : si la 3D échoue, la borne fonctionne quand même)
// =====================================================================
let avatar = null;

async function initAvatar() {
  placeAvatar();
  try {
    const { createAvatar } = await import("./avatar.js" + VERSION);
    const optionsFor = (file) => ({
      reducedMotion: motionReduced(),
      shirtLogo: "assets/fnac-logo.svg",
      look: file === FALLBACK_AVATAR ? PLACEHOLDER_LOOK : null
    });
    const file = avatarFile();
    try {
      avatar = await createAvatar(els.canvas, file, optionsFor(file));
    } catch (error) {
      if (file === FALLBACK_AVATAR) throw error;
      console.warn(`Avatar « ${file} » indisponible, avatar d'essai utilisé :`, error);
      avatar = await createAvatar(els.canvas, FALLBACK_AVATAR, optionsFor(FALLBACK_AVATAR));
    }
    avatar.setFraming(state.screen === "app" ? "docked" : "hero");
    avatar.setSpeaking(state.speaking);
    els.stageEl.classList.add("is-ready");
    setTimeout(() => avatar.wave(), 900);
  } catch (error) {
    console.warn("Avatar 3D indisponible :", error);
    els.stageEl.classList.add("has-fallback");
  }
}

// =====================================================================
// Événements
// =====================================================================
els.idle.tabIndex = 0;
els.idle.addEventListener("click", enterApp);
els.idle.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enterApp(); } });

els.mic.addEventListener("click", () => toggleMic());
// Le client touche l'écran pendant que Jeanne parle : il prend la main, la borne n'ouvre pas le micro toute seule.
document.addEventListener("pointerdown", () => { if (state.screen === "app") afterSpeaking = null; }, { capture: true });
els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = els.input.value.trim();
  if (!text) return;
  els.input.value = "";
  ask(text);
});
els.vendor.addEventListener("click", callVendor);
els.otherStoreClose.addEventListener("click", hideOtherStore);
els.a11y.addEventListener("click", () => {
  toggleA11y();
  reply(state.a11y ? t().a11yOn : t().a11yOff);
});
els.end.addEventListener("click", endVisit);
els.surveyButtons.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-answer]");
  if (button) handleSurveyChoice(button.dataset.answer);
});
els.survey.addEventListener("cancel", (e) => { e.preventDefault(); handleSurveyChoice("skip"); });

$("#langSwitch").addEventListener("click", (e) => {
  const button = e.target.closest("button[data-lang]");
  if (button) setLang(button.dataset.lang);
});
$("#floorTabs").addEventListener("click", (e) => {
  const tab = e.target.closest("[data-floor]");
  if (!tab) return;
  clearTimeout(floorTimer);
  hideOtherStore();
  setFloor(tab.dataset.floor);
});
els.mapStage.addEventListener("click", (e) => {
  const target = e.target.closest(".tile[data-zone], .plan-svg [data-zone]");
  if (!target) return;
  closeChoices();
  noteVisit(ZONES[target.dataset.zone] ? zoneLabel(target.dataset.zone) : target.dataset.zone);
  recordQuestion({ zone: target.dataset.zone, lang: state.lang, source: "map" });
  answerZone(target.dataset.zone, "", target.dataset.place || null);
});

els.warningButton.addEventListener("click", bump);
["pointerdown", "keydown", "input"].forEach((type) => document.addEventListener(type, bump, { capture: true, passive: true }));

els.logo.addEventListener("click", () => {
  const now = Date.now();
  logoTaps = logoTaps.filter((time) => now - time < 3000);
  logoTaps.push(now);
  if (logoTaps.length >= 5) {
    logoTaps = [];
    fillVoiceSettings();
    renderStats();
    els.neuralToggle.checked = settings.neuralVoice;
    updateVoiceStatus();
    els.idleSeconds.value = settings.idleSeconds;
    els.settings.showModal();
  }
});
els.settings.addEventListener("change", (e) => {
  if (e.target.matches("select[data-voice]")) {
    settings.voices[e.target.dataset.voice] = e.target.value || undefined;
    store.set("voices", settings.voices);
  }
  if (e.target === els.neuralToggle) {
    settings.neuralVoice = els.neuralToggle.checked;
    store.set("neuralVoice", settings.neuralVoice);
    updateVoiceStatus();
  }
  if (e.target === els.idleSeconds) {
    settings.idleSeconds = Math.min(600, Math.max(20, Number(els.idleSeconds.value) || 60));
    els.idleSeconds.value = settings.idleSeconds;
    store.set("idleSeconds", settings.idleSeconds);
  }
});
els.testVoice.addEventListener("click", () => speak(t().hello));
els.statsReset.addEventListener("click", handleStatsReset);
els.voiceDownload.addEventListener("click", () => downloadVoices());

let resizeTimer = null;
window.addEventListener("resize", () => {
  placeAvatar();
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (state.zone) drawRoute(false); }, 200);
});
if ("speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
}

// --- Démarrage ---
buildPlans();
const clipManifestReady = loadClipManifest();
els.app.inert = true;
$$(".floor").forEach((el) => { el.inert = !el.classList.contains("is-active"); });
applyLang();
startIdleCycle();
// Vidéo de Jeanne en boucle : utilisée si le fichier existe, sinon la photo.
if (IDLE_VISUAL === "3d") {
  // L'avatar 3D occupe l'écran de veille : ni photo ni vidéo à charger.
  els.idleVideo.remove();
  els.idlePhoto.remove();
} else if (IDLE_VISUAL !== "video") {
  els.idleVideo.remove();
}

// En mode vidéo, la photo ne sert que de secours : on ne l'affiche pas tout
// de suite, sinon elle apparaît une seconde puis saute quand la vidéo démarre.
// Son image d'attente (poster) couvre déjà le temps de chargement.
let photoIsBackup = IDLE_VISUAL === "video" && els.idleVideo.isConnected;
let photoReady = false;

function useIdleVideo() {
  els.idleVideo.hidden = false;
  document.body.classList.add("has-idle-video");
  photoIsBackup = false;
  els.idleVideo.play().catch(() => { /* lecture refusée : l'image d'attente reste */ });
}
function fallbackToPhoto() {
  els.idleVideo.remove();
  document.body.classList.remove("has-idle-video");
  photoIsBackup = false;
  if (photoReady) useIdlePhoto();
}
if (els.idleVideo.isConnected) {
  els.idleVideo.addEventListener("canplay", useIdleVideo, { once: true });
  els.idleVideo.addEventListener("error", fallbackToPhoto);
  // Si la vidéo n'est toujours pas prête (fichier absent, connexion très
  // lente), la photo reprend la main. Délai large : le fichier fait 6 Mo.
  setTimeout(() => { if (photoIsBackup) fallbackToPhoto(); }, 15000);
  els.idleVideo.src = els.idleVideo.dataset.src;
}

// Photo de Jeanne sur l'écran de veille : utilisée seulement si le fichier existe.
function useIdlePhoto() {
  photoReady = true;
  if (photoIsBackup) return;
  els.idlePhoto.hidden = false;
  document.body.classList.add("has-idle-photo");
}
if (els.idlePhoto.isConnected) {
  els.idlePhoto.addEventListener("load", useIdlePhoto);
  els.idlePhoto.addEventListener("error", () => { els.idlePhoto.remove(); });
  els.idlePhoto.src = els.idlePhoto.dataset.src;
  // L'image peut déjà être en cache : dans ce cas "load" ne se déclenche pas.
  if (els.idlePhoto.complete && els.idlePhoto.naturalWidth > 0) useIdlePhoto();
}

document.fonts.ready.then(() => placeAvatar());
initAvatar();
initVoice();

// Aide au réglage : ouvrir la borne avec ?debug pour déclencher les gestes à la main
// depuis la console du navigateur (jeanne.sign(), jeanne.wave(), jeanne.glance()).
if (new URLSearchParams(location.search).has("debug")) {
  window.jeanne = {
    pose: (values) => avatar && avatar.setOverride(values),
    state: () => avatar && avatar.debugState(),
    sign: (name) => signLSF(name || "bonjour"),
    wave: () => avatar && avatar.wave(),
    glance: () => avatar && avatar.glance()
  };
}
