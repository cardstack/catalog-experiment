// The purpose of a CodeRegion is to mark a region of source code that we may be
// able to remove or replace. CodeRegions form a hierarchy, and by convention if
// all the child regions of a region are removed, the region itself must be
// removed.

import { NodePath } from "@babel/traverse";
import { Program } from "@babel/types";
import { assertNever } from "@catalogjs/shared/util";

export type RegionPointer = number;
export const NamespaceMarker = { isNamespace: true };
export type NamespaceMarker = typeof NamespaceMarker;
export function isNamespaceMarker(value: any): value is NamespaceMarker {
  return typeof value === "object" && "isNamespace" in value;
}

export const documentPointer = 0;
export const notFoundPointer = -1;
const lvalTypes = ["ObjectProperty", "ArrayPattern", "RestElement"];

// the parts of a CodeRegion that we can determine independent of its location,
// based only on its own NodePath.
export type CodeRegion =
  | DocumentCodeRegion
  | GeneralCodeRegion
  | ImportCodeRegion
  | DeclarationCodeRegion
  | ReferenceCodeRegion;

export interface BaseCodeRegion {
  // this is the position of the code region in the document when we traverse
  // the document's code regions in order starting at the document pointer.
  position: number;

  // starting position relative to start of parent (if we're the firstChild) or
  // end of previous sibling (if we are the nextSibling)
  start: number;

  // ending position relative to the last child's end, or relative to our start
  // if no children
  end: number;

  firstChild: RegionPointer | undefined;
  nextSibling: RegionPointer | undefined;
  dependsOn: Set<RegionPointer>;

  // we use this to track the original source for module side-effects
  original?: {
    bundleHref: string;
    range: string;
  };
}

export type DeclarationDescription =
  | LocalDeclarationDescription
  | ImportedDeclarationDescription;
export interface BaseDeclarationDescription {
  declaredName: string;
  references: RegionPointer[];
}

export interface LocalDeclarationDescription
  extends BaseDeclarationDescription {
  type: "local";
  declaratorOfRegion: RegionPointer | undefined;
  source: string;
  original?: {
    bundleHref: string;
    range: string;
    importedAs: string | NamespaceMarker;
  };
}
export function isDeclarationDescription(
  desc: any
): desc is DeclarationDescription {
  return (
    typeof desc === "object" && "declaredName" in desc && "references" in desc
  );
}

export interface ImportedDeclarationDescription
  extends BaseDeclarationDescription {
  type: "import";
  importIndex: number;
  importedName: string | NamespaceMarker;
}

export interface DocumentCodeRegion extends BaseCodeRegion {
  type: "document";
}
export function isDocumentCodeRegion(
  region: any
): region is DocumentCodeRegion {
  return (
    typeof region === "object" && "type" in region && region.type === "document"
  );
}
export interface GeneralCodeRegion extends BaseCodeRegion {
  type: "general";
  preserveGaps: boolean;
}

export function isGeneralCodeRegion(region: any): region is GeneralCodeRegion {
  return (
    typeof region === "object" && "type" in region && region.type === "general"
  );
}

export interface DeclarationCodeRegion extends Omit<GeneralCodeRegion, "type"> {
  type: "declaration";
  declaration: DeclarationDescription;
}
export function isDeclarationCodeRegion(
  region: any
): region is DeclarationCodeRegion {
  return (
    typeof region === "object" &&
    "type" in region &&
    region.type === "declaration"
  );
}

// When an import region is inserted within a declaration region, or declaration
// region is inserted around an import region, then the declaration region will
// automatically depend on the reference region--this will allow dynamically
// loaded module code regions to be traversed. Note that we'll need to update
// this for top level await so that a document region can automatically depend
// on an import region when the import is a direct child of the document region.
export interface ImportCodeRegion extends Omit<GeneralCodeRegion, "type"> {
  type: "import";
  importIndex: number;
  isDynamic: boolean;
  specifierForDynamicImport: string | undefined;
  exportType: "reexport" | "export-all" | undefined;
}

