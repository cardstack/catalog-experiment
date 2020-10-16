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


export { nthArg as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTI3LmpzAcLAlcKsLi9kaXN0LzQ5LmpzBcLAlcKuLi90b0ludGVnZXIuanMJwsCBp2RlZmF1bHSUoWymbnRoQXJnEMCRkxDAwISnYmFzZU50aJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQqXRvSW50ZWdlcpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCmbnRoQXJnm6Fsk6l0b0ludGVnZXKoYmFzZVJlc3SnYmFzZU50aMINwJIOD8DAwMCQ3AARlgAAAcDCw5YAGAIFwsKWCQADwMLClgsHwMDCwpYeB8DAwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWDgjABMLClgEZCg3CwpYJAAvAwsKWCwnAwMLClgwJwAjCwpbNAeASDhDCwpYJBsAMwsKWCQbAwMLClgMOD8DCwg==
====catalogjs annotation end====*/