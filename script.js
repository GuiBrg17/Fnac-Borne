// =====================================================================
// Base de connaissances multilingue (démo)
// =====================================================================
const ZONES = {
  informatique: { x: -3.2, z: -2.2, w: 2.6, d: 2, color: 0xEDEAE0, label: { fr: "Informatique", en: "Computers", es: "Informática" } },
  audio:        { x:  0,   z: -2.2, w: 2.6, d: 2, color: 0xEDEAE0, label: { fr: "Son & audio", en: "Audio", es: "Audio" } },
  jeux:         { x:  3.2, z: -2.2, w: 2.6, d: 2, color: 0xEDEAE0, label: { fr: "Jeux vidéo", en: "Video games", es: "Videojuegos" } },
  livres:       { x: -3.2, z:  2.2, w: 2.6, d: 2, color: 0xEDEAE0, label: { fr: "Livres", en: "Books", es: "Libros" } },
  photo:        { x:  3.2, z:  2.2, w: 2.6, d: 2, color: 0xEDEAE0, label: { fr: "Photo & vidéo", en: "Photo & video", es: "Foto y vídeo" } },
  caisses:      { x:  0,   z:  2.2, w: 2.6, d: 2, color: 0xE3DFD3, label: { fr: "Caisses", en: "Checkout", es: "Cajas" } }
};

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

