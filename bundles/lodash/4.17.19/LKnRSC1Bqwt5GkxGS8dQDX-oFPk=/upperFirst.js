import { default as createCaseFirst } from "./dist/18.js";


/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */

var upperFirst = createCaseFirst('toUpperCase');

export { upperFirst as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMTguanMBwsCBp2RlZmF1bHSUoWyqdXBwZXJGaXJzdArAkZMKwMCCr2NyZWF0ZUNhc2VGaXJzdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqdXBwZXJGaXJzdJuhbJGvY3JlYXRlQ2FzZUZpcnN0wgYJkgcIwMDAwJGvY3JlYXRlQ2FzZUZpcnN0m5YAAAHAwsOWABcCBcLClgkAA8DCwpYLD8DAwsKWAA/AwMLCls0BVQEGCsLClgQAB8DCwpYACsAJwsKWCQrAwMLClgMPBMDCwpYCDgjAwsI=
====catalogjs annotation end====*/