import { default as toString } from "./toString.js";


/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */

var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);
/**
 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https://lodash\.com/\)'
 */

function escapeRegExp(string) {
  string = toString(string);
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
}

const _default = (escapeRegExp);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq0uL3RvU3RyaW5nLmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdBbAkZMWwMKFqHRvU3RyaW5nm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxyZVJlZ0V4cENoYXKboWyQwgYKkwcICcDAwMCQr3JlSGFzUmVnRXhwQ2hhcpuhbJKmUmVnRXhwrHJlUmVnRXhwQ2hhcsILDpIMDcDAwMCRrHJlUmVnRXhwQ2hhcqxlc2NhcGVSZWdFeHCboWyTqHRvU3RyaW5nr3JlSGFzUmVnRXhwQ2hhcqxyZVJlZ0V4cENoYXLCD8CSEBHAwMDAkKhfZGVmYXVsdJuhbJGsZXNjYXBlUmVnRXhwwhPAkhQVwMDAwJDcABeWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLClhYIwA3CwpZ4AQYPwsKWBAAHC8LClgAMwArCwpYHDMDAwsKWHwzAwMLClgMVwMDCwpYGAAzAwsKWAA/ADsLClh0PwAnCwpYDCAjAwsKWzQGmFRASwsKWCQzABMLClgQMwMDCwpYCARMWwsKWBgEUwMLClgAIwBHCwpYJCMDAwsKWAQ4VwMLC
====catalogjs annotation end====*/