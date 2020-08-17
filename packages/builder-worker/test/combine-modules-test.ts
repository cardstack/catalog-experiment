import { parseDOM } from "htmlparser2";
import { installFileAssertions } from "./helpers/file-assertions";
import "./helpers/code-equality-assertions";
import { combineModules, ImportAssignments } from "../src/combine-modules";
import { Resolver, ModuleResolution } from "../src/nodes/resolution";
import { HTMLEntrypoint } from "../src/nodes/entrypoint";
import { BundleAssignment, Assigner } from "../src/nodes/bundle";
import {
  describeFile,
  NamespaceMarker,
  LocalNameDescription,
  isModuleDescription,
} from "../src/describe-file";
import { url } from "./helpers/file-assertions";
import { FileSystem } from "../src/filesystem";
import { parse } from "@babel/core";

let resolver = new Resolver(); // TODO need to resolve modules without '.js' extension

async function makeModuleResolutions(
  fs: FileSystem,
  moduleURL: URL,
  {
    importAssignments,
  }: {
    importAssignments?: ImportAssignments;
  } = {}
): Promise<ModuleResolution> {
  let source = await (await fs.openFile(moduleURL)).readText();
  let parsed = parse(source);
  if (parsed?.type !== "File") {
    throw new Error(`parsed js for ${moduleURL.href} is not a babel File type`);
  }
  let desc = describeFile(parsed, { importAssignments });
  let resolvedImports: ModuleResolution[];
  if (!isModuleDescription(desc)) {
    throw new Error(
      `Cannot perform module resolution on CJS file ${moduleURL.href}`
    );
  } else {
    resolvedImports = await Promise.all(
      desc.imports.map(async (imp) => {
        let depURL = await resolver.resolve(imp.specifier, moduleURL);
        return makeModuleResolutions(fs, depURL, {
          importAssignments,
        });
      })
    );
  }
  return { url: moduleURL, source, resolvedImports, desc };
}

