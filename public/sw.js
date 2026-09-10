const CACHE_NAME = "offline-notes-lab-v2";

// self.registration.scope always resolves to the folder the worker controls,
// whether that is the domain root or a GitHub Pages project path like
// https://<user>.github.io/offline-notes-lab/. Using it here (instead of a
// hard-coded "/") keeps the app shell caching correct in both cases.
const APP_SHELL = [self.registration.scope, `${self.registration.scope}manifest.webmanifest`];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() => caches.match(self.registration.scope))
    )
  );
});
