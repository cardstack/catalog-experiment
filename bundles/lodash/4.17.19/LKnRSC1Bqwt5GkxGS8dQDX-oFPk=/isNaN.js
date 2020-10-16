import { default as isNumber } from "./isNumber.js";


/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */

function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber(value) && value != +value;
}


export { isNaN as default };
/*====catalogjs annotation start====
lZGVwq0uL2lzTnVtYmVyLmpzAcLAgadkZWZhdWx0lKFspWlzTmFOCMCRkwjAwIKoaXNOdW1iZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQpWlzTmFOm6Fskahpc051bWJlcsIFwJIGB8DAwMCQmZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCMDAwsKWzLsIwMDCwpbNAmQdBgjCwpYJBcAEwsKWCQXAwMLClgMOB8DCwg==
====catalogjs annotation end====*/