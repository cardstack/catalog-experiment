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

function baseIsArrayBuffer0(value) {
  return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
}

const baseIsArrayBuffer = (baseIsArrayBuffer0);




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
const _default = (isArrayBuffer);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFk8KtLi9kaXN0LzEzNS5qcwmTwqwuL2Rpc3QvOTQuanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0LMCRkyzAwoqqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKliYXNlVW5hcnmboWmQwgrAkgsMwALAp2RlZmF1bHSQqG5vZGVVdGlsm6FpkMIOwJMPEBHAA8CnZGVmYXVsdJCuYXJyYXlCdWZmZXJUYWeboWyQwhPAkhQVwMDAwJCyYmFzZUlzQXJyYXlCdWZmZXIwm6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ65hcnJheUJ1ZmZlclRhZ8IWwJIXGMDAwMCQsWJhc2VJc0FycmF5QnVmZmVym6FskbJiYXNlSXNBcnJheUJ1ZmZlcjDCGsCSGxyS2WBodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYmFzZUlzQXJyYXlCdWZmZXIuanOnZGVmYXVsdMDAwJCxbm9kZUlzQXJyYXlCdWZmZXKboWyRqG5vZGVVdGlswh4ikx8gIcDAwMCRqG5vZGVVdGlsrWlzQXJyYXlCdWZmZXKboWyTsW5vZGVJc0FycmF5QnVmZmVyqWJhc2VVbmFyebFiYXNlSXNBcnJheUJ1ZmZlcsIkJ5IlJsDAwMCTqWJhc2VVbmFyebFiYXNlSXNBcnJheUJ1ZmZlcrFub2RlSXNBcnJheUJ1ZmZlcqhfZGVmYXVsdJuhbJGtaXNBcnJheUJ1ZmZlcsIpwJIqK8DAwMCQ3AAtlgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYLCsAVwsKWARwGCcLClgkAB8DCwpYLDMDAwsKWEwzABMLClgEYCg3CwpYJAAvAwsKWCwnAwMLClgMJwCHCwpYBFw4SwsKWCQAPwMLClgsIwMDCwpYACMARwsKWBAjAwMLClgQBExbCwpYEGRTAwsKWAA7AwMLClgsOwMDCwpbM4gMXGcLClgkSwAjCwpYEEsDAwsKWAgEaHcLClgYBG8DCwpYAEcAYwsKWBBHAwMLClicBHiPCwpYEAB/AwsKWABHAIsLClgARwAzCwpYBEcAcwsKWAw4QwMLCls0BewEkKMLClgQAJcDCwpYADcAnwsKWBA3AwMLClgMAIMDCwpYBASkswsKWBgEqwMLClgAIwCbCwpYJCMDAwsKWAQ4rwMLC
====catalogjs annotation end====*/