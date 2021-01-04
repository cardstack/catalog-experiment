import { RegionEditor, RegionPointer } from "./code-region";
import { DependencyResolver } from "./dependency-resolution";
import { log } from "./logger";
import { Editor } from "./module-rewriter";
import { BundleAssignment } from "./nodes/bundle";
import {
  makeNonCyclic,
  ModuleResolution,
  Resolution,
} from "./nodes/resolution";
import { setDoubleNestedMapping } from "./utils";

export type CodeRegionTask = (
  bundle: URL,
  module: Resolution,
  pointer: RegionPointer,
  editor: RegionEditor,
  editors: Editor[],
  ownAssignments: BundleAssignment[],
  depResolver: DependencyResolver,
  visitedRegions: Map<string, Map<RegionPointer, RegionEditor>>,
  addTask: TaskAdder,
  addNewEditor: EditorAdder,
  watchDog: Map<string, Map<RegionPointer, number>>
) => void;

export type TaskAdder = (
  module: Resolution,
  pointer: RegionPointer,
  editor: RegionEditor
) => void;
export type EditorAdder = (
  moduleForNewEditor: Resolution,
  insertBefore: RegionEditor
) => RegionEditor;

interface Work {
  module: Resolution;
  pointer: RegionPointer;
  editor: RegionEditor;
}

export class CodeRegionWorker {
  readonly editors: Editor[];
  private stack: Work[] = [];
  private stackIndex: Map<string, Map<RegionPointer, RegionEditor>> = new Map();
  private watchDog: Map<string, Map<RegionPointer, number>> = new Map();
  private visitedRegions: Map<
    string,
    Map<RegionPointer, RegionEditor>
  > = new Map();
  constructor(
    private bundle: URL,
    private ownAssignments: BundleAssignment[],
    private resolutionsInDepOrder: Resolution[],
    private depResolver: DependencyResolver,
    private task: CodeRegionTask
  ) {
    this.editors = resolutionsInDepOrder.map((m) => ({
      module: makeNonCyclic(m),
      editor: new RegionEditor(makeNonCyclic(m).source, m.desc, this.bundle),
      sideEffectDeclarations: new Set(),
    }));
  }

  addWork(module: ModuleResolution, pointer: RegionPointer) {
    // use an existing editor if there is one
    let editor = this.editors.find((e) => e.module.url.href === module.url.href)
      ?.editor;
    if (!editor) {
      // otherwise create a new editor and insert it before its consumers
      editor = new RegionEditor(module.source, module.desc, this.bundle);
      let editorAbsoluteIndex = this.resolutionsInDepOrder.findIndex(
        (m) => m.url.href === module.url.href
      );
      let index = this.editors.length;
      while (index > 0) {
        if (
          this.resolutionsInDepOrder.findIndex(
            (m) => m.url.href === this.editors[index - 1].module.url.href
          ) < editorAbsoluteIndex
        ) {
          break;
        }
        index--;
      }
      this.editors.splice(index, 0, {
        module,
        editor,
        sideEffectDeclarations: new Set(),
      });
    }
    this.stack.push({ module, pointer, editor });
  }

  performWork() {
    let count = 0;
    while (this.stack.length > 0) {
      let { module, pointer, editor } = this.stack.shift()!;
      this.stackIndex.get(module.url.href)?.delete(pointer);
      let watchDogCount = this.watchDog.get(module.url.href)?.get(pointer) ?? 0;
      if (typeof process?.stdout?.write === "function") {
        process.stdout.write(
          `  visited ${++count} regions, editors size: ${
            this.editors.length
          }, stack size: ${String(this.stack.length).padStart(
            8,
            " "
          )}, revisit count ${String(watchDogCount).padStart(
            6,
            " "
          )} for bundle ${this.bundle.href}\r`
        );
      }
      if (watchDogCount > 0) {
        setDoubleNestedMapping(
          module.url.href,
          pointer,
          --watchDogCount,
          this.watchDog
        );
      }

      this.task(
        this.bundle,
        module,
        pointer,
        editor,
        this.editors,
        this.ownAssignments,
        this.depResolver,
        this.visitedRegions,
        this.addTask.bind(this),
        this.addNewEditor.bind(this),
        this.watchDog
      );
    }
    if (typeof process?.stdout?.write === "function") {
      console.log();
    } else {
      log(`  visited ${count} regions for bundle ${this.bundle.href}`);
    }
  }

  private addTask(
    module: Resolution,
    pointer: RegionPointer,
    editor: RegionEditor
  ) {
    // coalesce work in the stack so that if there is already work for
    // this consumption point, we only retain the one with the earliest editor
    let pendingWorkEditor = this.stackIndex.get(module.url.href)?.get(pointer);
    if (pendingWorkEditor) {
      let pendingEditorIndex = this.editors.findIndex(
        ({ editor: e }) => e === pendingWorkEditor
      );
      let newWorkEditorIndex = this.editors.findIndex(
        ({ editor: e }) => e === editor
      );
      if (pendingEditorIndex === newWorkEditorIndex) {
        return;
      } else if (pendingEditorIndex < newWorkEditorIndex) {
        pendingWorkEditor.mergeWith(editor);
        return;
      } else {
        let stackIndex = this.stack.findIndex(
          ({ editor: e }) => pendingWorkEditor === e
        );
        editor.mergeWith(pendingWorkEditor);
        this.stack[stackIndex].editor = editor;
        setDoubleNestedMapping(
          module.url.href,
          pointer,
          editor,
          this.stackIndex
        );
      }
    } else {
      this.stack.unshift({ module, pointer, editor });
      setDoubleNestedMapping(module.url.href, pointer, editor, this.stackIndex);
    }
  }

  // we use the resolutionsInDepOrder as our guide here. we'll always
  // honor inserting the new editor before the "insertBefore", but we may opt to
  // hoist the new editor even higher if we see that it occurs before other
  // editors that are before the insertBefore module.
  addNewEditor(
    moduleForNewEditor: Resolution,
    insertBefore: RegionEditor
  ): RegionEditor {
    let nonCyclicModule = makeNonCyclic(moduleForNewEditor);
    let newEditor = new RegionEditor(
      nonCyclicModule.source,
      moduleForNewEditor.desc,
      this.bundle
    );
    let insertBeforeIndex = this.editors.findIndex(
      (e) => e.editor === insertBefore
    );
    let priorEditors = this.editors.slice(0, insertBeforeIndex);
    let ourEditor = priorEditors.findIndex(
      (e) => e.module.url.href === moduleForNewEditor.url.href
    );
    // if an editor for our module already exists before the editor we are
    // inserting before then just use that one.
    if (ourEditor !== -1) {
      return this.editors[ourEditor].editor;
    }

    // otherwise use the resolutionsInDepOrder as a guide to insert our editor
    let originalPosition = this.resolutionsInDepOrder.findIndex(
      (m) => m.url.href === moduleForNewEditor.url.href
    );
    let antecedantModules = this.resolutionsInDepOrder
      .slice(originalPosition + 1)
      .map((m) => m.url.href);
    let antecedantEditorIndices = priorEditors
      .filter(({ module }) => antecedantModules.includes(module.url.href))
      .map((e) => this.editors.findIndex((e1) => e === e1))
      .sort();
    let newIndex: number;
    if (antecedantEditorIndices.length > 0) {
      newIndex = antecedantEditorIndices.shift()!;
    } else {
      newIndex = insertBeforeIndex;
    }

    this.editors.splice(newIndex, 0, {
      module: nonCyclicModule,
      editor: newEditor,
      sideEffectDeclarations: new Set(),
    });
    return newEditor;
  }
}
