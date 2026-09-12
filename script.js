// =====================================================================
// Zones du magasin — coordonnées dans le repère du SVG (viewBox 800x560)
// =====================================================================
const ZONES = {
  informatique: { cx: 135, cy: 110, label: { fr: "Informatique", en: "Computers", es: "Informática" } },
  audio:        { cx: 400, cy: 110, label: { fr: "Son & audio", en: "Audio", es: "Audio" } },
  jeux:         { cx: 665, cy: 110, label: { fr: "Jeux vidéo", en: "Video games", es: "Videojuegos" } },
  livres:       { cx: 135, cy: 450, label: { fr: "Livres", en: "Books", es: "Libros" } },
  photo:        { cx: 665, cy: 450, label: { fr: "Photo & vidéo", en: "Photo & video", es: "Foto y vídeo" } }
};
const ENTRANCE = { x: 740, y: 530 };

const KNOWLEDGE_BASE = [
  { zone: "informatique",
    keywords: { fr: ["disque dur", "disque", "ssd", "stockage"], en: ["hard drive", "hard disk", "ssd", "storage"], es: ["disco duro", "disco", "ssd", "almacenamiento"] },
    reply: {
      fr: "Vous trouverez les disques durs et SSD au rayon Informatique, au fond à gauche du magasin.",
      en: "You'll find hard drives and SSDs in the Computers section, at the back left of the store.",
      es: "Encontrará los discos duros y SSD en la sección de Informática, al fondo a la izquierda." } },
  { zone: "audio",
    keywords: { fr: ["casque", "écouteur", "audio", "enceinte", "son"], en: ["headphone", "headphones", "earphone", "speaker", "audio"], es: ["auricular", "auriculares", "altavoz", "audio"] },
    reply: {
      fr: "Le rayon Son & Audio se trouve juste à côté, au centre du magasin.",
      en: "The Audio section is right next to it, in the center of the store.",
      es: "La sección de Audio está justo al lado, en el centro de la tienda." } },
  { zone: "jeux",
    keywords: { fr: ["console", "jeu vidéo", "jeux vidéo", "playstation", "xbox", "switch"], en: ["console", "video game", "video games", "playstation", "xbox", "switch"], es: ["consola", "videojuego", "videojuegos", "playstation", "xbox", "switch"] },
    reply: {
      fr: "Le rayon Jeux vidéo est situé au fond à droite du magasin.",
      en: "The Video games section is at the back right of the store.",
      es: "La sección de Videojuegos está al fondo a la derecha." } },
  { zone: "livres",
    keywords: { fr: ["livre", "roman", "bd", "manga"], en: ["book", "novel", "comic", "manga"], es: ["libro", "novela", "cómic", "manga"] },
    reply: {
      fr: "Les livres sont rangés à l'avant à gauche, dans l'espace Librairie.",
      en: "Books are at the front left, in the Bookshop area.",
      es: "Los libros están en la parte delantera izquierda, en la zona Librería." } },
  { zone: "photo",
    keywords: { fr: ["photo", "appareil photo", "caméra", "vidéo"], en: ["camera", "photo", "video camera"], es: ["cámara", "foto", "vídeo"] },
    reply: {
      fr: "Le rayon Photo & vidéo se trouve à l'avant à droite du magasin.",
      en: "The Photo & video section is at the front right of the store.",
      es: "La sección de Foto y vídeo está en la parte delantera derecha." } }
];

const DEFAULT_REPLY = {
  fr: "Je ne suis pas certaine de comprendre. Pouvez-vous reformuler, ou préférez-vous qu'un vendeur vienne vous aider ?",
  en: "I'm not sure I understood. Could you rephrase, or would you like a staff member to help you instead?",
  es: "No estoy segura de haber entendido. ¿Puede reformular, o prefiere que un vendedor le ayude?"
};
const GREETING = {
  fr: "Bonjour, je suis Jeanne, votre assistante d'accueil. Parlez-moi ou écrivez votre question.",
  en: "Hello, I'm Jeanne, your welcome assistant. Speak to me, or type your question.",
  es: "Hola, soy Jeanne, su asistente de acogida. Hábleme o escriba su pregunta."
};

