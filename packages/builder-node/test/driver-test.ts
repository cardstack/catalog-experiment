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
} from "fs-extra";
import { NodeFileSystemDriver } from "../src/node-filesystem-driver";
import { FileDescriptor } from "../../builder-worker/src/filesystem";

const testDir = join(__dirname, "testing");

QUnit.module("Node FileSystem", function (origHooks) {
  let { test, only } = installFileAssertions(origHooks);

  function setup(scenario: { [path: string]: string }) {
    for (let [path, text] of Object.entries(scenario)) {
      outputFileSync(join(testDir, path), text);
    }
  }

  QUnit.module("open", function () {
    let file: FileDescriptor | undefined;

    origHooks.beforeEach(async (assert) => {
      file = undefined;
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles();

      removeSync(testDir);
      ensureDirSync(testDir);

      fileAssert.fs.mount(url("/"), new NodeFileSystemDriver(testDir));
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
      assert.equal(file.stat().type, "file", "type is correct");
    });

    test("can get an existing directory when create mode is not specified", async function (assert) {
      setup({
        "test/foo.txt": "hi",
      });
      file = await assert.fs.open(url("/test"));
      assert.equal(file.stat().type, "directory", "type is correct");
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
      await assert.equal(file.stat().type, "file", "the stat type is correct");
    });

    test("can create a directory", async function (assert) {
      await assert.file("/foo").doesNotExist();
      file = await assert.fs.open(url("/foo"), "directory");

      await assert.file("/foo").exists();
      await assert.equal(
        file.stat().type,
        "directory",
        "the stat type is correct"
      );
    });

    test("can get an existing file when create mode is 'file'", async function (assert) {
      setup({
        "/foo.txt": "hi",
      });
      file = await assert.fs.open(url("/foo.txt"), "file");
      assert.equal(file.stat().type, "file", "type is correct");
    });

    test("can get an existing directory when create mode is 'directory'", async function (assert) {
      setup({
        "/test/foo.txt": "hi",
      });
      file = await assert.fs.open(url("/test"), "directory");
      assert.equal(file.stat().type, "directory", "type is correct");
    });

    test("can create interior directories when create mode is 'file'", async function (assert) {
      await assert.file("/foo").doesNotExist();
      (await assert.fs.open(url("/foo/bar.txt"), "file")).close();

      await assert.file("/foo").exists();
      file = await assert.fs.open(url("/foo"));
      await assert.equal(
        file.stat().type,
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
        file.stat().type,
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
    let directory: FileDescriptor;

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
      directory = await fileAssert.fs.open(url("/foo"));
      file = await fileAssert.fs.open(url("/foo/bar"));
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
        let stream = new DOMToNodeReadable(file.getReadbleStream());
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

    /*
    QUnit.module("stat", function () {
      test("can get type from stat of file", async function (assert) {
        assert.equal(file.stat().type, "file", "stat value is correct");
      });

      test("can get etag from stat of file", async function (assert) {
        file.setEtag("abc");
        assert.equal(file.stat().etag, "abc", "stat value is correct");
      });

      test("can get size from stat of file", async function (assert) {
        assert.equal(file.stat().size, 11, "stat value is correct");
      });

      test("can get mtime from stat of file", async function (assert) {
        assert.ok(file.stat().mtime, "mtime exists");
      });

      test("can get type from stat of directory", async function (assert) {
        assert.equal(
          directory.stat().type,
          "directory",
          "stat value is correct"
        );
      });

      test("can get etag from stat of directory", async function (assert) {
        directory.setEtag("xyz");
        assert.equal(directory.stat().etag, "xyz", "stat value is correct");
      });

      test("can not get size from stat of directory", async function (assert) {
        assert.equal(directory.stat().size, undefined, "stat value is correct");
      });

      test("can get mtime from stat of directory", async function (assert) {
        assert.ok(directory.stat().mtime, "mtime exists");
      });
    });
    */
  });
});
