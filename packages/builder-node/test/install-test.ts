import "../../builder-worker/test/helpers/code-equality-assertions";
import Project from "fixturify-project";
import { join } from "path";
import { NpmImportPackagesNode } from "../src/nodes/npm-import";
import { Builder } from "../../builder-worker/src/builder";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { closeAll } from "../src/node-filesystem-driver";
import merge from "lodash/merge";
import { Package, buildSrcDir } from "../src/nodes/package";
import { Resolver } from "../../builder-worker/src/resolver";

const { test, module } = QUnit;

module("Install from npm", function () {
  module("pkg dependencies", function (hooks) {
    let project: Project;
    let fs: FileSystem;
    let packages: Package[];

    hooks.before(async function () {
      project = new Project("test-lib");
      fs = new FileSystem();
      let resolver = new Resolver(fs);
      let a = project.addDependency("a", "1.2.3");
      a.pkg = {
        name: "a",
        version: "1.2.3",
      };
      a.files["index.js"] = "console.log('a')";
      let b1 = a.addDependency("b", "4.5.6");
      b1.pkg = {
        name: "b",
        version: "4.5.6",
        main: "./b.js",
      };
      b1.files["b.js"] = "console.log('b1')";
      let c = project.addDependency("c", "1.2.3");
      c.pkg = {
        name: "c",
        version: "1.2.3",
      };
      c.files["index.js"] = "console.log('c')";
      let b2 = c.addDependency("b", "7.8.9");
      b2.pkg = {
        name: "b",
        version: "7.8.9",
      };
      b2.files["index.js"] = "console.log('b2')";
      let d1 = b1.addDependency("d", "10.11.12");
      d1.pkg = {
        name: "d",
        version: "10.11.12",
      };
      d1.files["index.js"] = "console.log('d')";
      let d2 = b2.addDependency("d", "10.11.12");
      d2.pkg = {
        name: "d",
        version: "10.11.12",
      };
      d2.files["index.js"] = "console.log('d')";
      project.writeSync();
      let workingDir = join(project.root, "working");
      let builderRoot = new NpmImportPackagesNode(
        ["a", "c"],
        join(project.root, "test-lib"),
        workingDir,
        resolver
      );
      let builder = new Builder(fs, [builderRoot]);
      packages = (await builder.build())[0];
    });

    hooks.after(function () {
      closeAll();
      project.dispose();
    });

    test("updates node_modules packages with entrypoints.json", async function (assert) {
      let [pkgA, pkgC] = packages;
      let aEntrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgA.url))
        ).readText()
      );
      assert.deepEqual(aEntrypoints.js, ["./index.js"]);
      assert.notOk(aEntrypoints.html);
      assert.deepEqual(aEntrypoints.dependencies, {
        b: { url: "https://catalogjs.com/pkgs/npm/b/", range: "4.5.6" },
      });

      let [pkgB1] = pkgA.dependencies;
      let b1Entrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgB1.url))
        ).readText()
      );
      assert.deepEqual(b1Entrypoints.js, ["./b.js"]);
      assert.notOk(b1Entrypoints.html);
      assert.deepEqual(b1Entrypoints.dependencies, {
        d: { url: "https://catalogjs.com/pkgs/npm/d/", range: "10.11.12" },
      });

      let cEntrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgC.url))
        ).readText()
      );
      assert.deepEqual(cEntrypoints.js, ["./index.js"]);
      assert.notOk(cEntrypoints.html);
      assert.deepEqual(cEntrypoints.dependencies, {
        b: { url: "https://catalogjs.com/pkgs/npm/b/", range: "7.8.9" },
      });

      let [pkgB2] = pkgC.dependencies;
      let b2Entrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgB2.url))
        ).readText()
      );
      assert.deepEqual(b2Entrypoints.js, ["./index.js"]);
      assert.notOk(b2Entrypoints.html);
      assert.deepEqual(b1Entrypoints.dependencies, {
        d: { url: "https://catalogjs.com/pkgs/npm/d/", range: "10.11.12" },
      });

      let [pkgD1] = pkgB1.dependencies;
      let [pkgD2] = pkgB2.dependencies;
      let d1Entrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgD1.url))
        ).readText()
      );
      let d2Entrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgD2.url))
        ).readText()
      );
      assert.deepEqual(d1Entrypoints, d2Entrypoints);
      assert.deepEqual(d1Entrypoints.js, ["./index.js"]);
      assert.deepEqual(d1Entrypoints.dependencies, {});
      assert.notOk(d1Entrypoints.html);
    });

    test("build output returns package info", async function (assert) {
      assert.equal(packages.length, 2);
      let [pkgA, pkgC] = packages;
      assert.equal(pkgA.packageJSON.name, "a");
      assert.equal(pkgA.packageJSON.version, "1.2.3");
      assert.deepEqual(pkgA.packageJSON.dependencies, { b: "4.5.6" });
      assert.equal(pkgA.hash, "651BAwceOf4ctC4Aru+5SCwhX5w=");
      assert.equal(
        pkgA.url.href,
        `https://catalogjs.com/pkgs/npm/${pkgA.packageJSON.name}/${pkgA.packageJSON.version}/${pkgA.hash}/`
      );
      assert.equal(pkgA.dependencies.length, 1);

      let [pkgB1] = pkgA.dependencies;
      assert.equal(pkgB1.packageJSON.name, "b");
      assert.equal(pkgB1.packageJSON.version, "4.5.6");
      assert.deepEqual(pkgB1.packageJSON.dependencies, {
        d: "10.11.12",
      });
      assert.equal(pkgB1.hash, "7tZJmfXDuIqZnobQcW6vgc6XpR8=");
      assert.equal(
        pkgB1.url.href,
        `https://catalogjs.com/pkgs/npm/${pkgB1.packageJSON.name}/${pkgB1.packageJSON.version}/${pkgB1.hash}/`
      );
      assert.equal(pkgB1.dependencies.length, 1);

      let [pkgD1] = pkgB1.dependencies;
      assert.equal(pkgD1.packageJSON.name, "d");
      assert.equal(pkgD1.packageJSON.version, "10.11.12");
      assert.deepEqual(pkgD1.packageJSON.dependencies, {});
      assert.equal(pkgD1.hash, "hloD8imK3ZAOrPIM2sC5dT2ouY8=");
      assert.equal(
        pkgD1.url.href,
        `https://catalogjs.com/pkgs/npm/${pkgD1.packageJSON.name}/${pkgD1.packageJSON.version}/${pkgD1.hash}/`
      );
      assert.equal(pkgD1.dependencies.length, 0);

      assert.equal(pkgC.packageJSON.name, "c");
      assert.equal(pkgC.packageJSON.version, "1.2.3");
      assert.deepEqual(pkgC.packageJSON.dependencies, { b: "7.8.9" });
      assert.equal(pkgC.hash, "apNVJQxLZdbFr32-hLWmICcfWSA=");
      assert.equal(
        pkgC.url.href,
        `https://catalogjs.com/pkgs/npm/${pkgC.packageJSON.name}/${pkgC.packageJSON.version}/${pkgC.hash}/`
      );
      assert.equal(pkgC.dependencies.length, 1);

      let [pkgB2] = pkgC.dependencies;
      assert.equal(pkgB2.packageJSON.name, "b");
      assert.equal(pkgB2.packageJSON.version, "7.8.9");
      assert.deepEqual(pkgB2.packageJSON.dependencies, {
        d: "10.11.12",
      });
      assert.equal(pkgB2.hash, "B0OQjsmiq-CP1KXT1OB4Ck0-8QQ=");
      assert.equal(
        pkgB2.url.href,
        `https://catalogjs.com/pkgs/npm/${pkgB2.packageJSON.name}/${pkgB2.packageJSON.version}/${pkgB2.hash}/`
      );
      assert.equal(pkgB2.dependencies.length, 1);

      let [pkgD2] = pkgB2.dependencies;
      assert.deepEqual(pkgD1, pkgD2);
    });

    test("it creates lock files for packages", async function (assert) {
      let [pkgA, pkgC] = packages;
      let [pkgB1] = pkgA.dependencies;
      let [pkgB2] = pkgC.dependencies;
      let [pkgD] = pkgB1.dependencies; // we proved in previous test that pkgD1 is deep equal to pkgD2

      let lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgA.url))
        ).readText()
      );
      assert.deepEqual(lock, {
        b: `https://catalogjs.com/pkgs/npm/b/4.5.6/${pkgB1.hash}/`,
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/",
      });

      lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgB1.url))
        ).readText()
      );
      assert.deepEqual(lock, {
        d: `https://catalogjs.com/pkgs/npm/d/10.11.12/${pkgD.hash}/`,
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/",
      });

      lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgC.url))
        ).readText()
      );
      assert.deepEqual(lock, {
        b: `https://catalogjs.com/pkgs/npm/b/7.8.9/${pkgB2.hash}/`,
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/",
      });

      lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgB2.url))
        ).readText()
      );
      assert.deepEqual(lock, {
        d: `https://catalogjs.com/pkgs/npm/d/10.11.12/${pkgD.hash}/`,
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/",
      });

      lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgD.url))
        ).readText()
      );
      assert.deepEqual(lock, {
        "@catalogjs/loader":
          "https://catalogjs.com/pkgs/@catalogjs/loader/0.0.1/",
      });
    });
  });

  module("ES interop", function (hooks) {
    let project: Project;
    let fs: FileSystem;
    let packages: Package[];
    hooks.before(async function () {
      project = new Project("test-lib");
      fs = new FileSystem();
      let resolver = new Resolver(fs);
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
      let builderRoot = new NpmImportPackagesNode(
        ["test-pkg"],
        join(project.root, "test-lib"),
        workingDir,
        resolver
      );
      let builder = new Builder(fs, [builderRoot]);
      packages = (await builder.build())[0];
    });

    hooks.after(function () {
      closeAll();
      project.dispose();
    });

    test("it wraps CJS files with runtime loader", async function (assert) {
      let [testPkg] = packages;

      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}index.cjs.js`, testPkg.url))
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
} = dependencies[0]();

const {
  dep
} = dependencies[1]();

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
        await fs.openFile(new URL(`${buildSrcDir}a.cjs.js`, testPkg.url))
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
      let [testPkg] = packages;
      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}index.js`, testPkg.url))
      ).readText();
      assert.codeEqual(
        src,
        `
        import implementation from "./index.js$cjs$";
        export default implementation();
        `
      );
      src = await (
        await fs.openFile(new URL(`${buildSrcDir}a.js`, testPkg.url))
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
      let [testPkg] = packages;

      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}b.cjs.js`, testPkg.url))
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
              \`const dep1 = dependencies[0]().dep;

const dep2 = dependencies[1]().dep2;

const {
  a
} = dependencies[2]();

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
      let [testPkg] = packages;
      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}c.cjs.js`, testPkg.url))
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
} = dependencies0[0]();

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
      let [testPkg] = packages;
      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}d.cjs.js`, testPkg.url))
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
  dependencies[0]();
};\`,
            )(module, module.exports, [requireHasNonStringLiteralSpecifier("https://catalogjs.com/pkgs/npm/test-pkg/1.2.3/FIuxK7Xk60rE9Nd6D9-8snnkWSU=/build_src/d.js")]);
          }
          return module.exports;
        }
        export default implementation;`
      );
    });

    test("it includes a special runtime loader for require() of node builtin module", async function (assert) {
      let [testPkg] = packages;
      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}e.cjs.js`, testPkg.url))
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
              \`const fs = dependencies[0]();

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
      let [testPkg] = packages;
      let src = await (
        await fs.openFile(new URL(`${buildSrcDir}f.cjs.js`, testPkg.url))
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
              \`const sample = dependencies[0]();

module.exports.foo = sample.foo;\`
            )(module, module.exports, [getSampleJSON]);
          }
          return module.exports;
        }
        function getSampleJSON() { return sampleJSON; }
        export default implementation;`
      );

      let json = await (
        await fs.openFile(new URL(`${buildSrcDir}sample.json.js`, testPkg.url))
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
      let [testPkg] = packages;
      let json = await (
        await fs.openFile(new URL(`${buildSrcDir}sample2.json.js`, testPkg.url))
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
      let [testPkg] = packages;
      let json = await (
        await fs.openFile(new URL(`${buildSrcDir}sample3.json.js`, testPkg.url))
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
      let [testPkg] = packages;
      let json = await (
        await fs.openFile(new URL(`${buildSrcDir}sample4.json.js`, testPkg.url))
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
      let [testPkg] = packages;
      try {
        await fs.openFile(
          new URL(`${buildSrcDir}not-a-dep.json.js`, testPkg.url)
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
