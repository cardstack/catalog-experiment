import { default as createMathOperation } from "./dist/0.js";


/**
 * Subtract two numbers.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {number} minuend The first number in a subtraction.
 * @param {number} subtrahend The second number in a subtraction.
 * @returns {number} Returns the difference.
 * @example
 *
 * _.subtract(6, 4);
 * // => 2
 */

var subtract = createMathOperation(function (minuend, subtrahend) {
  return minuend - subtrahend;
}, 0);

export { subtract as default };
/*====catalogjs annotation start====
lZGVwqsuL2Rpc3QvMC5qcwHCwIGnZGVmYXVsdJShbKhzdWJ0cmFjdArAkZMKwMCCs2NyZWF0ZU1hdGhPcGVyYXRpb26boWmQwgLAkgMEwADAp2RlZmF1bHSQqHN1YnRyYWN0m6FskbNjcmVhdGVNYXRoT3BlcmF0aW9uwgYJkgcIwMDAwJGzY3JlYXRlTWF0aE9wZXJhdGlvbpuWAAABwMLDlgAWAgXCwpYJAAPAwsKWCxPAwMLClgATwMDCwpbNAUABBgrCwpYEAAfAwsKWAAjACcLClgkIwMDCwpYDRgTAwsKWAg4IwMLC
====catalogjs annotation end====*/