import { default as createWrap } from "./dist/23.js";
import { default as flatRest } from "./dist/50.js";



/** Used to compose bitmasks for function metadata. */

var WRAP_REARG_FLAG = 256;
/**
 * Creates a function that invokes `func` with arguments arranged according
 * to the specified `indexes` where the argument value at the first index is
 * provided as the first argument, the argument value at the second index is
 * provided as the second argument, and so on.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to rearrange arguments for.
 * @param {...(number|number[])} indexes The arranged argument indexes.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var rearged = _.rearg(function(a, b, c) {
 *   return [a, b, c];
 * }, [2, 0, 1]);
 *
 * rearged('b', 'c', 'a')
 * // => ['a', 'b', 'c']
 */

var rearg = flatRest(function (func, indexes) {
  return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
});

export { rearg as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvMjMuanMBwsCVwqwuL2Rpc3QvNTAuanMFwsCBp2RlZmF1bHSUoWylcmVhcmcSwJGTEsDAhKpjcmVhdGVXcmFwm6FpkMICwJIDBMAAwKdkZWZhdWx0kKhmbGF0UmVzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCvV1JBUF9SRUFSR19GTEFHm6FskMIKwJILDMDAwMCQpXJlYXJnm6Fsk6hmbGF0UmVzdKpjcmVhdGVXcmFwr1dSQVBfUkVBUkdfRkxBR8IOEZIPEMDAwMCTqmNyZWF0ZVdyYXCoZmxhdFJlc3SvV1JBUF9SRUFSR19GTEFH3AATlgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYlCsAMwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjABMLCljwBCg3CwpYEBgvAwsKWAA/AwMLClgcPwMDCwpbNArkBDhLCwpYEAA/AwsKWAAXAEcLClgkFwMDCwpYDLwjAwsKWAg4QwMLC
====catalogjs annotation end====*/