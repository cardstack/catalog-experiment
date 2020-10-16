import { default as toNumber } from "./toNumber.js";


/** Used as references for various `Number` constants. */

var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */

function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }

  value = toNumber(value);

  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }

  return value === value ? value : 0;
}


export { toFinite as default };
/*====catalogjs annotation start====
lZGVwq0uL3RvTnVtYmVyLmpzAcLAgadkZWZhdWx0lKFsqHRvRmluaXRlEcCRkxHAwISodG9OdW1iZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQqElORklOSVRZm6FskMIGCpMHCAnAwMDAkKtNQVhfSU5URUdFUpuhbJDCC8CSDA3AwMDAkKh0b0Zpbml0ZZuhbJOodG9OdW1iZXKoSU5GSU5JVFmrTUFYX0lOVEVHRVLCDsCSDxDAwMDAkNwAEpYAAAHAwsOWABgCBcLClgkAA8DCwpYLCMDAwsKWTQjACMLClj4BBg7CwpYEAAcLwsKWAAjACsLClhoIwAnCwpYPCMANwsKWAwXAwMLClgYaDMDCwpYAC8DAwsKWOQvAwMLCls0Bli4PEcLClgkIwATCwpYJCMDAwsKWAw4QwMLC
====catalogjs annotation end====*/