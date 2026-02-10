// ============================================
// NUVOLA365 SERVICE WORKER
// ============================================

const CACHE_NAME = 'nuvola365-v1.0.0';
const RUNTIME_CACHE = 'nuvola365-runtime';

// Files to cache on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json'
];

// Optional assets (won't fail install if missing)
const OPTIONAL_ASSETS = [
  '/icon-192.png',
  '/icon-512.png'
];

// External resources (cached on first use)
const EXTERNAL_FONTS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// ============================================
// INSTALL - Cache Core Assets
// ============================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching core assets');
        
        // Cache core assets (must succeed)
        const corePromise = cache.addAll(CORE_ASSETS);
        
        // Cache optional assets (failures allowed)
        const optionalPromise = Promise.allSettled(
          OPTIONAL_ASSETS.map(url => 
            cache.add(url).catch(err => {
              console.warn(`[SW] Optional asset failed: ${url}`, err);
            })
          )
        );
        
        return Promise.all([corePromise, optionalPromise]);
      })
      .then(() => {
        console.log('[SW] Core assets cached successfully');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Installation failed:', err);
      })
  );
});

// ============================================
// ACTIVATE - Clean Old Caches
// ============================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
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
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// ============================================
// FETCH - Network/Cache Strategy
// ============================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (except fonts)
  if (url.origin !== location.origin && !isCDNResource(url.href)) {
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigate(request));
    return;
  }
  
  // Handle static assets
  event.respondWith(handleAsset(request));
});

// ============================================
// FETCH HANDLERS
// ============================================

async function handleNavigate(request) {
  try {
    // Try network first for HTML
    const networkResponse = await fetch(request);
    
    // Update cache
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (err) {
    // Fall back to cache
    console.log('[SW] Network failed, using cache for navigation');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Last resort: return index.html
    return caches.match('/index.html');
  }
}

async function handleAsset(request) {
  // Cache-first strategy for assets
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Return cached version, but update in background
    updateCache(request);
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (err) {
    console.error('[SW] Fetch failed:', err);
    
    // Return offline fallback if available
    return createOfflineResponse(request);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

async function updateCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse);
    }
  } catch (err) {
    // Silent fail - we already returned cached version
  }
}

function isCDNResource(url) {
  const cdnPatterns = [
    'cdnjs.cloudflare.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ];
  
  return cdnPatterns.some(pattern => url.includes(pattern));
}

function createOfflineResponse(request) {
  const url = new URL(request.url);
  
  // For HTML requests, return offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Nuvola365</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0a0e1a 0%, #12172b 100%);
            color: #e8ecf4;
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
            background: linear-gradient(135deg, #4dabff 0%, #0066cc 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p {
            font-size: 1.2rem;
            color: #9ca3af;
            margin-bottom: 2rem;
          }
          button {
            padding: 1rem 2rem;
            background: #4dabff;
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
          <p>Check your internet connection and try again</p>
          <button onclick="location.reload()">Retry</button>
        </div>
      </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
  
  // For other requests, return basic error response
  return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
}

// ============================================
// BACKGROUND SYNC (Future Enhancement)
// ============================================

// Listen for sync events
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-workspace') {
    event.waitUntil(syncWorkspace());
  }
});

async function syncWorkspace() {
  // Future: Sync workspace state with cloud
  console.log('[SW] Syncing workspace...');
}

// ============================================
// PUSH NOTIFICATIONS (Future Enhancement)
// ============================================

self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const data = event.data?.json() || {};
  const title = data.title || 'Nuvola365';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'default',
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Handle notification click
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// ============================================
// MESSAGE HANDLING
// ============================================

self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
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
