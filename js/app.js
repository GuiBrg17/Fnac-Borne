// =====================================================================
// Borne Jeanne — logique de l'interface
// =====================================================================
// La version (?v=N de index.html) est reportée sur chaque fichier :
// une mise en ligne remplace donc bien toutes les copies en cache.
const VERSION = new URL(import.meta.url).search;
const { LANGS, UI, ZONES, SUGGESTIONS, OTHER_STORE } = await import("./data.js" + VERSION);
const { findZoneDetailed, findIntent, normalize, displayKeyword } = await import("./search.js" + VERSION);
const { NEWS } = await import("./news.js" + VERSION);
const { recordSession, recordQuestion, readStats, resetStats } = await import("./stats.js" + VERSION);
const voice = await import("./voice.js" + VERSION);

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
const IDLE_VISUAL = "3d";

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

const state = { screen: "idle", lang: "fr", floor: "0", zone: null, a11y: false, listening: false, speaking: false };
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
  fr: ["denise", "vivienne", "eloise", "brigitte", "celeste", "coralie", "jacqueline", "josephine", "yvette", "julie", "hortense", "amelie", "audrey", "aurelie", "marie", "virginie", "google francais"],
  en: ["sonia", "libby", "maisie", "hollie", "jenny", "aria", "michelle", "ava", "emma", "hazel", "susan", "zira", "serena", "kate", "karen", "moira", "samantha", "tessa", "victoria", "google uk english female", "google us english"],
  es: ["elvira", "abril", "ximena", "helena", "laura", "monica", "paulina", "lucia", "conchita", "google espanol"]
};
const MALE_VOICES = ["paul", "henri", "claude", "guy", "remy", "alain", "jerome", "yves", "antoine", "david", "mark", "george", "ryan", "thomas", "daniel", "oliver", "alvaro", "pablo", "jorge", "diego", "raul", "arthur", "fred", "alex", "tom", "male"];

let voices = [];
let currentUtterance = null;

function refreshVoices() {
  if (!("speechSynthesis" in window)) return;
  voices = window.speechSynthesis.getVoices();
  fillVoiceSettings();
}

function pickVoice(lang) {
  const saved = settings.voices[lang] && voices.find((v) => v.voiceURI === settings.voices[lang]);
  if (saved) return saved;
  const wanted = LANGS[lang].speech.toLowerCase();
  let best = null;
  let bestScore = -Infinity;
  for (const candidate of voices) {
    const voiceLang = (candidate.lang || "").replace("_", "-").toLowerCase();
    if (!voiceLang.startsWith(wanted.slice(0, 2))) continue;
    const name = normalize(candidate.name);
    let score = voiceLang === wanted ? 4 : 0;
    const rank = FEMALE_VOICES[lang].findIndex((n) => name.includes(n));
    if (rank >= 0) score += 20 - rank * 0.2;
    if (MALE_VOICES.some((n) => new RegExp(`(^| )${n}( |$)`).test(name))) score -= 30;
    if (/natural|online|neural|premium|enhanced/.test(name)) score += 3;
    if (score > bestScore) { bestScore = score; best = candidate; }
  }
  return best;
}

// Voix neuronale Piper si elle est prête, sinon voix du navigateur.
let lastEngine = "aucune lecture pour l'instant";

function speak(text, lang = state.lang) {
  stopSpeaking();
  if (settings.neuralVoice && voice.isReady(lang)) {
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
      if (!handled) {
        lastEngine = `voix du navigateur (${lang}) — Piper indisponible`;
        updateVoiceStatus();
        speakWithBrowser(text, lang);
      }
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
  if (chosen) utterance.voice = chosen;
  lastEngine = `voix du navigateur : ${chosen ? chosen.name : "voix par défaut"} (${lang})`;
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
    if (settings.neuralVoice) await downloadVoices(["fr"]);
  } catch (error) {
    console.info("Voix neuronale indisponible :", error && error.message ? error.message : error);
    updateVoiceStatus();
  }
}

function setSpeaking(on) {
  state.speaking = on;
  if (avatar) avatar.setSpeaking(on);
  updateStatus();
}

// =====================================================================
// Micro (reconnaissance vocale du navigateur)
// =====================================================================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

function toggleMic() {
  if (!SpeechRecognition) { reply(t().micUnsupported); return; }
  if (state.listening) { recognition && recognition.stop(); return; }

  stopSpeaking();
  const rec = new SpeechRecognition();
  rec.lang = LANGS[state.lang].speech;
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  let finalText = "";
  let error = null;

  rec.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) finalText += result[0].transcript;
      else interim += result[0].transcript;
    }
    els.input.value = (finalText + " " + interim).trim();
    bump();
  };
  rec.onerror = (event) => { error = event.error; };
  rec.onend = () => {
    if (recognition !== rec) return;
    recognition = null;
    setListening(false);
    const text = finalText.trim();
    els.input.value = "";
    if (text) ask(text, "voice");
    else if (error === "not-allowed" || error === "service-not-allowed") reply(t().micDenied);
    else if (error && error !== "aborted") reply(t().micError);
  };

  recognition = rec;
  setListening(true);
  try { rec.start(); } catch { recognition = null; setListening(false); reply(t().micError); }
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
function addMessage(role, text) {
  const message = document.createElement("p");
  message.className = `msg msg-${role}`;
  message.textContent = text;
  els.chat.append(message);
  while (els.chat.children.length > 40) els.chat.firstElementChild.remove();
  els.chat.scrollTo({ top: els.chat.scrollHeight, behavior: motionReduced() ? "auto" : "smooth" });
}