export function isImportCodeRegion(region: any): region is ImportCodeRegion {
  return (
    typeof region === "object" && "type" in region && region.type === "import"
  );
}

// When a reference region is inserted, or another region is inserted around a
// reference region, then the parent of the reference region will automatically
// depend on the reference region.
export interface ReferenceCodeRegion extends BaseCodeRegion {
  type: "reference";
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
  shorthand: "import" | "export" | "object" | false;
}
export function isReferenceCodeRegion(
  region: any
): region is ReferenceCodeRegion {
  return (
    typeof region === "object" &&
    "type" in region &&
    region.type === "reference"
  );
}

export function isCodeRegion(region: any): region is CodeRegion {
  return (
    isDocumentCodeRegion(region) ||
    isGeneralCodeRegion(region) ||
    isDeclarationCodeRegion(region) ||
    isReferenceCodeRegion(region) ||
    isImportCodeRegion(region)
  );
}

type PathFacts = Pick<GeneralCodeRegion, "preserveGaps"> &
  Pick<ReferenceCodeRegion, "shorthand">;

interface NewRegion {
  type: CodeRegion["type"];
  absoluteStart: number;
  absoluteEnd: number;
  index: number;
  dependsOn: Set<RegionPointer>;
  declaration: DeclarationDescription | undefined;
  importIndex: number | undefined;
  isDynamic: boolean | undefined;
  exportType: ImportCodeRegion["exportType"];
  specifierForDynamicImport: string | undefined;
  pathFacts: PathFacts;
}

type Position = "before" | "within" | "around" | "after" | "same";

export function visitCodeRegions(
  regions: CodeRegion[],
  onRegionVisit: (region: CodeRegion, pointer: RegionPointer) => void,
  start: RegionPointer = documentPointer
) {
  if (regions.length === 0) {
    return;
  }
  let stack: RegionPointer[] = [];
  let currentPointer: RegionPointer | undefined = start;
  while (currentPointer != null || stack.length > 0) {
    while (currentPointer != null) {
      if (stack.includes(currentPointer)) {
        throw new Error(
          `Cycle detected while traversing code regions, the code region pointer ${currentPointer} forms a cycle in the stack. Stack is ${JSON.stringify(
            stack
          )}`
        );
      }
      stack.unshift(currentPointer);
      currentPointer = regions[currentPointer].firstChild;
    }
    currentPointer = stack.shift()!;

    onRegionVisit(regions[currentPointer], currentPointer);

    if (currentPointer !== start) {
      currentPointer = regions[currentPointer].nextSibling;
    } else {
      currentPointer = undefined;
    }
  }
}

export class RegionBuilder {
  regions: CodeRegion[] = [];
  private absoluteRanges: Map<
    RegionPointer,
    { start: number; end: number }
  > = new Map();
  private types: Map<RegionPointer, string> = new Map();

  constructor(programPath: NodePath<Program>) {
    let path = programPath as NodePath;
    let { absoluteStart, absoluteEnd } = this.pathAbsoluteRange(path);
    this.absoluteRanges.set(documentPointer, {
      start: absoluteStart,
      end: absoluteEnd,
    });
    this.types.set(documentPointer, path.type);
    this.regions.push({
      position: 0,
      type: "document",
      start: 0,
      end: absoluteEnd,
      firstChild: undefined,
      nextSibling: undefined,
      dependsOn: new Set(),
    });
  }

  createCodeRegionForReference(path: NodePath): RegionPointer {
    return this.createCodeRegion(path, "reference");
  }

