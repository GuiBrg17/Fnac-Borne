// --- Base de connaissances (démo) ---
// En production, ceci serait remplacé par un vrai catalogue produit + un LLM.
const KNOWLEDGE_BASE = [
  {
    keywords: ["disque dur", "disque", "ssd", "stockage"],
    zone: "informatique",
    reply: "Vous trouverez les disques durs et SSD au rayon Informatique, en haut à gauche du magasin.",
    detail: "Nous avons des modèles Western Digital, Seagate et Crucial, de 500 Go à 4 To. Voulez-vous un disque externe ou interne ?"
  },
  {
    keywords: ["casque", "écouteur", "audio", "enceinte", "son"],
    zone: "audio",
    reply: "Le rayon Son & Audio se trouve juste à côté de l'Informatique, au centre du magasin.",
    detail: "Vous y trouverez des casques Sony, Bose et JBL, ainsi que des enceintes connectées."
  },
  {
    keywords: ["console", "jeu vidéo", "jeux vidéo", "playstation", "xbox", "switch"],
    zone: "jeux",
    reply: "Le rayon Jeux vidéo est situé en haut à droite du magasin.",
    detail: "PS5, Xbox Series et Switch sont disponibles, avec une sélection de jeux récents en tête de gondole."
  },
  {
    keywords: ["livre", "roman", "bd", "manga"],
    zone: "livres",
    reply: "Les livres sont rangés en bas à gauche, dans l'espace Librairie.",
    detail: "Romans, BD et mangas sont classés par genre, avec les nouveautés en vitrine."
  },
  {
    keywords: ["photo", "appareil photo", "caméra", "vidéo"],
    zone: "photo",
    reply: "Le rayon Photo & vidéo se trouve en bas à droite du magasin.",
    detail: "Nous avons des appareils Canon, Sony et Nikon, ainsi que des accessoires pour créateurs de contenu."
  }
];

const DEFAULT_REPLY = "Je ne suis pas certaine de comprendre. Pouvez-vous reformuler, ou préférez-vous qu'un vendeur vienne vous aider ?";

function findAnswer(question) {
  const q = question.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some(k => q.includes(k))) return entry;
  }
  return null;
}

// --- Éléments DOM ---
const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const avatarCaption = document.getElementById("avatarCaption");
const micBtn = document.getElementById("micBtn");
const listeningRing = document.getElementById("listeningRing");
const vendorBtn = document.getElementById("vendorBtn");
const toast = document.getElementById("toast");
const mouth = document.getElementById("mouth");

function addMessage(text, from) {
  const div = document.createElement("div");
  div.className = "msg " + from;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function clearZoneHighlight() {
  document.querySelectorAll(".zone").forEach(z => z.classList.remove("highlight"));
}

function highlightZone(zone) {
  clearZoneHighlight();
  const el = document.querySelector('.zone[data-zone="' + zone + '"]');
  if (el) el.classList.add("highlight");
}

function speak(text) {
  avatarCaption.textContent = text;
  // Petite animation de "bouche qui parle"
  let count = 0;
  const interval = setInterval(() => {
    mouth.setAttribute("d", count % 2 === 0
      ? "M148 138 Q160 150 172 138"
      : "M148 138 Q160 144 172 138");
    count++;
    if (count > 5) { clearInterval(interval); mouth.setAttribute("d", "M148 138 Q160 144 172 138"); }
  }, 150);

  if ("speechSynthesis" in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    utter.rate = 1.0;
    window.speechSynthesis.speak(utter);
  }
}

function askJeanne(question) {
  addMessage(question, "user");
  const answer = findAnswer(question);
  if (answer) {
    const full = answer.reply + " " + answer.detail;
    addMessage(full, "jeanne");
    speak(answer.reply);
    highlightZone(answer.zone);
  } else {
    addMessage(DEFAULT_REPLY, "jeanne");
    speak(DEFAULT_REPLY);
    clearZoneHighlight();
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

// --- Reconnaissance vocale (Web Speech API) ---
let recognition = null;
let listening = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    askJeanne(transcript);
  };
  recognition.onend = () => {
    listening = false;
    micBtn.classList.remove("active");
    listeningRing.classList.remove("active");
  };
} else {
  micBtn.title = "Reconnaissance vocale non disponible dans ce navigateur — utilisez le champ texte.";
}

micBtn.addEventListener("click", () => {
  if (!recognition) {
    avatarCaption.textContent = "La reconnaissance vocale n'est pas supportée par ce navigateur. Essayez avec Chrome, ou tapez votre question ci-dessous.";
    return;
  }
  if (listening) {
    recognition.stop();
    return;
  }
  listening = true;
  micBtn.classList.add("active");
  listeningRing.classList.add("active");
  avatarCaption.textContent = "Je vous écoute...";
  recognition.start();
});

// --- Simulation de la notification Teams (phase 2) ---
vendorBtn.addEventListener("click", () => {
  const currentZoneEl = document.querySelector(".zone.highlight .zone-label");
  const zoneName = currentZoneEl ? currentZoneEl.textContent : "le magasin";

  addMessage("Un vendeur du rayon " + zoneName + " a été prévenu et arrive.", "jeanne");
  speak("Un vendeur du rayon " + zoneName + " a été prévenu et arrive.");

  toast.textContent = "🔔 Notification Teams envoyée au vendeur — Rayon : " + zoneName;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
});

// Message d'accueil
addMessage("Bonjour, je suis Jeanne, votre assistante d'accueil. Posez-moi une question, ou touchez le micro pour me parler.", "jeanne");
