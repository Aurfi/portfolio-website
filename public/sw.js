// Service Worker for Portfolio Website
// Provides basic PWA functionality with caching strategies

const CACHE_NAME = 'portfolio-v1.0.0'
const STATIC_CACHE = 'portfolio-static-v1.0.0'
const DYNAMIC_CACHE = 'portfolio-dynamic-v1.0.0'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Core CSS and JS will be added dynamically
]

// Assets that should be cached with network-first strategy
const DYNAMIC_ASSETS = ['/api/', '/images/', '/assets/']

// Assets that should never be cached
const NEVER_CACHE = ['/admin', '/api/analytics', '/sw.js']

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip requests that should never be cached
  if (NEVER_CACHE.some((path) => url.pathname.startsWith(path))) {
    return
  }

  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request))
  } else if (isDynamicAsset(url)) {
    event.respondWith(networkFirstStrategy(request))
  } else if (isNavigationRequest(request)) {
    event.respondWith(navigationStrategy(request))
  } else {
    event.respondWith(networkFirstStrategy(request))
  }
})

// Cache-first strategy for static assets (CSS, JS, images)
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.error('Cache-first strategy failed:', error)
    return new Response('Offline content not available', { status: 503 })
  }
}

// Network-first strategy for dynamic content
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    return new Response('Content not available offline', { status: 503 })
  }
}

// Navigation strategy for HTML pages
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log('Navigation network failed, trying cache:', error)

    // Try to get cached version
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Fallback to cached index.html for SPA routing
    const indexResponse = await caches.match('/')
    if (indexResponse) {
      return indexResponse
    }

    return new Response('Page not available offline', {
      status: 503,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}

// Helper functions
function isStaticAsset(url) {
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/)
}

function isDynamicAsset(url) {
  return DYNAMIC_ASSETS.some((path) => url.pathname.startsWith(path))
}

function isNavigationRequest(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept').includes('text/html'))
  )
}

// Background sync for offline actions (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form') {
      event.waitUntil(syncContactForm())
    }
  })
}

async function syncContactForm() {
  try {
    // This would handle offline form submissions
    console.log('Syncing contact form submissions...')
    // Implementation would depend on your backend
  } catch (error) {
    console.error('Failed to sync contact form:', error)
  }
}

// Push notification handling (basic setup)
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: data.actions || [],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(clients.openWindow(event.notification.data.url || '/'))
})

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})

console.log('Service Worker: Loaded')
