import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";



/** `Object#toString` result references. */

var symbolTag = '[object Symbol]';
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */

function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}


export { isSymbol as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvODYuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwIGnZGVmYXVsdJShbKhpc1N5bWJvbBDAkZMQwMCEqmJhc2VHZXRUYWeboWmQwgLAkgMEwADAp2RlZmF1bHSQrGlzT2JqZWN0TGlrZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpc3ltYm9sVGFnm6FskMIKwJILDMDAwMCQqGlzU3ltYm9sm6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ6lzeW1ib2xUYWfCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWCwrADMLClgEcBgnCwpYJAAfAwsKWCwzAwMLCli8MwATCwpYxAQoNwsKWBBQLwMLClgAJwMDCwpYLCcDAwsKWzQFnAw4QwsKWCQjACMLClgkIwMDCwpYDDg/AwsI=
====catalogjs annotation end====*/