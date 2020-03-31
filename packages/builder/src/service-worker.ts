let identity = 13;
console.log(`I am service worker ${identity}`);
let worker = self as unknown as ServiceWorkerGlobalScope;

worker.addEventListener('install', () => {
  console.log(`${identity} installing`);

  // force moving on to activation even if another service worker had control
  worker.skipWaiting();
});

worker.addEventListener('activate', () => {
  console.log(`${identity} now ready to handle fetches!`);

  // takes over when there is *no* existing service worker
  worker.clients.claim();

  let socket = new WebSocket('ws://localhost:3000');
  socket.onmessage = event => {
    console.log('Received file change notification', event.data);
  };
});

worker.addEventListener('fetch', (event: FetchEvent) => {
  console.log(`fetch in ${identity}: ${event.request.url}`);
  event.respondWith(fetch(event.request));
});