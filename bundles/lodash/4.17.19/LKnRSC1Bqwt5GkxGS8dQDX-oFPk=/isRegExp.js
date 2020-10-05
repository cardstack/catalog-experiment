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
lZSTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFk8KtLi9kaXN0LzEzNS5qcwmTwqwuL2Rpc3QvOTQuanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0LMCRkyzAwoqqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKliYXNlVW5hcnmboWmQwgrAkgsMwALAp2RlZmF1bHSQqG5vZGVVdGlsm6FpkMIOwJMPEBHAA8CnZGVmYXVsdJCpcmVnZXhwVGFnm6FskMITwJIUFcDAwMCQrWJhc2VJc1JlZ0V4cDCboWyTrGlzT2JqZWN0TGlrZapiYXNlR2V0VGFnqXJlZ2V4cFRhZ8IWwJIXGMDAwMCQrGJhc2VJc1JlZ0V4cJuhbJGtYmFzZUlzUmVnRXhwMMIawJIbHMDAwMCQrG5vZGVJc1JlZ0V4cJuhbJGobm9kZVV0aWzCHiKTHyAhwMDAwJGobm9kZVV0aWyoaXNSZWdFeHCboWyTrG5vZGVJc1JlZ0V4cKliYXNlVW5hcnmsYmFzZUlzUmVnRXhwwiQnkiUmwMDAwJOpYmFzZVVuYXJ5rGJhc2VJc1JlZ0V4cKxub2RlSXNSZWdFeHCoX2RlZmF1bHSboWyRqGlzUmVnRXhwwinAkiorwMDAwJDcAC2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgsKwBXCwpYBHAYJwsKWCQAHwMLClgsMwMDCwpYTDMAEwsKWARgKDcLClgkAC8DCwpYLCcDAwsKWAwnAIcLClgEXDhLCwpYJAA/AwsKWCwjAwMLClgAIwBHCwpYECMDAwsKWMQETFsLClgQUFMDCwpYACcDAwsKWCwnAwMLClszWAxcZwsKWCQ3ACMLClgQNwMDCwpYCARodwsKWBgEbwMLClgAMwBjCwpYEDMDAwsKWJwEeI8LClgQAH8DCwpYADMAiwsKWAAzADMLClgEMwBzCwpYDCRDAwsKWzQFSASQowsKWBAAlwMLClgAIwCfCwpYECMDAwsKWAwAgwMLClgEBKSzCwpYGASrAwsKWAAjAJsLClgkIwMDCwpYBDivAwsI=
====catalogjs annotation end====*/