function detectLanguage(text) {
  const t = " " + text.toLowerCase() + " ";
  const scores = { fr: 0, en: 0, es: 0 };
  const markers = {
    fr: [" le ", " la ", " les ", " où ", " je ", " vous ", " des ", " un ", " une ", "é", "è"],
    en: [" the ", " where ", " i ", " you ", " a ", " an ", " is ", " are ", " find "],
    es: [" el ", " la ", " los ", " dónde ", " yo ", " usted ", " un ", " una ", "ñ", "¿"]
  };
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

// =====================================================================
// DOM & état
// =====================================================================
const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const avatarCaption = document.getElementById("avatarCaption");
const micBtn = document.getElementById("micBtn");
const micLabel = document.getElementById("micLabel");
const listeningRing = document.getElementById("listeningRing");
const vendorBtn = document.getElementById("vendorBtn");
const toast = document.getElementById("toast");
const langOptions = document.getElementById("langOptions");

let voiceLang = "fr-FR";

function addMessage(text, from) {
  const div = document.createElement("div");
  div.className = "msg " + from;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// =====================================================================
// Voix — sélection d'une voix féminine plus naturelle par langue
// =====================================================================
let availableVoices = [];
const FEMALE_HINTS = {
  "fr-FR": ["amelie", "audrey", "aurelie", "female", "femme", "google français", "julie", "léa", "lea"],
  "en-US": ["samantha", "female", "zira", "google us english", "aria", "jenny"],
  "es-ES": ["monica", "mónica", "female", "google español", "elvira", "lucia", "lucía"]
};

function refreshVoices() {
  availableVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}
if ("speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function pickVoice(lang) {
  const langPrefix = lang.split("-")[0];
  const candidates = availableVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
  if (candidates.length === 0) return null;
  const hints = FEMALE_HINTS[lang] || [];
  const femaleMatch = candidates.find(v => hints.some(h => v.name.toLowerCase().includes(h)));
  return femaleMatch || candidates[0];
}

function speak(text, lang) {
  avatarCaption.style.opacity = 0;
  setTimeout(() => { avatarCaption.textContent = text; avatarCaption.style.opacity = 1; }, 150);
  triggerTalkAnimation();
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  const voice = pickVoice(lang);
  if (voice) utter.voice = voice;
  // Réglages pour une voix plus chaleureuse et naturelle
  utter.pitch = 1.12;
  utter.rate = 0.96;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

function askJeanne(question) {
  const lang = detectLanguage(question);
  addMessage(question, "user");
  const answer = findAnswer(question, lang);
  const langTag = lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "es-ES";
  if (answer) {
    addMessage(answer.reply[lang], "jeanne");
    speak(answer.reply[lang], langTag);
    highlightZone3D(answer.zone);
  } else {
    addMessage(DEFAULT_REPLY[lang], "jeanne");
    speak(DEFAULT_REPLY[lang], langTag);
    highlightZone3D(null);
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
  if (recognition) recognition.lang = voiceLang;
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
    listeningRing.classList.remove("active");
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
  listeningRing.classList.add("active");
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
// FOND 3D — particules et formes produits flottantes en arrière-plan
// =====================================================================
let bgScene, bgCamera, bgRenderer, bgShapes = [];

function initBackground() {
  const canvas = document.getElementById("bgCanvas");
  bgScene = new THREE.Scene();
  bgCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  bgCamera.position.set(0, 0, 14);

  bgRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  bgRenderer.setSize(window.innerWidth, window.innerHeight);
  bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  bgScene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const l1 = new THREE.DirectionalLight(0x37E6FF, 0.9);
  l1.position.set(5, 5, 5);
  bgScene.add(l1);
  const l2 = new THREE.DirectionalLight(0xFF2A3C, 0.6);
  l2.position.set(-5, -3, 4);
  bgScene.add(l2);

  // Formes géométriques néon (fil de fer + solides sombres) évoquant les univers Fnac
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x0C1418, metalness: 0.7, roughness: 0.25, emissive: 0x0B2A33, emissiveIntensity: 0.4 }),
    new THREE.MeshBasicMaterial({ color: 0xFF2A3C, wireframe: true }),
    new THREE.MeshBasicMaterial({ color: 0x37E6FF, wireframe: true })
  ];
  const geometries = [
    new THREE.TorusGeometry(0.6, 0.18, 16, 40),     // disque / vinyle
    new THREE.BoxGeometry(0.9, 1.2, 0.15),          // livre
    new THREE.TorusKnotGeometry(0.45, 0.14, 80, 12),// forme technologique
    new THREE.OctahedronGeometry(0.6),              // jeu vidéo (facettes)
    new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32)   // appareil photo simplifié
  ];

  const count = 9;
  for (let i = 0; i < count; i++) {
    const geo = geometries[i % geometries.length];
    const mat = materials[i % materials.length];
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 22,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 10 - 4
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const scale = 0.6 + Math.random() * 0.9;
    mesh.scale.set(scale, scale, scale);
    bgScene.add(mesh);
    bgShapes.push({
      mesh,
      speed: 0.05 + Math.random() * 0.08,
      driftX: (Math.random() - 0.5) * 0.002,
      driftY: (Math.random() - 0.5) * 0.002
    });
  }

  animateBackground();
  window.addEventListener("resize", () => {
    bgCamera.aspect = window.innerWidth / window.innerHeight;
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animateBackground() {
  requestAnimationFrame(animateBackground);
  bgShapes.forEach(s => {
    s.mesh.rotation.x += s.speed * 0.01;
    s.mesh.rotation.y += s.speed * 0.015;
    s.mesh.position.x += s.driftX;
    s.mesh.position.y += s.driftY;
  });
  bgRenderer.render(bgScene, bgCamera);
}

// =====================================================================
// AVATAR 3D
// =====================================================================
let avatarScene, avatarCamera, avatarRenderer, avatarGroup, headGroup, jawMesh;
let talkTimer = null;
let clock = new THREE.Clock();

function initAvatar() {
  const canvas = document.getElementById("avatarCanvas");
  const width = canvas.clientWidth, height = canvas.clientHeight;

  avatarScene = new THREE.Scene();
  avatarCamera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
  avatarCamera.position.set(0, 1.55, 5.2);
  avatarCamera.lookAt(0, 1.2, 0);

  avatarRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  avatarRenderer.setSize(width, height);
  avatarRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(2, 4, 3);
  avatarScene.add(key);
  const fill = new THREE.DirectionalLight(0x37E6FF, 0.6);
  fill.position.set(-3, 1, 2);
  avatarScene.add(fill);
  const rim = new THREE.DirectionalLight(0xFF2A3C, 0.5);
  rim.position.set(0, 2, -3);
  avatarScene.add(rim);
  avatarScene.add(new THREE.AmbientLight(0x8FA0B0, 0.4));

  avatarGroup = new THREE.Group();
  avatarScene.add(avatarGroup);

  const steel = new THREE.MeshStandardMaterial({ color: 0xC2CDD6, metalness: 0.85, roughness: 0.2, emissive: 0x0B2A33, emissiveIntensity: 0.15 });
  const steelDark = new THREE.MeshStandardMaterial({ color: 0x7C8896, metalness: 0.8, roughness: 0.25, emissive: 0x0B2A33, emissiveIntensity: 0.1 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xE8B98C, roughness: 0.6 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x4A2F1C, roughness: 0.7 });
  const cape = new THREE.MeshStandardMaterial({ color: 0x5A0F17, roughness: 0.7, side: THREE.DoubleSide, emissive: 0xFF2A3C, emissiveIntensity: 0.08 });
  const red = new THREE.MeshStandardMaterial({ color: 0xFF2A3C, roughness: 0.3, metalness: 0.3, emissive: 0xFF2A3C, emissiveIntensity: 0.5 });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.65, 4, 12), steel);
  torso.position.y = 1.05;
  avatarGroup.add(torso);

  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.06), red);
  badge.position.set(0, 1.15, 0.42);
  avatarGroup.add(badge);
  const badgeText = makeTextSprite("fnac", "#EAF6FF", 64);
  badgeText.scale.set(0.34, 0.14, 1);
  badgeText.position.set(0, 1.15, 0.47);
  avatarGroup.add(badgeText);

  [-1, 1].forEach(side => {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), steelDark);
    shoulder.position.set(side * 0.46, 1.42, 0);
    avatarGroup.add(shoulder);
  });
  [-1, 1].forEach(side => {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.55, 4, 8), steel);
    arm.position.set(side * 0.5, 0.95, 0);
    arm.rotation.z = side * 0.12;
    avatarGroup.add(arm);
  });
  [-1, 1].forEach(side => {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.7, 4, 8), steelDark);
    leg.position.set(side * 0.2, 0.25, 0);
    avatarGroup.add(leg);
  });

  const capeMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.3, 4, 6), cape);
  capeMesh.position.set(0, 0.75, -0.3);
  capeMesh.rotation.x = 0.15;
  avatarGroup.add(capeMesh);

  headGroup = new THREE.Group();
  headGroup.position.y = 1.78;
  avatarGroup.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.18, 10), skin);
  neck.position.y = -0.1;
  headGroup.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20), skin);
  headGroup.add(head);

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
  hairCap.position.y = 0.05;
  headGroup.add(hairCap);

  [-1, 1].forEach(side => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshStandardMaterial({ color: 0x2A2620 }));
    eye.position.set(side * 0.09, 0.02, 0.24);
    headGroup.add(eye);
  });

  jawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.08), skin);
  jawMesh.position.set(0, -0.14, 0.2);
  headGroup.add(jawMesh);

  animateAvatar();
  window.addEventListener("resize", resizeAvatar);
}