async function makeBundleAssignments(
  fs: FileSystem,
  opts?: {
    bundleURL?: URL;
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
      bundleURL: url("dist/0.js"),
      containsEntrypoint: "index.js",
      exports: {},
    },
    opts
  );

  let resolutions: ModuleResolution[] = [];
  if (optsWithDefaults.containsEntrypoint) {
    resolutions.push(
      await makeModuleResolutions(fs, url(optsWithDefaults.containsEntrypoint))
    );
  }

  let entrypoint = new HTMLEntrypoint(
    url("index.html"),
    url("index.html"),
    parseDOM(
      `<script type="module" src="./${optsWithDefaults.containsEntrypoint}">`
    )
  );
  let assigner = new Assigner(
    url("/"),
    url("/"),
    resolutions,
    [entrypoint],
    optsWithDefaults.bundleURL ? [optsWithDefaults.bundleURL] : undefined
  );
  let { assignments } = assigner;

  if (opts?.exports) {
    for (let [outsideName, { file, name }] of Object.entries(
      optsWithDefaults.exports
    )) {
      let fileURL = url(file);
      let assignment = assignments.find(
        (a) => a.module.url.href === fileURL.href
      );
      if (!assignment) {
        throw new Error(
          `invalid test setup, you tried to set an export for the module ${fileURL.href}}, but there is no assignment for that module`
        );
      }
      assignment.exposedNames.set(name, outsideName);
    }
  }
  if (opts?.assignments) {
    for (let assignment of opts.assignments) {
      let fileURL = url(assignment.module);
      let a = {
        bundleURL: url(assignment.assignedToBundle),
        module: await makeModuleResolutions(fs, fileURL),
        exposedNames: new Map(Object.entries(assignment.nameMapping)),
      };
      let index = assignments.findIndex(
        (a) => a.module.url.href === fileURL.href
      );
      if (index > -1) {
        assignments[index] = a;
      } else {
        assignments.push(a);
      }
    }
  }
  return assignments;
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
      combined.code,
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
      "index.js": `
        import { a } from './a.js';
        import { b } from './b.js';
        console.log(a + b);
      `,
      "a.js": `export const [ { a } ] = foo();`,
      "b.js": `export const b = 'b';`,
    });

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
      `
      const [ { a } ] = foo();
      const b = 'b';
      console.log(a + b);
      export {};
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
      combined.code,
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
      combined.code,
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
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
      combined.code,
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
      combined.code,
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
      combined.code,
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
      combined.code,
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
      combined.code,
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
      combined.code,
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
      combined.code,
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
      combined.code,
      `const a0 = 'a';
      function a() {
        return 1;
      }
      console.log(a());
      export { a0 as a };`
    );
  });

  test("it prevents collisions with multiple bundle exported named statements", async function (assert) {
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
      combined.code,
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
      combined.code,
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
      combined.code,
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
      combined.code,
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
      combined.code,
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
      combined.code,
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
      combined.code,
      `
      const hello = 'hello';
      const hi = 'hi';
      console.log(hi + hello);
      export {};
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
      combined.code,
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
      combined.code,
      `
      const a = 1;
      const b = 'internal';
      console.log(a + b);
      export {};
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
      combined.code,
      `
      const hello = 'hello';
      const goodbye = 'goodbye';
      const lib = { hello, goodbye };
      console.log(lib.hello + lib.goodbye);
      export {};
      `
    );
  });

  test("can handle collisions in exported expressions", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
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

  test("can handle default exported class", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
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

  test("can handle both default and named imports", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);
    assert.codeEqual(
      combined.code,
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
      combined.code,
      `import { lib_a as a } from './2.js';
       const b = 'b';
       console.log(a + b);`
    );
  });

  test("preserves side effect import if module with side effect is assigned to different bundle", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs, {
      assignments: [
        {
          module: "a.js",
          assignedToBundle: "dist/2.js",
          nameMapping: {},
        },
      ],
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
      `import './2.js';
       const b = 'b';
       console.log(b);`
    );
  });

  test("preserves side effect import if module is imported both for side effect only and imported for an unconsumed binding", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs, {
      assignments: [
        {
          module: "a.js",
          assignedToBundle: "dist/2.js",
          nameMapping: { a: "a" },
        },
      ],
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
      `import './2.js';
       console.log('hi');
       const b = 'b';
       console.log(b);`
    );
  });

  test("strips a side-effect only import if the module is also imported for a consumed binding (the side effect comes along in the named import)", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs, {
      assignments: [
        {
          module: "a.js",
          assignedToBundle: "dist/2.js",
          nameMapping: { a: "a" },
        },
      ],
    });
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
      `import { a } from './2.js';
       console.log(a);
       const b = 'b';
       console.log(b);`
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
      combined.code,
      `
      function a() { return 1; }
      console.log(a());
      export {};
      `
    );
  });

  test("strips unconsumed import", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { a, b } from './lib.js';
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
      combined.code,
      `
      function a() { return 1; }
      console.log(a());
      export {};
      `
    );
  });

  test("strips unconsumed default import", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import b, { a } from './lib.js';
        console.log(a());
      `,
      "lib.js": `
        export function a() { return 1; }
        export default function () { return 2; }
        `,
    });

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
      `
      function a() { return 1; }
      console.log(a());
      export {};
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
      combined.code,
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
      combined.code,
      `
      function a() { return 1; }
      console.log(a());
      export {};
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
      combined.code,
      `
      function a() { return 1; }
      console.log(a());
      export {};
      `
    );
  });

  test("strips out unconsumed binding that is imported from another bundle", async function (assert) {
    await assert.setupFiles({
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
      combined.code,
      `function b() { return 1; }
       console.log(b());
       export {};
      `
    );
  });

  test("strips unconsumed variable", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
      `
      function a() { return 1; }
      console.log(a());
      export {};
      `
    );
  });

  test("strips unconsumed variable in a variable declaration that has more than 1 variable", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
      `
      function a() { return 1; }
      const foo = 'bleep';
      console.log(a() + foo);
      export {};
      `
    );
  });

  test("preserves side-effectful right-hand side", async function (assert) {
    await assert.setupFiles({
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

    let assignments = await makeBundleAssignments(assert.fs);
    let combined = combineModules(url("dist/0.js"), assignments);

    assert.codeEqual(
      combined.code,
      `
      function i() { return 1; }
      initCache();
      console.log(i());
      export {};
      `
    );
  });

  test("module combination returns assigned imported names", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { foo } from './foo.js';
        let bar = 3;
        console.log(foo() + bar);
      `,
      "foo.js": `
        import { bar } from './lib.js';
        export function foo() { return bar; }
        `,
      "lib.js": `
          export const bar = 2;
        `,
    });

    let assignments = await makeBundleAssignments(assert.fs);
    let { importAssignments } = combineModules(url("dist/0.js"), assignments);
    let original = importAssignments.get("bar0");
    assert.deepEqual(original, { moduleHref: url("lib.js").href, name: "bar" });
  });

  test("module descriptions include original import info for local bindings that originally came from an import", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { foo } from './foo.js';
        let bar = 3;
        console.log(foo() + bar);
      `,
      "foo.js": `
        import { bar } from './lib.js';
        export function foo() { return bar; }
        `,
      "lib.js": `
          export const bar = 2;
        `,
    });

    let assignments = await makeBundleAssignments(assert.fs);
    let { code, importAssignments } = combineModules(
      url("dist/0.js"),
      assignments
    );
    let parsed = parse(code);
    if (parsed?.type !== "File") {
      throw new Error(`unexpected babel output`);
    }
    let bundleDescription = describeFile(parsed, { importAssignments });
    let nameDesc = bundleDescription.names.get("bar0") as LocalNameDescription;
    assert.deepEqual(nameDesc.original, {
      moduleHref: url("lib.js").href,
      exportedName: "bar",
    });
  });

  test("it can dedupe a binding when combining bundles where the binding in each bundle originates from the same place", async function (assert) {
    await assert.setupFiles({
      "entrypointA.js": `
        import { a } from './a.js';
        let bar = 3;
        console.log(a() + bar);
      `,
      // in bundleB.js the goal is to have lib.js's "bar" resolve to a different
      // name than it resolved to in bundleA.js (it resolves to "bar1" in
      // bundleB.js), but that we should still see it stripped out in the final
      // combined bundle, and well as an interesting collision prevention should
      // occur too around "bar0" in the final combined bundle.
      "entrypointB.js": `
        import { b } from './b.js';
        let bar = 4;
        let bar0 = 5;
        console.log(b() + bar + bar0);
      `,
      "a.js": `
        import { bar } from './lib.js';
        export function a() { return bar; }
        `,
      "b.js": `
        import { bar } from './lib.js';
        export function b() { return bar; }
        `,
      "lib.js": `
          export const bar = 2;
        `,
    });

    // make bundle A
    let bundleAURL = url("dist/bundleA.js");
    let assignmentsA = await makeBundleAssignments(assert.fs, {
      bundleURL: bundleAURL,
      containsEntrypoint: "entrypointA.js",
    });
    let { code: codeA, importAssignments: importAssignmentsA } = combineModules(
      bundleAURL,
      assignmentsA
    );
    let bundleA = await assert.fs.openFile(bundleAURL, true);
    await bundleA.write(codeA);
    await bundleA.close();

    // make bundle B
    let bundleBURL = url("dist/bundleB.js");
    let assignmentsB = await makeBundleAssignments(assert.fs, {
      bundleURL: bundleBURL,
      containsEntrypoint: "entrypointB.js",
    });
    let { code: codeB, importAssignments: importAssignmentsB } = combineModules(
      bundleBURL,
      assignmentsB
    );
    let bundleB = await assert.fs.openFile(bundleBURL, true);
    await bundleB.write(codeB);
    await bundleB.close();

    // make a combined bundle that includes bundle A and bundle B along with
    // their respective import assignments
    let combinedBundleURL = url("dist/combined.js");
    let combinedAssignments: BundleAssignment[] = [
      {
        bundleURL: combinedBundleURL,
        module: await makeModuleResolutions(assert.fs, bundleAURL, {
          importAssignments: importAssignmentsA,
        }),
        exposedNames: new Map(),
      },
      {
        bundleURL: combinedBundleURL,
        module: await makeModuleResolutions(assert.fs, bundleBURL, {
          importAssignments: importAssignmentsB,
        }),
        exposedNames: new Map(),
      },
    ];
    let combined = combineModules(combinedBundleURL, combinedAssignments);
    assert.codeEqual(
      combined.code,
      `
      const bar0 = 2;
      function a() { return bar0; }
      let bar = 3;
      console.log(a() + bar);

      function b() { return bar0; }
      let bar2 = 4;
      let bar00 = 5
      console.log(b() + bar2 + bar00);
      export {};
      `
    );
  });
});