  createCodeRegion(
    adjacentPaths: NodePath[],
    type?: CodeRegion["type"],
    dependsOnRegion?: Set<RegionPointer>
  ): RegionPointer;
  createCodeRegion(
    path: NodePath,
    type?: CodeRegion["type"],
    dependsOnRegion?: Set<RegionPointer>
  ): RegionPointer;
  createCodeRegion(
    path: NodePath,
    importIndex?: number,
    dependsOnRegion?: Set<RegionPointer>
  ): RegionPointer;
  createCodeRegion(
    path: NodePath,
    importInfo?: {
      importIndex: number;
      exportType: ImportCodeRegion["exportType"];
      isDynamic: boolean;
      specifierForDynamicImport: string | undefined;
    },
    dependsOnRegion?: Set<RegionPointer>
  ): RegionPointer;
  createCodeRegion(
    path: NodePath,
    declaration?: DeclarationDescription,
    dependsOnRegion?: Set<RegionPointer>
  ): RegionPointer;
  createCodeRegion(
    pathOrPaths: NodePath | NodePath[],
    declarationOrImportIndexOrType?:
      | DeclarationDescription
      | {
          importIndex: number;
          exportType: ImportCodeRegion["exportType"];
          isDynamic: boolean;
          specifierForDynamicImport: string | undefined;
        }
      | number
      | CodeRegion["type"],
    dependsOnRegion?: Set<RegionPointer>
  ): RegionPointer {
    let { absoluteStart, absoluteEnd } = this.pathAbsoluteRange(pathOrPaths);
    let nodeType: string;
    if (Array.isArray(pathOrPaths)) {
      if (pathOrPaths.length === 0) {
        throw new Error(
          `cannot create code region for an empty array of paths`
        );
      }
      if (pathOrPaths.find((p) => pathOrPaths[0].type !== p.type)) {
        nodeType = "multipleTypes";
      } else {
        nodeType = pathOrPaths[0].type;
      }
    } else {
      nodeType = pathOrPaths.type;
    }

    let type: CodeRegion["type"];
    let importIndex: number | undefined;
    let isDynamic: boolean | undefined;
    let exportType: ImportCodeRegion["exportType"];
    let specifierForDynamicImport: string | undefined;
    if (isDeclarationDescription(declarationOrImportIndexOrType)) {
      type = "declaration";
    } else if (typeof declarationOrImportIndexOrType === "object") {
      type = "import";
      ({
        importIndex,
        exportType,
        isDynamic,
        specifierForDynamicImport,
      } = declarationOrImportIndexOrType);
    } else if (typeof declarationOrImportIndexOrType === "number") {
      type = "import";
      isDynamic = false;
    } else if (typeof declarationOrImportIndexOrType === "string") {
      type = declarationOrImportIndexOrType;
    } else {
      type = "general";
    }

    let newRegion: NewRegion = {
      type,
      absoluteStart,
      absoluteEnd,
      index: this.regions.length,
      // at the time that the code region is created, there is a good chance
      // that the regions that you depend on may not yet have been created. The
      // safest thing to do is to create a region that has no dependencies, and
      // then reconcile the dependsOn only after all the code regions for the
      // file have been created.
      dependsOn: dependsOnRegion ?? new Set(),
      declaration: isDeclarationDescription(declarationOrImportIndexOrType)
        ? declarationOrImportIndexOrType
        : undefined,
      importIndex:
        typeof declarationOrImportIndexOrType === "number"
          ? declarationOrImportIndexOrType
          : importIndex,
      isDynamic,
      exportType,
      specifierForDynamicImport,
      pathFacts: {
        shorthand: Array.isArray(pathOrPaths)
          ? false
          : shorthandMode(pathOrPaths),
        preserveGaps: Array.isArray(pathOrPaths)
          ? true
          : pathOrPaths.type === "ArrayPattern",
      },
    };
    this.absoluteRanges.set(newRegion.index, {
      start: absoluteStart,
      end: absoluteEnd,
    });
    this.types.set(newRegion.index, nodeType);
    this.insertWithin(documentPointer, newRegion);
    return newRegion.index;
  }

  private pathAbsoluteRange(
    pathOrPaths: NodePath | NodePath[]
  ): { absoluteStart: number; absoluteEnd: number } {
    let absoluteStart: number | null, absoluteEnd: number | null;
    if (Array.isArray(pathOrPaths)) {
      let badPath = pathOrPaths.find(
        (p) => p.node.start == null || p.node.end == null
      );
      if (badPath) {
        throw new Error(
          `bug: do not know how to create code region for ${badPath.node.type}: missing start/end character positions`
        );
      }
      absoluteStart = Math.min(...pathOrPaths.map((p) => p.node.start!));
      absoluteEnd = Math.max(...pathOrPaths.map((p) => p.node.end!));
    } else {
      ({ start: absoluteStart, end: absoluteEnd } = pathOrPaths.node);
      if (absoluteStart == null || absoluteEnd == null) {
        throw new Error(
          `bug: do not know how to create code region for ${pathOrPaths.node.type}: missing start/end character positions`
        );
      }
    }
    return { absoluteStart, absoluteEnd };
  }

