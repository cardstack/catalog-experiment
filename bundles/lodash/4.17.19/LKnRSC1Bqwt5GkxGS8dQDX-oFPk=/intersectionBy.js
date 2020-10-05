import { default as arrayMap } from "./dist/98.js";
import { default as baseIntersection } from "./dist/62.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as castArrayLikeObject } from "./dist/82.js";
import { default as last } from "./last.js";







/**
 * This method is like `_.intersection` except that it accepts `iteratee`
 * which is invoked for each element of each `arrays` to generate the criterion
 * by which they're compared. The order and references of result values are
 * determined by the first array. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [2.1]
 *
 * // The `_.property` iteratee shorthand.
 * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }]
 */

var intersectionBy = baseRest(function (arrays) {
  var iteratee = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);

  if (iteratee === last(mapped)) {
    iteratee = undefined;
  } else {
    mapped.pop();
  }

  return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, baseIteratee(iteratee, 2)) : [];
});
const _default = (intersectionBy);
export { _default as default };
/*====catalogjs annotation start====
lZaTwqwuL2Rpc3QvOTguanMBk8KsLi9kaXN0LzYyLmpzBZPCqy4vZGlzdC82LmpzCZPCrC4vZGlzdC80OS5qcw2TwqwuL2Rpc3QvODIuanMRk8KpLi9sYXN0LmpzFYGnZGVmYXVsdJShbKhfZGVmYXVsdCPAkZMjwMKIqGFycmF5TWFwm6FpkMICwJIDBMAAwKdkZWZhdWx0kLBiYXNlSW50ZXJzZWN0aW9um6FpkMIGwJIHCMABwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwgrAkgsMwALAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIOwJIPEMADwKdkZWZhdWx0kLNjYXN0QXJyYXlMaWtlT2JqZWN0m6FpkMISwJITFMAEwKdkZWZhdWx0kKRsYXN0m6FpkMIWwJMXGBnABcCnZGVmYXVsdJCuaW50ZXJzZWN0aW9uQnmboWyWqGJhc2VSZXN0pGxhc3SoYXJyYXlNYXCzY2FzdEFycmF5TGlrZU9iamVjdLBiYXNlSW50ZXJzZWN0aW9urGJhc2VJdGVyYXRlZcIbHpIcHcDAwMCWqGFycmF5TWFwsGJhc2VJbnRlcnNlY3Rpb26sYmFzZUl0ZXJhdGVlqGJhc2VSZXN0s2Nhc3RBcnJheUxpa2VPYmplY3SkbGFzdKhfZGVmYXVsdJuhbJGuaW50ZXJzZWN0aW9uQnnCIMCSISLAwMDAkNwAJJYAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWGQjAFMLClgEXBgnCwpYJAAfAwsKWCxDAwMLClnwQwAzCwpYBFgoNwsKWCQALwMLClgsMwMDCwpYJDMDAwsKWARcOEcLClgkAD8DCwpYLCMDAwsKWAAjAGMLClgEXEhXCwpYJABPAwsKWCxPAwMLClgkTwBnCwpYBFBYawsKWCQAXwMLClgsEwMDCwpYmBMAEwsKWFwTACMLCls0DMQEbH8LClgQAHMDCwpYADsAewsKWBA7AwMLClgMXEMDCwpYBASAjwsKWBgEhwMLClgAIwB3CwpYJCMDAwsKWAQ4iwMLC
====catalogjs annotation end====*/