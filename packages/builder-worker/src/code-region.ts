// The purpose of a CodeRegion is to mark a region of source code that we may be
// able to remove or replace. CodeRegions form a hierarchy, and by convention if
// all the child regions of a region are removed, the region itself must be
// removed.

import { NodePath } from "@babel/traverse";
import { assertNever } from "shared/util";

export type RegionPointer = number;

const DocumentPointer = { isDocumentPointer: true };
type InternalRegionPointer = RegionPointer | typeof DocumentPointer;

// the parts of a CodeRegion that we can determine independent of its location,
// based only on its own NodePath.
type PathFacts = Pick<CodeRegion, "shorthand">;

interface NewRegion {
  absoluteStart: number;
  absoluteEnd: number;
  index: number;
  pathFacts: PathFacts;
}

type Position = "before" | "within" | "around" | "after";

export class RegionBuilder {
  regions: CodeRegion[] = [];
  get top(): RegionPointer | undefined {
    return this.documentRegion.firstChild;
  }

  private documentRegion: CodeRegion;

  private absoluteRanges: Map<
    InternalRegionPointer,
    { start: number; end: number }
  > = new Map();

  constructor() {
    this.documentRegion = {
      start: 0,
      get end(): number {
        throw new Error(`not supposed to need document's end`);
      },
      firstChild: undefined,
      nextSibling: undefined,
      shorthand: false,
    };
    this.absoluteRanges.set(DocumentPointer, {
      start: 0,
      get end(): number {
        throw new Error(`not supposed to need document's absolute end`);
      },
    });
  }

  createCodeRegion(path: NodePath): RegionPointer {
    let { start: absoluteStart, end: absoluteEnd } = path.node;
    if (absoluteStart == null || absoluteEnd == null) {
      throw new Error(
        `bug: do not know how to create code region for ${path.node.type}: missing start/end character positions`
      );
    }
    let newRegion: NewRegion = {
      absoluteStart,
      absoluteEnd,
      index: this.regions.length,
      pathFacts: { shorthand: false },
    };
    this.absoluteRanges.set(newRegion.index, {
      start: absoluteStart,
      end: absoluteEnd,
    });
    debugger;
    this.insertWithin(DocumentPointer, newRegion);
    return newRegion.index;
  }

  private getRegion(pointer: InternalRegionPointer): CodeRegion {
    if (typeof pointer === "number") {
      return this.regions[pointer]!;
    } else {
      return this.documentRegion;
    }
  }

  private getAbsolute(
    pointer: InternalRegionPointer
  ): { start: number; end: number } {
    return this.absoluteRanges.get(pointer)!;
  }

  private insertWithin(parent: InternalRegionPointer, newRegion: NewRegion) {
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
    targetParent: InternalRegionPointer,
    targetPrevious: InternalRegionPointer | undefined,
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
    targetParent: InternalRegionPointer,
    targetPrevious: InternalRegionPointer | undefined,
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
    targetParent: InternalRegionPointer,
    targetPrevious: InternalRegionPointer | undefined,
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
    targetParent: InternalRegionPointer,
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

  private adjustStartRelativeTo(
    subject: InternalRegionPointer,
    absoluteBasis: number
  ) {
    this.getRegion(subject).start =
      this.getAbsolute(subject).start - absoluteBasis;
  }

  private adjustEndRelativeTo(
    subject: InternalRegionPointer,
    absoluteBasis: number
  ) {
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
  // "as" means we're in an import or export context, ":" means object
  // shorthand, false is a plain identifier with no shorthand.
  shorthand: "as" | ":" | false;
}

export class RegionEditor {
  private dispositions: (
    | {
        state: "unchanged";
      }
    | { state: "removed" }
    | { state: "replaced"; replacement: string }
  )[];

  private cursor = 0;
  private output: string[] = [];

  constructor(
    private src: string,
    private regions: CodeRegion[],
    private topRegion: RegionPointer | undefined
  ) {
    this.dispositions = regions.map(() => ({
      state: "unchanged",
    }));
  }
  replace(region: RegionPointer, replacement: string): void {
    this.dispositions[region] = { state: "replaced", replacement };
  }
  serialize(): string {
    debugger;
    if (this.regions.length === 0) {
      return this.src;
    }
    this.cursor = 0;
    this.output = [];
    this.forAllSiblings(this.topRegion, (region) => {
      this.innerSerialize(region);
    });
    this.output.push(this.src.slice(this.cursor));
    return this.output.join("");
  }

  private innerSerialize(regionPointer: RegionPointer) {
    let region = this.regions[regionPointer];

    // we're responsible for emitting the piece of our parent that falls before
    // us and after the previous child.
    this.output.push(this.src.slice(this.cursor, this.cursor + region.start));
    this.cursor += region.start;

    let disposition = this.dispositions[regionPointer];
    switch (disposition.state) {
      case "removed":
        this.skip(regionPointer);
        break;
      case "replaced":
        this.skip(regionPointer);
        this.output.push(disposition.replacement);
        break;
      case "unchanged":
        if (region.firstChild != null) {
          this.forAllSiblings(region.firstChild, (r) => this.innerSerialize(r));
        }
        this.output.push(this.src.slice(this.cursor, this.cursor + region.end));
        this.cursor += region.end;
        break;
      default:
        throw assertNever(disposition);
    }
  }

  private skip(regionPointer: RegionPointer) {
    let region = this.regions[regionPointer];
    if (region.firstChild != null) {
      this.forAllSiblings(region.firstChild, (r) => this.skip(r));
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
