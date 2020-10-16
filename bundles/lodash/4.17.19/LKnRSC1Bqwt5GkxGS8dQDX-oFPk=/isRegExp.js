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

function baseIsRegExp(value) {
  return isObjectLike(value) && baseGetTag(value) == regexpTag;
}






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

export { isRegExp as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvODYuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwJXCrS4vZGlzdC8xMzUuanMJwsCVwqwuL2Rpc3QvOTQuanMNwsCBp2RlZmF1bHSUoWyoaXNSZWdFeHAkwJGTJMDAiKpiYXNlR2V0VGFnm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxpc09iamVjdExpa2WboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWJhc2VVbmFyeZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCobm9kZVV0aWyboWmQwg7Akw8QEcADwKdkZWZhdWx0kKlyZWdleHBUYWeboWyQwhPAkhQVwMDAwJCsYmFzZUlzUmVnRXhwm6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ6lyZWdleHBUYWfCFsCSFxiS2VtodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYmFzZUlzUmVnRXhwLmpzp2RlZmF1bHTAwMCQrG5vZGVJc1JlZ0V4cJuhbJGobm9kZVV0aWzCGh6TGxwdwMDAwJGobm9kZVV0aWyoaXNSZWdFeHCboWyTrG5vZGVJc1JlZ0V4cKliYXNlVW5hcnmsYmFzZUlzUmVnRXhwwiAjkiEiwMDAwJOpYmFzZVVuYXJ5rGJhc2VJc1JlZ0V4cKxub2RlSXNSZWdFeHDcACWWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgsKwBXCwpYBHAYJwsKWCQAHwMLClgsMwMDCwpYTDMAEwsKWARgKDcLClgkAC8DCwpYLCcDAwsKWAwnAHcLClgEXDhLCwpYJAA/AwsKWCwjAwMLClgAIwBHCwpYECMDAwsKWMQETFsLClgQUFMDCwpYACcDAwsKWCwnAwMLClszWAxcZwsKWCQzACMLClgQMwMDCwpYpARofwsKWBAAbwMLClgAMwB7CwpYADMAMwsKWAQzAGMLClgMJEMDCwpbNAVIBICTCwpYEACHAwsKWAAjAI8LClgkIwMDCwpYDABzAwsKWAg4iwMLC
====catalogjs annotation end====*/