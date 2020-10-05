import { default as basePullAll } from "./dist/97.js";


/**
 * This method is like `_.pull` except that it accepts an array of values to remove.
 *
 * **Note:** Unlike `_.difference`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pullAll(array, ['a', 'c']);
 * console.log(array);
 * // => ['b', 'b']
 */

function pullAll(array, values) {
  return array && array.length && values && values.length ? basePullAll(array, values) : array;
}

const _default = (pullAll);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvOTcuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOrYmFzZVB1bGxBbGyboWmQwgLAkgMEwADAp2RlZmF1bHSQp3B1bGxBbGyboWyRq2Jhc2VQdWxsQWxswgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRp3B1bGxBbGzCCcCSCgvAwMDAkJ2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwvAwMLClk4LwMDCwpbNAfMaBgjCwpYJB8AEwsKWBAfAwMLClgIBCQzCwpYGAQrAwsKWAAjAB8LClgkIwMDCwpYBDgvAwsI=
====catalogjs annotation end====*/