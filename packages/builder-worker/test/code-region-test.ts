import { IdentifierRegion, RegionBuilder } from "../src/code-region";
import { parse } from "@babel/core";

const { test, skip } = QUnit;

function makeCodeRegion(code: string) {
  let parsed = parse(code.trim());
  if (parsed?.type !== "File") {
    throw new Error(`parsed js for ${code} is not a babel File type`);
  }
  return new RegionBuilder().createCodeRegion(parsed.program);
}

QUnit.module("code-region", function () {
  skip("creates a code region for the program", function (assert) {
    let code = `
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);

    assert.ok(codeRegion, "code region was created");
    if (codeRegion) {
      assert.equal(codeRegion.type, "Program", "code region type is correct");
      assert.equal(codeRegion.start, 0, "code region start is correct");
      assert.equal(
        codeRegion.end,
        code.trim().length,
        "code region end is correct"
      );
      assert.equal(
        codeRegion.parent,
        undefined,
        "top level code region does not have a parent"
      );
      assert.equal(
        codeRegion.children.length,
        0,
        "the code region children count is correct"
      );
    }
  });

  skip("creates a code region for an import declaration for side effects only", function (assert) {
    let code = `
      import "bar";
      console.log('blah');
    `;
    let codeRegion = makeCodeRegion(code);
    assert.equal(
      codeRegion!.children.length,
      1,
      "code region has the correct number of children"
    );
    let [importDeclaration] = codeRegion!.children;
    assert.equal(
      importDeclaration.type,
      "ImportDeclaration",
      "code region type is correct"
    );
    assert.equal(importDeclaration.start, 0, "code region start is correct");
    assert.equal(importDeclaration.end, 13, "code region end is correct");
    assert.equal(
      importDeclaration.children.length,
      0,
      "code region no children"
    );
    assert.equal(
      importDeclaration.parent,
      codeRegion,
      `the code regions's parent is correct`
    );
  });

  skip("creates a code region for an import declaration", function (assert) {
    let code = `
      import { foo } from "bar";
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);
    assert.equal(
      codeRegion!.children.length,
      1,
      "code region has the correct number of children"
    );
    let [importDeclaration] = codeRegion!.children;
    assert.ok(importDeclaration, "import declaration child exists");
    assert.equal(
      importDeclaration.type,
      "ImportDeclaration",
      "code region type is correct"
    );
    assert.equal(importDeclaration.start, 0, "code region start is correct");
    assert.equal(importDeclaration.end, 26, "code region end is correct");
    assert.equal(
      importDeclaration.parent,
      codeRegion,
      `the code regions's parent is correct`
    );
  });

  skip("creates a code region for an import specifier", function (assert) {
    let code = `
      import { foo } from "bar";
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);
    let [importDeclaration] = codeRegion!.children;
    assert.equal(
      importDeclaration.children.length,
      1,
      "the children count is correct"
    );
    let [importSpecifier] = importDeclaration!.children;

    assert.ok(importSpecifier, "import specifier child exists");
    assert.equal(
      importSpecifier.type,
      "ImportSpecifier",
      "code region type is correct"
    );
    assert.equal(importSpecifier.start, 9, "code region start is correct");
    assert.equal(importSpecifier.end, 12, "code region end is correct");
    assert.equal(
      importSpecifier.parent,
      importDeclaration,
      `the code regions's parent is correct`
    );
  });

  skip("import specifier code region has identifier region", function (assert) {
    let code = `
      import { foo } from "bar";
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);
    let [importDeclaration] = codeRegion!.children;
    let [importSpecifier] = importDeclaration!.children;

    assert.equal(
      importSpecifier.children.length,
      1,
      "code region has the correct number of children"
    );
    let [identifier] = importSpecifier!.children as IdentifierRegion[];

    assert.ok(identifier, "identifier exists");
    assert.equal(identifier.type, "Identifier", "identifier type is correct");
    assert.equal(identifier.start, 9, "identifier start is correct");
    assert.equal(identifier.end, 12, "identifier end is correct");
    assert.equal(
      identifier.parent,
      importSpecifier,
      "identifier's parent is correct"
    );
    assert.equal(identifier.children.length, 0, "identifier has no children");
    assert.equal(
      identifier.shorthand,
      false,
      "identifier's shorthand is correct"
    );
  });

  skip("creates a code region for an import specifier name that has a differnt local name", function (assert) {
    let code = `
      import { foo as blue } from "bar";
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);
    let [importDeclaration] = codeRegion!.children;
    let [importSpecifier] = importDeclaration!.children;

    assert.equal(importSpecifier.start, 9, "code region start is correct");
    assert.equal(importSpecifier.end, 20, "code region end is correct");
    assert.equal(
      importSpecifier.children.length,
      2,
      "code region has the correct number of children"
    );
    let [importedIdentifier, localIdentifier] = importSpecifier!
      .children as IdentifierRegion[];

    assert.equal(
      importedIdentifier.type,
      "Identifier",
      "identifier type is correct"
    );
    assert.equal(importedIdentifier.start, 9, "identifier start is correct");
    assert.equal(importedIdentifier.end, 12, "identifier end is correct");
    assert.equal(
      importedIdentifier.parent,
      importSpecifier,
      "identifier's parent is correct"
    );
    assert.equal(
      importedIdentifier.children.length,
      0,
      "identifier has no children"
    );
    assert.equal(
      importedIdentifier.shorthand,
      "as",
      "identifier's shorthand is correct"
    );

    assert.equal(
      localIdentifier.type,
      "Identifier",
      "identifier type is correct"
    );
    assert.equal(localIdentifier.start, 16, "identifier start is correct");
    assert.equal(localIdentifier.end, 20, "identifier end is correct");
    assert.equal(
      localIdentifier.parent,
      importSpecifier,
      "identifier's parent is correct"
    );
    assert.equal(
      localIdentifier.children.length,
      0,
      "identifier has no children"
    );
    assert.equal(
      localIdentifier.shorthand,
      false,
      "identifier's shorthand is correct"
    );
  });

  skip("creates a code region for multiple specifiers in an import declaration", function (assert) {
    let code = `
      import { baz, foo as blue } from "bar";
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);
    let [importDeclaration] = codeRegion!.children;
    assert.equal(
      importDeclaration.children.length,
      2,
      "the children count is correct"
    );
    let [specifier1, specifier2] = importDeclaration!.children;
    assert.equal(
      specifier1.type,
      "ImportSpecifier",
      "code region type is correct"
    );
    assert.equal(specifier1.start, 9, "code region start is correct");
    assert.equal(specifier1.end, 12, "code region end is correct");
    assert.equal(specifier2.start, 14, "code region start is correct");
    assert.equal(specifier2.end, 25, "code region end is correct");
  });

  skip("create a code region for a default import specifier", function (assert) {
    let code = `
      import foo from "bar";
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);
    let [importDeclaration] = codeRegion!.children;
    assert.equal(
      importDeclaration.children.length,
      1,
      "the children count is correct"
    );
    let [specifier] = importDeclaration!.children;
    assert.equal(
      specifier.type,
      "ImportDefaultSpecifier",
      "code region type is correct"
    );
    assert.equal(specifier.start, 7, "code region start is correct");
    assert.equal(specifier.end, 10, "code region start is correct");
    assert.equal(
      specifier.parent,
      importDeclaration,
      "code region parent is correct"
    );
  });

  skip("default import specifier has an identifier region", function (assert) {
    let code = `
      import foo from "bar";
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);
    let [importDeclaration] = codeRegion!.children;
    let [specifier] = importDeclaration!.children;
    assert.equal(specifier.children.length, 1, "the children count is correct");
    let [identifier] = specifier.children as IdentifierRegion[];
    assert.equal(
      identifier.type,
      "Identifier",
      "identifier region type is correct"
    );
    assert.equal(identifier.start, 7, "identifier region start is correct");
    assert.equal(identifier.end, 10, "identifier region end is correct");
    assert.equal(
      identifier.shorthand,
      false,
      "identifier region shorthand is correct"
    );
    assert.equal(
      identifier.parent,
      specifier,
      "identifier region parent is correct"
    );
    assert.equal(
      identifier.children.length,
      0,
      "identifier region children count is correct"
    );
  });

  skip("create a code region for a namespace import specifier", function (assert) {
    let code = `
      import * as foo from "bar";
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);
    let [importDeclaration] = codeRegion!.children;
    assert.equal(
      importDeclaration.children.length,
      1,
      "the children count is correct"
    );
    let [specifier] = importDeclaration!.children;
    assert.equal(
      specifier.type,
      "ImportNamespaceSpecifier",
      "code region type is correct"
    );
    assert.equal(specifier.start, 7, "code region start is correct");
    assert.equal(specifier.end, 15, "code region start is correct");
    assert.equal(
      specifier.parent,
      importDeclaration,
      "code region parent is correct"
    );
  });

  skip("namespace import specifier has an identifier region", function (assert) {
    let code = `
      import * as foo from "bar";
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);
    let [importDeclaration] = codeRegion!.children;
    let [specifier] = importDeclaration!.children;
    assert.equal(specifier.children.length, 1, "the children count is correct");
    let [identifier] = specifier.children as IdentifierRegion[];
    assert.equal(
      identifier.type,
      "Identifier",
      "identifier region type is correct"
    );
    assert.equal(identifier.start, 12, "identifier region start is correct");
    assert.equal(identifier.end, 15, "identifier region end is correct");
    assert.equal(
      identifier.shorthand,
      false,
      "identifier region shorthand is correct"
    );
    assert.equal(
      identifier.parent,
      specifier,
      "identifier region parent is correct"
    );
    assert.equal(
      identifier.children.length,
      0,
      "identifier region children count is correct"
    );
  });

  skip("create code region for import declaration that uses default specifier and named specifiers", function (assert) {
    let code = `
      import foo, { fee, fie as fum } from "bar";
      console.log(foo());
    `;
    let codeRegion = makeCodeRegion(code);
    let [importDeclaration] = codeRegion!.children;
    assert.equal(
      importDeclaration.children.length,
      3,
      "the children count is correct"
    );
    let [spec1, spec2, spec3] = importDeclaration!.children;
    assert.equal(
      spec1.type,
      "ImportDefaultSpecifier",
      "code group type is correct"
    );
    assert.equal(spec1.start, 7, "code group start is correct");
    assert.equal(spec1.end, 10, "code group end is correct");
    assert.equal(
      spec1.children.length,
      1,
      "code group children count is correct"
    );

    assert.equal(spec2.type, "ImportSpecifier", "code group type is correct");
    assert.equal(spec2.start, 14, "code group start is correct");
    assert.equal(spec2.end, 17, "code group end is correct");
    assert.equal(
      spec2.children.length,
      1,
      "code group children count is correct"
    );

    assert.equal(spec3.type, "ImportSpecifier", "code group type is correct");
    assert.equal(spec3.start, 19, "code group start is correct");
    assert.equal(spec3.end, 29, "code group end is correct");
    assert.equal(
      spec3.children.length,
      2,
      "code group children count is correct"
    );
  });

  skip("creates a code region for an named export declaration", function (assert) {
    let code = `
    export const a = 1;
    `;
    let codeRegion = makeCodeRegion(code);
    assert.equal(
      codeRegion!.children.length,
      1,
      "code region has the correct number of children"
    );
    let [exportDeclaration] = codeRegion!.children;
    assert.equal(
      exportDeclaration.type,
      "ExportNamedDeclaration",
      "code region type is correct"
    );
    assert.equal(exportDeclaration.start, 0, "code region start is correct");
    assert.equal(exportDeclaration.end, 19, "code region end is correct");
    assert.equal(
      exportDeclaration.parent,
      codeRegion,
      `the code regions's parent is correct`
    );
  });

  skip("named export has code region for function declaration", function (assert) {
    let code = `
    export function foo() { console.log('foo'); }
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    assert.equal(
      exportDeclaration.children.length,
      1,
      "code region has correct child count"
    );
    let [functionDeclaration] = exportDeclaration.children;
    assert.equal(
      functionDeclaration.type,
      "FunctionDeclaration",
      "code region type is correct"
    );
    assert.equal(functionDeclaration.start, 7, "code region start is correct");
    assert.equal(functionDeclaration.end, 45, "code region end is correct");
    assert.equal(
      functionDeclaration.parent,
      exportDeclaration,
      `the code regions's parent is correct`
    );
  });

  skip("function declaration with name has an identifier region", function (assert) {
    let code = `
    export function foo() { console.log('foo'); }
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [functionDeclaration] = exportDeclaration.children;
    assert.equal(
      functionDeclaration.children.length,
      1,
      "code region has correct child count"
    );
    let [identifier] = functionDeclaration.children as IdentifierRegion[];
    assert.equal(
      identifier.type,
      "Identifier",
      "identifier region type is correct"
    );
    assert.equal(identifier.start, 16, "identifier region start is correct");
    assert.equal(identifier.end, 19, "identifier region end is correct");
    assert.equal(
      identifier.shorthand,
      false,
      "identifier region shorthand is correct"
    );
    assert.equal(
      identifier.parent,
      functionDeclaration,
      "identifier region parent is correct"
    );
    assert.equal(
      identifier.children.length,
      0,
      "identifier region children count is correct"
    );
  });

  skip("named export has code region for class declaration", function (assert) {
    let code = `
    export class foo {}
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    assert.equal(
      exportDeclaration.children.length,
      1,
      "code region has correct child count"
    );
    let [classDeclaration] = exportDeclaration.children;
    assert.equal(
      classDeclaration.type,
      "ClassDeclaration",
      "code region type is correct"
    );
    assert.equal(classDeclaration.start, 7, "code region start is correct");
    assert.equal(classDeclaration.end, 19, "code region end is correct");
    assert.equal(
      classDeclaration.parent,
      exportDeclaration,
      `the code regions's parent is correct`
    );
  });

  skip("class declaration has an identifier region", function (assert) {
    let code = `
    export class foo {}
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [classDeclaration] = exportDeclaration.children;
    assert.equal(
      classDeclaration.children.length,
      1,
      "code region has correct child count"
    );
    let [identifier] = classDeclaration.children as IdentifierRegion[];
    assert.equal(
      identifier.type,
      "Identifier",
      "identifier region type is correct"
    );
    assert.equal(identifier.start, 13, "identifier region start is correct");
    assert.equal(identifier.end, 16, "identifier region end is correct");
    assert.equal(
      identifier.shorthand,
      false,
      "identifier region shorthand is correct"
    );
    assert.equal(
      identifier.parent,
      classDeclaration,
      "identifier region parent is correct"
    );
    assert.equal(
      identifier.children.length,
      0,
      "identifier region children count is correct"
    );
  });

  skip("named export has code region for variable declaration", function (assert) {
    let code = `
    export const a = 1;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    assert.equal(
      exportDeclaration.children.length,
      1,
      "code region has correct child count"
    );
    let [variableDeclaration] = exportDeclaration.children;

    assert.equal(
      variableDeclaration.type,
      "VariableDeclaration",
      "code region type is correct"
    );
    assert.equal(variableDeclaration.start, 7, "code region start is correct");
    assert.equal(variableDeclaration.end, 19, "code region end is correct");
    assert.equal(
      variableDeclaration.parent,
      exportDeclaration,
      `the code regions's parent is correct`
    );
  });

  skip("variable declaration has code region for variable declarator", function (assert) {
    let code = `
    export const a = 1;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    assert.equal(
      variableDeclaration.children.length,
      1,
      "code region has correct child count"
    );
    let [declarator] = variableDeclaration.children as IdentifierRegion[];
    assert.equal(
      declarator.type,
      "VariableDeclarator",
      "code region type is correct"
    );
    assert.equal(declarator.start, 13, "code region start is correct");
    assert.equal(declarator.end, 18, "code region end is correct");
    assert.equal(
      declarator.parent,
      variableDeclaration,
      `the code regions's parent is correct`
    );
  });

  skip("variable declarator has an identifier region", function (assert) {
    let code = `
    export const a = 1;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    assert.equal(
      declarator.children.length,
      1,
      "code region has correct child count"
    );
    let [identifier] = declarator.children as IdentifierRegion[];
    assert.equal(
      identifier.type,
      "Identifier",
      "identifier region type is correct"
    );
    assert.equal(identifier.start, 13, "identifier region start is correct");
    assert.equal(identifier.end, 14, "identifier region end is correct");
    assert.equal(
      identifier.shorthand,
      false,
      "identifier region shorthand is correct"
    );
    assert.equal(
      identifier.parent,
      declarator,
      "identifier region parent is correct"
    );
    assert.equal(
      identifier.children.length,
      0,
      "identifier region children count is correct"
    );
  });

  skip("variable declaration has code region for ObjectPattern", function (assert) {
    let code = `
    export const { a } = 1;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    assert.equal(
      declarator.children.length,
      1,
      "code region has correct child count"
    );
    let [lval] = declarator.children;
    assert.equal(lval.type, "ObjectPattern", "code region type is correct");
    assert.equal(lval.start, 13, "code region start is correct");
    assert.equal(lval.end, 18, "code region end is correct");
    assert.equal(
      lval.parent,
      declarator,
      `the code regions's parent is correct`
    );
  });

  skip("ObjectPattern has code regions for ObjectProperties", function (assert) {
    let code = `
    export const { a, foo } = baz;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    let [lval] = declarator.children;
    assert.equal(
      lval.children.length,
      2,
      "code region has correct child count"
    );
    let [prop1, prop2] = lval.children;
    assert.equal(prop1.type, "ObjectProperty", "code region type is correct");
    assert.equal(prop1.start, 15, "code region start is correct");
    assert.equal(prop1.end, 16, "code region end is correct");
    assert.equal(prop1.parent, lval, `the code regions's parent is correct`);

    assert.equal(prop2.start, 18, "code region start is correct");
    assert.equal(prop2.end, 21, "code region end is correct");
    assert.equal(prop2.parent, lval, `the code regions's parent is correct`);
  });

  skip("ObjectProperty has identifier region", function (assert) {
    let code = `
    export const { a } = baz;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    let [lval] = declarator.children;
    let [prop] = lval.children;
    assert.equal(
      prop.children.length,
      1,
      "code region has correct child count"
    );
    let [identifier] = prop.children as IdentifierRegion[];
    assert.equal(
      identifier.type,
      "Identifier",
      "identifier region type is correct"
    );
    assert.equal(identifier.start, 15, "identifier region start is correct");
    assert.equal(identifier.end, 16, "identifier region end is correct");
    assert.equal(
      identifier.shorthand,
      false,
      "identifier region shorthand end is correct"
    );
    assert.equal(
      identifier.parent,
      prop,
      `the identifier regions's parent is correct`
    );
    assert.equal(
      identifier.children.length,
      0,
      "identifier region has correct child count"
    );
  });

  skip("ObjectProperty can have identifier region ':' shorthand", function (assert) {
    let code = `
    export const { a: foo } = baz;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    let [lval] = declarator.children;
    let [prop] = lval.children;
    assert.equal(
      prop.children.length,
      2,
      "code region has correct child count"
    );
    let [id1, id2] = prop.children as IdentifierRegion[];
    assert.equal(id1.start, 15, "identifier region start is correct");
    assert.equal(id1.end, 16, "identifier region end is correct");
    assert.equal(
      id1.shorthand,
      ":",
      "identifier region shorthand end is correct"
    );
    assert.equal(id2.start, 18, "identifier region start is correct");
    assert.equal(id2.end, 21, "identifier region end is correct");
    assert.equal(
      id2.shorthand,
      false,
      "identifier region shorthand end is correct"
    );
  });

  skip("ObjectProperty can have LVal code region", function (assert) {
    let code = `
    export const { a: [ foo ] } = baz;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    let [objectPat] = declarator.children;
    let [prop] = objectPat.children;
    assert.equal(
      prop.children.length,
      1,
      "code region has correct child count"
    );
    let [lval] = prop.children;
    assert.equal(lval.type, "ArrayPattern", "code region type is correct");
    assert.equal(lval.start, 18, "code region start is correct");
    assert.equal(lval.end, 25, "code region end is correct");
    assert.equal(lval.parent, prop, `the code regions's parent is correct`);
  });

  skip("variable declaration has code region for ArrayPattern", function (assert) {
    let code = `
    export const [ foo, bar ] = baz;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    assert.equal(
      declarator.children.length,
      1,
      "code region has correct child count"
    );
    let [lval] = declarator.children;
    assert.equal(lval.type, "ArrayPattern", "code region type is correct");
    assert.equal(lval.start, 13, "code region start is correct");
    assert.equal(lval.end, 25, "code region end is correct");
    assert.equal(
      lval.parent,
      declarator,
      `the code regions's parent is correct`
    );
  });

  skip("ArrayPattern can have an identity region", function (assert) {
    let code = `
    export const [ foo, bar ] = baz;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    let [arrayPattern] = declarator.children;
    assert.equal(
      arrayPattern.children.length,
      2,
      "code region has correct child count"
    );
    let [id1, id2] = arrayPattern.children as IdentifierRegion[];
    assert.equal(id1.start, 15, "identifier region start is correct");
    assert.equal(id1.end, 18, "identifier region end is correct");
    assert.equal(
      id1.shorthand,
      false,
      "identifier region shorthand end is correct"
    );
    assert.equal(
      id1.parent,
      arrayPattern,
      "identifier region parent is correct"
    );
    assert.equal(
      id1.children.length,
      0,
      "identifier region children count is correct"
    );

    assert.equal(id2.start, 20, "identifier region start is correct");
    assert.equal(id2.end, 23, "identifier region end is correct");
    assert.equal(
      id2.shorthand,
      false,
      "identifier region shorthand end is correct"
    );
  });

  skip("ArrayPattern can have an LVal code region", function (assert) {
    let code = `
    export const [ foo, { bar } ] = baz;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    let [arrayPattern] = declarator.children;
    assert.equal(
      arrayPattern.children.length,
      2,
      "code region has correct child count"
    );
    let [id1, lval] = arrayPattern.children as IdentifierRegion[];
    assert.equal(id1.type, "Identifier", "identifier region type is correct");
    assert.equal(lval.type, "ObjectPattern", "code region type is correct");
    assert.equal(lval.start, 20, "code region start is correct");
    assert.equal(lval.end, 27, "code region end is correct");
    assert.equal(
      lval.parent,
      arrayPattern,
      `the code regions's parent is correct`
    );
  });

  skip("array pattern has code region for RestElement", function (assert) {
    let code = `
    export const [ ...foo ] = baz;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    let [arrayPattern] = declarator.children;
    assert.equal(
      arrayPattern.children.length,
      1,
      "code region has correct child count"
    );
    let [rest] = arrayPattern.children;
    assert.equal(rest.type, "RestElement", "code region type is correct");
    assert.equal(rest.start, 15, "code region start is correct");
    assert.equal(rest.end, 21, "code region end is correct");
    assert.equal(
      rest.parent,
      arrayPattern,
      `the code regions's parent is correct`
    );
  });

  skip("RestElement has identifier region", function (assert) {
    let code = `
    export const [ ...foo ] = baz;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    let [arrayPattern] = declarator.children;
    let [rest] = arrayPattern.children;
    assert.equal(
      rest.children.length,
      1,
      "code region has correct child count"
    );

    let [id] = rest.children as IdentifierRegion[];
    assert.equal(id.type, "Identifier", "identifier region type is correct");
    assert.equal(id.start, 18, "identifier region start is correct");
    assert.equal(id.end, 21, "identifier region end is correct");
    assert.equal(
      id.shorthand,
      false,
      "identifier region shorthand end is correct"
    );
    assert.equal(id.parent, rest, `the identifier regions's parent is correct`);
    assert.equal(
      id.children.length,
      0,
      "identifier region has correct child count"
    );
  });

  skip("RestElement has code region for LVal", function (assert) {
    let code = `
    export const [ ...{ foo }] = baz;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    let [declarator] = variableDeclaration.children;
    let [arrayPattern] = declarator.children;
    let [rest] = arrayPattern.children;
    assert.equal(
      rest.children.length,
      1,
      "code region has correct child count"
    );

    let [id] = rest.children;
    assert.equal(id.type, "ObjectPattern", "identifier region type is correct");
    assert.equal(id.start, 18, "identifier region start is correct");
    assert.equal(id.end, 25, "identifier region end is correct");
    assert.equal(id.parent, rest, `the identifier regions's parent is correct`);
  });

  skip("variable declaration can have mulitple declarator code regions", function (assert) {
    let code = `
    export const a = 1, blah = 2;
    `;
    let codeRegion = makeCodeRegion(code);
    let [exportDeclaration] = codeRegion!.children;
    let [variableDeclaration] = exportDeclaration.children;
    assert.equal(
      variableDeclaration.children.length,
      2,
      "code region has correct child count"
    );
    let [decl1, decl2] = variableDeclaration.children as IdentifierRegion[];
    assert.equal(decl1.start, 13, "code region start is correct");
    assert.equal(decl1.end, 18, "code region end is correct");

    assert.equal(decl2.start, 20, "code region start is correct");
    assert.equal(decl2.end, 28, "code region end is correct");
  });

  skip("named export has a code region for a specifier", function (assert) {
    let code = `
    let foo, bar;
    export { foo };
    `;
    let codeRegion = makeCodeRegion(code);
    let [, exportDeclaration] = codeRegion!.children;
    assert.equal(
      exportDeclaration.children.length,
      1,
      "code region has correct child count"
    );
    let [specifier] = exportDeclaration.children;

    assert.equal(
      specifier.type,
      "ExportSpecifier",
      "code region type is correct"
    );
    assert.equal(specifier.start, 27, "code region start is correct");
    assert.equal(specifier.end, 30, "code region end is correct");
    assert.equal(
      specifier.parent,
      exportDeclaration,
      `the code regions's parent is correct`
    );
  });

  skip("named export has a code regions for multiple specifiers", function (assert) {
    let code = `
    let foo, bar;
    export { foo as bleep, bar };
    `;
    let codeRegion = makeCodeRegion(code);
    let [, exportDeclaration] = codeRegion!.children;
    assert.equal(
      exportDeclaration.children.length,
      2,
      "code region has correct child count"
    );
    let [spec1, spec2] = exportDeclaration.children;

    assert.equal(spec1.start, 27, "code region start is correct");
    assert.equal(spec1.end, 39, "code region end is correct");
    assert.equal(
      spec1.parent,
      exportDeclaration,
      `the code regions's parent is correct`
    );
    assert.equal(
      spec1.children.length,
      2,
      "code region children count is correct"
    );

    assert.equal(spec2.start, 41, "code region start is correct");
    assert.equal(spec2.end, 44, "code region end is correct");
    assert.equal(
      spec2.parent,
      exportDeclaration,
      `the code regions's parent is correct`
    );
    assert.equal(
      spec2.children.length,
      1,
      "code region children count is correct"
    );
  });

  skip("export specifier has an identifier region", function (assert) {
    let code = `
    let foo, bar;
    export { foo };
    `;
    let codeRegion = makeCodeRegion(code);
    let [, exportDeclaration] = codeRegion!.children;
    let [specifier] = exportDeclaration.children;
    assert.equal(
      specifier.children.length,
      1,
      "code region has correct child count"
    );
    let [identifier] = specifier.children as IdentifierRegion[];
    assert.equal(
      identifier.type,
      "Identifier",
      "identifier region type is correct"
    );
    assert.equal(identifier.start, 27, "identifier region start is correct");
    assert.equal(identifier.end, 30, "identifier region end is correct");
    assert.equal(
      identifier.shorthand,
      false,
      "identifier region shorthand is correct"
    );
    assert.equal(
      identifier.parent,
      specifier,
      "identifier region parent is correct"
    );
    assert.equal(
      identifier.children.length,
      0,
      "identifier region children count is correct"
    );
  });

  skip("renamed export specifier has an identifier region for the local name and exported name", function (assert) {
    let code = `
    let foo, bar;
    export { foo as bleep };
    `;
    let codeRegion = makeCodeRegion(code);
    let [, exportDeclaration] = codeRegion!.children;
    let [specifier] = exportDeclaration.children;
    assert.equal(
      specifier.children.length,
      2,
      "code region has correct child count"
    );
    let [local, exported] = specifier.children as IdentifierRegion[];
    assert.equal(local.start, 27, "identifier region start is correct");
    assert.equal(local.end, 30, "identifier region end is correct");
    assert.equal(
      local.shorthand,
      "as",
      "identifier region shorthand is correct"
    );

    assert.equal(exported.start, 34, "identifier region start is correct");
    assert.equal(exported.end, 39, "identifier region end is correct");
    assert.equal(
      exported.shorthand,
      false,
      "identifier region shorthand is correct"
    );
  });

  skip("default export has a code region", function (assert) {
    let code = `
    let foo, bar;
    export default { baz: bar, foo }
    `;
    let codeRegion = makeCodeRegion(code);
    let [, exportDeclaration] = codeRegion!.children;

    assert.equal(
      exportDeclaration.type,
      "ExportDefaultDeclaration",
      "code region type is correct"
    );
    assert.equal(exportDeclaration.start, 18, "code region start is correct");
    assert.equal(exportDeclaration.end, 50, "code region end is correct");
    assert.equal(
      exportDeclaration.parent,
      codeRegion,
      `the code regions's parent is correct`
    );
    assert.equal(
      exportDeclaration.children.length,
      0,
      `the code regions's children count is correct`
    );
  });
});
