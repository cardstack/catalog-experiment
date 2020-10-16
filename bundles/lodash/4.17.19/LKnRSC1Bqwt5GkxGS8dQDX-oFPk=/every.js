import { default as arrayEvery } from "./dist/163.js";
import { default as baseEach } from "./dist/75.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
import { default as isIterateeCall } from "./dist/70.js";


/**
 * The base implementation of `_.every` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`
 */

function baseEvery(collection, predicate) {
  var result = true;
  baseEach(collection, function (value, index, collection) {
    result = !!predicate(value, index, collection);
    return result;
  });
  return result;
}








/**
 * Checks if `predicate` returns truthy for **all** elements of `collection`.
 * Iteration is stopped once `predicate` returns falsey. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * **Note:** This method returns `true` for
 * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
 * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
 * elements of empty collections.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 * @example
 *
 * _.every([true, 1, null, 'yes'], Boolean);
 * // => false
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.every(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.every(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.every(users, 'active');
 * // => false
 */

function every(collection, predicate, guard) {
  var func = isArray(collection) ? arrayEvery : baseEvery;

  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }

  return func(collection, baseIteratee(predicate, 3));
}


export { every as default };
/*====catalogjs annotation start====
lZWVwq0uL2Rpc3QvMTYzLmpzAcLAlcKsLi9kaXN0Lzc1LmpzBcLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2lzQXJyYXkuanMNwsCVwqwuL2Rpc3QvNzAuanMRwsCBp2RlZmF1bHSUoWylZXZlcnkbwJGTG8DAh6phcnJheUV2ZXJ5m6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlRWFjaJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMIKwJILDMACwKdkZWZhdWx0kKdpc0FycmF5m6FpkMIOwJIPEMADwKdkZWZhdWx0kK5pc0l0ZXJhdGVlQ2FsbJuhaZDCEsCSExTABMCnZGVmYXVsdJCpYmFzZUV2ZXJ5m6FskahiYXNlRWFjaMIVwJIWF5LZWGh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlRXZlcnkuanOnZGVmYXVsdMDAwJClZXZlcnmboWyVp2lzQXJyYXmqYXJyYXlFdmVyealiYXNlRXZlcnmuaXNJdGVyYXRlZUNhbGysYmFzZUl0ZXJhdGVlwhjAkhkawMDAwJDcAByWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwrAwMLClg8KwBfCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpYxCMDAwsKWARYKDcLClgkAC8DCwpYLDMDAwsKWXAzAwMLClgEXDhHCwpYJAA/AwsKWCwfAwMLCli4HwATCwpYBFxIVwsKWCQATwMLClgsOwMDCwpYSDsAMwsKWzQFTzJIWGMLClgkJwAjCwpYDCcAUwsKWzQViEhkbwsKWCQXAEMLClgkFwMDCwpYDDhrAwsI=
====catalogjs annotation end====*/