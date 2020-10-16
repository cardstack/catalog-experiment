/** Used for built-in method references. */
var arrayProto = Array.prototype;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeReverse = arrayProto.reverse;
/**
 * Reverses `array` so that the first element becomes the last, the second
 * element becomes the second to last, and so on.
 *
 * **Note:** This method mutates `array` and is based on
 * [`Array#reverse`](https://mdn.io/Array/reverse).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.reverse(array);
 * // => [3, 2, 1]
 *
 * console.log(array);
 * // => [3, 2, 1]
 */

function reverse(array) {
  return array == null ? array : nativeReverse.call(array);
}


export { reverse as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyncmV2ZXJzZQ7AkZMOwMCDqmFycmF5UHJvdG+boWyRpUFycmF5wgIFkgMEwMDAwJCtbmF0aXZlUmV2ZXJzZZuhbJGqYXJyYXlQcm90b8IHCpIICcDAwMCRqmFycmF5UHJvdG+ncmV2ZXJzZZuhbJGtbmF0aXZlUmV2ZXJzZcILwJIMDcDAwMCQn5YAAAHAwsOWLAECBsLClgQAA8DCwpYACsAFwsKWAArAwMLClgMPwMDCwpZbAQcLwsKWBAAIwMLClgANwArCwpYrDcDAwsKWAwgEwMLCls0CCg8MDsLClgkHwAnCwpYJB8DAwsKWAw4NwMLC
====catalogjs annotation end====*/