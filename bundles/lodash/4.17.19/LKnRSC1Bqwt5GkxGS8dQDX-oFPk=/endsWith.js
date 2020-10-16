import { default as baseClamp } from "./dist/148.js";
import { default as baseToString } from "./dist/22.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";





/**
 * Checks if `string` ends with the given target string.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {string} [target] The string to search for.
 * @param {number} [position=string.length] The position to search up to.
 * @returns {boolean} Returns `true` if `string` ends with `target`,
 *  else `false`.
 * @example
 *
 * _.endsWith('abc', 'c');
 * // => true
 *
 * _.endsWith('abc', 'b');
 * // => false
 *
 * _.endsWith('abc', 'b', 2);
 * // => true
 */

function endsWith(string, target, position) {
  string = toString(string);
  target = baseToString(target);
  var length = string.length;
  position = position === undefined ? length : baseClamp(toInteger(position), 0, length);
  var end = position;
  position -= target.length;
  return position >= 0 && string.slice(position, end) == target;
}


export { endsWith as default };
/*====catalogjs annotation start====
lZSVwq0uL2Rpc3QvMTQ4LmpzAcLAlcKsLi9kaXN0LzIyLmpzBcLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDcLAgadkZWZhdWx0lKFsqGVuZHNXaXRoFMCRkxTAwIWpYmFzZUNsYW1wm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxiYXNlVG9TdHJpbmeboWmQwgbAkgcIwAHAp2RlZmF1bHSQqXRvSW50ZWdlcpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCodG9TdHJpbmeboWmQwg7Akg8QwAPAp2RlZmF1bHSQqGVuZHNXaXRom6FslKh0b1N0cmluZ6xiYXNlVG9TdHJpbmepYmFzZUNsYW1wqXRvSW50ZWdlcsIRwJISE8DAwMCQ3AAVlgAAAcDCw5YAGAIFwsKWCQADwMLClgsJwMDCwpZXCcAMwsKWARcGCcLClgkAB8DCwpYLDMDAwsKWFQzABMLClgEZCg3CwpYJAAvAwsKWCwnAwMLClgEJwMDCwpYBGA4RwsKWCQAPwMLClgsIwMDCwpYoCMAIwsKWzQIqzI0SFMLClgkIwBDCwpYJCMDAwsKWAw4TwMLC
====catalogjs annotation end====*/