function makeTextSprite(text, color, fontSize) {
  const cnv = document.createElement("canvas");
  cnv.width = 256; cnv.height = 96;
  const ctx = cnv.getContext("2d");
  ctx.font = "bold " + fontSize + "px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cnv.width / 2, cnv.height / 2);
  const texture = new THREE.CanvasTexture(cnv);
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
}

function resizeAvatar() {
  const canvas = document.getElementById("avatarCanvas");
  const width = canvas.clientWidth, height = canvas.clientHeight;
  avatarCamera.aspect = width / height;
  avatarCamera.updateProjectionMatrix();
  avatarRenderer.setSize(width, height);
}

function animateAvatar() {
  requestAnimationFrame(animateAvatar);
  const t = clock.getElapsedTime();
  if (avatarGroup) {
    avatarGroup.position.y = Math.sin(t * 1.2) * 0.02;
    avatarGroup.rotation.y = Math.sin(t * 0.4) * 0.08;
  }
  avatarRenderer.render(avatarScene, avatarCamera);
}

function triggerTalkAnimation() {
  if (talkTimer) clearInterval(talkTimer);
  let open = false, ticks = 0;
  talkTimer = setInterval(() => {
    open = !open;
    jawMesh.scale.y = open ? 2.2 : 1;
    ticks++;
    if (ticks > 10) { clearInterval(talkTimer); jawMesh.scale.y = 1; }
  }, 130);
}

// =====================================================================
// PLAN 3D — avec transition douce des surlignages
// =====================================================================
let mapScene, mapCamera, mapRenderer, zoneMeshes = {};
let currentHighlightedZone = null;

