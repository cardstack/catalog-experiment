import { default as createRange } from "./dist/24.js";


/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
 * `start` is specified without an `end` or `step`. If `end` is not specified,
 * it's set to `start` with `start` then set to `0`.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.rangeRight
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(-4);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */

var range = createRange();
const _default = (range);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMjQuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DsCRkw7AwoOrY3JlYXRlUmFuZ2WboWmQwgLAkgMEwADAp2RlZmF1bHSQpXJhbmdlm6FskatjcmVhdGVSYW5nZcIGCZIHCMDAwMCRq2NyZWF0ZVJhbmdlqF9kZWZhdWx0m6FskaVyYW5nZcILwJIMDcDAwMCQn5YAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWAAvAwMLCls0EIQEGCsLClgQAB8DCwpYABcAJwsKWBAXAwMLClgMCBMDCwpYBAQsOwsKWBgEMwMLClgAIwAjCwpYJCMDAwsKWAQ4NwMLC
====catalogjs annotation end====*/