// =====================================================================
// Traductions de toute l'interface (pas seulement les réponses de Jeanne)
// =====================================================================
const UI_TEXT = {
  fr: {
    avatarRail: "AVATAR JEANNE",
    chatBoxTitle: "Zone du tchat retransmise à l'écrit",
    disclaimer: "Bienvenue ! Cette borne vous aide à trouver un produit et à vous repérer dans le magasin. Parlez ou écrivez votre question.",
    micIdle: "Appuyer ici pour parler",
    micListening: "Je vous écoute...",
    micUnsupported: "Micro non supporté — écrivez ci-dessous",
    micUnsupportedCaption: "La reconnaissance vocale n'est pas supportée par ce navigateur. Essayez avec Chrome, ou écrivez votre question.",
    chatPlaceholder: "Écrire au lieu de parler...",
    chatSend: "OK",
    voiceLabel: "Voix",
    voiceNone: "Aucune voix féminine trouvée",
    quickActions: [
      { zone: "stockage", label: "📀 Disques durs" },
      { zone: "audio", label: "🎧 Casques audio" },
      { zone: "gaming", label: "🎮 Consoles" },
      { zone: "telephonie", label: "📱 Téléphonie" }
    ],
    vendorBtn: "🙋 Être accompagné par un vendeur",
    vendorConfirm: (zone) => "Un vendeur du rayon " + zone + " a été prévenu et arrive.",
    toastPrefix: "🔔 Notification Teams envoyée au vendeur — Rayon : ",
    mapTitle: "PLAN DU MAGASIN",
    mapSubtitle: "— Rez-de-chaussée",
    greeting: "Bonjour, je suis Jeanne, votre assistante d'accueil. Parlez-moi ou écrivez votre question.",
    defaultReply: "Je ne suis pas certaine de comprendre. Pouvez-vous reformuler, ou préférez-vous qu'un vendeur vienne vous aider ?",
    genericZoneReply: (zoneName) => "Vous trouverez ça au rayon " + zoneName + ", indiqué sur le plan.",
    entree: "— Entrée et Sortie —"
  },
  en: {
    avatarRail: "JEANNE AVATAR",
    chatBoxTitle: "Chat log shown as text",
    disclaimer: "Welcome! This kiosk helps you find a product and get around the store. Speak or type your question.",
    micIdle: "Tap here to talk",
    micListening: "Listening...",
    micUnsupported: "Mic not supported — type below",
    micUnsupportedCaption: "Voice recognition isn't supported by this browser. Try Chrome, or type your question.",
    chatPlaceholder: "Type instead of speaking...",
    chatSend: "OK",
    voiceLabel: "Voice",
    voiceNone: "No female voice found",
    quickActions: [
      { zone: "stockage", label: "📀 Hard drives" },
      { zone: "audio", label: "🎧 Headphones" },
      { zone: "gaming", label: "🎮 Consoles" },
      { zone: "telephonie", label: "📱 Phones" }
    ],
    vendorBtn: "🙋 Get help from staff",
    vendorConfirm: (zone) => "A staff member from " + zone + " has been notified and is on their way.",
    toastPrefix: "🔔 Teams notification sent to staff — Section: ",
    mapTitle: "STORE MAP",
    mapSubtitle: "— Ground floor",
    greeting: "Hello, I'm Jeanne, your welcome assistant. Speak to me, or type your question.",
    defaultReply: "I'm not sure I understood. Could you rephrase, or would you like a staff member to help you instead?",
    genericZoneReply: (zoneName) => "You'll find that in the " + zoneName + " section, shown on the map.",
    entree: "— Entrance and Exit —"
  },
  es: {
    avatarRail: "AVATAR JEANNE",
    chatBoxTitle: "Chat retransmitido como texto",
    disclaimer: "¡Bienvenido! Esta terminal le ayuda a encontrar un producto y a orientarse en la tienda. Hable o escriba su pregunta.",
    micIdle: "Toque aquí para hablar",
    micListening: "Escuchando...",
    micUnsupported: "Micrófono no compatible — escriba abajo",
    micUnsupportedCaption: "El reconocimiento de voz no es compatible con este navegador. Pruebe con Chrome, o escriba su pregunta.",
    chatPlaceholder: "Escribir en lugar de hablar...",
    chatSend: "OK",
    voiceLabel: "Voz",
    voiceNone: "No se encontró voz femenina",
    quickActions: [
      { zone: "stockage", label: "📀 Discos duros" },
      { zone: "audio", label: "🎧 Auriculares" },
      { zone: "gaming", label: "🎮 Consolas" },
      { zone: "telephonie", label: "📱 Telefonía" }
    ],
    vendorBtn: "🙋 Ser atendido por un vendedor",
    vendorConfirm: (zone) => "Un vendedor de " + zone + " ha sido avisado y está en camino.",
    toastPrefix: "🔔 Notificación Teams enviada al vendedor — Sección: ",
    mapTitle: "PLANO DE LA TIENDA",
    mapSubtitle: "— Planta baja",
    greeting: "Hola, soy Jeanne, su asistente de acogida. Hábleme o escriba su pregunta.",
    defaultReply: "No estoy segura de haber entendido. ¿Puede reformular, o prefiere que un vendedor le ayude?",
    genericZoneReply: (zoneName) => "Lo encontrará en la sección " + zoneName + ", indicada en el plano.",
    entree: "— Entrada y Salida —"
  }
};

