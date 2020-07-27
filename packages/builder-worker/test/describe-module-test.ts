import {
  describeModule as astDescribeModule,
  ModuleDescription,
  NamespaceMarker,
} from "../src/describe-module";
import { RegionEditor } from "../src/code-region";
import { parse } from "@babel/core";

const { test, skip } = QUnit;

let unusedNameNonce = 0;

function describeModule(
  js: string
): { desc: ModuleDescription; editor: RegionEditor } {
  js = js.trim();
  let parsed = parse(js);
  if (parsed?.type !== "File") {
    throw new Error(`unexpected babel output`);
  }
  let desc = astDescribeModule(parsed);
  return {
    desc,
    editor: new RegionEditor(js, desc, () => `unused${unusedNameNonce++}`),
  };
}

QUnit.module("describe-module", function (hooks) {
  hooks.beforeEach(() => {
    unusedNameNonce = 0;
  });

  // This tests our CJS detection logic. Eventually we will stop throwing and
  // start analyzing this code.
  test("throws when file does not appear to be an ES6 module", function (assert) {
    try {
      describeModule(`
        console.log('i need to import or export something in order to be considered an ES6 module');
      `);
      throw new Error(`should not be able to describeModule()`);
    } catch (e) {
      assert.equal(
        Boolean(e.message.match(/not an ES6 module/)),
        true,
        "throws when describing non-ES6 module"
      );
    }
  });

  test("pure reexport examples", function (assert) {
    let { desc } = describeModule(`
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

    let exportDesc = desc.exports.get("foo")!;
    assert.equal(exportDesc.type, "reexport");
    assert.equal(exportDesc.name, "foo", "foo is not named");
    if (exportDesc.type === "reexport") {
      assert.equal(exportDesc.importIndex, 0);
    }

    exportDesc = desc.exports.get("y")!;
    assert.equal(exportDesc.type, "reexport", "y is a reexport");
    assert.equal(exportDesc.name, "x");
    if (exportDesc.type === "reexport") {
      assert.equal(exportDesc.importIndex, 1);
    }
  });

  test("export name is different than module-scoped name", function (assert) {
    let { desc } = describeModule(`
      const a = 1;
      export { a as b };
    `);
    assert.ok(desc.exports.has("b"), "b in exportedNames");
    assert.ok(!desc.exports.has("a"), "a not in exportedNames");
    let exportDesc = desc.exports.get("b")!;
    assert.equal(exportDesc.type, "local");
    assert.equal(exportDesc.name, "a", "we can see that b comes from a");
  });

  test("default export function", function (assert) {
    let { desc } = describeModule(`
    export default function x() {}
  `);
    let exportDesc = desc.exports.get("default")!;
    assert.equal(exportDesc.type, "local");
    assert.equal(exportDesc.name, "x");
    assert.equal(desc.names.get("x")?.type, "local");
  });

  test("default export class", function (assert) {
    let { desc } = describeModule(`
    export default class x {}
  `);
    let exportDesc = desc.exports.get("default")!;
    assert.equal(exportDesc.type, "local");
    assert.equal(exportDesc.name, "x");
    assert.equal(desc.names.get("x")?.type, "local");
  });

  test("default export with no local name", function (assert) {
    let { desc } = describeModule(`
    export default foo();
  `);
    let exportDesc = desc.exports.get("default")!;
    assert.equal(exportDesc.type, "local");
    assert.equal(exportDesc.name, "default");
    assert.ok(desc.names.get("default")?.dependsOn.has("foo"));
  });

  test("renaming local side of export", function (assert) {
    let { editor } = describeModule(`
      function x() {}
      export { x };
    `);
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
    let { desc } = describeModule(`
      import { x } from 'somewhere';
    `);
    let out = desc.names.get("x");
    assert.equal(out?.type, "import");
    if (out?.type === "import") {
      assert.equal(out.importIndex, 0);
      assert.equal(out.name, "x");
    }
  });

  test("imported namespace are discovered", function (assert) {
    let { desc } = describeModule(`
      import * as x from 'somewhere';
    `);
    let out = desc.names.get("x");
    assert.equal(out?.type, "import");
    if (out?.type === "import") {
      assert.equal(out.importIndex, 0);
      assert.equal(out.name, NamespaceMarker);
    }
  });

  test("default imported names are discovered", function (assert) {
    let { desc } = describeModule(`
      import x from 'somewhere';
    `);
    let out = desc.names.get("x");
    assert.equal(out?.type, "import");
    if (out?.type === "import") {
      assert.equal(out.importIndex, 0);
      assert.equal(out.name, "default");
    }
  });

  test("local names are discovered", function (assert) {
    let { desc } = describeModule(`
      function x() {}
      export {};
    `);
    assert.equal(desc.names.get("x")?.type, "local");
  });

  test("local function is used by export", function (assert) {
    let { desc } = describeModule(`
      function x() {}
      export function y() {
        return x();
      }
    `);
    let out = desc.names.get("y");
    assert.equal(out?.type, "local");
    if (out?.type === "local") {
      assert.ok(out.dependsOn.has("x"));
    }
  });

  test("local function is used by module", function (assert) {
    let { desc } = describeModule(`
      function x() {}
      x();
      export {};
    `);
    let out = desc.names.get("x");
    assert.equal(out?.type, "local");
    if (out?.type === "local") {
      assert.equal(out.usedByModule, true);
    }
  });

  test("local function is used by default export", function (assert) {
    let { desc } = describeModule(`
      function x() {}
      export default class Q {
        constructor() {
          x();
        }
      }
    `);
    let out = desc.names.get("Q");
    assert.equal(out?.type, "local");
    if (out?.type === "local") {
      assert.ok(out.dependsOn.has("x"));
    }
    assert.ok(desc.exports.get("default")?.type === "local");
    assert.ok(desc.exports.get("default")?.name === "Q");
  });

  skip("variables consumed in LVal", function (assert) {
    let { desc } = describeModule(`
      let a = foo();
      let { x = a, y = x } = bar();
      export {};
    `);
    let out = desc.names.get("x")!;
    assert.ok(out.dependsOn.has("a"));

    out = desc.names.get("y")!;
    assert.ok(out.dependsOn.has("x"));
    assert.notOk(out.dependsOn.has("a"));
  });

  test("renaming a function declaration", function (assert) {
    let { editor } = describeModule(`
      console.log(1);
      function x() {}
      x();
      export {};
    `);
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

  test("removing a function declaration", function (assert) {
    let { editor } = describeModule(`
      console.log(1);
      function a() {}
      function x() {}
      function y() {}
      a();
      y();
      export {};
    `);
    editor.removeDeclaration("x");
    assert.codeEqual(
      editor.serialize(),
      `
      console.log(1);
      function a() {}
      function y() {}
      a();
      y();
      export {};
    `
    );
  });

  test("pattern in function arguments doesn't create module scoped binding", function (assert) {
    let { desc } = describeModule(`
      function x({ a }) {}
      export {};
    `);
    assert.ok(!desc.names.has("a"));
  });

  test("function default arguments consume other bindings", function (assert) {
    let { desc } = describeModule(`
      let a = 1;
      function x(a=a) {}
      export {};
    `);
    let out = desc.names.get("x");
    assert.ok(out?.dependsOn.has("a"));
  });

  test("code regions for an imported name can be used to replace it", function (assert) {
    let { editor } = describeModule(`
      import { a, b as c, d as d } from "lib";
      export default function(a) {
        console.log(a);
      }
      console.log(a, c, d);
    `);
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
    let { editor } = describeModule(`
      const a = 1;
      export default function(a) {
        console.log(a);
      }
      console.log(a);
    `);
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
    let { editor } = describeModule(`
      const { a, b: c } = foo();
      console.log(a, c);
      export {};
    `);
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
    let { editor } = describeModule(`
      const { a, b = a } = foo();
      console.log(a, b);
      export {};
    `);
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
    let { editor } = describeModule(`
      const { a, b: bravo = a } = foo();
      console.log(a, bravo);
      export {};
    `);
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
    let { editor } = describeModule(`
      const bar = makeBar();
      const { a, b = bar.blah } = foo();
      console.log(a, bar.blurb);
      export {};
    `);
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
    let { editor } = describeModule(`
      let [{ x }, { y }] = bar();
      console.log(y);
      export {};
    `);
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
    let { editor } = describeModule(`
      let a = 1, b = 2;
      console.log(b);
      export {};
    `);
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
    let { editor } = describeModule(`
      let a = 1, b = 2;
      export {};
    `);
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
    let { editor } = describeModule(`
      let a = 1, b = 2, c = 3, d = 4;
      export {};
    `);
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
    let { editor } = describeModule(`
      let a = 1, b = 2, c = 3, d = 4;
      export {};
    `);
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
    let { editor } = describeModule(`
      let { a } = foo, b = 2, { c } = blah, d = 4;
      export {};
    `);
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
    let { editor } = describeModule(`
      let a = 1;
      console.log(2);
      export {};
    `);
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
    let { editor } = describeModule(`
      let [ ...{ ...a } ] = foo;
      console.log(2);
      export {};
    `);
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
    let { editor } = describeModule(`
      let { x, y: a } = foo;
      console.log(2);
      export {};
    `);
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
    let { editor } = describeModule(`
      let { x, y: { a } } = foo;
      console.log(2);
      export {};
    `);
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
    let { editor } = describeModule(`
      let [ x, y, z ] = foo;
      console.log(2);
      export {};
    `);
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
    let { editor } = describeModule(`
      let [ x, [ a ] ] = foo;
      console.log(2);
      export {};
    `);
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
    let { editor } = describeModule(`
      let [ x, ...y ] = foo;
      console.log(2);
      export {};
    `);
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
    let { editor } = describeModule(`
      let [ x, ...[ ...y ]] = foo;
      console.log(2);
      export {};
    `);
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
    let { editor } = describeModule(`
      let { x, y = 1 } = foo;
      console.log(2);
      export {};
    `);
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
    let { editor } = describeModule(`
      let { x, b: [ y = 1 ] } = foo;
      console.log(2);
      export {};
    `);
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
    let { editor } = describeModule(`
      let a = initCache(), b = true, c = 1, d = 'd', e = null, f = undefined, g = function() {}, h = class foo {};
      export {};
    `);

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
    let { editor } = describeModule(`
      let b = true, c = 1, d = 'd', e = null, f = undefined, g = function() {}, h = class foo {}, a = initCache();
      export {};
    `);

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
    let { editor } = describeModule(`
      let b = true, c = 1, d = 'd', e = null, a = initCache(), f = undefined, g = function() {}, h = class foo {};
      export {};
    `);

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
    let { editor } = describeModule(`
      let a = initACache(), b = true, c = 1, d = 'd', e = initECache(), f = undefined, g = function() {}, h = class foo {};
      export {};
    `);

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
    let { editor } = describeModule(`
      let a = initCache();
      export {};
    `);

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
    let { editor } = describeModule(`
      let { x } = initCache();
      export {};
    `);

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
    let { editor } = describeModule(`
      let [ x ] = initCache();
      export {};
    `);

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
    let { editor } = describeModule(`
      let { a: [ ...x ] } = initCache();
      export {};
    `);

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
    let { editor } = describeModule(`
      let { x, y } = initCache();
      export {};
    `);

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
    let { editor } = describeModule(`
      let { x = initCache() } = foo;
      export {};
    `);

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
    let { editor } = describeModule(`
      let { x = initCache() } = foo, y = 1, z = initZCache();
      export {};
    `);

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
    let { editor } = describeModule(`export const a = 'a';`);
    editor.rename("a", "a0");
    assert.codeEqual(editor.serialize(), `export const a0 = 'a';`);
  });
});
