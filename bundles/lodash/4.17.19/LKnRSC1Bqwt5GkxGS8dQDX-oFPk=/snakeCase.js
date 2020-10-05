import { default as createCompounder } from "./dist/19.js";


/**
 * Converts `string` to
 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the snake cased string.
 * @example
 *
 * _.snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * _.snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * _.snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 */

var snakeCase = createCompounder(function (result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});
const _default = (snakeCase);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMTkuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DsCRkw7AwoOwY3JlYXRlQ29tcG91bmRlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpc25ha2VDYXNlm6FskbBjcmVhdGVDb21wb3VuZGVywgYJkgcIwMDAwJGwY3JlYXRlQ29tcG91bmRlcqhfZGVmYXVsdJuhbJGpc25ha2VDYXNlwgvAkgwNwMDAwJCflgAAAcDCw5YAFwIFwsKWCQADwMLClgsQwMDCwpYAEMDAwsKWzQGtAQYKwsKWBAAHwMLClgAJwAnCwpYECcDAwsKWA18EwMLClgEBCw7CwpYGAQzAwsKWAAjACMLClgkIwMDCwpYBDg3AwsI=
====catalogjs annotation end====*/