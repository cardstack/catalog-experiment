import { default as baseIteratee } from "./dist/6.js";
import { default as basePullAt } from "./dist/9.js";



/**
 * Removes all elements from `array` that `predicate` returns truthy for
 * and returns an array of the removed elements. The predicate is invoked
 * with three arguments: (value, index, array).
 *
 * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
 * to pull elements from an array by value.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new array of removed elements.
 * @example
 *
 * var array = [1, 2, 3, 4];
 * var evens = _.remove(array, function(n) {
 *   return n % 2 == 0;
 * });
 *
 * console.log(array);
 * // => [1, 3]
 *
 * console.log(evens);
 * // => [2, 4]
 */

function remove(array, predicate) {
  var result = [];

  if (!(array && array.length)) {
    return result;
  }

  var index = -1,
      indexes = [],
      length = array.length;
  predicate = baseIteratee(predicate, 3);

  while (++index < length) {
    var value = array[index];

    if (predicate(value, index, array)) {
      result.push(value);
      indexes.push(index);
    }
  }

  basePullAt(array, indexes);
  return result;
}

const _default = (remove);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvNi5qcwGTwqsuL2Rpc3QvOS5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChKxiYXNlSXRlcmF0ZWWboWmQwgLAkgMEwADAp2RlZmF1bHSQqmJhc2VQdWxsQXSboWmQwgbAkgcIwAHAp2RlZmF1bHSQpnJlbW92ZZuhbJKsYmFzZUl0ZXJhdGVlqmJhc2VQdWxsQXTCCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGmcmVtb3Zlwg3Akg4PwMDAwJDcABGWAAABwMLDlgAWAgXCwpYJAAPAwsKWCwzAwMLClsy0DMAIwsKWARYGCcLClgkAB8DCwpYLCsDAwsKWzLkKwMDCwpbNAxEkCgzCwpYJBsAEwsKWBAbAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/