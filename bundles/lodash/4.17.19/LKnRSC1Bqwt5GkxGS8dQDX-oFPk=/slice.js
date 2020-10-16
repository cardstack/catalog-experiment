import { default as baseSlice } from "./dist/142.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";




/**
 * Creates a slice of `array` from `start` up to, but not including, `end`.
 *
 * **Note:** This method is used instead of
 * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
 * returned.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */

function slice(array, start, end) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
    start = 0;
    end = length;
  } else {
    start = start == null ? 0 : toInteger(start);
    end = end === undefined ? length : toInteger(end);
  }

  return baseSlice(array, start, end);
}


export { slice as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTQyLmpzAcLAlcKsLi9kaXN0LzcwLmpzBcLAlcKuLi90b0ludGVnZXIuanMJwsCBp2RlZmF1bHSUoWylc2xpY2URwJGTEcDAhKliYXNlU2xpY2WboWmQwgLAkgMEwADAp2RlZmF1bHSQrmlzSXRlcmF0ZWVDYWxsm6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgrAkwsMDcACwKdkZWZhdWx0kKVzbGljZZuhbJOuaXNJdGVyYXRlZUNhbGypdG9JbnRlZ2VyqWJhc2VTbGljZcIOwJIPEMDAwMCQ3AASlgAAAcDCw5YAGAIFwsKWCQADwMLClgsJwMDCwpYVCcDAwsKWARcGCcLClgkAB8DCwpYLDsDAwsKWzJQOwAzCwpYBGQoOwsKWCQALwMLClgsJwMDCwpZjCcANwsKWMAnABMLCls0B5xYPEcLClgkFwAjCwpYJBcDAwsKWAw4QwMLC
====catalogjs annotation end====*/