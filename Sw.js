const CACHE = 'spring-xcel-v1';
const FILES = [
  '/',
  '/A-lect_water.html'
];

// On install: cache the main page
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

// On activate: clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// On fetch: serve from cache first, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(response => {
        // Cache new requests as they come in
        return caches.open(CACHE).then(c => {
          c.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(() => caches.match('/A-lect_water.html'))
  );
});