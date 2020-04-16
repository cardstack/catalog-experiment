import "qunit";
import "qunit/qunit/qunit.css";
import { installFileAssertions } from "./file-assertions";
import { Builder } from "../src/builder";
import { FileSystem } from "../src/filesystem";

QUnit.module("module builder", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  function makeBuilder(fs: FileSystem) {
    return new Builder(fs, {
      htmlEntryPoints: ["index.html"],
      inputDir: `/src`,
      outputDir: `/dist`,
    });
  }

  test("can write build artifacts into the output folder", async (assert) => {
    await assert.setupFiles({
      "src/index.html": `
        <html>
          <head>
            <link rel="stylesheet" href="./styles.css">
          </head>
          <body><h1>Hello World</h1></body>
          <script type="module" src="./index.js"></script>
        </html>
      `,
      "src/styles.css": `h1 { color: red; }`,
      "src/index.js": `alert("hello everyone");`,
      "src/dog.gif": `pretend binary file of silly dog`,
    });

    let builder = makeBuilder(assert.fs);
    await builder.build();

    await assert.file("dist/index.html").matches(/Hello World/);
    await assert.file("dist/index.js").matches(/hello everyone/);
    await assert.file("dist/styles.css").matches(/red/);
    await assert.file("dist/dog.gif").matches(/silly dog/);
    await assert.file("src/index.html").matches(/Hello World/);
    await assert.file("src/index.js").matches(/hello everyone/);
    await assert.file("src/styles.css").matches(/red/);
    await assert.file("src/dog.gif").matches(/silly dog/);
  });
});
