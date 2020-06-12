import {
  describeModule as astDescribeModule,
  ModuleDescription,
  NamespaceMarker,
} from "../src/describe-module";
import { RegionEditor } from "../src/code-region";
import { parse } from "@babel/core";

const { test, skip } = QUnit;

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
    editor: new RegionEditor(js, desc),
  };
}

QUnit.module("describe-module", function () {
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
    assert.deepEqual(
      desc.exports.get("foo"),
      { type: "reexport", name: "foo", importIndex: 0 },
      "foo is not named"
    );
    assert.deepEqual(
      desc.exports.get("y"),
      { type: "reexport", importIndex: 1, name: "x" },
      "y is a reexport"
    );
  });

  test("export name is different than module-scoped name", function (assert) {
    let { desc } = describeModule(`
      const a = 1;
      export { a as b };
    `);
    assert.ok(desc.exports.has("b"), "b in exportedNames");
    assert.ok(!desc.exports.has("a"), "a not in exportedNames");
    assert.deepEqual(
      desc.exports.get("b"),
      { type: "local", name: "a" },
      "we can see that b comes from a"
    );
  });

  test("default export function", function (assert) {
    let { desc } = describeModule(`
    export default function x() {}
  `);
    assert.deepEqual(desc.exports.get("default"), { type: "local", name: "x" });
    assert.equal(desc.names.get("x")?.type, "local");
  });

  test("default export class", function (assert) {
    let { desc } = describeModule(`
    export default class x {}
  `);
    assert.deepEqual(desc.exports.get("default"), { type: "local", name: "x" });
    assert.equal(desc.names.get("x")?.type, "local");
  });

  test("default export with no local name", function (assert) {
    let { desc } = describeModule(`
    export default foo();
  `);
    assert.deepEqual(desc.exports.get("default"), {
      type: "local",
      name: "default",
    });
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
    `);
    editor.rename("x", "y");
    assert.codeEqual(
      editor.serialize(),
      `
      console.log(1);
      function y() {}
      y();
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
    `
    );
  });

  test("pattern in function arguments doesn't create module scoped binding", function (assert) {
    let { desc } = describeModule(`
      function x({ a }) {}
    `);
    assert.ok(!desc.names.has("a"));
  });

  test("function default arguments consume other bindings", function (assert) {
    let { desc } = describeModule(`
      let a = 1;
      function x(a=a) {}
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
    `);
    editor.rename("a", "alpha");
    editor.rename("c", "charlie");
    assert.codeEqual(
      editor.serialize(),
      `
      const { a: alpha, b: charlie } = foo();
      console.log(alpha, charlie);
    `
    );
  });

  test("code regions for a variable assign via an LVal AssignmentPattern can be used to replace it", function (assert) {
    let { editor } = describeModule(`
      const { a, b = a } = foo();
      console.log(a, b);
    `);
    editor.rename("a", "alpha");
    editor.rename("b", "bravo");
    assert.codeEqual(
      editor.serialize(),
      `
      const { a: alpha, b: bravo = alpha } = foo();
      console.log(alpha, bravo);
    `
    );
  });

  test("code regions for a variable assign via an LVal AssignmentPattern with shorthand can be used to replace it", function (assert) {
    let { editor } = describeModule(`
      const { a, b: bravo = a } = foo();
      console.log(a, bravo);
    `);
    editor.rename("bravo", "b");
    assert.codeEqual(
      editor.serialize(),
      `
      const { a, b = a } = foo();
      console.log(a, b);
    `
    );
  });

  test("code regions for a MemberExpression can be used to replace it", function (assert) {
    let { editor } = describeModule(`
      const bar = makeBar();
      const { a, b = bar.blah } = foo();
      console.log(a, bar.blurb);
    `);
    editor.rename("bar", "bleep");
    assert.codeEqual(
      editor.serialize(),
      `
      const bleep = makeBar();
      const { a, b = bleep.blah } = foo();
      console.log(a, bleep.blurb);
    `
    );
  });

  test("code regions for nested ObjectPattern can be used to replace it", function (assert) {
    let { editor } = describeModule(`
      let [{ x }, { y }] = bar();
      console.log(y);
    `);
    editor.rename("y", "yas");
    assert.codeEqual(
      editor.serialize(),
      `
      let [{ x }, { y: yas }] = bar();
      console.log(yas);
    `
    );
  });

  test("removing one variable declaration from a list", function (assert) {
    let { editor } = describeModule(`
      let a = 1, b = 2;
      console.log(b);
    `);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      let b = 2;
      console.log(b);
    `
    );
  });

  test("removing all variable declarations", function (assert) {
    let { editor } = describeModule(`
      let a = 1;
      console.log(2);
    `);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      console.log(2);
    `
    );
  });

  test("removing all variable declarations in an LVal", function (assert) {
    let { editor } = describeModule(`
      let [ ...{ ...a } ] = foo;
      console.log(2);
    `);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      console.log(2);
    `
    );
  });

  test("removing a renamed variable declaration in an ObjectPattern LVal", function (assert) {
    let { editor } = describeModule(`
      let { x, y: a } = foo;
      console.log(2);
    `);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      let { x } = foo;
      console.log(2);
    `
    );
  });

  test("removing a variable declaration in a nested ObjectPattern LVal", function (assert) {
    let { editor } = describeModule(`
      let { x, y: { a } } = foo;
      console.log(2);
    `);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      let { x } = foo;
      console.log(2);
    `
    );
  });

  test("removing a variable declaration in an ArrayPattern LVal", function (assert) {
    let { editor } = describeModule(`
      let [ x, y ] = foo;
      console.log(2);
    `);
    editor.removeDeclaration("x");
    assert.codeEqual(
      editor.serialize(),
      `
      let [ , y ] = foo;
      console.log(2);
    `
    );
  });

  test("removing a variable declaration in a nested ArrayPattern LVal", function (assert) {
    let { editor } = describeModule(`
      let [ x, [ a ] ] = foo;
      console.log(2);
    `);
    editor.removeDeclaration("a");
    assert.codeEqual(
      editor.serialize(),
      `
      let [ x ] = foo;
      console.log(2);
    `
    );
  });

  test("removing a variable declaration in a RestElement LVal", function (assert) {
    let { editor } = describeModule(`
      let [ x, ...y ] = foo;
      console.log(2);
    `);
    editor.removeDeclaration("y");
    assert.codeEqual(
      editor.serialize(),
      `
      let [ x ] = foo;
      console.log(2);
    `
    );
  });

  test("removing a variable declaration in a nested RestElement LVal", function (assert) {
    let { editor } = describeModule(`
      let [ x, ...[ ...y ]] = foo;
      console.log(2);
    `);
    editor.removeDeclaration("y");
    assert.codeEqual(
      editor.serialize(),
      `
      let [ x ] = foo;
      console.log(2);
    `
    );
  });

  test("removing a variable declaration in an AssignmentPattern LVal", function (assert) {
    let { editor } = describeModule(`
      let { x, y = 1 } = foo;
      console.log(2);
    `);
    editor.removeDeclaration("y");
    assert.codeEqual(
      editor.serialize(),
      `
      let { x } = foo;
      console.log(2);
    `
    );
  });

  test("removing a variable declaration in a nested AssignmentPattern LVal", function (assert) {
    let { editor } = describeModule(`
      let { x, b: [ y = 1 ] } = foo;
      console.log(2);
    `);
    editor.removeDeclaration("y");
    assert.codeEqual(
      editor.serialize(),
      `
      let { x } = foo;
      console.log(2);
    `
    );
  });
});
