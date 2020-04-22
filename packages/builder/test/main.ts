import { testOrigin } from "./origins";

if (!navigator.serviceWorker.controller) {
  // first load
  navigator.serviceWorker.register(
    `/service-worker.js?origin=${encodeURIComponent(testOrigin)}`,
    { scope: "/" }
  );
  console.log("Waiting for test service worker");
  navigator.serviceWorker.ready.then(() => {
    // @ts-ignore: we are actually in main thread, not worker.
    window.location.reload();
  });
}
