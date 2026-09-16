// =====================================================================
// Voix neuronale de Jeanne (Piper, via vits-web).
// - Les modèles sont téléchargés une fois puis gardés sur la borne :
//   ensuite, tout fonctionne hors ligne.
// - La synthèse tourne dans un fil séparé (js/voice-worker.js) pour que
//   l'avatar 3D continue de bouger pendant qu'elle travaille.
// - Le volume du son pilote l'ouverture de la bouche de Jeanne.
// Si le moteur n'est pas prêt, l'application repasse sur la voix du navigateur.
// =====================================================================

// Voix féminines à locuteur unique. Les voix espagnoles de Piper sont
// masculines ou de genre incertain : l'espagnol reste sur la voix du navigateur.
export const PIPER_VOICES = {
  fr: "fr_FR-upmc-medium",
  en: "en_GB-jenny_dioco-medium"
};

const MAX_CHUNK = 140;

const ready = new Set();
const downloads = new Map();
let worker = null;
let nextId = 1;
const pendingCalls = new Map();

function getWorker() {
  if (worker) return worker;
  const version = new URL(import.meta.url).search;
  worker = new Worker(new URL("./voice-worker.js" + version, import.meta.url), { type: "module" });
  worker.onmessage = (event) => {
    const { id, ok, result, error, progress } = event.data;
    const call = pendingCalls.get(id);
    if (!call) return;
    if (progress !== undefined) { if (call.onProgress) call.onProgress(progress); return; }
    pendingCalls.delete(id);
    if (ok) call.resolve(result);
    else call.reject(new Error(error));
  };
  worker.onerror = (event) => {
    for (const call of pendingCalls.values()) call.reject(new Error(event.message || "fil de la voix arrêté"));
    pendingCalls.clear();
    worker = null;
  };
  return worker;
}

function call(message, onProgress) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pendingCalls.set(id, { resolve, reject, onProgress });
    getWorker().postMessage({ id, ...message });
  });
}

export const isReady = (lang) => ready.has(lang);
export const isDownloading = (lang) => downloads.has(lang);
export const supports = (lang) => Boolean(PIPER_VOICES[lang]);

export async function init() {
  const stored = await call({ type: "stored" });
  for (const [lang, voiceId] of Object.entries(PIPER_VOICES)) {
    if (stored.includes(voiceId)) ready.add(lang);
  }
  return [...ready];
}

// Télécharge la voix d'une langue (≈ 65 à 80 Mo). Sans effet si elle est déjà là.
export function ensure(lang, onProgress) {
  if (!PIPER_VOICES[lang]) return Promise.resolve(false);
  if (ready.has(lang)) return Promise.resolve(true);
  if (downloads.has(lang)) return downloads.get(lang);
  const promise = call({ type: "download", voiceId: PIPER_VOICES[lang] }, onProgress)
    .then(() => { ready.add(lang); return true; })
    .catch((error) => {
      console.info("Voix neuronale indisponible :", error.message);
      return false;
    })
    .finally(() => downloads.delete(lang));
  downloads.set(lang, promise);
  return promise;
}

// Découpe le texte en phrases courtes : la première est lue pendant que
// la suivante se prépare, ce qui réduit l'attente avant que Jeanne parle.
function splitText(text) {
  const chunks = [];
  for (const part of text.split(/(?<=[.!?…:])\s+/)) {
    const last = chunks[chunks.length - 1];
    if (last && (last + " " + part).length <= MAX_CHUNK) chunks[chunks.length - 1] = last + " " + part;
    else chunks.push(part);
  }
  return chunks.filter(Boolean);
}

let context = null;
let playing = null;
let session = null;

function ensureContext() {
  if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
  return context;
}

// =====================================================================
// Phrases enregistrées d'avance (assets/voix, fabriquées par tools/voix) :
// publiées avec le site, elles se lisent immédiatement, avec la même voix
// sur tous les appareils, sans rien télécharger d'autre.
// =====================================================================
const clips = new Map();

