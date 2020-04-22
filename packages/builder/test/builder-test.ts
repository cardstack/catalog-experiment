import { installFileAssertions, origin } from "./file-assertions";
import { Builder } from "../src/builder";
import { FileSystem } from "../src/filesystem";

QUnit.module("module builder", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  async function etags(
    fs: FileSystem,
    origin: string
  ): Promise<{ [url: string]: string }> {
    let etags = Object.create(null);
    for (let { url, stat } of await fs.list(new URL(origin), true)) {
      if (stat.type === "file") {
        etags[url.pathname] = `${stat.size}_${stat.mtime}`;
      }
    }
    return etags;
  }

  test("can generate an index.html entrypoint from src-index.html", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `["src-index.html"]`,
      "src-index.html": `<html><script type="module" src="./index.js"></script></html>`,
      "index.js": `alert("hello everyone");`,
    });
    let builder = new Builder(assert.fs);
    await builder.build(origin);
    await assert.file("index.html").exists();
    await assert
      .file("/index.html")
      .matches(/src=\"\/built-index.js\"/, "file contents are correct");
  });

  test("it does not change source files", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `["src-index.html"]`,
      "src-index.html": `<html> <script type="module" src="./index.js"></script> </html>`,
      "index.js": `alert("hello everyone");`,
    });
    let originalEtags = await etags(assert.fs, origin);
    let builder = new Builder(assert.fs);
    await builder.build(origin);

    let finalEtags = await etags(assert.fs, origin);
    await assert.equal(
      finalEtags["/src-index.html"],
      originalEtags["/src-index.html"],
      "file has not changed"
    );
    await assert.equal(
      finalEtags["/index.js"],
      originalEtags["/index.js"],
      "file has not changed"
    );
    await assert
      .file("/src-index.html")
      .matches(/src="\.\/index\.js"/, "file contents are correct");
    await assert
      .file("/src-index.html")
      .doesNotMatch(/src=\"\/built-index.js\"/, "file contents are correct");
    await assert
      .file("/index.js")
      .matches(/hello everyone/, "file contents are correct");
  });

  test("doesn't touch scripts from different origins", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `["src-index.html"]`,
      "src-index.html": `<html><script type="module" src="http://somewhere-else/index.js"></script></html>`,
      "index.js": `alert("hello everyone");`,
    });
    let builder = new Builder(assert.fs);
    await builder.build(origin);
    await assert
      .file("/index.html")
      .doesNotMatch(/src=\"\/built-index.js\"/, "file contents are correct");
  });

  test("can process scripts that have a relative path", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `["src-index.html"]`,
      "src-index.html": `<html><script type="module" src="./index.js"></script></html>`,
      "index.js": `alert("hello everyone");`,
    });
    let builder = new Builder(assert.fs);
    await builder.build(origin);
    await assert
      .file("/index.html")
      .matches(/src=\"\/built-index.js\"/, "file contents are correct");
  });

  test("can process scripts that originate from the same origin", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `["src-index.html"]`,
      "src-index.html": `<html><script type="module" src="${origin}/index.js"></script></html>`,
      "index.js": `alert("hello everyone");`,
    });
    let builder = new Builder(assert.fs);
    await builder.build(origin);
    await assert
      .file("/index.html")
      .matches(/src=\"\/built-index.js\"/, "file contents are correct");
  });

  test("can process scripts that live at the root of the DOM", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `["src-index.html"]`,
      "src-index.html": `
        <!DOCTYPE html>
        <script type="module" src="./index.js"></script>`,
      "index.js": `alert("hello everyone");`,
    });
    let builder = new Builder(assert.fs);
    await builder.build(origin);
    await assert
      .file("/index.html")
      .matches(/src=\"\/built-index.js\"/, "file contents are correct");
  });
});
