import { default as arraySome } from "./dist/151.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseEach } from "./dist/75.js";
import { default as isArray } from "./isArray.js";
import { default as isIterateeCall } from "./dist/70.js";


/**
 * The base implementation of `_.some` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */

function baseSome0(collection, predicate) {
  var result;
  baseEach(collection, function (value, index, collection) {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}

const baseSome = (baseSome0);






/**
 * Checks if `predicate` returns truthy for **any** element of `collection`.
 * Iteration is stopped once `predicate` returns truthy. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 * @example
 *
 * _.some([null, 0, 'yes', false], Boolean);
 * // => true
 *
 * var users = [
 *   { 'user': 'barney', 'active': true },
 *   { 'user': 'fred',   'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.some(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.some(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.some(users, 'active');
 * // => true
 */

function some(collection, predicate, guard) {
  var func = isArray(collection) ? arraySome : baseSome;

  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }

  return func(collection, baseIteratee(predicate, 3));
}

const _default = (some);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTUxLmpzAZPCqy4vZGlzdC82LmpzBZPCrC4vZGlzdC83NS5qcwmTwqwuL2lzQXJyYXkuanMNk8KsLi9kaXN0LzcwLmpzEYGnZGVmYXVsdJShbKhfZGVmYXVsdCPAkZMjwMKJqWFycmF5U29tZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKhiYXNlRWFjaJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCnaXNBcnJheZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCuaXNJdGVyYXRlZUNhbGyboWmQwhLAkhMUwATAp2RlZmF1bHSQqWJhc2VTb21lMJuhbJGoYmFzZUVhY2jCFcCSFhfAwMDAkKhiYXNlU29tZZuhbJGpYmFzZVNvbWUwwhnAkhobktlXaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Jhc2VTb21lLmpzp2RlZmF1bHTAwMCQpHNvbWWboWyVp2lzQXJyYXmpYXJyYXlTb21lqGJhc2VTb21lrmlzSXRlcmF0ZWVDYWxsrGJhc2VJdGVyYXRlZcIcwJIdHsDAwMCQqF9kZWZhdWx0m6FskaRzb21lwiDAkiEiwMDAwJDcACSWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLClg8JwBvCwpYBFgYJwsKWCQAHwMLClgsMwMDCwpZcDMDAwsKWARcKDcLClgkAC8DCwpYLCMDAwsKWKgjAwMLClgEXDhHCwpYJAA/AwsKWCwfAwMLCli4HwATCwpYBFxIVwsKWCQATwMLClgsOwMDCwpYSDsAIwsKWzQFUzJMWGMLClgkJwAzCwpYECcDAwsKWAgEZHMLClgYBGsDCwpYACMAXwsKWAwjAFMLCls0EYxIdH8LClgkEwBDCwpYEBMDAwsKWAgEgI8LClgYBIcDCwpYACMAewsKWCQjAwMLClgEOIsDCwg==
====catalogjs annotation end====*/