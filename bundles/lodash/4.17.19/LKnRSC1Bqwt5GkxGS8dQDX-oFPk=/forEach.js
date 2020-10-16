import { default as arrayEach } from "./dist/119.js";
import { default as baseEach } from "./dist/75.js";
import { default as castFunction } from "./dist/108.js";
import { default as isArray } from "./isArray.js";





/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */

function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}


export { forEach as default };
/*====catalogjs annotation start====
lZSVwq0uL2Rpc3QvMTE5LmpzAcLAlcKsLi9kaXN0Lzc1LmpzBcLAlcKtLi9kaXN0LzEwOC5qcwnCwJXCrC4vaXNBcnJheS5qcw3CwIGnZGVmYXVsdJShbKdmb3JFYWNoFMCRkxTAwIWpYXJyYXlFYWNom6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlRWFjaJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCsY2FzdEZ1bmN0aW9um6FpkMIKwJILDMACwKdkZWZhdWx0kKdpc0FycmF5m6FpkMIOwJIPEMADwKdkZWZhdWx0kKdmb3JFYWNom6FslKdpc0FycmF5qWFycmF5RWFjaKhiYXNlRWFjaKxjYXN0RnVuY3Rpb27CEcCSEhPAwMDAkNwAFZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWDwnACMLClgEXBgnCwpYJAAfAwsKWCwjAwMLClgMIwAzCwpYBGAoNwsKWCQALwMLClgsMwMDCwpYcDMDAwsKWARcOEcLClgkAD8DCwpYLB8DAwsKWJgfABMLCls0D/A4SFMLClgkHwBDCwpYJB8DAwsKWAw4TwMLC
====catalogjs annotation end====*/