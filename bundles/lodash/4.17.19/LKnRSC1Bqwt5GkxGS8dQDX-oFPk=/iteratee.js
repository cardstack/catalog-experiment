import { default as baseClone } from "./dist/40.js";
import { default as baseIteratee } from "./dist/6.js";



/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG = 1;
/**
 * Creates a function that invokes `func` with the arguments of the created
 * function. If `func` is a property name, the created function returns the
 * property value for a given element. If `func` is an array or object, the
 * created function returns `true` for elements that contain the equivalent
 * source properties, otherwise it returns `false`.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Util
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @returns {Function} Returns the callback.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
 * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, _.iteratee(['user', 'fred']));
 * // => [{ 'user': 'fred', 'age': 40 }]
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, _.iteratee('user'));
 * // => ['barney', 'fred']
 *
 * // Create custom iteratee shorthands.
 * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
 *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
 *     return func.test(string);
 *   };
 * });
 *
 * _.filter(['abc', 'def'], /ef/);
 * // => ['def']
 */

function iteratee(func) {
  return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
}


export { iteratee as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNDAuanMBwsCVwqsuL2Rpc3QvNi5qcwXCwIGnZGVmYXVsdJShbKhpdGVyYXRlZRDAkZMQwMCEqWJhc2VDbG9uZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMIGwJIHCMABwKdkZWZhdWx0kK9DTE9ORV9ERUVQX0ZMQUeboWyQwgrAkgsMwMDAwJCoaXRlcmF0ZWWboWyTrGJhc2VJdGVyYXRlZaliYXNlQ2xvbmWvQ0xPTkVfREVFUF9GTEFHwg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwnAwMLCliQJwAzCwpYBFgYJwsKWCQAHwMLClgsMwMDCwpYSDMAEwsKWMgEKDcLClgQEC8DCwpYAD8DAwsKWBw/AwMLCls0FcgUOEMLClgkIwAjCwpYJCMDAwsKWAw4PwMLC
====catalogjs annotation end====*/