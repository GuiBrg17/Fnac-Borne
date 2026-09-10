const ZONES = {
  telephonie:  { x: 0, z: -4.5, w: 4, d: 2, label: { fr: "RDC : Téléphonie", en: "Ground: Mobile", es: "Planta baja: Móviles" } },
  escalier:    { x: 3.5, z: -4.5, w: 2, d: 2, label: { fr: "Escalier ⬇️", en: "Stairs ⬇️", es: "Escaleras ⬇️" } },
  apple:       { x: -3.5, z: -1, w: 2.5, d: 1.5, label: { fr: "Sous-sol : Apple", en: "Basement: Apple", es: "Sótano: Apple" } },
  son:         { x: -3.5, z: 1, w: 2.5, d: 1.5, label: { fr: "Sous-sol : Son", en: "Basement: Audio", es: "Sótano: Audio" } },
  tv:          { x: -3.5, z: 3, w: 2.5, d: 1.5, label: { fr: "Sous-sol : Télévisions", en: "Basement: TVs", es: "Sótano: Televisores" } },
  pc_windows:  { x: 0, z: -1.5, w: 3, d: 2, label: { fr: "Sous-sol : PC & Tablettes", en: "Basement: PCs", es: "Sótano: PCs" } },
  pc_gaming:   { x: 0, z: 1.5, w: 3, d: 3, label: { fr: "Sous-sol : PC Gaming", en: "Basement: PC Gaming", es: "Sótano: PC Gaming" } },
  caisses:     { x: 3.5, z: -1, w: 2.5, d: 1.5, label: { fr: "Sous-sol : Caisses", en: "Basement: Checkout", es: "Sótano: Cajas" } },
  accessoires: { x: 3.5, z: 1, w: 2.5, d: 1.5, label: { fr: "Sous-sol : Périphériques", en: "Basement: Accessories", es: "Sótano: Periféricos" } },
  gaming:      { x: 3.5, z: 3, w: 2.5, d: 1.5, label: { fr: "Sous-sol : Jeux Vidéo", en: "Basement: Games", es: "Sótano: Videojuegos" } }
};

const KNOWLEDGE_BASE = [
  { zone: "telephonie", keywords: { fr: ["téléphone", "smartphone", "android", "forfait", "samsung"], en: ["phone", "smartphone", "mobile"], es: ["teléfono", "móvil", "smartphone"] }, reply: { fr: "La téléphonie se trouve ici même, au rez-de-chaussée, dès l'entrée.", en: "Phones are right here on the ground floor at the entrance.", es: "La telefonía está aquí mismo, en la planta baja." } },
  { zone: "apple", keywords: { fr: ["apple", "macbook", "iphone", "ipad", "mac"], en: ["apple", "macbook", "iphone", "ipad", "mac"], es: ["apple", "macbook", "iphone", "ipad", "mac"] }, reply: { fr: "L'espace Apple est au sous-sol. Prenez l'escalier à droite, ce sera sur la rangée de gauche.", en: "The Apple area is in the basement. Take the stairs on the right, it's on the left aisle.", es: "La zona Apple está en el sótano. Baje las escaleras a la derecha, está en el pasillo izquierdo." } },
  { zone: "son", keywords: { fr: ["casque", "écouteur", "audio", "enceinte", "son"], en: ["headphone", "audio", "speaker"], es: ["auricular", "altavoz", "audio"] }, reply: { fr: "Le rayon Son est au sous-sol, au milieu de la rangée de gauche après l'espace Apple.", en: "Audio is in the basement, middle of the left aisle past Apple.", es: "La sección de Audio está en el sótano, en medio del pasillo izquierdo tras Apple." } },
  { zone: "tv", keywords: { fr: ["télévision", "tv", "télé", "écran"], en: ["television", "tv", "screen"], es: ["televisión", "televisor", "pantalla"] }, reply: { fr: "Les télévisions sont au sous-sol, tout au fond de la rangée de gauche.", en: "TVs are in the basement, at the very back of the left aisle.", es: "Los televisores están en el sótano, al fondo del pasillo izquierdo." } },
  { zone: "pc_windows", keywords: { fr: ["ordinateur", "pc", "portable", "tablette", "windows"], en: ["computer", "laptop", "tablet", "windows"], es: ["ordenador", "portátil", "tablet", "windows"] }, reply: { fr: "Les PC et tablettes Windows sont au sous-sol, au début de la rangée centrale.", en: "Windows PCs and tablets are in the basement, at the start of the middle aisle.", es: "Los ordenadores y tablets Windows están en el sótano, al inicio del pasillo central." } },
  { zone: "pc_gaming", keywords: { fr: ["pc gamer", "pc gaming", "écran gamer", "asus", "msi"], en: ["gaming pc", "gaming monitor"], es: ["pc gaming", "monitor gaming"] }, reply: { fr: "L'espace PC Gaming est au sous-sol, sur la deuxième partie de la rangée centrale.", en: "PC Gaming is in the basement, on the second half of the middle aisle.", es: "La zona PC Gaming está en el sótano, en la segunda mitad del pasillo central." } },
  { zone: "caisses", keywords: { fr: ["caisse", "payer", "régler", "achat"], en: ["checkout", "pay", "cashier"], es: ["caja", "pagar", "cobrar"] }, reply: { fr: "Les caisses sont situées au sous-sol, sur la droite juste en bas de l'escalier.", en: "Checkouts are in the basement, on the right just down the stairs.", es: "Las cajas están en el sótano, a la derecha justo al bajar las escaleras." } },
  { zone: "accessoires", keywords: { fr: ["disque dur", "imprimante", "souris", "clavier", "accessoire"], en: ["hard drive", "printer", "mouse", "keyboard"], es: ["disco duro", "impresora", "ratón", "teclado"] }, reply: { fr: "Les disques durs et imprimantes sont au sous-sol, au milieu de la rangée de droite après les caisses.", en: "Hard drives and printers are in the basement, middle of the right aisle past checkouts.", es: "Discos duros e impresoras están en el sótano, en el medio del pasillo derecho tras las cajas." } },
  { zone: "gaming", keywords: { fr: ["console", "jeu vidéo", "jeux", "playstation", "xbox", "nintendo"], en: ["console", "video game", "playstation", "xbox"], es: ["consola", "videojuego", "playstation", "xbox"] }, reply: { fr: "Le rayon Jeux Vidéo est au sous-sol, tout au fond de la rangée de droite.", en: "Video games are in the basement, at the very back of the right aisle.", es: "Los videojuegos están en el sótano, al fondo del pasillo derecho." } }
];