function findAnswer(question, lang) {
  const q = question.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    const list = entry.keywords[lang] || entry.keywords.fr;
    if (list.some(k => q.includes(k))) return entry;
  }
  return null;
}

// =====================================================================
// DOM & état
// =====================================================================
const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const avatarCaption = document.getElementById("avatarCaption");
const micBtn = document.getElementById("micBtn");
const micLabel = document.getElementById("micLabel");
const vendorBtn = document.getElementById("vendorBtn");
const toast = document.getElementById("toast");
const langOptions = document.getElementById("langOptions");
const voiceSelect = document.getElementById("voiceSelect");
const pathLine = document.getElementById("pathLine");
const arrivalMarker = document.getElementById("arrivalMarker");

// La langue affichée/parlée suit le sélecteur FR/EN/ES choisi par l'utilisateur,
// plutôt qu'une détection automatique peu fiable (surtout sur de la voix reconnue).
let voiceLang = "fr-FR";       // tag complet, ex. "fr-FR" — utilisé pour la reconnaissance et la synthèse
let currentLang = "fr";        // code court — utilisé pour choisir les réponses dans KNOWLEDGE_BASE
let currentHighlightedZone = null;
let manualVoiceURI = null;     // voix choisie manuellement dans le sélecteur, si renseignée

function addMessage(text, from) {
  const div = document.createElement("div");
  div.className = "msg " + from;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// =====================================================================
// Voix — liste réelle des voix du navigateur, choix manuel possible
// =====================================================================
let availableVoices = [];
const FEMALE_HINTS = {
  "fr-FR": ["amelie", "audrey", "aurelie", "female", "femme", "google français", "julie", "léa", "lea"],
  "en-US": ["samantha", "female", "zira", "google us english", "aria", "jenny"],
  "es-ES": ["monica", "mónica", "female", "google español", "elvira", "lucia", "lucía"]
};

function refreshVoices() {
  availableVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  populateVoiceSelect();
}
if ("speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function guessFemaleVoice(candidates, lang) {
  const hints = FEMALE_HINTS[lang] || [];
  return candidates.find(v => hints.some(h => v.name.toLowerCase().includes(h))) || candidates[0] || null;
}

function populateVoiceSelect() {
  const candidates = availableVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith(voiceLang.split("-")[0]));
  voiceSelect.innerHTML = "";

  if (candidates.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "Aucune voix trouvée pour cette langue";
    opt.disabled = true;
    voiceSelect.appendChild(opt);
    manualVoiceURI = null;
    return;
  }

  candidates.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.voiceURI;
    opt.textContent = v.name + " (" + v.lang + ")";
    voiceSelect.appendChild(opt);
  });

  // Présélectionne la meilleure devinette féminine, sinon la première voix dispo
  const guess = guessFemaleVoice(candidates, voiceLang);
  if (guess) {
    voiceSelect.value = guess.voiceURI;
    manualVoiceURI = guess.voiceURI;
  }
}

voiceSelect.addEventListener("change", () => {
  manualVoiceURI = voiceSelect.value;
});

function pickVoice(lang) {
  if (manualVoiceURI) {
    const chosen = availableVoices.find(v => v.voiceURI === manualVoiceURI);
    if (chosen) return chosen;
  }
  const langPrefix = lang.split("-")[0];
  const candidates = availableVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
  return guessFemaleVoice(candidates, lang);
}

