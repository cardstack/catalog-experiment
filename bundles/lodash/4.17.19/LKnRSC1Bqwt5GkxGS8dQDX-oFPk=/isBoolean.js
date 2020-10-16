import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";



/** `Object#toString` result references. */

var boolTag = '[object Boolean]';
/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
 * @example
 *
 * _.isBoolean(false);
 * // => true
 *
 * _.isBoolean(null);
 * // => false
 */

function isBoolean(value) {
  return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
}


export { isBoolean as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvODYuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwIGnZGVmYXVsdJShbKlpc0Jvb2xlYW4QwJGTEMDAhKpiYXNlR2V0VGFnm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxpc09iamVjdExpa2WboWmQwgbAkgcIwAHAp2RlZmF1bHSQp2Jvb2xUYWeboWyQwgrAkgsMwMDAwJCpaXNCb29sZWFum6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ6dib29sVGFnwg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgsKwAzCwpYBHAYJwsKWCQAHwMLClgsMwMDCwpY4DMAEwsKWMQEKDcLClgQVC8DCwpYAB8DAwsKWCwfAwMLCls0BXgMOEMLClgkJwAjCwpYJCcDAwsKWAw4PwMLC
====catalogjs annotation end====*/