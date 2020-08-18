import "../../builder-worker/test/helpers/code-equality-assertions";
import Project from "fixturify-project";
import { join } from "path";
import { NpmImportProjectsNode } from "../src/nodes/npm-import";
import { Builder } from "../../builder-worker/src/builder";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { closeAll } from "../src/node-filesystem-driver";
import merge from "lodash/merge";
import { Package } from "../src/nodes/package";

const { test, module } = QUnit;

module("Install from npm", function () {
  module("pkg dependencies", function (hooks) {
    let project: Project;
    let fs: FileSystem;
    let packages: Package[];

    hooks.beforeEach(async function () {
      project = new Project("test-lib");
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
      fs = new FileSystem();
      let workingDir = join(project.root, "working");
      let builderRoot = new NpmImportProjectsNode(
        ["a", "c"],
        join(project.root, "test-lib"),
        workingDir
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
          await fs.openFile(new URL("entrypoints.json", pkgA.packageURL))
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
          await fs.openFile(new URL("entrypoints.json", pkgB1.packageURL))
        ).readText()
      );
      assert.deepEqual(b1Entrypoints.js, ["./b.js"]);
      assert.notOk(b1Entrypoints.html);
      assert.deepEqual(b1Entrypoints.dependencies, {
        d: { url: "https://catalogjs.com/pkgs/npm/d/", range: "10.11.12" },
      });

      let cEntrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgC.packageURL))
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
          await fs.openFile(new URL("entrypoints.json", pkgB2.packageURL))
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
          await fs.openFile(new URL("entrypoints.json", pkgD1.packageURL))
        ).readText()
      );
      let d2Entrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgD2.packageURL))
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
      assert.equal(pkgA.packageHash, "651BAwceOf4ctC4Aru+5SCwhX5w=");
      assert.equal(
        pkgA.packageURL,
        `https://${pkgA.packageJSON.name}/${pkgA.packageHash}/`
      );
      assert.equal(
        pkgA.packageIdentifier.href,
        `https://catalogjs.com/pkgs/npm/${pkgA.packageJSON.name}/${pkgA.packageJSON.version}/${pkgA.packageHash}/`
      );
      assert.equal(pkgA.dependencies.length, 1);

      let [pkgB1] = pkgA.dependencies;
      assert.equal(pkgB1.packageJSON.name, "b");
      assert.equal(pkgB1.packageJSON.version, "4.5.6");
      assert.deepEqual(pkgB1.packageJSON.dependencies, {
        d: "10.11.12",
      });
      assert.equal(pkgB1.packageHash, "7tZJmfXDuIqZnobQcW6vgc6XpR8=");
      assert.equal(
        pkgB1.packageURL,
        `https://${pkgB1.packageJSON.name}/${pkgB1.packageHash}/`
      );
      assert.equal(
        pkgB1.packageIdentifier.href,
        `https://catalogjs.com/pkgs/npm/${pkgB1.packageJSON.name}/${pkgB1.packageJSON.version}/${pkgB1.packageHash}/`
      );
      assert.equal(pkgB1.dependencies.length, 1);

      let [pkgD1] = pkgB1.dependencies;
      assert.equal(pkgD1.packageJSON.name, "d");
      assert.equal(pkgD1.packageJSON.version, "10.11.12");
      assert.deepEqual(pkgD1.packageJSON.dependencies, {});
      assert.equal(pkgD1.packageHash, "hloD8imK3ZAOrPIM2sC5dT2ouY8=");
      assert.equal(
        pkgD1.packageURL,
        `https://${pkgD1.packageJSON.name}/${pkgD1.packageHash}/`
      );
      assert.equal(
        pkgD1.packageIdentifier.href,
        `https://catalogjs.com/pkgs/npm/${pkgD1.packageJSON.name}/${pkgD1.packageJSON.version}/${pkgD1.packageHash}/`
      );
      assert.equal(pkgD1.dependencies.length, 0);

      assert.equal(pkgC.packageJSON.name, "c");
      assert.equal(pkgC.packageJSON.version, "1.2.3");
      assert.deepEqual(pkgC.packageJSON.dependencies, { b: "7.8.9" });
      assert.equal(pkgC.packageHash, "apNVJQxLZdbFr32-hLWmICcfWSA=");
      assert.equal(
        pkgC.packageURL,
        `https://${pkgC.packageJSON.name}/${pkgC.packageHash}/`
      );
      assert.equal(
        pkgC.packageIdentifier.href,
        `https://catalogjs.com/pkgs/npm/${pkgC.packageJSON.name}/${pkgC.packageJSON.version}/${pkgC.packageHash}/`
      );
      assert.equal(pkgC.dependencies.length, 1);

      let [pkgB2] = pkgC.dependencies;
      assert.equal(pkgB2.packageJSON.name, "b");
      assert.equal(pkgB2.packageJSON.version, "7.8.9");
      assert.deepEqual(pkgB2.packageJSON.dependencies, {
        d: "10.11.12",
      });
      assert.equal(pkgB2.packageHash, "B0OQjsmiq-CP1KXT1OB4Ck0-8QQ=");
      assert.equal(
        pkgB2.packageURL,
        `https://${pkgB2.packageJSON.name}/${pkgB2.packageHash}/`
      );
      assert.equal(
        pkgB2.packageIdentifier.href,
        `https://catalogjs.com/pkgs/npm/${pkgB2.packageJSON.name}/${pkgB2.packageJSON.version}/${pkgB2.packageHash}/`
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
          await fs.openFile(new URL("catalogjs.lock", pkgA.packageURL))
        ).readText()
      );
      assert.deepEqual(lock, {
        a: `https://catalogjs.com/pkgs/npm/a/1.2.3/${pkgA.packageHash}/`,
        b: `https://catalogjs.com/pkgs/npm/b/4.5.6/${pkgB1.packageHash}/`,
      });

      lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgB1.packageURL))
        ).readText()
      );
      assert.deepEqual(lock, {
        b: `https://catalogjs.com/pkgs/npm/b/4.5.6/${pkgB1.packageHash}/`,
        d: `https://catalogjs.com/pkgs/npm/d/10.11.12/${pkgD.packageHash}/`,
      });

      lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgC.packageURL))
        ).readText()
      );
      assert.deepEqual(lock, {
        c: `https://catalogjs.com/pkgs/npm/c/1.2.3/${pkgC.packageHash}/`,
        b: `https://catalogjs.com/pkgs/npm/b/7.8.9/${pkgB2.packageHash}/`,
      });

      lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgB2.packageURL))
        ).readText()
      );
      assert.deepEqual(lock, {
        b: `https://catalogjs.com/pkgs/npm/b/7.8.9/${pkgB2.packageHash}/`,
        d: `https://catalogjs.com/pkgs/npm/d/10.11.12/${pkgD.packageHash}/`,
      });

      lock = JSON.parse(
        await (
          await fs.openFile(new URL("catalogjs.lock", pkgD.packageURL))
        ).readText()
      );
      assert.deepEqual(lock, {
        d: `https://catalogjs.com/pkgs/npm/d/10.11.12/${pkgD.packageHash}/`,
      });
    });
  });

  module("ES interop", function (hooks) {
    let project: Project;
    let fs: FileSystem;
    let packages: Package[];
    hooks.beforeEach(async function () {
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
          const { b } = require('test-pkg-dep/b');
          function doSomething() {
            console.log(\`\${a}\${b}\${dep}\`);
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
        "b.js": `module.exports.b = 'b';`,
      });
      project.writeSync();
      let workingDir = join(project.root, "working");
      let builderRoot = new NpmImportProjectsNode(
        ["test-pkg"],
        join(project.root, "test-lib"),
        workingDir
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
        await fs.openFile(new URL("index.cjs.js", testPkg.packageURL))
      ).readText();
      assert.codeEqual(
        src,
        // this is the output of the remapRequires() function
        `
        import aFactory from "./a$cjs$";
        import test_pkg_depFactory from "test-pkg-dep$cjs$";
        import test_pkg_dep_bFactory from "test-pkg-dep/b$cjs$";
        let module;
        function implementation() {
          if (!module) {
            module = { exports: {} };
            Function(
              "module",
              "exports",
              "dependencies",
              \`
          const { a } = dependencies[0]();
          const { dep } = dependencies[1]();
          const { b } = dependencies[2]();
          function doSomething() {
            console.log(\\\`\\\${a}\\\${b}\\\${dep}\\\`);
          }
          module.exports = { doSomething };\`
            )(module, module.exports, [aFactory, test_pkg_depFactory, test_pkg_dep_bFactory]);
          }
          return module.exports;
        }
        export default implementation;`
      );

      src = await (
        await fs.openFile(new URL("a.cjs.js", testPkg.packageURL))
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
        await fs.openFile(new URL("index.js", testPkg.packageURL))
      ).readText();
      assert.codeEqual(
        src,
        `
        import implementation from "./index.js$cjs$";
        export default implementation();
        `
      );
      src = await (
        await fs.openFile(new URL("a.js", testPkg.packageURL))
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
        await fs.openFile(new URL("b.cjs.js", testPkg.packageURL))
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
              \`
          const dep1 = dependencies[0]().dep;
          const dep2 = dependencies[1]().dep2;
          const { a } = dependencies[2]();
          function doSomething() {
            console.log(\\\`\\\${a}\\\${dep1}\\\${dep2}\\\`);
          }
          module.exports = { doSomething };\`
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
        await fs.openFile(new URL("c.cjs.js", testPkg.packageURL))
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
              \`
          const { dep } = dependencies0[0]();
          let dependencies = "don't collide with me" + dep;
          module.exports.default = dependencies;\`
            )(module, module.exports, [test_pkg_depFactory]);
          }
          return module.exports;
        }
        export default implementation;`
      );
    });
  });
});
