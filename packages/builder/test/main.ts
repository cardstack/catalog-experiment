if (!navigator.serviceWorker.controller) {
  // first load
  navigator.serviceWorker.register("/service-worker-test-entrypoint.js", {
    scope: "/",
  });
  console.log("Waiting for test service worker");
  navigator.serviceWorker.ready.then(() => {
    // @ts-ignore: we are actually in main thread, not worker.
    window.location.reload();
  });
}
