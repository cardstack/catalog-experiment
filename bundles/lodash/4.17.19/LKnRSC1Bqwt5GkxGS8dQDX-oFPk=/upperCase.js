import { default as createCompounder } from "./dist/19.js";


/**
 * Converts `string`, as space separated words, to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the upper cased string.
 * @example
 *
 * _.upperCase('--foo-bar');
 * // => 'FOO BAR'
 *
 * _.upperCase('fooBar');
 * // => 'FOO BAR'
 *
 * _.upperCase('__foo_bar__');
 * // => 'FOO BAR'
 */

var upperCase = createCompounder(function (result, word, index) {
  return result + (index ? ' ' : '') + word.toUpperCase();
});

export { upperCase as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMTkuanMBwsCBp2RlZmF1bHSUoWypdXBwZXJDYXNlCsCRkwrAwIKwY3JlYXRlQ29tcG91bmRlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpdXBwZXJDYXNlm6FskbBjcmVhdGVDb21wb3VuZGVywgYJkgcIwMDAwJGwY3JlYXRlQ29tcG91bmRlcpuWAAABwMLDlgAXAgXCwpYJAAPAwsKWCxDAwMLClgAQwMDCwpbNAZsBBgrCwpYEAAfAwsKWAAnACcLClgkJwMDCwpYDXwTAwsKWAg4IwMLC
====catalogjs annotation end====*/