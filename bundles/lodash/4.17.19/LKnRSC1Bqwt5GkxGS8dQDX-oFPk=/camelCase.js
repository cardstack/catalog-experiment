import { default as capitalize } from "./capitalize.js";
import { default as createCompounder } from "./dist/19.js";



/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * _.camelCase('__FOO_BAR__');
 * // => 'fooBar'
 */

var camelCase = createCompounder(function (result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});
const _default = (camelCase);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq8uL2NhcGl0YWxpemUuanMBk8KsLi9kaXN0LzE5LmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBLAkZMSwMKEqmNhcGl0YWxpemWboWmQwgLAkgMEwADAp2RlZmF1bHSQsGNyZWF0ZUNvbXBvdW5kZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWNhbWVsQ2FzZZuhbJKwY3JlYXRlQ29tcG91bmRlcqpjYXBpdGFsaXplwgoNkgsMwMDAwJKqY2FwaXRhbGl6ZbBjcmVhdGVDb21wb3VuZGVyqF9kZWZhdWx0m6FskaljYW1lbENhc2XCD8CSEBHAwMDAkNwAE5YAAAHAwsOWABoCBcLClgkAA8DCwpYLCsDAwsKWWgrAwMLClgEXBgnCwpYJAAfAwsKWCxDAwMLClgAQwATCwpbNAawBCg7CwpYEAAvAwsKWAAnADcLClgQJwMDCwpYDEgjAwsKWAQEPEsLClgYBEMDCwpYACMAMwsKWCQjAwMLClgEOEcDCwg==
====catalogjs annotation end====*/