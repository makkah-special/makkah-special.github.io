// ===================================================
// Service Worker — منصة مَعَاك
// الإصدار: 2.0
// ===================================================

const CACHE_NAME = 'maak-v2';
const STATIC_ASSETS = [
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/moe-logo.png',
];

// ===== التثبيت: تخزين الملفات الأساسية =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ===== التفعيل: حذف الكاش القديم =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ===== الطلبات: Network First ثم Cache =====
self.addEventListener('fetch', event => {
  // تجاهل طلبات Supabase (بيانات حية دائماً)
  if (event.request.url.includes('supabase.co')) return;
  // تجاهل طلبات غير GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // تخزين نسخة في الكاش
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // إذا لم يوجد اتصال، استخدم الكاش
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // صفحة offline احتياطية
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
