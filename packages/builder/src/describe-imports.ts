import { File, ImportDeclaration } from "@babel/types";
import traverse, { NodePath } from "@babel/traverse";

export interface ImportDescription {
  specifier: string;
  isDynamic: boolean;
}

export function describeImports(ast: File): ImportDescription[] {
  let imports: ImportDescription[] = [];
  traverse(ast, {
    ImportDeclaration(path: NodePath<ImportDeclaration>) {
      imports.push({
        specifier: path.node.source.value,
        isDynamic: false,
      });
    },
  });
  return imports;
}
