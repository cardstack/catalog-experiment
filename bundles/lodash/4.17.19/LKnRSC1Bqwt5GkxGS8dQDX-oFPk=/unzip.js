import { default as arrayFilter } from "./dist/150.js";
import { default as arrayMap } from "./dist/98.js";
import { default as baseProperty } from "./dist/156.js";
import { default as baseTimes } from "./dist/134.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";






/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max;
/**
 * This method is like `_.zip` except that it accepts an array of grouped
 * elements and creates an array regrouping the elements to their pre-zip
 * configuration.
 *
 * @static
 * @memberOf _
 * @since 1.2.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 *
 * _.unzip(zipped);
 * // => [['a', 'b'], [1, 2], [true, false]]
 */

function unzip(array) {
  if (!(array && array.length)) {
    return [];
  }

  var length = 0;
  array = arrayFilter(array, function (group) {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  return baseTimes(length, function (index) {
    return arrayMap(array, baseProperty(index));
  });
}

const _default = (unzip);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTUwLmpzAZPCrC4vZGlzdC85OC5qcwWTwq0uL2Rpc3QvMTU2LmpzCZPCrS4vZGlzdC8xMzQuanMNk8K2Li9pc0FycmF5TGlrZU9iamVjdC5qcxGBp2RlZmF1bHSUoWyoX2RlZmF1bHQhwJGTIcDCiKthcnJheUZpbHRlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYXJyYXlNYXCboWmQwgbAkgcIwAHAp2RlZmF1bHSQrGJhc2VQcm9wZXJ0eZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCpYmFzZVRpbWVzm6FpkMIOwJIPEMADwKdkZWZhdWx0kLFpc0FycmF5TGlrZU9iamVjdJuhaZDCEsCSExTABMCnZGVmYXVsdJCpbmF0aXZlTWF4m6FskaRNYXRowhYZkhcYwMDAwJCldW56aXCboWyWq2FycmF5RmlsdGVysWlzQXJyYXlMaWtlT2JqZWN0qW5hdGl2ZU1heKliYXNlVGltZXOoYXJyYXlNYXCsYmFzZVByb3BlcnR5whrAkhscwMDAwJCoX2RlZmF1bHSboWyRpXVuemlwwh7Akh8gwMDAwJDcACKWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwvAwMLCllwLwBTCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpYnCMAMwsKWARgKDcLClgkAC8DCwpYLDMDAwsKWCAzAwMLClgEYDhHCwpYJAA/AwsKWCwnAwMLClkAJwAjCwpYBIRIVwsKWCQATwMLClgsRwMDCwpYjEcAYwsKWYQEWGsLClgQAF8DCwpYACcAZwsKWGgnAEMLClgMIwMDCwpbNAisRGx3CwpYJBcAEwsKWBAXAwMLClgIBHiHCwpYGAR/AwsKWAAjAHMLClgkIwMDCwpYBDiDAwsI=
====catalogjs annotation end====*/