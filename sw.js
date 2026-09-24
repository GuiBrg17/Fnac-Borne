/**
 * Mode hors-ligne de la borne.
 *
 * La borne tourne sur le wifi du magasin, qui peut couper en pleine journée.
 * Ce fichier garde une copie de tout le site dans le navigateur : si le réseau
 * tombe, la borne continue exactement pareil — plan, voix, images, clips.
 *
 * Trois règles, dans l'ordre :
 *   1. index.html est demandé au réseau d'abord (2 s max), pour attraper une
 *      nouvelle version publiée ; la copie sert de secours.
 *   2. tout le reste sort de la copie si elle existe, sinon du réseau — et ce
 *      qui passe par le réseau est copié au passage.
 *   3. après l'installation, le reste du site est téléchargé tranquillement en
 *      arrière-plan (les 267 phrases de Jeanne, surtout), d'après
 *      assets/hors-ligne.json.
 *
 * La copie porte le numéro de version du site (sw.js?v=N) : publier une
 * nouvelle version crée une copie neuve et efface l'ancienne. Rien à purger
 * à la main.
 */
const VERSION = new URL(self.location.href).searchParams.get("v") || "0";
const CACHE = `borne-v${VERSION}`;

// Le strict nécessaire pour afficher l'écran d'accueil : sans un seul de ces
// fichiers, la borne ne démarre pas. Ils sont pris avant de se déclarer prête.
const SOCLE = [
  "./",
  `css/kiosk.css?v=${VERSION}`,
  `js/app.js?v=${VERSION}`,
  `js/data.js?v=${VERSION}`,
  `js/search.js?v=${VERSION}`,
  `js/news.js?v=${VERSION}`,
  `js/stats.js?v=${VERSION}`,
  `js/report.js?v=${VERSION}`,
  `js/voice.js?v=${VERSION}`,
  `js/alert.js?v=${VERSION}`,
  `js/plan.js?v=${VERSION}`,
  "assets/fnac-logo.svg",
  "assets/jeanne-accueil.png",
  `assets/voix/manifest.json?v=${VERSION}`,
  // La police fait toute la mise en page : sans elle l'écran change de visage.
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..900&display=swap",
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Un par un : un seul fichier en échec ne doit pas faire tout rater.
    await Promise.all(SOCLE.map((url) => cache.add(url).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const nom of await caches.keys()) {
      if (nom.startsWith("borne-v") && nom !== CACHE) await caches.delete(nom);
    }
    await self.clients.claim();
    remplirEnFond();
  })());
});

/** Le reste du site, sans presser : voix, images, clips, plan. */
async function remplirEnFond() {
  const cache = await caches.open(CACHE);
  let liste = [];
  try {
    const r = await fetch(`assets/hors-ligne.json?v=${VERSION}`, { cache: "no-store" });
    if (r.ok) liste = await r.json();
  } catch { return; }
  for (const url of liste) {
    if (await cache.match(url)) continue;
    try {
      const r = await fetch(url);
      if (r.ok) await cache.put(url, r.clone());
    } catch { /* le réseau est tombé : on reprendra au prochain démarrage */ }
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  // Les clips en langue des signes sont cherchés en HEAD : sans ce cas, la
  // borne les croirait absents dès que le réseau tombe.
  if (req.method === "HEAD") {
    if (new URL(req.url).origin !== self.location.origin) return;
    e.respondWith((async () => {
      const copie = await caches.match(req, { ignoreMethod: true });
      if (copie) return new Response(null, { status: 200 });
      try { return await fetch(req); } catch { return new Response(null, { status: 404 }); }
    })());
    return;
  }
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const nôtre = url.origin === self.location.origin;
  const police = url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com");
  if (!nôtre && !police) return;

  // La page elle-même : le réseau d'abord, pour voir une nouvelle version.
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const r = await depuisLeReseau(req, 2000);
        (await caches.open(CACHE)).put("./", r.clone());
        return r;
      } catch {
        return (await caches.match("./")) || Response.error();
      }
    })());
    return;
  }

  // Le reste : la copie d'abord, c'est instantané.
  e.respondWith((async () => {
    const copie = await caches.match(req, { ignoreSearch: false });
    if (copie) return copie;
    try {
      const r = await fetch(req);
      // Une réponse opaque (police) a un status 0 : elle se garde quand même.
      if (r.ok || r.type === "opaque") (await caches.open(CACHE)).put(req, r.clone());
      return r;
    } catch {
      return Response.error();
    }
  })());
});

function depuisLeReseau(req, delai) {
  return new Promise((ok, non) => {
    const minuteur = setTimeout(() => non(new Error("trop long")), delai);
    fetch(req).then((r) => { clearTimeout(minuteur); ok(r); }, (e) => { clearTimeout(minuteur); non(e); });
  });
}
