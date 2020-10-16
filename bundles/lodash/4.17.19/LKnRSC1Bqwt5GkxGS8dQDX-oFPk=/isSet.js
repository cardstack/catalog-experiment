import { default as getTag } from "./dist/45.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";



/** `Object#toString` result references. */

var setTag = '[object Set]';
/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */

function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}






/* Node.js helper references. */

var nodeIsSet = nodeUtil && nodeUtil.isSet;
/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */

var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

export { isSet as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvNDUuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwJXCrS4vZGlzdC8xMzUuanMJwsCVwqwuL2Rpc3QvOTQuanMNwsCBp2RlZmF1bHSUoWylaXNTZXQkwJGTJMDAiKZnZXRUYWeboWmQwgLAkgMEwADAp2RlZmF1bHSQrGlzT2JqZWN0TGlrZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpYmFzZVVuYXJ5m6FpkMIKwJILDMACwKdkZWZhdWx0kKhub2RlVXRpbJuhaZDCDsCTDxARwAPAp2RlZmF1bHSQpnNldFRhZ5uhbJDCE8CSFBXAwMDAkKliYXNlSXNTZXSboWyTrGlzT2JqZWN0TGlrZaZnZXRUYWemc2V0VGFnwhbAkhcYktlYaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Jhc2VJc1NldC5qc6dkZWZhdWx0wMDAkKlub2RlSXNTZXSboWyRqG5vZGVVdGlswhoekxscHcDAwMCRqG5vZGVVdGlspWlzU2V0m6Fsk6lub2RlSXNTZXSpYmFzZVVuYXJ5qWJhc2VJc1NldMIgI5IhIsDAwMCTqWJhc2VVbmFyealiYXNlSXNTZXSpbm9kZUlzU2V03AAllgAAAcDCw5YAFwIFwsKWCQADwMLClgsGwMDCwpYLBsAVwsKWARwGCcLClgkAB8DCwpYLDMDAwsKWEwzABMLClgEYCg3CwpYJAAvAwsKWCwnAwMLClgMJwB3CwpYBFw4SwsKWCQAPwMLClgsIwMDCwpYACMARwsKWBAjAwMLCljEBExbCwpYEERTAwsKWAAbAwMLClgsGwMDCwpbM0AMXGcLClgkJwAjCwpYECcDAwsKWKQEaH8LClgQAG8DCwpYACcAewsKWAAnADMLClgEJwBjCwpYDBhDAwsKWzQFMASAkwsKWBAAhwMLClgAFwCPCwpYJBcDAwsKWAwAcwMLClgIOIsDCwg==
====catalogjs annotation end====*/