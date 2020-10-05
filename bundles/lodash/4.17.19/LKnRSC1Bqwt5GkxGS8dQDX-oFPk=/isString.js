import { default as baseGetTag } from "./dist/86.js";
import { default as isArray } from "./isArray.js";
import { default as isObjectLike } from "./isObjectLike.js";




/** `Object#toString` result references. */

var stringTag = '[object String]';
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */

function isString(value) {
  return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
}

const _default = (isString);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvODYuanMBk8KsLi9pc0FycmF5LmpzBZPCsS4vaXNPYmplY3RMaWtlLmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdBjAkZMYwMKGqmJhc2VHZXRUYWeboWmQwgLAkgMEwADAp2RlZmF1bHSQp2lzQXJyYXmboWmQwgbAkgcIwAHAp2RlZmF1bHSQrGlzT2JqZWN0TGlrZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCpc3RyaW5nVGFnm6FskMIOwJIPEMDAwMCQqGlzU3RyaW5nm6FslKdpc0FycmF5rGlzT2JqZWN0TGlrZapiYXNlR2V0VGFnqXN0cmluZ1RhZ8IRwJISE8DAwMCQqF9kZWZhdWx0m6Fskahpc1N0cmluZ8IVwJIWF8DAwMCQ3AAZlgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYLCsAQwsKWARcGCcLClgkAB8DCwpYLB8DAwsKWMAfADMLClgEcCg3CwpYJAAvAwsKWCwzAwMLClgsMwATCwpYyAQ4RwsKWBBQPwMLClgAJwMDCwpYLCcDAwsKWzQFZAxIUwsKWCQjACMLClgQIwMDCwpYCARUYwsKWBgEWwMLClgAIwBPCwpYJCMDAwsKWAQ4XwMLC
====catalogjs annotation end====*/