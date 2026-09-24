// =====================================================================
// Borne Jeanne — logique de l'interface
// =====================================================================
// La version (?v=N de index.html) est reportée sur chaque fichier :
// une mise en ligne remplace donc bien toutes les copies en cache.
const VERSION = new URL(import.meta.url).search;
const { LANGS, UI, ZONES, SUGGESTIONS, OTHER_STORE, INFO, OPENING } = await import("./data.js" + VERSION);
const { findZoneDetailed, findRude, findIntent, findInfo, findClarify, pickClarifyOption, normalize, displayKeyword } = await import("./search.js" + VERSION);
const { NEWS, STORY, CARD, SIGN_CREDIT } = await import("./news.js" + VERSION);
const { recordSession, recordQuestion, recordRude, recordFeedback, readStats, readPeriod, resetStats, dayKey } = await import("./stats.js" + VERSION);
const { buildReport, monthlyPeriod, downloadReport, emailReport, isEmail } = await import("./report.js" + VERSION);
const voice = await import("./voice.js" + VERSION);
const { sendVendorAlert, sendVendorEmail, emailList, isTopic } = await import("./alert.js" + VERSION);
const { BASEMENT, GROUND, box, routeTo, routeGround, stairsDrawing } = await import("./plan.js" + VERSION);

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const WARNING_SECONDS = 15;
// Visuel de l'écran de veille :
//   "photo" → assets/jeanne-accueil.png (Jeanne détourée, posée sur le jaune)
//   "video" → assets/jeanne-accueil.mp4, avec la photo en secours
// Depuis le 24/09/2026 : la photo, qui porte le badge « Jeanne ». L'ancienne
// vidéo montre une autre Jeanne ; elle reste dans le dépôt en attendant
// qu'une vidéo soit refaite avec cette apparence.
const IDLE_VISUAL = "photo";

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
  visit: { count: 0, last: null, surveyed: false, surveyOffered: false } };
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const motionReduced = () => prefersReduced || state.a11y;
const t = () => UI[state.lang];

