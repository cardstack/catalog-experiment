import { default as baseClone } from "./dist/40.js";
import { default as baseMatches } from "./dist/41.js";



/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG = 1;
/**
 * Creates a function that performs a partial deep comparison between a given
 * object and `source`, returning `true` if the given object has equivalent
 * property values, else `false`.
 *
 * **Note:** The created function is equivalent to `_.isMatch` with `source`
 * partially applied.
 *
 * Partial comparisons will match empty array and empty object `source`
 * values against any array or object value, respectively. See `_.isEqual`
 * for a list of supported value comparisons.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * var objects = [
 *   { 'a': 1, 'b': 2, 'c': 3 },
 *   { 'a': 4, 'b': 5, 'c': 6 }
 * ];
 *
 * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
 * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
 */

function matches(source) {
  return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
}


export { matches as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNDAuanMBwsCVwqwuL2Rpc3QvNDEuanMFwsCBp2RlZmF1bHSUoWynbWF0Y2hlcxDAkZMQwMCEqWJhc2VDbG9uZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCrYmFzZU1hdGNoZXOboWmQwgbAkgcIwAHAp2RlZmF1bHSQr0NMT05FX0RFRVBfRkxBR5uhbJDCCsCSCwzAwMDAkKdtYXRjaGVzm6Fsk6tiYXNlTWF0Y2hlc6liYXNlQ2xvbmWvQ0xPTkVfREVFUF9GTEFHwg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwnAwMLClgEJwAzCwpYBFwYJwsKWCQAHwMLClgsLwMDCwpYUC8AEwsKWMgEKDcLClgQEC8DCwpYAD8DAwsKWCQ/AwMLCls0DbgUOEMLClgkHwAjCwpYJB8DAwsKWAw4PwMLC
====catalogjs annotation end====*/