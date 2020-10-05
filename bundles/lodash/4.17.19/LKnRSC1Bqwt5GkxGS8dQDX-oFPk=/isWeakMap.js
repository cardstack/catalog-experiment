import { default as getTag } from "./dist/45.js";
import { default as isObjectLike } from "./isObjectLike.js";



/** `Object#toString` result references. */

var weakMapTag = '[object WeakMap]';
/**
 * Checks if `value` is classified as a `WeakMap` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
 * @example
 *
 * _.isWeakMap(new WeakMap);
 * // => true
 *
 * _.isWeakMap(new Map);
 * // => false
 */

function isWeakMap(value) {
  return isObjectLike(value) && getTag(value) == weakMapTag;
}

const _default = (isWeakMap);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNDUuanMBk8KxLi9pc09iamVjdExpa2UuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0FMCRkxTAwoWmZ2V0VGFnm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxpc09iamVjdExpa2WboWmQwgbAkgcIwAHAp2RlZmF1bHSQqndlYWtNYXBUYWeboWyQwgrAkgsMwMDAwJCpaXNXZWFrTWFwm6Fsk6xpc09iamVjdExpa2WmZ2V0VGFnqndlYWtNYXBUYWfCDcCSDg/AwMDAkKhfZGVmYXVsdJuhbJGpaXNXZWFrTWFwwhHAkhITwMDAwJDcABWWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwbAwMLClgsGwAzCwpYBHAYJwsKWCQAHwMLClgsMwMDCwpYTDMAEwsKWMQEKDcLClgQVC8DCwpYACsDAwsKWCwrAwMLCls0BXQMOEMLClgkJwAjCwpYECcDAwsKWAgERFMLClgYBEsDCwpYACMAPwsKWCQjAwMLClgEOE8DCwg==
====catalogjs annotation end====*/