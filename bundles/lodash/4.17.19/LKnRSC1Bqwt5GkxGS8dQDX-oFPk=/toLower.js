import { default as toString } from "./toString.js";


/**
 * Converts `string`, as a whole, to lower case just like
 * [String#toLowerCase](https://mdn.io/toLowerCase).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the lower cased string.
 * @example
 *
 * _.toLower('--Foo-Bar--');
 * // => '--foo-bar--'
 *
 * _.toLower('fooBar');
 * // => 'foobar'
 *
 * _.toLower('__FOO_BAR__');
 * // => '__foo_bar__'
 */

function toLower(value) {
  return toString(value).toLowerCase();
}


export { toLower as default };
/*====catalogjs annotation start====
lZGVwq0uL3RvU3RyaW5nLmpzAcLAgadkZWZhdWx0lKFsp3RvTG93ZXIIwJGTCMDAgqh0b1N0cmluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCndG9Mb3dlcpuhbJGodG9TdHJpbmfCBcCSBgfAwMDAkJmWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLClhMIwMDCwpbNAc4YBgjCwpYJB8AEwsKWCQfAwMLClgMOB8DCwg==
====catalogjs annotation end====*/