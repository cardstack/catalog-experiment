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


export { mapValues as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvNTYuanMBwsCVwqwuL2Rpc3QvNzcuanMFwsCVwqsuL2Rpc3QvNi5qcwnCwIGnZGVmYXVsdJShbKltYXBWYWx1ZXMQwJGTEMDAhK9iYXNlQXNzaWduVmFsdWWboWmQwgLAkgMEwADAp2RlZmF1bHSQqmJhc2VGb3JPd26boWmQwgbAkgcIwAHAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCpbWFwVmFsdWVzm6Fsk6xiYXNlSXRlcmF0ZWWqYmFzZUZvck93bq9iYXNlQXNzaWduVmFsdWXCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLD8DAwsKWLQ/AwMLClgEXBgnCwpYJAAfAwsKWCwrAwMLClhEKwATCwpYBFgoNwsKWCQALwMLClgsMwMDCwpY1DMAIwsKWzQOjRQ4QwsKWCQnADMLClgkJwMDCwpYDDg/AwsI=
====catalogjs annotation end====*/