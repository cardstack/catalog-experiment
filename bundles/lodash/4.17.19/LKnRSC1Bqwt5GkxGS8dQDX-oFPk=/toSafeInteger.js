import { default as baseClamp } from "./dist/148.js";
import { default as toInteger } from "./toInteger.js";



/** Used as references for various `Number` constants. */

var MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Converts `value` to a safe integer. A safe integer can be compared and
 * represented correctly.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toSafeInteger(3.2);
 * // => 3
 *
 * _.toSafeInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toSafeInteger(Infinity);
 * // => 9007199254740991
 *
 * _.toSafeInteger('3.2');
 * // => 3
 */

function toSafeInteger(value) {
  return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
}


export { toSafeInteger as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTQ4LmpzAcLAlcKuLi90b0ludGVnZXIuanMFwsCBp2RlZmF1bHSUoWytdG9TYWZlSW50ZWdlchHAkZMRwMCEqWJhc2VDbGFtcJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIGwJIHCMABwKdkZWZhdWx0kLBNQVhfU0FGRV9JTlRFR0VSm6FskMIKwJMLDA3AwMDAkK10b1NhZmVJbnRlZ2Vym6Fsk6liYXNlQ2xhbXCpdG9JbnRlZ2VysE1BWF9TQUZFX0lOVEVHRVLCDsCSDxDAwMDAkNwAEpYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWGwnACMLClgEZBgnCwpYJAAfAwsKWCwnAwMLClgEJwAzCwpY/AQoOwsKWBBMLwMLClgAQwMDCwpYKEMANwsKWAhDAwMLCls0B1h4PEcLClgkNwATCwpYJDcDAwsKWAw4QwMLC
====catalogjs annotation end====*/