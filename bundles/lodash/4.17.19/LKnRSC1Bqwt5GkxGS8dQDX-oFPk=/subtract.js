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
const _default = (subtract);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqsuL2Rpc3QvMC5qcwGBp2RlZmF1bHSUoWyoX2RlZmF1bHQOwJGTDsDCg7NjcmVhdGVNYXRoT3BlcmF0aW9um6FpkMICwJIDBMAAwKdkZWZhdWx0kKhzdWJ0cmFjdJuhbJGzY3JlYXRlTWF0aE9wZXJhdGlvbsIGCZIHCMDAwMCRs2NyZWF0ZU1hdGhPcGVyYXRpb26oX2RlZmF1bHSboWyRqHN1YnRyYWN0wgvAkgwNwMDAwJCflgAAAcDCw5YAFgIFwsKWCQADwMLClgsTwMDCwpYAE8DAwsKWzQFAAQYKwsKWBAAHwMLClgAIwAnCwpYECMDAwsKWA0YEwMLClgEBCw7CwpYGAQzAwsKWAAjACMLClgkIwMDCwpYBDg3AwsI=
====catalogjs annotation end====*/