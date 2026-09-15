// =====================================================================
// Fil séparé pour la voix neuronale Piper (vits-web).
// La synthèse est lourde : la faire ici évite de figer l'avatar 3D.
// Les modèles sont rangés par vits-web dans le stockage privé du site (OPFS).
// =====================================================================
const LIB = "https://cdn.jsdelivr.net/npm/@diffusionstudio/vits-web@1.0.3/+esm";

let lib = null;
async function load() {
  if (!lib) lib = await import(LIB);
  return lib;
}

self.onmessage = async (event) => {
  const { id, type, voiceId, text } = event.data;
  try {
    const tts = await load();
    if (type === "stored") {
      self.postMessage({ id, ok: true, result: await tts.stored() });
    } else if (type === "download") {
      await tts.download(voiceId, (progress) => {
        if (progress && progress.total) {
          self.postMessage({ id, progress: Math.round((progress.loaded / progress.total) * 100) });
        }
      });
      self.postMessage({ id, ok: true });
    } else if (type === "predict") {
      const blob = await tts.predict({ text, voiceId });
      const buffer = await blob.arrayBuffer();
      self.postMessage({ id, ok: true, result: buffer }, [buffer]);
    } else {
      self.postMessage({ id, ok: false, error: `type inconnu : ${type}` });
    }
  } catch (error) {
    self.postMessage({ id, ok: false, error: String((error && error.message) || error) });
  }
};
