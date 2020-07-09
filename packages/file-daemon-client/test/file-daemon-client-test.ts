import {
  installFileAssertions,
  FileAssert,
} from "../../builder-worker/test/helpers/file-assertions";
import {
  makeListener,
  setupScenario,
  setFile,
  removeFile,
  resetFileSystem,
} from "./helpers/file-daemon-helpers";
import { withListener } from "../../builder-worker/test/helpers/event-helpers";
import { FileDaemonClientVolume, FileDaemonClientDriver } from "../src/index";
import { eventCategory } from "../../builder-worker/src/filesystem";
import {
  flushEvents,
  removeAllEventListeners,
} from "../../builder-worker/src/event-bus";

// we use two file daemons, because that lets us test end-to-end that we are
// really writing to the real filesystem. The only communication between the two
// daemons is the disk, so that proves they are really writing and watching
// correctly.
const testDaemon = {
  ws: new URL("ws://localhost:3001"),
  http: new URL("http://localhost:4201"),
  mountedAt: new URL("http://test/example/"),
};
const controlDaemon = {
  ws: new URL("ws://localhost:3002"),
  http: new URL("http://localhost:4202"),
  mountedAt: new URL("http://control/"),
};

let scenario = Object.freeze({
  "test-app/entrypoints.json": `{ "html": ["index.html"] }`,
  "test-app/index.html": `
    <!DOCTYPE html>
    <script src="http://localhost:8080/main.js"></script>
    <script type="module" src="./index.js"></script>
  `,
  "test-app/index.js": `
    import { helloWorld } from "./ui.js";
    document.body.append(helloWorld());
  `,
  "test-app/ui.js": `
    export function helloWorld() {
      let elt = document.createElement("h1");
      elt.textContent = "Hello world";
      return elt;
    }
  `,
  "test-app/blah/foo.txt": `blah`,
  "test-app/blah/bleep/blurp.txt": `hi guys`,
});

QUnit.module("filesystem - file daemon client driver", function (origHooks) {
  let { test, hooks } = installFileAssertions(origHooks);

  let controlVolume: FileDaemonClientVolume;
  let testVolume: FileDaemonClientVolume;

  test("end-to-end", async function (assert) {
    // first we write a bunch of files via the control side
    controlVolume = (await assert.fs.mount(
      controlDaemon.mountedAt,
      new FileDaemonClientDriver(controlDaemon.http, controlDaemon.ws)
    )) as FileDaemonClientVolume;
    await assert.setupFiles(scenario, controlDaemon.mountedAt);

    // then we mount the test side and let it sync in the files
    testVolume = (await assert.fs.mount(
      testDaemon.mountedAt,
      new FileDaemonClientDriver(testDaemon.http, testDaemon.ws)
    )) as FileDaemonClientVolume;

    // as soon as mount as resolved we should see the full sync
    await assert
      .file(`${testDaemon.mountedAt.href}test-app/entrypoints.json`)
      .exists();
    await assert.file(`${testDaemon.mountedAt.href}test-app/index.js`).exists();
    await assert
      .file(`${testDaemon.mountedAt.href}test-app/blah/foo.txt`)
      .exists();
    await assert
      .file(`${testDaemon.mountedAt.href}test-app/blah/bleep/blurp.txt`)
      .exists();

    await assert
      .file(`${testDaemon.mountedAt.href}test-app/blah/bleep/blurp.txt`)
      .matches(/hi guys/);
    assert.equal((await assert.fs.listAllOrigins()).length, 1); // tmp origins are cleaned up
  });

  hooks.after(async function (assert) {
    if (controlVolume) {
      await controlVolume.close();
    }
    if (testVolume) {
      await testVolume.close();
    }
    removeAllEventListeners();
    await flushEvents();
  });

  // test("can handle an added file", async function (assert) {
  //   let { listener, wait } = makeListener(
  //     origin.href,
  //     eventCategory,
  //     "write",
  //     "one/two/foo.txt"
  //   );
  //   await withListener(listener, async () => {
  //     await setFile("one/two/foo.txt", "bar");
  //     await wait();

  //     await assert
  //       .file("one/two/foo.txt")
  //       .matches(/bar/, "file contents are correct");
  //   });
  // });

  // test("can handle an updated file", async function (assert) {
  //   let { listener, wait } = makeListener(
  //     origin.href,
  //     eventCategory,
  //     "write",
  //     "blah/bleep/blurp.txt"
  //   );
  //   await withListener(listener, async () => {
  //     await setFile("blah/bleep/blurp.txt", "bye guys");
  //     await wait();

  //     await assert
  //       .file("blah/bleep/blurp.txt")
  //       .matches(/bye guys/, "file contents are correct");
  //   });
  // });

  // test("can handle a deleted file", async function (assert) {
  //   let { listener, wait } = makeListener(
  //     origin.href,
  //     eventCategory,
  //     "remove",
  //     "blah/bleep/blurp.txt"
  //   );
  //   await withListener(listener, async () => {
  //     await removeFile("blah/bleep/blurp.txt");
  //     await wait();

  //     await assert.file("blah/bleep/blurp.txt").doesNotExist();
  //   });
  // });
});
