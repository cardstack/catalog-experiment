import {
  installFileAssertions,
  FileAssert,
  origin,
  url,
} from "./helpers/file-assertions";
import { withListener } from "./helpers/event-helpers";
import {
  flushEvents,
  removeAllEventListeners,
  removeEventListener,
  Event,
} from "../src/event-bus";

import {
  MemoryDriver,
  MemoryFileDescriptor,
  MemoryDirectoryDescriptor,
} from "../src/filesystem-drivers/memory-driver";

QUnit.module("filesystem", function (origHooks) {
  let { test, hooks } = installFileAssertions(origHooks);
  hooks.beforeEach(function (assert) {
    assert.resetFilesystem();
  });

  QUnit.module("mounting", function () {
    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles();
    });

    test("it can mount a volume within another volume", async function (assert) {
      let driverA = new MemoryDriver();
      let driverB = new MemoryDriver();
      await assert.fs.mount(url("/driverA/"), driverA);
      await assert.fs.mount(url("/driverA/foo/driverB/"), driverB);

      await assert.fs.open(url("/driverA/blah/"), true);
      await assert.fs.open(url("/driverA/foo/driverB/bar"), true);

      let listing = (await assert.fs.list(url("/"), true)).map(
        (i) => i.url.href
      );
      assert.deepEqual(listing, [
        `${origin}/`,
        `${origin}/driverA/`,
        `${origin}/driverA/blah/`,
        `${origin}/driverA/foo/`,
        `${origin}/driverA/foo/driverB/`,
        `${origin}/driverA/foo/driverB/bar`,
      ]);
    });

    test("it throws when you create a mount without a trailing slash in the URL", async function (assert) {
      let driverA = new MemoryDriver();
      try {
        await assert.fs.mount(url("/driverA"), driverA);
        throw new Error("should not be able to mount");
      } catch (e) {
        assert.equal(e.code, "IS_NOT_A_DIRECTORY", "error code is correct");
      }
    });

    test("can unmount a volume", async function (assert) {
      let driverA = new MemoryDriver();
      let driverB = new MemoryDriver();
      await assert.fs.mount(url("/driverA/"), driverA);
      await assert.fs.mount(url("/driverA/foo/driverB/"), driverB);

      await assert.fs.open(url("/driverA/blah/"), true);
      await assert.fs.open(url("/driverA/foo/driverB/bar"), true);

      await assert.fs.unmount(url("/driverA/"));

      await assert.file("/driverA/").doesNotExist();
      await assert.file("/driverA/foo/").doesNotExist();
      await assert.file("/driverA/foo/driverB/").doesNotExist();
      await assert.file("/driverA/foo/driverB/bar").doesNotExist();

      let listing = (await assert.fs.list(url("/"), true)).map(
        (i) => i.url.href
      );

      assert.deepEqual(listing, [`${origin}/`]);
    });
  });

  QUnit.module("events", function () {
    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles();
      removeAllEventListeners();
    });

    origHooks.afterEach(() => {
      removeAllEventListeners();
    });

    test("triggers a 'create' event when a new file is opened", async function (assert) {
      assert.expect(2);
      let listener = (e: Event) => {
        if ("filesystem" in e) {
          assert.equal(
            e.filesystem!.href,
            `${origin}/test`,
            "the event url is correct"
          );
          assert.equal(
            e.filesystem!.type,
            "create",
            "the event type is correct"
          );
        }
      };
      await assert.fs.open(url("/"), true); // ignore these events
      await withListener(listener, async () => {
        await assert.fs.open(url("test"), true);
        await flushEvents();
      });
    });

    test("triggers a 'create' event when a new directory is opened", async function (assert) {
      assert.expect(2);
      let listener = (e: Event) => {
        if ("filesystem" in e) {
          assert.equal(
            e.filesystem!.href,
            `${origin}/test/`,
            "the event url is correct"
          );
          assert.equal(
            e.filesystem!.type,
            "create",
            "the event type is correct"
          );
        }
      };
      await assert.fs.open(url("/"), true); // ignore these events
      await withListener(listener, async () => {
        await assert.fs.open(url("test/"), true);
        await flushEvents();
      });
    });

    test("triggers a 'remove' event for source of move", async function (assert) {
      assert.expect(2);
      await assert.fs.open(url("src"), true);
      let listener = (e: Event) => {
        if ("filesystem" in e) {
          if (e.filesystem!.type === "remove") {
            assert.equal(
              e.filesystem!.href,
              `${origin}/src`,
              "the event url is correct"
            );
            assert.equal(
              e.filesystem!.type,
              "remove",
              "the event type is correct"
            );
          }
        }
      };
      await withListener(listener, async () => {
        await assert.fs.move(url("src"), url("dest"));
        await flushEvents();
      });
    });

    test("triggers a 'create' event for destination of copy", async function (assert) {
      assert.expect(4);
      await assert.fs.open(url("src"), true);
      let listener = (e: Event) => {
        if ("filesystem" in e) {
          if (e.filesystem!.type === "create") {
            assert.equal(
              e.filesystem!.href,
              `${origin}/dest`,
              "the event url is correct"
            );
            assert.equal(
              e.filesystem!.type,
              "create",
              "the event type is correct"
            );
          } else if (e.filesystem!.type === "write") {
            assert.equal(
              e.filesystem!.href,
              `${origin}/dest`,
              "the event url is correct"
            );
            assert.equal(
              e.filesystem!.type,
              "write",
              "the event type is correct"
            );
          }
        }
      };
      await withListener(listener, async () => {
        await assert.fs.copy(url("src"), url("dest"));
        await flushEvents();
      });
    });

    test("triggers a 'remove' event when a resource is deleted", async function (assert) {
      assert.expect(2);
      await assert.fs.open(url("test"), true);
      let listener = (e: Event) => {
        if ("filesystem" in e) {
          assert.equal(
            e.filesystem!.href,
            `${origin}/test`,
            "the event url is correct"
          );
          assert.equal(
            e.filesystem!.type,
            "remove",
            "the event type is correct"
          );
        }
      };
      await withListener(listener, async () => {
        await assert.fs.remove(url("test"));
        await flushEvents();
      });
    });

    test("triggers a 'write' event when a file is written to", async function (assert) {
      assert.expect(2);
      let file = await assert.fs.openFile(url("test"), true);
      let listener = (e: Event) => {
        if ("filesystem" in e) {
          assert.equal(
            e.filesystem!.href,
            `${origin}/test`,
            "the event url is correct"
          );
          assert.equal(
            e.filesystem!.type,
            "write",
            "the event type is correct"
          );
        }
      };
      await withListener(listener, async () => {
        await file.write("blah");
        await flushEvents();
      });
    });

    test("can remove an event listener", async function (assert) {
      assert.expect(0);
      let listener = (e: Event) => {
        throw new Error(`should not receive event: ${e}`);
      };
      await withListener(listener, async () => {
        removeEventListener(listener);
        await assert.fs.open(url("test"), true);
        await flushEvents();
      });
    });

    test("can remove all event listeners", async function (assert) {
      assert.expect(0);
      let listener = (e: Event) => {
        throw new Error(`should not receive event: ${e}`);
      };
      await withListener(listener, async () => {
        removeAllEventListeners();
        await assert.fs.open(url("test"), true);
        await flushEvents();
        await assert.fs.remove(url("test"));
        await flushEvents();
      });
    });
  });

  QUnit.module("open", function () {
    test("can get an existing file when create mode is not specified", async function (assert) {
      await assert.setupFiles({
        "/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/foo.txt"));
      assert.equal((await file.stat()).type, "file", "type is correct");
    });

    test("can get an existing directory when create mode is not specified", async function (assert) {
      await assert.setupFiles({
        "/test/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/test/"));
      assert.equal((await file.stat()).type, "directory", "type is correct");
    });

    test("throws when you try to get a directory without specifying a trailing slash", async function (assert) {
      await assert.setupFiles({
        "/test/foo.txt": "hi",
      });
      try {
        await assert.fs.open(url("/test"));
        throw new Error(`should not be able to open the directory`);
      } catch (e) {
        assert.equal(e.code, "NOT_FOUND", "error code is correct");
      }
    });

    test("throws when path does not exist and create mode is not specified", async function (assert) {
      await assert.setupFiles();
      try {
        await assert.fs.open(url("/not-there"));
        throw new Error(`should not be able to open file`);
      } catch (e) {
        assert.equal(e.code, "NOT_FOUND", "error code is correct");
      }
    });

    test("can create a file", async function (assert) {
      await assert.setupFiles();
      await assert.file("/foo.txt").doesNotExist();
      let file = await assert.fs.open(url("/foo.txt"), true);

      await assert.file("/foo.txt").exists();
      await assert.equal(
        (await file.stat()).type,
        "file",
        "the stat type is correct"
      );
    });

    test("can create a directory", async function (assert) {
      await assert.setupFiles();
      await assert.file("/foo/").doesNotExist();
      let file = await assert.fs.open(url("/foo/"), true);

      await assert.file("/foo/").exists();
      await assert.equal(
        (await file.stat()).type,
        "directory",
        "the stat type is correct"
      );
    });

    test("can get an existing file when create mode is 'true'", async function (assert) {
      await assert.setupFiles({
        "/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/foo.txt"), true);
      assert.equal((await file.stat()).type, "file", "type is correct");
    });

    test("can get an existing directory when create mode is 'true'", async function (assert) {
      await assert.setupFiles({
        "/test/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/test/"), true);
      assert.equal((await file.stat()).type, "directory", "type is correct");
    });

    test("can create interior directories when creating a file", async function (assert) {
      await assert.setupFiles();
      await assert.file("/foo/").doesNotExist();
      await assert.fs.open(url("/foo/bar.txt"), true);

      await assert.file("/foo/").exists();
      let dir = await assert.fs.open(url("/foo/"));
      await assert.equal(
        (await dir.stat()).type,
        "directory",
        "the stat type is correct"
      );
    });

    test("can create interior directories when creating a directory", async function (assert) {
      await assert.setupFiles();
      await assert.file("/foo/").doesNotExist();
      await assert.fs.open(url("/foo/bar/"), true);

      await assert.file("/foo/").exists();
      let dir = await assert.fs.open(url("/foo/"));
      await assert.equal(
        (await dir.stat()).type,
        "directory",
        "the stat type is correct"
      );
    });

    test("can create a file and a directory that differ in name only by a trailing slash in the same parent", async function (assert) {
      await assert.setupFiles({
        "/test/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/test/blah"), true);
      let dir = await assert.fs.open(url("/test/blah/"), true);
      assert.equal((await file.stat()).type, "file", "type is correct");
      assert.equal((await dir.stat()).type, "directory", "type is correct");

      file = await assert.fs.open(url("/test/blah"));
      dir = await assert.fs.open(url("/test/blah/"));
      assert.equal((await file.stat()).type, "file", "type is correct");
      assert.equal((await dir.stat()).type, "directory", "type is correct");
    });
  });

  QUnit.module("file descriptor", function (origHooks) {
    let file: MemoryFileDescriptor;
    let directory: MemoryDirectoryDescriptor;

    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles({
        "/foo/bar": "Hello World",
      });
      directory = (await fileAssert.fs.open(
        url("/foo/")
      )) as MemoryDirectoryDescriptor;
      file = (await fileAssert.fs.open(
        url("/foo/bar")
      )) as MemoryFileDescriptor;
    });

    QUnit.module("write", function () {
      test("can write to a file with a string", async function (assert) {
        await file.write("blah");
        assert.file("/foo/bar").matches(/blah/);
      });

      test("can write to a file with a buffer", async function (assert) {
        let buffer = new TextEncoder().encode("bleep");
        await file.write(buffer);
        assert.file("/foo/bar").matches(/bleep/);
      });

      test("can write to a file with a stream", async function (assert) {
        let buffer = new TextEncoder().encode("blurp");
        let stream = new ReadableStream({
          async start(controller: ReadableStreamDefaultController) {
            if (!buffer) {
              controller.close();
            } else {
              controller.enqueue(new Uint8Array(buffer));
              controller.close();
            }
          },
        });

        await file.write(stream);
        assert.file("/foo/bar").matches(/blurp/);
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
        let buffer = await readStream(await file.getReadableStream());
        assert.deepEqual(
          buffer,
          new TextEncoder().encode("Hello World"),
          "the file was read correctly"
        );
      });
    });

    QUnit.module("stat", function () {
      test("can get type from stat of file", async function (assert) {
        assert.equal((await file.stat()).type, "file", "stat value is correct");
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
        directory.setEtag("xyz");
        assert.equal(
          (await directory.stat()).etag,
          "xyz",
          "stat value is correct"
        );
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
    test("can get a non-recursive directory listing", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
        "/foo/a.txt": "a",
        "/foo/b.txt": "b",
        "/foo/c.txt": "c",
        "/foo/bar/a.txt": "a",
        "/bleep/a.txt": "a",
        "http://another-origin/blah.txt": "blah",
      });

      let listing = (await assert.fs.list(url("/foo/"))).map(
        (fd) => fd.url.pathname
      );
      assert.deepEqual(
        listing,
        ["/foo/", "/foo/a.txt", "/foo/b.txt", "/foo/bar/", "/foo/c.txt"],
        "the listing is correct"
      );
    });

    test("can get a recursive directory listing", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
        "/foo/a.txt": "a",
        "/foo/b.txt": "b",
        "/foo/c.txt": "c",
        "/foo/bar/a.txt": "a",
        "/foo/bar/baz/a.txt": "a",
        "/bleep/a.txt": "a",
        "http://another-origin/blah.txt": "blah",
      });

      let listing = (await assert.fs.list(url("/foo/"), true)).map(
        (fd) => fd.url.pathname
      );
      assert.deepEqual(
        listing,
        [
          "/foo/",
          "/foo/a.txt",
          "/foo/b.txt",
          "/foo/bar/",
          "/foo/bar/a.txt",
          "/foo/bar/baz/",
          "/foo/bar/baz/a.txt",
          "/foo/c.txt",
        ],
        "the listing is correct"
      );
    });

    test("can list all origins non-recursively", async function (assert) {
      await assert.setupFiles({
        "http://origin-a/a.txt": "a",
        "http://origin-b/foo/a.txt": "a",
        "http://origin-b/foo/b.txt": "b",
        "http://origin-b/foo/c.txt": "c",
        "http://origin-b/foo/bar/a.txt": "a",
        "http://origin-b/foo/bar/baz/a.txt": "a",
        "http://origin-c/bleep/a.txt": "a",
      });

      let listing = (await assert.fs.listAllOrigins()).map((fd) => fd.url.href);
      assert.deepEqual(
        listing,
        ["http://origin-a/", "http://origin-b/", "http://origin-c/"],
        "the listing is correct"
      );
    });

    test("can list all origins recursively", async function (assert) {
      await assert.setupFiles({
        "http://origin-a/a.txt": "a",
        "http://origin-b/foo/a.txt": "a",
        "http://origin-b/foo/b.txt": "b",
        "http://origin-b/foo/c.txt": "c",
        "http://origin-b/foo/bar/a.txt": "a",
        "http://origin-b/foo/bar/baz/a.txt": "a",
        "http://origin-c/bleep/a.txt": "a",
      });

      let listing = (await assert.fs.listAllOrigins(true)).map(
        (fd) => fd.url.href
      );
      assert.deepEqual(
        listing,
        [
          "http://origin-a/",
          "http://origin-a/a.txt",
          "http://origin-b/",
          "http://origin-b/foo/",
          "http://origin-b/foo/a.txt",
          "http://origin-b/foo/b.txt",
          "http://origin-b/foo/bar/",
          "http://origin-b/foo/bar/a.txt",
          "http://origin-b/foo/bar/baz/",
          "http://origin-b/foo/bar/baz/a.txt",
          "http://origin-b/foo/c.txt",
          "http://origin-c/",
          "http://origin-c/bleep/",
          "http://origin-c/bleep/a.txt",
        ],
        "the listing is correct"
      );
    });

    test("can get a listing for a path that is a file", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
      });
      let listing = (await assert.fs.list(url("/a.txt"))).map(
        (fd) => fd.url.href
      );
      assert.deepEqual(
        listing,
        ["http://localhost:4200/a.txt"],
        "the listing is correct"
      );
    });

    test("can get a listing of an empty filesystem", async function (assert) {
      await assert.setupFiles({});

      let listing = await assert.fs.listAllOrigins(true);
      assert.deepEqual(listing, [], "the listing is correct");
      try {
        await assert.fs.list(new URL(origin));
        throw new Error(
          `should not be able to list a resource that doesn't exist`
        );
      } catch (e) {
        assert.equal(e.code, "NOT_FOUND", "error code is correct");
      }
    });
  });

  QUnit.module("move", function () {
    test("can use 'move' to rename a file", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
      });

      await assert.file("/b.txt").doesNotExist();
      await assert.fs.move(url("/a.txt"), url("/b.txt"));

      await assert.file("/a.txt").doesNotExist();
      await assert.file("/b.txt").exists();
      await assert.file("/b.txt").matches(/a/);
    });

    test("can move a file to a directory that doens't exist yet", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
      });

      await assert.file("/foo").doesNotExist();
      await assert.fs.move(url("/a.txt"), url("/foo/b.txt"));

      await assert.file("/a.txt").doesNotExist();
      await assert.file("/foo/b.txt").exists();
      await assert.file("/foo/b.txt").matches(/a/);
    });

    test("can use 'move' to rename a directory", async function (assert) {
      await assert.setupFiles({
        "/foo/a.txt": "a",
      });

      await assert.file("/bar").doesNotExist();
      await assert.fs.move(url("/foo/"), url("/bar/"));
      await assert.file("/foo/").doesNotExist();
      await assert.file("/bar/").exists();
      await assert.file("/bar/a.txt").exists();
      await assert.file("/bar/a.txt").matches(/a/);
    });

    test("can move a directory to a parent directory that doesn't exist yet", async function (assert) {
      await assert.setupFiles({
        "/foo/a.txt": "a",
      });

      await assert.file("/bar/").doesNotExist();
      await assert.fs.move(url("/foo/"), url("/bar/baz/"));
      await assert.file("/foo/").doesNotExist();
      await assert.file("/bar/baz/").exists();
      await assert.file("/bar/baz/a.txt").exists();
      await assert.file("/bar/baz/a.txt").matches(/a/);
    });
  });

  QUnit.module("copy", function () {
    test("can copy a file", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
      });
      await assert.file("/b.txt").doesNotExist();
      await assert.fs.copy(url("/a.txt"), url("/b.txt"));

      await assert.file("/a.txt").exists();
      await assert.file("/b.txt").exists();
      await assert.file("/b.txt").matches(/a/);
    });

    test("can copy a file to itself", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
      });
      await assert.fs.copy(url("/a.txt"), url("/a.txt"));

      await assert.file("/a.txt").exists();
      await assert.file("/a.txt").matches(/a/);
    });

    test("can copy a directory", async function (assert) {
      await assert.setupFiles({
        "/foo/bar/a.txt": "a",
        "/foo/bar/b.txt": "b",
      });
      await assert.file("/baz/").doesNotExist();
      await assert.fs.copy(url("/foo/"), url("/baz/"));

      await assert.file("/foo/bar/a.txt").exists();
      await assert.file("/foo/bar/b.txt").exists();
      await assert.file("/baz/bar/a.txt").exists();
      await assert.file("/baz/bar/b.txt").exists();
      await assert.file("/baz/bar/a.txt").matches(/a/);
    });

    test("can copy a directory to itself", async function (assert) {
      await assert.setupFiles({
        "/foo/bar/a.txt": "a",
        "/foo/bar/b.txt": "b",
      });
      await assert.fs.copy(url("/foo/"), url("/foo/"));

      await assert.file("/foo/bar/a.txt").exists();
      await assert.file("/foo/bar/b.txt").exists();
      await assert.file("/foo/bar/a.txt").matches(/a/);
    });

    test("can copy a file to a directory that doesn't exist yet", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
      });
      await assert.file("/foo/").doesNotExist();
      await assert.fs.copy(url("/a.txt"), url("/foo/a.txt"));

      await assert.file("/a.txt").exists();
      await assert.file("/foo/a.txt").exists();
      await assert.file("/foo/a.txt").matches(/a/);
    });

    test("can copy a directory to a parent directory that doesn't exist yet", async function (assert) {
      await assert.setupFiles({
        "/foo/bar/a.txt": "a",
        "/foo/bar/b.txt": "b",
      });
      await assert.file("/baz/").doesNotExist();
      await assert.fs.copy(url("/foo/"), url("/baz/bloop/"));

      await assert.file("/foo/bar/a.txt").exists();
      await assert.file("/foo/bar/b.txt").exists();
      await assert.file("/baz/bloop/bar/a.txt").exists();
      await assert.file("/baz/bloop/bar/b.txt").exists();
      await assert.file("/baz/bloop/bar/a.txt").matches(/a/);
    });
  });

  QUnit.module("remove", function () {
    test("can remove a file", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
      });

      await assert.file("/a.txt").exists();
      await assert.fs.remove(url("/a.txt"));
      await assert.file("/a.txt").doesNotExist();
    });

    test("can remove a directory", async function (assert) {
      await assert.setupFiles({
        "/foo/a.txt": "a",
      });

      await assert.file("/foo/a.txt").exists();
      await assert.fs.remove(url("/foo/"));
      await assert.file("/foo/").doesNotExist();
    });

    test("does not complain when removing a non-existant file", async function (assert) {
      assert.expect(0);
      await assert.setupFiles();
      await assert.fs.remove(url("does-not-exist"));
    });
  });
});

export async function readStream(stream: ReadableStream): Promise<Uint8Array> {
  let reader = stream.getReader();
  let buffers: Uint8Array[] = [];
  while (true) {
    let chunk = await reader.read();
    if (chunk.done) {
      break;
    } else {
      buffers.push(chunk.value);
    }
  }

  let size = buffers.reduce((a, b) => a + b.length, 0);
  let result = new Uint8Array(size);
  let offset = 0;
  for (let buffer of buffers) {
    result.set(buffer, offset);
    offset += buffer.length;
  }
  return result;
}
