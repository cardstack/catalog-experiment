import { default as baseClone } from "./dist/40.js";
import { default as baseMatchesProperty } from "./dist/7.js";



/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG = 1;
/**
 * Creates a function that performs a partial deep comparison between the
 * value at `path` of a given object to `srcValue`, returning `true` if the
 * object value is equivalent, else `false`.
 *
 * **Note:** Partial comparisons will match empty array and empty object
 * `srcValue` values against any array or object value, respectively. See
 * `_.isEqual` for a list of supported value comparisons.
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * var objects = [
 *   { 'a': 1, 'b': 2, 'c': 3 },
 *   { 'a': 4, 'b': 5, 'c': 6 }
 * ];
 *
 * _.find(objects, _.matchesProperty('a', 4));
 * // => { 'a': 4, 'b': 5, 'c': 6 }
 */

function matchesProperty(path, srcValue) {
  return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
}

const _default = (matchesProperty);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNDAuanMBk8KrLi9kaXN0LzcuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0FMCRkxTAwoWpYmFzZUNsb25lm6FpkMICwJIDBMAAwKdkZWZhdWx0kLNiYXNlTWF0Y2hlc1Byb3BlcnR5m6FpkMIGwJIHCMABwKdkZWZhdWx0kK9DTE9ORV9ERUVQX0ZMQUeboWyQwgrAkgsMwMDAwJCvbWF0Y2hlc1Byb3BlcnR5m6Fsk7NiYXNlTWF0Y2hlc1Byb3BlcnR5qWJhc2VDbG9uZa9DTE9ORV9ERUVQX0ZMQUfCDcCSDg/AwMDAkKhfZGVmYXVsdJuhbJGvbWF0Y2hlc1Byb3BlcnR5whHAkhITwMDAwJDcABWWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwnAwMLClgcJwAzCwpYBFgYJwsKWCQAHwMLClgsTwMDCwpYcE8AEwsKWMgEKDcLClgQEC8DCwpYAD8DAwsKWCw/AwMLCls0DOwUOEMLClgkPwAjCwpYED8DAwsKWAgERFMLClgYBEsDCwpYACMAPwsKWCQjAwMLClgEOE8DCwg==
====catalogjs annotation end====*/