/* eslint-disable no-restricted-globals */

// It's recommended to use a tool like workbox-webpack-plugin to generate this file.
// This ensures that all assets are precached correctly, including hashed filenames.
// For now, we'll manually update the list of files to cache.

const CACHE_NAME = 'cosy-languages-cache-v3'; // Incremented cache version
const urlsToCache = [
  './', // Now relative
  './index.html', // Now relative
  './manifest.json',
  './cosylanguages.png',
  './logo192.png',
  './logo512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Using addAll with relative URLs. The browser resolves them relative to the sw.js location.
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        // Return the cached response if found.
        // If not, fetch from the network, cache the new response, and return it.
        return response || fetch(event.request).then((networkResponse) => {
          // Check for a valid response to cache
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
