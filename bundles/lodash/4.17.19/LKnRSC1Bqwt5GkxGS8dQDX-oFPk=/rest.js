import { default as baseRest } from "./dist/49.js";
import { default as toInteger } from "./toInteger.js";



/** Error message constants. */

var FUNC_ERROR_TEXT = 'Expected a function';
/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as
 * an array.
 *
 * **Note:** This method is based on the
 * [rest parameter](https://mdn.io/rest_parameters).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.rest(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */

function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  start = start === undefined ? start : toInteger(start);
  return baseRest(func, start);
}


export { rest as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNDkuanMBwsCVwq4uL3RvSW50ZWdlci5qcwXCwIGnZGVmYXVsdJShbKRyZXN0EMCRkxDAwISoYmFzZVJlc3SboWmQwgLAkgMEwADAp2RlZmF1bHSQqXRvSW50ZWdlcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCvRlVOQ19FUlJPUl9URVhUm6FskMIKwJILDMDAwMCQpHJlc3SboWyTr0ZVTkNfRVJST1JfVEVYVKl0b0ludGVnZXKoYmFzZVJlc3TCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWEgjAwMLClgEZBgnCwpYJAAfAwsKWCwnAwMLCljAJwATCwpYlAQoNwsKWBBgLwMLClgAPwMDCwpZLD8AIwsKWzQMgEA4QwsKWCQTADMLClgkEwMDCwpYDDg/AwsI=
====catalogjs annotation end====*/