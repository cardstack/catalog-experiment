import { installFileAssertions, FileAssert } from "./file-assertions";
import { FileDaemonClient } from "../src/file-daemon-client";
import { FileSystem } from "../src/filesystem";
import { testFileDaemonURL, testWebsocketURL } from "./origins";
import { fileDaemonKey } from "../src/env";

const { skip } = QUnit;

QUnit.module("module file-daemon-client", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  function makeClient(fs: FileSystem, mountpoint = "/") {
    return new FileDaemonClient(
      testFileDaemonURL,
      testWebsocketURL,
      fs,
      mountpoint
    );
  }

  async function setFile(path: string, contents: string) {
    await fetch(
      `${testFileDaemonURL}${path}?key=${encodeURIComponent(fileDaemonKey)}`,
      {
        method: "POST",
        body: contents,
      }
    );
  }

  async function makeScenario(scenario: { [filePath: string]: string }) {
    await fetch(
      `${testFileDaemonURL}?scenario=true&key=${encodeURIComponent(
        fileDaemonKey
      )}`,
      {
        method: "POST",
        body: JSON.stringify(scenario),
      }
    );
  }

  async function resetFileSystem() {
    await fetch(
      `${testFileDaemonURL}?reset=true&key=${encodeURIComponent(
        fileDaemonKey
      )}`,
      { method: "POST" }
    );
  }

  QUnit.module("readonly tests", function (hooks) {
    hooks.before(async () => {
      await makeScenario({
        ".entrypoints.json": `["index.html"]`,
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
      await ((assert as unknown) as FileAssert).setupFiles(
        {},
        new URL(testFileDaemonURL)
      );
    });

    test("can perform a full sync", async function (assert) {
      let client = makeClient(assert.fs);
      await client.ready;

      await assert.file(".entrypoints.json").exists();
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
      await assert.file(".entrypoints.json").matches(/"\/src-index.html"/);
    });

    test("can mount file daemon's files on a specific directory", async function (assert) {
      let client = makeClient(assert.fs, "/mount");
      await client.ready;

      await assert.file("/mount/.entrypoints.json").exists();
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
      await fileAssert.setupFiles({}, new URL(testFileDaemonURL));
      await makeScenario({
        ".entrypoints.json": `["index.html"]`,
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
      client = makeClient(fileAssert.fs);
      await client.ready;
    });

    hooks.afterEach(async () => resetFileSystem());

    skip("can handle an added file", async function (_assert) {
      // TODO we need a file system motification mechanism to test this
      await setFile("one/two/foo.txt", "bar");
    });
    skip("can handle an updated file", async function (_assert) {});
    skip("can handle a deleted file", async function (_assert) {});
    skip("can add an entrypoint", async function (_assert) {});
    skip("can update an entrypoint", async function (_assert) {});
    skip("can delete an entrypoint", async function (_assert) {});
  });
});
