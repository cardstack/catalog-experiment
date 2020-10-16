import { default as baseClamp } from "./dist/148.js";
import { default as copyArray } from "./dist/117.js";
import { default as shuffleSelf } from "./dist/170.js";
import { default as values } from "./values.js";
import { default as isArray } from "./isArray.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";




/**
 * A specialized version of `_.sampleSize` for arrays.
 *
 * @private
 * @param {Array} array The array to sample.
 * @param {number} n The number of elements to sample.
 * @returns {Array} Returns the random elements.
 */

function arraySampleSize(array, n) {
  return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
}






/**
 * The base implementation of `_.sampleSize` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to sample.
 * @param {number} n The number of elements to sample.
 * @returns {Array} Returns the random elements.
 */

function baseSampleSize(collection, n) {
  var array = values(collection);
  return shuffleSelf(array, baseClamp(n, 0, array.length));
}








/**
 * Gets `n` random elements at unique keys from `collection` up to the
 * size of `collection`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @param {number} [n=1] The number of elements to sample.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the random elements.
 * @example
 *
 * _.sampleSize([1, 2, 3], 2);
 * // => [3, 1]
 *
 * _.sampleSize([1, 2, 3], 4);
 * // => [2, 3, 1]
 */

function sampleSize(collection, n, guard) {
  if (guard ? isIterateeCall(collection, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = toInteger(n);
  }

  var func = isArray(collection) ? arraySampleSize : baseSampleSize;
  return func(collection, n);
}


export { sampleSize as default };
/*====catalogjs annotation start====
lZeVwq0uL2Rpc3QvMTQ4LmpzAcLAlcKtLi9kaXN0LzExNy5qcwbCwJXCrS4vZGlzdC8xNzAuanMKwsCVwqsuL3ZhbHVlcy5qcw/CwJXCrC4vaXNBcnJheS5qcxPCwJXCrC4vZGlzdC83MC5qcxfCwJXCri4vdG9JbnRlZ2VyLmpzG8LAgadkZWZhdWx0lKFsqnNhbXBsZVNpemUowJGTKMDAiqliYXNlQ2xhbXCboWmQwgLAkwMEBcAAwKdkZWZhdWx0kKljb3B5QXJyYXmboWmQwgfAkggJwAHAp2RlZmF1bHSQq3NodWZmbGVTZWxmm6FpkMILwJMMDQ7AAsCnZGVmYXVsdJCmdmFsdWVzm6FpkMIQwJIREsADwKdkZWZhdWx0kKdpc0FycmF5m6FpkMIUwJIVFsAEwKdkZWZhdWx0kK5pc0l0ZXJhdGVlQ2FsbJuhaZDCGMCSGRrABcCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIcwJIdHsAGwKdkZWZhdWx0kK9hcnJheVNhbXBsZVNpemWboWyTq3NodWZmbGVTZWxmqWNvcHlBcnJhealiYXNlQ2xhbXDCH8CSICGS2V5odHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYXJyYXlTYW1wbGVTaXplLmpzp2RlZmF1bHTAwMCQrmJhc2VTYW1wbGVTaXplm6Fsk6Z2YWx1ZXOrc2h1ZmZsZVNlbGapYmFzZUNsYW1wwiLAkiMkktldaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Jhc2VTYW1wbGVTaXplLmpzp2RlZmF1bHTAwMCQqnNhbXBsZVNpemWboWyVrmlzSXRlcmF0ZWVDYWxsqXRvSW50ZWdlcqdpc0FycmF5r2FycmF5U2FtcGxlU2l6Za5iYXNlU2FtcGxlU2l6ZcIlwJImJ8DAwMCQ3AAplgAAAcDCw5YAGAIGwsKWCQADwMLClgsJwMDCwpYJCcDAwsKWCAnAwMLClgEYBwrCwpYJAAjAwsKWCwnAwMLClgEJwATCwpYBGAsPwsKWCQAMwMLClgsLwMDCwpYWC8AJwsKWFwvABcLClgEWEBPCwpYJABHAwsKWCwbAwMLCliAGwA7CwpYBFxQXwsKWCQAVwMLClgsHwMDCwpYXB8AhwsKWARcYG8LClgkAGcDCwpYLDsDAwsKWJw7AHsLClgEZHB/CwpYJAB3AwsKWCwnAwMLClkoJwBbCwpbM6RggIsLClgkPwA3CwpYPD8AkwsKWzQEIGCMlwsKWCQ7AEsLClgMOwMDCwpbNAiUhJijCwpYJCsAawsKWCQrAwMLClgMOJ8DCwg==
====catalogjs annotation end====*/