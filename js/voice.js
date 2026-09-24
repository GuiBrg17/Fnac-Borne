// =====================================================================
// Lecture des phrases enregistrées de Jeanne (assets/voix, fabriquées par
// tools/voix). Publiées avec le site, elles se lisent immédiatement, avec la
// même voix sur tous les appareils. Quand une phrase n'a pas été enregistrée
// (le nom d'un produit mal orthographié, par exemple), la borne repasse sur
// la voix du navigateur, gérée dans js/app.js.
// =====================================================================

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

// Prépare les phrases d'une langue en arrière-plan : la première lecture est
// alors instantanée. Renvoie une promesse tenue quand tout est chargé, pour
// que le reste du site n'occupe la connexion qu'après.
export function preloadClips(urls) {
  return Promise.all(urls.map((url) => loadClip(url).catch(() => {})));
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
    await playBuffer(buffer, token, onLevel);
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

function playBuffer(buffer, token, onLevel) {
  return new Promise((resolve) => {
    const source = context.createBufferSource();
    source.buffer = buffer;
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

export function stop() {
  session = null;
  if (playing) {
    try { playing.stop(); } catch { /* déjà arrêté */ }
    playing = null;
  }
}
