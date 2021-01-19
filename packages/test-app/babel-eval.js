import { parseSync } from "https://local-disk/bundles/@babel/core/7.9.0/mjrA8i7qhVIlMPwC63GVqBhU0eQ=/src/index.js";
import flatMap from "https://local-disk/bundles/lodash/4.17.19/NbTWX71F-LVzbYPD1xMbcjuRjD0=/flatMap.js";

// TODO test a bundle built from CJS sources as well

export function introspectESModule(code) {
  debugger;
  let file = parseSync(code);
  let body = file.program.body;
  let importDeclarations = body.filter((s) => s.type === "ImportDeclaration");
  let exportNamedDeclarations = body.filter(
    (s) => s.type === "ExportNamedDeclaration"
  );
  let namedImports = flatMap(importDeclarations, (d) =>
    d.specifiers
      .filter((s) => s.type === "ImportSpecifier")
      .map((s) => s.imported.name)
  );
  let namedExports = flatMap(exportNamedDeclarations, (d) =>
    d.specifiers
      .filter((s) => s.type === "ExportSpecifier")
      .map((s) => s.exported.name)
  );

  let title = document.createElement("h2");
  title.textContent = "Introspect ES Module";
  let codeEl = document.createElement("pre");
  codeEl.textContent = code;
  let importsMsg = document.createElement("p");
  importsMsg.textContent = `Named imports: ${namedImports.join()}`;
  let exportsMsg = document.createElement("p");
  exportsMsg.textContent = `Named exports: ${namedExports.join()}`;

  let demo = document.createElement("div");
  demo.append(title);
  demo.append(codeEl);
  demo.append(importsMsg);
  demo.append(exportsMsg);

  return demo;
}
