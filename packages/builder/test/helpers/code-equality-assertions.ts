import { transform } from "@babel/core";
import { NodePath } from "@babel/traverse";
import { StringLiteral } from "@babel/types";

declare global {
  interface Assert {
    codeEqual: typeof codeEqual;
  }
}

QUnit.assert.codeEqual = codeEqual;

function standardizePlugin() {
  const visitor = {
    // all string literals switch to single quotes
    StringLiteral(path: NodePath<StringLiteral & { extra: { raw: string } }>) {
      path.node.extra = Object.assign({}, path.node.extra);
      path.node.extra.raw = `'${path.node.extra.raw.slice(1, -1)}'`;
      path.replaceWith(path.node);
    },
  };
  return { visitor };
}

function standardize(code: string) {
  return transform(code, { plugins: [standardizePlugin] })!.code;
}

function codeEqual(
  this: Assert,
  actual: string,
  expected: string,
  message?: string
) {
  this.pushResult({
    result: standardize(actual) === standardize(expected),
    actual: actual,
    expected: expected,
    message: message ?? "Unexpected source code",
  });
}

export {};