  private getRegion(pointer: RegionPointer): CodeRegion {
    return this.regions[pointer]!;
  }

  private getAbsolute(pointer: RegionPointer): { start: number; end: number } {
    return this.absoluteRanges.get(pointer)!;
  }

  private insertWithin(parentPointer: RegionPointer, newRegion: NewRegion) {
    let childPointer = this.getRegion(parentPointer).firstChild;
    let prevChild: RegionPointer | undefined;
    while (childPointer != null) {
      let position = this.compare(newRegion, childPointer);
      switch (position) {
        case "before":
          this.insertBefore(childPointer, parentPointer, prevChild, newRegion);
          return;
        case "around":
          this.insertAround(childPointer, parentPointer, prevChild, newRegion);
          return;
        case "within":
          this.insertWithin(childPointer, newRegion);
          return;
        case "same":
          let child = this.getRegion(childPointer);
          let originalChildType = child.type;
          child.type =
            newRegion.type === "declaration"
              ? "declaration"
              : child.type === "general"
              ? newRegion.type
              : child.type; // only promote the region to a more specific type--don't downgrade it, and declaration type always wins.
          child.dependsOn = new Set(
            [...child.dependsOn, ...newRegion.dependsOn].filter(
              (p) => p !== childPointer
            )
          );
          if (
            originalChildType === "reference" &&
            child.type !== originalChildType
          ) {
            this.getRegion(parentPointer).dependsOn.delete(childPointer);
          }
          if (isDeclarationCodeRegion(child)) {
            child.declaration = newRegion.declaration ?? child.declaration;

            // look for import regions and depend on them
            if (child.firstChild != null) {
              let cursor: RegionPointer | undefined = child.firstChild;
              while (cursor != null) {
                let maybeImport = this.getRegion(cursor);
                if (maybeImport.type === "import") {
                  child.dependsOn.add(cursor);
                }
                cursor = maybeImport.nextSibling;
              }
            }
          }
          if (isImportCodeRegion(child)) {
            child.importIndex = newRegion.importIndex ?? child.importIndex;
            child.exportType = newRegion.exportType ?? child.exportType;
            child.isDynamic = newRegion.isDynamic ?? child.isDynamic;
            child.specifierForDynamicImport =
              newRegion.specifierForDynamicImport ??
              child.specifierForDynamicImport;
          }
          newRegion.index = childPointer;
          return;
        case "after":
          prevChild = childPointer;
          childPointer = this.getRegion(childPointer).nextSibling;
          continue;
        default:
          throw assertNever(position);
      }
    }
    this.insertLast(prevChild, parentPointer, newRegion);
  }

  // given the parent and previous sibling (if any) of the spot at which we want
  // to insert newRegion, set the appropriate firstChild or nextSibling link and
  // return the absolute basis from which we should measure our start.
  private linkToNewRegion(
    targetParent: RegionPointer,
    targetPrevious: RegionPointer | undefined,
    newRegion: NewRegion
  ): number {
    if (targetPrevious != null) {
      this.getRegion(targetPrevious).nextSibling = newRegion.index;
      return this.getAbsolute(targetPrevious).end;
    } else {
      this.getRegion(targetParent).firstChild = newRegion.index;
      return this.getAbsolute(targetParent).start;
    }
  }

