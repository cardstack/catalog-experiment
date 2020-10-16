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


export { unzip as default };
/*====catalogjs annotation start====
lZWVwq0uL2Rpc3QvMTUwLmpzAcLAlcKsLi9kaXN0Lzk4LmpzBcLAlcKtLi9kaXN0LzE1Ni5qcwnCwJXCrS4vZGlzdC8xMzQuanMNwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzEcLAgadkZWZhdWx0lKFspXVuemlwHcCRkx3AwIerYXJyYXlGaWx0ZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQqGFycmF5TWFwm6FpkMIGwJIHCMABwKdkZWZhdWx0kKxiYXNlUHJvcGVydHmboWmQwgrAkgsMwALAp2RlZmF1bHSQqWJhc2VUaW1lc5uhaZDCDsCSDxDAA8CnZGVmYXVsdJCxaXNBcnJheUxpa2VPYmplY3SboWmQwhLAkhMUwATAp2RlZmF1bHSQqW5hdGl2ZU1heJuhbJGkTWF0aMIWGZIXGMDAwMCQpXVuemlwm6FslqthcnJheUZpbHRlcrFpc0FycmF5TGlrZU9iamVjdKluYXRpdmVNYXipYmFzZVRpbWVzqGFycmF5TWFwrGJhc2VQcm9wZXJ0ecIawJIbHMDAwMCQ3AAelgAAAcDCw5YAGAIFwsKWCQADwMLClgsLwMDCwpZcC8AUwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWJwjADMLClgEYCg3CwpYJAAvAwsKWCwzAwMLClggMwMDCwpYBGA4RwsKWCQAPwMLClgsJwMDCwpZACcAIwsKWASESFcLClgkAE8DCwpYLEcDAwsKWIxHAGMLClmEBFhrCwpYEABfAwsKWAAnAGcLClhoJwBDCwpYDCMDAwsKWzQIrERsdwsKWCQXABMLClgkFwMDCwpYDDhzAwsI=
====catalogjs annotation end====*/