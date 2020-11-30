// The purpose of a CodeRegion is to mark a region of source code that we may be
// able to remove or replace. CodeRegions form a hierarchy, and by convention if
// all the child regions of a region are removed, the region itself must be
// removed.

import { NodePath } from "@babel/traverse";
import { Program } from "@babel/types";
import { assertNever } from "@catalogjs/shared/util";
import { FileDescription, isModuleDescription } from "./describe-file";
import cloneDeep from "lodash/cloneDeep";

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
type PathFacts = Pick<GeneralCodeRegion, "shorthand" | "preserveGaps">;

interface NewRegion {
  type: CodeRegion["type"];
  absoluteStart: number;
  absoluteEnd: number;
  index: number;
  dependsOn: Set<RegionPointer>;
  declaration: DeclarationDescription | undefined;
  importIndex: number | undefined;
  pathFacts: PathFacts;
}

type Position = "before" | "within" | "around" | "after" | "same";

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
      shorthand: false,
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
    declaration?: DeclarationDescription,
    dependsOnRegion?: Set<RegionPointer>
  ): RegionPointer;
  createCodeRegion(
    pathOrPaths: NodePath | NodePath[],
    declarationOrImportIndexOrType?:
      | DeclarationDescription
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
        throw new Error(
          `cannot create code region for multiple paths that have different types`
        );
      }
      nodeType = pathOrPaths[0].type;
    } else {
      nodeType = pathOrPaths.type;
    }

    // TODO add support for simpler reference regions...
    let type: CodeRegion["type"];
    if (typeof declarationOrImportIndexOrType === "object") {
      type = "declaration";
    } else if (typeof declarationOrImportIndexOrType === "number") {
      type = "import";
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
      declaration:
        typeof declarationOrImportIndexOrType === "object"
          ? declarationOrImportIndexOrType
          : undefined,
      importIndex:
        typeof declarationOrImportIndexOrType === "number"
          ? declarationOrImportIndexOrType
          : undefined,
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
          }
          if (isImportCodeRegion(child)) {
            child.importIndex = newRegion.importIndex ?? child.importIndex;
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
    let { declaration, dependsOn, type, importIndex } = newRegion;
    let data = {
      type,
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - newRegion.absoluteStart,
      firstChild: undefined,
      nextSibling: target,
      dependsOn,
      declaration,
      importIndex,
      ...newRegion.pathFacts,
    };
    let pointer = this.regions.length;
    if (isCodeRegion(data)) {
      this.regions.push(data);
    }
    if (data.type === "reference") {
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
    let referenceRegions: RegionPointer[] = [];
    let basis = this.linkToNewRegion(targetParent, targetPrevious, newRegion);
    this.adjustStartRelativeTo(target, newRegion.absoluteStart);
    let cursor: RegionPointer = target;
    let nextSibling: RegionPointer | undefined;
    while (cursor != null) {
      if (
        this.regions[cursor].type === "reference" &&
        newRegion.declaration?.type !== "import"
      ) {
        referenceRegions.push(cursor);
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
    let { declaration, dependsOn, type, importIndex } = newRegion;
    let data = {
      type,
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - this.getAbsolute(cursor).end,
      firstChild: target,
      nextSibling,
      dependsOn: new Set([...dependsOn, ...referenceRegions]),
      declaration,
      importIndex,
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
    let { declaration, dependsOn, type, importIndex } = newRegion;
    let data = {
      type,
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - newRegion.absoluteStart,
      firstChild: undefined,
      nextSibling: undefined,
      dependsOn,
      declaration,
      importIndex,
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
      if (newType === otherType) {
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
  original?: {
    bundleHref: string;
    range: string;
    importedAs: string | NamespaceMarker;
  };
}

export interface ImportedDeclarationDescription
  extends BaseDeclarationDescription {
  type: "import";
  importIndex: number;
  // TODO change to "exportedName: string"
  importedName: string | NamespaceMarker;
}

export interface EnclosedNames {
  [name: string]: number; // starting position of name (position should not include bytes in this region's child regions)
}

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
  dependsOn: Set<RegionPointer>;

  // we use this to track the original source for module side-effects
  original?: {
    bundleHref: string;
    range: string;
  };
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

export interface ImportCodeRegion extends Omit<GeneralCodeRegion, "type"> {
  type: "import";
  importIndex: number;
}

export function isImportCodeRegion(region: any): region is ImportCodeRegion {
  return (
    typeof region === "object" && "type" in region && region.type === "import"
  );
}

export function assignCodeRegionPositions(
  regions: CodeRegion[],
  pointer: RegionPointer = documentPointer,
  index = 0
) {
  let region = regions[pointer];
  region.position = index++;
  if (region.firstChild != null) {
    assignCodeRegionPositions(regions, region.firstChild, index);
  }
  if (region.nextSibling != null) {
    assignCodeRegionPositions(regions, region.nextSibling, index);
  }
}

export interface ReferenceCodeRegion extends BaseCodeRegion {
  type: "reference";
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

type Disposition =
  | {
      state: "unchanged";
      region: RegionPointer;
    }
  | { state: "removed"; region: RegionPointer }
  | {
      state: "replaced";
      region: RegionPointer;
      replacement: string;
    }
  | {
      state: "wrap";
      region: RegionPointer;
      declarationName: string;
    };

export class RegionEditor {
  private dispositions: Disposition[];

  private pendingGap: { withinParent: RegionPointer; gap: number } | undefined;
  private pendingStart:
    | { withinParent: RegionPointer; start: number }
    | undefined;
  private pendingAntecedant:
    | {
        withinParent: RegionPointer;
        isNextSiblingOf: RegionPointer | undefined;
        isFirstChildOf: RegionPointer | undefined;
        hasNextSiblingOf: RegionPointer | undefined;
      }
    | undefined;
  private cursor = 0;
  private outputCode: string[] = [];
  private outputRegions: {
    region: CodeRegion;
    originalPointer: RegionPointer | undefined;
  }[] = [];

  constructor(private src: string, private desc: FileDescription) {
    // Regions are assumed to be removed unless .keepRegion() is explicitly
    // called for a region.
    this.dispositions = [...desc.regions.entries()].map(([index]) => ({
      state: desc.regions[index].type === "document" ? "unchanged" : "removed",
      region: index,
    }));
  }

  toJSON() {
    return {
      regions: this.regions,
      dispositions: this.dispositions,
    };
  }

  get regions() {
    return this.desc.regions;
  }

  includedRegions(): RegionPointer[] {
    return this.dispositions
      .filter((d) => d.state !== "removed")
      .map(({ region }) => region);
  }

  removeRegion(pointer: RegionPointer) {
    this.dispositions[pointer] = { state: "removed", region: pointer };
  }

  removeRegionAndItsChildren(pointer: RegionPointer) {
    this.removeRegion(pointer);
    let region = this.regions[pointer];
    if (region.firstChild != null) {
      this.removeRegionAndItsChildrenAndSiblings(region.firstChild);
    }
  }

  private removeRegionAndItsChildrenAndSiblings(pointer: RegionPointer) {
    this.removeRegion(pointer);
    let region = this.regions[pointer];
    if (region.firstChild != null) {
      this.removeRegionAndItsChildrenAndSiblings(region.firstChild);
    }
    if (region.nextSibling != null) {
      this.removeRegionAndItsChildrenAndSiblings(region.nextSibling);
    }
  }

  keepRegion(pointer: RegionPointer) {
    if (this.dispositions[pointer].state === "removed") {
      this.dispositions[pointer] = { state: "unchanged", region: pointer };
    }
  }

  private keepRegionAndItsChildren(pointer: RegionPointer) {
    if (this.dispositions[pointer].state === "removed") {
      this.dispositions[pointer] = { state: "unchanged", region: pointer };
    }
    let region = this.regions[pointer];
    if (region.firstChild != null) {
      this.keepRegionAndItsChildrenAndSiblings(region.firstChild);
    }
  }

  private keepRegionAndItsChildrenAndSiblings(pointer: RegionPointer) {
    if (this.dispositions[pointer].state === "removed") {
      this.dispositions[pointer] = { state: "unchanged", region: pointer };
    }
    let region = this.regions[pointer];
    if (region.firstChild != null) {
      this.keepRegionAndItsChildrenAndSiblings(region.firstChild);
    }
    if (region.nextSibling != null) {
      this.keepRegionAndItsChildrenAndSiblings(region.nextSibling);
    }
  }

  wrapWithDeclaration(pointer: RegionPointer, name: string) {
    if (this.dispositions[pointer].state === "removed") {
      return;
    }
    this.dispositions[pointer] = {
      state: "wrap",
      declarationName: name,
      region: pointer,
    };
  }

  // Note that "keepRegion()" must be called first on a region before we'll
  // honor a rename on that region
  rename(oldName: string, newName: string) {
    if (!isModuleDescription(this.desc)) {
      throw new Error(`cannot call 'rename()' on CJS file`);
    }
    let { pointer, declaration } = this.desc.declarations.get(oldName) ?? {};
    if (pointer == null || !declaration) {
      throw new Error(`tried to rename unknown name ${oldName}`);
    }
    if (
      oldName === "default" &&
      this.dispositions[pointer].state !== "removed"
    ) {
      this.keepRegionAndItsChildren(pointer);
      this.wrapWithDeclaration(pointer, newName);
    } else {
      for (let pointer of declaration.references) {
        this.replace(pointer, newName);
      }
    }
  }

  // Note that "keepRegion()" must be called first on a region before we'll
  // honor a replace on that region
  replace(pointer: RegionPointer, replacement: string): void {
    if (this.dispositions[pointer].state !== "removed") {
      this.dispositions[pointer] = {
        state: "replaced",
        replacement,
        region: pointer,
      };
    }
  }

  serialize(): { code: string; regions: CodeRegion[] } {
    if (this.regions.length === 0) {
      return { code: this.src, regions: [] };
    }

    this.cursor = 0;
    this.pendingGap = undefined;
    this.pendingStart = undefined;
    this.outputCode = [];
    this.outputRegions = [];
    this.innerSerialize(documentPointer);

    let newRegions = remapRegions(this.outputRegions);
    let newCode = this.outputCode.join("");
    assignCodeRegionPositions(newRegions);
    // it's easy to trim leading whitespace, but it's difficult to deal with
    // trailing whitespace since we don't have backwards pointers in our code
    // regions.
    trimLeading(newRegions, newCode);

    return {
      code: newCode.replace(/^\s*/, ""),
      regions: newRegions,
    };
  }

  private innerSerialize(
    regionPointer: RegionPointer,
    parentPointer: RegionPointer = documentPointer
  ): {
    disposition: Disposition;
    outputPointer: RegionPointer | undefined;
    gap: number;
  } {
    let region = this.regions[regionPointer];
    let disposition = this.dispositions[regionPointer];
    let gap = 0;
    switch (disposition.state) {
      case "removed": {
        if (regionPointer !== documentPointer) {
          this.emitPendingAntecedant(parentPointer, regionPointer);
        }
        if (region.firstChild != null) {
          // when we remove a region then the next region in this subgraph that is output will
          // inherit this region's start
          this.emitPendingStart(parentPointer, regionPointer);
          this.forAllSiblings(region.firstChild, (r) => {
            let childRegion = this.regions[r];
            // we need to manufacture a reasonable gap here, as we are skipping
            // over parent regions that we are intentionally not emitting
            if (
              this.outputCode.join("").trim().length > 0 &&
              !Boolean(this.outputCode.slice(-1)[0].match(/\s/))
            ) {
              // when we add a new gap, then the next region that is output will
              // have it's start adjusted by this amount
              this.outputCode.push(" ");
              this.emitPendingGap(parentPointer, 1);
            }
            this.cursor += childRegion.start;
            this.innerSerialize(r, regionPointer);
          });
          this.cancelPendingActions(regionPointer);
        }
        this.cursor += region.end;
        return { disposition, outputPointer: undefined, gap };
      }
      case "replaced": {
        let outputRegion = cloneDeep(region);
        this.absorbPendingGap(outputRegion);
        gap = this.absorbPendingStart(outputRegion);
        let outputPointer = this.outputRegions.length;
        this.handleReplace(
          region,
          disposition.replacement,
          regionPointer,
          parentPointer,
          outputRegion
        );
        this.skip(regionPointer);
        let maybeNextSibling = this.reconcilePendingAntecedant(regionPointer);
        if (maybeNextSibling != null) {
          outputRegion.nextSibling = maybeNextSibling;
        }
        return { disposition, outputPointer, gap };
      }
      case "wrap":
      case "unchanged": {
        let outputRegion: CodeRegion;
        let outputPointer: RegionPointer;
        let maybeNextSibling: RegionPointer | undefined;
        if (disposition.state === "wrap") {
          this.outputCode.push(`const ${disposition.declarationName} = (`);
          outputPointer = this.wrapWithRegions(
            regionPointer,
            disposition.declarationName
          );
          outputRegion = this.outputRegions[outputPointer].region;
          maybeNextSibling = this.reconcilePendingAntecedant(
            -1 * outputPointer
          );
        } else {
          outputRegion = cloneDeep(region);
          outputPointer = this.outputRegions.length;
          this.outputRegions.push({
            originalPointer: regionPointer,
            region: outputRegion,
          });
          maybeNextSibling = this.reconcilePendingAntecedant(regionPointer);
        }
        if (maybeNextSibling != null) {
          outputRegion.nextSibling = maybeNextSibling;
        }
        this.absorbPendingGap(outputRegion);
        gap = this.absorbPendingStart(outputRegion);
        if (region.firstChild != null) {
          let childRegion: CodeRegion;
          let childDispositions: Disposition[] = [];
          let isLastChildGapRemoved: boolean;
          this.forAllSiblings(region.firstChild, (r) => {
            childRegion = this.regions[r];
            let gapIndex = this.outputCode.length;
            this.outputCode.push(
              this.src.slice(this.cursor, this.cursor + childRegion.start)
            );
            this.cursor += childRegion.start;
            let {
              disposition,
              gap: childGap,
              outputPointer: childOutputPointer,
            } = this.innerSerialize(r, regionPointer);
            isLastChildGapRemoved = this.maybeRemovePrecedingGap(
              region,
              disposition,
              childDispositions,
              gapIndex
            );
            if (childOutputPointer != null && !isLastChildGapRemoved) {
              this.outputRegions[childOutputPointer].region.start += childGap;
            }
            childDispositions.push(disposition);
          });
          this.absorbPendingGap(outputRegion);
          if (!isLastChildGapRemoved! && this.pendingStart) {
            outputRegion.end += this.pendingStart.start;
          }
          this.cancelPendingActions(regionPointer);
        }
        // emit the part of yourself that appears after the last child
        this.outputCode.push(
          this.src.slice(this.cursor, this.cursor + region.end)
        );
        this.cursor += region.end;
        if (disposition.state === "wrap") {
          this.outputCode.push(");");
        }
        return { disposition, outputPointer: outputPointer!, gap };
      }
      default:
        throw assertNever(disposition);
    }
  }

  // Manufacture code regions for the new declaration and stitch into the
  // output code regions. The original region will be treated as a side
  // effect wrapped in an evaluation context, ()'s, on the right hand side
  // of the declaration. We'll also manufacture a reference code region to
  // hold the identifier on the left hand side of the declaration. The
  // reference and side effects will become children of the new
  // declaration region, which will arrange itself in the region tree at
  // the same place as the original region that has been relegated to a
  // side effect of the new declaration.
  private wrapWithRegions(
    regionPointer: RegionPointer,
    name: string
  ): RegionPointer {
    let region = this.regions[regionPointer];
    let {
      outputRegion: predecessor,
      isFirstChild: isChildOfPredecessor,
    } = this.getOutputPredecessor(regionPointer);

    // we'll use negative signs to indicate that these regions didn't previously
    // exist in the original set of regions
    let declarationPointer = -1 * this.outputRegions.length;
    let declaratorPointer = declarationPointer - 1;
    let referencePointer = declaratorPointer - 1;
    let sideEffectPointer = referencePointer - 1;

    if (isChildOfPredecessor) {
      predecessor.firstChild = declaratorPointer;
    } else {
      predecessor.nextSibling = declaratorPointer;
    }
    let declarationRegion: GeneralCodeRegion = {
      type: "general",
      start: region.start,
      end: 1, // trailing semicolon
      firstChild: declaratorPointer,
      nextSibling: region.nextSibling,
      shorthand: false,
      position: 0,
      dependsOn: new Set(),
      preserveGaps: false,
    };
    let declaratorRegion: DeclarationCodeRegion = {
      type: "declaration",
      start: 6, // "const "
      end: 1, // closing paren of the expression context
      firstChild: referencePointer,
      nextSibling: region.nextSibling,
      shorthand: false,
      position: 0,
      dependsOn: new Set([
        referencePointer,
        declarationPointer,
        sideEffectPointer,
      ]),
      preserveGaps: false,
      declaration: {
        type: "local",
        declaredName: name,
        references: [referencePointer],
      },
    };
    let referenceRegion: ReferenceCodeRegion = {
      type: "reference",
      start: 0, // the reference starts at the same location as its declarator
      end: name.length,
      firstChild: undefined,
      nextSibling: sideEffectPointer,
      shorthand: false,
      position: 0,
      dependsOn: new Set([declaratorPointer]),
    };
    let sideEffectRegion: GeneralCodeRegion = {
      type: "general",
      start: 4, // " = ("
      end: region.end,
      firstChild: region.firstChild,
      nextSibling: undefined,
      shorthand: false,
      position: 0,
      dependsOn: new Set([declaratorPointer]),
      preserveGaps: false,
    };
    this.absorbPendingGap(sideEffectRegion);
    this.outputRegions.push(
      { originalPointer: undefined, region: declarationRegion },
      { originalPointer: undefined, region: declaratorRegion },
      { originalPointer: undefined, region: referenceRegion },
      { originalPointer: undefined, region: sideEffectRegion }
    );
    return -1 * declarationPointer;
  }

  // do not emit the gap if the region.preserveGaps is false
  // (like the Document region or ArrayPattern type--those gaps are
  // special), e, g,:
  //   let [ , y ] = foo();
  // and:
  // 1. the current child is being removed and it's not the first
  //    child
  // 2. the all the previous children have been removed (so the
  //    current child is a candidate for being the first child)
  // note that the part of us proceeding the first child and the part
  // of us following the last child should always be emitted.
  private maybeRemovePrecedingGap(
    parentRegion: CodeRegion,
    previousSiblingDisposition: Disposition,
    siblingDispositions: Disposition[],
    gapIndex: number
  ): boolean {
    if (
      siblingDispositions.length > 0 &&
      parentRegion.type !== "document" &&
      (parentRegion.type === "reference" || !parentRegion.preserveGaps) &&
      (previousSiblingDisposition.state === "removed" ||
        siblingDispositions.every((d) => d.state === "removed"))
    ) {
      this.outputCode.splice(gapIndex, 1);
      return true;
    }
    return false;
  }

  private handleReplace(
    region: CodeRegion,
    replacement: string,
    regionPointer: RegionPointer,
    parentPointer: RegionPointer,
    outputRegion: CodeRegion
  ) {
    if (isReferenceCodeRegion(region)) {
      let outputDeclarationRegion = this.outputRegions.find(
        (o) =>
          o.originalPointer != null && region.dependsOn.has(o.originalPointer)
      );
      if (
        outputDeclarationRegion &&
        isDeclarationCodeRegion(outputDeclarationRegion.region)
      ) {
        outputDeclarationRegion.region.declaration.declaredName = replacement;
      }
    }
    if (!region.shorthand) {
      outputRegion.end = replacement.length;
      this.outputRegions.push({
        originalPointer: regionPointer,
        region: outputRegion,
      });
      this.outputCode.push(replacement);
      return;
    }
    let original = this.src.slice(this.cursor, this.cursor + region.end);
    let gap: number;
    switch (region.shorthand) {
      case "import":
        gap = 4;
        this.outputCode.push(original);
        this.outputCode.push(" as ");
        this.outputCode.push(replacement);
        break;
      case "object":
        gap = 1;
        this.outputCode.push(original);
        this.outputCode.push(":");
        this.outputCode.push(replacement);
        break;
      case "export":
        gap = 4;
        this.outputCode.push(replacement);
        this.outputCode.push(" as ");
        this.outputCode.push(original);
        break;
      default:
        throw assertNever(region.shorthand);
    }
    outputRegion.end = replacement.length;
    outputRegion.shorthand = false;
    // when we add a new gap, then the next region that is output will
    // have it's start adjusted by this amount
    this.emitPendingGap(parentPointer, gap + original.length);
    this.outputRegions.push({
      originalPointer: regionPointer,
      region: outputRegion,
    });
  }

  private getOutputPredecessor(
    pointer: RegionPointer
  ): {
    originalPointer: RegionPointer | undefined;
    outputRegion: CodeRegion;
    outputPointer: RegionPointer;
    isFirstChild: boolean;
  } {
    let output:
      | { region: CodeRegion; originalPointer: RegionPointer | undefined }
      | undefined;
    let prevPointer: RegionPointer | undefined;
    let currentPointer = pointer;
    let isFirstChild = false;
    while (!output && prevPointer !== documentPointer) {
      prevPointer = this.regions.findIndex(
        (r) =>
          r.firstChild === currentPointer || r.nextSibling === currentPointer
      );
      output = this.outputRegions.find(
        (o) => o.originalPointer === prevPointer
      );
      isFirstChild = output?.region?.firstChild === currentPointer;
      currentPointer = prevPointer;
    }
    if (!output) {
      throw new Error(
        `cannot find predecessor for the region pointer ${pointer} from regions ${JSON.stringify(
          this.regions
        )} with dispositions: ${JSON.stringify(this.dispositions)}`
      );
    }

    return {
      originalPointer: output.originalPointer,
      outputRegion: output.region,
      isFirstChild,
      outputPointer: this.outputRegions.findIndex((o) => o === output),
    };
  }

  private absorbPendingGap(region: CodeRegion) {
    if (this.pendingGap) {
      region.end += this.pendingGap.gap;
      this.pendingGap = undefined;
    }
  }

  private absorbPendingStart(outputRegion: CodeRegion): number {
    if (this.pendingStart != null) {
      let originalStart = outputRegion.start;
      outputRegion.start = this.pendingStart.start;
      this.pendingStart = undefined;
      return originalStart;
    }
    return 0;
  }

  private reconcilePendingAntecedant(
    pointer: RegionPointer
  ): RegionPointer | undefined {
    if (this.pendingAntecedant) {
      if (this.pendingAntecedant.isFirstChildOf != null) {
        this.outputRegions[
          this.pendingAntecedant.isFirstChildOf
        ].region.firstChild = pointer;
      } else if (this.pendingAntecedant.isNextSiblingOf != null) {
        this.outputRegions[
          this.pendingAntecedant.isNextSiblingOf
        ].region.nextSibling = pointer;
      }
      let nextSibling = this.pendingAntecedant.hasNextSiblingOf;
      this.pendingAntecedant = undefined;
      return nextSibling !== pointer ? nextSibling : undefined;
    }
    return;
  }

  private emitPendingAntecedant(
    parentPointer: RegionPointer,
    pointer: RegionPointer
  ) {
    if (this.pendingAntecedant == null) {
      let { outputPointer, isFirstChild } = this.getOutputPredecessor(pointer);
      this.pendingAntecedant = {
        withinParent: parentPointer,
        isFirstChildOf: isFirstChild ? outputPointer : undefined,
        isNextSiblingOf: !isFirstChild ? outputPointer : undefined,
        hasNextSiblingOf: this.regions[pointer].nextSibling,
      };
    }
  }

  private emitPendingStart(
    parentPointer: RegionPointer,
    pointer: RegionPointer
  ) {
    let region = this.regions[pointer];
    if (this.pendingStart == null && pointer !== documentPointer) {
      this.pendingStart = { withinParent: parentPointer, start: region.start };
    } else if (
      this.pendingStart &&
      this.pendingStart.withinParent === parentPointer
    ) {
      this.pendingStart.start += region.start;
    }
  }

  private emitPendingGap(parentPointer: RegionPointer, gap: number) {
    if (!this.pendingGap) {
      this.pendingGap = { withinParent: parentPointer, gap: 0 };
    }
    this.pendingGap.gap += gap;
  }

  private cancelPendingActions(pointer: RegionPointer) {
    if (this.pendingGap?.withinParent === pointer) {
      this.pendingGap = undefined;
    }
    if (this.pendingStart?.withinParent === pointer) {
      this.pendingStart = undefined;
    }
    if (this.pendingAntecedant?.withinParent === pointer) {
      this.pendingAntecedant = undefined;
    }
  }

  private skip(regionPointer: RegionPointer) {
    let region = this.regions[regionPointer];
    if (region.firstChild != null) {
      this.forAllSiblings(region.firstChild, (r) => {
        this.cursor += this.regions[r].start;
        this.skip(r);
      });
    }
    this.cursor += region.end;
  }

  private forAllSiblings(
    regionPointer: RegionPointer | undefined,
    fn: (r: RegionPointer) => void
  ) {
    if (regionPointer == null) {
      return;
    }
    let current: number | undefined = regionPointer;
    while (current != null) {
      fn(current);
      current = this.regions[current].nextSibling;
    }
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

function remapRegions(
  outputRegions: {
    originalPointer: RegionPointer | undefined;
    region: CodeRegion;
  }[]
): CodeRegion[] {
  let regions = outputRegions.map(({ region }, index) => {
    region.firstChild = newPointer(region.firstChild, outputRegions);
    let maybeNextSibling = newPointer(region.nextSibling, outputRegions);
    if (maybeNextSibling !== index) {
      region.nextSibling = maybeNextSibling;
    } else {
      region.nextSibling = undefined;
    }
    region.dependsOn = new Set(
      [...region.dependsOn]
        .map((p) => newPointer(p, outputRegions, region.type === "reference"))
        .filter((p) => p != null) as RegionPointer[]
    );
    if (region.type === "declaration") {
      region.declaration.references = region.declaration.references
        .map((p) => newPointer(p, outputRegions))
        .filter((p) => p != null) as RegionPointer[];
    }
    return region;
  });
  if (regions[documentPointer].firstChild != null) {
    regions[documentPointer].firstChild = 1;
  }

  return regions;
}

function trimLeading(
  regions: CodeRegion[],
  code: string,
  pointer: RegionPointer = documentPointer,
  remainingWhitespaceLength = code.match(/^\s*/)![0].length
): number {
  if (remainingWhitespaceLength === code.length) {
    // collapse this to an empty doc
    regions = [
      {
        type: "document",
        start: 0,
        end: 0,
        firstChild: undefined,
        nextSibling: undefined,
        shorthand: false,
        dependsOn: new Set(),
        position: 0,
      },
    ];
    return 0;
  }

  if (remainingWhitespaceLength > 0) {
    let region = regions[pointer];
    if (region.start >= remainingWhitespaceLength) {
      region.start = region.start - remainingWhitespaceLength;
      return 0;
    } else {
      remainingWhitespaceLength -= region.start;
      region.start = 0;
      if (region.firstChild != null) {
        remainingWhitespaceLength = trimLeading(
          regions,
          code,
          region.firstChild,
          remainingWhitespaceLength
        );
      }
      if (region.nextSibling != null) {
        remainingWhitespaceLength = trimLeading(
          regions,
          code,
          region.nextSibling,
          remainingWhitespaceLength
        );
      }
    }
  }
  return remainingWhitespaceLength;
}

// TODO let's get rid of this negative number stuff by just feeding in all the
// previous code regions that this module depends on (from the upstream
// modules). then all the regions that we need will be available and we wont
// have to fix up the regions after they leave this module.
function newPointer(
  originalPointer: RegionPointer | undefined,
  outputRegions: {
    originalPointer: RegionPointer | undefined;
    region: CodeRegion;
  }[],
  allowOriginalRegionIndicators = false
): RegionPointer | undefined {
  if (originalPointer == null) {
    return;
  }
  // the negative sign is an indication that the pointer is one that didn't
  // exist in the original set of regions.
  if (originalPointer < 0) {
    return -1 * originalPointer; // strip the sign and return the pointer.
  }
  let index = outputRegions.findIndex(
    (r) => r.originalPointer === originalPointer
  );
  if (allowOriginalRegionIndicators && index === -1) {
    // in this scenario the region has been stripped out. we use a negative sign
    // as an indicator that this pointer still needs to be reconciled after we
    // assign this module to a bundle, as the region we want (which is most
    // likely a declaration) will be found in a different module.
    return originalPointer * -1;
  } else if (index === -1) {
    return;
  }
  return index;
}
