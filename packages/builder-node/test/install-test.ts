import "../../builder-worker/test/helpers/code-equality-assertions";
import Project from "fixturify-project";
import { join } from "path";
import { NpmImportProjectsNode } from "../src/nodes/npm-import";
import { Builder } from "../../builder-worker/src/builder";
import { FileSystem } from "../../builder-worker/src/filesystem";
import { closeAll } from "../src/node-filesystem-driver";
import merge from "lodash/merge";
import { Package } from "../src/nodes/package";

const { test, module, only } = QUnit;

// FOR THE LOVE OF GOD, DON'T FORGET TO REMOVE THE ONLY!!!!!!
module("Install from npm", function () {
  module("entrypoints", function (hooks) {
    let project: Project;
    hooks.beforeEach(function () {
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
      project.writeSync();
    });

    hooks.after(function () {
      closeAll();
      project.dispose();
    });

    test("updates node_modules packages with entrypoints.json", async function (assert) {
      let fs = new FileSystem();
      let workingDir = join(project.root, "working");
      let builderRoot = new NpmImportProjectsNode(
        ["a", "c"],
        join(project.root, "test-lib"),
        workingDir
      );
      let builder = new Builder(fs, [builderRoot]);
      let [pkgA, pkgC] = (await builder.build())[0];

      let aEntrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgA?.packageURL))
        ).readText()
      );
      assert.deepEqual(aEntrypoints.js, ["./index.js"]);
      assert.notOk(aEntrypoints.html);
      assert.deepEqual(aEntrypoints.dependencies, {
        b: { url: "https://catalogjs.com/pkgs/npm/b/", range: "4.5.6" },
      });

      let [pkgB1] = pkgA!.dependencies;
      let b1Entrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgB1?.packageURL))
        ).readText()
      );
      assert.deepEqual(b1Entrypoints.js, ["./b.js"]);
      assert.notOk(b1Entrypoints.html);
      assert.deepEqual(b1Entrypoints.dependencies, {});

      let cEntrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgC?.packageURL))
        ).readText()
      );
      assert.deepEqual(cEntrypoints.js, ["./index.js"]);
      assert.notOk(cEntrypoints.html);
      assert.deepEqual(cEntrypoints.dependencies, {
        b: { url: "https://catalogjs.com/pkgs/npm/b/", range: "7.8.9" },
      });

      let [pkgB2] = pkgC!.dependencies;
      let b2Entrypoints = JSON.parse(
        await (
          await fs.openFile(new URL("entrypoints.json", pkgB2?.packageURL))
        ).readText()
      );
      assert.deepEqual(b2Entrypoints.js, ["./index.js"]);
      assert.notOk(b2Entrypoints.html);
      assert.deepEqual(b2Entrypoints.dependencies, {});
    });

    test("build output returns package info", async function (assert) {
      let workingDir = join(project.root, "working");
      let builderRoot = new NpmImportProjectsNode(
        ["a", "c"],
        join(project.root, "test-lib"),
        workingDir
      );
      let builder = new Builder(new FileSystem(), [builderRoot]);
      let packages = (await builder.build())[0];
      assert.equal(packages.length, 2);
      let [pkgA, pkgC] = packages;
      assert.equal(pkgA.packageJSON.name, "a");
      assert.equal(pkgA.packageJSON.version, "1.2.3");
      assert.deepEqual(pkgA.packageJSON.dependencies, { b: "4.5.6" });
      assert.equal(pkgA.packageIdentifier, "i9tBcKg3onG-i5rr04gKB6zt8Xk=");
      assert.equal(
        pkgA.packageURL,
        `https://${pkgA.packageJSON.name}/${pkgA.packageIdentifier}/`
      );
      assert.equal(pkgA.dependencies.length, 1);

      let [pkgB1] = pkgA.dependencies;
      assert.equal(pkgB1.packageJSON.name, "b");
      assert.equal(pkgB1.packageJSON.version, "4.5.6");
      assert.deepEqual(pkgB1.packageJSON.dependencies, {});
      assert.equal(pkgB1.packageIdentifier, "2siyqrpP4xKh59+-xZy84JZuSrI=");
      assert.equal(
        pkgB1.packageURL,
        `https://${pkgB1.packageJSON.name}/${pkgB1.packageIdentifier}/`
      );
      assert.equal(pkgB1.dependencies.length, 0);

      assert.equal(pkgC.packageJSON.name, "c");
      assert.equal(pkgC.packageJSON.version, "1.2.3");
      assert.deepEqual(pkgC.packageJSON.dependencies, { b: "7.8.9" });
      assert.equal(pkgC.packageIdentifier, "d0WnoD9OX2fXEjp6NbN1mg84LII=");
      assert.equal(
        pkgC.packageURL,
        `https://${pkgC.packageJSON.name}/${pkgC.packageIdentifier}/`
      );
      assert.equal(pkgC.dependencies.length, 1);

      let [pkgB2] = pkgC.dependencies;
      assert.equal(pkgB2.packageJSON.name, "b");
      assert.equal(pkgB2.packageJSON.version, "7.8.9");
      assert.deepEqual(pkgB2.packageJSON.dependencies, {});
      assert.equal(pkgB2.packageIdentifier, "SID-L9qoz0sA9HaYx7Nr5yTx-JI=");
      assert.equal(
        pkgB2.packageURL,
        `https://${pkgB2.packageJSON.name}/${pkgB2.packageIdentifier}/`
      );
      assert.equal(pkgB2.dependencies.length, 0);
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

  module("lock files", function () {
    // Make sure to use pkg that has dep--we need to roll up pkg identifier for deps before we can determine our pkg identifier
    test("it creates lock file for packages", async function (assert) {});
  });
});
