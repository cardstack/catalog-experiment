import {
  installFileAssertions,
  FileAssert,
  origin,
  url,
} from "../../builder-worker/test/helpers/file-assertions";
import { NodeReadableToDOM, DOMToNodeReadable } from "file-daemon/stream-shims";
import { join } from "path";
import {
  removeSync,
  ensureDirSync,
  outputFileSync,
  createReadStream,
  existsSync,
} from "fs-extra";
import { NodeFileSystemDriver } from "../src/node-filesystem-driver";
import {
  FileDescriptor,
  DirectoryDescriptor,
} from "../../builder-worker/src/filesystem-drivers/filesystem-driver";
import { withListener } from "../../builder-worker/test/helpers/event-helpers";
import { Event as FSEvent } from "../../builder-worker/src/filesystem";

const testDir = join(__dirname, "testing");

QUnit.module("Node FileSystem", function (origHooks) {
  let { test } = installFileAssertions(origHooks);
  let volumeId: string;

  function setup(scenario: { [path: string]: string }) {
    for (let [path, text] of Object.entries(scenario)) {
      outputFileSync(join(testDir, path), text);
    }
  }

  async function resetAndMount(assert: FileAssert) {
    await assert.setupFiles();

    removeSync(testDir);
    ensureDirSync(testDir);

    volumeId = await assert.fs.mount(
      url("/"),
      new NodeFileSystemDriver(testDir)
    );
  }

  QUnit.module("open", function () {
    let file: FileDescriptor | DirectoryDescriptor | undefined;

    origHooks.beforeEach(async (assert) => {
      file = undefined;
      let fileAssert = (assert as unknown) as FileAssert;
      await resetAndMount(fileAssert);
    });

    origHooks.afterEach(() => {
      if (file) {
        file.close();
      }
    });

    test("can get an existing file when create mode is not specified", async function (assert) {
      setup({
        "foo.txt": "hi",
      });
      file = await assert.fs.open(url("/foo.txt"));
      assert.equal((await file.stat()).type, "file", "type is correct");
    });

    test("can get an existing directory when create mode is not specified", async function (assert) {
      setup({
        "test/foo.txt": "hi",
      });
      file = await assert.fs.open(url("/test"));
      assert.equal((await file.stat()).type, "directory", "type is correct");
    });

    test("throws when path does not exist and create mode is not specified", async function (assert) {
      try {
        await assert.fs.open(url("/not-there"));
        throw new Error(`should not be able to open file`);
      } catch (e) {
        assert.equal(e.code, "NOT_FOUND", "error code is correct");
      }
    });

    test("can create a file", async function (assert) {
      await assert.file("/foo.txt").doesNotExist();
      file = await assert.fs.open(url("/foo.txt"), "file");

      await assert.file("/foo.txt").exists();
      await assert.equal(
        (await file.stat()).type,
        "file",
        "the stat type is correct"
      );
    });

    test("can create a directory", async function (assert) {
      await assert.file("/foo").doesNotExist();
      file = await assert.fs.open(url("/foo"), "directory");

      await assert.file("/foo").exists();
      await assert.equal(
        (await file.stat()).type,
        "directory",
        "the stat type is correct"
      );
    });

    test("can get an existing file when create mode is 'file'", async function (assert) {
      setup({
        "/foo.txt": "hi",
      });
      file = await assert.fs.open(url("/foo.txt"), "file");
      assert.equal((await file.stat()).type, "file", "type is correct");
    });

    test("can get an existing directory when create mode is 'directory'", async function (assert) {
      setup({
        "/test/foo.txt": "hi",
      });
      file = await assert.fs.open(url("/test"), "directory");
      assert.equal((await file.stat()).type, "directory", "type is correct");
    });

    test("can create interior directories when create mode is 'file'", async function (assert) {
      await assert.file("/foo").doesNotExist();
      (await assert.fs.open(url("/foo/bar.txt"), "file")).close();

      await assert.file("/foo").exists();
      file = await assert.fs.open(url("/foo"));
      await assert.equal(
        (await file.stat()).type,
        "directory",
        "the stat type is correct"
      );
    });

    test("can create interior directories when create mode is 'directory'", async function (assert) {
      await assert.file("/foo").doesNotExist();
      (await assert.fs.open(url("/foo/bar"), "directory")).close();

      await assert.file("/foo").exists();
      file = await assert.fs.open(url("/foo"));
      await assert.equal(
        (await file.stat()).type,
        "directory",
        "the stat type is correct"
      );
    });

    test("throws when path specifies a directory but create mode is 'file'", async function (assert) {
      (await assert.fs.open(url("/test"), "directory")).close();

      try {
        await assert.fs.open(url("/test"), "file");
        throw new Error(`should not be able to open file`);
      } catch (e) {
        assert.equal(e.code, "IS_NOT_A_FILE", "error code is correct");
      }
    });

    test("throws when path specifies a file but create mode is 'directory'", async function (assert) {
      setup({
        "/test/foo": "hi",
      });

      try {
        await assert.fs.open(url("/test/foo"), "directory");
        throw new Error(`should not be able to open directory`);
      } catch (e) {
        assert.equal(e.code, "IS_NOT_A_DIRECTORY", "error code is correct");
      }
    });

    test("throws when path specifies an interior directory that is actually a file when mode is 'file'", async function (assert) {
      setup({
        "/test/foo.txt": "hi",
      });
      try {
        await assert.fs.open(url("/test"), "file");
        throw new Error(`should not be able to open file`);
      } catch (e) {
        assert.equal(e.code, "IS_NOT_A_FILE", "error code is correct");
      }
    });
  });

  QUnit.module("file descriptor", function (origHooks) {
    let file: FileDescriptor;
    let directory: DirectoryDescriptor;

    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles();
      removeSync(testDir);
      ensureDirSync(testDir);

      await fileAssert.fs.mount(url("/"), new NodeFileSystemDriver(testDir));
      setup({
        "/foo/bar": "Hello World",
        test: "bye mars",
      });
      directory = (await fileAssert.fs.open(
        url("/foo")
      )) as DirectoryDescriptor;
      file = (await fileAssert.fs.open(url("/foo/bar"))) as FileDescriptor;
    });

    origHooks.afterEach(() => {
      file.close();
      directory.close();
    });

    QUnit.module("write", function () {
      test("can write to a file with a string", async function (assert) {
        await file.write("blah");
        file.close();
        assert.file("/foo/bar").matches(/blah/);
      });

      test("can write to a file with a buffer", async function (assert) {
        let buffer = new TextEncoder().encode("bleep");
        await file.write(buffer);
        file.close();
        assert.file("/foo/bar").matches(/bleep/);
      });

      test("can write to a file with a stream", async function (assert) {
        let stream = new NodeReadableToDOM(
          createReadStream(join(testDir, "test"))
        );
        await file.write(stream);
        file.close();
        assert.file("/foo/bar").matches(/bye mars/);
      });
    });

    QUnit.module("read", function () {
      test("can read a string from a file", async function (assert) {
        assert.equal(
          await file.readText(),
          "Hello World",
          "the file was read correctly"
        );
      });

      test("can read a buffer from a file", async function (assert) {
        assert.deepEqual(
          await file.read(),
          new TextEncoder().encode("Hello World"),
          "the file was read correctly"
        );
      });

      test("can read a stream from a file", async function (assert) {
        let stream = new DOMToNodeReadable(await file.getReadbleStream());
        let buffer: Buffer;

        let done = new Promise((res) => {
          stream.on("data", (data) => {
            buffer = data;
          });
          stream.on("end", () => {
            console.log("stream ended");
            res();
          });
        });
        await done;

        assert.equal(
          buffer!.toString("utf8"),
          "Hello World",
          "the file was read correctly"
        );
      });
    });

    QUnit.module("stat", function () {
      test("can get type from stat of file", async function (assert) {
        assert.equal((await file.stat()).type, "file", "stat value is correct");
      });

      test("can get etag from stat of file", async function (assert) {
        let stat = await file.stat();
        assert.equal(
          stat.etag,
          `${stat.size}_${stat.mtime}`,
          "stat value is correct"
        );
      });

      test("can get size from stat of file", async function (assert) {
        assert.equal((await file.stat()).size, 11, "stat value is correct");
      });

      test("can get mtime from stat of file", async function (assert) {
        assert.ok((await file.stat()).mtime, "mtime exists");
      });

      test("can get type from stat of directory", async function (assert) {
        assert.equal(
          (await directory.stat()).type,
          "directory",
          "stat value is correct"
        );
      });

      test("can get etag from stat of directory", async function (assert) {
        let stat = await directory.stat();
        assert.equal(stat.etag, `${stat.mtime}`, "stat value is correct");
      });

      test("can not get size from stat of directory", async function (assert) {
        assert.equal(
          (await directory.stat()).size,
          undefined,
          "stat value is correct"
        );
      });

      test("can get mtime from stat of directory", async function (assert) {
        assert.ok((await directory.stat()).mtime, "mtime exists");
      });
    });
  });

  QUnit.module("list", function () {
    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await resetAndMount(fileAssert);
    });

    test("can get a non-recursive directory listing", async function (assert) {
      setup({
        "/a.txt": "a",
        "/foo/a.txt": "a",
        "/foo/b.txt": "b",
        "/foo/c.txt": "c",
        "/foo/bar/a.txt": "a",
        "/bleep/a.txt": "a",
        "http://another-origin/blah.txt": "blah",
      });

      let listing = (await assert.fs.list(url("/foo"))).map(
        (fd) => `${fd.stat.type}::${fd.url.pathname}`
      );
      assert.deepEqual(
        listing,
        [
          "directory::/foo",
          "file::/foo/a.txt",
          "file::/foo/b.txt",
          "directory::/foo/bar",
          "file::/foo/c.txt",
        ],
        "the listing is correct"
      );
    });

    test("can get a recursive directory listing", async function (assert) {
      setup({
        "/a.txt": "a",
        "/foo/a.txt": "a",
        "/foo/b.txt": "b",
        "/foo/c.txt": "c",
        "/foo/bar/a.txt": "a",
        "/foo/bar/baz/a.txt": "a",
        "/bleep/a.txt": "a",
        "http://another-origin/blah.txt": "blah",
      });

      let listing = (await assert.fs.list(url("/foo"), true)).map(
        (fd) => `${fd.stat.type}::${fd.url.pathname}`
      );
      assert.deepEqual(
        listing,
        [
          "directory::/foo",
          "file::/foo/a.txt",
          "file::/foo/b.txt",
          "directory::/foo/bar",
          "file::/foo/bar/a.txt",
          "directory::/foo/bar/baz",
          "file::/foo/bar/baz/a.txt",
          "file::/foo/c.txt",
        ],
        "the listing is correct"
      );
    });
  });

  QUnit.module("move", function () {
    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await resetAndMount(fileAssert);
    });

    test("can use 'move' to rename a file", async function (assert) {
      setup({
        "/a.txt": "a",
      });

      await assert.file("/b.txt").doesNotExist();
      await assert.fs.move(url("/a.txt"), url("/b.txt"));

      await assert.file("/a.txt").doesNotExist();
      await assert.file("/b.txt").exists();
      await assert.file("/b.txt").matches(/a/);
    });

    test("can move a file to a directory that doens't exist yet", async function (assert) {
      setup({
        "/a.txt": "a",
      });

      await assert.file("/foo").doesNotExist();
      await assert.fs.move(url("/a.txt"), url("/foo/b.txt"));

      await assert.file("/a.txt").doesNotExist();
      await assert.file("/foo/b.txt").exists();
      await assert.file("/foo/b.txt").matches(/a/);
    });

    test("can use 'move' to rename a directory", async function (assert) {
      setup({
        "/foo/a.txt": "a",
      });

      await assert.file("/bar").doesNotExist();
      await assert.fs.move(url("/foo"), url("/bar"));
      await assert.file("/foo").doesNotExist();
      await assert.file("/bar").exists();
      await assert.file("/bar/a.txt").exists();
      await assert.file("/bar/a.txt").matches(/a/);
    });

    test("can move a directory to a parent directory that doesn't exist yet", async function (assert) {
      setup({
        "/foo/a.txt": "a",
      });

      await assert.file("/bar").doesNotExist();
      await assert.fs.move(url("/foo"), url("/bar/baz"));
      await assert.file("/foo").doesNotExist();
      await assert.file("/bar/baz").exists();
      await assert.file("/bar/baz/a.txt").exists();
      await assert.file("/bar/baz/a.txt").matches(/a/);
    });
  });

  QUnit.module("copy", function () {
    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await resetAndMount(fileAssert);
    });

    test("can copy a file", async function (assert) {
      setup({
        "/a.txt": "a",
      });
      await assert.file("/b.txt").doesNotExist();
      await assert.fs.copy(url("/a.txt"), url("/b.txt"));

      await assert.file("/a.txt").exists();
      await assert.file("/b.txt").exists();
      await assert.file("/b.txt").matches(/a/);
    });

    test("can copy a file to itself", async function (assert) {
      setup({
        "/a.txt": "a",
      });
      await assert.fs.copy(url("/a.txt"), url("/a.txt"));

      await assert.file("/a.txt").exists();
      await assert.file("/a.txt").matches(/a/);
    });

    test("can copy a directory", async function (assert) {
      setup({
        "/foo/bar/a.txt": "a",
        "/foo/bar/b.txt": "b",
      });
      await assert.file("/baz").doesNotExist();
      await assert.fs.copy(url("/foo"), url("/baz"));

      await assert.file("/foo/bar/a.txt").exists();
      await assert.file("/foo/bar/b.txt").exists();
      await assert.file("/baz/bar/a.txt").exists();
      await assert.file("/baz/bar/b.txt").exists();
      await assert.file("/baz/bar/a.txt").matches(/a/);
    });

    test("can copy a directory to itself", async function (assert) {
      setup({
        "/foo/bar/a.txt": "a",
        "/foo/bar/b.txt": "b",
      });
      await assert.fs.copy(url("/foo"), url("/foo"));

      await assert.file("/foo/bar/a.txt").exists();
      await assert.file("/foo/bar/b.txt").exists();
      await assert.file("/foo/bar/a.txt").matches(/a/);
    });

    test("can copy a file to a directory that doesn't exist yet", async function (assert) {
      setup({
        "/a.txt": "a",
      });
      await assert.file("/foo").doesNotExist();
      await assert.fs.copy(url("/a.txt"), url("/foo/a.txt"));

      await assert.file("/a.txt").exists();
      await assert.file("/foo/a.txt").exists();
      await assert.file("/foo/a.txt").matches(/a/);
    });

    test("can copy a directory to a parent directory that doesn't exist yet", async function (assert) {
      setup({
        "/foo/bar/a.txt": "a",
        "/foo/bar/b.txt": "b",
      });
      await assert.file("/baz").doesNotExist();
      await assert.fs.copy(url("/foo"), url("/baz/bloop"));

      await assert.file("/foo/bar/a.txt").exists();
      await assert.file("/foo/bar/b.txt").exists();
      await assert.file("/baz/bloop/bar/a.txt").exists();
      await assert.file("/baz/bloop/bar/b.txt").exists();
      await assert.file("/baz/bloop/bar/a.txt").matches(/a/);
    });
  });

  QUnit.module("remove", function () {
    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await resetAndMount(fileAssert);
    });

    test("can remove a file", async function (assert) {
      setup({
        "/a.txt": "a",
      });

      await assert.file("/a.txt").exists();
      await assert.fs.remove(url("/a.txt"));
      await assert.file("/a.txt").doesNotExist();
    });

    test("can remove a directory", async function (assert) {
      setup({
        "/foo/a.txt": "a",
      });

      await assert.file("/foo/a.txt").exists();
      await assert.fs.remove(url("/foo"));
      await assert.file("/foo").doesNotExist();
    });

    test("does not complain when removing a non-existant file", async function (assert) {
      assert.expect(0);
      await assert.fs.remove(url("does-not-exist"));
    });
  });

  QUnit.module("mounting", function () {
    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles();

      removeSync(testDir);
      ensureDirSync(testDir);
    });

    test("it can mount a volume within another volume", async function (assert) {
      assert.fs.unmount(volumeId);
      ensureDirSync(join(testDir, "a"));
      ensureDirSync(join(testDir, "b"));

      let driverA = new NodeFileSystemDriver(join(testDir, "a"));
      let driverB = new NodeFileSystemDriver(join(testDir, "b"));
      await assert.fs.mount(url("/driverA"), driverA);
      await assert.fs.mount(url("/driverA/foo/driverB"), driverB);

      await assert.fs.open(url("/driverA/blah"), "directory");
      await assert.fs.open(url("/driverA/foo/driverB/bar"), "file");

      await assert.file("/a").doesNotExist();
      await assert.file("/b").doesNotExist();

      assert.equal(
        existsSync(join(testDir, "a", "blah")),
        true,
        "a/blah exists on disk"
      );
      assert.equal(
        existsSync(join(testDir, "a", "foo")),
        true,
        "a/foo exists on disk"
      );
      assert.equal(
        existsSync(join(testDir, "a", "foo", "driverB")),
        true,
        "a/foo/driverB exists on disk"
      );
      assert.equal(
        existsSync(join(testDir, "b", "bar")),
        true,
        "b/bar exists on disk"
      );
      assert.equal(
        existsSync(join(testDir, "a", "foo", "driverB", "bar")),
        false,
        "a/foo/driverB/bar does not exist on disk"
      );

      let listing = (await assert.fs.list(url("/"), true)).map(
        (i) => i.url.href
      );
      assert.deepEqual(listing, [
        `${origin}/`,
        `${origin}/driverA`,
        `${origin}/driverA/blah`,
        `${origin}/driverA/foo`,
        `${origin}/driverA/foo/driverB`,
        `${origin}/driverA/foo/driverB/bar`,
      ]);
    });
  });

  QUnit.module("events", function () {
    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles();
      fileAssert.fs.removeAllEventListeners();
      await resetAndMount(fileAssert);
    });

    origHooks.afterEach((assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      fileAssert.fs.removeAllEventListeners();
    });

    test("triggers a 'create' event when a new file is opened", async function (assert) {
      assert.expect(2);
      let listener = (e: FSEvent) => {
        assert.equal(e.url.href, `${origin}/test`, "the event url is correct");
        assert.equal(e.type, "create", "the event type is correct");
      };
      await assert.fs.open(url("/"), "directory"); // ignore these events
      await withListener(assert.fs, origin, listener, async () => {
        await assert.fs.open(url("test"), "file");
        await assert.fs.eventsFlushed();
      });
    });

    test("triggers a 'create' event when a new directory is opened", async function (assert) {
      assert.expect(2);
      let listener = (e: FSEvent) => {
        assert.equal(e.url.href, `${origin}/test`, "the event url is correct");
        assert.equal(e.type, "create", "the event type is correct");
      };
      await assert.fs.open(url("/"), "directory"); // ignore these events
      await withListener(assert.fs, origin, listener, async () => {
        await assert.fs.open(url("test"), "directory");
        await assert.fs.eventsFlushed();
      });
    });

    test("triggers a 'remove' event for source of move", async function (assert) {
      assert.expect(2);
      await assert.fs.open(url("src"), "file");
      let listener = (e: FSEvent) => {
        if (e.type === "remove") {
          assert.equal(e.url.href, `${origin}/src`, "the event url is correct");
          assert.equal(e.type, "remove", "the event type is correct");
        }
      };
      await withListener(assert.fs, origin, listener, async () => {
        await assert.fs.move(url("src"), url("dest"));
        await assert.fs.eventsFlushed();
      });
    });

    test("triggers a 'create' and 'write' events for destination of copy", async function (assert) {
      assert.expect(4);
      await assert.fs.open(url("src"), "file");
      let listener = (e: FSEvent) => {
        if (e.type === "create") {
          assert.equal(
            e.url.href,
            `${origin}/dest`,
            "the event url is correct"
          );
          assert.equal(e.type, "create", "the event type is correct");
        } else if (e.type === "write") {
          assert.equal(
            e.url.href,
            `${origin}/dest`,
            "the event url is correct"
          );
          assert.equal(e.type, "write", "the event type is correct");
        }
      };
      await withListener(assert.fs, origin, listener, async () => {
        await assert.fs.copy(url("src"), url("dest"));
        await assert.fs.eventsFlushed();
      });
    });

    test("triggers a 'remove' event when a resource is deleted", async function (assert) {
      assert.expect(2);
      await assert.fs.open(url("test"), "file");
      let listener = (e: FSEvent) => {
        assert.equal(e.url.href, `${origin}/test`, "the event url is correct");
        assert.equal(e.type, "remove", "the event type is correct");
      };
      await withListener(assert.fs, origin, listener, async () => {
        await assert.fs.remove(url("test"));
        await assert.fs.eventsFlushed();
      });
    });

    test("triggers a 'write' event when a file is written to", async function (assert) {
      assert.expect(2);
      let file = await assert.fs.open(url("test"), "file");
      let listener = (e: FSEvent) => {
        assert.equal(e.url.href, `${origin}/test`, "the event url is correct");
        assert.equal(e.type, "write", "the event type is correct");
      };
      await withListener(assert.fs, origin, listener, async () => {
        await file.write("blah");
        await assert.fs.eventsFlushed();
      });
    });
  });
});
