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

  // this obviously will change once we start bundling to use our generated JS entrypoint
  test("can write js file included in HTML to the output folder", async function (assert) {
    await assert.setupFiles({
      "src/index.html": `<html> <script type="module" src="./index.js"></script> </html>`,
      "src/index.js": `alert("hello everyone");`,
    });

    let builder = makeBuilder(assert.fs);
    await builder.build();

    await assert.file("dist/index.html").matches(/src="\.\/index\.js"/);
    await assert.file("dist/index.js").matches(/hello everyone/);

    await assert.file("src/index.html").exists();
    await assert.file("src/index.js").exists();
  });

  // this obviously will change once we start processing the css to use our generated CSS entrypoint
  test("can write css file included in HTML to the output folder", async function (assert) {
    await assert.setupFiles({
      "src/index.html": `<html> <head> <link rel="stylesheet" href="./styles.css"> </head> </html>`,
      "src/styles.css": `h1 { color: red; }`,
    });

    let builder = makeBuilder(assert.fs);
    await builder.build();

    await assert.file("dist/index.html").matches(/href="\.\/styles\.css/);
    await assert.file("dist/styles.css").matches(/red/);

    await assert.file("src/index.html").exists();
    await assert.file("src/styles.css").exists();
  });

  test("can write non-parsed assets (e.g. images) to the output folder", async function (assert) {
    await assert.setupFiles({
      "src/index.html": `<html> </html>`,
      "src/dog.gif": `pretend binary file of silly dog`,
    });

    let builder = makeBuilder(assert.fs);
    await builder.build();

    await assert.file("dist/index.html").exists();
    await assert.file("dist/dog.gif").matches(/silly dog/);

    await assert.file("src/index.html").exists();
    await assert.file("src/dog.gif").exists();
  });

  // this obviously will change once we start bundling probably needs to be
  // modified to something like--the inlined JS doesn't contain the unused JS file's contents
  test("it does not write unused JS file to the output folder", async function (assert) {
    await assert.setupFiles({
      "src/index.html": `<html><script type="module" src="./index.js"></script></html>`,
      "src/index.js": `alert("hello everyone");`,
      "src/not-used.js": `alert("puppies!!");`,
    });

    let builder = makeBuilder(assert.fs);
    await builder.build();

    await assert.file("dist/index.html").matches(/src="\.\/index\.js"/);
    await assert.file("dist/index.js").matches(/hello everyone/);
    await assert.file("dist/not-used.js").doesNotExist();

    await assert.file("src/index.html").exists();
    await assert.file("src/index.js").exists();
    await assert.file("src/not-used.js").exists();
  });

  // this obviously will change once we start combining the css probably needs to be
  // modified to something like--the combined CSS doesn't contain the unused css contents.
  test("it does not write unused CSS file to the output folder", async function (assert) {
    await assert.setupFiles({
      "src/index.html": `<html> <head> <link rel="stylesheet" href="./styles.css"> </head> </html>`,
      "src/styles.css": `h1 { color: red; }`,
      "src/not-used.css": `h1 { color: blue; }`,
    });

    let builder = makeBuilder(assert.fs);
    await builder.build();

    await assert.file("dist/index.html").matches(/href="\.\/styles\.css/);
    await assert.file("dist/styles.css").matches(/red/);
    await assert.file("dist/not-used.css").doesNotExist();

    await assert.file("src/index.html").exists();
    await assert.file("src/styles.css").exists();
    await assert.file("src/not-used.css").exists();
  });
});
