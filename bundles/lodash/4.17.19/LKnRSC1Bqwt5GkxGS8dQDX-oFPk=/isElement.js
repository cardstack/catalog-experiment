import { default as isObjectLike } from "./isObjectLike.js";
import { default as isPlainObject } from "./isPlainObject.js";



/**
 * Checks if `value` is likely a DOM element.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 *
 * _.isElement('<body>');
 * // => false
 */

function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}


export { isElement as default };
/*====catalogjs annotation start====
lZKVwrEuL2lzT2JqZWN0TGlrZS5qcwHCwJXCsi4vaXNQbGFpbk9iamVjdC5qcwXCwIGnZGVmYXVsdJShbKlpc0VsZW1lbnQMwJGTDMDAg6xpc09iamVjdExpa2WboWmQwgLAkgMEwADAp2RlZmF1bHSQrWlzUGxhaW5PYmplY3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWlzRWxlbWVudJuhbJKsaXNPYmplY3RMaWtlrWlzUGxhaW5PYmplY3TCCcCSCgvAwMDAkJ2WAAABwMLDlgAcAgXCwpYJAAPAwsKWCwzAwMLClhMMwAjCwpYBHQYJwsKWCQAHwMLClgsNwMDCwpYkDcDAwsKWzQFaCgoMwsKWCQnABMLClgkJwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/