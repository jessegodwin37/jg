/*
 * JG Service Worker
 * Version: 2.0.0
 * Purpose:
 * - Prevent old JG pages from remaining stuck in cache
 * - Always check the network first for HTML, CSS and JS
 * - Remove old JG caches
 * - Activate new versions immediately
 */

const CACHE_NAME = "jg-v2-2026-10-08";

const APP_SHELL = [
  "./",
  "./index.html",
  "./learn.html",
  "./skills.html",
  "./work.html",
  "./ai.html",
  "./account.html",
  "./course.html",
  "./enrollment.html",
  "./exam.html",
  "./final-project.html",
  "./certificate.html",
  "./verify.html",
  "./premium.html",
  "./login.html",
  "./signup.html",
  "./lesson.html",
  "./manifest.webmanifest",

  "./css/style.css",

  "./js/config.js",
  "./js/supabase.js",
  "./js/ui.js",
  "./js/auth.js",
  "./js/api.js",
  "./js/app.js"
];

/*
 * INSTALL
 */
self.addEventListener("install", event => {
  console.log("[JG SW] Installing:", CACHE_NAME);

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const file of APP_SHELL) {
        try {
          await cache.add(file);
        } catch (error) {
          console.warn("[JG SW] Could not cache:", file);
        }
      }
    })
  );
});

/*
 * ACTIVATE
 */
self.addEventListener("activate", event => {
  console.log("[JG SW] Activating:", CACHE_NAME);

  event.waitUntil(
    Promise.all([
      /*
       * Delete every previous JG cache.
       */
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => {
              return (
                name.startsWith("jg-") &&
                name !== CACHE_NAME
              );
            })
            .map(name => {
              console.log("[JG SW] Removing old cache:", name);
              return caches.delete(name);
            })
        );
      }),

      /*
       * Take control immediately.
       */
      self.clients.claim()
    ])
  );
});

/*
 * MESSAGE
 *
 * Allows the webpage to tell the service worker
 * to activate immediately.
 */
self.addEventListener("message", event => {
  if (
    event.data &&
    event.data.type === "SKIP_WAITING"
  ) {
    self.skipWaiting();
  }

  if (
    event.data &&
    event.data.type === "CLEAR_CACHE"
  ) {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith("jg-"))
            .map(name => caches.delete(name))
        );
      })
    );
  }
});

/*
 * FETCH
 */
self.addEventListener("fetch", event => {
  const request = event.request;

  /*
   * Only GET requests can be cached.
   */
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  /*
   * Don't intercept external websites/services.
   */
  if (url.origin !== self.location.origin) {
    return;
  }

  /*
   * HTML / PAGE REQUESTS
   *
   * Network first.
   *
   * This is the important part that prevents
   * GitHub Pages from being permanently stuck
   * on an old homepage.
   */
  if (
    request.mode === "navigate" ||
    request.destination === "document"
  ) {
    event.respondWith(
      fetch(request, {
        cache: "no-store"
      })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copy);
            });
          }

          return response;
        })
        .catch(() => {
          return caches.match(request).then(cached => {
            return (
              cached ||
              caches.match("./index.html")
            );
          });
        })
    );

    return;
  }

  /*
   * CSS
   *
   * Network first.
   */
  if (request.destination === "style") {
    event.respondWith(
      fetch(request, {
        cache: "no-store"
      })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copy);
            });
          }

          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );

    return;
  }

  /*
   * JAVASCRIPT
   *
   * Network first.
   */
  if (request.destination === "script") {
    event.respondWith(
      fetch(request, {
        cache: "no-store"
      })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copy);
            });
          }

          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );

    return;
  }

  /*
   * MANIFEST
   *
   * Network first.
   */
  if (
    request.destination === "manifest" ||
    url.pathname.endsWith("manifest.webmanifest")
  ) {
    event.respondWith(
      fetch(request, {
        cache: "no-store"
      })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copy);
            });
          }

          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );

    return;
  }

  /*
   * IMAGES / ICONS / OTHER STATIC FILES
   *
   * Cache first, network fallback.
   */
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then(response => {
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copy);
            });
          }

          return response;
        })
        .catch(() => {
          return new Response(
            "JG resource unavailable.",
            {
              status: 503,
              headers: {
                "Content-Type": "text/plain"
              }
            }
          );
        });
    })
  );
});
