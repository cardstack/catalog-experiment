import { default as baseRest } from "./dist/49.js";
import { default as unzipWith } from "./unzipWith.js";



/**
 * This method is like `_.zip` except that it accepts `iteratee` to specify
 * how grouped values should be combined. The iteratee is invoked with the
 * elements of each group: (...group).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Array
 * @param {...Array} [arrays] The arrays to process.
 * @param {Function} [iteratee=_.identity] The function to combine
 *  grouped values.
 * @returns {Array} Returns the new array of grouped elements.
 * @example
 *
 * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
 *   return a + b + c;
 * });
 * // => [111, 222]
 */

var zipWith = baseRest(function (arrays) {
  var length = arrays.length,
      iteratee = length > 1 ? arrays[length - 1] : undefined;
  iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
  return unzipWith(arrays, iteratee);
});
const _default = (zipWith);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNDkuanMBk8KuLi91bnppcFdpdGguanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSoYmFzZVJlc3SboWmQwgLAkgMEwADAp2RlZmF1bHSQqXVuemlwV2l0aJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCnemlwV2l0aJuhbJKoYmFzZVJlc3SpdW56aXBXaXRowgoNkgsMwMDAwJKoYmFzZVJlc3SpdW56aXBXaXRoqF9kZWZhdWx0m6Fskad6aXBXaXRowg/AkhARwMDAwJDcABOWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwjAwMLClgAIwAjCwpYBGQYJwsKWCQAHwMLClgsJwMDCwpbMzQnAwMLCls0CVgEKDsLClgQAC8DCwpYAB8ANwsKWBAfAwMLClgMWBMDCwpYBAQ8SwsKWBgEQwMLClgAIwAzCwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/