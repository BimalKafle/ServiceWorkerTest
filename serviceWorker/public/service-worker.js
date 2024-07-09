const staticCacheName = "static-site";
const assets = ["/index.html", "/assets/styles.css", "/assets/script.js"];
self.addEventListener("install", (event) => {
  event.waitUntil(console.log("Service worker installing"));
  event.waitUntil(
    caches.open(staticCacheName).then((caches) => {
      caches.addAll(assets);
    })
  );
});
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-database") {
    event.waitUntil(syncDatabase());
  }
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return cacheRes || fetch(event.request);
    })
  );
});

async function syncDatabase() {
  try {
    console.log("Database sync successful");
  } catch (err) {
    console.error("Database sync failed:", err);
  }
}

let counter = 0;
let intervalId;

self.addEventListener("message", (event) => {
  console.log("Message received from main script");
  if (event.data === "start timer") {
    // Clear any existing interval to avoid multiple timers
    clearInterval(intervalId);

    // Start a new interval to update the counter
    intervalId = setInterval(() => {
      counter++;
      const message = `Counter: ${counter}`;
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage(message);
        });
      });
    }, 1000);
  } else if (event.data === "stop timer") {
    // Stop the timer if requested
    clearInterval(intervalId);
    counter = 0;
    const message = `Counter stopped and reset`;
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage(message);
      });
    });
  }
});
