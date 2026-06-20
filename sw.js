const CACHE_NAME = 'maak-v2';
const STATIC_ASSETS = ['/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png', '/moe-logo.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('supabase.co')) return;
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, c)); }
      return res;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('/index.html')))
  );
});
