import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";





/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeCeil = Math.ceil,
    nativeFloor = Math.floor;
/**
 * Pads `string` on the left and right sides if it's shorter than `length`.
 * Padding characters are truncated if they can't be evenly divided by `length`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.pad('abc', 8);
 * // => '  abc   '
 *
 * _.pad('abc', 8, '_-');
 * // => '_-abc_-_'
 *
 * _.pad('abc', 3);
 * // => 'abc'
 */

function pad(string, length, chars) {
  string = toString(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;

  if (!length || strLength >= length) {
    return string;
  }

  var mid = (length - strLength) / 2;
  return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
}

const _default = (pad);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvMjEuanMBk8KtLi9kaXN0LzE0NC5qcwaTwq4uL3RvSW50ZWdlci5qcwqTwq0uL3RvU3RyaW5nLmpzDoGnZGVmYXVsdJShbKhfZGVmYXVsdCLAkZMiwMKIrWNyZWF0ZVBhZGRpbmeboWmQwgLAkwMEBcAAwKdkZWZhdWx0kKpzdHJpbmdTaXplm6FpkMIHwJIICcABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgvAkgwNwALAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIPwJIQEcADwKdkZWZhdWx0kKpuYXRpdmVDZWlsm6FskaRNYXRowhMWkhQVwMDAwJCrbmF0aXZlRmxvb3KboWyRpE1hdGjCFxqSGBnAwMDAkKNwYWSboWyWqHRvU3RyaW5nqXRvSW50ZWdlcqpzdHJpbmdTaXplrWNyZWF0ZVBhZGRpbmerbmF0aXZlRmxvb3KqbmF0aXZlQ2VpbMIbwJIcHcDAwMCQqF9kZWZhdWx0m6FskaNwYWTCH8CSICHAwMDAkNwAI5YAAAHAwsOWABcCBsLClgkAA8DCwpYLDcDAwsKWfg3AGcLClhkNwBXCwpYBGAcKwsKWCQAIwMLClgsKwMDCwpYlCsAEwsKWARkLDsLClgkADMDCwpYLCcDAwsKWFQnACcLClgEYDxLCwpYJABDAwsKWCwjAwMLCliUIwA3CwpZgARMbwsKWBAAUF8LClgAKwBbCwpYBCsDAwsKWAwnAwMLClgYAGMDCwpYAC8AawsKWAQvABcLClgMKwMDCwpbNAkUQHB7CwpYJA8ARwsKWBAPAwMLClgIBHyLCwpYGASDAwsKWAAjAHcLClgkIwMDCwpYBDiHAwsI=
====catalogjs annotation end====*/