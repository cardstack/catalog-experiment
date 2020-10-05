import { default as toString } from "./toString.js";


/**
 * Converts `string`, as a whole, to lower case just like
 * [String#toLowerCase](https://mdn.io/toLowerCase).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the lower cased string.
 * @example
 *
 * _.toLower('--Foo-Bar--');
 * // => '--foo-bar--'
 *
 * _.toLower('fooBar');
 * // => 'foobar'
 *
 * _.toLower('__FOO_BAR__');
 * // => '__foo_bar__'
 */

function toLower(value) {
  return toString(value).toLowerCase();
}

const _default = (toLower);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq0uL3RvU3RyaW5nLmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdAzAkZMMwMKDqHRvU3RyaW5nm6FpkMICwJIDBMAAwKdkZWZhdWx0kKd0b0xvd2Vym6Fskah0b1N0cmluZ8IFwJIGB8DAwMCQqF9kZWZhdWx0m6Fskad0b0xvd2VywgnAkgoLwMDAwJCdlgAAAcDCw5YAGAIFwsKWCQADwMLClgsIwMDCwpYTCMDAwsKWzQHOGAYIwsKWCQfABMLClgQHwMDCwpYCAQkMwsKWBgEKwMLClgAIwAfCwpYJCMDAwsKWAQ4LwMLC
====catalogjs annotation end====*/