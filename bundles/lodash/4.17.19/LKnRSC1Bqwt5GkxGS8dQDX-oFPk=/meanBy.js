import { default as baseIteratee } from "./dist/6.js";
import { default as baseMean } from "./dist/167.js";



/**
 * This method is like `_.mean` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the value to be averaged.
 * The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {number} Returns the mean.
 * @example
 *
 * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
 *
 * _.meanBy(objects, function(o) { return o.n; });
 * // => 5
 *
 * // The `_.property` iteratee shorthand.
 * _.meanBy(objects, 'n');
 * // => 5
 */

function meanBy(array, iteratee) {
  return baseMean(array, baseIteratee(iteratee, 2));
}

const _default = (meanBy);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvNi5qcwGTwq0uL2Rpc3QvMTY3LmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKErGJhc2VJdGVyYXRlZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZU1lYW6boWmQwgbAkgcIwAHAp2RlZmF1bHSQpm1lYW5CeZuhbJKoYmFzZU1lYW6sYmFzZUl0ZXJhdGVlwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRpm1lYW5CecINwJIOD8DAwMCQ3AARlgAAAcDCw5YAFgIFwsKWCQADwMLClgsMwMDCwpYIDMDAwsKWARgGCcLClgkAB8DCwpYLCMDAwsKWHQjABMLCls0CqREKDMLClgkGwAjCwpYEBsDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/