const CACHE_NAME = "habit-dashboard-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192-v3.png",
  "/icon-512-v3.png"
];

// 설치 시 캐싱
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 요청 가로채기
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // 다른 도메인 요청은 건드리지 않음
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});