// =====================================================================
// Zones du magasin, basées sur le plan fourni — nom affiché par langue
// et mots-clés de recherche par langue
// =====================================================================
const ZONES = {
  caisse:            { label: { fr: "Caisse / Adhésion", en: "Checkout / Membership", es: "Caja / Membresía" },
                        keywords: { fr: ["caisse", "adhésion", "carte fnac", "payer"], en: ["checkout", "membership", "pay", "cashier"], es: ["caja", "membresía", "pagar"] } },
  jeuxSociete:       { label: { fr: "Jeux de société", en: "Board games", es: "Juegos de mesa" },
                        keywords: { fr: ["jeu de société", "jeux de société", "jeu de plateau"], en: ["board game", "board games"], es: ["juego de mesa", "juegos de mesa"] } },
  escalierEtage:     { label: { fr: "Escalier vers l'étage (Lego, figurines POP)", en: "Stairs to upper floor (Lego, POP figures)", es: "Escaleras al piso superior (Lego, figuras POP)" },
                        keywords: { fr: ["lego", "légo", "figurine pop", "figurines pop", "étage"], en: ["lego", "pop figure", "pop figures", "upper floor"], es: ["lego", "figura pop", "figuras pop", "piso superior"] } },
  sav:               { label: { fr: "SAV / Retrait commandes", en: "Customer service / Order pickup", es: "Servicio técnico / Recogida de pedidos" },
                        keywords: { fr: ["sav", "service après-vente", "retrait", "commande", "réparation"], en: ["customer service", "repair", "order pickup", "pickup"], es: ["servicio técnico", "recogida", "pedido", "reparación"] } },
  tablette:          { label: { fr: "Tablettes Android", en: "Android tablets", es: "Tabletas Android" },
                        keywords: { fr: ["tablette"], en: ["tablet"], es: ["tableta", "tablet"] } },
  pcwindows:         { label: { fr: "PC Windows", en: "Windows PCs", es: "PC Windows" },
                        keywords: { fr: ["pc windows", "ordinateur windows", "pc portable", "laptop"], en: ["windows pc", "windows laptop", "laptop"], es: ["pc windows", "portátil windows", "laptop"] } },
  apple:             { label: { fr: "Apple (iPad, iPhone, Mac, accessoires)", en: "Apple (iPad, iPhone, Mac, accessories)", es: "Apple (iPad, iPhone, Mac, accesorios)" },
                        keywords: { fr: ["iphone", "ipad", "macbook", "mac", "apple"], en: ["iphone", "ipad", "macbook", "mac", "apple"], es: ["iphone", "ipad", "macbook", "mac", "apple"] } },
  stockage:          { label: { fr: "Stockage / Câbles / Imprimantes", en: "Storage / Cables / Printers", es: "Almacenamiento / Cables / Impresoras" },
                        keywords: { fr: ["disque dur", "disque", "ssd", "clé usb", "câble", "hdmi", "imprimante"], en: ["hard drive", "ssd", "usb key", "cable", "hdmi", "printer"], es: ["disco duro", "ssd", "memoria usb", "cable", "hdmi", "impresora"] } },
  audio:             { label: { fr: "Audio (casques, enceintes, vinyle)", en: "Audio (headphones, speakers, vinyl)", es: "Audio (auriculares, altavoces, vinilo)" },
                        keywords: { fr: ["casque", "écouteur", "enceinte", "audio", "vinyle", "platine"], en: ["headphone", "headphones", "speaker", "audio", "vinyl", "turntable"], es: ["auricular", "auriculares", "altavoz", "audio", "vinilo", "tocadiscos"] } },
  pcgamer:           { label: { fr: "PC Gamer / écran gamer et accessoires", en: "Gaming PC / gaming monitor and accessories", es: "PC gaming / monitor gaming y accesorios" },
                        keywords: { fr: ["pc gamer", "ordinateur gamer", "écran gamer", "clavier gamer", "souris gamer"], en: ["gaming pc", "gaming monitor", "gaming keyboard", "gaming mouse"], es: ["pc gaming", "monitor gaming", "teclado gaming", "ratón gaming"] } },
  electromenager:    { label: { fr: "Électroménager (sèche-cheveux, SodaStream...)", en: "Home appliances (hair dryer, SodaStream...)", es: "Electrodomésticos (secador, SodaStream...)" },
                        keywords: { fr: ["sèche-cheveux", "sodastream", "électroménager"], en: ["hair dryer", "sodastream", "home appliance"], es: ["secador", "sodastream", "electrodoméstico"] } },
  tv:                { label: { fr: "TV", en: "TV", es: "TV" },
                        keywords: { fr: ["télé", "télévision", "tv", "écran tv"], en: ["tv", "television"], es: ["televisor", "televisión", "tv"] } },
  cartouches:        { label: { fr: "Cartouches imprimantes / Accessoires PC", en: "Printer cartridges / PC accessories", es: "Cartuchos de impresora / Accesorios PC" },
                        keywords: { fr: ["cartouche", "encre imprimante"], en: ["cartridge", "printer ink"], es: ["cartucho", "tinta impresora"] } },
  ecranpc:           { label: { fr: "Écrans PC", en: "PC monitors", es: "Monitores PC" },
                        keywords: { fr: ["écran pc", "moniteur"], en: ["pc monitor", "monitor"], es: ["monitor pc", "monitor"] } },
  autreElectro:      { label: { fr: "Autre électroménager", en: "Other home appliances", es: "Otros electrodomésticos" },
                        keywords: { fr: ["autre électroménager"], en: ["other appliance"], es: ["otro electrodoméstico"] } },
  gaming:            { label: { fr: "Gaming (consoles et jeux vidéo)", en: "Gaming (consoles and video games)", es: "Gaming (consolas y videojuegos)" },
                        keywords: { fr: ["console", "jeu vidéo", "jeux vidéo", "playstation", "xbox", "switch"], en: ["console", "video game", "video games", "playstation", "xbox", "switch"], es: ["consola", "videojuego", "videojuegos", "playstation", "xbox", "switch"] } },
  photo:             { label: { fr: "Photo / Drones / Micro", en: "Photo / Drones / Microphones", es: "Foto / Drones / Micrófonos" },
                        keywords: { fr: ["appareil photo", "photo", "drone", "microphone", "micro"], en: ["camera", "photo", "drone", "microphone", "mic"], es: ["cámara", "foto", "dron", "micrófono"] } },
  telephonie:        { label: { fr: "Téléphonie Android (écouteurs, chargeurs...)", en: "Android phones (earphones, chargers...)", es: "Telefonía Android (auriculares, cargadores...)" },
                        keywords: { fr: ["téléphone", "smartphone", "android", "chargeur", "écouteurs sans fil"], en: ["phone", "smartphone", "android", "charger", "wireless earphones"], es: ["teléfono", "smartphone", "android", "cargador", "auriculares inalámbricos"] } },
  trotinette:        { label: { fr: "Trottinettes et figurines POP", en: "Scooters and POP figures", es: "Patinetes y figuras POP" },
                        keywords: { fr: ["trottinette", "trotinette"], en: ["scooter"], es: ["patinete", "scooter"] } },
  escalierSousSol:   { label: { fr: "Escalier vers le sous-sol", en: "Stairs to basement", es: "Escaleras al sótano" },
                        keywords: { fr: ["sous-sol", "sous sol"], en: ["basement"], es: ["sótano"] } }
};

