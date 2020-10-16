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


export { capitalize as default };
/*====catalogjs annotation start====
lZKVwq0uL3RvU3RyaW5nLmpzAcLAlcKvLi91cHBlckZpcnN0LmpzBcLAgadkZWZhdWx0lKFsqmNhcGl0YWxpemUMwJGTDMDAg6h0b1N0cmluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCqdXBwZXJGaXJzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCqY2FwaXRhbGl6ZZuhbJKqdXBwZXJGaXJzdKh0b1N0cmluZ8IJwJIKC8DAwMCQnZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCMDAwsKWAQjAwMLClgEaBgnCwpYJAAfAwsKWCwrAwMLClhQKwATCwpbNAVIaCgzCwpYJCsAIwsKWCQrAwMLClgMOC8DCwg==
====catalogjs annotation end====*/