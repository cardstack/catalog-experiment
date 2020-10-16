import { default as createCaseFirst } from "./dist/18.js";


/**
 * Converts the first character of `string` to lower case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.lowerFirst('Fred');
 * // => 'fred'
 *
 * _.lowerFirst('FRED');
 * // => 'fRED'
 */

var lowerFirst = createCaseFirst('toLowerCase');

export { lowerFirst as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMTguanMBwsCBp2RlZmF1bHSUoWyqbG93ZXJGaXJzdArAkZMKwMCCr2NyZWF0ZUNhc2VGaXJzdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqbG93ZXJGaXJzdJuhbJGvY3JlYXRlQ2FzZUZpcnN0wgYJkgcIwMDAwJGvY3JlYXRlQ2FzZUZpcnN0m5YAAAHAwsOWABcCBcLClgkAA8DCwpYLD8DAwsKWAA/AwMLCls0BVQEGCsLClgQAB8DCwpYACsAJwsKWCQrAwMLClgMPBMDCwpYCDgjAwsI=
====catalogjs annotation end====*/