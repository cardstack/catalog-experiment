// The purpose of a CodeRegion is to mark a region of source code that we may be
// able to remove or replace. CodeRegions form a hierarchy, and by convention if
// all the child regions of a region are removed, the region itself must be
// removed.

import { NodePath } from "@babel/traverse";
import { Program } from "@babel/types";
import { assertNever } from "@catalogjs/shared/util";
import {
  DeclarationCache,
  declarationMap,
  FileDescription,
  isModuleDescription,
} from "./describe-file";

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
type PathFacts = Pick<
  GeneralCodeRegion,
  "shorthand" | "preserveGaps" | "removeWhenNoSiblings"
>;

interface NewRegion {
  type: CodeRegion["type"];
  absoluteStart: number;
  absoluteEnd: number;
  index: number;
  dependsOn: Set<RegionPointer>;
  bindingDescription:
    | LocalBindingDescription
    | ImportedBindingDescription
    | undefined;
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
      type: "general",
      start: 0,
      end: absoluteEnd,
      firstChild: undefined,
      nextSibling: undefined,
      dependsOn: new Set(),
      shorthand: false,
      preserveGaps: true,
      removeWhenNoSiblings: false,
    });
  }

  // TODO consider making this some degenerate form of a CodeRegion, stripped to
  // the bare minimum of props (no deps, no binding description, no path facts,
  // etc.)
  createCodeRegionForReference(path: NodePath): RegionPointer {
    return this.createCodeRegion(path);
  }
  createCodeRegion(adjacentPaths: NodePath[]): RegionPointer;
  createCodeRegion(
    path: NodePath,
    importIndex?: number,
    dependsOnRegion?: Set<RegionPointer>
  ): RegionPointer;
  createCodeRegion(
    path: NodePath,
    bindingDescription?: LocalBindingDescription | ImportedBindingDescription,
    dependsOnRegion?: Set<RegionPointer>
  ): RegionPointer;
  createCodeRegion(
    pathOrPaths: NodePath | NodePath[],
    bindingDescriptionOrImportIndex?:
      | LocalBindingDescription
      | ImportedBindingDescription
      | number,
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
    if (typeof bindingDescriptionOrImportIndex === "object") {
      type = "declaration";
    } else if (typeof bindingDescriptionOrImportIndex === "number") {
      type = "import";
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
      bindingDescription:
        typeof bindingDescriptionOrImportIndex === "object"
          ? bindingDescriptionOrImportIndex
          : undefined,
      importIndex:
        typeof bindingDescriptionOrImportIndex === "number"
          ? bindingDescriptionOrImportIndex
          : undefined,
      pathFacts: {
        shorthand: Array.isArray(pathOrPaths)
          ? false
          : shorthandMode(pathOrPaths),
        preserveGaps: Array.isArray(pathOrPaths)
          ? true
          : pathOrPaths.type === "ArrayPattern",
        removeWhenNoSiblings: Array.isArray(pathOrPaths)
          ? false
          : dependsOnSiblingPresence(pathOrPaths),
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
          // TODO consider how this impacts enclosed names
          this.insertWithin(childPointer, newRegion);
          return;
        case "same":
          let child = this.getRegion(childPointer);
          if (newRegion.type === "declaration") {
            child.type = "declaration";
            child.dependsOn = new Set([
              ...child.dependsOn,
              ...newRegion.dependsOn,
            ]);
            if (isDeclarationCodeRegion(child)) {
              child.bindingDescription =
                newRegion.bindingDescription ?? child.bindingDescription;
            }
            if (isImportCodeRegion(child)) {
              newRegion.importIndex =
                newRegion.importIndex ?? child.importIndex;
            }
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
    let { bindingDescription, dependsOn, type, importIndex } = newRegion;
    let data = {
      type,
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - newRegion.absoluteStart,
      firstChild: undefined,
      nextSibling: target,
      dependsOn,
      bindingDescription,
      importIndex,
      ...newRegion.pathFacts,
    };
    if (isCodeRegion(data)) {
      this.regions.push(data);
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
    let basis = this.linkToNewRegion(targetParent, targetPrevious, newRegion);
    this.adjustStartRelativeTo(target, newRegion.absoluteStart);
    let cursor: RegionPointer = target;
    let nextSibling: RegionPointer | undefined;
    while (cursor != null) {
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
    let { bindingDescription, dependsOn, type, importIndex } = newRegion;
    let data = {
      type,
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - this.getAbsolute(cursor).end,
      firstChild: target,
      nextSibling,
      dependsOn,
      bindingDescription,
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
    let { bindingDescription, dependsOn, type, importIndex } = newRegion;
    let data = {
      type,
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - newRegion.absoluteStart,
      firstChild: undefined,
      nextSibling: undefined,
      dependsOn,
      bindingDescription,
      importIndex,
      ...newRegion.pathFacts,
    };
    if (isCodeRegion(data)) {
      this.regions.push(data);
    }
    this.adjustEndRelativeTo(targetParent, newRegion.absoluteEnd);
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

export interface BindingDescription {
  declaredName: string;
  references: RegionPointer[];
  sideEffects: RegionPointer | undefined;
}

export interface LocalBindingDescription extends BindingDescription {
  type: "local";
  original?: {
    regionHref: string; // TODO replace with consumption semver
  };
}

export interface ImportedBindingDescription extends BindingDescription {
  type: "import";
  importIndex: number;
  importedName: string | NamespaceMarker;
}

export interface EnclosedNames {
  [name: string]: number; // starting position of name (position should not include bytes in this region's child regions)
}

export type CodeRegion =
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

  // This replaces dependsOn, usedByModule, declarationSideEffects,
  // and bindingsConsumedByDeclarationSideEffects that used to live in the
  // NameDescription.
  dependsOn: Set<RegionPointer>;
}

export interface GeneralCodeRegion extends BaseCodeRegion {
  type: "general";

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
  preserveGaps: boolean;

  // TODO this seems like just another type of dependsOn. let's evaluate if this
  // is still necessary and if so, let's remove this and replace with dependsOn
  // of the sibling regions. Also, I think that the need for this might actually
  // have disappeared--the need for this resulted in a side effect of creating
  // an additional code region to aid in retaining side effects when pruning
  // declarations. we're taking a different approach, so we might not need this
  // anymore..
  removeWhenNoSiblings: boolean;
}

export function isGeneralCodeRegion(region: any): region is GeneralCodeRegion {
  return (
    typeof region === "object" && "type" in region && region.type === "general"
  );
}

export interface DeclarationCodeRegion extends Omit<GeneralCodeRegion, "type"> {
  type: "declaration";
  bindingDescription: LocalBindingDescription | ImportedBindingDescription;
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

export function isDeclarationCodeRegion(
  region: any
): region is DeclarationCodeRegion {
  return (
    typeof region === "object" &&
    "type" in region &&
    region.type === "declaration"
  );
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
    isGeneralCodeRegion(region) ||
    isDeclarationCodeRegion(region) ||
    isReferenceCodeRegion(region) ||
    isImportCodeRegion(region)
  );
}

// TODO we don't need this..
export function isChildOf(
  region: RegionPointer,
  maybeParent: RegionPointer,
  regions: CodeRegion[]
): boolean {
  let parent = regions[maybeParent];
  if (parent.firstChild === region) {
    return true;
  }
  if (parent.firstChild != null) {
    return isChildOrSiblingOf(region, parent.firstChild, regions);
  }
  return false;
}
// TODO we don't need this..
export function isChildOrSiblingOf(
  region: RegionPointer,
  maybeParentOrSibling: RegionPointer,
  regions: CodeRegion[]
): boolean {
  let parentOrSibling = regions[maybeParentOrSibling];
  if (
    parentOrSibling.firstChild === region ||
    parentOrSibling.nextSibling === region
  ) {
    return true;
  }
  let found = false;
  if (parentOrSibling.firstChild != null) {
    found = isChildOrSiblingOf(region, parentOrSibling.firstChild, regions);
  }
  if (found) {
    return true;
  }
  if (parentOrSibling.nextSibling != null) {
    found = isChildOrSiblingOf(region, parentOrSibling.nextSibling, regions);
  }
  return found;
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
      state: "rewrap";
      region: RegionPointer;
      beginning: string;
      end: string;
    }
  | { state: "unwrap"; region: RegionPointer; beginning: string; end: string };

export class RegionEditor {
  private dispositions: Disposition[];

  private cursor = 0;
  private output: string[] = [];

  constructor(
    private src: string,
    private desc: FileDescription,
    private unusedNameLike: (name: string) => string,
    private declarations: Map<
      string | NamespaceMarker,
      { region: DeclarationCodeRegion; pointer: RegionPointer }
    > = declarationMap(desc)
  ) {
    // Regions are assumed to be removed unless .keepRegion() is explicitly
    // called for a region.
    this.dispositions = [...desc.regions.entries()].map(([index]) => ({
      state: "removed",
      region: index,
    }));
  }

  includedRegions(): RegionPointer[] {
    return this.dispositions
      .filter((d) => d.state !== "removed")
      .map(({ region }) => region);
  }

  // TODO we probably don't need this anymore, remove it and any dispositions unique to this method.
  removeDeclaration(name: string, removeSideEffects = false) {
    let { region: declarationRegion, pointer } =
      this.declarations.get(name) ?? {};
    if (!declarationRegion || pointer == null) {
      throw new Error(`tried to remove unknown declaration ${name}`);
    }
    if (
      declarationRegion.bindingDescription.sideEffects != null &&
      !removeSideEffects
    ) {
      this.dispositions[pointer] = {
        state: "unwrap",
        beginning: "(",
        end: ")",
        region: pointer,
      };
      this.rename(name, this.unusedNameLike(`unused_${name}`));
    } else {
      this.dispositions[pointer] = { state: "removed", region: pointer };
      if (
        removeSideEffects &&
        declarationRegion.bindingDescription.sideEffects
      ) {
        this.dispositions[declarationRegion.bindingDescription.sideEffects] = {
          state: "removed",
          region: declarationRegion.bindingDescription.sideEffects,
        };
      }
    }
  }

  removeRegion(pointer: RegionPointer) {
    this.removeRegionAndItsChildren(pointer);
  }

  private removeRegionAndItsChildren(pointer: RegionPointer) {
    this.dispositions[pointer] = { state: "removed", region: pointer };
    let region = this.desc.regions[pointer];
    if (region.firstChild != null) {
      this.removeRegionAndItsChildrenAndSiblings(region.firstChild);
    }
  }

  private removeRegionAndItsChildrenAndSiblings(pointer: RegionPointer) {
    this.dispositions[pointer] = { state: "removed", region: pointer };
    let region = this.desc.regions[pointer];
    if (region.firstChild != null) {
      this.removeRegionAndItsChildrenAndSiblings(region.firstChild);
    }
    if (region.nextSibling != null) {
      this.removeRegionAndItsChildrenAndSiblings(region.nextSibling);
    }
  }

  keepRegion(pointer: RegionPointer) {
    this.keepRegionAndItsChildren(pointer);
  }

  private keepRegionAndItsChildren(pointer: RegionPointer) {
    if (this.dispositions[pointer].state === "removed") {
      this.dispositions[pointer] = { state: "unchanged", region: pointer };
    }
    let region = this.desc.regions[pointer];
    if (region.firstChild != null) {
      this.keepRegionAndItsChildrenAndSiblings(region.firstChild);
    }
  }

  private keepRegionAndItsChildrenAndSiblings(pointer: RegionPointer) {
    if (this.dispositions[pointer].state === "removed") {
      this.dispositions[pointer] = { state: "unchanged", region: pointer };
    }
    let region = this.desc.regions[pointer];
    if (region.firstChild != null) {
      this.keepRegionAndItsChildrenAndSiblings(region.firstChild);
    }
    if (region.nextSibling != null) {
      this.keepRegionAndItsChildrenAndSiblings(region.nextSibling);
    }
  }

  rename(oldName: string, newName: string) {
    let { pointer, region: declarationRegion } =
      this.declarations.get(oldName) ?? {};
    if (!declarationRegion || pointer == null) {
      throw new Error(`tried to rename unknown name ${oldName}`);
    }
    if (oldName === "default") {
      this.keepRegion(pointer);
      this.dispositions[pointer] = {
        state: "rewrap",
        beginning: `const ${newName} = (`,
        end: ");",
        region: pointer,
      };
    } else {
      for (let pointer of declarationRegion.bindingDescription!.references) {
        this.replace(pointer, newName);
      }
    }
  }

  // Note that "keepRegion()" must be called first on a region before we'll
  // honor a replace on that region
  replace(region: RegionPointer, replacement: string): void {
    if (this.dispositions[region].state !== "removed") {
      this.dispositions[region] = {
        state: "replaced",
        replacement,
        region,
      };
    }
  }

  // TODO we probably don't need this anymore, remove it and any dispositions unique to this method.
  removeImportsAndExports(defaultNameSuggestion: string | undefined) {
    if (!isModuleDescription(this.desc)) {
      throw new Error(
        `removeImportsAndExports() does not support CJSDescriptions`
      );
    }
    let exportRegions = [...this.desc.exportRegions];
    let defaultExport = this.desc.exports.get("default");

    for (let {
      region,
      declaration,
      defaultExport: defaultExportKind,
    } of exportRegions) {
      if (
        defaultExport?.exportRegion === region &&
        defaultExportKind === "identifier"
      ) {
        // in this case we are just default exporting an identifier, there is an
        // optimization here we we can simply just remove the entire export
        this.dispositions[region] = {
          state: "removed",
          region,
        };
      } else if (defaultExport?.exportRegion === region && defaultExportKind) {
        // the region we are considering is actually an unnamed default, so we
        // assign it
        if (!defaultNameSuggestion) {
          throw new Error(
            `Encountered an unnamed default export, but no default name suggestion was provided`
          );
        }
        this.dispositions[region] = {
          state: "replace-edges",
          beginningReplacement: `const ${defaultNameSuggestion} = (`,
          endReplacement: ");",
          region,
        };
      } else if (declaration != null) {
        this.dispositions[region] = {
          state: "replace-edges",
          beginningReplacement: "",
          endReplacement: "",
          region,
        };
      } else {
        this.dispositions[region] = { state: "removed", region };
      }
    }
    for (let importDesc of this.desc.imports) {
      if (!importDesc.isDynamic) {
        this.dispositions[importDesc.region] = {
          state: "removed",
          region: importDesc.region,
        };
      }
    }
  }

  serialize(): string {
    if (this.desc.regions.length === 0) {
      return this.src;
    }

    this.cursor = 0;
    this.output = [];
    this.innerSerialize(documentPointer, undefined);

    return this.output.join("");
  }

  private innerSerialize(
    regionPointer: RegionPointer,
    parent: RegionPointer | undefined
  ): Disposition {
    let region = this.desc.regions[regionPointer];
    let disposition = this.dispositions[regionPointer];
    let ourStartOutputIndex = this.output.length;
    switch (disposition.state) {
      case "removed":
        if (region.firstChild != null) {
          this.forAllSiblings(region.firstChild, (r) => {
            let childRegion = this.desc.regions[r];
            // we need to manufacture a reasonable gap here, as we are skipping
            // over parent regions that we are intentionally not emitting
            if (this.output.slice(-1)[0] !== "\n") {
              this.output.push("\n");
            }
            this.cursor += childRegion.start;
            this.innerSerialize(r, regionPointer);
          });
        }
        this.cursor += region.end;
        return disposition;
      case "replaced":
        this.handleReplace(region, disposition.replacement);
        this.skip(regionPointer);
        return disposition;
      case "rewrap":
        this.output.push(disposition.beginning);
        let childDispositions: Disposition[] = [];
        if (region.firstChild != null) {
          this.forAllSiblings(region.firstChild, (r) => {
            let childRegion = this.desc.regions[r];
            let gapIndex = this.output.length;
            this.output.push(
              this.src.slice(this.cursor, this.cursor + childRegion.start)
            );
            this.cursor += childRegion.start;
            let disposition = this.innerSerialize(r, regionPointer);
            this.maybeRemovePrecedingGap(
              region,
              disposition,
              childDispositions,
              gapIndex
            );
            childDispositions.push(disposition);
          });
        }
        this.output.push(this.src.slice(this.cursor, this.cursor + region.end));
        this.cursor += region.end;
        this.output.push(disposition.end);
        return disposition;
      case "unwrap":
      case "unchanged":
        if (region.firstChild != null) {
          let childDispositions: Disposition[] = [];
          let childRegion: CodeRegion;
          this.forAllSiblings(region.firstChild, (r) => {
            childRegion = this.desc.regions[r];
            let gapIndex = this.output.length;
            this.output.push(
              this.src.slice(this.cursor, this.cursor + childRegion.start)
            );
            this.cursor += childRegion.start;
            let disposition = this.innerSerialize(r, regionPointer);
            this.maybeRemovePrecedingGap(
              region,
              disposition,
              childDispositions,
              gapIndex
            );
            childDispositions.push(disposition);
          });

          if (
            childDispositions
              .filter(
                (d) =>
                  !(this.desc.regions[d.region] as GeneralCodeRegion)
                    .removeWhenNoSiblings
              )
              .every((d) => d.state === "removed") &&
            regionPointer !== documentPointer
          ) {
            // if all our children were removed, then we need to be removed
            this.output = this.output.slice(0, ourStartOutputIndex);
            this.cursor += region.end;
            return { state: "removed", region: regionPointer };
          } else if (
            parent === documentPointer && // don't try to isolate side effects in LVals
            childDispositions.filter((d) => d.state === "unwrap").length ===
              1 &&
            childDispositions.filter((d) => d.state === "removed").length +
              1 ===
              childDispositions.length
          ) {
            // All the children have been removed, and there is only a single
            // side effect. In this situation there should have been 6 notable
            // items emitted to the output for the VariableDeclaration
            // specifically:
            // 1. our beginning
            // 2. the gap before the retained child
            // 3. the renamed left-side of the declaration
            // 4. the gap between the reference name and the side effect ("="
            //    sign)
            // 5. the side effectful right-side of the declaration and output
            //    emitted by any of the child's own children's regions
            // 6. the gap after the retained child We want to keep only #5 and
            //    remove all the rest.
            let unwrap = childDispositions.find((d) => d.state === "unwrap")!;
            let beginning: string, end: string;
            if (unwrap.state === "unwrap") {
              ({ beginning, end } = unwrap);
            } else {
              throw new Error(`bug: should never be here`);
            }
            this.output.pop();
            let sideEffect = this.output.slice(ourStartOutputIndex + 4);
            this.output = this.output.slice(0, ourStartOutputIndex);
            this.output.push(beginning, ...sideEffect, end);
          }
        }
        // emit the part of yourself that appears after the last child
        this.output.push(this.src.slice(this.cursor, this.cursor + region.end));
        this.cursor += region.end;
        return disposition;
      default:
        throw assertNever(disposition);
    }
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
  ) {
    if (
      siblingDispositions.length > 0 &&
      (parentRegion.type === "reference" || !parentRegion.preserveGaps) &&
      (previousSiblingDisposition.state === "removed" ||
        siblingDispositions.every((d) => d.state === "removed"))
    ) {
      this.output.splice(gapIndex, 1);
    }
  }

  private handleReplace(region: CodeRegion, replacement: string) {
    if (region.type === "reference" || !region.shorthand) {
      this.output.push(replacement);
      return;
    }
    let original = this.src.slice(this.cursor, this.cursor + region.end);
    switch (region.shorthand) {
      case "import":
        this.output.push(original);
        this.output.push(" as ");
        this.output.push(replacement);
        break;
      case "object":
        this.output.push(original);
        this.output.push(":");
        this.output.push(replacement);
        break;
      case "export":
        this.output.push(replacement);
        this.output.push(" as ");
        this.output.push(original);
        break;
      default:
        throw assertNever(region.shorthand);
    }
  }

  private skip(regionPointer: RegionPointer) {
    let region = this.desc.regions[regionPointer];
    if (region.firstChild != null) {
      this.forAllSiblings(region.firstChild, (r) => {
        this.cursor += this.desc.regions[r].start;
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
      current = this.desc.regions[current].nextSibling;
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

// this is looking for regions that can only exist when their siblings exist.
// specifically the right hand side of an LVal, like:
//   let { bar } = foo;
// in this case "{ bar }" the ObjectPattern and "foo" the Identifier are siblings
// within the VariableDeclarator parent. The Identifier "foo" cannot exist
// without the ObjectPatten "{ bar }", and if "{ bar }" is removed, then we
// must remove "foo".
function dependsOnSiblingPresence(path: NodePath) {
  return (
    path.parent.type === "VariableDeclarator" && path.parent.init === path.node
  );
}
