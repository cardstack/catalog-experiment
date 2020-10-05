import { default as createCompounder } from "./dist/19.js";


/**
 * Converts `string` to
 * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the kebab cased string.
 * @example
 *
 * _.kebabCase('Foo Bar');
 * // => 'foo-bar'
 *
 * _.kebabCase('fooBar');
 * // => 'foo-bar'
 *
 * _.kebabCase('__FOO_BAR__');
 * // => 'foo-bar'
 */

var kebabCase = createCompounder(function (result, word, index) {
  return result + (index ? '-' : '') + word.toLowerCase();
});
const _default = (kebabCase);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMTkuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DsCRkw7AwoOwY3JlYXRlQ29tcG91bmRlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpa2ViYWJDYXNlm6FskbBjcmVhdGVDb21wb3VuZGVywgYJkgcIwMDAwJGwY3JlYXRlQ29tcG91bmRlcqhfZGVmYXVsdJuhbJGpa2ViYWJDYXNlwgvAkgwNwMDAwJCflgAAAcDCw5YAFwIFwsKWCQADwMLClgsQwMDCwpYAEMDAwsKWzQHCAQYKwsKWBAAHwMLClgAJwAnCwpYECcDAwsKWA18EwMLClgEBCw7CwpYGAQzAwsKWAAjACMLClgkIwMDCwpYBDg3AwsI=
====catalogjs annotation end====*/