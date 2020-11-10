import {
  describeFile as astDescribeFile,
  FileDescription,
  isModuleDescription,
  ModuleDescription,
  CJSDescription,
  LocalExportDescription,
  ReexportExportDescription,
  declarationMap,
} from "../src/describe-file";
import {
  DeclarationCodeRegion,
  documentPointer,
  NamespaceMarker,
  notFoundPointer,
  RegionEditor,
} from "../src/code-region";
import { parse } from "@babel/core";

const { test, skip } = QUnit;

let unusedNameNonce = 0;

function keepAll(desc: FileDescription, editor: RegionEditor) {
  for (let i = 0; i < desc.regions.length; i++) {
    editor.keepRegion(i);
  }
}

function describeFile(
  js: string
): { desc: FileDescription; editor: RegionEditor } {
  js = js.trim();
  let parsed = parse(js);
  if (parsed?.type !== "File") {
    throw new Error(`unexpected babel output`);
  }
  let desc = astDescribeFile(parsed);
  return {
    desc,
    editor: new RegionEditor(js, desc),
  };
}

function describeESModule(
  js: string
): { desc: ModuleDescription; editor: RegionEditor } {
  let { desc, editor } = describeFile(js);
  if (!isModuleDescription(desc)) {
    throw new Error(`file is CJS, but we were expecting an ES module`);
  }
  return { desc, editor };
}

function describeCJSFile(
  js: string
): { desc: CJSDescription; editor: RegionEditor } {
  let { desc, editor } = describeFile(js);
  if (isModuleDescription(desc)) {
    throw new Error(`file is ES module, but we were expecting CJS`);
  }
  return { desc, editor };
}

