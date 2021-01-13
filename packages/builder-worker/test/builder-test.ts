import { installFileAssertions, origin, url } from "./helpers/file-assertions";
import "./helpers/code-equality-assertions";
import {
  bundleCode,
  makeBuilder,
  makeRebuilder,
  outputOrigin,
  bundle,
  bundleSource,
  makeEditor,
} from "./helpers/bundle";
import { Builder, Rebuilder, explainAsDot } from "../src/builder";
import { FileSystem } from "../src/filesystem";
import { flushEvents, removeAllEventListeners } from "../src/event-bus";
import { Logger } from "../src/logger";
import { recipesURL } from "../src/recipes";
import {
  ImportCodeRegion,
  isNamespaceMarker,
  NamespaceMarker,
} from "../src/code-region";
import { RegionEditor } from "../src/region-editor";
import {
  isExportAllMarker,
  LocalExportDescription,
  ModuleDescription,
} from "../src/describe-file";

Logger.setLogLevel("debug");
Logger.echoInConsole(true);

QUnit.module("module builder", function (origHooks) {
  let { test } = installFileAssertions(origHooks);
  let builder: Builder<unknown> | undefined;
  let rebuilder: Rebuilder<unknown> | undefined;

  function keepAll(desc: ModuleDescription, editor: RegionEditor) {
    for (let i = 0; i < desc.regions.length; i++) {
      editor.keepRegion(i);
    }
  }

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

  QUnit.module("module combination", function () {
    test("it can make a bundle by combining modules", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          import { b } from './b.js';
          console.log(a + b);
        `,
        "a.js": `export const a = 'a';`,
        "b.js": `export const b = 'b';`,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const a = 'a';
        const b = 'b';
        console.log(a + b);
        export {};
        `
      );
    });

    test("it can combine modules that consume an exported LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          import { b } from './b.js';
          console.log(a + b);
        `,
        "a.js": `export const [ { a, c } ] = foo;`,
        "b.js": `export const b = 'b';`,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const [ { a } ] = foo;
        const b = 'b';
        console.log(a + b);
        export {};
        `
      );
    });

    test("internal imports share the same name in multiple modules", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { hello } from './lib.js';
          import { b } from './b.js';
          console.log(hello + b);
        `,
        "lib.js": `export const hello = 'hello';`,
        "b.js": `
          import { hello } from './lib.js';
          export const b = hello + '!';`,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello = 'hello';
        const b = hello + '!';
        console.log(hello + b);
        export {};
        `
      );
    });

    test("internal imports with local renaming share the same name in multiple modules", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { hello } from './lib.js';
          import { b } from './b.js';
          console.log(hello + b);
        `,
        "lib.js": `export const hello = 'hello';`,
        "b.js": `
          import { hello as h } from './lib.js';
          export const b = h + '!';`,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello = 'hello';
        const b = hello + '!';
        console.log(hello + b);
        export {};
        `
      );
    });

    test("it prevents collisions between module-scoped bindings", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import './a.js';
          let shared = 1;
          console.log(shared);
        `,
        "a.js": `
          import './b.js';
          let shared = 2;
          console.log(shared);
        `,
        "b.js": `
          let shared = 3;
          console.log(shared);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let shared1 = 3;
        console.log(shared1);
        let shared0 = 2;
        console.log(shared0);
        let shared = 1;
        console.log(shared);
        export {};
        `
      );
    });

    test("prevents collisions for renamed import", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { hello } from './lib.js';
          import { a } from './a.js';
          import { b } from './b.js';
          console.log(hello + a + b);
      `,
        "lib.js": `export const hello = 'hello';`,
        "a.js": `export const a = 'a';`,
        "b.js": `
          import { hello as a } from './lib.js';
          export const b = a + '!';`,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello = 'hello';
        const a = 'a';
        const b = hello + '!';
        console.log(hello + a + b);
        export {};
      `
      );
    });

    test("preserves bundle exports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          export const b = 'b';
          console.log(a + b);
      `,
        "a.js": `export const a = 'a';`,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `const a = 'a';
         const b = 'b';
         console.log(a + b);
         export { b };
        `
      );
    });

    test("can combine modules that use multiple names for an exported declaration", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          console.log(a);
      `,
        "a.js": `
          export const A = 'a';
          export { A as a };
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `const a = 'a';
         console.log(a);
         export {};
        `
      );
    });

    test("can combine modules that use multiple names for an exported declaration, where a consumer has already assigned more than one of them", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          import { b } from './b.js';
          console.log(a);
          b();
      `,
        "a.js": `
          export const A = 'a';
          export { A as a };
        `,
        "b.js": `
          import { A } from './a.js';
          export function b() {
            console.log(A);
          }
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `const a = 'a';
         function b() {
            console.log(a);
         }
         console.log(a);
         b();
         export {};
        `
      );
    });

    test("preserves bundle export variable declaration that use a different name on the outside of the bundle from the inside of the bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          const b = 'b';
          console.log(a + b);
          export { b as lib_b };
        `,
        "a.js": `export const a = 'a';`,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const a = 'a';
        const b = 'b';
        console.log(a + b);
        export { b as lib_b };
        `
      );
    });

    test("preserves function export statements that use a different name on the outside of the bundle from the inside of the bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          function b() { return 'b' }
          console.log(a + b());
          export { b as lib_b };
        `,
        "a.js": `export const a = 'a';`,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `const a = 'a';
        function b() {
          return 'b';
        }
        console.log(a + b());
        export { b as lib_b };`
      );
    });

    test("preserves class export statements that use a different name on the outside of the bundle from the inside of the bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          class b { foo() { return 'bar'; } }
          console.log(a + b.foo);
          export { b as lib_b };
        `,
        "a.js": `export const a = 'a';`,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `const a = 'a';
        class b {
          foo() {
            return 'bar';
          }
        }
        console.log(a + b.foo);
        export { b as lib_b };`
      );
    });

    test("can append to exports in a module within a bundle using export all", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import greeting, { hello, goodbye } from './b.js';
          greeting(hello + goodbye);
        `,
        "lib.js": `
          export const hello = 'hello';
          export const goodbye = 'goodbye';
        `,
        "b.js": `
          export * from './lib.js';
          export default function(msg) { console.log(msg); }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello = 'hello';
        const goodbye = 'goodbye';
        const greeting = (function(msg) { console.log(msg); });
        greeting(hello + goodbye);
        export {};
        `
      );
    });

    test("it can handle nested export all's", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import greeting, { hello, goodbye, konnichiwa, sayonara } from './greetings.js';
          greeting(hello + goodbye + konnichiwa + sayonara);
        `,
        "english.js": `
          export const hello = 'hello';
          export const goodbye = 'goodbye';
          export * from "./japanese.js";
        `,
        "japanese.js": `
          export const konnichiwa = 'konnichiwa';
          export const sayonara = 'sayonara';
        `,
        "greetings.js": `
          export * from './english.js';
          export default function(msg) { console.log(msg); }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const konnichiwa = 'konnichiwa';
        const sayonara = 'sayonara';
        const hello = 'hello';
        const goodbye = 'goodbye';
        const greeting = (function(msg) { console.log(msg); });
        greeting(hello + goodbye + konnichiwa + sayonara);
        export {};
        `
      );
    });

    test("it prevents collisions with bundle exported variable declarations", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import './a.js';
          function a() { return 1; }
          console.log(a());
        `,
        "a.js": `
          export const a = 'a';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs, undefined, {
          testing: {
            origin,
            exports: {
              a: {
                file: "a.js",
                name: "a",
              },
            },
          },
        }),
        `
        const a0 = 'a';
        function a() {
          return 1;
        }
        console.log(a());
        export { a0 as a };`
      );
    });

    test("it prevents collisions with multiple bundle exported named statements", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import './lib.js';
          const a = 1;
          const b = 2;
          console.log(a + b);
        `,
        "lib.js": `
          const a = 'a';
          const b = 'b';
          export { a, b };
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs, undefined, {
          testing: {
            origin,
            exports: {
              a: {
                file: "lib.js",
                name: "a",
              },
              b: {
                file: "lib.js",
                name: "b",
              },
            },
          },
        }),
        `
        const a0 = 'a';
        const b0 = 'b';
        const a = 1;
        const b = 2;
        console.log(a + b);
        export { a0 as a, b0 as b };
        `
      );
    });

    test("it prevents collisions with multiple bundle exported variable declarations", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import './lib.js';
          const a = 1;
          const b = 2;
          console.log(a + b);
        `,
        "lib.js": `
          export const a = 'a', b = 'b';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs, undefined, {
          testing: {
            origin,
            exports: {
              a: {
                file: "lib.js",
                name: "a",
              },
              b: {
                file: "lib.js",
                name: "b",
              },
            },
          },
        }),
        `
        const a0 = 'a', b0 = 'b';
        const a = 1;
        const b = 2;
        console.log(a + b);
        export { a0 as a, b0 as b };
        `
      );
    });

    test("it prevents collisions with bundle exported function declarations", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import './a.js';
          const a = 'a';
          console.log(a());
        `,
        "a.js": `
          export function a() { return 1; }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs, undefined, {
          testing: {
            origin,
            exports: {
              a: {
                file: "a.js",
                name: "a",
              },
            },
          },
        }),
        `function a0() {
          return 1;
        }
        const a = 'a';
        console.log(a());
        export { a0 as a };
        `
      );
    });

    test("it prevents collisions with bundle exported class declarations", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import './a.js';
          const a = 'a';
          console.log(a());
        `,
        "a.js": `
          export class a {}
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs, undefined, {
          testing: {
            origin,
            exports: {
              a: {
                file: "a.js",
                name: "a",
              },
            },
          },
        }),
        `
        class a0 {}
        const a = 'a';
        console.log(a());
        export { a0 as a };
        `
      );
    });

    test("it prevents collisions with bundle exports regardless of order", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          function a() { return 1; }
          console.log(a());
          import './a.js';
        `,
        "a.js": `
          export const a = 'a';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs, undefined, {
          testing: {
            origin,
            exports: {
              a: {
                file: "a.js",
                name: "a",
              },
            },
          },
        }),
        `
        const a0 = 'a';
        function a() {
          return 1;
        }
        console.log(a());
        export { a0 as a };
        `
      );
    });

    test("prevents collisions with named bundle variable declaration export", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          export const c = 'c';
          console.log(a);
        `,
        "a.js": `
          export const a = 'a';
          const c = 'a different c';
          console.log(c);
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs, undefined, {
          testing: {
            origin,
            exports: {
              c: {
                file: "index.js",
                name: "c",
              },
            },
          },
        }),
        `
        const a = 'a';
        const c0 = 'a different c';
        console.log(c0);
        const c = 'c';
        console.log(a);
        export { c };
        `
      );
    });

    test("collapses reexports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { hello } from './b.js';
          const hi = 'hi';
          console.log(hi + hello);
        `,
        "lib.js": `export const hello = 'hello';`,
        "b.js": `
          export { hello } from './lib.js';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello = 'hello';
        const hi = 'hi';
        console.log(hi + hello);
        export {};
        `
      );
    });

    // note how the fact that lib.js is side effect free the builder takes more
    // latitude with the positioning of the declarations from that module. When
    // lib.js has side effects that entangle its consumed exports, then the
    // builder orders the side effects (and the declaration it pulls in) in a
    // manner that follows the module dependencies, as seen in the next test.
    test("prevents collisions with reexports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { b } from './b.js';
          const hello = 'hi';
          console.log(hello + b);
        `,
        "lib.js": `export const hello = 'hello';`,
        "b.js": `
          export { c as b } from './c.js';
          const b = 1;
          console.log(b);
        `,
        "c.js": `
          export { hello as c } from './lib.js';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const b = 'hello';
        const b0 = 1;
        console.log(b0);
        const hello = 'hi';
        console.log(hello + b);
        export {};
        `
      );
    });

    test("when declarations have side effects, the serialized order follows the module dependencies", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { b } from './b.js';
          const hello = 'hi';
          console.log(hello + b);
        `,
        "lib.js": `
          export const hello = 'hello';
          console.log(hello);
        `,
        "b.js": `
          export { c as b } from './c.js';
          const b = 1;
          console.log(b);
        `,
        "c.js": `
          export { hello as c } from './lib.js';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const b = 'hello';
        console.log(b);
        const b0 = 1;
        console.log(b0);
        const hello = 'hi';
        console.log(hello + b);
        export {};
        `
      );
    });
    test("can collapse a reexport that projects a default export to a named export", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { hello } from './b.js';
          const hi = 'hi';
          console.log(hi + hello());
        `,
        "b.js": `
          import hello from './lib.js';
          export { hello };
        `,
        "lib.js": `export default function() { return 'hello'; }`,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello = function() { return 'hello'; }
        const hi = 'hi';
        console.log(hi + hello());
        export {};
        `
      );
    });

    test("distinguishes exported names from module-scoped names", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a, b } from './b.js';
          console.log(a + b);
        `,
        "b.js": `
          export { a } from './a.js';
          const a = 'internal';
          export { a as b };
        `,
        "a.js": `
          export const a = 1;
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const a = 1;
        const b = 'internal';
        console.log(a + b);
        export {};
        `
      );
    });

    test("can access namespace of module within bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import * as lib from './lib.js';
          console.log(lib.hello + lib.goodbye);
        `,
        "lib.js": `
          export const hello = 'hello';
          export const goodbye = 'goodbye';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello = 'hello';
        const goodbye = 'goodbye';
        const lib = { hello, goodbye };
        console.log(lib.hello + lib.goodbye);
        export {};
        `
      );
    });

    test("can access nested namespace imports within a bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import * as lib from './lib.js';
          console.log(lib.hello + lib.goodbye + lib.japanese.sayonara);
        `,
        "lib.js": `
          import * as japanese from './deep.js';
          export const hello = 'hello';
          export const goodbye = 'goodbye';
          export { japanese };
        `,
        "deep.js": `
          export const konnichiwa = 'konnichiwa';
          export const sayonara = 'sayonara';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const konnichiwa = 'konnichiwa';
        const sayonara = 'sayonara';
        const japanese = { konnichiwa, sayonara };
        const hello = 'hello';
        const goodbye = 'goodbye';
        const lib = { hello, goodbye, japanese };
        console.log(lib.hello + lib.goodbye + lib.japanese.sayonara );
        export {};
        `
      );
    });

    test("can access namespace import that is comprised of reexported bindings", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import * as lib from './lib.js';
          console.log(lib.hello() + lib.goodbye);
        `,
        "lib.js": `
          export { default as hello } from "./hello.js";
          export const goodbye = 'goodbye';
        `,
        "hello.js": `
          export default function() { return 'hello'; }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const _default = (function() { return 'hello'; });
        const goodbye = 'goodbye';
        const lib = { hello: _default, goodbye };
        console.log(lib.hello() + lib.goodbye);
        export {};
        `
      );
    });

    test("can access namespace import that is comprised of manually reexported (explicit import and export statements) bindings", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import * as lib from './lib.js';
          console.log(lib.hello() + lib.goodbye);
        `,
        "lib.js": `
          import { default as hello } from "./hello.js";
          export { hello };
          export const goodbye = 'goodbye';
        `,
        "hello.js": `
          export default function() { return 'hello'; }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const _default = (function() { return 'hello'; });
        const goodbye = 'goodbye';
        const lib = { hello: _default, goodbye };
        console.log(lib.hello() + lib.goodbye);
        export {};
        `
      );
    });

    test("can access namespace of module with renamed exports within bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import * as lib from './lib.js';
          console.log(lib.konnichiwa + lib.sayonara);
        `,
        "lib.js": `
          const hello = 'hello';
          const goodbye = 'goodbye';
          export { hello as konnichiwa, goodbye as sayonara };
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello = 'hello';
        const goodbye = 'goodbye';
        const lib = { konnichiwa: hello, sayonara: goodbye };
        console.log(lib.konnichiwa + lib.sayonara);
        export {};
        `
      );
    });

    test("can handle collisions with properties of namespaced imports within a bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import * as lib from './lib.js';
          const hello = 'hi';
          console.log(lib.konnichiwa + lib.sayonara + hello);
        `,
        "lib.js": `
          const hello = 'hello';
          const goodbye = 'goodbye';
          export { hello as konnichiwa, goodbye as sayonara };
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello0 = 'hello';
        const goodbye = 'goodbye';
        const lib = { konnichiwa: hello0, sayonara: goodbye };
        const hello = 'hi';
        console.log(lib.konnichiwa + lib.sayonara + hello);
        export {};
        `
      );
    });

    test("can handle collisions with properties of namespaced imports for multiple exports per binding within a bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import * as lib from './lib.js';
          import { hello, goodbye } from './a.js';
          console.log(lib.konnichiwa + lib.sayonara + hello + goodbye);
        `,
        "lib.js": `
          export const hello = 'hello';
          export const goodbye = 'goodbye';
          export { hello as konnichiwa, goodbye as sayonara };
        `,
        "a.js": `
          export const hello = 'hi';
          export const goodbye = 'bye';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello0 = 'hello';
        const goodbye0 = 'goodbye';
        const hello = 'hi';
        const goodbye = 'bye';
        const lib = { hello: hello0, goodbye: goodbye0, konnichiwa: hello0, sayonara: goodbye0 };
        console.log(lib.konnichiwa + lib.sayonara + hello + goodbye);
        export {};
        `
      );
    });

    test("can prune an unused namespace import within bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import * as lib from './lib.js';
          import { goodbye } from './lib.js';
          console.log(goodbye);
        `,
        "lib.js": `
          export const hello = 'hello';
          export const goodbye = 'goodbye';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const goodbye = 'goodbye';
        console.log(goodbye);
        export {};
        `
      );
    });

    test("can handle dupe namespace imports within a bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import a from "./a.js";
          import b from "./b.js";
          a();
          b();
        `,
        "a.js": `
          import * as lib from './lib.js';
          export default function () {
            console.log(lib.hello);
          }
        `,
        "b.js": `
          import * as lib from './lib.js';
          export default function () {
            console.log(lib.goodbye);
          }
        `,
        "lib.js": `
          export const hello = 'hello';
          export const goodbye = 'goodbye';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello = 'hello';
        const goodbye = 'goodbye';
        const lib = { hello, goodbye };
        const a = (function() { console.log(lib.hello); });
        const b = (function() { console.log(lib.goodbye); });
        a();
        b();
        export {};
        `
      );
    });

    test("reexport a namespace import within a bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { greetings } from './a.js';
          console.log(greetings.konnichiwa + greetings.sayonara);
        `,
        "a.js": `
          import * as lib from './lib.js';
          export { lib as greetings };
        `,
        "lib.js": `
          const hello = 'hello';
          const goodbye = 'goodbye';
          export { hello as konnichiwa, goodbye as sayonara };
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const hello = 'hello';
        const goodbye = 'goodbye';
        const greetings = { konnichiwa: hello, sayonara: goodbye };
        console.log(greetings.konnichiwa + greetings.sayonara);
        export {};
        `
      );
    });

    test("can handle collisions in exported expressions", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import prop from './lib.js';
          const a = 'a';
          const b = 'b';
          console.log(prop.propA + a + b);
        `,
        "lib.js": `
          import { a as prop, b } from "./a.js";
          export default {
            [prop]: b + 1
          };
        `,
        "a.js": `
          export const a = 'propA';
          export const b = 1;
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const prop0 = 'propA';
        const b0 = 1;
        const prop = { [prop0]: b0 + 1 };
        const a = 'a';
        const b = 'b';
        console.log(prop.propA + a + b);
        export {};
        `
      );
    });

    test("can handle default exported function", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import a from './a.js';
          import b from './b.js';
          a();
          b();
        `,
        "a.js": `
          export default function A() {
            console.log('a');
          }
        `,
        "b.js": `
          export default function() {
            console.log('b');
          }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function a() {
          console.log('a');
        }
        const b = function () {
          console.log('b');
        }
        a();
        b();
        export {};
        `
      );
    });

    test("can handle default export in an expression context", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import foo from './a.js';
          foo('bar');
        `,
        "a.js": `
          export default (function a(blah) { console.log(blah); });
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
          const foo = (function a(blah) { console.log(blah); });
          foo('bar');
          export {};
        `
      );
    });

    test("can handle default exported class", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import A from './a.js';
          import B from './b.js';
          let a = new A();
          let b = new B();
          a.display();
          b.display();
        `,
        "a.js": `
          export default class ClassA {
            display() { console.log('a'); }
          }
        `,
        "b.js": `
          export default class {
            display() { console.log('b'); }
          }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        class A {
          display() { console.log('a'); }
        }
        const B = class {
          display() { console.log('b'); }
        }
        let a = new A();
        let b = new B();
        a.display();
        b.display();
        export {};
        `
      );
    });

    test("can handle default exported object", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import obj from './a.js';
          console.log(JSON.stringify(obj));
        `,
        "a.js": `
          const json = { foo: 'bar' };
          const { foo } = json;
          export default json;
          export { foo };
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const obj = { foo: 'bar' };
        console.log(JSON.stringify(obj));
        export {};
        `
      );
    });

    test("can handle both default and named imports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import A, { a as b } from './lib.js';
          let a = new A();
          a.display();
          console.log(b);
        `,
        "lib.js": `
          import { b } from './b.js';
          export default class ClassA {
            display() { console.log(b); }
          }
          export const a = 'a';
        `,
        "b.js": `
          export const b = 'b';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        const b0 = 'b';
        class A {
          display() { console.log(b0); }
        }
        const b = 'a';
        let a = new A();
        a.display();
        console.log(b);
        export {};
        `
      );
    });

    test("preserves bundle imports from other modules", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "a.js"] }`,
        "index.js": `
          import { a } from './a.js';
          const b = 'b';
          console.log(a + b);
        `,
        "a.js": `
          export const a = 1;
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `import { a } from "./a.js";
        const b = 'b';
        console.log(a + b);`
      );
    });

    test("resolves collisions when importing from another bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import { a } from './a.js';
          import { b } from './b.js';
          const c = 'c';
          console.log(a + b + c);
        `,
        "a.js": `
          function b() {
            return 'b';
          }
          export const a = b();
        `,
        "b.js": `
          export const b = 'b';
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `import { b } from "./b.js";
        function b0() {
          return 'b';
        }
        const a = b0();
        const c = 'c';
        console.log(a + b + c);`
      );
    });

    test("preserves side effect import if module with side effect is assigned to different bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "a.js"] }`,
        "index.js": `
          import './a.js';
          const b = 'b';
          console.log(b);
        `,
        "a.js": `
          console.log('side effect');
          export {};
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `import "./a.js";
        const b = 'b';
        console.log(b);`
      );
    });

    test("preserves side effect import if module is imported both for side effect only and imported for an unconsumed binding", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "a.js"] }`,
        "index.js": `
          import './a.js';
          import './b.js';
          const b = 'b';
          console.log(b);
        `,
        "a.js": `
          console.log('side effect');
          export const a = "A";
        `,
        "b.js": `
          import { a } from './a.js';
          console.log('hi');
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `import "./a.js";
        console.log('hi');
        const b = 'b';
        console.log(b);`
      );
    });

    test("strips a side-effect only import if the module is also imported for a consumed binding (the side effect comes along in the named import)", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "a.js"] }`,
        "index.js": `
          import './a.js';
          import './b.js';
          const b = 'b';
          console.log(b);
        `,
        "a.js": `
          console.log('side effect');
          export const a = "A";
        `,
        "b.js": `
          import { a } from './a.js';
          console.log(a);
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `import { a } from "./a.js";
        console.log(a);
        const b = 'b';
        console.log(b);`
      );
    });

    test("strips unused exported function", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './lib.js';
          console.log(a());
        `,
        "lib.js": `
          export function a() { return 1; }
          export function b() { return 2; }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function a() { return 1; }
        console.log(a());
        export {};
        `
      );
    });

    test("strips unconsumed import", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a, b } from './lib.js';
          console.log(a());
        `,
        "lib.js": `
          export function a() { return 1; }
          export function b() { return 2; }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function a() { return 1; }
        console.log(a());
        export {};
        `
      );
    });

    test("strips unconsumed default import", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import b, { a } from './lib.js';
          console.log(a());
        `,
        "lib.js": `
          export function a() { return 1; }
          export default function () { return 2; }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function a() { return 1; }
        console.log(a());
        export {};
        `
      );
    });

    test("a function that's consumed by the bundle itself is not stripped", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './lib.js';
          console.log(a());
        `,
        "lib.js": `
          export function a() { return 1; }
          export function b() { return 2; }
          b();
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function a() { return 1; }
        function b() { return 2; }
        b();
        console.log(a());
        export {};
        `
      );
    });

    test("strips function used only in removed function's body", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './lib.js';
          console.log(a());
        `,
        "lib.js": `
          export function a() { return 1; }
          function helper() {
            return 2;
          }
          export function b(options) { return helper(); }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function a() { return 1; }
        console.log(a());
        export {};
        `
      );
    });

    test("strips imported function used only in removed function's body", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './lib.js';
          console.log(a());
        `,
        "lib.js": `
          import { helper } from './two.js';
          export function a() { return 1; }
          export function b() { return helper(); }
        `,
        "two.js": `
          export function helper() {
            return 2;
          }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function a() { return 1; }
        console.log(a());
        export {};
        `
      );
    });

    test("strips out unconsumed binding that is imported from another bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "a.js"] }`,
        "index.js": `
          import { b } from './lib.js';
          console.log(b());
        `,
        "a.js": `
          export const a = 1;
        `,
        "lib.js": `
          import { a } from './a.js';
          export function c() { return a; }
          export function b() { return 1; }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `function b() { return 1; }
        console.log(b());
        export {};
        `
      );
    });

    test("strips unconsumed variable", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './lib.js';
          console.log(a());
        `,
        "lib.js": `
          export function a() { return 1; }
          let cache;
          function helper() {
            if (cache) { return cache; }
            return cache = 1;
          }
          export function b(options) { return helper(); }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function a() { return 1; }
        console.log(a());
        export {};
        `
      );
    });

    test("strips unconsumed variable in a variable declaration that has more than 1 variable", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './lib.js';
          console.log(a());
        `,
        "lib.js": `
          let cache, aValue;
          export function a() { return aValue; }
          function helper() {
            if (cache) { return cache; }
            return cache = 1;
          }
          export function b(options) { return helper(); }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let aValue;
        function a() { return aValue; }
        console.log(a());
        export {};
        `
      );
    });

    test("strips unconsumed variable that was renamed because of a collision", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './lib.js';
          const foo = 'bleep';
          console.log(a() + foo);
        `,
        "lib.js": `
          export function a() { return 1; }
          let cache;
          function helper() {
            if (cache) { return cache; }
            return cache = 1;
          }
          const foo = 'bar';
          export function b(options) { return helper(); }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function a() { return 1; }
        const foo = 'bleep';
        console.log(a() + foo);
        export {};
        `
      );
    });

    test("preserves side-effectful right-hand side when tree shaking unconsumed bindings", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { i } from './lib.js';
          console.log(i());
        `,
        "lib.js": `
          export function i() { return 1; }
          let a = initCache(), b = true, c = 1, d = 'd', e = null, f = undefined, g = function() {}, h = class foo {};
          function helper() {
            return [a , b, c, d, e, f, g, h];
          }
          export function j(options) { return helper(); }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function i() { return 1; }
        let unused_a = initCache();
        console.log(i());
        export {};
        `
      );
    });

    test("Preserves a side effect in an expression context when the callee is a function expression", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { i } from './lib.js';
          console.log(i());
        `,
        "lib.js": `
          export function i() { return 1; }
          function getNative(a, b) { return a[b]; }
          var defineProperty = function () {
            try {
              var func = getNative(Object, 'defineProperty');
              func({}, '', {});
              return func;
            } catch (e) {}
          }();
          export { defineProperty };
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function i() { return 1; }
        function getNative(a, b) { return a[b]; }
        var defineProperty = function () {
          try {
            var func = getNative(Object, 'defineProperty');
            func({}, '', {});
            return func;
          } catch (e) {}
        }();
        console.log(i());
        export {};
        `
      );
    });

    test("Preserves bindings that are consumed by a preserved side effect that would otherwise be pruned", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { i } from './lib.js';
          console.log(i());
        `,
        "lib.js": `
          export function i() { return 1; }
          class Cache {
            constructor(opts) {
              window.__cache = { bar: opts};
            }
          }
          let b = 'foo';
          let a = new Cache(b);
          function getCache() {
            return a;
          }
          export function j(options) { return getCache(); }
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        function i() { return 1; }
        class Cache {
          constructor(opts) {
            window.__cache = { bar: opts};
          }
        }
        let b = 'foo';
        let unused_a = new Cache(b);
        console.log(i());
        export {};
        `
      );
    });

    test("removes unconsumed leading variable declarator from a declaration", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let a = 1, b = 2;
          console.log(b);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let b = 2;
        console.log(b);
        export {};
        `
      );
    });

    test("removes unconsumed trailing variable declarator from a declaration", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let a = 1, b = 2;
          console.log(a);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let a = 1;
        console.log(a);
        export {};
        `
      );
    });

    test("removes unconsumed adjacent variable declarators from a declaration", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let a = 1, b = 2, c = 3, d = 4;
          console.log(a + d);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let a = 1, d = 4;
        console.log(a + d);
        export {};
        `
      );
    });

    test("removes unconsumed first 2 variable declarators from a declaration", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let a = 1, b = 2, c = 3, d = 4;
          console.log(c + d);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let c = 3, d = 4;
        console.log(c + d);
        export {};
        `
      );
    });

    test("removes unconsumed declarator from a list that includes a mix of LVal and non-LVal declarators", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { a } = foo, b = 2, { c } = blah, d = 4;
          console.log(a + d);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { a } = foo, d = 4;
        console.log(a + d);
        export {};
        `
      );
    });

    test("removes all unconsumed declarators from a declaration and the declaration itself", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let a = 1;
          console.log(2);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        console.log(2);
        export {};
        `
      );
    });

    test("removes all unconsumed declarators in an LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let [ ...{ ...a } ] = foo;
          console.log(2);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        console.log(2);
        export {};
        `
      );
    });

    test("removes unconsumed renamed declarators in an ObjectPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x, y: a } = foo;
          console.log(x);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { x } = foo;
        console.log(x);
        export {};
        `
      );
    });

    test("retains renamed declarators in an ObjectPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x, y: a } = foo;
          console.log(a);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { y: a } = foo;
        console.log(a);
        export {};
        `
      );
    });

    test("removes unconsumed declarator in a nested ObjectPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x, y: { a } } = foo;
          console.log(x);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { x } = foo;
        console.log(x);
        export {};
        `
      );
    });

    test("retains declarator in a nested ObjectPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x, y: { a } } = foo;
          console.log(a);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { y: { a } } = foo;
        console.log(a);
        export {};
        `
      );
    });

    test("removes unconsumed declarator in an ArrayPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let [ x, y, z ] = foo;
          console.log(z);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let [ , , z ] = foo;
        console.log(z);
        export {};
        `
      );
    });

    test("removes unconsumed declarator in a nested ArrayPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let [ x, [ a ] ] = foo;
          console.log(x);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let [ x ] = foo;
        console.log(x);
        export {};
        `
      );
    });

    test("retains declarator in a nested ArrayPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let [ x, [ a ] ] = foo;
          console.log(a);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let [ ,[ a ] ] = foo;
        console.log(a);
        export {};
        `
      );
    });

    test("removes unconsumed declarator in a RestElement LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let [ x, ...y ] = foo;
          console.log(x);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let [ x ] = foo;
        console.log(x);
        export {};
        `
      );
    });

    test("retains declarator in a RestElement LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let [ x, ...y ] = foo;
          console.log(y);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let [ , ...y ] = foo;
        console.log(y);
        export {};
        `
      );
    });

    test("removes unconsumed declarator in a nested RestElement LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let [ x, ...[ ...y ]] = foo;
          console.log(x);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let [ x ] = foo;
        console.log(x);
        export {};
        `
      );
    });

    test("retains declarator in a nested RestElement LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let [ x, ...[ ...y ]] = foo;
          console.log(y);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let [ , ...[ ...y ]] = foo;
        console.log(y);
        export {};
        `
      );
    });

    test("removes unconsumed declarator in an AssignmentPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x, y = 1 } = foo;
          console.log(x);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { x } = foo;
        console.log(x);
        export {};
        `
      );
    });

    test("retains declarator in an AssignmentPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x, y = 1 } = foo;
          console.log(y);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { y = 1 } = foo;
        console.log(y);
        export {};
        `
      );
    });

    test("removes unconsumed declarator in a nested AssignmentPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x, b: [ y = 1 ] } = foo;
          console.log(x);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { x } = foo;
        console.log(x);
        export {};
        `
      );
    });

    test("retains declarator in a nested AssignmentPattern LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x, b: [ y = 1 ] } = foo;
          console.log(y);
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { b: [ y = 1 ] } = foo;
        console.log(y);
        export {};
        `
      );
    });

    test("preserves side-effectful right-hand side when there is only one side effect at the beginning of the list", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let a = initCache(), b = true, c = 1, d = 'd', e = null, f = undefined, g = function() {}, h = class foo {};
          export {};
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let unused_a = initCache();
        export {};
        `
      );
    });

    test("preserves side-effectful right-hand side when there is only one side effect at the end of the list", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let b = true, c = 1, d = 'd', e = null, f = undefined, g = function() {}, h = class foo {}, a = initCache();
          export {};
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let unused_a = initCache();
        export {};
        `
      );
    });

    test("preserves side-effectful right-hand side when there is only one side effect in the middle of the list", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let b = true, c = 1, d = 'd', e = null, a = initCache(), f = undefined, g = function() {}, h = class foo {};
          export {};
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let unused_a = initCache();
        export {};
        `
      );
    });

    test("preserves side-effectful right-hand side when there are multiple effects in the list", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let a = initACache(), b = true, c = 1, d = 'd', e = initECache(), f = undefined, g = function() {}, h = class foo {};
          export {};
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let unused_a = initACache(), unused_e = initECache();
        export {};
        `
      );
    });

    test("preserves side-effectful right-hand side when it is the only declarator in a declaration", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let a = initCache();
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let unused_a = initCache();
        export {};
        `
      );
    });

    test("preserves side-effectful right-hand side for ObjectPatten LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x } = initCache();
          export {};
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { x: unused_x } = initCache();
        export {};
        `
      );
    });

    test("preserves side-effectful right-hand side for ArrayPatten LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let [ x ] = initCache();
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let [ unused_x ] = initCache();
        export {};
        `
      );
    });

    test("preserves side-effectful right-hand side for RestElement LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { a: [ ...x ] } = initCache();
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { a: [ ...unused_x ] } = initCache();
        export {};
        `
      );
    });

    test("preserves side-effectful right-hand side for multiple LVal identifiers", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x, y } = initCache();
          export {};
        `,
      });
      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { x: unused_x, y: unused_y } = initCache();
        export {};
        `
      );
    });

    test("preserves side-effectful initializer in LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
        let { x = initCache() } = foo;
        export {};
      `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { x: unused_x = initCache() } = foo;
        export {};
        `
      );
    });

    test("preserves side-effectful initializer in list that includes side-effectful LVal", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          let { x = initCache() } = foo, y = 1, z = initZCache();
          export {};
        `,
      });

      assert.codeEqual(
        await bundleCode(assert.fs),
        `
        let { x: unused_x = initCache() } = foo, unused_z = initZCache();
        export {};
        `
      );
    });

    test("bundle contains module description", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          import { b } from './b.js';
          console.log(a + b);
          export { a as A, b };
        `,
        "a.js": `export const a = 'a';`,
        "b.js": `export const b = 'b';`,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const a = 'a';
        const b = 'b';
        console.log(a + b);
        export { a as A, b };
      `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let a = desc.declarations.get("a")!;
        assert.equal(a.declaration.declaredName, "a");
        assert.equal(a.declaration.type, "local");
        let b = desc.declarations.get("b")!;
        assert.equal(b.declaration.declaredName, "b");
        assert.equal(b.declaration.type, "local");

        assert.equal(desc.exports.get("A")?.type, "local");
        assert.equal(
          (desc.exports.get("A") as LocalExportDescription).name,
          "a"
        );
        assert.ok(
          desc.exports.get("A")?.exportRegion != null,
          "export region exists"
        );
        assert.equal(desc.exports.get("b")?.type, "local");
        assert.equal(
          (desc.exports.get("b") as LocalExportDescription).name,
          "b"
        );
        assert.ok(
          desc.exports.get("b")?.exportRegion != null,
          "export region exists"
        );

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("a", "renamedA");
        editor.rename("b", "renamedB");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedA = 'a';
          const renamedB = 'b';
          console.log(renamedA + renamedB);
          export { renamedA as A, renamedB as b };
          `
        );
      }
    });

    test("bundle contains module description with reassigned local imports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a as alpha } from './a.js';
          import { b as beta } from './b.js';
          console.log(alpha + beta);
          export { alpha as A, beta };
        `,
        "a.js": `export const a = 'a';`,
        "b.js": `export const b = 'b';`,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const alpha = 'a';
        const beta = 'b';
        console.log(alpha + beta);
        export { alpha as A, beta };
      `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let alpha = desc.declarations.get("alpha")!;
        assert.equal(alpha.declaration.declaredName, "alpha");
        assert.equal(alpha.declaration.type, "local");
        let beta = desc.declarations.get("beta")!;
        assert.equal(beta.declaration.declaredName, "beta");
        assert.equal(beta.declaration.type, "local");

        assert.equal(desc.exports.get("A")?.type, "local");
        assert.equal(
          (desc.exports.get("A") as LocalExportDescription).name,
          "alpha"
        );
        assert.ok(
          desc.exports.get("A")?.exportRegion != null,
          "export region exists"
        );
        assert.equal(desc.exports.get("beta")?.type, "local");
        assert.equal(
          (desc.exports.get("beta") as LocalExportDescription).name,
          "beta"
        );
        assert.ok(
          desc.exports.get("beta")?.exportRegion != null,
          "export region exists"
        );

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("alpha", "renamedA");
        editor.rename("beta", "renamedB");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedA = 'a';
          const renamedB = 'b';
          console.log(renamedA + renamedB);
          export { renamedA as A, renamedB as beta };
          `
        );
      }
    });

    test("bundle contains module description with pruned declaration references", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { a } from './a.js';
          import { b } from './b.js';
          const c = b;
          console.log(a + b);
          export { a as A, b };
        `,
        "a.js": `export const a = 'a';`,
        "b.js": `export const b = 'b';`,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const a = 'a';
        const b = 'b';
        console.log(a + b);
        export { a as A, b };
       `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let a = desc.declarations.get("a")!;
        assert.equal(a.declaration.declaredName, "a");
        assert.equal(a.declaration.type, "local");
        let b = desc.declarations.get("b")!;
        assert.equal(b.declaration.declaredName, "b");
        assert.equal(b.declaration.type, "local");

        assert.equal(desc.exports.get("A")?.type, "local");
        assert.equal(
          (desc.exports.get("A") as LocalExportDescription).name,
          "a"
        );
        assert.ok(
          desc.exports.get("A")?.exportRegion != null,
          "export region exists"
        );
        assert.equal(desc.exports.get("b")?.type, "local");
        assert.equal(
          (desc.exports.get("b") as LocalExportDescription).name,
          "b"
        );
        assert.ok(
          desc.exports.get("b")?.exportRegion != null,
          "export region exists"
        );

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("a", "renamedA");
        editor.rename("b", "renamedB");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedA = 'a';
          const renamedB = 'b';
          console.log(renamedA + renamedB);
          export { renamedA as A, renamedB as b };
          `
        );
      }
    });

    test("bundle contains module description with an exported default function", async function (assert) {
      let doerBundleHref = `https://catalogjs.com/pkgs/npm/doer/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=`;
      await assert.setupFiles({
        [`${doerBundleHref}/entrypoints.json`]: `{ "js": ["index.js"] }`,
        [`${doerBundleHref}/index.js`]: `
          export default function() { console.log('do something'); }
        `,
        "entrypoints.json": `{
          "js": ["index.js"],
          "dependencies": {
            "doer": {
              "type": "npm",
              "pkgName": "doer",
              "range": "^7.9.4"
            }
          }
        }`,
        "catalogjs.lock": `{
          "doer": "${doerBundleHref}/index.js"
        }`,
        "index.js": `
          import doSomething from 'doer';
          export default function() { doSomething(); }
        `,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const doSomething = (function() { console.log('do something'); });
        const _default = (function() { doSomething(); });
        export { _default as default };
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let doSomething = desc.declarations.get("doSomething")!;
        assert.equal(doSomething.declaration.declaredName, "doSomething");
        assert.equal(doSomething.declaration.type, "local");
        let _default = desc.declarations.get("_default")!;
        assert.equal(_default.declaration.declaredName, "_default");
        assert.equal(_default.declaration.type, "local");

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("doSomething", "renamedSomething");
        editor.rename("_default", "renamedDefault");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedSomething = (function() { console.log('do something'); });
          const renamedDefault = (function() { renamedSomething(); });
          export { renamedDefault as default };
          `
        );
      }
    });

    test("bundle contains module description with interior namespace imports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import * as a from './a.js';
          import * as b from './b.js';
          console.log(a.foo + b.bleep);
        `,
        "a.js": `
          const foo = 'foo';
          const b = 'bar';
          export { foo, b as bar };
        `,
        "b.js": `
          const bleep = 'bleep';
          export { bleep };
        `,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const foo = 'foo';
        const b0 = 'bar';
        const bleep = 'bleep';
        const a = { foo, bar: b0 };
        const b = { bleep };
        console.log(a.foo + b.bleep);
        export {};
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 5);
        let a = desc.declarations.get("a")!;
        assert.equal(a.declaration.declaredName, "a");
        assert.equal(a.declaration.type, "local");
        let b0 = desc.declarations.get("b0")!;
        assert.equal(b0.declaration.declaredName, "b0");
        assert.equal(b0.declaration.type, "local");
        let foo = desc.declarations.get("foo")!;
        assert.equal(foo.declaration.declaredName, "foo");
        assert.equal(foo.declaration.type, "local");
        let b = desc.declarations.get("b")!;
        assert.equal(b.declaration.declaredName, "b");
        assert.equal(b.declaration.type, "local");
        let bleep = desc.declarations.get("bleep")!;
        assert.equal(bleep.declaration.declaredName, "bleep");
        assert.equal(bleep.declaration.type, "local");

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("a", "renamedA");
        editor.rename("b", "renamedB");
        editor.rename("b0", "renamedB0");
        editor.rename("foo", "renamedFoo");
        editor.rename("bleep", "renamedBleep");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedFoo = 'foo';
          const renamedB0 = 'bar';
          const renamedBleep = 'bleep';
          const renamedA = { foo: renamedFoo, bar: renamedB0 };
          const renamedB = { bleep: renamedBleep };
          console.log(renamedA.foo + renamedB.bleep);
          export {};
          `
        );
      }
    });

    test("bundle contains module description with namespace imports from external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "a.js", "b.js"] }`,
        "index.js": `
          import * as a from './a.js';
          import * as b from './b.js';
          console.log(a.foo + b.bleep);
        `,
        "a.js": `
          const foo = 'foo';
          const b = 'bar';
          export { foo, b as bar };
        `,
        "b.js": `
          const bleep = 'bleep';
          export { bleep };
        `,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        import * as a from './a.js';
        import * as b from './b.js';
        console.log(a.foo + b.bleep);
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let a = desc.declarations.get("a")!;
        assert.equal(a.declaration.declaredName, "a");
        assert.equal(a.declaration.type, "import");
        if (a.declaration.type === "import") {
          assert.equal(a.declaration.importIndex, 0);
          assert.equal(isNamespaceMarker(a.declaration.importedName), true);
        }
        let b = desc.declarations.get("b")!;
        assert.equal(b.declaration.declaredName, "b");
        assert.equal(b.declaration.type, "import");
        if (b.declaration.type === "import") {
          assert.equal(b.declaration.importIndex, 1);
          assert.equal(isNamespaceMarker(b.declaration.importedName), true);
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("a", "renamedA");
        editor.rename("b", "renamedB");
        assert.codeEqual(
          editor.serialize().code,
          `
          import * as renamedA from './a.js';
          import * as renamedB from './b.js';
          console.log(renamedA.foo + renamedB.bleep);
          `
        );
      }
    });

    test("bundle contains module description with named default export", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { foo } from './a.js';
          export default function bar() {
            return foo;
          }
        `,
        "a.js": `
          export const foo = 'foo';
        `,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const foo = 'foo';
        function bar() {
          return foo;
        }
        export { bar as default };
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let bar = desc.declarations.get("bar")!;
        assert.equal(bar.declaration.declaredName, "bar");
        assert.equal(bar.declaration.type, "local");

        assert.equal(desc.exports.size, 1);
        let defaultExport = desc.exports.get("default")!;
        assert.equal(defaultExport.type, "local");
        if (defaultExport.type === "local") {
          assert.equal(defaultExport.name, "bar");
          assert.ok(defaultExport.exportRegion != null);
        }
        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedFoo = 'foo';
          function renamedBar() {
            return renamedFoo;
          }
          export { renamedBar as default };
          `
        );
      }
    });

    test("bundle contains module description with unnamed default export", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { foo } from './a.js';
          export default function() {
            return foo;
          }
        `,
        "a.js": `
          export const foo = 'foo';
        `,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const foo = 'foo';
        const _default = (function() {
          return foo;
        });
        export { _default as default };
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let _default = desc.declarations.get("_default")!;
        assert.equal(_default.declaration.declaredName, "_default");
        assert.equal(_default.declaration.type, "local");

        assert.equal(desc.exports.size, 1);
        let defaultExport = desc.exports.get("default")!;
        assert.equal(defaultExport.type, "local");
        if (defaultExport.type === "local") {
          assert.equal(defaultExport.name, "_default");
          assert.ok(defaultExport.exportRegion != null);
        }
        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("_default", "renamedDefault");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedFoo = 'foo';
          const renamedDefault = (function() {
            return renamedFoo;
          });
          export { renamedDefault as default };
          `
        );
      }
    });

    test("bundle contains module description with named exports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { foo } from './a.js';
          export function bar() {
            return foo;
          }
          export const bleep = 'bleep';
        `,
        "a.js": `
          export const foo = 'foo';
        `,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const foo = 'foo';
        function bar() {
          return foo;
        }
        const bleep = 'bleep';
        export { bar, bleep };
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.exports.size, 2);
        let bar = desc.exports.get("bar")!;
        assert.equal(bar.type, "local");
        if (bar.type === "local") {
          assert.equal(bar.name, "bar");
          assert.ok(bar.exportRegion != null);
        }
        let bleep = desc.exports.get("bleep")!;
        assert.equal(bleep.type, "local");
        if (bleep.type === "local") {
          assert.equal(bleep.name, "bleep");
          assert.ok(bleep.exportRegion != null);
        }
        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("bar", "renamedBar");
        editor.rename("bleep", "renamedBleep");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedFoo = 'foo';
          function renamedBar() {
            return renamedFoo;
          }
          const renamedBleep = 'bleep';
          export { renamedBar as bar, renamedBleep as bleep };
          `
        );
      }
    });

    test("bundle contains module description with named and default exports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { foo } from './a.js';
          export default function() {
            return foo;
          }
          export const bleep = 'bleep';
        `,
        "a.js": `
          export const foo = 'foo';
        `,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const foo = 'foo';
        const _default = (function() {
          return foo;
        });
        const bleep = 'bleep';
        export { _default as default, bleep };
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 3);
        let _default = desc.declarations.get("_default")!;
        assert.equal(_default.declaration.declaredName, "_default");
        assert.equal(_default.declaration.type, "local");

        assert.equal(desc.exports.size, 2);
        let defaultExport = desc.exports.get("default")!;
        assert.equal(defaultExport.type, "local");
        if (defaultExport.type === "local") {
          assert.equal(defaultExport.name, "_default");
          assert.ok(defaultExport.exportRegion != null);
        }
        let bleep = desc.exports.get("bleep")!;
        assert.equal(bleep.type, "local");
        if (bleep.type === "local") {
          assert.equal(bleep.name, "bleep");
          assert.ok(bleep.exportRegion != null);
        }
        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("_default", "renamedDefault");
        editor.rename("bleep", "renamedBleep");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedFoo = 'foo';
          const renamedDefault = (function() {
            return renamedFoo;
          });
          const renamedBleep = 'bleep';
          export { renamedDefault as default, renamedBleep as bleep };
          `
        );
      }
    });

    test("bundle contains module description with an export of an internal namespace import", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import * as a from './a.js';
          import * as b from './b.js';
          export { a, b };
        `,
        "a.js": `
          const foo = 'foo';
          const b = 'bar';
          export { foo, b as bar };
        `,
        "b.js": `
          const bleep = 'bleep';
          export { bleep };
        `,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const foo = 'foo';
        const b0 = 'bar';
        const a = { foo, bar: b0 };
        const bleep = 'bleep';
        const b = { bleep };
        export { a, b };
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 5);
        let a = desc.declarations.get("a")!;
        assert.equal(a.declaration.declaredName, "a");
        assert.equal(a.declaration.type, "local");
        let b0 = desc.declarations.get("b0")!;
        assert.equal(b0.declaration.declaredName, "b0");
        assert.equal(b0.declaration.type, "local");
        let foo = desc.declarations.get("foo")!;
        assert.equal(foo.declaration.declaredName, "foo");
        assert.equal(foo.declaration.type, "local");
        let b = desc.declarations.get("b")!;
        assert.equal(b.declaration.declaredName, "b");
        assert.equal(b.declaration.type, "local");
        let bleep = desc.declarations.get("bleep")!;
        assert.equal(bleep.declaration.declaredName, "bleep");
        assert.equal(bleep.declaration.type, "local");

        assert.equal(desc.exports.size, 2);
        let exportA = desc.exports.get("a")!;
        assert.equal(exportA.type, "local");
        if (exportA.type === "local") {
          assert.equal(exportA.name, "a");
          assert.ok(exportA.exportRegion != null, "export region exists");
        }
        let exportB = desc.exports.get("b")!;
        assert.equal(exportB.type, "local");
        if (exportB.type === "local") {
          assert.equal(exportB.name, "b");
          assert.ok(exportB.exportRegion != null, "export region exists");
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("a", "renamedA");
        editor.rename("b", "renamedB");
        editor.rename("b0", "renamedB0");
        editor.rename("foo", "renamedFoo");
        editor.rename("bleep", "renamedBleep");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedFoo = 'foo';
          const renamedB0 = 'bar';
          const renamedA = { foo: renamedFoo, bar: renamedB0 };
          const renamedBleep = 'bleep';
          const renamedB = { bleep: renamedBleep };
          export { renamedA as a, renamedB as b };
          `
        );
      }
    });

    test("bundle contains module description with an export of a namespace import from an external bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "a.js", "b.js"] }`,
        "index.js": `
          import * as a from './a.js';
          import * as b from './b.js';
          export { a, b };
        `,
        "a.js": `
          const foo = 'foo';
          const b = 'bar';
          export { foo, b as bar };
        `,
        "b.js": `
          const bleep = 'bleep';
          export { bleep };
        `,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        import * as a from './a.js';
        import * as b from './b.js';
        export { a, b };
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let a = desc.declarations.get("a")!;
        assert.equal(a.declaration.declaredName, "a");
        assert.equal(a.declaration.type, "import");
        if (a.declaration.type === "import") {
          assert.equal(a.declaration.importIndex, 0);
          assert.equal(isNamespaceMarker(a.declaration.importedName), true);
        }
        let b = desc.declarations.get("b")!;
        assert.equal(b.declaration.declaredName, "b");
        assert.equal(b.declaration.type, "import");
        if (b.declaration.type === "import") {
          assert.equal(b.declaration.importIndex, 1);
          assert.equal(isNamespaceMarker(b.declaration.importedName), true);
        }

        assert.equal(desc.exports.size, 2);
        let exportA = desc.exports.get("a")!;
        assert.equal(exportA.type, "local");
        if (exportA.type === "local") {
          assert.equal(exportA.name, "a");
          assert.ok(exportA.exportRegion != null, "export region exists");
        }
        let exportB = desc.exports.get("b")!;
        assert.equal(exportB.type, "local");
        if (exportB.type === "local") {
          assert.equal(exportB.name, "b");
          assert.ok(exportB.exportRegion != null, "export region exists");
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("a", "renamedA");
        editor.rename("b", "renamedB");
        assert.codeEqual(
          editor.serialize().code,
          `
          import * as renamedA from './a.js';
          import * as renamedB from './b.js';
          export { renamedA as a, renamedB as b };
          `
        );
      }
    });

    test("bundle contains module description with reassigned named exports", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { foo } from './a.js';
          function bar() {
            return foo;
          }
          const bleep = 'bleep';
          export { bar as b1, bleep as b2 };
        `,
        "a.js": `
          export const foo = 'foo';
        `,
      });

      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const foo = 'foo';
        function bar() {
          return foo;
        }
        const bleep = 'bleep';
        export { bar as b1, bleep as b2 };
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.exports.size, 2);
        let b1 = desc.exports.get("b1")!;
        assert.equal(b1.type, "local");
        if (b1.type === "local") {
          assert.equal(b1.name, "bar");
          assert.ok(b1.exportRegion != null);
        }
        let b2 = desc.exports.get("b2")!;
        assert.equal(b2.type, "local");
        if (b2.type === "local") {
          assert.equal(b2.name, "bleep");
          assert.ok(b2.exportRegion != null);
        }
        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("bar", "renamedBar");
        editor.rename("bleep", "renamedBleep");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedFoo = 'foo';
          function renamedBar() {
            return renamedFoo;
          }
          const renamedBleep = 'bleep';
          export { renamedBar as b1, renamedBleep as b2 };
          `
        );
      }
    });

    test("bundle contains module description with reexports from external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import { bar } from './a.js';
          export { foo, fleep } from './b.js';
          console.log(bar);
        `,
        "a.js": `
          export const bar = 'bar';
        `,
        "b.js": `
          export function foo() { console.log('foo') }
          export function fleep() { console.log('fleep') }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const bar = 'bar';
        console.log(bar);
        export { foo, fleep } from './b.js';
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 1);
        assert.equal(desc.imports.length, 1);
        let [reexport] = desc.imports;

        assert.equal(reexport.isDynamic, false);
        if (!reexport.isDynamic) {
          assert.equal(reexport.specifier, "./b.js");
          assert.equal(reexport.isReexport, true);
          assert.equal(desc.regions[reexport.region].type, "import");
          let importRegion = desc.regions[reexport.region];
          if (importRegion.type === "import") {
            assert.equal(importRegion.importIndex, 0);
          }
        }

        assert.equal(desc.exports.size, 2);
        let foo = desc.exports.get("foo")!;
        assert.equal(foo.type, "reexport");
        if (foo.type === "reexport") {
          assert.equal(foo.importIndex, 0);
          assert.equal(foo.name, "foo");
          assert.ok(foo.exportRegion != null, "export region exists in desc");
          assert.equal(desc.regions[foo.exportRegion].type, "import");
          assert.equal(
            (desc.regions[foo.exportRegion] as ImportCodeRegion).importIndex,
            0
          );
          assert.equal(
            (desc.regions[foo.exportRegion] as ImportCodeRegion).exportType,
            "reexport"
          );
        }
        let fleep = desc.exports.get("fleep")!;
        assert.equal(fleep.type, "reexport");
        if (fleep.type === "reexport") {
          assert.equal(fleep.importIndex, 0);
          assert.equal(fleep.name, "fleep");
          assert.ok(fleep.exportRegion != null, "export region exists in desc");
          assert.equal(desc.regions[fleep.exportRegion].type, "import");
          assert.equal(
            (desc.regions[fleep.exportRegion] as ImportCodeRegion).importIndex,
            0
          );
          assert.equal(
            (desc.regions[fleep.exportRegion] as ImportCodeRegion).exportType,
            "reexport"
          );
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedBar = 'bar';
          console.log(renamedBar);
          export { foo, fleep } from './b.js';
          `
        );
      }
    });

    test("bundle contains module description with manual reexport (import followed by export) from external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import { bar } from './a.js';
          import { foo, fleep } from './b.js';
          export { foo, fleep };
          console.log(bar);
        `,
        "a.js": `
          export const bar = 'bar';
        `,
        "b.js": `
          export function foo() { console.log('foo') }
          export function fleep() { console.log('fleep') }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        import { foo, fleep } from './b.js';
        const bar = 'bar';
        console.log(bar);
        export { foo, fleep };
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 3);
        let fooDecl = desc.declarations.get("foo")!;
        assert.equal(fooDecl.declaration.declaredName, "foo");
        assert.equal(fooDecl.declaration.type, "import");
        if (fooDecl.declaration.type === "import") {
          assert.equal(fooDecl.declaration.importIndex, 0);
          assert.equal(fooDecl.declaration.importedName, "foo");
        }
        let fleepDecl = desc.declarations.get("fleep")!;
        assert.equal(fleepDecl.declaration.declaredName, "fleep");
        assert.equal(fleepDecl.declaration.type, "import");
        if (fleepDecl.declaration.type === "import") {
          assert.equal(fleepDecl.declaration.importIndex, 0);
          assert.equal(fleepDecl.declaration.importedName, "fleep");
        }

        assert.equal(desc.imports.length, 1);
        let [reexport] = desc.imports;

        assert.equal(reexport.isDynamic, false);
        if (!reexport.isDynamic) {
          assert.equal(reexport.specifier, "./b.js");
          assert.equal(reexport.isReexport, false);
          assert.equal(desc.regions[reexport.region].type, "import");
          let importRegion = desc.regions[reexport.region];
          if (importRegion.type === "import") {
            assert.equal(importRegion.importIndex, 0);
          }
        }

        assert.equal(desc.exports.size, 2);
        let foo = desc.exports.get("foo")!;
        assert.equal(foo.type, "local");
        if (foo.type === "local") {
          assert.equal(foo.name, "foo");
          assert.ok(foo.exportRegion != null, "export region exists in desc");
        }
        let fleep = desc.exports.get("fleep")!;
        assert.equal(fleep.type, "local");
        if (fleep.type === "local") {
          assert.equal(fleep.name, "fleep");
          assert.ok(fleep.exportRegion != null, "export region exists in desc");
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("fleep", "renamedFleep");
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          import { foo as renamedFoo, fleep as renamedFleep} from './b.js';
          const renamedBar = 'bar';
          console.log(renamedBar);
          export { renamedFoo as foo, renamedFleep as fleep };
          `
        );
      }
    });

    test("bundle contains module description with default reexport from external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import { bar } from './a.js';
          export { default } from './b.js';
          console.log(bar);
        `,
        "a.js": `
          export const bar = 'bar';
        `,
        "b.js": `
          export default function() { console.log('foo') }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const bar = 'bar';
        console.log(bar);
        export { default } from './b.js';
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 1);
        assert.equal(desc.imports.length, 1);
        let [reexport] = desc.imports;

        assert.equal(reexport.isDynamic, false);
        if (!reexport.isDynamic) {
          assert.equal(reexport.specifier, "./b.js");
          assert.equal(reexport.isReexport, true);
          assert.equal(desc.regions[reexport.region].type, "import");
          let importRegion = desc.regions[reexport.region];
          if (importRegion.type === "import") {
            assert.equal(importRegion.importIndex, 0);
          }
        }

        assert.equal(desc.exports.size, 1);
        let defaultExport = desc.exports.get("default")!;
        assert.equal(defaultExport.type, "reexport");
        if (defaultExport.type === "reexport") {
          assert.equal(defaultExport.importIndex, 0);
          assert.equal(defaultExport.name, "default");
          assert.ok(
            defaultExport.exportRegion != null,
            "export region exists in desc"
          );
          assert.equal(desc.regions[defaultExport.exportRegion].type, "import");
          assert.equal(
            (desc.regions[defaultExport.exportRegion] as ImportCodeRegion)
              .importIndex,
            0
          );
          assert.equal(
            (desc.regions[defaultExport.exportRegion] as ImportCodeRegion)
              .exportType,
            "reexport"
          );
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedBar = 'bar';
          console.log(renamedBar);
          export { default } from './b.js';
          `
        );
      }
    });

    test("bundle contains module description with renamed default reexport from external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import { bar } from './a.js';
          export { default as foo } from './b.js';
          console.log(bar);
        `,
        "a.js": `
          export const bar = 'bar';
        `,
        "b.js": `
          export default function() { console.log('foo') }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const bar = 'bar';
        console.log(bar);
        export { default as foo } from './b.js';
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 1);
        assert.equal(desc.imports.length, 1);
        let [reexport] = desc.imports;

        assert.equal(reexport.isDynamic, false);
        if (!reexport.isDynamic) {
          assert.equal(reexport.specifier, "./b.js");
          assert.equal(reexport.isReexport, true);
          assert.equal(desc.regions[reexport.region].type, "import");
          let importRegion = desc.regions[reexport.region];
          if (importRegion.type === "import") {
            assert.equal(importRegion.importIndex, 0);
          }
        }

        assert.equal(desc.exports.size, 1);
        let foo = desc.exports.get("foo")!;
        assert.equal(foo.type, "reexport");
        if (foo.type === "reexport") {
          assert.equal(foo.importIndex, 0);
          assert.equal(foo.name, "default");
          assert.ok(foo.exportRegion != null, "export region exists in desc");
          assert.equal(desc.regions[foo.exportRegion].type, "import");
          assert.equal(
            (desc.regions[foo.exportRegion] as ImportCodeRegion).importIndex,
            0
          );
          assert.equal(
            (desc.regions[foo.exportRegion] as ImportCodeRegion).exportType,
            "reexport"
          );
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedBar = 'bar';
          console.log(renamedBar);
          export { default as foo } from './b.js';
          `
        );
      }
    });

    test("bundle contains module description with reassigned reexports from external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import { bar } from './a.js';
          export { foo as f } from './b.js';
          console.log(bar);
        `,
        "a.js": `
          export const bar = 'bar';
        `,
        "b.js": `
          export function foo() { console.log('foo') }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const bar = 'bar';
        console.log(bar);
        export { foo as f } from './b.js';
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 1);
        assert.equal(desc.imports.length, 1);
        let [reexport] = desc.imports;

        assert.equal(reexport.isDynamic, false);
        if (!reexport.isDynamic) {
          assert.equal(reexport.specifier, "./b.js");
          assert.equal(reexport.isReexport, true);
          assert.equal(desc.regions[reexport.region].type, "import");
          let importRegion = desc.regions[reexport.region];
          if (importRegion.type === "import") {
            assert.equal(importRegion.importIndex, 0);
          }
        }

        assert.equal(desc.exports.size, 1);
        let foo = desc.exports.get("f")!;
        assert.equal(foo.type, "reexport");
        if (foo.type === "reexport") {
          assert.equal(foo.importIndex, 0);
          assert.equal(foo.name, "foo");
          assert.ok(foo.exportRegion != null, "export region exists in desc");
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedBar = 'bar';
          console.log(renamedBar);
          export { foo as f } from './b.js';
          `
        );
      }
    });

    test("bundle contains module description with export-all from internal modules", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { default as bar, foo } from './a.js';
          console.log(bar() + foo());
        `,
        "a.js": `
          export * from "./b.js";
          export default function() { return 'bar'; }
        `,
        "b.js": `
          export function foo() { return 'foo'; }
          export default function() { return 'default'; }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        function foo() { return 'foo'; }
        const bar = (function() { return 'bar'; });
        console.log(bar() + foo());
        export {};
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let foo = desc.declarations.get("foo")!;
        assert.equal(foo.declaration.declaredName, "foo");
        assert.equal(foo.declaration.type, "local");
        let bar = desc.declarations.get("bar")!;
        assert.equal(bar.declaration.declaredName, "bar");
        assert.equal(bar.declaration.type, "local");

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          function renamedFoo() { return 'foo'; }
          const renamedBar = (function() { return 'bar'; });
          console.log(renamedBar() + renamedFoo());
          export {};
          `
        );
      }
    });

    test("bundle contains module description with an exported export-all binding from an internal module", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { default as bar, foo } from './a.js';
          export { bar, foo };
        `,
        "a.js": `
          export * from "./b.js";
          export default function() { return 'bar'; }
        `,
        "b.js": `
          export function foo() { return 'foo'; }
          export default function() { return 'default'; }
        `,
      });
      let { source, desc } = await bundle(assert.fs);

      // note that since "bar" is never used in the index.js module scope (which
      // exports are not part of), it never gets a named assigned, so it falls
      // back to the name "_default"
      assert.codeEqual(
        source,
        `
        function foo() { return 'foo'; }
        const _default = (function() { return 'bar'; });
        export { _default as bar, foo };
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let foo = desc.declarations.get("foo")!;
        assert.equal(foo.declaration.declaredName, "foo");
        assert.equal(foo.declaration.type, "local");
        let _default = desc.declarations.get("_default")!;
        assert.equal(_default.declaration.declaredName, "_default");
        assert.equal(_default.declaration.type, "local");

        assert.equal(desc.exports.size, 2);
        let barExport = desc.exports.get("bar")!;
        assert.equal(barExport.type, "local");
        if (barExport.type === "local") {
          assert.equal(barExport.name, "_default");
          assert.ok(
            barExport.exportRegion != null,
            "export region exists in desc"
          );
        }
        let fooExport = desc.exports.get("foo")!;
        assert.equal(fooExport.type, "local");
        if (fooExport.type === "local") {
          assert.equal(fooExport.name, "foo");
          assert.ok(
            fooExport.exportRegion != null,
            "export region exists in desc"
          );
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("_default", "renamedDefault");
        assert.codeEqual(
          editor.serialize().code,
          `
          function renamedFoo() { return 'foo'; }
          const renamedDefault = (function() { return 'bar'; });
          export { renamedDefault as bar, renamedFoo as foo };
          `
        );
      }
    });

    test("bundle contains module description with an exported export-all that derives from a reexported binding from an internal module", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { default as bar, foo } from './a.js';
          export { bar, foo };
        `,
        "a.js": `
          export * from "./b.js";
          export default function() { return 'bar'; }
        `,
        "b.js": `
          export { foo } from "./c.js";
          export default function() { return 'default'; }
        `,
        "c.js": `
          export function foo() { return 'foo'; }
        `,
      });
      let { source, desc } = await bundle(assert.fs);

      // note that since "bar" is never used in the index.js module scope (which
      // exports are not part of), it never gets a named assigned, so it falls
      // back to the name "_default"
      assert.codeEqual(
        source,
        `
        function foo() { return 'foo'; }
        const _default = (function() { return 'bar'; });
        export { _default as bar, foo };
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let foo = desc.declarations.get("foo")!;
        assert.equal(foo.declaration.declaredName, "foo");
        assert.equal(foo.declaration.type, "local");
        let _default = desc.declarations.get("_default")!;
        assert.equal(_default.declaration.declaredName, "_default");
        assert.equal(_default.declaration.type, "local");

        assert.equal(desc.exports.size, 2);
        let barExport = desc.exports.get("bar")!;
        assert.equal(barExport.type, "local");
        if (barExport.type === "local") {
          assert.equal(barExport.name, "_default");
          assert.ok(
            barExport.exportRegion != null,
            "export region exists in desc"
          );
        }
        let fooExport = desc.exports.get("foo")!;
        assert.equal(fooExport.type, "local");
        if (fooExport.type === "local") {
          assert.equal(fooExport.name, "foo");
          assert.ok(
            fooExport.exportRegion != null,
            "export region exists in desc"
          );
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("_default", "renamedDefault");
        assert.codeEqual(
          editor.serialize().code,
          `
          function renamedFoo() { return 'foo'; }
          const renamedDefault = (function() { return 'bar'; });
          export { renamedDefault as bar, renamedFoo as foo };
          `
        );
      }
    });

    test("bundle contains module description with export-all from external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import { default as bar } from './a.js';
          console.log(bar);
          export * from "./b.js";
        `,
        "a.js": `
          export default function() { return 'bar'; }
        `,
        "b.js": `
          export function foo() { return 'foo'; }
          export default function() { return 'default'; }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const bar = (function() { return 'bar'; });
        console.log(bar);
        export * from "./b.js";
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 1);
        assert.equal(desc.exports.size, 1);
        let [, barExport] = [...desc.exports].find(
          ([exportName]) =>
            isExportAllMarker(exportName) &&
            exportName.exportAllFrom === "./b.js"
        )!;
        assert.equal(barExport.type, "export-all");
        if (barExport.type === "export-all") {
          assert.equal(barExport.importIndex, 0);
          assert.ok(
            barExport.exportRegion != null,
            "export region exists in desc"
          );
          assert.equal(desc.regions[barExport.exportRegion].type, "import");
          assert.equal(
            (desc.regions[barExport.exportRegion] as ImportCodeRegion)
              .importIndex,
            0
          );
          assert.equal(
            (desc.regions[barExport.exportRegion] as ImportCodeRegion)
              .exportType,
            "export-all"
          );
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedBar = (function() { return 'bar'; });
          console.log(renamedBar);
          export * from "./b.js";
          `
        );
      }
    });

    // This is a bit intense, and I'm guessing an esoteric situation. The idea
    // is that there is an export-all of an external bundle from a module that
    // is not an entrypoint of the bundle, meaning that the export-all is not
    // actually part of the bundle's API. In this case we manufacture a
    // namespace import and assign to an arbitrary binding, and then use object
    // destructuring to declare bindings from the namespace import binding.
    test("bundle contains module description with an interior export-all of an external bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import { foo, bar as b } from './a.js';
          console.log(foo + b);
        `,
        "a.js": `
          export * from "./b.js";
        `,
        "b.js": `
          export function foo() { return 'foo'; }
          export function bar() { return 'bar'; }
          export default function() { return 'default'; }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        import * as _namespace0 from './b.js';
        const { foo, bar: b } = _namespace0;
        console.log(foo + b);
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 3);
        let foo = desc.declarations.get("foo")!;
        assert.equal(foo.declaration.declaredName, "foo");
        assert.equal(foo.declaration.type, "local");
        let b = desc.declarations.get("b")!;
        assert.equal(b.declaration.declaredName, "b");
        assert.equal(b.declaration.type, "local");
        let namespace = desc.declarations.get("_namespace0")!;
        assert.equal(namespace.declaration.declaredName, "_namespace0");
        assert.equal(namespace.declaration.type, "import");
        if (namespace.declaration.type === "import") {
          assert.equal(namespace.declaration.importedName, NamespaceMarker);
          assert.equal(namespace.declaration.importIndex, 0);
        }

        assert.equal(desc.exports.size, 0);
        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("_namespace0", "renamedNamespace");
        editor.rename("foo", "renamedFoo");
        editor.rename("b", "renamedB");
        assert.codeEqual(
          editor.serialize().code,
          `
          import * as renamedNamespace from './b.js';
          const { foo: renamedFoo, bar: renamedB } = renamedNamespace;
          console.log(renamedFoo + renamedB);
          `
        );
      }
    });

    test("bundle contains module description with side effect only import of external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js", "c.js"] }`,
        "index.js": `
          import './a.js';
          import './b.js';
          const b = 'b';
          console.log(b);
        `,
        "a.js": `
          import './c.js';
          const a = 'a';
          console.log(a);
        `,
        "b.js": `
          console.log('b');
          export {};
        `,
        "c.js": `
          console.log('c');
          export {};
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        import './c.js';
        import './b.js';
        const a = 'a';
        console.log(a);
        const b = 'b';
        console.log(b);
        `
      );

      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.imports.length, 2);
        let [cImport, bImport] = desc.imports;

        assert.equal(cImport.isDynamic, false);
        if (!cImport.isDynamic) {
          assert.equal(cImport.specifier, "./c.js");
          assert.equal(cImport.isReexport, false);
          assert.equal(desc.regions[cImport.region].type, "import");
          let importRegion = desc.regions[cImport.region];
          if (importRegion.type === "import") {
            assert.equal(importRegion.importIndex, 0);
          }
        }

        assert.equal(bImport.isDynamic, false);
        if (!bImport.isDynamic) {
          assert.equal(bImport.specifier, "./b.js");
          assert.equal(bImport.isReexport, false);
          assert.equal(desc.regions[bImport.region].type, "import");
          let importRegion = desc.regions[bImport.region];
          if (importRegion.type === "import") {
            assert.equal(importRegion.importIndex, 1);
          }
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("a", "renamedA");
        editor.rename("b", "renamedB");
        assert.codeEqual(
          editor.serialize().code,
          `
          import './c.js';
          import './b.js';
          const renamedA = 'a';
          console.log(renamedA);
          const renamedB = 'b';
          console.log(renamedB);
          `
        );
      }
    });

    test("bundle contains module description with default import of external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import bar from './a.js';
          console.log(bar());
        `,
        "a.js": `
          import foo from './b.js';
          export default function() { console.log(foo); }
        `,
        "b.js": `
          export default function() { console.log('foo') }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        import { default as foo } from './b.js';
        const bar = (function() { console.log(foo); });
        console.log(bar());
        `
      );
      if (desc) {
        assert.equal(desc.declarations.size, 2);
        let foo = desc.declarations.get("foo");
        assert.equal(foo?.declaration.declaredName, "foo");
        assert.equal(foo?.declaration.type, "import");
        if (foo?.declaration.type === "import") {
          assert.equal(foo.declaration.importIndex, 0);
          assert.equal(foo.declaration.importedName, "default");
        }

        assert.equal(desc.imports.length, 1);
        let [defaultImport] = desc.imports;

        assert.equal(defaultImport.isDynamic, false);
        if (!defaultImport.isDynamic) {
          assert.equal(defaultImport.specifier, "./b.js");
          assert.equal(defaultImport.isReexport, false);
          assert.equal(desc.regions[defaultImport.region].type, "import");
          let importRegion = desc.regions[defaultImport.region];
          if (importRegion.type === "import") {
            assert.equal(importRegion.importIndex, 0);
          }
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          import { default as renamedFoo } from './b.js';
          const renamedBar = (function() { console.log(renamedFoo); });
          console.log(renamedBar());
          `
        );
      }
    });

    test("bundle contains module description with named import of external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import { bar } from './a.js';
          console.log(bar());
        `,
        "a.js": `
          import { foo, fleep } from './b.js';
          export function bar() { console.log(foo() + fleep()); }
        `,
        "b.js": `
          export function foo() { console.log('foo') }
          export function fleep() { console.log('fleep') }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        import { foo, fleep } from './b.js';
        function bar() { console.log(foo() + fleep()); }
        console.log(bar());
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 3);
        let foo = desc.declarations.get("foo");
        assert.equal(foo?.declaration.declaredName, "foo");
        assert.equal(foo?.declaration.type, "import");
        if (foo?.declaration.type === "import") {
          assert.equal(foo.declaration.importIndex, 0);
          assert.equal(foo.declaration.importedName, "foo");
        }
        let fleep = desc.declarations.get("fleep");
        assert.equal(fleep?.declaration.declaredName, "fleep");
        assert.equal(fleep?.declaration.type, "import");
        if (fleep?.declaration.type === "import") {
          assert.equal(fleep.declaration.importIndex, 0);
          assert.equal(fleep.declaration.importedName, "fleep");
        }

        assert.equal(desc.imports.length, 1);
        let [defaultImport] = desc.imports;

        assert.equal(defaultImport.isDynamic, false);
        if (!defaultImport.isDynamic) {
          assert.equal(defaultImport.specifier, "./b.js");
          assert.equal(defaultImport.isReexport, false);
          assert.equal(desc.regions[defaultImport.region].type, "import");
          let importRegion = desc.regions[defaultImport.region];
          if (importRegion.type === "import") {
            assert.equal(importRegion.importIndex, 0);
          }
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("fleep", "renamedFleep");
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          import { foo as renamedFoo, fleep as renamedFleep } from './b.js';
          function renamedBar() { console.log(renamedFoo() + renamedFleep()); }
          console.log(renamedBar());
          `
        );
      }
    });

    test("bundle contains module description with reassigned named import of external bundles", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "b.js"] }`,
        "index.js": `
          import { b as bar } from './a.js';
          console.log(bar());
        `,
        "a.js": `
          import { f1 as foo, f2 as fleep } from './b.js';
          export function b() { console.log(foo() + fleep()); }
        `,
        "b.js": `
          export function f1() { console.log('foo') }
          export function f2() { console.log('fleep') }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        import { f1 as foo, f2 as fleep } from './b.js';
        function bar() { console.log(foo() + fleep()); }
        console.log(bar());
        `
      );

      if (desc) {
        assert.equal(desc.declarations.size, 3);
        let foo = desc.declarations.get("foo");
        assert.equal(foo?.declaration.declaredName, "foo");
        assert.equal(foo?.declaration.type, "import");
        if (foo?.declaration.type === "import") {
          assert.equal(foo.declaration.importIndex, 0);
          assert.equal(foo.declaration.importedName, "f1");
        }
        let fleep = desc.declarations.get("fleep");
        assert.equal(fleep?.declaration.declaredName, "fleep");
        assert.equal(fleep?.declaration.type, "import");
        if (fleep?.declaration.type === "import") {
          assert.equal(fleep.declaration.importIndex, 0);
          assert.equal(fleep.declaration.importedName, "f2");
        }

        assert.equal(desc.imports.length, 1);
        let [defaultImport] = desc.imports;

        assert.equal(defaultImport.isDynamic, false);
        if (!defaultImport.isDynamic) {
          assert.equal(defaultImport.specifier, "./b.js");
          assert.equal(defaultImport.isReexport, false);
          assert.equal(desc.regions[defaultImport.region].type, "import");
          let importRegion = desc.regions[defaultImport.region];
          if (importRegion.type === "import") {
            assert.equal(importRegion.importIndex, 0);
          }
        }

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("foo", "renamedFoo");
        editor.rename("fleep", "renamedFleep");
        editor.rename("bar", "renamedBar");
        assert.codeEqual(
          editor.serialize().code,
          `
          import { f1 as renamedFoo, f2 as renamedFleep } from './b.js';
          function renamedBar() { console.log(renamedFoo() + renamedFleep()); }
          console.log(renamedBar());
          `
        );
      }
    });

    test("bundle contains module description with async import of external bundle", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import { bar } from "./a.js";
          async function getFoo() {
            const { foo } = await import("./foo.js");
            const { bleep } = await import("./bleep.js");
            return foo + bar + bleep;
          }
          export { getFoo };
        `,
        "a.js": `
          export const bar = 'bar';
        `,
        "foo.js": `
          export function foo() { return 'foo'; }
        `,
        "bleep.js": `
          export function bleep() { return 'bleep'; }
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const bar = 'bar';
        async function getFoo() {
          const { foo } = await import("./dist/0.js");
          const { bleep } = await import("./dist/1.js");
          return foo + bar + bleep;
        }
        export { getFoo };
        `
      );
      if (desc) {
        // only module scoped bindings are in included in our declarations,
        // since foo is not module scoped, it is not included.
        assert.equal(desc.declarations.size, 2);
        assert.ok(desc.declarations.get("bar"), "declaration exists");

        assert.equal(desc.imports.length, 2);
        let [dynamicImportFoo, dynamicImportBleep] = desc.imports;
        assert.equal(dynamicImportFoo.isDynamic, true);
        assert.equal(dynamicImportBleep.isDynamic, true);
        if (dynamicImportFoo.isDynamic && dynamicImportBleep.isDynamic) {
          assert.equal(dynamicImportFoo.specifier, "./dist/0.js");
          assert.equal(dynamicImportBleep.specifier, "./dist/1.js");

          let editor = makeEditor(source, desc);
          keepAll(desc, editor);
          editor.rename("bar", "renamedBar");
          editor.rename("getFoo", "renamedGetFoo");
          editor.replace(
            dynamicImportFoo.specifierRegion,
            '"./replacedFoo.js"'
          );
          editor.replace(
            dynamicImportBleep.specifierRegion,
            '"./replacedBleep.js"'
          );
          let {
            code: updatedCode,
            regions: updatedRegions,
          } = editor.serialize();
          assert.codeEqual(
            updatedCode,
            `
            const renamedBar = 'bar';
            async function renamedGetFoo() {
              const { foo } = await import("./replacedFoo.js");
              const { bleep } = await import("./replacedBleep.js");
              return foo + renamedBar + bleep;
            }
            export { renamedGetFoo as getFoo };
            `
          );

          let updatedImport = updatedRegions.find(
            (r) =>
              r.type === "import" &&
              r.specifierForDynamicImport === "./replacedFoo.js"
          );
          assert.ok(
            updatedImport,
            "the import region's specifier property was updated"
          );
        }
      }
    });

    test("bundle contains an empty module", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js", "a.js"] }`,
        "index.js": `
          import './a.js';
          console.log('hi');
        `,
        "a.js": `
          export {};
        `,
      });
      let { source, desc } = await bundle(assert.fs, url("output/a.js"));
      assert.codeEqual(source, `export {};`);
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 0);
        assert.equal(desc.regions.length, 1);
        assert.equal(desc.exports.size, 0);
        assert.equal(desc.imports.length, 0);

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        assert.codeEqual(editor.serialize().code, `export {};`);
      }
    });

    test("optimizes default exports of variable declarations", async function (assert) {
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["index.js"] }`,
        "index.js": `
          import alpha from "./a.js";
          console.log(alpha);
        `,
        "a.js": `
          const a = 'a';
          export default a;
        `,
      });
      let { source, desc } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const alpha = 'a';
        console.log(alpha);
        export {};
        `
      );
      assert.ok(desc, "bundle description exists");
      if (desc) {
        assert.equal(desc.declarations.size, 1);
        let alpha = desc.declarations.get("alpha")!;
        assert.equal(alpha.declaration.declaredName, "alpha");
        assert.equal(alpha.declaration.type, "local");

        let editor = makeEditor(source, desc);
        keepAll(desc, editor);
        editor.rename("alpha", "renamedA");
        assert.codeEqual(
          editor.serialize().code,
          `
          const renamedA = 'a';
          console.log(renamedA);
          export {};
          `
        );
      }
    });

    QUnit.module("pkg consumption", function (_hooks) {
      let { test, hooks } = installFileAssertions(_hooks);

      let puppiesBundle1Href = `https://catalogjs.com/pkgs/npm/puppies/7.9.4/SlH+urkVTSWK+5-BU47+UKzCFKI=`;
      let puppiesBundle2Href = `https://catalogjs.com/pkgs/npm/puppies/7.9.2/ZlH+lolVTSWK+5-BU47+UKzCFKI=`;
      let puppiesBundle3Href = `https://catalogjs.com/pkgs/npm/puppies/7.9.5/YlH+lolVTSWK+5-BU47+UKzCFKI=`;
      let puppiesBundle4Href = `https://catalogjs.com/pkgs/npm/puppies/7.9.6/BlH+lolVTSWK+5-BU47+UKzCFKI=`;
      let puppiesBundle5Href = `https://catalogjs.com/pkgs/npm/puppies/7.9.7/AlH+lolVTSWK+5-BU47+UKzCFKI=`;

      hooks.beforeEach(async (assert) => {
        await assert.setupFiles({
          [`${puppiesBundle1Href}/entrypoints.json`]: `{"js": ["index.js"] }`,
          [`${puppiesBundle1Href}/index.js`]: `export const puppies = ["mango", "van gogh"];`,
          [`${puppiesBundle1Href}/toys.js`]: `export const toys = ["poopkin pie", "turkey hat"];`,

          [`${puppiesBundle2Href}/entrypoints.json`]: `{"js": ["index.js"] }`,
          [`${puppiesBundle2Href}/index.js`]: `export const puppies = ["mango", "van gogh"];`,
          [`${puppiesBundle2Href}/toys.js`]: `export const toys = ["poopkin pie", "turkey hat"];`,

          [`${puppiesBundle3Href}/entrypoints.json`]: `{"js": ["index.js"] }`,
          [`${puppiesBundle3Href}/index.js`]: `
            console.log('side effect 1');
            console.log('side effect 2');
            export const puppies = ["mango", "van gogh"];
          `,

          [`${puppiesBundle4Href}/entrypoints.json`]: `{"js": ["index.js"] }`,
          [`${puppiesBundle4Href}/index.js`]: `
            console.log('side effect 1a');
            console.log('side effect 2a');
            export const puppies = ["mango", "van gogh"];
            console.log('side effect 3');
          `,

          [`${puppiesBundle5Href}/entrypoints.json`]: `{"js": ["index.js"] }`,
          [`${puppiesBundle5Href}/index.js`]: `export const puppies = ["mango", "van gogh"];`,
        });
      });

      test("module descriptions include 'original' property for declarations from external imports that reflect the consumed semver range", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          // TODO need to think about how this lock file was created in the first
          // place. For node builds, we already just reflect the version of the
          // package that was actually consumed. But for catalogjs builds we'll
          // need to "query" our CDN to find the latest package that matches the
          // semver range. Perhaps a simple index file that lists out all the
          // versions available for each package at the root of the package URL
          // would suffice until we have an actual server that we can talk to.
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let { source, desc } = await bundle(assert.fs);
        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }
          export { getPuppies, getCats, getRats };
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.0");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }

        let getPuppies = desc!.declarations.get("getPuppies");
        assert.equal(getPuppies?.declaration.type, "local");
        if (getPuppies?.declaration.type === "local") {
          assert.notOk(
            getPuppies?.declaration.original,
            'declaration has no "original" property'
          );
        }
      });

      test("the module description for a bundle has an original property for an import via an internal reexport from a dependency", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`,
          "index.js": `
            import { doggies } from "./a.js";
            function getPuppies() { return doggies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
          "a.js": `
            export { puppies as doggies } from "puppies";
          `,
        });
        let { source, desc } = await bundle(assert.fs);
        assert.codeEqual(
          source,
          `
          const doggies = ["mango", "van gogh"];
          function getPuppies() { return doggies; }
          function getCats() { return ["jojo"]; }
          function getRats() { return ["pizza rat"]; }
          export { getPuppies, getCats, getRats };
          `
        );

        let doggies = desc!.declarations.get("doggies");
        assert.equal(doggies?.declaration.type, "local");
        if (doggies?.declaration.type === "local") {
          assert.equal(
            doggies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(doggies.declaration.original?.range, "^7.9.0");
          assert.equal(doggies.declaration.original?.importedAs, "puppies");
        }
      });

      test("the module descriptions for a bundle that have an 'original' property are carried forward in subsequent builds that include that bundle", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundleSrc = await bundleSource(assert.fs);
        let libBundleHref =
          "https://catalogjs.com/pkgs/npm/lib/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib": {
                "type": "npm",
                "pkgName": "lib",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "lib": "${libBundleHref}/lib.js" }`, // ver 7.9.2
          "driver.js": `
            import { getPuppies } from "lib";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies()]);
          `,
          [`${libBundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${libBundleHref}/lib.js`]: bundleSrc,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies()]);
          export {};
          `
        );
        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.0");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
        let getPuppies = desc!.declarations.get("getPuppies");
        assert.equal(getPuppies?.declaration.type, "local");
        if (getPuppies?.declaration.type === "local") {
          assert.equal(
            getPuppies.declaration.original?.bundleHref,
            `${libBundleHref}/lib.js`
          );
          assert.equal(getPuppies.declaration.original?.range, "^1.0.0");
          assert.equal(
            getPuppies.declaration.original?.importedAs,
            "getPuppies"
          );
        }

        let jojo = desc!.declarations.get("jojo");
        assert.equal(jojo?.declaration.type, "local");
        if (jojo?.declaration.type === "local") {
          assert.notOk(
            jojo?.declaration.original,
            'declaration has no "original" property'
          );
        }
      });

      test("can collapse consumed dependencies from same package when they have overlapping consumed semver ranges", async function (assert) {
        // this pkg version is satisfied by both consumption ranges (so we choose it)
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        // this pkg version is satisfied by just 1 consumption range
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`, // ver 7.9.2
          "index.js": `
            import { puppies } from "puppies";
            function myPuppies() { return puppies; }
            export { myPuppies };
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { myPuppies } from "lib2";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          function myPuppies() { return puppies; }
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            // we chose the bundle whose version satisfies the most consumption ranges
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          // the combined consumption range then represents the intersection of
          // all the collapsed consumption ranges
          assert.equal(puppies.declaration.original?.range, "^7.9.3");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("order of consumption does not change the package version that is selected when we collapse overlapping packages", async function (assert) {
        // this pkg version is satisfied by both consumption ranges (so we choose it)
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        // this pkg version is satisfied by just 1 consumption range
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`, // ver 7.9.2
          "index.js": `
            import { puppies } from "puppies";
            function myPuppies() { return puppies; }
            export { myPuppies };
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js"
          }`,
          // we import myPuppies() before getPuppies(), which is transposed from the previous test
          "driver.js": `
            import { myPuppies } from "lib2";
            import { getPuppies } from "lib1";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies()]);
            `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function myPuppies() { return puppies; }
          function getPuppies() { return puppies; }
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.3");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("when there is a tie when determining the pkg version that maximizes reuse, we choose the latest version", async function (assert) {
        // this pkg version is satisfied by both consumption ranges
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        // this pkg version is satisfied by both consumption ranges
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle5Href}/index.js" }`, // ver 7.9.7
          "index.js": `
            import { puppies } from "puppies";
            function myPuppies() { return puppies; }
            export { myPuppies };
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { myPuppies } from "lib2";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          function myPuppies() { return puppies; }
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle5Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.2");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("use collapsed consumed deps in namespace import", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`,
          "index.js": `
            import * as pets from "puppies";
            export function getPuppies() { return pets.puppies; }
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            export function myPuppies() { return puppies; }
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { myPuppies } from "lib2";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies()]);
            `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          const pets = { puppies };
          function getPuppies() { return pets.puppies; }
          function myPuppies() { return puppies; }
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies()]);
          export {};
          `
        );
        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.2");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("use collapsed consumed deps in namespace import of direct dependency", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            export function getPuppies() { return puppies; }
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle1Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import * as pets from "puppies";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), pets.puppies]);
            `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          const pets = { puppies };
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), pets.puppies]);
          export {};
          `
        );
        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.2");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("use collapsed namespace object", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`,
          "index.js": `
            import * as babies from "puppies";
            export function getPuppies() { return babies.puppies; }
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`,
          "index.js": `
            import * as pets from "puppies";
            export function myPuppies() { return pets.puppies; }
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { myPuppies } from "lib2";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies()]);
            `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          const pets = { puppies };
          function getPuppies() { return pets.puppies; }
          function myPuppies() { return pets.puppies; }
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies()]);
          export {};
          `
        );
        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.2");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("collapsed a built namespace object and replace with namespace import of direct dependency", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`,
          "index.js": `
            import * as babies from "puppies";
            export function getPuppies() { return babies.puppies; }
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle1Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import * as pets from "puppies";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), pets.puppies]);
            `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          const pets = { puppies };
          function getPuppies() { return pets.puppies; }
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), pets.puppies]);
          export {};
          `
        );
        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.2");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("collapsed a namespace import of direct dependency and replace with an already manufactured namespace object in a consumed bundle", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`,
          "index.js": `
            import * as babies from "puppies";
            export function getPuppies() { return babies.puppies; }
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle2Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import * as pets from "puppies";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), pets.puppies]);
            `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          const pets = { puppies };
          function getPuppies() { return pets.puppies; }
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), pets.puppies]);
          export {};
          `
        );
        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.2");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("chooses among identical pkg versions when collapsing consumed pkgs", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            export function getPuppies() { return puppies; }
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            function myPuppies() { return puppies; }
            export { myPuppies };
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { myPuppies } from "lib2";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          function myPuppies() { return puppies; }
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.2");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("when collapsing packages with overlapping semver ranges, the side effects are collapsed as well", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.0"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle3Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            export function getPuppies() { return puppies; }
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle4Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            function myPuppies() { return puppies; }
            export { myPuppies };
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { myPuppies } from "lib2";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          console.log('side effect 1a');
          console.log('side effect 2a');
          const puppies = ["mango", "van gogh"];
          console.log('side effect 3');
          function getPuppies() { return puppies; }
          function myPuppies() { return puppies; }
          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle4Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.2");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }

        let sideEffectRegions = desc?.regions.filter((r) => r.original);
        assert.equal(
          sideEffectRegions?.every(
            (r) => r.original?.bundleHref === `${puppiesBundle4Href}/index.js`
          ),
          true,
          "the side effect bundleHrefs are correct"
        );
        assert.equal(
          sideEffectRegions?.every((r) => r.original?.range === "^7.9.2"),
          true,
          "the side effect ranges is correct"
        );
      });

      test("does not collapse otherwise overlapping consumed semver ranges if needed bindings have been pruned out of the bundle", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{
            "puppies": "${puppiesBundle2Href}/index.js",
            "puppies/toys": "${puppiesBundle2Href}/toys.js"
          }`, // ver 7.9.2
          // this bundle needs "puppies", which is not available in the other bundle for this pkg
          "index.js": `
            import { puppies } from "puppies";
            import { toys } from "puppies/toys";
            function getPuppies() { return puppies; }
            function getToys() { return toys; }
            export { getPuppies, getToys };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          // puppies dep is ver 7.9.4 and is satisfied by both consumption
          // ranges (so we choose it)
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies/toys": "${puppiesBundle1Href}/toys.js"
          }`,
          "driver.js": `
            import { getToys } from "lib1";
            import { toys } from "puppies/toys";
            console.log([...toys, ...getToys()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const toys0 = ["poopkin pie", "turkey hat"];
          function getToys() { return toys0; }
          const toys = ["poopkin pie", "turkey hat"];
          console.log([...toys, ...getToys()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("toys");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/toys.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.3");
          assert.equal(puppies.declaration.original?.importedAs, "toys");
        }
      });

      test("can prevent collision of consumed dependencies from same package when they have non-overlapping consumed semver ranges", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "7.9.4"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            function myPuppies() { return puppies; }
            export { myPuppies };
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { myPuppies } from "lib2";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies0 = ["mango", "van gogh"];
          function getPuppies() { return puppies0; }

          const puppies = ["mango", "van gogh"];
          function myPuppies() { return puppies; }

          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies()]);
          export {};
          `
        );

        let puppies0 = desc!.declarations.get("puppies0");
        assert.equal(puppies0?.declaration.type, "local");
        if (puppies0?.declaration.type === "local") {
          assert.equal(
            puppies0.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies0.declaration.original?.range, "7.9.4");
          assert.equal(puppies0.declaration.original?.importedAs, "puppies");
        }

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle2Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "7.9.2");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("when preventing collisions of non-overlapping consumed semver ranges of the same package, the side effects for each semver range are preserved", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "7.9.5"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle3Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            export function getPuppies() { return puppies; }
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "7.9.6"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle4Href}/index.js" }`,
          "index.js": `
            import { puppies } from "puppies";
            function myPuppies() { return puppies; }
            export { myPuppies };
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { myPuppies } from "lib2";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          console.log('side effect 1');
          console.log('side effect 2');
          const puppies0 = ["mango", "van gogh"];
          function getPuppies() { return puppies0; }

          console.log('side effect 1a');
          console.log('side effect 2a');
          const puppies = ["mango", "van gogh"];
          console.log('side effect 3');
          function myPuppies() { return puppies; }

          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies()]);
          export {};
          `
        );

        let puppies0 = desc!.declarations.get("puppies0");
        assert.equal(puppies0?.declaration.type, "local");
        if (puppies0?.declaration.type === "local") {
          assert.equal(
            puppies0.declaration.original?.bundleHref,
            `${puppiesBundle3Href}/index.js`
          );
          assert.equal(puppies0.declaration.original?.range, "7.9.5");
          assert.equal(puppies0.declaration.original?.importedAs, "puppies");
        }

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle4Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "7.9.6");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      // In this type of scenario when the lock file is generated for the
      // project, the lockfile should take into account that the project has a
      // pkg dependency that overlaps with a package consumed by another
      // declared pkg dependency, and set the lockfile to resolve to the same
      // bundleHref that the other pkg consumes. In that case the dep resolver
      // has a much simpler job to do since there is only 1 ver of the dep
      // being used. However, this test will exercise the situation where the
      // versions are actually different--which would mean that the lock file
      // generation process is probably making sub-optimal decisions.
      test("can collapse direct pkg dependency when an overlapping consumed range already exist in an included bundle", async function (assert) {
        // this pkg version is satisfied by both consumption ranges (so we choose it)
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          // puppies dep is ver 7.9.2 and is only satisfied by 1 consumption range
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle2Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { puppies } from "puppies";
            console.log([...puppies, ...getPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          console.log([...puppies, ...getPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            // we chose the bundle whose version satisfies the most consumption ranges
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          // the combined consumption range then represents the intersection of
          // all the collapsed consumption ranges
          assert.equal(puppies.declaration.original?.range, "^7.9.3");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("can collapse a consumed range in an included bundle when an overlapping direct dependency exists", async function (assert) {
        // puppies dep is ver 7.9.2 and is only satisfied by 1 consumption range
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`, // ver 7.9.2
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          // puppies dep is ver 7.9.4 and is satisfied by both consumption ranges (so we choose it)
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle1Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { puppies } from "puppies";
            console.log([...puppies, ...getPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          console.log([...puppies, ...getPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.3");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("can collapse a direct dependency with a bundle binding when direct dep is consumed via a reexport", async function (assert) {
        // this pkg version is satisfied by both consumption ranges (so we choose it)
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          // puppies dep is ver 7.9.2 and is only satisfied by 1 consumption range
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle2Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { puppies } from "./a.js";
            console.log([...puppies, ...getPuppies()]);
          `,
          "a.js": `
            export { puppies } from "puppies";
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          console.log([...puppies, ...getPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            // we chose the bundle whose version satisfies the most consumption ranges
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          // the combined consumption range then represents the intersection of
          // all the collapsed consumption ranges
          assert.equal(puppies.declaration.original?.range, "^7.9.3");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("can collapse a bundle binding with a direct dependency when direct dep is consumed via a reexport", async function (assert) {
        // puppies dep is ver 7.9.2 and is only satisfied by 1 consumption range
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`, // ver 7.9.2
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          // puppies dep is ver 7.9.4 and is satisfied by both consumption ranges (so we choose it)
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle1Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { puppies } from "./a.js";
            console.log([...puppies, ...getPuppies()]);
          `,
          "a.js": `
            export { puppies } from "puppies";
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          console.log([...puppies, ...getPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.3");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("can collapse a consumed range in an included bundle when an overlapping direct dependency of namespace import exists", async function (assert) {
        // puppies dep is ver 7.9.2 and is only satisfied by 1 consumption range
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`, // ver 7.9.2
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          // puppies dep is ver 7.9.4 and is satisfied by both consumption ranges (so we choose it)
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle1Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import * as p from "puppies";
            console.log([...p, ...getPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          const p = { puppies };
          console.log([...p, ...getPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.3");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("will throw when there is a direct dependency that is shadowing another dependency's consumption range", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle1Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { puppies } from "puppies";
            console.log([...puppies, ...getPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        try {
          await bundle(assert.fs, url("output/driver.js"));
          throw new Error(`should not have been able to build`);
        } catch (e) {
          assert.ok(
            e.message.match(
              /Are you missing a dependency for 'puppies' in your entrypoints\.json file/
            ),
            "error was thrown"
          );
        }
      });

      test("can collapse direct pkg dependency when a non-primary bundle from the same package is included in the project with an overlapping range", async function (assert) {
        // puppies dep is ver 7.9.2 and is only satisfied by 1 consumption range
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{
            "puppies/toys": "${puppiesBundle2Href}/toys.js"
          }`, // ver 7.9.2
          "index.js": `
            import { toys } from "puppies/toys";
            function getToys() { return toys; }
            export { getToys };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          // puppies dep is ver 7.9.4 and is satisfied by both consumption
          // ranges (so we choose it)
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies/toys": "${puppiesBundle1Href}/toys.js"
          }`,
          "driver.js": `
            import { getToys } from "lib1";
            import { toys } from "puppies/toys";
            console.log([...toys, ...getToys()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const toys = ["poopkin pie", "turkey hat"];
          function getToys() { return toys; }
          console.log([...toys, ...getToys()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("toys");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/toys.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.3");
          assert.equal(puppies.declaration.original?.importedAs, "toys");
        }
      });

      test("prevents collision when a bundle consumes a pkg that is also a direct dependency of the project, and they do not have overlapping consumption ranges", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "7.9.4"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "7.9.2"
              }
            }
          }`,
          // puppies dep is ver 7.9.2
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle2Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { puppies } from "puppies";
            console.log([...puppies, ...getPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies0 = ["mango", "van gogh"];
          function getPuppies() { return puppies0; }
          const puppies = ["mango", "van gogh"];
          console.log([...puppies, ...getPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle2Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "7.9.2");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
        let puppies0 = desc!.declarations.get("puppies0");
        assert.equal(puppies0?.declaration.type, "local");
        if (puppies0?.declaration.type === "local") {
          assert.equal(
            puppies0.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies0.declaration.original?.range, "7.9.4");
          assert.equal(puppies0.declaration.original?.importedAs, "puppies");
        }
      });

      test("chooses the pkg whose version satisfies the most consumption ranges when multiple overlapping possibilities exist", async function (assert) {
        // this package's version is satisfied by 2 consumption ranges
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.4"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            export { getPuppies };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        // this package's version is satisfied by 1 consumption range
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.1"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`, // ver 7.9.2
          "index.js": `
            import { puppies } from "puppies";
            function myPuppies() { return puppies; }
            export { myPuppies };
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        // this package's version is satisfied by all the consumption ranges
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.6"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle5Href}/index.js" }`, // ver 7.9.7
          "index.js": `
            import { puppies } from "puppies";
            function cutestPuppies() { return puppies; }
            export { cutestPuppies };
          `,
        });
        let bundle3Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib3BundleHref =
          "https://catalogjs.com/pkgs/npm/lib3/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              },
              "lib3": {
                "type": "npm",
                "pkgName": "lib3",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js",
            "lib3": "${lib3BundleHref}/lib.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { myPuppies } from "lib2";
            import { cutestPuppies } from "lib3";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies(), ...cutestPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
          [`${lib3BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib3BundleHref}/lib.js`]: bundle3Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          function myPuppies() { return puppies; }
          function cutestPuppies() { return puppies; }

          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies(), ...cutestPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle5Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.6");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }
      });

      test("prevents collision when some but not all of versions the same package have overlapping consumption ranges", async function (assert) {
        // this package's version is satisfied by 1 consumption range
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.4"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            export { getPuppies };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);

        // this package's version is satisfied by 1 consumption range
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "7.9.1 - 7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`, // ver 7.9.2
          "index.js": `
            import { puppies } from "puppies";
            function myPuppies() { return puppies; }
            export { myPuppies };
          `,
        });
        let bundle2Src = await bundleSource(assert.fs);

        // this package's version is satisfied by 2 consumption ranges (^7.9.4 and its own)
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.6"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle5Href}/index.js" }`, // ver 7.9.7
          "index.js": `
            import { puppies } from "puppies";
            function cutestPuppies() { return puppies; }
            export { cutestPuppies };
          `,
        });
        let bundle3Src = await bundleSource(assert.fs);

        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib2BundleHref =
          "https://catalogjs.com/pkgs/npm/lib2/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        let lib3BundleHref =
          "https://catalogjs.com/pkgs/npm/lib3/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "lib2": {
                "type": "npm",
                "pkgName": "lib2",
                "range": "^1.0.0"
              },
              "lib3": {
                "type": "npm",
                "pkgName": "lib3",
                "range": "^1.0.0"
              }
            }
          }`,
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "lib2": "${lib2BundleHref}/lib.js",
            "lib3": "${lib3BundleHref}/lib.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { myPuppies } from "lib2";
            import { cutestPuppies } from "lib3";
            let jojo = 'Jojo';
            console.log([jojo, ...getPuppies(), ...myPuppies(), ...cutestPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
          [`${lib2BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib2BundleHref}/lib.js`]: bundle2Src,
          [`${lib3BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib3BundleHref}/lib.js`]: bundle3Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies0 = ["mango", "van gogh"];
          function myPuppies() { return puppies0; }

          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }

          function cutestPuppies() { return puppies; }

          let jojo = 'Jojo';
          console.log([jojo, ...getPuppies(), ...myPuppies(), ...cutestPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle5Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.6");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }

        let puppies0 = desc!.declarations.get("puppies0");
        assert.equal(puppies0?.declaration.type, "local");
        if (puppies0?.declaration.type === "local") {
          assert.equal(
            puppies0.declaration.original?.bundleHref,
            `${puppiesBundle2Href}/index.js`
          );
          assert.equal(puppies0.declaration.original?.range, "7.9.1 - 7.9.2");
          assert.equal(puppies0.declaration.original?.importedAs, "puppies");
        }
      });

      // npm allows a lot of things besides semver ranges on the right hand side
      // of the dependency name. If we see a non-semver range, we'll just treat
      // it as a range that can't satisfy any semver.
      test("can handle non-range strings in an npm pkg dependency (aka SHA, URLs, tag, branch, etc)", async function (assert) {
        // puppies dep is ver 7.9.2
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "https://github.com/cardstack/cardstack.git#master"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`, // ver 7.9.2
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          // puppies dep is ver 7.9.4
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle1Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { puppies } from "puppies";
            console.log([...puppies, ...getPuppies()]);
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies0 = ["mango", "van gogh"];
          function getPuppies() { return puppies0; }
          const puppies = ["mango", "van gogh"];
          console.log([...puppies, ...getPuppies()]);
          export {};
          `
        );

        let puppies = desc!.declarations.get("puppies");
        assert.equal(puppies?.declaration.type, "local");
        if (puppies?.declaration.type === "local") {
          assert.equal(
            puppies.declaration.original?.bundleHref,
            `${puppiesBundle1Href}/index.js`
          );
          assert.equal(puppies.declaration.original?.range, "^7.9.3");
          assert.equal(puppies.declaration.original?.importedAs, "puppies");
        }

        let puppies0 = desc!.declarations.get("puppies0");
        assert.equal(puppies0?.declaration.type, "local");
        if (puppies0?.declaration.type === "local") {
          assert.equal(
            puppies0.declaration.original?.bundleHref,
            `${puppiesBundle2Href}/index.js`
          );
          assert.equal(
            puppies0.declaration.original?.range,
            "https://github.com/cardstack/cardstack.git#master"
          );
          assert.equal(puppies0.declaration.original?.importedAs, "puppies");
        }
      });

      test("bundle exports binding from pkg dependency that was collapsed", async function (assert) {
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle1Href}/index.js" }`, // ver 7.9.4
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          // puppies dep is ver 7.9.2 and is only satisfied by 1 consumption range
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle2Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { puppies } from "puppies";
            console.log([...puppies, ...getPuppies()]);
            export { puppies };
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          console.log([...puppies, ...getPuppies()]);
          export { puppies };
          `
        );

        if (desc) {
          let puppies = desc.declarations.get("puppies");
          assert.equal(puppies?.declaration.type, "local");
          if (puppies?.declaration.type === "local") {
            assert.equal(
              puppies.declaration.original?.bundleHref,
              `${puppiesBundle1Href}/index.js`
            );
            assert.equal(puppies.declaration.original?.range, "^7.9.3");
            assert.equal(puppies.declaration.original?.importedAs, "puppies");
          }

          assert.equal(desc?.exports.size, 1);
          let puppiesExport = desc.exports.get("puppies")!;
          assert.equal(puppiesExport.type, "local");
          if (puppiesExport.type === "local") {
            assert.equal(puppiesExport.name, "puppies");
            assert.ok(
              puppiesExport.exportRegion != null,
              "export desc contains region"
            );
          }

          let editor = makeEditor(source, desc);
          keepAll(desc, editor);
          editor.rename("puppies", "renamedPuppies");
          editor.rename("getPuppies", "renamedGetPuppies");
          assert.codeEqual(
            editor.serialize().code,
            `
            const renamedPuppies = ["mango", "van gogh"];
            function renamedGetPuppies() { return renamedPuppies; }
            console.log([...renamedPuppies, ...renamedGetPuppies()]);
            export { renamedPuppies as puppies };
            `
          );
        }
      });

      test("bundle exports binding from pkg dependency that collapses an overlapping range in an included bundle", async function (assert) {
        // inverse of the test above
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["index.js"],
            "dependencies": {
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.2"
              }
            }
          }`,
          "catalogjs.lock": `{ "puppies": "${puppiesBundle2Href}/index.js" }`, // ver 7.9.2
          "index.js": `
            import { puppies } from "puppies";
            function getPuppies() { return puppies; }
            function getCats() { return ["jojo"]; }
            function getRats() { return ["pizza rat"]; }
            export { getPuppies, getCats, getRats };
          `,
        });
        let bundle1Src = await bundleSource(assert.fs);
        let lib1BundleHref =
          "https://catalogjs.com/pkgs/npm/lib1/1.0.0/SlH+urkVTSWK+5-BU47+UKzCFKI=";
        await assert.setupFiles({
          "entrypoints.json": `{
            "js": ["driver.js"],
            "dependencies": {
              "lib1": {
                "type": "npm",
                "pkgName": "lib1",
                "range": "^1.0.0"
              },
              "puppies": {
                "type": "npm",
                "pkgName": "puppies",
                "range": "^7.9.3"
              }
            }
          }`,
          // puppies dep is ver 7.9.4
          "catalogjs.lock": `{
            "lib1": "${lib1BundleHref}/lib.js",
            "puppies": "${puppiesBundle1Href}/index.js"
          }`,
          "driver.js": `
            import { getPuppies } from "lib1";
            import { puppies } from "puppies";
            console.log([...puppies, ...getPuppies()]);
            export { puppies };
          `,
          [`${lib1BundleHref}/entrypoints.json`]: `{"js": ["lib.js"] }`,
          [`${lib1BundleHref}/lib.js`]: bundle1Src,
        });
        let { source, desc } = await bundle(assert.fs, url("output/driver.js"));

        assert.codeEqual(
          source,
          `
          const puppies = ["mango", "van gogh"];
          function getPuppies() { return puppies; }
          console.log([...puppies, ...getPuppies()]);
          export { puppies };
          `
        );

        if (desc) {
          let puppies = desc.declarations.get("puppies");
          assert.equal(puppies?.declaration.type, "local");
          if (puppies?.declaration.type === "local") {
            assert.equal(
              puppies.declaration.original?.bundleHref,
              `${puppiesBundle1Href}/index.js`
            );
            assert.equal(puppies.declaration.original?.range, "^7.9.3");
            assert.equal(puppies.declaration.original?.importedAs, "puppies");
          }

          assert.equal(desc?.exports.size, 1);
          let puppiesExport = desc.exports.get("puppies")!;
          assert.equal(puppiesExport.type, "local");
          if (puppiesExport.type === "local") {
            assert.equal(puppiesExport.name, "puppies");
            assert.ok(
              puppiesExport.exportRegion != null,
              "export desc contains region"
            );
          }

          let editor = makeEditor(source, desc);
          keepAll(desc, editor);
          editor.rename("puppies", "renamedPuppies");
          editor.rename("getPuppies", "renamedGetPuppies");
          assert.codeEqual(
            editor.serialize().code,
            `
            const renamedPuppies = ["mango", "van gogh"];
            function renamedGetPuppies() { return renamedPuppies; }
            console.log([...renamedPuppies, ...renamedGetPuppies()]);
            export { renamedPuppies as puppies };
            `
          );
        }
      });
    });
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
      await assert.setupFiles({
        "entrypoints.json": `{ "js": ["toPairs.js"] }`,
        "toPairs.js": `
          export * from "./internal.js";
        `,
        "internal.js": `
          export function toPairs() { console.log("toPairs"); }
        `,
      });
      let bundleSrc = await bundleCode(assert.fs, url("output/toPairs.js"));

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
          /const _default = \(function\(\) { console\.log\("toPairs"\); }\);/
        );
      await assert
        .file("output/toPairs.js")
        .matches(/export { _default as toPairs };/);
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
      let { source } = await bundle(assert.fs);
      assert.codeEqual(
        source,
        `
        const vanGogh = \"Van Gogh\";
        const mango = \"Mango\";
        const puppies = { vanGogh, mango };
        export { puppies };
        `
      );
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
        .matches(
          /import { goodbye } from "\.\/lib\.js";[ \n]+import \* as lib from "\.\/lib\.js";/
        );
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

    test("performs parse if annotation does not exist in bundle", async function (assert) {
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
      let bundleSrc = await bundleCode(assert.fs); // this helpers strips annotation

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
      let bundleSrc = await bundleSource(assert.fs);

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

      assert.ok(
        builder.explain().get(`module-description:${url("driver.js")}`)
      );
    });

    test("uses bundle annotation to tree shake unused exports from bundle", async function (assert) {
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
      let bundleSrc = await bundleSource(assert.fs);

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
        "entrypoints.json": `{
          "js": ["index.js"],
          "dependencies": {
            "a": {
              "type": "npm",
              "pkgName": "a",
              "range": "7.9.4"
            }
          }
        }`,
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
        "entrypoints.json": `{
          "js": ["index.js"],
          "dependencies": {
            "@mango/a": {
              "type": "npm",
              "pkgName": "a",
              "range": "7.9.4"
            }
          }
        }`,
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
        "entrypoints.json": `{
          "js": ["index.js"],
          "dependencies": {
            "a": {
              "type": "npm",
              "pkgName": "a",
              "range": "7.9.4"
            }
          }
        }`,
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
