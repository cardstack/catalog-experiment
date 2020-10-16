import { default as root } from "./dist/93.js";


/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeIsFinite = root.isFinite;
/**
 * Checks if `value` is a finite primitive number.
 *
 * **Note:** This method is based on
 * [`Number.isFinite`](https://mdn.io/Number/isFinite).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
 * @example
 *
 * _.isFinite(3);
 * // => true
 *
 * _.isFinite(Number.MIN_VALUE);
 * // => true
 *
 * _.isFinite(Infinity);
 * // => false
 *
 * _.isFinite('3');
 * // => false
 */

function isFinite(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}


export { isFinite as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvOTMuanMBwsCBp2RlZmF1bHSUoWyoaXNGaW5pdGUNwJGTDcDAg6Ryb290m6FpkMICwJIDBMAAwKdkZWZhdWx0kK5uYXRpdmVJc0Zpbml0ZZuhbJGkcm9vdMIGCZIHCMDAwMCRpHJvb3SoaXNGaW5pdGWboWyRrm5hdGl2ZUlzRmluaXRlwgrAkgsMwMDAwJCelgAAAcDCw5YAFwIFwsKWCQADwMLClgsEwMDCwpYABMDAwsKWXQEGCsLClgQAB8DCwpYADsAJwsKWLw7AwMLClgMJBMDCwpbNAggKCw3CwpYJCMAIwsKWCQjAwMLClgMODMDCwg==
====catalogjs annotation end====*/