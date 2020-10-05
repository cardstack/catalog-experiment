import { default as createMathOperation } from "./dist/0.js";


/**
 * Adds two numbers.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {number} augend The first number in an addition.
 * @param {number} addend The second number in an addition.
 * @returns {number} Returns the total.
 * @example
 *
 * _.add(6, 4);
 * // => 10
 */

var add = createMathOperation(function (augend, addend) {
  return augend + addend;
}, 0);
const _default = (add);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqsuL2Rpc3QvMC5qcwGBp2RlZmF1bHSUoWyoX2RlZmF1bHQOwJGTDsDCg7NjcmVhdGVNYXRoT3BlcmF0aW9um6FpkMICwJIDBMAAwKdkZWZhdWx0kKNhZGSboWyRs2NyZWF0ZU1hdGhPcGVyYXRpb27CBgmSBwjAwMDAkbNjcmVhdGVNYXRoT3BlcmF0aW9uqF9kZWZhdWx0m6FskaNhZGTCC8CSDA3AwMDAkJ+WAAABwMLDlgAWAgXCwpYJAAPAwsKWCxPAwMLClgATwMDCwpbNASoBBgrCwpYEAAfAwsKWAAPACcLClgQDwMDCwpYDPATAwsKWAQELDsLClgYBDMDCwpYACMAIwsKWCQjAwMLClgEODcDCwg==
====catalogjs annotation end====*/