const els = {
  idle: $("#idleScreen"), idleCopy: $("#idleCopy"), bubble: $(".idle-bubble"),
  idleGreet: $("#idleGreet"), idleNews: $("#idleNews"), idleNewsTitle: $("#idleNewsTitle"), idleNewsText: $("#idleNewsText"),
  idleNewsDate: $("#idleNewsDate"), idleNewsExample: $("#idleNewsExample"), idleNewsImage: $("#idleNewsImage"),
  statsSummary: $("#statsSummary"), statsZones: $("#statsZones"), statsMisses: $("#statsMisses"), statsReset: $("#statsReset"),
  app: $("#appScreen"), signVideo: $("#signVideo"), signCredit: $("#signCredit"), lookVideo: $("#lookVideo"),
  idleHours: $("#idleHours"), storyButton: $("#idleStoryButton"), storyButtonLabel: $("#idleStoryButtonLabel"),
  storyDialog: $("#storyDialog"), storyTitle: $("#storyTitle"), storyText: $("#storyText"),
  storyFigure: $("#storyFigure"), storyImage: $("#storyImage"), storyCaption: $("#storyCaption"),
  storyClose: $("#storyClose"),
  idleCard: $("#idleCard"), idleCardTag: $("#idleCardTag"), idleCardTitle: $("#idleCardTitle"),
  idleCardPrice: $("#idleCardPrice"), idleCardList: $("#idleCardList"), idleCardFoot: $("#idleCardFoot"),
  idleCardPhoto: $("#idleCardPhoto"), idleCardButton: $("#idleCardButton"),
  cardDialog: $("#cardDialog"), cardDetailTitle: $("#cardDetailTitle"), cardDetailPrice: $("#cardDetailPrice"),
  cardDetailSections: $("#cardDetailSections"), cardDetailQr: $("#cardDetailQr"),
  cardDetailQrImage: $("#cardDetailQrImage"), cardDetailQrLabel: $("#cardDetailQrLabel"),
  cardDetailClose: $("#cardDetailClose"),
  chat: $("#chatLog"), chips: $("#suggestions"), status: $("#status"), statusText: $("#statusText"),
  mic: $("#micButton"), micLabel: $("#micLabel"), form: $("#askForm"), input: $("#askInput"), send: $("#askSend"),
  vendor: $("#vendorButton"), a11y: $("#a11yButton"), end: $("#endButton"), logo: $("#logoButton"),
  mapStage: $("#mapStage"), route: $("#route"), routeHint: $("#routeHint"), routeStairs: $("#routeStairs"),
  routeTarget: $("#routeTarget"), routeIcon: $("#routeIcon use"),
  warning: $("#idleWarning"), warningBody: $("#idleWarningBody"), warningButton: $("#idleWarningButton"),
  survey: $("#survey"), surveyTitle: $("#surveyTitle"), surveyButtons: $("#surveyButtons"),
  statsSatisfaction: $("#statsSatisfaction"), statsUnhappy: $("#statsUnhappy"),
  reportEmail: $("#reportEmail"), reportDay: $("#reportDay"), reportMonthly: $("#reportMonthly"),
  reportStatus: $("#reportStatus"), reportSend: $("#reportSend"), reportDownload: $("#reportDownload"),
  settings: $("#settings"), idleSeconds: $("#idleSeconds"), micPatience: $("#micPatience"), testVoice: $("#testVoice"),
  micNear: $("#micNear"), micLevelTest: $("#micLevelTest"), micLevelText: $("#micLevelText"),
  micLevelBar: $("#micLevelBar"), micLevelMark: $("#micLevelMark"),
  vendorTopic: $("#vendorTopic"), vendorEmails: $("#vendorEmails"), vendorStatus: $("#vendorStatus"), vendorTest: $("#vendorTest"),
  neuralToggle: $("#neuralToggle"), voiceStatus: $("#voiceStatus"), voiceDownload: $("#voiceDownload"),
  toast: $("#toast"),
  otherStore: $("#otherStore"), otherStoreClose: $("#otherStoreClose"), otherStoreAddress: $("#otherStoreAddress"),
  otherStoreOrder: $("#otherStoreOrder"),
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

// Une phrase est en préparation (fichier qui se charge, voix qui démarre) :
// le micro ne doit pas s'ouvrir par-dessus, sinon il couperait Jeanne.
let speechPending = false;

function speak(text, lang = state.lang) {
  stopSpeaking();
  speechPending = true;
  const url = clipUrl(text, lang);
  if (url) {
    lastEngine = `phrase enregistrée (${lang})`;
    updateVoiceStatus();
    voice.playClip(url, {
      onStart: () => { speechPending = false; setSpeaking(true); },
      onEnd: () => setSpeaking(false)
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
      onStart: () => { speechPending = false; setSpeaking(true); },
      onEnd: () => setSpeaking(false)
    }).then((handled) => {
      if (!handled) speakWithBrowser(text, lang);
    });
    return;
  }
  speakWithBrowser(text, lang);
}

// Chrome oublie parfois de signaler la fin d'une phrase : Jeanne resterait
// « en train de parler » pour toujours, et la borne ne reviendrait jamais à
// l'accueil. Au-delà de la durée normale de la phrase, on la considère finie.
let speechWatchdog = null;

function speakWithBrowser(text, lang = state.lang) {
  clearTimeout(speechWatchdog);
  if (!("speechSynthesis" in window)) {
    speechPending = false;
    lastEngine = "aucune voix disponible sur cet appareil";
    updateVoiceStatus();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGS[lang].speech;
  const chosen = pickVoice(lang);
  if (!chosen) {
    speechPending = false;
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
  const done = () => { clearTimeout(speechWatchdog); speechPending = false; if (currentUtterance === utterance) setSpeaking(false); };
  utterance.onstart = () => {
    speechPending = false;
    setSpeaking(true);
    speechWatchdog = setTimeout(done, text.length * 110 + 4000);
  };
  utterance.onend = done;
  utterance.onerror = done;
  currentUtterance = utterance; // garde une référence : évite un arrêt prématuré sous Chrome
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  clearTimeout(speechWatchdog);
  speechPending = false;
  voice.stop();
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

// Conversation « mains libres » : tant que le client parle au micro, le micro se
// rouvre tout seul après chaque réponse de Jeanne. Elle s'arrête dès que le client
// touche l'écran, ou après un silence (micro rouvert sans que personne ne parle).
let handsFree = false;
// Patience du micro, réglable dans le panneau du personnel :
//   settle  : silence à attendre après une phrase claire ;
//   long    : après un mot ou deux, le client va sûrement continuer ;
//   silence : temps avant de renoncer quand personne ne parle.
const PATIENCE = {
  rapide: { settle: 1200, long: 2800, silence: 12000 },
  normal: { settle: 2200, long: 4200, silence: 16000 },
  pose:   { settle: 3500, long: 6000, silence: 22000 }
};
// Réglé sur « posé » par défaut : en magasin, un client qui cherche ses mots
// vaut mieux qu'une borne qui lui coupe la parole.
const patience = () => PATIENCE[store.get("micPatience", "pose")] || PATIENCE.pose;
// Mots de remplissage : « euh, bah, alors… » ne sont pas une demande. Jeanne
// continue d'écouter au lieu de répondre « je n'ai pas trouvé ».
const HESITATIONS = /\b(?:euh+|heu+|hum+|hmm+|mmh+|bah|ben|alors|donc|attendez|attends|voil[aà]|um+|uh+|er+|eh+|well|so|este|pues|a ver|bueno)\b/gi;
const usefulWords = (text) => text.replace(HESITATIONS, " ").replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(/\s+/).filter(Boolean);

function listenWhenDone() {
  if (!handsFree || state.screen !== "app" || !SpeechRecognition) return;
  let opened = false;
  const listen = () => {
    if (opened || !handsFree || state.screen !== "app" || state.listening || state.speaking || els.survey.open) return;
    opened = true;
    toggleMic({ auto: true });
  };
  afterSpeaking = listen;
  // Si aucune voix ne se lance (appareil sans son), le micro s'ouvre quand même,
  // mais jamais pendant qu'une phrase se prépare (réseau lent) : on attend jusqu'à 10 s.
  const started = Date.now();
  const fallback = () => {
    if (afterSpeaking !== listen || state.speaking) return;
    if (speechPending && Date.now() - started < 10000) { setTimeout(fallback, 500); return; }
    afterSpeaking = null;
    listen();
  };
  setTimeout(fallback, 2500);
}

function setSpeaking(on) {
  state.speaking = on;
  updateStatus();
  if (!on && afterSpeaking) {
    const next = afterSpeaking;
    afterSpeaking = null;
    next();
  }
}

// =====================================================================
// Volume du micro : une voix proche est forte, une conversation à trois
// mètres est faible. La reconnaissance du navigateur, elle, entend tout ;
// on écoute donc le micro en parallèle pour mesurer le niveau, et on ignore
// ce qui a été dit trop loin. Réglage dans le panneau du personnel.
// =====================================================================
const NEAR_LEVELS = { tout: 0, proche: 0.035, tresproche: 0.07 };
const nearThreshold = () => NEAR_LEVELS[store.get("micNear", "tout")] ?? 0;

const meter = {
  stream: null, ctx: null, raf: 0, level: 0, peak: 0, onLevel: null,
  async start() {
    if (this.stream || !navigator.mediaDevices) return false;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false }
      });
    } catch { this.stream = null; return false; }
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    const source = this.ctx.createMediaStreamSource(this.stream);
    const analyser = this.ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    const data = new Float32Array(analyser.fftSize);
    this.peak = 0;
    const tick = () => {
      analyser.getFloatTimeDomainData(data);
      let somme = 0;
      for (const v of data) somme += v * v;
      this.level = Math.sqrt(somme / data.length);
      this.peak = Math.max(this.peak, this.level);
      if (this.onLevel) this.onLevel(this.level, this.peak);
      this.raf = requestAnimationFrame(tick);
    };
    tick();
    return true;
  },
  stop() {
    cancelAnimationFrame(this.raf);
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    if (this.ctx) this.ctx.close().catch(() => {});
    this.stream = null;
    this.ctx = null;
    this.level = 0;
  }
};

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
  // Micro rouvert tout seul : après 8 s sans un mot, on le referme.
  let silenceTimer = auto ? setTimeout(() => finish(""), patience().silence) : null;

  // Répondre dès que la phrase est connue, sans attendre que le navigateur
  // ferme le micro (il ajoute souvent une demi-seconde, parfois plus).
  const finish = (text) => {
    clearTimeout(settleTimer);
    clearTimeout(silenceTimer);
    if (recognition !== rec) return;
    // Voix trop faible : c'est le magasin autour, pas le client devant la
    // borne. On oublie la phrase et on continue d'écouter.
    const seuil = nearThreshold();
    if (text && seuil > 0 && meter.stream && meter.peak < seuil) {
      meter.peak = 0;
      finalText = "";
      interimText = "";
      els.input.value = "";
      clearTimeout(silenceTimer);
      silenceTimer = auto ? setTimeout(() => finish(""), patience().silence) : null;
      return;
    }
    meter.stop();
    recognition = null;
    rec.abort();
    setListening(false);
    els.input.value = "";
    if (text) ask(text, "voice");
    // Personne n'a parlé : fin du mode mains libres jusqu'à la prochaine question au micro.
    else handsFree = false;
  };

  rec.onresult = (event) => {
    clearTimeout(silenceTimer);
    interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) finalText += result[0].transcript;
      else interimText += result[0].transcript;
    }
    const heard = (finalText + " " + interimText).trim();
    els.input.value = heard;
    bump();
    // On ne répond jamais sur-le-champ, même quand le navigateur annonce la
    // phrase comme terminée : le client dit souvent « bah… » puis sa demande.
    // On attend qu'il se taise vraiment, plus longtemps s'il n'a dit qu'un mot.
    const mots = usefulWords(heard);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      // Que des hésitations : on laisse le micro ouvert et on repart à zéro.
      if (!mots.length) {
        finalText = "";
        interimText = "";
        els.input.value = "";
        clearTimeout(silenceTimer);
        silenceTimer = auto ? setTimeout(() => finish(""), patience().silence) : null;
        return;
      }
      finish((finalText + " " + interimText).trim());
    }, mots.length >= 3 ? patience().settle : patience().long);
  };
  rec.onerror = (event) => { error = event.error; };
  rec.onend = () => {
    clearTimeout(settleTimer);
    clearTimeout(silenceTimer);
    if (recognition !== rec) return;
    recognition = null;
    setListening(false);
    const loin = nearThreshold() > 0 && meter.stream && meter.peak < nearThreshold();
    meter.stop();
    if (loin) { handsFree = false; return; }
    const text = (finalText + " " + interimText).trim();
    els.input.value = "";
    // Micro refermé par le navigateur sur un simple « euh » : on ne répond pas.
    if (text && usefulWords(text).length) { ask(text, "voice"); return; }
    handsFree = false;
    // Micro ouvert tout seul : en cas de silence ou de micro bloqué, on n'affiche rien.
    if (auto) return;
    if (error === "not-allowed" || error === "service-not-allowed") reply(t().micDenied);
    else if (error && error !== "aborted") reply(t().micError);
  };

  recognition = rec;
  setListening(true);
  // Sonomètre ouvert en parallèle, seulement si le filtre est actif.
  if (nearThreshold() > 0) meter.start();
  try { rec.start(); } catch {
    clearTimeout(silenceTimer);
    recognition = null;
    handsFree = false;
    setListening(false);
    if (!auto) reply(t().micError);
  }
}

