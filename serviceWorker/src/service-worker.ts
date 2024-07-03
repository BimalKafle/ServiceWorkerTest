self.addEventListener("install", (event: any) => {
  event.waitUntil(console.log("Service worker installing"));
});

self.addEventListener("activate", (event: any) => {
  event.waitUntil(console.log("Service worker activate"));
});

self.addEventListener("sync", (event: any) => {
  if (event.tag === "sync-database") {
    event.waitUntil(syncDatabase());
  }
});

async function syncDatabase() {
  try {
    console.log("Database sync successful");
  } catch (err) {
    console.error("Database sync failed:", err);
  }
}
