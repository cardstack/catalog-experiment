import { default as createMathOperation } from "./dist/0.js";


/**
 * Multiply two numbers.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Math
 * @param {number} multiplier The first number in a multiplication.
 * @param {number} multiplicand The second number in a multiplication.
 * @returns {number} Returns the product.
 * @example
 *
 * _.multiply(6, 4);
 * // => 24
 */

var multiply = createMathOperation(function (multiplier, multiplicand) {
  return multiplier * multiplicand;
}, 1);

export { multiply as default };
/*====catalogjs annotation start====
lZGVwqsuL2Rpc3QvMC5qcwHCwIGnZGVmYXVsdJShbKhtdWx0aXBseQrAkZMKwMCCs2NyZWF0ZU1hdGhPcGVyYXRpb26boWmQwgLAkgMEwADAp2RlZmF1bHSQqG11bHRpcGx5m6FskbNjcmVhdGVNYXRoT3BlcmF0aW9uwgYJkgcIwMDAwJGzY3JlYXRlTWF0aE9wZXJhdGlvbpuWAAABwMLDlgAWAgXCwpYJAAPAwsKWCxPAwMLClgATwMDCwpbNAUkBBgrCwpYEAAfAwsKWAAjACcLClgkIwMDCwpYDUATAwsKWAg4IwMLC
====catalogjs annotation end====*/