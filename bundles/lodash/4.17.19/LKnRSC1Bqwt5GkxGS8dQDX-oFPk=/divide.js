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
const _default = (divide);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqsuL2Rpc3QvMC5qcwGBp2RlZmF1bHSUoWyoX2RlZmF1bHQOwJGTDsDCg7NjcmVhdGVNYXRoT3BlcmF0aW9um6FpkMICwJIDBMAAwKdkZWZhdWx0kKZkaXZpZGWboWyRs2NyZWF0ZU1hdGhPcGVyYXRpb27CBgmSBwjAwMDAkbNjcmVhdGVNYXRoT3BlcmF0aW9uqF9kZWZhdWx0m6FskaZkaXZpZGXCC8CSDA3AwMDAkJ+WAAABwMLDlgAWAgXCwpYJAAPAwsKWCxPAwMLClgATwMDCwpbNATQBBgrCwpYEAAfAwsKWAAbACcLClgQGwMDCwpYDQgTAwsKWAQELDsLClgYBDMDCwpYACMAIwsKWCQjAwMLClgEODcDCwg==
====catalogjs annotation end====*/