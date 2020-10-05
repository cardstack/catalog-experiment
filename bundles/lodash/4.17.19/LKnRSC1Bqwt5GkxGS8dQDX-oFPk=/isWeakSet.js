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

const _default = (isWeakSet);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0FMCRkxTAwoWqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKp3ZWFrU2V0VGFnm6FskMIKwJILDMDAwMCQqWlzV2Vha1NldJuhbJOsaXNPYmplY3RMaWtlqmJhc2VHZXRUYWeqd2Vha1NldFRhZ8INwJIOD8DAwMCQqF9kZWZhdWx0m6Fskalpc1dlYWtTZXTCEcCSEhPAwMDAkNwAFZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWCwrADMLClgEcBgnCwpYJAAfAwsKWCwzAwMLClhMMwATCwpYxAQoNwsKWBBULwMLClgAKwMDCwpYLCsDAwsKWzQFdAw4QwsKWCQnACMLClgQJwMDCwpYCAREUwsKWBgESwMLClgAIwA/CwpYJCMDAwsKWAQ4TwMLC
====catalogjs annotation end====*/