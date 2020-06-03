// The purpose of a CodeRegion is to mark a region of source code that we may be
// able to remove or replace. CodeRegions form a hierarchy, and by convention if
// all the child regions of a region are removed, the region itself must be

import { Identifier, Node } from "@babel/types";

type Region = CodeRegion | IdentifierRegion;

// removed.
export interface CodeRegion {
  // these are character offsets relative to our parent's start. The topmost
  // Coderegion has no parent, so its start and end encompass the whole module,
  // so start always equals 0 and end always equal module length.
  start: number;
  end: number;

  type: Node["type"];
  parent?: CodeRegion;
  children: Region[];
}

export interface IdentifierRegion extends CodeRegion {
  // when we want to rewrite regions containing identifiers, we need to be aware
  // if they represent object or import shorthand syntax, so that we can
  // rewrite:
  //
  //    let { x } = foo();
  //
  // to:
  //
  //    let { x: x0 } = foo();
  //
  // "as" means we're in an import or export context, ":" means object
  // shorthand, false is a plain identifier with no shorthand.
  shorthand: "as" | ":" | false;
}

export function createCodeRegion(
  node: Node,
  parent?: CodeRegion
): CodeRegion | undefined {
  let { start, end, type } = node;
  if (start == null || end == null) {
    throw new Error(
      `bug: do not know how to create code region for ${node.type}: missing start/end character positions`
    );
  }
  let region: CodeRegion = {
    type,
    start,
    end,
    parent,
    children: [],
  };
  switch (node.type) {
    case "Program":
      region.children = codeRegionsFromChildren(node.body, region);
      return region;

    case "ExportNamedDeclaration":
      if (node.declaration) {
        region.children = [createCodeRegion(node.declaration, region)!];
      } else {
        region.children = codeRegionsFromChildren(node.specifiers, region);
      }
      return region;

    case "ExportDefaultDeclaration":
      return region;

    case "ExportSpecifier":
      if (
        node.exported.start === node.local.start &&
        node.exported.end === node.local.end
      ) {
        // there is no "as" in the import specifier--the imported name is the
        // same as the local name
        region.children = [createIdentifierRegion(node.exported, region)];
      } else {
        region.children = [
          createIdentifierRegion(node.local, region, "as"),
          createIdentifierRegion(node.exported, region), // do we want to set "as" on both sides?
        ];
      }
      return region;

    case "VariableDeclaration":
      region.children = codeRegionsFromChildren(node.declarations, region);
      return region;

    case "ClassDeclaration":
    case "FunctionDeclaration": {
      if (node.id) {
        region.children = [createIdentifierRegion(node.id, region)];
      }
      return region;
    }

    case "VariableDeclarator":
      if (node.id.type === "Identifier") {
        region.children = [createIdentifierRegion(node.id, region)];
      } else {
        node.id.type;
        region.children = codeRegionsFromChildren([node.id], region);
      }
      return region;

    case "ImportDeclaration":
      region.children = codeRegionsFromChildren(node.specifiers, region);
      return region;

    case "ImportSpecifier":
      if (
        node.imported.start === node.local.start &&
        node.imported.end === node.local.end
      ) {
        // there is no "as" in the import specifier--the imported name is the
        // same as the local name
        region.children = [createIdentifierRegion(node.imported, region)];
      } else {
        region.children = [
          createIdentifierRegion(node.imported, region, "as"),
          createIdentifierRegion(node.local, region), // do we want to set "as" on both sides?
        ];
      }
      return region;

    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
      region.children = [createIdentifierRegion(node.local, region)];
      return region;

    case "ArrayPattern":
      region.children = (node.elements.filter(Boolean) as Node[])
        .map((element) =>
          element.type === "Identifier"
            ? createIdentifierRegion(element, region)
            : createCodeRegion(element, region)
        )
        .filter(Boolean) as Region[];
      return region;

    case "RestElement":
      if (node.argument.type === "Identifier") {
        region.children = [createIdentifierRegion(node.argument, region)];
      } else {
        region.children = codeRegionsFromChildren([node.argument], region);
      }
      return region;

    case "ObjectPattern":
      region.children = codeRegionsFromChildren(node.properties, region);
      return region;

    case "ObjectProperty":
      if (
        node.key.type === "Identifier" &&
        node.value.type === "Identifier" &&
        node.key.start === node.value.start &&
        node.key.end === node.value.end
      ) {
        region.children = [createIdentifierRegion(node.key, region)];
        return region;
      } else if (
        node.key.type === "Identifier" &&
        node.value.type === "Identifier"
      ) {
        region.children = [
          createIdentifierRegion(node.key, region, ":"),
          createIdentifierRegion(node.value, region), // do we want to set ":" on both sides?
        ];
        return region;
      } else if (node.value.type !== "Identifier") {
        region.children = codeRegionsFromChildren([node.value], region);
        return region;
      }
      break;
  }
  return;
}

export function createIdentifierRegion(
  node: Identifier,
  parent: CodeRegion,
  shorthand: IdentifierRegion["shorthand"] = false
): IdentifierRegion {
  if (node.start == null || node.end == null) {
    throw new Error(
      `bug: do not know how to create identifier region for ${node.type}: missing start/end character positions`
    );
  }
  return {
    type: "Identifier",
    parent,
    start: node.start,
    end: node.end,
    shorthand,
    children: [],
  };
}

function codeRegionsFromChildren(
  nodes: Node[],
  parent: CodeRegion
): CodeRegion[] {
  return nodes
    .map((child) => createCodeRegion(child, parent))
    .filter(Boolean) as CodeRegion[];
}
