import Project from "fixturify-project";
import { join } from "path";
import { readJSONSync } from "fs-extra";
import { NpmImportProjectsNode } from "../src/npm-import";
import { Builder } from "../../builder-worker/src/builder";
import { FileSystem } from "../../builder-worker/src/filesystem";

const { test } = QUnit;

QUnit.module("Install from  npm", function (hooks) {
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
    assert.equal(aEntrypoints.cjsIdentifier, "/node_modules/a");
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
    assert.equal(b1Entrypoints.cjsIdentifier, "/node_modules/a/node_modules/b");
    assert.notOk(b1Entrypoints.html);

    let cEntrypoints = readJSONSync(
      join(project.root, "test-lib", "node_modules", "c", "entrypoints.json")
    );
    assert.deepEqual(cEntrypoints.js, ["./index.js"]);
    assert.equal(cEntrypoints.cjsIdentifier, "/node_modules/c");
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
    assert.equal(b2Entrypoints.cjsIdentifier, "/node_modules/c/node_modules/b");
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
