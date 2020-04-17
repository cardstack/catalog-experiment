import "qunit";
import { Memoize } from "typescript-memoize";
import { FileSystem } from "../src/filesystem";
import { join } from "../src/path";

export interface Scenario {
  [file: string]: string;
}

export interface FileAssert extends Assert {
  setupFiles(scenario: Scenario, basePath?: string): Promise<void>;
  readonly fs: FileSystem;
  readonly basePath: string;
  file(path: string): BoundFileAssert;
}

type ContentsResult =
  | { result: true; data: string }
  | { result: false; actual: any; expected: any; message: string };

export class BoundFileAssert {
  constructor(readonly path: string, private assert: FileAssert) {}

  get basePath() {
    return this.assert.basePath;
  }

  @Memoize()
  get fullPath() {
    let path = this.path;
    if (this.assert.basePath) {
      path = join(this.assert.basePath, path);
    }
    return path;
  }

  @Memoize()
  protected async contents(): Promise<ContentsResult> {
    try {
      let fd = await this.assert.fs.open(this.fullPath);
      let data = await fd.readText();
      return {
        result: true,
        data,
      };
    } catch (err) {
      if (err.code !== "NOT_FOUND") {
        throw err;
      }
      return {
        result: false,
        actual: "file missing",
        expected: "file present",
        message: `${this.path} should exist`,
      };
    }
  }

  async exists(message?: string) {
    let result = await exists(this.assert.fs, this.fullPath);
    this.assert.pushResult({
      result,
      actual: "file missing",
      expected: "file present",
      message: message || `${this.path} should exist`,
    });
  }

  async doesNotExist(message?: string) {
    let result = await exists(this.assert.fs, this.fullPath);
    this.assert.pushResult({
      result: !result,
      actual: "file present",
      expected: "file missing",
      message: message || `${this.path} should not exist`,
    });
  }

  private async doMatch(
    pattern: string | RegExp,
    message: string | undefined,
    invert: boolean
  ) {
    let contents = await this.contents();
    if (!contents.result) {
      this.assert.pushResult(contents);
    } else {
      let result;
      if (typeof pattern === "string") {
        result = contents.data.indexOf(pattern) !== -1;
      } else {
        result = pattern.test(contents.data);
      }
      if (invert) {
        result = !result;
      }
      this.assert.pushResult({
        result,
        actual: contents.data,
        expected: pattern.toString(),
        message:
          message ||
          (result
            ? `${this.path} has expected contents`
            : `${this.path} contents unexpected`),
      });
    }
  }

  async matches(pattern: string | RegExp, message?: string): Promise<void> {
    await this.doMatch(pattern, message, false);
  }
  async doesNotMatch(
    pattern: string | RegExp,
    message?: string
  ): Promise<void> {
    await this.doMatch(pattern, message, true);
  }
}

export interface FileHooks {
  before(fn: (assert: FileAssert) => void | Promise<void>): void;
  beforeEach(fn: (assert: FileAssert) => void | Promise<void>): void;
  afterEach(fn: (assert: FileAssert) => void | Promise<void>): void;
  after(fn: (assert: FileAssert) => void | Promise<void>): void;
}

function fileTest(
  name: string,
  definition: (assert: FileAssert) => void | Promise<void>
) {
  QUnit.test(name, function (plainAssert: Assert) {
    return definition(plainAssert as FileAssert);
  });
}

function fileOnly(
  name: string,
  definition: (assert: FileAssert) => void | Promise<void>
) {
  QUnit.only(name, function (plainAssert: Assert) {
    return definition(plainAssert as FileAssert);
  });
}

interface FileTest {
  (
    name: string,
    definition: (assert: FileAssert) => void | Promise<void>
  ): void;
  skip(
    name: string,
    definition: (assert: FileAssert) => void | Promise<void>
  ): void;
}

fileTest.skip = fileSkip;

function fileSkip(
  name: string,
  definition: (assert: FileAssert) => void | Promise<void>
) {
  QUnit.skip(name, function (plainAssert: Assert) {
    return definition(plainAssert as FileAssert);
  });
}

function makeBoundFile(this: FileAssert, path: string) {
  return new BoundFileAssert(path, this);
}

export function installFileAssertions(hooks: NestedHooks) {
  let basePath = "/";
  let fs = new FileSystem();

  async function setupFiles(scenario: Scenario, b = "/"): Promise<void> {
    basePath = b;
    await fs.remove(basePath);
    for (let [path, text] of Object.entries(scenario)) {
      let file = await fs.open(join(basePath, path), "file");
      file.write(text);
    }
  }

  function installAssertions(plainAssert: Assert) {
    let assert = plainAssert as FileAssert;
    if (!assert.hasOwnProperty("fs")) {
      Object.defineProperty(assert, "fs", {
        get() {
          return fs;
        },
      });
      Object.defineProperty(assert, "basePath", {
        get() {
          return basePath;
        },
      });
    }
    assert.file = makeBoundFile;
    assert.setupFiles = setupFiles;
  }

  // we need "before" if we want to be available in the user's "before" hook.
  // But we also need "beforeEach" because there's a new assert instance for
  // each test.
  hooks.before(installAssertions);
  hooks.beforeEach(installAssertions);

  return {
    test: fileTest as FileTest,
    only: fileOnly,
    skip: fileSkip,
    hooks: hooks as FileHooks,
  };
}
async function exists(fs: FileSystem, path: string): Promise<boolean> {
  try {
    await fs.open(path);
    return true;
  } catch (err) {
    if (err.code === "NOT_FOUND") {
      return false;
    }
    throw err;
  }
}
