import { transform } from "@babel/core";
import { NodePath } from "@babel/traverse";
import { StringLiteral } from "@babel/types";
import { createPatch } from "diff";

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
  let parsedActual = standardize(actual)!;
  let parsedExpected = standardize(expected)!;
  let msg: string = "code is not equal.";
  //@ts-ignore this is just a check to see if we are in nodejs
  if (typeof window === "undefined") {
    msg = `${msg}
${createPatch("", parsedExpected, parsedActual)
  .split("\n")
  .slice(4)
  .join("\n")}`;
  }

  this.pushResult({
    result: parsedActual === parsedExpected,
    actual,
    expected,
    message: message ?? msg,
  });
}

export {};
