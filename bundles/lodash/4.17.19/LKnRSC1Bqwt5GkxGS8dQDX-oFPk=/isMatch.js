import { default as baseIsMatch } from "./dist/42.js";
import { default as getMatchData } from "./dist/72.js";



/**
 * Performs a partial deep comparison between `object` and `source` to
 * determine if `object` contains equivalent property values.
 *
 * **Note:** This method is equivalent to `_.matches` when `source` is
 * partially applied.
 *
 * Partial comparisons will match empty array and empty object `source`
 * values against any array or object value, respectively. See `_.isEqual`
 * for a list of supported value comparisons.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 *
 * _.isMatch(object, { 'b': 2 });
 * // => true
 *
 * _.isMatch(object, { 'b': 1 });
 * // => false
 */

function isMatch(object, source) {
  return object === source || baseIsMatch(object, source, getMatchData(source));
}

const _default = (isMatch);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNDIuanMBk8KsLi9kaXN0LzcyLmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKEq2Jhc2VJc01hdGNom6FpkMICwJIDBMAAwKdkZWZhdWx0kKxnZXRNYXRjaERhdGGboWmQwgbAkgcIwAHAp2RlZmF1bHSQp2lzTWF0Y2iboWySq2Jhc2VJc01hdGNorGdldE1hdGNoRGF0YcIJwJIKC8DAwMCQqF9kZWZhdWx0m6Fskadpc01hdGNowg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwvAwMLCljELwAjCwpYBFwYJwsKWCQAHwMLClgsMwMDCwpYRDMDAwsKWzQNNDAoMwsKWCQfABMLClgQHwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/