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

function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}






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

export { isTypedArray as default };
/*====catalogjs annotation start====
lZWVwqwuL2Rpc3QvODYuanMBwsCVwq0uL2lzTGVuZ3RoLmpzBcLAlcKxLi9pc09iamVjdExpa2UuanMJwsCVwq0uL2Rpc3QvMTM1LmpzDcLAlcKsLi9kaXN0Lzk0LmpzEcLAgadkZWZhdWx0lKFsrGlzVHlwZWRBcnJhecyLwJGTzIvAwN4AIapiYXNlR2V0VGFnm6FpkMICwJIDBMAAwKdkZWZhdWx0kKhpc0xlbmd0aJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIKwJILDMACwKdkZWZhdWx0kKliYXNlVW5hcnmboWmQwg7Akg8QwAPAp2RlZmF1bHSQqG5vZGVVdGlsm6FpkMISwJMTFBXABMCnZGVmYXVsdJCnYXJnc1RhZ5uhbJDDF8CSGBnAwMDAkKhhcnJheVRhZ5uhbJDDGsCSGxzAwMDAkKdib29sVGFnm6FskMMdwJIeH8DAwMCQp2RhdGVUYWeboWyQwyDAkiEiwMDAwJCoZXJyb3JUYWeboWyQwyPAkiQlwMDAwJCnZnVuY1RhZ5uhbJDDJsCSJyjAwMDAkKZtYXBUYWeboWyQwynAkiorwMDAwJCpbnVtYmVyVGFnm6FskMMswJItLsDAwMCQqW9iamVjdFRhZ5uhbJDDL8CSMDHAwMDAkKlyZWdleHBUYWeboWyQwzLAkjM0wMDAwJCmc2V0VGFnm6FskMM1wJI2N8DAwMCQqXN0cmluZ1RhZ5uhbJDDOMCSOTrAwMDAkKp3ZWFrTWFwVGFnm6FskMM7wJI8PcDAwMCQrmFycmF5QnVmZmVyVGFnm6FskMM/wJJAQcDAwMCQq2RhdGFWaWV3VGFnm6FskMNCwJJDRMDAwMCQqmZsb2F0MzJUYWeboWyQw0XAkkZHwMDAwJCqZmxvYXQ2NFRhZ5uhbJDDSMCSSUrAwMDAkKdpbnQ4VGFnm6FskMNLwJJMTcDAwMCQqGludDE2VGFnm6FskMNOwJJPUMDAwMCQqGludDMyVGFnm6FskMNRwJJSU8DAwMCQqHVpbnQ4VGFnm6FskMNUwJJVVsDAwMCQr3VpbnQ4Q2xhbXBlZFRhZ5uhbJDDV8CSWFnAwMDAkKl1aW50MTZUYWeboWyQw1rAkltcwMDAwJCpdWludDMyVGFnm6FskMNdwJJeX8DAwMCQrnR5cGVkQXJyYXlUYWdzm6FskMNhfNwAGmJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7wMDAwJCwYmFzZUlzVHlwZWRBcnJheZuhbJSsaXNPYmplY3RMaWtlqGlzTGVuZ3RornR5cGVkQXJyYXlUYWdzqmJhc2VHZXRUYWfCfcCSfn+S2V9odHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYmFzZUlzVHlwZWRBcnJheS5qc6dkZWZhdWx0wMDAkLBub2RlSXNUeXBlZEFycmF5m6Fskahub2RlVXRpbMLMgcyFk8yCzIPMhMDAwMCRqG5vZGVVdGlsrGlzVHlwZWRBcnJheZuhbJOwbm9kZUlzVHlwZWRBcnJhealiYXNlVW5hcnmwYmFzZUlzVHlwZWRBcnJhecLMh8yKksyIzInAwMDAk6liYXNlVW5hcnmwYmFzZUlzVHlwZWRBcnJhebBub2RlSXNUeXBlZEFycmF53ACMlgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYBCsDAwsKWARgGCcLClgkAB8DCwpYLCMDAwsKWCwjAe8LClgEcCg3CwpYJAAvAwsKWCwzAwMLClhMMwAjCwpYBGA4RwsKWCQAPwMLClgsJwMDCwpYDCcDMhMLClgEXEhbCwpYJABPAwsKWCwjAwMLClgAIwBXCwpYECMDAwsKWMgEXPsLClgQXGBrCwpYAB8DAwsKWAQfAbcLClgYTGx3CwpYACMDAwsKWAQjAbsLClgYVHiDCwpYAB8DAwsKWAQfAcMLClgYSISPCwpYAB8DAwsKWAQfAcsLClgYTJCbCwpYACMDAwsKWAQjAc8LClgYWJynCwpYAB8DAwsKWAQfAdMLClgYRKizCwpYABsDAwsKWAQbAdcLClgYULS/CwpYACcDAwsKWAQnAdsLClgYUMDLCwpYACcDAwsKWAQnAd8LClgYUMzXCwpYACcDAwsKWAQnAeMLClgYRNjjCwpYABsDAwsKWAQbAecLClgYUOTvCwpYACcDAwsKWAQnAesLClgYVPMDCwpYACsDAwsKWAQrAfcLClgEBP2DCwpYEGUBCwsKWAA7AwMLClgEOwG/CwpYGFkNFwsKWAAvAwMLClgELwHHCwpYGGkZIwsKWAArAwMLClgEKwGTCwpYGGklLwsKWAArAwMLClgEKwGXCwpYGF0xOwsKWAAfAwMLClgEHwGbCwpYGGE9RwsKWAAjAwMLClgEIwGfCwpYGGFJUwsKWAAjAwMLClgEIwGjCwpYGGFVXwsKWAAjAwMLClgEIwGnCwpYGH1hawsKWAA/AwMLClgEPwGrCwpYGGVtdwsKWAAnAwMLClgEJwGvCwpYGGV7AwsKWAAnAwMLClgEJwGzCwpZAAWFjwsKWBABiwMLClgAOwHzCwpYBDsBHwsKWBA7ASsLClgQOwE3CwpYEDsBQwsKWBA7AU8LClgQOwFbCwpYEDsBZwsKWBA7AXMLClgQOwF/CwpYKDsAZwsKWBA7AHMLClgQOwEHCwpYEDsAfwsKWBA7ARMLClgQOwCLCwpYEDsAlwsKWBA7AKMLClgQOwCvCwpYEDsAuwsKWBA7AMcLClgQOwDTCwpYEDsA3wsKWBA7AOsLClgQOwD3CwpYUDsAEwsKWAwLAwMLClszpC37MgMLClgkQwAzCwpYEEMDAwsKWKQHMgcyGwsKWBADMgsDCwpYAEMDMhcLClgAQwBDCwpYBEMB/wsKWAw0UwMLCls0BXwHMh8yLwsKWBADMiMDCwpYADMDMisLClgkMwMDCwpYDAMyDwMLClgIOzInAwsI=
====catalogjs annotation end====*/