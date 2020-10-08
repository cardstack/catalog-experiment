import { default as baseGetTag } from "./dist/86.js";
import { default as isLength } from "./isLength.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";




/** `Object#toString` result references. */

var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';
/** Used to identify `toStringTag` values of typed arrays. */

var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */

function baseIsTypedArray0(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

const baseIsTypedArray = (baseIsTypedArray0);




/* Node.js helper references. */

var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */

var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
const _default = (isTypedArray);
export { _default as default };
/*====catalogjs annotation start====
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wpYBCcB6wsKWBhU8wMLClgAKwMDCwpYBCsB9wsKWAQE/YMLClgQZQELCwpYADsDAwsKWAQ7Ab8LClgYWQ0XCwpYAC8DAwsKWAQvAccLClgYaRkjCwpYACsDAwsKWAQrAZMLClgYaSUvCwpYACsDAwsKWAQrAZcLClgYXTE7CwpYAB8DAwsKWAQfAZsLClgYYT1HCwpYACMDAwsKWAQjAZ8LClgYYUlTCwpYACMDAwsKWAQjAaMLClgYYVVfCwpYACMDAwsKWAQjAacLClgYfWFrCwpYAD8DAwsKWAQ/AasLClgYZW13CwpYACcDAwsKWAQnAa8LClgYZXsDCwpYACcDAwsKWAQnAbMLClkABYWPCwpYEAGLAwsKWAA7AfMLClgEOwEfCwpYEDsBKwsKWBA7ATcLClgQOwFDCwpYEDsBTwsKWBA7AVsLClgQOwFnCwpYEDsBcwsKWBA7AX8LClgoOwBnCwpYEDsAcwsKWBA7AQcLClgQOwB/CwpYEDsBEwsKWBA7AIsLClgQOwCXCwpYEDsAowsKWBA7AK8LClgQOwC7CwpYEDsAxwsKWBA7ANMLClgQOwDfCwpYEDsA6wsKWBA7APcLClhQOwATCwpYDAsDAwsKWzOkLfsyAwsKWCRHADMLClgQRwMDCwpYCAcyBzITCwpYGAcyCwMLClgAQwH/CwpYEEMDAwsKWJwHMhcyKwsKWBADMhsDCwpYAEMDMicLClgAQwBDCwpYBEMDMg8LClgMNFMDCwpbNAV8BzIvMj8LClgQAzIzAwsKWAAzAzI7CwpYEDMDAwsKWAwDMh8DCwpYBAcyQzJPCwpYGAcyRwMLClgAIwMyNwsKWCQjAwMLClgEOzJLAwsI=
====catalogjs annotation end====*/