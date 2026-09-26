/**
 * Mode hors-ligne de la borne.
 *
 * La borne tourne sur le wifi du magasin, qui peut couper en pleine journée.
 * Ce fichier garde une copie de tout le site dans le navigateur : si le réseau
 * tombe, la borne continue exactement pareil — plan, voix, images, clips.
 *
 * Les règles, dans l'ordre :
 *   1. la vérification de version (index.html?check=…) passe toujours par le
 *      réseau : c'est elle qui apporte les nouvelles publications.
 *   2. index.html est demandé au réseau d'abord (2 s max) ; la copie sert de
 *      secours.
 *   3. tout le reste sort de la copie si elle existe, sinon du réseau — et ce
 *      qui passe par le réseau est copié au passage.
 *   4. le reste du site (les 267 phrases de Jeanne, surtout) est téléchargé en
 *      arrière-plan, mais seulement quand la page dit qu'elle a fini de charger
 *      ce dont elle a besoin : sinon les deux se disputent la connexion et
 *      Jeanne reste muette le temps que ça se démêle.
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
    let remplace = false;
    for (const nom of await caches.keys()) {
      if (nom.startsWith("borne-v") && nom !== CACHE) { await caches.delete(nom); remplace = true; }
    }
    await self.clients.claim();
    // Une page ouverte tourne peut-être encore sur les fichiers de l'ancienne
    // version : on lui demande de se recharger, elle le fera à l'écran
    // d'accueil. Sans cela la borne pouvait rester des jours sur du vieux code.
    if (remplace) for (const c of await self.clients.matchAll()) c.postMessage("recharge");
    // Si aucune page ne donne le signal (vieille version en place), on remplit
    // quand même, mais bien plus tard.
    setTimeout(remplirEnFond, 120000);
  })());
});

// La page prévient quand elle a fini de charger ses propres fichiers, puis
// redemande tant que la copie n'est pas complète.
// « waitUntil » est indispensable : sans lui le navigateur éteint le service
// worker au bout de quelques secondes d'inactivité et la copie s'arrêtait en
// plein milieu — mesuré le 26/09/2026, elle restait bloquée à 242 fichiers
// sur 295.
self.addEventListener("message", (e) => {
  if (e.data === "remplir") e.waitUntil(remplirEnFond());
});

/** Le reste du site, sans presser : voix, images, clips, plan. */
let remplissage = null;
function remplirEnFond() {
  // Une seule copie à la fois, mais on repart à zéro quand elle est finie :
  // si le réseau a coupé en route, la demande suivante reprend le reste.
  if (remplissage) return remplissage;
  remplissage = (async () => {
    try {
      const cache = await caches.open(CACHE);
      const r = await fetch(`assets/hors-ligne.json?v=${VERSION}`, { cache: "no-store" });
      if (!r.ok) return;
      for (const url of await r.json()) {
        // « ignoreSearch » : la page demande les voix avec ?v=N, la liste les
        // donne sans. Sans cela, chaque fichier était téléchargé deux fois.
        if (await cache.match(url, { ignoreSearch: true })) continue;
        try {
          const f = await fetch(url);
          if (f.ok) await cache.put(url, f.clone());
        } catch { /* réseau tombé : la prochaine demande reprendra ici */ }
      }
    } catch { /* liste illisible : on réessaiera */ }
    finally { remplissage = null; }
  })();
  return remplissage;
}

// On ignore le « ?v=N » pour les fichiers d'assets — la liste hors-ligne les
// désigne sans, la page les demande avec — mais JAMAIS pour la page, les
// styles et les modules : là, le numéro de version EST le fichier. Sans cette
// distinction, l'ancien service worker répondait à une demande de
// « js/search.js?v=93 » avec le contenu de la v=92, et la borne ne pouvait
// plus jamais se mettre à jour (constaté en magasin le 26/09/2026).
const versionneParLeNom = (url) => /\/(js|css)\/[^/]+$/.test(url.pathname) || url.pathname.endsWith(".html");
const copieDe = async (req) =>
  (await caches.open(CACHE)).match(req, { ignoreSearch: !versionneParLeNom(new URL(req.url)) });

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // La vérification de version doit voir le vrai réseau, sinon la borne ne
  // saurait jamais qu'une nouvelle version est publiée.
  if (url.searchParams.has("check")) return;

  // Les clips en langue des signes sont cherchés en HEAD : sans ce cas, la
  // borne les croirait absents dès que le réseau tombe.
  if (req.method === "HEAD") {
    if (url.origin !== self.location.origin) return;
    e.respondWith((async () => {
      if (await copieDe(req)) return new Response(null, { status: 200 });
      try { return await fetch(req); } catch { return new Response(null, { status: 404 }); }
    })());
    return;
  }
  if (req.method !== "GET") return;

  const nôtre = url.origin === self.location.origin;
  const police = url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com");
  if (!nôtre && !police) return;

  // La page elle-même : le réseau d'abord, pour voir une nouvelle version.
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        // « no-store » : sans lui, le cache du navigateur resservait la page
        // d'il y a dix minutes (GitHub Pages demande de la garder), et la
        // borne rechargeait sans fin la même vieille version.
        const r = await depuisLeReseau(new Request(req.url, { cache: "no-store" }), 2000);
        if (!r.ok) throw new Error(String(r.status));
        (await caches.open(CACHE)).put("./", r.clone());
        return r;
      } catch {
        return (await caches.match("./")) || Response.error();
      }
    })());
    return;
  }

  // Une vidéo demande des morceaux de fichier (« Range ») : lui renvoyer le
  // fichier entier la fait échouer. On découpe le morceau demandé.
  const morceau = req.headers.get("range");
  if (morceau) {
    e.respondWith(servirMorceau(req, morceau));
    return;
  }

  // Le reste : la copie d'abord, c'est instantané.
  e.respondWith((async () => {
    const copie = await copieDe(req);
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

async function servirMorceau(req, morceau) {
  const copie = await copieDe(req);
  if (!copie) {
    try { return await fetch(req); } catch { return Response.error(); }
  }
  const entier = await copie.arrayBuffer();
  const bornes = /bytes=(\d*)-(\d*)/.exec(morceau);
  const debut = bornes && bornes[1] ? Number(bornes[1]) : 0;
  const fin = bornes && bornes[2] ? Number(bornes[2]) : entier.byteLength - 1;
  if (debut >= entier.byteLength) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${entier.byteLength}` } });
  }
  return new Response(entier.slice(debut, fin + 1), {
    status: 206,
    headers: {
      "Content-Type": copie.headers.get("Content-Type") || "application/octet-stream",
      "Content-Range": `bytes ${debut}-${fin}/${entier.byteLength}`,
      "Content-Length": String(fin - debut + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

function depuisLeReseau(req, delai) {
  return new Promise((ok, non) => {
    const minuteur = setTimeout(() => non(new Error("trop long")), delai);
    fetch(req).then((r) => { clearTimeout(minuteur); ok(r); }, (e) => { clearTimeout(minuteur); non(e); });
  });
}
