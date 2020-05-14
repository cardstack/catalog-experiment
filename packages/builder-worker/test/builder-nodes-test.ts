import { installFileAssertions, origin } from "./helpers/file-assertions";
import { Builder } from "../src/builder";
import { JSONParseNode, ConstantNode } from "../src/nodes/common";
import { FileNode } from "../src/nodes/file";
import { FileDescriptor } from "../src/filesystem";

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
    let url = new URL(`${origin}/example.txt`);
    let node = new FileNode(url);
    let builder = new Builder(assert.fs, { test: node });
    let result = await builder.build();
    assert.deepEqual(result, { test: `Hello world` });
    let fd = await assert.fs.open(url);
    assert.equal(fd.type, "file");
    await (fd as FileDescriptor).write(`I am updated`);
    await assert.fs.eventsFlushed();
    result = await builder.build();
    assert.deepEqual(result, { test: "I am updated" });
  });
});