QUnit.module("describe-file", function (hooks) {
  hooks.beforeEach(() => {
    unusedNameNonce = 0;
  });

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
        editor.serialize(),
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
        editor.serialize(),
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
      (r) =>
        r.type === "declaration" && r.bindingDescription.declaredName === "a"
    );
    let region = desc.regions[pointer];
    assert.ok(region, "a code region was created for the declaration");
    editor.replace(pointer, "lol = 'lol'");
    assert.codeEqual(
      editor.serialize(),
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
      (r) =>
        r.type === "declaration" && r.bindingDescription.declaredName === "b"
    );
    let region = desc.regions[pointer];
    assert.ok(region, "a code region was created for the declaration");
    editor.replace(pointer, "//CODE_REGION");
    assert.codeEqual(
      editor.serialize(),
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
      (r) =>
        r.type === "declaration" && r.bindingDescription.declaredName === "c"
    );
    let region = desc.regions[pointer];
    assert.ok(region, "a code region was created for the declaration");
    editor.replace(pointer, "//CODE_REGION");
    assert.codeEqual(
      editor.serialize(),
      `
      const a = 1;
      function b() { console.log('hi'); }
      //CODE_REGION
      export {};
      `
    );
  });

  test("creates a code regions for bindings declared in an LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let { x, y: [z] } = foo();
      export {};
    `);
    keepAll(desc, editor);

    let pointer = desc.regions.findIndex(
      (r) =>
        r.type == "declaration" && r.bindingDescription.declaredName === "x"
    );
    let region = desc.regions[pointer];
    assert.ok(region, "a code region was created for the declaration");
    editor.replace(pointer, "a");

    pointer = desc.regions.findIndex(
      (r) =>
        r.type == "declaration" && r.bindingDescription.declaredName === "z"
    );
    region = desc.regions[pointer];
    assert.ok(region, "a code region was created for the declaration");
    editor.replace(pointer, "b");

    pointer = desc.regions.findIndex(
      (r) =>
        r.type == "declaration" && r.bindingDescription.declaredName === "y"
    );
    assert.equal(
      pointer,
      notFoundPointer,
      "no declaration code region is created for left-hand part of object pattern"
    );

    assert.codeEqual(
      editor.serialize(),
      `
      let { a, y: [b] } = foo();
      export {};
      `
    );
  });

  test("creates a code region for module side effect", function (assert) {
    let { desc, editor } = describeESModule(`
      console.log("side effect");
      export {};
    `);
    keepAll(desc, editor);

    let sideEffects = desc.regions[documentPointer].dependsOn;
    assert.equal(sideEffects.size, 1);
    editor.replace([...sideEffects][0], "//CODE_REGION");
    assert.codeEqual(
      editor.serialize(),
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

    let sideEffects = desc.regions[documentPointer].dependsOn;
    assert.equal(sideEffects.size, 2);
    editor.replace([...sideEffects][0], "//CODE_REGION_1");
    editor.replace([...sideEffects][1], "//CODE_REGION_2");
    assert.codeEqual(
      editor.serialize(),
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
    let [sideEffect] = [...desc.regions[documentPointer].dependsOn];
    let { region } = declarationMap(desc).get("foo")!;
    assert.ok(region.dependsOn.has(sideEffect));
    editor.replace(sideEffect, "//CODE_REGION");
    assert.codeEqual(
      editor.serialize(),
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
    let { pointer: a } = declarationMap(desc).get("a")!;
    let { region } = declarationMap(desc).get("printA")!;
    assert.deepEqual([...region.dependsOn], [a]);
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
    let { region } = declarationMap(desc).get("a")!;
    assert.equal(region.bindingDescription.references.length, 2);
    for (let reference of region.bindingDescription.references) {
      editor.replace(reference, "b");
    }
    assert.codeEqual(
      editor.serialize(),
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
    assert.equal(desc.regions[documentPointer].dependsOn.size, 1);
    let [sideEffect] = [...desc.regions[documentPointer].dependsOn];
    let { region } = declarationMap(desc).get("a")!;
    assert.equal(region.bindingDescription.sideEffects, sideEffect);
    editor.replace(sideEffect, "walkTheDog()");
    assert.codeEqual(
      editor.serialize(),
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
      declarationMap(desc).has("arrayMap"),
      "module scoped binding in module description"
    );
    assert.notOk(
      declarationMap(desc).has("array"),
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
    assert.equal(
      declarationMap(desc).get("x")?.region.bindingDescription.type,
      "local"
    );
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
    assert.equal(
      declarationMap(desc).get("x")?.region.bindingDescription.type,
      "local"
    );
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
    let { region } = declarationMap(desc).get("default")!;
    assert.equal(region.dependsOn.size, 0); // note that we don't depend on "foo" because it was not declared in the module scope
  });

  test("renaming local side of export", function (assert) {
    let { desc, editor } = describeESModule(`
      function x() {}
      export { x };
    `);
    keepAll(desc, editor);
    editor.rename("x", "y");
    assert.codeEqual(
      editor.serialize(),
      `
      function y() {}
      export { y as x };
    `
    );
  });

  test("imported names are discovered", function (assert) {
    let { desc } = describeESModule(`
      import { x } from 'somewhere';
    `);
    let out = declarationMap(desc).get("x");
    assert.equal(out?.region.bindingDescription.type, "import");
    if (out?.region.bindingDescription.type === "import") {
      assert.equal(out.region.bindingDescription.importIndex, 0);
      assert.equal(out.region.bindingDescription.importedName, "x");
    }
    assert.equal(desc.regions[documentPointer].dependsOn.size, 0);
  });

  test("imported namespace is discovered", function (assert) {
    let { desc } = describeESModule(`
      import * as x from 'somewhere';
    `);
    let out = declarationMap(desc).get("x");
    assert.equal(out?.region.bindingDescription.type, "import");
    if (out?.region.bindingDescription.type === "import") {
      assert.equal(out.region.bindingDescription.importIndex, 0);
      assert.equal(out.region.bindingDescription.importedName, NamespaceMarker);
    }
    assert.equal(desc.regions[documentPointer].dependsOn.size, 0);
  });

  test("default imported names are discovered", function (assert) {
    let { desc } = describeESModule(`
      import x from 'somewhere';
    `);
    let out = declarationMap(desc).get("x");
    assert.equal(out?.region.bindingDescription.type, "import");
    if (out?.region.bindingDescription.type === "import") {
      assert.equal(out.region.bindingDescription.importIndex, 0);
      assert.equal(out.region.bindingDescription.importedName, "default");
    }
    assert.equal(desc.regions[documentPointer].dependsOn.size, 0);
  });

  test("local names are discovered", function (assert) {
    let { desc } = describeESModule(`
      function x() {}
      export {};
    `);
    assert.equal(
      declarationMap(desc).get("x")?.region.bindingDescription.type,
      "local"
    );
  });

  test("local function is used by export", function (assert) {
    let { desc } = describeESModule(`
      function x() {}
      export function y() {
        return x();
      }
    `);
    let out = declarationMap(desc).get("y");
    assert.equal(out?.region.bindingDescription.type, "local");
    if (out?.region.bindingDescription.type === "local") {
      assert.ok(
        [...out.region.dependsOn]
          .map(
            (p) =>
              (desc.regions[p] as DeclarationCodeRegion)?.bindingDescription
                .declaredName
          )
          .includes("x")
      );
    }
  });

  test("local function is used by module", function (assert) {
    let { desc } = describeESModule(`
      function x() {}
      x();
      export {};
    `);
    let out = declarationMap(desc).get("x")!;
    let { pointer } = out;
    assert.equal(out.region.bindingDescription.type, "local");
    if (out?.region.bindingDescription.type === "local") {
      assert.equal(desc.regions[documentPointer].dependsOn.has(pointer), true);
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
    let out = declarationMap(desc).get("Q")!;
    let x = declarationMap(desc).get("x")!;
    let { pointer } = x;
    assert.equal(out.region.bindingDescription.type, "local");
    if (out.region.bindingDescription.type === "local") {
      assert.ok(out.region.dependsOn.has(pointer));
    }
    assert.ok(desc.exports.get("default")?.type === "local");
    assert.ok(
      (desc.exports.get("default") as
        | LocalExportDescription
        | ReexportExportDescription)?.name === "Q"
    );
  });

  skip("variables consumed in LVal", function (assert) {
    let { desc } = describeESModule(`
      let a = foo();
      let { x = a, y = x } = bar();
      export {};
    `);
    let out = declarationMap(desc).get("x")!;
    let { pointer: xPointer } = out;
    let a = declarationMap(desc).get("a")!;
    let { pointer: aPointer } = a;
    assert.ok(out.region.dependsOn.has(aPointer));

    out = declarationMap(desc).get("y")!;
    assert.ok(out.region.dependsOn.has(xPointer));
    assert.notOk(out.region.dependsOn.has(aPointer));
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
      editor.serialize(),
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
    assert.ok(!declarationMap(desc).has("a"));
  });

  test("function default arguments consume other bindings", function (assert) {
    let { desc } = describeESModule(`
      let a = 1;
      function x(y=a) {}
      export {};
    `);
    let out = declarationMap(desc).get("x")!;
    let a = declarationMap(desc).get("a")!;
    let { pointer } = a;
    assert.ok(out.region.dependsOn.has(pointer));
  });

  test("code regions for an imported name can be used to replace it", function (assert) {
    let { desc, editor } = describeESModule(`
      import { a, b as c, d as d } from "lib";
      export default function(a) {
        console.log(a);
      }
      console.log(a, c, d);
    `);
    keepAll(desc, editor);
    editor.rename("a", "alpha");
    editor.rename("c", "charlie");
    editor.rename("d", "delta");
    assert.codeEqual(
      editor.serialize(),
      `
      import { a as alpha, b as charlie, d as delta } from "lib";
      export default function(a) {
        console.log(a);
      }
      console.log(alpha, charlie, delta);
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
      editor.serialize(),
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
    assert.codeEqual(
      editor.serialize(),
      `
      const { a: alpha, b: charlie } = foo();
      console.log(alpha, charlie);
      export {};
    `
    );
  });

  test("code regions for a variable assign via an LVal AssignmentPattern can be used to replace it", function (assert) {
    let { desc, editor } = describeESModule(`
      const { a, b = a } = foo();
      console.log(a, b);
      export {};
    `);
    keepAll(desc, editor);
    editor.rename("a", "alpha");
    editor.rename("b", "bravo");
    assert.codeEqual(
      editor.serialize(),
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
      editor.serialize(),
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
      editor.serialize(),
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
      editor.serialize(),
      `
      let [{ x }, { y: yas }] = bar();
      console.log(yas);
      export {};
    `
    );
  });

  test("removing leading variable declaration from a list", function (assert) {
    let { desc, editor } = describeESModule(`
      let a = 1, b = 2;
      console.log(b);
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      let b = 2;
      console.log(b);
      export {};
    `
    );
  });

  test("removing trailing variable declaration from a list", function (assert) {
    let { desc, editor } = describeESModule(`
      let a = 1, b = 2;
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("b");
    assert.codeEqual(
      editor.serialize(),
      `
      let a = 1;
      export {};
    `
    );
  });

  test("removing adjacent variable declarations from a list", function (assert) {
    let { desc, editor } = describeESModule(`
      let a = 1, b = 2, c = 3, d = 4;
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("b");
    editor.removeDeclaration("c");
    assert.codeEqual(
      editor.serialize(),
      `
      let a = 1, d = 4;
      export {};
    `
    );
  });

  test("removing first 2 adjacent variable declarations from a list", function (assert) {
    let { desc, editor } = describeESModule(`
      let a = 1, b = 2, c = 3, d = 4;
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("a");
    editor.removeDeclaration("b");
    assert.codeEqual(
      editor.serialize(),
      `
      let c = 3, d = 4;
      export {};
    `
    );
  });

  test("removing a declaration from a list that includes a mix of LVal and non-LVal declarations", function (assert) {
    let { desc, editor } = describeESModule(`
      let { a } = foo, b = 2, { c } = blah, d = 4;
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("b");
    editor.removeDeclaration("c");
    assert.codeEqual(
      editor.serialize(),
      `
      let { a } = foo, d = 4;
      export {};
      `
    );
  });

  test("removing all variable declarations", function (assert) {
    let { desc, editor } = describeESModule(`
      let a = 1;
      console.log(2);
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      console.log(2);
      export {};
    `
    );
  });

  test("removing all variable declarations in an LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let [ ...{ ...a } ] = foo;
      console.log(2);
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      console.log(2);
      export {};
    `
    );
  });

  test("removing a renamed variable declaration in an ObjectPattern LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let { x, y: a } = foo;
      console.log(2);
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      let { x } = foo;
      console.log(2);
      export {};
    `
    );
  });

  test("removing a variable declaration in a nested ObjectPattern LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let { x, y: { a } } = foo;
      console.log(2);
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      let { x } = foo;
      console.log(2);
      export {};
    `
    );
  });

  test("removing a variable declaration in an ArrayPattern LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let [ x, y, z ] = foo;
      console.log(2);
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("x");
    editor.removeDeclaration("y");
    assert.codeEqual(
      editor.serialize(),
      `
      let [ , , z ] = foo;
      console.log(2);
      export {};
    `
    );
  });

  test("removing a variable declaration in a nested ArrayPattern LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let [ x, [ a ] ] = foo;
      console.log(2);
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      let [ x ] = foo;
      console.log(2);
      export {};
    `
    );
  });

  test("removing a variable declaration in a RestElement LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let [ x, ...y ] = foo;
      console.log(2);
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("y");
    assert.codeEqual(
      editor.serialize(),
      `
      let [ x ] = foo;
      console.log(2);
      export {};
    `
    );
  });

  test("removing a variable declaration in a nested RestElement LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let [ x, ...[ ...y ]] = foo;
      console.log(2);
      export {};
      `);
    keepAll(desc, editor);
    editor.removeDeclaration("y");
    assert.codeEqual(
      editor.serialize(),
      `
      let [ x ] = foo;
      console.log(2);
      export {};
    `
    );
  });

  test("removing a variable declaration in an AssignmentPattern LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let { x, y = 1 } = foo;
      console.log(2);
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("y");
    assert.codeEqual(
      editor.serialize(),
      `
      let { x } = foo;
      console.log(2);
      export {};
    `
    );
  });

  test("removing a variable declaration in a nested AssignmentPattern LVal", function (assert) {
    let { desc, editor } = describeESModule(`
      let { x, b: [ y = 1 ] } = foo;
      console.log(2);
      export {};
    `);
    keepAll(desc, editor);
    editor.removeDeclaration("y");
    assert.codeEqual(
      editor.serialize(),
      `
      let { x } = foo;
      console.log(2);
      export {};
    `
    );
  });

  test("preserves side-effectful right-hand side when there is only one side effect at the beginning of the list", async function (assert) {
    let { desc, editor } = describeESModule(`
      let a = initCache(), b = true, c = 1, d = 'd', e = null, f = undefined, g = function() {}, h = class foo {};
      export {};
    `);
    keepAll(desc, editor);

    editor.removeDeclaration("a");
    editor.removeDeclaration("b");
    editor.removeDeclaration("c");
    editor.removeDeclaration("d");
    editor.removeDeclaration("e");
    editor.removeDeclaration("f");
    editor.removeDeclaration("g");
    editor.removeDeclaration("h");

    assert.codeEqual(
      editor.serialize(),
      `
      initCache();
      export {};
      `
    );
  });

  test("preserves side-effectful right-hand side when there is only one side effect at the end of the list", async function (assert) {
    let { desc, editor } = describeESModule(`
      let b = true, c = 1, d = 'd', e = null, f = undefined, g = function() {}, h = class foo {}, a = initCache();
      export {};
      `);
    keepAll(desc, editor);

    editor.removeDeclaration("a");
    editor.removeDeclaration("b");
    editor.removeDeclaration("c");
    editor.removeDeclaration("d");
    editor.removeDeclaration("e");
    editor.removeDeclaration("f");
    editor.removeDeclaration("g");
    editor.removeDeclaration("h");

    assert.codeEqual(
      editor.serialize(),
      `
      initCache();
      export {};
      `
    );
  });

  test("preserves side-effectful right-hand side when there is only one side effect in the middle of the list", async function (assert) {
    let { desc, editor } = describeESModule(`
      let b = true, c = 1, d = 'd', e = null, a = initCache(), f = undefined, g = function() {}, h = class foo {};
      export {};
    `);
    keepAll(desc, editor);

    editor.removeDeclaration("a");
    editor.removeDeclaration("b");
    editor.removeDeclaration("c");
    editor.removeDeclaration("d");
    editor.removeDeclaration("e");
    editor.removeDeclaration("f");
    editor.removeDeclaration("g");
    editor.removeDeclaration("h");

    assert.codeEqual(
      editor.serialize(),
      `
      initCache();
      export {};
      `
    );
  });

  test("preserves side-effectful right-hand side when there are multiple effects in the list", async function (assert) {
    let { desc, editor } = describeESModule(`
      let a = initACache(), b = true, c = 1, d = 'd', e = initECache(), f = undefined, g = function() {}, h = class foo {};
      export {};
    `);
    keepAll(desc, editor);

    editor.removeDeclaration("a");
    editor.removeDeclaration("b");
    editor.removeDeclaration("c");
    editor.removeDeclaration("d");
    editor.removeDeclaration("e");
    editor.removeDeclaration("f");
    editor.removeDeclaration("g");
    editor.removeDeclaration("h");

    assert.codeEqual(
      editor.serialize(),
      `
      let unused0 = initACache(), unused1 = initECache();
      export {};
      `
    );
  });

  test("preserves side-effectful right-hand side when it is the only declarator in a declaration", async function (assert) {
    let { desc, editor } = describeESModule(`
      let a = initCache();
      export {};
    `);
    keepAll(desc, editor);

    editor.removeDeclaration("a");

    assert.codeEqual(
      editor.serialize(),
      `
      initCache();
      export {};
      `
    );
  });

  test("preserves side-effectful right-hand side for ObjectPatten LVal", async function (assert) {
    let { desc, editor } = describeESModule(`
      let { x } = initCache();
      export {};
    `);
    keepAll(desc, editor);

    editor.removeDeclaration("x");

    assert.codeEqual(
      editor.serialize(),
      `
      let { x: unused0 } = initCache();
      export {};
      `
    );
  });

  test("preserves side-effectful right-hand side for ArrayPatten LVal", async function (assert) {
    let { desc, editor } = describeESModule(`
      let [ x ] = initCache();
      export {};
    `);
    keepAll(desc, editor);

    editor.removeDeclaration("x");

    assert.codeEqual(
      editor.serialize(),
      `
      let [ unused0 ] = initCache();
      export {};
      `
    );
  });

  test("preserves side-effectful right-hand side for RestElement LVal", async function (assert) {
    let { desc, editor } = describeESModule(`
      let { a: [ ...x ] } = initCache();
      export {};
    `);
    keepAll(desc, editor);

    editor.removeDeclaration("x");

    assert.codeEqual(
      editor.serialize(),
      `
      let { a: [ ...unused0 ] }= initCache();
      export {};
      `
    );
  });

  test("preserves side-effectful right-hand side for multiple LVal identifiers", async function (assert) {
    let { desc, editor } = describeESModule(`
      let { x, y } = initCache();
      export {};
    `);
    keepAll(desc, editor);

    editor.removeDeclaration("x");
    editor.removeDeclaration("y");

    assert.codeEqual(
      editor.serialize(),
      `
      let { x: unused0, y: unused1 } = initCache();
      export {};
      `
    );
  });

  test("preserves side-effectful initializer in LVal", async function (assert) {
    let { desc, editor } = describeESModule(`
      let { x = initCache() } = foo;
      export {};
    `);
    keepAll(desc, editor);

    editor.removeDeclaration("x");

    assert.codeEqual(
      editor.serialize(),
      `
      let { x: unused0 = initCache() } = foo;
      export {};
      `
    );
  });

  test("preserves side-effectful initializer in list that includes side-effectful LVal", async function (assert) {
    let { desc, editor } = describeESModule(`
      let { x = initCache() } = foo, y = 1, z = initZCache();
      export {};
    `);
    keepAll(desc, editor);

    editor.removeDeclaration("x");
    editor.removeDeclaration("y");
    editor.removeDeclaration("z");

    assert.codeEqual(
      editor.serialize(),
      `
      let { x: unused0 = initCache() } = foo, unused1 = initZCache();
      export {};
      `
    );
  });

  test("rename an exported const", async function (assert) {
    let { desc, editor } = describeESModule(`export const a = 'a';`);
    keepAll(desc, editor);
    editor.rename("a", "a0");
    assert.codeEqual(editor.serialize(), `export const a0 = 'a';`);
  });
});
