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

const _default = (reverse);
export { _default as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyoX2RlZmF1bHQSwJGTEsDChKphcnJheVByb3Rvm6FskaVBcnJhecICBZIDBMDAwMCQrW5hdGl2ZVJldmVyc2WboWyRqmFycmF5UHJvdG/CBwqSCAnAwMDAkaphcnJheVByb3Rvp3JldmVyc2WboWyRrW5hdGl2ZVJldmVyc2XCC8CSDA3AwMDAkKhfZGVmYXVsdJuhbJGncmV2ZXJzZcIPwJIQEcDAwMCQ3AATlgAAAcDCw5YsAQIGwsKWBAADwMLClgAKwAXCwpYACsDAwsKWAw/AwMLCllsBBwvCwpYEAAjAwsKWAA3ACsLClisNwMDCwpYDCATAwsKWzQIKDwwOwsKWCQfACcLClgQHwMDCwpYCAQ8SwsKWBgEQwMLClgAIwA3CwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/