const ENTRANCE_ZONE = "entree";

function findAnswer(question, lang) {
  const q = question.toLowerCase();
  for (const key in ZONES) {
    const list = ZONES[key].keywords[lang] || ZONES[key].keywords.fr;
    if (list.some(k => q.includes(k))) return key;
  }
  return null;
}

// =====================================================================
// DOM & état
// =====================================================================
const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");
const micBtn = document.getElementById("micBtn");
const micLabel = document.getElementById("micLabel");
const vendorBtn = document.getElementById("vendorBtn");
const toast = document.getElementById("toast");
const flagsRow = document.getElementById("flagsRow");
const voiceSelect = document.getElementById("voiceSelect");
const voiceLabel = document.getElementById("voiceLabel");
const pathLine = document.getElementById("pathLine");
const arrivalMarker = document.getElementById("arrivalMarker");
const pathOverlay = document.getElementById("pathOverlay");
const mapGrid = document.getElementById("mapGrid");
const avatarRailText = document.getElementById("avatarRailText");
const chatBoxTitle = document.getElementById("chatBoxTitle");
const disclaimerText = document.getElementById("disclaimerText");
const chatPlaceholderInput = document.getElementById("chatInput");
const quickActions = document.getElementById("quickActions");
const mapTitle = document.getElementById("mapTitle");
const mapSubtitle = document.getElementById("mapSubtitle");
const entreeTile = document.getElementById("entreeTile");

