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


export { pullAll as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvOTcuanMBwsCBp2RlZmF1bHSUoWyncHVsbEFsbAjAkZMIwMCCq2Jhc2VQdWxsQWxsm6FpkMICwJIDBMAAwKdkZWZhdWx0kKdwdWxsQWxsm6FskatiYXNlUHVsbEFsbMIFwJIGB8DAwMCQmZYAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWTgvAwMLCls0B8xoGCMLClgkHwATCwpYJB8DAwsKWAw4HwMLC
====catalogjs annotation end====*/