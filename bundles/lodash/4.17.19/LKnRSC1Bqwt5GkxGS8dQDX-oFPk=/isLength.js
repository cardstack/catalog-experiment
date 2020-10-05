/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */

function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

const _default = (isLength);
export { _default as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyoX2RlZmF1bHQMwJGTDMDCg7BNQVhfU0FGRV9JTlRFR0VSm6FskMICwJIDBMDAwMCQqGlzTGVuZ3Rom6FskbBNQVhfU0FGRV9JTlRFR0VSwgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRqGlzTGVuZ3RowgnAkgoLwMDAwJCdlgAAAcDCw5Y6AQIFwsKWBBMDwMLClgAQwMDCwpZYEMDAwsKWzQIjAwYIwsKWCQjABMLClgQIwMDCwpYCAQkMwsKWBgEKwMLClgAIwAfCwpYJCMDAwsKWAQ4LwMLC
====catalogjs annotation end====*/