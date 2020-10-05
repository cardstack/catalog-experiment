import { default as copyArray } from "./dist/117.js";
import { default as shuffleSelf } from "./dist/170.js";
import { default as values } from "./values.js";
import { default as isArray } from "./isArray.js";



/**
 * A specialized version of `_.shuffle` for arrays.
 *
 * @private
 * @param {Array} array The array to shuffle.
 * @returns {Array} Returns the new shuffled array.
 */

function arrayShuffle0(array) {
  return shuffleSelf(copyArray(array));
}

const arrayShuffle = (arrayShuffle0);



/**
 * The base implementation of `_.shuffle`.
 *
 * @private
 * @param {Array|Object} collection The collection to shuffle.
 * @returns {Array} Returns the new shuffled array.
 */

function baseShuffle0(collection) {
  return shuffleSelf(values(collection));
}

const baseShuffle = (baseShuffle0);




/**
 * Creates an array of shuffled values, using a version of the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to shuffle.
 * @returns {Array} Returns the new shuffled array.
 * @example
 *
 * _.shuffle([1, 2, 3, 4]);
 * // => [4, 1, 3, 2]
 */

function shuffle(collection) {
  var func = isArray(collection) ? arrayShuffle : baseShuffle;
  return func(collection);
}

const _default = (shuffle);
export { _default as default };
/*====catalogjs annotation start====
lZSTwq0uL2Rpc3QvMTE3LmpzAZPCrS4vZGlzdC8xNzAuanMFk8KrLi92YWx1ZXMuanMKk8KsLi9pc0FycmF5LmpzDoGnZGVmYXVsdJShbKhfZGVmYXVsdCfAkZMnwMKKqWNvcHlBcnJheZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCrc2h1ZmZsZVNlbGaboWmQwgbAkwcICcABwKdkZWZhdWx0kKZ2YWx1ZXOboWmQwgvAkgwNwALAp2RlZmF1bHSQp2lzQXJyYXmboWmQwg/AkhARwAPAp2RlZmF1bHSQrWFycmF5U2h1ZmZsZTCboWySq3NodWZmbGVTZWxmqWNvcHlBcnJhecISwJITFMDAwMCQrGFycmF5U2h1ZmZsZZuhbJGtYXJyYXlTaHVmZmxlMMIWwJIXGMDAwMCQrGJhc2VTaHVmZmxlMJuhbJKrc2h1ZmZsZVNlbGamdmFsdWVzwhnAkhobwMDAwJCrYmFzZVNodWZmbGWboWyRrGJhc2VTaHVmZmxlMMIdwJIeH8DAwMCQp3NodWZmbGWboWyTp2lzQXJyYXmsYXJyYXlTaHVmZmxlq2Jhc2VTaHVmZmxlwiDAkiEiwMDAwJCoX2RlZmF1bHSboWyRp3NodWZmbGXCJMCSJSbAwMDAkNwAKJYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWAQnAwMLClgEYBgrCwpYJAAfAwsKWCwvAwMLClhMLwATCwpYYC8ANwsKWARYLDsLClgkADMDCwpYLBsDAwsKWAQbAwMLClgEXDxLCwpYJABDAwsKWCwfAwMLClhwHwBjCwpbMsgsTFcLClgkNwAjCwpYEDcDAwsKWAgEWGcLClgYBF8DCwpYADMAUwsKWDwzAH8LClsy6EBocwsKWCQzACcLClgQMwMDCwpYCAR0gwsKWBgEewMLClgALwBvCwpYDC8DAwsKWzQGVHiEjwsKWCQfAEcLClgQHwMDCwpYCASQnwsKWBgElwMLClgAIwCLCwpYJCMDAwsKWAQ4mwMLC
====catalogjs annotation end====*/