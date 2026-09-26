/**
 * Ce fichier ne sert plus qu'à effacer le mode hors-ligne.
 *
 * La borne a gardé pendant quelques jours une copie de tout le site pour
 * survivre à une coupure de wifi. Le magasin a préféré y renoncer le
 * 26/09/2026 : elle est toujours connectée, et cette copie lui resservait du
 * vieux code au lieu des versions publiées.
 *
 * On ne peut pas simplement supprimer ce fichier : les bornes qui ont déjà
 * enregistré un service worker le gardent, et continueraient à répondre avec
 * leur copie. Celui-ci prend sa place, efface tout, se désinscrit, puis
 * demande aux pages ouvertes de se recharger — une fois, proprement.
 *
 * À supprimer quand toutes les bornes auront tourné au moins une fois sans lui.
 */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const nom of await caches.keys()) await caches.delete(nom);
    const pages = await self.clients.matchAll({ includeUncontrolled: true });
    await self.registration.unregister();
    for (const p of pages) p.postMessage("sw-retire");
  })());
});

// Plus aucune interception : tout repart du réseau.
