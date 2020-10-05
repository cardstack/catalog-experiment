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

const _default = (endsWith);
export { _default as default };
/*====catalogjs annotation start====
lZSTwq0uL2Rpc3QvMTQ4LmpzAZPCrC4vZGlzdC8yMi5qcwWTwq4uL3RvSW50ZWdlci5qcwmTwq0uL3RvU3RyaW5nLmpzDYGnZGVmYXVsdJShbKhfZGVmYXVsdBjAkZMYwMKGqWJhc2VDbGFtcJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsYmFzZVRvU3RyaW5nm6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgrAkgsMwALAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIOwJIPEMADwKdkZWZhdWx0kKhlbmRzV2l0aJuhbJSodG9TdHJpbmesYmFzZVRvU3RyaW5nqWJhc2VDbGFtcKl0b0ludGVnZXLCEcCSEhPAwMDAkKhfZGVmYXVsdJuhbJGoZW5kc1dpdGjCFcCSFhfAwMDAkNwAGZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWVwnADMLClgEXBgnCwpYJAAfAwsKWCwzAwMLClhUMwATCwpYBGQoNwsKWCQALwMLClgsJwMDCwpYBCcDAwsKWARgOEcLClgkAD8DCwpYLCMDAwsKWKAjACMLCls0CKsyNEhTCwpYJCMAQwsKWBAjAwMLClgIBFRjCwpYGARbAwsKWAAjAE8LClgkIwMDCwpYBDhfAwsI=
====catalogjs annotation end====*/