import "qunit";
import "qunit/qunit/qunit.css";
import { combineModules as rewriteCombineModules } from "../src/rewrite";
import { FileSystem } from "../src/filesystem";

const { test } = QUnit;


QUnit.module("module rewriter", function () {

  function combineModules({ [filename: string]: string }

  test("can combine two modules", (assert) => {

    let scenario = {
      'a.js': 'export const alpha = 1;',
      'b.js': `import { alpha } from '.a';
        export const b = a + 1;
      `
    };
    let fs = new FileSystem();
    pushIntoFs(fs, scenario);


  });
});

QUnit.start();
