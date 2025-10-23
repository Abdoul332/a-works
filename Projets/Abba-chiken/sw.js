// Version du cache - à incrémenter lors des mises à jour
const CACHE_NAME = 'abba-chiken-v2';
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'img/Kebab.jpg',
  'img/Hamburger.jpg',
  'img/Pyzza.jpg',
  'img/Salade.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Gestion des requêtes
self.addEventListener('fetch', event => {
  // Pour les images, on utilise la stratégie "Cache First, then Network"
  if (event.request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Si l'image est en cache, on la retourne
          if (cachedResponse) {
            return cachedResponse;
          }
          // Sinon, on la récupère du réseau et on la met en cache
          return fetch(event.request).then(response => {
            // Vérifier que la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Cloner la réponse pour la mettre en cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return response;
          });
        })
    );
    return;
  }

  // Pour les autres requêtes, on utilise la stratégie "Network First, then Cache"
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Vérifier que la réponse est valide
        if (response && response.status === 200) {
          // Mettre en cache la réponse pour les requêtes GET
          if (event.request.method === 'GET') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        }
        // Si la requête échoue, essayer de récupérer depuis le cache
        return caches.match(event.request);
      })
      .catch(() => {
        // En cas d'échec, essayer de récupérer depuis le cache
        return caches.match(event.request);
      })
    );
  });
});

            // Cloner la réponse
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Nettoyage des anciens caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
