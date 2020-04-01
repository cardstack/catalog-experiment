// Typescript doesn't really deal with multiple contexts (main thread vs worker)
// in one project. Most of this project is worker context, but this file is main
// thread context.

if (!navigator.serviceWorker.controller) {
  // first load
  navigator.serviceWorker.register('/service-worker.js', {
    type: 'module',
    scope: '/'
  });
  console.log("Waiting for service worker");
  navigator.serviceWorker.ready.then(() => {
    // @ts-ignore: we are actually in main thread, not worker.
    window.location.reload();
  });
}
