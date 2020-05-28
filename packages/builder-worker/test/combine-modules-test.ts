import { installFileAssertions } from "./helpers/file-assertions";
import "./helpers/code-equality-assertions";
import { combineModules } from "../src/combine-modules";
import { Resolver, ModuleResolution } from "../src/nodes/resolution";
import { BundleAssignment, expandAssignments } from "../src/nodes/bundle";
import { describeModule, NamespaceMarker } from "../src/describe-module";
import { parse } from "@babel/core";
import { url } from "./helpers/file-assertions";
import { FileSystem } from "../src/filesystem";
import { FileDescriptor } from "../src/filesystem-drivers/filesystem-driver";

let resolver = new Resolver(); // TODO need to resolve modules without '.js' extension

async function makeModuleResolutions(
  fs: FileSystem,
  moduleURL: URL
): Promise<ModuleResolution> {
  let js = await ((await fs.open(moduleURL)) as FileDescriptor).readText();
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
    assignments?: {
      module: string;
      assignedToBundle: string;
      nameMapping: { [orig: string]: string };
    }[];
  }
): Promise<BundleAssignment[]> {
  let optsWithDefaults = Object.assign(
    {
      containsEntrypoint: "index.js",
      exports: {},
    },
    opts
  );

  // keys are module.url.href
  let assignments: Map<string, BundleAssignment> = new Map();

  if (optsWithDefaults.containsEntrypoint) {
    let module = await makeModuleResolutions(
      fs,
      url(optsWithDefaults.containsEntrypoint)
    );
    assignments.set(module.url.href, {
      bundleURL: url("dist/0.js"),
      module,
      exposedNames: new Map(),
    });
  }

  if (opts?.exports) {
    for (let [outsideName, { file, name }] of Object.entries(
      optsWithDefaults.exports
    )) {
      let fileURL = url(file);
      let assignment = assignments.get(fileURL.href);
      if (!assignment) {
        assignment = {
          bundleURL: url("dist/0.js"),
          module: await makeModuleResolutions(fs, fileURL),
          exposedNames: new Map(),
        };
        assignments.set(assignment.module.url.href, assignment);
      }
      assignment.exposedNames.set(name, outsideName);
    }
  }

  if (opts?.assignments) {
    for (let assignment of opts.assignments) {
      let fileURL = url(assignment.module);
      if (assignments.get(fileURL.href)) {
        throw new Error(
          `invalid test setup, module ${assignment.module} is both inside and outside the default bundle`
        );
      }
      let a = {
        bundleURL: url(assignment.assignedToBundle),
        module: await makeModuleResolutions(fs, fileURL),
        exposedNames: new Map(Object.entries(assignment.nameMapping)),
      };
      assignments.set(a.module.url.href, a);
    }
  }

  expandAssignments(assignments, [...assignments.values()]);
  return [...assignments.values()];
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

    assert.codeEqual(
      combined,
      `
      const a = 'a';
      const b = 'b';
      console.log(a + b);
      `
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

    assert.codeEqual(
      combined,
      `
      const hello = 'hello';
      const b = hello + '!';
      console.log(hello + b);
      `
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

    assert.codeEqual(
      combined,
      `
      const hello = 'hello';
      const b = hello + '!';
      console.log(hello + b);
      `
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

    assert.codeEqual(
      combined,
      `
      let shared1 = 3;
      console.log(shared1);
      let shared0 = 2;
      console.log(shared0);
      let shared = 1;
      console.log(shared);
      `
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

    assert.codeEqual(
      combined,
      `
      const hello = 'hello';
      const a = 'a';
      const b = hello + '!';
      console.log(hello + a + b);
      `
    );
  });

  test("preserves bundle exports", async function (assert) {
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

    assert.codeEqual(
      combined,
      `const a = 'a';
       const b = 'b';
       console.log(a + b);
       export { b };
    `
    );
  });

  test("preserves bundle export variable declaration that use a different name on the outside of the bundle from the inside of the bundle", async function (assert) {
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
        lib_b: {
          file: "index.js",
          name: "b",
        },
      },
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
      `
      const a = 'a';
      const b = 'b';
      console.log(a + b);
      export { b as lib_b };
      `
    );
  });

  test("preserves bundle named export statements that use a different name on the outside of the bundle from the inside of the bundle", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { a } from './a.js';
        const b = 'b';
        export { b }
        console.log(a + b);
      `,
      "a.js": `export const a = 'a';`,
    });

    let assignments = await makeBundleAssignments(assert.fs, {
      exports: {
        lib_b: {
          file: "index.js",
          name: "b",
        },
      },
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
      `
      const a = 'a';
      const b = 'b';
      console.log(a + b);
      export { b as lib_b };
      `
    );
  });

  test("preserves bundle renamed export statements that use a different name on the outside of the bundle from the inside of the bundle", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { a } from './a.js';
        const c = 'b';
        export { c as b }
        console.log(a + c);
      `,
      "a.js": `export const a = 'a';`,
    });

    let assignments = await makeBundleAssignments(assert.fs, {
      exports: {
        lib_b: {
          file: "index.js",
          name: "b",
        },
      },
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
      `
      const a = 'a';
      const c = 'b';
      console.log(a + c);
      export { c as lib_b };
      `
    );
  });

  test("preserves function export statements that use a different name on the outside of the bundle from the inside of the bundle", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { a } from './a.js';
        export function b() { return 'b' }
        console.log(a + b());
      `,
      "a.js": `export const a = 'a';`,
    });

    let assignments = await makeBundleAssignments(assert.fs, {
      exports: {
        lib_b: {
          file: "index.js",
          name: "b",
        },
      },
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
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
      "index.js": `
        import { a } from './a.js';
        export class b { foo() { return 'bar'; } }
        console.log(a + b.foo);
      `,
      "a.js": `export const a = 'a';`,
    });

    let assignments = await makeBundleAssignments(assert.fs, {
      exports: {
        lib_b: {
          file: "index.js",
          name: "b",
        },
      },
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
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

    assert.codeEqual(
      combined,
      `const a0 = 'a';
      function a() {
        return 1;
      }
      console.log(a());
      export { a0 as a };`
    );
  });

  test("it prevents collisions with mulitple bundle exported named statements", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs, {
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
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
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

  test("it prevents collisions with mulitple bundle exported variable declarations", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs, {
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
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
      `
      const a0 = 'a', b0 = 'b';
      const a = 1;
      const b = 2;
      console.log(a + b);
      export { a0 as a, b0 as b };
    `
    );
  });

  skip("TODO test against variable exported lvalues like export const [x, y] from blah()", async function () {});

  skip("TODO test against export statements/declarations where some of the items are bundle exports and some are not", async function () {});

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

    assert.codeEqual(
      combined,
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
      "index.js": `
        import './a.js';
        const a = 'a';
        console.log(a());
        `,
      "a.js": `
        export class a {}
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

    assert.codeEqual(
      combined,
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

    assert.codeEqual(
      combined,
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

    assert.codeEqual(
      combined,
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

    assert.codeEqual(
      combined,
      `
      const hello = 'hello';
      const hi = 'hi';
      console.log(hi + hello);
      `
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

    assert.codeEqual(
      combined,
      `
      const b = 'hello';
      const b0 = 1;
      console.log(b0);
      const hello = 'hi';
      console.log(hello + b);
      `
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

    assert.codeEqual(
      combined,
      `
      const a = 1;
      const b = 'internal';
      console.log(a + b);
      `
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

    assert.codeEqual(
      combined,
      `
      const hello = 'hello';
      const goodbye = 'goodbye';
      const lib = { hello, goodbye };
      console.log(lib.hello + lib.goodbye);
      `
    );
  });

  test("preserves bundle imports from other modules", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { a } from './a.js';
        const b = 'b';
        console.log(a + b);
      `,
      "a.js": `
        export const a = 1;
      `,
    });

    let assignments = await makeBundleAssignments(assert.fs, {
      assignments: [
        {
          module: "a.js",
          assignedToBundle: "dist/2.js",
          nameMapping: {
            a: "lib_a",
          },
        },
      ],
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
      `import { lib_a as a } from './2.js';
       const b = 'b';
       console.log(a + b);`
    );
  });

  test("strips unused exported function", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { a } from './lib.js';
        console.log(a());
      `,
      "lib.js": `
        export function a() { return 1; }
        export function b() { return 2; }
        `,
    });

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
      `
      function a() { return 1; }
      console.log(a());
      `
    );
  });

  test("a function that's consumed by the bundle itself is not stripped", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
      `
      function a() { return 1; }
      function b() { return 2; }
      b();
      console.log(a());
      `
    );
  });

  test("strips function used only in removed function's body", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
      `
      function a() { return 1; }
      console.log(a());
      `
    );
  });

  test("strips imported function used only in removed function's body", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined,
      `
      function a() { return 1; }
      console.log(a());
      `
    );
  });

  // Test ideas:
  // mulitple named imports: import { a, b, c} from './lib.js'
  // import default and variations on that theme
  // import namespace and variations on that theme
});
