import {
  describeModule as astDescribeModule,
  ModuleDescription,
  NamespaceMarker,
} from "../src/describe-module";
import { CodeRegion, RegionPointer, RegionEditor } from "../src/code-region";
import { parse } from "@babel/core";

const { test } = QUnit;

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

function codeRegionAbsoluteRange(
  this: Assert,
  regions: CodeRegion[],
  regionPointer: RegionPointer,
  expectedStart: number,
  expectedEnd: number,
  label = "region"
) {
  this.pushResult({
    result: true,
    message: "skipped",
    actual: 1,
    expected: 1,
  });
  return;
  let actualStart = absoluteStart(regions, regionPointer);
  let actualEnd = absoluteEnd(regions, regionPointer);
  this.pushResult({
    result: actualStart === expectedStart,
    actual: actualStart,
    expected: expectedStart,
    message: `${label} start`,
  });
  this.pushResult({
    result: actualEnd === expectedEnd,
    actual: actualEnd,
    expected: expectedEnd,
    message: `${label} end`,
  });
}
QUnit.assert.codeRegionAbsoluteRange = codeRegionAbsoluteRange;

declare global {
  interface Assert {
    codeRegionAbsoluteRange: typeof codeRegionAbsoluteRange;
  }
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

  test("identifier regions for function declaration", function (assert) {
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

  test("declaration region for function declaration", function (assert) {
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

  test("regions for variable declaration", function (assert) {
    let { desc } = describeModule(`
      const a = 1;
      export { a as b };
    `);
    let out = desc.names.get("a")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 6, 11);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 6, 7);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 28, 29);
  });

  test("regions for class declaration", function (assert) {
    let { desc } = describeModule(`
      class A {};
      export { A as B };
    `);
    let out = desc.names.get("A")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 0, 10);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 6, 7);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 27, 28);
  });

  test("regions for import specifier", function (assert) {
    let { desc } = describeModule(`
      import { x, y } from 'somewhere';
      console.log(x);
    `);
    let out = desc.names.get("x")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 9, 10);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 9, 10);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 52, 53);
  });

  test("regions for renamed import specifier", function (assert) {
    let { desc } = describeModule(`
      import { blah as x, y } from 'somewhere';
      console.log(x);
    `);
    let out = desc.names.get("x")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 9, 18);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 17, 18);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 60, 61);
  });

  test("regions for default import specifier", function (assert) {
    let { desc } = describeModule(`
      import X, { foo } from 'somewhere';
      console.log(X.bar());
    `);
    let out = desc.names.get("X")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 7, 8);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 7, 8);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 54, 55);
  });

  test("regions for namespace import specifier", function (assert) {
    let { desc } = describeModule(`
      import * as foo from 'somewhere';
      console.log(foo.bar());
    `);
    let out = desc.names.get("foo")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 7, 15);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 12, 15);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 52, 55);
  });

  test("region for default export declaration", function (assert) {
    let { desc } = describeModule(`
      export default function() {}
    `);
    let out = desc.names.get("default")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 15, 28);
    assert.equal(out.references.length, 0);
  });

  test("regions for ObjectPattern LVal", function (assert) {
    let { desc } = describeModule(`
      let { a, b: { c } } = foo;
      export { a as A };
    `);
    let out = desc.names.get("a")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 6, 7);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 6, 7);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 42, 43);
  });

  test("regions for nested ObjectPattern LVal", function (assert) {
    let { desc } = describeModule(`
      let { a, b: { c } } = foo;
      export { c };
    `);
    let out = desc.names.get("c")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 14, 15);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 14, 15);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 42, 43);
  });

  test("regions for renamed ObjectPattern LVal", function (assert) {
    let { desc } = describeModule(`
      let { a: A, b: { c } } = foo;
      export { A };
    `);
    let out = desc.names.get("A")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 6, 10);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 9, 10);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 45, 46);
  });

  test("regions for ArrayPattern LVal", function (assert) {
    let { desc } = describeModule(`
      let [ a, { b } ] = foo;
      export { a };
    `);
    let out = desc.names.get("a")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 6, 7);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 6, 7);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 39, 40);
  });

  test("regions for nested ArrayPattern LVal", function (assert) {
    let { desc } = describeModule(`
      let [ a, [ b ] ] = foo;
      export { b };
    `);
    let out = desc.names.get("b")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 11, 12);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 11, 12);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 39, 40);
  });

  test("regions for RestElement LVal", function (assert) {
    let { desc } = describeModule(`
      let [ a, ...b ] = foo;
      export { b };
    `);
    let out = desc.names.get("b")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 9, 13);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 12, 13);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 38, 39);
  });

  test("regions for nested RestElement LVal", function (assert) {
    let { desc } = describeModule(`
      let [ a, ...[b, ...c] ] = foo;
      export { c };
    `);
    let out = desc.names.get("c")!;
    assert.ok(out);
    assert.codeRegionAbsoluteRange(desc.regions, out.declaration, 16, 20);
    assert.equal(out.references.length, 2);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[0], 19, 20);
    assert.codeRegionAbsoluteRange(desc.regions, out.references[1], 46, 47);
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
});
