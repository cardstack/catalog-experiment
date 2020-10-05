import { default as baseUniq } from "./dist/63.js";


/**
 * This method is like `_.uniq` except that it accepts `comparator` which
 * is invoked to compare elements of `array`. The order of result values is
 * determined by the order they occur in the array.The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.uniqWith(objects, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 */

function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return array && array.length ? baseUniq(array, undefined, comparator) : [];
}

const _default = (uniqWith);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvNjMuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOoYmFzZVVuaXGboWmQwgLAkgMEwADAp2RlZmF1bHSQqHVuaXFXaXRom6FskahiYXNlVW5pccIFwJIGB8DAwMCQqF9kZWZhdWx0m6Fskah1bmlxV2l0aMIJwJIKC8DAwMCQnZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWzIAIwMDCwpbNArwmBgjCwpYJCMAEwsKWBAjAwMLClgIBCQzCwpYGAQrAwsKWAAjAB8LClgkIwMDCwpYBDgvAwsI=
====catalogjs annotation end====*/