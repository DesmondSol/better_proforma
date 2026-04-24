
const CACHE_NAME = 'proforma-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  '/vite.svg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // Use a stale-while-revalidate strategy for most assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version but fetch new version in background
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        });
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
