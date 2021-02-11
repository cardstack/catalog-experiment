import { assertNever } from "@catalogjs/shared/util";
import { FileDescription, isModuleDescription } from "./describe-file";
import cloneDeep from "lodash/cloneDeep";
import {
  RegionPointer,
  CodeRegion,
  visitCodeRegions,
  documentPointer,
  GeneralCodeRegion,
  DeclarationCodeRegion,
  ReferenceCodeRegion,
  isReferenceCodeRegion,
  isGeneralCodeRegion,
  isDeclarationCodeRegion,
  isImportCodeRegion,
} from "./code-region";

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

interface OutputRegion {
  region: CodeRegion;
  originalPointer: RegionPointer | undefined;
}

export class RegionEditor {
  readonly dispositions: Disposition[];

  private pendingGap: { withinParent: RegionPointer; gap: number } | undefined;
  private pendingGapDeletion:
    | { withinParent: RegionPointer; gapDeletion: number }
    | undefined;
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

  constructor(
    private src: string,
    private desc: FileDescription,
    private moduleHref: string
  ) {
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

  mergeWith(...editors: RegionEditor[]) {
    if (
      editors.some((e) => e.dispositions.length !== this.dispositions.length)
    ) {
      throw new Error(`cannot merge editors that have different regions`);
    }
    for (let [pointer] of this.regions.entries()) {
      let dispositions = editors.map((e) => e.dispositions[pointer]);
      if (dispositions.every((d) => d.state === "removed")) {
        continue;
      }
      let disposition = dispositions.find((d) => d.state !== "removed")!;
      this.dispositions[pointer] = { ...disposition };
    }
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
    visitCodeRegions(this.regions, (_, p) => this.removeRegion(p), pointer);
  }

  keepRegion(pointer: RegionPointer) {
    if (this.dispositions[pointer].state === "removed") {
      this.dispositions[pointer] = { state: "unchanged", region: pointer };
    }
  }

  private keepRegionAndItsChildren(pointer: RegionPointer) {
    visitCodeRegions(
      this.regions,
      (_, p) => {
        if (this.dispositions[p].state === "removed") {
          this.dispositions[p] = { state: "unchanged", region: p };
        }
      },
      pointer
    );
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

  serialize(): {
    code: string;
    regions: CodeRegion[];
    regionMapping: Map<RegionPointer, RegionPointer>;
  } {
    let regionMapping = new Map();
    if (this.regions.length === 0) {
      return { code: this.src, regions: [], regionMapping };
    }

    this.cursor = 0;
    this.pendingGap = undefined;
    this.pendingStart = undefined;
    this.outputCode = [];
    this.outputRegions = [];
    this.pruneRegions();
    this.innerSerialize(documentPointer);

    let newRegions = remapRegions([...this.outputRegions]);
    for (let [
      newPointer,
      { originalPointer },
    ] of this.outputRegions.entries()) {
      regionMapping.set(originalPointer, newPointer);
    }
    if (newRegions.length === 0) {
      return { code: "", regions: [], regionMapping };
    } else {
      let newCode = this.outputCode.join("");
      assignCodeRegionPositions(newRegions);
      trimLeading(newRegions, newCode);
      trimTrailing(newRegions, newCode);
      return {
        code: newCode.trim(),
        regions: newRegions,
        regionMapping,
      };
    }
  }

  // document regions act as "glue" so that they can establish a structure for
  // their child regions such that when we start removing regions we aren't left
  // with ambiguous relationships and order amongst the remaining children.
  // However, if the document region has no children, then there is no reason
  // for it to exist any longer.
  private pruneRegions(
    pointer: RegionPointer = documentPointer,
    retainedNonDocumentRegions: RegionPointer[] = []
  ): RegionPointer[] {
    let region = this.regions[pointer];
    if (
      region.type !== "document" &&
      this.dispositions[pointer].state !== "removed"
    ) {
      retainedNonDocumentRegions = [...retainedNonDocumentRegions, pointer];
    } else if (region.type === "document") {
      retainedNonDocumentRegions = [];
    }

    if (region.firstChild != null) {
      retainedNonDocumentRegions = [
        ...this.pruneRegions(region.firstChild, retainedNonDocumentRegions),
      ];
    }
    if (
      region.type === "document" &&
      retainedNonDocumentRegions.length === 0 &&
      pointer !== documentPointer
    ) {
      this.dispositions[pointer] = { state: "removed", region: pointer };
    }
    if (region.nextSibling != null) {
      retainedNonDocumentRegions = [
        ...retainedNonDocumentRegions,
        ...this.pruneRegions(region.nextSibling),
      ];
    }
    return retainedNonDocumentRegions;
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
        // when we remove a region then the next region in this subgraph that is output will
        // inherit this region's start
        this.emitPendingStart(parentPointer, regionPointer);
        if (region.firstChild != null) {
          this.forAllSiblings(region.firstChild, (r) => {
            let childRegion = this.regions[r];
            // we need to manufacture a reasonable gap here, as we are skipping
            // over parent regions that we are intentionally not emitting
            if (
              this.outputCode.join("").trim().length > 0 &&
              !Boolean(this.outputCode.slice(-1)[0]?.slice(-1).match(/\s/))
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
        this.absorbPendingGap(outputRegion, true);
        this.absorbPendingGapDeletion(outputRegion, true);
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
        this.absorbPendingGap(outputRegion, true);
        this.absorbPendingGapDeletion(outputRegion, true);
        gap = this.absorbPendingStart(outputRegion);
        if (region.firstChild != null) {
          let childRegion: CodeRegion;
          let childDispositions: Disposition[] = [];
          let isLastChildGapRemoved: boolean;
          this.forAllSiblings(region.firstChild, (r) => {
            childRegion = this.regions[r];
            let gapIndex = this.outputCode.length;
            let gapString = this.src.slice(
              this.cursor,
              this.cursor + childRegion.start
            );

            // collapse unnecessary whitespace
            if (
              region.type === "document" &&
              gapString.length > 1 &&
              gapString.match(/^\s+$/)
            ) {
              let collapseSize = Boolean(
                this.outputCode.slice(-1)[0]?.slice(-1).match(/\s/)
              )
                ? gapString.length
                : gapString.length - 1;
              this.emitPendingGapDeletion(regionPointer, collapseSize);
              if (gapString.length > collapseSize) {
                this.outputCode.push("\n");
              }
            } else {
              this.outputCode.push(gapString);
            }

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
            if (
              childOutputPointer != null &&
              !isLastChildGapRemoved &&
              (region.type === "document" ||
                (region.type === "general" && region.preserveGaps))
            ) {
              this.outputRegions[childOutputPointer].region.start += childGap;
            }
            childDispositions.push(disposition);
          });
          this.absorbPendingGap(outputRegion);
          this.absorbPendingGapDeletion(outputRegion);
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
      position: 0,
      dependsOn: new Set([
        referencePointer,
        declarationPointer,
        sideEffectPointer,
      ]),
      preserveGaps: false,
      declaration: {
        type: "local",
        source: this.moduleHref,
        declaredName: name,
        declaratorOfRegion: declarationPointer,
        initializedBy: [],
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
    let retainedDependsOn = [...region.dependsOn].filter(
      (p) =>
        this.regions[p].type === "reference" &&
        !this.regions[p].dependsOn.has(regionPointer)
    );
    let sideEffectRegion: GeneralCodeRegion = {
      type: "general",
      start: 4, // " = ("
      end: region.end,
      firstChild: region.firstChild,
      nextSibling: undefined,
      position: 0,
      dependsOn: new Set([
        declaratorPointer,
        ...retainedDependsOn,
        ...(region.firstChild != null ? [region.firstChild] : []),
      ]),
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
      (parentRegion.type === "reference" ||
        (parentRegion.type === "general" && !parentRegion.preserveGaps)) &&
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
    } else {
      let prevSiblingPointer = this.regions.findIndex(
        (r) => r.nextSibling === regionPointer
      );
      let prevSibling = this.regions[prevSiblingPointer];
      if (
        prevSibling &&
        isGeneralCodeRegion(region) &&
        isImportCodeRegion(prevSibling) &&
        prevSibling.dependsOn.has(regionPointer) &&
        prevSibling.specifierForDynamicImport
      ) {
        let outputImportRegion = this.outputRegions.find(
          (o) => o.originalPointer === prevSiblingPointer
        );
        if (
          outputImportRegion &&
          isImportCodeRegion(outputImportRegion.region)
        ) {
          // we use JSON.parse to eliminate the wrapping quotes in the replacement string
          outputImportRegion.region.specifierForDynamicImport = JSON.parse(
            replacement
          );
        }
      }
    }

    if (
      !isReferenceCodeRegion(region) ||
      !isReferenceCodeRegion(outputRegion) ||
      !region.shorthand
    ) {
      outputRegion.end = replacement.length;
      this.outputRegions.push({
        originalPointer: regionPointer,
        region: outputRegion,
      });
      this.outputCode.push(replacement);
      return;
    }
    let original = this.src.slice(this.cursor, this.cursor + region.end);
    switch (region.shorthand) {
      case "import":
        outputRegion.start += 4 + original.length; // "original as "
        this.outputCode.push(original);
        this.outputCode.push(" as ");
        this.outputCode.push(replacement);
        break;
      case "object":
        outputRegion.start += 2 + original.length; // "original: "
        this.outputCode.push(original);
        this.outputCode.push(": ");
        this.outputCode.push(replacement);
        break;
      case "export":
        this.outputCode.push(replacement);
        this.outputCode.push(" as ");
        this.outputCode.push(original);
        // when we add a new gap, then the next region that is output will
        // have it's start adjusted by this amount
        this.emitPendingGap(
          parentPointer,
          4 + original.length /* " as original" */
        );
        break;
      default:
        throw assertNever(region.shorthand);
    }
    outputRegion.end = replacement.length;
    outputRegion.shorthand = false;
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
    let output: OutputRegion | undefined;
    let prevPointer: RegionPointer | undefined;
    let currentPointer = pointer;
    let isFirstChild = false;
    while (!output && prevPointer !== documentPointer) {
      output = this.outputRegions.find(
        ({ region }) =>
          region.firstChild === currentPointer ||
          region.nextSibling === currentPointer
      );
      if (output) {
        isFirstChild = output?.region?.firstChild === currentPointer;
        break;
      }
      prevPointer = currentPointer;
      currentPointer = this.regions.findIndex(
        (r) =>
          r.firstChild === currentPointer || r.nextSibling === currentPointer
      );
    }
    if (!output) {
      throw new Error(
        `cannot find output predecessor for the region pointer ${pointer}`
      );
    }

    return {
      originalPointer: output.originalPointer,
      outputRegion: output.region,
      isFirstChild,
      outputPointer: this.outputRegions.findIndex((o) => o === output),
    };
  }

  private absorbPendingGap(region: CodeRegion, insertBeforeRegion = false) {
    if (this.pendingGap && !insertBeforeRegion) {
      region.end += this.pendingGap.gap;
      this.pendingGap = undefined;
    } else if (this.pendingGap && insertBeforeRegion) {
      region.start += this.pendingGap.gap;
      this.pendingGap = undefined;
    }
  }

  private absorbPendingGapDeletion(
    region: CodeRegion,
    deleteBeforeRegion = false
  ) {
    if (this.pendingGapDeletion && deleteBeforeRegion) {
      if (region.start < this.pendingGapDeletion.gapDeletion) {
        throw new Error(
          `we have removed more whitespace than is accommodated for in the proceeding region`
        );
      }
      region.start -= this.pendingGapDeletion.gapDeletion;
      this.pendingGapDeletion = undefined;
    } else if (this.pendingGapDeletion && !deleteBeforeRegion) {
      if (region.end < this.pendingGapDeletion.gapDeletion) {
        throw new Error(
          `we have removed more whitespace than is accommodated for at the end of the region`
        );
      }
      region.end -= this.pendingGapDeletion.gapDeletion;
      this.pendingGapDeletion = undefined;
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
    } else if (this.pendingAntecedant.hasNextSiblingOf === pointer) {
      this.pendingAntecedant.hasNextSiblingOf = this.regions[
        pointer
      ].nextSibling;
    }
  }

  private emitPendingStart(
    parentPointer: RegionPointer,
    pointer: RegionPointer
  ) {
    let region = this.regions[pointer];
    let parentRegion = this.regions[parentPointer];
    let start = region.start;
    if (this.pendingStart == null && pointer !== documentPointer) {
      if (this.pendingGapDeletion) {
        if (start < this.pendingGapDeletion.gapDeletion) {
          throw new Error(
            `we have removed more whitespace than is accommodated for in the proceeding region (which is deleted ${pointer})`
          );
        }
        start -= this.pendingGapDeletion.gapDeletion;
        this.pendingGapDeletion = undefined;
      }
      this.pendingStart = { withinParent: parentPointer, start };
    } else if (
      this.pendingStart &&
      this.pendingStart.withinParent === parentPointer &&
      (parentRegion.type === "document" ||
        (parentRegion.type === "general" && parentRegion.preserveGaps))
    ) {
      if (this.pendingGapDeletion) {
        if (start < this.pendingGapDeletion.gapDeletion) {
          throw new Error(
            `we have removed more whitespace than is accommodated for in the proceeding region (which is deleted ${pointer})`
          );
        }
        start -= this.pendingGapDeletion.gapDeletion;
        this.pendingGapDeletion = undefined;
      }
      this.pendingStart.start += start;
    }
  }

  private emitPendingGap(parentPointer: RegionPointer, gap: number) {
    if (!this.pendingGap) {
      this.pendingGap = { withinParent: parentPointer, gap: 0 };
    }
    this.pendingGap.gap += gap;
  }

  private emitPendingGapDeletion(
    parentPointer: RegionPointer,
    gapDeletion: number
  ) {
    if (!this.pendingGapDeletion) {
      this.pendingGapDeletion = { withinParent: parentPointer, gapDeletion: 0 };
    }
    this.pendingGapDeletion.gapDeletion += gapDeletion;
  }

  private cancelPendingActions(pointer: RegionPointer) {
    if (this.pendingGapDeletion?.withinParent === pointer) {
      this.pendingGapDeletion = undefined;
    }
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

export function assignCodeRegionPositions(regions: CodeRegion[]) {
  let index = 0;
  visitCodeRegions(
    regions,
    (region) => (region.position = index++),
    documentPointer
  );
}

function remapRegions(outputRegions: OutputRegion[]): CodeRegion[] {
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
      if (region.declaration.type === "local") {
        region.declaration.initializedBy = region.declaration.initializedBy
          .map((p) => newPointer(p, outputRegions))
          .filter((p) => p != null) as RegionPointer[];
        region.declaration.declaratorOfRegion = newPointer(
          region.declaration.declaratorOfRegion,
          outputRegions
        );
      }
    }
    return region;
  });
  if (regions[documentPointer]?.firstChild != null) {
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
  if (regions.length === 0) {
    return 0;
  }

  if (remainingWhitespaceLength === code.length) {
    // collapse this to an empty doc
    regions.splice(0, regions.length);
    return 0;
  }

  if (remainingWhitespaceLength > 0) {
    let region = regions[pointer];
    if (region.start >= remainingWhitespaceLength) {
      region.start -= remainingWhitespaceLength;
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
      if (region.end >= remainingWhitespaceLength) {
        region.end -= remainingWhitespaceLength;
        return 0;
      } else {
        remainingWhitespaceLength -= region.end;
        region.end = 0;
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
function trimTrailing(
  regions: CodeRegion[],
  code: string,
  pointer: RegionPointer = documentPointer,
  remainingWhitespaceLength = code.match(/\s*$/)![0].length
): number {
  if (regions.length === 0) {
    return 0;
  }
  let region = regions[pointer];
  if (remainingWhitespaceLength > 0 && region.type === "document") {
    if (region.nextSibling != null) {
      remainingWhitespaceLength = trimTrailing(
        regions,
        code,
        region.nextSibling,
        remainingWhitespaceLength
      );
    }
    if (remainingWhitespaceLength > 0) {
      if (
        region.type === "document" &&
        region.end >= remainingWhitespaceLength
      ) {
        region.end -= remainingWhitespaceLength;
        return 0;
      } else {
        remainingWhitespaceLength -= region.end;
        region.end = 0;
        if (region.type === "document" && region.firstChild != null) {
          remainingWhitespaceLength = trimTrailing(
            regions,
            code,
            region.firstChild,
            remainingWhitespaceLength
          );
        }
        if (remainingWhitespaceLength > 0) {
          if (region.start >= remainingWhitespaceLength) {
            region.start -= remainingWhitespaceLength;
            return 0;
          } else {
            remainingWhitespaceLength -= region.start;
            region.start = 0;
          }
        }
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
  outputRegions: OutputRegion[],
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
