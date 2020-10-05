import { default as baseMerge } from "./dist/53.js";
import { default as createAssigner } from "./dist/48.js";



/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */

var mergeWith = createAssigner(function (object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});
const _default = (mergeWith);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNTMuanMBk8KsLi9kaXN0LzQ4LmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBLAkZMSwMKEqWJhc2VNZXJnZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCuY3JlYXRlQXNzaWduZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQqW1lcmdlV2l0aJuhbJKuY3JlYXRlQXNzaWduZXKpYmFzZU1lcmdlwgoNkgsMwMDAwJKpYmFzZU1lcmdlrmNyZWF0ZUFzc2lnbmVyqF9kZWZhdWx0m6FskaltZXJnZVdpdGjCD8CSEBHAwMDAkNwAE5YAAAHAwsOWABcCBcLClgkAA8DCwpYLCcDAwsKWNQnAwMLClgEXBgnCwpYJAAfAwsKWCw7AwMLClgAOwATCwpbNA+MBCg7CwpYEAAvAwsKWAAnADcLClgQJwMDCwpYDKgjAwsKWAQEPEsLClgYBEMDCwpYACMAMwsKWCQjAwMLClgEOEcDCwg==
====catalogjs annotation end====*/