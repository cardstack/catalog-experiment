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

QUnit.module("combine modules", function (origHooks) {
  let { test } = installFileAssertions(origHooks);

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
      throw new Error(
        `parsed js for ${moduleURL.href} is not a babel File type`
      );
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
});
