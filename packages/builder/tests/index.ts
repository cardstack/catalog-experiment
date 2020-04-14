import "qunit";
import "qunit/qunit/qunit.css";

QUnit.test("hello test", function (assert) {
  assert.ok(1 == "1", "Passed!");
});

QUnit.test("can ", function (assert) {});

QUnit.start();
