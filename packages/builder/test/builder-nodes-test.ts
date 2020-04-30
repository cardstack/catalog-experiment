import { installFileAssertions, origin } from "./helpers/file-assertions";
import { Builder } from "../src/builder";
import { JSONParseNode, ConstantNode } from "../src/nodes/common";
import { FileNode } from "../src/nodes/file";
import { EntrypointsJSONNode, HTMLEntrypointNode } from "../src/nodes/html";

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
    await fd.write(`I am updated`);
    await assert.fs.eventsFlushed();
    result = await builder.build();
    assert.deepEqual(result, { test: "I am updated" });
  });

  test("html entrypoint node", async function (assert) {
    await assert.setupFiles({
      "/src/index.html": `<html><script type="module" src="/index.js"></script></html>`,
      "/index.js": "",
    });
    let node = new HTMLEntrypointNode(
      new URL(`${origin}/src/index.html`),
      new URL(`${origin}/index.html`)
    );
    let builder = new Builder(assert.fs, { test: node });
    await builder.build();
    assert
      .file("/index.html")
      .matches(
        `<html><script type="module" src="/built-index.js"></script></html>`
      );
    assert.file("/built-index.js").exists();
  });

  test("entrypointsJSON node", async function (assert) {
    await assert.setupFiles({
      "/entrypoints.json": JSON.stringify({
        "/src/index.html": "/index.html",
      }),
      "/src/index.html": `<html><script type="module" src="/index.js"></script></html>`,
      "/index.js": "",
    });
    let node = new EntrypointsJSONNode(new URL(origin));
    let builder = new Builder(assert.fs, { test: node });
    await builder.build();
    assert
      .file("/index.html")
      .matches(
        `<html><script type="module" src="/built-index.js"></script></html>`
      );
  });
});
