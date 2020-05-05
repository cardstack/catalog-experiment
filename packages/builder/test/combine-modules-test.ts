import { installFileAssertions } from "./helpers/file-assertions";
import { combineModules } from "../src/combine-modules";
import { Resolver, ModuleResolution } from "../src/nodes/resolution";
import { BundleAssignments } from "../src/nodes/bundle";
import { describeModule, NamespaceMarker } from "../src/describe-module";
import { parse } from "@babel/core";
import { url } from "./helpers/file-assertions";
import { FileSystem } from "../src/filesystem";

let resolver = new Resolver(); // TODO need to resolve modules without '.js' extension

async function makeModuleResolutions(
  fs: FileSystem,
  moduleURL: URL
): Promise<ModuleResolution> {
  let js = await (await fs.open(moduleURL)).readText();
  let parsed = parse(js);
  if (parsed?.type !== "File") {
    throw new Error(`parsed js for ${moduleURL.href} is not a babel File type`);
  }
  let imports: ModuleResolution["imports"] = {};
  let desc = describeModule(parsed);
  let { exports } = desc;
  await Promise.all(
    desc.imports.map(async (imp) => {
      let depURL = await resolver.resolve(imp.specifier, moduleURL);
      imports[imp.specifier] = {
        desc: imp,
        resolution: await makeModuleResolutions(fs, depURL),
      };
    })
  );
  return { url: moduleURL, parsed, imports, exports };
}

async function makeBundleAssignments(
  fs: FileSystem,
  opts?: {
    exports?: {
      [outsideName: string]: { file: string; name: string | NamespaceMarker };
    };
    containsEntrypoint?: string;
  }
): Promise<BundleAssignments> {
  let optsWithDefaults = Object.assign(
    {
      containsEntrypoint: "index.js",
      exports: {},
    },
    opts
  );

  let entryResolution: ModuleResolution | undefined;
  if (optsWithDefaults.containsEntrypoint) {
    entryResolution = await makeModuleResolutions(
      fs,
      url(optsWithDefaults.containsEntrypoint)
    );
  }

  let exportsMap: ReturnType<
    BundleAssignments["exportsFromBundle"]
  > = new Map();
  for (let [outsideName, { file, name }] of Object.entries(
    optsWithDefaults.exports
  )) {
    exportsMap.set(outsideName, {
      name,
      module: await makeModuleResolutions(fs, url(file)),
    });
  }

  let bundles = [url(`dist/0.js`)];

  return {
    bundles,
    bundleForEntrypoint(jsEntry: URL) {
      if (entryResolution && jsEntry.href === entryResolution.url.href) {
        return bundles[0];
      }
      throw new Error(`not a js entrypoint ${jsEntry}`);
    },
    entrypointInBundle(bundle: URL) {
      if (bundle.href === bundles[0].href) {
        return entryResolution;
      }
    },
    exportsFromBundle(bundle: URL) {
      if (bundle.href === bundles[0].href) {
        return exportsMap;
      } else {
        return new Map();
      }
    },
  };
}

