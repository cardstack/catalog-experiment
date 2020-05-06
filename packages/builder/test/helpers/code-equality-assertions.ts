import { parse } from "@babel/core";
import generate from "@babel/generator";

declare global {
  interface Assert {
    codeEqual: typeof codeEqual;
  }
}

QUnit.assert.codeEqual = codeEqual;

function codeEqual(
  this: Assert,
  actual: string,
  expected: string,
  message?: string
) {
  this.pushResult({
    result: generate(parse(actual)!).code === generate(parse(expected)!).code,
    actual: actual,
    expected: expected,
    message: message ?? "Unexpected source code",
  });
}

export {};
