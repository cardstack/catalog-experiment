import {
  describeModule as astDescribeModule,
  ModuleDescription,
  NamespaceMarker,
} from "../src/describe-module";
import { parse } from "@babel/core";

const { test } = QUnit;

function describeModule(js: string): ModuleDescription {
  let parsed = parse(js.trim());
  if (parsed?.type !== "File") {
    throw new Error(`unexpected babel output`);
  }
  return astDescribeModule(parsed);
}

QUnit.module("describe-module", function () {
  test("pure reexport examples", function (assert) {
    let desc = describeModule(`
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
    let desc = describeModule(`
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
    let desc = describeModule(`
    export default function x() {}
  `);
    assert.deepEqual(desc.exports.get("default"), { type: "local", name: "x" });
    assert.equal(desc.names.get("x")?.type, "local");
  });

  test("default export class", function (assert) {
    let desc = describeModule(`
    export default class x {}
  `);
    assert.deepEqual(desc.exports.get("default"), { type: "local", name: "x" });
    assert.equal(desc.names.get("x")?.type, "local");
  });

  test("default export with no local name", function (assert) {
    let desc = describeModule(`
    export default foo();
  `);
    assert.deepEqual(desc.exports.get("default"), {
      type: "local",
      name: "default",
    });
    assert.ok(desc.names.get("default")?.dependsOn.has("foo"));
  });

  test("imported names are discovered", function (assert) {
    let desc = describeModule(`
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
    let desc = describeModule(`
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
    let desc = describeModule(`
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
    let desc = describeModule(`
      function x() {}
    `);
    assert.equal(desc.names.get("x")?.type, "local");
  });

  test("local function is used by export", function (assert) {
    let desc = describeModule(`
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
    let desc = describeModule(`
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
    let desc = describeModule(`
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

  test("regions for function declaration", function (assert) {
    let desc = describeModule(`
      function x() {}
      x();
    `);
    let out = desc.names.get("x")!;
    assert.equal(out.declaration.start, 0);
    assert.equal(out.declaration.end, 15);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 9);
    assert.equal(out.references[0].end, 10);
    assert.equal(out.references[1].start, 22);
    assert.equal(out.references[1].end, 23);
  });

  test("regions for variable declaration", function (assert) {
    let desc = describeModule(`
      const a = 1;
      export { a as b };
    `);
    let out = desc.names.get("a")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 6);
    assert.equal(out.declaration.end, 11);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 6);
    assert.equal(out.references[0].end, 7);
    assert.equal(out.references[1].start, 28);
    assert.equal(out.references[1].end, 29);
  });

  test("regions for class declaration", function (assert) {
    let desc = describeModule(`
      class A {};
      export { A as B };
    `);
    let out = desc.names.get("A")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 0);
    assert.equal(out.declaration.end, 10);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 6);
    assert.equal(out.references[0].end, 7);
    assert.equal(out.references[1].start, 27);
    assert.equal(out.references[1].end, 28);
  });

  test("regions for import specifier", function (assert) {
    let desc = describeModule(`
      import { x, y } from 'somewhere';
      console.log(x);
    `);
    let out = desc.names.get("x")!;
    debugger;
    assert.ok(out);
    assert.equal(out.declaration.start, 9);
    assert.equal(out.declaration.end, 10);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 9);
    assert.equal(out.references[0].end, 10);
    assert.equal(out.references[1].start, 52);
    assert.equal(out.references[1].end, 53);
  });

  test("regions for renamed import specifier", function (assert) {
    let desc = describeModule(`
      import { blah as x, y } from 'somewhere';
      console.log(x);
    `);
    let out = desc.names.get("x")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 9);
    assert.equal(out.declaration.end, 18);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 17);
    assert.equal(out.references[0].end, 18);
    assert.equal(out.references[1].start, 60);
    assert.equal(out.references[1].end, 61);
  });

  test("regions for default import specifier", function (assert) {
    let desc = describeModule(`
      import X, { foo } from 'somewhere';
      console.log(X.bar());
    `);
    let out = desc.names.get("X")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 7);
    assert.equal(out.declaration.end, 8);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 7);
    assert.equal(out.references[0].end, 8);
    assert.equal(out.references[1].start, 54);
    assert.equal(out.references[1].end, 55);
  });

  test("regions for namespace import specifier", function (assert) {
    let desc = describeModule(`
      import * as foo from 'somewhere';
      console.log(foo.bar());
    `);
    let out = desc.names.get("foo")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 7);
    assert.equal(out.declaration.end, 15);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 12);
    assert.equal(out.references[0].end, 15);
    assert.equal(out.references[1].start, 52);
    assert.equal(out.references[1].end, 55);
  });

  test("region for default export declaration", function (assert) {
    let desc = describeModule(`
      export default function() {}
    `);
    let out = desc.names.get("default")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 15);
    assert.equal(out.declaration.end, 28);
    assert.equal(out.references.length, 0);
  });

  test("regions for ObjectPattern LVal", function (assert) {
    let desc = describeModule(`
      let { a, b: { c } } = foo;
      export { a as A };
    `);
    let out = desc.names.get("a")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 6);
    assert.equal(out.declaration.end, 7);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 6);
    assert.equal(out.references[0].end, 7);
    assert.equal(out.references[1].start, 42);
    assert.equal(out.references[1].end, 43);
  });

  test("regions for nested ObjectPattern LVal", function (assert) {
    let desc = describeModule(`
      let { a, b: { c } } = foo;
      export { c };
    `);
    let out = desc.names.get("c")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 14);
    assert.equal(out.declaration.end, 15);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 14);
    assert.equal(out.references[0].end, 15);
    assert.equal(out.references[1].start, 42);
    assert.equal(out.references[1].end, 43);
  });

  test("regions for renamed ObjectPattern LVal", function (assert) {
    let desc = describeModule(`
      let { a: A, b: { c } } = foo;
      export { A };
    `);
    let out = desc.names.get("A")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 6);
    assert.equal(out.declaration.end, 10);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 9);
    assert.equal(out.references[0].end, 10);
    assert.equal(out.references[1].start, 45);
    assert.equal(out.references[1].end, 46);
  });

  test("regions for ArrayPattern LVal", function (assert) {
    let desc = describeModule(`
      let [ a, { b } ] = foo;
      export { a };
    `);
    let out = desc.names.get("a")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 6);
    assert.equal(out.declaration.end, 7);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 6);
    assert.equal(out.references[0].end, 7);
    assert.equal(out.references[1].start, 39);
    assert.equal(out.references[1].end, 40);
  });

  test("regions for nested ArrayPattern LVal", function (assert) {
    let desc = describeModule(`
      let [ a, [ b ] ] = foo;
      export { b };
    `);
    let out = desc.names.get("b")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 11);
    assert.equal(out.declaration.end, 12);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 11);
    assert.equal(out.references[0].end, 12);
    assert.equal(out.references[1].start, 39);
    assert.equal(out.references[1].end, 40);
  });

  test("regions for RestElement LVal", function (assert) {
    let desc = describeModule(`
      let [ a, ...b ] = foo;
      export { b };
    `);
    let out = desc.names.get("b")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 9);
    assert.equal(out.declaration.end, 13);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 12);
    assert.equal(out.references[0].end, 13);
    assert.equal(out.references[1].start, 38);
    assert.equal(out.references[1].end, 39);
  });

  test("regions for nested RestElement LVal", function (assert) {
    let desc = describeModule(`
      let [ a, ...[b, ...c] ] = foo;
      export { c };
    `);
    let out = desc.names.get("c")!;
    assert.ok(out);
    assert.equal(out.declaration.start, 16);
    assert.equal(out.declaration.end, 20);
    assert.equal(out.references.length, 2);
    assert.equal(out.references[0].start, 19);
    assert.equal(out.references[0].end, 20);
    assert.equal(out.references[1].start, 46);
    assert.equal(out.references[1].end, 47);
  });

  test("pattern in function arguments doesn't create module scoped binding", function (assert) {
    let desc = describeModule(`
      function x({ a }) {}
    `);
    assert.ok(!desc.names.has("a"));
  });

  test("function default arguments consume other bindings", function (assert) {
    let desc = describeModule(`
      let a = 1;
      function x(a=a) {}
    `);
    let out = desc.names.get("x");
    assert.ok(out?.dependsOn.has("a"));
  });
});
