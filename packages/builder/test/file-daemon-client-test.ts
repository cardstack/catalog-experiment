import { installFileAssertions, FileAssert } from "./file-assertions";
import { FileDaemonClient } from "../src/file-daemon-client";
import { testFileDaemonURL } from "./origins";
import {
  makeClient,
  setupScenario,
  setFile,
  resetFileSystem,
  waitForListener,
  withEventListener,
} from "./file-daemon-helpers";

const { skip } = QUnit;

QUnit.module("module file-daemon-client", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  QUnit.module("readonly tests", function (hooks) {
    hooks.before(async () => {
      await setupScenario({
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
    });

    hooks.after(async () => resetFileSystem());

    hooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles({}, new URL(testFileDaemonURL));
    });

    hooks.afterEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      fileAssert.fs.removeAllEventListeners();
    });

    test("can perform a full sync", async function (assert) {
      let client = makeClient(assert.fs);
      await client.ready;

      await assert.file("entrypoints.json").exists();
      await assert.file("index.js").exists();
      await assert.file("blah/foo.txt").exists();
      await assert.file("blah/bleep/blurp.txt").exists();

      await assert.file("blah/bleep/blurp.txt").matches(/hi guys/);
      assert.equal((await assert.fs.listAllOrigins()).length, 1); // tmp origins are cleaned up
    });

    test("can rename entrypoints", async function (assert) {
      let client = makeClient(assert.fs);
      await client.ready;
      await assert.file("src-index.html").exists();
      await assert.file("index.html").doesNotExist();
      await assert.file("src-index.html").matches(/src="\.\/index\.js"/);
      await assert.file("entrypoints.json").matches(/"\/src-index.html"/);
    });

    test("can mount file daemon's files on a specific directory", async function (assert) {
      let client = makeClient(assert.fs, "/mount");
      await client.ready;

      await assert.file("/mount/entrypoints.json").exists();
      await assert.file("/mount/index.js").exists();
      await assert.file("/mount/blah/foo.txt").exists();
      await assert.file("/mount/blah/bleep/blurp.txt").exists();
      await assert.file("/mount/src-index.html").exists();
    });
  });

  QUnit.module("mutable tests", function (hooks) {
    let client: FileDaemonClient;

    hooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await setupScenario({
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
      await fileAssert.setupFiles({}, new URL(testFileDaemonURL));
      client = makeClient(fileAssert.fs);
      await client.ready;
    });

    hooks.afterEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      fileAssert.fs.removeAllEventListeners();
      resetFileSystem();
    });

    test("can handle an added file", async function (assert) {
      let { listener, promise: waitForChange } = waitForListener(
        "one/two/foo.txt",
        "write"
      );
      await withEventListener(assert, listener, async () => {
        await setFile("one/two/foo.txt", "bar");
        await waitForChange();

        await assert
          .file("one/two/foo.txt")
          .matches(/bar/, "file contents are correct");
      });
    });

    skip("can handle an updated file", async function (_assert) {});
    skip("can handle a deleted file", async function (_assert) {});
    skip("can add an entrypoint", async function (_assert) {});
    skip("can update an entrypoint", async function (_assert) {});
    skip("can delete an entrypoint", async function (_assert) {});
  });
});
