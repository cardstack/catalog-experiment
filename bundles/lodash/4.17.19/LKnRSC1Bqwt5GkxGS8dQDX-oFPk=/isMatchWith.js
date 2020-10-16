import { default as baseIsMatch } from "./dist/42.js";
import { default as getMatchData } from "./dist/72.js";



/**
 * This method is like `_.isMatch` except that it accepts `customizer` which
 * is invoked to compare values. If `customizer` returns `undefined`, comparisons
 * are handled by the method instead. The `customizer` is invoked with five
 * arguments: (objValue, srcValue, index|key, object, source).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 * @example
 *
 * function isGreeting(value) {
 *   return /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue, srcValue) {
 *   if (isGreeting(objValue) && isGreeting(srcValue)) {
 *     return true;
 *   }
 * }
 *
 * var object = { 'greeting': 'hello' };
 * var source = { 'greeting': 'hi' };
 *
 * _.isMatchWith(object, source, customizer);
 * // => true
 */

function isMatchWith(object, source, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseIsMatch(object, source, getMatchData(source), customizer);
}


export { isMatchWith as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNDIuanMBwsCVwqwuL2Rpc3QvNzIuanMFwsCBp2RlZmF1bHSUoWyraXNNYXRjaFdpdGgMwJGTDMDAg6tiYXNlSXNNYXRjaJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsZ2V0TWF0Y2hEYXRhm6FpkMIGwJIHCMABwKdkZWZhdWx0kKtpc01hdGNoV2l0aJuhbJKrYmFzZUlzTWF0Y2isZ2V0TWF0Y2hEYXRhwgnAkgoLwMDAwJCdlgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpZxC8AIwsKWARcGCcLClgkAB8DCwpYLDMDAwsKWEQzAwMLCls0D9BgKDMLClgkLwATCwpYJC8DAwsKWAw4LwMLC
====catalogjs annotation end====*/