import { default as baseNth } from "./dist/127.js";
import { default as baseRest } from "./dist/49.js";
import { default as toInteger } from "./toInteger.js";




/**
 * Creates a function that gets the argument at index `n`. If `n` is negative,
 * the nth argument from the end is returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {number} [n=0] The index of the argument to return.
 * @returns {Function} Returns the new pass-thru function.
 * @example
 *
 * var func = _.nthArg(1);
 * func('a', 'b', 'c', 'd');
 * // => 'b'
 *
 * var func = _.nthArg(-2);
 * func('a', 'b', 'c', 'd');
 * // => 'c'
 */

function nthArg(n) {
  n = toInteger(n);
  return baseRest(function (args) {
    return baseNth(args, n);
  });
}

const _default = (nthArg);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTI3LmpzAZPCrC4vZGlzdC80OS5qcwWTwq4uL3RvSW50ZWdlci5qcwmBp2RlZmF1bHSUoWyoX2RlZmF1bHQUwJGTFMDChadiYXNlTnRom6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIKwJILDMACwKdkZWZhdWx0kKZudGhBcmeboWyTqXRvSW50ZWdlcqhiYXNlUmVzdKdiYXNlTnRowg3Akg4PwMDAwJCoX2RlZmF1bHSboWyRpm50aEFyZ8IRwJISE8DAwMCQ3AAVlgAAAcDCw5YAGAIFwsKWCQADwMLClgsHwMDCwpYeB8DAwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWDgjABMLClgEZCg3CwpYJAAvAwsKWCwnAwMLClgwJwAjCwpbNAeASDhDCwpYJBsAMwsKWBAbAwMLClgIBERTCwpYGARLAwsKWAAjAD8LClgkIwMDCwpYBDhPAwsI=
====catalogjs annotation end====*/