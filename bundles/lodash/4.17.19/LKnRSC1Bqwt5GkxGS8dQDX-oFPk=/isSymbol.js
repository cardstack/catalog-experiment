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

const _default = (isSymbol);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0FMCRkxTAwoWqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKlzeW1ib2xUYWeboWyQwgrAkgsMwMDAwJCoaXNTeW1ib2yboWyTrGlzT2JqZWN0TGlrZapiYXNlR2V0VGFnqXN5bWJvbFRhZ8INwJIOD8DAwMCQqF9kZWZhdWx0m6Fskahpc1N5bWJvbMIRwJISE8DAwMCQ3AAVlgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYLCsAMwsKWARwGCcLClgkAB8DCwpYLDMDAwsKWLwzABMLCljEBCg3CwpYEFAvAwsKWAAnAwMLClgsJwMDCwpbNAWcDDhDCwpYJCMAIwsKWBAjAwMLClgIBERTCwpYGARLAwsKWAAjAD8LClgkIwMDCwpYBDhPAwsI=
====catalogjs annotation end====*/