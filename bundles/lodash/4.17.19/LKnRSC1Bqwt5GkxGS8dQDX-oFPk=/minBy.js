import { default as baseExtremum } from "./dist/28.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseLt } from "./dist/166.js";




/**
 * This method is like `_.min` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * _.minBy(objects, function(o) { return o.n; });
 * // => { 'n': 1 }
 *
 * // The `_.property` iteratee shorthand.
 * _.minBy(objects, 'n');
 * // => { 'n': 1 }
 */

function minBy(array, iteratee) {
  return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt) : undefined;
}


export { minBy as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvMjguanMBwsCVwqsuL2Rpc3QvNi5qcwXCwJXCrS4vZGlzdC8xNjYuanMJwsCBp2RlZmF1bHSUoWylbWluQnkQwJGTEMDAhKxiYXNlRXh0cmVtdW2boWmQwgLAkgMEwADAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCmYmFzZUx0m6FpkMIKwJILDMACwKdkZWZhdWx0kKVtaW5CeZuhbJOsYmFzZUV4dHJlbXVtrGJhc2VJdGVyYXRlZaZiYXNlTHTCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLDMDAwsKWNQzACMLClgEWBgnCwpYJAAfAwsKWCwzAwMLClggMwAzCwpYBGAoNwsKWCQALwMLClgsGwMDCwpYPBsDAwsKWzQK3EA4QwsKWCQXABMLClgkFwMDCwpYDDg/AwsI=
====catalogjs annotation end====*/