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

function arraySampleSize0(array, n) {
  return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
}

const arraySampleSize = (arraySampleSize0);




/**
 * The base implementation of `_.sampleSize` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to sample.
 * @param {number} n The number of elements to sample.
 * @returns {Array} Returns the random elements.
 */

function baseSampleSize0(collection, n) {
  var array = values(collection);
  return shuffleSelf(array, baseClamp(n, 0, array.length));
}

const baseSampleSize = (baseSampleSize0);






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

const _default = (sampleSize);
export { _default as default };
/*====catalogjs annotation start====
lZeTwq0uL2Rpc3QvMTQ4LmpzAZPCrS4vZGlzdC8xMTcuanMGk8KtLi9kaXN0LzE3MC5qcwqTwqsuL3ZhbHVlcy5qcw+TwqwuL2lzQXJyYXkuanMTk8KsLi9kaXN0LzcwLmpzF5PCri4vdG9JbnRlZ2VyLmpzG4GnZGVmYXVsdJShbKhfZGVmYXVsdDTAkZM0wMKNqWJhc2VDbGFtcJuhaZDCAsCTAwQFwADAp2RlZmF1bHSQqWNvcHlBcnJheZuhaZDCB8CSCAnAAcCnZGVmYXVsdJCrc2h1ZmZsZVNlbGaboWmQwgvAkwwNDsACwKdkZWZhdWx0kKZ2YWx1ZXOboWmQwhDAkhESwAPAp2RlZmF1bHSQp2lzQXJyYXmboWmQwhTAkhUWwATAp2RlZmF1bHSQrmlzSXRlcmF0ZWVDYWxsm6FpkMIYwJIZGsAFwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwhzAkh0ewAbAp2RlZmF1bHSQsGFycmF5U2FtcGxlU2l6ZTCboWyTq3NodWZmbGVTZWxmqWNvcHlBcnJhealiYXNlQ2xhbXDCH8CSICHAwMDAkK9hcnJheVNhbXBsZVNpemWboWyRsGFycmF5U2FtcGxlU2l6ZTDCI8CSJCXAwMDAkK9iYXNlU2FtcGxlU2l6ZTCboWyTpnZhbHVlc6tzaHVmZmxlU2VsZqliYXNlQ2xhbXDCJsCSJyjAwMDAkK5iYXNlU2FtcGxlU2l6ZZuhbJGvYmFzZVNhbXBsZVNpemUwwirAkisswMDAwJCqc2FtcGxlU2l6ZZuhbJWuaXNJdGVyYXRlZUNhbGypdG9JbnRlZ2Vyp2lzQXJyYXmvYXJyYXlTYW1wbGVTaXplrmJhc2VTYW1wbGVTaXplwi3Aki4vwMDAwJCoX2RlZmF1bHSboWyRqnNhbXBsZVNpemXCMcCSMjPAwMDAkNwANZYAAAHAwsOWABgCBsLClgkAA8DCwpYLCcDAwsKWCQnAwMLClggJwMDCwpYBGAcKwsKWCQAIwMLClgsJwMDCwpYBCcAEwsKWARgLD8LClgkADMDCwpYLC8DAwsKWFgvACcLClhcLwAXCwpYBFhATwsKWCQARwMLClgsGwMDCwpYgBsAOwsKWARcUF8LClgkAFcDCwpYLB8DAwsKWFwfAJcLClgEXGBvCwpYJABnAwsKWCw7AwMLClicOwB7CwpYBGRwfwsKWCQAdwMLClgsJwMDCwpZKCcAWwsKWzOkYICLCwpYJEMANwsKWBBDAwMLClgIBIybCwpYGASTAwsKWAA/AIcLClg8PwCzCwpbNAQYYJynCwpYJD8ASwsKWBA/AwMLClgIBKi3CwpYGASvAwsKWAA7AKMLClgMOwMDCwpbNAiMhLjDCwpYJCsAawsKWBArAwMLClgIBMTTCwpYGATLAwsKWAAjAL8LClgkIwMDCwpYBDjPAwsI=
====catalogjs annotation end====*/