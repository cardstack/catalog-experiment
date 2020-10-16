import { default as createRange } from "./dist/24.js";


/**
 * This method is like `_.range` except that it populates values in
 * descending order.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.range
 * @example
 *
 * _.rangeRight(4);
 * // => [3, 2, 1, 0]
 *
 * _.rangeRight(-4);
 * // => [-3, -2, -1, 0]
 *
 * _.rangeRight(1, 5);
 * // => [4, 3, 2, 1]
 *
 * _.rangeRight(0, 20, 5);
 * // => [15, 10, 5, 0]
 *
 * _.rangeRight(0, -4, -1);
 * // => [-3, -2, -1, 0]
 *
 * _.rangeRight(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.rangeRight(0);
 * // => []
 */

var rangeRight = createRange(true);

export { rangeRight as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMjQuanMBwsCBp2RlZmF1bHSUoWyqcmFuZ2VSaWdodArAkZMKwMCCq2NyZWF0ZVJhbmdlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKpyYW5nZVJpZ2h0m6FskatjcmVhdGVSYW5nZcIGCZIHCMDAwMCRq2NyZWF0ZVJhbmdlm5YAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWAAvAwMLCls0C8gEGCsLClgQAB8DCwpYACsAJwsKWCQrAwMLClgMGBMDCwpYCDgjAwsI=
====catalogjs annotation end====*/