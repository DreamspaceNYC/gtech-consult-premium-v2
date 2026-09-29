/* G-Tech PWA service worker — offline support for the solar planner site.
 * Strategy: pages are network-first (always fresh when online, cached copy
 * when offline); static assets are cache-first. Cross-origin requests
 * (e.g. the chat API) are never touched. Bump CACHE to force an update. */
const CACHE = "gtech-pwa-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

function offlinePage() {
  return (
    "<!doctype html><html><head><meta charset='utf-8'>" +
    "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
    "<title>G-Tech Consult — offline</title>" +
    "<style>body{font-family:system-ui,sans-serif;background:#102530;color:#fff;" +
    "display:flex;align-items:center;justify-content:center;min-height:100vh;" +
    "margin:0;padding:24px;text-align:center}h1{font-size:20px}p{opacity:.75}</style>" +
    "</head><body><div><h1>You are offline</h1>" +
    "<p>Please reconnect and try again — your last visited pages will load.</p>" +
    "</div></body></html>"
  );
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Pages: network first, cached copy when offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches
            .match(req)
            .then(
              hit =>
                hit ||
                new Response(offlinePage(), {
                  headers: { "Content-Type": "text/html" },
                }),
            ),
        ),
    );
    return;
  }

  // Static assets: cache first.
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/")
  ) {
    event.respondWith(
      caches.match(req).then(
        hit =>
          hit ||
          fetch(req).then(res => {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
            return res;
          }),
      ),
    );
  }
});