function abortMic() {
  meter.stop();
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
  surveyPending = false;
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
  // Une réponse chasse le signe en cours : le portrait revient avec la réponse.
  stopSigning();
  addMessage("jeanne", prefix + text);
  speak(text);
  listenWhenDone();
}

let rudeTimer = null;

function ask(text, source = "text") {
  afterSpeaking = null;
  clearTimeout(rudeTimer);
  stopSigning();
  abortMic();
  // Question posée au micro : Jeanne réécoutera après sa réponse.
  handsFree = source === "voice";
  addMessage("user", text);
  bump();
  hideOtherStore();
  // Réponse au sondage, au micro ou au clavier : « oui », « non merci »…
  if (surveyPending) {
    const answer = normalize(text);
    const found = SURVEY_YES.test(answer) ? true : SURVEY_NO.test(answer) ? false : null;
    closeChoices();
    if (found !== null) {
      answerSurvey(found);
      reply(found ? t().surveyThanksYes : t().surveyThanksNo);
      return;
    }
  }
  // Réponse à la question de Jeanne : « pour jouer », « Samsung », « l'iPad »…
  if (state.clarify) {
    const entry = state.clarify;
    const pending = state.clarifySource;
    closeChoices();
    const option = pickClarifyOption(text, entry);
    if (option) { chooseOption(option, pending); return; }
  }
  // Propos déplacés : Jeanne répond une fois, calmement, et la phrase n'est
  // pas gardée dans les statistiques. Au troisième d'affilée, la visite se
  // termine : la borne redevient un écran d'accueil, ce qui coupe le jeu.
  const rude = findRude(text);
  if (rude === "dirigés") {
    recordRude();
    state.visit.rude = (state.visit.rude || 0) + 1;
    clearZone();
    reply(t().rude);
    if (state.visit.rude >= 3) {
      handsFree = false;
      // Fin de la visite : le compte à rebours part maintenant, sans attendre
      // que Jeanne ait fini de parler — la voix ne démarre pas toujours.
      // Une vraie question posée entre-temps l'annule (début de ask).
      clearTimeout(rudeTimer);
      rudeTimer = setTimeout(exitToIdle, 9000);
    }
    return;
  }
  // Les questions pratiques passent avant les rayons : « les horaires » ou
  // « les toilettes » ne sont pas des produits.
  const info = findInfo(text);
  if (info) {
    noteVisit(text);
    recordQuestion({ text: null, zone: null, lang: state.lang, source });
    // Certaines réponses s'accompagnent d'un rayon sur le plan : l'ascenseur,
    // ou la téléphonie pour le retrait d'un téléphone (propriété « zone »).
    const shown = info === "elevator" ? "ascenseur" : INFO[info].zone;
    if (shown) showZone(shown);
    else clearZone();
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
  // Les « bonjour » / « merci » comptent comme questions, pas comme questions
  // sans réponse. Un juron sans demande n'est pas gardé non plus : inutile de
  // le retrouver dans la liste des recherches à améliorer.
  const garder = !intent && !(rude === "jurons" && !zone);
  recordQuestion({ text: garder ? text : null, zone, lang: state.lang, source });
  if (zone) { answerZone(zone, match.fuzzy ? t().didYouMean(displayKeyword(match.keyword)) : "", match.place); return; }
  if (intent) {
    reply(t()[intent]);
    // « Avez-vous besoin d'assistance ? Souhaitez-vous qu'un vendeur vous
    // accompagne ? » quand Jeanne oriente vers un vendeur.
    if (intent === "human") signLSF(["assistance", "accompagner"]);
    if (intent === "thanks") {
      signLSF(["merci", "abientot"]);
      // « Merci » arrive souvent en fin de visite : c'est le moment du sondage.
      offerSurvey();
    }
    return;
  }
  clearZone();
  if (rude === "jurons") { recordRude(); reply(t().rude); return; }
  reply(t().notFound);
  signLSF(["assistance", "accompagner"]);
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

let surveyPending = false;
const SURVEY_YES = /^(?:oui|ouais|ouai|yes|yeah|yep|si|claro|bien sur|tout a fait|absolument|parfait|super|nickel)\b/;
const SURVEY_NO = /^(?:non|nan|no|nope|pas vraiment|pas du tout)\b/;

function offerSurvey() {
  // Une seule proposition par visite : un deuxième « merci » ne relance pas la question.
  if (!state.visit.count || state.visit.surveyed || state.visit.surveyOffered) return;
  state.visit.surveyOffered = true;
  surveyPending = true;
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
  if (id === "ascenseur") reply(INFO.elevator.answer[state.lang], prefix);
  else if (id === "escalier") reply(t().foundStairs, prefix);
  else if (id === "entree") reply(t().foundEntrance, prefix);
  else {
    // Les caisses, le SAV, l'adhésion et le stand photo ne sont pas des rayons :
    // ils ont leur propre début de phrase (« intro »), parfois suivi d'un
    // rappel (« note »), par exemple la carte Fnac à préparer en caisse.
    const zone = ZONES[id];
    const floor = zone.floors[0];
    const phrase = zone.intro
      ? t().foundPlace(zone.intro[state.lang], floor)
      : t().found(zoneLabel(id), floor);
    reply(zone.note ? `${phrase} ${zone.note[state.lang]}` : phrase, prefix);
  }
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
    // Ascenseur : pictogramme accessibilité, droit même si la cabine est en biais.
    if (shape.kind === "elevator") {
      const size = Math.min(w, h) * 0.8;
      svgEl("use", { href: "#i-access", x: cx - size / 2, y: cy - size / 2, width: size, height: size, class: "bm-elevator-icon" }, svg);
    }
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
  lookAtMap();
  renderRoute();
  scheduleRouteDraw(true);

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
}

// Alerte envoyée aux vendeurs (js/alert.js). Au plus une par minute : un
// deuxième appui dans la minute confirme l'appel déjà parti sans en renvoyer.
// Si l'alerte ne part pas, Jeanne ne dit pas qu'un vendeur a été prévenu.
const VENDOR_COOLDOWN = 60 * 1000;
let lastVendorAlert = 0;
let vendorSending = false;

// motif : « commande » quand le client vient d'un produit que le magasin ne
// vend pas (livre, CD, DVD) et qu'un vendeur peut lui commander.
async function callVendor({ motif = null } = {}) {
  if (vendorSending) return;
  const label = !motif && state.zone && !["entree", "escalier", "ascenseur"].includes(state.zone) ? zoneLabel(state.zone) : null;
  const confirm = () => {
    reply(motif ? t().orderConfirm : t().vendorConfirm(label));
    showToast(motif ? t().orderToast : t().vendorToast(label));
  };
  if (Date.now() - lastVendorAlert < VENDOR_COOLDOWN) { confirm(); return; }
  vendorSending = true;
  const zone = !motif && state.zone && ZONES[state.zone] && label ? ZONES[state.zone].label.fr : null;
  const where = { zone, floor: zone ? ZONES[state.zone].floors[0] : null, motif };
  // ntfy et e-mail en même temps : il suffit que l'un des deux parte.
  const [pushed, mailed] = await Promise.all([
    sendVendorAlert(store.get("vendorTopic", ""), where),
    emailList(store.get("vendorEmails", "")).length ? sendVendorEmail(store.get("vendorEmails", ""), where) : "failed"
  ]);
  const sent = pushed || mailed === "sent";
  vendorSending = false;
  if (sent) {
    lastVendorAlert = Date.now();
    confirm();
  } else {
    reply(t().vendorUnavailable);
  }
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
let idleCycle = null;

let idleLang = "fr";

function setIdleLang(lang) {
  idleLang = lang;
  const d = UI[lang];
  $$("#idleScreen [data-i18n]").forEach((el) => { el.textContent = d[el.dataset.i18n]; });
  $$(".idle-langs li").forEach((li) => li.classList.toggle("is-on", li.dataset.lang === lang));
  showOpening(lang);
}

// =====================================================================
// Pastille « Ouvert jusqu'à 19 h 30 », qui devient « Fermeture dans 20 min »
// puis « Fermé · ouvre demain à 10 h ». Horaires dans OPENING (js/data.js).
// =====================================================================
const dayKeyFor = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// Horaires du jour : fermeture exceptionnelle, horaire particulier, ou semaine.
function hoursOf(date) {
  const key = dayKeyFor(date);
  if (OPENING.closed.includes(key)) return null;
  return OPENING.special[key] || OPENING.days[date.getDay()] || null;
}

const minutesOf = (heure) => Number(heure.slice(0, 2)) * 60 + Number(heure.slice(3, 5));

// 19:30 → « 19 h 30 » en français, « 7:30 pm » en anglais, « 19:30 » en espagnol.
function showHour(heure, lang) {
  const [h, m] = heure.split(":").map(Number);
  if (lang === "fr") return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
  if (lang === "en") {
    const suffixe = h >= 12 ? "pm" : "am";
    const douze = h % 12 === 0 ? 12 : h % 12;
    return m ? `${douze}:${String(m).padStart(2, "0")} ${suffixe}` : `${douze} ${suffixe}`;
  }
  return heure;
}

// Prochain jour d'ouverture, dans les huit jours qui viennent.
function nextOpening(date) {
  for (let i = 0; i <= 7; i += 1) {
    const jour = new Date(date);
    jour.setDate(date.getDate() + i);
    const horaire = hoursOf(jour);
    if (!horaire) continue;
    if (i === 0 && minutesOf(horaire[0]) <= date.getHours() * 60 + date.getMinutes()) continue;
    return { jour, horaire, aujourdhui: i === 0, demain: i === 1 };
  }
  return null;
}

function showOpening(lang = state.screen === "app" ? state.lang : idleLang, now = new Date()) {
  const t = UI[lang];
  const horaire = hoursOf(now);
  const minute = now.getHours() * 60 + now.getMinutes();
  const el = els.idleHours;
  el.classList.remove("is-soon", "is-closed");
  if (horaire && minute >= minutesOf(horaire[0]) && minute < minutesOf(horaire[1])) {
    const reste = minutesOf(horaire[1]) - minute;
    if (reste <= OPENING.soonMinutes) {
      el.classList.add("is-soon");
      el.textContent = t.hoursClosingSoon(reste);
    } else {
      el.textContent = t.hoursOpen(showHour(horaire[1], lang));
    }
  } else {
    const prochain = nextOpening(now);
    el.classList.add("is-closed");
    if (!prochain) { el.hidden = true; return; }
    const heure = showHour(prochain.horaire[0], lang);
    if (prochain.aujourdhui) {
      // Avant l'ouverture : inutile de nommer le jour.
      el.textContent = t.hoursClosedToday(heure);
    } else {
      // « demain », sinon le nom du jour dans la langue affichée.
      const quand = prochain.demain ? t.hoursTomorrow : prochain.jour.toLocaleDateString(lang, { weekday: "long" });
      el.textContent = t.hoursClosed(quand, heure);
    }
  }
  el.hidden = false;
}

function showGreeting(lang) {
  els.idleNews.hidden = true;
  els.idleGreet.hidden = false;
  setIdleLang(lang);
}

// « Notre histoire » : bouton en bas à droite de l'écran de veille, qui ouvre
// une fenêtre avec le texte et la photo de la statue de Jeanne d'Arc.
// La photo est facultative : si le fichier manque, le texte reste seul.
// La fenêtre se referme toute seule, pour que la borne revienne à l'accueil.
const STORY_MS = 30000;
let storyTimer = null;

function prepareStory() {
  if (!STORY) { els.storyButton.hidden = true; return; }
  els.storyButtonLabel.textContent = STORY.button || "Notre histoire";
  els.storyTitle.textContent = STORY.title;
  els.storyText.textContent = STORY.text;
  els.storyCaption.textContent = STORY.caption || "";
  els.storyFigure.hidden = !STORY.image;
  if (STORY.image) {
    els.storyImage.onerror = () => { els.storyFigure.hidden = true; };
    els.storyImage.src = STORY.image;
  }
}

function openStory() {
  if (!STORY || els.storyDialog.open) return;
  els.storyDialog.showModal();
  clearTimeout(storyTimer);
  storyTimer = setTimeout(closeStory, STORY_MS);
}

function closeStory() {
  clearTimeout(storyTimer);
  if (els.storyDialog.open) els.storyDialog.close();
}

// Encadré fixe à droite : la carte Fnac+, et sa fenêtre de détail.
function showCard() {
  if (!CARD) { els.idleCard.hidden = true; return; }
  els.idleCardTag.textContent = CARD.tag;
  els.idleCardTitle.textContent = CARD.title;
  els.idleCardPrice.textContent = CARD.price;
  els.idleCardFoot.textContent = CARD.foot;
  els.idleCardList.textContent = "";
  for (const point of CARD.points || []) {
    const li = document.createElement("li");
    li.textContent = point;
    els.idleCardList.append(li);
  }
  els.idleCardPhoto.hidden = !CARD.image;
  if (CARD.image) {
    els.idleCardPhoto.onerror = () => { els.idleCardPhoto.hidden = true; };
    els.idleCardPhoto.src = CARD.image;
  }
  // Le bouton n'apparaît que s'il y a un détail à montrer.
  const detail = (CARD.sections || []).length > 0;
  els.idleCardButton.hidden = !detail;
  if (!detail) return;
  els.idleCardButton.textContent = CARD.button || "Plus d'informations";
  els.cardDetailTitle.textContent = CARD.detailTitle || CARD.title;
  els.cardDetailPrice.textContent = CARD.detailPrice || CARD.price;
  els.cardDetailSections.textContent = "";
  for (const section of CARD.sections) {
    const bloc = document.createElement("section");
    const titre = document.createElement("h3");
    titre.textContent = section.title;
    const liste = document.createElement("ul");
    for (const point of section.points) {
      const li = document.createElement("li");
      li.textContent = point;
      liste.append(li);
    }
    bloc.append(titre, liste);
    els.cardDetailSections.append(bloc);
  }
  els.cardDetailQr.hidden = !CARD.qr;
  if (CARD.qr) {
    els.cardDetailQrImage.onerror = () => { els.cardDetailQr.hidden = true; };
    els.cardDetailQrImage.src = CARD.qr;
    els.cardDetailQrLabel.textContent = CARD.qrLabel || "";
  }
}

// La fenêtre se referme seule, comme celle de l'histoire du magasin.
let cardTimer = null;
function openCard() {
  if (els.cardDialog.open) return;
  els.cardDialog.showModal();
  clearTimeout(cardTimer);
  cardTimer = setTimeout(closeCard, STORY_MS);
}

function closeCard() {
  clearTimeout(cardTimer);
  if (els.cardDialog.open) els.cardDialog.close();
}

function showNews(item) {
  setIdleLang("fr");
  els.idleNewsTitle.textContent = item.title;
  els.idleNewsText.textContent = item.text;
  els.idleNewsDate.textContent = item.date;
  els.idleNewsExample.hidden = !item.example;
  els.idleNewsImage.hidden = !item.image;
  // Une image .png est un produit détouré : pas de carte blanche derrière lui.
  els.idleNewsImage.classList.toggle("is-cutout", Boolean(item.image) && item.image.endsWith(".png"));
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
  // Déroulé : accueil FR, EN, ES, puis une actualité.
  const cards = NEWS.length ? ["news"] : [];
  const steps = IDLE_ORDER.length + cards.length;
  const next = () => {
    idleStep = (idleStep + 1) % steps;
    els.idle.classList.add("is-swapping");
    setTimeout(() => {
      const card = cards[idleStep - IDLE_ORDER.length];
      if (card === "news") showNews(NEWS[newsIndex++ % NEWS.length]);
      else showGreeting(IDLE_ORDER[idleStep]);
      els.idle.classList.remove("is-swapping");
      idleCycle = setTimeout(next, card ? NEWS_MS : GREETING_MS);
    }, 420);
  };
  idleCycle = setTimeout(next, GREETING_MS);
}

// =====================================================================
// Langue des signes (LSF)
//
// Jeanne signe en vidéo : un clip par signe, tourné avec une personne qui
// signe, dans assets/lsf/<langue>/<signe>.mp4 (bonjour, bienvenue, aider,
// merci, abientot). Le clip remplace le portrait le temps du geste.
// Tant qu'un clip n'existe pas, la borne n'affiche rien de plus : le texte
// de Jeanne reste à l'écran, comme pour un client qui n'entend pas.
// =====================================================================
const SIGN_DIR = "assets/lsf/";
let signQueue = [];
// Clips présents sur la borne : on le demande une fois par fichier, sinon la
// vidéo s'affiche une seconde dans le vide quand un signe n'a pas été tourné.
const signClips = new Map();

// Les clips sont des .mp4 : lus par tous les navigateurs, Safari compris,
// qui ne sait pas afficher la transparence d'un .webm. Le .webm reste accepté
// pour un clip fourni dans ce format.
const SIGN_FORMATS = [".mp4", ".webm"];

function hasClip(url) {
  if (!signClips.has(url)) {
    signClips.set(url, fetch(url, { method: "HEAD" }).then((r) => r.ok).catch(() => false));
  }
  return signClips.get(url);
}

async function findClip(name) {
  for (const format of SIGN_FORMATS) {
    const url = `${SIGN_DIR}${state.lang}/${name}${format}${VERSION}`;
    if (await hasClip(url)) return url;
  }
  return null;
}

async function signLSF(names) {
  if (!els.signVideo || state.screen !== "app") return false;
  const wanted = [];
  for (const name of Array.isArray(names) ? names : [names]) {
    const url = await findClip(name);
    if (url) wanted.push(url);
  }
  // Rien de tourné dans cette langue, ou le client est reparti entre-temps.
  if (!wanted.length || state.screen !== "app") return false;
  signQueue = wanted;
  if (els.signCredit) els.signCredit.textContent = SIGN_CREDIT || "";
  // Le cadre s'ouvre avant la première image, et la lecture attend que
  // l'écran soit redessiné : Chrome refuse de lire une vidéo muette tant
  // qu'elle n'est pas visible (économie d'énergie).
  stopLooking();
  document.body.classList.add("is-signing");
  requestAnimationFrame(() => requestAnimationFrame(playNextSign));
  return true;
}

function playNextSign() {
  const next = signQueue.shift();
  if (!next) return stopSigning();
  els.signVideo.src = next;
  els.signVideo.play().catch((error) => { console.warn("Signe non lu :", error.name, error.message); stopSigning(); });
}

// --- Jeanne se tourne vers le plan ---------------------------------------
// Clip joué dans le cadre du portrait quand Jeanne indique un rayon. Le
// fichier est facultatif : sans lui, le portrait ne bouge pas.
const LOOK_CLIP = "assets/jeanne-plan.mp4";

async function lookAtMap() {
  if (!els.lookVideo || document.body.classList.contains("is-signing")) return;
  if (!(await hasClip(LOOK_CLIP + VERSION)) || state.screen !== "app") return;
  document.body.classList.add("is-looking");
  if (!els.lookVideo.getAttribute("src")) els.lookVideo.src = LOOK_CLIP + VERSION;
  els.lookVideo.currentTime = 0;
  els.lookVideo.play().catch(() => stopLooking());
}

function stopLooking() {
  document.body.classList.remove("is-looking");
  if (els.lookVideo) els.lookVideo.pause();
}

if (els.lookVideo) {
  els.lookVideo.addEventListener("ended", stopLooking);
  els.lookVideo.addEventListener("error", stopLooking);
}

function stopSigning() {
  signQueue = [];
  document.body.classList.remove("is-signing");
  if (!els.signVideo || !els.signVideo.getAttribute("src")) return;
  els.signVideo.pause();
  els.signVideo.removeAttribute("src");
  els.signVideo.load();
}

if (els.signVideo) {
  els.signVideo.addEventListener("ended", playNextSign);
  // Clip illisible : on en reste au texte affiché.
  els.signVideo.addEventListener("error", () => { if (els.signVideo.getAttribute("src")) stopSigning(); });
}

function enterApp() {
  if (state.screen === "app" || els.storyDialog.open || els.cardDialog.open) return;
  state.screen = "app";
  clearTimeout(idleCycle);
  recordSession();
  document.body.classList.replace("is-idle", "is-app");
  els.idle.inert = true;
  els.app.inert = false;
  if (els.idleVideo && els.idleVideo.isConnected && !els.idleVideo.hidden) els.idleVideo.pause();
  state.lang = "fr";
  state.visit = { count: 0, last: null, surveyed: false, surveyOffered: false, rude: 0 };
  // Retour rapide après un « Terminer » : le nettoyage prévu ne doit pas effacer le nouveau bonjour.
  clearTimeout(chatClearTimer);
  applyLang();
  els.chat.textContent = "";
  setTimeout(() => {
    // Le message complet s'affiche, mais Jeanne dit seulement « Bonjour ! Quel
    // produit cherchez-vous ? », puis ouvre le micro : le client n'a pas besoin
    // de toucher « Appuyez pour parler ».
    addMessage("jeanne", t().greeting);
    speak(t().hello);
    // Accueil en langue des signes : « bonjour », « bienvenue », « puis-je vous aider ? ».
    signLSF(["bonjour", "bienvenue", "aider"]);
    if (state.screen !== "app") return;
    handsFree = true;
    listenWhenDone();
  }, 450);
  bump();
}

let chatClearTimer = null;
function exitToIdle() {
  clearTimeout(rudeTimer);
  afterSpeaking = null;
  handsFree = false;
  stopSigning();
  // Réglages du personnel laissés ouverts : on les ferme (les statistiques ne
  // doivent pas rester affichées devant les clients).
  if (els.settings.open) els.settings.close();
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
  stopLooking();
  if (els.idleVideo && els.idleVideo.isConnected && !els.idleVideo.hidden) els.idleVideo.play().catch(() => {});
  startIdleCycle();
  clearTimeout(chatClearTimer);
  chatClearTimer = setTimeout(() => { els.chat.textContent = ""; }, 600);
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
    `Par : micro ${n(s.bySource, "voice")} · clavier ${n(s.bySource, "text")} · recherches fréquentes ${n(s.bySource, "chip")} · plan ${n(s.bySource, "map")}.` +
    // Propos déplacés : seul le nombre est gardé, jamais les phrases.
    (s.rude ? ` Propos déplacés écartés : ${s.rude}.` : "");
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

// --- Envoi mensuel des statistiques par e-mail (js/report.js) --------------
// Réglages enregistrés sur la borne : adresse, jour du mois, envoi activé,
// et le dernier mois envoyé (« 2026-10 ») pour ne jamais envoyer deux fois.
const report = {
  get email() { return store.get("reportEmail", ""); },
  get day() { return store.get("reportDay", 5); },
  get monthly() { return store.get("reportMonthly", false); }
};

const periodReport = (sendDate) => {
  const period = monthlyPeriod(sendDate);
  const stats = readPeriod(dayKey(period.from), dayKey(period.to));
  return buildReport(stats, period, (id) => (ZONES[id] ? ZONES[id].label.fr : id));
};

function setReportStatus(text, kind = "") {
  els.reportStatus.textContent = text;
  els.reportStatus.className = `stats-note${kind ? " is-" + kind : ""}`;
}

function saveReportSettings() {
  store.set("reportEmail", els.reportEmail.value.trim());
  store.set("reportDay", Number(els.reportDay.value) || 5);
  store.set("reportMonthly", els.reportMonthly.checked);
}

async function sendReport(sendDate, { automatic = false } = {}) {
  const address = report.email;
  if (!isEmail(address)) {
    if (!automatic) setReportStatus("Adresse e-mail invalide.", "error");
    return false;
  }
  if (!automatic) {
    els.reportSend.disabled = true;
    setReportStatus("Envoi en cours…");
  }
  try {
    const result = await emailReport(periodReport(sendDate), address);
    if (result === "activation") {
      if (!automatic) setReportStatus(`Première fois : ouvrez l'e-mail « Activate form » reçu sur ${address}, cliquez sur le lien, puis touchez de nouveau « Envoyer maintenant ».`, "error");
      return false;
    }
    store.set("reportLastSent", Date.now());
    if (!automatic) setReportStatus(`Statistiques envoyées à ${address}.`, "ok");
    return true;
  } catch (error) {
    if (!automatic) setReportStatus(`Envoi impossible (${error.message}). Vérifiez la connexion internet, ou téléchargez le fichier.`, "error");
    return false;
  } finally {
    els.reportSend.disabled = false;
  }
}

// Vérifiée au démarrage puis toutes les 30 minutes, seulement à l'écran d'accueil
// (jamais pendant qu'un client utilise la borne). Borne éteinte le jour prévu :
// l'envoi part dès qu'elle est rallumée, avec la même période.
let monthlySending = false;
async function checkMonthlyReport() {
  if (!report.monthly || !isEmail(report.email) || state.screen !== "idle" || monthlySending) return;
  const now = new Date();
  const month = dayKey(now).slice(0, 7);
  if (now.getDate() < report.day || store.get("reportLastMonth", "") === month) return;
  // Échec (pas d'internet, adresse pas encore activée) : on réessaie au plus toutes les 6 heures.
  if (Date.now() - store.get("reportLastAttempt", 0) < 6 * 3600 * 1000) return;
  store.set("reportLastAttempt", Date.now());
  monthlySending = true;
  const scheduled = new Date(now.getFullYear(), now.getMonth(), report.day);
  if (await sendReport(scheduled, { automatic: true })) store.set("reportLastMonth", month);
  monthlySending = false;
}

function fillReportSettings() {
  if (!els.reportDay.options.length) {
    for (let day = 1; day <= 28; day++) els.reportDay.append(new Option(`le ${day} du mois`, String(day)));
  }
  els.reportEmail.value = report.email;
  els.reportDay.value = String(report.day);
  els.reportMonthly.checked = report.monthly;
  const lastSent = store.get("reportLastSent", 0);
  if (lastSent) setReportStatus(`Dernier envoi : ${new Date(lastSent).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}.`);
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
// Événements
// =====================================================================
els.idle.tabIndex = 0;
els.idle.addEventListener("click", enterApp);
// --- Réglage du micro : mesure du niveau sur place ----------------------
// La barre couvre 0 à 0,2 en niveau sonore : au-delà, on sature l'affichage.
const LEVEL_SCALE = 0.2;

function showThreshold() {
  const seuil = NEAR_LEVELS[els.micNear.value] ?? 0;
  els.micLevelMark.style.display = seuil ? "block" : "none";
  els.micLevelMark.style.left = `${Math.min(100, (seuil / LEVEL_SCALE) * 100)}%`;
}

let levelTestTimer = null;
els.micLevelTest.addEventListener("click", async () => {
  if (meter.stream) {
    clearTimeout(levelTestTimer);
    meter.onLevel = null;
    meter.stop();
    els.micLevelBar.style.width = "0";
    els.micLevelText.textContent = "Mesure arrêtée.";
    els.micLevelTest.textContent = "Mesurer le niveau du micro";
    return;
  }
  els.micLevelText.textContent = "Ouverture du micro…";
  const ok = await meter.start();
  if (!ok) { els.micLevelText.textContent = "Micro indisponible : autorisez-le dans le navigateur."; return; }
  els.micLevelTest.textContent = "Arrêter la mesure";
  meter.onLevel = (niveau, crete) => {
    els.micLevelBar.style.width = `${Math.min(100, (niveau / LEVEL_SCALE) * 100)}%`;
    const seuil = NEAR_LEVELS[els.micNear.value] ?? 0;
    els.micLevelText.textContent = seuil
      ? `Niveau ${niveau.toFixed(3)} · plus fort atteint ${crete.toFixed(3)} · seuil ${seuil} : ${crete >= seuil ? "la voix serait prise en compte" : "la voix serait ignorée"}`
      : `Niveau ${niveau.toFixed(3)} · plus fort atteint ${crete.toFixed(3)}`;
  };
  // Trente secondes suffisent pour régler : on n'oublie pas le micro ouvert.
  levelTestTimer = setTimeout(() => els.micLevelTest.click(), 30000);
});
els.settings.addEventListener("close", () => {
  if (meter.stream && meter.onLevel) els.micLevelTest.click();
});

els.storyButton.addEventListener("click", (e) => { e.stopPropagation(); openStory(); });
els.idleCardButton.addEventListener("click", (e) => { e.stopPropagation(); openCard(); });
els.cardDetailClose.addEventListener("click", closeCard);
els.cardDialog.addEventListener("close", () => clearTimeout(cardTimer));
els.cardDialog.addEventListener("click", (e) => { if (e.target === els.cardDialog) closeCard(); });
els.storyClose.addEventListener("click", closeStory);
els.storyDialog.addEventListener("close", () => clearTimeout(storyTimer));
// Toucher en dehors de la fenêtre la referme, sans ouvrir la page principale.
els.storyDialog.addEventListener("click", (e) => { if (e.target === els.storyDialog) closeStory(); });
els.idle.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enterApp(); } });

els.mic.addEventListener("click", () => toggleMic());
// Le client touche l'écran pendant que Jeanne parle : il prend la main, la borne n'ouvre pas le micro toute seule.
document.addEventListener("pointerdown", (e) => {
  if (state.screen !== "app") return;
  afterSpeaking = null;
  // Le bouton du micro garde la conversation à la voix ; tout autre toucher l'arrête.
  if (e.target.closest("#micButton")) return;
  handsFree = false;
  stopSigning();
  // Le client choisit à la main pendant que le micro écoute : on le ferme.
  if (state.listening) abortMic();
}, { capture: true });
document.addEventListener("keydown", () => {
  if (state.screen !== "app") return;
  afterSpeaking = null;
  handsFree = false;
  if (state.listening) abortMic();
}, { capture: true });
els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = els.input.value.trim();
  if (!text) return;
  els.input.value = "";
  ask(text);
});
els.vendor.addEventListener("click", callVendor);
els.otherStoreClose.addEventListener("click", hideOtherStore);
// « Faire commander par un vendeur » : livres, CD, DVD… que le magasin peut
// commander même s'il ne les vend pas en rayon.
els.otherStoreOrder.addEventListener("click", () => { hideOtherStore(); callVendor({ motif: "commande" }); });
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
    fillReportSettings();
    els.vendorTopic.value = store.get("vendorTopic", "");
    els.vendorEmails.value = store.get("vendorEmails", "");
    els.vendorStatus.textContent = els.vendorTopic.value || els.vendorEmails.value ? "" : "Ni canal ni e-mail réglé : les alertes ne partent pas.";
    els.neuralToggle.checked = settings.neuralVoice;
    updateVoiceStatus();
    els.idleSeconds.value = settings.idleSeconds;
    els.micPatience.value = store.get("micPatience", "pose");
    els.micNear.value = store.get("micNear", "tout");
    showThreshold();
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
  if (e.target === els.micPatience) store.set("micPatience", els.micPatience.value);
  if (e.target === els.micNear) { store.set("micNear", els.micNear.value); showThreshold(); }
  if (e.target === els.idleSeconds) {
    settings.idleSeconds = Math.min(600, Math.max(20, Number(els.idleSeconds.value) || 60));
    els.idleSeconds.value = settings.idleSeconds;
    store.set("idleSeconds", settings.idleSeconds);
  }
});
els.testVoice.addEventListener("click", () => speak(t().hello));
els.statsReset.addEventListener("click", handleStatsReset);
function saveVendorSettings() {
  const topic = els.vendorTopic.value.trim();
  if (topic && !isTopic(topic)) {
    els.vendorStatus.textContent = "Nom de canal invalide : lettres, chiffres et tirets seulement, 6 caractères au moins.";
    return false;
  }
  const emails = emailList(els.vendorEmails.value);
  if (els.vendorEmails.value.trim() && !emails.length) {
    els.vendorStatus.textContent = "Adresse e-mail invalide.";
    return false;
  }
  store.set("vendorTopic", topic);
  store.set("vendorEmails", emails.join(", "));
  els.vendorEmails.value = emails.join(", ");
  const how = [topic && `ntfy (${topic})`, emails.length && `e-mail (${emails.join(", ")})`].filter(Boolean);
  els.vendorStatus.textContent = how.length ? `Alertes envoyées par ${how.join(" et ")}.` : "Ni canal ni e-mail réglé : les alertes ne partent pas.";
  return true;
}
els.vendorTopic.addEventListener("change", saveVendorSettings);
els.vendorEmails.addEventListener("change", saveVendorSettings);
els.vendorTest.addEventListener("click", async () => {
  if (!saveVendorSettings()) return;
  const topic = store.get("vendorTopic", "");
  const emails = store.get("vendorEmails", "");
  if (!topic && !emails) { els.vendorStatus.textContent = "Indiquez d'abord un canal ntfy ou une adresse e-mail."; return; }
  els.vendorTest.disabled = true;
  els.vendorStatus.textContent = "Envoi du test…";
  const [pushed, mailed] = await Promise.all([
    topic ? sendVendorAlert(topic, { test: true }) : null,
    emails ? sendVendorEmail(emails, { test: true }) : null
  ]);
  els.vendorTest.disabled = false;
  const parts = [];
  if (topic) parts.push(pushed ? "ntfy : test envoyé, il doit sonner sur les téléphones abonnés." : "ntfy : envoi impossible (connexion internet ?).");
  if (emails) parts.push(mailed === "sent" ? "E-mail : test envoyé (vérifiez aussi les indésirables)."
    : mailed === "activation" ? "E-mail : première fois, ouvrez le message « Activate form », cliquez sur le lien, puis refaites le test."
    : "E-mail : envoi impossible (connexion internet ?).");
  els.vendorStatus.textContent = parts.join(" ");
});
els.reportEmail.addEventListener("change", saveReportSettings);
els.reportDay.addEventListener("change", saveReportSettings);
els.reportMonthly.addEventListener("change", () => {
  if (els.reportMonthly.checked && !isEmail(els.reportEmail.value)) {
    els.reportMonthly.checked = false;
    setReportStatus("Indiquez d'abord une adresse e-mail valide.", "error");
    return;
  }
  saveReportSettings();
  // Mois en cours déjà passé le jour prévu : le premier envoi sera celui du mois prochain.
  const now = new Date();
  if (els.reportMonthly.checked && now.getDate() >= report.day) store.set("reportLastMonth", dayKey(now).slice(0, 7));
  setReportStatus(els.reportMonthly.checked
    ? `Envoi mensuel activé : le ${report.day} de chaque mois, à ${report.email}.`
    : "Envoi mensuel désactivé.", els.reportMonthly.checked ? "ok" : "");
});
els.reportSend.addEventListener("click", () => {
  saveReportSettings();
  sendReport(new Date());
});
els.reportDownload.addEventListener("click", () => {
  downloadReport(periodReport(new Date()));
  setReportStatus("Fichier des 31 derniers jours téléchargé (dossier Téléchargements).", "ok");
});
setInterval(checkMonthlyReport, 30 * 60 * 1000);
setTimeout(checkMonthlyReport, 60 * 1000);
els.voiceDownload.addEventListener("click", () => downloadVoices());

