import { installFileAssertions, FileAssert } from "./helpers/file-assertions";
import { testFileDaemonURL as origin, testWebsocketURL } from "./origins";
import {
  makeListener,
  setupScenario,
  setFile,
  removeFile,
  resetFileSystem,
  getFile,
} from "./helpers/file-daemon-helpers";
import { withListener } from "./helpers/event-helpers";
import {
  FileDaemonClientVolume,
  FileDaemonClientDriver,
} from "../src/filesystem-drivers/file-daemon-client-driver";
import { eventCategory } from "../src/filesystem";
import { flushEvents, removeAllEventListeners } from "../src/event-bus";

let scenario = Object.freeze({
  "entrypoints.json": `["index.html"]`,
  "index.html": `
    <!DOCTYPE html>
    <script src="http://localhost:8080/main.js"></script>
    <script type="module" src="./index.js"></script>
  `,
  "index.js": `
    import { helloWorld } from "./ui.js";
    document.body.append(helloWorld());
  `,
  "ui.js": `
    export function helloWorld() {
      let elt = document.createElement("h1");
      elt.textContent = "Hello world";
      return elt;
    }
  `,
  "blah/foo.txt": `blah`,
  "blah/bleep/blurp.txt": `hi guys`,
});

QUnit.module("filesystem - file daemon client driver", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  QUnit.module("readonly tests", function (origHooks) {
    let volume: FileDaemonClientVolume;

    origHooks.beforeEach(async (assert) => {
      await setupScenario(scenario);

      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles({}, origin);

      let driver = new FileDaemonClientDriver(origin, testWebsocketURL);
      volume = (await fileAssert.fs.mount(
        origin,
        driver
      )) as FileDaemonClientVolume;
    });

    origHooks.afterEach(async () => {
      removeAllEventListeners();
      await volume.close();
      await resetFileSystem();
    });

    test("file daemon can serve a file", async function (assert) {
      let res = await getFile("blah/foo.txt");
      assert.equal(await res.text(), "blah", "the file was returned");
    });

    test("file daemon returns 404 when file does not exist", async function (assert) {
      let res = await getFile("does-not-exist");
      assert.equal(res.status, 404, "the response status code is correct");
    });

    test("can perform a full sync", async function (assert) {
      await assert.file("entrypoints.json").exists();
      await assert.file("index.js").exists();
      await assert.file("blah/foo.txt").exists();
      await assert.file("blah/bleep/blurp.txt").exists();

      await assert.file("blah/bleep/blurp.txt").matches(/hi guys/);
      assert.equal((await assert.fs.listAllOrigins()).length, 1); // tmp origins are cleaned up
    });
  });

  QUnit.module("readonly mount tests", function (origHooks) {
    let volume: FileDaemonClientVolume;

    origHooks.beforeEach(async (assert) => {
      await setupScenario(scenario);

      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles({}, origin);

      let driver = new FileDaemonClientDriver(origin, testWebsocketURL);
      volume = (await fileAssert.fs.mount(
        new URL("/mount/", origin),
        driver
      )) as FileDaemonClientVolume;
    });

    origHooks.afterEach(async () => {
      removeAllEventListeners();
      await volume.close();
      await resetFileSystem();
    });

    test("can mount file daemon's files on a specific directory", async function (assert) {
      await assert.file("/mount/entrypoints.json").exists();
      await assert.file("/mount/index.js").exists();
      await assert.file("/mount/blah/foo.txt").exists();
      await assert.file("/mount/blah/bleep/blurp.txt").exists();
      await assert.file("/mount/index.html").exists();
    });
  });

  QUnit.module("mutable tests", function (origHooks) {
    let volume: FileDaemonClientVolume;

    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await setupScenario(scenario);
      await fileAssert.setupFiles({}, origin);

      let driver = new FileDaemonClientDriver(origin, testWebsocketURL);
      volume = (await fileAssert.fs.mount(
        origin,
        driver
      )) as FileDaemonClientVolume;
      await flushEvents();
    });

    origHooks.afterEach(async () => {
      removeAllEventListeners();
      await flushEvents();
      await volume.close();
      await resetFileSystem();
    });

    test("can handle an added file", async function (assert) {
      let { listener, wait } = makeListener(
        origin.href,
        eventCategory,
        "write",
        "one/two/foo.txt"
      );
      await withListener(listener, async () => {
        await setFile("one/two/foo.txt", "bar");
        await wait();

        await assert
          .file("one/two/foo.txt")
          .matches(/bar/, "file contents are correct");
      });
    });

    test("can handle an updated file", async function (assert) {
      let { listener, wait } = makeListener(
        origin.href,
        eventCategory,
        "write",
        "blah/bleep/blurp.txt"
      );
      await withListener(listener, async () => {
        await setFile("blah/bleep/blurp.txt", "bye guys");
        await wait();

        await assert
          .file("blah/bleep/blurp.txt")
          .matches(/bye guys/, "file contents are correct");
      });
    });

    test("can handle a deleted file", async function (assert) {
      let { listener, wait } = makeListener(
        origin.href,
        eventCategory,
        "remove",
        "blah/bleep/blurp.txt"
      );
      await withListener(listener, async () => {
        await removeFile("blah/bleep/blurp.txt");
        await wait();

        await assert.file("blah/bleep/blurp.txt").doesNotExist();
      });
    });
  });
});
