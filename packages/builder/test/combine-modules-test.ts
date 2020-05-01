import { installFileAssertions } from "./helpers/file-assertions";
import { combineModules } from "../src/combine-modules";
import { Resolver, ModuleResolution } from "../src/nodes/resolution";
import {
  BundleAssignments,
  Bundle,
  AssignmentConfig,
} from "../src/nodes/bundle";
import { describeImports } from "../src/describe-module";
import { parse } from "@babel/core";
import { url } from "./helpers/file-assertions";
import { FileSystem } from "../src/filesystem";

let resolver = new Resolver(); // TODO need to resolve modules without '.js' extension

function bundleAtUrl(assignments: BundleAssignments, url: URL): Bundle {
  return assignments.bundles.find((b) => b.url.href === url.href)!;
}

async function makeModuleResolutions(
  fs: FileSystem,
  moduleURL: URL
): Promise<ModuleResolution> {
  let js = await (await fs.open(moduleURL)).readText();
  let parsed = parse(js);
  if (parsed?.type !== "File") {
    throw new Error(`parsed js for ${moduleURL.href} is not a babel File type`);
  }
  let imports: ModuleResolution["imports"] = {};
  await Promise.all(
    describeImports(parsed).map(async (desc) => {
      let depURL = await resolver.resolve(desc.specifier, moduleURL);
      imports[desc.specifier] = {
        desc,
        resolution: await makeModuleResolutions(fs, depURL),
      };
    })
  );
  return { url: moduleURL, parsed, imports };
}

async function makeBundleAssignments(
  fs: FileSystem,
  entrypoints: URL[],
  config?: AssignmentConfig
): Promise<BundleAssignments> {
  let resolutions = await Promise.all(
    entrypoints.map((e) => makeModuleResolutions(fs, e))
  );
  return new BundleAssignments(resolutions, config);
}

QUnit.module("combine modules", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

  test("it can combine modules", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { a } from './a.js';
        import { b } from './b.js';
        console.log(a + b);
      `,
      "a.js": `export const a = 'a';`,
      "b.js": `export const b = 'b';`,
    });

    let assignments = await makeBundleAssignments(assert.fs, [url("index.js")]);
    let combined = combineModules(
      bundleAtUrl(assignments, url("dist/0.js")),
      assignments
    );

    assert.equal(
      combined,
      `
const a = 'a';
const b = 'b';
console.log(a + b);
    `.trim()
    );
  });

  test("internal imports share the same name in multiple modules", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { hello } from './lib.js';
        import { b } from './b.js';
        console.log(hello + b);
      `,
      "lib.js": `export const hello = 'hello';`,
      "b.js": `
        import { hello } from './lib.js';
        export const b = hello + '!';`,
    });

    let assignments = await makeBundleAssignments(assert.fs, [url("index.js")]);
    let combined = combineModules(
      bundleAtUrl(assignments, url("dist/0.js")),
      assignments
    );

    assert.equal(
      combined,
      `
const hello = 'hello';
const b = hello + '!';
console.log(hello + b);
    `.trim()
    );
  });

  test("internal imports with local renaming share the same name in multiple modules", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import { hello } from './lib.js';
        import { b } from './b.js';
        console.log(hello + b);
      `,
      "lib.js": `export const hello = 'hello';`,
      "b.js": `
        import { hello as h } from './lib.js';
        export const b = h + '!';`,
    });

    let assignments = await makeBundleAssignments(assert.fs, [url("index.js")]);
    let combined = combineModules(
      bundleAtUrl(assignments, url("dist/0.js")),
      assignments
    );

    assert.equal(
      combined,
      `
const hello = 'hello';
const b = hello + '!';
console.log(hello + b);
    `.trim()
    );
  });

  test("it prevents collisions between module-scoped bindings", async function (assert) {
    await assert.setupFiles({
      "index.js": `
        import './a.js';
        let shared = 1;
        console.log(shared);
      `,
      "a.js": `
        import './b.js';
        let shared = 2;
        console.log(shared);
      `,
      "b.js": `
        let shared = 3;
        console.log(shared);
      `,
    });

    let assignments = await makeBundleAssignments(assert.fs, [url("index.js")]);
    let combined = combineModules(
      bundleAtUrl(assignments, url("dist/0.js")),
      assignments
    );

    assert.equal(
      combined,
      `
let shared1 = 3;
console.log(shared1);
let shared0 = 2;
console.log(shared0);
let shared = 1;
console.log(shared);
    `.trim()
    );
  });
});
