import "qunit";
import "qunit/qunit/qunit.css";
import { combineModules as rewriteCombineModules } from "../src/rewrite";
import { FileSystem } from "../src/filesystem";

const { test } = QUnit;

interface Scenario {
  [file: string]: string;
}

async function pushIntoFs(fs: FileSystem, scenario: Scenario) {
  for (let [path, text] of Object.entries(scenario)) {
    await fs.write(
      path,
      {
        size: text.length,
        name: path.split("/").pop()!,
        mode: 644,
        modifyTime: Math.floor(Date.now() / 1000),
      },
      text
    );
  }
}

QUnit.module("module rewriter", function () {
  // function combineModules({ [filename: string]: string }

  test("can combine two modules", async (assert) => {
    let scenario = {
      "/a.js": "export const alpha = 1;",
      "/b.js": `import { alpha } from '.a';
        export const b = a + 1;
      `,
    };
    let fs = new FileSystem();
    await pushIntoFs(fs, scenario);
  });
});

QUnit.start();
