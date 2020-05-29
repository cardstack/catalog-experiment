import { installFileAssertions, FileAssert } from "./helpers/file-assertions";
import { FileDaemonClient } from "../src/file-daemon-client";
import { testFileDaemonURL as origin } from "./origins";
import {
  makeClient,
  makeListener,
  setupScenario,
  setFile,
  removeFile,
  resetFileSystem,
  getFile,
} from "./helpers/file-daemon-helpers";
import { withListener } from "./helpers/event-helpers";

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

QUnit.module("file-daemon-client", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  QUnit.module("readonly tests", function (origHooks) {
    let client: FileDaemonClient;

    origHooks.beforeEach(async (assert) => {
      await setupScenario(scenario);

      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles({}, origin);

      client = makeClient(fileAssert.fs);
      await client.ready;
    });

    origHooks.afterEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      fileAssert.fs.removeAllEventListeners();
      await client.close();
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
    let client: FileDaemonClient;

    origHooks.beforeEach(async (assert) => {
      await setupScenario(scenario);

      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles({}, origin);

      client = makeClient(fileAssert.fs, new URL("/mount/", origin));
      await client.ready;
    });

    origHooks.afterEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      fileAssert.fs.removeAllEventListeners();
      await client.close();
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
    let client: FileDaemonClient;

    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await setupScenario(scenario);
      await fileAssert.setupFiles({}, origin);

      client = makeClient(fileAssert.fs);
      await client.ready;
      await fileAssert.fs.eventsFlushed();
    });

    origHooks.afterEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      fileAssert.fs.removeAllEventListeners();
      await fileAssert.fs.eventsFlushed();
      await client.close();
      await resetFileSystem();
    });

    test("can handle an added file", async function (assert) {
      let { listener, wait } = makeListener(
        origin.href,
        "write",
        "one/two/foo.txt"
      );
      await withListener(assert.fs, origin.href, listener, async () => {
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
        "write",
        "blah/bleep/blurp.txt"
      );
      await withListener(assert.fs, origin.href, listener, async () => {
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
        "remove",
        "blah/bleep/blurp.txt"
      );
      await withListener(assert.fs, origin.href, listener, async () => {
        await removeFile("blah/bleep/blurp.txt");
        await wait();

        await assert.file("blah/bleep/blurp.txt").doesNotExist();
      });
    });
  });
});
