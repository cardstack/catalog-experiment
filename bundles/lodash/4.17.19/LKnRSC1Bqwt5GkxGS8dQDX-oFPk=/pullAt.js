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

export { pullAt as default };
/*====catalogjs annotation start====
lZaVwqwuL2Rpc3QvOTguanMBwsCVwqsuL2Rpc3QvMS5qcwXCwJXCqy4vZGlzdC85LmpzCcLAlcKsLi9kaXN0LzI5LmpzDcLAlcKsLi9kaXN0LzUwLmpzEcLAlcKtLi9kaXN0LzEyOC5qcxXCwIGnZGVmYXVsdJShbKZwdWxsQXQewJGTHsDAh6hhcnJheU1hcJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCmYmFzZUF0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKpiYXNlUHVsbEF0m6FpkMIKwJILDMACwKdkZWZhdWx0kLBjb21wYXJlQXNjZW5kaW5nm6FpkMIOwJIPEMADwKdkZWZhdWx0kKhmbGF0UmVzdJuhaZDCEsCSExTABMCnZGVmYXVsdJCnaXNJbmRleJuhaZDCFsCSFxjABcCnZGVmYXVsdJCmcHVsbEF0m6FslqhmbGF0UmVzdKZiYXNlQXSqYmFzZVB1bGxBdKhhcnJheU1hcKdpc0luZGV4sGNvbXBhcmVBc2NlbmRpbmfCGh2SGxzAwMDAlqhhcnJheU1hcKZiYXNlQXSqYmFzZVB1bGxBdLBjb21wYXJlQXNjZW5kaW5nqGZsYXRSZXN0p2lzSW5kZXjcAB+WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwjAwMLClggIwBjCwpYBFgYJwsKWCQAHwMLClgsGwMDCwpZdBsAMwsKWARYKDcLClgkAC8DCwpYLCsDAwsKWFArABMLClgEXDhHCwpYJAA/AwsKWCxDAwMLCliwQwMDCwpYBFxIVwsKWCQATwMLClgsIwMDCwpYACMAIwsKWARgWGcLClgkAF8DCwpYLB8DAwsKWKAfAEMLCls0CagEaHsLClgQAG8DCwpYABsAdwsKWCQbAwMLClgMXFMDCwpYCDhzAwsI=
====catalogjs annotation end====*/