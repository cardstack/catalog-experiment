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

const _default = (startsWith);
export { _default as default };
/*====catalogjs annotation start====
lZSTwq0uL2Rpc3QvMTQ4LmpzAZPCrC4vZGlzdC8yMi5qcwWTwq4uL3RvSW50ZWdlci5qcwmTwq0uL3RvU3RyaW5nLmpzDYGnZGVmYXVsdJShbKhfZGVmYXVsdBjAkZMYwMKGqWJhc2VDbGFtcJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsYmFzZVRvU3RyaW5nm6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgrAkgsMwALAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIOwJIPEMADwKdkZWZhdWx0kKpzdGFydHNXaXRom6FslKh0b1N0cmluZ6liYXNlQ2xhbXCpdG9JbnRlZ2VyrGJhc2VUb1N0cmluZ8IRwJISE8DAwMCQqF9kZWZhdWx0m6FskapzdGFydHNXaXRowhXAkhYXwMDAwJDcABmWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLCli4JwAzCwpYBFwYJwsKWCQAHwMLClgsMwMDCwpYqDMDAwsKWARkKDcLClgkAC8DCwpYLCcDAwsKWAQnACMLClgEYDhHCwpYJAA/AwsKWCwjAwMLCligIwATCwpbNAidQEhTCwpYJCsAQwsKWBArAwMLClgIBFRjCwpYGARbAwsKWAAjAE8LClgkIwMDCwpYBDhfAwsI=
====catalogjs annotation end====*/