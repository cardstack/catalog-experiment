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

export { add as default };
/*====catalogjs annotation start====
lZGVwqsuL2Rpc3QvMC5qcwHCwIGnZGVmYXVsdJShbKNhZGQKwJGTCsDAgrNjcmVhdGVNYXRoT3BlcmF0aW9um6FpkMICwJIDBMAAwKdkZWZhdWx0kKNhZGSboWyRs2NyZWF0ZU1hdGhPcGVyYXRpb27CBgmSBwjAwMDAkbNjcmVhdGVNYXRoT3BlcmF0aW9um5YAAAHAwsOWABYCBcLClgkAA8DCwpYLE8DAwsKWABPAwMLCls0BKgEGCsLClgQAB8DCwpYAA8AJwsKWCQPAwMLClgM8BMDCwpYCDgjAwsI=
====catalogjs annotation end====*/