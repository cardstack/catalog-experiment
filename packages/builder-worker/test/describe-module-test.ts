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
      assert.equal(out.declaration.start, 0);
      assert.equal(out.declaration.end, 15);
      assert.equal(out.references.length, 2);
      assert.equal(out.references[0].start, 9);
      assert.equal(out.references[0].end, 10);
      assert.equal(out.references[1].start, 22);
      assert.equal(out.references[1].end, 23);
    }
  });

  test("local function is used by default export", function (assert) {
    let desc = describeModule(`
      function x() {}
      export default class {
        constructor() {
          x();
        }
      }
    `);
    let out = desc.names.get("default");
    assert.equal(out?.type, "local");
    if (out?.type === "local") {
      assert.ok(out.dependsOn.has("x"));
    }
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
});
