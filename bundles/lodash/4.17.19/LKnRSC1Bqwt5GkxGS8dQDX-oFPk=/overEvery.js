import { default as arrayEvery } from "./dist/163.js";
import { default as createOver } from "./dist/5.js";



/**
 * Creates a function that checks if **all** of the `predicates` return
 * truthy when invoked with the arguments it receives.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Function|Function[])} [predicates=[_.identity]]
 *  The predicates to check.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.overEvery([Boolean, isFinite]);
 *
 * func('1');
 * // => true
 *
 * func(null);
 * // => false
 *
 * func(NaN);
 * // => false
 */

var overEvery = createOver(arrayEvery);
const _default = (overEvery);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTYzLmpzAZPCqy4vZGlzdC81LmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBLAkZMSwMKEqmFycmF5RXZlcnmboWmQwgLAkgMEwADAp2RlZmF1bHSQqmNyZWF0ZU92ZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQqW92ZXJFdmVyeZuhbJKqY3JlYXRlT3ZlcqphcnJheUV2ZXJ5wgoNkgsMwMDAwJKqYXJyYXlFdmVyeapjcmVhdGVPdmVyqF9kZWZhdWx0m6FskalvdmVyRXZlcnnCD8CSEBHAwMDAkNwAE5YAAAHAwsOWABgCBcLClgkAA8DCwpYLCsDAwsKWAQrAwMLClgEWBgnCwpYJAAfAwsKWCwrAwMLClgAKwATCwpbNAfcBCg7CwpYEAAvAwsKWAAnADcLClgQJwMDCwpYDAQjAwsKWAQEPEsLClgYBEMDCwpYACMAMwsKWCQjAwMLClgEOEcDCwg==
====catalogjs annotation end====*/