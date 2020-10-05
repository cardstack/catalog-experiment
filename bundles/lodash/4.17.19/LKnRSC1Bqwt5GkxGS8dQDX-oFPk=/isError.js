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

const _default = (isError);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFk8KyLi9pc1BsYWluT2JqZWN0LmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdBvAkZMbwMKHqmJhc2VHZXRUYWeboWmQwgLAkgMEwADAp2RlZmF1bHSQrGlzT2JqZWN0TGlrZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCtaXNQbGFpbk9iamVjdJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCpZG9tRXhjVGFnm6FskMIOwJIPEMDAwMCQqGVycm9yVGFnm6FskMIRwJISE8DAwMCQp2lzRXJyb3KboWyVrGlzT2JqZWN0TGlrZapiYXNlR2V0VGFnqGVycm9yVGFnqWRvbUV4Y1RhZ61pc1BsYWluT2JqZWN0whTAkhUWwMDAwJCoX2RlZmF1bHSboWyRp2lzRXJyb3LCGMCSGRrAwMDAkNwAHJYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWLgrAE8LClgEcBgnCwpYJAAfAwsKWCwzAwMLClhEMwATCwpYBHQoNwsKWCQALwMLClgsNwMDCwpZKDcDAwsKWMgEOFMLClgQaDxHCwpYACcDAwsKWCwnADMLClgYTEsDCwpYACMDAwsKWGQjAEMLCls0BpgoVF8LClgkHwAjCwpYEB8DAwsKWAgEYG8LClgYBGcDCwpYACMAWwsKWCQjAwMLClgEOGsDCwg==
====catalogjs annotation end====*/