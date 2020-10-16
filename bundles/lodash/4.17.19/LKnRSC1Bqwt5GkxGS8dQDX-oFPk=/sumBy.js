import { default as baseIteratee } from "./dist/6.js";
import { default as baseSum } from "./dist/168.js";



/**
 * This method is like `_.sum` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the value to be summed.
 * The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {number} Returns the sum.
 * @example
 *
 * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
 *
 * _.sumBy(objects, function(o) { return o.n; });
 * // => 20
 *
 * // The `_.property` iteratee shorthand.
 * _.sumBy(objects, 'n');
 * // => 20
 */

function sumBy(array, iteratee) {
  return array && array.length ? baseSum(array, baseIteratee(iteratee, 2)) : 0;
}


export { sumBy as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvNi5qcwHCwJXCrS4vZGlzdC8xNjguanMFwsCBp2RlZmF1bHSUoWylc3VtQnkMwJGTDMDAg6xiYXNlSXRlcmF0ZWWboWmQwgLAkgMEwADAp2RlZmF1bHSQp2Jhc2VTdW2boWmQwgbAkgcIwAHAp2RlZmF1bHSQpXN1bUJ5m6FskqdiYXNlU3VtrGJhc2VJdGVyYXRlZcIJwJIKC8DAwMCQnZYAAAHAwsOWABYCBcLClgkAA8DCwpYLDMDAwsKWCAzAwMLClgEYBgnCwpYJAAfAwsKWCwfAwMLCljUHwATCwpbNAqUVCgzCwpYJBcAIwsKWCQXAwMLClgMOC8DCwg==
====catalogjs annotation end====*/