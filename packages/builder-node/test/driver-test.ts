import {
  installFileAssertions,
  FileAssert,
  origin,
  url,
} from "../../builder-worker/test/helpers/file-assertions";
import { join } from "path";
import { removeSync, ensureDirSync, writeFileSync } from "fs-extra";
import { NodeFileSystemDriver } from "../src/node-filesystem-driver";
import { FileDescriptor } from "../../builder-worker/src/filesystem";

const testDir = join(__dirname, "testing");

QUnit.module("Node FileSystem", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  function setup(scenario: { [path: string]: string }) {
    for (let [path, text] of Object.entries(scenario)) {
      writeFileSync(join(testDir, path), text);
    }
  }

  QUnit.module("open", function () {
    origHooks.beforeEach(async (assert) => {
      let fileAssert = (assert as unknown) as FileAssert;
      await fileAssert.setupFiles();

      removeSync(testDir);
      ensureDirSync(testDir);

      fileAssert.fs.mount(url("/"), new NodeFileSystemDriver(testDir));
    });

    test("can get an existing file when create mode is not specified", async function (assert) {
      setup({
        "foo.txt": "hi",
      });

      let file: FileDescriptor;
      try {
        file = await assert.fs.open(url("/foo.txt"));
        assert.equal(file.stat().type, "file", "type is correct");
      } finally {
        file!.close();
      }
    });

    /*
    test("can get an existing directory when create mode is not specified", async function (assert) {
      await assert.setupFiles({
        "/test/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/test"));
      assert.equal(file.stat().type, "directory", "type is correct");
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
      await assert.equal(file.stat().type, "file", "the stat type is correct");
    });

    test("can create a directory", async function (assert) {
      await assert.setupFiles();
      await assert.file("/foo").doesNotExist();
      let file = await assert.fs.open(url("/foo"), "directory");

      await assert.file("/foo").exists();
      await assert.equal(
        file.stat().type,
        "directory",
        "the stat type is correct"
      );
    });

    test("can get an existing file when create mode is 'file'", async function (assert) {
      await assert.setupFiles({
        "/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/foo.txt"), "file");
      assert.equal(file.stat().type, "file", "type is correct");
    });

    test("can get an existing directory when create mode is 'directory'", async function (assert) {
      await assert.setupFiles({
        "/test/foo.txt": "hi",
      });
      let file = await assert.fs.open(url("/test"), "directory");
      assert.equal(file.stat().type, "directory", "type is correct");
    });

    test("can create interior directories when create mode is 'file'", async function (assert) {
      await assert.setupFiles();
      await assert.file("/foo").doesNotExist();
      await assert.fs.open(url("/foo/bar.txt"), "file");

      await assert.file("/foo").exists();
      let dir = await assert.fs.open(url("/foo"));
      await assert.equal(
        dir.stat().type,
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
        dir.stat().type,
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
    */
  });
});