QUnit.module("combine modules", function (origHooks) {
  let { test, skip } = installFileAssertions(origHooks);

  test("it can combine modules", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { a } from './a.js';
        import { b } from './b.js';
        console.log(a + b);
      `,
      "a.js": `export const a = 'a';`,
      "b.js": `export const b = 'b';`,
    });

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const a = 'a';
const b = 'b';
console.log(a + b);
    `.trim()
    );
  });

  test("internal imports share the same name in multiple modules", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const hello = 'hello';
const b = hello + '!';
console.log(hello + b);
    `.trim()
    );
  });

  test("internal imports with local renaming share the same name in multiple modules", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const hello = 'hello';
const b = hello + '!';
console.log(hello + b);
    `.trim()
    );
  });

  test("it prevents collisions between module-scoped bindings", async function (assert) {
    await assert.setupFiles({
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
      `,
    });

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
let shared1 = 3;
console.log(shared1);
let shared0 = 2;
console.log(shared0);
let shared = 1;
console.log(shared);
    `.trim()
    );
  });

  test("prevents collisions for renamed import", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const hello = 'hello';
const a = 'a';
const b = hello + '!';
console.log(hello + a + b);
    `.trim()
    );
  });

  test("preserves bundle variable declaration exports", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { a } from './a.js';
        export const b = 'b';
        console.log(a + b);
      `,
      "a.js": `export const a = 'a';`,
    });

    let assignments = await makeBundleAssignments(assert.fs, {
      exports: {
        b: {
          file: "index.js",
          name: "b",
        },
      },
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const a = 'a';
export const b = 'b';
console.log(a + b);
    `.trim()
    );
  });

  test("it prevents collisions with bundle exported variable declarations", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import './a.js';
        function a() { return 1; }
        console.log(a());
      `,
      "a.js": `
        export const a = 'a';
      `,
    });

    let assignments = await makeBundleAssignments(assert.fs, {
      exports: {
        a: {
          file: "a.js",
          name: "a",
        },
      },
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
export const a = 'a';

function a0() {
  return 1;
}

console.log(a0());
    `.trim()
    );
  });

  test("it prevents collisions with bundle exported function declarations", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import './a.js';
        const a = 'a';
        console.log(a());
        `,
      "a.js": `
        export function a() { return 1; }
      `,
    });

    let assignments = await makeBundleAssignments(assert.fs, {
      exports: {
        a: {
          file: "a.js",
          name: "a",
        },
      },
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
export function a() {
  return 1;
}
const a0 = 'a';
console.log(a0());
    `.trim()
    );
  });

  // test("preserves bundle function declaration exports", async function (assert) {});
  // test("preserves bundle export specifers", async function (assert) {});
  // you can riff on this with lvalues and mixed export/non-export variable declarations
  // include a test where the bundle export name from the inside is different from the outside

  test("it prevents collisions with bundle exports regardless of order", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        function a() { return 1; }
        console.log(a());
        import './a.js';
      `,
      "a.js": `
        export const a = 'a';
      `,
    });

    let assignments = await makeBundleAssignments(assert.fs, {
      exports: {
        a: {
          file: "a.js",
          name: "a",
        },
      },
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
export const a = 'a';

function a0() {
  return 1;
}

console.log(a0());
    `.trim()
    );
  });

  test("prevents collisions with bundle variable declaration export", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs, {
      exports: {
        c: {
          file: "index.js",
          name: "c",
        },
      },
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const a = 'a';
const c0 = 'a different c';
console.log(c0);
export const c = 'c';
console.log(a);
    `.trim()
    );
  });

  test("collaspes reexports", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const hello = 'hello';
const hi = 'hi';
console.log(hi + hello);
    `.trim()
    );
  });

  test("prevents collisions with reexports", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const b = 'hello';
const b0 = 1;
console.log(b0);
const hello = 'hi';
console.log(hello + b);
    `.trim()
    );
  });

  test("distinguishes exported names from module-scoped names", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const a = 1;
const b = 'internal';
console.log(a + b);
      `.trim()
    );
  });

  skip("can access namespace of module within bundle", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import * as lib from './lib.js';
        console.log(lib.hello + lib.goodbye);
      `,
      "lib.js": `
        export const hello = 'hello';
        export const goodbye = 'goodbye';
      `,
    });

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const hello = 'hello';
const goodbye = 'goodbye';
const lib = { hello, goodbye };
console.log(lib.hello + lib.goodbye);
      `.trim()
    );
  });

  skip("it can refer to modules in other bundles", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { a } from './a.js';
        console.log(a);
      `,
    });

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.equal(
      combined,
      `
const a = 'a';
const b = 'b';
console.log(a + b);
    `.trim()
    );
  });

  // Test ideas:
  // mulitple named imports: import { a, b, c} from './lib.js'
  // mulitple named exports: export { a, b, c } from './lib.js'
  // import default and variations on that theme
  // import namespace and variations on that theme
});
