import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as isPlainObject } from "./isPlainObject.js";




/** `Object#toString` result references. */

var domExcTag = '[object DOMException]',
    errorTag = '[object Error]';
/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */

function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }

  var tag = baseGetTag(value);
  return tag == errorTag || tag == domExcTag || typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value);
}


export { isError as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvODYuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwJXCsi4vaXNQbGFpbk9iamVjdC5qcwnCwIGnZGVmYXVsdJShbKdpc0Vycm9yF8CRkxfAwIaqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kK1pc1BsYWluT2JqZWN0m6FpkMIKwJILDMACwKdkZWZhdWx0kKlkb21FeGNUYWeboWyQwg7Akg8QwMDAwJCoZXJyb3JUYWeboWyQwhHAkhITwMDAwJCnaXNFcnJvcpuhbJWsaXNPYmplY3RMaWtlqmJhc2VHZXRUYWeoZXJyb3JUYWepZG9tRXhjVGFnrWlzUGxhaW5PYmplY3TCFMCSFRbAwMDAkNwAGJYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWLgrAE8LClgEcBgnCwpYJAAfAwsKWCwzAwMLClhEMwATCwpYBHQoNwsKWCQALwMLClgsNwMDCwpZKDcDAwsKWMgEOFMLClgQaDxHCwpYACcDAwsKWCwnADMLClgYTEsDCwpYACMDAwsKWGQjAEMLCls0BpgoVF8LClgkHwAjCwpYJB8DAwsKWAw4WwMLC
====catalogjs annotation end====*/