let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (state.zone) drawRoute(false); }, 200);
});
if ("speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
}

// --- Mise à jour automatique ---------------------------------------------------
// La borne reste ouverte des jours entiers : sans cela, une nouvelle version publiée
// n'arriverait qu'au prochain rechargement manuel. Toutes les 30 minutes, à l'écran
// d'accueil seulement, on regarde si index.html annonce un autre ?v=N. On ne recharge
// que si la nouvelle version se télécharge bien (pas de page d'erreur si le wifi coupe).
async function checkForUpdate() {
  if (state.screen !== "idle" || els.settings.open) return;
  try {
    const page = await fetch(`index.html?check=${Date.now()}`, { cache: "no-store" });
    if (!page.ok) return;
    const published = (await page.text()).match(/js\/app\.js(\?v=\d+)/);
    if (!published || published[1] === VERSION) return;
    const app = await fetch(`js/app.js${published[1]}`, { cache: "no-store" });
    if (!app.ok || state.screen !== "idle") return;
    location.reload();
  } catch { /* hors ligne : on garde la version en cours */ }
}
setInterval(checkForUpdate, 30 * 60 * 1000);

// --- Démarrage ---
buildPlans();
showCard();
showOpening("fr");
// L'heure avance : la pastille se met à jour toutes les minutes.
setInterval(() => showOpening(), 60000);
prepareStory();
const clipManifestReady = loadClipManifest();
els.app.inert = true;
$$(".floor").forEach((el) => { el.inert = !el.classList.contains("is-active"); });
applyLang();
startIdleCycle();
// Vidéo de Jeanne en boucle : utilisée si le fichier existe, sinon la photo.
if (IDLE_VISUAL !== "video") els.idleVideo.remove();

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

initVoice();

// Aide au réglage : ouvrir la borne avec ?debug pour lancer un signe à la main
// depuis la console du navigateur (jeanne.sign("merci")).
if (new URLSearchParams(location.search).has("debug")) {
  window.jeanne = {
    sign: (name) => signLSF(name || "bonjour"),
    // Essayer la pastille des horaires à une heure donnée : jeanne.heure(19, 15)
    heure: (h, m = 0, lang = "fr") => {
      const faux = new Date();
      faux.setHours(h, m, 0, 0);
      showOpening(lang, faux);
      return els.idleHours.textContent;
    }
  };
}
