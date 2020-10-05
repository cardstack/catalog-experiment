import { default as arrayEach } from "./dist/119.js";
import { default as baseCreate } from "./dist/106.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as getPrototype } from "./dist/137.js";
import { default as isArray } from "./isArray.js";
import { default as isBuffer } from "./isBuffer.js";
import { default as isFunction } from "./isFunction.js";
import { default as isObject } from "./isObject.js";
import { default as isTypedArray } from "./isTypedArray.js";











/**
 * An alternative to `_.reduce`; this method transforms `object` to a new
 * `accumulator` object which is the result of running each of its own
 * enumerable string keyed properties thru `iteratee`, with each invocation
 * potentially mutating the `accumulator` object. If `accumulator` is not
 * provided, a new object with the same `[[Prototype]]` will be used. The
 * iteratee is invoked with four arguments: (accumulator, value, key, object).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 1.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The custom accumulator value.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * _.transform([2, 3, 4], function(result, n) {
 *   result.push(n *= n);
 *   return n % 2 == 0;
 * }, []);
 * // => [4, 9]
 *
 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] }
 */

function transform(object, iteratee, accumulator) {
  var isArr = isArray(object),
      isArrLike = isArr || isBuffer(object) || isTypedArray(object);
  iteratee = baseIteratee(iteratee, 4);

  if (accumulator == null) {
    var Ctor = object && object.constructor;

    if (isArrLike) {
      accumulator = isArr ? new Ctor() : [];
    } else if (isObject(object)) {
      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
    } else {
      accumulator = {};
    }
  }

  (isArrLike ? arrayEach : baseForOwn)(object, function (value, index, object) {
    return iteratee(accumulator, value, index, object);
  });
  return accumulator;
}

const _default = (transform);
export { _default as default };
/*====catalogjs annotation start====
lZqTwq0uL2Rpc3QvMTE5LmpzAZPCrS4vZGlzdC8xMDYuanMFk8KsLi9kaXN0Lzc3LmpzCZPCqy4vZGlzdC82LmpzDZPCrS4vZGlzdC8xMzcuanMRk8KsLi9pc0FycmF5LmpzFZPCrS4vaXNCdWZmZXIuanMZk8KvLi9pc0Z1bmN0aW9uLmpzHZPCrS4vaXNPYmplY3QuanMhk8KxLi9pc1R5cGVkQXJyYXkuanMlgadkZWZhdWx0lKFsqF9kZWZhdWx0MMCRkzDAwoypYXJyYXlFYWNom6FpkMICwJIDBMAAwKdkZWZhdWx0kKpiYXNlQ3JlYXRlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKpiYXNlRm9yT3dum6FpkMIKwJILDMACwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwg7Akg8QwAPAp2RlZmF1bHSQrGdldFByb3RvdHlwZZuhaZDCEsCSExTABMCnZGVmYXVsdJCnaXNBcnJheZuhaZDCFsCSFxjABcCnZGVmYXVsdJCoaXNCdWZmZXKboWmQwhrAkhscwAbAp2RlZmF1bHSQqmlzRnVuY3Rpb26boWmQwh7Akh8gwAfAp2RlZmF1bHSQqGlzT2JqZWN0m6FpkMIiwJIjJMAIwKdkZWZhdWx0kKxpc1R5cGVkQXJyYXmboWmQwibAkicowAnAp2RlZmF1bHSQqXRyYW5zZm9ybZuhbJqnaXNBcnJheahpc0J1ZmZlcqxpc1R5cGVkQXJyYXmsYmFzZUl0ZXJhdGVlqGlzT2JqZWN0qmlzRnVuY3Rpb26qYmFzZUNyZWF0ZaxnZXRQcm90b3R5cGWpYXJyYXlFYWNoqmJhc2VGb3JPd27CKcCSKivAwMDAkKhfZGVmYXVsdJuhbJGpdHJhbnNmb3Jtwi3Aki4vwMDAwJDcADGWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLClk8JwAzCwpYBGAYJwsKWCQAHwMLClgsKwMDCwpYJCsAUwsKWARcKDcLClgkAC8DCwpYLCsDAwsKWAwrAwMLClgEWDhHCwpYJAA/AwsKWCwzAwMLClhcMwCTCwpYBGBIVwsKWCQATwMLClgsMwMDCwpYBDMAEwsKWARcWGcLClgkAF8DCwpYLB8DAwsKWMAfAHMLClgEYGh3CwpYJABvAwsKWCwjAwMLCliUIwCjCwpYBGh4hwsKWCQAfwMLClgsKwMDCwpYgCsAIwsKWARgiJcLClgkAI8DCwpYLCMDAwsKWzKwIwCDCwpYBHCYpwsKWCQAnwMLClgsMwMDCwpYMDMAQwsKWzQSZzIEqLMLClgkJwBjCwpYECcDAwsKWAgEtMMLClgYBLsDCwpYACMArwsKWCQjAwMLClgEOL8DCwg==
====catalogjs annotation end====*/