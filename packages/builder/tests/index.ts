import "qunit";
import "qunit/qunit/qunit.css";
import { installFileAssertions } from "./file-assertions";

QUnit.module("module rewriter", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  test("file existence assertions are working", async (assert) => {
    await assert.setupFiles({
      "a.js": "export const alpha = 1;",
    });
    await assert.file("a.js").exists();
    await assert.file("b.js").doesNotExist();
  });

  test("file content assertions are working", async (assert) => {
    await assert.setupFiles({
      "a.js": "export const alpha = 1;",
    });
    await assert.file("a.js").matches(/const alpha/);
    await assert.file("a.js").doesNotMatch(/const beta/);
  });
});

QUnit.start();
