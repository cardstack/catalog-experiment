// Typescript doesn't really deal with multiple contexts (main thread vs worker)
// in one project. Most of this project is worker context, but this file is main
// thread context.

// @ts-ignore: we are actually in main thread, not worker.
const win = window;
// @ts-ignore: we are actually in main thread, not worker.
const doc = document;

if (!navigator.serviceWorker.controller) {
  // first load
  navigator.serviceWorker.register("/service-worker.js", {
    scope: "/",
  });
  console.log("Waiting for service worker");
  navigator.serviceWorker.ready.then(() => {
    win.location.reload();
  });
} else {
  // Render the CatalogJS UI and respond to window positioning requests
  let iframe = doc.createElement("iframe");
  iframe.setAttribute("src", "http://localhost:4300");
  if (!doc.body) {
    doc.body = doc.createElement("body");
  }
  doc.body.append(iframe);
}
