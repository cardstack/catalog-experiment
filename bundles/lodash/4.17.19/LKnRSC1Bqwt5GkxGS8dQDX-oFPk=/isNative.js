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

var isMaskable0 = coreJsData ? isFunction : stubFalse;
const isMaskable = (isMaskable0);



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

const _default = (isNative);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvNjkuanMBk8KsLi9kaXN0Lzg4LmpzBZPCry4vaXNGdW5jdGlvbi5qcwmTwq4uL3N0dWJGYWxzZS5qcw2Bp2RlZmF1bHSUoWyoX2RlZmF1bHQlwJGTJcDCiaxiYXNlSXNOYXRpdmWboWmQwgLAkgMEwADAp2RlZmF1bHSQqmNvcmVKc0RhdGGboWmQwgbAkgcIwAHAp2RlZmF1bHSQqmlzRnVuY3Rpb26boWmQwgrAkgsMwALAp2RlZmF1bHSQqXN0dWJGYWxzZZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCraXNNYXNrYWJsZTCboWyTqmNvcmVKc0RhdGGqaXNGdW5jdGlvbqlzdHViRmFsc2XCEhWSExTAwMDAk6pjb3JlSnNEYXRhqmlzRnVuY3Rpb26pc3R1YkZhbHNlqmlzTWFza2FibGWboWyRq2lzTWFza2FibGUwwhfAkhgZktlZaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2lzTWFza2FibGUuanOnZGVmYXVsdMDAwJCvQ09SRV9FUlJPUl9URVhUm6FskMIbwJIcHcDAwMCQqGlzTmF0aXZlm6Fsk6ppc01hc2thYmxlr0NPUkVfRVJST1JfVEVYVKxiYXNlSXNOYXRpdmXCHsCSHyDAwMDAkKhfZGVmYXVsdJuhbJGoaXNOYXRpdmXCIsCSIyTAwMDAkNwAJpYAAAHAwsOWABcCBcLClgkAA8DCwpYLDMDAwsKWEQzAwMLClgEXBgnCwpYJAAfAwsKWCwrAwMLClgAKwAzCwpYBGgoNwsKWCQALwMLClgsKwMDCwpYDCsAQwsKWARkOEcLClgkAD8DCwpYLCcDAwsKWAwnAwMLClsy/ARIWwsKWBAATwMLClgALwBXCwpYEC8DAwsKWAwAIwMLClgEBFxrCwpYGARjAwsKWAArAFMLClhAKwB3CwpYlARsewsKWBEQcwMLClgAPwMDCwpYfD8AEwsKWzQNWCh8hwsKWCQjAGcLClgQIwMDCwpYCASIlwsKWBgEjwMLClgAIwCDCwpYJCMDAwsKWAQ4kwMLC
====catalogjs annotation end====*/