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

const _default = (forEach);
export { _default as default };
/*====catalogjs annotation start====
lZSTwq0uL2Rpc3QvMTE5LmpzAZPCrC4vZGlzdC83NS5qcwWTwq0uL2Rpc3QvMTA4LmpzCZPCrC4vaXNBcnJheS5qcw2Bp2RlZmF1bHSUoWyoX2RlZmF1bHQYwJGTGMDChqlhcnJheUVhY2iboWmQwgLAkgMEwADAp2RlZmF1bHSQqGJhc2VFYWNom6FpkMIGwJIHCMABwKdkZWZhdWx0kKxjYXN0RnVuY3Rpb26boWmQwgrAkgsMwALAp2RlZmF1bHSQp2lzQXJyYXmboWmQwg7Akg8QwAPAp2RlZmF1bHSQp2ZvckVhY2iboWyUp2lzQXJyYXmpYXJyYXlFYWNoqGJhc2VFYWNorGNhc3RGdW5jdGlvbsIRwJISE8DAwMCQqF9kZWZhdWx0m6Fskadmb3JFYWNowhXAkhYXwMDAwJDcABmWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLClg8JwAjCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpYDCMAMwsKWARgKDcLClgkAC8DCwpYLDMDAwsKWHAzAwMLClgEXDhHCwpYJAA/AwsKWCwfAwMLCliYHwATCwpbNA/wOEhTCwpYJB8AQwsKWBAfAwMLClgIBFRjCwpYGARbAwsKWAAjAE8LClgkIwMDCwpYBDhfAwsI=
====catalogjs annotation end====*/