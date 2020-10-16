import { default as baseClamp } from "./dist/148.js";
import { default as baseToString } from "./dist/22.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";





/**
 * Checks if `string` starts with the given target string.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {string} [target] The string to search for.
 * @param {number} [position=0] The position to search from.
 * @returns {boolean} Returns `true` if `string` starts with `target`,
 *  else `false`.
 * @example
 *
 * _.startsWith('abc', 'a');
 * // => true
 *
 * _.startsWith('abc', 'b');
 * // => false
 *
 * _.startsWith('abc', 'b', 1);
 * // => true
 */

function startsWith(string, target, position) {
  string = toString(string);
  position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
  target = baseToString(target);
  return string.slice(position, position + target.length) == target;
}


export { startsWith as default };
/*====catalogjs annotation start====
lZSVwq0uL2Rpc3QvMTQ4LmpzAcLAlcKsLi9kaXN0LzIyLmpzBcLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDcLAgadkZWZhdWx0lKFsqnN0YXJ0c1dpdGgUwJGTFMDAhaliYXNlQ2xhbXCboWmQwgLAkgMEwADAp2RlZmF1bHSQrGJhc2VUb1N0cmluZ5uhaZDCBsCSBwjAAcCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIKwJILDMACwKdkZWZhdWx0kKh0b1N0cmluZ5uhaZDCDsCSDxDAA8CnZGVmYXVsdJCqc3RhcnRzV2l0aJuhbJSodG9TdHJpbmepYmFzZUNsYW1wqXRvSW50ZWdlcqxiYXNlVG9TdHJpbmfCEcCSEhPAwMDAkNwAFZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWLgnADMLClgEXBgnCwpYJAAfAwsKWCwzAwMLClioMwMDCwpYBGQoNwsKWCQALwMLClgsJwMDCwpYBCcAIwsKWARgOEcLClgkAD8DCwpYLCMDAwsKWKAjABMLCls0CJ1ASFMLClgkKwBDCwpYJCsDAwsKWAw4TwMLC
====catalogjs annotation end====*/