const DEFAULT_REPLY = { fr: "Je ne suis pas certaine de comprendre. Pouvez-vous reformuler, ou préférez-vous qu'un vendeur vienne vous aider ?", en: "I'm not sure I understood. Could you rephrase, or would you like a staff member to help you instead?", es: "No estoy segura de haber entendido. ¿Puede reformular, o prefiere que un vendedor le ayude?" };
const GREETING = { fr: "Bonjour, je suis Jeanne. Parlez-moi ou écrivez votre question.", en: "Hello, I'm Jeanne. Speak to me, or type your question.", es: "Hola, soy Jeanne. Hábleme o escriba su pregunta." };

const UI_DICT = {
  fr: { mic: "Parler à Jeanne", placeholder: "Ex : où sont les disques durs ?", greet: GREETING.fr },
  en: { mic: "Speak to Jeanne", placeholder: "Ex: where are the hard drives?", greet: GREETING.en },
  es: { mic: "Hablar con Jeanne", placeholder: "Ej: ¿dónde están los discos duros?", greet: GREETING.es }
};

let voiceLang = "fr-FR";
const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const avatarCaption = document.getElementById("avatarCaption");
const micBtn = document.getElementById("micBtn");
const micLabel = document.getElementById("micLabel");
const listeningRing = document.getElementById("listeningRing");
const vendorBtn = document.getElementById("vendorBtn");
const toast = document.getElementById("toast");

document.getElementById("langFlags").addEventListener("click", (e) => {
  if (!e.target.classList.contains("flag-btn")) return;
  document.querySelectorAll(".flag-btn").forEach(b => { b.classList.remove("active"); b.style.filter = "grayscale(100%)"; });
  e.target.classList.add("active"); e.target.style.filter = "none";
  const lang = e.target.dataset.lang;
  voiceLang = lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "es-ES";
  if (recognition) recognition.lang = voiceLang;
  micLabel.textContent = UI_DICT[lang].mic; chatInput.placeholder = UI_DICT[lang].placeholder; avatarCaption.textContent = UI_DICT[lang].greet;
});

