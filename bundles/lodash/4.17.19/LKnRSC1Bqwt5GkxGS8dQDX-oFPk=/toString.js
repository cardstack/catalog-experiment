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

const _default = (toString);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMjIuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOsYmFzZVRvU3RyaW5nm6FpkMICwJIDBMAAwKdkZWZhdWx0kKh0b1N0cmluZ5uhbJGsYmFzZVRvU3RyaW5nwgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRqHRvU3RyaW5nwgnAkgoLwMDAwJCdlgAAAcDCw5YAFwIFwsKWCQADwMLClgsMwMDCwpYoDMDAwsKWzQGsCgYIwsKWCQjABMLClgQIwMDCwpYCAQkMwsKWBgEKwMLClgAIwAfCwpYJCMDAwsKWAQ4LwMLC
====catalogjs annotation end====*/