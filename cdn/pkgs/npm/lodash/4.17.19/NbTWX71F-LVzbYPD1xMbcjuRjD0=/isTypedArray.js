import { default as baseGetTag } from "./dist/86.js";
import { default as isLength } from "./isLength.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";
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
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
export { isTypedArray as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvODYuanMDwsCVwq0uL2lzTGVuZ3RoLmpzBsLAlcKxLi9pc09iamVjdExpa2UuanMJwsCVwq0uL2Rpc3QvMTM1LmpzDMLAlcKsLi9kaXN0Lzk0LmpzD8LAgadkZWZhdWx0laFsrGlzVHlwZWRBcnJhecyMwMDcAI6XoW8AAAPAkkbMhMCZoWQJAALAkQLAwpmhaapiYXNlR2V0VGFnkgJ8wACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahpc0xlbmd0aJIFesABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmsaXNPYmplY3RMaWtlkgh5wAKnZGVmYXVsdMDAwJihcgsMwMCRB8DCnKFpARwHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaaliYXNlVW5hcnmSC8yIwAOnZGVmYXVsdMDAwJihcgsJwMCRCsDCnKFpARgKD5DAwgPCwMCZoWQJAA7AkQ7Awpmhaahub2RlVXRpbJMOzIHMgsAEp2RlZmF1bHTAwMCYoXILCMDAkQ3AwpyhaQEXDRCQwMIEwsDAl6FvAQARfZDAmKFnAAESLJDAwpmhZAQXExSSExHAwpmhbKdhcmdzVGFnkhNawMDAEZFG2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIAB8DAkRLAwpmhZAYTFRaSFRHAwpmhbKhhcnJheVRhZ5IVXMDAwBGRRtlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAjAwJEUwMKZoWQGFRcYkhcRwMKZoWynYm9vbFRhZ5IXYMDAwBGRRtlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAfAwJEWwMKZoWQGEhkakhkRwMKZoWynZGF0ZVRhZ5IZZMDAwBGRRtlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAfAwJEYwMKZoWQGExsckhsRwMKZoWyoZXJyb3JUYWeSG2bAwMARkUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAIwMCRGsDCmaFkBhYdHpIdEcDCmaFsp2Z1bmNUYWeSHWjAwMARkUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAHwMCRHMDCmaFkBhEfIJIfEcDCmaFspm1hcFRhZ5IfasDAwBGRRtlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAbAwJEewMKZoWQGFCEikiERwMKZoWypbnVtYmVyVGFnkiFswMDAEZFG2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIACcDAkSDAwpmhZAYUIySSIxHAwpmhbKlvYmplY3RUYWeSI27AwMARkUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAJwMCRIsDCmaFkBhQlJpIlEcDCmaFsqXJlZ2V4cFRhZ5IlcMDAwBGRRtlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAnAwJEkwMKZoWQGEScokicRwMKZoWymc2V0VGFnkidywMDAEZFG2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIABsDAkSbAwpmhZAYUKSqSKRHAwpmhbKlzdHJpbmdUYWeSKXTAwMARkUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAJwMCRKMDCmaFkBhUrwJIrEcDCmaFsqndlYWtNYXBUYWeSK3bAwMARkUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAKwMCRKsDCmKFnAQEtQ5DAwpmhZAQZLi+SLizAwpmhbK5hcnJheUJ1ZmZlclRhZ5IuXsDAwCyRRtlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAA7AwJEtwMKZoWQGFjAxkjAswMKZoWyrZGF0YVZpZXdUYWeSMGLAwMAskUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgALwMCRL8DCmaFkBhoyM5IyLMDCmaFsqmZsb2F0MzJUYWeSMkjAwMAskUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAKwMCRMcDCmaFkBho0NZI0LMDCmaFsqmZsb2F0NjRUYWeSNErAwMAskUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAKwMCRM8DCmaFkBhc2N5I2LMDCmaFsp2ludDhUYWeSNkzAwMAskUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAHwMCRNcDCmaFkBhg4OZI4LMDCmaFsqGludDE2VGFnkjhOwMDALJFG2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIACMDAkTfAwpmhZAYYOjuSOizAwpmhbKhpbnQzMlRhZ5I6UMDAwCyRRtlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAjAwJE5wMKZoWQGGDw9kjwswMKZoWyodWludDhUYWeSPFLAwMAskUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAIwMCRO8DCmaFkBh8+P5I+LMDCmaFsr3VpbnQ4Q2xhbXBlZFRhZ5I+VMDAwCyRRtlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAA/AwJE9wMKZoWQGGUBBkkAswMKZoWypdWludDE2VGFnkkBWwMDALJFG2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIACcDAkT/AwpmhZAYZQsCSQizAwpmhbKl1aW50MzJUYWeSQljAwMAskUbZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAJwMCRQcDCmKFnAQFERpDAwpmhZAQFRcCSRUPAwpmhbK50eXBlZEFycmF5VGFnc9wAGkVHSUtNT1FTVVdZW11fYWNlZ2lrbW9xc3V7wMDAQ5FG2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIADsDAkUTAwpihZwEKR3fcADBHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXbAw5ihcgAOwEiRRMDCmKFyAQrASZExwMKYoXIEDsBKkUTAwpihcgEKwEuRM8DCmKFyBA7ATJFEwMKYoXIBB8BNkTXAwpihcgQOwE6RRMDCmKFyAQjAT5E3wMKYoXIEDsBQkUTAwpihcgEIwFGROcDCmKFyBA7AUpFEwMKYoXIBCMBTkTvAwpihcgQOwFSRRMDCmKFyAQ/AVZE9wMKYoXIEDsBWkUTAwpihcgEJwFeRP8DCmKFyBA7AWJFEwMKYoXIBCcBZkUHAwpihcgoOwFqRRMDCmKFyAQfAW5ESwMKYoXIEDsBckUTAwpihcgEIwF2RFMDCmKFyBA7AXpFEwMKYoXIBDsBfkS3AwpihcgQOwGCRRMDCmKFyAQfAYZEWwMKYoXIEDsBikUTAwpihcgELwGORL8DCmKFyBA7AZJFEwMKYoXIBB8BlkRjAwpihcgQOwGaRRMDCmKFyAQjAZ5EawMKYoXIEDsBokUTAwpihcgEHwGmRHMDCmKFyBA7AapFEwMKYoXIBBsBrkR7AwpihcgQOwGyRRMDCmKFyAQnAbZEgwMKYoXIEDsBukUTAwpihcgEJwG+RIsDCmKFyBA7AcJFEwMKYoXIBCcBxkSTAwpihcgQOwHKRRMDCmKFyAQbAc5EmwMKYoXIEDsB0kUTAwpihcgEJwHWRKMDCmKFyBA7AdpFEwMKYoXIBCsDAkSrAwpmhZAELeMCWeXp7fHhEwMKZoWywYmFzZUlzVHlwZWRBcnJheZJ4zIrAwMDAkNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyCRDAeZF3wMKYoXITDMB6kQfAwpihcgsIwHuRBMDCmKFyFA7AfJFEwMKYoXIBCsDAkQHAwpehbwEAfsyLkMCYoWcAAX/Mg5DAwpmhZAQNzIDAlMyBzILMgH7AwpmhbLBub2RlSXNUeXBlZEFycmF5k8yAzIfMicDAwH6Q2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNUeXBlZEFycmF5LmpzmKFyABDAzIGRf8DCmKFyAwjAzIKRDcDCmKFyBAjAwJENwMKYoWcBAcyEwJDAwpmhZAQAzIXAlMyFzIPMhn/AwpmhbKxpc1R5cGVkQXJyYXmSzIXMjcDAwMyDkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzVHlwZWRBcnJheS5qc5ihcgAMwMyGkcyEwMKYoWcDAMyHwJTMh8yIzInMisDCmKFyABDAzIiRf8DCmKFyAwnAzImRCsDCmKFyARDAzIqRf8DCmKFyBBDAwJF3wMKYoWcBA8yMwJDAwpihZwkLzI3AkcyNwMKYoXIADMDAkcyEwMI=
====catalogjs annotation end====*/