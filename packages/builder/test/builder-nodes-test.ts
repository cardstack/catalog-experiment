import { installFileAssertions } from "./file-assertions";
import { Builder } from "../src/builder";
import {
  JSONParseNode,
  ConstantNode,
  HTMLEntrypointNode,
} from "../src/builder-nodes";
import { FileSystem } from "../src/filesystem";

QUnit.module("builder nodes", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  test("json parser node", async function (assert) {
    let node = new JSONParseNode(new ConstantNode(`{"hello": "world"}`));
    let fs = new FileSystem();
    let builder = new Builder(fs, { test: node });
    let result = await builder.build();
    assert.deepEqual(result, { test: { hello: "world" } });
  });

  test("html entrypoint node", async function (assert) {
    let node = new HTMLEntrypointNode(
      `<html><script type="module" src="/index.js"></script></html>`,
      new URL("http://test/index.html")
    );
    let fs = new FileSystem();
    let builder = new Builder(fs, { test: node });
    let result = await builder.build();
    assert.deepEqual(result, {
      test: `<html><script type="module" src="http://unimplemented/index.js"></script></html>`,
    });
  });
});
