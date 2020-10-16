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

export { startCase as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvMTkuanMBwsCVwq8uL3VwcGVyRmlyc3QuanMFwsCBp2RlZmF1bHSUoWypc3RhcnRDYXNlDsCRkw7AwIOwY3JlYXRlQ29tcG91bmRlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqdXBwZXJGaXJzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpc3RhcnRDYXNlm6FskrBjcmVhdGVDb21wb3VuZGVyqnVwcGVyRmlyc3TCCg2SCwzAwMDAkrBjcmVhdGVDb21wb3VuZGVyqnVwcGVyRmlyc3SflgAAAcDCw5YAFwIFwsKWCQADwMLClgsQwMDCwpYAEMAIwsKWARoGCcLClgkAB8DCwpYLCsDAwsKWSQrAwMLCls0B0gEKDsLClgQAC8DCwpYACcANwsKWCQnAwMLClgMKBMDCwpYCDgzAwsI=
====catalogjs annotation end====*/