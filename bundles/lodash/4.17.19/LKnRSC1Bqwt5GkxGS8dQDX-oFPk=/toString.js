import { default as baseToString } from "./dist/22.js";


/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */

function toString(value) {
  return value == null ? '' : baseToString(value);
}


export { toString as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMjIuanMBwsCBp2RlZmF1bHSUoWyodG9TdHJpbmcIwJGTCMDAgqxiYXNlVG9TdHJpbmeboWmQwgLAkgMEwADAp2RlZmF1bHSQqHRvU3RyaW5nm6FskaxiYXNlVG9TdHJpbmfCBcCSBgfAwMDAkJmWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwzAwMLCligMwMDCwpbNAawKBgjCwpYJCMAEwsKWCQjAwMLClgMOB8DCwg==
====catalogjs annotation end====*/