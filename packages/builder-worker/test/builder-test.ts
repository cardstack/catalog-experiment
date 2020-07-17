import {
  installFileAssertions,
  origin,
  url,
  FileAssert,
} from "./helpers/file-assertions";
import { Builder, Rebuilder, explainAsDot } from "../src/builder";
import { FileSystem } from "../src/filesystem";
import { FileDescriptor } from "../src/filesystem-drivers/filesystem-driver";
import { flushEvents, removeAllEventListeners } from "../src/event-bus";
import { annotationRegex } from "../src/nodes/common";
import { Logger } from "../src/logger";

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
    let bundleSrc = await ((await assert.fs.open(
      bundleURL
    )) as FileDescriptor).readText();
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

    test("declared entrypoints.json dependency can trigger build of bundle for dependency", async function (assert) {
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
          "js": ["./index.js"],
          "dependencies": {
            "names": "${namesOutputURL.href}"
          }
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

        // TODO remove dependencies from the tests in entrypoint.json
        // driver bundle
        "driver/entrypoints.json": `{
          "js": ["./index.js"],
          "dependencies": {
            "test-lib": "${petsOutputURL.href}"
          }
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
        .matches(/const { puppies } = await import\("\.\/chunk0\.js"\);/);
      await assert
        .file("output/chunk0.js")
        .matches(/export const puppies = \["mango", "van gogh"\];/);
    });

    // test: consume a dynamically imported modules' default export

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
        .file("output/puppies.js")
        .matches(/const cutie1 = 'van gogh'/);
      await assert.file("output/puppies.js").matches(/const cutie2 = 'mango'/);
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
      await assert.file("output/index.js").matches(/export { cutie2 };/);
      await assert
        .file("output/puppies.js")
        .matches(/import { cutie2 } from "\.\/index\.js";/);
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

          export { getPuppies };
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
        .matches(/import { cutie1 } from '\.\/names\.js';/);
      await assert
        .file("output/index2.js")
        .matches(/const { puppies } = await import\("\.\/puppies\.js"\);/);
      await assert
        .file("output/puppies.js")
        .matches(/import { cutie2 } from "\.\/names\.js";/);
      await assert
        .file("output/names.js")
        .matches(/export { cutie1, cutie2 };/);
    });

    test("modules shared by dynamic imported modules are grouped into bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          async function getA() {
            const { a } = await import("./a.js");
            return a;
          }
          async function getB() {
            const { b } = await import("./b.js");
            return b;
          }
          async function getC() {
            const { c } = await import("./c.js");
            return c;
          }

          export { getA, getB, getC };
        `,
        "a.js": `
          import "./ab.js";
          import "./ab2.js";
          import "./abc.js";
          export const a = "a";
        `,
        "b.js": `
          import "./ab.js";
          import "./ab2.js";
          import "./bc.js";
          import "./abc.js";
          export const b = "b";
        `,
        "c.js": `
          import "./bc.js";
          import "./abc.js";
          export const c = "c";
        `,
        "ab.js": `
          console.log('ab');
        `,
        "ab2.js": `
          console.log('ab2');
        `,
        "bc.js": `
          console.log('bc');
        `,
        "abc.js": `
          console.log('abc');
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();

      // assumes shared bundle for a & b is 0.js
      // assumes shared bundle for b & c is 1.js
      // assumes shared bundle for a, b, & c is 2.js
      await assert.file("output/a.js").matches(/import ".\/0\.js";/);
      await assert.file("output/a.js").matches(/import ".\/2\.js";/);
      await assert.file("output/b.js").matches(/import ".\/1\.js";/);
      await assert.file("output/b.js").matches(/import ".\/2\.js";/);
      await assert.file("output/b.js").matches(/import ".\/1\.js";/);
      await assert.file("output/b.js").matches(/import ".\/2\.js";/);

      await assert.file("output/0.js").matches(/console\.log\('ab'\);/);
      await assert.file("output/0.js").matches(/console\.log\('ab2'\);/);
      await assert.file("output/1.js").matches(/console\.log\('bc'\);/);
      await assert.file("output/2.js").matches(/console\.log\('abc'\);/);
    });

    test("creates separate bundles for dynamically imported modules that depend on eachother", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          async function getA() {
            const { a } = await import("./a.js");
            return a;
          }
          async function getB() {
            const { b } = await import("./b.js");
            return b;
          }

          export { getA };
        `,
        // assuming a3 is pruned since it is not consumed in the module, it is
        // not imported by other modules, and a.js is not part of the API for
        // this project (it's not an entrypoint)
        "a.js": `
          export const a = "a";
          export const a2 = "a2";
          export const a3 = "a3";
        `,
        "b.js": `
          import { a2 } from "./a.js";
          export const b = a2 + 'b';
        `,
      });
      builder = makeBuilder(assert.fs);
      await builder.build();
      await assert
        .file("output/index.js")
        .matches(/const { a } = await import\("\.\/a\.js"\);/);
      await assert
        .file("output/index.js")
        .matches(/const { b } = await import\("\.\/b\.js"\);/);
      await assert.file("output/a.js").matches(/const a = "a";/);
      await assert.file("output/a.js").matches(/const a2 = "a2";/);
      await assert.file("output/a.js").doesNotMatch(/const a3 = "a3";/);
      await assert.file("output/a.js").matches(/export { a, a2 };/);
      await assert
        .file("output/b.js")
        .matches(/import { a2 } from "\.\/a\.js";/);
      await assert.file("output/b.js").doesNotMatch(/const b = a2 + 'b';/);
      await assert.file("output/a.js").matches(/export { b };/);
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
        .matches(/const { a } = await import\("\.\/a\.js"\);/);
      await assert
        .file("output/a.js")
        .matches(/const { b } = await import\("\.\/b\.js"\);/);
      await assert.file("output/a.js").matches(/export { a };/);
      await assert.file("output/b.js").matches(/const b = 'b';/);
      await assert.file("output/b.js").matches(/export { b };/);
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

      let file = (await assert.fs.open(url("ui.js"))) as FileDescriptor;
      await file.write(`export const message = "Bye mars";`);
      file.close();
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
