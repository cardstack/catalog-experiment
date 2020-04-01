import { parse } from '@babel/core';

let worker = (self as unknown) as ServiceWorkerGlobalScope;

worker.addEventListener("install", () => {
  console.log(`installing`);

  // force moving on to activation even if another service worker had control
  worker.skipWaiting();
});

worker.addEventListener("activate", () => {
  console.log(`activate`);

  // takes over when there is *no* existing service worker
  worker.clients.claim();

  let socket = new WebSocket("ws://localhost:3000");
  socket.onmessage = event => {
    console.log("Received file change notification", event.data);
  };
});

worker.addEventListener("fetch", (event: FetchEvent) => {
  let url = new URL(event.request.url);
  if (url.origin !== worker.origin) {
    console.log(`ignore ${event.request.url} based on origin`);
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    (async () => {
      let response = await fetch(event.request);
      let mediaType = response.headers.get("content-type")?.split(';')?.[0]?.trim();
      if (mediaType !== 'application/javascript') {
        return response;
      } else {
        return bundled(response);
      }
    })()
  );
});

async function bundled(rawResponse: Response): Promise<Response> {
  let text = await rawResponse.text();
  let result = await parse(text, {});
  console.log(result);
  let response = new Response(text);
  response.headers.set('content-type', rawResponse.headers.get('content-type') ?? 'application/octet-stream');
  return response;
}