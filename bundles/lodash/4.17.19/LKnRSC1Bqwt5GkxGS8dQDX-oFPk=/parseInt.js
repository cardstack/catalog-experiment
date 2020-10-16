import { default as root } from "./dist/93.js";
import { default as toString } from "./toString.js";



/** Used to match leading and trailing whitespace. */

var reTrimStart = /^\s+/;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeParseInt = root.parseInt;
/**
 * Converts `string` to an integer of the specified radix. If `radix` is
 * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
 * hexadecimal, in which case a `radix` of `16` is used.
 *
 * **Note:** This method aligns with the
 * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category String
 * @param {string} string The string to convert.
 * @param {number} [radix=10] The radix to interpret `value` by.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.parseInt('08');
 * // => 8
 *
 * _.map(['6', '08', '10'], _.parseInt);
 * // => [6, 8, 10]
 */

function parseInt(string, radix, guard) {
  if (guard || radix == null) {
    radix = 0;
  } else if (radix) {
    radix = +radix;
  }

  return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
}


export { parseInt as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvOTMuanMBwsCVwq0uL3RvU3RyaW5nLmpzBcLAgadkZWZhdWx0lKFsqHBhcnNlSW50FsCRkxbAwIWkcm9vdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCodG9TdHJpbmeboWmQwgbAkgcIwAHAp2RlZmF1bHSQq3JlVHJpbVN0YXJ0m6FskMIKDZILDMDAwMCQrm5hdGl2ZVBhcnNlSW50m6FskaRyb290wg8SkhARwMDAwJGkcm9vdKhwYXJzZUludJuhbJOubmF0aXZlUGFyc2VJbnSodG9TdHJpbmercmVUcmltU3RhcnTCE8CSFBXAwMDAkNwAF5YAAAHAwsOWABcCBcLClgkAA8DCwpYLBMDAwsKWAATAwMLClgEYBgnCwpYJAAfAwsKWCwjAwMLClgEIwAzCwpY7AQoOwsKWBAALwMLClgALwA3CwpYRC8DAwsKWAwbAwMLCllsBDxPCwpYEABDAwsKWAA7AEsLClsyADsAIwsKWAwkEwMLCls0C7RUUFsLClgkIwBHCwpYJCMDAwsKWAw4VwMLC
====catalogjs annotation end====*/