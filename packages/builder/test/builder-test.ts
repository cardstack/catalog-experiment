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
      "entrypoints.json": `{"src-index.html": "index.html"}`,
      "src-index.html": `<html><script type="module" src="./index.js"></script></html>`,
      "index.js": `export const message = "hello world";`,
    });
    let builder = Builder.forProjects(assert.fs, [origin]);
    await builder.build();
    await assert.file("index.html").exists();
    await assert
      .file("/index.html")
      .matches(/src=\"\/dist\/0.js\"/, "file contents are correct");
  });

  test("it does not change source files", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `{"src-index.html": "index.html"}`,
      "src-index.html": `<html> <script type="module" src="./index.js"></script> </html>`,
      "index.js": `export const message = "hello world";`,
    });
    let originalEtags = await etags(assert.fs, origin);
    let builder = Builder.forProjects(assert.fs, [origin]);
    await builder.build();

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
      .doesNotMatch(/src=\"\/dist\/0.js\"/, "file contents are correct");
    await assert
      .file("/index.js")
      .matches(/hello world/, "file contents are correct");
  });

  test("doesn't touch scripts from different origins", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `{"src-index.html": "index.html"}`,
      "src-index.html": `<html><script type="module" src="http://somewhere-else/index.js"></script></html>`,
      "index.js": `export const message = "hello world";`,
    });
    let builder = Builder.forProjects(assert.fs, [origin]);
    await builder.build();
    await assert
      .file("/index.html")
      .doesNotMatch(/src=\"\/dist\/0.js\"/, "file contents are correct");
  });

  test("can process scripts that have a relative path", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `{"src-index.html": "index.html"}`,
      "src-index.html": `<html><script type="module" src="./index.js"></script></html>`,
      "index.js": `export const message = "hello world";`,
    });
    let builder = Builder.forProjects(assert.fs, [origin]);
    await builder.build();
    await assert
      .file("/index.html")
      .matches(/src=\"\/dist\/0.js\"/, "file contents are correct");
  });

  test("can process scripts that originate from the same origin", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `{"src-index.html": "index.html"}`,
      "src-index.html": `<html><script type="module" src="${origin}/index.js"></script></html>`,
      "index.js": `export const message = "hello world";`,
    });
    let builder = Builder.forProjects(assert.fs, [origin]);
    await builder.build();
    await assert
      .file("/index.html")
      .matches(/src=\"\/dist\/0.js\"/, "file contents are correct");
  });

  test("can process scripts that live at the root of the DOM", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `{"src-index.html": "index.html"}`,
      "src-index.html": `
        <!DOCTYPE html>
        <script type="module" src="./index.js"></script>`,
      "index.js": `export const message = "hello world";`,
    });
    let builder = Builder.forProjects(assert.fs, [origin]);
    await builder.build();
    await assert
      .file("/index.html")
      .matches(/src=\"\/dist\/0.js\"/, "file contents are correct");
  });

  test("modules within the app get bundled together", async function (assert) {
    await assert.setupFiles({
      "entrypoints.json": `{"src-index.html": "index.html"}`,
      "src-index.html": `
        <!DOCTYPE html>
        <script type="module" src="./index.js"></script>`,
      "index.js": `
        import { message } from './ui.js';
        console.log(message);
      `,
      "ui.js": `export const message = "Hello world";`,
    });
    let builder = Builder.forProjects(assert.fs, [origin]);
    await builder.build();
    await assert.file("/dist/0.js").matches(/Hello world/);
    await assert.file("/dist/0.js").doesNotMatch(/import/);
  });
});
