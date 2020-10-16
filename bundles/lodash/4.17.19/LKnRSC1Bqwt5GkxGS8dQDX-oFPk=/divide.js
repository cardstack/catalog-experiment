import { default as createMathOperation } from "./dist/0.js";


/**
 * Divide two numbers.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Math
 * @param {number} dividend The first number in a division.
 * @param {number} divisor The second number in a division.
 * @returns {number} Returns the quotient.
 * @example
 *
 * _.divide(6, 4);
 * // => 1.5
 */

var divide = createMathOperation(function (dividend, divisor) {
  return dividend / divisor;
}, 1);

export { divide as default };
/*====catalogjs annotation start====
lZGVwqsuL2Rpc3QvMC5qcwHCwIGnZGVmYXVsdJShbKZkaXZpZGUKwJGTCsDAgrNjcmVhdGVNYXRoT3BlcmF0aW9um6FpkMICwJIDBMAAwKdkZWZhdWx0kKZkaXZpZGWboWyRs2NyZWF0ZU1hdGhPcGVyYXRpb27CBgmSBwjAwMDAkbNjcmVhdGVNYXRoT3BlcmF0aW9um5YAAAHAwsOWABYCBcLClgkAA8DCwpYLE8DAwsKWABPAwMLCls0BNAEGCsLClgQAB8DCwpYABsAJwsKWCQbAwMLClgNCBMDCwpYCDgjAwsI=
====catalogjs annotation end====*/