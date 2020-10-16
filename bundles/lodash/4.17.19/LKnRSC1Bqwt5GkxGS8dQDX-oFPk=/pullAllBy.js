import { default as baseIteratee } from "./dist/6.js";
import { default as basePullAll } from "./dist/97.js";



/**
 * This method is like `_.pullAll` except that it accepts `iteratee` which is
 * invoked for each element of `array` and `values` to generate the criterion
 * by which they're compared. The iteratee is invoked with one argument: (value).
 *
 * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
 *
 * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
 * console.log(array);
 * // => [{ 'x': 2 }]
 */

function pullAllBy(array, values, iteratee) {
  return array && array.length && values && values.length ? basePullAll(array, values, baseIteratee(iteratee, 2)) : array;
}


export { pullAllBy as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvNi5qcwHCwJXCrC4vZGlzdC85Ny5qcwXCwIGnZGVmYXVsdJShbKlwdWxsQWxsQnkMwJGTDMDAg6xiYXNlSXRlcmF0ZWWboWmQwgLAkgMEwADAp2RlZmF1bHSQq2Jhc2VQdWxsQWxsm6FpkMIGwJIHCMABwKdkZWZhdWx0kKlwdWxsQWxsQnmboWySq2Jhc2VQdWxsQWxsrGJhc2VJdGVyYXRlZcIJwJIKC8DAwMCQnZYAAAHAwsOWABYCBcLClgkAA8DCwpYLDMDAwsKWEAzAwMLClgEXBgnCwpYJAAfAwsKWCwvAwMLCllgLwATCwpbNAwUZCgzCwpYJCcAIwsKWCQnAwMLClgMOC8DCwg==
====catalogjs annotation end====*/