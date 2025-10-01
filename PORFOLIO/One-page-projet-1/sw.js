// Configuration du Service Worker
const CACHE_NAME = 'onepagepro-v2';
const RUNTIME_CACHE = 'runtime-cache';
const OFFLINE_URL = '/offline.html';

// Fichiers à mettre en cache immédiatement (versionnés)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/manifest.json',
  '/favicon.ico',
  '/assets/images/favicon/favicon-32x32.png',
  '/assets/images/favicon/favicon-16x16.png',
  '/assets/images/favicon/apple-touch-icon.png',
  '/assets/images/optimized/webp/one-page-1.webp',
  '/assets/images/optimized/png/one-page-1.png'
];

// Fichiers à mettre en cache au runtime
const RUNTIME_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.js',
  'https://fonts.gstatic.com',
  'https://cdnjs.cloudflare.com',
  'https://unpkg.com'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Mise en cache des ressources critiques');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, RUNTIME_CACHE];
  
  // Suppression des anciens caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Suppression de l\'ancien cache :', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Stratégie de cache : Cache First, puis réseau avec mise à jour du cache
const fromCache = request => {
  return caches.match(request).then(response => response || fetchAndCache(request));
};

// Stratégie réseau avec mise en cache
const fetchAndCache = request => {
  return fetch(request).then(response => {
    // Vérifier si la réponse est valide
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    // Mettre en cache la réponse pour les requêtes du même origine
    if (request.url.startsWith(self.location.origin)) {
      const responseToCache = response.clone();
      caches.open(RUNTIME_CACHE).then(cache => {
        cache.put(request, responseToCache);
      });
    }

    return response;
  });
};

// Gestion des requêtes
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-GET et les requêtes cross-origin
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Pour les requêtes de navigation, essayer le réseau d'abord, puis le cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre à jour le cache avec la réponse du réseau
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // En cas d'erreur, chercher dans le cache
          return caches.match(event.request)
            .then(response => response || caches.match(OFFLINE_URL));
        })
    );
  } 
  // Pour les requêtes de ressources critiques, utiliser le cache d'abord
  else if (PRECACHE_ASSETS.some(asset => event.request.url.includes(asset.split('/').pop()))) {
    event.respondWith(fromCache(event.request));
  }
  // Pour les autres requêtes, essayer le réseau d'abord, puis le cache
  else {
    event.respondWith(
      fetchAndCache(event.request)
        .catch(() => fromCache(event.request))
    );
  }
});

// Gestion de la synchronisation en arrière-plan
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('Synchronisation en arrière-plan déclenchée');
    // Ajoutez ici la logique de synchronisation si nécessaire
  }
});

// Gestion des notifications push
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/assets/images/favicon/favicon-96x96.png',
    badge: '/assets/images/favicon/favicon-32x32.png'
  };

  event.waitUntil(
    self.registration.showNotification('Nouvelle notification', options)
  );
});
