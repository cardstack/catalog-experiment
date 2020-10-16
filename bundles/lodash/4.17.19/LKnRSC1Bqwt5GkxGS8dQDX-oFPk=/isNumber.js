import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";



/** `Object#toString` result references. */

var numberTag = '[object Number]';
/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */

function isNumber(value) {
  return typeof value == 'number' || isObjectLike(value) && baseGetTag(value) == numberTag;
}


export { isNumber as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvODYuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwIGnZGVmYXVsdJShbKhpc051bWJlchDAkZMQwMCEqmJhc2VHZXRUYWeboWmQwgLAkgMEwADAp2RlZmF1bHSQrGlzT2JqZWN0TGlrZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpbnVtYmVyVGFnm6FskMIKwJILDMDAwMCQqGlzTnVtYmVym6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ6ludW1iZXJUYWfCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWCwrADMLClgEcBgnCwpYJAAfAwsKWCwzAwMLCli8MwATCwpYxAQoNwsKWBBQLwMLClgAJwMDCwpYLCcDAwsKWzQIzAw4QwsKWCQjACMLClgkIwMDCwpYDDg/AwsI=
====catalogjs annotation end====*/