function speak(text, lang) {
  avatarCaption.style.opacity = 0;
  setTimeout(() => { avatarCaption.textContent = text; avatarCaption.style.opacity = 1; }, 150);
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  const voice = pickVoice(lang);
  if (voice) utter.voice = voice;
  utter.pitch = 1.15;
  utter.rate = 0.96;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

// =====================================================================
// Plan 2D — surlignage de zone + tracé de chemin
// =====================================================================
function clearHighlight() {
  document.querySelectorAll(".zone").forEach(z => z.classList.remove("highlight"));
}

function highlightZone(zoneKey) {
  clearHighlight();
  currentHighlightedZone = zoneKey;
  if (!zoneKey) { hidePath(); return; }
  const el = document.querySelector('.zone[data-zone="' + zoneKey + '"]');
  if (el) el.classList.add("highlight");
  drawPathToZone(zoneKey);
}

function hidePath() {
  pathLine.setAttribute("d", "");
  arrivalMarker.setAttribute("opacity", "0");
}

function drawPathToZone(zoneKey) {
  const target = ZONES[zoneKey];
  if (!target) { hidePath(); return; }
  // Chemin en coude : entrée -> point d'angle -> rayon
  const d = "M " + ENTRANCE.x + " " + ENTRANCE.y +
            " L " + target.cx + " " + ENTRANCE.y +
            " L " + target.cx + " " + target.cy;
  pathLine.setAttribute("d", d);
  arrivalMarker.setAttribute("cx", target.cx);
  arrivalMarker.setAttribute("cy", target.cy);
  arrivalMarker.setAttribute("opacity", "1");
}

function askJeanne(question) {
  addMessage(question, "user");
  const lang = currentLang;
  const answer = findAnswer(question, lang);
  if (answer) {
    addMessage(answer.reply[lang], "jeanne");
    speak(answer.reply[lang], voiceLang);
    highlightZone(answer.zone);
  } else {
    addMessage(DEFAULT_REPLY[lang], "jeanne");
    speak(DEFAULT_REPLY[lang], voiceLang);
    highlightZone(null);
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;
  askJeanne(value);
  chatInput.value = "";
});

document.querySelectorAll(".quick-btn").forEach(btn => {
  btn.addEventListener("click", () => askJeanne(btn.dataset.q));
});

langOptions.addEventListener("click", (e) => {
  const btn = e.target.closest(".lang-btn");
  if (!btn) return;
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  voiceLang = btn.dataset.lang;
  currentLang = voiceLang.split("-")[0];
  if (recognition) recognition.lang = voiceLang;
  populateVoiceSelect();
});

// =====================================================================
// Reconnaissance vocale
// =====================================================================
let recognition = null;
let listening = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = voiceLang;
  recognition.interimResults = false;
  recognition.onresult = (event) => askJeanne(event.results[0][0].transcript);
  recognition.onend = () => {
    listening = false;
    micBtn.classList.remove("active");
    micLabel.textContent = "Parler à Jeanne";
  };
} else {
  micLabel.textContent = "Micro non supporté — écrivez ci-dessous";
}

micBtn.addEventListener("click", () => {
  if (!recognition) {
    avatarCaption.textContent = "La reconnaissance vocale n'est pas supportée par ce navigateur. Essayez avec Chrome, ou écrivez votre question.";
    return;
  }
  if (listening) { recognition.stop(); return; }
  listening = true;
  recognition.lang = voiceLang;
  micBtn.classList.add("active");
  micLabel.textContent = "Je vous écoute...";
  avatarCaption.textContent = "Je vous écoute...";
  recognition.start();
});

// =====================================================================
// Notification Teams simulée
// =====================================================================
vendorBtn.addEventListener("click", () => {
  const zoneName = currentHighlightedZone ? ZONES[currentHighlightedZone].label.fr : "le magasin";
  addMessage("Un vendeur du rayon " + zoneName + " a été prévenu et arrive.", "jeanne");
  speak("Un vendeur du rayon " + zoneName + " a été prévenu et arrive.", "fr-FR");
  toast.textContent = "🔔 Notification Teams envoyée au vendeur — Rayon : " + zoneName;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
});

// =====================================================================
// Démarrage
// =====================================================================
addMessage(GREETING.fr, "jeanne");
