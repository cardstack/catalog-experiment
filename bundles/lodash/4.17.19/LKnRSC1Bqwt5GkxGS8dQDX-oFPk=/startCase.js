import { default as createCompounder } from "./dist/19.js";
import { default as upperFirst } from "./upperFirst.js";



/**
 * Converts `string` to
 * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
 *
 * @static
 * @memberOf _
 * @since 3.1.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the start cased string.
 * @example
 *
 * _.startCase('--foo-bar--');
 * // => 'Foo Bar'
 *
 * _.startCase('fooBar');
 * // => 'Foo Bar'
 *
 * _.startCase('__FOO_BAR__');
 * // => 'FOO BAR'
 */

var startCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + upperFirst(word);
});
const _default = (startCase);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvMTkuanMBk8KvLi91cHBlckZpcnN0LmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBLAkZMSwMKEsGNyZWF0ZUNvbXBvdW5kZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQqnVwcGVyRmlyc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQqXN0YXJ0Q2FzZZuhbJKwY3JlYXRlQ29tcG91bmRlcqp1cHBlckZpcnN0wgoNkgsMwMDAwJKwY3JlYXRlQ29tcG91bmRlcqp1cHBlckZpcnN0qF9kZWZhdWx0m6FskalzdGFydENhc2XCD8CSEBHAwMDAkNwAE5YAAAHAwsOWABcCBcLClgkAA8DCwpYLEMDAwsKWABDACMLClgEaBgnCwpYJAAfAwsKWCwrAwMLClkkKwMDCwpbNAdIBCg7CwpYEAAvAwsKWAAnADcLClgQJwMDCwpYDCgTAwsKWAQEPEsLClgYBEMDCwpYACMAMwsKWCQjAwMLClgEOEcDCwg==
====catalogjs annotation end====*/