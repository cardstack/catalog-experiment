import "../../builder-worker/test/helpers/code-equality-assertions";
import Project from "fixturify-project";
import { join } from "path";
import { NpmImportPackagesNode } from "../src/nodes/npm-import";
import { Builder } from "../../builder-worker/src/builder";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { closeAll } from "../src/node-filesystem-driver";
import merge from "lodash/merge";
import { buildSrcDir } from "../src/nodes/package";
import { recipesURL } from "../../builder-worker/src/recipes";
import { installFileAssertions } from "../../builder-worker/test/helpers/file-assertions";
import { NodeResolver } from "../src/resolver";
import { extractDescriptionFromSource } from "../../builder-worker/src/description-encoder";

QUnit.module("Install from npm", function () {
  QUnit.module("pkg dependencies", function (origHooks) {
    let { test, hooks } = installFileAssertions(origHooks);
    let project: Project;
    let fs: FileSystem;
    let packageURLs: URL[];

    hooks.before(async function () {
      project = new Project("test-lib");
      fs = new FileSystem();
      let a = project.addDependency("a", "1.2.3");
      a.pkg = {
        name: "a",
        version: "1.2.3",
      };
      a.files = {
        "index.js": `
          import a from "./a";
          import b from "b";
          import e from "e";
          a();
          b();
          e();
          console.log('a')`,
        "a.js": `
          export default function() {
            console.log('a');
          };`,
      };
      let b1 = a.addDependency("b", "4.5.6");
      b1.pkg = {
        name: "b",
        version: "4.5.6",
        main: "./b.js",
      };
      b1.files = {
        "b.js": `
        import d from "d";
        export default function() {
          d();
          console.log('b1');
        };`,
      };
      let e = a.addDependency("e", "2.3.4");
      e.pkg = {
        name: "e",
        version: "2.3.4",
      };
      e.files = {
        "index.js": "export default function() { console.log('e'); }",
      };
      let c = project.addDependency("c", "1.2.3");
      c.pkg = {
        name: "c",
        version: "1.2.3",
      };
      c.files = {
        "index.js": `
        import b from "b";
        b();
        console.log('c');`,
      };
      let b2 = c.addDependency("b", "7.8.9");
      b2.pkg = {
        name: "b",
        version: "7.8.9",
      };
      b2.files = {
        "index.js": `
        import d from "d";
        export default function() {
          d();
          console.log('b2');
        };`,
      };
      let d1 = b1.addDependency("d", "10.11.12");
      d1.pkg = {
        name: "d",
        version: "10.11.12",
      };
      d1.files = {
        "index.js": "export default function() { console.log('d'); }",
      };
      let d2 = b2.addDependency("d", "10.11.12");
      d2.pkg = {
        name: "d",
        version: "10.11.12",
      };
      d2.files = {
        "index.js": "export default function() { console.log('d'); }",
      };
      project.writeSync();
      let workingDir = join(project.root, "working");
      let resolver = new NodeResolver(fs, workingDir);
      let builderRoot = new NpmImportPackagesNode(
        ["a", "c"],
        join(project.root, "test-lib"),
        workingDir,
        resolver
      );
      let builder = new Builder(fs, [builderRoot], recipesURL);
      packageURLs = (await builder.build())[0].map(({ finalURL }) => finalURL);
    });

    hooks.after(function () {
      closeAll();
      project.dispose();
    });

    test("updates node_modules packages with entrypoints.json", async function (assert) {
      let [pkgAURL, pkgCURL] = packageURLs;
      let aEntrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgAURL))
        ).readText()
      );
      assert.deepEqual(aEntrypoints.js, ["./index.js"]);
      assert.notOk(aEntrypoints.html);
      assert.deepEqual(aEntrypoints.dependencies, {
        b: { type: "npm", pkgName: "b", range: "4.5.6" },
        e: { type: "npm", pkgName: "e", range: "2.3.4" },
        "@catalogjs/loader": {
          type: "npm",
          pkgName: "@catalogjs/loader",
          range: "^0.0.1",
        },
      });

      let cEntrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgCURL))
        ).readText()
      );
      assert.deepEqual(cEntrypoints.js, ["./index.js"]);
      assert.notOk(cEntrypoints.html);
      assert.deepEqual(cEntrypoints.dependencies, {
        b: { type: "npm", pkgName: "b", range: "7.8.9" },
        "@catalogjs/loader": {
          type: "npm",
          pkgName: "@catalogjs/loader",
          range: "^0.0.1",
        },
      });
    });

    test("it creates lock files for packages", async function (assert) {
      let [pkgAURL, pkgCURL] = packageURLs;
      let lock = JSON.parse(
        await (await fs.openFile(new URL("catalogjs.lock", pkgAURL))).readText()
      );
      assert.deepEqual(lock, {
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/index.js",
        b:
          "https://catalogjs.com/pkgs/npm/b/4.5.6/vuLeHhy9XcA1s76b5DYNGAuEpGY=/b.js",
        e:
          "https://catalogjs.com/pkgs/npm/e/2.3.4/BUZOzJTxcd8z2LGoiXV858H4-xg=/index.js",
      });

      lock = JSON.parse(
        await (await fs.openFile(new URL("catalogjs.lock", pkgCURL))).readText()
      );
      assert.deepEqual(lock, {
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/index.js",
        b:
          "https://catalogjs.com/pkgs/npm/b/7.8.9/3xSsBvcctg1anboYO407-hDuLak=/index.js",
      });
    });

    test("builds package dependencies", async function (assert) {
      let [pkgAURL, pkgCURL] = packageURLs;
      let aLock = JSON.parse(
        await (await fs.openFile(new URL("catalogjs.lock", pkgAURL))).readText()
      );
      let { b: pkgB1URL } = aLock;
      let b1Entrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgB1URL))
        ).readText()
      );
      assert.deepEqual(b1Entrypoints.js, ["./b.js"]);
      assert.notOk(b1Entrypoints.html);
      assert.deepEqual(b1Entrypoints.dependencies, {
        d: { type: "npm", pkgName: "d", range: "10.11.12" },
        "@catalogjs/loader": {
          type: "npm",
          pkgName: "@catalogjs/loader",
          range: "^0.0.1",
        },
      });

      let { e: pkgEURL } = aLock;
      let eEntrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgEURL))
        ).readText()
      );
      assert.deepEqual(eEntrypoints.js, ["./index.js"]);
      assert.notOk(eEntrypoints.html);
      assert.deepEqual(eEntrypoints.dependencies, {
        "@catalogjs/loader": {
          type: "npm",
          pkgName: "@catalogjs/loader",
          range: "^0.0.1",
        },
      });
      let eLock = JSON.parse(
        await (await fs.openFile(new URL("catalogjs.lock", pkgEURL))).readText()
      );
      assert.deepEqual(eLock, {
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/index.js",
      });

      let b1Lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgB1URL))
        ).readText()
      );
      assert.deepEqual(b1Lock, {
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/index.js",
        d: `https://catalogjs.com/pkgs/npm/d/10.11.12/6qYXPJtbTZQbzaBwr8tu6JSH3+w=/index.js`,
      });
      let { d: pkgD1URL } = b1Lock;
      let d1Entrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgD1URL))
        ).readText()
      );
      assert.deepEqual(d1Entrypoints.js, ["./index.js"]);
      assert.deepEqual(d1Entrypoints.dependencies, {
        "@catalogjs/loader": {
          type: "npm",
          pkgName: "@catalogjs/loader",
          range: "^0.0.1",
        },
      });
      assert.notOk(d1Entrypoints.html);
      let dLock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgD1URL))
        ).readText()
      );
      assert.deepEqual(dLock, {
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/index.js",
      });

      let cLock = JSON.parse(
        await (await fs.openFile(new URL("catalogjs.lock", pkgCURL))).readText()
      );
      let { b: pkgB2URL } = cLock;
      let b2Entrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgB2URL))
        ).readText()
      );
      assert.deepEqual(b2Entrypoints.js, ["./index.js"]);
      assert.notOk(b2Entrypoints.html);
      assert.deepEqual(b2Entrypoints.dependencies, {
        d: { type: "npm", pkgName: "d", range: "10.11.12" },
        "@catalogjs/loader": {
          type: "npm",
          pkgName: "@catalogjs/loader",
          range: "^0.0.1",
        },
      });

      let b2Lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgB2URL))
        ).readText()
      );
      assert.deepEqual(b2Lock, {
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/index.js",
        d: `https://catalogjs.com/pkgs/npm/d/10.11.12/6qYXPJtbTZQbzaBwr8tu6JSH3+w=/index.js`,
      });
      let { d: pkgD2URL } = b2Lock;
      assert.deepEqual(pkgD2URL, pkgD1URL);
    });

    test("bundle metadata utilize final pkg URLs", async function (assert) {
      let [pkgAURL] = packageURLs;
      let source = await (
        await fs.openFile(new URL("index.js", pkgAURL))
      ).readText();
      let { desc } = extractDescriptionFromSource(source);

      let { declaration: nameDesc } = desc!.declarations.get("e")!;
      assert.equal(nameDesc?.type, "local");
      if (nameDesc.type === "local") {
        assert.equal(
          nameDesc.original?.bundleHref,
          "https://catalogjs.com/pkgs/npm/e/2.3.4/BUZOzJTxcd8z2LGoiXV858H4-xg=/index.js"
        );
      }

      ({ declaration: nameDesc } = desc!.declarations.get("b")!);
      assert.equal(nameDesc?.type, "local");
      if (nameDesc.type === "local") {
        assert.equal(
          nameDesc.original?.bundleHref,
          "https://catalogjs.com/pkgs/npm/b/4.5.6/vuLeHhy9XcA1s76b5DYNGAuEpGY=/b.js"
        );
      }
    });
  });

  QUnit.module("ES interop", function (origHooks) {
    let { test, hooks } = installFileAssertions(origHooks);
    let project: Project;
    let fs: FileSystem;
    let packageURLs: URL[];
    hooks.before(async function () {
      project = new Project("test-lib");
      fs = new FileSystem();
      let pkg = project.addDependency("test-pkg", "1.2.3");
      pkg.pkg = {
        name: "test-pkg",
        version: "1.2.3",
      };
      merge(pkg.files, {
        "index.js": `
          const { a } = require('./a');
          const { dep } = require('test-pkg-dep');
          function doSomething() {
            console.log(\`\${a}\${dep}\`);
          }
          module.exports = { doSomething };`,
        "a.js": `module.exports.a = 'a';`,
        "b.js": `
          const dep1 = require("test-pkg-dep").dep;
          const dep2 = require("test-pkg-dep").dep2;
          const { a } = require('./a');
          function doSomething() {
            console.log(\`\${a}\${dep1}\${dep2}\`);
          }
          module.exports = { doSomething };`,
        "c.js": `
          const { dep } = require('test-pkg-dep');
          let dependencies = "don't collide with me" + dep;
          module.exports.default = dependencies;`,
        "d.js": `
          module.exports.boom = function(file) {
            require(file);
          }`,
        "e.js": `
          const fs = require('fs');
          module.exports.nope = function(filename) {
            return fs.readFileSync(filename);
          }`,
        "f.js": `
          const sample = require('./sample.json');
          module.exports.foo = sample.foo;`,
        "sample.json": `{
          "foo": "bar"
        }`,
        "es-module.js": `
          import { foo } from "./sample2.json";
          export { bleep } from "./sample3.json";
          export { json } from "./sample4.json";
          export default function() { console.log(foo); };
        `,
        "sample2.json": `{
          "foo": "bar"
        }`,
        "sample3.json": `{
          "bleep": "bloop"
        }`,
        "sample4.json": `{
          "json": "foo"
        }`,
        "not-a-dep.json": `{
          "foo": "bar"
        }`,
      });

      let pkgDep = pkg.addDependency("test-pkg-dep", "4.5.6");
      pkgDep.pkg = {
        name: "test-pkg-dep",
        version: "1.2.3",
      };
      merge(pkgDep.files, {
        "index.js": `
          module.exports.dep = 'dep';
          module.exports.dep2 = 'dep2';
        `,
      });
      project.writeSync();
      let workingDir = join(project.root, "working");
      let resolver = new NodeResolver(fs, workingDir);
      let builderRoot = new NpmImportPackagesNode(
        ["test-pkg"],
        join(project.root, "test-lib"),
        workingDir,
        resolver
      );
      let builder = new Builder(fs, [builderRoot], recipesURL);
      packageURLs = (await builder.build())[0].map(
        ({ workingURL }) => workingURL
      );
    });

    hooks.after(function () {
      closeAll();
      project.dispose();
    });

    test("it wraps CJS files with runtime loader", async function (assert) {
      let [testPkgURL] = packageURLs;

      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}index.cjs.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        src,
        // this is the output of the remapRequires() function
        `
        import aFactory from "./a$cjs$";
        import test_pkg_depFactory from "test-pkg-dep$cjs$";
        let module;
        function implementation() {
          if (!module) {
            module = { exports: {} };
            Function(
              "module",
              "exports",
              "dependencies",
              \`const {
  a
} = dependencies[0];
const {
  dep
} = dependencies[1];
function doSomething() {
  console.log(\\\`\\\${a}\\\${dep}\\\`);
}
module.exports = {
  doSomething
};\`
            )(module, module.exports, [aFactory, test_pkg_depFactory]);
          }
          return module.exports;
        }
        export default implementation;`
      );

      src = await (
        await fs.openFile(new URL(`${buildSrcDir}a.cjs.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        src,
        `
        let module;
        function implementation() {
          if (!module) {
            module = { exports: {} };
            Function(
              "module",
              "exports",
              "dependencies",
              \`module.exports.a = 'a';\`
            )(module, module.exports, []);
          }
          return module.exports;
        }
        export default implementation;`
      );
    });

    test("it generates ES module shim for CJS files", async function (assert) {
      let [testPkgURL] = packageURLs;
      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}index.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        src,
        `
        import implementation from "./index.js$cjs$";
        export default implementation();
        `
      );
      src = await (
        await fs.openFile(new URL(`${buildSrcDir}a.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        src,
        `
        import implementation from "./a.js$cjs$";
        export default implementation();
        `
      );
    });

    test("it can wrap CJS that has duplicate require() call expressions", async function (assert) {
      let [testPkgURL] = packageURLs;

      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}b.cjs.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        src,
        `
        import test_pkg_depFactory from "test-pkg-dep$cjs$";
        import aFactory from "./a$cjs$";
        let module;
        function implementation() {
          if (!module) {
            module = { exports: {} };
            Function(
              "module",
              "exports",
              "dependencies",
              \`const dep1 = dependencies[0].dep;
const dep2 = dependencies[1].dep2;
const {
  a
} = dependencies[2];
function doSomething() {
  console.log(\\\`\\\${a}\\\${dep1}\\\${dep2}\\\`);
}
module.exports = {
  doSomething
};\`
            )(module, module.exports, [test_pkg_depFactory, test_pkg_depFactory, aFactory]);
          }
          return module.exports;
        }
        export default implementation;`
      );
    });

    test("it can wrap CJS that has module scoped binding named 'dependencies' (collision)", async function (assert) {
      let [testPkgURL] = packageURLs;
      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}c.cjs.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        src,
        `
        import test_pkg_depFactory from "test-pkg-dep$cjs$";
        let module;
        function implementation() {
          if (!module) {
            module = { exports: {} };
            Function(
              "module",
              "exports",
              "dependencies0",
              \`const {
  dep
} = dependencies0[0];
let dependencies = "don't collide with me" + dep;
module.exports.default = dependencies;\`
            )(module, module.exports, [test_pkg_depFactory]);
          }
          return module.exports;
        }
        export default implementation;`
      );
    });

    test("it includes a runtime 'error' loader for require() with non-string literal specifier", async function (assert) {
      let [testPkgURL] = packageURLs;
      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}d.cjs.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        src,
        `
        import { requireHasNonStringLiteralSpecifier } from "@catalogjs/loader";
        let module;
        function implementation() {
          if (!module) {
            module = { exports: {} };
            Function(
              "module",
              "exports",
              "dependencies",
              \`module.exports.boom = function (file) {
  dependencies[0];
};\`,
            )(module, module.exports, [requireHasNonStringLiteralSpecifier("test-pkg", "1.2.3", "d.js")]);
          }
          return module.exports;
        }
        export default implementation;`
      );
    });

    test("it includes a special runtime loader for require() of node builtin module", async function (assert) {
      let [testPkgURL] = packageURLs;
      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}e.cjs.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        src,
        `
        import { requireNodeBuiltin } from "@catalogjs/loader";
        let module;
        function implementation() {
          if (!module) {
            module = { exports: {} };
            Function(
              "module",
              "exports",
              "dependencies",
              \`const fs = dependencies[0];
module.exports.nope = function (filename) {
  return fs.readFileSync(filename);
};\`
            )(module, module.exports, [requireNodeBuiltin("fs")]);
          }
          return module.exports;
        }
        export default implementation;`
      );
    });

    test("it provides support for require() of JSON files", async function (assert) {
      let [testPkgURL] = packageURLs;
      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}f.cjs.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        src,
        `
        import sampleJSON from "./sample.json.js";
        let module;
        function implementation() {
          if (!module) {
            module = { exports: {} };
            Function(
              "module",
              "exports",
              "dependencies",
              \`const sample = dependencies[0];
module.exports.foo = sample.foo;\`
            )(module, module.exports, [getSampleJSON]);
          }
          return module.exports;
        }
        function getSampleJSON() { return sampleJSON; }
        export default implementation;`
      );

      let json = await (
        await fs.openFile(new URL(`${buildSrcDir}sample.json.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        json,
        `
        const json = {
          "foo": "bar"
        };
        const { foo } = json;
        export default json;
        export { foo };
        `
      );
    });

    test("it rewrites imported JSON files for ES6 modules", async function (assert) {
      let [testPkgURL] = packageURLs;
      let json = await (
        await fs.openFile(new URL(`${buildSrcDir}sample2.json.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        json,
        `
        const json = {
          "foo": "bar"
        };
        const { foo } = json;
        export default json;
        export { foo };
        `
      );
    });

    test("it rewrites reexported JSON files for ES6 modules", async function (assert) {
      let [testPkgURL] = packageURLs;
      let json = await (
        await fs.openFile(new URL(`${buildSrcDir}sample3.json.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        json,
        `
        const json = {
          "bleep": "bloop"
        };
        const { bleep } = json;
        export default json;
        export { bleep };
        `
      );
    });

    test("prop name collides with 'json' var in rewritten json", async function (assert) {
      let [testPkgURL] = packageURLs;
      let json = await (
        await fs.openFile(new URL(`${buildSrcDir}sample4.json.js`, testPkgURL))
      ).readText();
      assert.codeEqual(
        json,
        `
        const json0 = {
          "json": "foo"
        };
        const { json } = json0;
        export default json0;
        export { json };
        `
      );
    });

    test("does not rewrite JSON that is not required nor imported", async function (assert) {
      let [testPkgURL] = packageURLs;
      try {
        await fs.openFile(
          new URL(`${buildSrcDir}not-a-dep.json.js`, testPkgURL)
        );
        throw new Error(`a rewritten json file should not exist`);
      } catch (err) {
        if (err.code === "NOT_FOUND") {
          assert.ok(true, "rewritten JSON file does not exist");
        } else {
          throw err;
        }
      }
    });
  });
});
