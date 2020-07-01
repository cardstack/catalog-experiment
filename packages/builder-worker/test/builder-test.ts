import {
  installFileAssertions,
  origin,
  url,
  FileAssert,
} from "./helpers/file-assertions";
import { Builder, Rebuilder } from "../src/builder";
import { FileSystem } from "../src/filesystem";
import { FileDescriptor } from "../src/filesystem-drivers/filesystem-driver";
import { flushEvents, removeAllEventListeners } from "../src/event-bus";
import { annotationRegex } from "../src/nodes/common";

const outputOrigin = `http://output`;

QUnit.module("module builder", function (origHooks) {
  let { test } = installFileAssertions(origHooks);
  let builder: Builder<unknown> | undefined;
  let rebuilder: Rebuilder<unknown> | undefined;

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

  function makeBuilder(fs: FileSystem) {
    return Builder.forProjects(fs, [
      [new URL(origin), new URL("/output/", origin)],
    ]);
  }

  function makeRebuilder(fs: FileSystem) {
    return Rebuilder.forProjects(fs, [
      [new URL(origin), new URL("/output/", outputOrigin)],
    ]);
  }

  async function buildBundle(
    assert: FileAssert,
    bundleURL: URL,
    bundleFiles: { [filename: string]: string }
  ): Promise<string> {
    await assert.setupFiles(bundleFiles);
    builder = makeBuilder(assert.fs);
    await builder.build();
    let bundleSrc = await ((await assert.fs.open(
      bundleURL
    )) as FileDescriptor).readText();
    await assert.fs.remove(url("/"));
    return bundleSrc;
  }

  origHooks.beforeEach(async () => {
    builder = undefined;
    rebuilder = undefined;
  });

  origHooks.afterEach(async () => {
    removeAllEventListeners();
    await flushEvents();
    if (rebuilder) {
      await rebuilder.shutdown();
    }
  });

  QUnit.module("single-shot build", function () {
    test("can generate an index.html entrypoint", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "index.js": `export const message = "hello world";`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.html").exists();
      await assert
        .file("output/index.html")
        .matches(/src=\"\.\/dist\/0.js\"/, "file contents are correct");
    });

    test("can process multiple app entrypoints", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html", "test/index.html"] }`,
        "index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "index.js": `export const message = "hello world";`,
        "test/index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "test/index.js": `export const message = "bye mars";`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.html").exists();
      await assert
        .file("output/index.html")
        .matches(/src=\"\.\/dist\/0.js\"/, "file contents are correct");
      await assert.file("output/test/index.html").exists();
      await assert
        .file("output/test/index.html")
        .matches(/src=\"\.\.\/dist\/1.js\"/, "file contents are correct");
    });

    test("it does not change source files", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `<html> <script type="module" src="./index.js"></script> </html>`,
        "index.js": `export const message = "hello world";`,
      });
      builder = makeBuilder(assert.fs);
      let originalEtags = await etags(assert.fs, origin);
      await builder.build();

      let finalEtags = await etags(assert.fs, origin);
      await assert.equal(
        finalEtags["/index.html"],
        originalEtags["/index.html"],
        "file has not changed"
      );
      await assert.equal(
        finalEtags["/index.js"],
        originalEtags["/index.js"],
        "file has not changed"
      );
      await assert
        .file("/index.html")
        .matches(/src="\.\/index\.js"/, "file contents are correct");
      await assert
        .file("/index.html")
        .doesNotMatch(/src=\"\/dist\/0.js\"/, "file contents are correct");
      await assert
        .file("/index.js")
        .matches(/hello world/, "file contents are correct");
    });

    test("doesn't touch scripts from different origins", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `<html><script type="module" src="http://somewhere-else/index.js"></script></html>`,
        "index.js": `export const message = "hello world";`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.html")
        .doesNotMatch(/dist/, "file contents are correct");
    });

    test("can process scripts that have a relative path", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "index.js": `export const message = "hello world";`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.html")
        .matches(/src=\"\.\/dist\/0.js\"/, "file contents are correct");
    });

    test("can process scripts that originate from the same origin", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `<html><script type="module" src="${origin}/index.js"></script></html>`,
        "index.js": `export const message = "hello world";`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.html")
        .matches(/src=\"\.\/dist\/0.js\"/, "file contents are correct");
    });

    test("can process scripts that live at the root of the DOM", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `
        <!DOCTYPE html>
        <script type="module" src="./index.js"></script>`,
        "index.js": `export const message = "hello world";`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.html")
        .matches(/src=\"\.\/dist\/0.js\"/, "file contents are correct");
    });

    test("modules within the app get bundled together", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `
        <!DOCTYPE html>
        <script type="module" src="./index.js"></script>`,
        "index.js": `
        import { message } from './ui.js';
        console.log(message);
      `,
        "ui.js": `export const message = "Hello world";`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/dist/0.js").matches(/Hello world/);
      await assert.file("output/dist/0.js").doesNotMatch(/import/);
    });

    test("bundles for js entrypoints are named based on the js entrypoint file", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `
        {
          "js": ["pets.js"]
        }
        `,
        "pets.js": `
          import { puppies } from "./puppies.js";

          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }

          export { getPuppies, getCats, getRats };
        `,
        "puppies.js": `export const puppies = ["mango", "van gogh"];`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/pets.js").exists();
    });

    test("bundles for js entrypoints have the same exports as the js entrypoint", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { puppies } from "./puppies.js";

          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }

          export { getPuppies, getCats, getRats };
        `,
        "puppies.js": `export const puppies = ["mango", "van gogh"];`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(/export { getPuppies, getCats, getRats };/);
    });

    test("adds serialized analysis to bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { puppies } from "./puppies.js";
          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }
          export { getPuppies, getCats, getRats };
        `,
        "puppies.js": `export const puppies = ["mango", "van gogh"];`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      let bundleSrc = await ((await assert.fs.open(
        url("output/index.js")
      )) as FileDescriptor).readText();
      let match = annotationRegex.exec(bundleSrc);
      let annotation = Array.isArray(match) ? match[1] : undefined;
      assert.ok(annotation, "bundle annotation exists");
    });

    test("performs parse if annotation does not exist in bundle", async function (assert) {
      let bundleSrc = await buildBundle(assert, url("output/index.js"), {
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { puppies } from "./puppies.js";
          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }
          export { getPuppies, getCats, getRats };
        `,
        "puppies.js": `export const puppies = ["mango", "van gogh"];`,
      });
      bundleSrc = bundleSrc.replace(annotationRegex, "");

      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["driver.js"] }`,
        "driver.js": `
          import { getPuppies } from "./lib.js";
          console.log(getPuppies());
        `,
        "lib.js": bundleSrc,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();

      assert.ok(
        builder.cachedNodeStates.includes(`module-description:${url("lib.js")}`)
      );
    });

    test("skips parse if annotation exists in bundle", async function (assert) {
      let bundleSrc = await buildBundle(assert, url("output/index.js"), {
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { puppies } from "./puppies.js";
          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }
          export { getPuppies, getCats, getRats };
        `,
        "puppies.js": `export const puppies = ["mango", "van gogh"];`,
      });

      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["driver.js"] }`,
        "driver.js": `
          import { getPuppies } from "./lib.js";
          console.log(getPuppies());
        `,
        "lib.js": bundleSrc,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();

      assert.notOk(
        builder.cachedNodeStates.includes(`module-description:${url("lib.js")}`)
      );
    });

    test("uses bundle annotation to tree shake unused exports from bundle", async function (assert) {
      let bundleSrc = await buildBundle(assert, url("output/index.js"), {
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { puppies } from "./puppies.js";
          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }
          export { getPuppies, getCats, getRats };
        `,
        "puppies.js": `export const puppies = ["mango", "van gogh"];`,
      });

      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["driver.js"] }`,
        "driver.js": `
          import { getPuppies } from "./lib.js";
          console.log(getPuppies());
        `,
        "lib.js": bundleSrc,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();

      await assert
        .file("output/driver.js")
        .matches(/const puppies = \["mango", "van gogh"\];/);
      await assert
        .file("output/driver.js")
        .matches(/function getPuppies\(\) { return puppies; }/);
      await assert
        .file("output/driver.js")
        .matches(/console\.log\(getPuppies\(\)\);/);
      await assert.file("output/driver.js").doesNotMatch(/getCats/);
      await assert.file("output/driver.js").doesNotMatch(/getRats/);
    });
  });

  QUnit.module("rebuild", function () {
    test("can build when rebuilder starts", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `
        <!DOCTYPE html>
        <script type="module" src="./index.js"></script>`,
        "index.js": `
        import { message } from './ui.js';
        console.log(message);
      `,
        "ui.js": `export const message = "Hello world";`,
      });
      rebuilder = makeRebuilder(assert.fs);

      rebuilder.start();
      await rebuilder.isIdle();

      await assert.file(`${outputOrigin}/output/index.html`).exists();
      await assert
        .file(`${outputOrigin}/output/index.html`)
        .matches(/src=\"\.\/dist\/0.js\"/, "file contents are correct");
      await assert
        .file(`${outputOrigin}/output/dist/0.js`)
        .matches(/Hello world/);
    });

    test("can rebuild when an input file changes", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `
        <!DOCTYPE html>
        <script type="module" src="./index.js"></script>`,
        "index.js": `
        import { message } from './ui.js';
        console.log(message);
      `,
        "ui.js": `export const message = "Hello world";`,
      });
      rebuilder = makeRebuilder(assert.fs);

      rebuilder.start();
      await rebuilder.isIdle();

      let file = (await assert.fs.open(url("ui.js"))) as FileDescriptor;
      await file.write(`export const message = "Bye mars";`);
      file.close();
      await flushEvents();
      await rebuilder.isIdle();

      await assert.file(`${outputOrigin}/output/dist/0.js`).matches(/Bye mars/);
    });

    test("throws when the input origin is the same as the output origin", async function (assert) {
      await assert.setupFiles({});
      try {
        rebuilder = Rebuilder.forProjects(assert.fs, [
          [new URL(origin), new URL("/output/", origin)],
        ]);
        throw new Error("should not be able to create Rebuilder");
      } catch (e) {
        assert.ok(
          e.message.match(
            /input root origin .* cannot be the same as the output root origin/
          ),
          "error is thrown"
        );
      }
    });
  });
});
