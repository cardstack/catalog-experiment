// The purpose of a CodeRegion is to mark a region of source code that we may be
// able to remove or replace. CodeRegions form a hierarchy, and by convention if
// all the child regions of a region are removed, the region itself must be
// removed.

import { NodePath } from "@babel/traverse";
import { assertNever } from "shared/util";

export type RegionPointer = number;

export class RegionBuilder {
  regions: CodeRegion[] = [];
  top: RegionPointer = 0;
  private absoluteRanges: Map<
    number,
    { start: number; end: number }
  > = new Map();

  createCodeRegion(path: NodePath): RegionPointer {
    let { start, end } = path.node;
    if (start == null || end == null) {
      throw new Error(
        `bug: do not know how to create code region for ${path.node.type}: missing start/end character positions`
      );
    }
    let index = this.regions.length;
    this.absoluteRanges.set(index, { start, end });

    if (this.regions.length === 0) {
      // special case for the very first region created
      let newRegion: CodeRegion = {
        start: start,
        end: end - start,
        parent: undefined,
        firstChild: undefined,
        nextSibling: undefined,
        shorthand: false,
      };
      this.regions.push(newRegion);
    } else {
      this.insert(index, start, end, path, this.top);
    }
    return index;
  }

  private insert(
    index: number,
    start: number,
    end: number,
    path: NodePath,
    initialCandidate: RegionPointer
  ) {
    let candidatePointer: RegionPointer | undefined = initialCandidate;
    let candidate: CodeRegion | undefined = this.regions[candidatePointer];
    let firstTime = true;

    while (candidatePointer != null && candidate) {
      let {
        start: candidateStart,
        end: candidateEnd,
      } = this.absoluteRanges.get(candidatePointer)!;

      if (firstTime) {
        if (end <= candidateStart) {
          // we come before the very first candidate
          if (candidate.parent != null) {
            let newRegion: CodeRegion = {
              start: start - this.absoluteRanges.get(candidate.parent)!.start,
              end: end - start,
              parent: candidate.parent,
              firstChild: undefined,
              nextSibling: candidatePointer,
              shorthand: false,
            };
            this.regions.push(newRegion);
            let parentRegion = this.regions[candidate.parent];
            parentRegion.firstChild = index;
          } else {
            let newRegion: CodeRegion = {
              start,
              end: end - start,
              parent: undefined,
              firstChild: undefined,
              nextSibling: candidatePointer,
              shorthand: false,
            };
            this.regions.push(newRegion);
            this.top = index;
          }
          candidate.start -= end - start;
        }
        firstTime = false;
      }

      // first we're checking to see if we are enclosed in this candidate
      if (
        candidateStart <= start &&
        start < candidateEnd &&
        end <= candidateEnd &&
        candidateStart < end
      ) {
        // we fit entirely inside the candidate
        if (candidate.firstChild != null) {
          // find my place among existing children
          this.insert(index, start, end, path, candidate.firstChild);
        } else {
          // i am the first child to be created
          let newRegion: CodeRegion = {
            start: start - candidateStart,
            end: end - start,
            parent: candidatePointer,
            firstChild: undefined,
            nextSibling: undefined,
            shorthand: false,
          };
          this.regions.push(newRegion);
          candidate.end -= newRegion.end;
          candidate.firstChild = index;
        }
        return;
      }

      // next check if we come after the candidate but before
      // candidate.nextSibling (if any).
      if (
        candidateEnd <= start &&
        (!candidate.nextSibling ||
          end <= this.absoluteRanges.get(candidate.nextSibling)!.start)
      ) {
        // insert after the candidate
        let newRegion: CodeRegion = {
          start: start - candidateEnd,
          end: end - start,
          parent: candidate.parent,
          firstChild: undefined,
          nextSibling: undefined,
          shorthand: false,
        };
        this.regions.push(newRegion);
        if (candidate.nextSibling != null) {
          newRegion.nextSibling = candidate.nextSibling;
          let nextSiblingRegion = this.regions[candidate.nextSibling];
          nextSiblingRegion.start -= newRegion.end + newRegion.start;
        } else if (candidate.parent != null) {
          let parentRegion = this.regions[candidate.parent];
          parentRegion.end -= newRegion.end;
        }
        candidate.nextSibling = index;
        return;
      }

      candidatePointer = candidate.nextSibling;
      if (candidatePointer != null) {
        candidate = this.regions[candidatePointer];
      } else {
        candidate = undefined;
      }
    }
    // if we get here, we didn't find a candidate to hold us
  }
}

export interface CodeRegion {
  // starting position relative to start of previousSibling, or start of parent
  // when no previousSibling.
  start: number;

  // ending position relative to the last child's end, or relative to our start
  // if no children
  end: number;

  parent: RegionPointer | undefined;
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
    private topRegion: RegionPointer
  ) {
    this.dispositions = regions.map(() => ({
      state: "unchanged",
    }));
  }
  replace(region: RegionPointer, replacement: string): void {
    this.dispositions[region] = { state: "replaced", replacement };
  }
  serialize(): string {
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
        if (region.firstChild) {
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
    if (region.firstChild) {
      this.forAllSiblings(region.firstChild, (r) => this.skip(r));
    }
    this.cursor += region.end;
  }

  private forAllSiblings(
    regionPointer: RegionPointer,
    fn: (r: RegionPointer) => void
  ) {
    let current: number | undefined = regionPointer;
    while (current != null) {
      fn(current);
      current = this.regions[current].nextSibling;
    }
  }
}
