import { default as basePullAll } from "./dist/97.js";


/**
 * This method is like `_.pullAll` except that it accepts `comparator` which
 * is invoked to compare elements of `array` to `values`. The comparator is
 * invoked with two arguments: (arrVal, othVal).
 *
 * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.6.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
 *
 * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
 * console.log(array);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
 */

function pullAllWith(array, values, comparator) {
  return array && array.length && values && values.length ? basePullAll(array, values, undefined, comparator) : array;
}

const _default = (pullAllWith);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvOTcuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOrYmFzZVB1bGxBbGyboWmQwgLAkgMEwADAp2RlZmF1bHSQq3B1bGxBbGxXaXRom6FskatiYXNlUHVsbEFsbMIFwJIGB8DAwMCQqF9kZWZhdWx0m6FskatwdWxsQWxsV2l0aMIJwJIKC8DAwMCQnZYAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWWgvAwMLCls0DBzEGCMLClgkLwATCwpYEC8DAwsKWAgEJDMLClgYBCsDCwpYACMAHwsKWCQjAwMLClgEOC8DCwg==
====catalogjs annotation end====*/