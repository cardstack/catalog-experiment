import { default as toString } from "./toString.js";
import { default as upperFirst } from "./upperFirst.js";



/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */

function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}

const _default = (capitalize);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL3RvU3RyaW5nLmpzAZPCry4vdXBwZXJGaXJzdC5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChKh0b1N0cmluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCqdXBwZXJGaXJzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCqY2FwaXRhbGl6ZZuhbJKqdXBwZXJGaXJzdKh0b1N0cmluZ8IJwJIKC8DAwMCQqF9kZWZhdWx0m6FskapjYXBpdGFsaXplwg3Akg4PwMDAwJDcABGWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLClgEIwMDCwpYBGgYJwsKWCQAHwMLClgsKwMDCwpYUCsAEwsKWzQFSGgoMwsKWCQrACMLClgQKwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/