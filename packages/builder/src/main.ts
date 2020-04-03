// Typescript doesn't really deal with multiple contexts (main thread vs worker)
// in one project. Most of this project is worker context, but this file is main
// thread context.

if (!navigator.serviceWorker.controller) {
  // first load
  navigator.serviceWorker.register("/service-worker.js", {
    scope: "/",
  });
  console.log("Waiting for service worker");
  navigator.serviceWorker.ready.then(() => {
    // @ts-ignore: we are actually in main thread, not worker.
    window.location.reload();
  });
}

import { Tar } from "tarstream";

window.test = async function test() {
  let t = new Tar();
  t.addFile({ name: "hello.txt", data: new Uint8Array([65, 66]) });
  let stream = t.finish();
  await fetch("/tartest", { body: stream, method: "POST" });
};
