import { default as toString } from "./toString.js";


/**
 * Converts `string`, as a whole, to upper case just like
 * [String#toUpperCase](https://mdn.io/toUpperCase).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the upper cased string.
 * @example
 *
 * _.toUpper('--foo-bar--');
 * // => '--FOO-BAR--'
 *
 * _.toUpper('fooBar');
 * // => 'FOOBAR'
 *
 * _.toUpper('__foo_bar__');
 * // => '__FOO_BAR__'
 */

function toUpper(value) {
  return toString(value).toUpperCase();
}


export { toUpper as default };
/*====catalogjs annotation start====
lZGVwq0uL3RvU3RyaW5nLmpzAcLAgadkZWZhdWx0lKFsp3RvVXBwZXIIwJGTCMDAgqh0b1N0cmluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCndG9VcHBlcpuhbJGodG9TdHJpbmfCBcCSBgfAwMDAkJmWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLClhMIwMDCwpbNAc4YBgjCwpYJB8AEwsKWCQfAwMLClgMOB8DCwg==
====catalogjs annotation end====*/