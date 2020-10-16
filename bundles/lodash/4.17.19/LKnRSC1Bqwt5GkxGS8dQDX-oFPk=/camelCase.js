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

export { camelCase as default };
/*====catalogjs annotation start====
lZKVwq8uL2NhcGl0YWxpemUuanMBwsCVwqwuL2Rpc3QvMTkuanMFwsCBp2RlZmF1bHSUoWypY2FtZWxDYXNlDsCRkw7AwIOqY2FwaXRhbGl6ZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCwY3JlYXRlQ29tcG91bmRlcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpY2FtZWxDYXNlm6FskrBjcmVhdGVDb21wb3VuZGVyqmNhcGl0YWxpemXCCg2SCwzAwMDAkqpjYXBpdGFsaXplsGNyZWF0ZUNvbXBvdW5kZXKflgAAAcDCw5YAGgIFwsKWCQADwMLClgsKwMDCwpZaCsDAwsKWARcGCcLClgkAB8DCwpYLEMDAwsKWABDABMLCls0BrAEKDsLClgQAC8DCwpYACcANwsKWCQnAwMLClgMSCMDCwpYCDgzAwsI=
====catalogjs annotation end====*/