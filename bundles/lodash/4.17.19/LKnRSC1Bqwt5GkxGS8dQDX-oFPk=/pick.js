import { default as basePickBy } from "./dist/12.js";
import { default as hasIn } from "./hasIn.js";
import { default as flatRest } from "./dist/50.js";



/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */

function basePick0(object, paths) {
  return basePickBy(object, paths, function (value, path) {
    return hasIn(object, path);
  });
}

const basePick = (basePick0);



/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */

var pick = flatRest(function (object, paths) {
  return object == null ? {} : basePick(object, paths);
});
const _default = (pick);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvMTIuanMBk8KqLi9oYXNJbi5qcwWTwqwuL2Rpc3QvNTAuanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0HcCRkx3AwoeqYmFzZVBpY2tCeZuhaZDCAsCSAwTAAMCnZGVmYXVsdJClaGFzSW6boWmQwgbAkgcIwAHAp2RlZmF1bHSQqGZsYXRSZXN0m6FpkMIKwJILDMACwKdkZWZhdWx0kKliYXNlUGljazCboWySqmJhc2VQaWNrQnmlaGFzSW7CDcCSDg/AwMDAkKhiYXNlUGlja5uhbJGpYmFzZVBpY2swwhHAkhITwMDAwJCkcGlja5uhbJKoZmxhdFJlc3SoYmFzZVBpY2vCFRiSFhfAwMDAkqhmbGF0UmVzdKhiYXNlUGlja6hfZGVmYXVsdJuhbJGkcGlja8IawJIbHMDAwMCQ3AAelgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYbCsAIwsKWARUGCcLClgkAB8DCwpYLBcDAwsKWNAXAwMLClgEXCg3CwpYJAAvAwsKWCwjAwMLClgAIwBPCwpbNAQwXDhDCwpYJCcAEwsKWBAnAwMLClgIBERTCwpYGARLAwsKWAAjAD8LCljsIwMDCwpbNAakBFRnCwpYEABbAwsKWAATAGMLClgQEwMDCwpYDEwzAwsKWAQEaHcLClgYBG8DCwpYACMAXwsKWCQjAwMLClgEOHMDCwg==
====catalogjs annotation end====*/