  // insert newRegion before target. We also need to know the two "backward"
  // relationships from the target: its parent (which always exists) and its
  // previous sibling (which may or may not exist)
  private insertBefore(
    target: RegionPointer,
    targetParent: RegionPointer,
    targetPrevious: RegionPointer | undefined,
    newRegion: NewRegion
  ) {
    let basis = this.linkToNewRegion(targetParent, targetPrevious, newRegion);
    this.adjustStartRelativeTo(target, newRegion.absoluteEnd);
    let {
      declaration,
      dependsOn,
      type,
      importIndex,
      exportType,
      isDynamic,
      specifierForDynamicImport,
    } = newRegion;
    let data = {
      type,
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - newRegion.absoluteStart,
      firstChild: undefined,
      nextSibling: target,
      dependsOn,
      declaration,
      importIndex,
      exportType,
      isDynamic,
      specifierForDynamicImport,
      ...newRegion.pathFacts,
    };
    let pointer = this.regions.length;
    if (isCodeRegion(data)) {
      this.regions.push(data);
    }
    if (data.type === "reference") {
      this.regions[targetParent].dependsOn.add(pointer);
    }
    if (
      data.type === "import" &&
      this.regions[targetParent].type === "declaration"
    ) {
      this.regions[targetParent].dependsOn.add(pointer);
    }
  }

  // insert newRegion around target. We also need to know the two "backward"
  // relationships from the target: its parent (which always exists) and its
  // previous sibling (which may or may not exist)
  private insertAround(
    target: RegionPointer,
    targetParent: RegionPointer,
    targetPrevious: RegionPointer | undefined,
    newRegion: NewRegion
  ) {
    let dependsOnRegions: RegionPointer[] = [];
    let basis = this.linkToNewRegion(targetParent, targetPrevious, newRegion);
    this.adjustStartRelativeTo(target, newRegion.absoluteStart);
    let cursor: RegionPointer = target;
    let nextSibling: RegionPointer | undefined;
    while (cursor != null) {
      if (
        (this.regions[cursor].type === "reference" &&
          newRegion.declaration?.type !== "import") ||
        (this.regions[cursor].type === "import" &&
          newRegion.type === "declaration")
      ) {
        dependsOnRegions.push(cursor);
        this.regions[targetParent].dependsOn.delete(cursor);
      }
      let nextRegion = this.getRegion(cursor).nextSibling;
      if (
        nextRegion == null ||
        this.compare(newRegion, nextRegion) !== "around"
      ) {
        nextSibling = nextRegion;
        if (nextRegion == null) {
          // we are becoming the last child in targetParent, so adjust its end relative to us
          this.adjustEndRelativeTo(targetParent, newRegion.absoluteEnd);
        }
        break;
      }
      cursor = nextRegion;
    }

    if (nextSibling != null) {
      this.adjustStartRelativeTo(nextSibling, newRegion.absoluteEnd);
    }

    // at this point, cursor is the last region that we surround
    this.getRegion(cursor).nextSibling = undefined;
    let {
      declaration,
      dependsOn,
      type,
      importIndex,
      isDynamic,
      exportType,
      specifierForDynamicImport,
    } = newRegion;
    let data = {
      type,
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - this.getAbsolute(cursor).end,
      firstChild: target,
      nextSibling,
      dependsOn: new Set([...dependsOn, ...dependsOnRegions]),
      declaration,
      importIndex,
      isDynamic,
      exportType,
      specifierForDynamicImport,
      ...newRegion.pathFacts,
    };
    if (isCodeRegion(data)) {
      this.regions.push(data);
    }
  }

  // add newRegion as the final sibling after target, beneath targetParent.
  private insertLast(
    target: RegionPointer | undefined,
    targetParent: RegionPointer,
    newRegion: NewRegion
  ) {
    let basis = this.linkToNewRegion(targetParent, target, newRegion);
    let {
      declaration,
      dependsOn,
      type,
      importIndex,
      isDynamic,
      exportType,
      specifierForDynamicImport,
    } = newRegion;
    let data = {
      type,
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - newRegion.absoluteStart,
      firstChild: undefined,
      nextSibling: undefined,
      dependsOn,
      declaration,
      importIndex,
      isDynamic,
      exportType,
      specifierForDynamicImport,
      ...newRegion.pathFacts,
    };
    let pointer = this.regions.length;
    if (isCodeRegion(data)) {
      this.regions.push(data);
    }
    this.adjustEndRelativeTo(targetParent, newRegion.absoluteEnd);
    if (data.type === "reference") {
      this.regions[targetParent].dependsOn.add(pointer);
    }
    if (
      data.type === "import" &&
      this.regions[targetParent].type === "declaration"
    ) {
      this.regions[targetParent].dependsOn.add(pointer);
    }
  }

