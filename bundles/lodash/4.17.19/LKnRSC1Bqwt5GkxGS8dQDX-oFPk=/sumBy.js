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

const _default = (sumBy);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvNi5qcwGTwq0uL2Rpc3QvMTY4LmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBDAkZMQwMKErGJhc2VJdGVyYXRlZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCnYmFzZVN1bZuhaZDCBsCSBwjAAcCnZGVmYXVsdJClc3VtQnmboWySp2Jhc2VTdW2sYmFzZUl0ZXJhdGVlwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRpXN1bUJ5wg3Akg4PwMDAwJDcABGWAAABwMLDlgAWAgXCwpYJAAPAwsKWCwzAwMLClggMwMDCwpYBGAYJwsKWCQAHwMLClgsHwMDCwpY1B8AEwsKWzQKlFQoMwsKWCQXACMLClgQFwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/