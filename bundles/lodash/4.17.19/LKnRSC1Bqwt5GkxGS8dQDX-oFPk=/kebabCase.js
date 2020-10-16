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

export { kebabCase as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMTkuanMBwsCBp2RlZmF1bHSUoWypa2ViYWJDYXNlCsCRkwrAwIKwY3JlYXRlQ29tcG91bmRlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpa2ViYWJDYXNlm6FskbBjcmVhdGVDb21wb3VuZGVywgYJkgcIwMDAwJGwY3JlYXRlQ29tcG91bmRlcpuWAAABwMLDlgAXAgXCwpYJAAPAwsKWCxDAwMLClgAQwMDCwpbNAcIBBgrCwpYEAAfAwsKWAAnACcLClgkJwMDCwpYDXwTAwsKWAg4IwMLC
====catalogjs annotation end====*/