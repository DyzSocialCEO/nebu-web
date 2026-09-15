const CACHE = "n3bu-static-v1";
const STATIC_ASSETS = [
  "/nebu-avatar.webp",
  "/nebu-garden.webp",
  "/nebu-garden-sm.webp",
  "/nebu-neutral.webp",
  "/nebu-cover.webp",
  "/fonts/dm-sans-400.woff2",
  "/fonts/dm-sans-700.woff2",
  "/fonts/barlow-condensed-700.woff2",
  "/fonts/caveat-600.woff2",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => undefined)
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (!STATIC_ASSETS.includes(url.pathname)) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
