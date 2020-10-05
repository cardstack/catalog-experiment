import { default as isInteger } from "./isInteger.js";


/** Used as references for various `Number` constants. */

var MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
 * double precision number which isn't the result of a rounded unsafe integer.
 *
 * **Note:** This method is based on
 * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
 * @example
 *
 * _.isSafeInteger(3);
 * // => true
 *
 * _.isSafeInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isSafeInteger(Infinity);
 * // => false
 *
 * _.isSafeInteger('3');
 * // => false
 */

function isSafeInteger(value) {
  return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
}

const _default = (isSafeInteger);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq4uL2lzSW50ZWdlci5qcwGBp2RlZmF1bHSUoWyoX2RlZmF1bHQRwJGTEcDChKlpc0ludGVnZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQsE1BWF9TQUZFX0lOVEVHRVKboWyQwgbAkwcICcDAwMCQrWlzU2FmZUludGVnZXKboWySqWlzSW50ZWdlcrBNQVhfU0FGRV9JTlRFR0VSwgrAkgsMwMDAwJCoX2RlZmF1bHSboWyRrWlzU2FmZUludGVnZXLCDsCSDxDAwMDAkNwAEpYAAAHAwsOWABkCBcLClgkAA8DCwpYLCcDAwsKWEwnACMLClj4BBgrCwpYEEwfAwsKWABDAwMLClhUQwAnCwpYNEMDAwsKWzQKRAwsNwsKWCQ3ABMLClgQNwMDCwpYCAQ4RwsKWBgEPwMLClgAIwAzCwpYJCMDAwsKWAQ4QwMLC
====catalogjs annotation end====*/