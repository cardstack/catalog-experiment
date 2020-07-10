import { installFileAssertions } from "../../builder-worker/test/helpers/file-assertions";
import { waitForFileEvent } from "./helpers/file-daemon-helpers";
import { FileDaemonClientVolume, FileDaemonClientDriver } from "../src/index";
import {
  flushEvents,
  removeAllEventListeners,
} from "../../builder-worker/src/event-bus";
import { FileDescriptor } from "../../builder-worker/src/filesystem-drivers/filesystem-driver";
import { FileSystem } from "../../builder-worker/src/filesystem";

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

async function resetScenario(fs: FileSystem, scenario: any, mountPoint: URL) {
  let childDirs: Set<string> = new Set();
  for (let path of Object.keys(scenario)) {
    let dirs = path.split("/");
    dirs.pop();
    if (dirs?.length > 1) {
      childDirs.add(`${dirs[0]}/${dirs[1]}`);
    }

    let url = new URL(path, mountPoint);
    await fs.remove(url);
    await waitForFileEvent(url);
  }

  for (let path of childDirs) {
    let url = new URL(path, mountPoint);
    await fs.remove(url);
    await waitForFileEvent(url);
  }
}

QUnit.module("filesystem - file daemon client driver", function (origHooks) {
  let { test, hooks } = installFileAssertions(origHooks);

  let controlVolume: FileDaemonClientVolume;
  let testVolume: FileDaemonClientVolume;

  hooks.after(async function (assert) {
    await resetScenario(assert.fs, scenario, controlDaemon.mountedAt);
    if (controlVolume) {
      await controlVolume.close();
    }
    if (testVolume) {
      await testVolume.close();
    }
    removeAllEventListeners();
    await flushEvents();
  });

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

    // incremental update: add a file
    let handle = await assert.fs.open(
      new URL(`${controlDaemon.mountedAt.href}test-app/new-file.txt`),
      true
    );
    await (handle as FileDescriptor).write("New File!");
    handle.close();
    await waitForFileEvent(
      new URL(`${testDaemon.mountedAt.href}test-app/new-file.txt`)
    );
    await assert
      .file(`${testDaemon.mountedAt.href}test-app/new-file.txt`)
      .matches(/New File!/);

    // incremental update: modify a file
    handle = await assert.fs.open(
      new URL(`${controlDaemon.mountedAt.href}test-app/new-file.txt`),
      true
    );
    await (handle as FileDescriptor).write("this is a change");
    handle.close();
    await waitForFileEvent(
      new URL(`${testDaemon.mountedAt.href}test-app/new-file.txt`)
    );
    await assert
      .file(`${testDaemon.mountedAt.href}test-app/new-file.txt`)
      .matches(/this is a change/);

    // incremental update: remove a file
    await assert.fs.remove(
      new URL(`${controlDaemon.mountedAt.href}test-app/new-file.txt`)
    );
    await waitForFileEvent(
      new URL(`${testDaemon.mountedAt.href}test-app/new-file.txt`)
    );
    await assert
      .file(`${testDaemon.mountedAt.href}test-app/new-file.txt`)
      .doesNotExist();
  });
});
