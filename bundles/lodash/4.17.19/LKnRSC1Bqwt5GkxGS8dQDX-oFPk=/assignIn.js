import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keysIn } from "./keysIn.js";




/**
 * This method is like `_.assign` except that it iterates over own and
 * inherited source properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assign
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assignIn({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
 */

var assignIn = createAssigner(function (object, source) {
  copyObject(source, keysIn(source), object);
});

export { assignIn as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvNTQuanMBwsCVwqwuL2Rpc3QvNDguanMFwsCVwqsuL2tleXNJbi5qcwnCwIGnZGVmYXVsdJShbKhhc3NpZ25JbhLAkZMSwMCEqmNvcHlPYmplY3SboWmQwgLAkgMEwADAp2RlZmF1bHSQrmNyZWF0ZUFzc2lnbmVym6FpkMIGwJIHCMABwKdkZWZhdWx0kKZrZXlzSW6boWmQwgrAkgsMwALAp2RlZmF1bHSQqGFzc2lnbklum6Fsk65jcmVhdGVBc3NpZ25lcqpjb3B5T2JqZWN0pmtleXNJbsIOEZIPEMDAwMCTqmNvcHlPYmplY3SuY3JlYXRlQXNzaWduZXKma2V5c0lu3AATlgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYfCsAMwsKWARcGCcLClgkAB8DCwpYLDsDAwsKWAA7ABMLClgEWCg3CwpYJAAvAwsKWCwbAwMLClgkGwMDCwpbNAogBDhLCwpYEAA/AwsKWAAjAEcLClgkIwMDCwpYDFQjAwsKWAg4QwMLC
====catalogjs annotation end====*/