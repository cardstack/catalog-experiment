import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";



/** `Object#toString` result references. */

var weakSetTag = '[object WeakSet]';
/**
 * Checks if `value` is classified as a `WeakSet` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
 * @example
 *
 * _.isWeakSet(new WeakSet);
 * // => true
 *
 * _.isWeakSet(new Set);
 * // => false
 */

function isWeakSet(value) {
  return isObjectLike(value) && baseGetTag(value) == weakSetTag;
}


export { isWeakSet as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvODYuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwIGnZGVmYXVsdJShbKlpc1dlYWtTZXQQwJGTEMDAhKpiYXNlR2V0VGFnm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxpc09iamVjdExpa2WboWmQwgbAkgcIwAHAp2RlZmF1bHSQqndlYWtTZXRUYWeboWyQwgrAkgsMwMDAwJCpaXNXZWFrU2V0m6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ6p3ZWFrU2V0VGFnwg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgsKwAzCwpYBHAYJwsKWCQAHwMLClgsMwMDCwpYTDMAEwsKWMQEKDcLClgQVC8DCwpYACsDAwsKWCwrAwMLCls0BXQMOEMLClgkJwAjCwpYJCcDAwsKWAw4PwMLC
====catalogjs annotation end====*/