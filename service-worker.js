"use strict";

/*
 * JG Progressive Web App Service Worker
 * --------------------------------------
 * Responsibilities:
 * - Cache the JG application shell
 * - Provide basic offline support
 * - Serve cached frontend files when appropriate
 * - Avoid caching API responses or private account data
 * - Clean up old JG caches during upgrades
 *
 * IMPORTANT:
 * Never put API keys, passwords, authentication tokens,
 * private user data, or backend secrets in this file.
 */

const CACHE_VERSION = "jg-cache-v1";
const APP_CACHE = `${CACHE_VERSION}-app`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
  "./",
  "./index.html",

  // Public pages
  "./learn.html",
  "./skills.html",
  "./course.html",
  "./lesson.html",
  "./exam.html",
  "./certificate.html",
  "./verify.html",
  "./work.html",
  "./ai.html",
  "./premium.html",
  "./account.html",
  "./login.html",
  "./signup.html",

  // Admin pages
  "./admin/index.html",
  "./admin/login.html",
  "./admin/dashboard.html",
  "./admin/admins.html",
  "./admin/users.html",
  "./admin/content.html",
  "./admin/opportunities.html",
  "./admin/premium-ads.html",
  "./admin/ai-control.html",
  "./admin/settings.html",
  "./admin/audit.html",
  "./admin/export.html",

  // Shared CSS
  "./css/style.css",

  // Shared JavaScript
  "./js/config.js",
  "./js/app.js",
  "./js/api.js",
  "./js/auth.js",
  "./js/ui.js",

  // PWA files
  "./manifest.webmanifest"
];

/*
 * INSTALL
 * -------
 * Pre-cache the main application shell.
 */
self.addEventListener("install", (event) => {

  event.waitUntil(

    caches
      .open(APP_CACHE)
      .then((cache) => {

        return cache.addAll(APP_SHELL);

      })
      .then(() => {

        /*
         * Activate the new worker immediately.
         */
        return self.skipWaiting();

      })
      .catch((error) => {

        console.error(
          "[JG SW] Installation failed:",
          error
        );

        /*
         * We intentionally do not throw here.
         * This allows the service worker to remain
         * available even if one optional file fails.
         */
      })

  );

});


/*
 * ACTIVATE
 * --------
 * Remove caches belonging to older versions.
 */
self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches
      .keys()
      .then((cacheNames) => {

        return Promise.all(

          cacheNames.map((cacheName) => {

            const isCurrentCache =
              cacheName === APP_CACHE ||
              cacheName === RUNTIME_CACHE;

            if (!isCurrentCache) {

              return caches.delete(
                cacheName
              );

            }

            return Promise.resolve(false);

          })

        );

      })
      .then(() => {

        /*
         * Allow the current service worker
         * to control existing pages.
         */
        return self.clients.claim();

      })

  );

});


/*
 * FETCH
 * -----
 * Decide how requests should be handled.
 */
self.addEventListener("fetch", (event) => {

  const request = event.request;

  /*
   * Only handle GET requests.
   *
   * POST/PUT/PATCH/DELETE requests can contain
   * authentication or other sensitive information
   * and should go directly to the backend.
   */
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(
    request.url
  );

  /*
   * Do not intercept browser extensions.
   */
  if (
    url.protocol !== "http:" &&
    url.protocol !== "https:"
  ) {
    return;
  }

  /*
   * Never cache API requests.
   *
   * This protects account data, authentication
   * responses and private backend information.
   */
  if (
    url.pathname.includes("/api/") ||
    url.pathname.includes("/api")
  ) {
    return;
  }

  /*
   * Do not cache external resources.
   *
   * This keeps the service worker focused on
   * the JG application itself.
   */
  if (
    url.origin !== self.location.origin
  ) {
    return;
  }

  /*
   * HTML navigation:
   * Network first, then cached page.
   *
   * This allows users to receive newer versions
   * when online while retaining basic offline support.
   */
  if (
    request.mode === "navigate" ||
    request.destination === "document"
  ) {

    event.respondWith(
      networkFirst(request)
    );

    return;
  }

  /*
   * CSS, JS, images and other static assets:
   * Cache first, then network.
   */
  event.respondWith(
    cacheFirst(request)
  );

});


