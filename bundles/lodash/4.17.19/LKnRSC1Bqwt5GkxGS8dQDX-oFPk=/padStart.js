import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";





/**
 * Pads `string` on the left side if it's shorter than `length`. Padding
 * characters are truncated if they exceed `length`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.padStart('abc', 6);
 * // => '   abc'
 *
 * _.padStart('abc', 6, '_-');
 * // => '_-_abc'
 *
 * _.padStart('abc', 3);
 * // => 'abc'
 */

function padStart(string, length, chars) {
  string = toString(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;
  return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
}

const _default = (padStart);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvMjEuanMBk8KtLi9kaXN0LzE0NC5qcwWTwq4uL3RvSW50ZWdlci5qcwmTwq0uL3RvU3RyaW5nLmpzDYGnZGVmYXVsdJShbKhfZGVmYXVsdBjAkZMYwMKGrWNyZWF0ZVBhZGRpbmeboWmQwgLAkgMEwADAp2RlZmF1bHSQqnN0cmluZ1NpemWboWmQwgbAkgcIwAHAp2RlZmF1bHSQqXRvSW50ZWdlcpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCodG9TdHJpbmeboWmQwg7Akg8QwAPAp2RlZmF1bHSQqHBhZFN0YXJ0m6FslKh0b1N0cmluZ6l0b0ludGVnZXKqc3RyaW5nU2l6Za1jcmVhdGVQYWRkaW5nwhHAkhITwMDAwJCoX2RlZmF1bHSboWyRqHBhZFN0YXJ0whXAkhYXwMDAwJDcABmWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw3AwMLCljYNwMDCwpYBGAYJwsKWCQAHwMLClgsKwMDCwpYlCsAEwsKWARkKDcLClgkAC8DCwpYLCcDAwsKWFQnACMLClgEYDhHCwpYJAA/AwsKWCwjAwMLCliUIwAzCwpbNAjYwEhTCwpYJCMAQwsKWBAjAwMLClgIBFRjCwpYGARbAwsKWAAjAE8LClgkIwMDCwpYBDhfAwsI=
====catalogjs annotation end====*/