function detectLanguage(text) {
  const t = " " + text.toLowerCase() + " ";
  const scores = { fr: 0, en: 0, es: 0 };
  const markers = { fr: [" le ", " la ", " les ", " où ", " je ", " vous "], en: [" the ", " where ", " i ", " you ", " is "], es: [" el ", " la ", " los ", " dónde ", " yo ", " usted ", "¿"] };
  for (const lang in markers) markers[lang].forEach(m => { if (t.includes(m)) scores[lang]++; });
  let best = "fr", bestScore = -1;
  for (const lang in scores) if (scores[lang] > bestScore) { bestScore = scores[lang]; best = lang; }
  return best;
}

function findAnswer(question, lang) {
  const q = question.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    const list = entry.keywords[lang] || entry.keywords.fr;
    if (list.some(k => q.includes(k))) return entry;
  }
  return null;
}

function addMessage(text, from) {
  const div = document.createElement("div"); div.className = "msg " + from; div.textContent = text;
  chatLog.appendChild(div); chatLog.scrollTop = chatLog.scrollHeight;
}

let availableVoices = [];
const FEMALE_HINTS = { "fr-FR": ["amelie", "female", "femme", "hortense"], "en-US": ["samantha", "female", "zira"], "es-ES": ["monica", "female", "elvira"] };
function refreshVoices() { availableVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
if ("speechSynthesis" in window) { refreshVoices(); window.speechSynthesis.onvoiceschanged = refreshVoices; }

function pickVoice(lang) {
  const langPrefix = lang.split("-")[0];
  const candidates = availableVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
  if (candidates.length === 0) return null;
  const hints = FEMALE_HINTS[lang] || [];
  return candidates.find(v => hints.some(h => v.name.toLowerCase().includes(h))) || candidates[0];
}

function speak(text, lang) {
  avatarCaption.style.opacity = 0;
  setTimeout(() => { avatarCaption.textContent = text; avatarCaption.style.opacity = 1; }, 150);
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang; const voice = pickVoice(lang); if (voice) utter.voice = voice;
  utter.pitch = 1.12; utter.rate = 0.96; window.speechSynthesis.speak(utter);
}

function askJeanne(question) {
  const lang = detectLanguage(question);
  addMessage(question, "user");
  const answer = findAnswer(question, lang);
  const langTag = lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "es-ES";
  if (answer) { addMessage(answer.reply[lang], "jeanne"); speak(answer.reply[lang], langTag); highlightZone3D(answer.zone); } 
  else { addMessage(DEFAULT_REPLY[lang], "jeanne"); speak(DEFAULT_REPLY[lang], langTag); highlightZone3D(null); }
}

chatForm.addEventListener("submit", (e) => { e.preventDefault(); const value = chatInput.value.trim(); if (!value) return; askJeanne(value); chatInput.value = ""; });
document.querySelectorAll(".quick-btn").forEach(btn => { btn.addEventListener("click", () => askJeanne(btn.dataset.q)); });

let recognition = null, listening = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition(); recognition.lang = voiceLang; recognition.interimResults = false;
  recognition.onresult = (event) => askJeanne(event.results[0][0].transcript);
  recognition.onend = () => { listening = false; micBtn.classList.remove("active"); listeningRing.classList.remove("active"); micLabel.textContent = UI_DICT[voiceLang.split("-")[0]].mic; };
} else { micLabel.textContent = "Micro non supporté"; }

micBtn.addEventListener("click", () => {
  if (!recognition) return;
  if (listening) { recognition.stop(); return; }
  listening = true; recognition.lang = voiceLang; micBtn.classList.add("active"); listeningRing.classList.add("active");
  micLabel.textContent = "Écoute en cours..."; avatarCaption.textContent = "Écoute en cours..."; recognition.start();
});

vendorBtn.addEventListener("click", () => {
  const zoneName = currentHighlightedZone ? ZONES[currentHighlightedZone].label.fr : "le magasin";
  addMessage("Un vendeur du rayon " + zoneName + " a été prévenu.", "jeanne");
  toast.textContent = "🔔 Notification Teams envoyée — Rayon : " + zoneName; toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
});

let bgScene, bgCamera, bgRenderer;
function initBackground() {
  const canvas = document.getElementById("bgCanvas");
  bgScene = new THREE.Scene(); bgCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  bgCamera.position.set(0, 0, 14); bgRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  bgRenderer.setSize(window.innerWidth, window.innerHeight); bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  bgScene.add(new THREE.AmbientLight(0xffffff, 0.35)); animateBackground();
}
function animateBackground() { requestAnimationFrame(animateBackground); bgRenderer.render(bgScene, bgCamera); }

