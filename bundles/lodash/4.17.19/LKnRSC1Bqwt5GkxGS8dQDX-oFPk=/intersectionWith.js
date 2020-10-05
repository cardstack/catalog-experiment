import { default as arrayMap } from "./dist/98.js";
import { default as baseIntersection } from "./dist/62.js";
import { default as baseRest } from "./dist/49.js";
import { default as castArrayLikeObject } from "./dist/82.js";
import { default as last } from "./last.js";






/**
 * This method is like `_.intersection` except that it accepts `comparator`
 * which is invoked to compare elements of `arrays`. The order and references
 * of result values are determined by the first array. The comparator is
 * invoked with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.intersectionWith(objects, others, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }]
 */

var intersectionWith = baseRest(function (arrays) {
  var comparator = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);
  comparator = typeof comparator == 'function' ? comparator : undefined;

  if (comparator) {
    mapped.pop();
  }

  return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined, comparator) : [];
});
const _default = (intersectionWith);
export { _default as default };
/*====catalogjs annotation start====
lZWTwqwuL2Rpc3QvOTguanMBk8KsLi9kaXN0LzYyLmpzBZPCrC4vZGlzdC80OS5qcwmTwqwuL2Rpc3QvODIuanMNk8KpLi9sYXN0LmpzEYGnZGVmYXVsdJShbKhfZGVmYXVsdB7AkZMewMKHqGFycmF5TWFwm6FpkMICwJIDBMAAwKdkZWZhdWx0kLBiYXNlSW50ZXJzZWN0aW9um6FpkMIGwJIHCMABwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCzY2FzdEFycmF5TGlrZU9iamVjdJuhaZDCDsCSDxDAA8CnZGVmYXVsdJCkbGFzdJuhaZDCEsCSExTABMCnZGVmYXVsdJCwaW50ZXJzZWN0aW9uV2l0aJuhbJWoYmFzZVJlc3SkbGFzdKhhcnJheU1hcLNjYXN0QXJyYXlMaWtlT2JqZWN0sGJhc2VJbnRlcnNlY3Rpb27CFhmSFxjAwMDAlahhcnJheU1hcLBiYXNlSW50ZXJzZWN0aW9uqGJhc2VSZXN0s2Nhc3RBcnJheUxpa2VPYmplY3SkbGFzdKhfZGVmYXVsdJuhbJGwaW50ZXJzZWN0aW9uV2l0aMIbwJIcHcDAwMCQ3AAflgAAAcDCw5YAFwIFwsKWCQADwMLClgsIwMDCwpYZCMAQwsKWARcGCcLClgkAB8DCwpYLEMDAwsKWzKwQwMDCwpYBFwoNwsKWCQALwMLClgsIwMDCwpYACMAUwsKWARcOEcLClgkAD8DCwpYLE8DAwsKWCRPACMLClgEUEhXCwpYJABPAwsKWCwTAwMLCligEwATCwpbNAvkBFhrCwpYEABfAwsKWABDAGcLClgQQwMDCwpYDKAzAwsKWAQEbHsLClgYBHMDCwpYACMAYwsKWCQjAwMLClgEOHcDCwg==
====catalogjs annotation end====*/