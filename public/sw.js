const CACHE_PREFIX = `cinemaddict-cache`;
const CACHE_VER = `v4`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/css/normalize.css`,
          `/css/main.css`,
        ]);
      })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((key) => {
              if (key !== CACHE_NAME) {
                return caches.delete(key);
              }

              return null;
            }
          ).filter(
            (key) => key !== null
          )
        )
      )
  );
});

const fetchHandler = (evt) => {
  const {request} = evt;

  evt.respondWith(
    caches.match(request)
      .then((cacheResponse) => {
        if (cacheResponse) {
          return cacheResponse;
        }

        return fetch(request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== `basic`) {
              return response;
            }

            const clonedResponse = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, clonedResponse));

            return response;
          }
        );
      })
  );
};

self.addEventListener(`fetch`, fetchHandler);