let avatarScene, avatarCamera, avatarRenderer, avatarGroup, clock = new THREE.Clock();
function initAvatar() {
  const canvas = document.getElementById("avatarCanvas"); const width = canvas.clientWidth, height = canvas.clientHeight;
  avatarScene = new THREE.Scene(); avatarCamera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
  avatarCamera.position.set(0, 1.55, 5.2); avatarCamera.lookAt(0, 1.2, 0);
  avatarRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  avatarRenderer.setSize(width, height); avatarRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  avatarScene.add(new THREE.DirectionalLight(0xffffff, 1.0).position.set(2, 4, 3));
  
  const loader = new THREE.GLTFLoader();
  loader.load('jeanne_realiste.glb', function (gltf) {
    const model = gltf.scene; model.position.set(0, 0.5, 0); avatarScene.add(model); avatarGroup = model;
  }, undefined, function(error) {
    console.error("Erreur de chargement du modèle:", error);
  });
  animateAvatar(); window.addEventListener("resize", resizeAvatar);
}
function resizeAvatar() {
  const canvas = document.getElementById("avatarCanvas"); avatarCamera.aspect = canvas.clientWidth / canvas.clientHeight;
  avatarCamera.updateProjectionMatrix(); avatarRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
}
function animateAvatar() {
  requestAnimationFrame(animateAvatar); const t = clock.getElapsedTime();
  if (avatarGroup) { avatarGroup.position.y = Math.sin(t * 1.2) * 0.02 + 0.5; }
  avatarRenderer.render(avatarScene, avatarCamera);
}

let mapScene, mapCamera, mapRenderer, zoneMeshes = {};
let currentHighlightedZone = null;
function initMap() {
  const canvas = document.getElementById("mapCanvas"); const width = canvas.clientWidth, height = canvas.clientHeight;
  mapScene = new THREE.Scene(); 
  const aspect = width / height, viewSize = 9;
  mapCamera = new THREE.OrthographicCamera(-viewSize * aspect / 2, viewSize * aspect / 2, viewSize / 2, -viewSize / 2, 0.1, 100);
  mapCamera.position.set(6, 8, 6); mapCamera.lookAt(0, 0, 0);
  mapRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); mapRenderer.setSize(width, height);
  
  for (const key in ZONES) {
    const z = ZONES[key];
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(z.w, 0.6, z.d), new THREE.MeshStandardMaterial({ color: 0x14232A, emissive: 0x37E6FF, emissiveIntensity: 0.18 }));
    mesh.position.set(z.x, 0.3, z.z); mapScene.add(mesh);
    zoneMeshes[key] = { mesh, baseColor: new THREE.Color(0x14232A), baseEmissive: new THREE.Color(0x37E6FF), baseEmissiveIntensity: 0.18, targetColor: new THREE.Color(0x14232A), targetEmissive: new THREE.Color(0x37E6FF), targetEmissiveIntensity: 0.18, targetScaleY: 1 };
  }
  animateMap();
}
function animateMap() {
  requestAnimationFrame(animateMap);
  for (const key in zoneMeshes) {
    const z = zoneMeshes[key]; z.mesh.material.color.lerp(z.targetColor, 0.12); z.mesh.material.emissive.lerp(z.targetEmissive, 0.12);
    z.mesh.material.emissiveIntensity += (z.targetEmissiveIntensity - z.mesh.material.emissiveIntensity) * 0.12; z.mesh.scale.y += (z.targetScaleY - z.mesh.scale.y) * 0.15;
  }
  mapRenderer.render(mapScene, mapCamera);
}
function highlightZone3D(zoneKey) {
  for (const key in zoneMeshes) {
    const z = zoneMeshes[key]; z.targetColor = z.baseColor.clone(); z.targetEmissive = z.baseEmissive.clone(); z.targetEmissiveIntensity = z.baseEmissiveIntensity; z.targetScaleY = 1;
  }
  currentHighlightedZone = zoneKey;
  if (zoneKey && zoneMeshes[zoneKey]) {
    zoneMeshes[zoneKey].targetColor = new THREE.Color(0x2A0A0D); zoneMeshes[zoneKey].targetEmissive = new THREE.Color(0xFF2A3C); zoneMeshes[zoneKey].targetEmissiveIntensity = 0.9; zoneMeshes[zoneKey].targetScaleY = 1.5;
  }
}

window.addEventListener("load", () => { initBackground(); initAvatar(); initMap(); addMessage(GREETING.fr, "jeanne"); });
