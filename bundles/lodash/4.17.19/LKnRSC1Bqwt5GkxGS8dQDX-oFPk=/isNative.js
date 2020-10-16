import { default as baseIsNative } from "./dist/69.js";
import { default as coreJsData } from "./dist/88.js";
import { default as isFunction } from "./isFunction.js";
import { default as stubFalse } from "./stubFalse.js";




/**
 * Checks if `func` is capable of being masked.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
 */

var isMaskable = coreJsData ? isFunction : stubFalse;




/** Error message constants. */

var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.';
/**
 * Checks if `value` is a pristine native function.
 *
 * **Note:** This method can't reliably detect native functions in the presence
 * of the core-js package because core-js circumvents this kind of detection.
 * Despite multiple requests, the core-js maintainer has made it clear: any
 * attempt to fix the detection will be obstructed. As a result, we're left
 * with little choice but to throw an error. Unfortunately, this also affects
 * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
 * which rely on core-js.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */

function isNative(value) {
  if (isMaskable(value)) {
    throw new Error(CORE_ERROR_TEXT);
  }

  return baseIsNative(value);
}


export { isNative as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvNjkuanMBwsCVwqwuL2Rpc3QvODguanMFwsCVwq8uL2lzRnVuY3Rpb24uanMJwsCVwq4uL3N0dWJGYWxzZS5qcw3CwIGnZGVmYXVsdJShbKhpc05hdGl2ZR3AkZMdwMCHrGJhc2VJc05hdGl2ZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqY29yZUpzRGF0YZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCqaXNGdW5jdGlvbpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCpc3R1YkZhbHNlm6FpkMIOwJIPEMADwKdkZWZhdWx0kKppc01hc2thYmxlm6Fsk6pjb3JlSnNEYXRhqmlzRnVuY3Rpb26pc3R1YkZhbHNlwhIVkhMUktlZaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2lzTWFza2FibGUuanOnZGVmYXVsdMDAwJOqY29yZUpzRGF0Yappc0Z1bmN0aW9uqXN0dWJGYWxzZa9DT1JFX0VSUk9SX1RFWFSboWyQwhfAkhgZwMDAwJCoaXNOYXRpdmWboWyTqmlzTWFza2FibGWvQ09SRV9FUlJPUl9URVhUrGJhc2VJc05hdGl2ZcIawJIbHMDAwMCQ3AAelgAAAcDCw5YAFwIFwsKWCQADwMLClgsMwMDCwpYRDMDAwsKWARcGCcLClgkAB8DCwpYLCsDAwsKWAArADMLClgEaCg3CwpYJAAvAwsKWCwrAwMLClgMKwBDCwpYBGQ4RwsKWCQAPwMLClgsJwMDCwpYDCcDAwsKWzL8BEhbCwpYEABPAwsKWAArAFcLClhAKwBnCwpYDAAjAwsKWJgEXGsLClgREGMDCwpYAD8DAwsKWHw/ABMLCls0DVgobHcLClgkIwBTCwpYJCMDAwsKWAw4cwMLC
====catalogjs annotation end====*/