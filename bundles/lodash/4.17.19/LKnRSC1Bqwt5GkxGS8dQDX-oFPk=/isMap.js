import { default as getTag } from "./dist/45.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";



/** `Object#toString` result references. */

var mapTag = '[object Map]';
/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */

function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}






/* Node.js helper references. */

var nodeIsMap = nodeUtil && nodeUtil.isMap;
/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */

var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

export { isMap as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvNDUuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwJXCrS4vZGlzdC8xMzUuanMJwsCVwqwuL2Rpc3QvOTQuanMNwsCBp2RlZmF1bHSUoWylaXNNYXAkwJGTJMDAiKZnZXRUYWeboWmQwgLAkgMEwADAp2RlZmF1bHSQrGlzT2JqZWN0TGlrZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpYmFzZVVuYXJ5m6FpkMIKwJILDMACwKdkZWZhdWx0kKhub2RlVXRpbJuhaZDCDsCTDxARwAPAp2RlZmF1bHSQpm1hcFRhZ5uhbJDCE8CSFBXAwMDAkKliYXNlSXNNYXCboWyTrGlzT2JqZWN0TGlrZaZnZXRUYWembWFwVGFnwhbAkhcYktlYaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Jhc2VJc01hcC5qc6dkZWZhdWx0wMDAkKlub2RlSXNNYXCboWyRqG5vZGVVdGlswhoekxscHcDAwMCRqG5vZGVVdGlspWlzTWFwm6Fsk6lub2RlSXNNYXCpYmFzZVVuYXJ5qWJhc2VJc01hcMIgI5IhIsDAwMCTqWJhc2VVbmFyealiYXNlSXNNYXCpbm9kZUlzTWFw3AAllgAAAcDCw5YAFwIFwsKWCQADwMLClgsGwMDCwpYLBsAVwsKWARwGCcLClgkAB8DCwpYLDMDAwsKWEwzABMLClgEYCg3CwpYJAAvAwsKWCwnAwMLClgMJwB3CwpYBFw4SwsKWCQAPwMLClgsIwMDCwpYACMARwsKWBAjAwMLCljEBExbCwpYEERTAwsKWAAbAwMLClgsGwMDCwpbM0AMXGcLClgkJwAjCwpYECcDAwsKWKQEaH8LClgQAG8DCwpYACcAewsKWAAnADMLClgEJwBjCwpYDBhDAwsKWzQFMASAkwsKWBAAhwMLClgAFwCPCwpYJBcDAwsKWAwAcwMLClgIOIsDCwg==
====catalogjs annotation end====*/