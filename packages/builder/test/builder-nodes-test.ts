import { installFileAssertions, origin } from "./file-assertions";
import { Builder } from "../src/builder";
import {
  JSONParseNode,
  ConstantNode,
  HTMLEntrypointNode,
  FileNode,
} from "../src/builder-nodes";

QUnit.module("builder nodes", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  test("json parser node", async function (assert) {
    let node = new JSONParseNode(new ConstantNode(`{"hello": "world"}`));
    let builder = new Builder(assert.fs, { test: node });
    let result = await builder.build();
    assert.deepEqual(result, { test: { hello: "world" } });
  });

  test("file node", async function (assert) {
    await assert.setupFiles({
      "/example.txt": `Hello world`,
    });
    let node = new FileNode(new URL(`${origin}/example.txt`));
    let builder = new Builder(assert.fs, { test: node });
    let result = await builder.build();
    assert.deepEqual(result, { test: `Hello world` });
  });

  test("html entrypoint node", async function (assert) {
    await assert.setupFiles({
      "/src/index.html": `<html><script type="module" src="/index.js"></script></html>`,
    });
    let node = new HTMLEntrypointNode(
      new URL(`${origin}/src/index.html`),
      new URL("http://test/index.html")
    );
    let builder = new Builder(assert.fs, { test: node });
    let result = await builder.build();
    assert.deepEqual(result, {
      test: `<html><script type="module" src="http://unimplemented/index.js"></script></html>`,
    });
  });
});
