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

const _default = (iteratee);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNDAuanMBk8KrLi9kaXN0LzYuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0FMCRkxTAwoWpYmFzZUNsb25lm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwgbAkgcIwAHAp2RlZmF1bHSQr0NMT05FX0RFRVBfRkxBR5uhbJDCCsCSCwzAwMDAkKhpdGVyYXRlZZuhbJOsYmFzZUl0ZXJhdGVlqWJhc2VDbG9uZa9DTE9ORV9ERUVQX0ZMQUfCDcCSDg/AwMDAkKhfZGVmYXVsdJuhbJGoaXRlcmF0ZWXCEcCSEhPAwMDAkNwAFZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCcDAwsKWJAnADMLClgEWBgnCwpYJAAfAwsKWCwzAwMLClhIMwATCwpYyAQoNwsKWBAQLwMLClgAPwMDCwpYHD8DAwsKWzQVyBQ4QwsKWCQjACMLClgQIwMDCwpYCAREUwsKWBgESwMLClgAIwA/CwpYJCMDAwsKWAQ4TwMLC
====catalogjs annotation end====*/