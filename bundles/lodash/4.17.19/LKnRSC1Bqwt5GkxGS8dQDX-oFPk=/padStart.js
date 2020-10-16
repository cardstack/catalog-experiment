import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";





/**
 * Pads `string` on the left side if it's shorter than `length`. Padding
 * characters are truncated if they exceed `length`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.padStart('abc', 6);
 * // => '   abc'
 *
 * _.padStart('abc', 6, '_-');
 * // => '_-_abc'
 *
 * _.padStart('abc', 3);
 * // => 'abc'
 */

function padStart(string, length, chars) {
  string = toString(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;
  return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
}


export { padStart as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvMjEuanMBwsCVwq0uL2Rpc3QvMTQ0LmpzBcLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDcLAgadkZWZhdWx0lKFsqHBhZFN0YXJ0FMCRkxTAwIWtY3JlYXRlUGFkZGluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCqc3RyaW5nU2l6ZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIKwJILDMACwKdkZWZhdWx0kKh0b1N0cmluZ5uhaZDCDsCSDxDAA8CnZGVmYXVsdJCocGFkU3RhcnSboWyUqHRvU3RyaW5nqXRvSW50ZWdlcqpzdHJpbmdTaXplrWNyZWF0ZVBhZGRpbmfCEcCSEhPAwMDAkNwAFZYAAAHAwsOWABcCBcLClgkAA8DCwpYLDcDAwsKWNg3AwMLClgEYBgnCwpYJAAfAwsKWCwrAwMLCliUKwATCwpYBGQoNwsKWCQALwMLClgsJwMDCwpYVCcAIwsKWARgOEcLClgkAD8DCwpYLCMDAwsKWJQjADMLCls0CNjASFMLClgkIwBDCwpYJCMDAwsKWAw4TwMLC
====catalogjs annotation end====*/