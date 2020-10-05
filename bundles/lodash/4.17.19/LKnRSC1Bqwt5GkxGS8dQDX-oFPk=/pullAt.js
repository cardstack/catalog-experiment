import { default as arrayMap } from "./dist/98.js";
import { default as baseAt } from "./dist/1.js";
import { default as basePullAt } from "./dist/9.js";
import { default as compareAscending } from "./dist/29.js";
import { default as flatRest } from "./dist/50.js";
import { default as isIndex } from "./dist/128.js";







/**
 * Removes elements from `array` corresponding to `indexes` and returns an
 * array of removed elements.
 *
 * **Note:** Unlike `_.at`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...(number|number[])} [indexes] The indexes of elements to remove.
 * @returns {Array} Returns the new array of removed elements.
 * @example
 *
 * var array = ['a', 'b', 'c', 'd'];
 * var pulled = _.pullAt(array, [1, 3]);
 *
 * console.log(array);
 * // => ['a', 'c']
 *
 * console.log(pulled);
 * // => ['b', 'd']
 */

var pullAt = flatRest(function (array, indexes) {
  var length = array == null ? 0 : array.length,
      result = baseAt(array, indexes);
  basePullAt(array, arrayMap(indexes, function (index) {
    return isIndex(index, length) ? +index : index;
  }).sort(compareAscending));
  return result;
});
const _default = (pullAt);
export { _default as default };
/*====catalogjs annotation start====
lZaTwqwuL2Rpc3QvOTguanMBk8KrLi9kaXN0LzEuanMFk8KrLi9kaXN0LzkuanMJk8KsLi9kaXN0LzI5LmpzDZPCrC4vZGlzdC81MC5qcxGTwq0uL2Rpc3QvMTI4LmpzFYGnZGVmYXVsdJShbKhfZGVmYXVsdCLAkZMiwMKIqGFycmF5TWFwm6FpkMICwJIDBMAAwKdkZWZhdWx0kKZiYXNlQXSboWmQwgbAkgcIwAHAp2RlZmF1bHSQqmJhc2VQdWxsQXSboWmQwgrAkgsMwALAp2RlZmF1bHSQsGNvbXBhcmVBc2NlbmRpbmeboWmQwg7Akg8QwAPAp2RlZmF1bHSQqGZsYXRSZXN0m6FpkMISwJITFMAEwKdkZWZhdWx0kKdpc0luZGV4m6FpkMIWwJIXGMAFwKdkZWZhdWx0kKZwdWxsQXSboWyWqGZsYXRSZXN0pmJhc2VBdKpiYXNlUHVsbEF0qGFycmF5TWFwp2lzSW5kZXiwY29tcGFyZUFzY2VuZGluZ8IaHZIbHMDAwMCWqGFycmF5TWFwpmJhc2VBdKpiYXNlUHVsbEF0sGNvbXBhcmVBc2NlbmRpbmeoZmxhdFJlc3SnaXNJbmRleKhfZGVmYXVsdJuhbJGmcHVsbEF0wh/AkiAhwMDAwJDcACOWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwjAwMLClggIwBjCwpYBFgYJwsKWCQAHwMLClgsGwMDCwpZdBsAMwsKWARYKDcLClgkAC8DCwpYLCsDAwsKWFArABMLClgEXDhHCwpYJAA/AwsKWCxDAwMLCliwQwMDCwpYBFxIVwsKWCQATwMLClgsIwMDCwpYACMAIwsKWARgWGcLClgkAF8DCwpYLB8DAwsKWKAfAEMLCls0CagEaHsLClgQAG8DCwpYABsAdwsKWBAbAwMLClgMXFMDCwpYBAR8iwsKWBgEgwMLClgAIwBzCwpYJCMDAwsKWAQ4hwMLC
====catalogjs annotation end====*/