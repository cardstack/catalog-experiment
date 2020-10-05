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

const _default = (minBy);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvMjguanMBk8KrLi9kaXN0LzYuanMFk8KtLi9kaXN0LzE2Ni5qcwmBp2RlZmF1bHSUoWyoX2RlZmF1bHQUwJGTFMDChaxiYXNlRXh0cmVtdW2boWmQwgLAkgMEwADAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCmYmFzZUx0m6FpkMIKwJILDMACwKdkZWZhdWx0kKVtaW5CeZuhbJOsYmFzZUV4dHJlbXVtrGJhc2VJdGVyYXRlZaZiYXNlTHTCDcCSDg/AwMDAkKhfZGVmYXVsdJuhbJGlbWluQnnCEcCSEhPAwMDAkNwAFZYAAAHAwsOWABcCBcLClgkAA8DCwpYLDMDAwsKWNQzACMLClgEWBgnCwpYJAAfAwsKWCwzAwMLClggMwAzCwpYBGAoNwsKWCQALwMLClgsGwMDCwpYPBsDAwsKWzQK3EA4QwsKWCQXABMLClgQFwMDCwpYCAREUwsKWBgESwMLClgAIwA/CwpYJCMDAwsKWAQ4TwMLC
====catalogjs annotation end====*/