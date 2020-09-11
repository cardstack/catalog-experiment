import {
  installFileAssertions,
  origin,
  url,
  FileAssert,
} from "./helpers/file-assertions";
import { Builder, Rebuilder, explainAsDot } from "../src/builder";
import { FileSystem } from "../src/filesystem";
import { flushEvents, removeAllEventListeners } from "../src/event-bus";
import { annotationRegex } from "../src/nodes/common";
import { Logger } from "../src/logger";

Logger.setLogLevel("debug");
Logger.echoInConsole(true);

const outputOrigin = `http://output`;

QUnit.module("module builder", function (origHooks) {
  let { test, skip } = installFileAssertions(origHooks);
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
    outputURL = new URL("/output/", origin)
  ) {
    return Builder.forProjects(fs, [[new URL(origin), outputURL]]);
  }

  function makeRebuilder(
    fs: FileSystem,
    outputURL = new URL("/output/", outputOrigin)
  ) {
    return Rebuilder.forProjects(fs, [[new URL(origin), outputURL]]);
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
          /const implementation = function\(\) { return \(\) => console.log\("this is a puppy implementation"\); }/
        );
      await assert
        .file("output/index.js")
        .matches(/const _default = implementation\(\);/);
      await assert
        .file("output/index.js")
        .matches(/export \{ _default as default \};/);
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
          /const implementation = function\(\) { return \(\) => console.log\("this is a puppy implementation"\); }/
        );
      await assert.file("output/index.js").matches(/const a = "a"/);
      await assert
        .file("output/index.js")
        .matches(/const _default = implementation\(\);/);
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

    test("bundle exports a reassigned reexported default export of the entrypoint", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          export { default as puppies } from "./puppies.js";
        `,
        "puppies.js": `
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
        .matches(/const _default = getPuppies;/);
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

    test("bundle consumes an reexport projected from another bundle's exports", async function (assert) {
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
          /const _default = function\(\) { console\.log\("toPairs"\); }/
        );
      await assert
        .file("output/toPairs.js")
        .matches(/export { _default as toPairs };/);
      await assert
        .file("output/entries.js")
        .matches(/import { toPairs } from "\.\/toPairs\.js";/);
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
        .matches(/const toPairs = function\(\) { console\.log\("toPairs"\); }/);
      await assert.file("output/toPairs.js").matches(/export { toPairs };/);
      await assert
        .file("output/entries.js")
        .matches(/import { toPairs } from "\.\/toPairs\.js";/);
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
        .matches(/const _default = function\(\) { a\(\); }/);
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
        .matches(/const _default = function\(\) { b\(\); }/);
      await assert
        .file("output/index.js")
        .matches(/export { _default as default }/);
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

      let builder = Builder.forProjects(assert.fs, [
        [url("driver/"), url("/output/driver")],
        [url("pets/"), petsOutputURL],
        [url("names/"), namesOutputURL],
      ]);

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
        .matches(/const _default = \["mango", "van gogh"\];/);
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

    skip("TODO: can resolve local modules that don't have a file extension to a similarly named js file", async function (assert) {});
    skip("TODO: can resolve local modules that don't have a file extension to a similarly named directory with an index.js", async function (assert) {});
    skip("TODO: can resolve entrypoint module from pkg in declared dependency", async function (assert) {});
    skip("TODO: can resolve default export from entrypoint module from pkg in declared dependency", async function (assert) {});
    skip("TODO: can resolve non-entrypoint module from pkg in declared dependency", async function (assert) {});
    skip("TODO: can resolve CJS wrapped module", async function (assert) {});
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
