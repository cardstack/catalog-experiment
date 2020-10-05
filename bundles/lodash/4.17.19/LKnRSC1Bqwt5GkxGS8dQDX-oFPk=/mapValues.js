import { default as baseAssignValue } from "./dist/56.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";




/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */

function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);
  baseForOwn(object, function (value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

const _default = (mapValues);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvNTYuanMBk8KsLi9kaXN0Lzc3LmpzBZPCqy4vZGlzdC82LmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdBTAkZMUwMKFr2Jhc2VBc3NpZ25WYWx1ZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqYmFzZUZvck93bpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMIKwJILDMACwKdkZWZhdWx0kKltYXBWYWx1ZXOboWyTrGJhc2VJdGVyYXRlZapiYXNlRm9yT3dur2Jhc2VBc3NpZ25WYWx1ZcINwJIOD8DAwMCQqF9kZWZhdWx0m6FskaltYXBWYWx1ZXPCEcCSEhPAwMDAkNwAFZYAAAHAwsOWABcCBcLClgkAA8DCwpYLD8DAwsKWLQ/AwMLClgEXBgnCwpYJAAfAwsKWCwrAwMLClhEKwATCwpYBFgoNwsKWCQALwMLClgsMwMDCwpY1DMAIwsKWzQOjRQ4QwsKWCQnADMLClgQJwMDCwpYCAREUwsKWBgESwMLClgAIwA/CwpYJCMDAwsKWAQ4TwMLC
====catalogjs annotation end====*/