import "../../builder-worker/test/helpers/code-equality-assertions";
import Project from "fixturify-project";
import { join } from "path";
import { readJSONSync, readFileSync } from "fs-extra";
import { NpmImportProjectsNode } from "../src/nodes/npm-import";
import { Builder } from "../../builder-worker/src/builder";
import { FileSystem } from "../../builder-worker/src/filesystem";
import merge from "lodash/merge";

const { test, module, only } = QUnit;

// FOR THE LOVE OF GOD, DON'T FORGET TO REMOVE THE ONLY!!!!!!
module.only("Install from npm", function () {
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
      project.dispose();
    });

    // TODO sets the dependencies in entrypoints.json too
    test("updates node_modules packages with entrypoints.json", async function (assert) {
      let workingDir = join(project.root, "working");
      let builderRoot = new NpmImportProjectsNode(
        ["a", "c"],
        join(project.root, "test-lib"),
        workingDir
      );
      let builder = new Builder(new FileSystem(), [builderRoot]);
      await builder.build();

      let aEntrypoints = readJSONSync(
        join(project.root, "test-lib", "node_modules", "a", "entrypoints.json")
      );
      assert.deepEqual(aEntrypoints.js, ["./index.js"]);
      assert.notOk(aEntrypoints.html);

      let b1Entrypoints = readJSONSync(
        join(
          project.root,
          "test-lib",
          "node_modules",
          "a",
          "node_modules",
          "b",
          "entrypoints.json"
        )
      );
      assert.deepEqual(b1Entrypoints.js, ["./b.js"]);
      assert.notOk(b1Entrypoints.html);

      let cEntrypoints = readJSONSync(
        join(project.root, "test-lib", "node_modules", "c", "entrypoints.json")
      );
      assert.deepEqual(cEntrypoints.js, ["./index.js"]);
      assert.notOk(cEntrypoints.html);

      let b2Entrypoints = readJSONSync(
        join(
          project.root,
          "test-lib",
          "node_modules",
          "c",
          "node_modules",
          "b",
          "entrypoints.json"
        )
      );
      assert.deepEqual(b2Entrypoints.js, ["./index.js"]);
      assert.notOk(b2Entrypoints.html);
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
      assert.equal(
        pkgA.packageNodeModulesPath,
        join(project.root, "test-lib", "node_modules", "a")
      );
      assert.equal(pkgA.packageSrc, pkgA.packageNodeModulesPath);
      assert.equal(pkgA.dependencies.length, 1);

      let [pkgB1] = pkgA.dependencies;
      assert.equal(pkgB1.packageJSON.name, "b");
      assert.equal(pkgB1.packageJSON.version, "4.5.6");
      assert.deepEqual(pkgB1.packageJSON.dependencies, {});
      assert.equal(
        pkgB1.packageNodeModulesPath,
        join(project.root, "test-lib", "node_modules", "a", "node_modules", "b")
      );
      assert.equal(pkgB1.packageSrc, pkgB1.packageNodeModulesPath);
      assert.equal(pkgB1.dependencies.length, 0);

      assert.equal(pkgC.packageJSON.name, "c");
      assert.equal(pkgC.packageJSON.version, "1.2.3");
      assert.deepEqual(pkgC.packageJSON.dependencies, { b: "7.8.9" });
      assert.equal(
        pkgC.packageNodeModulesPath,
        join(project.root, "test-lib", "node_modules", "c")
      );
      assert.equal(pkgC.packageSrc, pkgC.packageNodeModulesPath);
      assert.equal(pkgC.dependencies.length, 1);

      let [pkgB2] = pkgC.dependencies;
      assert.equal(pkgB2.packageJSON.name, "b");
      assert.equal(pkgB2.packageJSON.version, "7.8.9");
      assert.deepEqual(pkgB2.packageJSON.dependencies, {});
      assert.equal(
        pkgB2.packageNodeModulesPath,
        join(project.root, "test-lib", "node_modules", "c", "node_modules", "b")
      );
      assert.equal(pkgB2.packageSrc, pkgB2.packageNodeModulesPath);
      assert.equal(pkgB2.dependencies.length, 0);
    });
  });

  // FOR THE LOVE OF GOD, DON'T FORGET TO REMOVE THE ONLY!!!!!!
  module.only("ES interop", function (hooks) {
    let project: Project;
    hooks.beforeEach(async function () {
      project = new Project("test-lib");
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
      });

      let pkgDep = pkg.addDependency("test-pkg-dep", "4.5.6");
      pkgDep.pkg = {
        name: "test-pkg-dep",
        version: "1.2.3",
      };
      merge(pkgDep.files, {
        "index.js": `
          module.exports.dep = 'dep';
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
      let builder = new Builder(new FileSystem(), [builderRoot]);
      await builder.build();
    });

    hooks.after(function () {
      project.dispose();
    });

    test("it wraps CJS files with runtime loader", async function (assert) {
      let src = readFileSync(
        join(
          project.root,
          "test-lib",
          "node_modules",
          "test-pkg",
          "index.cjs.js"
        ),
        { encoding: "utf8" }
      );
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

      src = readFileSync(
        join(project.root, "test-lib", "node_modules", "test-pkg", "a.cjs.js"),
        { encoding: "utf8" }
      );
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
      let src = readFileSync(
        join(project.root, "test-lib", "node_modules", "test-pkg", "index.js"),
        { encoding: "utf8" }
      );
      assert.codeEqual(
        src,
        `
        import implementation from "./index.js$cjs$";
        export default implementation();
        `
      );
      src = readFileSync(
        join(project.root, "test-lib", "node_modules", "test-pkg", "a.js"),
        { encoding: "utf8" }
      );
      assert.codeEqual(
        src,
        `
        import implementation from "./a.js$cjs$";
        export default implementation();
        `
      );
    });

    // TODO test for binding name collision with "dependencies"
    // TODO test for dupe requires()
  });

  module("lock files", function () {
    // Make sure to use pkg that has dep--we need to roll up pkg identifier for deps before we can determine our pkg identifier
    test("it creates lock file for packages", async function (assert) {});
  });
});
