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

const _default = (isElement);
export { _default as default };
/*====catalogjs annotation start====
lZKTwrEuL2lzT2JqZWN0TGlrZS5qcwGTwrIuL2lzUGxhaW5PYmplY3QuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSsaXNPYmplY3RMaWtlm6FpkMICwJIDBMAAwKdkZWZhdWx0kK1pc1BsYWluT2JqZWN0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKlpc0VsZW1lbnSboWySrGlzT2JqZWN0TGlrZa1pc1BsYWluT2JqZWN0wgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRqWlzRWxlbWVudMINwJIOD8DAwMCQ3AARlgAAAcDCw5YAHAIFwsKWCQADwMLClgsMwMDCwpYTDMAIwsKWAR0GCcLClgkAB8DCwpYLDcDAwsKWJA3AwMLCls0BWgoKDMLClgkJwATCwpYECcDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/