function loadClip(url) {
  if (!clips.has(url)) {
    const promise = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${url}`);
        return response.arrayBuffer();
      })
      .then((data) => ensureContext().decodeAudioData(data));
    promise.catch(() => clips.delete(url));
    clips.set(url, promise);
  }
  return clips.get(url);
}

// Prépare les phrases d'une langue en arrière-plan : la première lecture est alors instantanée.
export function preloadClips(urls) {
  for (const url of urls) loadClip(url).catch(() => {});
}

// Lit une phrase enregistrée. Renvoie false si c'est impossible (fichier
// absent, son bloqué) : la borne passe alors à une voix de synthèse.
export async function playClip(url, { onStart, onLevel, onEnd } = {}) {
  stop();
  const token = {};
  session = token;
  try {
    ensureContext();
    if (context.state !== "running") await context.resume();
    if (context.state !== "running") { session = null; return false; }
    const buffer = await loadClip(url);
    if (session !== token) return true;
    if (onStart) onStart();
    await playBuffer(buffer, 1, token, onLevel);
    if (session === token) {
      session = null;
      if (onEnd) onEnd();
    }
    return true;
  } catch (error) {
    console.info("Phrase enregistrée illisible :", error.message);
    if (session === token) session = null;
    return false;
  }
}

function playBuffer(buffer, rate, token, onLevel) {
  return new Promise((resolve) => {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    const samples = new Uint8Array(analyser.fftSize);
    source.connect(analyser);
    analyser.connect(context.destination);

    let frame = null;
    const tick = () => {
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (const value of samples) {
        const centred = (value - 128) / 128;
        sum += centred * centred;
      }
      if (onLevel) onLevel(Math.min(1, Math.sqrt(sum / samples.length) * 3.2));
      frame = requestAnimationFrame(tick);
    };
    tick();

    source.onended = () => {
      cancelAnimationFrame(frame);
      if (playing === source) playing = null;
      if (session === token && onLevel) onLevel(0);
      resolve();
    };
    playing = source;
    source.start();
  });
}

// Lit le texte avec la voix Piper. Renvoie false si ce n'est pas possible
// (voix absente, son bloqué…) : il faut alors utiliser la voix du navigateur.
export async function speak(text, lang, { rate = 1, onStart, onLevel, onEnd } = {}) {
  if (!ready.has(lang)) return false;
  stop();
  const token = {};
  session = token;
  let started = false;
  try {
    ensureContext();
    if (context.state !== "running") await context.resume();
    if (context.state !== "running") {
      // Le navigateur refuse encore le son (aucun geste de l'utilisateur) :
      // on laisse la voix du navigateur prendre le relais.
      console.info("Son bloqué par le navigateur : voix du navigateur utilisée.");
      session = null;
      return false;
    }
    const chunks = splitText(text);
    const synth = (chunk) => call({ type: "predict", text: chunk, voiceId: PIPER_VOICES[lang] });
    let pending = synth(chunks[0]);
    for (let i = 0; i < chunks.length; i++) {
      const wav = await pending;
      if (session !== token) return true;
      pending = i + 1 < chunks.length ? synth(chunks[i + 1]) : null;
      const buffer = await context.decodeAudioData(wav);
      if (session !== token) return true;
      if (!started) { started = true; if (onStart) onStart(); }
      await playBuffer(buffer, rate, token, onLevel);
      if (session !== token) return true;
    }
    session = null;
    if (onEnd) onEnd();
    return true;
  } catch (error) {
    console.info("Lecture Piper impossible :", error.message);
    if (session === token) {
      session = null;
      if (onLevel) onLevel(0);
    }
    if (onEnd) onEnd();
    // Si Jeanne avait déjà commencé à parler, on ne rejoue pas la phrase
    // avec la voix du navigateur.
    return started;
  }
}

export function stop() {
  session = null;
  if (playing) {
    try { playing.stop(); } catch { /* déjà arrêté */ }
    playing = null;
  }
}