/*
 * NETWORK FIRST
 * -------------
 * Used primarily for HTML pages.
 */
async function networkFirst(
  request
) {

  try {

    const networkResponse =
      await fetch(request);

    /*
     * Cache successful same-origin responses.
     */
    if (
      networkResponse &&
      networkResponse.ok &&
      networkResponse.type ===
        "basic"
    ) {

      const cache =
        await caches.open(
          RUNTIME_CACHE
        );

      await cache.put(
        request,
        networkResponse.clone()
      );
    }

    return networkResponse;

  } catch (error) {

    /*
     * Network failed.
     * Try the runtime cache first.
     */
    const runtimeCache =
      await caches.match(
        request
      );

    if (runtimeCache) {
      return runtimeCache;
    }

    /*
     * Then try the application shell.
     */
    const appCache =
      await caches.open(
        APP_CACHE
      );

    const cachedPage =
      await appCache.match(
        "./index.html"
      );

    if (cachedPage) {
      return cachedPage;
    }

    /*
     * Last-resort offline response.
     */
    return new Response(
      `
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1"
          >
          <title>JG — Offline</title>
          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              padding: 24px;
              box-sizing: border-box;
              font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;
              background: #07111f;
              color: white;
              text-align: center;
            }

            .box {
              max-width: 420px;
            }

            h1 {
              margin-bottom: 12px;
            }

            p {
              line-height: 1.6;
              opacity: .8;
            }
          </style>
        </head>

        <body>
          <main class="box">
            <h1>You're offline</h1>
            <p>
              JG could not connect to the internet.
              Reconnect and try again.
            </p>
          </main>
        </body>
        </html>
      `,
      {
        status: 503,
        headers: {
          "Content-Type":
            "text/html; charset=utf-8"
        }
      }
    );
  }
}


/*
 * CACHE FIRST
 * -----------
 * Used for static application assets.
 */
async function cacheFirst(
  request
) {

  const cached =
    await caches.match(
      request
    );

  if (cached) {
    return cached;
  }

  try {

    const response =
      await fetch(request);

    if (
      response &&
      response.ok &&
      response.type === "basic"
    ) {

      const cache =
        await caches.open(
          RUNTIME_CACHE
        );

      await cache.put(
        request,
        response.clone()
      );
    }

    return response;

  } catch (error) {

    /*
     * Asset unavailable both online
     * and offline.
     */
    return new Response(
      "",
      {
        status: 503,
        statusText:
          "JG asset unavailable"
      }
    );
  }
}


/*
 * MESSAGE HANDLER
 * ---------------
 * Allows the frontend to request
 * service-worker actions.
 */
self.addEventListener(
  "message",
  (event) => {

    if (!event.data) {
      return;
    }

    const action =
      event.data.action;

    /*
     * Immediately activate a newly
     * installed service worker.
     */
    if (
      action ===
      "SKIP_WAITING"
    ) {

      self.skipWaiting();

      return;
    }

    /*
     * Clear all JG caches.
     */
    if (
      action ===
      "CLEAR_CACHE"
    ) {

      event.waitUntil(

        caches
          .keys()
          .then((cacheNames) => {

            return Promise.all(
              cacheNames.map(
                (cacheName) =>
                  caches.delete(
                    cacheName
                  )
              )
            );

          })

      );

    }

  }
);


/*
 * ERROR SAFETY
 * ------------
 * Service-worker errors should not break
 * the normal website.
 */
self.addEventListener(
  "error",
  (event) => {

    console.error(
      "[JG SW] Runtime error:",
      event.error
    );

  }
);

self.addEventListener(
  "unhandledrejection",
  (event) => {

    console.error(
      "[JG SW] Unhandled promise rejection:",
      event.reason
    );

  }
);
