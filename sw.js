// Service Worker v2 — يمسح كل cache قديم ويسجّل نفسه من جديد
const CACHE_VERSION = 'mk-v2-' + Date.now();

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// لا تخزّن أي شيء — اطلب دائماً من الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
