import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as identity } from "./identity.js";




/**
 * Computes the maximum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * _.max([]);
 * // => undefined
 */

function max(array) {
  return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
}

const _default = (max);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvMjguanMBk8KtLi9kaXN0LzE2NS5qcwWTwq0uL2lkZW50aXR5LmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdBTAkZMUwMKFrGJhc2VFeHRyZW11bZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCmYmFzZUd0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKhpZGVudGl0eZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCjbWF4m6Fsk6xiYXNlRXh0cmVtdW2oaWRlbnRpdHmmYmFzZUd0wg3Akg4PwMDAwJCoX2RlZmF1bHSboWyRo21heMIRwJISE8DAwMCQ3AAVlgAAAcDCw5YAFwIFwsKWCQADwMLClgsMwMDCwpYrDMAMwsKWARgGCcLClgkAB8DCwpYLBsDAwsKWAgbAwMLClgEYCg3CwpYJAAvAwsKWCwjAwMLClggIwAjCwpbNAWYQDhDCwpYJA8AEwsKWBAPAwMLClgIBERTCwpYGARLAwsKWAAjAD8LClgkIwMDCwpYBDhPAwsI=
====catalogjs annotation end====*/