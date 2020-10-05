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

const _default = (isBoolean);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0FMCRkxTAwoWqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKdib29sVGFnm6FskMIKwJILDMDAwMCQqWlzQm9vbGVhbpuhbJOsaXNPYmplY3RMaWtlqmJhc2VHZXRUYWenYm9vbFRhZ8INwJIOD8DAwMCQqF9kZWZhdWx0m6Fskalpc0Jvb2xlYW7CEcCSEhPAwMDAkNwAFZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWCwrADMLClgEcBgnCwpYJAAfAwsKWCwzAwMLCljgMwATCwpYxAQoNwsKWBBULwMLClgAHwMDCwpYLB8DAwsKWzQFeAw4QwsKWCQnACMLClgQJwMDCwpYCAREUwsKWBgESwMLClgAIwA/CwpYJCMDAwsKWAQ4TwMLC
====catalogjs annotation end====*/