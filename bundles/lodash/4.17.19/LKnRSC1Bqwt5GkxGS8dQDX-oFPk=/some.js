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

function baseSome(collection, predicate) {
  var result;
  baseEach(collection, function (value, index, collection) {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}








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


export { some as default };
/*====catalogjs annotation start====
lZWVwq0uL2Rpc3QvMTUxLmpzAcLAlcKrLi9kaXN0LzYuanMFwsCVwqwuL2Rpc3QvNzUuanMJwsCVwqwuL2lzQXJyYXkuanMNwsCVwqwuL2Rpc3QvNzAuanMRwsCBp2RlZmF1bHSUoWykc29tZRvAkZMbwMCHqWFycmF5U29tZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKhiYXNlRWFjaJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCnaXNBcnJheZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCuaXNJdGVyYXRlZUNhbGyboWmQwhLAkhMUwATAp2RlZmF1bHSQqGJhc2VTb21lm6FskahiYXNlRWFjaMIVwJIWF5LZV2h0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlU29tZS5qc6dkZWZhdWx0wMDAkKRzb21lm6Fsladpc0FycmF5qWFycmF5U29tZahiYXNlU29tZa5pc0l0ZXJhdGVlQ2FsbKxiYXNlSXRlcmF0ZWXCGMCSGRrAwMDAkNwAHJYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWDwnAF8LClgEWBgnCwpYJAAfAwsKWCwzAwMLCllwMwMDCwpYBFwoNwsKWCQALwMLClgsIwMDCwpYqCMDAwsKWARcOEcLClgkAD8DCwpYLB8DAwsKWLgfABMLClgEXEhXCwpYJABPAwsKWCw7AwMLClhIOwAjCwpbNAVTMkxYYwsKWCQjADMLClgMIwBTCwpbNBGUSGRvCwpYJBMAQwsKWCQTAwMLClgMOGsDCwg==
====catalogjs annotation end====*/