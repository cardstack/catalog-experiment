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

export { snakeCase as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMTkuanMBwsCBp2RlZmF1bHSUoWypc25ha2VDYXNlCsCRkwrAwIKwY3JlYXRlQ29tcG91bmRlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpc25ha2VDYXNlm6FskbBjcmVhdGVDb21wb3VuZGVywgYJkgcIwMDAwJGwY3JlYXRlQ29tcG91bmRlcpuWAAABwMLDlgAXAgXCwpYJAAPAwsKWCxDAwMLClgAQwMDCwpbNAa0BBgrCwpYEAAfAwsKWAAnACcLClgkJwMDCwpYDXwTAwsKWAg4IwMLC
====catalogjs annotation end====*/