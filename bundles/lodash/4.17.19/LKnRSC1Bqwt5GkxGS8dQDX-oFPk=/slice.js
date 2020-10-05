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

const _default = (slice);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2Rpc3QvMTQyLmpzAZPCrC4vZGlzdC83MC5qcwWTwq4uL3RvSW50ZWdlci5qcwmBp2RlZmF1bHSUoWyoX2RlZmF1bHQVwJGTFcDChaliYXNlU2xpY2WboWmQwgLAkgMEwADAp2RlZmF1bHSQrmlzSXRlcmF0ZWVDYWxsm6FpkMIGwJIHCMABwKdkZWZhdWx0kKl0b0ludGVnZXKboWmQwgrAkwsMDcACwKdkZWZhdWx0kKVzbGljZZuhbJOuaXNJdGVyYXRlZUNhbGypdG9JbnRlZ2VyqWJhc2VTbGljZcIOwJIPEMDAwMCQqF9kZWZhdWx0m6FskaVzbGljZcISwJITFMDAwMCQ3AAWlgAAAcDCw5YAGAIFwsKWCQADwMLClgsJwMDCwpYVCcDAwsKWARcGCcLClgkAB8DCwpYLDsDAwsKWzJQOwAzCwpYBGQoOwsKWCQALwMLClgsJwMDCwpZjCcANwsKWMAnABMLCls0B5xYPEcLClgkFwAjCwpYEBcDAwsKWAgESFcLClgYBE8DCwpYACMAQwsKWCQjAwMLClgEOFMDCwg==
====catalogjs annotation end====*/