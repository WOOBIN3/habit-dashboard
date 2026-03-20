const CACHE_NAME = "habit-dashboard-v4";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192-v3.png",
  "/icon-512-v3.png"
];

// 설치될 때 필요한 파일들을 미리 캐시에 저장
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("캐시 열기 성공");
      return cache.addAll(urlsToCache);
    })
  );
});

// 활성화될 때 오래된 캐시 삭제
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("오래된 캐시 삭제:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 요청이 오면 캐시 먼저 확인하고, 없으면 네트워크 요청
self.addEventListener("fetch", (event) => {
  // 페이지 이동 요청이면: 네트워크 우선, 실패하면 index.html 반환
  if (event.request.mode === "navigate") {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match("/index.html").then((response) => {
        return response || new Response("오프라인 상태입니다");
      });
    })
  );
  return;
}

  // 그 외 파일(js, css, 이미지 등)은 캐시 우선, 없으면 네트워크
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});