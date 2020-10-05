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

function baseEvery0(collection, predicate) {
  var result = true;
  baseEach(collection, function (value, index, collection) {
    result = !!predicate(value, index, collection);
    return result;
  });
  return result;
}

const baseEvery = (baseEvery0);






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

const _default = (every);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTYzLmpzAZPCrC4vZGlzdC83NS5qcwWTwqsuL2Rpc3QvNi5qcwmTwqwuL2lzQXJyYXkuanMNk8KsLi9kaXN0LzcwLmpzEYGnZGVmYXVsdJShbKhfZGVmYXVsdCPAkZMjwMKJqmFycmF5RXZlcnmboWmQwgLAkgMEwADAp2RlZmF1bHSQqGJhc2VFYWNom6FpkMIGwJIHCMABwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwgrAkgsMwALAp2RlZmF1bHSQp2lzQXJyYXmboWmQwg7Akg8QwAPAp2RlZmF1bHSQrmlzSXRlcmF0ZWVDYWxsm6FpkMISwJITFMAEwKdkZWZhdWx0kKpiYXNlRXZlcnkwm6FskahiYXNlRWFjaMIVwJIWF8DAwMCQqWJhc2VFdmVyeZuhbJGqYmFzZUV2ZXJ5MMIZwJIaG8DAwMCQpWV2ZXJ5m6Fsladpc0FycmF5qmFycmF5RXZlcnmpYmFzZUV2ZXJ5rmlzSXRlcmF0ZWVDYWxsrGJhc2VJdGVyYXRlZcIcwJIdHsDAwMCQqF9kZWZhdWx0m6FskaVldmVyecIgwJIhIsDAwMCQ3AAklgAAAcDCw5YAGAIFwsKWCQADwMLClgsKwMDCwpYPCsAbwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWMQjAwMLClgEWCg3CwpYJAAvAwsKWCwzAwMLCllwMwMDCwpYBFw4RwsKWCQAPwMLClgsHwMDCwpYuB8AEwsKWARcSFcLClgkAE8DCwpYLDsDAwsKWEg7ADMLCls0BU8ySFhjCwpYJCsAIwsKWBArAwMLClgIBGRzCwpYGARrAwsKWAAnAF8LClgMJwBTCwpbNBWASHR/CwpYJBcAQwsKWBAXAwMLClgIBICPCwpYGASHAwsKWAAjAHsLClgkIwMDCwpYBDiLAwsI=
====catalogjs annotation end====*/