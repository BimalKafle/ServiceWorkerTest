self.addEventListener("install", (event) => {
  event.waitUntil(console.log("Service worker installing"));
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
    fetch(event.request)
      .then((response) => {
        // Check if the response is valid
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Modify the response if needed
        return response;
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Return a custom error response
        return new Response("Fetch failed", { status: 500 });
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
