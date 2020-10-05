import { default as baseAt } from "./dist/1.js";
import { default as flatRest } from "./dist/50.js";



/**
 * Creates an array of values corresponding to `paths` of `object`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Array} Returns the picked values.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
 *
 * _.at(object, ['a[0].b.c', 'a[1]']);
 * // => [3, 4]
 */

var at = flatRest(baseAt);
const _default = (at);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvMS5qcwGTwqwuL2Rpc3QvNTAuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSmYmFzZUF0m6FpkMICwJIDBMAAwKdkZWZhdWx0kKhmbGF0UmVzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCiYXSboWySqGZsYXRSZXN0pmJhc2VBdMIKDZILDMDAwMCSpmJhc2VBdKhmbGF0UmVzdKhfZGVmYXVsdJuhbJGiYXTCD8CSEBHAwMDAkNwAE5YAAAHAwsOWABYCBcLClgkAA8DCwpYLBsDAwsKWAQbAwMLClgEXBgnCwpYJAAfAwsKWCwjAwMLClgAIwATCwpbNAbgBCg7CwpYEAAvAwsKWAALADcLClgQCwMDCwpYDAQjAwsKWAQEPEsLClgYBEMDCwpYACMAMwsKWCQjAwMLClgEOEcDCwg==
====catalogjs annotation end====*/