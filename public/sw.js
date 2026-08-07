const CACHE_VERSION = 'havilah-v1';
const MEDIA_CACHE = `havilah-media-${CACHE_VERSION}`;
const STATIC_CACHE = `havilah-static-${CACHE_VERSION}`;
const CONTENT_CACHE = `havilah-content-${CACHE_VERSION}`;

// Assets to pre-cache immediately on Service Worker installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/assets/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { cache: 'reload' }))).catch((err) => {
        console.warn('SW: Non-critical failure precaching initial asset:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up outdated cache versions
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => !name.includes(CACHE_VERSION))
            .map((name) => caches.delete(name))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Exclude non-GET requests and browser chrome / extensions / hot reload websocket calls
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension') || url.pathname.includes('/@vite/')) {
    return;
  }

  // 1. MEDIA ASSETS (Images, Videos, Fonts, Audio) -> CACHE FIRST, FALLBACK TO NETWORK
  // This ensures zero buffering and instantaneous media display on page reloads
  const isMediaAsset =
    /\.(png|jpg|jpeg|webp|gif|svg|mp4|webm|woff|woff2|ttf|eot|mp3)$/i.test(url.pathname) ||
    url.hostname.includes('images.unsplash.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.pathname.includes('/videos/') ||
    url.pathname.includes('/images/');

  if (isMediaAsset) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          throw error;
        }
      })
    );
    return;
  }

  // 2. CONTENT & I18N DICTIONARIES -> STALE WHILE REVALIDATE
  // Returns cached text instantly while silently refreshing from server
  const isContentOrI18n =
    url.pathname.includes('/locales/') ||
    url.pathname.includes('/data/') ||
    url.pathname.endsWith('.json');

  if (isContentOrI18n) {
    event.respondWith(
      caches.open(CONTENT_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. STATIC BUNDLES (JS, CSS, HTML) -> STALE WHILE REVALIDATE FOR INSTANT RELOADS
  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200 && url.origin === self.location.origin) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      }).catch((err) => {
        if (cachedResponse) return cachedResponse;
        throw err;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
