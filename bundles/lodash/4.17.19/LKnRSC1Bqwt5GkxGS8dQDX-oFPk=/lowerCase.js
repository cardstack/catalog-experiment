import { default as createCompounder } from "./dist/19.js";


/**
 * Converts `string`, as space separated words, to lower case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the lower cased string.
 * @example
 *
 * _.lowerCase('--Foo-Bar--');
 * // => 'foo bar'
 *
 * _.lowerCase('fooBar');
 * // => 'foo bar'
 *
 * _.lowerCase('__FOO_BAR__');
 * // => 'foo bar'
 */

var lowerCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + word.toLowerCase();
});

export { lowerCase as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMTkuanMBwsCBp2RlZmF1bHSUoWypbG93ZXJDYXNlCsCRkwrAwIKwY3JlYXRlQ29tcG91bmRlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpbG93ZXJDYXNlm6FskbBjcmVhdGVDb21wb3VuZGVywgYJkgcIwMDAwJGwY3JlYXRlQ29tcG91bmRlcpuWAAABwMLDlgAXAgXCwpYJAAPAwsKWCxDAwMLClgAQwMDCwpbNAZ0BBgrCwpYEAAfAwsKWAAnACcLClgkJwMDCwpYDXwTAwsKWAg4IwMLC
====catalogjs annotation end====*/