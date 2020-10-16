import {
  installFileAssertions,
  origin,
  url,
  FileAssert,
} from "./helpers/file-assertions";
import { Builder, Rebuilder, explainAsDot } from "../src/builder";
import { FileSystem } from "../src/filesystem";
import { flushEvents, removeAllEventListeners } from "../src/event-bus";
import { Logger } from "../src/logger";
import { recipesURL } from "../src/recipes";
import { extractDescriptionFromSource } from "../src/description-encoder";
import { Options } from "../src/nodes/project";

Logger.setLogLevel("debug");
Logger.echoInConsole(true);

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

  function makeBuilder(
    fs: FileSystem,
    outputURL = new URL("/output/", origin),
    options?: Partial<Options>
  ) {
    return Builder.forProjects(
      fs,
      [[new URL(origin), outputURL]],
      recipesURL,
      options
    );
  }

  function makeRebuilder(
    fs: FileSystem,
    outputURL = new URL("/output/", outputOrigin)
  ) {
    return Rebuilder.forProjects(
      fs,
      [[new URL(origin), outputURL]],
      recipesURL
    );
  }

  async function buildBundle(
    assert: FileAssert,
    bundleURL: URL,
    bundleFiles: { [filename: string]: string }
  ): Promise<string> {
    await assert.setupFiles(bundleFiles);
    builder = makeBuilder(assert.fs);
    await builder.build();
    let bundleSrc = await (await assert.fs.openFile(bundleURL)).readText();
    await assert.fs.remove(url("/"));
    return bundleSrc;
  }

  async function buildDidFinish(rebuilder: Rebuilder<unknown>) {
    await flushEvents();
    await rebuilder.isIdle();
    if (rebuilder.status.name === "failed") {
      throw rebuilder.status.exception;
    }
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

    test("an HTML entrypoint can consume another HTML entrypoint", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html", "test/index.html"] }`,
        "index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "index.js": `
           import { planet } from "./a.js";
           console.log("hello " + planet);
        `,
        "a.js": `export const planet = "mars"`,
        "test/index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "test/index.js": `
          import "../index.js";
          console.log('hi');
        `,
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
      await assert.file("output/dist/1.js").matches(/import "\.\/0\.js";/);
    });

    test("it preserves consumed exports from bundles derived from HTML entrypoints", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html", "test/index.html"] }`,
        "index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "index.js": `
           export function boot() {
             console.log('starting up!');
           }
        `,
        "test/index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "test/index.js": `
          import { boot } from "../index.js";
          boot();
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/dist/0.js").matches(/export { boot };/);
      await assert
        .file("output/dist/1.js")
        .matches(/import { boot } from "\.\/0\.js";/);
    });

    test("it prunes unconsumed exports from bundles derived from HTML entrypoints", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html", "test/index.html"] }`,
        "index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "index.js": `
           export function boot() {
             console.log('starting up!');
           }
        `,
        "test/index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "test/index.js": `
          console.log('hi');
          export {};
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/dist/0.js").doesNotMatch(/export { boot };/);
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

    test("bundle exports derive from entrypoint reexports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          export { getPuppies, getCats, getRats } from "./puppies.js";
        `,
        "puppies.js": `
          export function getPuppies() { return ["Van Gogh", "Mango"]; }
          export function getCats() { return ["jojo"]; }
          export function getRats() { return ["pizza rat"]; }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(/function getRats\(\) { return \["pizza rat"\]; }/);
      await assert
        .file("output/index.js")
        .matches(/export { getPuppies, getCats, getRats };/);
    });

    test("bundle exports derive from entrypoint renamed reexports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          export { getPuppies as puppies, getCats as cats, getRats as rats } from "./puppies.js";
        `,
        "puppies.js": `
          export function getPuppies() { return ["Van Gogh", "Mango"]; }
          export function getCats() { return ["jojo"]; }
          export function getRats() { return ["pizza rat"]; }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(/function getRats\(\) { return \["pizza rat"\]; }/);
      await assert
        .file("output/index.js")
        .matches(
          /export { getPuppies as puppies, getCats as cats, getRats as rats };/
        );
    });

    test("can export a named export multiple times with different names", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          export function stringify(obj) { return JSON.stringify(obj); }
          export function parse(str) { return JSON.parse(str); }
          export { stringify as encode, parse as decode };
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(
          /function stringify\(obj\) { return JSON\.stringify\(obj\); }/
        );
      await assert
        .file("output/index.js")
        .matches(/function parse\(str\) { return JSON\.parse\(str\); }/);
      await assert
        .file("output/index.js")
        .matches(
          /export { stringify, parse, stringify as encode, parse as decode }/
        );
    });

    test("bundle exports the entrypoint's default export", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import implementation from "./puppies.js";
          export default implementation();
        `,
        "puppies.js": `
          export default function() { return () => console.log("this is a puppy implementation"); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(
          /const implementation = \(function\(\) { return \(\) => console.log\("this is a puppy implementation"\); }\);/
        );
      await assert
        .file("output/index.js")
        .matches(/const _default = \(implementation\(\)\);/);
      await assert
        .file("output/index.js")
        .matches(/export \{ _default as default \};/);
    });

    test("bundle has default export", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          function getPuppies() { return ["Van Gogh", "Mango"]; }
          export default getPuppies;
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(/function getPuppies\(\) { return \["Van Gogh", "Mango"\]; }/);
      await assert
        .file("output/index.js")
        .matches(/export { getPuppies as default };/);
    });

    test("bundle exports the entrypoint's default export and named exports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import implementation from "./puppies.js";
          export default implementation();
          export const a = "a";
        `,
        "puppies.js": `
          export default function() { return () => console.log("this is a puppy implementation"); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(
          /const implementation = \(function\(\) { return \(\) => console.log\("this is a puppy implementation"\); }\);/
        );
      await assert.file("output/index.js").matches(/const a = "a"/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(implementation\(\)\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default, a };/);
    });

    test("bundle exports derive from entrypoint default reexports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          export { default } from "./puppies.js";
        `,
        "puppies.js": `
          export default function getPuppies() { return ["Van Gogh", "Mango"]; }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(/function getPuppies\(\) { return \["Van Gogh", "Mango"\]; }/);
      await assert
        .file("output/index.js")
        .matches(/export { getPuppies as default };/);
    });

    test("bundle exports derive from entrypoint's use of 'export *'", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          export * from "./puppies.js";
        `,
        // note that 'export *' will skip over the default export
        "puppies.js": `
          export const vanGogh = "Van Gogh";
          export const mango = "Mango";
          export default function getPuppies() { return ["Van Gogh", "Mango"]; }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert.file("output/index.js").doesNotMatch(/getPuppies/);
      await assert
        .file("output/index.js")
        .matches(/const vanGogh = "Van Gogh";[ \n]+const mango = "Mango";/);
      await assert
        .file("output/index.js")
        .matches(/export { vanGogh, mango };/);
    });

    test("bundle exports derive from entrypoint's use of 'export *' which include a export that in turn is a manually reexported binding", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          export * from "./lib.js";
        `,
        "lib.js": `
          import { vanGogh, mango } from "./puppies.js";
          export { vanGogh, mango };
        `,
        "puppies.js": `
          export const vanGogh = "Van Gogh";
          export const mango = "Mango";
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert.file("output/index.js").doesNotMatch(/getPuppies/);
      await assert
        .file("output/index.js")
        .matches(/const vanGogh = "Van Gogh";[ \n]+const mango = "Mango";/);
      await assert
        .file("output/index.js")
        .matches(/export { vanGogh, mango };/);
    });

    test("bundle exports a reassigned reexported default export of the entrypoint", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          export { default as puppies } from "./puppies.js";
        `,
        "puppies.js": `
          export default function() { return ["Van Gogh", "Mango"]; }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(
          /const _default = \(function\(\) { return \["Van Gogh", "Mango"\]; }\);/
        );
      await assert
        .file("output/index.js")
        .matches(/export { _default as puppies };/);
      await assert.file("output/index.js").doesNotMatch(/export default/);
    });

    test("bundle reexports another bundle's exports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./entries.js", "./toPairs.js"] }`,
        "entries.js": `
          export { default } from './toPairs.js';
          export const foo = "my own export";
        `,
        "toPairs.js": `
          export default function() { console.log("toPairs"); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/entries.js")
        .matches(/export \{ default \} from "\.\/toPairs.js"/);
      await assert
        .file("output/entries.js")
        .matches(/const foo = "my own export";/);
      await assert.file("output/entries.js").matches(/export { foo };/);
    });

    test("bundle uses 'export *' to reexport another bundle's exports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./entries.js", "./toPairs.js"] }`,
        "entries.js": `
          export * from './toPairs.js';
          export const foo = "my own export";
        `,
        "toPairs.js": `
          export function toPairs() { console.log("toPairs"); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/entries.js").doesNotMatch(/import"/);
      await assert
        .file("output/entries.js")
        .matches(/export \* from "\.\/toPairs.js";/);
      await assert
        .file("output/entries.js")
        .matches(/const foo = "my own export";/);
      await assert.file("output/entries.js").matches(/export { foo };/);
    });

    test("bundle consumes a reexport projected from another bundle's exports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./entries.js", "./toPairs.js"] }`,
        "entries.js": `
          import { toPairs } from "./toPairs.js";
          toPairs();
          export const foo = "my own export";
        `,
        "toPairs.js": `
          export { default as toPairs } from "./internal.js";
        `,
        "internal.js": `
          export default function() { console.log("toPairs"); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/toPairs.js")
        .matches(
          /const _default = \(function\(\) { console\.log\("toPairs"\); }\);/
        );
      await assert
        .file("output/toPairs.js")
        .matches(/export { _default as toPairs };/);
      await assert
        .file("output/entries.js")
        .matches(/import { toPairs } from "\.\/toPairs\.js";/);
    });

    test("bundle consumes a reexport projected from another bundle's use of 'export *'", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./entries.js", "./toPairs.js"] }`,
        "entries.js": `
          import { toPairs } from "./toPairs.js";
          toPairs();
          export const foo = "my own export";
        `,
        "toPairs.js": `
          export * from "./internal.js";
        `,
        "internal.js": `
          export function toPairs() { console.log("toPairs"); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/toPairs.js")
        .matches(/function toPairs\(\) { console\.log\("toPairs"\); }/);
      await assert.file("output/toPairs.js").matches(/export { toPairs };/);
      await assert
        .file("output/entries.js")
        .matches(/import { toPairs } from "\.\/toPairs\.js";/);
    });

    test("module uses a namespace import to consume exports from an incorporated bundle whose entrypoints utilize export *", async function (assert) {
      let bundleSrc = await buildBundle(assert, url("output/toPairs.js"), {
        "entrypoints.json": `{ "js": ["toPairs.js"] }`,
        "toPairs.js": `
          export * from "./internal.js";
        `,
        "internal.js": `
          export function toPairs() { console.log("toPairs"); }
        `,
      });

      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./entries.js"] }`,
        "entries.js": `
          import * as t from "./toPairs.js";
          t.toPairs();
        `,
        "toPairs.js": bundleSrc,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/entries.js")
        .matches(/function toPairs\(\) { console.log\("toPairs"\); }/);
      await assert.file("output/entries.js").matches(/const t = { toPairs };/);
      await assert.file("output/entries.js").matches(/t\.toPairs\(\);/);
    });

    test("bundle consumes an explicit import/export projected from another bundle's exports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./entries.js", "./toPairs.js"] }`,
        "entries.js": `
          import { toPairs } from "./toPairs.js";
          toPairs();
          export const foo = "my own export";
        `,
        "toPairs.js": `
          import toPairs from "./internal.js";
          export { toPairs };
        `,
        "internal.js": `
          export default function() { console.log("toPairs"); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/toPairs.js")
        .matches(
          /const toPairs = \(function\(\) { console\.log\("toPairs"\); }\);/
        );
      await assert.file("output/toPairs.js").matches(/export { toPairs };/);
      await assert
        .file("output/entries.js")
        .matches(/import { toPairs } from "\.\/toPairs\.js";/);
    });

    test("bundle exports a namespace import", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./index.js"] }`,
        "index.js": `
          import * as puppies from "./puppies.js";
          export { puppies };
        `,
        "puppies.js": `
          export const vanGogh = "Van Gogh";
          export const mango = "Mango";
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const vanGogh = "Van Gogh";[\n ]+ const mango = "Mango";/);
      await assert
        .file("output/index.js")
        .matches(/const puppies = { vanGogh, mango };/);
      await assert.file("output/index.js").matches(/export { puppies };/);
    });

    test("circular imports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./index.js"] }`,
        "index.js": `
          import { a } from "./a.js";
          export default function() { a(); }
        `,
        "a.js": `
          import { bHelper } from "./b.js";
          export const aHelper = 'a';
          export function a() { console.log(aHelper + bHelper()); }
        `,
        "b.js": `
          import { aHelper }  from "./a.js";
          export const bHelper = 'b';
          export function b() { console.log(bHelper + aHelper()); }`,
      });

      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const bHelper = 'b';[ \n]+const aHelper = 'a';/);
      await assert
        .file("output/index.js")
        .matches(/function a\(\) { console.log\(aHelper \+ bHelper\(\)\); }/);
      await assert.file("output/index.js").doesNotMatch(/function b\(\)/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(function\(\) { a\(\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default }/);
    });

    test("circular imports with different cyclic entry", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./index.js"] }`,
        "index.js": `
          import { b } from "./b.js";
          export default function() { b(); }
        `,
        "a.js": `
          import { bHelper } from "./b.js";
          export const aHelper = 'a';
          export function a() { console.log(aHelper + bHelper()); }
        `,
        "b.js": `
          import { aHelper }  from "./a.js";
          export const bHelper = 'b';
          export function b() { console.log(bHelper + aHelper()); }`,
      });

      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const aHelper = 'a';[ \n]+const bHelper = 'b';/);
      await assert
        .file("output/index.js")
        .matches(/function b\(\) { console.log\(bHelper \+ aHelper\(\)\); }/);
      await assert.file("output/index.js").doesNotMatch(/function a\(\)/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(function\(\) { b\(\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default }/);
    });

    test("consuming a binding that is a tail off of a circular imports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./index.js"] }`,
        "index.js": `
          export { foo } from "./tail.js";
          export { a } from "./a.js";
        `,
        "tail.js": `
          export const foo = 'bar';
        `,
        "a.js": `
          import { foo }  from "./index.js";
          export function a() { console.log('a' + foo); }`,
      });

      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").matches(/const foo = 'bar';/);
      await assert
        .file("output/index.js")
        .matches(/function a\(\) { console.log\('a' \+ foo\); }/);
      await assert.file("output/index.js").doesNotMatch(/function b\(\)/);
      await assert.file("output/index.js").matches(/export { foo, a }/);
    });

    test("imported binding is explicitly exported", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./index.js"] }`,
        "index.js": `
          import { foo } from "./a.js";
          export function doSomething() { console.log(foo); }
        `,
        "a.js": `
          import { foo } from "./b.js";
          foo.bar = 'blah';
          export { foo };
        `,
        "b.js": `export const foo = {};`,
      });

      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").matches(/const foo = {};/);
      await assert.file("output/index.js").matches(/foo\.bar = 'blah';/);
      await assert
        .file("output/index.js")
        .matches(/function doSomething\(\) { console\.log\(foo\); }/);
      await assert.file("output/index.js").matches(/export { doSomething }/);
    });

    test("bundle reexports reassigned bindings from another bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["./entries.js", "./toPairs.js"] }`,
        "entries.js": `
          export { default as foo } from './toPairs.js';
        `,
        "toPairs.js": `
          export default function() { console.log("toPairs"); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/entries.js")
        .matches(/export \{ default as foo \} from "\.\/toPairs.js"/);
    });

    test("entrypoint module imports a reassigned default export", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          export { default as puppies } from "./puppies.js";
        `,
        "puppies.js": `
          function getPuppies() { return ["Van Gogh", "Mango"]; }
          export { getPuppies as default };
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(/function getPuppies\(\) { return \["Van Gogh", "Mango"\]; }/);
      await assert
        .file("output/index.js")
        .matches(/export { getPuppies as puppies };/);
      await assert.file("output/index.js").doesNotMatch(/export default/);
    });

    test("bundle exports a reassigned reexported inline default export of the entrypoint", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          export { default as puppies } from "./puppies.js";
        `,
        "puppies.js": `
          export default function getPuppies() { return ["Van Gogh", "Mango"]; }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").doesNotMatch(/import/);
      await assert
        .file("output/index.js")
        .matches(/function getPuppies\(\) { return \["Van Gogh", "Mango"\]; }/);
      await assert
        .file("output/index.js")
        .matches(/export { getPuppies as puppies };/);
      await assert.file("output/index.js").doesNotMatch(/export default/);
    });

    test("can namespace import a different bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "lib.js"] }`,
        "index.js": `
        import a from "./a.js";
        import b from "./b.js";
        export default function() { console.log(a() + b()); };
      `,
        "a.js": `
        import { goodbye } from './lib.js';
        import * as lib from './lib.js';
        export default function() { return lib.hello + goodbye; }
      `,
        "b.js": `
        import * as lib from './lib.js';
        export default function() { return lib.goodbye; }
      `,
        "lib.js": `
        export const hello = 'hello';
        export const goodbye = 'goodbye';
      `,
      });

      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/lib.js")
        .matches(
          /const hello = 'hello';[ \n]+const goodbye = 'goodbye';[ \n]+export { hello, goodbye };/
        );
      await assert
        .file("output/index.js")
        .matches(/import \* as lib from "\.\/lib\.js";/);
      await assert.file("output/index.js").matches(/const { goodbye } = lib;/);
      await assert
        .file("output/index.js")
        .matches(
          /const a = \(function\(\) { return lib\.hello \+ goodbye; }\);/
        );
      await assert
        .file("output/index.js")
        .matches(/const b = \(function\(\) { return lib\.goodbye; }\);/);
      await assert
        .file("output/index.js")
        .matches(
          /const _default = \(function\(\) { console.log\(a\(\) \+ b\(\)\); }\);/
        );
      await assert
        .file("output/index.js")
        .matches(/export { _default as default }/);
    });

    test("can prune an unused namespace import of another bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "lib.js"] }`,
        "index.js": `
          import * as lib from './lib.js';
          export default function() { console.log('hi'); };
        `,
        "lib.js": `
          export const hello = 'hello';
          export const goodbye = 'goodbye';
        `,
      });

      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/lib.js")
        .matches(
          /const hello = 'hello';[ \n]+const goodbye = 'goodbye';[ \n]+export { hello, goodbye };/
        );
      await assert
        .file("output/index.js")
        .doesNotMatch(/import \* as lib from "\.\/lib\.js";/);
      await assert.file("output/index.js").doesNotMatch(/hello/);
      await assert.file("output/index.js").doesNotMatch(/goodbye/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(function\(\) { console.log\('hi'\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default }/);
    });

    test("can handle collision with namespace import of another bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "lib.js"] }`,
        "index.js": `
        import a from "./a.js";
        const lib = 'collision';
        export default function() { console.log(a() + lib); };
      `,
        "a.js": `
        import * as lib from './lib.js';
        export default function() { return lib.hello; }
      `,
        "lib.js": `
        export const hello = 'hello';
        export const goodbye = 'goodbye';
      `,
      });

      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/lib.js")
        .matches(
          /const hello = 'hello';[ \n]+const goodbye = 'goodbye';[ \n]+export { hello, goodbye };/
        );
      await assert
        .file("output/index.js")
        .matches(/import \* as lib0 from "\.\/lib\.js";/);
      await assert
        .file("output/index.js")
        .matches(/const a = \(function\(\) { return lib0\.hello; }\);/);
      await assert.file("output/index.js").matches(/const lib = 'collision';/);
      await assert
        .file("output/index.js")
        .matches(
          /const _default = \(function\(\) { console.log\(a\(\) \+ lib\); }\);/
        );
      await assert
        .file("output/index.js")
        .matches(/export { _default as default }/);
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
      let bundleSrc = await (
        await assert.fs.openFile(url("output/index.js"))
      ).readText();
      let { desc } = extractDescriptionFromSource(bundleSrc);
      assert.ok(desc, "bundle annotation exists");
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
      ({ source: bundleSrc } = extractDescriptionFromSource(bundleSrc));

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
      assert.ok(builder.explain().get(`module-description:${url("lib.js")}`));
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
        builder.explain().get(`module-description:${url("lib.js")}`)
      );

      // experimental control: make sure we can detect the node for modules that
      // definitely do need to be parsed
      assert.ok(
        builder.explain().get(`module-description:${url("driver.js")}`)
      );
    });

    test("bundles include origin info for bindings", async function (assert) {
      let puppiesPkgHref =
        "https://catalogjs.com/pkgs/npm/puppies/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=";
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "catalogjs.lock": `{ "puppies": "${puppiesPkgHref}/index.js" }`,
        "index.js": `
          import { puppies } from "puppies";
          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }
          export { getPuppies, getCats, getRats };
        `,
        [`${puppiesPkgHref}/entrypoints.json`]: `{"js": ["index.js"] }`,
        [`${puppiesPkgHref}/index.js`]: `export const puppies = ["mango", "van gogh"];`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      let bundleSrc = await (
        await assert.fs.openFile(url("output/index.js"))
      ).readText();
      let { desc } = extractDescriptionFromSource(bundleSrc);
      let nameDesc = desc!.names.get("puppies")!;
      assert.equal(nameDesc.type, "local");
      if (nameDesc.type === "local") {
        assert.equal(
          nameDesc.original?.moduleHref,
          `${puppiesPkgHref}/index.js`
        );
        assert.equal(nameDesc.original?.exportedName, "puppies");
      }
    });

    test("bundle's binding's origin info is carried forward in subsequent builds", async function (assert) {
      let puppiesPkgHref =
        "https://catalogjs.com/pkgs/npm/puppies/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=";
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "catalogjs.lock": `{ "puppies": "${puppiesPkgHref}/index.js" }`,
        "index.js": `
          import { puppies } from "puppies";
          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }
          export { getPuppies, getCats, getRats };
        `,
        [`${puppiesPkgHref}/entrypoints.json`]: `{"js": ["index.js"] }`,
        [`${puppiesPkgHref}/index.js`]: `export const puppies = ["mango", "van gogh"];`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      let bundleSrc = await (
        await assert.fs.openFile(url("output/index.js"))
      ).readText();

      let libPkgHref =
        "https://catalogjs.com/pkgs/npm/lib/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=";
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["driver.js"] }`,
        "catalogjs.lock": `{ "lib": "${libPkgHref}/lib.js" }`,
        "driver.js": `
          import { getPuppies } from "lib";
          console.log(getPuppies());
        `,
        [`${libPkgHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
        [`${libPkgHref}/lib.js`]: bundleSrc,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();

      let nextBuildSrc = await (
        await assert.fs.openFile(url("output/index.js"))
      ).readText();
      let { desc } = extractDescriptionFromSource(nextBuildSrc);
      let nameDesc = desc!.names.get("puppies")!;
      assert.equal(nameDesc.type, "local");
      if (nameDesc.type === "local") {
        assert.equal(
          nameDesc.original?.moduleHref,
          `${puppiesPkgHref}/index.js`
        );
        assert.equal(nameDesc.original?.exportedName, "puppies");
      }
    });

    test("skips parse if bundle is consumed by HTML entrypoint", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `<html><script type="module" src="./index.js"></script></html>`,
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
      let bundleSrc = await (
        await assert.fs.openFile(url("output/dist/0.js"))
      ).readText();
      let { desc } = extractDescriptionFromSource(bundleSrc);
      assert.notOk(desc, "bundle annotation does not exist");
    });

    test("the option to force a parse of a bundle consumed by HTML entrypoint creates bundle annotation", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "html": ["index.html"] }`,
        "index.html": `<html><script type="module" src="./index.js"></script></html>`,
        "index.js": `
          import { puppies } from "./puppies.js";
          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }
          export { getPuppies, getCats, getRats };
        `,
        "puppies.js": `export const puppies = ["mango", "van gogh"];`,
      });
      builder = makeBuilder(assert.fs, undefined, {
        skipAnnotationForHtmlConsumedBundles: false,
      });
      await builder.build();
      let bundleSrc = await (
        await assert.fs.openFile(url("output/dist/0.js"))
      ).readText();
      let { desc } = extractDescriptionFromSource(bundleSrc);
      assert.ok(desc, "bundle annotation exists");
    });

    test("skips parse of bundle for js entrypoint if option to disable bundle annotation is enabled", async function (assert) {
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
      builder = makeBuilder(assert.fs, undefined, {
        skipBundleAnnotation: true,
      });
      await builder.build();
      let bundleSrc = await (
        await assert.fs.openFile(url("output/index.js"))
      ).readText();
      let { desc } = extractDescriptionFromSource(bundleSrc);
      assert.notOk(desc, "bundle annotation does not exist");
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

    test("import of bundle from included project in build can trigger build of bundle for dependency", async function (assert) {
      const namesOutputURL = url("output/names");
      const petsOutputURL = url("output/pets");

      await assert.setupFiles({
        // names bundle
        "names/entrypoints.json": `{ "js": ["./index.js"] }`,
        "names/index.js": `
          export const cutie1 = "mango";
          export const cutie2 = "van gogh";
          export const cutie3 = "ringo";
        `,

        // pets bundle
        "pets/entrypoints.json": `{
          "js": ["./index.js"]
        }`,
        "pets/index.js": `
          import { puppies } from "./puppies.js";
          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }
          export { getPuppies, getCats, getRats };
        `,
        "pets/puppies.js": `
          import { cutie1, cutie2 } from "${namesOutputURL.href}/index.js";
          export const puppies = [cutie1, cutie2];
         `,

        // driver bundle
        "driver/entrypoints.json": `{
          "js": ["./index.js"]
        }`,
        "driver/index.js": `
          import { getPuppies } from "${petsOutputURL.href}/index.js";
          console.log(getPuppies());
        `,
      });

      let builder = Builder.forProjects(
        assert.fs,
        [
          [url("driver/"), url("/output/driver")],
          [url("pets/"), petsOutputURL],
          [url("names/"), namesOutputURL],
        ],
        recipesURL
      );

      await builder.build();

      await assert.file("output/names/index.js").exists();
      await assert
        .file("output/names/index.js")
        .matches(/export { cutie1, cutie2, cutie3 };/);

      await assert.file("output/pets/index.js").exists();
      await assert
        .file("output/pets/index.js")
        .matches(/export { getPuppies, getCats, getRats };/);

      await assert
        .file("output/driver/index.js")
        .matches(/const puppies = \[cutie1, cutie2\];/);
      await assert
        .file("output/driver/index.js")
        .matches(/const cutie1 = "mango";/);
      await assert
        .file("output/driver/index.js")
        .matches(/function getPuppies\(\) { return puppies; }/);
      await assert
        .file("output/driver/index.js")
        .matches(/console\.log\(getPuppies\(\)\);/);
      await assert.file("output/driver/index.js").doesNotMatch(/getCats/);
      await assert.file("output/driver/index.js").doesNotMatch(/getRats/);
      await assert.file("output/driver/index.js").doesNotMatch(/cutie3/);
    });

    test("dynamically imported module assigned to separate bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          async function getPuppies() {
            const { puppies } = await import("./puppies.js");
            return puppies;
          }

          export { getPuppies };
        `,
        "puppies.js": `export const puppies = ["mango", "van gogh"];`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const { puppies } = await import\("\.\/dist\/0\.js"\);/);
      await assert
        .file("output/dist/0.js")
        .matches(/const puppies = \["mango", "van gogh"\];/);
      await assert.file("output/dist/0.js").matches(/export { puppies };/);
    });

    test("can consume dynamically imported module's default export", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          async function getPuppies() {
            const { default: puppies } = await import("./puppies.js");
            return puppies;
          }

          export { getPuppies };
        `,
        "puppies.js": `export default ["mango", "van gogh"];`,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(
          /const { default: puppies } = await import\("\.\/dist\/0\.js"\);/
        );
      await assert
        .file("output/dist/0.js")
        .matches(/const _default = \(\["mango", "van gogh"\]\);/);
      await assert
        .file("output/dist/0.js")
        .matches(/export { _default as default };/);
    });

    test("dynamically imported module's unshared static imports are assigned to same bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          async function getPuppies() {
            const { puppies } = await import("./puppies.js");
            return puppies;
          }

          export { getPuppies };
        `,
        "puppies.js": `
          import { cutie1, cutie2 } from './names.js';
          export const puppies = [ cutie1, cutie2 ];
        `,
        "names.js": `
          export const cutie1 = 'van gogh';
          export const cutie2 = 'mango';
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/dist/0.js")
        .matches(/const cutie1 = 'van gogh'/);
      await assert.file("output/dist/0.js").matches(/const cutie2 = 'mango'/);
      await assert.file("output/dist/0.js").matches(/export { puppies };/); // importantly, cutie1 and cutie2 are not exported
    });

    test("module shared by entrypoint and a dynamic imported module is exported from entrypoint's bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { cutie1 } from './names.js';
          async function getPuppies() {
            const { puppies } = await import("./puppies.js");
            return puppies;
          }
          console.log(cutie1);

          export { getPuppies };
        `,
        // note how we are using different exports in the shared module from the
        // entrypoint...
        "puppies.js": `
          import { cutie2 } from './names.js';
          export const puppies = [ cutie2 ];
        `,
        "names.js": `
          export const cutie1 = 'van gogh';
          export const cutie2 = 'mango';
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const cutie1 = 'van gogh';/);
      await assert.file("output/index.js").matches(/const cutie2 = 'mango';/);
      await assert
        .file("output/index.js")
        .matches(/export { getPuppies, cutie2 };/);
      await assert
        .file("output/dist/0.js")
        .matches(/import { cutie2 } from "\.\.\/index\.js";/);
    });

    test("dynamically imported module consumption forces its static import to be bundled separately", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "index2.js"] }`,
        "index.js": `
          import { cutie1 } from './names.js';
          async function getPuppies() {
            const { puppies } = await import("./puppies.js");
            return puppies;
          }
          console.log(cutie1);

          export { getPuppies };
        `,
        "index2.js": `
          async function getPuppy() {
            const { puppies } = await import("./puppies.js");
            return puppies[0];
          }

          export { getPuppy };
        `,
        "puppies.js": `
          import { cutie2 } from './names.js';
          export const puppies = [ cutie2 ];
        `,
        "names.js": `
          export const cutie1 = 'van gogh';
          export const cutie2 = 'mango';
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .doesNotMatch(/const cutie1 = 'van gogh';/);
      await assert
        .file("output/index.js")
        .doesNotMatch(/const cutie2 = 'mango';/);
      await assert.file("output/index.js").doesNotMatch(/export { cutie2 };/);
      await assert
        .file("output/index.js")
        .matches(/import { cutie1 } from "\.\/dist\/1\.js";/);
      await assert
        .file("output/index2.js")
        .matches(/const { puppies } = await import\("\.\/dist\/0\.js"\);/);
      await assert
        .file("output/dist/0.js")
        .matches(/import { cutie2 } from "\.\/1\.js";/);
      await assert
        .file("output/dist/1.js")
        .matches(/export { cutie1, cutie2 };/);
    });

    test("creates separate bundles for dynamically imported module that in turn has a dynamic import", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          async function handleA(event) {
            const { a } = await import("./a.js");
            event.on('bleep', a());
          }

          export { handleA };
        `,
        "a.js": `
          export function a() {
            return async function() {
              const { b } = await import("./b.js");
              console.log(b);
            };
          }
        `,
        "b.js": `
          export const b = 'b';
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const { a } = await import\("\.\/dist\/0\.js"\);/);
      await assert
        .file("output/dist/0.js")
        .matches(/const { b } = await import\("\.\/1\.js"\);/);
      await assert.file("output/dist/0.js").matches(/export { a };/);
      await assert.file("output/dist/1.js").matches(/const b = 'b';/);
      await assert.file("output/dist/1.js").matches(/export { b };/);
    });

    test("can resolve local modules that don't have a file extension to a similarly named js file", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import a from "./a";
          export default function() { a(); }
        `,
        "a.js": `
          export default function() { console.log('hi'); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const a = \(function\(\) { console\.log\('hi'\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(function\(\) { a\(\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default };/);
    });

    test("can resolve local modules that don't have a file extension to a similarly named directory with an index.js", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import a from "./a";
          export default function() { a(); }
        `,
        "a/index.js": `
          export default function() { console.log('hi'); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const a = \(function\(\) { console\.log\('hi'\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(function\(\) { a\(\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default };/);
    });

    test("can resolve entrypoint module from pkg in lock file", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "catalogjs.lock": `{ "a": "https://catalogjs.com/pkgs/npm/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/dist/a-es6.js" }`,
        "index.js": `
          import a from "a";
          export default function() { a(); }
        `,
        "https://catalogjs.com/pkgs/npm/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/entrypoints.json": `{"js": ["dist/a-es6.js"] }`,
        "https://catalogjs.com/pkgs/npm/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/catalogjs.lock": `{ }`,
        "https://catalogjs.com/pkgs/npm/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/dist/a-es6.js": `
          export default function() { console.log('hi'); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const a = \(function\(\) { console\.log\('hi'\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(function\(\) { a\(\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default };/);
    });

    test("can resolve entrypoint module from pkg with scoped name in lock file", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "catalogjs.lock": `{ "@mango/a": "https://catalogjs.com/pkgs/npm/@mango/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/dist/a-es6.js" }`,
        "index.js": `
          import a from "@mango/a";
          export default function() { a(); }
        `,
        "https://catalogjs.com/pkgs/npm/@mango/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/entrypoints.json": `{"js": ["dist/a-es6.js"] }`,
        "https://catalogjs.com/pkgs/npm/@mango/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/catalogjs.lock": `{ }`,
        "https://catalogjs.com/pkgs/npm/@mango/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/dist/a-es6.js": `
          export default function() { console.log('hi'); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const a = \(function\(\) { console\.log\('hi'\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(function\(\) { a\(\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default };/);
    });

    test("can resolve non-primary entrypoint module from pkg in lock file", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "catalogjs.lock": `{
          "a": "https://catalogjs.com/pkgs/npm/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/a.js",
          "a/b": "https://catalogjs.com/pkgs/npm/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/b.js"
        }`,
        "index.js": `
          import a from "a/b";
          export default function() { a(); }
        `,
        "https://catalogjs.com/pkgs/npm/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/entrypoints.json": `{"js": ["./a.js", "./b.js"] }`,
        "https://catalogjs.com/pkgs/npm/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/catalogjs.lock": `{ }`,
        "https://catalogjs.com/pkgs/npm/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/a.js": `
          export default function() { console.log('hi'); }
        `,
        "https://catalogjs.com/pkgs/npm/a/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=/b.js": `
          export default function() { console.log('bye'); }
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const a = \(function\(\) { console\.log\('bye'\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(function\(\) { a\(\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default };/);
    });

    test("can resolve CJS wrapped module", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import a from "./a.js$cjs$";
          export default function() { a(); }
        `,
        "a.cjs.js": `
          let module;
          function implementation() {
            if (!module) {
              module = { exports: {} };
              Function(
                "module",
                "exports",
                "dependencies",
                \`console.log("hi");\`
              )(module, module.exports, []);
            }
            return module.exports;
          }
          export default implementation;
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert.file("output/index.js").matches(/console\.log\("hi"\);/);
      await assert
        .file("output/index.js")
        .matches(/function a\(\) {[\n ]+ if \(!module\) {/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(function\(\) { a\(\); }\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default };/);
    });

    test("can resolve JSON file", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import a from "./a.json";
          export default function() { return a.foo; }
        `,
        "a.json.js": `
          const json = { "foo": "bar" };
          const { foo } = json;
          export default json;
          export { foo };
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const a = { "foo": "bar" };/);
      await assert
        .file("output/index.js")
        .matches(/const _default = \(function\(\) { return a\.foo; }\);/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default };/);
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
      await buildDidFinish(rebuilder);

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
      await buildDidFinish(rebuilder);

      let file = await assert.fs.openFile(url("ui.js"));
      await file.write(`export const message = "Bye mars";`);
      await file.close();
      await buildDidFinish(rebuilder);

      console.log(explainAsDot(rebuilder.explain()));
      await assert.file(`${outputOrigin}/output/dist/0.js`).matches(/Bye mars/);
    });

    test("throws when the input origin is the same as the output origin", async function (assert) {
      await assert.setupFiles({});
      try {
        rebuilder = Rebuilder.forProjects(
          assert.fs,
          [[new URL(origin), new URL("/output/", origin)]],
          recipesURL
        );
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
