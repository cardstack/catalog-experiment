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


export { isSafeInteger as default };
/*====catalogjs annotation start====
lZGVwq4uL2lzSW50ZWdlci5qcwHCwIGnZGVmYXVsdJShbK1pc1NhZmVJbnRlZ2VyDcCRkw3AwIOpaXNJbnRlZ2Vym6FpkMICwJIDBMAAwKdkZWZhdWx0kLBNQVhfU0FGRV9JTlRFR0VSm6FskMIGwJMHCAnAwMDAkK1pc1NhZmVJbnRlZ2Vym6Fskqlpc0ludGVnZXKwTUFYX1NBRkVfSU5URUdFUsIKwJILDMDAwMCQnpYAAAHAwsOWABkCBcLClgkAA8DCwpYLCcDAwsKWEwnACMLClj4BBgrCwpYEEwfAwsKWABDAwMLClhUQwAnCwpYNEMDAwsKWzQKRAwsNwsKWCQ3ABMLClgkNwMDCwpYDDgzAwsI=
====catalogjs annotation end====*/