function initMap() {
  const canvas = document.getElementById("mapCanvas");
  const width = canvas.clientWidth, height = canvas.clientHeight;

  mapScene = new THREE.Scene();
  const aspect = width / height;
  const viewSize = 6.5;
  mapCamera = new THREE.OrthographicCamera(-viewSize * aspect / 2, viewSize * aspect / 2, viewSize / 2, -viewSize / 2, 0.1, 100);
  mapCamera.position.set(6, 6, 6);
  mapCamera.lookAt(0, 0, 0);

  mapRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  mapRenderer.setSize(width, height);
  mapRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  mapScene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dl = new THREE.DirectionalLight(0x37E6FF, 0.7);
  dl.position.set(4, 8, 2);
  mapScene.add(dl);

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(9.6, 0.15, 6.8),
    new THREE.MeshStandardMaterial({ color: 0x0C1418, emissive: 0x0B2A33, emissiveIntensity: 0.3 })
  );
  floor.position.y = -0.1;
  mapScene.add(floor);

  // Grille néon sur le sol du plan
  const gridHelper = new THREE.GridHelper(9.6, 16, 0x37E6FF, 0x184049);
  gridHelper.position.y = -0.02;
  mapScene.add(gridHelper);

  for (const key in ZONES) {
    const z = ZONES[key];
    const h = key === "caisses" ? 0.35 : 0.6;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(z.w, h, z.d),
      new THREE.MeshStandardMaterial({ color: 0x14232A, emissive: 0x37E6FF, emissiveIntensity: 0.18, metalness: 0.4, roughness: 0.4 })
    );
    mesh.position.set(z.x, h / 2, z.z);
    mapScene.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: 0x37E6FF })
    );
    mesh.add(edges);

    zoneMeshes[key] = {
      mesh,
      baseColor: new THREE.Color(0x14232A),
      baseEmissive: new THREE.Color(0x37E6FF),
      baseEmissiveIntensity: 0.18,
      targetColor: new THREE.Color(0x14232A),
      targetEmissive: new THREE.Color(0x37E6FF),
      targetEmissiveIntensity: 0.18,
      targetScaleY: 1
    };

    const label = makeTextSprite(z.label.fr, "#9FE9FF", 40);
    label.scale.set(1.6, 0.5, 1);
    label.position.set(z.x, h + 0.4, z.z);
    mapScene.add(label);
  }

  const entranceLabel = makeTextSprite("🚪 Entrée", "#7C93A6", 40);
  entranceLabel.scale.set(1.6, 0.5, 1);
  entranceLabel.position.set(4.2, 0.6, 3.6);
  mapScene.add(entranceLabel);

  animateMap();
  window.addEventListener("resize", resizeMap);
}

function resizeMap() {
  const canvas = document.getElementById("mapCanvas");
  const width = canvas.clientWidth, height = canvas.clientHeight;
  const aspect = width / height;
  const viewSize = 6.5;
  mapCamera.left = -viewSize * aspect / 2;
  mapCamera.right = viewSize * aspect / 2;
  mapCamera.top = viewSize / 2;
  mapCamera.bottom = -viewSize / 2;
  mapCamera.updateProjectionMatrix();
  mapRenderer.setSize(width, height);
}

function animateMap() {
  requestAnimationFrame(animateMap);
  // Transition douce (lerp) des couleurs, émissions et hauteurs de rayons
  for (const key in zoneMeshes) {
    const z = zoneMeshes[key];
    z.mesh.material.color.lerp(z.targetColor, 0.12);
    z.mesh.material.emissive.lerp(z.targetEmissive, 0.12);
    z.mesh.material.emissiveIntensity += (z.targetEmissiveIntensity - z.mesh.material.emissiveIntensity) * 0.12;
    z.mesh.scale.y += (z.targetScaleY - z.mesh.scale.y) * 0.15;
  }
  mapRenderer.render(mapScene, mapCamera);
}

function highlightZone3D(zoneKey) {
  for (const key in zoneMeshes) {
    const z = zoneMeshes[key];
    z.targetColor = z.baseColor.clone();
    z.targetEmissive = z.baseEmissive.clone();
    z.targetEmissiveIntensity = z.baseEmissiveIntensity;
    z.targetScaleY = 1;
  }
  currentHighlightedZone = zoneKey;
  if (zoneKey && zoneMeshes[zoneKey]) {
    zoneMeshes[zoneKey].targetColor = new THREE.Color(0x2A0A0D);
    zoneMeshes[zoneKey].targetEmissive = new THREE.Color(0xFF2A3C);
    zoneMeshes[zoneKey].targetEmissiveIntensity = 0.9;
    zoneMeshes[zoneKey].targetScaleY = 1.5;
  }
}

// =====================================================================
// Démarrage
// =====================================================================
window.addEventListener("load", () => {
  initBackground();
  initAvatar();
  initMap();
  addMessage(GREETING.fr, "jeanne");
});
