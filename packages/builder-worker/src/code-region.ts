// The purpose of a CodeRegion is to mark a region of source code that we may be
// able to remove or replace. CodeRegions form a hierarchy, and by convention if
// all the child regions of a region are removed, the region itself must be
// removed.

import { NodePath } from "@babel/traverse";
import { Program } from "@babel/types";
import { assertNever } from "@catalogjs/shared/util";
import { FileDescription, isModuleDescription } from "./describe-file";

export type RegionPointer = number;

const documentPointer = 0;
const lvalTypes = ["ObjectProperty", "ArrayPattern", "RestElement"];

// the parts of a CodeRegion that we can determine independent of its location,
// based only on its own NodePath.
type PathFacts = Pick<CodeRegion, "shorthand" | "preserveGaps">;

interface NewRegion {
  absoluteStart: number;
  absoluteEnd: number;
  index: number;
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
      start: 0,
      end: absoluteEnd,
      firstChild: undefined,
      nextSibling: undefined,
      shorthand: false,
      preserveGaps: true,
    });
  }

  createCodeRegion(path: NodePath): RegionPointer {
    let { absoluteStart, absoluteEnd } = this.pathAbsoluteRange(path);
    let newRegion: NewRegion = {
      absoluteStart,
      absoluteEnd,
      index: this.regions.length,
      pathFacts: {
        shorthand: shorthandMode(path),
        preserveGaps: path.type === "ArrayPattern",
      },
    };
    this.absoluteRanges.set(newRegion.index, {
      start: absoluteStart,
      end: absoluteEnd,
    });
    this.types.set(newRegion.index, path.type);
    this.insertWithin(documentPointer, newRegion);
    return newRegion.index;
  }

  private pathAbsoluteRange(
    path: NodePath
  ): { absoluteStart: number; absoluteEnd: number } {
    let { start: absoluteStart, end: absoluteEnd } = path.node;
    if (absoluteStart == null || absoluteEnd == null) {
      throw new Error(
        `bug: do not know how to create code region for ${path.node.type}: missing start/end character positions`
      );
    }
    return { absoluteStart, absoluteEnd };
  }

  private getRegion(pointer: RegionPointer): CodeRegion {
    return this.regions[pointer]!;
  }

  private getAbsolute(pointer: RegionPointer): { start: number; end: number } {
    return this.absoluteRanges.get(pointer)!;
  }

  private insertWithin(parent: RegionPointer, newRegion: NewRegion) {
    let child = this.getRegion(parent).firstChild;
    let prevChild: RegionPointer | undefined;
    while (child != null) {
      let position = this.compare(newRegion, child);
      switch (position) {
        case "before":
          this.insertBefore(child, parent, prevChild, newRegion);
          return;
        case "around":
          this.insertAround(child, parent, prevChild, newRegion);
          return;
        case "within":
          this.insertWithin(child, newRegion);
          return;
        case "same":
          newRegion.index = child;
          return;
        case "after":
          prevChild = child;
          child = this.getRegion(child).nextSibling;
          continue;
        default:
          throw assertNever(position);
      }
    }
    this.insertLast(prevChild, parent, newRegion);
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
    this.regions.push({
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - newRegion.absoluteStart,
      firstChild: undefined,
      nextSibling: target,
      ...newRegion.pathFacts,
    });
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
    this.regions.push({
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - this.getAbsolute(cursor).end,
      firstChild: target,
      nextSibling,
      ...newRegion.pathFacts,
    });
  }

  // add newRegion as the final sibling after target, beneath targetParent.
  private insertLast(
    target: RegionPointer | undefined,
    targetParent: RegionPointer,
    newRegion: NewRegion
  ) {
    let basis = this.linkToNewRegion(targetParent, target, newRegion);
    this.regions.push({
      start: newRegion.absoluteStart - basis,
      end: newRegion.absoluteEnd - newRegion.absoluteStart,
      firstChild: undefined,
      nextSibling: undefined,
      ...newRegion.pathFacts,
    });
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

export interface CodeRegion {
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
  preserveGaps: boolean;
}

type Disposition =
  | {
      state: "unchanged";
    }
  | { state: "removed" }
  | { state: "replaced"; replacement: string }
  | {
      state: "replaced start";
      replacement: string;
    }
  | { state: "unwrap" };

export class RegionEditor {
  private dispositions: Disposition[];

  private cursor = 0;
  private output: string[] = [];

  constructor(
    private src: string,
    private desc: FileDescription,
    private unusedNameLike: (name: string) => string
  ) {
    this.dispositions = desc.regions.map(() => ({
      state: "unchanged",
    }));
  }

  removeDeclaration(name: string) {
    let nameDesc = this.desc.names.get(name);
    if (!nameDesc) {
      throw new Error(`tried to remove unknown declaration ${name}`);
    }
    if (nameDesc.declarationSideEffects != null) {
      this.dispositions[nameDesc.declaration] = {
        state: "unwrap",
      };
      this.rename(name, this.unusedNameLike(name));
    } else {
      this.dispositions[nameDesc.declaration] = { state: "removed" };
    }
  }

  rename(oldName: string, newName: string) {
    let nameDesc = this.desc.names.get(oldName);
    if (!nameDesc) {
      throw new Error(`tried to rename unknown name ${oldName}`);
    }
    for (let region of nameDesc.references) {
      this.replace(region, newName);
    }
  }

  replace(region: RegionPointer, replacement: string): void {
    this.dispositions[region] = { state: "replaced", replacement };
  }

  removeImportsAndExports(defaultNameSuggestion: string | undefined) {
    if (!isModuleDescription(this.desc)) {
      throw new Error(
        `removeImportsAndExports() does not support CJSDescriptions`
      );
    }
    let exportRegions = [...this.desc.exportRegions];
    let defaultExport = this.desc.exports.get("default");
    if (
      defaultExport?.name === "default" &&
      defaultNameSuggestion === "default"
    ) {
      // this is the scenario where we are dealing with a module that is
      // consumed dynamically. As such, we need to preserve its default export,
      // since it will become an export of the overall bundle that encloses the
      // module. (statically consumed default exports though are removed, and
      // their consumers' bindings are reassigned). So we skip over the export.
      exportRegions = exportRegions.filter(
        ({ region }) => region !== defaultExport?.exportRegion
      );
    }
    for (let { region, declaration } of exportRegions) {
      let defaultExport = this.desc.exports.get("default");

      if (
        defaultExport &&
        defaultExport.name === "default" &&
        defaultExport.exportRegion === region
      ) {
        // the region we are considering is actually an unnamed default, so we
        // assign it
        if (!defaultNameSuggestion) {
          throw new Error(
            `Encountered an unnamed default export, but no default name suggestion was provided`
          );
        }
        this.dispositions[region] = {
          state: "replaced start",
          replacement: `const ${defaultNameSuggestion} = `,
        };
      } else if (declaration != null) {
        this.dispositions[region] = {
          state: "replaced start",
          replacement: "",
        };
      } else {
        this.dispositions[region] = { state: "removed" };
      }
    }
    for (let importDesc of this.desc.imports) {
      if (!importDesc.isDynamic) {
        this.dispositions[importDesc.region] = { state: "removed" };
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
    switch (disposition.state) {
      case "removed":
        this.skip(regionPointer);
        return disposition;
      case "replaced":
        this.handleReplace(region, disposition.replacement);
        this.skip(regionPointer);
        return disposition;
      case "unwrap":
      case "replaced start":
      case "unchanged":
        if (region.firstChild != null) {
          let childDispositions: Disposition[] = [];
          let childRegion: CodeRegion;
          let ourStartOutputIndex = this.output.length;
          this.forAllSiblings(region.firstChild, (r) => {
            childRegion = this.desc.regions[r];
            let gapIndex = this.output.length;
            this.output.push(
              this.src.slice(this.cursor, this.cursor + childRegion.start)
            );
            this.cursor += childRegion.start;
            let disposition = this.innerSerialize(r, regionPointer);

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
            if (
              childDispositions.length > 0 &&
              !region.preserveGaps &&
              (disposition.state === "removed" ||
                childDispositions.every((d) => d.state === "removed"))
            ) {
              this.output.splice(gapIndex, 1);
            }
            childDispositions.push(disposition);
          });

          if (
            childDispositions.every((d) => d.state === "removed") &&
            regionPointer !== documentPointer
          ) {
            // if all our children were removed, then we need to be removed
            this.output.pop();
            this.cursor += region.end;
            return { state: "removed" };
          } else if (
            parent === documentPointer && // don't try to isolate side effects in LVals
            childDispositions.filter((d) => d.state === "unwrap").length ===
              1 &&
            childDispositions.filter((d) => d.state === "removed").length +
              1 ===
              childDispositions.length
          ) {
            // All the children have been removed, and there is only a single side effect.
            // In this situation there should have been 6 items emitted to the
            // output for the VariableDeclaration specifically:
            // 1. our beginning
            // 2. the gap before the retained child
            // 3. the renamed left-side of the declaration
            // 4. the gap between the reference name and the side effect ("=" sign)
            // 5. the side effectful right-side of the declaration
            // 6. the gap after the retained child
            // We want to keep only #5 and remove all the rest.
            this.output.pop();
            let sideEffect = this.output.pop()!;
            this.output = this.output.slice(0, -4);
            this.output.push(sideEffect);
          } else if (disposition.state === "replaced start") {
            this.output[ourStartOutputIndex] = disposition.replacement;
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

  private handleReplace(region: CodeRegion, replacement: string) {
    if (!region.shorthand) {
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
