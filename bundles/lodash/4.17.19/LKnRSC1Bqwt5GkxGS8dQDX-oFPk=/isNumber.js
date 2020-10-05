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

const _default = (isNumber);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0FMCRkxTAwoWqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKludW1iZXJUYWeboWyQwgrAkgsMwMDAwJCoaXNOdW1iZXKboWyTrGlzT2JqZWN0TGlrZapiYXNlR2V0VGFnqW51bWJlclRhZ8INwJIOD8DAwMCQqF9kZWZhdWx0m6Fskahpc051bWJlcsIRwJISE8DAwMCQ3AAVlgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYLCsAMwsKWARwGCcLClgkAB8DCwpYLDMDAwsKWLwzABMLCljEBCg3CwpYEFAvAwsKWAAnAwMLClgsJwMDCwpbNAjMDDhDCwpYJCMAIwsKWBAjAwMLClgIBERTCwpYGARLAwsKWAAjAD8LClgkIwMDCwpYBDhPAwsI=
====catalogjs annotation end====*/