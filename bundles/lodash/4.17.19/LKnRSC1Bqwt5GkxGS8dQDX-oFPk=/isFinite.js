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

const _default = (isFinite);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvOTMuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0EcCRkxHAwoSkcm9vdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCubmF0aXZlSXNGaW5pdGWboWyRpHJvb3TCBgmSBwjAwMDAkaRyb290qGlzRmluaXRlm6Fska5uYXRpdmVJc0Zpbml0ZcIKwJILDMDAwMCQqF9kZWZhdWx0m6Fskahpc0Zpbml0ZcIOwJIPEMDAwMCQ3AASlgAAAcDCw5YAFwIFwsKWCQADwMLClgsEwMDCwpYABMDAwsKWXQEGCsLClgQAB8DCwpYADsAJwsKWLw7AwMLClgMJBMDCwpbNAggKCw3CwpYJCMAIwsKWBAjAwMLClgIBDhHCwpYGAQ/AwsKWAAjADMLClgkIwMDCwpYBDhDAwsI=
====catalogjs annotation end====*/