function reply(text) {
  addMessage("jeanne", text);
  speak(text);
}

function ask(text, source = "text") {
  addMessage("user", text);
  bump();
  hideOtherStore();
  const match = findZoneDetailed(text, state.lang);
  const zone = match ? match.id : null;
  const intent = zone ? null : findIntent(text);
  // Les « bonjour » / « merci » comptent comme questions, pas comme questions sans réponse.
  recordQuestion({ text: intent ? null : text, zone, lang: state.lang, source });
  if (zone) { answerZone(zone, match.fuzzy ? t().didYouMean(displayKeyword(match.keyword)) : ""); return; }
  if (intent) {
    reply(t()[intent]);
    if (intent === "thanks") signLSF("merci");
    return;
  }
  clearZone();
  reply(t().notFound);
}

const zoneLabel = (id) => ZONES[id].label[state.lang];

function answerZone(id, prefix = "") {
  if (ZONES[id].external) {
    showOtherStore();
    reply(prefix + t().otherStore);
    return;
  }
  showZone(id);
  if (id === "escalier") reply(prefix + t().foundStairs);
  else if (id === "entree") reply(prefix + t().foundEntrance);
  else reply(prefix + t().found(zoneLabel(id), ZONES[id].floors[0]));
}

// =====================================================================
// Plan du magasin
// =====================================================================
let floorTimer = null;

function renderTiles() {
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
const SVG_NS = "http://www.w3.org/2000/svg";
let routeDrawTimer = null;
let routeAnimation = null;

function routePoints(floor, id) {
  const zone = ZONES[id];
  if (!zone || id === "entree") return null;
  const planEl = $(`.floor[data-floor="${floor}"] .plan`);
  const box = planEl.getBoundingClientRect();
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, bottom: r.bottom - box.top };
  };
  if (floor === "0") {
    const start = centre($(".plan-0 .here svg"));
    const target = zone.floors.includes("0")
      ? $(`.plan-0 .tile[data-zone="${id}"]`)
      : $('.plan-0 .tile[data-zone="escalier"]');
    const end = centre(target);
    return [start, { x: end.x, y: start.y }, end];
  }
  if (id === "escalier" || !zone.floors.includes("-1")) return null;
  const stairs = centre($('.plan-m1 .tile[data-zone="escalier"]'));
  const end = centre($(`.plan-m1 .tile[data-zone="${id}"]`));
  const start = { x: stairs.x, y: stairs.bottom };
  return [start, { x: start.x, y: end.y }, end];
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
  make("circle", { cx: start.x, cy: start.y, r: 7, class: "route-start" });
  const endDot = make("circle", { cx: end.x, cy: end.y, r: 11, class: "route-end" });

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
  const walker = make("circle", { r: 6, class: "route-walker" });
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

function showZone(id) {
  hideOtherStore();
  clearTimeout(floorTimer);
  state.zone = id;
  const zone = ZONES[id];
  const basementOnly = !zone.floors.includes("0");

  $$(".tile").forEach((tile) => tile.classList.toggle("is-hit", tile.dataset.zone === id));
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
  $$(".tile").forEach((tile) => tile.classList.remove("is-hit", "is-route"));
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
  els.routeTarget.textContent = zone.label[state.lang];
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
  applyLang();
  if (settings.neuralVoice && voice.supports(lang) && !voice.isReady(lang)) downloadVoices([lang]);
  reply(t().switched);
}

function toggleA11y(force) {
  state.a11y = typeof force === "boolean" ? force : !state.a11y;
  document.documentElement.classList.toggle("a11y", state.a11y);
  els.a11y.setAttribute("aria-pressed", String(state.a11y));
  if (avatar) avatar.setReducedMotion(motionReduced());
  requestAnimationFrame(placeAvatar);
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
  applyLang();
  placeAvatar();
  if (avatar) avatar.setFraming("docked");
  els.chat.textContent = "";
  setTimeout(() => {
    reply(t().greeting);
    if (avatar) avatar.wave();
  }, 450);
  bump();
}

function exitToIdle() {
  closeWarning();
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
    voices
      .filter((v) => (v.lang || "").toLowerCase().startsWith(prefix))
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

els.mic.addEventListener("click", toggleMic);
els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = els.input.value.trim();
  if (!text) return;
  els.input.value = "";
  ask(text);
});
els.vendor.addEventListener("click", callVendor);
els.otherStoreClose.addEventListener("click", hideOtherStore);
els.a11y.addEventListener("click", () => toggleA11y());
els.end.addEventListener("click", exitToIdle);

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
  const tile = e.target.closest(".tile[data-zone]");
  if (!tile) return;
  recordQuestion({ zone: tile.dataset.zone, lang: state.lang, source: "map" });
  answerZone(tile.dataset.zone);
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

function useIdleVideo() {
  els.idleVideo.hidden = false;
  document.body.classList.add("has-idle-video");
  els.idleVideo.play().catch(() => { /* lecture refusée : la photo reste affichée */ });
}
if (els.idleVideo.isConnected) {
  els.idleVideo.addEventListener("canplay", useIdleVideo, { once: true });
  els.idleVideo.addEventListener("error", () => { els.idleVideo.remove(); });
  els.idleVideo.src = els.idleVideo.dataset.src;
}

// Photo de Jeanne sur l'écran de veille : utilisée seulement si le fichier existe.
function useIdlePhoto() {
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

document.fonts.ready.then(placeAvatar);
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
