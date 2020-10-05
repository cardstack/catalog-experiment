import { default as baseExtremum } from "./dist/28.js";
import { default as baseLt } from "./dist/166.js";
import { default as identity } from "./identity.js";




/**
 * Computes the minimum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * _.min([]);
 * // => undefined
 */

function min(array) {
  return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
}

const _default = (min);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvMjguanMBk8KtLi9kaXN0LzE2Ni5qcwWTwq0uL2lkZW50aXR5LmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdBTAkZMUwMKFrGJhc2VFeHRyZW11bZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCmYmFzZUx0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKhpZGVudGl0eZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCjbWlum6Fsk6xiYXNlRXh0cmVtdW2oaWRlbnRpdHmmYmFzZUx0wg3Akg4PwMDAwJCoX2RlZmF1bHSboWyRo21pbsIRwJISE8DAwMCQ3AAVlgAAAcDCw5YAFwIFwsKWCQADwMLClgsMwMDCwpYrDMAMwsKWARgGCcLClgkAB8DCwpYLBsDAwsKWAgbAwMLClgEYCg3CwpYJAAvAwsKWCwjAwMLClggIwAjCwpbNAWYQDhDCwpYJA8AEwsKWBAPAwMLClgIBERTCwpYGARLAwsKWAAjAD8LClgkIwMDCwpYBDhPAwsI=
====catalogjs annotation end====*/