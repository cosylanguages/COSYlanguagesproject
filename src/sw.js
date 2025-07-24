/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'cosy-languages-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/freestyle.html',
  '/study.html',
  '/study-islands.html',
  '/manifest.json',
  '/cosylanguages.png',
  '/logo192.png',
  '/logo512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
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
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          if (event.request.method !== 'POST') {
            cache.put(event.request, response.clone());
          }
          return response;
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
