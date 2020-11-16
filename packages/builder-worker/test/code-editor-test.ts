import "./helpers/code-equality-assertions";
import { describeESModule } from "./helpers/file-description";
import {
  declarationsMap,
  FileDescription,
  LocalExportDescription,
  ModuleDescription,
} from "../src/describe-file";
import {
  CodeRegion,
  DeclarationCodeRegion,
  RegionEditor,
} from "../src/code-region";

const { test } = QUnit;

function keepAll(desc: FileDescription, editor: RegionEditor) {
  for (let i = 0; i < desc.regions.length; i++) {
    editor.keepRegion(i);
  }
}

function makeDescFromRegions(regions: CodeRegion[]): ModuleDescription {
  return {
    regions,
    declarations: declarationsMap(regions),
    exports: new Map(),
    imports: [],
    exportRegions: [],
  };
}

QUnit.module("module code-editor", function () {
  test("can serialize code regions", function (assert) {
    let { desc, editor } = describeESModule(`
        const a = 'a';
        const b = 'b';
        console.log(a + b);
        export { a as A, b };
    `);
    keepAll(desc, editor);
    let { code, regions } = editor.serialize();

    let a = regions.find(
      (r) => r.type === "declaration" && r.declaration.declaredName === "a"
    ) as DeclarationCodeRegion;
    assert.ok(a, "code region exists");
    assert.equal(a.declaration.declaredName, "a");
    assert.equal(a.declaration.type, "local");

    let b = regions.find(
      (r) => r.type === "declaration" && r.declaration.declaredName === "b"
    ) as DeclarationCodeRegion;
    assert.equal(b.declaration.declaredName, "b");
    assert.equal(b.declaration.type, "local");

    // TODO assert that the "declaration.original" property is populated

    assert.equal(desc.exports.get("A")?.type, "local");
    assert.equal((desc.exports.get("A") as LocalExportDescription).name, "a");
    assert.equal(desc.exports.get("b")?.type, "local");
    assert.equal((desc.exports.get("b") as LocalExportDescription).name, "b");

    // rename using the new code regions to prove they are correct
    let newDesc = makeDescFromRegions(regions);
    let newEditor = new RegionEditor(code, newDesc);
    keepAll(newDesc, newEditor);
    newEditor.rename("a", "renamedA");
    newEditor.rename("b", "renamedB");
    assert.codeEqual(
      newEditor.serialize().code,
      `
      const renamedA = 'a';
      const renamedB = 'b';
      console.log(renamedA + renamedB);
      export { renamedA as A, renamedB as b };
      `
    );
  });

  test("serialized code regions reflect renamed declarations", function (assert) {
    let { desc, editor } = describeESModule(`
        const a = 'a';
        const b = 'b';
        console.log(a + b);
        export { a as A, b };
    `);
    keepAll(desc, editor);
    editor.rename("a", "renamedA");
    editor.rename("b", "renamedB");

    let { code, regions } = editor.serialize();

    let a = regions.find(
      (r) =>
        r.type === "declaration" && r.declaration.declaredName === "renamedA"
    ) as DeclarationCodeRegion;
    assert.ok(a, "code region exists");
    assert.equal(a.declaration.declaredName, "renamedA");
    assert.equal(a.declaration.type, "local");

    let b = regions.find(
      (r) =>
        r.type === "declaration" && r.declaration.declaredName === "renamedB"
    ) as DeclarationCodeRegion;
    assert.equal(b.declaration.declaredName, "renamedB");
    assert.equal(b.declaration.type, "local");

    // TODO assert that the "declaration.original" property is populated

    assert.codeEqual(
      code,
      `
      const renamedA = 'a';
      const renamedB = 'b';
      console.log(renamedA + renamedB);
      export { renamedA as A, renamedB as b };
      `
    );

    // rename using the new code regions to prove they are correct
    let newDesc = makeDescFromRegions(regions);
    let newEditor = new RegionEditor(code, newDesc);
    keepAll(newDesc, newEditor);
    newEditor.rename("renamedA", "alpha");
    newEditor.rename("renamedB", "beta");
    assert.codeEqual(
      newEditor.serialize().code,
      `
      const alpha = 'a';
      const beta = 'b';
      console.log(alpha + beta);
      export { alpha as A, beta as b };
      `
    );
  });

  test("serialized code regions reflect wrapped regions", function (assert) {
    // In this example region 1 is the ExportDefaultDeclaration and region 2 is
    // FunctionDeclaration
    let { desc, editor } = describeESModule(`
      export default function () { console.log("hi"); }
    `);
    keepAll(desc, editor);
    editor.removeRegion(1);
    editor.wrapWithDeclaration(2, "_default");

    let { code, regions } = editor.serialize();
    let declaration = regions.find(
      (r) =>
        r.type === "declaration" && r.declaration.declaredName === "_default"
    ) as DeclarationCodeRegion;
    assert.ok(declaration, "code region exists");
    assert.equal(declaration.declaration.declaredName, "_default");
    assert.equal(declaration.declaration.type, "local");

    // TODO assert that the "declaration.original" property is populated

    assert.codeEqual(
      code,
      `
      const _default = (function() { console.log("hi"); });
      `
    );
    // replace using the new code regions to prove they are correct
    let newDesc = makeDescFromRegions(regions);
    let newEditor = new RegionEditor(code, newDesc);
    keepAll(newDesc, newEditor);
    newEditor.rename("_default", "d");
    newEditor.replace(
      newDesc.declarations.get("_default")!.declaration.sideEffects!,
      `"replaced"`
    );
    assert.codeEqual(
      newEditor.serialize().code,
      `
      const d = ("replaced");
      `
    );
  });

  test("serialized code regions reflect removed regions", function (assert) {
    // In this example region 1 is the ExportDefaultDeclaration and region 2 is
    // VariableDeclaration
    let { desc, editor } = describeESModule(`
      export const a = 'a';
      const b = 'b', c = 'c';
      console.log(a + c);
    `);
    keepAll(desc, editor);
    editor.removeRegion(1);
    let { pointer: b } = desc.declarations.get("b")!;
    editor.removeRegionAndItsChildren(b);

    let { code, regions } = editor.serialize();
    assert.ok(
      regions.find(
        (r) => r.type === "declaration" && r.declaration.declaredName === "a"
      ),
      "code region exists"
    );
    assert.ok(
      regions.find(
        (r) => r.type === "declaration" && r.declaration.declaredName === "c"
      ),
      "code region exists"
    );
    assert.notOk(
      regions.find(
        (r) => r.type === "declaration" && r.declaration.declaredName === "b"
      ),
      "code region does not exist"
    );

    assert.codeEqual(
      code,
      `
      const a = 'a';
      const c = 'c';
      console.log(a + c);
      `
    );

    // replace using the new code regions to prove they are correct
    let newDesc = makeDescFromRegions(regions);
    let newEditor = new RegionEditor(code, newDesc);
    keepAll(newDesc, newEditor);
    newEditor.rename("a", "renamedA");
    newEditor.rename("c", "renamedC");
    assert.codeEqual(
      newEditor.serialize().code,
      `
      const renamedA = 'a';
      const renamedC = 'c';
      console.log(renamedA + renamedC);
      `
    );
  });

  test("serialized code regions reflect renamed declarations within a removed region", function (assert) {});

  test("serialized code regions reflect renamed declarations within a wrapped region", function (assert) {});

  test("serialized code regions preserve module side effects", function (assert) {});
});