let voiceLang = "fr-FR";
let currentLang = "fr";
let currentHighlightedZone = null;
let manualVoiceURI = null;

function t() { return UI_TEXT[currentLang]; }

function addMessage(text, from) {
  const div = document.createElement("div");
  div.className = "msg " + from;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// =====================================================================
// Traduction complète de l'interface au changement de langue
// =====================================================================
function applyTranslations() {
  const dict = t();
  avatarRailText.textContent = dict.avatarRail;
  chatBoxTitle.textContent = dict.chatBoxTitle;
  disclaimerText.textContent = dict.disclaimer;
  micLabel.textContent = listening ? dict.micListening : (recognition ? dict.micIdle : dict.micUnsupported);
  chatPlaceholderInput.placeholder = dict.chatPlaceholder;
  chatSendBtn.textContent = dict.chatSend;
  voiceLabel.textContent = dict.voiceLabel;
  vendorBtn.textContent = dict.vendorBtn;
  mapTitle.childNodes[0].textContent = dict.mapTitle + " ";
  mapSubtitle.textContent = dict.mapSubtitle;
  entreeTile.textContent = dict.entree;

  // Boutons rapides
  quickActions.innerHTML = "";
  dict.quickActions.forEach(qa => {
    const btn = document.createElement("button");
    btn.className = "quick-btn";
    btn.dataset.zone = qa.zone;
    btn.textContent = qa.label;
    btn.addEventListener("click", () => askAboutZone(qa.zone));
    quickActions.appendChild(btn);
  });

  // Libellés des rayons sur le plan
  document.querySelectorAll(".tile[data-zone]").forEach(tile => {
    const key = tile.dataset.zone;
    if (ZONES[key]) {
      const label = ZONES[key].label[currentLang] || ZONES[key].label.fr;
      const parts = label.split(" (");
      if (parts.length > 1) {
        tile.innerHTML = parts[0] + "<br><span>(" + parts[1];
      } else {
        tile.textContent = label;
      }
    }
  });
}

// =====================================================================
// Voix — uniquement des voix féminines (filtre par nom, best-effort)
// =====================================================================
let availableVoices = [];
const FEMALE_HINTS = {
  "fr-FR": ["amelie", "amélie", "audrey", "aurelie", "aurélie", "female", "femme", "google français", "julie", "léa", "lea", "virginie", "marie", "chantal"],
  "en-US": ["samantha", "female", "zira", "google us english", "aria", "jenny", "susan", "victoria", "karen", "moira", "tessa"],
  "es-ES": ["monica", "mónica", "female", "google español", "elvira", "lucia", "lucía", "paulina", "conchita"]
};

function refreshVoices() {
  availableVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  populateVoiceSelect();
}
if ("speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function femaleVoicesFor(lang) {
  const langPrefix = lang.split("-")[0];
  const hints = FEMALE_HINTS[lang] || [];
  return availableVoices.filter(v =>
    v.lang && v.lang.toLowerCase().startsWith(langPrefix) &&
    hints.some(h => v.name.toLowerCase().includes(h))
  );
}

function populateVoiceSelect() {
  const candidates = femaleVoicesFor(voiceLang);
  voiceSelect.innerHTML = "";

  if (candidates.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = t().voiceNone;
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

  voiceSelect.value = candidates[0].voiceURI;
  manualVoiceURI = candidates[0].voiceURI;
}

voiceSelect.addEventListener("change", () => {
  manualVoiceURI = voiceSelect.value;
});

function pickVoice() {
  if (!manualVoiceURI) return null;
  return availableVoices.find(v => v.voiceURI === manualVoiceURI) || null;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = voiceLang;
  const voice = pickVoice();
  if (voice) utter.voice = voice;
  utter.pitch = 1.15;
  utter.rate = 0.96;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

// =====================================================================
// Plan — surlignage de zone + tracé de chemin dynamique (grille CSS)
// =====================================================================
function clearHighlight() {
  document.querySelectorAll(".tile").forEach(z => z.classList.remove("highlight"));
}

function resizePathOverlay() {
  pathOverlay.setAttribute("width", mapGrid.clientWidth);
  pathOverlay.setAttribute("height", mapGrid.clientHeight);
  pathOverlay.setAttribute("viewBox", "0 0 " + mapGrid.clientWidth + " " + mapGrid.clientHeight);
}

function tileCenter(tile, container) {
  const tRect = tile.getBoundingClientRect();
  const cRect = container.getBoundingClientRect();
  return {
    x: tRect.left - cRect.left + tRect.width / 2,
    y: tRect.top - cRect.top + tRect.height / 2
  };
}

function hidePath() {
  pathLine.setAttribute("d", "");
  arrivalMarker.setAttribute("opacity", "0");
}

function drawPathToZone(zoneKey) {
  const entreeEl = document.querySelector('.tile[data-zone="' + ENTRANCE_ZONE + '"]');
  const targetEl = document.querySelector('.tile[data-zone="' + zoneKey + '"]');
  if (!entreeEl || !targetEl) { hidePath(); return; }

  resizePathOverlay();
  const from = tileCenter(entreeEl, mapGrid);
  const to = tileCenter(targetEl, mapGrid);

  const d = "M " + from.x + " " + from.y + " L " + to.x + " " + from.y + " L " + to.x + " " + to.y;
  pathLine.setAttribute("d", d);
  arrivalMarker.setAttribute("cx", to.x);
  arrivalMarker.setAttribute("cy", to.y);
  arrivalMarker.setAttribute("opacity", "1");
}

function highlightZone(zoneKey) {
  clearHighlight();
  currentHighlightedZone = zoneKey;
  if (!zoneKey) { hidePath(); return; }
  const el = document.querySelector('.tile[data-zone="' + zoneKey + '"]');
  if (el) el.classList.add("highlight");
  drawPathToZone(zoneKey);
}

window.addEventListener("resize", () => {
  if (currentHighlightedZone) drawPathToZone(currentHighlightedZone);
});

// =====================================================================
// Interaction
// =====================================================================
function askAboutZone(zoneKey) {
  const dict = t();
  const zoneName = (ZONES[zoneKey] && ZONES[zoneKey].label[currentLang]) || zoneKey;
  addMessage(zoneName, "user");
  const reply = dict.genericZoneReply(zoneName);
  addMessage(reply, "jeanne");
  speak(reply);
  highlightZone(zoneKey);
}

function askJeanne(question) {
  const dict = t();
  addMessage(question, "user");
  const zoneKey = findAnswer(question, currentLang);
  if (zoneKey) {
    const zoneName = ZONES[zoneKey].label[currentLang];
    const reply = dict.genericZoneReply(zoneName);
    addMessage(reply, "jeanne");
    speak(reply);
    highlightZone(zoneKey);
  } else {
    addMessage(dict.defaultReply, "jeanne");
    speak(dict.defaultReply);
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

flagsRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".flag-btn");
  if (!btn) return;
  document.querySelectorAll(".flag-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  voiceLang = btn.dataset.lang;
  currentLang = voiceLang.split("-")[0];
  if (recognition) recognition.lang = voiceLang;
  populateVoiceSelect();
  applyTranslations();
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
    micLabel.textContent = t().micIdle;
  };
}

micBtn.addEventListener("click", () => {
  if (!recognition) {
    addMessage(t().micUnsupportedCaption, "jeanne");
    return;
  }
  if (listening) { recognition.stop(); return; }
  listening = true;
  recognition.lang = voiceLang;
  micBtn.classList.add("active");
  micLabel.textContent = t().micListening;
  recognition.start();
});

// =====================================================================
// Notification Teams simulée
// =====================================================================
vendorBtn.addEventListener("click", () => {
  const dict = t();
  const zoneName = currentHighlightedZone && ZONES[currentHighlightedZone]
    ? ZONES[currentHighlightedZone].label[currentLang]
    : (currentLang === "fr" ? "le magasin" : currentLang === "en" ? "the store" : "la tienda");
  const msg = dict.vendorConfirm(zoneName);
  addMessage(msg, "jeanne");
  speak(msg);
  toast.textContent = dict.toastPrefix + zoneName;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
});

// =====================================================================
// Démarrage
// =====================================================================
if (!SpeechRecognition) {
  micLabel.textContent = UI_TEXT.fr.micUnsupported;
}
applyTranslations();
addMessage(UI_TEXT.fr.greeting, "jeanne");
