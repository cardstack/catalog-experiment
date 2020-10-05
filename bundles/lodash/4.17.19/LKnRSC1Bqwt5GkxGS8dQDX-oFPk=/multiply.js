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
const _default = (multiply);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqsuL2Rpc3QvMC5qcwGBp2RlZmF1bHSUoWyoX2RlZmF1bHQOwJGTDsDCg7NjcmVhdGVNYXRoT3BlcmF0aW9um6FpkMICwJIDBMAAwKdkZWZhdWx0kKhtdWx0aXBseZuhbJGzY3JlYXRlTWF0aE9wZXJhdGlvbsIGCZIHCMDAwMCRs2NyZWF0ZU1hdGhPcGVyYXRpb26oX2RlZmF1bHSboWyRqG11bHRpcGx5wgvAkgwNwMDAwJCflgAAAcDCw5YAFgIFwsKWCQADwMLClgsTwMDCwpYAE8DAwsKWzQFJAQYKwsKWBAAHwMLClgAIwAnCwpYECMDAwsKWA1AEwMLClgEBCw7CwpYGAQzAwsKWAAjACMLClgkIwMDCwpYBDg3AwsI=
====catalogjs annotation end====*/