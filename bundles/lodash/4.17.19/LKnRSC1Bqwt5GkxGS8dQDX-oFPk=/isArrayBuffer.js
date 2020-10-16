import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";



var arrayBufferTag = '[object ArrayBuffer]';
/**
 * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 */

function baseIsArrayBuffer(value) {
  return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
}






/* Node.js helper references. */

var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer;
/**
 * Checks if `value` is classified as an `ArrayBuffer` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 * @example
 *
 * _.isArrayBuffer(new ArrayBuffer(2));
 * // => true
 *
 * _.isArrayBuffer(new Array(2));
 * // => false
 */

var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

export { isArrayBuffer as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvODYuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwJXCrS4vZGlzdC8xMzUuanMJwsCVwqwuL2Rpc3QvOTQuanMNwsCBp2RlZmF1bHSUoWytaXNBcnJheUJ1ZmZlciTAkZMkwMCIqmJhc2VHZXRUYWeboWmQwgLAkgMEwADAp2RlZmF1bHSQrGlzT2JqZWN0TGlrZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpYmFzZVVuYXJ5m6FpkMIKwJILDMACwKdkZWZhdWx0kKhub2RlVXRpbJuhaZDCDsCTDxARwAPAp2RlZmF1bHSQrmFycmF5QnVmZmVyVGFnm6FskMITwJIUFcDAwMCQsWJhc2VJc0FycmF5QnVmZmVym6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ65hcnJheUJ1ZmZlclRhZ8IWwJIXGJLZYGh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlSXNBcnJheUJ1ZmZlci5qc6dkZWZhdWx0wMDAkLFub2RlSXNBcnJheUJ1ZmZlcpuhbJGobm9kZVV0aWzCGh6TGxwdwMDAwJGobm9kZVV0aWytaXNBcnJheUJ1ZmZlcpuhbJOxbm9kZUlzQXJyYXlCdWZmZXKpYmFzZVVuYXJ5sWJhc2VJc0FycmF5QnVmZmVywiAjkiEiwMDAwJOpYmFzZVVuYXJ5sWJhc2VJc0FycmF5QnVmZmVysW5vZGVJc0FycmF5QnVmZmVy3AAllgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYLCsAVwsKWARwGCcLClgkAB8DCwpYLDMDAwsKWEwzABMLClgEYCg3CwpYJAAvAwsKWCwnAwMLClgMJwB3CwpYBFw4SwsKWCQAPwMLClgsIwMDCwpYACMARwsKWBAjAwMLClgQBExbCwpYEGRTAwsKWAA7AwMLClgsOwMDCwpbM4gMXGcLClgkRwAjCwpYEEcDAwsKWKQEaH8LClgQAG8DCwpYAEcAewsKWABHADMLClgERwBjCwpYDDhDAwsKWzQF7ASAkwsKWBAAhwMLClgANwCPCwpYJDcDAwsKWAwAcwMLClgIOIsDCwg==
====catalogjs annotation end====*/