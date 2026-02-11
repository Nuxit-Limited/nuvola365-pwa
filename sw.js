// ============================================
// NUVOLA365 DEX - Service Worker
// ============================================

const CACHE_NAME = 'nuvola365-dex-v1.0.0';
const RUNTIME_CACHE = 'nuvola365-runtime';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/dex-style.css',
  '/dex-apps.js',
  '/dex-main.js',
  '/manifest.json'
];

// ============================================
// INSTALL
// ============================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.error('[SW] Installation failed:', err))
  );
});

// ============================================
// ACTIVATE
// ============================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ============================================
// FETCH
// ============================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests (except CDNs)
  if (url.origin !== location.origin && !isCDN(url.href)) return;
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigate(request));
    return;
  }
  
  // Handle static assets
  event.respondWith(handleAsset(request));
});

async function handleNavigate(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    return caches.match('/index.html');
  }
}

async function handleAsset(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Return cached, update in background
    updateCache(request);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (err) {
    return createOfflineResponse();
  }
}

async function updateCache(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse);
    }
  } catch (err) {
    // Silent fail
  }
}

function isCDN(url) {
  const cdnPatterns = [
    'cdnjs.cloudflare.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'via.placeholder.com'
  ];
  return cdnPatterns.some(pattern => url.includes(pattern));
}

function createOfflineResponse() {
  return new Response(
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Nuvola365</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #1a1d29 0%, #22252f 100%);
          color: #e8eaf0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .container {
          text-align: center;
          padding: 2rem;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #2196f3;
        }
        p {
          font-size: 1.2rem;
          color: #a0a3b1;
          margin-bottom: 2rem;
        }
        button {
          padding: 1rem 2rem;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>You're Offline</h1>
        <p>Check your connection and try again</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Nuvola365';
  const options = {
    body: data.body || 'New notification',
    icon: 'https://via.placeholder.com/192/2196f3/ffffff?text=N365',
    badge: 'https://via.placeholder.com/96/2196f3/ffffff?text=N',
    tag: data.tag || 'default',
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// ============================================
// MESSAGES
// ============================================

self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[SW] Service worker loaded');
