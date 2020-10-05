import { default as baseGetTag } from "./dist/86.js";
import { default as isObject } from "./isObject.js";



/** `Object#toString` result references. */

var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */

function isFunction(value) {
  if (!isObject(value)) {
    return false;
  } // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.


  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

const _default = (isFunction);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODYuanMBk8KtLi9pc09iamVjdC5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQdwJGTHcDCiKpiYXNlR2V0VGFnm6FpkMICwJIDBMAAwKdkZWZhdWx0kKhpc09iamVjdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoYXN5bmNUYWeboWyQwgrAkgsMwMDAwJCnZnVuY1RhZ5uhbJDCDcCSDg/AwMDAkKZnZW5UYWeboWyQwhDAkhESwMDAwJCocHJveHlUYWeboWyQwhPAkhQVwMDAwJCqaXNGdW5jdGlvbpuhbJaoaXNPYmplY3SqYmFzZUdldFRhZ6dmdW5jVGFnpmdlblRhZ6hhc3luY1RhZ6hwcm94eVRhZ8IWwJIXGMDAwMCQqF9kZWZhdWx0m6Fskappc0Z1bmN0aW9uwhrAkhscwMDAwJDcAB6WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClszJCsAPwsKWARgGCcLClgkAB8DCwpYLCMDAwsKWEQjABMLCljEBChbCwpYEGwsNwsKWAAjAwMLClgsIwBXCwpYGFg4QwsKWAAfAwMLClhkHwBLCwpYGHxETwsKWAAbAwMLClgsGwAzCwpYGExTAwsKWAAjAwMLClgsIwMDCwpbNAVQDFxnCwpYJCsAIwsKWBArAwMLClgIBGh3CwpYGARvAwsKWAAjAGMLClgkIwMDCwpYBDhzAwsI=
====catalogjs annotation end====*/