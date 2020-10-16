import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";



/** `Object#toString` result references. */

var dateTag = '[object Date]';
/**
 * The base implementation of `_.isDate` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 */

function baseIsDate(value) {
  return isObjectLike(value) && baseGetTag(value) == dateTag;
}






/* Node.js helper references. */

var nodeIsDate = nodeUtil && nodeUtil.isDate;
/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */

var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

export { isDate as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvODYuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwJXCrS4vZGlzdC8xMzUuanMJwsCVwqwuL2Rpc3QvOTQuanMNwsCBp2RlZmF1bHSUoWymaXNEYXRlJMCRkyTAwIiqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKliYXNlVW5hcnmboWmQwgrAkgsMwALAp2RlZmF1bHSQqG5vZGVVdGlsm6FpkMIOwJMPEBHAA8CnZGVmYXVsdJCnZGF0ZVRhZ5uhbJDCE8CSFBXAwMDAkKpiYXNlSXNEYXRlm6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ6dkYXRlVGFnwhbAkhcYktlZaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Jhc2VJc0RhdGUuanOnZGVmYXVsdMDAwJCqbm9kZUlzRGF0ZZuhbJGobm9kZVV0aWzCGh6TGxwdwMDAwJGobm9kZVV0aWymaXNEYXRlm6Fsk6pub2RlSXNEYXRlqWJhc2VVbmFyeapiYXNlSXNEYXRlwiAjkiEiwMDAwJOpYmFzZVVuYXJ5qmJhc2VJc0RhdGWqbm9kZUlzRGF0ZdwAJZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWCwrAFcLClgEcBgnCwpYJAAfAwsKWCwzAwMLClhMMwATCwpYBGAoNwsKWCQALwMLClgsJwMDCwpYDCcAdwsKWARcOEsLClgkAD8DCwpYLCMDAwsKWAAjAEcLClgQIwMDCwpYxARMWwsKWBBIUwMLClgAHwMDCwpYLB8DAwsKWzNkDFxnCwpYJCsAIwsKWBArAwMLClikBGh/CwpYEABvAwsKWAArAHsLClgAKwAzCwpYBCsAYwsKWAwcQwMLCls0BYAEgJMLClgQAIcDCwpYABsAjwsKWCQbAwMLClgMAHMDCwpYCDiLAwsI=
====catalogjs annotation end====*/