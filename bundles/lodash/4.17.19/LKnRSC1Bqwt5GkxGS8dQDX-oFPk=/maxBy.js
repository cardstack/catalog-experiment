import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as baseIteratee } from "./dist/6.js";




/**
 * This method is like `_.max` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * _.maxBy(objects, function(o) { return o.n; });
 * // => { 'n': 2 }
 *
 * // The `_.property` iteratee shorthand.
 * _.maxBy(objects, 'n');
 * // => { 'n': 2 }
 */

function maxBy(array, iteratee) {
  return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseGt) : undefined;
}


export { maxBy as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvMjguanMBwsCVwq0uL2Rpc3QvMTY1LmpzBcLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSUoWylbWF4QnkQwJGTEMDAhKxiYXNlRXh0cmVtdW2boWmQwgLAkgMEwADAp2RlZmF1bHSQpmJhc2VHdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMIKwJILDMACwKdkZWZhdWx0kKVtYXhCeZuhbJOsYmFzZUV4dHJlbXVtrGJhc2VJdGVyYXRlZaZiYXNlR3TCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLDMDAwsKWNQzADMLClgEYBgnCwpYJAAfAwsKWCwbAwMLClg8GwMDCwpYBFgoNwsKWCQALwMLClgsMwMDCwpYIDMAIwsKWzQK3EA4QwsKWCQXABMLClgkFwMDCwpYDDg/AwsI=
====catalogjs annotation end====*/