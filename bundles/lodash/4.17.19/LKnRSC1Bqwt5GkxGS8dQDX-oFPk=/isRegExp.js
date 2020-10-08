import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";



/** `Object#toString` result references. */

var regexpTag = '[object RegExp]';
/**
 * The base implementation of `_.isRegExp` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
 */

function baseIsRegExp0(value) {
  return isObjectLike(value) && baseGetTag(value) == regexpTag;
}

const baseIsRegExp = (baseIsRegExp0);




/* Node.js helper references. */

var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;
/**
 * Checks if `value` is classified as a `RegExp` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
 * @example
 *
 * _.isRegExp(/abc/);
 * // => true
 *
 * _.isRegExp('/abc/');
 * // => false
 */

var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
const _default = (isRegExp);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFk8KtLi9kaXN0LzEzNS5qcwmTwqwuL2Rpc3QvOTQuanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0LMCRkyzAwoqqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKliYXNlVW5hcnmboWmQwgrAkgsMwALAp2RlZmF1bHSQqG5vZGVVdGlsm6FpkMIOwJMPEBHAA8CnZGVmYXVsdJCpcmVnZXhwVGFnm6FskMITwJIUFcDAwMCQrWJhc2VJc1JlZ0V4cDCboWyTrGlzT2JqZWN0TGlrZapiYXNlR2V0VGFnqXJlZ2V4cFRhZ8IWwJIXGMDAwMCQrGJhc2VJc1JlZ0V4cJuhbJGtYmFzZUlzUmVnRXhwMMIawJIbHJLZW2h0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlSXNSZWdFeHAuanOnZGVmYXVsdMDAwJCsbm9kZUlzUmVnRXhwm6Fskahub2RlVXRpbMIeIpMfICHAwMDAkahub2RlVXRpbKhpc1JlZ0V4cJuhbJOsbm9kZUlzUmVnRXhwqWJhc2VVbmFyeaxiYXNlSXNSZWdFeHDCJCeSJSbAwMDAk6liYXNlVW5hcnmsYmFzZUlzUmVnRXhwrG5vZGVJc1JlZ0V4cKhfZGVmYXVsdJuhbJGoaXNSZWdFeHDCKcCSKivAwMDAkNwALZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWCwrAFcLClgEcBgnCwpYJAAfAwsKWCwzAwMLClhMMwATCwpYBGAoNwsKWCQALwMLClgsJwMDCwpYDCcAhwsKWARcOEsLClgkAD8DCwpYLCMDAwsKWAAjAEcLClgQIwMDCwpYxARMWwsKWBBQUwMLClgAJwMDCwpYLCcDAwsKWzNYDFxnCwpYJDcAIwsKWBA3AwMLClgIBGh3CwpYGARvAwsKWAAzAGMLClgQMwMDCwpYnAR4jwsKWBAAfwMLClgAMwCLCwpYADMAMwsKWAQzAHMLClgMJEMDCwpbNAVIBJCjCwpYEACXAwsKWAAjAJ8LClgQIwMDCwpYDACDAwsKWAQEpLMLClgYBKsDCwpYACMAmwsKWCQjAwMLClgEOK8DCwg==
====catalogjs annotation end====*/