import { installFileAssertions, FileAssert, origin } from "./file-assertions";
import { FileDescriptor } from "../src/filesystem";

function url(path: string, base = origin): URL {
  return new URL(path, base);
}

QUnit.module("module filesystem", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  QUnit.module("open", function () {
    test("can get an existing file when create mode is not specified", async function (assert) {
      await assert.setupFiles({
        "/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/foo.txt"));
      assert.equal(file.stat.type, "file", "type is correct");
    });

    test("can get an existing directory when create mode is not specified", async function (assert) {
      await assert.setupFiles({
        "/test/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/test"));
      assert.equal(file.stat.type, "directory", "type is correct");
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
      let file = await assert.fs.open(url("/foo.txt"), "file");

      await assert.file("/foo.txt").exists();
      await assert.equal(file.stat.type, "file", "the stat type is correct");
    });

    test("can create a directory", async function (assert) {
      await assert.setupFiles();
      await assert.file("/foo").doesNotExist();
      let file = await assert.fs.open(url("/foo"), "directory");

      await assert.file("/foo").exists();
      await assert.equal(
        file.stat.type,
        "directory",
        "the stat type is correct"
      );
    });

    test("can get an existing file when create mode is 'file'", async function (assert) {
      await assert.setupFiles({
        "/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/foo.txt"), "file");
      assert.equal(file.stat.type, "file", "type is correct");
    });

    test("can get an existing directory when create mode is 'directory'", async function (assert) {
      await assert.setupFiles({
        "/test/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/test"), "directory");
      assert.equal(file.stat.type, "directory", "type is correct");
    });

    test("can create interior directories when create mode is 'file'", async function (assert) {
      await assert.setupFiles();
      await assert.file("/foo").doesNotExist();
      await assert.fs.open(url("/foo/bar.txt"), "file");

      await assert.file("/foo").exists();
      let dir = await assert.fs.open(url("/foo"));
      await assert.equal(
        dir.stat.type,
        "directory",
        "the stat type is correct"
      );
    });

    test("can create interior directories when create mode is 'directory'", async function (assert) {
      await assert.setupFiles();
      await assert.file("/foo").doesNotExist();
      await assert.fs.open(url("/foo/bar"), "directory");

      await assert.file("/foo").exists();
      let dir = await assert.fs.open(url("/foo"));
      await assert.equal(
        dir.stat.type,
        "directory",
        "the stat type is correct"
      );
    });

    test("throws when path specifies a directory but create mode is 'file'", async function (assert) {
      await assert.setupFiles();
      await assert.fs.open(url("/test"), "directory");

      try {
        await assert.fs.open(url("/test"), "file");
        throw new Error(`should not be able to open file`);
      } catch (e) {
        assert.equal(e.code, "IS_NOT_A_FILE", "error code is correct");
      }
    });

    test("throws when path specifies a file but create mode is 'directory'", async function (assert) {
      await assert.setupFiles({
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
      await assert.setupFiles({
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
    let directory: FileDescriptor;

    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles({
        "/foo/bar": "Hello World",
      });
      directory = await fileAssert.fs.open(url("/foo"));
      file = await fileAssert.fs.open(url("/foo/bar"));
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

      test("throws when writiting to a directory", async function (assert) {
        try {
          await directory.write("bang");
          throw new Error("should not be able to write");
        } catch (e) {
          assert.equal(e.code, "IS_NOT_A_FILE", "error code is correct");
        }
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
        let buffer = await readStream(file.getReadbleStream());
        assert.deepEqual(
          buffer,
          new TextEncoder().encode("Hello World"),
          "the file was read correctly"
        );
      });

      test("throws when reading from a directory", async function (assert) {
        try {
          await directory.read();
          throw new Error("should not be able to read");
        } catch (e) {
          assert.equal(e.code, "IS_NOT_A_FILE", "error code is correct");
        }

        try {
          await directory.readText();
          throw new Error("should not be able to readText");
        } catch (e) {
          assert.equal(e.code, "IS_NOT_A_FILE", "error code is correct");
        }

        try {
          directory.getReadbleStream();
          throw new Error("should not be able to gettReadableStream");
        } catch (e) {
          assert.equal(e.code, "IS_NOT_A_FILE", "error code is correct");
        }
      });
    });

    QUnit.module("stat", function () {
      test("can get type from stat of file", async function (assert) {
        assert.equal(file.stat.type, "file", "stat value is correct");
      });

      test("can get etag from stat of file", async function (assert) {
        file.setEtag("abc");
        assert.equal(file.stat.etag, "abc", "stat value is correct");
      });

      test("can get size from stat of file", async function (assert) {
        assert.equal(file.stat.size, 11, "stat value is correct");
      });

      test("can get mtime from stat of file", async function (assert) {
        assert.ok(file.stat.mtime, "mtime exists");
      });

      test("can get type from stat of directory", async function (assert) {
        assert.equal(directory.stat.type, "directory", "stat value is correct");
      });

      test("can get etag from stat of directory", async function (assert) {
        directory.setEtag("xyz");
        assert.equal(directory.stat.etag, "xyz", "stat value is correct");
      });

      test("can not get size from stat of directory", async function (assert) {
        assert.equal(directory.stat.size, undefined, "stat value is correct");
      });

      test("can not get mtime from stat of directory", async function (assert) {
        assert.equal(directory.stat.mtime, undefined, "stat value is correct");
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

      let listing = (await assert.fs.listAllOrigins()).map((fd) =>
        fd.url.toString()
      );
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

      let listing = (await assert.fs.listAllOrigins(true)).map((fd) =>
        fd.url.toString()
      );
      assert.deepEqual(
        listing,
        [
          "http://origin-a/",
          "http://origin-a/a.txt",
          "http://origin-b/",
          "http://origin-b/foo",
          "http://origin-b/foo/a.txt",
          "http://origin-b/foo/b.txt",
          "http://origin-b/foo/bar",
          "http://origin-b/foo/bar/a.txt",
          "http://origin-b/foo/bar/baz",
          "http://origin-b/foo/bar/baz/a.txt",
          "http://origin-b/foo/c.txt",
          "http://origin-c/",
          "http://origin-c/bleep",
          "http://origin-c/bleep/a.txt",
        ],
        "the listing is correct"
      );
    });

    test("throws when getting a listing for a path that is a file", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
      });
      try {
        await assert.fs.list(url("/a.txt"));
        throw new Error("should not be able to get a listing");
      } catch (e) {
        assert.equal(e.code, "IS_NOT_A_DIRECTORY", "the error code is correct");
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
      await assert.fs.move(url("/foo"), url("/bar"));
      await assert.file("/foo").doesNotExist();
      await assert.file("/bar").exists();
      await assert.file("/bar/a.txt").exists();
      await assert.file("/bar/a.txt").matches(/a/);
    });

    test("can move a directory to a parent directory that doesn't exist yet", async function (assert) {
      await assert.setupFiles({
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
      await assert.file("/baz").doesNotExist();
      await assert.fs.copy(url("/foo"), url("/baz"));

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
      await assert.fs.copy(url("/foo"), url("/foo"));

      await assert.file("/foo/bar/a.txt").exists();
      await assert.file("/foo/bar/b.txt").exists();
      await assert.file("/foo/bar/a.txt").matches(/a/);
    });

    test("can copy a file to a directory that doesn't exist yet", async function (assert) {
      await assert.setupFiles({
        "/a.txt": "a",
      });
      await assert.file("/foo").doesNotExist();
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
      await assert.fs.remove(url("/foo"));
      await assert.file("/foo").doesNotExist();
    });

    test("can remove all origins", async function (assert) {
      await assert.setupFiles({
        "http://origin-a/foo.txt": "a",
        "http://origin-b/foo.txt": "b",
      });
      await assert.file("http://origin-a/foo.txt").exists();
      await assert.file("http://origin-b/foo.txt").exists();

      await assert.fs.removeAll();

      await assert.file("http://origin-a/foo.txt").doesNotExist();
      await assert.file("http://origin-b/foo.txt").doesNotExist();
    });

    test("does not complain when removing a non-existant file", async function (assert) {
      assert.expect(0);
      await assert.setupFiles();
      await assert.fs.remove(url("does-not-exist"));
    });
  });

  test("can get a temp directory", async function (assert) {
    await assert.setupFiles();
    let tempURL = await assert.fs.tempURL();
    assert.ok(/\d+/.test(tempURL.pathname), "a temp URL path looks correct");
    assert.equal(
      tempURL.origin,
      "http://tmp",
      "the temp URL origin is correct"
    );
  });
});

async function readStream(stream: ReadableStream): Promise<Uint8Array> {
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