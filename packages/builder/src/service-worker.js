let counter = 0;
let identity = 11;
console.log(`I am service worker ${identity} ${counter++}`);

self.addEventListener('install', event => {
  console.log(`${identity} installing`);

  // force moving on to activation even if another service worker had control
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log(`${identity} now ready to handle fetches!`);

  // takes over when there is *no* existing service worker
  clients.claim();
});

self.addEventListener('fetch', event => {
  console.log(`fetch in ${identity}: ${event.request.url}`);
  event.respondWith(fetch(event.request));
});