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


export { pad as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvMjEuanMBwsCVwq0uL2Rpc3QvMTQ0LmpzBsLAlcKuLi90b0ludGVnZXIuanMKwsCVwq0uL3RvU3RyaW5nLmpzDsLAgadkZWZhdWx0lKFso3BhZB7AkZMewMCHrWNyZWF0ZVBhZGRpbmeboWmQwgLAkwMEBcAAwKdkZWZhdWx0kKpzdHJpbmdTaXplm6FpkMIHwJIICcABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgvAkgwNwALAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIPwJIQEcADwKdkZWZhdWx0kKpuYXRpdmVDZWlsm6FskaRNYXRowhMWkhQVwMDAwJCrbmF0aXZlRmxvb3KboWyRpE1hdGjCFxqSGBnAwMDAkKNwYWSboWyWqHRvU3RyaW5nqXRvSW50ZWdlcqpzdHJpbmdTaXplrWNyZWF0ZVBhZGRpbmerbmF0aXZlRmxvb3KqbmF0aXZlQ2VpbMIbwJIcHcDAwMCQ3AAflgAAAcDCw5YAFwIGwsKWCQADwMLClgsNwMDCwpZ+DcAZwsKWGQ3AFcLClgEYBwrCwpYJAAjAwsKWCwrAwMLCliUKwATCwpYBGQsOwsKWCQAMwMLClgsJwMDCwpYVCcAJwsKWARgPEsLClgkAEMDCwpYLCMDAwsKWJQjADcLClmABExvCwpYEABQXwsKWAArAFsLClgEKwMDCwpYDCcDAwsKWBgAYwMLClgALwBrCwpYBC8AFwsKWAwrAwMLCls0CRRAcHsLClgkDwBHCwpYJA8DAwsKWAw4dwMLC
====catalogjs annotation end====*/