  private adjustStartRelativeTo(subject: RegionPointer, absoluteBasis: number) {
    this.getRegion(subject).start =
      this.getAbsolute(subject).start - absoluteBasis;
  }

  private adjustEndRelativeTo(subject: RegionPointer, absoluteBasis: number) {
    // we only need to adjust real regions, not the document region.
    if (typeof subject === "number") {
      this.getRegion(subject).end =
        this.getAbsolute(subject).end - absoluteBasis;
    }
  }

  private compare(newRegion: NewRegion, other: RegionPointer): Position {
    let { start: otherStart, end: otherEnd } = this.absoluteRanges.get(other)!;

    if (newRegion.absoluteEnd <= otherStart) {
      return "before";
    }

    if (
      otherStart === newRegion.absoluteStart &&
      otherEnd === newRegion.absoluteEnd
    ) {
      // for exactly equal regions, we need to break ties based on the original
      // types of the nodes. For example, an ObjectProperty in shorthand form
      // is coextensive with the Identifier it contains, but it's important that
      // we say the ObjectProperty is "around" the Identifier and not "within".
      let newType = this.types.get(newRegion.index);
      let otherType = this.types.get(other);
      let otherRegion = this.getRegion(other);
      let declarationReferenceTypes = ["declaration", "reference"];
      let needsDeclarationReferenceTieBreak =
        declarationReferenceTypes.includes(newRegion.type) &&
        declarationReferenceTypes.includes(otherRegion.type) &&
        newType === otherType;
      if (
        needsDeclarationReferenceTieBreak &&
        newRegion.type === otherRegion.type
      ) {
        return "same";
      } else if (
        needsDeclarationReferenceTieBreak &&
        newRegion.type === "reference"
      ) {
        return "within";
      } else if (
        needsDeclarationReferenceTieBreak &&
        otherRegion.type === "reference"
      ) {
        return "around";
      } else if (newType === otherType) {
        return "same";
      } else if (newType === "Identifier") {
        return "within";
      } else if (otherType === "Identifier") {
        return "around";
      } else if (
        newType === "AssignmentPattern" &&
        otherType &&
        lvalTypes.includes(otherType)
      ) {
        return "within";
      } else if (
        newType &&
        lvalTypes.includes(newType) &&
        otherType === "AssignmentPattern"
      ) {
        return "around";
      } else if (newType === "ExpressionStatement") {
        return "around";
      } else if (otherType === "ExpressionStatement") {
        return "within";
      }

      throw new Error(
        `don't know how to break ties between ${newType} and ${otherType}`
      );
    }

    if (
      otherStart <= newRegion.absoluteStart &&
      newRegion.absoluteEnd <= otherEnd
    ) {
      return "within";
    }

    if (
      newRegion.absoluteStart <= otherStart &&
      otherEnd <= newRegion.absoluteEnd
    ) {
      return "around";
    }

    return "after";
  }
}

function shorthandMode(path: NodePath): PathFacts["shorthand"] {
  if (
    path.type === "Identifier" &&
    path.parent.type === "ImportSpecifier" &&
    path.parent.imported.start === path.parent.local.start
  ) {
    return "import";
  }
  if (
    path.type === "Identifier" &&
    ((path.parent.type === "ObjectProperty" && path.parent.shorthand) ||
      (path.parent.type === "AssignmentPattern" &&
        path.parent.left === path.node &&
        path.parentPath.parent.type === "ObjectProperty" &&
        path.parentPath.parent.shorthand))
  ) {
    return "object";
  }

  if (
    path.type == "Identifier" &&
    path.parent.type === "ExportSpecifier" &&
    path.parent.exported.start === path.parent.local.start
  ) {
    return "export";
  }

  return false;
}
