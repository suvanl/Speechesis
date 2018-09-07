const cacheName = "v2";

// Call install event
self.addEventListener("install", () => {
  console.log("[SW]: Installed");
});

// Call activate event
self.addEventListener("activate", e => {
  console.log("[SW]: Activated");

  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call fetch event
self.addEventListener("fetch", e => {
  console.log("[SW]: Fetching");
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Create a clone of the response
        const resClone = res.clone();
        // Open cache
        caches.open(cacheName).then(cache => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request).then(res => res))
  );
});
