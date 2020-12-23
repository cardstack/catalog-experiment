import { describeESModule, describeCJSFile } from "./helpers/file-description";
import {
  declarationsMap,
  FileDescription,
  LocalExportDescription,
  ModuleDescription,
  ReexportExportDescription,
} from "../src/describe-file";
import {
  CodeRegion,
  documentPointer,
  NamespaceMarker,
  notFoundPointer,
  RegionEditor,
} from "../src/code-region";

const { test } = QUnit;

function keepAll(desc: FileDescription, editor: RegionEditor) {
  for (let i = 0; i < desc.regions.length; i++) {
    editor.keepRegion(i);
  }
}

function makeDescFromRegions(regions: CodeRegion[]): ModuleDescription {
  return {
    regions,
    declarations: declarationsMap(regions),
    exports: new Map(),
    imports: [],
  };
}

QUnit.module("describe-file", function () {
  test("can include require in description for CJS file", function (assert) {
    let { desc } = describeCJSFile(`
    const foo = require('./bar');
    `);
    assert.ok("requires" in desc);
    if ("requires" in desc) {
      assert.equal(desc.requires.length, 1);
      let [req] = desc.requires;
      assert.equal(req.specifier, "./bar");
      assert.equal(req.definitelyRuns, true);
    }
  });

  test("can make a code region for the require() call expression", function (assert) {
    let { desc, editor } = describeCJSFile(`
    const foo = require('./bar');
    `);
    keepAll(desc, editor);
    assert.ok("requires" in desc);
    if ("requires" in desc) {
      let [req] = desc.requires;
      editor.replace(req.requireRegion, `_foo`);
      assert.codeEqual(
        editor.serialize().code,
        `
        const foo = _foo;
       `
      );
    }
  });

  test("can make a code region for the require() specifier", function (assert) {
    let { desc, editor } = describeCJSFile(`
    const foo = require('./bar');
    `);
    keepAll(desc, editor);
    assert.ok("requires" in desc);
    if ("requires" in desc) {
      let [req] = desc.requires;
      editor.replace(req.specifierRegion, `"./bar.cjs.js"`);
      assert.codeEqual(
        editor.serialize().code,
        `
        const foo = require("./bar.cjs.js");
       `
      );
    }
  });

  test("CJS require() description can indicate if require is not a top-level require", function (assert) {
    let { desc } = describeCJSFile(`
    function doThings() {
      const foo = require('./bar');
      foo();
    }
    `);
    assert.ok("requires" in desc);
    if ("requires" in desc) {
      let [req] = desc.requires;
      assert.equal(req.definitelyRuns, false);
    }
  });

  test("includes named exports for CJS that was transpiled from ES", function (assert) {
    let { desc } = describeCJSFile(`
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = function() {
      console.log("I'm the default export");
    }
    exports.foo = function() {
      console.log("I'm the foo export");
    }
    `);
    assert.deepEqual(desc.esTranspiledExports, ["default", "foo"]);

    ({ desc } = describeCJSFile(`
    module.exports.foo = function doThings() {
      const foo = require('./bar');
      foo();
    }
    `));
    assert.deepEqual(desc.esTranspiledExports, undefined);
  });

  test("CJS analysis won't treat module binding named 'require' as the CJS 'require' keyword", function (assert) {
    let { desc } = describeCJSFile(`
    function require() {
      console.log("i'm just pretending to require");
    }
    function doThings() {
      const foo = require('./bar');
      foo();
    }
    `);
    assert.ok("requires" in desc);
    if ("requires" in desc) {
      assert.equal(desc.requires.length, 0);
    }
  });

  test("creates a code region for variable declaration", function (assert) {
    let { desc, editor } = describeESModule(`
      const a = 1;
      function b() { console.log('hi'); }
      class c { foo() { return "bar"; } }
      export {};
    `);
    keepAll(desc, editor);
    let pointer = desc.regions.findIndex(
      (r) => r.type === "declaration" && r.declaration.declaredName === "a"
    );
    let region = desc.regions[pointer];
    assert.ok(region, "a code region was created for the declaration");
    editor.replace(pointer, "lol = 'lol'");
    assert.codeEqual(
      editor.serialize().code,
      `
      const lol = 'lol';
      function b() { console.log('hi'); }
      class c { foo() { return "bar"; } }
      export {};
      `
    );
  });

  test("creates a code region for a function declaration", function (assert) {
    let { desc, editor } = describeESModule(`
      const a = 1;
      function b() { console.log('hi'); }
      class c { foo() { return "bar"; } }
      export {};
    `);
    keepAll(desc, editor);
    let pointer = desc.regions.findIndex(
      (r) => r.type === "declaration" && r.declaration.declaredName === "b"
    );
    let region = desc.regions[pointer];
    assert.ok(region, "a code region was created for the declaration");
    editor.replace(pointer, "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
      const a = 1;
      //CODE_REGION
      class c { foo() { return "bar"; } }
      export {};
      `
    );
  });

  test("creates a code region for a class declaration", function (assert) {
    let { desc, editor } = describeESModule(`
      const a = 1;
      function b() { console.log('hi'); }
      class c { foo() { return "bar"; } }
      export {};
    `);
    keepAll(desc, editor);
    let pointer = desc.regions.findIndex(
      (r) => r.type === "declaration" && r.declaration.declaredName === "c"
    );
    let region = desc.regions[pointer];
    assert.ok(region, "a code region was created for the declaration");
    editor.replace(pointer, "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
      const a = 1;
      function b() { console.log('hi'); }
      //CODE_REGION
      export {};
      `
    );
  });

  test("creates code regions for bindings declared in an LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let { x, y: [z] } = foo();
      export {};
    `);
    keepAll(desc, editor);

    let pointer = desc.regions.findIndex(
      (r) => r.type == "declaration" && r.declaration.declaredName === "x"
    );
    let region = desc.regions[pointer];
    assert.ok(region, "a code region was created for the declaration");
    editor.replace(pointer, "a");

    pointer = desc.regions.findIndex(
      (r) => r.type == "declaration" && r.declaration.declaredName === "z"
    );
    region = desc.regions[pointer];
    assert.ok(region, "a code region was created for the declaration");
    editor.replace(pointer, "b");

    pointer = desc.regions.findIndex(
      (r) => r.type == "declaration" && r.declaration.declaredName === "y"
    );
    assert.equal(
      pointer,
      notFoundPointer,
      "no declaration code region is created for left-hand part of object pattern"
    );

    assert.codeEqual(
      editor.serialize().code,
      `
      let { a, y: [b] } = foo();
      export {};
      `
    );
  });

  test("creates a code region for expression statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      console.log("side effect");
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("creates a code region for block statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      {
        console.log("side effect");
      }
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("creates a code region for do-while statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      do {
        console.log("side effect");
      } while (false);
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("creates a code region for 'for' statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      for (let i = 0; i < 2; i++) {
        console.log(i);
      }
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("creates a code region for for-in statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      for (let i in { a: 1, b: 2 }) {
        console.log(i);
      }
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("creates a code region for for-of statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      for (let i of [1, 2, 3, 4]) {
        console.log(i);
      }
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("creates a code region for if statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      if (true) {
        console.log("side effect");
      }
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("creates a code region for switch statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      switch (a) {
        case 'hi':
        console.log("side effect");
        break;
      }
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("creates a code region for throw statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      throw new Error("side effect");
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("creates a code region for try statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      try {
        console.log("side effect");
      } catch (e) {
        throw e;
      }
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("creates a code region for while statement module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      while(false) {
        console.log("side effect");
      }
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION
        export {};
        `
    );
  });

  test("contiguous module side effects are contained in the same code region", function (assert) {
    let { desc, editor } = describeESModule(`
      console.log("side effect 1");
      console.log("side effect 2");
      const foo = "bar";
      console.log("side effect 3");
      export {};
    `);
    keepAll(desc, editor);

    let document = desc.regions[documentPointer];
    let sideEffects = document.dependsOn;
    assert.equal(sideEffects.size, 2);
    editor.replace([...sideEffects][0], "//CODE_REGION_1");
    editor.replace([...sideEffects][1], "//CODE_REGION_2");
    assert.codeEqual(
      editor.serialize().code,
      `
        //CODE_REGION_1
        const foo = "bar";
        //CODE_REGION_2
        export {};
        `
    );
  });

  test("a code region for a binding declaration depends on module side effects", function (assert) {
    let { desc, editor } = describeESModule(`
      console.log("side effect");
      const foo = "bar";
      export {};
    `);
    keepAll(desc, editor);
    let document = desc.regions[documentPointer];
    let [sideEffect] = [...document.dependsOn];
    let { pointer } = desc.declarations.get("foo")!;
    let region = desc.regions[pointer];
    assert.ok(region.dependsOn.has(sideEffect));
    editor.replace(sideEffect, "//CODE_REGION");
    assert.codeEqual(
      editor.serialize().code,
      `
          //CODE_REGION
          const foo = "bar";
          export {};
          `
    );
  });

  test("a code region depends on the code regions for bindings consumed within the region", function (assert) {
    let { desc } = describeESModule(`
      let a = 3;
      function printA() {
        console.log(a);
      }
      export {};
    `);
    let { pointer: a } = desc.declarations.get("a")!;
    let { pointer } = desc.declarations.get("printA")!;
    let region = desc.regions[pointer];
    assert.ok([...region.dependsOn].includes(a));
  });

  test("a code region declaration contains its references", async function (assert) {
    let { desc, editor } = describeESModule(`
      let a = 3;
      function printA() {
        console.log(a);
      }
      export {};
    `);
    keepAll(desc, editor);
    let { declaration } = desc.declarations.get("a")!;
    assert.equal(declaration.references.length, 2);
    for (let reference of declaration.references) {
      editor.replace(reference, "b");
    }
    assert.codeEqual(
      editor.serialize().code,
      `
      let b = 3;
      function printA() {
        console.log(b);
      }
      export {};
      `
    );
  });

  test("the DocumentPointer code region depends on side effect regions that are within a declaration code region", async function (assert) {
    let { desc, editor } = describeESModule(`
      let a = initializeCache();
      export {};
    `);
    keepAll(desc, editor);
    let document = desc.regions[documentPointer];
    assert.equal(document.dependsOn.size, 1);
    let [sideEffect] = [...document.dependsOn];
    let { pointer } = desc.declarations.get("a")!;
    assert.ok(
      desc.regions[pointer].dependsOn.has(sideEffect),
      "the side effect is a dependency region"
    );
    editor.replace(sideEffect, "walkTheDog()");
    assert.codeEqual(
      editor.serialize().code,
      `
        let a = walkTheDog();
        export {};
        `
    );
  });

  test("pure reexport examples", function (assert) {
    let { desc } = describeESModule(`
      export { foo } from './bar';
      export { x as y } from './baz';
      function bar() {};
      export { bar };
    `);
    assert.ok(desc.exports.has("foo"), "foo in exportedNames");
    assert.equal(
      desc.exports.get("bar")?.type,
      "local",
      "bar in exportedNames"
    );
    assert.ok(desc.exports.has("y"), "y in exportedNames");
    assert.ok(desc.exports.has("foo"), "foo is a reexport");

    let exportDesc = desc.exports.get("foo")! as
      | LocalExportDescription
      | ReexportExportDescription;
    assert.equal(exportDesc.type, "reexport");
    assert.equal(exportDesc.name, "foo", "foo is not named");
    if (exportDesc.type === "reexport") {
      assert.equal(exportDesc.importIndex, 0);
    }

    exportDesc = desc.exports.get("y")! as
      | LocalExportDescription
      | ReexportExportDescription;
    assert.equal(exportDesc.type, "reexport", "y is a reexport");
    assert.equal(exportDesc.name, "x");
    if (exportDesc.type === "reexport") {
      assert.equal(exportDesc.importIndex, 1);
    }
  });

  test("export name is different than module-scoped name", function (assert) {
    let { desc } = describeESModule(`
      const a = 1;
      export { a as b };
    `);
    assert.ok(desc.exports.has("b"), "b in exportedNames");
    assert.ok(!desc.exports.has("a"), "a not in exportedNames");
    let exportDesc = desc.exports.get("b")! as
      | LocalExportDescription
      | ReexportExportDescription;
    assert.equal(exportDesc.type, "local");
    assert.equal(exportDesc.name, "a", "we can see that b comes from a");
  });

  test("non-module scope bindings are not captured in module description", function (assert) {
    let { desc } = describeESModule(`
      function arrayMap(array, iteratee) {
        var index = -1,
            length = array == null ? 0 : array.length,
            result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      export default arrayMap;
    `);
    assert.ok(
      desc.declarations.has("arrayMap"),
      "module scoped binding in module description"
    );
    assert.notOk(
      desc.declarations.has("array"),
      "non-module scoped binding is not in module description"
    );
  });

  test("default export function", function (assert) {
    let { desc } = describeESModule(`
    export default function x() {}
  `);
    let exportDesc = desc.exports.get("default")! as
      | LocalExportDescription
      | ReexportExportDescription;
    assert.equal(exportDesc.type, "local");
    assert.equal(exportDesc.name, "x");
    assert.equal(desc.declarations.get("x")?.declaration.type, "local");
  });

  test("default export class", function (assert) {
    let { desc } = describeESModule(`
    export default class x {}
  `);
    let exportDesc = desc.exports.get("default")! as
      | LocalExportDescription
      | ReexportExportDescription;
    assert.equal(exportDesc.type, "local");
    assert.equal(exportDesc.name, "x");
    assert.equal(desc.declarations.get("x")?.declaration.type, "local");
  });

  test("default export with no local name", function (assert) {
    let { desc } = describeESModule(`
    export default foo();
  `);
    let exportDesc = desc.exports.get("default")! as
      | LocalExportDescription
      | ReexportExportDescription;
    assert.equal(exportDesc.type, "local");
    assert.equal(exportDesc.name, "default");
    let { pointer } = desc.declarations.get("default")!;
    let region = desc.regions[pointer];
    assert.equal(region.dependsOn.size, 0); // note that we don't depend on "foo" because it was not declared in the module scope
  });

  test("renaming local side of export", function (assert) {
    let { desc, editor } = describeESModule(`
      function x() {}
      function z() {}
      export { x, z };
    `);
    keepAll(desc, editor);
    editor.rename("x", "y");
    editor.rename("z", "a");
    let { code, regions } = editor.serialize();
    assert.codeEqual(
      code,
      `
      function y() {}
      function a() {}
      export { y as x, a as z };
    `
    );

    let newDesc = makeDescFromRegions(regions);
    let newEditor = new RegionEditor(code, newDesc);
    keepAll(newDesc, newEditor);
    newEditor.rename("y", "bob");
    newEditor.rename("a", "charlie");
    code = newEditor.serialize().code;
    assert.codeEqual(
      code,
      `
      function bob() {}
      function charlie() {}
      export { bob as x, charlie as z };
    `
    );
  });

  test("imported names are discovered", function (assert) {
    let { desc } = describeESModule(`
      import { x } from 'somewhere';
    `);
    let out = desc.declarations.get("x");
    assert.equal(out?.declaration.type, "import");
    if (out?.declaration.type === "import") {
      assert.equal(out.declaration.importIndex, 0);
      assert.equal(out.declaration.importedName, "x");
    }
    let document = desc.regions[documentPointer];
    assert.equal(document.dependsOn.size, 0);
  });

  test("imported namespace is discovered", function (assert) {
    let { desc } = describeESModule(`
      import * as x from 'somewhere';
    `);
    let out = desc.declarations.get("x");
    assert.equal(out?.declaration.type, "import");
    if (out?.declaration.type === "import") {
      assert.equal(out.declaration.importIndex, 0);
      assert.equal(out.declaration.importedName, NamespaceMarker);
    }
    let document = desc.regions[documentPointer];
    assert.equal(document.dependsOn.size, 0);
  });

  test("default imported names are discovered", function (assert) {
    let { desc } = describeESModule(`
      import x from 'somewhere';
    `);
    let out = desc.declarations.get("x");
    assert.equal(out?.declaration.type, "import");
    if (out?.declaration.type === "import") {
      assert.equal(out.declaration.importIndex, 0);
      assert.equal(out.declaration.importedName, "default");
    }
    let document = desc.regions[documentPointer];
    assert.equal(document.dependsOn.size, 0);
  });

  test("local names are discovered", function (assert) {
    let { desc } = describeESModule(`
      function x() {}
      export {};
    `);
    assert.equal(desc.declarations.get("x")?.declaration.type, "local");
  });

  test("local function is used by export", function (assert) {
    let { desc } = describeESModule(`
      function x() {}
      export function y() {
        return x();
      }
    `);
    let out = desc.declarations.get("y");
    let region = desc.regions[out!.pointer];
    let { pointer: xPointer } = desc.declarations.get("x")!;
    assert.equal(out?.declaration.type, "local");
    assert.ok(region.dependsOn.has(xPointer));
  });

  test("local function is used by module", function (assert) {
    let { desc } = describeESModule(`
      function x() {}
      x();
      export {};
    `);
    let document = desc.regions[documentPointer];
    let out = desc.declarations.get("x")!;
    let { pointer } = out;
    assert.equal(out.declaration.type, "local");
    if (out?.declaration.type === "local") {
      assert.equal(document.dependsOn.has(pointer), true);
    }
  });

  test("local function is used by default export", function (assert) {
    let { desc } = describeESModule(`
      function x() {}
      export default class Q {
        constructor() {
          x();
        }
      }
    `);
    let out = desc.declarations.get("Q")!;
    let x = desc.declarations.get("x")!;
    let { pointer: xPointer } = x;
    let region = desc.regions[out.pointer];
    assert.equal(out.declaration.type, "local");
    if (out.declaration.type === "local") {
      assert.ok(region.dependsOn.has(xPointer));
    }
    assert.ok(desc.exports.get("default")?.type === "local");
    assert.ok(
      (desc.exports.get("default") as
        | LocalExportDescription
        | ReexportExportDescription)?.name === "Q"
    );
  });

  test("variables consumed in LVal", function (assert) {
    let { desc } = describeESModule(`
      let a = foo();
      let { x = a, y = x } = bar();
      export {};
    `);
    let out = desc.declarations.get("x")!;
    let { pointer: xPointer } = out;
    let a = desc.declarations.get("a")!;
    let { pointer: aPointer } = a;
    let xRegion = desc.regions[out.pointer];
    assert.ok(xRegion.dependsOn.has(aPointer));
    out = desc.declarations.get("y")!;
    let yRegion = desc.regions[out.pointer];
    assert.ok(yRegion.dependsOn.has(xPointer));
  });

  test("renaming a function declaration", function (assert) {
    let { desc, editor } = describeESModule(`
      console.log(1);
      function x() {}
      x();
      export {};
    `);
    keepAll(desc, editor);
    editor.rename("x", "y");
    assert.codeEqual(
      editor.serialize().code,
      `
      console.log(1);
      function y() {}
      y();
      export {};
    `
    );
  });

  test("pattern in function arguments doesn't create module scoped binding", function (assert) {
    let { desc } = describeESModule(`
      function x({ a }) {}
      export {};
    `);
    assert.notOk(desc.declarations.has("a"));
  });

  test("function default arguments consume other bindings", function (assert) {
    let { desc } = describeESModule(`
      let a = 1;
      function x(y=a) {}
      export {};
    `);
    let out = desc.declarations.get("x")!;
    let region = desc.regions[out.pointer];
    let a = desc.declarations.get("a")!;
    let { pointer } = a;
    assert.ok(region.dependsOn.has(pointer));
  });

  test("code regions for an imported name can be used to replace it", function (assert) {
    let { desc, editor } = describeESModule(`
      import { a, a1, b as c, b1, d as d } from "lib";
      export default function(a) {
        console.log(a);
      }
      console.log(a, a1, c, b1, d);
    `);
    keepAll(desc, editor);
    editor.rename("a", "alpha");
    editor.rename("a1", "alpha1");
    editor.rename("b1", "bravo1");
    editor.rename("c", "charlie");
    editor.rename("d", "delta");
    let { code, regions } = editor.serialize();
    assert.codeEqual(
      code,
      `
      import { a as alpha, a1 as alpha1, b as charlie, b1 as bravo1, d as delta } from "lib";
      export default function(a) {
        console.log(a);
      }
      console.log(alpha, alpha1, charlie, bravo1, delta);
    `
    );

    let newDesc = makeDescFromRegions(regions);
    let newEditor = new RegionEditor(code, newDesc);
    keepAll(newDesc, newEditor);
    newEditor.rename("alpha", "renamedAlpha");
    newEditor.rename("alpha1", "renamedAlpha1");
    newEditor.rename("bravo1", "renamedBravo1");
    newEditor.rename("charlie", "renamedCharlie");
    newEditor.rename("delta", "renamedDelta");
    assert.codeEqual(
      newEditor.serialize().code,
      `
      import { a as renamedAlpha, a1 as renamedAlpha1, b as renamedCharlie, b1 as renamedBravo1, d as renamedDelta } from "lib";
      export default function(a) {
        console.log(a);
      }
      console.log(renamedAlpha, renamedAlpha1, renamedCharlie, renamedBravo1, renamedDelta);
    `
    );
  });

  test("code regions for a local variable can be used to replace it", function (assert) {
    let { desc, editor } = describeESModule(`
      const a = 1;
      export default function(a) {
        console.log(a);
      }
      console.log(a);
    `);
    keepAll(desc, editor);
    editor.rename("a", "alpha");
    assert.codeEqual(
      editor.serialize().code,
      `
      const alpha = 1;
      export default function(a) {
        console.log(a);
      }
      console.log(alpha);
    `
    );
  });

  test("code regions for a variable declared within an object pattern can be used to replace it", function (assert) {
    let { desc, editor } = describeESModule(`
      const { a, b: c } = foo();
      console.log(a, c);
      export {};
    `);
    keepAll(desc, editor);
    editor.rename("a", "alpha");
    editor.rename("c", "charlie");
    let { code, regions } = editor.serialize();
    assert.codeEqual(
      code,
      `
      const { a: alpha, b: charlie } = foo();
      console.log(alpha, charlie);
      export {};
    `
    );

    let newDesc = makeDescFromRegions(regions);
    let newEditor = new RegionEditor(code, newDesc);
    keepAll(newDesc, newEditor);
    newEditor.rename("alpha", "renamedAlpha");
    newEditor.rename("charlie", "renamedCharlie");
    assert.codeEqual(
      newEditor.serialize().code,
      `
      const { a: renamedAlpha, b: renamedCharlie } = foo();
      console.log(renamedAlpha, renamedCharlie);
      export {};
    `
    );
  });

  test("code regions for a variable assigned via an LVal AssignmentPattern can be used to replace it", function (assert) {
    let { desc, editor } = describeESModule(`
      const { a, b = a } = foo();
      console.log(a, b);
      export {};
    `);
    keepAll(desc, editor);
    editor.rename("a", "alpha");
    editor.rename("b", "bravo");
    assert.codeEqual(
      editor.serialize().code,
      `
      const { a: alpha, b: bravo = alpha } = foo();
      console.log(alpha, bravo);
      export {};
    `
    );
  });

  test("code regions for a variable assign via an LVal AssignmentPattern with shorthand can be used to replace it", function (assert) {
    let { desc, editor } = describeESModule(`
      const { a, b: bravo = a } = foo();
      console.log(a, bravo);
      export {};
    `);
    keepAll(desc, editor);
    editor.rename("bravo", "b");
    assert.codeEqual(
      editor.serialize().code,
      `
      const { a, b = a } = foo();
      console.log(a, b);
      export {};
    `
    );
  });

  test("code regions for a MemberExpression can be used to replace it", function (assert) {
    let { desc, editor } = describeESModule(`
      const bar = makeBar();
      const { a, b = bar.blah } = foo();
      console.log(a, bar.blurb);
      export {};
    `);
    keepAll(desc, editor);
    editor.rename("bar", "bleep");
    assert.codeEqual(
      editor.serialize().code,
      `
      const bleep = makeBar();
      const { a, b = bleep.blah } = foo();
      console.log(a, bleep.blurb);
      export {};
    `
    );
  });

  test("code regions for nested ObjectPattern can be used to replace it", function (assert) {
    let { desc, editor } = describeESModule(`
      let [{ x }, { y }] = bar();
      console.log(y);
      export {};
    `);
    keepAll(desc, editor);
    editor.rename("y", "yas");
    assert.codeEqual(
      editor.serialize().code,
      `
      let [{ x }, { y: yas }] = bar();
      console.log(yas);
      export {};
    `
    );
  });

  test("rename an exported const", async function (assert) {
    let { desc, editor } = describeESModule(`export const a = 'a';`);
    keepAll(desc, editor);
    editor.rename("a", "a0");
    assert.codeEqual(editor.serialize().code, `export const a0 = 'a';`);
  });
});
