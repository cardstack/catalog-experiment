import { parseSync } from "@babel/core";
import {
  ExportNamedDeclaration,
  ExportSpecifier,
  ImportDeclaration,
  ImportSpecifier,
} from "@babel/types";
import flatMap from "lodash/flatMap";

const code = `
  import { bar, bloop } from "foo";

  const vanGogh = "Van Gogh";
  const mango = "Mango";
  function cutestPuppies() {
    return [ vanGogh, mango, bar, bloop ];
  }

  export { vanGogh, mango, cutestPuppies };
`;
let file = parseSync(code, { configFile: false });
if (file?.type === "File") {
  let body = file.program.body;
  let importDeclarations = body.filter(
    (s) => s.type === "ImportDeclaration"
  ) as ImportDeclaration[];
  let exportNamedDeclarations = body.filter(
    (s) => s.type === "ExportNamedDeclaration"
  ) as ExportNamedDeclaration[];
  let namedImports = flatMap(importDeclarations, (d) =>
    (d.specifiers.filter(
      (s) => s.type === "ImportSpecifier"
    ) as ImportSpecifier[]).map((s) => s.imported.name)
  );
  let namedExports = flatMap(exportNamedDeclarations, (d) =>
    (d.specifiers.filter(
      (s) => s.type === "ExportSpecifier"
    ) as ExportSpecifier[]).map((s) => s.exported.name)
  );

  console.log(`Named imports are: ${namedImports.join()}`);
  console.log(`Named exports are: ${namedExports.join()}`);
}
